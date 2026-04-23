import { default as React } from 'react';
export type ProgressBarVariant = 'default' | 'quota';
export type ThakiProgressBarVariant = 'success' | 'error' | 'warning';
export type ProgressBarStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
/** Configurable thresholds for status color transitions */
export interface StatusThresholds {
    /** Percentage at which to show warning color (default: 70) */
    warning: number;
    /** Percentage at which to show danger color (default: 90) */
    danger: number;
}
export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'color'> {
    /** Current value (Used) */
    value: number;
    /** Maximum value (Total), undefined = unlimited */
    max?: number;
    /** New/additional value to be added */
    newValue?: number;
    /** Variant */
    variant?: ProgressBarVariant;
    /** Label (e.g., "Instance") */
    label?: string;
    /** Show value text */
    showValue?: boolean;
    /** Error state */
    error?: boolean;
    /** Error message for tooltip */
    errorMessage?: string;
    /** Status text (e.g., "chunking") */
    statusText?: string;
    /** Custom status color (overrides default 'info') */
    status?: ProgressBarStatus;
    /** Size variant */
    size?: 'sm' | 'md';
    /** Custom thresholds for status color transitions.
     *  Default: { warning: 70, danger: 90 } */
    thresholds?: StatusThresholds;
    /** @deprecated thaki-ui compatibility - use status instead */
    thakiVariant?: ThakiProgressBarVariant;
    /** @deprecated thaki-ui compatibility - custom bar color */
    color?: string;
    /** @deprecated thaki-ui compatibility - custom pending bar color */
    pendingColor?: string;
}
/** Preset thresholds per app — all share the same default */
export declare const STATUS_THRESHOLDS: {
    compute: StatusThresholds;
    computeAdmin: StatusThresholds;
    storage: StatusThresholds;
    container: StatusThresholds;
    default: StatusThresholds;
};
export declare const ProgressBar: React.FC<ProgressBarProps>;
export default ProgressBar;
