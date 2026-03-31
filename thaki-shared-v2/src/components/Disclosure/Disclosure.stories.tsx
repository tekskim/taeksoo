import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Disclosure from './Disclosure';

const meta = {
  title: 'Layout/Disclosure',
  component: Disclosure,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Main label text',
    },
    expanded: {
      control: 'boolean',
      description: 'Expanded state (optional, for external control)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    onExpandChange: {
      action: 'expanded changed',
      description: 'Callback when expand state changes',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when header is clicked',
    },
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Description',
    width: '500px',
    children: (
      <div style={{ padding: '12px 0' }}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: 'var(--semantic-color-textMuted)',
          }}
        >
          This is the collapsible content that appears when you expand the section. You can put any
          React component or HTML here.
        </p>
      </div>
    ),
  },
};

export const Controlled: Story = {
  args: {} as any,
  render: function ControlledExample() {
    const [expanded, setExpanded] = useState(false);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '500px',
        }}
      >
        <Disclosure
          label="Controlled Section"
          expanded={expanded}
          onExpandChange={setExpanded}
          width="100%"
        >
          <div style={{ padding: '12px 0' }}>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--semantic-color-textMuted)',
              }}
            >
              This is a controlled component. The state is managed externally.
            </p>
          </div>
        </Disclosure>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--semantic-color-border)',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Toggle from outside: {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
    );
  },
};
