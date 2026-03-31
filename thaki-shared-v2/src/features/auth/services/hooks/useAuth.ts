import { useContext, useState } from 'react';
import { useCreateLogin, useCreateLogout } from '../../api/mutations';
import { LoginParams, LoginResponse } from '../../api/mutations/useCreateLogin';
import useCreateMfaCodeVerify from '../../api/mutations/useCreateMfaCodeVerify';
import useCreateMfaEmailVerify from '../../api/mutations/useCreateMfaEmailVerify';
import useCreateMfaOtpSetup from '../../api/mutations/useCreateMfaOtpSetup';
import useCreateMfaOtpSetupVerify from '../../api/mutations/useCreateMfaOtpSetupVerify';
import useFetchPasswordPolicy from '../../api/queries/useFetchPasswordPolicy';
import { AuthContext } from '../providers/AuthProvider/AuthProvider';

export type MfaMethod = 'otp' | 'email';
export type LoginStep = 'login' | 'mfaSelect' | 'otpSetup' | 'mfaVerify';

/**
 * @description `useAuth`는 인증 관련 비즈니스 로직을 모아 놓은 커스텀훅입니다.
 * 인증 관련 로직에 대한 수행은 이 훅만이 처리합니다.
 * 이 훅이 처리하는 작업은 다음과 같습니다.
 *
 * @returns login - 로그인 mutation 객체
 * @returns logout - 로그아웃 mutation 객체
 * @returns userData - 사용자 데이터
 */
interface UseAuthOptions {
  onLoginSuccess?: () => void;
  resetToken?: string;
}

const useAuth = (xSessionId: string = '', options?: UseAuthOptions) => {
  const login = useCreateLogin();
  const logout = useCreateLogout();
  const setupMfaOtp = useCreateMfaOtpSetup();

  const verifyMfaOtpSetup = useCreateMfaOtpSetupVerify();

  const requestMfaEmailCode = useCreateMfaEmailVerify();

  const verifyMfaCode = useCreateMfaCodeVerify();

  const userData = useContext(AuthContext);

  const passwordPolicy = useFetchPasswordPolicy({
    xSessionId,
    resetToken: options?.resetToken,
  });

  // --- Login Flow State ---

  /** Response from initial login attempt (contains MFA requirements) */
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);

  /** Current step in login flow */
  const [loginStep, setLoginStep] = useState<LoginStep>('login');

  /** User-selected MFA method (otp or email) */
  const [loginMfaMethod, setLoginMfaMethod] = useState<MfaMethod>('otp');

  // --- MFA Method Detection ---

  const availableMfaMethods = loginResponse?.availableMfaMethods ?? [];
  const availableMfaMethodTypes = new Set(availableMfaMethods.map((method) => method.type));

  /** User can choose between multiple MFA methods */
  const hasMultipleMfaMethods = availableMfaMethodTypes.size > 1;

  /** OTP (Authenticator) method details and enrollment status */
  const otpMethod = availableMfaMethods.find((method) => method.type === 'authenticator');

  const isOtpAndEnrolled = Boolean(otpMethod?.enrolled);

  const onClear = () => {
    /** Reset login flow to initial state */
    setLoginStep('login');
    setLoginMfaMethod('otp');
    setLoginResponse(null);
  };

  /** Routes login flow based on MFA requirements and available methods */
  const proceedLoginProcess = ({ mfaRequired, availableMfaMethods: methods }: LoginResponse) => {
    // If MFA not required, login succeeds immediately
    if (!mfaRequired) {
      options?.onLoginSuccess?.();
      return;
    }

    const [firstMethod] = methods;

    if (!firstMethod) {
      onClear();
      return;
    }

    const methodTypes = new Set(methods.map((method) => method.type));
    const preferredMethod = methodTypes.has('authenticator') ? 'otp' : 'email';

    setLoginMfaMethod(preferredMethod);

    // Multiple MFA methods → show selection screen
    if (methodTypes.size > 1) {
      setLoginStep('mfaSelect');
      return;
    }

    // Single MFA method → proceed directly
    const isOtp = firstMethod?.type === 'authenticator';
    const isFirstOtpAndEnrolled = Boolean(isOtp && firstMethod?.enrolled);

    if (isOtp) {
      setLoginMfaMethod('otp');
      // If OTP enrolled: verify directly; else: setup first
      setLoginStep(isFirstOtpAndEnrolled ? 'mfaVerify' : 'otpSetup');
      return;
    }

    // Non-OTP method (email) → go to verification
    setLoginMfaMethod('email');
    setLoginStep('mfaVerify');
  };

  const onLoginSubmit = (data: LoginParams): void => {
    // Submit credentials and handle response based on MFA requirements
    login.mutate(data, {
      onSuccess: (response) => {
        setLoginResponse(response);
        proceedLoginProcess(response);
      },
    });
  };

  const onMfaSelectNext = (): void => {
    // Route to appropriate next step based on selected MFA method
    if (loginMfaMethod === 'otp') {
      setLoginStep(isOtpAndEnrolled ? 'mfaVerify' : 'otpSetup');
    } else {
      setLoginStep('mfaVerify');
    }
  };

  const onOtpSetupNext = (): void => {
    // After OTP setup, proceed to verification
    setLoginStep('mfaVerify');
  };

  const onOtpSetupBack = (): void => {
    // Go back: if multiple methods available, show selection; else clear flow
    setLoginStep(hasMultipleMfaMethods ? 'mfaSelect' : 'login');
    if (!hasMultipleMfaMethods) onClear();
  };

  const onMfaVerifyBack = (): void => {
    // Navigate backward through flow
    if (hasMultipleMfaMethods) {
      setLoginStep('mfaSelect');
    } else if (loginMfaMethod === 'otp' && !isOtpAndEnrolled) {
      setLoginStep('otpSetup');
    } else {
      onClear();
    }
  };

  const onMfaVerify = (): void => {
    // After successful MFA verification, complete login
    options?.onLoginSuccess?.();
  };

  const mfaSessionId = loginResponse?.mfaSessionIdPending ?? loginResponse?.sessionId ?? '';

  return {
    login,
    logout,
    setupMfaOtp,
    verifyMfaCode,
    verifyMfaOtpSetup,
    requestMfaEmailCode,
    passwordPolicy,
    userData,
    mfaSessionId,
    isAdmin: true,
    // Login Flow Exports
    loginStep,
    loginMfaMethod,
    setLoginMfaMethod,
    loginResponse,
    availableMfaMethods,
    loginHandlers: {
      onLoginSubmit,
      onMfaSelectNext,
      onOtpSetupNext,
      onOtpSetupBack,
      onMfaVerifyBack,
      onMfaVerify,
      onClear,
    },
  };
};

export default useAuth;
