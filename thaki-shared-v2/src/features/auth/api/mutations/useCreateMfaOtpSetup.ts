import { useMutation } from '@tanstack/react-query';
import authClient from '../clients/authClient';

type Response = {
  qrCodeBase64: string;
  secret: string;
  provisioningUri: string;
};

const URL = '/v1/iam/authn/pre-auth/mfa/totp/setup';

const createMfaOtpSetup = async (xSessionId: string) => {
  const { data } = await authClient.post<Response>(URL, undefined, {
    headers: {
      'X-Session-ID': xSessionId,
    },
  });

  return data;
};

const useCreateMfaOtpSetup = () => {
  return useMutation({
    mutationFn: createMfaOtpSetup,
    throwOnError: false,
  });
};

export default useCreateMfaOtpSetup;
export type { Response as MfaOtpSetupResponse };
