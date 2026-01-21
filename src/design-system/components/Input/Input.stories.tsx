import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { IconSearch, IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '입력 필드 크기',
    },
    variant: {
      control: 'select',
      options: ['default', 'search', 'code'],
      description: '입력 필드 변형',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용 상태',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비',
    },
    required: {
      control: 'boolean',
      description: '필수 필드 표시',
    },
  },
  args: {
    placeholder: 'Enter text...',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Basic
export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
  },
};

// With Label
export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
  },
};

// Required Field
export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    required: true,
  },
};

// With Helper Text
export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helperText: 'Must be at least 8 characters long',
  },
};

// Error State
export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input (default)" />
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="search" placeholder="Search variant" leftElement={<IconSearch size={16} />} />
      <Input variant="code" placeholder="Code variant" />
    </div>
  ),
};

// With Icons
export const WithLeftIcon: Story = {
  args: {
    leftElement: <IconMail size={16} />,
    placeholder: 'Enter email',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightElement: <IconSearch size={16} />,
    placeholder: 'Search...',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftElement: <IconLock size={16} />,
    rightElement: <IconEye size={16} />,
    type: 'password',
    placeholder: 'Enter password',
  },
};

// Password Toggle Example
export const PasswordToggle: Story = {
  render: function PasswordToggleComponent() {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        leftElement={<IconLock size={16} />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="hover:text-[var(--color-text-default)]"
          >
            {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
        }
      />
    );
  },
};

// States
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type here',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Read Only',
    defaultValue: 'This value is read-only',
    readOnly: true,
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    placeholder: 'This input takes full width',
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

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <Input
        label="Full Name"
        placeholder="John Doe"
        required
        fullWidth
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        leftElement={<IconMail size={16} />}
        required
        fullWidth
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        leftElement={<IconLock size={16} />}
        helperText="Must be at least 8 characters"
        required
        fullWidth
      />
    </div>
  ),
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <Input label="Default" placeholder="Default state" fullWidth />
      <Input label="With Value" defaultValue="Some value" fullWidth />
      <Input label="Disabled" placeholder="Disabled" disabled fullWidth />
      <Input label="Read Only" defaultValue="Read only value" readOnly fullWidth />
      <Input label="Error" defaultValue="Invalid" error="This field has an error" fullWidth />
    </div>
  ),
};
