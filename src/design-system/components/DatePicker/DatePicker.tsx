import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type DatePickerMode = 'single' | 'range';

// thaki-ui compatibility type
export interface ThakiDatePickerValue {
  start: Date | null;
  end: Date | null;
}

export interface DatePickerProps {
  /** Selection mode */
  mode?: DatePickerMode;
  /** Selected date (single mode) */
  value?: Date | null;
  /** Selected range (range mode) */
  rangeValue?: { start: Date | null; end: Date | null };
  /** Callback when date changes (single mode) */
  onChange?: (date: Date | null) => void;
  /** Callback when range changes (range mode) */
  onRangeChange?: (range: { start: Date | null; end: Date | null }) => void;
  /** Dates with events (shows dot indicator) */
  eventDates?: Date[];
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Disabled state */
  disabled?: boolean;
  /** First day of week (0 = Sunday, 1 = Monday) */
  firstDayOfWeek?: 0 | 1;
  /** Custom class name */
  className?: string;
  /** @deprecated thaki-ui compatibility - use onChange/onRangeChange instead */
  onApply?: (value: ThakiDatePickerValue) => void;
  /** @deprecated thaki-ui compatibility - cancel handler */
  onCancel?: () => void;
  /** @deprecated thaki-ui compatibility - number of visible months */
  numberOfMonths?: number;
  /** @deprecated thaki-ui compatibility - loading state */
  isLoading?: boolean;
}

/* ----------------------------------------
   Helpers
   ---------------------------------------- */

const WEEKDAYS_SUNDAY_START = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_MONDAY_START = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const isSameDay = (a: Date, b: Date): boolean => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
};

const isDateDisabled = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/* ----------------------------------------
   Calendar Grid Generator
   ---------------------------------------- */

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  hasEvent: boolean;
  isDisabled: boolean;
}

const generateCalendarDays = (
  year: number,
  month: number,
  value: Date | null,
  rangeValue: { start: Date | null; end: Date | null },
  eventDates: Date[],
  minDate?: Date,
  maxDate?: Date,
  firstDayOfWeek: 0 | 1 = 0
): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const today = new Date();
  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDayOfMonth(year, month);

  // Adjust for Monday start
  if (firstDayOfWeek === 1) {
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
  }

  // Previous month days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: value ? isSameDay(date, value) : false,
      isRangeStart: rangeValue.start ? isSameDay(date, rangeValue.start) : false,
      isRangeEnd: rangeValue.end ? isSameDay(date, rangeValue.end) : false,
      isInRange: isDateInRange(date, rangeValue.start, rangeValue.end),
      hasEvent: eventDates.some((d) => isSameDay(d, date)),
      isDisabled: isDateDisabled(date, minDate, maxDate),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      isSelected: value ? isSameDay(date, value) : false,
      isRangeStart: rangeValue.start ? isSameDay(date, rangeValue.start) : false,
      isRangeEnd: rangeValue.end ? isSameDay(date, rangeValue.end) : false,
      isInRange: isDateInRange(date, rangeValue.start, rangeValue.end),
      hasEvent: eventDates.some((d) => isSameDay(d, date)),
      isDisabled: isDateDisabled(date, minDate, maxDate),
    });
  }

  // Next month days to fill remaining cells (6 rows = 42 cells)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length;

  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextYear, nextMonth, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: value ? isSameDay(date, value) : false,
      isRangeStart: rangeValue.start ? isSameDay(date, rangeValue.start) : false,
      isRangeEnd: rangeValue.end ? isSameDay(date, rangeValue.end) : false,
      isInRange: isDateInRange(date, rangeValue.start, rangeValue.end),
      hasEvent: eventDates.some((d) => isSameDay(d, date)),
      isDisabled: isDateDisabled(date, minDate, maxDate),
    });
  }

  return days;
};

