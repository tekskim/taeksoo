import { useMutation } from '@tanstack/react-query';
import authClient from '../clients/authClient';

type Response = {
  success: boolean;
  mfaEnabled: boolean;
  method: 'authenticator';
};

const URL = '/v1/iam/authn/pre-auth/mfa/totp/verify-setup';

const verifyMfaOtpSetup = async ({ code, xSessionId }: { code: string; xSessionId: string }) => {
  const { data } = await authClient.post<Response>(
    URL,
    {
      code,
    },
    {
      headers: {
        'X-Session-ID': xSessionId,
      },
    }
  );

  return data;
};

const useCreateMfaOtpSetupVerify = () => {
  return useMutation({
    mutationFn: verifyMfaOtpSetup,
    throwOnError: false,
  });
};

export default useCreateMfaOtpSetupVerify;
