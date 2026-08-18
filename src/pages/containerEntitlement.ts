/* ----------------------------------------
   이용 조건에 따른 용도 옵션 (CorePlan CAPSIS-D-61)

   고객이 전 제품을 다 쓰지는 않는다 — Private Cloud만 쓰기도, AI 플랫폼
   (Metis·Maxis)만 쓰기도, 둘을 섞어 쓰기도 한다. 클러스터를 만들 때 보이는
   용도는 그 사용자가 쓸 수 있는 것만이다.

   세 경우를 화면으로 비교하려고 스위치를 둔다 — 주소에 ?entitlement=all|private|ai.
   초기값은 URL 쿼리에서 한 번 읽고, 이후에는 모듈 상태로 유지한다
   (containerDashboardLayout과 같은 방식).

   무엇을 보고 "쓸 수 있다"를 판단하는지는 아직 정해지지 않았다 — 라이선스인지,
   IAM 권한인지, 그 환경에 제품이 깔려 있는지. 그래서 목업에서는 스위치로 둔다
   (spec §GAP "이용 조건을 무엇으로 판정하는가").

   Neo Cloud 화면에는 용도 선택을 아예 두지 않는다 — 고를 것이 하나뿐이다.
   ---------------------------------------- */

import { useSyncExternalStore } from 'react';
import type { ClusterUsage } from '@/components/ClusterOverviewTab';

export type { ClusterUsage };

/** 사용자가 무엇을 도입했는가. */
export type Entitlement = 'all' | 'private' | 'ai';

export const ENTITLEMENTS: {
  id: Entitlement;
  label: string;
  summary: string;
}[] = [
  {
    id: 'all',
    label: '둘 다 — Private Cloud + AI 플랫폼',
    summary: 'General · Metis · Maxis 셋 다 보인다',
  },
  {
    id: 'private',
    label: 'Private Cloud만',
    summary: 'General만 보인다',
  },
  {
    id: 'ai',
    label: 'AI 플랫폼만',
    summary: 'Metis · Maxis만 보인다',
  },
];

const USAGE_BY_ENTITLEMENT: Record<Entitlement, ClusterUsage[]> = {
  all: ['General', 'Metis', 'Maxis'],
  private: ['General'],
  ai: ['Metis', 'Maxis'],
};

export const USAGE_LABELS: Record<ClusterUsage, string> = {
  General: 'General — general purpose workloads',
  Metis: 'Metis — inference and serving',
  Maxis: 'Maxis — training',
};

const DEFAULT_ENTITLEMENT: Entitlement = 'all';

const isEntitlement = (value: string | null): value is Entitlement =>
  value === 'all' || value === 'private' || value === 'ai';

const readFromUrl = (): Entitlement => {
  if (typeof window === 'undefined') return DEFAULT_ENTITLEMENT;
  const fromQuery = new URLSearchParams(window.location.search).get('entitlement');
  return isEntitlement(fromQuery) ? fromQuery : DEFAULT_ENTITLEMENT;
};

let currentEntitlement: Entitlement = readFromUrl();

const listeners = new Set<() => void>();

export const getEntitlement = (): Entitlement => currentEntitlement;

export const setEntitlement = (entitlement: Entitlement): void => {
  if (currentEntitlement === entitlement) return;
  currentEntitlement = entitlement;
  listeners.forEach((listener) => listener());
};

export const subscribeEntitlement = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** 컴포넌트에서 현재 이용 조건을 읽는다. 바뀌면 다시 그린다. */
export const useEntitlement = (): Entitlement =>
  useSyncExternalStore(subscribeEntitlement, getEntitlement, () => DEFAULT_ENTITLEMENT);

/** 이 사용자가 고를 수 있는 용도. */
export const availableUsages = (entitlement: Entitlement): ClusterUsage[] =>
  USAGE_BY_ENTITLEMENT[entitlement];

/** 컴포넌트에서 고를 수 있는 용도를 바로 읽는다. */
export const useAvailableUsages = (): ClusterUsage[] => availableUsages(useEntitlement());
