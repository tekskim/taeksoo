import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from './NumberInput';
import { useState } from 'react';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## NumberInput 컴포넌트

숫자 입력을 위한 폼 컴포넌트입니다. 증감 버튼(stepper)과 키보드 ArrowUp/Down 지원을 포함합니다.

### 사용 시기
- 숫자 값 입력 (수량, 포트 번호, CPU/메모리 설정 등)
- min/max 범위 제한이 필요한 경우
- step 단위 증감이 필요한 경우

### 너비 정책
- **xs**: 80px, **sm**: 160px, **md**: 240px, **lg**: 320px
- **half**: 50%, **full**: 100%
- 숫자를 전달하면 커스텀 픽셀 너비

### 접근성
- ArrowUp/Down 키보드 지원
- aria-invalid, aria-describedby 자동 연결
- stepper 버튼에 aria-label 설정

### 예시
\`\`\`tsx
import { NumberInput } from '@thaki/tds';

// 기본 사용
<NumberInput value={10} onChange={setValue} min={0} max={100} />

// FormField와 함께
<FormField label="CPU Cores" helperText="1-16 cores">
  <NumberInput value={4} onChange={setValue} min={1} max={16} width="sm" />
</FormField>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    width: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'half', 'full'],
      description: '너비 변형',
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg" | "half" | "full" | number' },
      },
    },
    min: {
      control: 'number',
      description: '최소값',
      table: { type: { summary: 'number' } },
    },
    max: {
      control: 'number',
      description: '최대값',
      table: { type: { summary: 'number' } },
    },
    step: {
      control: 'number',
      description: '증감 단위',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: { defaultValue: { summary: 'false' } },
    },
    hideSteppers: {
      control: 'boolean',
      description: '증감 버튼 숨김',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'text',
      description: '에러 메시지 또는 에러 상태 (boolean)',
      table: { type: { summary: 'string | boolean' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

// Basic
export const Default: Story = {
  args: {
    defaultValue: 10,
    width: 'sm',
  },
};

// Controlled
export const Controlled: Story = {
  render: function ControlledExample() {
    const [value, setValue] = useState(5);

    return (
      <div className="flex flex-col gap-2">
        <NumberInput value={value} onChange={setValue} width="sm" />
        <p className="text-body-sm text-[var(--color-text-subtle)]">현재 값: {value}</p>
      </div>
    );
  },
};

// With Min/Max
export const WithMinMax: Story = {
  render: function MinMaxExample() {
    const [value, setValue] = useState(5);

    return (
      <div className="flex flex-col gap-2">
        <NumberInput value={value} onChange={setValue} min={0} max={10} width="sm" />
        <p className="text-body-sm text-[var(--color-text-subtle)]">범위: 0 ~ 10, 현재: {value}</p>
      </div>
    );
  },
};

// With Step
export const WithStep: Story = {
  render: function StepExample() {
    const [value, setValue] = useState(0);

    return (
      <div className="flex flex-col gap-2">
        <NumberInput value={value} onChange={setValue} step={5} min={0} max={100} width="sm" />
        <p className="text-body-sm text-[var(--color-text-subtle)]">Step: 5, 현재: {value}</p>
      </div>
    );
  },
};

// Width Variants
export const WidthVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">xs (80px)</p>
        <NumberInput defaultValue={1} width="xs" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">sm (160px)</p>
        <NumberInput defaultValue={10} width="sm" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">md (240px)</p>
        <NumberInput defaultValue={100} width="md" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">lg (320px)</p>
        <NumberInput defaultValue={1000} width="lg" />
      </div>
    </div>
  ),
};

// Hide Steppers
export const HideSteppers: Story = {
  args: {
    defaultValue: 42,
    width: 'sm',
    hideSteppers: true,
  },
};

// Error State
export const WithError: Story = {
  args: {
    defaultValue: -1,
    width: 'sm',
    error: 'Value must be greater than 0',
  },
};

// With Label (deprecated — use FormField)
export const WithLabel: Story = {
  args: {
    label: 'Port Number',
    defaultValue: 8080,
    width: 'sm',
    helperText: '1024-65535 범위의 포트 번호',
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    defaultValue: 10,
    width: 'sm',
    disabled: true,
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">Default</p>
        <NumberInput defaultValue={10} width="sm" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">Disabled</p>
        <NumberInput defaultValue={10} width="sm" disabled />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">Error</p>
        <NumberInput defaultValue={-1} width="sm" error="Invalid value" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">Hide Steppers</p>
        <NumberInput defaultValue={42} width="sm" hideSteppers />
      </div>
    </div>
  ),
};
