import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Data Display/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
메트릭 값을 카드 형태로 표시하는 컴포넌트. 상세 페이지의 주요 지표나 대시보드의 요약 정보에 사용합니다.

**사용 위치:**
- Detail 페이지의 메트릭 요약
- 대시보드의 통계 카드
- 모니터링 화면의 지표 표시
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

// 기본
export const Default: Story = {
  args: {
    title: 'Pod restarts',
    value: 3,
    tooltip: 'Number of times containers in this pod have been restarted.',
  },
};

// 툴팁 없이
export const WithoutTooltip: Story = {
  args: {
    title: 'Total instances',
    value: 42,
  },
};

// 그룹으로 사용
export const Group: Story = {
  render: () => (
    <MetricCard.Group>
      <MetricCard title="Pod restarts" value={3} tooltip="Total number of container restarts." />
      <MetricCard title="CPU usage" value="45%" tooltip="Current CPU utilization." />
      <MetricCard title="Memory usage" value="1.2 GB" tooltip="Current memory utilization." />
      <MetricCard title="Network I/O" value="120 MB/s" tooltip="Current network throughput." />
    </MetricCard.Group>
  ),
};

// 단일 카드 (고정 폭)
export const FixedWidth: Story = {
  render: () => (
    <div className="w-[240px]">
      <MetricCard
        title="Replicas"
        value="3 / 3"
        tooltip="Current available replicas / desired replicas."
      />
    </div>
  ),
};
