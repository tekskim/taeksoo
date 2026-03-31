import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useCurrentTabId } from './useCurrentTabId';

export type TabQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'queryKey' | 'refetchInterval'
> & {
  queryKey: TQueryKey;
  refetchInterval?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>['refetchInterval'];
};

/**
 * useTabQuery 훅 팩토리
 *
 * Tab-aware wrapper around TanStack Query's useQuery.
 *
 * Why:
 * - Our TabContainer keeps inactive tabs mounted, so queries in inactive tabs can still run.
 * - Using global activeTabId directly in queryKey can mix caches across tabs when switching.
 *
 * Behavior:
 * - Prefixes queryKey with the "current tab id" (falls back to activeTabId when outside tab context).
 * - Disables query execution and polling when the tab is inactive.
 *
 * @param useTabManager - 앱별 useTabManager 훅
 * @returns useTabQuery 훅
 *
 * @example
 * ```tsx
 * // 1. 각 앱에서 훅 생성 (TabManagerContext.ts)
 * import { createUseTabQuery } from '@thaki/shared';
 *
 * export const useTabQuery = createUseTabQuery(useTabManager);
 *
 * // 2. API query hooks에서 사용
 * export const useFetchInstances = () => {
 *   return useTabQuery({
 *     queryKey: ['/api/instances'],
 *     queryFn: () => fetchInstances(),
 *   });
 * };
 * ```
 */
export const createUseTabQuery = (
  useTabManager: () => { activeTabId: string }
): (<TQueryFnData, TError = Error, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  options: TabQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) => UseQueryResult<TData, TError>) => {
  return function useTabQuery<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: TabQueryOptions<TQueryFnData, TError, TData, TQueryKey>
  ): UseQueryResult<TData, TError> {
    const currentTabId = useCurrentTabId();
    const { activeTabId } = useTabManager();

    const tabId = currentTabId ?? activeTabId ?? 'global';
    const isActiveTab = currentTabId ? currentTabId === activeTabId : true;

    const enabled = Boolean(options.enabled ?? true) && isActiveTab;

    const queryKey = [tabId, ...options.queryKey] as QueryKey;
    const refetchInterval = !isActiveTab ? false : options.refetchInterval;

    return useQuery<TData, TError>({
      ...options,
      enabled,
      queryKey,
      refetchInterval,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  };
};

export default createUseTabQuery;
