import {
  MutationCache,
  QueryCache,
  type QueryClientConfig,
} from '@tanstack/react-query';

import {
  checkIsForbiddenError,
  checkIsNotFoundError,
  checkIsRetryableError,
  checkIsUnauthorizedError,
  type HttpMethod,
} from './apiUtils';
import { showToastWithNotification } from './toastUtils';

export type { HttpMethod };

/**
 * Toast function types for mutation meta
 * Note: Functions may return undefined to skip toast display
 */
type SuccessToastFn<TData = unknown> = (
  data: TData,
  variables: unknown,
  context: unknown
) => ToastType | undefined;

type ErrorToastFn = (
  error: Error,
  variables: unknown,
  context: unknown
) => ToastType | undefined;

type NavigateFn = (data: unknown) => void;

/**
 * Mutation meta shape - function-based toast values
 * Used to customize mutation toast notifications
 */
type MutationMeta = {
  /** Function to generate success toast from mutation result */
  success?: SuccessToastFn;
  /** Function to generate error toast from mutation error */
  error?: ErrorToastFn;
  /** Optional navigation callback attached to success toast */
  onNavigate?: NavigateFn;
  /** Skip error toast display */
  silentOnError?: boolean;
};

/** Axios response/error shape with config */
type AxiosLike = {
  config?: { method?: string };
  response?: { data?: { message?: string } };
};

const HTTP_METHODS: Readonly<HttpMethod[]> = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Extracts error message from API error response
 */
const extractErrorDescription = (error: unknown): string | undefined =>
  (error as AxiosLike)?.response?.data?.message;

/**
 * Extracts HTTP method from axios config (works for both response and error)
 * @returns Uppercase HTTP method or undefined if not found
 */
const extractHttpMethod = (source: unknown): HttpMethod | undefined => {
  const method = (source as AxiosLike)?.config?.method?.toUpperCase();

  if (method && HTTP_METHODS.includes(method as HttpMethod)) {
    return method as HttpMethod;
  }

  return undefined;
};

type CacheFactoryOptions = {
  /** Callback to show a toast notification (injected from UI layer) */
  showToast: (content: ToastType) => void;
  /** Function to get the remote app ref (for AppFrame focus detection) */
  getRemoteAppRef: () => HTMLDivElement | null;
};

/**
 * Creates a QueryCache with integrated toast notifications
 *
 * Handles:
 * - Success toasts via query.meta.success
 * - Error toasts (unless query.meta.silentOnError is true)
 */
export const createQueryCache = ({
  showToast,
  getRemoteAppRef,
}: CacheFactoryOptions): QueryCache =>
  new QueryCache({
    onSuccess: (_data, query) => {
      const successToast = query.meta?.success as ToastType | undefined;

      showToastWithNotification({
        toastContent: successToast,
        httpMethod: 'GET',
        isSuccess: true,
        remoteAppRef: getRemoteAppRef(),
        showToast,
      });
    },
    onError: (error, query) => {
      if (query.meta?.silentOnError) {
        return;
      }

      const errorToast = query.meta?.error as ToastType | undefined;

      showToastWithNotification({
        toastContent: errorToast,
        httpMethod: 'GET',
        isSuccess: false,
        errorDescription: extractErrorDescription(error),
        remoteAppRef: getRemoteAppRef(),
        showToast,
      });
    },
  });

/**
 * Extracts success toast from mutation meta
 * Handles both the success function call and optional onNavigate binding
 */
const extractSuccessToast = (
  meta: MutationMeta | undefined,
  data: unknown,
  variables: unknown,
  context: unknown
): ToastType | undefined => {
  const toast = meta?.success?.(data, variables, context);

  if (!toast) {
    return undefined;
  }

  // Attach onNavigate if provided in meta
  if (meta?.onNavigate) {
    return { ...toast, onNavigate: () => meta.onNavigate?.(data) };
  }

  return toast;
};

/**
 * Extracts error toast from mutation meta
 */
const extractErrorToast = (
  meta: MutationMeta | undefined,
  error: Error,
  variables: unknown,
  context: unknown
): ToastType | undefined => meta?.error?.(error, variables, context);

/**
 * Creates a MutationCache with integrated toast notifications
 *
 * Handles:
 * - Success toasts via mutation.meta.success (must be a function)
 * - Error toasts via mutation.meta.error (must be a function, unless mutation.meta.silentOnError is true)
 */
export const createMutationCache = ({
  showToast,
  getRemoteAppRef,
}: CacheFactoryOptions): MutationCache =>
  new MutationCache({
    onSuccess: (data, variables, context, mutation) => {
      showToastWithNotification({
        toastContent: extractSuccessToast(
          mutation.meta,
          data,
          variables,
          context
        ),
        isSuccess: true,
        remoteAppRef: getRemoteAppRef(),
        showToast,
      });
    },
    onError: (error, variables, context, mutation) => {
      if (mutation.meta?.silentOnError) {
        return;
      }

      showToastWithNotification({
        toastContent: extractErrorToast(
          mutation.meta,
          error,
          variables,
          context
        ),
        httpMethod: extractHttpMethod(error),
        isSuccess: false,
        errorDescription: extractErrorDescription(error),
        remoteAppRef: getRemoteAppRef(),
        showToast,
      });
    },
  });

type QueryClientConfigOptions = CacheFactoryOptions & {
  /** Override default query options */
  defaultQueryOptions?: Partial<
    NonNullable<QueryClientConfig['defaultOptions']>['queries']
  >;
  /** Override default mutation options */
  defaultMutationOptions?: Partial<
    NonNullable<QueryClientConfig['defaultOptions']>['mutations']
  >;
};

/**
 * Creates a complete QueryClientConfig with toast integration and sensible defaults
 *
 * Features:
 * - Automatic toast notifications for query/mutation success and errors
 * - AppFrame focus detection for MFE environments
 * - Sensible retry logic (no retry on 401/403)
 * - Configurable default query options
 *
 * @example
 * import { toast } from 'sonner';
 * import { createQueryClientConfig, Toast } from '@thaki/shared';
 *
 * // Create showToast callback in UI layer
 * const showToast = (content: ToastType) => {
 *   toast.custom(
 *     id => <Toast {...content} handleDismiss={() => toast.dismiss(id)} />,
 *     { toasterId: frameId }
 *   );
 * };
 *
 * // Pass to factory
 * const config = createQueryClientConfig({
 *   showToast,
 *   getRemoteAppRef: () => remoteAppRef.current,
 * });
 *
 * const queryClient = new QueryClient(config);
 */
export const createQueryClientConfig = ({
  showToast,
  getRemoteAppRef,
  defaultQueryOptions,
  defaultMutationOptions,
}: QueryClientConfigOptions): QueryClientConfig => ({
  queryCache: createQueryCache({ showToast, getRemoteAppRef }),
  mutationCache: createMutationCache({ showToast, getRemoteAppRef }),
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 10 * 60 * 1000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      retryOnMount: true,
      throwOnError: error =>
        checkIsUnauthorizedError(error) ||
        checkIsForbiddenError(error) ||
        checkIsNotFoundError(error),
      retry: (failureCount, error) => {
        if (checkIsRetryableError(error)) {
          return failureCount < 3;
        }

        return false;
      },
      ...defaultQueryOptions,
    },
    mutations: {
      throwOnError: error => checkIsUnauthorizedError(error),
      ...defaultMutationOptions,
    },
  },
});
