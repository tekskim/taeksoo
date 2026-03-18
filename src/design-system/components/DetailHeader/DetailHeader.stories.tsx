import type { Meta, StoryObj } from '@storybook/react-vite';
import { DetailHeader } from './DetailHeader';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { HStack } from '../../layouts';
import { IconEdit, IconTrash, IconPlayerStop } from '@tabler/icons-react';

const meta: Meta<typeof DetailHeader> = {
  title: 'Components/DetailHeader',
  component: DetailHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '900px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
## DetailHeader 컴포넌트

상세 페이지 상단에 리소스의 핵심 정보를 표시하는 헤더 컴포넌트입니다.

### 구성 요소
- **DetailHeader**: 메인 컨테이너
- **DetailHeader.Title**: 리소스 이름/제목
- **DetailHeader.Actions**: 액션 버튼 그룹
- **DetailHeader.InfoGrid**: 정보 카드 그리드
- **DetailHeader.InfoCard**: 개별 정보 카드 (라벨, 값, 복사 버튼, 상태 표시)

### 사용 시기
- VM, Pod, Service 등 리소스 상세 페이지 상단
- 핵심 메타데이터를 한눈에 보여줄 때
- 빠른 액션 버튼이 필요할 때

### 예시
\`\`\`tsx
<DetailHeader>
  <DetailHeader.Title>my-deployment</DetailHeader.Title>
  <DetailHeader.Actions>
    <Button size="sm">Edit</Button>
  </DetailHeader.Actions>
  <DetailHeader.InfoGrid>
    <DetailHeader.InfoCard label="Status" status="active" value="" />
    <DetailHeader.InfoCard label="Replicas" value="3/3" />
  </DetailHeader.InfoGrid>
</DetailHeader>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DetailHeader>;

// Default
export const Default: Story = {
  render: () => (
    <DetailHeader>
      <div className="flex items-start justify-between">
        <DetailHeader.Title>nginx-deployment</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>
            Edit
          </Button>
          <Button size="sm" variant="danger" leftIcon={<IconTrash size={12} />}>
            Delete
          </Button>
        </DetailHeader.Actions>
      </div>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Namespace" value="default" />
        <DetailHeader.InfoCard label="Replicas" value="3/3" />
        <DetailHeader.InfoCard label="Age" value="5d 12h" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
  ),
};

// With Copyable Value
export const WithCopyable: Story = {
  render: () => (
    <DetailHeader>
      <DetailHeader.Title>my-pod-7d8f9b6c4-xyz12</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Pod IP" value="10.244.1.15" copyable />
        <DetailHeader.InfoCard label="Node" value="worker-node-01" copyable />
        <DetailHeader.InfoCard label="UID" value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" copyable />
      </DetailHeader.InfoGrid>
    </DetailHeader>
  ),
};

// With Status Indicators
export const WithStatus: Story = {
  render: () => (
    <DetailHeader>
      <DetailHeader.Title>production-service</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Health" status="active" value="" />
        <DetailHeader.InfoCard label="Endpoints" value="3 active" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
  ),
};

// With Custom Value Content
export const WithCustomValue: Story = {
  render: () => (
    <DetailHeader>
      <DetailHeader.Title>web-server</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard
          label="Labels"
          value={
            <HStack gap={1}>
              <Chip value="app=web" variant="default" />
              <Chip value="env=prod" variant="default" />
            </HStack>
          }
        />
        <DetailHeader.InfoCard label="Created" value="Jan 15, 2024 10:30" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
  ),
};

// VM Detail Example
export const VMDetail: Story = {
  name: 'VM Detail Example',
  render: () => (
    <DetailHeader>
      <div className="flex items-start justify-between">
        <DetailHeader.Title>production-vm-01</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button size="sm" variant="secondary" leftIcon={<IconPlayerStop size={12} />}>
            Stop
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>
            Edit
          </Button>
          <Button size="sm" variant="danger" leftIcon={<IconTrash size={12} />}>
            Delete
          </Button>
        </DetailHeader.Actions>
      </div>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Instance Type" value="m5.xlarge" />
        <DetailHeader.InfoCard label="Private IP" value="10.0.1.100" copyable />
        <DetailHeader.InfoCard label="Public IP" value="52.14.123.45" copyable />
      </DetailHeader.InfoGrid>
    </DetailHeader>
  ),
};

// Service Detail Example
export const ServiceDetail: Story = {
  name: 'Kubernetes Service Example',
  render: () => (
    <DetailHeader>
      <div className="flex items-start justify-between">
        <DetailHeader.Title>frontend-service</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button size="sm" variant="secondary">
            Edit YAML
          </Button>
          <Button size="sm" variant="danger">
            Delete
          </Button>
        </DetailHeader.Actions>
      </div>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Type" value="ClusterIP" />
        <DetailHeader.InfoCard label="Cluster IP" value="10.96.45.123" copyable />
        <DetailHeader.InfoCard label="Port" value="80/TCP" />
        <DetailHeader.InfoCard label="Target Port" value="8080" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
  ),
};

// With InfoCard Tooltip
export const WithInfoCardTooltip: Story = {
  render: () => (
    <DetailHeader>
      <DetailHeader.Title>compute-node-01</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="ID" value="n-a1b2c3d4" copyable />
        <DetailHeader.InfoCard
          label="IOPS"
          value="3000"
          tooltip="Input/Output Operations Per Second"
        />
        <DetailHeader.InfoCard
          label="Throughput"
          value="125 MB/s"
          tooltip="Maximum sustained data transfer rate"
        />
      </DetailHeader.InfoGrid>
    </DetailHeader>
  ),
};

// Minimal
export const Minimal: Story = {
  render: () => (
    <DetailHeader>
      <DetailHeader.Title>simple-resource</DetailHeader.Title>
      <DetailHeader.InfoGrid>
        <DetailHeader.InfoCard label="Status" status="active" value="" />
        <DetailHeader.InfoCard label="Created" value="Just now" />
      </DetailHeader.InfoGrid>
    </DetailHeader>
  ),
};
