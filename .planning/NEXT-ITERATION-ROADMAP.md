# Container Platform — 다음 이터레이션 로드맵

**범위 제한 (확정):** 로컬 목업 전용. 실제 백엔드 / K8s API 연동 없음, 배포 없음, MFE
제품화 없음. 목표는 `planning/taeksoo`(포트 5180)에서 *디자인이 발전하는 모습을 눈으로 확인*하는 것.

---

## 제품 모델 — ★결정 변경 (2026-07-13): 통합 가설 확정

**통합 범위:** Aegis/Metis 환경의 **K8s 기능 전체**(워크로드/서비스/스토리지/네트워크 CRUD,
YAML 편집, 콘솔)를 Container Platform 하나로 통합하고, CP 자체를 **더 쉬운 형태**로 만든다.
관측(estate 뷰)만 담당하고 관리는 기존 앱에 남기는 이전 결정(Model A)은 폐기한다.

추론 서빙은 Metis, 학습·Model Registry는 Maxis가 담당한다 — CP는 그 밑에서 클러스터와
K8s 자원을 받쳐주는 공통 기반이고, 그 위에서 Pod을 만들어 쓰는 응용 성격의 제품은 담지 않는다.
v0.2의 AI Workloads 섹션(추론/학습/노트북)은 CP의 범위를 넘어선 설계라 다시 조정한다
(추론/학습은 담당 제품으로 가는 링크만 남기거나 목록에서 제외).
**ML Studio의 Devspace를 CP로 가져올지는 검토 중 가설**로 프로토타입에서 검증.

> **기획 산출물 정본:** `planning/_local/container-platform-plan/` (spec·policy·screen-description·
> decision log — thaki-core-plan 편입 전 로컬 초안). 이 파일은 목업 구현 관점의 로드맵으로 유지.

- **Container Platform이 담당:** 전체 자산 관측(Overview·Clusters·Nodes·Namespaces·Workloads·
  Events·Search) **+ 클러스터 단위 전체 관리**(Deployments/StatefulSets/DaemonSets/
  Jobs/CronJobs/Pods, Services, Ingresses, PV/PVC/StorageClass/ConfigMaps/Secrets,
  HPA/LimitRanges/ResourceQuotas/NetworkPolicies/PDB, YAML, Console)
  **+ Devspaces(검토 중 가설)**.
- **Aegis/Metis Container는 별도 앱으로 유지하지 않는다** — 화면 자산은 Container Platform 안으로 이동.
- "Open in cluster management" 외부 핸드오프 컨셉은 폐기 — 같은 앱 안에서 클러스터 스코프로 들어간다.

### 폐기된 이전 결정 (기록용)

- ~~Model A (Rancher 방식, 2026-07-09 확정)~~ — CP는 읽기 전용 관측 + 이동 허브만 담당하고,
  리소스 관리 CRUD는 기존 Aegis/Metis Container를 재사용한다는 결정.
  **2026-07-13 통합 가설 확정으로 폐기.**

---

## v0.3 — 통합 로드맵 (초안)

목업에 이미 있는 자산을 재배치하는 작업이 중심이다: 기존 Container 앱 목업에 관리 화면
55개 이상(Workloads 6종 CRUD + YAML 생성, Services, Ingresses, ConfigMaps, HPA, Namespaces,
Events, Console 등, `ContainerSidebar` + `ContainerModeContext` 기반)이 이미 있고,
`src/pages/container-platform/`에 v0.2 관측 화면 11개가 있다.

**Phase D — 통합 IA 설계 (선행 필수)**

- 2계층 구조 확정: **전체 자산(estate) 뷰**(현 v0.2 화면) ↔ **클러스터 스코프 관리 뷰**(흡수할 관리 화면).
- 클러스터 진입 방식 설계: Clusters 목록/상세에서 클러스터를 선택하면 사이드바가 해당 클러스터의
  관리 메뉴(Workloads·Services·Storage·Config·Policy·…)로 전환되는 흐름 (Rancher의
  클러스터 진입 패턴 참고).
