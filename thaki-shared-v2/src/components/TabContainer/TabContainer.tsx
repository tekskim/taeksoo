import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CurrentTabIdProvider } from '../../services/providers/CurrentTabIdProvider';
import { OverlayProvider } from '../../services/providers/OverlayProvider';
import createOverlayStore, { type OverlayStoreApi } from '../../services/stores/overlayStore';
import {
  checkIsForbiddenError,
  checkIsInternalServerError,
  checkIsNotFoundError,
  checkIsUnauthorizedError,
} from '../../services/utils/apiUtils';
import { cn } from '../../services/utils/cn';
import { resolveVirtualRoute } from '../../services/utils/routingUtils';
import type { ResolvedRoute, RouteRegistry } from '../../types/routing';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';

import { useQueryClient } from '@tanstack/react-query';
import { Error403, Error404, Error500 } from '../Error';
import OverlayContainer from '../Overlay/Overlay.Container';
import {
  errorStyles,
  tabContainerRootStyles,
  tabContainerStyles,
  tabContentStyles,
} from './TabContainer.styles';

interface TabContainerConfig<TComponentName extends string = string> {
  routes: RouteRegistry<TComponentName>;
  componentLoaders: Record<
    TComponentName,
    () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>
  >;
}
interface TabContentProps<TComponentName extends string = string> {
  tabId: string;
  virtualPath: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  isActive: boolean;
  config: TabContainerConfig<TComponentName>;
  goBack: () => void;
  switchTabToPath: (path: string) => void;
}

type RenderedContent = {
  component: React.ComponentType<Record<string, unknown>> | null;
  key: string;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
};

const ERROR_MAP = { 403: Error403, 404: Error404, 500: Error500 } as const;

type TabContentError = {
  status?: keyof typeof ERROR_MAP;
  reason?: string;
} | null;

const TabContent = <TComponentName extends string>({
  tabId,
  virtualPath,
  params,
  query,
  isActive,
  config,
  goBack,
  switchTabToPath,
}: TabContentProps<TComponentName>): React.ReactElement => {
  /** 각 탭별 보유한 오버레이 스토어 인스턴스 */
  const [overlayStore] = useState<OverlayStoreApi>(createOverlayStore);

  // 오버레이 클린업 함수
  const closeAllOverlays = useCallback(() => {
    const state = overlayStore.getState();
    state.overlays.forEach((overlay) => {
      overlay.reject();
      state.closeOverlayById(overlay.id);
    });
  }, [overlayStore]);

  // 탭 삭제 시 오버레이 클린업 이펙트
  useEffect(() => {
    return () => {
      closeAllOverlays();
    };
  }, [closeAllOverlays]);

  const [error, setError] = useState<TabContentError>(null);
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const [renderedContent, setRenderedContent] = useState<RenderedContent>({
    component: null,
    key: '',
    params: {},
    query: {},
  });

  /**
   * IMPORTANT:
   * props가 undefined일 때 default 파라미터로 `{}`를 생성하면 렌더마다 새로운 객체가 만들어져
   * loadComponent 콜백이 매 렌더마다 바뀌고(useEffect가 반복 실행) "Maximum update depth exceeded"를 유발할 수 있습니다.
   */
  const stableParams = useMemo<Record<string, unknown>>(
    () => (params ?? {}) as Record<string, unknown>,
    [params]
  );
  const stableQuery = useMemo<Record<string, unknown>>(
    () => (query ?? {}) as Record<string, unknown>,
    [query]
  );

  const resolvedRoute = useMemo<ResolvedRoute<TComponentName> | null>(() => {
    // 쿼리 파라미터 제거 후 라우트 매칭
    const pathWithoutQuery = virtualPath.split('?')[0];
    return resolveVirtualRoute(pathWithoutQuery, config.routes);
  }, [virtualPath, config.routes]);

  // 1. 라우트가 없을 경우 처리
  const handleRouteNotFound = useCallback(() => {
    setError({ reason: `Route not found: ${virtualPath}` });
    setRenderedContent({
      component: null,
      key: '',
      params: {},
      query: {},
    });
  }, [virtualPath]);

  const queryClient = useQueryClient();

  const initErrorStatus = useCallback(() => {
    // 중요: 쿼리클라이언트에 저장된 에러 상태를 초기화하여 다시 로드 가능하게 합니다.
    queryClient.removeQueries({
      predicate: (query) => query.state.status === 'error',
    });

    setError(null);
    setFailedPath(null);
  }, [queryClient]);

  // 3. 컴포넌트 로드
  const fetchAndRenderComponent = useCallback(
    async (
      loader: () => Promise<{
        default: React.ComponentType<Record<string, unknown>>;
      }>,
      route: ResolvedRoute<TComponentName>
    ) => {
      try {
        initErrorStatus();

        const module = await loader();

        if (module?.default) {
          const pathWithoutQuery = virtualPath.split('?')[0];
          const componentKey = `${pathWithoutQuery}-${route.componentName}`;

          setRenderedContent({
            component: module.default,
            key: componentKey,
            params: {
              ...route.params,
              ...stableParams,
            },
            query: { ...stableQuery },
          });
        } else {
          setError({
            reason: `Component ${String(route.componentName)} not found`,
          });
        }
      } catch (err) {
        setError({
          reason: `Failed to load component: ${(err as Error).message}`,
        });
      }
    },
    [virtualPath, stableParams, stableQuery, initErrorStatus]
  );

  const loadComponent = useCallback(async () => {
    if (!resolvedRoute) {
      handleRouteNotFound();
      return;
    }

    const loader = config.componentLoaders[resolvedRoute.componentName];

    if (!loader) {
      setError({
        reason: `Component loader not found: ${resolvedRoute.componentName}`,
      });
      return;
    }

    await fetchAndRenderComponent(loader, resolvedRoute);
  }, [resolvedRoute, config.componentLoaders, handleRouteNotFound, fetchAndRenderComponent]);

  useEffect(() => {
    loadComponent();

    // never change this timeout
    setTimeout(() => {
      initErrorStatus();
    }, 0);
  }, [initErrorStatus, loadComponent, virtualPath]);

  const Component = renderedContent.component;

  const ErrorComponent = ERROR_MAP[error?.status ?? 500];

  return (
    <CurrentTabIdProvider tabId={tabId}>
      <OverlayProvider overlayStore={overlayStore}>
        <div
          key={`tab-content-${tabId}`}
          data-tab-id={tabId}
          data-active={isActive ? 'true' : undefined}
          data-tab-content="true"
          className={cn(tabContentStyles({ active: isActive }))}
        >
          <div className={tabContainerRootStyles}>
            {error && (
              <ErrorComponent onGoBack={goBack} onGoHome={() => switchTabToPath('/home')} />
            )}

            {!error && Component && (
              <ErrorBoundary
                fallback={
                  <div className={errorStyles}>
                    <p>An unexpected error occurred.</p>
                  </div>
                }
                hasRestored={!failedPath}
                onError={(error) => {
                  if (checkIsUnauthorizedError(error)) {
                    throw error;
                  }

                  if (
                    checkIsForbiddenError(error) ||
                    checkIsNotFoundError(error) ||
                    checkIsInternalServerError(error)
                  ) {
                    closeAllOverlays();
                    setError({
                      status: error.response!.status as keyof typeof ERROR_MAP,
                      reason: error.message,
                    });
                  }

                  setFailedPath(virtualPath);
                }}
              >
                <Component
                  key={renderedContent.key}
                  {...renderedContent.params}
                  {...renderedContent.query}
                />
                <OverlayContainer overlayStore={overlayStore} isActiveTab={isActive} />
              </ErrorBoundary>
            )}
          </div>
        </div>
      </OverlayProvider>
    </CurrentTabIdProvider>
  );
};

