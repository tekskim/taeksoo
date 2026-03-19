import type { Meta, StoryObj } from '@storybook/react';
import { CategoryIcon } from '../Icon';
import { Badge } from './index';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['blu', 'red', 'gry', 'gre', 'ylw'],
      description: 'Badge color theme',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
    type: {
      control: 'select',
      options: ['subtle', 'solid'],
      description: 'Badge style appearance',
    },
    layout: {
      control: 'select',
      options: ['text-only', 'left-icon', 'right-icon'],
      description: 'Badge layout',
    },
    icon: {
      control: false,
      description: 'Icon element rendered when layout includes an icon',
    },
    children: {
      control: 'text',
      description: 'Badge text content',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge - medium size, gray, subtle
 */
export const Default: Story = {
  args: {
    children: 'Label',
  },
};

/**
 * All variants - colors, sizes, and appearances
 */
export const Variants: Story = {
  args: {
    children: 'Label',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Badge theme="red">Red</Badge>
        <Badge theme="ylw">Yellow</Badge>
        <Badge theme="gry">Gray</Badge>
        <Badge theme="blu">Blue</Badge>
        <Badge theme="gre">Green</Badge>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Badge theme="red" type="solid">
          Solid
        </Badge>
        <Badge theme="ylw" type="solid">
          Solid
        </Badge>
        <Badge theme="gry" type="solid">
          Solid
        </Badge>
        <Badge theme="blu" type="solid">
          Solid
        </Badge>
        <Badge theme="gre" type="solid">
          Solid
        </Badge>
      </div>
    </div>
  ),
};

/**
 * Badges with icons
 */
export const WithIcons: Story = {
  args: {
    children: 'Label',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge theme="red" layout="left-icon" icon={<CategoryIcon />}>
        Left Icon
      </Badge>
      <Badge theme="ylw" layout="right-icon" icon={<CategoryIcon />}>
        Right Icon
      </Badge>
      <Badge
        theme="gre"
        type="solid"
        layout="left-icon"
        icon={<CategoryIcon />}
      >
        Solid
      </Badge>
    </div>
  ),
};
