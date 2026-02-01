import { default as React } from 'react';
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
export declare const MonitoringToolbar: React.FC<MonitoringToolbarProps>;
export default MonitoringToolbar;
