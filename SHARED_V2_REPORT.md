# shared-v2 프리뷰 앱 리포트

> **작성일**: 2026-03-26
> **프리뷰 사이트**: https://thakicloud.github.io/tds_ssot/shared-v2/
> **소스 경로**: `thaki-shared-v2/preview/`
> **shared 라이브러리 버전**: `@ThakiCloud/shared` v1.9.3

---

## Part 1: 전체 개요

### 1.1 목적

이 프리뷰 앱은 `@ThakiCloud/shared` 라이브러리의 컴포넌트만으로 **모든 앱의 모든 페이지를 구현**한 레퍼런스입니다. TDS SSoT(디자인 시스템 원본)의 디자인을 shared 라이브러리 기반으로 재현하여, 개발팀이 실제 구현 시 참고할 수 있는 코드 레벨의 가이드 역할을 합니다.

### 1.2 앱별 페이지 현황

| 앱                | 경로 접두사        | 페이지 수 | 설명                                   |
| ----------------- | ------------------ | --------: | -------------------------------------- |
| **Container**     | `/container/*`     |       104 | Kubernetes 리소스 (Pod, Deployment 등) |
| **Compute Admin** | `/compute-admin/*` |        61 | 관리자용 Compute + Network + Storage   |
| **Compute**       | `/compute/*`       |        47 | 테넌트용 Compute + Network + Storage   |
| **IAM**           | `/iam/*`           |        23 | 사용자/역할/정책 관리                  |
| **Design**        | `/design/*`        |         8 | 컴포넌트 쇼케이스                      |
| **Storage**       | `/storage/*`       |         5 | Object/Block Storage                   |
| **CloudBuilder**  | `/cloudbuilder/*`  |         3 | 클라우드 빌더                          |
| **Entry**         | `/`                |         1 | 앱 허브 (진입점)                       |
| **합계**          |                    |   **252** |                                        |

### 1.3 페이지 패턴별 분류

| 패턴              | 수량 | 예시                                                         |
| ----------------- | ---: | ------------------------------------------------------------ |
| **List** (리스트) | ~100 | `ComputeInstancesPage`, `IAMUsersPage`                       |
| **Detail** (상세) |   72 | `ComputeInstanceDetailPage`, `ContainerPodDetailPage`        |
| **Create** (생성) |   59 | `ComputeCreateInstancePage`, `ContainerCreateDeploymentPage` |
| **Edit YAML**     |   21 | `ContainerEditDeploymentYamlPage` (Container 전용)           |

### 1.4 공유 컴포넌트 (64개)

라이브러리 경로: `thaki-shared-v2/src/components/`

**핵심 UI**

| 컴포넌트                     | 설명                                     |
| ---------------------------- | ---------------------------------------- |
| `Button`                     | variant/appearance/size 기반 버튼        |
| `Input` / `NumberInput`      | 텍스트/숫자 입력                         |
| `Textarea`                   | 여러 줄 입력                             |
| `Dropdown`                   | Compound 패턴 (Select, ComboBox, Option) |
| `Checkbox`                   | 체크박스                                 |
| `RadioButton` / `RadioGroup` | 라디오 버튼                              |
| `Toggle`                     | on/off 스위치                            |
| `Range`                      | 범위 슬라이더                            |
| `DatePicker`                 | 날짜 선택                                |
| `Password`                   | 비밀번호 입력                            |
| `TagInput`                   | 태그 입력                                |

**데이터 표시**

| 컴포넌트                    | 설명                                   |
| --------------------------- | -------------------------------------- |
| `Table` / `SelectableTable` | 데이터 테이블 (정렬, 선택)             |
| `Pagination`                | 페이지네이션 (totalCount 기반)         |
| `Badge`                     | 상태 뱃지 (theme: gre/blu/ylw/red/gry) |
| `Tag`                       | 태그/라벨                              |
| `StatusIndicator`           | 상태 표시 (16개 variant)               |
| `ProgressBar`               | 진행률 바                              |
| `Tooltip`                   | 툴팁                                   |
| `CopyButton`                | 클립보드 복사                          |
| `Skeleton`                  | 로딩 스켈레톤                          |

**레이아웃**

