# TDS Design System Reference

THAKI Design System (TDS)은 THAKI Cloud 플랫폼을 위한 디자인 시스템입니다.

## 목차

- [시작하기](#시작하기)
- [토큰 아키텍처](#토큰-아키텍처)
- [컴포넌트](#컴포넌트)
  - [Form Controls](#form-controls)
  - [Data Display](#data-display)
  - [Layout](#layout)
  - [Navigation](#navigation)
  - [Feedback](#feedback)
- [스타일 가이드](#스타일-가이드)

---

## 시작하기

### Import

```tsx
import { 
  Button, Input, Select, Checkbox, Radio, Toggle,
  Table, Badge, StatusIndicator,
  Modal, Drawer, FormField, SectionCard,
  VStack, HStack, Container
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

---

## 스타일 가이드

### 필수 필드 표시

```tsx
<label>
  Field Name <span className="text-[var(--color-state-danger)]">*</span>
</label>
```

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

- **Current Version**: 1.0.0
- **Last Updated**: 2026-01-06


