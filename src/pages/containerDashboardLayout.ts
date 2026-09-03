/* ----------------------------------------
   클러스터 대시보드와 클러스터 상세 Overview — 둘 다 둔다 (CorePlan CAPSIS-D-70)

   셋 중 하나를 고르는 문제가 아니었다. 대시보드와 클러스터 상세는 진입 경로가
   다른 두 화면이다 — 아이콘 사이드바에서 클러스터를 고르면 대시보드가 나오고,
   Cluster Management에서 클러스터를 클릭하면 상세 Overview가 나온다.

   - 대시보드: Workloads 묶음에서 떼어 Cluster 묶음 맨 위에 Dashboard로 둔다.
     화면 내용은 그대로다 — 자리와 이름만 바뀐다.
   - 클러스터 상세: Overview 탭을 두지 않는다(CAPSIS-D-73). Rancher도 상세에는
     용량도 자원 개수도 두지 않는다 — 머리의 요약이 그 역할을 하고, 운영 상태는
     전부 대시보드 몫이다. 상세에 새로 만드는 것은 Conditions 탭 하나다.

   2026-08-18에 세 안을 비교하려고 두었던 ?layout=a|b|c 스위치는 CAPSIS-D-70으로
   역할이 끝나 지웠다.
   ---------------------------------------- */

/** 대시보드 화면 경로. */
export const DASHBOARD_PATH = '/container/dashboard';

/** 사이드바에 보이는 대시보드 메뉴 이름. */
export const DASHBOARD_MENU_LABEL = 'Dashboard';

/** 아이콘 사이드바에서 클러스터를 고르면 대시보드로 들어간다. */
export const clusterEntryPath = (): string => DASHBOARD_PATH;

/** 클러스터 상세에 Conditions 탭을 둔다 (Capsis 모드에서만 — Aegis/Metis 모드는 무변경, D-26). */
export const HAS_CLUSTER_CONDITIONS_TAB = true;
