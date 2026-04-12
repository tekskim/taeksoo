# @thaki/shared 컴포넌트 카탈로그

이 문서는 `@thaki/shared`의 모든 public 컴포넌트를 AI가 즉시 파악할 수 있도록 정리한 레퍼런스입니다.
deprecated 컴포넌트(`Accordion`, `Table`, `SelectableTable`, `ExpandableTable`)는 제외되어 있습니다.

---

## 테이블/목록

### TcTable

- **용도**: 데이터 목록을 행/열로 표시하는 테이블. 모든 리스트 페이지의 핵심 컴포넌트.
- **언제 쓰는지**: 데이터를 표 형태로 보여줘야 할 때 (사용자 목록, 리소스 목록 등)
- **구조**: `TcTable.Body` > `TcTable.Tr` > `TcTable.Td` 네임스페이스
- **핵심 props**:
  - `TcTable.Body`: `columns` (컬럼 정의), `selection.type` (none/single/multi), `expandableUI`, `stickyLastColumn`
  - `TcTable.Td`: `iconColumn` (아이콘 전용 셀), 고정 폭 클래스
- **실제 사용처**: `iam/UsersListPage.tsx`, `compute/InstanceListPage.tsx`

### Pagination

- **용도**: 페이지 전환 UI. 테이블 하단에 위치.
- **언제 쓰는지**: 데이터가 페이지 단위로 나뉠 때
- **핵심 props**: `totalCount`, `size` (페이지당 항목 수), `currentAt` (현재 페이지), `onPageChange`, `onSettingClick` (선택)
- **실제 사용처**: `iam/UsersListPage.tsx`, `iam/PoliciesListPage.tsx`

### FilterSearchInput

- **용도**: 필터 + 검색 입력 UI. 필터 키와 값을 선택하고 검색 칩으로 추가.
- **언제 쓰는지**: 리스트 페이지에서 데이터를 필터링/검색할 때
- **핵심 props**: `filterKeys` (필터 키 정의 배열), `onFilterAdd`, `selectedFilters`
- **함께 쓰는 것**: `FilterSearchResults` (선택된 필터 칩 표시), `useFilterSearch` (상태 관리 훅)
- **실제 사용처**: `iam/UsersListPage.tsx`, `iam/UserRolesDrawer.tsx`

### FilterSearchResults

- **용도**: 선택된 필터를 칩 형태로 표시하고 제거 가능.
- **언제 쓰는지**: `FilterSearchInput`과 항상 함께 사용
- **실제 사용처**: `iam/UsersListPage.tsx`

### EmptyUI

- **용도**: 데이터가 없을 때 보여주는 빈 상태 화면.
- **언제 쓰는지**: 리스트/테이블에 항목이 0개일 때
- **핵심 props**: `content` (title/description), `children` (액션 버튼 슬롯)
- **실제 사용처**: `iam/UsersListPage.tsx`, `compute/InstanceListPage.tsx`

### MultiItemDisplay

- **용도**: 여러 항목을 축약 표시하고 "(+N)" 으로 나머지를 툴팁에 표시.
- **언제 쓰는지**: 테이블 셀에 여러 값(태그, 그룹 등)을 한 줄로 표시할 때
- **핵심 props**: `items` (배열 또는 레코드), `emptyText`
- **실제 사용처**: `compute/InstanceListPage.tsx`

---

## 상태 표시

### StatusIndicator

- **용도**: 리소스의 상태를 점(dot) + 라벨로 표시. 테이블 행이나 상세 헤더에서 사용.
- **언제 쓰는지**: running/stopped/error 같은 리소스 상태를 시각적으로 구분할 때
- **핵심 props**:
  - `variant`: `'active'|'pending'|'error'|'draft'|'suspended'|'shelved'|'mounted'|'shutoff'|'down'|'paused'|'building'|'deleting'|'inUse'|'degraded'|'offline'|'noMonitor'`
  - `label`, `layout` (leftIcon/iconOnly), `tooltip`
- **실제 사용처**: `iam/UsersListPage.tsx`, `compute/InstanceDetailPage.tsx`

### Badge

