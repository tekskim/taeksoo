import type { Meta, StoryObj } from '@storybook/react';
import CreateLayout from './CreateLayout';
import { FloatingCard } from '../FloatingCard';
import Layout from '../Layout';
import { Typography } from '../Typography';
import { Button } from '../Button';

const meta: Meta<typeof CreateLayout> = {
  title: 'Layout/CreateLayout',
  component: CreateLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div
        style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Mock Section Card Component for demo
const SectionCard = ({
  title,
  children,
  isActive = false,
}: {
  title: string;
  children?: React.ReactNode;
  isActive?: boolean;
}): React.ReactElement => (
  <div
    className={`bg-surface border rounded-lg px-4 py-3 ${
      isActive ? 'border-primary' : 'border-border'
    }`}
  >
    <div className="flex items-center justify-between h-8 mb-3">
      <h5 className="text-14 font-semibold leading-20 text-text">{title}</h5>
    </div>
    {children}
  </div>
);

/**
 * 기본 사용 예시
 *
 * 좌측에 폼 섹션들, 우측에 FloatingCard가 배치됩니다.
 */
export const Default: Story = {
  args: {
    title: 'Create Instance',
    children: (
      <Layout.VStack gap="md">
        <SectionCard title="Basic Information" isActive>
          <Layout.VStack gap="sm">
            <Typography.Text color="secondary">
              Enter basic information for the new instance.
            </Typography.Text>
            <div className="h-20 bg-surface-subtle rounded border border-border" />
          </Layout.VStack>
        </SectionCard>
        <SectionCard title="Source">
          <Layout.VStack gap="sm">
            <Typography.Text color="secondary">
              Select the source image or snapshot.
            </Typography.Text>
            <div className="h-32 bg-surface-subtle rounded border border-border" />
          </Layout.VStack>
        </SectionCard>
        <SectionCard title="Flavor">
          <Layout.VStack gap="sm">
            <Typography.Text color="secondary">
              Select the flavor for CPU, RAM, and disk.
            </Typography.Text>
            <div className="h-24 bg-surface-subtle rounded border border-border" />
          </Layout.VStack>
        </SectionCard>
        <SectionCard title="Network">
          <Layout.VStack gap="sm">
            <Typography.Text color="secondary">
              Configure network settings.
            </Typography.Text>
            <div className="h-24 bg-surface-subtle rounded border border-border" />
          </Layout.VStack>
        </SectionCard>
      </Layout.VStack>
    ),
    sidebar: (
      <FloatingCard
        summaryTitle="Summary"
        sections={[
          {
            items: [
              { label: 'Basic Information', status: 'processing' },
              { label: 'Source' },
              { label: 'Flavor' },
              { label: 'Network' },
              { label: 'Authentication' },
              { label: 'Advanced' },
            ],
          },
        ]}
        quotaTitle="Quota"
        quotas={[
          { label: 'Instance', used: 2, limit: 10, pending: 1 },
          { label: 'vCPU', used: 5, limit: 20, pending: 2 },
          { label: 'RAM (GiB)', used: 14, limit: 50, pending: 4 },
          { label: 'Disk', used: 2, limit: 10, pending: 1 },
          { label: 'Disk Capacity (GiB)', used: 20, limit: 1000, pending: 50 },
        ]}
      />
    ),
  },
};

/**
 * Header Actions 포함
 *
 * 타이틀 우측에 버튼 등의 액션을 추가할 수 있습니다.
 */
export const WithHeaderActions: Story = {
  args: {
    title: 'Create Volume',
    headerActions: (
      <Layout.HStack gap="sm">
        <Button variant="secondary" appearance="outline" size="sm">
          Import
        </Button>
      </Layout.HStack>
    ),
    children: (
      <Layout.VStack gap="md">
        <SectionCard title="Volume Configuration" isActive>
          <Layout.VStack gap="sm">
            <Typography.Text color="secondary">
              Configure the volume settings.
            </Typography.Text>
            <div className="h-32 bg-surface-subtle rounded border border-border" />
          </Layout.VStack>
        </SectionCard>
      </Layout.VStack>
    ),
    sidebar: (
      <FloatingCard
        summaryTitle="Summary"
        sections={[
          {
            items: [
              { label: 'Volume Configuration', status: 'processing' },
              { label: 'Advanced Options' },
            ],
          },
        ]}
        quotaTitle="Quota"
        quotas={[
          { label: 'Volume', used: 5, limit: 20, pending: 1 },
          {
            label: 'Volume Capacity (GiB)',
            used: 100,
            limit: 1000,
            pending: 50,
          },
        ]}
      />
    ),
  },
};

/**
 * 사이드바 없음
 *
 * 사이드바 없이 전체 너비를 사용하는 레이아웃입니다.
 */
export const WithoutSidebar: Story = {
  args: {
    title: 'Create Security Group',
    children: (
      <Layout.VStack gap="md">
        <SectionCard title="Basic Information" isActive>
          <Layout.VStack gap="sm">
            <Typography.Text color="secondary">
              Enter the security group name and description.
            </Typography.Text>
            <div className="h-20 bg-surface-subtle rounded border border-border" />
          </Layout.VStack>
        </SectionCard>
        <SectionCard title="Rules">
          <Layout.VStack gap="sm">
            <Typography.Text color="secondary">
              Configure inbound and outbound rules.
            </Typography.Text>
            <div className="h-48 bg-surface-subtle rounded border border-border" />
          </Layout.VStack>
        </SectionCard>
      </Layout.VStack>
    ),
  },
};

/**
 * 스크롤 동작 테스트
 *
 * 스크롤 시 FloatingCard가 상단에 고정되는 것을 확인할 수 있습니다.
 */
export const ScrollBehavior: Story = {
  args: {
    title: 'Create Instance (Scroll Test)',
    children: (
      <Layout.VStack gap="md">
        {Array.from({ length: 10 }, (_, i) => (
          <SectionCard key={i} title={`Section ${i + 1}`} isActive={i === 0}>
            <Layout.VStack gap="sm">
              <Typography.Text color="secondary">
                This is section {i + 1} content. Scroll down to see the sticky
                sidebar behavior.
              </Typography.Text>
              <div className="h-40 bg-surface-subtle rounded border border-border" />
            </Layout.VStack>
          </SectionCard>
        ))}
      </Layout.VStack>
    ),
    sidebar: (
      <FloatingCard
        summaryTitle="Summary"
        sections={[
          {
            items: [
              { label: 'Section 1', status: 'success' },
              { label: 'Section 2', status: 'success' },
              { label: 'Section 3', status: 'processing' },
              { label: 'Section 4' },
              { label: 'Section 5' },
            ],
          },
        ]}
        quotaTitle="Quota"
        quotas={[
          { label: 'Instance', used: 2, limit: 10, pending: 1 },
          { label: 'vCPU', used: 5, limit: 20, pending: 2 },
        ]}
      />
    ),
  },
};

/**
 * 사이드바 너비 옵션
 *
 * sidebarWidth prop으로 사이드바 너비를 조절할 수 있습니다.
 */
export const SidebarWidthOptions: Story = {
  args: {
    title: 'Create Instance',
    sidebarWidth: 'lg',
    children: (
      <Layout.VStack gap="md">
        <SectionCard title="Basic Information" isActive>
          <Typography.Text color="secondary">
            This example shows a larger sidebar width (360px).
          </Typography.Text>
        </SectionCard>
      </Layout.VStack>
    ),
    sidebar: (
      <FloatingCard
        summaryTitle="Summary"
        sections={[
          {
            items: [
              { label: 'Basic Information', status: 'processing' },
              { label: 'Source' },
              { label: 'Flavor' },
            ],
          },
        ]}
        quotaTitle="Quota"
        quotas={[
          { label: 'Instance', used: 2, limit: 10, pending: 1 },
          { label: 'vCPU', used: 5, limit: 20, pending: 2 },
        ]}
      />
    ),
  },
};

/**
 * 최소 너비 없음
 *
 * minWidth를 'none'으로 설정하면 최소 너비 제한이 없습니다.
 */
export const NoMinWidth: Story = {
  args: {
    title: 'Create Instance',
    minWidth: 'none',
    children: (
      <Layout.VStack gap="md">
        <SectionCard title="Basic Information" isActive>
          <Typography.Text color="secondary">
            This layout has no minimum width restriction.
          </Typography.Text>
        </SectionCard>
      </Layout.VStack>
    ),
    sidebar: (
      <FloatingCard
        summaryTitle="Summary"
        sections={[
          {
            items: [{ label: 'Basic Information', status: 'processing' }],
          },
        ]}
      />
    ),
  },
};
