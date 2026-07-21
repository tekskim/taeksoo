import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateRangePicker } from './DateRangePicker';

/**
 * # DateRangePicker
 *
 * DatePicker를 감싸는 래퍼 컴포넌트로, START/END 날짜 헤더와 Cancel/Apply 버튼을 포함합니다.
 *
 * ## 언제 사용하나요?
 * - MonitoringToolbar의 커스텀 기간 선택
 * - 대시보드나 차트의 날짜 범위 필터
 * - 날짜 범위를 확인 후 적용하는 워크플로우
 *
 * ## 구성
 * - **Range Header**: 클릭 가능한 START / END 날짜 박스
 * - **Calendar**: 범위 선택 모드의 DatePicker
 * - **Actions**: Cancel + Apply 버튼
 */
const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'DatePicker를 감싸는 래퍼 컴포넌트로, START/END 날짜 헤더와 Cancel/Apply 버튼을 포함합니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [result, setResult] = useState<string>('');

    return (
      <div className="flex flex-col gap-4">
        <DateRangePicker
          onApply={(range) =>
            setResult(
              `Applied: ${range.start.toLocaleDateString()} ~ ${range.end.toLocaleDateString()}`
            )
          }
          onCancel={() => setResult('Cancelled')}
        />
        {result && <p className="text-body-md text-[var(--color-text-muted)]">{result}</p>}
      </div>
    );
  },
};

export const WithPreselectedRange: Story = {
  render: () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return (
      <DateRangePicker
        value={{ start: oneWeekAgo, end: now }}
        onApply={(range) => console.log('Applied:', range.start, '~', range.end)}
        onCancel={() => console.log('Cancelled')}
      />
    );
  },
};

export const WithMinMaxDates: Story = {
  render: () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return (
      <DateRangePicker
        minDate={thirtyDaysAgo}
        maxDate={now}
        onApply={(range) => console.log('Applied:', range.start, '~', range.end)}
        onCancel={() => console.log('Cancelled')}
      />
    );
  },
};

export const MonitoringToolbarUseCase: Story = {
  name: 'Use Case - Monitoring Toolbar',
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [appliedRange, setAppliedRange] = useState<string>('');

    return (
      <div className="flex flex-col gap-4">
        {!isOpen && (
          <button
            className="text-body-md text-[var(--color-action-primary)] cursor-pointer bg-transparent border-none"
            onClick={() => setIsOpen(true)}
          >
            Open DateRangePicker
          </button>
        )}
        {isOpen && (
          <DateRangePicker
            maxDate={new Date()}
            onApply={(range) => {
              setAppliedRange(
                `${range.start.toLocaleDateString()} ~ ${range.end.toLocaleDateString()}`
              );
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        )}
        {appliedRange && (
          <p className="text-body-md text-[var(--color-text-default)]">
            Selected period: {appliedRange}
          </p>
        )}
      </div>
    );
  },
};