- **용도**: 상태나 카테고리를 컬러 라벨로 표시. StatusIndicator보다 범용적.
- **언제 쓰는지**: 타입/카테고리를 시각적으로 구분할 때 (예: "관리자", "읽기전용")
- **핵심 props**:
  - `theme`: `blu|red|gry|gre|ylw`
  - `size`: `sm|md|lg`
  - `type`: `subtle|solid`
  - `layout`: `text-only|left-icon|right-icon`
  - `icon`
- **실제 사용처**: `compute/InstanceListPage.tsx`

### ProgressBar

- **용도**: 수평 진행률 바. 사용량/할당량 등 비율 표시.
- **언제 쓰는지**: 쿼터 사용률, 작업 진행 상황을 막대로 보여줄 때
- **핵심 props**: `value`, `max`, `pendingValue`, `variant` (success/error/warning), `showValue` (percentage/absolute), `label`
- **실제 사용처**: `storage/BucketsListPage.tsx`

### InlineMessage

- **용도**: 인라인 알림 메시지 (success/info/warning/error). 페이지나 섹션 내부에 표시.
- **언제 쓰는지**: 경고/안내/에러 메시지를 콘텐츠 흐름 안에서 보여줄 때
- **핵심 props**: `type`, `message`, `expandable`, `timestamp`, `action`, `closable`
- **실제 사용처**: `compute/RescueInstanceDrawer.tsx`, `iam/PolicyDetailPage.tsx`

### Toast

- **용도**: 화면 구석에 뜨는 일시적 알림. `sonner`의 `toast.custom()`과 함께 사용.
- **언제 쓰는지**: 작업 성공/실패를 일시적으로 알려줄 때
- **핵심 props**: `type` (positive/negative), `message`, `description`, `timestamp`
- **참고**: 실제 토스트 호출은 `toast` from `sonner`를 사용. 이 컴포넌트는 UI 템플릿.

### LoadingSpinner

- **용도**: 로딩 인디케이터.
- **언제 쓰는지**: 데이터 로딩 중임을 표시할 때
- **핵심 props**: `size` (xs/sm/md/lg), `color` (primary/secondary/inverse)

### Skeleton

- **용도**: 콘텐츠 로딩 중 뼈대 플레이스홀더.
- **언제 쓰는지**: 구체적인 영역의 로딩 상태를 골격으로 표현할 때
- **핵심 props**: `borderRadius`, `className`

---

## 입력/폼

### Input

- **용도**: 텍스트 입력 필드. 가장 기본적인 입력 컴포넌트.
- **언제 쓰는지**: 이름, 이메일, 설명 등 텍스트 값을 입력받을 때
- **핵심 props**:
  - `size`: `sm|md`
  - `width`: `xs|sm|md|lg|full`
  - `error`, `frontIcon`, `rearIcon`, `filter`
  - `label`, `message` (내장 라벨/메시지)
- **실제 사용처**: `iam/UserEditDrawer.tsx`, `iam/UserBasicInformationAccordion.tsx`

### NumberInput

- **용도**: 숫자 입력 필드. 증가/감소 버튼 포함.
- **언제 쓰는지**: 수량, 포트 번호, 타임아웃 값 등 숫자를 입력받을 때
- **핵심 props**: `min`, `max`, `step` + Input 기본 props
- **실제 사용처**: `iam/SessionPoliciesSettingsPage.tsx`, `iam/TokenPoliciesSettingsPage.tsx`

### Textarea

- **용도**: 여러 줄 텍스트 입력. 선택적 글자 수 카운트.
- **언제 쓰는지**: 설명, 메모, 정책 JSON 등 긴 텍스트를 입력받을 때
- **핵심 props**: `label`, `error`, `resize`, `autoResize`, `showCharacterCount`, `maxLength`

### Dropdown

- **용도**: 선택 드롭다운. `Dropdown.Select`(기본)과 `Dropdown.ComboBox`(검색 가능).
- **언제 쓰는지**: 미리 정해진 선택지 중 하나를 고를 때 (상태, 유형, 리전 등)
- **핵심 구조**: `Dropdown.Select` > `Dropdown.Option` children
- **핵심 props**: `value`, `onChange`, `placeholder`, width variants
- **ComboBox**: 검색 가능한 드롭다운이 필요할 때 사용

