import type { Meta, StoryObj } from '@storybook/react';
import Title from './Title';

const meta = {
  title: 'Foundation/Title',
  component: Title,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Title size variant',
    },
    title: {
      control: 'text',
      description: 'Title text',
    },
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Large size - default variant
 */
export const Large: Story = {
  args: {
    title: 'Instances',
    size: 'large',
  },
};

/**
 * Medium size
 */
export const Medium: Story = {
  args: {
    title: 'Volumes',
    size: 'medium',
  },
};

/**
 * Small size
 */
export const Small: Story = {
  args: {
    title: 'Volume',
    size: 'small',
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  args: {
    title: 'Instances',
    size: 'large',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Title title="Instances" size="large" />
      <Title title="Volumes" size="medium" />
      <Title title="Volume" size="small" />
    </div>
  ),
};
