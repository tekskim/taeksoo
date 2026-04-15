# FE 팀 디자인 싱크 회의

> 날짜: 2026-04-09

---

## 1. 디자인 싱크 작업 현황 공유

### 진행 상황

- **1:1 대응 (38개)**: 26개 머지 완료, 7개 PR OPEN, 4개 skip
- **부분 대응 (16개)**: 10개 완료, 2개 PR OPEN, 4개 skip
- **OPEN PR (7건)**: #156, #161, #165, #167, #169, #171, #172

### 남은 싱크 작업


| 컴포넌트                         | 상태    | 비고                          |
| ---------------------------- | ----- | --------------------------- |
| Toast                        | 싱크 예정 | TDS 스펙 존재                   |
| ~~LoadingSpinner~~           | 완료    | TDS Loading 대응              |
| Layout (Stack/VStack/HStack) | 싱크 예정 | 토큰 정렬만                      |
| MultiItemDisplay             | 싱크 예정 | TDS BadgeList 대응            |
| Fieldset                     | 대기    | TDS SectionCard 대응, 구조 차이 큼 |
| Range                        | 보류    | TDS Slider 대응               |


### 논의

- 전체적인 완료 시점과 남은 작업량에 대한 인식 공유
- 남은 6개 항목의 우선순위 조정 필요 여부

---

## 2. OPEN PR 리뷰 프로세스

현재 PR 7건이 오픈 상태. 리뷰 → 머지 흐름에 대해 확인 필요.

### 논의

- PR 리뷰 **담당자 지정**이 필요한지, 팀 내부에서 자율 분배하고 있는지
- 현재 리뷰 → 코멘트 → 수정 → 재리뷰 사이클의 소요 시간

---

## 3. Rule 내재화 경위 공유

### 상황

- TDS 워크스페이스에서 thaki-shared를 수정하는 방식으로 작업해왔음
- Cursor rules는 **워크스페이스 루트 기준**으로만 적용됨
- thaki-shared `.cursor/rules/` 4개 파일이 자동 적용되지 않는 상태였음
- 아이콘 정책, `shared-utilities.css` 정책 등이 누락되어 반복적인 리뷰 코멘트 발생

### 최근 대응 (내재화 완료)

`tds-design-apply` 스킬 파일에 thaki-shared 규칙을 내재화:

- 아이콘 정책 — `wrapped.tsx` 등록 → `../Icon` import 필수
- `shared-utilities.css` 수정 금지 — Tailwind/.styles.ts 우선
- PR 타이틀/커밋 컨벤션 — semantic-release 기반 type 선택
- 스토리북 컨벤션 — `src/stories/`, CSF 3, barrel import
- Provider 계약 — API 변경 = breaking change 주의
- Icon wrapper 색상 우선순위 — 인라인 스타일 specificity 이슈 해결 패턴

### FE팀 요청

- 향후 shared에 새 rule 추가 시 공유 부탁 → 디자인 싱크 스킬에도 반영 필요

---

## 4. 페이지 단위 디자인 적용 계획

컴포넌트 싱크만으로 페이지 디자인이 맞춰지지 않는 케이스가 존재. **특히 Create 페이지들은 앱마다 구조가 상이하여 컴포넌트 반영만으로는 일관성 확보가 어려움.**

### Create 페이지 전수조사 결과

> thaki-ui 4개 앱(compute, container, iam, storage)의 Create 페이지 조사

**규모**: 총 51개 Create 페이지 + 27개 Create Drawer


| 앱         | Create Page               | Create Drawer | YAML 페이지 |
| --------- | ------------------------- | ------------- | -------- |
| compute   | 15개 (user 9 + admin 6)    | 24개           | —        |
| container | 18개 Form + 12개 YAML = 30개 | —             | 12개      |
| iam       | 5개                        | 1개            | —        |
| storage   | 1개                        | 2개            | —        |


### 발견된 4가지 Create 패턴


| 패턴                      | 사용 앱                   | 구조                                                                                       | 비고                                         |
| ----------------------- | ---------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------ |
| **A. Accordion Wizard** | compute 전체, storage    | `CreateLayout` > `Accordion.Group` > `Accordion.Item` x N > `CardHeader(앱 로컬)` + `*Card` | 상태 관리 수동 (completedCards Set 등 보일러플레이트 반복) |
| **B. Stepper Wizard**   | IAM 2개만 (User, Role)   | `CreateLayout` > `Stepper` (내부 TcAccordion)                                              | 상태 머신 내장 (onComplete guard, dependsOn 등)   |
| **C. Tab Form**         | container FormPage 18개 | `CreateLayout` > 커스텀 Tab Bar > Section Cards                                             | 사이드바에 FloatingCard 사용                      |
| **D. YAML Editor**      | container 12개          | `Title` + `YamlEditor` (로컬)                                                              | CreateLayout 미사용                           |


### 핵심 불일치 사항


