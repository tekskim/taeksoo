import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
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
import { Input } from '@thaki/tds';

// 기본 사용
<Input label="이름" placeholder="홍길동" />

// 에러 상태
<Input label="이메일" error="유효하지 않은 이메일입니다" />

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
      options: ['sm', 'md'],
      description: '입력 필드 크기 (sm: 28px, md: 32px)',
      table: {
        type: { summary: '"sm" | "md"' },
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
