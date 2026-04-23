import { default as React } from 'react';
export type DatePickerMode = 'single' | 'range';
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
    rangeValue?: {
        start: Date | null;
        end: Date | null;
    };
    /** Callback when date changes (single mode) */
    onChange?: (date: Date | null) => void;
    /** Callback when range changes (range mode) */
    onRangeChange?: (range: {
        start: Date | null;
        end: Date | null;
    }) => void;
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
    /** Show time selection (hour and minute) below calendar */
    showTime?: boolean;
    /** Time format: '24h' (default) or '12h' (with AM/PM selector) */
    timeFormat?: '24h' | '12h';
    /** Time input mode: 'stepper' (two NumberInputs) or 'inline' (single HH:MM text input) */
    timeInputMode?: 'stepper' | 'inline';
    /** Show Cancel / Apply buttons (auto-enabled when showTime is true) */
    showActions?: boolean;
    /** Callback when Apply is clicked */
    onApply?: (date: Date) => void;
    /** Callback when Cancel is clicked */
    onCancel?: () => void;
    /** Custom class name */
    className?: string;
    /** @deprecated thaki-ui compatibility - number of visible months */
    numberOfMonths?: number;
    /** @deprecated thaki-ui compatibility - loading state */
    isLoading?: boolean;
}
export declare const DatePicker: React.FC<DatePickerProps>;
export default DatePicker;
