import { useMutation } from '@tanstack/react-query';
import authClient from '../clients/authClient';

type Request = {
  newPassword: string;
  xSessionId?: string;
  token?: string;
};

type Response = {
  success: boolean;
};

const URL = '/v1/iam/authn/pre-auth/password/change';

const updatePassword = async ({ newPassword, xSessionId, token }: Request) => {
  const { data } = await authClient.put<Response>(
    URL,
    { newPassword },
    {
      ...(token ? { params: { token } } : { headers: { 'X-Session-ID': xSessionId } }),
    }
  );

  return data;
};

const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};

export default useUpdatePassword;
export type { Request as UpdatePasswordRequest, Response as UpdatePasswordResponse };
