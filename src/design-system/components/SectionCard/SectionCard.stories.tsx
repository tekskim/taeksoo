import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionCard } from './SectionCard';
import { Button } from '../Button';
import { StatusIndicator } from '../StatusIndicator';
import { Chip } from '../Chip';
import { HStack } from '../../layouts';
import { BrowserRouter } from 'react-router-dom';
import { IconEdit } from '@tabler/icons-react';

const meta: Meta<typeof SectionCard> = {
  title: 'Components/SectionCard',
  component: SectionCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ maxWidth: '600px' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
## SectionCard 컴포넌트

상세 페이지에서 정보를 구조화하여 표시하는 카드 컴포넌트입니다.

### 구성 요소
- **SectionCard**: 메인 컨테이너
- **SectionCard.Header**: 섹션 제목과 액션 버튼
- **SectionCard.Content**: 내용 영역
- **SectionCard.DataRow**: 라벨-값 쌍으로 데이터 표시

### 사용 시기
- 상세 페이지에서 관련 정보 그룹화
- 설정 페이지의 섹션 구분
- 대시보드 정보 카드

### 예시
\`\`\`tsx
<SectionCard>
  <SectionCard.Header title="Basic information" />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value="my-instance" />
    <SectionCard.DataRow label="Status">
      <StatusIndicator status="active" />
    </SectionCard.DataRow>
  </SectionCard.Content>
</SectionCard>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    isActive: {
      control: 'boolean',
      description: '활성 상태 (파란색 테두리)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionCard>;

// Default
export const Default: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Basic information" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Name" value="my-instance-01" />
        <SectionCard.DataRow label="Description" value="Production server for web application" />
        <SectionCard.DataRow label="Created" value="Jan 15, 2024 10:30:00" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

// Active State
export const ActiveState: Story = {
  render: () => (
    <SectionCard isActive>
      <SectionCard.Header title="Selected Section" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Name" value="active-item" />
        <SectionCard.DataRow label="Status" value="Running" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

// With Header Actions
export const WithHeaderActions: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header
        title="Configuration"
        actions={
          <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>
        <SectionCard.DataRow label="CPU" value="4 vCPU" />
        <SectionCard.DataRow label="Memory" value="16 GB" />
        <SectionCard.DataRow label="Storage" value="100 GB SSD" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

// With Custom Content
export const WithCustomContent: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Status & Labels" />
      <SectionCard.Content>
        <SectionCard.DataRow label="Status">
          <StatusIndicator status="active" label="Running" />
        </SectionCard.DataRow>
        <SectionCard.DataRow label="Labels">
          <HStack gap={1}>
            <Chip value="production" />
            <Chip value="web" />
            <Chip value="frontend" />
          </HStack>
        </SectionCard.DataRow>
      </SectionCard.Content>
    </SectionCard>
  ),
};

// With Link
export const WithLink: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Related Resources" />
      <SectionCard.Content>
        <SectionCard.DataRow
          label="Network"
          value="vpc-network-01"
          isLink
          linkHref="/network/vpc-001"
        />
        <SectionCard.DataRow
          label="Subnet"
          value="subnet-primary"
          isLink
          linkHref="/network/subnet-001"
        />
      </SectionCard.Content>
    </SectionCard>
  ),
};

// With Divider
export const WithDivider: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Account Details" showDivider />
      <SectionCard.Content>
        <SectionCard.DataRow label="Account ID" value="acc-12345678" showDivider={false} />
        <SectionCard.DataRow label="Owner" value="admin@example.com" />
        <SectionCard.DataRow label="Created" value="Jan 1, 2024" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

// Header with Description
export const HeaderWithDescription: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header
        title="Scheduling"
        description="Configure pod scheduling rules and node affinity."
      />
      <SectionCard.Content>
        <SectionCard.DataRow label="Node Selector" value="gpu=true" />
        <SectionCard.DataRow label="Tolerations" value="NoSchedule" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

// Header with Status Icon
export const HeaderWithStatusIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SectionCard>
        <SectionCard.Header
          title="Basic Information"
          statusIcon={
            <div className="size-4 rounded-full bg-[var(--color-state-success)] flex items-center justify-center shrink-0">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Name" value="my-instance" />
        </SectionCard.Content>
      </SectionCard>
      <SectionCard>
        <SectionCard.Header
          title="Configuration"
          statusIcon={
            <div className="size-4 shrink-0 flex items-center justify-center text-[var(--color-text-muted)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
              </svg>
            </div>
          }
        />
        <SectionCard.Content>
          <SectionCard.DataRow label="Type" value="Not set" />
        </SectionCard.Content>
      </SectionCard>
    </div>
  ),
};

// Content without Dividers
export const ContentWithoutDividers: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Form Section" showDivider={false} />
      <SectionCard.Content showDividers={false}>
        <div className="py-6">
          <span className="text-label-lg text-[var(--color-text-default)]">Instance name</span>
        </div>
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />
        <div className="py-6">
          <span className="text-label-lg text-[var(--color-text-default)]">Availability zone</span>
        </div>
      </SectionCard.Content>
    </SectionCard>
  ),
};

// Content with Custom Gap
export const ContentWithCustomGap: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header title="Compact Layout" />
      <SectionCard.Content gap={1}>
        <SectionCard.DataRow label="CPU" value="4 vCPU" />
        <SectionCard.DataRow label="Memory" value="8 GB" />
        <SectionCard.DataRow label="Storage" value="100 GB" />
      </SectionCard.Content>
    </SectionCard>
  ),
};

// Multiple Cards
export const MultipleCards: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SectionCard>
        <SectionCard.Header title="Instance Details" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Instance ID" value="i-1234567890abcdef0" />
          <SectionCard.DataRow label="Type" value="m5.large" />
        </SectionCard.Content>
      </SectionCard>
      <SectionCard>
        <SectionCard.Header title="Network" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Private IP" value="10.0.1.15" />
          <SectionCard.DataRow label="Public IP" value="52.14.123.45" />
        </SectionCard.Content>
      </SectionCard>
    </div>
  ),
};
