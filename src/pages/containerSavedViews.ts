/* ----------------------------------------
   Saved views (Container Platform mode, CorePlan D-36 ② · CCONT-11~13)

   저장된 뷰 = 자주 보는 조건을 이름 붙여 재사용하는 기능. 메뉴 북마크가 아니라
   필터·정렬·스코프가 걸린 "화면 상태"를 저장한다.

   설계 결정(2026-07-31 목업 탐색):
   - 저장 대상 = 모든 페이지(전 페이지에서 저장 가능, OpenShift식). — screenLabel로 어떤 화면인지 표시.
   - 클러스터 스코프 = 클러스터별 뷰(CCONT-13 확장). 뷰는 저장 시점의 클러스터에 속하고,
     복원하면 그 클러스터로 이동한 뒤 화면 주소를 연다. 사이드바에 클러스터명을 함께 보여준다.
   - 저장 단위 = 화면 주소(path)+쿼리(search). 쿼리에 필터·정렬·스코프가 담긴다(CCONT-11).
     목록 화면이 조건을 주소에 담는 것(CCONT-12)이 선결이며, 이 목업은 Volume snapshots
     목록에 시범 적용했다. 나머지 목록은 경로만 저장된다(조건은 다음 이터레이션에서).
   - 저장 위치 = 목업이라 모듈 상태(사용자 1명 가정). 실제 사용자별 저장 백엔드는 GAP.

   containerActiveCluster.ts와 같은 모듈 스토어 패턴. 라우트가 바뀌어도 살아남는다.
   ---------------------------------------- */

import { useSyncExternalStore } from 'react';

export interface SavedView {
  id: string;
  /** 사용자가 붙인 이름 */
  name: string;
  /** 화면 경로 (예: /container/deployments) */
  path: string;
  /** 쿼리스트링 (필터·정렬·스코프, 앞에 ? 포함. 없으면 '') */
  search: string;
  /** 클러스터별 뷰 — 복원 시 이 클러스터로 이동 */
  clusterId: string;
  clusterName: string;
  /** 사이드바 표시용 화면 이름 (예: Deployments) */
  screenLabel: string;
}

let views: SavedView[] = [
  {
    id: 'sv-seed-1',
    name: 'Failed pods in tenant-a',
    path: '/container/pods',
    search: '?status=Failed&namespace=tenant-a',
    clusterId: 'cp-general-01',
    clusterName: 'production-kubernetes-high-availability-cluster',
    screenLabel: 'Pods',
  },
  {
    id: 'sv-seed-2',
    name: 'vLLM serving workloads',
    path: '/container/deployments',
    search: '?managedBy=Metis',
    clusterId: 'cp-metis-train-a100',
    clusterName: 'metis-train-a100',
    screenLabel: 'Deployments',
  },
];

const listeners = new Set<() => void>();
function emit(): void {
  listeners.forEach((l) => l());
}

export function getSavedViewsSnapshot(): SavedView[] {
  return views;
}

export function subscribeSavedViews(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** 이름이 이미 있으면 false를 반환하고 저장하지 않는다(중복 방지). */
export function addSavedView(view: Omit<SavedView, 'id'>): boolean {
  if (views.some((v) => v.name.trim().toLowerCase() === view.name.trim().toLowerCase())) {
    return false;
  }
  views = [...views, { ...view, id: `sv-${Date.now()}` }];
  emit();
  return true;
}

export function removeSavedView(id: string): void {
  views = views.filter((v) => v.id !== id);
  emit();
}

/** React 구독 훅 — 사이드바가 저장된 뷰 목록 변화를 반영한다. */
export function useSavedViews(): SavedView[] {
  return useSyncExternalStore(subscribeSavedViews, getSavedViewsSnapshot);
}
