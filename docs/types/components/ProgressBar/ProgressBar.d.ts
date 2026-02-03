import { default as React } from 'react';
export type ProgressBarVariant = 'default' | 'quota';
export type ProgressBarStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export interface ProgressBarProps {
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
    /** Custom class name */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'md';
}
export declare const ProgressBar: React.FC<ProgressBarProps>;
export default ProgressBar;