| 컴포넌트           | 설명                                 |
| ------------------ | ------------------------------------ |
| `AppLayout`        | 전체 앱 레이아웃 셸                  |
| `Layout`           | VStack, HStack, Block, Container     |
| `SectionCard`      | 섹션 카드 (Header, Content, DataRow) |
| `DetailPageHeader` | 상세 페이지 헤더                     |
| `CreateLayout`     | Create 페이지 위자드 레이아웃        |
| `FloatingCard`     | 접기/펼치기 카드                     |
| `Stepper`          | 위자드 스텝 표시                     |
| `Typography`       | Title, Text, Label                   |

**네비게이션**

| 컴포넌트                       | 설명                                |
| ------------------------------ | ----------------------------------- |
| `Tabs` / `Tab`                 | 탭 네비게이션 (line/button variant) |
| `TabBar`                       | 브라우저 스타일 탭바                |
| `TabSelector` / `TabContainer` | 탭 선택                             |
| `Breadcrumb`                   | 경로 표시                           |
| `Sidebar`                      | 사이드바                            |
| `ContextMenu`                  | 컨텍스트 메뉴 (Compound 패턴)       |
| `NavigationControls`           | 앞/뒤 이동                          |

**오버레이**

| 컴포넌트              | 설명                         |
| --------------------- | ---------------------------- |
| `Overlay`             | Modal/Drawer 통합 (Template) |
| `ActionModal`         | 액션 확인 모달               |
| `DeleteResourceModal` | 삭제 확인 모달               |
| `TableSettingDrawer`  | 테이블 설정 드로어           |

**기타**

| 컴포넌트                       | 설명                    |
| ------------------------------ | ----------------------- |
| `FilterSearchInput`            | 필터 검색 입력          |
| `MonitoringToolbar`            | 모니터링 시간 범위 선택 |
| `ChartToggle` / `ChartTooltip` | 차트 보조               |
| `Terminal`                     | 웹 터미널 (xterm)       |
| `Editor`                       | 코드 에디터 (Monaco)    |
| `Toast`                        | 알림 (sonner 연동)      |
| `InlineMessage`                | 인라인 알림             |
| `Disclosure` / `Accordion`     | 접기/펼치기             |
| `Popover`                      | 팝오버                  |
| `Icon`                         | SVG 아이콘              |
| `LoadingSpinner`               | 로딩 스피너             |
| `EmptyUI`                      | 빈 상태                 |
| `Error` / `ErrorBoundary`      | 에러 상태               |

---

## Part 2: 컴포넌트 API 참조

### 2.1 Import 방식

프리뷰 앱에서는 모노레포 내부 alias를 사용합니다. 실제 앱에서의 import와 대응:

```tsx
// 프리뷰 (모노레포 내부)
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';

// 실제 앱 (npm 패키지)
import { Button, Table } from '@thaki/shared';
```

앱 엔트리에서 CSS를 한 번 import:

```tsx
import '@thaki/shared/index.css';
```

### 2.2 핵심 컴포넌트 Props

#### Button

```tsx
<Button
  variant="primary" // primary | secondary | tertiary | success | error | warning | muted
  appearance="solid" // solid | outline | ghost
  size="md" // xs | sm | md | lg
  disabled={false}
  onClick={handleClick}
>
  Save
</Button>
```

#### Table

```tsx
import type { TableColumn, SortOrder } from '@thaki/shared';

const columns: TableColumn[] = [
  { key: 'name', header: 'Name', sortable: true, minWidth: 160 },
  { key: 'status', header: 'Status', width: 64, align: 'center',
    render: (row) => <StatusIndicator variant={row.status} /> },
  { key: 'createdAt', header: 'Created at', sortable: true, align: 'right' },
  { key: 'actions', header: '', width: 48, align: 'center',
    render: (row) => <ContextMenu.Root items={getMenuItems(row)} /> },
];

<Table columns={columns} rows={data} sort={sortKey} order={sortOrder} onSortChange={handleSort} />

// 선택 가능 테이블
<SelectableTable
  columns={columns}
  rows={data}
  selectedRowKeys={selected}
  onSelectedRowKeysChange={setSelected}
  getRowId={(row) => row.id}
/>
```

#### Dropdown (Select)

```tsx
// children 패턴 (Compound Component)
<Dropdown.Select
  value={selectedValue}
  onChange={(value) => setSelectedValue(String(value))}
  placeholder="Select region"
>
  <Dropdown.Option value="kr" label="Korea" />
  <Dropdown.Option value="us" label="United States" />
</Dropdown.Select>

// ComboBox (검색 가능)
<Dropdown.ComboBox
  value={searchValue}
  onChange={handleChange}
  placeholder="Search..."
>
  {filteredOptions.map(opt => (
    <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
  ))}
</Dropdown.ComboBox>
```

