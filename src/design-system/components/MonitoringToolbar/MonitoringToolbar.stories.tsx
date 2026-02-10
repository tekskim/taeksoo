import type { Meta, StoryObj } from '@storybook/react-vite';
import { MonitoringToolbar } from './MonitoringToolbar';
import { useState } from 'react';

const meta: Meta<typeof MonitoringToolbar> = {
  title: 'Components/MonitoringToolbar',
  component: MonitoringToolbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## MonitoringToolbar 컴포넌트

모니터링 대시보드에서 시간 범위를 선택하는 툴바입니다.

### 특징
- 사전 정의된 시간 범위 (30m, 1h, 6h, 12h, 24h)
- 커스텀 기간 선택 (DatePicker)
- 새로고침 버튼
- Controlled/Uncontrolled 모드 지원

### Props
- **timeRangeOptions**: 시간 범위 옵션 배열
- **timeRange**: 선택된 시간 범위 (controlled)
- **defaultTimeRange**: 기본 시간 범위 (uncontrolled)
- **customPeriod**: 커스텀 기간 (controlled)
- **onRefresh**: 새로고침 콜백

### 사용 시기
- 메트릭 대시보드
- 로그 뷰어
- 모니터링 차트

### 예시
\`\`\`tsx
<MonitoringToolbar
  timeRange="1h"
  onTimeRangeChange={(range) => setTimeRange(range)}
  onRefresh={() => fetchData()}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    showRefresh: {
      control: 'boolean',
      description: '새로고침 버튼 표시',
      table: { defaultValue: { summary: 'true' } },
    },
    defaultTimeRange: {
      control: 'select',
      options: ['30m', '1h', '3h', '6h', '12h', '24h'],
      description: '기본 시간 범위',
      table: { defaultValue: { summary: '30m' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MonitoringToolbar>;

// Default
export const Default: Story = {
  render: () => (
    <MonitoringToolbar
      onTimeRangeChange={(range) => console.log('Time range:', range)}
      onRefresh={() => console.log('Refresh')}
    />
  ),
};

// Controlled
export const Controlled: Story = {
  render: function ControlledStory() {
    const [timeRange, setTimeRange] = useState<
      '30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'
    >('1h');

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <MonitoringToolbar
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onRefresh={() => console.log('Refresh')}
        />
        <p className="text-body-md text-[var(--color-text-muted)]">Selected: {timeRange}</p>
      </div>
    );
  },
};

// Without Refresh
export const WithoutRefresh: Story = {
  render: () => (
    <MonitoringToolbar
      showRefresh={false}
      onTimeRangeChange={(range) => console.log('Time range:', range)}
    />
  ),
};

// Custom Time Range Options
export const CustomOptions: Story = {
  render: () => (
    <MonitoringToolbar
      timeRangeOptions={[
        { label: '15m', value: '30m' },
        { label: '30m', value: '30m' },
        { label: '1h', value: '1h' },
        { label: '2h', value: '3h' },
        { label: '4h', value: '6h' },
      ]}
      onTimeRangeChange={(range) => console.log('Time range:', range)}
      onRefresh={() => console.log('Refresh')}
    />
  ),
};

// With Custom Period
export const WithCustomPeriod: Story = {
  render: function CustomPeriodStory() {
    const [timeRange, setTimeRange] = useState<
      '30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'
    >('custom');
    const [customPeriod, setCustomPeriod] = useState<{ start: Date; end: Date } | null>({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(),
    });

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <MonitoringToolbar
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          customPeriod={customPeriod}
          onCustomPeriodChange={setCustomPeriod}
          onRefresh={() => console.log('Refresh')}
        />
        <p className="text-body-md text-[var(--color-text-muted)]">
          {customPeriod
            ? `Custom: ${customPeriod.start.toLocaleDateString()} - ${customPeriod.end.toLocaleDateString()}`
            : `Selected: ${timeRange}`}
        </p>
      </div>
    );
  },
};

// In Dashboard Context
export const InDashboardContext: Story = {
  render: () => (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)]">
      <div className="flex items-center justify-between mb-[var(--primitive-spacing-4)]">
        <h2 className="text-heading-h4">CPU Usage</h2>
        <MonitoringToolbar
          defaultTimeRange="1h"
          onTimeRangeChange={(range) => console.log('Time range:', range)}
          onRefresh={() => console.log('Refresh')}
        />
      </div>
      <div className="h-[200px] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex items-center justify-center text-[var(--color-text-muted)]">
        Chart Placeholder
      </div>
    </div>
  ),
};
