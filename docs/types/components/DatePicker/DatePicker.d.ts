import { default as React } from 'react';
export type DatePickerMode = 'single' | 'range';
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
    /** Custom class name */
    className?: string;
}
export declare const DatePicker: React.FC<DatePickerProps>;
export default DatePicker;
