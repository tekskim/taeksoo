import { AxiosError } from 'axios';
import authClient from '../clients/authClient';

interface Response {
  accessToken: string;
  refreshTokenRef: string;
  expiresIn: number;
  tokenType: 'Bearer';
  sessionId: string;
}

interface Params {
  refreshTokenRef: string;
}

const URL = '/v1/iam/authn/token/refresh';

/**
 * @description 리프레시 토큰 재발급
 * @param params 리프레시 토큰 재발급 요청 파라미터
 *
 * @returns 리프레시 토큰 재발급 결과
 */
const createRefreshToken = async (params?: Params) => {
  try {
    const { data } = await authClient.post<Response>(URL, params);
    return data;
  } catch (error) {
    // 리프레시 API가 400, 422(토큰이 아예 없는 경우 서버에서 주는 상태 코드)을 반환해도 세션 만료 케이스로 간주해
    // RouterProvider의 unauthorized(401) 분기에서 일관되게 처리되도록 401로 변환한다.
    if (
      error instanceof AxiosError &&
      (error.response?.status === 400 || error.response?.status === 422)
    ) {
      error.response.status = 401;
    }

    throw error;
  }
};

export default createRefreshToken;
