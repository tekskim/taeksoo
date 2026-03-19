import type { Meta, StoryObj } from '@storybook/react';
import FloatingCard from './FloatingCard';

const meta: Meta<typeof FloatingCard> = {
  title: 'Overlay/Floating Card',
  component: FloatingCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    summaryTitle: 'Summary',
    sections: [
      {
        title: 'Tab title',
        status: 'processing',
        items: [
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'success' },
          { label: 'Section title', status: 'warning' },
        ],
      },
      {
        title: 'Tab title',
        status: 'processing',
        items: [
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'processing' },
          { label: 'Section title', status: 'success' },
          { label: 'Section title', status: 'warning' },
        ],
      },
    ],
    quotaTitle: 'Quota',
    quotas: [
      { label: 'Instance', used: 2, limit: 10, pending: 2 },
      { label: 'vCPU', used: 5, limit: 20, pending: 5 },
      { label: 'RAM (GiB)', used: 14, limit: 50, pending: 6 },
      { label: 'Disk', used: 4, limit: 10, pending: 2 },
      { label: 'Disk Capacity (GiB)', used: 100, limit: 700, pending: 50 },
    ],
  },
};

export const Collapsible: Story = {
  args: {
    summaryTitle: 'Summary',
    collapsibleSections: true,
    sectionOpenMode: 'single',
    defaultExpandedSectionIds: ['pod'],
    sections: [
      {
        id: 'deployment',
        title: 'Deployment',
        status: 'success',
        items: [
          { label: 'Basic Information', status: 'success' },
          { label: 'Labels & Annotations', status: 'success' },
          { label: 'Scaling & Upgrade Policy', status: 'success' },
        ],
      },
      {
        id: 'pod',
        title: 'Pod',
        status: 'processing',
        items: [
          { label: 'Labels & Annotations', status: 'success' },
          { label: 'Scaling & Upgrade Policy', status: 'processing' },
          { label: 'Networking', status: 'processing' },
          { label: 'Node Scheduling', status: 'warning' },
        ],
      },
      {
        id: 'container-0',
        title: 'Container-0',
        status: 'processing',
        items: [
          { label: 'Basic Information', status: 'success' },
          { label: 'Image', status: 'processing' },
          { label: 'Resources', status: 'processing' },
        ],
      },
    ],
  },
};