### Checkbox

- **용도**: 단일 체크박스. 선택/해제를 토글.
- **언제 쓰는지**: on/off 선택이 필요할 때, 약관 동의 등
- **핵심 props**: `checked`, `onChange`, `size`, `disabled`, `children` (라벨)

### RadioGroup

- **용도**: 라디오 버튼 그룹. 여러 옵션 중 하나만 선택.
- **언제 쓰는지**: 상호 배타적인 옵션 중 하나를 선택할 때 (예: public/private)
- **핵심 props**: `name`, `options` (배열), `selectedValue`, `onChange`, `direction`, `legend`
- **실제 사용처**: `compute/RescueInstanceDrawer.tsx`

### Toggle

- **용도**: 스위치형 on/off 컨트롤. Checkbox와 유사하나 시각적으로 구분.
- **언제 쓰는지**: 기능 활성화/비활성화를 명확히 표현할 때 (MFA 활성화 등)
- **핵심 props**: `checked`, `onChange`, `mini`, `checkedLabel`, `uncheckedLabel`, `disabled`
- **실제 사용처**: `iam/UserEditDrawer.tsx`

### Range

- **용도**: 슬라이더. 단일 값 또는 범위 선택.
- **언제 쓰는지**: 볼륨 크기, 비율 등 연속 값을 조절할 때
- **핵심 props**: `min`, `max`, `dual` (범위 모드), `value`, `onChange`, `addNumberInput`, `unit`, `disabled`
- **실제 사용처**: `compute/ExtendVolumeDrawer.tsx`

### DatePicker

- **용도**: 날짜 선택 캘린더. 단일 날짜 또는 기간.
- **언제 쓰는지**: 시작일/종료일, 만료일 등을 입력받을 때
- **핵심 props**: `mode` (single/range), `value`, `onChange`, `minDate`, `maxDate`, `numberOfMonths`

### FormField

- **용도**: 폼 컨트롤 래퍼. 라벨 + 힌트 + 에러/성공 메시지 + 접근성 연결.
- **언제 쓰는지**: Input, Dropdown 등을 라벨/에러 메시지와 함께 묶을 때 (거의 모든 폼에서 사용)
- **핵심 props**: `label` (필수), `required`, `hint`, `error`, `success`, `description`
- **실제 사용처**: `compute/ExtendVolumeDrawer.tsx`, `iam/UserBasicInformationAccordion.tsx`

### TagInput

- **용도**: 키/값 태그를 입력하고 관리하는 에디터.
- **언제 쓰는지**: 메타데이터 태그, 레이블을 자유롭게 추가/삭제할 때
- **핵심 props**: `tags`, `onChange`, `validateTags`, `maxTags`, `labels`, `disabled`
- **실제 사용처**: `storage/EditFileDrawer.tsx`

### PasswordInput

- **용도**: 비밀번호 입력. 표시/숨김 토글 + 정책 툴팁 슬롯.
- **언제 쓰는지**: 비밀번호, 시크릿 키 등을 입력받을 때
- **핵심 props**: `tooltipContent`, `tooltipDirection`, `showTooltip`
- **실제 사용처**: `compute/RescueInstanceDrawer.tsx`

### SearchInput

- **용도**: 검색 아이콘이 내장된 Input. FilterSearch보다 단순한 검색이 필요할 때.
- **언제 쓰는지**: 단독 검색 필드가 필요할 때 (필터 없이 텍스트 검색만)
- **핵심 props**: Input props 상속

---

## 버튼/액션

### Button

- **용도**: 범용 버튼. variant로 용도를 구분.
- **variant 선택 가이드**:
  - `primary` — 주요 액션 (저장, 생성, 확인)
  - `secondary` — 보조 액션 (취소 옆의 저장)
  - `outline` — 테두리만 있는 부가 액션
  - `ghost` — 배경 없는 부가 액션 (리셋, 부가 기능)
  - `muted` — 약한 강조의 부가 액션
  - `danger` — 위험 액션 (삭제, 해제)
  - `link` — 링크 스타일 텍스트 버튼
