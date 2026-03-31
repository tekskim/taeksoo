import { useMutation } from '@tanstack/react-query';
import authClient from '../clients/authClient';

/**
 * 비밀번호 재설정 완료 요청 (Public Endpoint)
 *
 * 토큰 검증 후 새 비밀번호를 설정합니다.
 *
 * 프로세스:
 * 1. 토큰 검증
 * 2. 비밀번호 정책 검증
 * 3. Keycloak 비밀번호 업데이트
 * 4. 비밀번호 히스토리 저장
 * 5. IAM DB에 force_password_change=false 설정
 * 6. 토큰 삭제 (1회용)
 */
type CompletePasswordResetRequest = {
  /** 비밀번호 초기화 토큰 */
  token: string;
  /** 새 비밀번호 */
  newPassword: string;
};

type PasswordResetRequestResponse = {
  /** 응답 메시지 */
  message: string;
};

type CompletePasswordResetResponse = {
  /** 응답 메시지 */
  message?: string | null;
  /** 응답 생성 시간 */
  timestamp?: string;
  /** 요청 식별자 */
  requestId: string;
  /** 결과 데이터 */
  result: PasswordResetRequestResponse;
};

const URL = '/v1/iam/authn/password/reset';

const completePasswordReset = async (
  params: CompletePasswordResetRequest
): Promise<CompletePasswordResetResponse> => {
  const { data } = await authClient.put<CompletePasswordResetResponse>(URL, params);

  return data;
};

const useCompletePasswordReset = () => {
  return useMutation({
    mutationFn: completePasswordReset,
    meta: {
      silentOnError: true,
    },
  });
};

export default useCompletePasswordReset;
export type { CompletePasswordResetRequest, CompletePasswordResetResponse };
