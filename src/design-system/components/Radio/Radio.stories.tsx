import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';
import { useState } from 'react';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: '레이아웃 방향',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
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
      <div className="flex flex-col gap-4">
        <RadioGroup value={value} onChange={setValue}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium mb-2">All disabled</p>
        <RadioGroup disabled defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Individual disabled</p>
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
        <RadioGroup
          label="Choose your plan"
          value={plan}
          onChange={setPlan}
        >
          {plans.map((p) => (
            <div
              key={p.value}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                plan === p.value
                  ? 'border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]'
                  : 'border-[var(--color-border-default)]'
              }`}
              onClick={() => setPlan(p.value)}
            >
              <div className="flex items-start justify-between">
                <Radio value={p.value}>
                  <span className="font-medium">{p.label}</span>
                </Radio>
                <span className="text-sm font-medium text-[var(--color-action-primary)]">
                  {p.price}
                </span>
              </div>
              <p className="ml-6 mt-1 text-sm text-[var(--color-text-muted)]">
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
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium mb-2">Default</p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">With descriptions</p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" description="Description for option 1" />
          <Radio value="option2" label="Option 2" description="Description for option 2" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Horizontal</p>
        <RadioGroup direction="horizontal" defaultValue="option1">
          <Radio value="option1" label="Left" />
          <Radio value="option2" label="Center" />
          <Radio value="option3" label="Right" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Disabled</p>
        <RadioGroup disabled defaultValue="option1">
          <Radio value="option1" label="Disabled checked" />
          <Radio value="option2" label="Disabled unchecked" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Error</p>
        <RadioGroup error errorMessage="This field is required" defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>
    </div>
  ),
};
