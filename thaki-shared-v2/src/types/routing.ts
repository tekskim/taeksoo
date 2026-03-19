/**
 * 가상 라우트 인터페이스 (제네릭)
 * 각 앱은 자신의 컴포넌트 타입을 지정할 수 있음
 */
export interface VirtualRoute<TComponentName = string> {
  path: string;
  component: TComponentName;
  title: string;
  domain?: string;
  [key: string]: unknown;
}

/**
 * 라우트 레지스트리 타입
 * path를 키로 하는 VirtualRoute 맵
 */
export interface RouteRegistry<TComponentName = string> {
  [path: string]: VirtualRoute<TComponentName>;
}

/**
 * 컴포넌트 로더 타입
 * 각 앱은 자신의 컴포넌트 동적 로드 함수를 제공
 */
export interface ComponentLoader<TProps = Record<string, unknown>> {
  [componentName: string]: () => Promise<{
    default: React.ComponentType<TProps>;
  }>;
}

/**
 * 라우트 해석 결과
 */
export interface ResolvedRoute<TComponentName = string> {
  componentName: TComponentName;
  params: Record<string, string>;
  route: VirtualRoute<TComponentName>;
}

/**
 * 탭 정보 인터페이스
 */
export interface TabInfo<TComponentName = string> {
  id: string;
  title: string;
  virtualPath: string;
  componentName: TComponentName;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  scrollPosition?: number;
  componentState?: unknown;
  /**
   * 브레드크럼에서 중간 세그먼트(부모 리소스)의 표시 이름
   * 키: URL 파라미터 이름 (예: 'loadBalancerId'), 값: 표시 이름 (예: 'my-lb')
   */
  ancestorNames?: Record<string, string>;
  /**
   * 로딩 중인 ancestor 파라미터 키 목록
   * 브레드크럼에서 스켈레톤 표시에 사용
   */
  loadingAncestors?: string[];
}

/**
 * 탭 세션 (localStorage 저장용)
 */
export interface TabSession<TComponentName = string> {
  tabs: TabInfo<TComponentName>[];
  activeTabId: string;
}
