import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { useState } from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Checkbox 컴포넌트

여러 옵션 중 하나 이상을 선택할 수 있는 체크박스입니다.

### 사용 시기
- 여러 항목 중 다중 선택
- 약관 동의, 옵션 선택
- "모두 선택" 패턴 구현

### 상태
- **unchecked**: 선택되지 않음
- **checked**: 선택됨
- **indeterminate**: 부분 선택 (모두 선택 패턴에서 일부만 선택된 경우)

### 접근성
- 네이티브 \`<input type="checkbox">\` 사용
- 라벨 클릭으로 토글 가능
- 키보드(Space)로 토글 가능
- 스크린리더 상태 전달

### 예시
\`\`\`tsx
import { Checkbox } from '@thaki/tds';

// 기본 사용
<Checkbox label="동의합니다" />

// Controlled
<Checkbox 
  checked={agreed} 
  onChange={(e) => setAgreed(e.target.checked)} 
  label="약관에 동의합니다"
/>

// 부분 선택 (Select All)
<Checkbox 
  indeterminate={someSelected} 
  checked={allSelected}
  label="모두 선택"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: '체크박스 라벨',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    description: {
      control: 'text',
      description: '라벨 아래 설명 텍스트',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    checked: {
      control: 'boolean',
      description: '체크 상태 (controlled)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: '초기 체크 상태 (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description: '부분 선택 상태 (일부만 선택됨)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Basic
export const Default: Story = {
  args: {
    label: 'Checkbox label',
  },
};

// Checked
export const Checked: Story = {
  args: {
    label: 'Checked checkbox',
    defaultChecked: true,
  },
};

// With Description
export const WithDescription: Story = {
  args: {
    label: 'Subscribe to newsletter',
    description: 'Receive weekly updates about new features and promotions.',
  },
};

// Indeterminate
export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
};

// Disabled States
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

// Error State
export const WithError: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    error: true,
    errorMessage: 'You must agree to continue',
  },
};

// Controlled
export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Checkbox
          label="Controlled checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-[var(--color-text-muted)]">
          Checked: <strong>{checked ? 'Yes' : 'No'}</strong>
        </p>
      </div>
    );
  },
};

// Select All Pattern
export const SelectAllPattern: Story = {
  render: function SelectAllExample() {
    const [items, setItems] = useState([
      { id: '1', label: 'Item 1', checked: true },
      { id: '2', label: 'Item 2', checked: false },
      { id: '3', label: 'Item 3', checked: true },
    ]);

    const allChecked = items.every((item) => item.checked);
    const someChecked = items.some((item) => item.checked) && !allChecked;

    const handleSelectAll = () => {
      setItems(items.map((item) => ({ ...item, checked: !allChecked })));
    };

    const handleItemChange = (id: string) => {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    };

    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={handleSelectAll}
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={item.checked}
              onChange={() => handleItemChange(item.id)}
            />
          ))}
        </div>
      </div>
    );
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
      <Checkbox label="Error" error errorMessage="This field is required" />
      <Checkbox
        label="With description"
        description="This is a helpful description text."
      />
    </div>
  ),
};

// Checkbox Group
export const GroupExample: Story = {
  render: function CheckboxGroupExample() {
    const [selected, setSelected] = useState<string[]>(['react']);

    const options = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
    ];

    const handleChange = (value: string) => {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    };

    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">Select frameworks:</p>
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={() => handleChange(option.value)}
            />
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected: <strong>{selected.join(', ') || 'None'}</strong>
        </p>
      </div>
    );
  },
};
