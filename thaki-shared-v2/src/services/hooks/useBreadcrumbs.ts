import type { BreadcrumbItem } from '../../components/Breadcrumb/Breadcrumb';
import type { RouteRegistry, TabInfo, VirtualRoute } from '../../types';
import type { SwitchTabOptions } from '../providers/TabProvider/TabProvider';
import {
  buildCumulativePaths,
  formatSegmentLabel,
  getPathSegments,
  isHomePath,
} from '../utils/breadcrumbUtils';
import { extractParams, matchVirtualRoute } from '../utils/routingUtils';

interface Props {
  /** 패키지 루트 레이블 (예: 'Compute', 'IAM', 'MLOps') */
  rootLabel: string;
  /** 홈 경로 (예: '/home', '/', '/dashboard') */
  homePath: string;
  /** 패키지별 라우트 레지스트리 */
  routes: RouteRegistry<string>;
  /** 현재 활성화된 탭 */
  activeTab: TabInfo | null;
  /** 탭 내에서 경로 전환 함수 */
  switchTabToPath: (path: string, options?: SwitchTabOptions) => void;
  /** 동적 세그먼트 레이블 포맷터 (옵션) */
  formatDynamicLabel?: (context: DynamicBreadcrumbLabelContext) => string | undefined;
}

interface DynamicBreadcrumbLabelContext {
  segment: string;
  path: string;
  route: VirtualRoute<string>;
  isLast: boolean;
  isFirst: boolean;
  paramName: string | null;
  paramValue?: string;
  ancestorName?: string;
  defaultLabel: string;
}

/**
 * 동적 라우트 세그먼트에서 파라미터 이름 추출
 * 예: '/load-balancers/:loadBalancerId' -> 'loadBalancerId'
 */
const getParamNameFromSegment = (path: string, routePath: string): string | null => {
  const params = extractParams(path, routePath);
  const paramNames = Object.keys(params);
  // 마지막 파라미터가 일반적으로 현재 세그먼트의 파라미터
  return paramNames[paramNames.length - 1] || null;
};

/**
 * 다음 경로가 동적 세그먼트인지 확인
 * 중간 컬렉션 세그먼트(예: /listeners, /pools)를 스킵할지 결정에 사용
 */
const isNextSegmentDynamic = (
  paths: string[],
  currentIndex: number,
  routes: RouteRegistry<string>
): boolean => {
  const nextPath = paths[currentIndex + 1];
  if (!nextPath) return false;

  const nextRoute = routes[nextPath] || matchVirtualRoute(nextPath, routes);
  return Boolean(nextRoute?.path.includes(':'));
};

/**
 * 가상 라우팅 시스템을 기반으로 브레드크럼 데이터를 생성하는 훅
 *
 * ancestorNames를 통해 중간 세그먼트(부모 리소스)의 표시 이름을 지정할 수 있습니다.
 * loadingAncestors를 통해 로딩 중인 세그먼트에 스켈레톤을 표시합니다.
 *
 * 중첩 리소스 경로에서 중간 컬렉션 세그먼트(예: /listeners, /pools)는 스킵되어
 * `Load Balancers > {lb-name} > {listener-name} > {pool-name}` 형태로 표시됩니다.
 *
 * @example
 * ```tsx
 * const { activeTab, switchTabToPath } = useTabManager();
 * const breadcrumbs = useBreadcrumbs({
 *   rootLabel: 'Compute',
 *   homePath: '/home',
 *   routes: VIRTUAL_ROUTES,
 *   activeTab,
 *   switchTabToPath,
 * });
 * ```
 */
const useBreadcrumbs = ({
  rootLabel,
  homePath,
  routes,
  activeTab,
  switchTabToPath,
  formatDynamicLabel,
}: Props): BreadcrumbItem[] => {
  // 홈 경로인 경우 루트 레이블만 표시
  if (isHomePath(activeTab?.virtualPath, homePath)) {
    return [{ label: rootLabel }];
  }

  // activeTab이 null이 아님을 보장 (위에서 체크됨)
  const virtualPathWithQuery = activeTab!.virtualPath;
  // 쿼리 파라미터를 제거하고 경로만 추출
  const virtualPath = virtualPathWithQuery.split('?')[0];
  const segments = getPathSegments(virtualPath);
  const paths = buildCumulativePaths(segments);

  // ancestorNames와 loadingAncestors 참조
  const ancestorNames = activeTab?.ancestorNames;
  const loadingAncestors = activeTab?.loadingAncestors;

  // 홈 브레드크럼으로 시작
  const breadcrumbs: BreadcrumbItem[] = [
    { label: rootLabel, onClick: () => switchTabToPath(homePath) },
  ];

  // 각 경로에 대한 브레드크럼 생성
  paths.forEach((path, index) => {
    const segment = segments[index];
    const route = routes[path] || matchVirtualRoute(path, routes);
    const isLast = index === paths.length - 1;
    const isFirst = index === 0;

    // 레이블 및 로딩 상태 생성
    let label: string;
    let isLoading = false;

    if (!route) {
      // 라우트가 없는 세그먼트 (중간 컬렉션 경로)
      // 다음이 동적 세그먼트이면 스킵 (예: /load-balancers/:id/pools → "pools" 스킵)
      if (!isFirst && !isLast && isNextSegmentDynamic(paths, index, routes)) {
        return;
      }
      label = formatSegmentLabel(segment);
    } else if (route.path.includes(':')) {
      // 동적 라우트 (상세 페이지)
      const hasCustomTitle = isLast && activeTab?.title !== route.title;
      const params = extractParams(path, route.path);
      const paramName = getParamNameFromSegment(path, route.path);
      const paramValue = paramName ? params[paramName] : params.id;

      if (hasCustomTitle) {
        // 리소스 이름이 로드됨
        label = activeTab!.title;
      } else if (isLast) {
        // 마지막 세그먼트인데 아직 리소스 이름이 로드되지 않음 → 표시하지 않음
        return;
      } else {
        // 중간 세그먼트 (상위 경로)
        // ancestorNames에서 표시 이름 확인
        if (paramName && ancestorNames?.[paramName]) {
          label = ancestorNames[paramName];
        } else {
          // fallback: 파라미터 값(ID) 또는 라우트 제목 사용
          label = paramValue || route.title;
        }

        // 로딩 상태 확인
        if (paramName && loadingAncestors?.includes(paramName)) {
          isLoading = true;
        }
      }

      if (formatDynamicLabel) {
        const overrideLabel = formatDynamicLabel({
          segment,
          path,
          route,
          isLast,
          isFirst,
          paramName,
          paramValue,
          ancestorName: paramName ? ancestorNames?.[paramName] : undefined,
          defaultLabel: label,
        });

        if (overrideLabel !== undefined) {
          label = overrideLabel;
        }
      }
    } else {
      // 정적 라우트 (리스트 페이지)
      // 중간 컬렉션 세그먼트 스킵: 다음이 동적 세그먼트이고 첫 번째가 아니면 스킵
      // 예: /load-balancers/:id/listeners → "listeners" 스킵 (다음이 :listenerId)
      // 예: /load-balancers/:id/listeners/:id/pools → "pools" 스킵 (다음이 :poolId)
      if (!isFirst && !isLast && isNextSegmentDynamic(paths, index, routes)) {
        return; // 중간 컬렉션 세그먼트 스킵
      }
      label = route.title;
    }

    breadcrumbs.push({
      label,
      onClick: isLast ? undefined : () => switchTabToPath(path),
      isLoading,
    });
  });

  return breadcrumbs;
};

export default useBreadcrumbs;
