import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';

/**
 * # DatePicker
 *
 * 날짜를 선택하는 캘린더 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 단일 날짜 선택 (예약일, 생일 등)
 * - 날짜 범위 선택 (여행 기간, 필터 등)
 * - 이벤트가 있는 날짜 표시
 * - 예약 가능한 날짜 표시
 *
 * ## 모드
 * - **single**: 단일 날짜 선택
 * - **range**: 시작일~종료일 범위 선택
 *
 * ## 기능
 * - **eventDates**: 이벤트가 있는 날짜에 점 표시
 * - **minDate/maxDate**: 선택 가능한 날짜 범위 제한
 * - **firstDayOfWeek**: 주 시작일 설정 (일요일/월요일)
 *
 * ## 접근성
 * - 각 날짜 버튼에 `aria-label` 제공
 * - `aria-selected`로 선택 상태 표시
 * - 키보드 네비게이션 지원
 */
const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '날짜를 선택하는 캘린더 컴포넌트입니다. 단일 날짜 또는 날짜 범위를 선택할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range'],
      description: '선택 모드',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    firstDayOfWeek: {
      control: 'select',
      options: [0, 1],
      description: '주 시작일 (0: 일요일, 1: 월요일)',
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

export const Default: Story = {
  args: {
    mode: 'single',
  },
};

export const SingleMode: Story = {
  name: 'Single Date Selection',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};

export const RangeMode: Story = {
  name: 'Date Range Selection',
  render: () => {
    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
      start: null,
      end: null,
    });

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          Range: {range.start?.toLocaleDateString() || 'Start'} ~{' '}
          {range.end?.toLocaleDateString() || 'End'}
        </p>
      </div>
    );
  },
};

/* ----------------------------------------
   With Pre-selected Date
   ---------------------------------------- */

export const WithPreselectedDate: Story = {
  name: 'With Pre-selected Date',
  render: () => {
    const today = new Date();
    const [date, setDate] = useState<Date | null>(today);

    return <DatePicker mode="single" value={date} onChange={setDate} />;
  },
};

export const WithPreselectedRange: Story = {
  name: 'With Pre-selected Range',
  render: () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
      start: today,
      end: nextWeek,
    });

    return <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />;
  },
};

/* ----------------------------------------
   With Event Dates
   ---------------------------------------- */

export const WithEventDates: Story = {
  name: 'With Event Dates',
  render: () => {
    const today = new Date();
    const eventDates = [
      new Date(today.getFullYear(), today.getMonth(), 5),
      new Date(today.getFullYear(), today.getMonth(), 12),
      new Date(today.getFullYear(), today.getMonth(), 18),
      new Date(today.getFullYear(), today.getMonth(), 25),
    ];

    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} eventDates={eventDates} />
        <p className="text-body-sm text-[var(--color-text-subtle)]">Dates with dots have events</p>
      </div>
    );
  },
};

/* ----------------------------------------
   With Min/Max Dates
   ---------------------------------------- */

export const WithMinMaxDates: Story = {
  name: 'With Min/Max Dates',
  render: () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 5);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 14);

    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker
          mode="single"
          value={date}
          onChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
        />
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          Only dates within ±2 weeks are selectable
        </p>
      </div>
    );
  },
};

/* ----------------------------------------
   First Day of Week
   ---------------------------------------- */

export const MondayStart: Story = {
  name: 'Monday Start',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} firstDayOfWeek={1} />
        <p className="text-body-sm text-[var(--color-text-subtle)]">Week starts on Monday</p>
      </div>
    );
  },
};

export const SundayStart: Story = {
  name: 'Sunday Start (Default)',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <DatePicker mode="single" value={date} onChange={setDate} firstDayOfWeek={0} />
        <p className="text-body-sm text-[var(--color-text-subtle)]">Week starts on Sunday</p>
      </div>
    );
  },
};

/* ----------------------------------------
   States
   ---------------------------------------- */

export const Disabled: Story = {
  args: {
    mode: 'single',
    disabled: true,
  },
};

/* ----------------------------------------
   Use Cases
   ---------------------------------------- */

export const BookingCalendar: Story = {
  name: 'Use Case - Booking Calendar',
  render: () => {
    const today = new Date();
    const bookedDates = [
      new Date(today.getFullYear(), today.getMonth(), 8),
      new Date(today.getFullYear(), today.getMonth(), 9),
      new Date(today.getFullYear(), today.getMonth(), 10),
      new Date(today.getFullYear(), today.getMonth(), 15),
      new Date(today.getFullYear(), today.getMonth(), 22),
      new Date(today.getFullYear(), today.getMonth(), 23),
    ];

    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <h3 className="text-label-lg text-[var(--color-text-default)]">Select Check-in Date</h3>
        <DatePicker
          mode="single"
          value={date}
          onChange={setDate}
          eventDates={bookedDates}
          minDate={today}
        />
        <div className="flex items-center gap-[var(--primitive-spacing-4)] text-body-sm text-[var(--color-text-subtle)]">
          <span className="flex items-center gap-[var(--primitive-spacing-1)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-state-info)]"></span>
            Booked
          </span>
          <span className="flex items-center gap-[var(--primitive-spacing-1)]">
            <span className="w-2 h-2 rounded-full ring-1 ring-[var(--color-border-focus)]"></span>
            Today
          </span>
        </div>
      </div>
    );
  },
};

export const TravelDateRange: Story = {
  name: 'Use Case - Travel Date Range',
  render: () => {
    const today = new Date();
    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
      start: null,
      end: null,
    });

    const nights =
      range.start && range.end
        ? Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <h3 className="text-label-lg text-[var(--color-text-default)]">Select Travel Dates</h3>
        <DatePicker
          mode="range"
          rangeValue={range}
          onRangeChange={setRange}
          minDate={today}
          firstDayOfWeek={1}
        />
        {nights > 0 && (
          <p className="text-label-md text-[var(--color-state-info)]">
            {nights} night{nights > 1 ? 's' : ''} selected
          </p>
        )}
      </div>
    );
  },
};

export const EventScheduler: Story = {
  name: 'Use Case - Event Scheduler',
  render: () => {
    const today = new Date();
    const events = [
      new Date(today.getFullYear(), today.getMonth(), 3),
      new Date(today.getFullYear(), today.getMonth(), 7),
      new Date(today.getFullYear(), today.getMonth(), 14),
      new Date(today.getFullYear(), today.getMonth(), 21),
      new Date(today.getFullYear(), today.getMonth(), 28),
    ];

    const [date, setDate] = useState<Date | null>(null);

    const selectedEvent =
      date &&
      events.find((e) => e.getDate() === date.getDate() && e.getMonth() === date.getMonth());

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] items-center">
        <h3 className="text-label-lg text-[var(--color-text-default)]">Upcoming Events</h3>
        <DatePicker mode="single" value={date} onChange={setDate} eventDates={events} />
        {selectedEvent ? (
          <p className="text-body-md text-[var(--color-state-success)]">
            Event on {selectedEvent.toLocaleDateString()}
          </p>
        ) : (
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            Click on a date with a dot to see the event
          </p>
        )}
      </div>
    );
  },
};
