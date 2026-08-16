/* ----------------------------------------
   Cluster dashboard placement (Capsis 비교용, CorePlan CAPSIS-D-53 안건 A)

   클러스터 대시보드(자원 개수·Capacity·Control plane 상태·이벤트)를 어디에
   둘지가 정해지지 않았다. 세 안을 화면으로 비교하려고 배치만 바꾸는 스위치를
   둔다 — 화면 내용은 세 안이 모두 같다.

   제품 실측(thaki-ui origin/develop)에서 확인한 것: `/workloads` 화면에는
   워크로드 목록이 없고 대시보드와 Events·Certificates 탭만 있다. 그래서
   a안과 b안의 차이는 화면 내용이 아니라 **메뉴에서의 이름과 자리**뿐이다.

   Module-level state survives route changes the same way containerActiveCluster
   does. 초기값은 URL 쿼리(?layout=a|b|c)에서 한 번 읽는다.
   ---------------------------------------- */

import { useSyncExternalStore } from 'react';

export type DashboardLayout = 'a' | 'b' | 'c';

export const DASHBOARD_LAYOUTS: {
  id: DashboardLayout;
  label: string;
  summary: string;
}[] = [
  {
    id: 'a',
    label: 'A — 현행 유지',
    summary: '대시보드가 Workloads라는 이름으로 워크로드 묶음에 있다',
  },
  {
    id: 'b',
    label: 'B — Dashboard로 분리',
    summary: '대시보드를 클러스터 묶음 맨 위 Dashboard로 둔다',
  },
  {
    id: 'c',
    label: 'C — 클러스터 상세 탭',
    summary: '대시보드를 없애고 클러스터 상세 Overview 탭에 넣는다',
  },
];

const DEFAULT_LAYOUT: DashboardLayout = 'a';

const isLayout = (value: string | null): value is DashboardLayout =>
  value === 'a' || value === 'b' || value === 'c';

const readFromUrl = (): DashboardLayout => {
  if (typeof window === 'undefined') return DEFAULT_LAYOUT;
  const fromQuery = new URLSearchParams(window.location.search).get('layout');
  return isLayout(fromQuery) ? fromQuery : DEFAULT_LAYOUT;
};

let currentLayout: DashboardLayout = readFromUrl();

const listeners = new Set<() => void>();

export const getDashboardLayout = (): DashboardLayout => currentLayout;

export const setDashboardLayout = (layout: DashboardLayout): void => {
  if (currentLayout === layout) return;
  currentLayout = layout;
  listeners.forEach((listener) => listener());
};

/** URL에 ?layout=이 실려 들어오면 그 값으로 맞춘다 (캡처 스크립트용). */
export const syncDashboardLayoutFromUrl = (): void => {
  setDashboardLayout(readFromUrl());
};

export const subscribeDashboardLayout = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** 컴포넌트에서 현재 배치안을 읽는다. 바뀌면 다시 그린다. */
export const useDashboardLayout = (): DashboardLayout =>
  useSyncExternalStore(subscribeDashboardLayout, getDashboardLayout, () => DEFAULT_LAYOUT);

/** 대시보드 화면을 사이드바에 두는가 (a·b안). c안은 상세 탭으로 들어간다. */
export const hasDashboardMenu = (layout: DashboardLayout): boolean =>
  layout === 'a' || layout === 'b';

/** 대시보드 메뉴가 어느 묶음에 붙는가. */
export const dashboardMenuGroup = (layout: DashboardLayout): 'workloads' | 'cluster' | null => {
  if (layout === 'a') return 'workloads';
  if (layout === 'b') return 'cluster';
  return null;
};

/** 사이드바에 보이는 메뉴 이름. */
export const dashboardMenuLabel = (layout: DashboardLayout): string =>
  layout === 'a' ? 'Workloads' : 'Dashboard';

/**
 * 아이콘 사이드바에서 클러스터를 고르면 어디로 들어가는가.
 * c안은 대시보드 화면이 없으므로 클러스터 상세로 들어간다.
 */
export const clusterEntryPath = (layout: DashboardLayout, clusterId: string): string =>
  layout === 'c' ? `/container/cluster-management/${clusterId}` : '/container/dashboard';

/** 클러스터 상세에 Overview 탭을 두는가 (c안만). */
export const hasClusterOverviewTab = (layout: DashboardLayout): boolean => layout === 'c';
