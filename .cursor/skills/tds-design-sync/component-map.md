# Component Map: TDS ↔ thaki-shared

> 이 파일은 3개 스킬 + 오케스트레이터가 공유하는 매핑 테이블입니다.
> 매핑 상태: `1:1` (직접 대응) | `partial` (부분 대응) | `none` (미대응)

## 매핑 상태 요약

- **1:1 대응**: 38개 — 디자인 싱크 대상 (우선)
- **부분 대응**: 16개 — 구조 차이 있으나 디자인 싱크 가능
- **미대응 (TDS에 없음)**: 12개 — thaki-shared 고유, 디자인 토큰 정렬만
- **미대응 (shared에 없음)**: 15개 — 신규 생성 or skip
- **누락 UI**: 6개 — 패턴/가이드라인/신규 개발 검토 대상

### 결정 사항 요약

- **부분 대응 16개**: 전부 `keep-sync` — shared 유지, 구조/API 차이 허용, TDS 디자인 토큰만 싱크
- **shared 고유 12개**: 전부 `skip` — 싱크 대상 제외
- **TDS 고유 15개**:
  - `shared 신규 생성`: FileListCard, ExpandableChecklist, NotificationCenter, ProjectSelector (4개) + SelectionIndicator (머지 완료)
  - `싱크 검토`: Card (shared Card와 구조 비교 필요) (1개)
  - `skip`: 나머지 9개 (Chip→Tag 대응, MetricCard 미사용, Drawer, InfoBox, ListToolbar, Menu, PageHeader, SectionCard, Wizard)
- **누락 UI 6개**: 패턴 유지 4개 + shared 확장 1개 + 앱 레벨 유지 1개

## 1:1 대응 (38개)

> 싱크 상태: `머지` = dev에 머지됨 | `PR #N` = PR 오픈 (미머지) | `design-sync` = design-sync 브랜치에 잔여 후속 수정 있음 | `revert` = 머지 후 revert됨 | `—` = 미진행

