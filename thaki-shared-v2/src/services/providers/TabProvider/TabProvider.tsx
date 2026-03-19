import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type { TabInfo, TabSession, VirtualRoute } from '../../../types/routing';
import {
  areQueryRecordsEqual,
  parseQueryString,
  serializeQuery,
} from '../../utils/queryStringUtils';
import { extractParams, matchVirtualRoute } from '../../utils/routingUtils';
import type {
  SwitchTabOptions,
  TabAction,
  TabHistoryEntry,
  TabHistoryState,
  TabManagerContextType,
  TabProviderConfig,
  TabProviderProps,
  TabState,
} from './types';

/** 히스토리 포함 세션 타입 */
interface TabSessionWithHistory<TComponentName = string>
  extends TabSession<TComponentName> {
  tabHistories?: Record<string, TabHistoryState>;
}

/** 히스토리 스택 기본 최대 크기 */
const DEFAULT_MAX_HISTORY_SIZE = 50;

function createTabReducer<TComponentName = string>() {
  return function tabReducer(
    state: TabState<TComponentName>,
    action: TabAction<TComponentName>
  ): TabState<TComponentName> {
    switch (action.type) {
      case 'SET_TABS':
        return {
          tabs: action.payload.tabs,
          activeTabId: action.payload.activeTabId,
        };

      case 'ADD_TAB':
        return {
          tabs: [...state.tabs, action.payload],
          activeTabId: action.payload.id,
        };

      case 'CLOSE_TAB': {
        const tabId = action.payload;
        const currentIndex = state.tabs.findIndex(t => t.id === tabId);
        const remainingTabs = state.tabs.filter(t => t.id !== tabId);

        // 탭이 모두 제거되면 빈 상태 반환 (onAllTabsClosed가 별도 호출됨)
        if (remainingTabs.length === 0) {
          return { tabs: [], activeTabId: '' };
        }

        // 닫는 탭이 활성 탭이 아니면 activeTabId 유지
        if (state.activeTabId !== tabId) {
          return { ...state, tabs: remainingTabs };
        }

        // 다음 활성 탭 결정 (현재 위치의 다음 탭, 없으면 마지막 탭)
        const nextActiveId =
          currentIndex < remainingTabs.length
            ? remainingTabs[currentIndex].id
            : remainingTabs[remainingTabs.length - 1].id;

        return {
          tabs: remainingTabs,
          activeTabId: nextActiveId,
        };
      }

      case 'SWITCH_TAB': {
        const tabId = action.payload;
        // 탭 존재 여부 확인
        if (!state.tabs.find(t => t.id === tabId)) {
          return state;
        }

        return {
          ...state,
          activeTabId: tabId,
        };
      }

      case 'UPDATE_TAB_PATH': {
        const { tabId, path, title, componentName, params, query } =
          action.payload;
        let hasChanged = false;

        const updatedTabs = state.tabs.map(tab => {
          // 대상 탭이 아니면 그대로 반환
          if (tab.id !== tabId) return tab;

          // 5가지 필드 중 하나라도 변경되었는지 확인
          // - virtualPath, title, componentName (원시 값 비교)
          // - params, query (깊은 비교)
          const hasNoChanges =
            tab.virtualPath === path &&
            tab.title === title &&
            tab.componentName === componentName &&
            JSON.stringify(tab.params) === JSON.stringify(params) &&
            JSON.stringify(tab.query) === JSON.stringify(query);

          // 변경사항 없으면 기존 tab 객체 반환 (참조 유지 → 리렌더링 방지)
          if (hasNoChanges) {
            return tab;
          }

          // 하나라도 변경되었으면 새 tab 객체 생성
          hasChanged = true;
          return {
            ...tab,
            virtualPath: path,
            title,
            componentName,
            params,
            query,
          };
        });

        // 변경사항 없으면 state 그대로 반환 (참조 유지 → 리렌더링 방지)
        return hasChanged ? { ...state, tabs: updatedTabs } : state;
      }

      case 'UPDATE_TAB_QUERY': {
        const { tabId, query } = action.payload;
        let hasChanged = false;

        const updatedTabs = state.tabs.map(tab => {
          // 대상 탭이 아니면 그대로 반환
          if (tab.id !== tabId) return tab;

          // 1. 현재 경로에서 쿼리 파라미터 제거 (/images?tab=private → /images)
          const pathWithoutQuery = tab.virtualPath.split('?')[0];

          // 2. 기존 쿼리와 새 쿼리 병합 (기존 유지하면서 업데이트/추가)
          // 예: { tab: 'private', page: '1' } + { filter: 'active' }
          //  → { tab: 'private', page: '1', filter: 'active' }
          const baseQuery = tab.query || {};
          const mergedQuery = { ...baseQuery, ...query };

          // 3. 실제 변경 여부 확인 (깊은 비교)
          const isQueryChanged = !areQueryRecordsEqual(baseQuery, mergedQuery);

          // 변경사항 없으면 기존 tab 객체 그대로 반환 (참조 유지 → 리렌더링 방지)
          if (!isQueryChanged) {
            return tab;
          }

          // 4. 병합된 쿼리를 안정적으로(stable) 문자열화
          const queryString = serializeQuery(mergedQuery);

          // 5. 새로운 virtualPath 생성
          // 쿼리 있으면: /images?tab=private&filter=active
          // 쿼리 없으면: /images
          const newPath = queryString
            ? `${pathWithoutQuery}?${queryString}`
            : pathWithoutQuery;

          hasChanged = true;
          return {
            ...tab,
            query: mergedQuery, // 병합된 쿼리 객체
            virtualPath: newPath, // 쿼리가 포함된 전체 경로
          };
        });

        // 변경사항 없으면 state 그대로 반환 (참조 유지 → 리렌더링 방지)
        return hasChanged ? { ...state, tabs: updatedTabs } : state;
      }

      case 'REORDER_TABS': {
        const { fromIndex, toIndex } = action.payload;
        if (fromIndex === toIndex) return state;

        const newTabs = [...state.tabs];
        const [movedTab] = newTabs.splice(fromIndex, 1);
        newTabs.splice(toIndex, 0, movedTab);

        return { ...state, tabs: newTabs };
      }

      case 'UPDATE_TAB_TITLE': {
        const { tabId, title } = action.payload;
        let hasChanged = false;

        const updatedTabs = state.tabs.map(tab => {
          if (tab.id !== tabId) return tab;

          // 제목이 동일하면 변경 없음
          if (tab.title === title) {
            return tab;
          }

          hasChanged = true;
          return {
            ...tab,
            title,
          };
        });

        return hasChanged ? { ...state, tabs: updatedTabs } : state;
      }

      case 'UPDATE_TAB_ANCESTORS': {
        const { tabId, ancestorNames, loadingAncestors } = action.payload;
        let hasChanged = false;

        const updatedTabs = state.tabs.map(tab => {
          if (tab.id !== tabId) return tab;

          // 변경 여부 확인
          const isSameAncestorNames =
            JSON.stringify(tab.ancestorNames) ===
            JSON.stringify(ancestorNames);
          const isSameLoadingAncestors =
            JSON.stringify(tab.loadingAncestors) ===
            JSON.stringify(loadingAncestors);

          if (isSameAncestorNames && isSameLoadingAncestors) {
            return tab;
          }

          hasChanged = true;
          return {
            ...tab,
            ancestorNames,
            loadingAncestors,
          };
        });

        return hasChanged ? { ...state, tabs: updatedTabs } : state;
      }

      default:
        return state;
    }
  };
}

