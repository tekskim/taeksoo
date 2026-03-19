import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { cn } from '../../services/utils/cn';
import { Button } from '../Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon';
import {
  buttonGroupStyles,
  customHeaderStyles,
  dayButtonOutsideStyles,
  dayButtonRangeMiddleStyles,
  dayButtonSelectedStyles,
  dayButtonStyles,
  dayButtonTodayStyles,
  dayRangeEndStyles,
  dayRangeMiddleStyles,
  dayRangeSameStyles,
  dayRangeStartStyles,
  dayStyles,
  monthLabelStyles,
  monthStyles,
  navButtonStyles,
  rootStyles,
  weekdayStyles,
  weekdaysStyles,
  weekStyles,
  weeksStyles,
} from './DatePicker.styles';
import type {
  DatePickerProps,
  DatePickerValue,
  DateRange,
} from './DatePicker.types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatMonthYear = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
};

/** 두 날짜가 같은 날인지 확인 */
const isSameDay = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

/** 날짜를 YYYY-MM-DD 기준으로 정규화 */
const toDateOnly = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** 오늘인지 확인 */
const isToday = (date: Date): boolean => isSameDay(date, new Date());

/** 날짜가 범위 내에 있는지 확인 */
const isInRange = (date: Date, from?: Date, to?: Date): boolean => {
  if (!from || !to) return false;
  const time = date.getTime();
  return time > from.getTime() && time < to.getTime();
};

/** 날짜가 disabled인지 확인 (minDate 이전 또는 maxDate 이후) */
const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean => {
  const dateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();

  if (minDate) {
    const minDateTime = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate()
    ).getTime();
    if (dateTime < minDateTime) return true;
  }

  if (maxDate) {
    const maxDateTime = new Date(
      maxDate.getFullYear(),
      maxDate.getMonth(),
      maxDate.getDate()
    ).getTime();
    if (dateTime > maxDateTime) return true;
  }

  return false;
};

/** 해당 월의 캘린더 데이터 생성 */
const getCalendarDays = (
  year: number,
  month: number
): { date: Date; isOutside: boolean }[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: { date: Date; isOutside: boolean }[] = [];

  // 이전 달 날짜 (showOutsideDays)
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isOutside: true,
    });
  }

  // 현재 달 날짜
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      isOutside: false,
    });
  }

  // 다음 달 날짜 (6주 채우기)
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isOutside: true,
    });
  }

  return days;
};

/** 캘린더 날짜를 주 단위로 그룹화 */
const groupByWeek = <T,>(items: T[], size: number): T[][] => {
  const weeks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    weeks.push(items.slice(i, i + size));
  }
  return weeks;
};

/**
 * DatePicker 컴포넌트
 *
 * 날짜 또는 날짜 범위를 선택할 수 있는 캘린더 컴포넌트
 *
 * @param mode - 선택 모드 ('single' | 'range', 기본값: 'range')
 * @param value - 선택된 날짜 (single: Date, range: DateRange)
 * @param onChange - 날짜 변경 시 호출되는 콜백
 * @param onApply - Apply 버튼 클릭 시 호출되는 콜백
 * @param onCancel - Cancel 버튼 클릭 시 호출되는 콜백
 * @param className - 추가 CSS 클래스
 * @param numberOfMonths - 표시할 월 개수
 */