- 사이드바·브레드크럼·스코프 전환(estate ↔ cluster) UX와 라우트 체계(`/container-platform/clusters/:id/...`) 결정.

**Phase E — 컨테이너 관리 화면 흡수 (Aegis/Metis Container → CP)**

- 기존 목업의 관리 화면을 CP 셸/라우트 아래로 이동: Workloads(Deployments/StatefulSets/
  DaemonSets/Jobs/CronJobs/Pods) 목록·상세·생성(폼+YAML), Services, Ingresses,
  ConfigMaps/Secrets, PV/PVC/StorageClass, HPA 등 Policy, Namespaces, Events, Console.
- `ContainerModeContext`의 aegis/metis 모드 구분을 CP 안에서 어떻게 흡수할지 정리
  (클러스터 소스 속성으로 대체가 자연스러움).
- 관측 화면(estate Workloads 등)과 관리 화면(cluster Workloads)의 데이터 모델 연결 — 같은
  inline mock을 읽도록 정합 맞춤.

**Phase F — AI Workloads 범위 재조정 + Devspaces (검토 중 가설)**

- 추론/학습 자원은 CP 것이 아님을 반영: managed-by 배지 + Metis/Maxis 이동 링크 또는 목록 제외.
- Devspaces 섹션(목업): 목록·상태 제어·접속 진입점(/path/to 표기)·생성 폼 — 통합 여부 판단용 실물.
- "더 쉬운 형태" 비교 시안: Deployments 생성 화면 기존 풀옵션 vs 쉬운 버전.
- GPU 할당 관점 뷰(클러스터·노드별 GPU 사용 현황)는 관측 범위로 유지.

**Phase G — 단일 진입 정리**

- 데스크톱에서 Aegis Container·Metis Container 앱 진입을 정리(제거 또는 legacy 표기),
  Container Platform 단일 아이콘으로 수렴.
- 클러스터 lifecycle(생성/가져오기) 화면 포함 여부 결정 반영.

---

## 미결 사항 (v0.3)

1. **클러스터 lifecycle 포함 여부** — 클러스터 생성/가져오기까지 CP에 넣을지, 목업 범위에선 보류할지.
2. **App Catalog** — 기존 결정은 "별도 프로젝트로 제외". 전면 통합 방향에서도 제외를 유지할지 재확인 필요.
3. **estate ↔ cluster 스코프 전환 UX** — 클러스터 진입형(Rancher식 사이드바 전환) vs 상시 트리 노출. Phase D에서 확정.
4. **Metis/Maxis 분리 협의와의 정합** — `.planning/METIS-MAXIS-SPLIT-IMPACT.md`(ML Studio→Maxis 분리안)과
   이번 전면 통합 결정의 관계 정리 필요. 이번 결정이 최신이므로 우선하되, 협의 문서 쪽 반영 여부 확인.

---

# 이하: v0.2 기록 (완료)

**v0.2에서 가장 먼저 하기로 했던 것:** 모델 서빙·학습·노트북 현황을 Container Platform
화면에서 한눈에 볼 수 있게 만들기. (완료 — 아래 진행 상황 참조.
※ 이후 2026-07-13 통합 가설 확정으로 추론/학습 화면은 범위 재조정 대상이 됨.)

AI-on-Kubernetes 관측 화면의 참고 사례: OpenShift AI, Kubeflow, Run:ai
(추론 엔드포인트, 노트북 서버, 학습 작업, GPU 할당을 화면의 기본 축으로 다루는 방식).

## Phase A — AI 워크로드 흡수 (선두, 필수) — 완료

**A1. 자산 데이터 모델 확장**

- **GPU**를 노드의 기본 자원으로 추가 (Metis GPU 클러스터에 A100 수량 부여; `gpuTotal`/`gpuUsed`).
- AI 워크로드 구분을 도입: 워크로드에 `workloadCategory` 필드 —
  `Standard | InferenceService | TrainingJob | Notebook` — 와 함께 AI 전용 필드 추가:
  - InferenceService: 모델명, 프레임워크(Triton/vLLM/TF-Serving), GPU 수, 레플리카 수, mock RPS/지연시간.
  - TrainingJob: 상태, GPU 수, 진행률(epoch %), 소요시간, 소유자.
  - Notebook: 소유자, GPU, 상태(Running/Idle/Stopped).
