# TDS Design System Reference

THAKI Design System (TDS)은 THAKI Cloud 플랫폼을 위한 디자인 시스템입니다.

## 목차

- [시작하기](#시작하기)
- [토큰 아키텍처](#토큰-아키텍처)
- [컴포넌트](#컴포넌트)
  - [Form Controls](#form-controls)
  - [Data Display](#data-display)
    - [Table Column Width Presets](#table-column-width-presets)
  - [Layout](#layout)
  - [Navigation](#navigation)
  - [Feedback](#feedback)
  - [Patterns](#patterns)
- [스타일 가이드](#스타일-가이드)

---

## 시작하기

### Import

```tsx
import { 
  Button, Input, Select, Checkbox, Radio, Toggle,
  Table, Badge, StatusIndicator,
  Modal, Drawer, FormField, SectionCard,
  VStack, HStack, Container,
  // Wizard Pattern
  WizardSection, WizardSummary, DoneSection, DoneSectionRow,
  PreSection, WritingSection, SkippedSection,
} from '@/design-system';
```

### 라이브 문서

디자인 시스템 페이지에서 모든 컴포넌트를 확인할 수 있습니다:
- 로컬: `http://localhost:5173/design`
- 배포: `https://your-domain/design`

---

## 토큰 아키텍처

TDS는 3-tier 토큰 구조를 사용합니다:

```
Primitive → Semantic → Component
```

### Primitive Tokens

원시 디자인 값입니다.

| 카테고리 | 예시 |
|---------|------|
| Colors | `--color-slate-500`, `--color-blue-600` |
| Spacing | `--spacing-1` (4px), `--spacing-4` (16px) |
| Font Size | `--font-size-12` (12px), `--font-size-16` (16px) |
| Radius | `--radius-sm` (4px), `--radius-md` (6px) |

### Semantic Tokens

목적 기반 토큰입니다.

| 토큰 | 용도 | Light Mode |
|-----|------|------------|
| `--color-text-default` | 기본 텍스트 | slate-800 |
| `--color-text-muted` | 보조 텍스트 | slate-600 |
| `--color-text-subtle` | 약한 텍스트 | slate-500 |
| `--color-surface-default` | 기본 배경 | white |
| `--color-border-default` | 기본 테두리 | slate-200 |
| `--color-action-primary` | 주요 액션 | blue-600 |
| `--color-state-danger` | 위험/에러 | red-600 |
| `--color-state-success` | 성공 | green-600 |
| `--color-state-warning` | 경고 | orange-600 |

### Typography Scale

| 레벨 | Font Size | Line Height | 용도 |
|-----|-----------|-------------|------|
| h1 | 40px | 48px | 페이지 타이틀 |
| h2 | 32px | 40px | 섹션 타이틀 |
| h3 | 24px | 32px | 서브 섹션 |
| h4 | 18px | 28px | 카드 타이틀 |
| h5 | 16px | 24px | 작은 타이틀 |
| body.lg | 14px | 20px | 큰 본문 |
| body.md | 12px | 18px | 기본 본문 |
| body.sm | 11px | 16px | 작은 텍스트 |

---

## 컴포넌트

### Form Controls

#### Button

```tsx
<Button variant="primary" size="md">Primary</Button>
<Button variant="secondary" size="sm">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button disabled>Disabled</Button>
<Button leftIcon={<IconPlus size={12} />}>With Icon</Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `primary` \| `secondary` \| `ghost` \| `danger` | `secondary` | 버튼 스타일 |
| size | `sm` \| `md` \| `lg` | `md` | 버튼 크기 |
| disabled | boolean | false | 비활성화 |
| leftIcon | ReactNode | - | 왼쪽 아이콘 |
| rightIcon | ReactNode | - | 오른쪽 아이콘 |
| fullWidth | boolean | false | 전체 너비 |

#### Input

```tsx
<Input placeholder="Enter text" />
<Input value={value} onChange={(e) => setValue(e.target.value)} fullWidth />
<Input disabled />
<Input error />
```

**Variants:**
- `Input` - 기본 텍스트 입력
- `NumberInput` - 숫자 입력 (증감 버튼 포함)
- `SearchInput` - 검색 입력 (아이콘 포함)
- `Textarea` - 여러 줄 텍스트

#### Select

```tsx
<Select
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Select option"
  fullWidth
/>
```

#### FormField

라벨, 입력, 도움말을 조합하는 compound component입니다.

```tsx
<FormField required>
  <FormField.Label>Instance Name</FormField.Label>
  <FormField.Control>
    <Input placeholder="Enter name" fullWidth />
  </FormField.Control>
  <FormField.HelperText>
    이름은 1-128자의 문자열이어야 합니다.
  </FormField.HelperText>
</FormField>
```

**에러 상태:**
```tsx
<FormField error>
  <FormField.Label>Password</FormField.Label>
  <FormField.Control>
    <Input type="password" fullWidth />
  </FormField.Control>
  <FormField.ErrorMessage>
    비밀번호는 8자 이상이어야 합니다.
  </FormField.ErrorMessage>
</FormField>
```

**Label Sizes:**
- `size="md"` (14px) - 기본
- `size="sm"` (12px) - 작은 라벨

#### Checkbox / Radio / Toggle

```tsx
// Checkbox
<Checkbox checked={checked} onChange={setChecked} label="Accept terms" />

// CheckboxGroup
<CheckboxGroup
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ]}
  value={selected}
  onChange={setSelected}
/>

// Radio
<RadioGroup
  options={[
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
  ]}
  value={selected}
  onChange={setSelected}
/>

// Toggle
<Toggle checked={enabled} onChange={setEnabled} label="Enable feature" />
```

---

### Data Display

#### Table

```tsx
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', render: (_, row) => <StatusIndicator status={row.status} /> },
  { key: 'createdAt', label: 'Created', width: '150px' },
];

<Table
  columns={columns}
  data={items}
  selectable
  selectedRows={selected}
  onSelectedRowsChange={setSelected}
  onRowClick={(row) => navigate(`/items/${row.id}`)}
/>
```

##### Table Column Width Presets

테이블 컬럼 너비를 일관되게 관리하기 위한 프리셋입니다.

**Import:**
```tsx
import { columnWidths } from '@/design-system';
```

**기본 사용법:**
```tsx
const columns = [
  { key: 'select', width: columnWidths.select },      // 고정 40px
  { key: 'status', width: columnWidths.status },      // 고정 64px
  { key: 'name', flex: 1 },                           // 가변 (남은 공간 채움)
  { key: 'createdAt', width: columnWidths.createdAt }, // 고정 140px
  { key: 'actions', width: columnWidths.actions },    // 고정 64px
];
```

**주요 프리셋 카테고리:**

| 카테고리 | 프리셋 | 너비 |
|---------|--------|------|
| **선택** | `select`, `checkbox` | 40px |
| **액션** | `actions` | 64px |
| **상태** | `status` | 64px |
| **이름** | `name` | 180px |
| **시간** | `createdAt`, `updatedAt` | 140px |
| **타입** | `type` | 100px |
| **IP** | `ip`, `fixedIp`, `floatingIp` | 130px |
| **설명** | `description` | 200px |

**너비 설정 패턴:**

1. **고정 너비** - 숫자, 날짜, 상태 컬럼에 적합
```tsx
{ key: 'status', width: columnWidths.status }
{ key: 'createdAt', width: columnWidths.createdAt }
```

2. **가변 너비 (flex)** - 이름, 설명 등 콘텐츠 컬럼에 적합
```tsx
{ key: 'name', flex: 1 }
{ key: 'description', flex: 1 }
```

3. **반응형 (flex + minWidth)** - 컬럼이 많은 테이블에서 사용
```tsx
{ key: 'name', flex: 1, minWidth: columnWidths.name }
```

**권장 사항:**
- 하나의 테이블에 최소 1개의 `flex: 1` 컬럼 필요
- 컬럼 8개 이상 테이블은 `flex + minWidth` 권장
- 총 고정 너비 800px 초과 시 오버플로우 위험
- 액션 컬럼에 `minWidth` 추가하여 축소 방지:
```tsx
{ key: 'actions', width: columnWidths.actions, minWidth: columnWidths.actions }
```

**truncate 적용 시:**
```tsx
{
  key: 'name',
  flex: 1,
  render: (_, row) => (
    <span className="truncate block">{row.name}</span>
  )
}
```

> **Note**: `truncate`는 `block` 또는 `inline-block`과 함께 사용해야 동작합니다.

#### Badge

```tsx
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="muted">Muted</Badge>
```

**Sizes:** `sm`, `md`, `lg`

#### StatusIndicator

```tsx
<StatusIndicator status="active" label="Running" />
<StatusIndicator status="error" label="Error" />
<StatusIndicator status="muted" label="Stopped" />
<StatusIndicator status="building" label="Building" />
```

#### Pagination

```tsx
<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

---

### Layout

#### VStack / HStack

```tsx
<VStack gap={4} align="stretch">
  <div>Item 1</div>
  <div>Item 2</div>
</VStack>

<HStack gap={2} justify="between" align="center">
  <span>Left</span>
  <Button>Right</Button>
</HStack>
```

**Props:**
| Prop | Values |
|------|--------|
| gap | 0-16 (spacing scale) |
| align | `start`, `center`, `end`, `stretch` |
| justify | `start`, `center`, `end`, `between`, `around` |

#### SectionCard

```tsx
<SectionCard>
  <SectionCard.Header 
    title="Basic Information" 
    actions={<Button size="sm" leftIcon={<IconEdit size={12} />}>Edit</Button>} 
  />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value="instance-01" />
    <SectionCard.DataRow label="Status" value={<StatusIndicator status="active" />} />
    <SectionCard.DataRow label="Created" value="2025-01-01" />
  </SectionCard.Content>
</SectionCard>
```

#### DetailHeader

```tsx
<DetailHeader>
  <DetailHeader.Title>{resource.name}</DetailHeader.Title>
  <DetailHeader.Actions>
    <Button variant="secondary">Edit</Button>
    <Button variant="danger">Delete</Button>
  </DetailHeader.Actions>
</DetailHeader>
```

---

### Navigation

#### Tabs

```tsx
// Underline variant (기본)
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>

// Boxed variant
<Tabs defaultValue="tab1" variant="boxed">
  ...
</Tabs>
```

#### Breadcrumb

```tsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Compute', href: '/compute' },
    { label: 'Instances' },
  ]}
/>
```

#### SNBMenuItem

Side Navigation Bar Menu Item - 좁은 사이드바용 메뉴 아이템

```tsx
// Icon type (기본)
<SNBMenuItem isSelected={false}>
  <IconHome size={22} stroke={1} />
</SNBMenuItem>

// Selected state
<SNBMenuItem isSelected={true}>
  <IconHome size={22} stroke={1} />
</SNBMenuItem>

// Text type (프로젝트 이니셜)
<SNBMenuItem type="text" text="P" status="selected" />

// With onClick handler
<SNBMenuItem
  isSelected={currentPath === '/home'}
  onClick={() => navigate('/home')}
>
  <IconHome size={22} stroke={1} />
</SNBMenuItem>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'default' \| 'hover' \| 'selected'` | - | 상태 직접 지정 |
| `isSelected` | `boolean` | `false` | 선택 상태 (status 대신 사용) |
| `type` | `'icon' \| 'text'` | `'icon'` | 아이콘 또는 텍스트 |
| `text` | `string` | - | type="text"일 때 표시할 텍스트 |
| `onClick` | `() => void` | - | 클릭 핸들러 |
| `children` | `ReactNode` | - | 아이콘 요소 |

**스타일:**
- Size: 38×38px
- Padding: 8px 6px
- Border radius: 8px
- Icon size: 22px

**상태별 색상:**
- Default: 흰색 배경, 회색 아이콘 (`#64748b`)
- Hover: 연한 배경 (`#f8fafc`), 진한 회색 아이콘 (`#334155`)
- Selected: 파란 배경 (`#eff6ff`), 파란 아이콘 (`#2563eb`)

---

### Feedback

#### Modal

```tsx
<Modal open={isOpen} onClose={handleClose}>
  <Modal.Header>
    <Modal.Title>Confirm Delete</Modal.Title>
    <Modal.Description>
      This action cannot be undone.
    </Modal.Description>
  </Modal.Header>
  <Modal.Content>
    Are you sure you want to delete this item?
  </Modal.Content>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </Modal.Footer>
</Modal>
```

#### Drawer

```tsx
<Drawer open={isOpen} onClose={handleClose} title="Edit Instance">
  <Drawer.Content>
    <FormField>
      <FormField.Label>Name</FormField.Label>
      <FormField.Control>
        <Input value={name} onChange={(e) => setName(e.target.value)} fullWidth />
      </FormField.Control>
    </FormField>
  </Drawer.Content>
  <Drawer.Footer>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleSave}>Save</Button>
  </Drawer.Footer>
</Drawer>
```

#### InlineMessage

```tsx
<InlineMessage variant="info">Information message</InlineMessage>
<InlineMessage variant="success">Success message</InlineMessage>
<InlineMessage variant="warning">Warning message</InlineMessage>
<InlineMessage variant="error">Error message</InlineMessage>
```

#### Tooltip

```tsx
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

#### Loading

```tsx
// Spinner (기본)
<Loading variant="spinner" text="Loading" size="md" />

// Progress bar
<Loading 
  variant="progress" 
  text="Loading.."
  description="Create an instance to start using compute resources."
  progress={68}
  statusText="Status: parsing"
/>

// Button (disabled loading state)
<Loading variant="button" buttonLabel="Loading" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'spinner' \| 'progress' \| 'button'` | `'spinner'` | 로딩 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 스피너 크기 |
| `text` | `string` | `'Loading'` | 로딩 텍스트 |
| `description` | `string` | - | 설명 텍스트 (progress) |
| `progress` | `number` | `0` | 진행률 0-100 (progress) |
| `statusText` | `string` | - | 상태 텍스트 (progress) |
| `buttonLabel` | `string` | `'Loading'` | 버튼 라벨 (button) |

---

### Patterns

#### Wizard (Create Flow)

리소스 생성 마법사 패턴입니다. 여러 단계를 순차적으로 진행하며, 각 섹션의 상태를 관리합니다.

**Import:**
```tsx
import { 
  WizardSection,
  WizardSummary,
  WizardSectionStatusIcon,
  PreSection,
  WritingSection,
  SkippedSection,
  DoneSection,
  DoneSectionRow,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
```

**섹션 상태 (WizardSectionState):**
| 상태 | 설명 | 아이콘 |
|------|------|--------|
| `pre` | 대기 중 | 빈 원 |
| `active` | 현재 편집 중 | 회전 아이콘 |
| `done` | 완료됨 | 녹색 체크 |
| `skipped` | 건너뜀 | 마이너스 |
| `writing` | 작성 중 (임시 저장) | "Writing..." 텍스트 |

**WizardSummary - 진행 상태 요약:**
```tsx
const sections: WizardSummaryItem[] = [
  { key: 'basic-info', label: 'Basic Information', status: 'done' },
  { key: 'image', label: 'Image', status: 'active' },
  { key: 'flavor', label: 'Flavor', status: 'pre' },
  { key: 'network', label: 'Network', status: 'pre' },
];

<WizardSummary 
  title="Summary" 
  items={sections}
  onItemClick={(key) => scrollToSection(key)}
/>
```

**PreSection - 대기 중인 섹션:**
```tsx
<PreSection title="Network" />
```

**WritingSection - 작성 중인 섹션:**
```tsx
<WritingSection title="Image" />
```

**SkippedSection - 건너뛴 섹션:**
```tsx
<SkippedSection 
  title="Advanced" 
  onEdit={() => handleEdit('advanced')} 
/>
```

**DoneSection - 완료된 섹션:**
```tsx
<DoneSection title="Basic Information" onEdit={() => handleEdit('basic-info')}>
  <DoneSectionRow label="Instance Name" value="my-instance" />
  <DoneSectionRow label="AZ" value="nova (Default)" />
  <DoneSectionRow label="Description" value="My test instance" />
</DoneSection>
```

**WizardSection - 통합 컴포넌트:**
```tsx
<WizardSection
  title="Basic Information"
  status={sectionStatus['basic-info']}
  onEdit={() => handleEdit('basic-info')}
  summaryContent={
    <>
      <DoneSectionRow label="Instance Name" value={instanceName} />
      <DoneSectionRow label="AZ" value={az} />
    </>
  }
>
  {/* Active 상태일 때 렌더링되는 폼 */}
  <SectionCard isActive>
    <SectionCard.Header title="Basic Information" />
    <SectionCard.Content>
      <FormField>
        <FormField.Label>Instance Name</FormField.Label>
        <FormField.Control>
          <Input value={instanceName} onChange={setInstanceName} />
        </FormField.Control>
      </FormField>
    </SectionCard.Content>
  </SectionCard>
</WizardSection>
```

**전체 Create Flow 구조:**
```tsx
function CreateResourcePage() {
  // 섹션 상태 관리
  const [sectionStatus, setSectionStatus] = useState<Record<string, WizardSectionState>>({
    'basic-info': 'active',
    'config': 'pre',
    'advanced': 'pre',
  });
  
  // 편집 모드 관리
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // 다음 섹션으로 이동
  const handleNext = (currentSection: string) => {
    const nextSection = getNextSection(currentSection);
    setSectionStatus(prev => ({
      ...prev,
      [currentSection]: 'done',
      [nextSection]: 'active',
    }));
  };
  
  // 섹션 건너뛰기
  const handleSkip = (section: string) => {
    const nextSection = getNextSection(section);
    setSectionStatus(prev => ({
      ...prev,
      [section]: 'skipped',
      [nextSection]: 'active',
    }));
  };
  
  // 섹션 편집
  const handleEdit = (section: string) => {
    // 현재 활성 섹션을 'writing' 상태로 변경
    setSectionStatus(prev => {
      const newStatus = { ...prev };
      for (const key of Object.keys(newStatus)) {
        if (newStatus[key] === 'active') {
          newStatus[key] = 'writing';
        }
      }
      newStatus[section] = 'active';
      return newStatus;
    });
    setEditingSection(section);
  };
  
  return (
    <HStack gap={6} align="start">
      {/* 메인 콘텐츠 */}
      <VStack gap={4} className="flex-1">
        {/* 각 섹션 렌더링 */}
        {SECTIONS.map(section => (
          <WizardSection
            key={section.key}
            title={section.label}
            status={sectionStatus[section.key]}
            onEdit={() => handleEdit(section.key)}
            summaryContent={renderSummary(section.key)}
          >
            {renderActiveSection(section.key)}
          </WizardSection>
        ))}
      </VStack>
      
      {/* 사이드바 */}
      <div className="w-[312px] sticky top-4">
        <WizardSummary
          items={SECTIONS.map(s => ({
            key: s.key,
            label: s.label,
            status: sectionStatus[s.key],
          }))}
        />
        
        {/* Create 버튼 */}
        <HStack justify="end" className="mt-4">
          <Button variant="secondary">Cancel</Button>
          <Button 
            variant="primary" 
            disabled={!isAllCompleted}
          >
            Create
          </Button>
        </HStack>
      </div>
    </HStack>
  );
}
```

**템플릿 적용 패턴:**
```tsx
// 템플릿 선택 시 모든 섹션 자동 완료
const applyTemplate = (template: Template) => {
  // 템플릿 값으로 폼 데이터 설정
  setInstanceName(template.config.instanceName);
  setImage(template.config.image);
  // ...
  
  // 첫 번째 섹션만 active, 나머지는 done
  setSectionStatus({
    'basic-info': 'active',  // 이름만 확인/수정
    'image': 'done',
    'flavor': 'done',
    'network': 'done',
    'advanced': 'done',
  });
};
```

---

## 스타일 가이드

### 필수 필드 표시

```tsx
<label>
  Field Name<span className="ml-1 text-[var(--color-state-danger)]">*</span>
</label>
```

> **Note**: `ml-1` (4px)로 별표 앞에 공백을 추가합니다.

### Helper Text

```tsx
<span className="text-[11px] text-[var(--color-text-subtle)]">
  도움말 텍스트
</span>
```

### Divider

```tsx
<div className="w-full h-px bg-[var(--color-border-subtle)]" />
```

### 아이콘 사용

Tabler Icons를 사용합니다:

```tsx
import { IconPlus, IconEdit, IconTrash, IconChevronRight } from '@tabler/icons-react';

// 버튼 내 아이콘
<Button leftIcon={<IconPlus size={12} />}>Add</Button>

// 일반 아이콘
<IconEdit size={16} stroke={1.5} />
```

**아이콘 크기 가이드:**
- 버튼 (sm): `size={12}`
- 버튼 (md/lg): `size={14}`
- 테이블/리스트: `size={16}`
- 네비게이션: `size={18-20}`

### 색상 사용

```tsx
// 텍스트
className="text-[var(--color-text-default)]"    // 기본
className="text-[var(--color-text-muted)]"      // 보조
className="text-[var(--color-text-subtle)]"     // 약함

// 배경
className="bg-[var(--color-surface-default)]"   // 기본
className="bg-[var(--color-surface-subtle)]"    // 약함

// 테두리
className="border-[var(--color-border-default)]"
className="border-[var(--color-border-subtle)]"

// 상태
className="text-[var(--color-state-danger)]"    // 에러/위험
className="text-[var(--color-state-success)]"   // 성공
className="text-[var(--color-action-primary)]"  // 링크/액션
```

---

## 버전

- **Current Version**: 1.2.0
- **Last Updated**: 2026-01-26
- **Changes**: 
  - Table Column Width Presets 가이드 추가
  - columnWidths 프리셋 값 조정 (gpu, type, protocol, adminState)