const DatePicker: React.FC<DatePickerProps> = props => {
  const {
    mode = 'range',
    value,
    onChange,
    onApply,
    onCancel,
    className,
    numberOfMonths = 1,
    isLoading = false,
    minDate,
    maxDate,
    preventFutureSet = true,
  } = props;

  const isSingleMode = mode === 'single';

  // 임시 선택 상태 (Apply 전까지는 여기에만 저장)
  const [tempValue, setTempValue] = useState<DatePickerValue>(value);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // value prop이 변경되면 임시 상태 업데이트
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const effectiveMaxDate = useMemo(() => {
    if (!preventFutureSet) return maxDate;
    const today = toDateOnly(new Date());
    if (!maxDate) return today;
    const normalizedMax = toDateOnly(maxDate);
    return normalizedMax.getTime() < today.getTime() ? maxDate : today;
  }, [preventFutureSet, maxDate]);

  // 날짜 선택 핸들러
  const handleDayClick = useCallback(
    (clickedDate: Date): void => {
      // disabled 날짜는 클릭 불가
      if (isDateDisabled(clickedDate, minDate, effectiveMaxDate)) {
        return;
      }

      if (isSingleMode) {
        // Single mode: 날짜 하나만 선택
        const newValue = clickedDate;
        setTempValue(newValue);
        if (!onApply) {
          (onChange as (v: Date | undefined) => void)?.(newValue);
        }
      } else {
        // Range mode
        const currentRange = tempValue as DateRange | undefined;

        let newRange: DateRange;

        if (!currentRange?.from) {
          // 시작 날짜 선택
          newRange = { from: clickedDate, to: undefined };
        } else if (!currentRange.to) {
          // 끝 날짜 선택
          if (clickedDate < currentRange.from) {
            // 클릭한 날짜가 시작 날짜보다 이전이면 새로운 시작 날짜로
            newRange = { from: clickedDate, to: undefined };
          } else {
            newRange = { from: currentRange.from, to: clickedDate };
          }
        } else {
          // 이미 범위가 완성되어 있으면 새로운 시작 날짜로
          newRange = { from: clickedDate, to: undefined };
        }

        setTempValue(newRange);
        if (!onApply) {
          (onChange as (v: DateRange | undefined) => void)?.(newRange);
        }
      }
    },
    [isSingleMode, tempValue, onApply, onChange, minDate, effectiveMaxDate]
  );

  const handleApply = (): void => {
    (onApply as (v: DatePickerValue) => void)?.(tempValue);
    (onChange as (v: DatePickerValue) => void)?.(tempValue);
  };

  const handleCancel = (): void => {
    setTempValue(value);
    onCancel?.();
  };

  const handlePreviousMonth = (): void => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = (): void => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // 캘린더 데이터 생성
  const calendarData = useMemo(() => {
    const months: {
      month: Date;
      weeks: { date: Date; isOutside: boolean }[][];
    }[] = [];

    for (let i = 0; i < numberOfMonths; i++) {
      const monthDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + i,
        1
      );
      const days = getCalendarDays(
        monthDate.getFullYear(),
        monthDate.getMonth()
      );
      months.push({
        month: monthDate,
        weeks: groupByWeek(days, 7),
      });
    }

    return months;
  }, [currentMonth, numberOfMonths]);

  // Apply 버튼 비활성화 여부 계산
  const isApplyDisabled = useMemo(() => {
    if (isLoading) return true;

    if (isSingleMode) {
      const selected = tempValue as Date | undefined;
      if (!selected) return true;
      // minDate/maxDate 범위 체크
      return isDateDisabled(selected, minDate, effectiveMaxDate);
    }

    // Range mode: from과 to 모두 있어야 하고, 범위 내에 있어야 함
    const range = tempValue as DateRange | undefined;
    if (!range?.from || !range?.to) return true;

    // from 또는 to가 범위를 벗어나면 비활성화
    if (isDateDisabled(range.from, minDate, effectiveMaxDate)) return true;
    if (isDateDisabled(range.to, minDate, effectiveMaxDate)) return true;

    return false;
  }, [isSingleMode, tempValue, minDate, effectiveMaxDate, isLoading]);

  // 날짜 상태 계산
  const getDayState = useCallback(
    (
      date: Date,
      isOutside: boolean
    ): {
      isSelected: boolean;
      isRangeStart: boolean;
      isRangeEnd: boolean;
      isRangeMiddle: boolean;
      isToday: boolean;
      isOutside: boolean;
      isDisabled: boolean;
    } => {
      const today = isToday(date);
      const disabled = isDateDisabled(date, minDate, effectiveMaxDate);

      if (isSingleMode) {
        const selected = tempValue as Date | undefined;
        return {
          isSelected: Boolean(selected && isSameDay(date, selected)),
          isRangeStart: false,
          isRangeEnd: false,
          isRangeMiddle: false,
          isToday: today,
          isOutside,
          isDisabled: disabled,
        };
      }

      const range = tempValue as DateRange | undefined;
      const isStart = Boolean(range?.from && isSameDay(date, range.from));
      const isEnd = Boolean(range?.to && isSameDay(date, range.to));
      const isMiddle = isInRange(date, range?.from, range?.to);

      return {
        isSelected: isStart || isEnd,
        isRangeStart: isStart,
        isRangeEnd: isEnd,
        isRangeMiddle: isMiddle,
        isToday: today,
        isOutside,
        isDisabled: disabled,
      };
    },
    [isSingleMode, tempValue, minDate, effectiveMaxDate]
  );

  return (
    <div className={cn(rootStyles, 'datepicker-root', className)}>
      {/* Custom Header */}
      <div className={cn(customHeaderStyles)}>
        <button
          type="button"
          className={cn(navButtonStyles)}
          onClick={handlePreviousMonth}
          aria-label="Go to previous month"
        >
          <ChevronLeftIcon size="sm" />
        </button>
        <span className={cn(monthLabelStyles)}>
          {formatMonthYear(currentMonth)}
        </span>
        <button
          type="button"
          className={cn(navButtonStyles)}
          onClick={handleNextMonth}
          aria-label="Go to next month"
        >
          <ChevronRightIcon size="sm" />
        </button>
      </div>

      {/* Calendar Grid */}
      {calendarData.map((monthData, monthIndex) => (
        <div key={monthIndex} className={cn(monthStyles, 'dp-month')}>
          {/* Weekday Headers */}
          <div className={cn(weekdaysStyles, 'dp-weekdays')}>
            {WEEKDAYS.map(day => (
              <div key={day} className={cn(weekdayStyles, 'dp-weekday')}>
                {day}
              </div>
            ))}
          </div>

          {/* Date Grid */}
          <div className={cn(weeksStyles, 'dp-weeks')}>
            {monthData.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={cn(weekStyles, 'dp-week')}>
                {week.map((dayData, dayIndex) => {
                  const state = getDayState(dayData.date, dayData.isOutside);
                  const dayClasses = cn(
                    dayStyles,
                    state.isRangeMiddle && dayRangeMiddleStyles,
                    state.isRangeStart && dayRangeStartStyles,
                    state.isRangeEnd && dayRangeEndStyles,
                    state.isRangeStart &&
                      state.isRangeEnd &&
                      dayRangeSameStyles,
                    'dp-day',
                    state.isSelected && 'dp-selected',
                    state.isRangeStart && 'dp-range-start',
                    state.isRangeEnd && 'dp-range-end',
                    state.isRangeMiddle && 'dp-range-middle',
                    state.isRangeStart && state.isRangeEnd && 'dp-range-same',
                    state.isToday && !state.isSelected && 'dp-today',
                    state.isOutside && 'dp-outside',
                    state.isDisabled && 'dp-disabled'
                  );
                  const dayButtonClasses = cn(
                    dayButtonStyles,
                    state.isOutside && dayButtonOutsideStyles,
                    state.isRangeMiddle && dayButtonRangeMiddleStyles,
                    state.isSelected && dayButtonSelectedStyles,
                    state.isToday && !state.isSelected && dayButtonTodayStyles
                  );

                  return (
                    <div key={dayIndex} className={dayClasses}>
                      <button
                        type="button"
                        className={dayButtonClasses}
                        onClick={
                          state.isDisabled
                            ? undefined
                            : () => handleDayClick(dayData.date)
                        }
                        disabled={state.isDisabled}
                        aria-disabled={state.isDisabled}
                      >
                        {dayData.date.getDate()}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      {(onApply || onCancel) && (
        <div className={cn(buttonGroupStyles)}>
          {onCancel && (
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          {onApply && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleApply}
              isLoading={isLoading}
              disabled={isApplyDisabled}
            >
              Apply
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
