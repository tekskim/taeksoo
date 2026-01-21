import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['blue', 'red', 'green', 'yellow', 'gray'],
      description: '배지 색상 테마',
    },
    type: {
      control: 'select',
      options: ['solid', 'subtle'],
      description: '배지 스타일 타입',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '배지 크기',
    },
    dot: {
      control: 'boolean',
      description: '점 표시',
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
    <div className="flex flex-wrap gap-2">
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
    <div className="flex flex-wrap gap-2">
      <Badge theme="blue" type="subtle">Blue</Badge>
      <Badge theme="red" type="subtle">Red</Badge>
      <Badge theme="green" type="subtle">Green</Badge>
      <Badge theme="yellow" type="subtle">Yellow</Badge>
      <Badge theme="gray" type="subtle">Gray</Badge>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

// With Dot
export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge theme="blue" dot>Active</Badge>
      <Badge theme="green" dot>Online</Badge>
      <Badge theme="red" dot>Error</Badge>
      <Badge theme="yellow" dot>Warning</Badge>
      <Badge theme="gray" dot>Offline</Badge>
    </div>
  ),
};

// With Dot (Subtle)
export const WithDotSubtle: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge theme="blue" type="subtle" dot>Active</Badge>
      <Badge theme="green" type="subtle" dot>Online</Badge>
      <Badge theme="red" type="subtle" dot>Error</Badge>
      <Badge theme="yellow" type="subtle" dot>Warning</Badge>
      <Badge theme="gray" type="subtle" dot>Offline</Badge>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
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
    <div className="flex flex-wrap gap-2">
      <Badge theme="green" type="subtle" dot>Active</Badge>
      <Badge theme="yellow" type="subtle" dot>Pending</Badge>
      <Badge theme="red" type="subtle" dot>Inactive</Badge>
      <Badge theme="gray" type="subtle" dot>Draft</Badge>
    </div>
  ),
};

// Use Cases
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Table Status */}
      <div>
        <p className="text-sm font-medium mb-2">Table Status</p>
        <div className="flex gap-2">
          <Badge theme="green" type="subtle">Running</Badge>
          <Badge theme="yellow" type="subtle">Building</Badge>
          <Badge theme="red" type="subtle">Failed</Badge>
          <Badge theme="gray" type="subtle">Stopped</Badge>
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-sm font-medium mb-2">Tags</p>
        <div className="flex gap-2">
          <Badge theme="blue" type="subtle" size="sm">React</Badge>
          <Badge theme="green" type="subtle" size="sm">TypeScript</Badge>
          <Badge theme="yellow" type="subtle" size="sm">Tailwind</Badge>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <p className="text-sm font-medium mb-2">Notifications</p>
        <div className="flex items-center gap-2">
          <span className="text-sm">Messages</span>
          <Badge theme="red" size="sm">5</Badge>
        </div>
      </div>

      {/* Versioning */}
      <div>
        <p className="text-sm font-medium mb-2">Versions</p>
        <div className="flex gap-2">
          <Badge theme="blue">v2.0.0</Badge>
          <Badge theme="green" type="subtle">Stable</Badge>
          <Badge theme="yellow" type="subtle">Beta</Badge>
        </div>
      </div>
    </div>
  ),
};

// Legacy Variants
export const LegacyVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};
