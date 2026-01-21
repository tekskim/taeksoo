import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { IconPlus, IconDownload, IconTrash, IconEdit, IconCheck } from '@tabler/icons-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'muted', 'danger', 'warning', 'link'],
      description: '버튼 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: 'Muted Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// With Icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <IconPlus size={16} />,
    children: 'Add Item',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <IconDownload size={16} />,
    children: 'Download',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <IconCheck size={16} />,
    rightIcon: <IconDownload size={16} />,
    children: 'Confirm & Download',
  },
};

// Icon Only
export const IconOnly: Story = {
  args: {
    icon: <IconPlus size={16} />,
    'aria-label': 'Add item',
    variant: 'secondary',
  },
};

export const IconOnlyVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button icon={<IconPlus size={16} />} aria-label="Add" variant="primary" />
      <Button icon={<IconEdit size={16} />} aria-label="Edit" variant="secondary" />
      <Button icon={<IconTrash size={16} />} aria-label="Delete" variant="danger" />
      <Button icon={<IconDownload size={16} />} aria-label="Download" variant="ghost" />
    </div>
  ),
};

// States
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const DisabledVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary" disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="danger" disabled>Danger</Button>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// As Link
export const AsLink: Story = {
  args: {
    as: 'a',
    href: 'https://example.com',
    target: '_blank',
    children: 'Visit Website',
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!'),
  },
};
