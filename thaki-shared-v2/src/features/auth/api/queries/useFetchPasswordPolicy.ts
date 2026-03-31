import { useQuery } from '@tanstack/react-query';
import type { PasswordPolicy } from '../../utils/passwordUtils';
import authClient from '../clients/authClient';

const URL = '/v1/iam/authn/pre-auth/password/policy';

interface FetchPasswordPolicyOptions {
  xSessionId?: string;
  resetToken?: string;
}

const fetchPasswordPolicy = async ({
  xSessionId,
  resetToken,
}: FetchPasswordPolicyOptions): Promise<PasswordPolicy> => {
  const { data } = await authClient.get<PasswordPolicy>(URL, {
    ...(resetToken
      ? { params: { token: resetToken } }
      : { headers: { 'X-Session-ID': xSessionId } }),
  });

  return data;
};

const useFetchPasswordPolicy = (options: FetchPasswordPolicyOptions) => {
  const { xSessionId, resetToken } = options;

  return useQuery({
    queryKey: ['passwordPolicy', xSessionId, resetToken],
    queryFn: () => fetchPasswordPolicy(options),
    enabled: Boolean(xSessionId) || Boolean(resetToken),
    // 로그인페이지에서 useAuth 훅을 사용할 때 401 에러가 발생하지 않도록 설정(이거 아니면 하얀 페이지로 튕김)
    throwOnError: false,
  });
};

export default useFetchPasswordPolicy;