#### FormField

```tsx
// children에 자동으로 error 등 props를 주입
<FormField label="Instance Name" required error={nameError}>
  <Input value={name} onChange={(e) => setName(e.target.value)} />
</FormField>

<FormField label="Region" hint="Select your preferred region">
  <Dropdown.Select value={region} onChange={setRegion} placeholder="Select">
    <Dropdown.Option value="kr" label="Korea" />
  </Dropdown.Select>
</FormField>
```

#### Tabs

```tsx
// Uncontrolled
<Tabs defaultActiveTabId="details" variant="line" size="sm">
  <Tab id="details" label="Details">Details content</Tab>
  <Tab id="volumes" label="Volumes">Volumes content</Tab>
</Tabs>

// Controlled
<Tabs activeTabId={activeTab} onChange={setActiveTab} variant="button" size="sm">
  <Tab id="all" label="All">All items</Tab>
  <Tab id="active" label="Active">Active items</Tab>
</Tabs>
```

#### Overlay (Modal / Drawer)

```tsx
// Modal
<Overlay.Template
  type="modal"
  title="Delete Instance"
  description="This action cannot be undone."
  appeared={isModalOpen}
  onConfirm={handleDelete}
  onCancel={() => setIsModalOpen(false)}
  confirmUI="Delete"
  cancelUI="Cancel"
/>

// Drawer
<Overlay.Template
  type="drawer-horizontal"
  title="Edit Instance"
  appeared={isDrawerOpen}
  onConfirm={handleSave}
  onCancel={() => setIsDrawerOpen(false)}
  confirmUI="Save"
  cancelUI="Cancel"
>
  <FormField label="Name" required>
    <Input value={name} onChange={(e) => setName(e.target.value)} />
  </FormField>
</Overlay.Template>
```

#### SectionCard

```tsx
<SectionCard>
  <SectionCard.Header title="Basic Information" />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value={instance.name} />
    <SectionCard.DataRow label="Status">
      <StatusIndicator variant="active" label="Active" />
    </SectionCard.DataRow>
    <SectionCard.DataRow label="Network" value={instance.network} isLink />
  </SectionCard.Content>
</SectionCard>
```

#### DetailPageHeader

```tsx
<DetailPageHeader
  title={instance.name}
  infoFields={[
    { label: 'Status', value: <StatusIndicator variant="active" /> },
    { label: 'ID', value: instance.id, copyText: instance.id },
    { label: 'Host', value: instance.host },
    { label: 'Created at', value: instance.createdAt },
  ]}
  actionButtons={[
    { label: 'Console', icon: <IconTerminal2 size={12} />, onClick: handleConsole },
    { label: 'Start', icon: <IconPlayerPlay size={12} />, onClick: handleStart },
    { label: 'Delete', icon: <IconTrash size={12} />, onClick: handleDelete, variant: 'error' },
  ]}
/>
```

#### StatusIndicator

```tsx
<StatusIndicator variant="active" label="Active" />
<StatusIndicator variant="shutoff" label="Stopped" />
<StatusIndicator variant="error" label="Error" />
<StatusIndicator variant="paused" label="Paused" />
// 16개 variant: active, shutoff, error, paused, building, spawning, ...
```

#### Badge

```tsx
// theme은 약어 사용 (중요!)
<Badge theme="gre" type="solid">Active</Badge>    // green
<Badge theme="red" type="subtle">Failed</Badge>    // red
<Badge theme="blu" size="sm">Info</Badge>           // blue
<Badge theme="ylw">Warning</Badge>                  // yellow
<Badge theme="gry">Disabled</Badge>                 // gray
```

#### Pagination

```tsx
<Pagination
  currentPage={currentPage}
  totalCount={totalItems} // totalCount 기반 (totalPages 아님!)
  size={pageSize} // 페이지당 아이템 수
  onPageChange={setCurrentPage}
  onSizeChange={setPageSize}
/>
```

#### FilterSearchInput

