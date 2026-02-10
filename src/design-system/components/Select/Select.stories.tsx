import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import { FormField } from '../FormField';
import { useState } from 'react';

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
];

const countryOptions = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: 'United States' },
  { value: 'jp', label: '日本' },
  { value: 'cn', label: '中国' },
  { value: 'uk', label: 'United Kingdom' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Select 컴포넌트

드롭다운에서 옵션을 선택하는 폼 컴포넌트입니다.

### 너비 정책
- **고정 너비**: sm (160px), md (240px), lg (320px)
- **fullWidth**: 부모 컨테이너에 맞춤

### 사용 시기
- 미리 정의된 옵션 중 하나 선택
- 국가, 카테고리, 상태 등 선택

### 접근성
- 키보드 네비게이션 지원 (↑↓ 화살표, Enter, ESC)
- aria-expanded, aria-haspopup 자동 적용
- 스크린리더 옵션 읽기 지원

### 예시
\`\`\`tsx
import { Select, FormField } from '@thaki/tds';

const options = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: 'United States' },
];

// FormField와 함께 사용
<FormField label="국가">
  <Select options={options} placeholder="선택하세요" fullWidth />
</FormField>

// Controlled
<Select 
  value={country}
  onChange={setCountry}
  options={options}
/>

// 선택 해제 가능
<Select 
  options={options}
  clearable
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '셀렉트 높이 (sm: 28px, md: 32px)',
      table: {
        type: { summary: '"sm" | "md"' },
        defaultValue: { summary: '"md"' },
      },
    },
    width: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'half', 'full'],
      description:
        '셀렉트 고정 너비 (xs: 80px, sm: 160px, md: 240px, lg: 320px, half: 50%, full: 100%)',
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg" | "half" | "full"' },
        defaultValue: { summary: '"md"' },
        category: '크기',
      },
    },
    label: {
      control: 'text',
      description: '셀렉트 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: '도움말 텍스트',
      table: {
        type: { summary: 'string' },
      },
    },
    error: {
      control: 'text',
      description: '에러 메시지',
      table: {
        type: { summary: 'string' },
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
    fullWidth: {
      control: 'boolean',
      description: '부모 컨테이너 너비에 맞춤',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: '필수 필드 표시 (*)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    clearable: {
      control: 'boolean',
      description: '선택 해제 버튼 표시 (X 아이콘)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    options: {
      description: '선택 가능한 옵션 배열',
      table: {
        type: { summary: 'Array<{ value: string; label: string; disabled?: boolean }>' },
      },
    },
  },
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Basic
export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
  },
};

// With Label (FormField 사용)
export const WithLabel: Story = {
  render: () => (
    <FormField label="Category">
      <Select options={defaultOptions} placeholder="Select category" fullWidth />
    </FormField>
  ),
};

// Required Field (FormField 사용)
export const Required: Story = {
  render: () => (
    <FormField label="Country" required>
      <Select options={countryOptions} placeholder="Select country" fullWidth />
    </FormField>
  ),
};

// With Helper Text (FormField 사용)
export const WithHelperText: Story = {
  render: () => (
    <FormField label="Status" helperText="Choose the current status of the item">
      <Select options={statusOptions} placeholder="Select status" fullWidth />
    </FormField>
  ),
};

// Error State (FormField 사용)
export const WithError: Story = {
  render: () => (
    <FormField label="Category" errorMessage="Please select a category" error>
      <Select options={defaultOptions} placeholder="Select category" fullWidth />
    </FormField>
  ),
};

// With Default Value (FormField 사용)
export const WithDefaultValue: Story = {
  render: () => (
    <FormField label="Country">
      <Select options={countryOptions} defaultValue="kr" fullWidth />
    </FormField>
  ),
};

// Controlled (FormField 사용)
export const Controlled: Story = {
  render: function ControlledSelect() {
    const [value, setValue] = useState('option2');

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <FormField label="Controlled Select">
          <Select options={defaultOptions} value={value} onChange={setValue} fullWidth />
        </FormField>
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected value: <strong>{value || 'None'}</strong>
        </p>
      </div>
    );
  },
};

// Clearable (FormField 사용)
export const Clearable: Story = {
  render: () => (
    <FormField label="Clearable Select">
      <Select
        options={defaultOptions}
        defaultValue="option1"
        clearable
        clearLabel="Clear selection"
        fullWidth
      />
    </FormField>
  ),
};

// With Disabled Options (FormField 사용)
export const WithDisabledOptions: Story = {
  render: () => (
    <FormField label="Status" helperText={'"Archived" option is disabled'}>
      <Select options={statusOptions} placeholder="Select status" fullWidth />
    </FormField>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Select size="sm" options={defaultOptions} placeholder="Small (sm)" />
      <Select size="md" options={defaultOptions} placeholder="Medium (md)" />
    </div>
  ),
};

// Width Variants
export const Widths: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Select width="xs" options={defaultOptions} placeholder="XS (80px)" />
      <Select width="sm" options={defaultOptions} placeholder="Small (160px)" />
      <Select width="md" options={defaultOptions} placeholder="Medium (240px)" />
      <Select width="lg" options={defaultOptions} placeholder="Large (320px)" />
      <Select width="half" options={defaultOptions} placeholder="Half (50%)" />
      <Select width="full" options={defaultOptions} placeholder="Full (100%)" />
    </div>
  ),
};

// Full Width (FormField 사용)
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <FormField label="Full Width Select">
        <Select options={defaultOptions} placeholder="This select takes full width" fullWidth />
      </FormField>
    </div>
  ),
};

// Disabled (FormField 사용)
export const Disabled: Story = {
  render: () => (
    <FormField label="Disabled Select">
      <Select options={defaultOptions} placeholder="Cannot select" disabled fullWidth />
    </FormField>
  ),
};

// Form Example (FormField 사용)
export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]">
      <FormField label="Country" required>
        <Select options={countryOptions} placeholder="Select country" fullWidth />
      </FormField>
      <FormField label="Status" helperText="Choose the current status">
        <Select options={statusOptions} placeholder="Select status" fullWidth />
      </FormField>
      <FormField label="Category">
        <Select options={defaultOptions} placeholder="Select category" clearable fullWidth />
      </FormField>
    </div>
  ),
};

// All States (FormField 사용)
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]">
      <FormField label="Default">
        <Select options={defaultOptions} placeholder="Default state" fullWidth />
      </FormField>
      <FormField label="With Value">
        <Select options={defaultOptions} defaultValue="option1" fullWidth />
      </FormField>
      <FormField label="Disabled">
        <Select options={defaultOptions} placeholder="Disabled" disabled fullWidth />
      </FormField>
      <FormField label="Error" errorMessage="This field has an error" error>
        <Select options={defaultOptions} placeholder="Select option" fullWidth />
      </FormField>
      <FormField label="Clearable with Value">
        <Select options={defaultOptions} defaultValue="option2" clearable fullWidth />
      </FormField>
    </div>
  ),
};
