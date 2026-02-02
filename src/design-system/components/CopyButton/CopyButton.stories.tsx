import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton, Copyable } from './CopyButton';
import { IconLink, IconKey } from '@tabler/icons-react';

const meta: Meta<typeof CopyButton> = {
  title: 'Components/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'ghost', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

/* ----------------------------------------
   Basic Stories
   ---------------------------------------- */

export const Default: Story = {
  args: {
    value: 'Hello, World!',
    label: 'Copy',
  },
};

export const IconOnly: Story = {
  args: {
    value: 'Hello, World!',
    iconOnly: true,
    tooltip: 'Copy to clipboard',
  },
};

/* ----------------------------------------
   Variants
   ---------------------------------------- */

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="default" label="Default" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="ghost" label="Ghost" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Ghost</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="outline" label="Outline" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Outline</span>
      </div>
    </div>
  ),
};

export const VariantsIconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="default" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="ghost" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Ghost</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" variant="outline" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Outline</span>
      </div>
    </div>
  ),
};

/* ----------------------------------------
   Sizes
   ---------------------------------------- */

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="sm" label="Small" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="md" label="Medium" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="lg" label="Large" />
        <span className="text-body-sm text-[var(--color-text-muted)]">Large</span>
      </div>
    </div>
  ),
};

export const SizesIconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="sm" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="md" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyButton value="text" size="lg" iconOnly />
        <span className="text-body-sm text-[var(--color-text-muted)]">Large</span>
      </div>
    </div>
  ),
};

/* ----------------------------------------
   Custom Icons
   ---------------------------------------- */

export const CustomIcons: Story = {
  args: {
    value: 'https://example.com',
    copyIcon: <IconLink size={14} />,
    label: 'Copy Link',
  },
};

/* ----------------------------------------
   Custom Labels
   ---------------------------------------- */

export const CustomLabels: Story = {
  args: {
    value: 'secret-key-123',
    label: '복사',
    successLabel: '복사됨!',
  },
};

/* ----------------------------------------
   Disabled
   ---------------------------------------- */

export const Disabled: Story = {
  args: {
    value: 'Cannot copy this',
    label: 'Copy',
    disabled: true,
  },
};

/* ----------------------------------------
   With Callback
   ---------------------------------------- */

export const WithCallback: Story = {
  args: {
    value: 'Tracked copy',
    label: 'Copy',
    onCopy: (value) => {
      console.log('Copied:', value);
      alert(`Copied: ${value}`);
    },
  },
};

/* ----------------------------------------
   Copyable Component Stories
   ---------------------------------------- */

export const CopyableDefault: Story = {
  render: () => <Copyable value="instance-abc-123" />,
};

export const CopyableTruncated: Story = {
  render: () => (
    <Copyable
      value="very-long-resource-id-that-should-be-truncated-for-display"
      truncate
      maxWidth="200px"
    />
  ),
};

export const CopyableExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Instance ID</h4>
        <Copyable value="i-0123456789abcdef0" />
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">IP Address</h4>
        <Copyable value="192.168.1.100" />
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Long ID (truncated)</h4>
        <Copyable
          value="arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0"
          truncate
          maxWidth="250px"
        />
      </div>
    </div>
  ),
};

/* ----------------------------------------
   Real World Examples
   ---------------------------------------- */

export const InlineUsage: Story = {
  render: () => (
    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-lg">
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-label-sm text-[var(--color-text-subtle)]">API Key</span>
        <CopyButton
          value="sk_live_abcdefghijklmnop"
          variant="ghost"
          size="sm"
          iconOnly
          tooltip="Copy API key"
        />
      </div>
      <code className="text-body-md text-[var(--color-text-default)] font-mono">
        sk_live_••••••••••••••op
      </code>
    </div>
  ),
};

export const CodeBlock: Story = {
  render: () => (
    <div className="relative">
      <pre className="p-4 pr-12 bg-[var(--color-surface-muted)] rounded-lg text-body-md text-[var(--color-text-default)] overflow-x-auto">
        <code>{`npm install @tds/design-system`}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton
          value="npm install @tds/design-system"
          variant="ghost"
          size="sm"
          iconOnly
          tooltip="Copy command"
        />
      </div>
    </div>
  ),
};

export const TableCell: Story = {
  render: () => (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <th className="p-3 text-left text-label-sm text-[var(--color-text-subtle)]">Name</th>
          <th className="p-3 text-left text-label-sm text-[var(--color-text-subtle)]">ID</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <td className="p-3 text-body-md">Instance 1</td>
          <td className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-body-md text-[var(--color-text-default)]">i-abc123</span>
              <CopyButton value="i-abc123" variant="ghost" size="sm" iconOnly />
            </div>
          </td>
        </tr>
        <tr className="border-b border-[var(--color-border-subtle)]">
          <td className="p-3 text-body-md">Instance 2</td>
          <td className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-body-md text-[var(--color-text-default)]">i-def456</span>
              <CopyButton value="i-def456" variant="ghost" size="sm" iconOnly />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};
