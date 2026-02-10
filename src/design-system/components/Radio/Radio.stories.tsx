import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';
import { useState } from 'react';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Radio 컴포넌트

여러 옵션 중 하나만 선택할 수 있는 라디오 버튼입니다.

### 구성
- **Radio**: 개별 라디오 버튼
- **RadioGroup**: 라디오 버튼 그룹 (name 자동 관리)

### 사용 시기
- 상호 배타적인 옵션 선택 (하나만 선택 가능)
- 플랜 선택, 크기 선택, 정렬 방식 등

### Radio vs Checkbox vs Select
| | Radio | Checkbox | Select |
|---|---|---|---|
| **선택 개수** | 1개 | 0~N개 | 1개 |
| **옵션 표시** | 항상 보임 | 항상 보임 | 드롭다운 |
| **추천 옵션 수** | 2~5개 | 제한 없음 | 5개 이상 |

### 접근성
- 같은 name으로 그룹화
- 화살표 키로 옵션 이동
- 스크린리더 그룹/선택 상태 전달

### 예시
\`\`\`tsx
import { Radio, RadioGroup } from '@thaki/tds';

// 기본 사용
<RadioGroup defaultValue="option1">
  <Radio value="option1" label="옵션 1" />
  <Radio value="option2" label="옵션 2" />
</RadioGroup>

// Controlled
<RadioGroup value={plan} onChange={setPlan}>
  <Radio value="basic" label="Basic" />
  <Radio value="pro" label="Pro" />
</RadioGroup>

// 설명 포함
<RadioGroup label="알림 방식" description="선호하는 알림 방식을 선택하세요">
  <Radio value="email" label="이메일" description="이메일로 알림을 받습니다" />
  <Radio value="push" label="푸시 알림" description="앱 푸시 알림을 받습니다" />
</RadioGroup>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: '그룹 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: '그룹 설명',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: '선택된 값 (controlled)',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      control: 'text',
      description: '초기 선택 값 (uncontrolled)',
      table: {
        type: { summary: 'string' },
      },
    },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: '레이아웃 방향',
      table: {
        type: { summary: '"vertical" | "horizontal"' },
        defaultValue: { summary: '"vertical"' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '전체 그룹 비활성화',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: '필수 필드 표시',
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
type Story = StoryObj<typeof RadioGroup>;

// Basic RadioGroup
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

// With Label and Description
export const WithLabelAndDescription: Story = {
  render: () => (
    <RadioGroup
      label="Notification preferences"
      description="Choose how you want to receive notifications"
      defaultValue="email"
    >
      <Radio value="email" label="Email" description="Receive notifications via email" />
      <Radio value="sms" label="SMS" description="Receive notifications via text message" />
      <Radio value="push" label="Push" description="Receive push notifications on your device" />
    </RadioGroup>
  ),
};

// Horizontal Layout
export const Horizontal: Story = {
  render: () => (
    <RadioGroup direction="horizontal" defaultValue="small">
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
  ),
};

// Controlled
export const Controlled: Story = {
  render: function ControlledRadio() {
    const [value, setValue] = useState('option2');

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <RadioGroup value={value} onChange={setValue}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          All disabled
        </p>
        <RadioGroup disabled defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Individual disabled
        </p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2 (disabled)" disabled />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
      </div>
    </div>
  ),
};

// Error State
export const WithError: Story = {
  render: () => (
    <RadioGroup
      label="Select a plan"
      error
      errorMessage="Please select a plan to continue"
      defaultValue=""
    >
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
  ),
};

// Real-world Example: Plan Selection
export const PlanSelection: Story = {
  render: function PlanSelectionExample() {
    const [plan, setPlan] = useState('pro');

    const plans = [
      {
        value: 'basic',
        label: 'Basic',
        description: 'For individuals and small projects',
        price: '$9/month',
      },
      {
        value: 'pro',
        label: 'Professional',
        description: 'For growing teams and businesses',
        price: '$29/month',
      },
      {
        value: 'enterprise',
        label: 'Enterprise',
        description: 'For large organizations with custom needs',
        price: 'Custom pricing',
      },
    ];

    return (
      <div className="w-[400px]">
        <RadioGroup label="Choose your plan" value={plan} onChange={setPlan}>
          {plans.map((p) => (
            <div
              key={p.value}
              className={`p-[var(--primitive-spacing-4)] border rounded-[var(--primitive-radius-lg)] cursor-pointer transition-colors ${
                plan === p.value
                  ? 'border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]'
                  : 'border-[var(--color-border-default)]'
              }`}
              onClick={() => setPlan(p.value)}
            >
              <div className="flex items-start justify-between">
                <Radio value={p.value}>
                  <span className="text-label-lg">{p.label}</span>
                </Radio>
                <span className="text-label-md text-[var(--color-action-primary)]">{p.price}</span>
              </div>
              <p className="ml-[var(--primitive-spacing-6)] mt-[var(--primitive-spacing-1)] text-body-md text-[var(--color-text-muted)]">
                {p.description}
              </p>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Default
        </p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          With descriptions
        </p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" description="Description for option 1" />
          <Radio value="option2" label="Option 2" description="Description for option 2" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Horizontal
        </p>
        <RadioGroup direction="horizontal" defaultValue="option1">
          <Radio value="option1" label="Left" />
          <Radio value="option2" label="Center" />
          <Radio value="option3" label="Right" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Disabled
        </p>
        <RadioGroup disabled defaultValue="option1">
          <Radio value="option1" label="Disabled checked" />
          <Radio value="option2" label="Disabled unchecked" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Error
        </p>
        <RadioGroup error errorMessage="This field is required" defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>
    </div>
  ),
};
