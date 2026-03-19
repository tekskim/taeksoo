import type { BreadcrumbItem } from '../../components/Breadcrumb/Breadcrumb';
import type { RouteRegistry, TabInfo } from '../../types';
import type { SwitchTabOptions } from '../providers/TabProvider/TabProvider';
import useBreadcrumbs from './useBreadcrumbs';

/**
 * 브레드크럼 훅 팩토리 설정
 */
export interface CreateBreadcrumbsHookConfig {
  /** 패키지 루트 레이블 (예: 'Compute', 'IAM', 'MLOps') */
  rootLabel: string;
  /** 홈 경로 (예: '/home', '/', '/dashboard') */
  homePath: string;
  /** 패키지별 라우트 레지스트리 */
  routes: RouteRegistry<string>;
  /** 앱별 useTabManager 훅 */
  useTabManager: () => {
    activeTab: TabInfo | null;
    switchTabToPath: (path: string, options?: SwitchTabOptions) => void;
  };
  /**
   * 브레드크럼에서 제거할 앞쪽 세그먼트 수
   * - 0: 제거 없음 (루트 레이블 포함)
   * - 1: 루트 레이블만 제거 (Storage, Compute 패턴)
   * - 2: 루트 + 경로 접두사 제거 (IAM 패턴: /iam/users → Users)
   * @default 1
   */
  sliceCount?: number;
  /** 홈 경로일 때 표시할 레이블 @default 'Dashboard' */
  homeLabel?: string;
}

/**
 * 앱별 브레드크럼 훅을 생성하는 팩토리 함수
 *
 * 단순한 앱(IAM, Storage, UserSettings)은 이 팩토리로 생성하고,
 * 복잡한 로직이 필요한 앱(Compute의 NavigationGuard, Container의 클러스터 로직)은
 * 직접 useBreadcrumbs를 사용합니다.
 *
 * @example
 * ```tsx
 * // packages/iam/src/services/hooks/useIamBreadcrumbs.ts
 * import { createBreadcrumbsHook } from '@thaki/shared';
 * import VIRTUAL_ROUTES from '../../routes/registry';
 * import { useTabManager } from '../contexts/TabManagerContext';
 *
 * export const useIamBreadcrumbs = createBreadcrumbsHook({
 *   rootLabel: 'IAM',
 *   homePath: '/iam/dashboard',
 *   routes: VIRTUAL_ROUTES,
 *   useTabManager,
 *   sliceCount: 2,  // IAM > Iam > Users → Users
 * });
 * ```
 */
const createBreadcrumbsHook = ({
  rootLabel,
  homePath,
  routes,
  useTabManager,
  sliceCount = 1,
  homeLabel = 'Dashboard',
}: CreateBreadcrumbsHookConfig): (() => BreadcrumbItem[]) => {
  return function useAppBreadcrumbs(): BreadcrumbItem[] {
    const { activeTab, switchTabToPath } = useTabManager();

    const breadcrumbs = useBreadcrumbs({
      rootLabel,
      homePath,
      routes,
      activeTab,
      switchTabToPath,
    });

    // 홈 경로가 아닌 경우 지정된 수만큼 앞쪽 세그먼트 제거
    if (breadcrumbs.length > sliceCount) {
      return breadcrumbs.slice(sliceCount);
    }

    // 홈 경로인 경우 홈 레이블 표시
    return [{ label: homeLabel }];
  };
};

export default createBreadcrumbsHook;
