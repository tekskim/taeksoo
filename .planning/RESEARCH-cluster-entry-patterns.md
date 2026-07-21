# 참고제품 리서치 — 클러스터 진입/스코프 전환 IA

**작성:** 2026-07-14 · **용도:** Phase D(통합 IA 설계) 입력 · **방법:** deep-research (소스 24개 수집 → 주장 25개 3표 교차검증 → 25개 확정, 0개 반박)

여러 클러스터를 다루는 Kubernetes 관리 UI들이 "전체 자산(estate) 뷰"와 "단일 클러스터 관리 스코프"를
어떻게 나누고 오가는지 조사했다. 결론부터: **거의 모든 제품이 이 둘을 뚜렷한 두 계층으로 나누고, 사용자가
명시적으로 클러스터에 "진입"해야 관리 스코프로 들어간다.** Rancher가 가장 완성된 참고 사례다.

---

## 한눈에 보는 결론

- **estate ↔ cluster는 2계층으로 분리하는 게 업계 표준이다.** 상시 트리로 모든 클러스터의 하위 메뉴를
  펼쳐두는 제품은 없었다. 전체를 먼저 보여주고, 클러스터를 골라 들어가면 그때 관리 메뉴가 나온다.
- **진입 방식은 두 갈래다.** ① Rancher식 "클러스터 목록에서 Explore 버튼 → 사이드바가 그 클러스터
  관리 메뉴로 전환" ② RHACM식 "상단 클러스터 셀렉터 드롭다운으로 All Clusters ↔ 단일 클러스터 전환".
- **AI/GPU 계열(Run:ai, Kubeflow)은 클러스터가 아니라 논리 단위(project/profile=namespace)를
  스코프 경계로 쓴다.** 이건 "클러스터 간 2계층"이 아니라 "클러스터 안 멀티테넌시"라 층위가 다르다.
  우리 estate↔cluster 설계에 직접 대응하는 건 Rancher/RHACM/Run:ai Control Plane 쪽이다.

---

## 제품별 비교표

| 제품                    | 전체(estate) 뷰                                           | 단일 클러스터 진입 방식                                                                       | 스코프 표시                                                                            | 라우트                                                                                         | 근거 신뢰도            |
| ----------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------- |
| **Rancher**             | Cluster Management(모든 클러스터 목록·프로비저닝·인프라)  | 목록 각 행의 **Explore 버튼** → 그 클러스터 전용 Cluster Explorer로 사이드바 전환             | 사이드바가 통째로 그 클러스터 관리 메뉴(Workloads/Services/Storage/Config/RBAC)로 바뀜 | `/c/:cluster/:product/:resource`, 글로벌 화면은 `_`(BLANK_CLUSTER) 자리표시자로 경로 모양 유지 | 높음 (공식문서+코드)   |
| **RHACM (OpenShift)**   | 'All Clusters'(fleet 관리)                                | 상단 **cluster switcher 드롭다운**에서 단일 클러스터(local-cluster) 선택                      | 드롭다운의 현재 선택값이 스코프 표시. 정확히 두 모드(All Clusters ↔ 단일)              | OpenShift 콘솔 라우트 재사용                                                                   | 높음 (공식문서)        |
| **Run:ai (NVIDIA)**     | Multi-Cluster Overview(클러스터 가로지르는 집계 대시보드) | 사이드바 재구성 없이 **페이지 내 드롭다운 필터**(클러스터·node pool·Department)로 스코프 축소 | 상단 필터의 선택값. project는 단일 클러스터+namespace에 매핑                           | (문서 범위 밖)                                                                                 | 높음 (공식문서)        |
| **Kubeflow**            | (fleet 개념 없음 — 단일 클러스터 내부)                    | 상단바 **profile(=namespace) 드롭다운** 하나로 전체 UI 스코프 결정                            | 상단 profile 셀렉터                                                                    | (문서 범위 밖)                                                                                 | 높음 (공식문서)        |
| **K8s Dashboard(공식)** | 멀티클러스터 인지를 요구사항으로만 명시                   | 셀렉터 배치·전환 인터랙션 미규정(설계 여백)                                                   | —                                                                                      | —                                                                                              | 중간 (리포 아카이브됨) |

---

## Phase D에 바로 쓰는 시사점

### 1) 클러스터 진입 — 명시적 "진입" 동작을 둔다 (상시 트리 금지)

전체 자산 뷰에서 곧바로 모든 클러스터의 Workloads/Services를 트리로 펼치지 않는다. Clusters 목록/상세에서
클러스터를 고르는 **명시적 동작**(Rancher의 Explore 버튼에 해당)으로 클러스터 스코프에 들어가고, 그때
사이드바가 그 클러스터의 관리 메뉴로 바뀐다. 이게 우리 로드맵 Phase D의 "클러스터 진입 방식" 그대로다.

### 2) 스코프 표시 — 두 방식 중 선택

- **A. Rancher식(사이드바 전환):** 클러스터 진입 후 사이드바 헤더에 클러스터 이름을 박고, 메뉴 자체가
  그 클러스터 관리 항목으로 교체된다. 지금 어디 있는지가 사이드바 전체로 드러나 강력하다.