- **size**: `sm|md|lg|half|full|icon-only`
- **추가 props**: `frontIcon`, `rearIcon`, `isLoading`, `disabled`
- **실제 사용처**: 거의 모든 페이지

### CopyButton

- **용도**: 클릭하면 텍스트를 클립보드에 복사하는 버튼.
- **언제 쓰는지**: ID, API 키, URL 등을 복사할 수 있게 할 때
- **핵심 props**: `text` (복사할 문자열), `children`, `className`
- **실제 사용처**: `iam/PasswordConfirmModal.tsx`

---

## 레이아웃/구조

### Layout

- **용도**: 레이아웃 프리미티브 모음. 페이지와 섹션의 기본 뼈대.
- **하위 컴포넌트**:
  - `Layout.Container` — 최대 너비 제한 컨테이너 (`maxWidth`, `padding`)
  - `Layout.VStack` — 수직 스택 (`gap`, `align`)
  - `Layout.HStack` — 수평 스택 (`gap`, `align`, `justify`)
  - `Layout.Grid` — CSS Grid (`gap`)
  - `Layout.Block` — 제목 + 내용 블록 (`title`, `subtitle`, `icon`, `variant`, `padding`)
  - `Layout.Divider` — 구분선
- **실제 사용처**: 거의 모든 페이지

### CreateLayout

- **용도**: 생성/편집 플로우 전용 레이아웃. 메인 컬럼 + 사이드바(FloatingCard).
- **언제 쓰는지**: 리소스 생성/편집 페이지의 전체 골격
- **핵심 props**: `header` 또는 `title`+`headerActions`, `sidebar`, `sidebarWidth`, `contentGap`
- **실제 사용처**: `compute/InstanceCreatePage.tsx`, `iam/UserCreatePage.tsx`

### Fieldset

- **용도**: `<fieldset>` + legend. 폼 필드를 시각적으로 그룹화.
- **언제 쓰는지**: 관련 입력 필드를 섹션으로 묶을 때
- **핵심 props**: `legend`, `description`, `error`, `variant` (default/bordered/elevated), `direction` (vertical/horizontal)

### Title

- **용도**: 페이지/섹션 제목 (`h2`).
- **언제 쓰는지**: 페이지 상단 제목
- **핵심 props**: `title`, `size` (small/medium/large)

### Typography

- **용도**: 의미 기반 텍스트 프리미티브.
- **하위 컴포넌트**:
  - `Typography.Title` — 제목 (`level` 1-4, `color`)
  - `Typography.Text` — 본문 (`variant`: paragraph/detail/caption, `color`: primary/secondary/text/text-muted/error/warning/info/success)
  - `Typography.Label` — 라벨 (`color`)
- **실제 사용처**: 거의 모든 페이지

### Breadcrumb

- **용도**: 경로 탐색 트레일 (홈 > 카테고리 > 현재).
- **언제 쓰는지**: 페이지 계층 구조를 보여줄 때
- **핵심 props**: `items` (배열: `label`, `path` 또는 `onClick`, `isLoading`)

---

## 탭/네비게이션

### Tabs / Tab

- **용도**: 탭 패널. 하나의 영역에서 여러 뷰를 전환.
- **언제 쓰는지**: 상세 페이지 하위 탭, 설정 페이지 카테고리 전환
- **핵심 props**:
  - `Tabs`: `activeTabId`, `defaultActiveTabId`, `onChange`, `size` (sm/md), `variant` (line/button), `fullWidth`
  - `Tab`: `id`, `label`, `persistence` (destroy/css/activity)
- **변형**: `variant="line"` (기본 탭), `variant="button"` (중첩 탭/세그먼트)
- **실제 사용처**: `iam/UserDetailPage.tsx`, `iam/RoleDetailPage.tsx`, `compute/InstanceDetailPage.tsx`

### TabSelector

