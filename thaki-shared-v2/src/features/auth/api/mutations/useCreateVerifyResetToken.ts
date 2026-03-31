import { useMutation } from '@tanstack/react-query';
import authClient from '../clients/authClient';

/**
 * 비밀번호 초기화 토큰 검증 요청 (Public Endpoint)
 *
 * 이메일 링크를 통해 전달받은 토큰의 유효성을 검증합니다.
 */
type VerifyResetTokenRequest = {
  /** 비밀번호 초기화 토큰 */
  token: string;
};

type VerifyResetTokenResult = {
  /** 토큰 유효 여부 */
  valid: boolean;
  /** 마스킹된 이메일 (예: abc***@example.com) */
  email?: string | null;
  /** 토큰 만료 시간 (UTC) */
  expiresAt?: string | null;
};

const URL = '/v1/iam/authn/password/reset/verify';

const createVerifyResetToken = async (
  params: VerifyResetTokenRequest
): Promise<VerifyResetTokenResult> => {
  const { data } = await authClient.post<VerifyResetTokenResult>(URL, params);

  return data;
};

const useCreateVerifyResetToken = () => {
  return useMutation({
    mutationFn: createVerifyResetToken,
    meta: {
      silentOnError: true,
    },
  });
};

export default useCreateVerifyResetToken;
export type { VerifyResetTokenRequest, VerifyResetTokenResult };