- 지금과 같은 방식의 결정적(deterministic) inline mock 데이터로 유지.

**A2. "AI Workloads" 섹션** (사이드바 신규 항목)

- 구분된 목록: Inference Services · Training Jobs · Notebooks (탭 또는 유형 필터).
- AI 전용 칼럼 (서빙=모델/프레임워크/GPU/레플리카; 학습=진행률/GPU/소요시간; 노트북=소유자/GPU/상태).
- 유형 / 클러스터 / 상태 필터; 다른 목록과 동일하게 TDS Table + 페이지네이션.

**A3. Overview — AI + GPU 집계**

- "AI workloads" 요약 추가 (추론 서비스 / 학습 작업 / 노트북 개수).
- **GPU 사용률** 집계 타일 추가 (전체 자산 기준 할당 GPU vs 총 GPU).

**A4. 클러스터 상세 — AI + GPU**

- GPU 클러스터는 기존 노드/워크로드 요약 옆에 GPU 용량과 해당 클러스터의 AI 워크로드를 함께 표시.

## Phase B — 디자인 완성도 (목업 디자인 QA) — 완료 (B4 보류)

- **B1.** 직접 만든 Overview `Tile`을 TDS **MetricCard** / `MetricCardGroup`(`accent: success|error`)으로 교체.
- **B2.** **Container Platform 전용 앱 아이콘** 제작 (재사용 중인 `container.webp` 교체).
- **B3.** TDS 와이어프레임/패턴 대비 디자인 QA — 칼럼 일치, 빈 화면/로딩 상태, 목록 페이지 여백, 브레드크럼.
- **B4.** (선택 리팩토링) 공용 `useListFilterPagination` 훅 + `ContainerPlatformPageShell` 래퍼 + `nameColumn`/`statusBadgeColumn` 팩토리 추출 — 목록 페이지 3곳 중복(코드 리뷰 지적). **의도적 보류.**

## Phase C — 관측 범위 확장 — 완료

- **C1.** Namespaces & Events 화면 (Rancher 방식).
- **C2.** 노드 상세 진입 (Nodes 목록에서 클릭).
- **C3.** 전역 통합 검색 / 자산 필터 (소스, 클러스터, 상태 기준).

## v0.2 진행 상황 (2026-07-09)

- **Phase A — 완료** (Inference Services·Training Jobs·Notebooks 목록 구현, GPU를 노드 기본 자원으로 표시; 전용 AI Workloads 섹션 + Overview/클러스터 상세 집계).
- **Phase B — 완료.** B1 Overview → TDS `MetricCard`; B3 흡수한 4개 제품명을 담은 컨셉 부제; B2 전용 앱 아이콘(`container-platform.svg`).
- **Phase C — 완료.** C1 Namespaces + Events; C2 노드 상세 진입(Nodes 행 클릭); C3 전역 "Search estate"(사이드바 → 그룹화된 결과).
- **B4 리팩토링 — 의도적으로 보류:** 내부 정리 작업이라 화면에 보이는 변화가 없고, 잘 돌아가는 8개 화면을 망가뜨릴 위험이 있음.

**v0.2 미결 사항 해소:** AI Workloads = 전용 섹션. Container 아이콘 = 교체 유지 + 전용 아이콘 추가.

**검증:** Playwright E2E 16/16 PASS, 페이지 에러 0건, 10개 화면. eslint/tsc 깨끗, `rspack build` 정상 종료(exit 0), `@thaki/shared` 임포트 없음, 하드코딩된 너비 없음.

v0.2 완료 시점 사이드바: Overview · Clusters · Nodes · Namespaces · Workloads · AI Workloads · Events + 전역 검색.

---

_v0.2 초안 2026-07-09 작성(목업 전용; 이전 v2 노트의 백엔드/배포/MFE 항목은 이해관계자 결정에 따라 제외). **2026-07-13 제품 모델 결정 변경(전면 통합)으로 상단 v0.3 로드맵 추가.**_