```tsx
import type { FilterKey, FilterKeyWithValue } from '@thaki/shared';

const FILTER_KEYS: FilterKey[] = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status', values: ['running', 'stopped', 'pending'] },
  { key: 'az', label: 'AZ' },
];

const [filters, setFilters] = useState<FilterKeyWithValue[]>([]);

<FilterSearchInput
  filterKeys={FILTER_KEYS}
  placeholder="Search instance by attributes"
  defaultFilterKey="name"
  value={filters}
  onChange={setFilters}
/>;
```

#### ContextMenu

```tsx
// Compound 패턴 (children)
<ContextMenu.Root>
  <ContextMenu.Item label="Edit" onClick={handleEdit} />
  <ContextMenu.Item label="Duplicate" onClick={handleDuplicate} />
  <ContextMenu.Divider />
  <ContextMenu.Item label="Delete" onClick={handleDelete} status="danger" />
</ContextMenu.Root>
```

---

## Part 3: 5가지 페이지 패턴 가이드

### Pattern 1: List Page

**구조**: Title + FilterSearch + Table + Pagination

**대표 예시**: `ComputeInstancesPage.tsx` (`/compute/instances`)

```tsx
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ContextMenu } from '@shared/components/ContextMenu';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Title } from '@shared/components/Title';

export function InstanceListPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [filters, setFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      {/* 헤더: 타이틀 + Create 버튼 */}
      <Title title="Instances" />
      <Button variant="primary" onClick={() => navigate('/compute/instances/create')}>
        Create Instance
      </Button>

      {/* 필터 + 벌크 액션 */}
      <FilterSearchInput filterKeys={FILTER_KEYS} placeholder="Search..." />
      <Button variant="muted" disabled={selected.length === 0}>
        Delete
      </Button>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalCount={total}
        size={20}
        onPageChange={setCurrentPage}
      />

      {/* 선택 가능 테이블 */}
      <SelectableTable
        columns={columns}
        rows={filteredData}
        selectedRowKeys={selected}
        onSelectedRowKeysChange={setSelected}
        getRowId={(row) => row.id}
      />
    </>
  );
}
```

### Pattern 2: Detail Page

**구조**: DetailPageHeader + Tabs + SectionCard

**대표 예시**: `ComputeInstanceDetailPage.tsx` (`/compute/instances/:id`)

```tsx
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Table } from '@shared/components/Table';

export function InstanceDetailPage() {
  return (
    <>
      {/* 헤더: 이름, 상태, ID, 액션 버튼 */}
      <DetailPageHeader
        title={instance.name}
        infoFields={[
          { label: 'Status', value: <StatusIndicator variant="active" /> },
          { label: 'ID', value: instance.id, copyText: instance.id },
        ]}
        actionButtons={[
          { label: 'Console', onClick: handleConsole },
          { label: 'Delete', onClick: handleDelete, variant: 'error' },
        ]}
      />

      {/* 탭: Details, Volumes, Interfaces, ... */}
      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="details" label="Details">
          <SectionCard>
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content>
              <SectionCard.DataRow label="Name" value={instance.name} />
              <SectionCard.DataRow label="AZ" value={instance.az} />
            </SectionCard.Content>
          </SectionCard>
        </Tab>

        <Tab id="volumes" label="Volumes">
          <Table columns={volumeColumns} rows={volumes} />
          <Pagination ... />
        </Tab>
      </Tabs>
    </>
  );
}
```

### Pattern 3: Create Page (Wizard)

**구조**: CreateLayout + FloatingCard (스텝별) + Stepper + Summary

**대표 예시**: `ComputeCreateInstancePage.tsx` (`/compute/instances/create`)

```tsx
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { RadioButton } from '@shared/components/RadioButton';

export function CreateInstancePage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <CreateLayout>
      {/* 좌측: 스텝별 폼 */}
      <CreateLayout.Content>
        <FloatingCard title="Basic Information" status={getStepStatus(0)}>
          <FormField label="Instance Name" required>
            <Input value={name} onChange={...} />
          </FormField>
          <FormField label="Availability Zone">
            <Dropdown.Select value={az} onChange={setAz}>
              <Dropdown.Option value="nova" label="nova" />
            </Dropdown.Select>
          </FormField>
        </FloatingCard>

        <FloatingCard title="Source" status={getStepStatus(1)}>
          <Tabs variant="button" size="sm">
            <Tab id="image" label="Image">
              <Table columns={imageColumns} rows={images} />
            </Tab>
          </Tabs>
        </FloatingCard>
      </CreateLayout.Content>

      {/* 우측: 요약 사이드바 */}
      <CreateLayout.Summary>
        <Stepper steps={steps} activeStep={activeStep} />
        <Button variant="primary" disabled={!isAllDone}>Create</Button>
      </CreateLayout.Summary>
    </CreateLayout>
  );
}
```

