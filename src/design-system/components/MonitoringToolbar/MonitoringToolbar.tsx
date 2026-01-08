import React, { useState, useEffect, useRef } from 'react';
import { IconRefresh, IconX, IconCalendar } from '@tabler/icons-react';
import { DatePicker } from '../DatePicker';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type TimeRangeValue = '30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom';

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

const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
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
  const [internalCustomPeriod, setInternalCustomPeriod] = useState<CustomPeriod | null>(defaultCustomPeriod);

  const timeRange = isTimeRangeControlled ? controlledTimeRange : internalTimeRange;
  const customPeriod = isCustomPeriodControlled ? controlledCustomPeriod : internalCustomPeriod;

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
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
    setSelectingStart(true);
    setShowDatePicker(true);
  };

  const handleApplyCustomPeriod = () => {
    if (tempStartDate && tempEndDate) {
      const newPeriod = { start: tempStartDate, end: tempEndDate };
      if (!isCustomPeriodControlled) {
        setInternalCustomPeriod(newPeriod);
      }
      if (!isTimeRangeControlled) {
        setInternalTimeRange('custom');
      }
      onCustomPeriodChange?.(newPeriod);
      onTimeRangeChange?.('custom');
      setShowDatePicker(false);
    }
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
    setSelectingStart(true);
    setShowDatePicker(true);
  };

  const handleRangeChange = (range: { start: Date | null; end: Date | null }) => {
    setTempStartDate(range.start);
    setTempEndDate(range.end);
    setSelectingStart(!range.start || !!range.end);
  };

  const hasCustomPeriod = customPeriod !== null;

  return (
    <div className={`monitoring-toolbar ${className}`}>
      {/* Time Range Buttons */}
      <div className="monitoring-toolbar-segments">
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`monitoring-toolbar-segment ${
              timeRange === option.value && !hasCustomPeriod ? 'monitoring-toolbar-segment-active' : ''
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
          <div className="monitoring-toolbar-period-tag">
            <span 
              className="monitoring-toolbar-period-tag-text" 
              onClick={handlePeriodTextClick}
            >
              {formatDateForDisplay(customPeriod.start)}
              <span className="monitoring-toolbar-period-tag-divider">—</span>
              {formatDateForDisplay(customPeriod.end)}
            </span>
            <button 
              type="button"
              className="monitoring-toolbar-period-tag-close" 
              onClick={handleClearCustomPeriod}
              aria-label="Clear custom period"
            >
              <IconX size={12} stroke={2} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`monitoring-toolbar-period-btn ${showDatePicker ? 'monitoring-toolbar-period-btn-active' : ''}`}
            onClick={handleCustomPeriodClick}
          >
            <IconCalendar size={12} stroke={2} />
            <span>Period</span>
          </button>
        )}

        {/* Calendar Date Picker Dropdown */}
        {showDatePicker && (
          <div className="monitoring-toolbar-dropdown">
            {/* Date Range Header */}
            <div className="monitoring-toolbar-dropdown-header">
              <div
                className={`monitoring-toolbar-date-box ${selectingStart ? 'monitoring-toolbar-date-box-active' : ''}`}
                onClick={() => setSelectingStart(true)}
              >
                <span className="monitoring-toolbar-date-label">START</span>
                <span className="monitoring-toolbar-date-value">{formatDateForDisplay(tempStartDate)}</span>
              </div>
              <div className="monitoring-toolbar-date-separator">~</div>
              <div
                className={`monitoring-toolbar-date-box ${!selectingStart ? 'monitoring-toolbar-date-box-active' : ''}`}
                onClick={() => setSelectingStart(false)}
              >
                <span className="monitoring-toolbar-date-label">END</span>
                <span className="monitoring-toolbar-date-value">{formatDateForDisplay(tempEndDate)}</span>
              </div>
            </div>

            {/* DatePicker */}
            <DatePicker
              mode="range"
              rangeValue={{ start: tempStartDate, end: tempEndDate }}
              onRangeChange={handleRangeChange}
              maxDate={maxDate}
              minDate={minDate}
            />

            {/* Actions */}
            <div className="monitoring-toolbar-dropdown-actions">
              <button
                type="button"
                className="monitoring-toolbar-dropdown-cancel"
                onClick={() => setShowDatePicker(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="monitoring-toolbar-dropdown-apply"
                onClick={handleApplyCustomPeriod}
                disabled={!tempStartDate || !tempEndDate}
              >
                Apply
              </button>
            </div>
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
          <IconRefresh size={14} stroke={1.5} />
        </button>
      )}
    </div>
  );
};

export default MonitoringToolbar;

