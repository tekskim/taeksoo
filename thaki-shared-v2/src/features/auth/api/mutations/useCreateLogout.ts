import { useMutation } from "@tanstack/react-query";
import authClient from "../clients/authClient";
import { removeFromStorage } from "../../../..";

interface Response {
  success: boolean;
}

const URL = "/v1/iam/authn/logout";

const logout = async (accessToken?: string) => {
  const { data } = await authClient.post<Response>(URL, { accessToken });

  return data;
};

const useCreateLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      removeFromStorage("access_token", "refresh_token_ref");
    },
    throwOnError: false,
    meta: {
      silentOnError: true,
    },
  });
};

export default useCreateLogout;
export type { Response as LogoutResponse };
