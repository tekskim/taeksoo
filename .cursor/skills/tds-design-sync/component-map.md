# Component Map: TDS ↔ thaki-shared

> 이 파일은 3개 스킬 + 오케스트레이터가 공유하는 매핑 테이블입니다.
> 매핑 상태: `1:1` (직접 대응) | `partial` (부분 대응) | `none` (미대응)

## 매핑 상태 요약

- **1:1 대응**: 38개 — 디자인 싱크 대상 (우선)
- **부분 대응**: 16개 — 구조 차이 있으나 디자인 싱크 가능
- **미대응 (TDS에 없음)**: 12개 — thaki-shared 고유, 디자인 토큰 정렬만
- **미대응 (shared에 없음)**: 추후 신규 생성 대상

## 1:1 대응 (38개)

| #   | thaki-shared       | 경로                                 | TDS               | 경로                                                 | 비고                                                       |
| --- | ------------------ | ------------------------------------ | ----------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| 1   | Badge              | `src/components/Badge/`              | Badge             | `src/design-system/components/Badge/`                |                                                            |
| 2   | Breadcrumb         | `src/components/Breadcrumb/`         | Breadcrumb        | `src/design-system/components/Breadcrumb/`           |                                                            |
| 3   | Button             | `src/components/Button/`             | Button            | `src/design-system/components/Button/`               |                                                            |
| 4   | Checkbox           | `src/components/Checkbox/`           | Checkbox          | `src/design-system/components/Checkbox/`             |                                                            |
| 5   | ContextMenu        | `src/components/ContextMenu/`        | ContextMenu       | `src/design-system/components/ContextMenu/`          |                                                            |
| 6   | CopyButton         | `src/components/CopyButton/`         | CopyButton        | `src/design-system/components/CopyButton/`           |                                                            |
| 7   | DatePicker         | `src/components/DatePicker/`         | DatePicker        | `src/design-system/components/DatePicker/`           |                                                            |
| 8   | Disclosure         | `src/components/Disclosure/`         | Disclosure        | `src/design-system/components/Disclosure/`           |                                                            |
| 9   | FloatingCard       | `src/components/FloatingCard/`       | FloatingCard      | `src/design-system/components/FloatingCard/`         |                                                            |
| 10  | FormField          | `src/components/FormField/`          | FormField         | `src/design-system/components/FormField/`            |                                                            |
| 11  | InlineMessage      | `src/components/InlineMessage/`      | InlineMessage     | `src/design-system/components/InlineMessage/`        |                                                            |
| 12  | Input              | `src/components/Input/`              | Input             | `src/design-system/components/Input/`                | TDS는 Input 폴더에 Textarea, NumberInput, SearchInput 포함 |
| 13  | MonitoringToolbar  | `src/components/MonitoringToolbar/`  | MonitoringToolbar | `src/design-system/components/MonitoringToolbar/`    |                                                            |
| 14  | Pagination         | `src/components/Pagination/`         | Pagination        | `src/design-system/components/Pagination/`           |                                                            |
| 15  | Password           | `src/components/Password/`           | Password          | `src/design-system/components/Password/`             |                                                            |
| 16  | ProgressBar        | `src/components/ProgressBar/`        | ProgressBar       | `src/design-system/components/ProgressBar/`          |                                                            |
| 17  | Skeleton           | `src/components/Skeleton/`           | Skeleton          | `src/design-system/components/Skeleton/`             |                                                            |
| 18  | StatusIndicator    | `src/components/StatusIndicator/`    | StatusIndicator   | `src/design-system/components/StatusIndicator/`      |                                                            |
| 19  | TabBar             | `src/components/TabBar/`             | TabBar            | `src/design-system/components/TabBar/`               |                                                            |
| 20  | Table              | `src/components/Table/`              | Table             | `src/design-system/components/Table/`                |                                                            |
| 21  | Toast              | `src/components/Toast/`              | Toast             | `src/design-system/components/Toast/`                |                                                            |
| 22  | Toggle             | `src/components/Toggle/`             | Toggle            | `src/design-system/components/Toggle/`               |                                                            |
| 23  | Tooltip            | `src/components/Tooltip/`            | Tooltip           | `src/design-system/components/Tooltip/`              |                                                            |
| 24  | Accordion          | `src/components/Accordion/`          | Accordion         | `src/design-system/components/Accordion/`            |                                                            |
| 25  | Tag                | `src/components/Tag/`                | Tag               | `src/design-system/components/Tag/`                  |                                                            |
| 26  | Textarea           | `src/components/Textarea/`           | Textarea          | `src/design-system/components/Input/Textarea.tsx`    | TDS는 Input 폴더 내                                        |
| 27  | Tabs               | `src/components/Tabs/`               | Tabs              | `src/design-system/components/Tabs/`                 |                                                            |
| 28  | Popover            | —                                    | Popover           | `src/design-system/components/Popover/`              | shared에 별도 Popover 없음, Tooltip에 통합 가능            |
| 29  | RadioButton        | `src/components/RadioButton/`        | Radio             | `src/design-system/components/Radio/`                | 이름 차이                                                  |
| 30  | RadioGroup         | `src/components/RadioGroup/`         | RadioGroup        | `src/design-system/components/Radio/RadioGroup.tsx`  | TDS는 Radio 폴더 내                                        |
| 31  | Dropdown           | `src/components/Dropdown/`           | Select + Dropdown | `src/design-system/components/Select/` + `Dropdown/` | TDS Select가 주 대응                                       |
| 32  | Sidebar            | `src/components/Sidebar/`            | SNBMenuItem       | `src/design-system/components/SNBMenuItem/`          | partial, 사이드바 메뉴 아이템                              |
| 33  | LoadingSpinner     | `src/components/LoadingSpinner/`     | Loading           | `src/design-system/components/Loading/`              | 이름 차이                                                  |
| 34  | Range              | `src/components/Range/`              | Slider            | `src/design-system/components/Slider/`               | 이름 차이                                                  |
| 35  | Fieldset           | `src/components/Fieldset/`           | SectionCard       | `src/design-system/components/SectionCard/`          | 역할 유사                                                  |
| 36  | FrameControls      | `src/components/FrameControls/`      | WindowControl     | `src/design-system/components/WindowControl/`        | 이름 차이                                                  |
| 37  | NavigationControls | `src/components/NavigationControls/` | TopBar            | `src/design-system/components/TopBar/`               | 네비게이션 부분                                            |
| 38  | ToolBar            | `src/components/ToolBar/`            | TopBar            | `src/design-system/components/TopBar/`               | TDS TopBar가 대응                                          |