- **용도**: 세그먼트 컨트롤 / 필 옵션. Tabs보다 작은 범위의 토글.
- **언제 쓰는지**: 2-4개 옵션 간 빠른 전환 (예: 리스트뷰/카드뷰)
- **핵심 props**: `options` (id/label/disabled), `value`, `onChange`, `variant` (small/medium/pill), `layout` (horizontal/vertical)

---

## 카드/상세

### DetailCard

- **용도**: 키/값 정보 카드. 상세 페이지에서 리소스 속성을 표시.
- **언제 쓰는지**: 상세 페이지 탭 안에서 속성 정보를 카드로 보여줄 때
- **핵심 props**: `title`, `fields` (label/value/type/component 배열), `actions`, `visible`, `isLoading`
- **실제 사용처**: `compute/VolumeDetailPage.tsx`, `iam/UserCreatePage.tsx`

### DetailPageHeader

- **용도**: 상세 페이지 상단 헤더. 제목 + 상태 + 액션 + 정보 필드.
- **언제 쓰는지**: 상세 페이지 최상단에서 리소스 요약 정보를 보여줄 때
- **핵심 props**: `title`, `actions`, `infoFields` (DetailPageHeaderInfoField[]), `maxWidth`, `isLoading`
- **실제 사용처**: `storage/BucketDetailPage.tsx`

### FloatingCard

- **용도**: 사이드바에 띄우는 요약 카드. 접이식 섹션과 쿼터 바.
- **언제 쓰는지**: 생성/편집 페이지 사이드바에서 선택 항목 요약을 보여줄 때
- **핵심 props**: `summaryTitle`, `sections`, `quotas`, `collapsibleSections`, `sectionOpenMode` (single/multiple)
- **실제 사용처**: `compute/InstanceCreatePage.tsx`, `storage/BucketCreatePage.tsx`

### CardList

- **용도**: 카드 그리드. 로딩/빈 상태/에러 상태 내장.
- **언제 쓰는지**: 데이터를 카드 형태로 나열할 때 (대시보드 등)
- **핵심 props**: `list`, `isLoading`, `skeletonUI`, `emptyUI`, `errorCardUI`, `children` (render prop)

### InfoContainer

- **용도**: 읽기 전용 라벨 + 값 목록. 스크롤 지원.
- **언제 쓰는지**: 드로어/모달 안에서 선택된 리소스 정보를 요약 표시할 때
- **핵심 props**: `label`, `values`, `maxVisibleItems`, `showBullets`
- **실제 사용처**: `compute/ExtendVolumeDrawer.tsx`, `compute/RescueInstanceDrawer.tsx`

---

## 모달/오버레이

### ActionModal

- **용도**: 단순 확인/취소 모달. 타이틀 + 부제 + 두 버튼.
- **언제 쓰는지**: "정말 나가시겠습니까?", "변경 사항을 저장하지 않고 나가시겠습니까?" 같은 단순 확인
- **핵심 props**: `actionConfig` (title, subtitle, primaryText, secondaryText, primaryVariant), `onAction`, `isLoading`
- **선택 기준**: 본문에 리소스 정보가 없는 단순 확인일 때
- **실제 사용처**: `iam/UserCreatePage.tsx` (미저장 이탈 확인), `iam/GroupMembersTab.tsx` (단건 삭제)

### ResourceActionModal

- **용도**: 리소스 정보 + 확인 모달. InfoContainer로 리소스 상세를 보여주고 확인.
- **언제 쓰는지**: 삭제/해제 등 위험 액션 전 대상 리소스 정보를 확인시킬 때
- **핵심 props**: `actionConfig`, `infoItems` (InfoItem[]), `content` (message/type), `onAction`, `isLoading`
- **선택 기준**: 리소스 정보(이름, 상태 등)를 함께 보여줄 때
- **실제 사용처**: `iam/UsersListPage.tsx`, `compute/VolumeDeleteModal.tsx`

### DeleteResourceModal

