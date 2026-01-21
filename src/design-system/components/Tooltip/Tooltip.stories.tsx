import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';
import { IconInfoCircle, IconHelpCircle } from '@tabler/icons-react';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '툴팁 위치',
    },
    delay: {
      control: 'number',
      description: '표시 지연 시간 (ms)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화',
    },
  },
  args: {
    content: 'Tooltip content',
    position: 'top',
    delay: 200,
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Basic
export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

// Positions
export const Positions: Story = {
  render: () => (
    <div className="flex gap-8 p-12 justify-center">
      <Tooltip content="Top tooltip" position="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
  ),
};

// With Icons
export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="text-sm">Instance type</span>
      <Tooltip content="Select the compute capacity for your instance">
        <IconInfoCircle size={16} className="text-[var(--color-text-muted)] cursor-help" />
      </Tooltip>
    </div>
  ),
};

// On Button
export const OnButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="Create a new item">
        <Button>Create</Button>
      </Tooltip>
      <Tooltip content="This action is disabled" position="bottom">
        <span>
          <Button disabled>Disabled</Button>
        </span>
      </Tooltip>
    </div>
  ),
};

// Long Content
export const LongContent: Story = {
  render: () => (
    <Tooltip content="This is a longer tooltip that provides more detailed information about the element being hovered.">
      <Button variant="secondary">Hover for details</Button>
    </Tooltip>
  ),
};

// With JSX Content
export const WithJSXContent: Story = {
  render: () => (
    <Tooltip
      content={
        <div className="flex items-center gap-2">
          <IconHelpCircle size={14} />
          <span>Click for more help</span>
        </div>
      }
    >
      <Button variant="ghost" icon={<IconHelpCircle size={16} />} aria-label="Help" />
    </Tooltip>
  ),
};

// Different Delays
export const Delays: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="Instant (0ms)" delay={0}>
        <Button variant="secondary">Instant</Button>
      </Tooltip>
      <Tooltip content="Fast (100ms)" delay={100}>
        <Button variant="secondary">Fast</Button>
      </Tooltip>
      <Tooltip content="Default (200ms)" delay={200}>
        <Button variant="secondary">Default</Button>
      </Tooltip>
      <Tooltip content="Slow (500ms)" delay={500}>
        <Button variant="secondary">Slow</Button>
      </Tooltip>
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  render: () => (
    <Tooltip content="This tooltip is disabled" disabled>
      <Button>No tooltip</Button>
    </Tooltip>
  ),
};

// Focus Support
export const FocusSupport: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        Tab through the buttons to see tooltips on focus
      </p>
      <div className="flex gap-4">
        <Tooltip content="First action">
          <Button variant="secondary">Action 1</Button>
        </Tooltip>
        <Tooltip content="Second action">
          <Button variant="secondary">Action 2</Button>
        </Tooltip>
        <Tooltip content="Third action">
          <Button variant="secondary">Action 3</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

// Real-world Example
export const RealWorldExample: Story = {
  render: () => (
    <div className="w-[400px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">CPU Usage</span>
            <Tooltip content="Current CPU utilization across all cores">
              <IconInfoCircle size={14} className="text-[var(--color-text-muted)] cursor-help" />
            </Tooltip>
          </div>
          <span className="text-[var(--color-state-success)]">23%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Memory</span>
            <Tooltip content="RAM usage including cache and buffers">
              <IconInfoCircle size={14} className="text-[var(--color-text-muted)] cursor-help" />
            </Tooltip>
          </div>
          <span className="text-[var(--color-state-warning)]">67%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Disk I/O</span>
            <Tooltip content="Read/Write operations per second">
              <IconInfoCircle size={14} className="text-[var(--color-text-muted)] cursor-help" />
            </Tooltip>
          </div>
          <span>1.2K IOPS</span>
        </div>
      </div>
    </div>
  ),
};
