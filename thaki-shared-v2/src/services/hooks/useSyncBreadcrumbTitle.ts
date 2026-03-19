import { useEffect } from 'react';

/**
 * useSyncBreadcrumbTitle 훅 팩토리
 *
 * 상세 페이지에서 리소스 이름이 로드되면 탭 제목을 업데이트하여
 * 브레드크럼에 ID 대신 리소스 이름이 표시되도록 합니다.
 *
 * @param useTabManager - 앱별 useTabManager 훅
 * @returns useSyncBreadcrumbTitle 훅
 *
 * @example
 * ```tsx
 * // 1. 각 앱에서 훅 생성 (TabManagerContext.ts)
 * import { createTabProvider, createUseSyncBreadcrumbTitle } from '@thaki/shared';
 *
 * export const { TabProvider, useTabManager } = createTabProvider({ ... });
 * export const useSyncBreadcrumbTitle = createUseSyncBreadcrumbTitle(useTabManager);
 *
 * // 2. 상세 페이지에서 사용
 * const InstanceDetailPage = ({ id }) => {
 *   const { data } = useFetchInstanceDetail(id);
 *
 *   useSyncBreadcrumbTitle(data?.name);  // 한 줄로 브레드크럼 동기화
 *
 *   return <div>...</div>;
 * };
 * ```
 */
const createUseSyncBreadcrumbTitle = (
  useTabManager: () => { updateActiveTabTitle: (title: string) => void }
): ((resourceName: string | undefined) => void) => {
  return function useSyncBreadcrumbTitle(
    resourceName: string | undefined
  ): void {
    const { updateActiveTabTitle } = useTabManager();

    useEffect(() => {
      if (resourceName) {
        updateActiveTabTitle(resourceName);
      }
    }, [resourceName, updateActiveTabTitle]);
  };
};

export default createUseSyncBreadcrumbTitle;
