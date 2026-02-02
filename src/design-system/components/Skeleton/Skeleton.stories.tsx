import type { Meta, StoryObj } from '@storybook/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonCard,
  SkeletonTable,
} from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
    },
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/* ----------------------------------------
   Basic Stories
   ---------------------------------------- */

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Text</h3>
        <Skeleton variant="text" width={200} height={16} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Circular</h3>
        <Skeleton variant="circular" size={48} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Rectangular</h3>
        <Skeleton variant="rectangular" width={200} height={100} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Rounded</h3>
        <Skeleton variant="rounded" width={200} height={100} />
      </div>
    </div>
  ),
};

export const Animations: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Pulse (default)</h3>
        <Skeleton animation="pulse" width={200} height={20} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Wave</h3>
        <Skeleton animation="wave" width={200} height={20} />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">None</h3>
        <Skeleton animation="none" width={200} height={20} />
      </div>
    </div>
  ),
};

export const MultipleLines: Story = {
  render: () => (
    <div className="w-[300px]">
      <Skeleton variant="text" count={4} height={16} gap={8} />
    </div>
  ),
};

/* ----------------------------------------
   Preset Stories
   ---------------------------------------- */

export const TextPreset: Story = {
  render: () => (
    <div className="w-[300px]">
      <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-4">SkeletonText</h3>
      <SkeletonText lines={4} />
    </div>
  ),
};

export const AvatarPreset: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="sm" />
        <span className="text-body-sm">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="md" />
        <span className="text-body-sm">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="lg" />
        <span className="text-body-sm">LG</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size={64} />
        <span className="text-body-sm">64px</span>
      </div>
    </div>
  ),
};

export const ButtonPreset: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="sm" />
        <span className="text-body-sm">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="md" />
        <span className="text-body-sm">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="lg" />
        <span className="text-body-sm">LG</span>
      </div>
    </div>
  ),
};

export const ImagePreset: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="w-[200px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">16:9</h3>
        <SkeletonImage aspectRatio="16/9" />
      </div>
      <div className="w-[150px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">4:3</h3>
        <SkeletonImage aspectRatio="4/3" />
      </div>
      <div className="w-[100px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">1:1</h3>
        <SkeletonImage aspectRatio="1/1" />
      </div>
    </div>
  ),
};

export const CardPreset: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="w-[300px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">With Avatar</h3>
        <SkeletonCard avatar lines={3} />
      </div>
      <div className="w-[300px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">With Image</h3>
        <SkeletonCard avatar image lines={2} />
      </div>
      <div className="w-[300px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Text Only</h3>
        <SkeletonCard avatar={false} lines={4} />
      </div>
    </div>
  ),
};

export const TablePreset: Story = {
  render: () => (
    <div className="w-full max-w-[600px]">
      <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-4">SkeletonTable</h3>
      <SkeletonTable rows={5} columns={4} />
    </div>
  ),
};

/* ----------------------------------------
   Loading State Examples
   ---------------------------------------- */

export const LoadingState: Story = {
  render: () => {
    const isLoading = true;
    const data = { name: 'John Doe', email: 'john@example.com' };

    return (
      <div className="flex flex-col gap-4 w-[300px]">
        <h3 className="text-label-sm text-[var(--color-text-subtle)]">
          With loading prop (loading={String(isLoading)})
        </h3>
        <Skeleton loading={isLoading} variant="text" width="100%" height={20}>
          <span>{data.name}</span>
        </Skeleton>
        <Skeleton loading={isLoading} variant="text" width="80%" height={16}>
          <span>{data.email}</span>
        </Skeleton>
      </div>
    );
  },
};

export const CompositeExample: Story = {
  render: () => (
    <div className="flex gap-4 p-4 border border-[var(--color-border-default)] rounded-lg w-[400px]">
      <SkeletonAvatar size="lg" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton variant="text" width="70%" height={18} />
        <Skeleton variant="text" width="50%" height={14} />
        <div className="flex gap-2 mt-2">
          <SkeletonButton size="sm" />
          <SkeletonButton size="sm" />
        </div>
      </div>
    </div>
  ),
};
