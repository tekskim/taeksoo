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
  - `TDS 구현`: MetricCard (1개, shared에는 생성 안 함)
  - `보류`: Chip (1개, Tag와의 관계 재검토 필요)
  - `skip`: 나머지 8개 (Drawer, InfoBox, ListToolbar, Menu, PageHeader, SectionCard, SelectionIndicator, Wizard)

## 1:1 대응 (38개)

> 싱크 상태: `머지` = 컴포넌트 레벨 PR 머지됨 | `PR #N` = 배치 PR 오픈 | `—` = 미진행

| #   | thaki-shared       | TDS               | 비고                                                       | 싱크                |
| --- | ------------------ | ----------------- | ---------------------------------------------------------- | ------------------- |
| 1   | Badge              | Badge             |                                                            | 머지 #54/#56        |
| 2   | Breadcrumb         | Breadcrumb        |                                                            | PR #126             |
| 3   | Button             | Button            |                                                            | 머지 #105 + PR #131 |
| 4   | Checkbox           | Checkbox          |                                                            | PR #124             |
| 5   | ContextMenu        | ContextMenu       |                                                            | 머지 #133           |
| 6   | CopyButton         | CopyButton        |                                                            | 머지 #54/#57        |
| 7   | DatePicker         | DatePicker        |                                                            | PR #131             |
| 8   | Disclosure         | Disclosure        |                                                            | PR #124             |
| 9   | FloatingCard       | FloatingCard      |                                                            | —                   |
| 10  | FormField          | FormField         |                                                            | 머지 #99            |
| 11  | InlineMessage      | InlineMessage     |                                                            | 머지 #104           |
| 12  | Input              | Input             | TDS는 Input 폴더에 Textarea, NumberInput, SearchInput 포함 | 머지 #99 + PR #127  |
| 13  | MonitoringToolbar  | MonitoringToolbar |                                                            | —                   |
| 14  | Pagination         | Pagination        |                                                            | PR #131             |
| 15  | Password           | Password          |                                                            | PR #125             |
| 16  | ProgressBar        | ProgressBar       |                                                            | 머지 #119           |
| 17  | Skeleton           | Skeleton          |                                                            | —                   |
| 18  | StatusIndicator    | StatusIndicator   |                                                            | PR #130             |
| 19  | TabBar             | TabBar            |                                                            | PR #125             |
| 20  | Table              | Table             |                                                            | —                   |
| 21  | Toast              | Toast             |                                                            | —                   |
| 22  | Toggle             | Toggle            |                                                            | 머지 #99            |
| 23  | Tooltip            | Tooltip           |                                                            | PR #130             |
| 24  | Accordion          | Accordion         |                                                            | 머지 #52/#120       |
| 25  | Tag                | Tag               |                                                            | —                   |
| 26  | Textarea           | Textarea          | TDS는 Input 폴더 내                                        | PR #130             |
| 27  | Tabs               | Tabs              |                                                            | PR #125             |
| 28  | Popover            | Popover           | shared에 별도 Popover 없음, Tooltip에 통합 가능            | —                   |
| 29  | RadioButton        | Radio             | 이름 차이                                                  | —                   |
| 30  | RadioGroup         | RadioGroup        | TDS는 Radio 폴더 내                                        | —                   |
| 31  | Dropdown           | Select + Dropdown | TDS Select가 주 대응                                       | PR #129             |
| 32  | Sidebar            | SNBMenuItem       | partial, 사이드바 메뉴 아이템                              | PR #127             |
| 33  | LoadingSpinner     | Loading           | 이름 차이                                                  | —                   |
| 34  | Range              | Slider            | 이름 차이                                                  | —                   |
| 35  | Fieldset           | SectionCard       | 역할 유사                                                  | —                   |
| 36  | FrameControls      | WindowControl     | 이름 차이                                                  | PR #126             |
| 37  | NavigationControls | TopBar            | 네비게이션 부분                                            | PR #126             |
| 38  | ToolBar            | TopBar            | TDS TopBar가 대응                                          | PR #126             |

## 부분 대응 (16개)