- **B. RHACM식(상단 셀렉터):** 사이드바는 그대로 두고 상단 클러스터 드롭다운으로 스코프를 바꾼다.
  전환은 가볍지만 "지금 어느 스코프인지"가 드롭다운 한 줄에만 표시돼 약하다.
- **권고:** 우리는 관리 기능 전체를 흡수하는 방향이라 **A(사이드바 전환)** 가 맞다. 전체 자산 뷰와 클러스터
  관리 뷰의 메뉴 구성이 크게 다르기 때문. 상단에는 estate로 돌아가는 back 경로 + 현재 클러스터 이름을 둔다.

### 3) 라우트 — 클러스터 식별자를 경로에 박고, estate 화면도 같은 모양 유지

Rancher처럼 `/container-platform/clusters/:clusterId/...`로 클러스터 스코프를 경로에 명시한다.
전체 자산(estate) 화면은 클러스터가 없으므로, Rancher의 `_`(BLANK*CLUSTER) 아이디어를 빌려 경로 모양을
통일하거나(`/container-platform/*/overview`), estate는 별도 접두사(`/container-platform/estate/...`)로
분리한다. **목업 단계에선 후자(estate 접두사 분리)가 더 읽기 쉽다.**

### 4) fleet ↔ cluster 화면 분리 — 관측은 estate, CRUD는 cluster

- **estate 레벨:** 모든 클러스터를 가로지르는 관측/집계/검색(현 v0.2 화면 — Overview·Clusters·Nodes·
  Namespaces·Workloads·Events·전역 검색). Run:ai의 Multi-Cluster Overview가 이 레벨의 좋은 참고.
- **cluster 레벨:** 단일 클러스터의 리소스 CRUD(흡수할 관리 화면 — Workloads 6종·Services·Storage·
  Config·Policy·YAML·Console). Rancher Cluster Explorer가 이 레벨의 표준.
- **연결:** estate Workloads 목록의 행을 클릭하면 그 워크로드가 속한 클러스터 스코프로 진입해 상세/편집으로
  이어지게 하면 두 계층이 자연스럽게 이어진다.

### 5) AI/GPU 워크로드 — 클러스터 사이드바 안 섹션 vs 별도 제품

- Run:ai는 아예 **별도 Control Plane 제품**으로 분리, OpenShift AI도 별도 콘솔로 분리하는 경향.
- 우리 7/13 결정은 "추론=Metis, 학습=Maxis가 담당, CP는 그 밑 기반"이다. 즉 **CP는 GPU를 자원으로
  관측(estate 레벨 GPU 사용 현황)만 하고, 추론/학습 워크로드 관리는 managed-by 배지 + 담당 제품 이동
  링크로 넘긴다**는 방향이 이 리서치와도 맞는다. Devspaces 통합 여부는 Phase F에서 별도 검증.

---

## 미해결(추가 조사 필요)

1. **브레드크럼 4단계 표기** — `estate > 클러스터 > namespace > 리소스`를 브레드크럼으로 어떻게
   보여주고, 각 세그먼트 클릭이 상위 스코프로 복귀시키는지. 실제 UI 캡처로 보완 필요.
2. **클러스터에서 estate로 나가는 경로** — 진입(Explore)은 명확하나 반대 방향(back-to-fleet) UX는 미확인.
3. **혼합 스코프 리소스** — 노드 풀·정책처럼 estate와 cluster 양쪽에 나오는 리소스를 어떻게 다른 뷰로
   구분해 혼동을 막는지.
4. **OpenShift AI ↔ OCP 콘솔 링크 방식** — 단일 플랫폼 안에서 AI 섹션을 하위로 통합할 때의 참고 사례.

---

## 용어 주의 (혼동 방지)

- Rancher **'Fleet'** = GitOps 배포 기능(workspace/namespace로 클러스터 그룹핑). 우리가 말하는
  "전체 자산 뷰"와는 다르다.
- Rancher **'Cluster Management'** = 멀티 클러스터 admin/프로비저닝 목록.
- 우리 "전체 자산 관측 대시보드"에 가장 가까운 참고는 Rancher Cluster Management 목록보다
  **Run:ai Multi-Cluster Overview**(집계 대시보드)다.

---

## 주요 출처 (1차 문서 중심)

- Rancher UI Walkthrough / Cluster Management vs Explorer — extensions.rancher.io/internal/getting-started/ui-walkthrough
- Rancher 클러스터 접근(Explore) — ranchermanager.docs.rancher.com/how-to-guides/new-user-guides/manage-clusters/access-clusters
- Rancher 라우팅 규약(`/c/:cluster/...`, BLANK_CLUSTER) — extensions.rancher.io/extensions/next/api/nav/routing
- Rancher in-cluster 제품 → Explorer 이동(#2578) — github.com/rancher/dashboard/issues/2578
- RHACM cluster switcher — access.redhat.com/documentation/.../red_hat_advanced_cluster_management_for_kubernetes/2.7/web_console
- Run:ai Multi-Cluster Overview / Projects(=namespace) — docs.run.ai/v2.19/platform-admin/performance/dashboard-analysis, run-ai-docs.nvidia.com/saas/platform-management/aiinitiatives/organization/projects
- Kubeflow profile(=namespace) 셀렉터 — kubeflow.org/docs/components/central-dash/profiles
