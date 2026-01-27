import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingCard } from './FloatingCard';

const meta: Meta<typeof FloatingCard> = {
  title: 'Components/FloatingCard',
  component: FloatingCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## FloatingCard 컴포넌트

리소스 생성 위자드 등에서 사용하는 플로팅 요약 카드입니다.

### 특징
- 화면 모서리에 고정 위치 (top-left, top-right, bottom-left, bottom-right)
- 섹션별 상태 표시 (success, warning, processing, default)
- 쿼타(Quota) 진행률 표시
- 인스턴스 개수 입력
- 액션 버튼 (Cancel, Create)

### 사용 시기
- VM, Pod 생성 위자드
- 리소스 설정 요약 표시
- 진행 상태 추적

### 예시
\`\`\`tsx
<FloatingCard
  title="Create Instance"
  sections={[
    {
      tabTitle: 'Basic Info',
      items: [
        { id: '1', title: 'Name', status: 'success' },
        { id: '2', title: 'Type', status: 'processing' },
      ],
    },
  ]}
  quota={[
    { label: 'vCPU', current: 4, total: 20 },
    { label: 'Memory', current: 8, total: 64, unit: 'GB' },
  ]}
  onCancel={() => {}}
  onAction={() => {}}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: '화면 위치',
      table: { defaultValue: { summary: 'top-left' } },
    },
    actionEnabled: {
      control: 'boolean',
      description: '액션 버튼 활성화',
      table: { defaultValue: { summary: 'false' } },
    },
    showCloseButton: {
      control: 'boolean',
      description: '닫기 버튼 표시',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FloatingCard>;

// Default (non-portal for Storybook)
export const Default: Story = {
  render: () => (
    <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard
        title="Create Instance"
        portal={false}
        sections={[
          {
            tabTitle: 'Basic Information',
            items: [
              { id: '1', title: 'Instance Name', status: 'success' },
              { id: '2', title: 'Description', status: 'success' },
            ],
          },
          {
            tabTitle: 'Configuration',
            items: [
              { id: '3', title: 'Instance Type', status: 'processing' },
              { id: '4', title: 'Storage', status: 'default' },
            ],
          },
        ]}
        onCancel={() => console.log('Cancel')}
        onAction={() => console.log('Create')}
      />
    </div>
  ),
};

// With Quota
export const WithQuota: Story = {
  render: () => (
    <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard
        title="Create VM Instance"
        portal={false}
        sections={[
          {
            tabTitle: 'Instance Settings',
            items: [
              { id: '1', title: 'Name', status: 'success' },
              { id: '2', title: 'Type', status: 'success' },
              { id: '3', title: 'Image', status: 'success' },
            ],
          },
        ]}
        quota={[
          { label: 'vCPU', current: 8, total: 32 },
          { label: 'Memory', current: 16, total: 128, unit: 'GB' },
          { label: 'Storage', current: 100, total: 500, unit: 'GB' },
        ]}
        onCancel={() => {}}
        onAction={() => {}}
      />
    </div>
  ),
};

// With Instance Count
export const WithInstanceCount: Story = {
  render: () => (
    <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard
        title="Deploy Application"
        portal={false}
        sections={[
          {
            tabTitle: 'Deployment',
            items: [
              { id: '1', title: 'Image', status: 'success' },
              { id: '2', title: 'Ports', status: 'success' },
            ],
          },
        ]}
        instanceCount={3}
        onInstanceCountChange={(count) => console.log('Count:', count)}
        actionLabel="Deploy"
        actionEnabled
        onCancel={() => {}}
        onAction={() => {}}
      />
    </div>
  ),
};

// All Statuses
export const AllStatuses: Story = {
  render: () => (
    <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard
        title="Status Examples"
        portal={false}
        sections={[
          {
            tabTitle: 'Various Statuses',
            items: [
              { id: '1', title: 'Completed Item', status: 'success' },
              { id: '2', title: 'Processing Item', status: 'processing' },
              { id: '3', title: 'Warning Item', status: 'warning' },
              { id: '4', title: 'Pending Item', status: 'default' },
            ],
          },
        ]}
        onCancel={() => {}}
        onAction={() => {}}
      />
    </div>
  ),
};

// Action Enabled
export const ActionEnabled: Story = {
  render: () => (
    <div className="relative h-[500px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard
        title="Ready to Create"
        portal={false}
        sections={[
          {
            tabTitle: 'Configuration',
            showSuccessIcon: true,
            items: [{ id: '1', title: 'All settings configured', status: 'success' }],
          },
        ]}
        actionEnabled
        actionLabel="Create Instance"
        onCancel={() => {}}
        onAction={() => {}}
      />
    </div>
  ),
};

// With Close Button
export const WithCloseButton: Story = {
  render: () => (
    <div className="relative h-[400px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard
        title="Summary"
        portal={false}
        showCloseButton
        onClose={() => console.log('Close')}
        sections={[]}
      />
    </div>
  ),
};

// Multiple Sections
export const MultipleSections: Story = {
  render: () => (
    <div className="relative h-[600px] bg-[var(--color-surface-subtle)] p-4">
      <FloatingCard
        title="Create Kubernetes Deployment"
        portal={false}
        sections={[
          {
            tabTitle: 'Basic Info',
            collapsible: true,
            defaultExpanded: true,
            items: [
              { id: '1', title: 'Name', status: 'success' },
              { id: '2', title: 'Namespace', status: 'success' },
            ],
          },
          {
            tabTitle: 'Container',
            collapsible: true,
            defaultExpanded: true,
            items: [
              { id: '3', title: 'Image', status: 'success' },
              { id: '4', title: 'Resources', status: 'processing' },
              { id: '5', title: 'Env Variables', status: 'default' },
            ],
          },
          {
            tabTitle: 'Networking',
            collapsible: true,
            defaultExpanded: false,
            items: [
              { id: '6', title: 'Service', status: 'default' },
              { id: '7', title: 'Ingress', status: 'default' },
            ],
          },
        ]}
        quota={[{ label: 'Pods', current: 15, total: 100 }]}
        onCancel={() => {}}
        onAction={() => {}}
      />
    </div>
  ),
};