### Pattern 4: Form Drawer

**구조**: Overlay.Template type="drawer-horizontal"

**대표 예시**: `EditInstanceDrawer`, `CreateInstanceSnapshotDrawer`

```tsx
<Overlay.Template
  type="drawer-horizontal"
  title="Edit Instance"
  appeared={isOpen}
  onConfirm={handleSave}
  onCancel={onClose}
  confirmUI="Save"
  cancelUI="Cancel"
>
  <Layout.VStack gap="lg">
    <FormField label="Instance Name" required>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
    </FormField>
    <FormField label="Description">
      <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
    </FormField>
  </Layout.VStack>
</Overlay.Template>
```

### Pattern 5: Dashboard

**구조**: 쿼타 카드 + 리소스 테이블 + 차트

**대표 예시**: `ComputeHomePage.tsx` (`/compute`)

```tsx
import { ProgressBar } from '@shared/components/ProgressBar';
import { Badge } from '@shared/components/Badge';
import { Table } from '@shared/components/Table';

export function ComputeDashboard() {
  return (
    <>
      {/* 쿼타 바 */}
      <ProgressBar value={used} max={total} variant="success" showValue="fraction" />

      {/* 리소스 현황 테이블 */}
      <Table columns={resourceColumns} rows={resourceData} />

      {/* 최근 활동 */}
      <Table columns={activityColumns} rows={recentActivities} />
    </>
  );
}
```

---

## Part 4: CSS / 토큰 사용법

### 4.1 CSS 엔트리포인트

```tsx
// 앱 엔트리에서 한 번 import
import '@thaki/shared/index.css'; // 전체 (core + tailwind utilities)
import '@thaki/shared/core.css'; // core만 (tailwind 없이)
import '@thaki/shared/tokens-only.css'; // CSS 변수만
```

### 4.2 Tailwind Preset

```js
// tailwind.config.ts
import sharedPreset from '@thaki/shared/tailwind.preset';

export default {
  presets: [sharedPreset],
  content: ['./src/**/*.{ts,tsx}'],
};
```

### 4.3 디자인 토큰 네이밍

```css
/* Semantic 토큰 (용도 기반) */
--semantic-color-primary
--semantic-color-surface
--semantic-color-text
--semantic-color-textMuted
--semantic-color-border
--semantic-color-success
--semantic-color-error

/* Primitive 토큰 (절대값) */
--primitive-color-blue600
--primitive-color-blueGray100
--primitive-space-4
--semantic-radius-base8
```

### 4.4 Tailwind 유틸리티 클래스

```tsx
// 색상 (semantic 토큰 매핑)
<div className="bg-surface text-text">기본</div>
<div className="bg-surface-subtle text-text-muted">보조</div>
<div className="border-border">테두리</div>
<div className="text-success">성공</div>
<div className="text-error">에러</div>

// 간격 (semantic 토큰)
<div className="p-4 gap-3">간격</div>

// 반경
<div className="rounded-base8">8px radius</div>
<div className="rounded-lg">large radius</div>
```

### 4.5 다크모드

```html
<!-- light (기본) -->
<html>
  <!-- dark -->
  <html data-theme="dark"></html>
</html>
```

### 4.6 유틸리티

```tsx
import { cn } from '@thaki/shared';

<div className={cn('bg-surface p-4', isActive && 'border-primary', className)}>
```

---

## Part 5: 알려진 차이점 및 주의사항

### 5.1 TDS SSoT vs shared 라이브러리 API 차이

TDS SSoT(`@thaki/tds`)는 디자인 시스템 원본이고, shared(`@ThakiCloud/shared`)는 프로덕션에서 사용하는 라이브러리입니다. 주요 API 차이:

