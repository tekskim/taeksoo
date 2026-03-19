import type { Meta, StoryObj } from '@storybook/react';
import InfoContainer from './InfoContainer';

const meta: Meta<typeof InfoContainer> = {
  title: 'Layout/InfoContainer',
  component: InfoContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: 328 }}>
        <Story />
      </div>
    ),
  ],
};

type Story = StoryObj<typeof meta>;

/**
 * Figma Node: 5305-133001
 * 기본 InfoContainer - 단일 값 표시
 * width: 328px
 */
const Default: Story = {
  args: {
    label: 'Instance',
    values: ['web-server-10'],
  },
};

const WithScroll: Story = {
  args: {
    label: 'Volumes',
    values: ['vol-001', 'vol-002', 'vol-003', 'vol-004', 'vol-005'],
  },
};

export default meta;
export { Default, WithScroll };
