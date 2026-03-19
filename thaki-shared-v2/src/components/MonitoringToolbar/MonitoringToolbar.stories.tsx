import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MonitoringToolbar from './MonitoringToolbar';
import type { CustomPeriod } from './MonitoringToolbar';

const meta = {
  title: 'Layout/Monitoring Toolbar',
  component: MonitoringToolbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 개요

그래프의 데이터 조회 범위를 제어하는 버튼 그룹입니다.
최소한의 클릭으로 원하는 시간대의 데이터를 빠르게 탐색하는 것이 목표입니다.

### 위치

그래프 조합으로 이뤄진 화면의 상단 영역에 배치됩니다. (모니터링 화면 상단 등)


### 구성 요소

- 상대 시간 버튼

| 항목 | 설명 |
|------|------|
| 기본값 | \`30m\` 선택 (\`defaultTimeRange: '30m'\`) |
| 동작 | 라디오 버튼처럼 한 번에 하나만 활성화 |
| 반응 | 클릭 즉시 데이터가 해당 기간으로 필터링 |

- 커스텀 기간 버튼 (Period)

| 동작 | 설명 |
|------|------|
| 클릭 | 데이트 피커 노출 |
| 기간 선택 완료 | 상대 시간 버튼 선택 해제, 선택 기간 + Clear 버튼 노출 |
| Clear 클릭 | 커스텀 기간 해제 → \`1h\`(상대 시간) 재선택 |
| Clear 외 영역 클릭 | 데이트 피커 재노출 (기간 재설정 가능) |

- 새로고침 버튼

클릭 시 데이터가 새로고침됩니다.

        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    timeRange: {
      control: 'text',
      description: '현재 선택된 상대 시간 값 (예: "30m", "1h", "6h")',
    },
    onTimeRangeChange: {
      action: 'onTimeRangeChange',
      description: '상대 시간 변경 시 호출되는 핸들러',
    },
    customPeriod: {
      description: '현재 선택된 커스텀 기간 ({ start: Date, end: Date } | null)',
    },
    onCustomPeriodChange: {
      action: 'onCustomPeriodChange',
      description: '커스텀 기간 변경 시 호출되는 핸들러',
    },
    timeOptions: {
      description: '상대 시간 옵션 배열 (기본: 30m, 1h, 6h, 12h, 24h)',
    },
    defaultTimeRange: {
      control: 'text',
      description: '커스텀 기간 Clear 시 복원되는 기본 시간 (기본: "1h")',
    },
    periodLabel: {
      control: 'text',
      description: 'Period 버튼 텍스트 (기본: "Period", i18n 키 전달 가능)',
    },
    onRefresh: {
      action: 'onRefresh',
      description: '새로고침 버튼 클릭 시 호출되는 핸들러',
    },
    showRefreshButton: {
      control: 'boolean',
      description: '새로고침 버튼 표시 여부 (기본: true)',
    },
    minDate: {
      description: '데이트 피커 선택 가능 최소 날짜',
    },
    maxDate: {
      description: '데이트 피커 선택 가능 최대 날짜',
    },
  },
} satisfies Meta<typeof MonitoringToolbar>;

export default meta;
type Story = Partial<StoryObj<typeof meta>>;

/**
 * 기본 상태 - 상대 시간(1h) 선택됨
 */
const DefaultComponent = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [customPeriod, setCustomPeriod] = useState<CustomPeriod | null>(null);

  return (
    <div style={{ padding: '20px' }}>
      <MonitoringToolbar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        customPeriod={customPeriod}
        onCustomPeriodChange={setCustomPeriod}
        onRefresh={() => console.log('Refresh clicked')}
      />
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        <p>
          현재 선택:{' '}
          {customPeriod
            ? `${customPeriod.start.toLocaleDateString()} ~ ${customPeriod.end.toLocaleDateString()}`
            : timeRange}
        </p>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};
