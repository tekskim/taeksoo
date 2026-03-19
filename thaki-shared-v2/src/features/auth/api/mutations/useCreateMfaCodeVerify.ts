import { useMutation } from '@tanstack/react-query';
import { setToStorage } from '../../../../services/utils';
import authClient from '../clients/authClient';

const URL = '/v1/iam/authn/pre-auth/mfa/verify';

type Response = {
  verified: boolean;
  accessToken: string;
  refreshTokenRef: string;
  tokenType: 'Bearer';
  expiresIn: number;
  sessionId: string;
  userTpn: string;
  forcePasswordChange: boolean;
  remainingAttempts: number | null;
};

const verifyMfaCode = async ({
  code,
  method,
  xSessionId,
}: {
  xSessionId: string;
  code: string;
  method: 'authenticator' | 'email';
}) => {
  const { data } = await authClient.post<Response>(
    URL,
    {
      code,
      method,
    },
    {
      headers: {
        'X-Session-ID': xSessionId,
      },
    }
  );

  return data;
};

const useCreateMfaCodeVerify = () => {
  return useMutation({
    mutationFn: verifyMfaCode,
    onSuccess: ({ accessToken, refreshTokenRef }) => {
      setToStorage(
        { tokenType: 'access_token', token: accessToken },
        { tokenType: 'refresh_token_ref', token: refreshTokenRef }
      );
    },
    throwOnError: false,
  });
};

export default useCreateMfaCodeVerify;
