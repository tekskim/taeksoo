import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import authClient from '../clients/authClient';
import { setToStorage } from '../../../..';

interface Response {
  accessToken: string;
  refreshTokenRef: string;
  expiresIn: number;
  tokenType: string;
  sessionId: string;
  userTpn: string;
  forcePasswordChange: boolean;
  mfaRequired: boolean;
  availableMfaMethods: {
    type: 'email' | 'authenticator';
    enrolled: boolean;
  }[];
  mfaSessionIdPending: string;
}
interface Params {
  username: string;
  password: string;
}

const URL = '/v1/iam/authn/login';

const login = async (params: Params) => {
  const { data } = await authClient.post<Response>(URL, params);

  return data;
};

const useCreateLogin = () => {
  return useMutation<Response, AxiosError, Params>({
    mutationFn: login,
    onSuccess: ({ accessToken, refreshTokenRef }) => {
      setToStorage(
        { tokenType: 'access_token', token: accessToken },
        { tokenType: 'refresh_token_ref', token: refreshTokenRef }
      );
    },
    meta: {
      silentOnError: true,
    },
    throwOnError: false,
  });
};

export default useCreateLogin;
export type { Params as LoginParams, Response as LoginResponse };