> **결정**: 전부 `keep-sync` — shared 컴포넌트 유지, 구조/API 차이 허용, TDS 디자인 토큰(색상, 간격, radius, 타이포그래피)만 싱크

| #   | thaki-shared                 | TDS 대응                | 비고                               | 결정       | 싱크                     |
| --- | ---------------------------- | ----------------------- | ---------------------------------- | ---------- | ------------------------ |
| 1   | ActionModal                  | Modal + ConfirmModal    | shared는 단일 컴포넌트, TDS는 분리 | keep-as-is | —                        |
| 2   | DeleteResourceModal          | ConfirmModal            | TDS ConfirmModal의 danger variant  | keep-sync  | —                        |
| 3   | ResourceActionModal          | ConfirmModal            | TDS ConfirmModal의 variant         | keep-sync  | —                        |
| 4   | AppLayout                    | PageShell               | 전체 레이아웃 구조 차이            | keep-sync  | PR #127                  |
| 5   | CreateLayout                 | Wizard (SectionCard)    | TDS는 SectionCard + Wizard 패턴    | keep-sync  | —                        |
| 6   | DetailCard                   | SectionCard.DataRow     | TDS는 SectionCard 내 DataRow       | keep-sync  | PR #128                  |
| 7   | DetailPageHeader             | DetailHeader            | 구조 차이 (compound vs flat)       | keep-sync  | PR #128                  |
| 8   | EmptyUI                      | EmptyState              | 이름+API 차이                      | keep-sync  | —                        |
| 9   | Error (403/404/500)          | ErrorState              | TDS는 범용 ErrorState              | keep-sync  | —                        |
| 10  | FilterSearch                 | FilterSearchInput       | TDS Input 폴더 내 포함             | keep-sync  | 머지 #121/#123 + PR #128 |
| 11  | InfoContainer                | InfoBox                 | 이름+API 차이                      | keep-sync  | —                        |
| 12  | Layout (Stack/VStack/HStack) | VStack/HStack/Container | TDS는 개별 컴포넌트                | keep-sync  | —                        |
| 13  | MultiItemDisplay             | BadgeList               | 역할 동일, API 차이                | keep-sync  | —                        |
| 14  | TabContainer                 | Tabs (TabPanel)         | TDS Tabs의 일부                    | keep-sync  | —                        |
| 15  | TabSelector                  | Tabs (variant)          | TDS Tabs의 boxed variant           | keep-sync  | —                        |
| 16  | Title                        | PageHeader              | 역할 유사                          | keep-sync  | —                        |

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

| #   | TDS                         | 비고                                      | 결정              |
| --- | --------------------------- | ----------------------------------------- | ----------------- |
| 1   | Chip                        | shared Tag로 대응 가능                    | **보류** (재검토) |
| 2   | Drawer                      | shared Overlay.Template drawer-horizontal | skip              |
| 3   | InfoBox                     | shared InfoContainer가 부분 대응          | skip              |
| 4   | ListToolbar                 | shared에 대응 없음                        | skip              |
| 5   | Menu (MenuItem/MenuSection) | shared ContextMenu 내 포함                | skip              |
| 6   | MetricCard                  | shared에 대응 없음                        | **TDS 구현**      |
| 7   | NotificationCenter          | shared에 대응 없음                        | **shared 신규**   |
| 8   | PageHeader                  | shared Title이 부분 대응                  | skip              |
| 9   | SectionCard                 | shared Fieldset + DetailCard가 부분 대응  | skip              |
| 10  | SelectionIndicator          | shared에 대응 없음                        | skip              |
| 11  | Wizard                      | shared CreateLayout이 부분 대응           | skip              |

## 싱크 진행 현황

- **1:1 대응**: 머지 9개 + PR 오픈 13개 = 22/38 진행, 16개 미진행
- **부분 대응**: 머지 1개 + PR 오픈 3개 = 4/16 진행, 12개 미진행
- **배치 PR**: thaki-shared repo #124~#131 (전부 OPEN, 미머지)
- **머지된 컴포넌트 PR**: #52/#99/#104/#105/#119/#120/#121/#123/#133
