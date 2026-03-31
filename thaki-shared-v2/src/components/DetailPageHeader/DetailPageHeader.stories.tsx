import type { Meta, StoryObj } from '@storybook/react';
import DetailPageHeader from './DetailPageHeader';
import { Button } from '../Button';

const meta: Meta<typeof DetailPageHeader> = {
  title: 'Layout/Detail Header',
  component: DetailPageHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '1024px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'my-bucket',
    maxWidth: 1024,
    actions: (
      <Button size="sm" appearance="outline" variant="secondary">
        Delete
      </Button>
    ),
    infoFields: [
      {
        label: 'Bucket Name',
        value: 'my-bucket',
        showCopyButton: true,
        copyText: 'my-bucket',
      },
      {
        label: 'Object Count',
        value: '1,234',
      },
      {
        label: 'Object Size',
        value: '45.6 GB',
      },
      {
        label: 'Versioning',
        value: 'Enabled',
      },
      {
        label: 'Encryption',
        value: 'AES-256',
      },
    ],
  },
};

export const WithFixedWidthFields: Story = {
  args: {
    title: 'c1.large',
    maxWidth: 1024,
    actions: (
      <>
        <Button size="sm" appearance="outline" variant="secondary">
          Create Instance
        </Button>
        <Button size="sm" appearance="outline" variant="secondary">
          Create Volume
        </Button>
      </>
    ),
    infoFields: [
      {
        label: 'Category',
        value: 'Compute Optimized',
      },
      {
        label: 'ID',
        value: '7284d9174e81431e93060a9bbcf2cdfd',
        showCopyButton: true,
        copyText: '7284d9174e81431e93060a9bbcf2cdfd',
      },
      {
        label: 'vCPU',
        value: '2',
        width: 148,
      },
      {
        label: 'RAM',
        value: '4GiB',
        width: 148,
      },
      {
        label: 'Visibility',
        value: 'public',
        width: 148,
      },
      {
        label: 'Created At',
        value: '2025-07-25 09:12:20',
        width: 148,
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading...',
    maxWidth: 1024,
    isLoading: true,
    actions: (
      <Button size="sm" appearance="outline" variant="secondary">
        Delete
      </Button>
    ),
    infoFields: [
      {
        label: 'Bucket Name',
        value: '-',
      },
      {
        label: 'Object Count',
        value: '-',
      },
      {
        label: 'Object Size',
        value: '-',
      },
      {
        label: 'Versioning',
        value: '-',
      },
      {
        label: 'Encryption',
        value: '-',
      },
    ],
  },
};
