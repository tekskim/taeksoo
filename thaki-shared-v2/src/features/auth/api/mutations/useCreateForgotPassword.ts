import { useMutation } from '@tanstack/react-query';
import authClient from '../clients/authClient';

/**
 * 비밀번호 찾기 요청 (Public Endpoint)
 *
 * 로그인하지 않은 상태에서 이메일로 비밀번호 초기화 링크를 요청합니다.
 * 보안을 위해 이메일 존재 여부와 관계없이 동일한 응답을 반환합니다.
 */
type ForgotPasswordRequest = {
  /** 비밀번호를 초기화할 계정의 이메일 */
  email: string;
  /** 조직 ID */
  orgId: string;
};

type PasswordResetRequestResponse = {
  /** 응답 메시지 */
  message: string;
};

type ForgotPasswordResponse = {
  /** 응답 메시지 */
  message?: string | null;
  /** 응답 생성 시간 */
  timestamp?: string;
  /** 요청 식별자 */
  requestId: string;
  /** 결과 데이터 */
  result: PasswordResetRequestResponse;
};

const URL = '/v1/iam/authn/password/forgot';

const createForgotPassword = async (
  params: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const { data } = await authClient.post<ForgotPasswordResponse>(URL, params);

  return data;
};

const useCreateForgotPassword = () => {
  return useMutation({
    mutationFn: createForgotPassword,
    meta: {
      silentOnError: true,
    },
  });
};

export default useCreateForgotPassword;
export type { ForgotPasswordRequest, ForgotPasswordResponse };