/* ----------------------------------------
   DatePicker Component
   ---------------------------------------- */

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = 'single',
  value = null,
  rangeValue = { start: null, end: null },
  onChange,
  onRangeChange,
  eventDates = [],
  minDate,
  maxDate,
  disabled = false,
  firstDayOfWeek = 0,
  className = '',
  // thaki-ui compatibility props
  onApply,
  onCancel,
  numberOfMonths,
  isLoading,
}) => {
  // thaki-ui compatibility: warn about deprecated props
  if (process.env.NODE_ENV === 'development') {
    if (onApply)
      console.warn(
        '[DatePicker] onApply prop is deprecated. Selection is applied immediately via onChange/onRangeChange.'
      );
    if (onCancel)
      console.warn(
        '[DatePicker] onCancel prop is deprecated. Handle cancellation in parent component.'
      );
    if (numberOfMonths && numberOfMonths > 1)
      console.warn(
        '[DatePicker] numberOfMonths > 1 is not supported. Only single month view is available.'
      );
    if (isLoading)
      console.warn(
        '[DatePicker] isLoading prop is deprecated. Handle loading state in parent component.'
      );
  }
  // Initialize view month from value or today
  const initialDate = value || rangeValue.start || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const [selectingRangeEnd, setSelectingRangeEnd] = useState(false);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const weekdays = firstDayOfWeek === 1 ? WEEKDAYS_MONDAY_START : WEEKDAYS_SUNDAY_START;

  const calendarDays = useMemo(
    () =>
      generateCalendarDays(
        viewYear,
        viewMonth,
        value,
        rangeValue,
        eventDates,
        minDate,
        maxDate,
        firstDayOfWeek
      ),
    [viewYear, viewMonth, value, rangeValue, eventDates, minDate, maxDate, firstDayOfWeek]
  );

  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }, [viewMonth, viewYear]);

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }, [viewMonth, viewYear]);

  const handleDateClick = useCallback(
    (day: CalendarDay) => {
      if (disabled || day.isDisabled) return;

      if (mode === 'single') {
        onChange?.(day.date);
      } else {
        // Range mode
        if (!selectingRangeEnd || !rangeValue.start) {
          // Selecting start date
          onRangeChange?.({ start: day.date, end: null });
          setSelectingRangeEnd(true);
        } else {
          // Selecting end date
          if (day.date < rangeValue.start) {
            // If selected date is before start, swap them
            onRangeChange?.({ start: day.date, end: rangeValue.start });
          } else {
            onRangeChange?.({ start: rangeValue.start, end: day.date });
          }
          setSelectingRangeEnd(false);
        }
      }
    },
    [disabled, mode, onChange, onRangeChange, rangeValue.start, selectingRangeEnd]
  );

  // Sync focused button when focusedDate changes
  useEffect(() => {
    if (!focusedDate || !gridRef.current) return;
    const dateStr = focusedDate.toISOString().slice(0, 10);
    const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${dateStr}"]`);
    btn?.focus();
  }, [focusedDate]);

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const dateAttr = target.getAttribute('data-date');
      if (!dateAttr) return;

      const current = new Date(dateAttr + 'T00:00:00');
      let next: Date | null = null;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          next = new Date(current);
          next.setDate(next.getDate() + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          next = new Date(current);
          next.setDate(next.getDate() - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          next = new Date(current);
          next.setDate(next.getDate() + 7);
          break;
        case 'ArrowUp':
          e.preventDefault();
          next = new Date(current);
          next.setDate(next.getDate() - 7);
          break;
        case 'Home':
          e.preventDefault();
          next = new Date(current.getFullYear(), current.getMonth(), 1);
          break;
        case 'End':
          e.preventDefault();
          next = new Date(
            current.getFullYear(),
            current.getMonth(),
            getDaysInMonth(current.getFullYear(), current.getMonth())
          );
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          {
            const day = calendarDays.find((d) => isSameDay(d.date, current));
            if (day) handleDateClick(day);
          }
          return;
      }

      if (next) {
        if (isDateDisabled(next, minDate, maxDate)) return;
        // Navigate months if needed
        if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
          setViewYear(next.getFullYear());
          setViewMonth(next.getMonth());
        }
        setFocusedDate(next);
      }
    },
    [calendarDays, handleDateClick, minDate, maxDate, viewMonth, viewYear]
  );

  const monthYearText = useMemo(() => {
    const year = viewYear;
    const month = String(viewMonth + 1).padStart(2, '0');
    return `${year}.${month}`;
  }, [viewYear, viewMonth]);

  // Calculate width: 7 cells × 32px + 6 gaps × 6px + 2 paddings × 12px = 284px
  const calendarWidth = 7 * 32 + 6 * 6 + 2 * 12;

  return (
    <div
      data-figma-name="[TDS] DatePicker"
      className={`
        inline-flex flex-col gap-[var(--datepicker-gap)]
        p-[var(--datepicker-padding)]
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        rounded-[var(--datepicker-radius)]
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
      style={{ width: calendarWidth }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={disabled}
          className="
            flex items-center justify-center
            w-6 h-6
            text-[var(--color-text-default)]
            hover:bg-[var(--datepicker-hover-bg)]
            rounded-[var(--radius-button)]
            transition-colors duration-[var(--duration-fast)]
          "
          aria-label="Previous month"
        >
          <IconChevronLeft size={12} stroke={1} />
        </button>

        <span
          className="
          w-[64px]
          text-heading-h5
          text-[var(--color-text-default)]
          text-left
          select-none
        "
        >
          {monthYearText}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          disabled={disabled}
          className="
            flex items-center justify-center
            w-6 h-6
            text-[var(--color-text-default)]
            hover:bg-[var(--datepicker-hover-bg)]
            rounded-[var(--radius-button)]
            transition-colors duration-[var(--duration-fast)]
          "
          aria-label="Next month"
        >
          <IconChevronRight size={12} stroke={1} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col gap-[var(--datepicker-row-gap)]">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7">
          {weekdays.map((day, index) => {
            const isFirstCol = index === 0;
            const isLastCol = index === 6;
            return (
              <div
                key={day}
                className="
                  w-[var(--datepicker-cell-size)]
                  px-2 py-0.5
                  text-label-sm
                  text-[var(--color-text-muted)]
                  text-center
                  select-none
                "
                style={{
                  paddingLeft: isFirstCol ? 8 : 3 + 8,
                  paddingRight: isLastCol ? 8 : 3 + 8,
                }}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Date Grid */}
        <div
          ref={gridRef}
          role="group"
          aria-label="Calendar dates"
          className="grid grid-cols-7"
          onKeyDown={handleGridKeyDown}
        >
          {calendarDays.map((day, index) => {
            const isSelected = day.isSelected || day.isRangeStart || day.isRangeEnd;
            // Only show range background when both start and end are selected
            const hasCompleteRange = rangeValue.start && rangeValue.end;
            const isInRange =
              hasCompleteRange && (day.isInRange || day.isRangeStart || day.isRangeEnd);
            const colIndex = index % 7;
            const isFirstCol = colIndex === 0;
            const isLastCol = colIndex === 6;

            return (
              <div
                key={index}
                className="relative"
                style={{
                  // Add gap spacing via padding
                  paddingLeft: isFirstCol ? 0 : 3,
                  paddingRight: isLastCol ? 0 : 3,
                  marginBottom: index < 35 ? 6 : 0,
                }}
              >
                {/* Range background layer - only when both start and end are selected */}
                {hasCompleteRange && isInRange && !day.isRangeStart && !day.isRangeEnd && (
                  <div
                    className="absolute bg-[var(--datepicker-range-bg)]"
                    style={{
                      top: 0,
                      bottom: 0,
                      left: isFirstCol ? 0 : -3,
                      right: isLastCol ? 0 : -3,
                    }}
                  />
                )}
                {hasCompleteRange &&
                  day.isRangeStart &&
                  !isSameDay(rangeValue.start!, rangeValue.end!) && (
                    <div
                      className="absolute bg-[var(--datepicker-range-bg)]"
                      style={{
                        top: 0,
                        bottom: 0,
                        left: 16,
                        right: isLastCol ? 0 : -3,
                      }}
                    />
                  )}
                {hasCompleteRange &&
                  day.isRangeEnd &&
                  !isSameDay(rangeValue.start!, rangeValue.end!) && (
                    <div
                      className="absolute bg-[var(--datepicker-range-bg)]"
                      style={{
                        top: 0,
                        bottom: 0,
                        left: isFirstCol ? 0 : -3,
                        right: 16,
                      }}
                    />
                  )}

                <button
                  type="button"
                  data-date={`${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`}
                  tabIndex={
                    focusedDate
                      ? isSameDay(day.date, focusedDate)
                        ? 0
                        : -1
                      : day.isSelected || (day.isToday && day.isCurrentMonth)
                        ? 0
                        : -1
                  }
                  onClick={() => handleDateClick(day)}
                  disabled={disabled || day.isDisabled}
                  className={`
                    relative z-10
                    flex flex-col items-center justify-center
                    w-[var(--datepicker-cell-size)]
                    h-[var(--datepicker-cell-size)]
                    p-2
                    text-label-md
                    rounded-full
                    transition-colors duration-[var(--duration-fast)]
                    outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]
                    ${
                      isSelected
                        ? 'bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]'
                        : day.isCurrentMonth
                          ? 'text-[var(--color-text-default)] hover:bg-[var(--datepicker-hover-bg)]'
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--datepicker-hover-bg)]'
                    }
                    ${day.isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${day.isToday && !isSelected ? 'ring-1 ring-[var(--color-action-primary)]' : ''}
                  `}
                  aria-label={day.date.toLocaleDateString()}
                  aria-pressed={isSelected}
                >
                  {day.day}

                  {/* Event indicator dot */}
                  {day.hasEvent && (
                    <span
                      className={`
                        absolute bottom-1
                        w-1 h-1
                        rounded-full
                        ${isSelected ? 'bg-[var(--color-text-on-primary)]' : 'bg-[var(--color-action-primary)]'}
                      `}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
