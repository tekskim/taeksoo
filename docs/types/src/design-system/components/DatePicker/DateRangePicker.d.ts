import { default as React } from 'react';
export interface DateRangePickerProps {
    /** Selected date range */
    value?: {
        start: Date | null;
        end: Date | null;
    };
    /** Callback on each selection step */
    onChange?: (range: {
        start: Date | null;
        end: Date | null;
    }) => void;
    /** Callback when Apply is clicked (both dates guaranteed non-null) */
    onApply?: (range: {
        start: Date;
        end: Date;
    }) => void;
    /** Callback when Cancel is clicked */
    onCancel?: () => void;
    /** Minimum selectable date */
    minDate?: Date;
    /** Maximum selectable date */
    maxDate?: Date;
    /** Custom class name */
    className?: string;
}
export declare const DateRangePicker: React.FC<DateRangePickerProps>;
export default DateRangePicker;
