import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardTitle } from './CardTitle';
import { IconStar, IconCloud, IconLock } from '@tabler/icons-react';

const meta: Meta<typeof CardTitle> = {
  title: 'Components/CardTitle',
  component: CardTitle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md p-4 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
## CardTitle 컴포넌트

카드나 리스트 아이템의 제목 영역을 표시하는 컴포넌트입니다.

### 특징
- 상태 인디케이터 (성공, 경고, 에러 등)
- 뱃지 표시 (Public, Beta 등)
- 사이드 콘텐츠 (게이지, 아이콘)
- 설명 텍스트

### Props
- **title**: 메인 제목 텍스트
- **description**: 부가 설명
- **showStatus**: 상태 인디케이터 표시
- **statusColor**: 상태 색상
- **badges**: 뱃지 배열
- **side**: 사이드 콘텐츠 타입 (none, gauge, icon)

### 사용 시기
- 리소스 목록 아이템
- 카드 헤더
- 대시보드 위젯

### 예시
\`\`\`tsx
<CardTitle
  title="my-instance-01"
  description="Production server"
  showStatus
  statusColor="success"
  badges={[{ label: 'Public', variant: 'success' }]}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    showStatus: {
      control: 'boolean',
      description: '상태 인디케이터 표시',
      table: { defaultValue: { summary: 'false' } },
    },
    statusColor: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'muted'],
      description: '상태 색상',
      table: { defaultValue: { summary: 'success' } },
    },
    side: {
      control: 'select',
      options: ['none', 'gauge', 'icon'],
      description: '사이드 콘텐츠 타입',
      table: { defaultValue: { summary: 'none' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardTitle>;

// Default
export const Default: Story = {
  args: {
    title: 'lively-sunset-6041',
  },
};

// With Description
export const WithDescription: Story = {
  args: {
    title: 'pytorch-ml-instance',
    description: 'PyTorch GPU-enabled template for AI/ML workloads with CUDA support',
  },
};

// With Status
export const WithStatus: Story = {
  args: {
    title: 'production-server-01',
    description: 'Main production server',
    showStatus: true,
    statusColor: 'success',
  },
};

// With Badges
export const WithBadges: Story = {
  args: {
    title: 'community-template',
    description: 'Community contributed template',
    badges: [
      { label: 'Public', variant: 'success' },
      { label: 'ai-ml', variant: 'info' },
      { label: 'pytorch', variant: 'muted' },
    ],
  },
};

// With Status and Badges
export const WithStatusAndBadges: Story = {
  args: {
    title: 'ml-training-pod',
    description: 'GPU-enabled training environment',
    showStatus: true,
    statusColor: 'success',
    badges: [
      { label: 'GPU', variant: 'info' },
      { label: 'Running', variant: 'success' },
    ],
  },
};

// With Gauge
export const WithGauge: Story = {
  args: {
    title: 'compute-node-01',
    description: 'High-performance compute instance',
    showStatus: true,
    statusColor: 'success',
    side: 'gauge',
    gaugeValue: '45.2%',
    gaugeLabel: 'CPU Utilization',
  },
};

// With Icon
export const WithIcon: Story = {
  args: {
    title: 'starred-template',
    description: 'Your favorite template',
    side: 'icon',
    sideIcon: <IconStar size={20} className="text-[var(--color-state-warning)]" fill="currentColor" />,
  },
};

// All Status Colors
export const AllStatusColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CardTitle title="Success Status" showStatus statusColor="success" />
      <CardTitle title="Warning Status" showStatus statusColor="warning" />
      <CardTitle title="Error Status" showStatus statusColor="error" />
      <CardTitle title="Info Status" showStatus statusColor="info" />
      <CardTitle title="Muted Status" showStatus statusColor="muted" />
    </div>
  ),
};

// Badge Variants
export const BadgeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CardTitle
        title="Badge Examples"
        badges={[
          { label: 'Default', variant: 'default' },
          { label: 'Success', variant: 'success' },
          { label: 'Info', variant: 'info' },
          { label: 'Warning', variant: 'warning' },
          { label: 'Muted', variant: 'muted' },
        ]}
      />
    </div>
  ),
};

// Complex Example
export const ComplexExample: Story = {
  render: () => (
    <CardTitle
      title="enterprise-ml-platform"
      description="Enterprise-grade machine learning platform with integrated model training, deployment, and monitoring capabilities"
      showStatus
      statusColor="success"
      badges={[
        { label: 'Enterprise', variant: 'info', icon: <IconLock size={9} /> },
        { label: 'Cloud', variant: 'muted', icon: <IconCloud size={9} /> },
        { label: 'Active', variant: 'success' },
      ]}
      side="gauge"
      gaugeValue="87.5%"
      gaugeLabel="Uptime"
    />
  ),
};

// Clickable
export const Clickable: Story = {
  args: {
    title: 'clickable-item',
    description: 'Click to view details',
    onClick: () => alert('Clicked!'),
  },
};