| 영역             | shared (`@ThakiCloud/shared`)                    | TDS (`@thaki/tds`)                                 |
| ---------------- | ------------------------------------------------ | -------------------------------------------------- |
| **Select**       | `Dropdown.Select` + `Dropdown.Option` (children) | `Select options={[...]}` (배열 props)              |
| **FormField**    | 단일 컴포넌트 (children에 props 자동 주입)       | Compound (Label + Control + HelperText)            |
| **ContextMenu**  | Compound (`Root` + `Item` + `Divider`)           | 배열 기반 (`items` prop)                           |
| **Pagination**   | `totalCount` + `size` → 자동 계산                | `totalPages` 직접 제공                             |
| **Badge**        | 약어 theme (`gre`, `blu`, `ylw`, `gry`)          | 전체 이름 (`info`, `success`, `warning`)           |
| **Button**       | `variant` + `appearance` 분리                    | `variant`에 통합 (`primary`, `secondary`, `ghost`) |
| **Toast**        | `sonner` + `Toast` 컴포넌트 직접 사용            | Provider 패턴 (`useToast`)                         |
| **Modal/Drawer** | `Overlay.Template` (type으로 구분)               | `Modal` / `Drawer` 별도 컴포넌트                   |
| **Typography**   | `Typography.Title` / `Typography.Text`           | Tailwind utility 클래스 (`text-heading-h5`)        |

### 5.2 프리뷰 앱과 실제 앱의 차이

| 항목          | 프리뷰 앱              | 실제 앱 (thaki-ui)               |
| ------------- | ---------------------- | -------------------------------- |
| **라우팅**    | `react-router-dom` v6  | TanStack Router + 가상 탭 라우팅 |
| **데이터**    | 하드코딩된 mock 데이터 | TanStack Query + API 연동        |
| **폼 관리**   | `useState` 기반        | React Hook Form + Zod            |
| **상태 관리** | 로컬 state만 사용      | Zustand + React Context          |
| **i18n**      | 영어 하드코딩          | i18next 다국어                   |
| **인증**      | 없음                   | AuthProvider + 토큰 관리         |

### 5.3 Mock 데이터 위치

```
thaki-shared-v2/preview/src/pages/
├── computeInstancesMockData.ts      # Instance 목록 mock
├── instanceDetailPageMockData.ts    # Instance 상세 mock
└── tableDateDisplay.ts              # 날짜 포맷 유틸
```

각 페이지 파일 내에 인라인으로 정의된 mock 데이터도 있습니다.

### 5.4 구현 시 주의사항

1. **패키지 이름**: `@ThakiCloud/shared` (대소문자 주의, `@thakicloud/shared` 아님)
2. **앱 alias**: `@thaki/shared`로 import (tsconfig paths 설정 필요)
3. **Badge theme 약어**: `gre`(green), `blu`(blue), `ylw`(yellow), `gry`(gray) — 전체 이름 사용 불가
4. **Toast**: `@thaki/shared`가 아닌 `sonner` 패키지에서 `toast` import
5. **Table getRowId**: `Table`이 아닌 `SelectableTable`에서만 사용
6. **Overlay appeared**: `isOpen`이 아닌 `appeared` prop 사용

### 5.5 프리뷰 사이트 URL 구조

```
https://thakicloud.github.io/tds_ssot/shared-v2/

# 앱별 진입점
/shared-v2/                          → Entry (앱 허브)
/shared-v2/compute/instances         → Compute 인스턴스 리스트
/shared-v2/compute/instances/vm-001  → Compute 인스턴스 상세
/shared-v2/compute-admin/            → Compute Admin 홈
/shared-v2/container/dashboard       → Container 대시보드
/shared-v2/iam/                      → IAM 홈
/shared-v2/storage/                  → Storage 홈
/shared-v2/design/                   → 컴포넌트 쇼케이스
```

---

## 참고 문서

| 문서          | 경로                                   | 설명                         |
| ------------- | -------------------------------------- | ---------------------------- |
| AI Guide      | `thaki-shared-v2/AI_GUIDE.md`          | 컴포넌트 Quick Start         |
| API 비교      | `COMPONENT_API_COMPARISON.md`          | TDS vs shared Props 비교     |
| Code-to-Code  | `CODE_TO_CODE_GUIDE.md`                | 페이지 패턴 및 URL→소스 매핑 |
| 프로덕션 분석 | `THAKI_UI_SHARED_ANALYSIS.md`          | thaki-ui 코드베이스 분석     |
| 라우팅 정의   | `thaki-shared-v2/preview/src/main.tsx` | 전체 라우트 트리             |
| 패키지 정보   | `thaki-shared-v2/package.json`         | 버전, 의존성, 배포 설정      |
