import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Badge 컴포넌트

상태, 카테고리, 수량 등을 표시하는 라벨 컴포넌트입니다.

### 사용 시기
- 상태 표시 (Active, Pending, Error)
- 카테고리/태그 표시
- 알림 개수 표시
- 버전 정보 표시

### 테마
| 테마 | 사용 예시 |
|------|----------|
| **blue** | 정보, 기본 상태 |
| **green** | 성공, 활성, 완료 |
| **yellow** | 경고, 대기중 |
| **red** | 오류, 위험, 삭제 |
| **gray** | 비활성, 초안 |

### 타입
- **solid**: 채워진 배경 (강조)
- **subtle**: 연한 배경 (덜 강조)

### 예시
\`\`\`tsx
import { Badge } from '@thaki/tds';

// 기본 사용
<Badge theme="green">Active</Badge>

// 점 표시
<Badge theme="green" dot>Online</Badge>

// 아이콘 포함
<Badge theme="green" leftIcon={<IconCheck />}>
  Approved
</Badge>

// Subtle 스타일
<Badge theme="red" type="subtle">Error</Badge>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: '배지 내용',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    theme: {
      control: 'select',
      options: ['blue', 'red', 'green', 'yellow', 'gray'],
      description: '배지 색상 테마',
      table: {
        type: { summary: '"blue" | "red" | "green" | "yellow" | "gray"' },
        defaultValue: { summary: '"blue"' },
      },
    },
    type: {
      control: 'select',
      options: ['solid', 'subtle'],
      description: '배지 스타일 타입',
      table: {
        type: { summary: '"solid" | "subtle"' },
        defaultValue: { summary: '"solid"' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '배지 크기',
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
    dot: {
      control: 'boolean',
      description: '텍스트 앞에 점 표시 (상태 강조)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    leftIcon: {
      description: '텍스트 왼쪽 아이콘',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    rightIcon: {
      description: '텍스트 오른쪽 아이콘',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
  args: {
    children: 'Badge',
    theme: 'blue',
    type: 'solid',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Basic
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

// All Themes (Solid)
export const ThemesSolid: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
      <Badge theme="blue">Blue</Badge>
      <Badge theme="red">Red</Badge>
      <Badge theme="green">Green</Badge>
      <Badge theme="yellow">Yellow</Badge>
      <Badge theme="gray">Gray</Badge>
    </div>
  ),
};

// All Themes (Subtle)
export const ThemesSubtle: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
      <Badge theme="blue" type="subtle">
        Blue
      </Badge>
      <Badge theme="red" type="subtle">
        Red
      </Badge>
      <Badge theme="green" type="subtle">
        Green
      </Badge>
      <Badge theme="yellow" type="subtle">
        Yellow
      </Badge>
      <Badge theme="gray" type="subtle">
        Gray
      </Badge>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--primitive-spacing-2)]">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

// With Dot
export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
      <Badge theme="blue" dot>
        Active
      </Badge>
      <Badge theme="green" dot>
        Online
      </Badge>
      <Badge theme="red" dot>
        Error
      </Badge>
      <Badge theme="yellow" dot>
        Warning
      </Badge>
      <Badge theme="gray" dot>
        Offline
      </Badge>
    </div>
  ),
};

// With Dot (Subtle)
export const WithDotSubtle: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
      <Badge theme="blue" type="subtle" dot>
        Active
      </Badge>
      <Badge theme="green" type="subtle" dot>
        Online
      </Badge>
      <Badge theme="red" type="subtle" dot>
        Error
      </Badge>
      <Badge theme="yellow" type="subtle" dot>
        Warning
      </Badge>
      <Badge theme="gray" type="subtle" dot>
        Offline
      </Badge>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
      <Badge theme="green" leftIcon={<IconCheck size={12} />}>
        Approved
      </Badge>
      <Badge theme="red" leftIcon={<IconX size={12} />}>
        Rejected
      </Badge>
      <Badge theme="yellow" leftIcon={<IconAlertTriangle size={12} />}>
        Warning
      </Badge>
      <Badge theme="blue" leftIcon={<IconInfoCircle size={12} />}>
        Info
      </Badge>
    </div>
  ),
};

// Status Badges
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
      <Badge theme="green" type="subtle" dot>
        Active
      </Badge>
      <Badge theme="yellow" type="subtle" dot>
        Pending
      </Badge>
      <Badge theme="red" type="subtle" dot>
        Inactive
      </Badge>
      <Badge theme="gray" type="subtle" dot>
        Draft
      </Badge>
    </div>
  ),
};

// Use Cases
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
      {/* Table Status */}
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Table Status
        </p>
        <div className="flex gap-[var(--primitive-spacing-2)]">
          <Badge theme="green" type="subtle">
            Running
          </Badge>
          <Badge theme="yellow" type="subtle">
            Building
          </Badge>
          <Badge theme="red" type="subtle">
            Failed
          </Badge>
          <Badge theme="gray" type="subtle">
            Stopped
          </Badge>
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Tags
        </p>
        <div className="flex gap-[var(--primitive-spacing-2)]">
          <Badge theme="blue" type="subtle" size="sm">
            React
          </Badge>
          <Badge theme="green" type="subtle" size="sm">
            TypeScript
          </Badge>
          <Badge theme="yellow" type="subtle" size="sm">
            Tailwind
          </Badge>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Notifications
        </p>
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <span className="text-body-md text-[var(--color-text-default)]">Messages</span>
          <Badge theme="red" size="sm">
            5
          </Badge>
        </div>
      </div>

      {/* Versioning */}
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Versions
        </p>
        <div className="flex gap-[var(--primitive-spacing-2)]">
          <Badge theme="blue">v2.0.0</Badge>
          <Badge theme="green" type="subtle">
            Stable
          </Badge>
          <Badge theme="yellow" type="subtle">
            Beta
          </Badge>
        </div>
      </div>
    </div>
  ),
};

// Legacy Variants
export const LegacyVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};
