import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Range from './Range';

const meta = {
  title: 'Form/Slider',
  component: Range,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: '312px',
    defaultValue: 25,
  },
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [value, setValue] = useState(50);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Range width="312px" value={value} onChange={setValue} />
        <div style={{ fontSize: '14px', color: 'var(--semantic-color-textMuted)' }}>
          Value: {value}
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    width: '312px',
    defaultValue: 60,
    disabled: true,
  },
};

export const Dual: Story = {
  args: {
    dual: true,
    width: '312px',
    defaultValue: [25, 75],
  },
};

export const DualControlled: Story = {
  render: function DualControlledExample() {
    const [value, setValue] = useState<[number, number]>([30, 70]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Range dual width="312px" value={value} onChange={setValue} />
        <div style={{ fontSize: '14px', color: 'var(--semantic-color-textMuted)' }}>
          Range: {value[0]} - {value[1]}
        </div>
      </div>
    );
  },
};

export const DualDisabled: Story = {
  args: {
    dual: true,
    width: '312px',
    defaultValue: [20, 80],
    disabled: true,
  },
};