/**
 * TabProvider 팩토리 함수
 *
 * 가상 탭 시스템을 생성합니다. 각 앱은 자신의 라우트와 컴포넌트 타입을 주입하여 사용합니다.
 * 브라우저 탭처럼 동작하는 가상 탭을 관리하며, sessionStorage로 상태를 영속화합니다.
 */
const createTabProvider = <TComponentName = string,>(
  config: TabProviderConfig<TComponentName>
) => {
  const {
    routes,
    sessionKey = 'app-tab-session',
    defaultRoute,
    defaultTitle,
    onAllTabsClosed,
    maxHistorySize = DEFAULT_MAX_HISTORY_SIZE,
  } = config;

  const TabManagerContext =
    createContext<TabManagerContextType<TComponentName> | null>(null);

  const tabReducer = createTabReducer<TComponentName>();

  const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
    // useReducer로 tabs와 activeTabId를 하나의 상태로 관리
    const [state, dispatch] = useReducer(tabReducer, {
      tabs: [],
      activeTabId: '',
    });

    const { tabs, activeTabId } = state;
    const [isInitialized, setIsInitialized] = useState(false);

    // 탭별 히스토리 상태 관리
    const [tabHistories, setTabHistories] = useState<
      Map<string, TabHistoryState>
    >(new Map());

    // goBack/goForward 중인지 추적 (히스토리 중복 push 방지)
    const isNavigatingRef = useRef(false);

    // 유니크한 탭 ID 생성 (timestamp + 랜덤 문자열)
    const generateTabId = useCallback((): string => {
      return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    const createDefaultTab = useCallback((): void => {
      const tabId = generateTabId();
      const route = routes[defaultRoute];

      if (!route) {
        console.error(`Default route not found: ${defaultRoute}`);
        return;
      }

      const newTab: TabInfo<TComponentName> = {
        id: tabId,
        title: route.title || defaultTitle,
        virtualPath: defaultRoute,
        componentName: route.component,
        params: {},
        query: {},
      };

      // 히스토리 초기화
      const initialHistoryEntry: TabHistoryEntry = {
        path: defaultRoute,
        title: route.title || defaultTitle,
        componentName: route.component as string,
        params: {},
        query: {},
      };
      setTabHistories(prev => {
        const next = new Map(prev);
        next.set(tabId, { stack: [initialHistoryEntry], pointer: 0 });
        return next;
      });

      dispatch({
        type: 'SET_TABS',
        payload: { tabs: [newTab], activeTabId: tabId },
      });
    }, [generateTabId]);

    // sessionStorage에서 이전 탭 세션 복원
    const restoreSessionTabs = useCallback((): boolean => {
      const savedSession = sessionStorage.getItem(sessionKey);
      if (!savedSession) return false;

      try {
        const session: TabSessionWithHistory<TComponentName> =
          JSON.parse(savedSession);
        dispatch({
          type: 'SET_TABS',
          payload: { tabs: session.tabs, activeTabId: session.activeTabId },
        });

        // 히스토리 복원
        if (session.tabHistories) {
          const restoredHistories = new Map<string, TabHistoryState>();
          Object.entries(session.tabHistories).forEach(([tabId, history]) => {
            restoredHistories.set(tabId, history);
          });
          setTabHistories(restoredHistories);
        }

        return true;
      } catch (error) {
        console.error('Failed to restore tab session:', error);
        return false;
      }
    }, []);

    // 탭 상태를 sessionStorage에 저장
    const saveSessionTabs = useCallback(() => {
      if (tabs.length === 0) return;

      // 현재 존재하는 탭 ID Set 생성
      const existingTabIds = new Set(tabs.map(t => t.id));

      // 히스토리를 직렬화 가능한 형태로 변환 (현재 존재하는 탭만)
      const tabHistoriesObj: Record<string, TabHistoryState> = {};
      tabHistories.forEach((history, tabId) => {
        // 현재 tabs에 존재하는 탭의 히스토리만 저장
        if (existingTabIds.has(tabId)) {
          tabHistoriesObj[tabId] = history;
        }
      });

      const session: TabSessionWithHistory<TComponentName> = {
        tabs,
        activeTabId,
        tabHistories: tabHistoriesObj,
      };
      sessionStorage.setItem(sessionKey, JSON.stringify(session));
    }, [tabs, activeTabId, tabHistories]);

    const getActiveVirtualPath = useCallback((): string => {
      if (tabs.length === 0) {
        return '';
      }

      const activeTab = tabs.find(tab => tab.id === activeTabId) ?? tabs[0];
      return activeTab?.virtualPath ?? '';
    }, [tabs, activeTabId]);

    /**
     * Notify the host (Desktop AppBar, etc.) immediately about active tab route changes.
     * Note: sessionStorage persistence is debounced; this event is the real-time signal.
     */
    useEffect(() => {
      if (typeof window === 'undefined') {
        return;
      }

      if (tabs.length === 0) {
        return;
      }

      const activeVirtualPath = getActiveVirtualPath();
      window.dispatchEvent(
        new CustomEvent('thaki:tab-session-update', {
          detail: {
            sessionKey,
            activeTabId,
            activeVirtualPath,
          },
        })
      );
    }, [tabs, activeTabId, getActiveVirtualPath]);

    // 초기 마운트 시 세션 복원 또는 기본 탭 생성
    useEffect(() => {
      const restored = restoreSessionTabs();
      if (!restored) {
        createDefaultTab();
      }
      setIsInitialized(true);
    }, [restoreSessionTabs, createDefaultTab]);

    // 모든 탭이 닫혔을 때 콜백 호출 (초기화 이후에만)
    useEffect(() => {
      if (isInitialized && tabs.length === 0 && onAllTabsClosed) {
        onAllTabsClosed();
      }
    }, [tabs.length, isInitialized]);

    // 세션 저장을 debounce 처리 (과도한 I/O 방지 - 500ms 대기 후 저장)
    // 모든 탭이 닫히면 sessionStorage를 명시적으로 제거
    useEffect(() => {
      // 모든 탭이 닫힌 경우: sessionStorage 정리
      if (tabs.length === 0) {
        sessionStorage.removeItem(sessionKey);
        return;
      }

      const timeoutId = setTimeout(() => {
        saveSessionTabs();
      }, 500);

      return () => clearTimeout(timeoutId);
    }, [tabs, activeTabId, saveSessionTabs]);

    /**
     * 새 탭 추가
     * @returns 생성된 탭의 ID
     */
    const addTab = useCallback(
      (
        route: VirtualRoute<TComponentName>,
        params?: Record<string, unknown>,
        query?: Record<string, unknown>
      ): string => {
        const tabId = generateTabId();
        const componentName = route.component;

        // (중요) switchTabToPath와 동일하게 query를 먼저 분리한 뒤 라우팅/params 추출 수행
        // - route.path가 "실제 경로 + query" 형태여도 params 추출이 깨지지 않도록 함
        const [pathWithoutQuery, rawQueryString] = route.path.split('?');

        // virtualPath에 포함된 query를 기본으로 하고, 명시적으로 전달된 query 인자를 우선 적용
        const queryFromPath = parseQueryString(rawQueryString) as Record<
          string,
          unknown
        >;
        const mergedQuery: Record<string, unknown> = {
          ...queryFromPath,
          ...(query || {}),
        };

        // 라우트 매칭/params 추출은 반드시 "query 제거된 path" 기준으로 수행
        const matchedRoute =
          routes[pathWithoutQuery] ||
          matchVirtualRoute(pathWithoutQuery, routes);

        const extractedParams: Record<string, unknown> =
          matchedRoute && matchedRoute.path.includes(':')
            ? (extractParams(pathWithoutQuery, matchedRoute.path) as Record<
                string,
                unknown
              >)
            : {};

        // 명시적으로 전달된 params 인자를 우선 적용 (override)
        const mergedParams: Record<string, unknown> = {
          ...extractedParams,
          ...(params || {}),
        };

        // 실제 param 값이 포함된 경로 생성
        // - 입력이 패턴 경로인 경우에만 치환
        // - 입력이 이미 실제 경로면 그대로 사용
        let resolvedPath: string;
        if (pathWithoutQuery.includes(':')) {
          resolvedPath = pathWithoutQuery;
          Object.entries(mergedParams).forEach(([key, value]) => {
            resolvedPath = resolvedPath.replace(
              `:${key}`,
              encodeURIComponent(String(value ?? ''))
            );
          });
        } else {
          resolvedPath = pathWithoutQuery;
        }

        const queryString = serializeQuery(mergedQuery);
        const fullPath = queryString
          ? `${resolvedPath}?${queryString}`
          : resolvedPath;

        const newTab: TabInfo<TComponentName> = {
          id: tabId,
          title: route.title,
          virtualPath: fullPath,
          componentName,
          params: mergedParams,
          query: mergedQuery,
        };

        // 히스토리 초기화
        const initialHistoryEntry: TabHistoryEntry = {
          path: fullPath,
          title: route.title,
          componentName: componentName as string,
          params: mergedParams,
          query: mergedQuery,
        };
        setTabHistories(prev => {
          const next = new Map(prev);
          next.set(tabId, { stack: [initialHistoryEntry], pointer: 0 });
          return next;
        });

        dispatch({ type: 'ADD_TAB', payload: newTab });

        return tabId;
      },
      [generateTabId]
    );

    /**
     * 탭 닫기
     * - 마지막 탭인 경우: 기본 탭 생성 (useEffect에서 처리)
     * - 활성 탭 닫는 경우: 다음 탭으로 자동 전환
     */
    const closeTab = useCallback((tabId: string): void => {
      // 히스토리 정리
      setTabHistories(prev => {
        const next = new Map(prev);
        next.delete(tabId);
        return next;
      });

      dispatch({ type: 'CLOSE_TAB', payload: tabId });
    }, []);

    /**
     * 탭 전환 (UI에서 탭 클릭 시)
     * - 활성 탭 변경
     * - 마지막 방문 시간 업데이트
     */
    const switchTab = useCallback((tabId: string): void => {
      dispatch({ type: 'SWITCH_TAB', payload: tabId });
    }, []);

    const pushTabHistoryEntry = useCallback(
      (tabId: string, entry: TabHistoryEntry): void => {
        // 히스토리 중복 push 방지 (goBack/goForward 중)
        if (isNavigatingRef.current) return;

        setTabHistories(prev => {
          const history = prev.get(tabId);
          if (!history) return prev;

          const currentEntry = history.stack[history.pointer];
          // 현재 위치와 동일한 경로면 스킵
          if (currentEntry && currentEntry.path === entry.path) {
            return prev;
          }

          // 앞으로가기 히스토리 제거 (포인터 앞의 항목들)
          const newStack = history.stack.slice(history.pointer);
          newStack.unshift(entry);

          // 최대 크기 제한
          if (newStack.length > maxHistorySize) {
            newStack.pop();
          }

          const next = new Map(prev);
          next.set(tabId, { stack: newStack, pointer: 0 });
          return next;
        });
      },
      []
    );

    /**
     * 현재 활성 탭의 경로 변경 (탭 내 네비게이션)
     *
     * @example switchTabToPath('/instances/123')
     * @example switchTabToPath('/images?tab=private')
     *
     * 최적화:
     * - reducer에서 변경사항 확인 후 참조 유지
     */
    const switchTabToPath = useCallback(
      (path: string, options: SwitchTabOptions = {}): void => {
        if (!activeTabId) return;

        // 1. 쿼리 파라미터 파싱
        const [pathWithoutQuery, queryString] = path.split('?');
        const parsedQuery = parseQueryString(queryString) as Record<
          string,
          unknown
        >;

        // 2. 라우트 매칭
        const route =
          routes[pathWithoutQuery] ||
          matchVirtualRoute(pathWithoutQuery, routes);

        if (!route) {
          console.error(`Route not found for path: ${pathWithoutQuery}`);
          return;
        }

        // 3. URL 파라미터 추출
        const routeParams = route.path.includes(':')
          ? extractParams(pathWithoutQuery, route.path)
          : {};

        const mergedParams = {
          ...routeParams,
          ...(options.params || {}),
        };

        const mergedQuery = {
          ...parsedQuery,
          ...(options.query || {}),
        };

        // 4. 실제 param 값이 포함된 경로 생성
        // 전략: 입력 path가 이미 실제 경로(`:` 없음)면 그대로 사용,
        //       패턴 경로(`:` 있음)면 param으로 치환
        let resolvedPath: string;

        if (pathWithoutQuery.includes(':')) {
          // 입력 path가 패턴 형태일 때만 치환
          // 예: '/instances/:id' → '/instances/123'
          resolvedPath = pathWithoutQuery;
          Object.entries(mergedParams).forEach(([key, value]) => {
            resolvedPath = resolvedPath.replace(
              `:${key}`,
              encodeURIComponent(String(value ?? ''))
            );
          });
        } else {
          // 입력 path가 이미 실제 경로면 그대로 사용
          // 예: '/instances/123' → '/instances/123'
          resolvedPath = pathWithoutQuery;
        }

        // 쿼리 문자열 재구성 (mergedQuery 기준)
        const resolvedQueryString = serializeQuery(mergedQuery);
        const fullPath = resolvedQueryString
          ? `${resolvedPath}?${resolvedQueryString}`
          : resolvedPath;

        // 기본적으로 route.title 사용, 명시적 title 옵션이 있으면 그것을 사용
        // 상세 페이지에서는 useSyncBreadcrumbTitle로 리소스 이름 로드 후 타이틀 덮어씌움
        const newTitle = options.title ?? route.title;

        pushTabHistoryEntry(activeTabId, {
          path: fullPath,
          title: newTitle,
          componentName: route.component as string,
          params: mergedParams,
          query: mergedQuery,
        });

        dispatch({
          type: 'UPDATE_TAB_PATH',
          payload: {
            tabId: activeTabId,
            path: fullPath,
            title: newTitle,
            componentName: route.component,
            params: mergedParams,
            query: mergedQuery,
          },
        });
      },
      [activeTabId, pushTabHistoryEntry]
    );

    /**
     * 현재 활성 탭의 쿼리 파라미터 업데이트
     *
     * @example updateActiveTabQuery({ tab: 'private' })
     * → /images?tab=private
     */
    const updateActiveTabQuery = useCallback(
      (query: Record<string, unknown>): void => {
        if (!activeTabId) return;

        // 현재 활성 탭 정보 가져오기
        const currentTab = tabs.find(t => t.id === activeTabId);
        if (!currentTab) return;

        // 기존 쿼리와 새 쿼리 병합
        const baseQuery = currentTab.query || {};
        const mergedQuery = { ...baseQuery, ...query };

        // 변경 여부 확인
        const isQueryChanged = !areQueryRecordsEqual(baseQuery, mergedQuery);
        if (!isQueryChanged) return;

        // 새로운 경로 생성 (쿼리 포함)
        const pathWithoutQuery = currentTab.virtualPath.split('?')[0];
        const queryString = serializeQuery(mergedQuery);
        const newPath = queryString
          ? `${pathWithoutQuery}?${queryString}`
          : pathWithoutQuery;

        pushTabHistoryEntry(activeTabId, {
          path: newPath,
          title: currentTab.title,
          componentName: currentTab.componentName as string,
          params: currentTab.params || {},
          query: mergedQuery,
        });

        dispatch({
          type: 'UPDATE_TAB_QUERY',
          payload: { tabId: activeTabId, query },
        });
      },
      [activeTabId, tabs, pushTabHistoryEntry]
    );

    /**
     * 탭 순서 변경 (드래그 앤 드롭)
     */
    const reorderTabs = useCallback(
      (fromIndex: number, toIndex: number): void => {
        dispatch({
          type: 'REORDER_TABS',
          payload: { fromIndex, toIndex },
        });
      },
      []
    );

    /**
     * 현재 활성 탭의 제목 업데이트 (브레드크럼 동기화용)
     *
     * @example updateActiveTabTitle('My Web Server')
     * → 브레드크럼에서 ID 대신 리소스 이름 표시
     */
    const updateActiveTabTitle = useCallback(
      (title: string): void => {
        if (!activeTabId) return;

        dispatch({
          type: 'UPDATE_TAB_TITLE',
          payload: { tabId: activeTabId, title },
        });
      },
      [activeTabId]
    );

    /**
     * 특정 탭의 제목 업데이트
     *
     * @param tabId - 업데이트할 탭의 ID
     * @param title - 새로운 탭 제목 (리소스 이름)
     */
    const updateTabTitle = useCallback((tabId: string, title: string): void => {
      if (!tabId) return;

      dispatch({
        type: 'UPDATE_TAB_TITLE',
        payload: { tabId, title },
      });
    }, []);

    /**
     * 탭의 ancestor 이름 업데이트 (브레드크럼 중간 세그먼트용)
     *
     * @param tabId - 업데이트할 탭의 ID
     * @param ancestorNames - URL 파라미터 이름 → 표시 이름 맵
     * @param loadingAncestors - 로딩 중인 ancestor 파라미터 키 목록
     */
    const updateTabAncestors = useCallback(
      (
        tabId: string,
        ancestorNames?: Record<string, string>,
        loadingAncestors?: string[]
      ): void => {
        if (!tabId) return;

        dispatch({
          type: 'UPDATE_TAB_ANCESTORS',
          payload: { tabId, ancestorNames, loadingAncestors },
        });
      },
      []
    );

    // 현재 활성 탭의 히스토리 상태
    const activeTabHistory = useMemo(
      () => tabHistories.get(activeTabId),
      [tabHistories, activeTabId]
    );

    // 뒤로가기 가능 여부 (포인터가 스택 끝보다 앞에 있으면 가능)
    const canGoBack = useMemo(() => {
      if (!activeTabHistory) return false;
      return activeTabHistory.pointer < activeTabHistory.stack.length - 1;
    }, [activeTabHistory]);

    // 앞으로가기 가능 여부 (포인터가 0보다 크면 가능)
    const canGoForward = useMemo(() => {
      if (!activeTabHistory) return false;
      return activeTabHistory.pointer > 0;
    }, [activeTabHistory]);

    /**
     * 현재 활성 탭에서 뒤로가기
     */
    const goBack = useCallback((): void => {
      if (!activeTabId || !canGoBack) return;

      const history = tabHistories.get(activeTabId);
      if (!history) return;

      const newPointer = history.pointer + 1;
      const targetEntry = history.stack[newPointer];

      if (!targetEntry) return;

      // 히스토리 포인터 업데이트
      setTabHistories(prev => {
        const next = new Map(prev);
        next.set(activeTabId, { ...history, pointer: newPointer });
        return next;
      });

      // 네비게이션 플래그 설정 (히스토리 중복 push 방지)
      isNavigatingRef.current = true;

      // 탭 경로 업데이트
      dispatch({
        type: 'UPDATE_TAB_PATH',
        payload: {
          tabId: activeTabId,
          path: targetEntry.path,
          title: targetEntry.title,
          componentName: targetEntry.componentName as TComponentName,
          params: targetEntry.params,
          query: targetEntry.query,
        },
      });

      // 다음 틱에서 플래그 해제
      requestAnimationFrame(() => {
        isNavigatingRef.current = false;
      });
    }, [activeTabId, canGoBack, tabHistories]);

    /**
     * 현재 활성 탭에서 앞으로가기
     */
    const goForward = useCallback((): void => {
      if (!activeTabId || !canGoForward) return;

      const history = tabHistories.get(activeTabId);
      if (!history) return;

      const newPointer = history.pointer - 1;
      const targetEntry = history.stack[newPointer];

      if (!targetEntry) return;

      // 히스토리 포인터 업데이트
      setTabHistories(prev => {
        const next = new Map(prev);
        next.set(activeTabId, { ...history, pointer: newPointer });
        return next;
      });

      // 네비게이션 플래그 설정 (히스토리 중복 push 방지)
      isNavigatingRef.current = true;

      // 탭 경로 업데이트
      dispatch({
        type: 'UPDATE_TAB_PATH',
        payload: {
          tabId: activeTabId,
          path: targetEntry.path,
          title: targetEntry.title,
          componentName: targetEntry.componentName as TComponentName,
          params: targetEntry.params,
          query: targetEntry.query,
        },
      });

      // 다음 틱에서 플래그 해제
      requestAnimationFrame(() => {
        isNavigatingRef.current = false;
      });
    }, [activeTabId, canGoForward, tabHistories]);

    // 현재 활성화된 탭 정보 (useMemo로 캐싱)
    const activeTab = useMemo(
      () => tabs.find(tab => tab.id === activeTabId) || null,
      [tabs, activeTabId]
    );

    return (
      <TabManagerContext.Provider
        value={{
          tabs,
          activeTabId,
          activeTab,
          addTab,
          closeTab,
          switchTab,
          switchTabToPath,
          updateActiveTabQuery,
          reorderTabs,
          updateActiveTabTitle,
          updateTabTitle,
          updateTabAncestors,
          canGoBack,
          canGoForward,
          goBack,
          goForward,
        }}
      >
        {children}
      </TabManagerContext.Provider>
    );
  };

  const useTabManager = (): TabManagerContextType<TComponentName> => {
    const context = useContext(TabManagerContext);
    if (!context) {
      throw new Error('useTabManager must be used within a TabProvider');
    }
    return context;
  };

  return {
    TabProvider,
    useTabManager,
  };
};

export type {
  SwitchTabOptions,
  TabAction,
  TabManagerContextType,
  TabProviderConfig,
  TabProviderProps,
  TabState,
} from './types';
export { createTabProvider };