| #   | 문제                                                                                                                      | 심각도 | 영향 범위                                    |
| --- | ----------------------------------------------------------------------------------------------------------------------- | --- | ---------------------------------------- |
| 1   | **Stepper vs Accordion 이중 구현** — 동일 역할(wizard)을 compute는 Accordion 수동, IAM은 Stepper 내장으로 각각 구현                          | 높음  | 전 앱                                      |
| 2   | **CardHeader가 shared에 없음** — compute/storage 각자 앱 로컬 구현, container는 별도 SectionTitle                                     | 중간  | compute 15개 + storage 1개 + container 18개 |
| 3   | **Section Card 스타일 불일치** — compute(`computeCreateStyles`), container(`SECTION_CARD_CLASS`), IAM(Stepper 내장) 각각 다른 토큰/방식 | 중간  | 전 앱                                      |
| 4   | **사이드바 버튼 크기 불일치** — Instance/Volume은 `sm`, Network/LB는 `md`                                                            | 중간  | Network, LB 페이지                          |
| 5   | **FloatingCard 사용 불일치** — IAM만 미사용 (Typography.Text로 직접 구성)                                                             | 낮음  | IAM 5개                                   |
| 6   | **CreateLayout `contentGap` prop 미동작** — destructure만 하고 실제 미적용 (항상 gap-6 고정)                                           | 낮음  | shared 라이브러리                             |


### 수정 우선순위 제안

**P1 — 핵심 구조 (디자인 시스템 차원)**

1. `Stepper` 디자인 정렬 — compute accordion wizard 스타일과 시각적 통일
2. `CardHeader` shared 추출 — 앱 로컬 구현 통합
3. Section card 스타일 shared 토큰 통일

**P2 — 일관성 개선**
4. 사이드바 버튼 크기/레이아웃 표준화
5. FloatingCard 적용 표준화
6. CreateLayout `contentGap` 수정

### 논의

- **Stepper vs Accordion**: Stepper를 표준으로 채택하고 compute/storage를 마이그레이션할지, 아니면 Accordion wizard 패턴을 유지할지
- 컴포넌트 싱크 이후 **페이지 단위 정합성 작업**을 별도 진행할지
- 앱별 우선순위 — 어느 앱/페이지부터 맞출지
- 인라인 UI → shared 컴포넌트 전환 작업의 주체 (FE / 디자인 / 병렬)

---

## 5. 신규 컴포넌트 개발 순서

TDS에만 있고 shared에 없는 컴포넌트 5개의 개발 논의.

### 후보 목록


| 우선순위 | 컴포넌트                | 제안 주체   | 비고                            |
| ---- | ------------------- | ------- | ----------------------------- |
| P1   | SelectionIndicator  | 디자이너 선행 | selectable table 필수 UI, 로직 단순 |
| P1   | ProjectSelector     | 병렬      | 모든 앱 공통, 기존 TDS 구현 추출         |
| P2   | NotificationCenter  | 디자이너 선행 | 알림 목록, 읽음/안읽음                 |
| P2   | FileListCard        | 디자이너 선행 | 파일 업로드/첨부 표시                  |
| P2   | ExpandableChecklist | 디자이너 선행 | 부모+하위 체크박스, 권한 관리             |


### 논의

- 우선순위 동의 여부, FE팀 실제 필요도 기준 조정
- **컴포넌트화가 맞는지** 검증 — FE팀 사용 시나리오 확인 후 shared 등록 여부 결정
- 디자이너 선행 → FE 구현 핸드오프 프로세스 정의

---

## 6. 디자인 변경사항 반영 채널 정리

### 현황 — 업데이트해야 하는 곳이 너무 많음

기획/디자인 변경사항 발생 시 현재 **4개 채널**에 반영해야 함:


| 채널                         | 역할                           | 업데이트 주체       | 비고                |
| -------------------------- | ---------------------------- | ------------- | ----------------- |
| **Storybook**              | 컴포넌트 API/시각 확인 (개발자용)        | 코드 변경 시 자동 반영 | 코드와 1:1 — 유지 필수   |
| **TDS Design System Page** | 컴포넌트 스펙/토큰/패턴 문서 (디자이너+개발자용) | 수동 업데이트       | 코드 기반이라 비교적 관리 용이 |
| **Notion**                 | 기획/디자인 의사결정 기록               | 수동 업데이트       | 문서 유지 비용 높음       |
| **Figma**                  | 디자인 스펙/시안 제공                 | 수동 업데이트       | 변환 비용 높음          |


변경 한 건 발생 시 4곳 모두 업데이트 → 누락 발생 → 채널 간 불일치 → 어디가 최신인지 혼란

### 제안 — Figma 역할 축소

- **신규 컴포넌트 개발 시**: Figma로 시안 제공 (디자이너 → FE 핸드오프) — 유지
- **기존 컴포넌트 변경/업데이트**: Figma 반영 효용성이 낮다고 판단 — 코드(Storybook)가 이미 Single Source of Truth
- Figma 변환 작업에 들이는 시간 대비 실제 참조 빈도가 낮음

### 논의

- FE팀이 실제로 Figma를 참조하는 빈도와 상황은? (Storybook만으로 충분한지)
- 4개 채널 → **Storybook(구현) + TDS Page(스펙)** 2개로 줄일 수 있는지
- Notion 문서는 의사결정 로그로만 유지하고, 컴포넌트 스펙 문서는 TDS Page로 단일화하는 안
- Figma를 완전히 없애는 것이 아닌 **신규 컴포넌트 한정**으로 역할을 좁히는 안에 대한 의견
- 더 좋은 대안이 있는지 — 예: Storybook → Figma 자동 싱크 도구 활용 등

---

## 7. 질의응답

- 디자인 싱크 과정에서 FE팀이 겪은 문제사항
- 추가 질문이나 제안
- 작업 방식 개선이 필요한 부분