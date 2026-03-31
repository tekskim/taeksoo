/**
 * MonitoringToolbar
 *
 * 그래프 데이터 조회 범위를 제어하는 버튼 그룹 (SSOT 디자인)
 *
 * 구성:
 * 1. 상대 시간 세그먼트 (30m, 1h, 6h, 12h, 24h)
 * 2. 커스텀 기간 - Period 버튼 또는 파란 태그
 * 3. 새로고침 버튼
 */
import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, CloseSmallIcon, RefreshIcon } from '../Icon';
import { formatAbsoluteDate } from '../../services/utils/dateUtils';
import DatePicker from '../DatePicker/DatePicker';
import type { DateRange } from '../DatePicker/DatePicker.types';

// ========== Constants & Types ==========

export interface TimeOption {
  label: string;
  value: string;
}

export interface CustomPeriod {
  start: Date;
  end: Date;
}

export const DEFAULT_TIME_OPTIONS: TimeOption[] = [
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
];

export const DEFAULT_TIME_RANGE = '1h';

export interface MonitoringToolbarProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  timeOptions?: TimeOption[];
  customPeriod: CustomPeriod | null;
  onCustomPeriodChange: (period: CustomPeriod | null) => void;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  minDate?: Date;
  maxDate?: Date;
  defaultTimeRange?: string;
  periodLabel?: string;
}

// ========== Tailwind Style Map ==========

const tw = {
  root: 'flex items-center gap-1',

  segments:
    'flex items-center gap-0 bg-surface ring-1 ring-inset ring-border rounded-lg h-7 relative',

  segment:
    'px-3 py-1 text-11 font-medium text-text-muted bg-transparent border-none cursor-pointer transition-all duration-fast rounded-md relative z-[1] m-0 h-7 leading-16 w-12 hover:text-text',
  segmentActive:
    'text-primary bg-transparent font-medium ring-1 ring-inset ring-primary rounded-md z-[2]',

  period: 'relative',

  periodBtn:
    'flex items-center justify-center gap-1.5 px-3 py-1 h-7 text-11 font-medium text-text-muted bg-surface ring-1 ring-inset ring-border border-none rounded-lg cursor-pointer transition-all duration-fast hover:ring-border-strong hover:text-text',
  periodBtnActive: 'ring-primary text-primary',

  periodTag:
    'flex items-center gap-2 pl-3 pr-2 py-1 h-7 bg-primary text-white border-none rounded-lg text-11 font-medium',
  periodTagText: 'cursor-pointer hover:underline',
  periodTagDivider: 'mx-1 opacity-60',
  periodTagClose:
    'flex items-center justify-center w-5 h-5 bg-transparent border-none rounded-base cursor-pointer text-white transition-colors duration-fast hover:bg-white/20',

  dropdown:
    'absolute top-full right-0 mt-2 bg-surface border border-border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-3 z-[100] flex flex-col gap-3',

  refresh:
    'flex items-center justify-center w-7 h-7 bg-surface ring-1 ring-inset ring-border border-none rounded-lg cursor-pointer text-text transition-all duration-fast hover:ring-border-strong hover:text-text active:bg-surface-subtle',
} as const;

// ========== Component ==========

const MonitoringToolbar: React.FC<MonitoringToolbarProps> = ({
  timeRange,
  onTimeRangeChange,
  timeOptions = DEFAULT_TIME_OPTIONS,
  customPeriod,
  onCustomPeriodChange,
  onRefresh,
  showRefreshButton = true,
  minDate,
  maxDate,
  defaultTimeRange = DEFAULT_TIME_RANGE,
  periodLabel = 'Period',
}): React.ReactElement => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  const handleTimeRangeSelect = (value: string): void => {
    onTimeRangeChange(value);
    onCustomPeriodChange(null);
  };

  const handleCustomPeriodClick = (): void => {
    setShowDatePicker(true);
  };

  const handleClearCustomPeriod = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onCustomPeriodChange(null);
    onTimeRangeChange(defaultTimeRange);
  };

  const handleDatePickerApply = (range: DateRange | undefined): void => {
    if (range?.from && range?.to) {
      onCustomPeriodChange({ start: range.from, end: range.to });
      onTimeRangeChange('');
      setShowDatePicker(false);
    }
  };

  const handleDatePickerCancel = (): void => {
    setShowDatePicker(false);
  };

  const hasCustomPeriod = customPeriod !== null;

  return (
    <div className={tw.root}>
      {/* Time Range Buttons */}
      <div className={tw.segments}>
        {timeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${tw.segment} ${
              timeRange === option.value && !hasCustomPeriod ? tw.segmentActive : ''
            }`}
            onClick={() => handleTimeRangeSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Period Selector */}
      <div className={tw.period} ref={datePickerRef}>
        {hasCustomPeriod ? (
          <div className={tw.periodTag}>
            <span className={tw.periodTagText} onClick={handleCustomPeriodClick}>
              {formatAbsoluteDate(customPeriod.start)}
              <span className={tw.periodTagDivider}>—</span>
              {formatAbsoluteDate(customPeriod.end)}
            </span>
            <button
              type="button"
              className={tw.periodTagClose}
              onClick={handleClearCustomPeriod}
              aria-label="Clear custom period"
            >
              <CloseSmallIcon size="xs" variant="inverse" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`${tw.periodBtn} ${showDatePicker ? tw.periodBtnActive : ''}`}
            onClick={handleCustomPeriodClick}
          >
            <CalendarIcon size="xs" />
            <span>{periodLabel}</span>
          </button>
        )}

        {/* DatePicker Dropdown */}
        {showDatePicker && (
          <div className={tw.dropdown}>
            <DatePicker
              mode="range"
              value={customPeriod ? { from: customPeriod.start, to: customPeriod.end } : undefined}
              onApply={handleDatePickerApply}
              onCancel={handleDatePickerCancel}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>

      {/* Refresh Button */}
      {showRefreshButton && (
        <button type="button" className={tw.refresh} onClick={onRefresh} aria-label="Refresh">
          <RefreshIcon size="xs" />
        </button>
      )}
    </div>
  );
};

export default React.memo(MonitoringToolbar);
