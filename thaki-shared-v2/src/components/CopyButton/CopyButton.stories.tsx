import type { Meta, StoryObj } from '@storybook/react';
import Layout from '../Layout';
import { Typography } from '../Typography';
import CopyButton from './CopyButton';

const meta: Meta<typeof CopyButton> = {
  title: 'Form/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '복사할 텍스트',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CopyButton>;

/** 기본 CopyButton */
export const Default: Story = {
  args: {
    text: 'Hello, World!',
  },
  render: args => (
    <Layout.HStack gap="sm" align="center">
      <Typography.Text>Hello, World!</Typography.Text>
      <CopyButton {...args} />
    </Layout.HStack>
  ),
};