interface TabContainerProps<TComponentName extends string = string> {
  tabs: Array<{
    id: string;
    virtualPath: string;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
  }>;
  activeTabId: string;
  config: TabContainerConfig<TComponentName>;
  className?: string;
  goBack: () => void;
  switchTabToPath: (path: string) => void;
}

const TabContainer = <TComponentName extends string = string>({
  tabs,
  activeTabId,
  config,
  className,
  goBack,
  switchTabToPath,
}: TabContainerProps<TComponentName>): React.ReactElement => {
  /**
   * Lazy-mount tab contents:
   * - 최초에는 active tab만 마운트하여 불필요한 API 호출을 방지
   * - 사용자가 한 번이라도 활성화한 탭은 계속 마운트(상태 유지)
   *
   * NOTE: 탭 목록(session 복원 포함)이 많을 때 초기 렌더링/네트워크 폭주를 줄이기 위함
   */
  const [mountedTabIds, setMountedTabIds] = useState<Set<string>>(() => {
    if (!activeTabId) return new Set<string>();
    return new Set<string>([activeTabId]);
  });

  useEffect(() => {
    setMountedTabIds((prev) => {
      const currentTabIds = new Set(tabs.map((tab) => tab.id));
      const next = new Set<string>();

      // 기존에 마운트된 탭 중 아직 존재하는 탭만 유지
      prev.forEach((id) => {
        if (currentTabIds.has(id)) {
          next.add(id);
        }
      });

      // 활성 탭은 항상 마운트 대상으로 포함
      if (activeTabId && currentTabIds.has(activeTabId)) {
        next.add(activeTabId);
      }

      // 내용이 동일하면 state 업데이트 스킵(불필요한 리렌더 방지)
      const isSame = next.size === prev.size && Array.from(next).every((id) => prev.has(id));

      return isSame ? prev : next;
    });
  }, [activeTabId, tabs]);

  return (
    <div className={cn(tabContainerStyles, className)}>
      {tabs.map((tab) => {
        if (!mountedTabIds.has(tab.id)) {
          return null;
        }

        return (
          <TabContent<TComponentName>
            key={tab.id}
            tabId={tab.id}
            virtualPath={tab.virtualPath}
            params={tab.params}
            query={tab.query}
            isActive={tab.id === activeTabId}
            config={config}
            goBack={goBack}
            switchTabToPath={switchTabToPath}
          />
        );
      })}
    </div>
  );
};

export default TabContainer;
export type { TabContainerConfig, TabContainerProps };
