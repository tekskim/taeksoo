import React, { useState, useCallback } from 'react';
import { DatePicker } from './DatePicker';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DateRangePickerProps {
  /** Selected date range */
  value?: { start: Date | null; end: Date | null };
  /** Callback on each selection step */
  onChange?: (range: { start: Date | null; end: Date | null }) => void;
  /** Callback when Apply is clicked (both dates guaranteed non-null) */
  onApply?: (range: { start: Date; end: Date }) => void;
  /** Callback when Cancel is clicked */
  onCancel?: () => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Custom class name */
  className?: string;
}

/* ----------------------------------------
   Helpers
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
   DateRangePicker Component
   ---------------------------------------- */

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  onApply,
  onCancel,
  minDate,
  maxDate,
  className = '',
}) => {
  const [tempStart, setTempStart] = useState<Date | null>(value?.start ?? null);
  const [tempEnd, setTempEnd] = useState<Date | null>(value?.end ?? null);
  const [selectingStart, setSelectingStart] = useState(true);

  const handleRangeChange = useCallback(
    (range: { start: Date | null; end: Date | null }) => {
      setTempStart(range.start);
      setTempEnd(range.end);
      setSelectingStart(!range.start || !!range.end);
      onChange?.(range);
    },
    [onChange]
  );

  const handleApply = useCallback(() => {
    if (tempStart && tempEnd) {
      onApply?.({ start: tempStart, end: tempEnd });
    }
  }, [tempStart, tempEnd, onApply]);

  const canApply = tempStart !== null && tempEnd !== null;

  return (
    <div
      className={`
        inline-flex flex-col gap-[var(--datepicker-gap)]
        p-[var(--datepicker-padding)]
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-default)]
        rounded-[var(--datepicker-radius)]
        w-fit
        ${className}
      `}
    >
      {/* Range Header */}
      <div className="flex items-center">
        <button
          type="button"
          className={`
            flex-1 flex flex-col
            py-[10px] px-[14px]
            rounded-[var(--radius-md)]
            border-none cursor-pointer
            transition-all duration-[var(--duration-fast)]
            ${
              selectingStart
                ? 'bg-[rgba(37,99,235,0.1)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]'
                : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
            }
          `}
          onClick={() => setSelectingStart(true)}
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3px] text-[var(--color-text-subtle)] mb-0.5">
            START
          </span>
          <span className="text-[13px] font-semibold leading-[18px] min-h-[18px] text-[var(--color-text-default)]">
            {formatDateForDisplay(tempStart)}
          </span>
        </button>

        <div className="px-2 text-[12px] text-[var(--color-text-subtle)]">~</div>

        <button
          type="button"
          className={`
            flex-1 flex flex-col
            py-[10px] px-[14px]
            rounded-[var(--radius-md)]
            border-none cursor-pointer
            transition-all duration-[var(--duration-fast)]
            ${
              !selectingStart
                ? 'bg-[rgba(37,99,235,0.1)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]'
                : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
            }
          `}
          onClick={() => setSelectingStart(false)}
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3px] text-[var(--color-text-subtle)] mb-0.5">
            END
          </span>
          <span className="text-[13px] font-semibold leading-[18px] min-h-[18px] text-[var(--color-text-default)]">
            {formatDateForDisplay(tempEnd)}
          </span>
        </button>
      </div>

      {/* Calendar (borderless) */}
      <DatePicker
        mode="range"
        rangeValue={{ start: tempStart, end: tempEnd }}
        onRangeChange={handleRangeChange}
        minDate={minDate}
        maxDate={maxDate}
        className="!border-0 !p-0"
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="
            flex-1
            h-[var(--button-height-sm)]
            text-[length:var(--button-font-size-sm)]
            leading-[var(--button-line-height-sm)]
            font-medium
            text-[var(--color-text-default)]
            bg-[var(--color-surface-default)]
            border border-[var(--color-border-strong)]
            rounded-[var(--button-radius)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--button-secondary-hover-bg)]
          "
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`
            flex-1
            h-[var(--button-height-sm)]
            text-[length:var(--button-font-size-sm)]
            leading-[var(--button-line-height-sm)]
            font-medium
            text-[var(--color-text-on-primary)]
            bg-[var(--color-action-primary)]
            rounded-[var(--button-radius)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--color-action-primary-hover)]
            ${!canApply ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={!canApply}
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
