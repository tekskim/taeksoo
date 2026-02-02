# TDS ↔ thaki-ui 마이그레이션 가이드

이 문서는 TDS 디자인 시스템과 thaki-ui 프로덕션 코드 간의 변환 가이드를 제공합니다.

## 목차
1. [Tabs 구조 변환](#1-tabs-구조-변환)
2. [Toast Provider 패턴](#2-toast-provider-패턴)
3. [Compound Component 패턴](#3-compound-component-패턴)
4. [호환 레이어 사용법](#4-호환-레이어-사용법)

---

## 1. Tabs 구조 변환

### TDS Tabs (권장)

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@/design-system';

function MyComponent() {
  const [activeTab, setActiveTab] = useState('details');
  
  return (
    <Tabs value={activeTab} onChange={setActiveTab} variant="underline">
      <TabList>
        <Tab value="details">Details</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="logs">Logs</Tab>
      </TabList>
      
      <TabPanel value="details">
        <DetailsContent />
      </TabPanel>
      <TabPanel value="settings">
        <SettingsContent />
      </TabPanel>
      <TabPanel value="logs">
        <LogsContent />
      </TabPanel>
    </Tabs>
  );
}
```

### thaki-ui Tabs 스타일 (호환 지원)

```tsx
// thaki-ui 스타일 - TDS에서 호환 지원됨
<Tabs 
  activeTabId="details"      // → value로 내부 변환
  variant="line"             // → "underline"으로 내부 변환
  onChange={setActiveTab}
>
  {/* ... */}
</Tabs>

// variant 매핑
// thaki-ui "line"   → TDS "underline"
// thaki-ui "button" → TDS "boxed"
```

### 변환 테이블

| thaki-ui | TDS | 설명 |
|----------|-----|------|
| `activeTabId` | `value` | 현재 활성 탭 ID |
| `variant="line"` | `variant="underline"` | 밑줄 스타일 |
| `variant="button"` | `variant="boxed"` | 박스 스타일 |
| `onTabChange` | `onChange` | 탭 변경 콜백 |

---

## 2. Toast Provider 패턴

### TDS Toast (Provider 패턴)

TDS는 Toast를 위해 Provider 패턴을 사용합니다.

```tsx
// App.tsx - Provider 설정
import { ToastProvider, ToastContainer } from '@/design-system';

function App() {
  return (
    <ToastProvider>
      <YourApp />
      <ToastContainer />
    </ToastProvider>
  );
}
```

```tsx
// 사용 컴포넌트에서
import { useToast } from '@/design-system';

function MyComponent() {
  const { addToast, removeToast } = useToast();
  
  const handleSuccess = () => {
    addToast({
      type: 'success',
      title: 'Success',
      message: 'Operation completed successfully',
      duration: 5000,
    });
  };
  
  const handleError = () => {
    addToast({
      type: 'error',
      title: 'Error',
      message: 'Something went wrong',
      detail: {
        code: 'ERR_001',
        content: 'Detailed error message...'
      },
      action: {
        label: 'Retry',
        onClick: () => handleRetry()
      }
    });
  };
  
  return (
    <Button onClick={handleSuccess}>Show Toast</Button>
  );
}
```

### thaki-ui Toast 스타일 변환

```tsx
// thaki-ui 스타일
toast.positive('Operation successful');
toast.negative('Operation failed');

// TDS 스타일로 변환
addToast({ type: 'success', message: 'Operation successful' });
addToast({ type: 'error', message: 'Operation failed' });
```

### 타입 매핑

| thaki-ui | TDS | 설명 |
|----------|-----|------|
| `positive` | `success` | 성공 메시지 |
| `negative` | `error` | 에러 메시지 |
| - | `warning` | 경고 메시지 (TDS 추가) |
| - | `info` | 정보 메시지 (TDS 추가) |

---

## 3. Compound Component 패턴

### 3.1 FormField

**TDS 스타일 (Compound Component)**

```tsx
import { FormField, Input } from '@/design-system';

<FormField required error>
  <FormField.Label>Username</FormField.Label>
  <FormField.Control>
    <Input placeholder="Enter username" fullWidth />
  </FormField.Control>
  <FormField.ErrorMessage>
    Username is required
  </FormField.ErrorMessage>
</FormField>

// 정상 상태
<FormField required>
  <FormField.Label>Email</FormField.Label>
  <FormField.Control>
    <Input type="email" placeholder="Enter email" fullWidth />
  </FormField.Control>
  <FormField.HelperText>
    We'll never share your email
  </FormField.HelperText>
</FormField>
```

**thaki-ui 스타일 변환**

```tsx
// thaki-ui
<FormField 
  label="Username" 
  required 
  error="Username is required"
>
  <Input />
</FormField>

// → TDS로 변환
<FormField required error>
  <FormField.Label>Username</FormField.Label>
  <FormField.Control>
    <Input fullWidth />
  </FormField.Control>
  <FormField.ErrorMessage>Username is required</FormField.ErrorMessage>
</FormField>
```

### 3.2 Disclosure

**TDS 스타일 (Compound Component)**

```tsx
import { Disclosure } from '@/design-system';

<Disclosure defaultOpen>
  <Disclosure.Trigger>
    Click to expand
  </Disclosure.Trigger>
  <Disclosure.Panel>
    <p>Hidden content that expands when clicked.</p>
  </Disclosure.Panel>
</Disclosure>

// Controlled
const [isOpen, setIsOpen] = useState(false);

<Disclosure open={isOpen} onChange={setIsOpen}>
  <Disclosure.Trigger>
    {isOpen ? 'Click to collapse' : 'Click to expand'}
  </Disclosure.Trigger>
  <Disclosure.Panel>
    <p>Controlled disclosure content.</p>
  </Disclosure.Panel>
</Disclosure>
```

**thaki-ui 스타일 변환**

```tsx
// thaki-ui
<Disclosure 
  label="Click to expand" 
  expanded={isOpen}
  onExpandChange={setIsOpen}
>
  <p>Content</p>
</Disclosure>

// → TDS로 변환
<Disclosure open={isOpen} onChange={setIsOpen}>
  <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>Content</p>
  </Disclosure.Panel>
</Disclosure>
```

### 3.3 SectionCard

**TDS 스타일 (Compound Component)**

```tsx
import { SectionCard, StatusIndicator, Button } from '@/design-system';
import { IconEdit } from '@tabler/icons-react';

<SectionCard>
  <SectionCard.Header 
    title="Basic Information" 
    actions={
      <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
        Edit
      </Button>
    }
  />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value="my-instance-01" />
    <SectionCard.DataRow label="ID" value="i-1234567890" copyable />
    <SectionCard.DataRow label="Status">
      <StatusIndicator status="active" label="Active" />
    </SectionCard.DataRow>
    <SectionCard.DataRow 
      label="Network" 
      value="vpc-network-01" 
      isLink 
      linkHref="/networks/vpc-network-01" 
    />
  </SectionCard.Content>
</SectionCard>
```

---

## 4. 호환 레이어 사용법

TDS 컴포넌트들은 thaki-ui API를 일부 지원합니다. 이는 마이그레이션을 쉽게 하기 위함입니다.

### 4.1 Badge

```tsx
// TDS 네이티브
<Badge theme="blue" type="subtle">Label</Badge>

// thaki-ui 호환 (deprecated, 동작함)
<Badge theme="blu">Label</Badge>  // → "blue"로 자동 변환
<Badge theme="gry">Label</Badge>  // → "gray"로 자동 변환
<Badge theme="gre">Label</Badge>  // → "green"로 자동 변환
<Badge theme="ylw">Label</Badge>  // → "yellow"로 자동 변환
```

### 4.2 Table

```tsx
// TDS 네이티브
<Table columns={columns} data={data} />

// thaki-ui 호환 (deprecated, 동작함)
<Table columns={columns} rows={data} />  // rows → data로 자동 변환

// Column 정의
const columns = [
  { key: 'name', label: 'Name' },        // TDS
  { key: 'name', header: 'Name' },       // thaki-ui (deprecated)
];
```

### 4.3 Button

```tsx
// TDS 네이티브
<Button variant="primary" size="sm">Click</Button>

// thaki-ui 호환 (deprecated, 동작함)
<Button variant="primary" size="xs">Click</Button>  // xs 사이즈 지원
<Button variant="primary" appearance="outline">Click</Button>  // → outline variant로 변환
```

### 4.4 Input

```tsx
// TDS 네이티브
<Input size="md" error="Invalid input" />

// thaki-ui 호환 (deprecated, 동작함)
<Input size="xs" />     // xs → sm으로 내부 매핑
<Input size="lg" />     // lg → md로 내부 매핑
<Input success />       // success 상태 지원 (녹색 border)
```

### 4.5 Pagination

```tsx
// TDS 네이티브
<Pagination 
  currentPage={page} 
  totalPages={10} 
  onPageChange={setPage} 
/>

// thaki-ui 호환 (deprecated, 동작함)
<Pagination 
  currentAt={page}           // → currentPage로 변환
  totalCount={100}           // totalPages 자동 계산
  size={10}                  // pageSize로 사용
  onPageChange={setPage} 
/>
```

### 4.6 StatusIndicator

```tsx
// TDS 네이티브
<StatusIndicator status="active" layout="default" />

// thaki-ui 호환 (deprecated, 동작함)
<StatusIndicator 
  status="active" 
  layout="leftIcon"         // → "default"로 변환
  customIcon={<MyIcon />}   // customIcon 지원
/>
<StatusIndicator 
  status="error" 
  layout="iconOnly"         // → "icon-only"로 변환
/>
```

### 4.7 Toggle

```tsx
// TDS 네이티브
<Toggle label="Enable feature" checked={enabled} onChange={handleChange} />

// thaki-ui 호환 (deprecated, 동작함)
<Toggle 
  checkedLabel="Enabled"      // checked 상태일 때 라벨
  uncheckedLabel="Disabled"   // unchecked 상태일 때 라벨
  checked={enabled} 
  onChange={handleChange} 
/>
```

### 4.8 TabBar

```tsx
// TDS 네이티브
const tabs = [
  { id: 'tab1', label: 'Tab 1', closable: true },
  { id: 'tab2', label: 'Tab 2', closable: false },
];

// thaki-ui 호환 (deprecated, 동작함)
const tabs = [
  { id: 'tab1', title: 'Tab 1' },        // title → label로 변환
  { id: 'tab2', title: 'Tab 2', fixed: true },  // fixed → closable: false로 변환
];
```

### 4.9 InlineMessage

```tsx
// TDS 네이티브
<InlineMessage variant="warning">
  This is a warning message
</InlineMessage>

// thaki-ui 호환 (deprecated, 동작함)
<InlineMessage 
  type="warning"              // → variant로 변환
  message="This is a warning message"  // → children으로 변환
/>
```

---

## 주의사항

### Deprecated Props 경고

개발 환경에서 deprecated props를 사용하면 콘솔에 경고가 표시됩니다:

```
[Input] filter prop is deprecated. Implement filtering in onChange handler.
[Button] appearance prop is deprecated. Use variant prop instead.
```

이러한 경고가 표시되면 TDS 네이티브 API로 마이그레이션하는 것을 권장합니다.

### 지원되지 않는 기능

일부 thaki-ui 기능은 TDS에서 지원되지 않습니다:

- `Input.filter` - onChange에서 직접 구현
- `Input.showPasswordToggle` - rightElement로 구현
- `Disclosure.disabled` - 상위에서 조건부 렌더링
- `Toast.appIcon` - TDS Toast는 타입별 기본 아이콘 사용
- `DatePicker.numberOfMonths` - 단일 월 뷰만 지원

---

## 버전 정보

- 이 가이드는 TDS v0.1.0 기준입니다.
- 호환 레이어는 thaki-ui에서 TDS로의 점진적 마이그레이션을 위해 제공됩니다.
- 프로덕션 코드에서는 TDS 네이티브 API 사용을 권장합니다.
