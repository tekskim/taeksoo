import type { RouteRegistry, TabInfo, VirtualRoute } from '../../../types/routing';

/**
 * 탭별 네비게이션 히스토리 엔트리
 */
export interface TabHistoryEntry {
  path: string;
  title: string;
  componentName: string;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
}

/**
 * 탭별 네비게이션 히스토리 상태
 */
export interface TabHistoryState {
  /** 방문 경로 스택 */
  stack: TabHistoryEntry[];
  /** 현재 위치 인덱스 (0 = 가장 최근) */
  pointer: number;
}

/**
 * TabProvider 설정 인터페이스
 */
export interface TabProviderConfig<TComponentName = string> {
  routes: RouteRegistry<TComponentName>;
  sessionKey?: string;
  defaultRoute: string;
  defaultTitle: string;
  /**
   * 모든 탭이 닫혔을 때 호출되는 콜백
   * @example
   * // 데스크톱: 창 닫기
   * onAllTabsClosed: () => window.close()
   */
  onAllTabsClosed?: () => void;
  /**
   * 히스토리 스택 최대 크기 (기본값: 50)
   */
  maxHistorySize?: number;
}

/**
 * switchTabToPath 옵션
 */
export interface SwitchTabOptions {
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  title?: string;
}

/**
 * Tab State (useReducer용)
 */
export interface TabState<TComponentName = string> {
  tabs: TabInfo<TComponentName>[];
  activeTabId: string;
}

/**
 * Tab Actions
 */
export type TabAction<TComponentName = string> =
  | {
      type: 'SET_TABS';
      payload: { tabs: TabInfo<TComponentName>[]; activeTabId: string };
    }
  | { type: 'ADD_TAB'; payload: TabInfo<TComponentName> }
  | { type: 'CLOSE_TAB'; payload: string }
  | { type: 'SWITCH_TAB'; payload: string }
  | {
      type: 'UPDATE_TAB_PATH';
      payload: {
        tabId: string;
        path: string;
        title: string;
        componentName: TComponentName;
        params: Record<string, unknown>;
        query: Record<string, unknown>;
      };
    }
  | {
      type: 'UPDATE_TAB_QUERY';
      payload: { tabId: string; query: Record<string, unknown> };
    }
  | { type: 'REORDER_TABS'; payload: { fromIndex: number; toIndex: number } }
  | {
      type: 'UPDATE_TAB_TITLE';
      payload: { tabId: string; title: string };
    }
  | {
      type: 'UPDATE_TAB_ANCESTORS';
      payload: {
        tabId: string;
        ancestorNames?: Record<string, string>;
        loadingAncestors?: string[];
      };
    };

/**
 * Tab Manager Context 타입
 */
export interface TabManagerContextType<TComponentName = string> {
  tabs: TabInfo<TComponentName>[];
  activeTabId: string;
  activeTab: TabInfo<TComponentName> | null;
  addTab: (
    route: VirtualRoute<TComponentName>,
    params?: Record<string, unknown>,
    query?: Record<string, unknown>
  ) => string;
  closeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  switchTabToPath: (path: string, options?: SwitchTabOptions) => void;
  updateActiveTabQuery: (query: Record<string, unknown>) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  /**
   * 현재 활성 탭의 제목 업데이트 (브레드크럼 동기화용)
   * @param title - 새로운 탭 제목 (리소스 이름)
   */
  updateActiveTabTitle: (title: string) => void;
  /**
   * 특정 탭의 제목 업데이트
   * @param tabId - 탭 ID
   * @param title - 새로운 탭 제목 (리소스 이름)
   */
  updateTabTitle: (tabId: string, title: string) => void;
  /**
   * 탭의 ancestor 이름 업데이트 (브레드크럼 중간 세그먼트용)
   * @param tabId - 탭 ID
   * @param ancestorNames - URL 파라미터 이름 → 표시 이름 맵 (예: { loadBalancerId: 'my-lb' })
   * @param loadingAncestors - 로딩 중인 ancestor 파라미터 키 목록
   */
  updateTabAncestors: (
    tabId: string,
    ancestorNames?: Record<string, string>,
    loadingAncestors?: string[]
  ) => void;
  /**
   * 현재 활성 탭에서 뒤로가기 가능 여부
   */
  canGoBack: boolean;
  /**
   * 현재 활성 탭에서 앞으로가기 가능 여부
   */
  canGoForward: boolean;
  /**
   * 현재 활성 탭에서 뒤로가기
   */
  goBack: () => void;
  /**
   * 현재 활성 탭에서 앞으로가기
   */
  goForward: () => void;
}

/**
 * TabProvider Props
 */
export interface TabProviderProps {
  children: React.ReactNode;
}
