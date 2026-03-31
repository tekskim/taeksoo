import type { ResolvedRoute, RouteRegistry, VirtualRoute } from '../../types/routing';

/**
 * 경로 매칭 헬퍼 함수
 * 실제 경로와 라우트 패턴이 일치하는지 확인
 */
const isPathMatch = (actualPath: string, routePath: string): boolean => {
  const actualSegments = actualPath.split('/').filter(Boolean);
  const routeSegments = routePath.split('/').filter(Boolean);

  if (actualSegments.length !== routeSegments.length) {
    return false;
  }

  return routeSegments.every((segment, index) => {
    if (segment.startsWith(':')) {
      return true;
    }
    return segment === actualSegments[index];
  });
};

/**
 * 가상 라우트 매칭 함수
 * 주어진 경로에 맞는 라우트를 찾음
 */
const matchVirtualRoute = <TComponentName = string>(
  virtualPath: string,
  routes: RouteRegistry<TComponentName>
): VirtualRoute<TComponentName> | null => {
  if (routes[virtualPath]) {
    return routes[virtualPath];
  }

  for (const [routePath, route] of Object.entries(routes)) {
    if (isPathMatch(virtualPath, routePath)) {
      return route;
    }
  }

  return null;
};

/**
 * 경로에서 파라미터 추출
 * 예: /networks/:id -> { id: '123' }
 */
const extractParams = (actualPath: string, routePath: string): Record<string, string> => {
  const actualSegments = actualPath.split('/').filter(Boolean);
  const routeSegments = routePath.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  routeSegments.forEach((segment, index) => {
    if (segment.startsWith(':')) {
      const paramName = segment.slice(1);
      params[paramName] = actualSegments[index];
    }
  });

  return params;
};

/**
 * 가상 라우트 해석 함수
 * 경로를 매칭하고 파라미터를 추출하여 반환
 */
const resolveVirtualRoute = <TComponentName = string>(
  virtualPath: string,
  routes: RouteRegistry<TComponentName>
): ResolvedRoute<TComponentName> | null => {
  const route = matchVirtualRoute(virtualPath, routes);

  if (!route) {
    return null;
  }

  const params = extractParams(virtualPath, route.path);

  return {
    componentName: route.component,
    params,
    route,
  };
};

export { extractParams, matchVirtualRoute, resolveVirtualRoute };
