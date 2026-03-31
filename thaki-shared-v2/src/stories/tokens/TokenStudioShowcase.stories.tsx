import type { Meta, StoryObj } from '@storybook/react';
import { TokenStudioShowcase } from './TokenStudioShowcase';

const meta: Meta<typeof TokenStudioShowcase> = {
  title: 'Foundation/Token Studio',
  component: TokenStudioShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof TokenStudioShowcase>;

export const Overview: Story = {};
