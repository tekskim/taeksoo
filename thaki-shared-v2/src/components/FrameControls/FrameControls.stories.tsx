import type { Meta, StoryObj } from '@storybook/react';
import type { SnapMode } from '../../types';
import { FrameControls } from './FrameControls';

const meta: Meta<typeof FrameControls> = {
  title: 'Layout/Window Control',
  component: FrameControls,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    frameState: {
      control: { type: 'select' },
      options: ['normal', 'maximized'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    frameState: 'normal',
    size: 'sm',
    onMinimize: () => console.log('Minimize clicked'),
    onMaximize: () => console.log('Maximize clicked'),
    onRestore: () => console.log('Restore clicked'),
    onClose: () => console.log('Close clicked'),
    onSnap: (mode: SnapMode) => console.log('Snap:', mode),
  },
};