- **용도**: 리소스 삭제 전용 모달. targets 기반 표준화된 삭제 UI.
- **언제 쓰는지**: 단건/복수 리소스 삭제 전 확인할 때 (표준 삭제 플로우)
- **핵심 props**: `targets`, `forceBulk`, `infoItems`, `content`, `labels`, `onAction`
- **선택 기준**: 삭제 전용이고 표준 targets 패턴을 따를 때
- **실제 사용처**: `compute/NetworkDeleteModal.tsx`, `compute/TenantListPage.tsx`

### Overlay.Template

- **용도**: 모달/드로어의 기본 셸. type으로 모달과 드로어를 전환.
- **언제 쓰는지**: 커스텀 모달/드로어가 필요할 때 (위 3개 모달 중 안 맞는 경우)
- **핵심 props**:
  - `type`: `'modal'|'drawer-horizontal'` 등
  - `title`, `description`
  - `confirmUI`, `cancelUI` (버튼 라벨)
  - `onConfirm`, `onCancel`
  - `appeared`, `size` (sm/md)
  - `footer` (커스텀 하단)
- **모달용**: `type="modal"`
- **드로어용**: `type="drawer-horizontal"` + 고정 너비 클래스
- **실제 사용처**: `iam/UserEditDrawer.tsx`, `compute/ExtendVolumeDrawer.tsx`

### Tooltip

- **용도**: 호버/포커스 시 뜨는 정보 풍선.
- **언제 쓰는지**: 요소에 추가 설명을 제공할 때
- **핵심 props**: `content`, `direction`, `focusable`

### ContextMenu

- **용도**: 우클릭/트리거 메뉴. 행 액션 드롭다운.
- **언제 쓰는지**: 테이블 행의 "더보기" 버튼이나 우클릭 메뉴
- **구조**: `ContextMenu.Root` > `ContextMenu.Item` / `ContextMenu.SubItems`
- **핵심 props**: `Root` — render-prop `trigger`; `Item` — label, onClick, disabled
- **실제 사용처**: `iam/UsersListPage.tsx`, `iam/UserDetailPage.tsx`

---

## 아코디언/펼침

### TcAccordion

- **용도**: 단일 펼침/접힘 패널. 제어/비제어 모두 지원.
- **언제 쓰는지**: 섹션별로 콘텐츠를 접고 펼 때
- **핵심 props**: `id` (그룹 내에서 필수), `header`, `isOpen`/`defaultOpen`, `disabled`, `onToggle`/`onOpen`/`onClose`
- **그룹**: `TcAccordionGroup`으로 여러 아코디언을 조율 (`multiple` 모드 지원)
- **실제 사용처**: `user-settings/AccountInfoSection.tsx`

### Disclosure

- **용도**: 단순 펼침/접힘 + 셰브론. TcAccordion보다 가벼움.
- **언제 쓰는지**: 부가 정보를 접어둘 때 (고급 옵션, 추가 설정)
- **핵심 props**: `label`, `expanded`, `onExpandChange`, `keepMounted`, `disabled`
- **실제 사용처**: `compute/RescueInstanceDrawer.tsx`

---

## 스테퍼

### Stepper

- **용도**: 다단계 위저드. 생성 플로우를 단계별로 안내.
- **언제 쓰는지**: 리소스 생성/설정이 여러 단계로 나뉠 때
- **핵심 props**: `stepIds`, step configs (children), `onStepChange`, `onStatusChange`, `onAllStepsCompleted`, `localeText`
- **함께 쓰는 것**: `StepperSummary` (단계별 상태 요약 표시)
- **실제 사용처**: `iam/UserCreatePage.tsx`

### StepperSummary

- **용도**: Stepper의 단계별 상태 읽기 전용 요약.
- **언제 쓰는지**: Stepper와 함께 사이드바에서 진행 상태를 보여줄 때

---

## 빈 상태/에러/로딩

### Error403

- **용도**: 403 권한 없음 전체 페이지 에러.
- **핵심 props**: `title`, `description`, `buttonText`, `onGoBack`

### Error404

- **용도**: 404 페이지 없음 전체 페이지 에러.
- **핵심 props**: 동일 (ErrorTemplate 공통)

### Error500

- **용도**: 500 서버 에러 전체 페이지 에러.
- **핵심 props**: 동일 (ErrorTemplate 공통)