| #   | thaki-shared       | TDS               | 비고                                                                     | 싱크                               |
| --- | ------------------ | ----------------- | ------------------------------------------------------------------------ | ---------------------------------- |
| 1   | Badge              | Badge             |                                                                          | 머지 #54/#56/#167                  |
| 2   | Breadcrumb         | Breadcrumb        |                                                                          | 머지 #155                          |
| 3   | Button             | Button            |                                                                          | 머지 #105/#154                     |
| 4   | Checkbox           | Checkbox          |                                                                          | 머지 (revert #124→#142, 재PR #154) |
| 5   | ContextMenu        | ContextMenu       |                                                                          | 머지 #133/#165                     |
| 6   | CopyButton         | CopyButton        |                                                                          | 머지 #54/#57                       |
| 7   | DatePicker         | DatePicker        |                                                                          | PR #156                            |
| 8   | Disclosure         | Disclosure        |                                                                          | 머지 (revert #124→#142, 재PR #154) |
| 9   | FloatingCard       | FloatingCard      |                                                                          | PR #156                            |
| 10  | FormField          | FormField         |                                                                          | 머지 #99/#146                      |
| 11  | InlineMessage      | InlineMessage     |                                                                          | 머지 #104/#169                     |
| 12  | Input              | Input             | TDS는 Input 폴더에 Textarea, NumberInput, SearchInput 포함               | 머지 #99/#127/#153                 |
| 13  | MonitoringToolbar  | MonitoringToolbar | 싱크 불필요                                                              | skip                               |
| 14  | Pagination         | Pagination        |                                                                          | PR #156                            |
| 15  | Password           | Password          |                                                                          | 머지 #125                          |
| 16  | ProgressBar        | ProgressBar       |                                                                          | 머지 #119                          |
| 17  | Skeleton           | Skeleton          | 싱크 불필요                                                              | skip                               |
| 18  | StatusIndicator    | StatusIndicator   |                                                                          | 머지 #130/#180                     |
| 19  | TabBar             | TabBar            |                                                                          | 머지 #125/#153                     |
| 20  | Table              | Table             |                                                                          | 머지 #157                          |
| 21  | Toast              | Toast             |                                                                          | 대기 (싱크 예정)                   |
| 22  | Toggle             | Toggle            |                                                                          | 머지 #99                           |
| 23  | Tooltip            | Tooltip           |                                                                          | 머지 #130                          |
| 24  | Accordion          | Accordion         |                                                                          | 머지 #52/#120                      |
| 25  | Tag                | Tag               | multiSelect 스타일 수정 완료                                             | 머지 #157/#158                     |
| 26  | Textarea           | Textarea          | TDS는 Input 폴더 내                                                      | 머지 #130                          |
| 27  | Tabs               | Tabs              |                                                                          | 머지 #125/#153                     |
| 28  | Popover            | Popover           | shared Portal이 저수준 대응 (스토리북: Overlay/Popover)                  | skip                               |
| 29  | RadioButton        | Radio             | RadioGroup에 포함                                                        | skip                               |
| 30  | RadioGroup         | RadioGroup        | TDS는 Radio 폴더 내                                                      | 머지 #154                          |
| 31  | Dropdown           | Select + Dropdown | TDS Select가 주 대응                                                     | 머지 #129                          |
| 32  | Sidebar            | SNBMenuItem       | partial, 사이드바 메뉴 아이템                                            | 머지 #127/#172                     |
| 33  | LoadingSpinner     | Loading (Spinner) | 이름 차이, TDS SpinnerPage 참조                                          | PR #186                            |
| 34  | Range              | Slider            | 이름 차이, 구현 방식 상이 (native input vs custom div), 시각적 차이 미미 | skip                               |
| 35  | Fieldset           | SectionCard       | 역할 상이 (폼 그룹 vs 읽기 카드), 토큰 정렬 효과 미미                    | skip                               |
| 36  | FrameControls      | WindowControl     | 이름 차이                                                                | 머지 #155                          |
| 37  | NavigationControls | TopBar            | 네비게이션 부분                                                          | 머지 #155                          |
| 38  | ToolBar            | TopBar            | TDS TopBar가 대응                                                        | 머지 #155                          |

## 부분 대응 (16개)

> **결정**: 전부 `keep-sync` — shared 컴포넌트 유지, 구조/API 차이 허용, TDS 디자인 토큰(색상, 간격, radius, 타이포그래피)만 싱크

| #   | thaki-shared                 | TDS 대응                | 비고                                                            | 결정       | 싱크                      |
| --- | ---------------------------- | ----------------------- | --------------------------------------------------------------- | ---------- | ------------------------- |
| 1   | ActionModal                  | Modal + ConfirmModal    | shared는 단일 컴포넌트, TDS는 분리                              | keep-as-is | 머지 #157                 |
| 2   | DeleteResourceModal          | ConfirmModal            | TDS ConfirmModal의 danger variant                               | keep-sync  | ActionModal 반영으로 완료 |
| 3   | ResourceActionModal          | ConfirmModal            | TDS ConfirmModal의 variant                                      | keep-sync  | ActionModal 반영으로 완료 |
| 4   | AppLayout                    | PageShell               | 전체 레이아웃 구조 차이                                         | keep-sync  | 머지 #127/#172            |
| 5   | CreateLayout                 | Wizard (SectionCard)    | TDS는 SectionCard + Wizard 패턴                                 | keep-sync  | 머지 #157                 |
| 6   | DetailCard                   | SectionCard.DataRow     | TDS는 SectionCard 내 DataRow                                    | keep-sync  | 머지 #128                 |
| 7   | DetailPageHeader             | DetailHeader            | 구조 차이 (compound vs flat)                                    | keep-sync  | 머지 #128/#153            |
| 8   | EmptyUI                      | EmptyState              | 이름+API 차이                                                   | skip       | skip                      |
| 9   | Error (403/404/500)          | ErrorState              | TDS는 범용 ErrorState                                           | skip       | skip                      |
| 10  | FilterSearch                 | FilterSearchInput       | TDS Input 폴더 내 포함                                          | keep-sync  | 머지 #121/#123/#128/#153  |
| 11  | InfoContainer                | InfoBox                 | 이름+API 차이, 토큰만 정렬                                      | keep-sync  | 머지 #161                 |
| 12  | Layout (Stack/VStack/HStack) | VStack/HStack/Container | flex wrapper, gap 체계만 다르고 시각 차이 없음                  | skip       | skip                      |
| 13  | MultiItemDisplay             | BadgeList               | 근본적으로 다른 컴포넌트 (텍스트 vs Badge 기반). 신규 생성 필요 | keep-sync  | **shared 신규 생성 대기** |
| 14  | TabContainer                 | Tabs (TabPanel)         | 탭 기반 라우팅 컨테이너, 싱크 불필요                            | skip       | skip                      |
| 15  | TabSelector                  | Tabs (variant)          | TDS Tabs의 boxed variant                                        | keep-sync  | 머지 #161                 |
| 16  | Title                        | PageHeader              | 단순 h2 래퍼, 구조 차이 큼                                      | skip       | skip                      |

## 미대응 — thaki-shared 고유 (12개)

> **결정**: 전부 `skip` — 싱크 대상에서 제외, 현상 유지

| #   | thaki-shared          | 비고                                              | 결정 |
| --- | --------------------- | ------------------------------------------------- | ---- |
| 1   | AppIcon               | 앱별 아이콘 (Compute, IAM 등), 디자인 토큰 정렬만 | skip |
| 2   | CardList              | 카드 리스트 뷰, TDS에 대응 없음                   | skip |
| 3   | ChartToggle           | 차트 토글, 모니터링 전용                          | skip |
| 4   | ChartTooltip          | 차트 툴팁, 모니터링 전용                          | skip |
| 5   | Dim                   | 오버레이 딤, TDS Modal/Drawer 내장                | skip |
| 6   | Editor (PromptEditor) | 프롬프트 에디터, AI 전용                          | skip |
| 7   | ErrorBoundary         | 유틸리티 컴포넌트, 스타일 없음                    | skip |
| 8   | Icon                  | SVG 아이콘 시스템, TDS는 Tabler Icons 사용        | skip |
| 9   | LangButton            | 언어 전환 버튼                                    | skip |
| 10  | Portal                | 유틸리티 컴포넌트, 스타일 없음                    | skip |
| 11  | RefreshButton         | 새로고침 버튼                                     | skip |
| 12  | Terminal              | 터미널 컴포넌트, 전용                             | skip |

## 미대응 — TDS 고유 (shared에 없음, 15개)

| #   | TDS                         | 비고                                                           | 결정            | 우선순위 |
| --- | --------------------------- | -------------------------------------------------------------- | --------------- | -------- |
| 1   | Chip                        | shared Tag로 대응 가능                                         | skip (Tag 대응) | —        |
| 2   | Drawer                      | shared Overlay.Template drawer-horizontal                      | skip            | —        |
| 3   | InfoBox                     | shared InfoContainer가 부분 대응                               | skip            | —        |
| 4   | ListToolbar                 | shared에 대응 없음                                             | skip            | —        |
| 5   | Menu (MenuItem/MenuSection) | shared ContextMenu 내 포함                                     | skip            | —        |
| 6   | MetricCard                  | shared에 대응 없음                                             | skip (미사용)   | —        |
| 7   | NotificationCenter          | shared에 대응 없음                                             | **shared 신규** | P2       |
| 8   | PageHeader                  | shared Title이 부분 대응                                       | skip            | —        |
| 9   | SectionCard                 | shared Fieldset + DetailCard가 부분 대응                       | skip            | —        |
| 10  | SelectionIndicator          | shared에 신규 생성 완료                                        | 머지            | —        |
| 11  | Wizard                      | shared CreateLayout이 부분 대응                                | skip            | —        |
| 12  | FileListCard                | shared에 대응 없음. 파일 업로드/첨부 표시, storage/IAM 등 활용 | **shared 신규** | P2       |
| 13  | ExpandableChecklist         | shared에 대응 없음. 부모+하위 체크박스 접기/펴기, 권한 관리 등 | **shared 신규** | P2       |
| 14  | Card                        | shared Card 존재하지만 TDS Card와 구조/API 다름                | **싱크 검토**   | P4       |
| 15  | ProjectSelector             | 앱 컴포넌트 → DS화 검토. 모든 앱 공통 프로젝트 전환 UI         | **shared 신규** | P1       |

## 누락 UI — 패턴 / 가이드라인 / 신규 개발 (6개)

> 컴포넌트 매핑과 별개로, 누락된 UI 요소들을 정리한다.
> 분류: `패턴 유지` = DS 컴포넌트화 불필요, 기존 조합으로 충분 | `shared 확장` = 기존 shared 컴포넌트에 variant 추가 | `앱 유지` = 앱 레벨 유지

| #   | 항목                           | 현재 상태                                                                                         | 분류         | 작업 주체        | 우선순위 | 비고                                                                             |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------- | ------------ | ---------------- | -------- | -------------------------------------------------------------------------------- |
| 1   | Snackbar / Global Notification | TDS: 가이드라인 페이지만 존재 (SnackbarPage, GlobalNotificationPanelPage). Toast DS 컴포넌트 있음 | 패턴 유지    | 디자이너 선행    | P3       | Snackbar = Toast variant로 처리 가능. Global Notification Panel은 앱 레벨 패턴   |
| 2   | Create page multi-tab          | Storage에서 TabBar + PageShell + Wizard 조합으로 구현                                             | 패턴 유지    | 디자이너 선행    | P3       | 패턴 가이드 문서 추가로 충분. 별도 컴포넌트 불필요                               |
| 3   | Shell pattern                  | ShellPanel — 앱 레벨 컴포넌트 (bottom terminal panel)                                             | 앱 유지      | FE 선행 (필요시) | P4       | Terminal/Console은 도메인 특화. BottomPanel 컨테이너 shared 추가 검토 가능       |
| 4   | Dynamic form field             | FormPatternsPage — 8가지 패턴 카탈로그 (Key-Value, Ports 등)                                      | 패턴 유지    | FE 선행 (필요시) | P3       | DynamicRows 유틸리티 컴포넌트(행 추가/삭제 + grid wrapper) shared 추가 검토 가능 |
| 5   | Pie 차트 종류 추가             | shared: PieChart + DonutChart (full/half). ECharts 기반                                           | shared 확장  | FE 선행          | P2       | nested pie, rose chart 등 variant 추가. ECharts 설정이 핵심                      |
| 6   | DateRangePicker 추가           | TDS: DateRangePicker 있음, shared DatePicker range mode 지원                                      | 싱크 진행 중 | —                | —        | PR #156에서 처리 중. 추가 작업 불필요                                            |

### 작업 주체 원칙

- **디자이너 선행 (Design-first)**: 순수 UI, 로직 단순, 시각적 스펙이 중요 → 디자이너가 Figma 디자인 + 로직 없는 PR 생성, FE가 기능 구현
- **FE 선행 (Code-first)**: 복잡한 인터랙션/상태 로직이 핵심, 기술적 제약 확인 필요 → FE가 프로토타입 후 디자이너와 협업
- **병렬 (Parallel)**: 디자인과 구현이 독립적으로 진행 가능

### shared 신규 생성 대상 워크플로우

| 항목                | 주체          | 이유                                                               |
| ------------------- | ------------- | ------------------------------------------------------------------ |
| SelectionIndicator  | 디자이너 선행 | 로직 단순 (chip 나열). 시각적 스펙(높이, 간격, 애니메이션)이 핵심  |
| FileListCard        | 디자이너 선행 | 로직 단순 (파일 목록 표시). 카드 구조, 메타데이터 레이아웃이 핵심  |
| ExpandableChecklist | 디자이너 선행 | 로직 단순 (체크박스 + 접기/펴기). 들여쓰기, 아이콘, 상태 표현      |
| NotificationCenter  | 디자이너 선행 | UI 위주 (알림 목록). 읽음/안읽음 상태, 카드 레이아웃이 핵심        |
| ProjectSelector     | 병렬          | 디자이너: 통합 디자인 스펙. FE: 기존 TDS 구현을 shared로 추출      |
| Pie 차트 종류 추가  | FE 선행       | ECharts 설정이 핵심. 기술적 가능 variant 파악 후 디자이너가 가이드 |

## 싱크 진행 현황

### dev 머지 완료 (배치 PR)

| PR   | 브랜치                 | 컴포넌트                                                    | 상태          |
| ---- | ---------------------- | ----------------------------------------------------------- | ------------- |
| #124 | ds-batch-1             | Checkbox, Disclosure, Tokens                                | revert (#142) |
| #125 | ds-batch-2             | Password, Tabs, TabBar                                      | 머지          |
| #127 | ds-batch-4             | Sidebar, AppLayout, Input                                   | 머지          |
| #128 | ds-batch-5             | FilterSearch, SearchInput, DetailCard, DetailPageHeader     | 머지          |
| #129 | ds-batch-6             | NumberInput, Dropdown                                       | 머지          |
| #130 | ds-batch-7             | Textarea, StatusIndicator, Tooltip                          | 머지          |
| #135 | —                      | Card 컴포넌트 + semantic 토큰 정렬                          | 머지          |
| #137 | —                      | 색상 토큰 싱크                                              | 머지          |
| #146 | ds-batch-9             | FormField                                                   | 머지          |
| #153 | ds-batch-1             | Input, FilterSearch, Tabs, TabBar, DetailPageHeader + 토큰  | 머지          |
| #154 | ds-batch-2             | Checkbox, RadioGroup, Disclosure, Button + shared-utilities | 머지          |
| #155 | ds-batch-3             | FrameControls, NavigationControls, ToolBar, Breadcrumb      | 머지          |
| #157 | ds-batch-5             | Table, TcTable, ActionModal, CreateLayout, Tag              | 머지          |
| #158 | —                      | Overlay footer 리팩토링                                     | 머지          |
| #161 | ds-batch-6             | InfoContainer, TabSelector                                  | 머지          |
| #162 | —                      | Sidebar focus 수정                                          | 머지          |
| #163 | —                      | TcTable sticky column 수정                                  | 머지          |
| #165 | —                      | ContextMenu (추가 싱크)                                     | 머지          |
| #167 | —                      | Badge (추가 싱크)                                           | 머지          |
| #169 | —                      | InlineMessage (추가 싱크)                                   | 머지          |
| #171 | style/dark-mode-tokens | 다크모드 토큰                                               | 머지          |
| #172 | —                      | AppLayout (sidebar header)                                  | 머지          |
| #178 | ds-focus-visible       | Checkbox, Radio, Toggle focus-visible                       | 머지          |
| #180 | —                      | StatusIndicator (아이콘 정책 적용)                          | 머지          |

### dev 미머지 — PR OPEN

| PR   | 브랜치     | 컴포넌트                             | 비고                 |
| ---- | ---------- | ------------------------------------ | -------------------- |
| #156 | ds-batch-4 | DatePicker, Pagination, FloatingCard | OPEN (날짜+유틸리티) |
| #183 | —          | TcTable                              | OPEN (추가 싱크)     |
| #186 | —          | LoadingSpinner, LoadingProgress      | OPEN                 |

### 닫은 PR (재생성으로 대체)

| PR   | 브랜치      | 컴포넌트                                                   | 사유                                          |
| ---- | ----------- | ---------------------------------------------------------- | --------------------------------------------- |
| #126 | ds-batch-3  | FrameControls, TopBar, Breadcrumb                          | cherry-pick 방식, 후속수정 누락 → #155로 대체 |
| #131 | ds-batch-8  | Pagination, DatePicker, Button, FloatingCard, CreateLayout | 62파일 포함 (타이틀과 불일치) → 분할 대체     |
| #139 | design-sync | RadioGroup, ActionModal, Table                             | 63파일 포함 (타이틀과 불일치) → 분할 대체     |

### 요약

- **1:1 대응 (38개)**: 머지 27개 + PR OPEN 4개 + skip 6개 = 37/38 진행, **싱크 예정 1개** (Toast)
- **부분 대응 (16개)**: 머지 10개 + 완료 2개 + skip 6개 = 18/16 진행 (MultiItemDisplay → shared 신규 생성 대기로 재분류)
- **TDS 고유 (15개)**: shared 신규 4개 (FileListCard, ExpandableChecklist, NotificationCenter, ProjectSelector) + 머지 1개 (SelectionIndicator) + 싱크 검토 1개 (Card) + skip 9개
- **누락 UI (6개)**: 패턴 유지 3개 (Snackbar/Notification, Create multi-tab, Dynamic form) + shared 확장 1개 (Pie 차트) + 앱 유지 1개 (Shell) + 싱크 진행 중 1개 (DateRangePicker)
- **머지된 PR (총 24건)**: #52/#54/#56/#57/#99/#104/#105/#119/#120/#121/#123/#125/#127~#130/#133/#135/#137/#146/#153~#155/#157/#158/#161~#163/#165/#167/#169/#171/#172/#178/#180
- **design-sync 브랜치**: 유지 중 (모든 배치 머지 후 diff=0 확인 시 정리)

---

### 추가 진행할 싱크 작업 정리

#### A. OPEN PR — 머지 대기 (3건)

| PR   | 컴포넌트                             | 상태 | 비고                                |
| ---- | ------------------------------------ | ---- | ----------------------------------- |
| #156 | DatePicker, Pagination, FloatingCard | OPEN | 아이콘 정책 수정 완료, FE 리뷰 대기 |
| #183 | TcTable                              | OPEN | 추가 싱크                           |
| #186 | LoadingSpinner, LoadingProgress      | OPEN | TDS Loading 대응                    |

#### B. 미진행 싱크 — 기존 컴포넌트 (1개)

| 컴포넌트 | 대응 유형 | TDS 대응 | 작업 내용        | 우선순위 |
| -------- | --------- | -------- | ---------------- | -------- |
| Toast    | 1:1       | Toast    | 디자인 토큰 싱크 | P1       |

#### C. Skip (4개)

| 컴포넌트 | TDS 대응      | Skip 사유                                                                     |
| -------- | ------------- | ----------------------------------------------------------------------------- |
| Range    | Slider        | 구현 방식 상이 (native input vs custom div), 토큰 대부분 일치, 시각 차이 미미 |
| Layout   | VStack/HStack | flex wrapper, gap 체계만 다르고 시각 차이 없음                                |
| Fieldset | SectionCard   | 역할 상이 (폼 그룹 vs 읽기 카드), 토큰 정렬 효과 미미                         |

#### D. shared 신규 생성 대기 (5개 + 1개 확장)

| 컴포넌트                      | 우선순위 | 작업 주체     | 비고                                                 |
| ----------------------------- | -------- | ------------- | ---------------------------------------------------- |
| ~~SelectionIndicator~~        | ~~P1~~   | —             | ✅ 머지 완료                                         |
| ProjectSelector               | P1       | 병렬          | 모든 앱 공통, 기존 TDS 구현 추출                     |
| MultiItemDisplay (→BadgeList) | P2       | 디자이너 선행 | shared 신규 생성 (현재 텍스트 기반 → Badge 기반으로) |
| NotificationCenter            | P2       | 디자이너 선행 | 알림 목록, 읽음/안읽음                               |
| FileListCard                  | P2       | 디자이너 선행 | 파일 업로드/첨부 표시                                |
| ExpandableChecklist           | P2       | 디자이너 선행 | 부모+하위 체크박스 접기/펴기, 권한 관리              |
| Pie 차트 종류 추가            | P2       | FE 선행       | shared PieChart 확장 (nested pie 등)                 |

#### E. 싱크 검토 (1개)

| 컴포넌트 | 상태                                       | 우선순위 |
| -------- | ------------------------------------------ | -------- |
| Card     | shared Card vs TDS Card 구조/API 비교 필요 | P4       |
