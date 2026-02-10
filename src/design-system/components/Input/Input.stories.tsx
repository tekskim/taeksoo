import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { FormField } from '../FormField';
import { IconSearch, IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Input 컴포넌트

텍스트 입력을 위한 기본 폼 컴포넌트입니다.

### 사용 시기
- 단일 줄 텍스트 입력 (이름, 이메일, 비밀번호 등)
- 검색 필드
- 폼 내 데이터 입력

### 너비 정책
- **기본**: 고정 너비 (컴포넌트 기본값)
- **fullWidth**: 부모 컨테이너에 맞춤

### 접근성
- \`label\` prop으로 라벨 자동 연결 (aria-labelledby)
- 에러 메시지 스크린리더 전달 (aria-invalid, aria-describedby)
- \`required\` 표시 자동 처리

### 예시
\`\`\`tsx
import { Input, FormField } from '@thaki/tds';

// 기본 사용 (FormField와 함께)
<FormField label="이름">
  <Input placeholder="홍길동" fullWidth />
</FormField>

// 에러 상태
<FormField label="이메일" errorMessage="유효하지 않은 이메일입니다" error>
  <Input fullWidth />
</FormField>

// 아이콘 포함
<Input 
  leftElement={<IconMail />} 
  placeholder="이메일 입력" 
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '입력 필드 크기 (xs: 24px, sm: 32px, md: 40px, lg: 48px)',
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'search', 'code'],
      description: '입력 필드 스타일 변형',
      table: {
        type: { summary: '"default" | "search" | "code"' },
        defaultValue: { summary: '"default"' },
      },
    },
    label: {
      control: 'text',
      description: '입력 필드 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: '도움말 텍스트 (라벨 아래 표시)',
      table: {
        type: { summary: 'string' },
      },
    },
    error: {
      control: 'text',
      description: '에러 메시지 (표시 시 빨간색 테두리)',
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
    readOnly: {
      control: 'boolean',
      description: '읽기 전용 상태',
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
    leftElement: {
      description: '입력 필드 왼쪽에 표시할 요소 (아이콘 등)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    rightElement: {
      description: '입력 필드 오른쪽에 표시할 요소 (아이콘, 버튼 등)',
      table: {
        type: { summary: 'ReactNode' },
      },
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

// With Label (FormField 사용)
export const WithLabel: Story = {
  render: () => (
    <FormField label="Username">
      <Input placeholder="Enter username" fullWidth />
    </FormField>
  ),
};

// Required Field (FormField 사용)
export const Required: Story = {
  render: () => (
    <FormField label="Email" required>
      <Input placeholder="Enter email" fullWidth />
    </FormField>
  ),
};

// With Helper Text (FormField 사용)
export const WithHelperText: Story = {
  render: () => (
    <FormField label="Password" helperText="Must be at least 8 characters long">
      <Input type="password" placeholder="Enter password" fullWidth />
    </FormField>
  ),
};

// Error State (FormField 사용)
export const WithError: Story = {
  render: () => (
    <FormField label="Email" errorMessage="Please enter a valid email address" error>
      <Input placeholder="Enter email" defaultValue="invalid-email" fullWidth />
    </FormField>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input (default)" />
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="search" placeholder="Search variant" leftElement={<IconSearch size={12} />} />
      <Input variant="code" placeholder="Code variant" />
    </div>
  ),
};

// With Icons
export const WithLeftIcon: Story = {
  args: {
    leftElement: <IconMail size={12} />,
    placeholder: 'Enter email',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightElement: <IconSearch size={12} />,
    placeholder: 'Search...',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftElement: <IconLock size={12} />,
    rightElement: <IconEye size={12} />,
    type: 'password',
    placeholder: 'Enter password',
  },
};

// Password Toggle Example (FormField 사용)
export const PasswordToggle: Story = {
  render: function PasswordToggleComponent() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <FormField label="Password">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter password"
          leftElement={<IconLock size={12} />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-[var(--color-text-default)]"
            >
              {showPassword ? <IconEyeOff size={12} /> : <IconEye size={12} />}
            </button>
          }
          fullWidth
        />
      </FormField>
    );
  },
};

// States (FormField 사용)
export const Disabled: Story = {
  render: () => (
    <FormField label="Disabled Input">
      <Input placeholder="Cannot type here" disabled fullWidth />
    </FormField>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <FormField label="Read Only">
      <Input defaultValue="This value is read-only" readOnly fullWidth />
    </FormField>
  ),
};

// Full Width (FormField 사용)
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <FormField label="Full Width Input">
        <Input placeholder="This input takes full width" fullWidth />
      </FormField>
    </div>
  ),
};

// Form Example (FormField 사용)
export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]">
      <FormField label="Full Name" required>
        <Input placeholder="John Doe" fullWidth />
      </FormField>
      <FormField label="Email" required>
        <Input
          type="email"
          placeholder="john@example.com"
          leftElement={<IconMail size={12} />}
          fullWidth
        />
      </FormField>
      <FormField label="Password" helperText="Must be at least 8 characters" required>
        <Input
          type="password"
          placeholder="Enter password"
          leftElement={<IconLock size={12} />}
          fullWidth
        />
      </FormField>
    </div>
  ),
};

// All States (FormField 사용)
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]">
      <FormField label="Default">
        <Input placeholder="Default state" fullWidth />
      </FormField>
      <FormField label="With Value">
        <Input defaultValue="Some value" fullWidth />
      </FormField>
      <FormField label="Disabled">
        <Input placeholder="Disabled" disabled fullWidth />
      </FormField>
      <FormField label="Read Only">
        <Input defaultValue="Read only value" readOnly fullWidth />
      </FormField>
      <FormField label="Error" errorMessage="This field has an error" error>
        <Input defaultValue="Invalid" fullWidth />
      </FormField>
    </div>
  ),
};
