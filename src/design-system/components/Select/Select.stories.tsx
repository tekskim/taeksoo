import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
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
import { Select } from '@thaki/tds';

const options = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: 'United States' },
];

// 기본 사용
<Select 
  label="국가"
  options={options}
  placeholder="선택하세요"
/>

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
      options: ['sm', 'md', 'lg'],
      description: '셀렉트 고정 너비',
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
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

// With Label
export const WithLabel: Story = {
  args: {
    label: 'Category',
    options: defaultOptions,
    placeholder: 'Select category',
  },
};

// Required Field
export const Required: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select country',
    required: true,
  },
};

// With Helper Text
export const WithHelperText: Story = {
  args: {
    label: 'Status',
    options: statusOptions,
    placeholder: 'Select status',
    helperText: 'Choose the current status of the item',
  },
};

// Error State
export const WithError: Story = {
  args: {
    label: 'Category',
    options: defaultOptions,
    placeholder: 'Select category',
    error: 'Please select a category',
  },
};

// With Default Value
export const WithDefaultValue: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    defaultValue: 'kr',
  },
};

// Controlled
export const Controlled: Story = {
  render: function ControlledSelect() {
    const [value, setValue] = useState('option2');

    return (
      <div className="flex flex-col gap-4">
        <Select
          label="Controlled Select"
          options={defaultOptions}
          value={value}
          onChange={setValue}
        />
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected value: <strong>{value || 'None'}</strong>
        </p>
      </div>
    );
  },
};

// Clearable
export const Clearable: Story = {
  args: {
    label: 'Clearable Select',
    options: defaultOptions,
    defaultValue: 'option1',
    clearable: true,
    clearLabel: 'Clear selection',
  },
};

// With Disabled Options
export const WithDisabledOptions: Story = {
  args: {
    label: 'Status',
    options: statusOptions,
    placeholder: 'Select status',
    helperText: '"Archived" option is disabled',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Select size="sm" options={defaultOptions} placeholder="Small (sm)" />
      <Select size="md" options={defaultOptions} placeholder="Medium (md)" />
    </div>
  ),
};

// Width Variants
export const Widths: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Select width="sm" options={defaultOptions} placeholder="Small width (160px)" />
      <Select width="md" options={defaultOptions} placeholder="Medium width (240px)" />
      <Select width="lg" options={defaultOptions} placeholder="Large width (320px)" />
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  args: {
    label: 'Full Width Select',
    options: defaultOptions,
    placeholder: 'This select takes full width',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Disabled
export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: defaultOptions,
    placeholder: 'Cannot select',
    disabled: true,
  },
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <Select
        label="Country"
        options={countryOptions}
        placeholder="Select country"
        required
        fullWidth
      />
      <Select
        label="Status"
        options={statusOptions}
        placeholder="Select status"
        helperText="Choose the current status"
        fullWidth
      />
      <Select
        label="Category"
        options={defaultOptions}
        placeholder="Select category"
        clearable
        fullWidth
      />
    </div>
  ),
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <Select label="Default" options={defaultOptions} placeholder="Default state" fullWidth />
      <Select label="With Value" options={defaultOptions} defaultValue="option1" fullWidth />
      <Select label="Disabled" options={defaultOptions} placeholder="Disabled" disabled fullWidth />
      <Select
        label="Error"
        options={defaultOptions}
        placeholder="Select option"
        error="This field has an error"
        fullWidth
      />
      <Select
        label="Clearable with Value"
        options={defaultOptions}
        defaultValue="option2"
        clearable
        fullWidth
      />
    </div>
  ),
};