## 부분 대응 (16개)

| #   | thaki-shared                 | TDS 대응                | 비고                               |
| --- | ---------------------------- | ----------------------- | ---------------------------------- |
| 1   | ActionModal                  | Modal + ConfirmModal    | shared는 단일 컴포넌트, TDS는 분리 |
| 2   | DeleteResourceModal          | ConfirmModal            | TDS ConfirmModal의 danger variant  |
| 3   | ResourceActionModal          | ConfirmModal            | TDS ConfirmModal의 variant         |
| 4   | AppLayout                    | PageShell               | 전체 레이아웃 구조 차이            |
| 5   | CreateLayout                 | Wizard (SectionCard)    | TDS는 SectionCard + Wizard 패턴    |
| 6   | DetailCard                   | SectionCard.DataRow     | TDS는 SectionCard 내 DataRow       |
| 7   | DetailPageHeader             | DetailHeader            | 구조 차이 (compound vs flat)       |
| 8   | EmptyUI                      | EmptyState              | 이름+API 차이                      |
| 9   | Error (403/404/500)          | ErrorState              | TDS는 범용 ErrorState              |
| 10  | FilterSearch                 | FilterSearchInput       | TDS Input 폴더 내 포함             |
| 11  | InfoContainer                | InfoBox                 | 이름+API 차이                      |
| 12  | Layout (Stack/VStack/HStack) | VStack/HStack/Container | TDS는 개별 컴포넌트                |
| 13  | MultiItemDisplay             | BadgeList               | 역할 동일, API 차이                |
| 14  | TabContainer                 | Tabs (TabPanel)         | TDS Tabs의 일부                    |
| 15  | TabSelector                  | Tabs (variant)          | TDS Tabs의 boxed variant           |
| 16  | Title                        | PageHeader              | 역할 유사                          |

