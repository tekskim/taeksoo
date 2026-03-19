import { useMutation } from '@tanstack/react-query';
import authClient from '../clients/authClient';

type Response = {
  success: boolean;
};

const URL = '/v1/iam/authn/pre-auth/mfa/email/request-code';

const createMfaEmailVerify = async (xSessionId: string) => {
  const { data } = await authClient.post<Response>(URL, undefined, {
    headers: {
      'X-Session-ID': xSessionId,
    },
  });

  return data;
};

const useCreateMfaEmailVerify = () => {
  return useMutation({
    mutationFn: createMfaEmailVerify,
    throwOnError: false,
  });
};

export default useCreateMfaEmailVerify;
export type { Response as MfaEmailVerifyResponse };
