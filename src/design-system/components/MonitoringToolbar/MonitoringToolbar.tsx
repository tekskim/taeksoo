import React, { useState, useEffect, useRef } from 'react';
import { IconRefresh, IconCalendar } from '@tabler/icons-react';
import { DateRangePicker } from '../DatePicker';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type TimeRangeValue =
  | '30m'
  | '1h'
  | '3h'
  | '6h'
  | '12h'
  | '24h'
  | '1d'
  | '1w'
  | '2w'
  | 'custom';

export interface TimeRangeOption {
  label: string;
  value: TimeRangeValue;
}

export interface CustomPeriod {
  start: Date;
  end: Date;
}

export interface MonitoringToolbarProps {
  /** Time range options to display */
  timeRangeOptions?: TimeRangeOption[];
  /** Currently selected time range */
  timeRange?: TimeRangeValue;
  /** Default time range (if uncontrolled) */
  defaultTimeRange?: TimeRangeValue;
  /** Callback when time range changes */
  onTimeRangeChange?: (value: TimeRangeValue) => void;
  /** Custom period value (when timeRange is 'custom') */
  customPeriod?: CustomPeriod | null;
  /** Default custom period (if uncontrolled) */
  defaultCustomPeriod?: CustomPeriod | null;
  /** Callback when custom period changes */
  onCustomPeriodChange?: (period: CustomPeriod | null) => void;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Show refresh button */
  showRefresh?: boolean;
  /** Maximum selectable date for custom period */
  maxDate?: Date;
  /** Minimum selectable date for custom period */
  minDate?: Date;
  /** Custom class name */
  className?: string;
}

/* ----------------------------------------
   Default Time Range Options
   ---------------------------------------- */

const defaultTimeRangeOptions: TimeRangeOption[] = [
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
];

/* ----------------------------------------
   Helper Functions
   ---------------------------------------- */

const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return '';
  const month = MONTH_ABBR[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

/* ----------------------------------------
   MonitoringToolbar Component
   ---------------------------------------- */

export const MonitoringToolbar: React.FC<MonitoringToolbarProps> = ({
  timeRangeOptions = defaultTimeRangeOptions,
  timeRange: controlledTimeRange,
  defaultTimeRange = '30m',
  onTimeRangeChange,
  customPeriod: controlledCustomPeriod,
  defaultCustomPeriod = null,
  onCustomPeriodChange,
  onRefresh,
  showRefresh = true,
  maxDate = new Date(),
  minDate,
  className = '',
}) => {
  // State management (controlled or uncontrolled)
  const isTimeRangeControlled = controlledTimeRange !== undefined;
  const isCustomPeriodControlled = controlledCustomPeriod !== undefined;

  const [internalTimeRange, setInternalTimeRange] = useState<TimeRangeValue>(defaultTimeRange);
  const [internalCustomPeriod, setInternalCustomPeriod] = useState<CustomPeriod | null>(
    defaultCustomPeriod
  );

  const timeRange = isTimeRangeControlled ? controlledTimeRange : internalTimeRange;
  const customPeriod = isCustomPeriodControlled ? controlledCustomPeriod : internalCustomPeriod;

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        const el = target instanceof Element ? target : target.parentElement;
        if (el?.closest('[role="listbox"]')) return;
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  // Handlers
  const handleTimeRangeClick = (value: TimeRangeValue) => {
    if (!isTimeRangeControlled) {
      setInternalTimeRange(value);
    }
    if (!isCustomPeriodControlled) {
      setInternalCustomPeriod(null);
    }
    onTimeRangeChange?.(value);
    onCustomPeriodChange?.(null);
  };

  const handleCustomPeriodClick = () => {
    if (customPeriod) {
      setTempStartDate(customPeriod.start);
      setTempEndDate(customPeriod.end);
    } else {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setTempStartDate(oneWeekAgo);
      setTempEndDate(now);
    }
    setShowDatePicker(true);
  };

  const handleClearCustomPeriod = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCustomPeriodControlled) {
      setInternalCustomPeriod(null);
    }
    if (!isTimeRangeControlled) {
      setInternalTimeRange(defaultTimeRange);
    }
    onCustomPeriodChange?.(null);
    onTimeRangeChange?.(defaultTimeRange);
  };

  const handlePeriodTextClick = () => {
    if (customPeriod) {
      setTempStartDate(customPeriod.start);
      setTempEndDate(customPeriod.end);
    }
    setShowDatePicker(true);
  };

  const hasCustomPeriod = customPeriod !== null;

  return (
    <div data-figma-name="[TDS] MonitoringToolbar" className={`monitoring-toolbar ${className}`}>
      {/* Time Range Buttons */}
      <div className="monitoring-toolbar-segments">
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`monitoring-toolbar-segment ${
              timeRange === option.value && !hasCustomPeriod
                ? 'monitoring-toolbar-segment-active'
                : ''
            }`}
            onClick={() => handleTimeRangeClick(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Period Selector */}
      <div className="monitoring-toolbar-period" ref={datePickerRef}>
        {hasCustomPeriod ? (
          <button
            type="button"
            className="flex items-center gap-2 h-[var(--input-height-sm)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border border-[var(--color-border-focus)] rounded-[var(--input-radius)] text-body-sm cursor-pointer transition-colors"
            onClick={handlePeriodTextClick}
          >
            <IconCalendar
              size={14}
              stroke={1.5}
              className="shrink-0 text-[var(--color-text-subtle)]"
            />
            <span className="text-[var(--color-text-default)] whitespace-nowrap font-medium">
              {formatDateForDisplay(customPeriod.start)}
              <span className="mx-0.5 text-[var(--color-text-subtle)]">—</span>
              {formatDateForDisplay(customPeriod.end)}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className={`flex items-center gap-2 h-[var(--input-height-sm)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border rounded-[var(--input-radius)] text-body-sm cursor-pointer transition-colors ${showDatePicker ? 'border-[var(--color-border-focus)]' : 'border-[var(--color-border-strong)] hover:border-[var(--color-border-focus)]'}`}
            onClick={handleCustomPeriodClick}
          >
            <IconCalendar
              size={14}
              stroke={1.5}
              className="shrink-0 text-[var(--color-text-subtle)]"
            />
            <span className="text-[var(--color-text-subtle)] font-medium">Select period</span>
          </button>
        )}

        {/* Calendar Date Picker Dropdown */}
        {showDatePicker && (
          <div className="monitoring-toolbar-dropdown">
            <DateRangePicker
              value={{ start: tempStartDate, end: tempEndDate }}
              onApply={(range) => {
                const newPeriod = { start: range.start, end: range.end };
                if (!isCustomPeriodControlled) {
                  setInternalCustomPeriod(newPeriod);
                }
                if (!isTimeRangeControlled) {
                  setInternalTimeRange('custom');
                }
                onCustomPeriodChange?.(newPeriod);
                onTimeRangeChange?.('custom');
                setShowDatePicker(false);
              }}
              onCancel={() => setShowDatePicker(false)}
              minDate={minDate}
              maxDate={maxDate}
              className="!border-0 !shadow-none"
            />
          </div>
        )}
      </div>

      {/* Refresh Button */}
      {showRefresh && (
        <button
          type="button"
          className="monitoring-toolbar-refresh"
          onClick={onRefresh}
          aria-label="Refresh"
        >
          <IconRefresh size={12} stroke={1.5} />
        </button>
      )}
    </div>
  );
};

export default MonitoringToolbar;