## 미대응 — thaki-shared 고유 (12개)

| #   | thaki-shared          | 비고                                              |
| --- | --------------------- | ------------------------------------------------- |
| 1   | AppIcon               | 앱별 아이콘 (Compute, IAM 등), 디자인 토큰 정렬만 |
| 2   | CardList              | 카드 리스트 뷰, TDS에 대응 없음                   |
| 3   | ChartToggle           | 차트 토글, 모니터링 전용                          |
| 4   | ChartTooltip          | 차트 툴팁, 모니터링 전용                          |
| 5   | Dim                   | 오버레이 딤, TDS Modal/Drawer 내장                |
| 6   | Editor (PromptEditor) | 프롬프트 에디터, AI 전용                          |
| 7   | ErrorBoundary         | 유틸리티 컴포넌트, 스타일 없음                    |
| 8   | Icon                  | SVG 아이콘 시스템, TDS는 Tabler Icons 사용        |
| 9   | LangButton            | 언어 전환 버튼                                    |
| 10  | Portal                | 유틸리티 컴포넌트, 스타일 없음                    |
| 11  | RefreshButton         | 새로고침 버튼                                     |
| 12  | Terminal              | 터미널 컴포넌트, 전용                             |

## 미대응 — TDS 고유 (shared에 없음)

| #   | TDS                         | 비고                                      |
| --- | --------------------------- | ----------------------------------------- |
| 1   | Chip                        | shared Tag로 대응 가능                    |
| 2   | Drawer                      | shared TableSettingDrawer가 유일한 Drawer |
| 3   | InfoBox                     | shared InfoContainer가 부분 대응          |
| 4   | ListToolbar                 | shared에 대응 없음                        |
| 5   | Menu (MenuItem/MenuSection) | shared ContextMenu 내 포함                |
| 6   | MetricCard                  | shared에 대응 없음                        |
| 7   | NotificationCenter          | shared에 대응 없음                        |
| 8   | PageHeader                  | shared Title이 부분 대응                  |
| 9   | SectionCard                 | shared Fieldset + DetailCard가 부분 대응  |
| 10  | SelectionIndicator          | shared에 대응 없음                        |
| 11  | Wizard                      | shared CreateLayout이 부분 대응           |

## 디자인 싱크 우선순위

### Phase 1: 핵심 폼 컨트롤 (10개)

Button, Input, Textarea, Checkbox, RadioButton, RadioGroup, Toggle, Dropdown (→Select), Range (→Slider), DatePicker

### Phase 2: 데이터 표시 (10개)

Badge, Table, Pagination, StatusIndicator, Tag, ProgressBar, Skeleton, Toast, InlineMessage, Tooltip

### Phase 3: 레이아웃/네비게이션 (10개)

TabBar, Tabs, TabContainer, TabSelector, Breadcrumb, Sidebar, NavigationControls, ToolBar, Accordion, Disclosure

### Phase 4: 오버레이/모달 (8개)

ActionModal, DeleteResourceModal, ResourceActionModal, Overlay (→Dim), FloatingCard, ContextMenu, CopyButton, Password

### Phase 5: 복합/페이지 (나머지)

AppLayout, CreateLayout, DetailCard, DetailPageHeader, EmptyUI, Error, Fieldset, FilterSearch, FormField, InfoContainer, Layout, LoadingSpinner, MultiItemDisplay, Title, Typography, MonitoringToolbar, FrameControls
