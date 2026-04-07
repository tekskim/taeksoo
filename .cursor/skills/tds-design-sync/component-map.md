# Component Map: TDS ↔ thaki-shared

> 이 파일은 3개 스킬 + 오케스트레이터가 공유하는 매핑 테이블입니다.
> 매핑 상태: `1:1` (직접 대응) | `partial` (부분 대응) | `none` (미대응)

## 매핑 상태 요약

- **1:1 대응**: 38개 — 디자인 싱크 대상 (우선)
- **부분 대응**: 16개 — 구조 차이 있으나 디자인 싱크 가능
- **미대응 (TDS에 없음)**: 12개 — thaki-shared 고유, 디자인 토큰 정렬만
- **미대응 (shared에 없음)**: 추후 신규 생성 대상

### 결정 사항 요약

- **부분 대응 16개**: 전부 `keep-sync` — shared 유지, 구조/API 차이 허용, TDS 디자인 토큰만 싱크
- **shared 고유 12개**: 전부 `skip` — 싱크 대상 제외
- **TDS 고유 11개**:
  - `shared 신규 생성`: NotificationCenter (1개)
  - `skip`: 나머지 10개 (Chip→Tag 대응, MetricCard 미사용, Drawer, InfoBox, ListToolbar, Menu, PageHeader, SectionCard, SelectionIndicator, Wizard)

## 1:1 대응 (38개)

> 싱크 상태: `머지` = dev에 머지됨 | `PR #N` = PR 오픈 (미머지) | `design-sync` = design-sync 브랜치에 잔여 후속 수정 있음 | `revert` = 머지 후 revert됨 | `—` = 미진행

