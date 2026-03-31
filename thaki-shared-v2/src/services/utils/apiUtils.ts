import { UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

/** HTTP methods supported in API requests */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API baseURL 정규화
 * - http(s) 스킴이면 그대로 사용
 * - 상대경로는 항상 '/'로 시작하도록 보정
 */
const normalizeApiBaseUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed === '/') return '/';

  const withoutTrailingSlash = trimmed.replace(/\/+$/, '');
  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }
  if (withoutTrailingSlash.startsWith('/')) {
    return withoutTrailingSlash;
  }
  return `/${withoutTrailingSlash}`;
};

/**
 * axios 클라이언트 생성 함수
 * @param baseURL 기본 URL
 * @param withCredentials 서버에 요청 시 쿠키 전송 여부
 * @param customHeaders 커스텀 헤더
 * @param beforeRequest 요청 전 인터셉터
 * @param onErrorBeforeRequest 요청 전 인터셉터 에러 핸들러
 * @param beforeResponse 응답 전 인터셉터
 * @param onErrorBeforeResponse 응답 전 인터셉터 에러 핸들러
 * @returns axios 클라이언트
 */
const createApiClient = ({
  baseURL,
  withCredentials = false,
  customHeaders,
  beforeRequest,
  onErrorBeforeRequest,
  beforeResponse,
  onErrorBeforeResponse,
}: {
  baseURL: string;
  withCredentials?: boolean;
  customHeaders?: Record<string, string>;
  beforeRequest?: Parameters<typeof axios.interceptors.request.use>[0];
  onErrorBeforeRequest?: Parameters<typeof axios.interceptors.request.use>[1];
  beforeResponse?: Parameters<typeof axios.interceptors.response.use>[0];
  onErrorBeforeResponse?: Parameters<typeof axios.interceptors.response.use>[1];
  enableQueue?: boolean;
}) => {
  const normalizedBaseUrl = normalizeApiBaseUrl(baseURL);

  // 기본 URL 및 헤더 설정
  const client = axios.create({
    baseURL: normalizedBaseUrl,
    withCredentials,
    headers: {
      ...(customHeaders || {}),
    },
  });

  client.interceptors.request.use(beforeRequest, onErrorBeforeRequest);

  // 응답 전 인터셉터 등록
  client.interceptors.response.use(beforeResponse, onErrorBeforeResponse);

  return client;
};

/** 401 에러인지 확인 */
const checkIsUnauthorizedError = (error: unknown): error is AxiosError => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401;
  }

  return false;
};

/** 404 에러인지 확인 */
const checkIsNotFoundError = (error: unknown): error is AxiosError => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 404;
  }

  return false;
};

const checkIsForbiddenError = (error: unknown): error is AxiosError => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 403;
  }

  return false;
};

/** 500 에러인지 확인 */
const checkIsInternalServerError = (error: unknown): error is AxiosError => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 500;
  }

  return false;
};

/** 재시도 가능한 에러인지 확인 */
const checkIsRetryableError = (error: unknown): error is AxiosError => {
  if (axios.isAxiosError(error)) {
    const { status = 0 } = error.response ?? {};

    return [400, 408, 429, 502, 503, 504].includes(status);
  }

  return false;
};

const filterBasicResponse: Parameters<typeof axios.interceptors.response.use>[0] = (response) => {
  if ('data' in response && response.data.result === undefined) {
    return response;
  }

  return { ...response, data: response.data.result };
};

/**
 * useQuery 등을 사용할 때, 잘못된 서버요청을 보내지 않기 위해 모든 파라미터를 truthy한지 여부를 계산하고 그 결과를 반환합니다.
 */
const checkIsEveryParameterValid = (params: Record<string, unknown>) =>
  Object.keys(params).every((key) => params[key] === 0 || Boolean(params[key]));

/**
 * useQuery 결과에서 데이터가 없을 경우, 기본 데이터를 반환합니다.
 * @param queryData useQuery 결과
 * @param fallbackData 기본 데이터
 * @returns useQuery 결과에서 데이터가 undefiened(쿼리키가 inactive하여 데이터가 없는 경우 또는 에러가 났을 때)일 경우, 기본 데이터를 반환합니다.
 */
const getResultOrWithFallback = <T, K>({
  queryResult,
  fallbackData,
}: {
  queryResult: UseQueryResult<T>;
  fallbackData: K;
}) => ({
  ...queryResult,
  data: !queryResult.data ? fallbackData : queryResult.data,
});

/**
 * 리프레시 토큰 재발급 후 인가된 토큰으로 이전 api 재요청 함수를 반환
 * @param client - 각 도메인 페키지의 api 클라이언트
 * @returns 리프레시 토큰 재발급 후 인가된 토큰으로 이전 api 재요청 함수
 */
const getRetryRequest = (client: AxiosInstance) => {
  return async (request: AxiosRequestConfig) => {
    {
      const method = request.method;
      const url = request.url;
      const data = request.data;
      const headers = request.headers;
      const paramsSerializer = request.paramsSerializer;
      // Preserve _retry flag to prevent infinite loop on 401 errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _retry = (request as any)._retry;

      if (!method || !url) {
        throw new Error('Invalid request: method and url are required');
      }

      // Build config with _retry flag preserved
      const baseConfig = { headers, _retry };

      // AxiosInstance does not have an index signature, so use switch
      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await client.get(url, {
            ...baseConfig,
            params: request.params,
            paramsSerializer,
          });
          break;
        case 'delete':
          response = await client.delete(url, { ...baseConfig, data });
          break;
        case 'post':
          response = await client.post(url, data, baseConfig);
          break;
        case 'put':
          response = await client.put(url, data, baseConfig);
          break;
        case 'patch':
          response = await client.patch(url, data, baseConfig);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      return response;
    }
  };
};

interface SessionExpiredOptions {
  offToast?: boolean;
}

/**
 * 세션 만료 커스텀 이벤트를 발생시킵니다.
 * 로컬스토리지 클리어 등 예외 상황에서 graceful하게 로그인 화면으로 이동시킵니다.
 * @param source - 이벤트 발생 소스 (예: 'iam', 'compute', 'container')
 * @param options - 옵션 (offToast: true면 토스트 메시지 표시 안 함)
 */
const dispatchSessionExpired = (source: string, options?: SessionExpiredOptions): void => {
  window.dispatchEvent(
    new CustomEvent('auth:session-expired', {
      detail: { source, ...options },
    })
  );
};

/**
 * 로그인 에러의 HTTP 상태 코드를 추출합니다.
 * @param error - 에러 객체
 * @returns HTTP 상태 코드 또는 undefined
 */
const getLoginErrorStatus = (error: Error | null): number | undefined => {
  if (!axios.isAxiosError(error)) return undefined;

  return error.response?.status;
};

export {
  checkIsEveryParameterValid,
  checkIsForbiddenError,
  checkIsInternalServerError,
  checkIsNotFoundError,
  checkIsRetryableError,
  checkIsUnauthorizedError,
  createApiClient,
  dispatchSessionExpired,
  filterBasicResponse,
  getLoginErrorStatus,
  getResultOrWithFallback,
  getRetryRequest,
  normalizeApiBaseUrl,
};