| #   | thaki-shared       | TDS               | 비고                                                       | 싱크                        |
| --- | ------------------ | ----------------- | ---------------------------------------------------------- | --------------------------- |
| 1   | Badge              | Badge             |                                                            | 머지 #54/#56                |
| 2   | Breadcrumb         | Breadcrumb        |                                                            | PR #155                     |
| 3   | Button             | Button            |                                                            | 머지 #105 + PR #154         |
| 4   | Checkbox           | Checkbox          |                                                            | revert (#124→#142), PR #154 |
| 5   | ContextMenu        | ContextMenu       |                                                            | 머지 #133                   |
| 6   | CopyButton         | CopyButton        |                                                            | 머지 #54/#57                |
| 7   | DatePicker         | DatePicker        |                                                            | PR #156                     |
| 8   | Disclosure         | Disclosure        |                                                            | revert (#124→#142), PR #154 |
| 9   | FloatingCard       | FloatingCard      |                                                            | PR #156                     |
| 10  | FormField          | FormField         |                                                            | 머지 #99/#146               |
| 11  | InlineMessage      | InlineMessage     |                                                            | 머지 #104                   |
| 12  | Input              | Input             | TDS는 Input 폴더에 Textarea, NumberInput, SearchInput 포함 | 머지 #99/#127 + PR #153     |
| 13  | MonitoringToolbar  | MonitoringToolbar | 싱크 불필요                                                | skip                        |
| 14  | Pagination         | Pagination        |                                                            | PR #156                     |
| 15  | Password           | Password          |                                                            | 머지 #125                   |
| 16  | ProgressBar        | ProgressBar       |                                                            | 머지 #119                   |
| 17  | Skeleton           | Skeleton          | 싱크 불필요                                                | skip                        |
| 18  | StatusIndicator    | StatusIndicator   |                                                            | 머지 #130                   |
| 19  | TabBar             | TabBar            |                                                            | 머지 #125 + PR #153         |
| 20  | Table              | Table             |                                                            | PR #157                     |
| 21  | Toast              | Toast             |                                                            | 대기 (싱크 예정)            |
| 22  | Toggle             | Toggle            |                                                            | 머지 #99                    |
| 23  | Tooltip            | Tooltip           |                                                            | 머지 #130                   |
| 24  | Accordion          | Accordion         |                                                            | 머지 #52/#120               |
| 25  | Tag                | Tag               | multiSelect 스타일 수정 완료                               | 완료 (PR #158)              |
| 26  | Textarea           | Textarea          | TDS는 Input 폴더 내                                        | 머지 #130                   |
| 27  | Tabs               | Tabs              |                                                            | 머지 #125 + PR #153         |
| 28  | Popover            | Popover           | shared Portal이 저수준 대응 (스토리북: Overlay/Popover)    | skip                        |
| 29  | RadioButton        | Radio             | RadioGroup에 포함                                          | skip                        |
| 30  | RadioGroup         | RadioGroup        | TDS는 Radio 폴더 내                                        | PR #154                     |
| 31  | Dropdown           | Select + Dropdown | TDS Select가 주 대응                                       | 머지 #129                   |
| 32  | Sidebar            | SNBMenuItem       | partial, 사이드바 메뉴 아이템                              | 머지 #127                   |
| 33  | LoadingSpinner     | Loading (Spinner) | 이름 차이, TDS SpinnerPage 참조                            | 대기 (싱크 예정)            |
| 34  | Range              | Slider            | 이름 차이                                                  | 보류                        |
| 35  | Fieldset           | SectionCard       | 역할 유사, 토큰 정렬                                       | 대기 (싱크 예정)            |
| 36  | FrameControls      | WindowControl     | 이름 차이                                                  | PR #155                     |
| 37  | NavigationControls | TopBar            | 네비게이션 부분                                            | PR #155                     |
| 38  | ToolBar            | TopBar            | TDS TopBar가 대응                                          | PR #155                     |

## 부분 대응 (16개)

> **결정**: 전부 `keep-sync` — shared 컴포넌트 유지, 구조/API 차이 허용, TDS 디자인 토큰(색상, 간격, radius, 타이포그래피)만 싱크

| #   | thaki-shared                 | TDS 대응                | 비고                                 | 결정       | 싱크                          |
| --- | ---------------------------- | ----------------------- | ------------------------------------ | ---------- | ----------------------------- |
| 1   | ActionModal                  | Modal + ConfirmModal    | shared는 단일 컴포넌트, TDS는 분리   | keep-as-is | PR #157                       |
| 2   | DeleteResourceModal          | ConfirmModal            | TDS ConfirmModal의 danger variant    | keep-sync  | ActionModal 반영으로 완료     |
| 3   | ResourceActionModal          | ConfirmModal            | TDS ConfirmModal의 variant           | keep-sync  | ActionModal 반영으로 완료     |
| 4   | AppLayout                    | PageShell               | 전체 레이아웃 구조 차이              | keep-sync  | 머지 #127                     |
| 5   | CreateLayout                 | Wizard (SectionCard)    | TDS는 SectionCard + Wizard 패턴      | keep-sync  | PR #157                       |
| 6   | DetailCard                   | SectionCard.DataRow     | TDS는 SectionCard 내 DataRow         | keep-sync  | 머지 #128                     |
| 7   | DetailPageHeader             | DetailHeader            | 구조 차이 (compound vs flat)         | keep-sync  | 머지 #128 + PR #153           |
| 8   | EmptyUI                      | EmptyState              | 이름+API 차이                        | skip       | skip                          |
| 9   | Error (403/404/500)          | ErrorState              | TDS는 범용 ErrorState                | skip       | skip                          |
| 10  | FilterSearch                 | FilterSearchInput       | TDS Input 폴더 내 포함               | keep-sync  | 머지 #121/#123/#128 + PR #153 |
| 11  | InfoContainer                | InfoBox                 | 이름+API 차이, 토큰만 정렬           | keep-sync  | 대기 (싱크 예정)              |
| 12  | Layout (Stack/VStack/HStack) | VStack/HStack/Container | TDS는 개별 컴포넌트, 토큰만 정렬     | keep-sync  | 대기 (싱크 예정)              |
| 13  | MultiItemDisplay             | BadgeList               | 역할 동일, API 차이                  | keep-sync  | 대기 (싱크 예정)              |
| 14  | TabContainer                 | Tabs (TabPanel)         | 탭 기반 라우팅 컨테이너, 싱크 불필요 | skip       | skip                          |
| 15  | TabSelector                  | Tabs (variant)          | TDS Tabs의 boxed variant             | keep-sync  | 대기 (싱크 예정)              |
| 16  | Title                        | PageHeader              | 단순 h2 래퍼, 구조 차이 큼           | skip       | skip                          |

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

## 미대응 — TDS 고유 (shared에 없음)

| #   | TDS                         | 비고                                      | 결정            |
| --- | --------------------------- | ----------------------------------------- | --------------- |
| 1   | Chip                        | shared Tag로 대응 가능                    | skip (Tag 대응) |
| 2   | Drawer                      | shared Overlay.Template drawer-horizontal | skip            |
| 3   | InfoBox                     | shared InfoContainer가 부분 대응          | skip            |
| 4   | ListToolbar                 | shared에 대응 없음                        | skip            |
| 5   | Menu (MenuItem/MenuSection) | shared ContextMenu 내 포함                | skip            |
| 6   | MetricCard                  | shared에 대응 없음                        | skip (미사용)   |
| 7   | NotificationCenter          | shared에 대응 없음                        | **shared 신규** |
| 8   | PageHeader                  | shared Title이 부분 대응                  | skip            |
| 9   | SectionCard                 | shared Fieldset + DetailCard가 부분 대응  | skip            |
| 10  | SelectionIndicator          | shared에 대응 없음                        | skip            |
| 11  | Wizard                      | shared CreateLayout이 부분 대응           | skip            |

## 싱크 진행 현황

### dev 머지 완료 (배치 PR)

| PR   | 브랜치     | 컴포넌트                                                | 상태          |
| ---- | ---------- | ------------------------------------------------------- | ------------- |
| #124 | ds-batch-1 | Checkbox, Disclosure, Tokens                            | revert (#142) |
| #125 | ds-batch-2 | Password, Tabs, TabBar                                  | 머지          |
| #127 | ds-batch-4 | Sidebar, AppLayout, Input                               | 머지          |
| #128 | ds-batch-5 | FilterSearch, SearchInput, DetailCard, DetailPageHeader | 머지          |
| #129 | ds-batch-6 | NumberInput, Dropdown                                   | 머지          |
| #130 | ds-batch-7 | Textarea, StatusIndicator, Tooltip                      | 머지          |
| #135 | —          | Card 컴포넌트 + semantic 토큰 정렬                      | 머지          |
| #137 | —          | 색상 토큰 싱크                                          | 머지          |
| #146 | ds-batch-9 | FormField                                               | 머지          |

### dev 미머지 — file-checkout 배치 (PR OPEN)

> 기존 #126/#131/#139 닫고 file-checkout 방식으로 재생성 (4/6)

| PR   | 브랜치     | 컴포넌트                                                    | 비고                     |
| ---- | ---------- | ----------------------------------------------------------- | ------------------------ |
| #153 | ds-batch-1 | Input, FilterSearch, Tabs, TabBar, DetailPageHeader + 토큰  | 4/6 OPEN (후속수정+토큰) |
| #154 | ds-batch-2 | Checkbox, RadioGroup, Disclosure, Button + shared-utilities | 4/6 OPEN (Form Controls) |
| #155 | ds-batch-3 | FrameControls, NavigationControls, ToolBar, Breadcrumb      | 4/6 OPEN (TopBar 영역)   |
| #156 | ds-batch-4 | DatePicker, DateRangePicker, Pagination, FloatingCard       | 4/6 OPEN (날짜+유틸리티) |
| #157 | ds-batch-5 | Table, TcTable, ActionModal, CreateLayout                   | 4/6 OPEN (테이블+기타)   |

### 닫은 PR (재생성으로 대체)

| PR   | 브랜치      | 컴포넌트                                                   | 사유                                          |
| ---- | ----------- | ---------------------------------------------------------- | --------------------------------------------- |
| #126 | ds-batch-3  | FrameControls, TopBar, Breadcrumb                          | cherry-pick 방식, 후속수정 누락 → #155로 대체 |
| #131 | ds-batch-8  | Pagination, DatePicker, Button, FloatingCard, CreateLayout | 62파일 포함 (타이틀과 불일치) → 분할 대체     |
| #139 | design-sync | RadioGroup, ActionModal, Table                             | 63파일 포함 (타이틀과 불일치) → 분할 대체     |

### 요약

- **1:1 대응 (38개)**: 머지 15개 + revert→PR복구 2개 + PR OPEN 12개 + 완료 1개 + skip 4개 = 34/38 진행, **싱크 예정 3개** (Toast, LoadingSpinner, Fieldset) + **보류 1개** (Range)
- **부분 대응 (16개)**: 머지 4개 + PR OPEN 3개 + 완료 2개 + skip 3개 = 12/16 진행, **싱크 예정 4개** (InfoContainer, Layout, MultiItemDisplay, TabSelector)
- **머지된 컴포넌트 레벨 PR**: #52/#54/#56/#57/#99/#104/#105/#119/#120/#121/#123/#133
- **design-sync 브랜치**: 유지 중 (모든 배치 머지 후 diff=0 확인 시 정리)
- **남은 싱크 작업**: 7개 (Toast, LoadingSpinner, Fieldset, InfoContainer, Layout, MultiItemDisplay, TabSelector) + 보류 1개 (Range)
