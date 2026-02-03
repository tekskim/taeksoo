import { HTMLAttributes } from 'react';
export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Current value (controlled) */
    value?: number;
    /** Default value (uncontrolled) */
    defaultValue?: number;
    /** Change handler */
    onChange?: (value: number) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Show value label */
    showValue?: boolean;
    /** Format value for display */
    formatValue?: (value: number) => string;
    /** Aria label */
    'aria-label'?: string;
}
export declare function Slider({ min, max, step, value: controlledValue, defaultValue, onChange, disabled, showValue, formatValue, className, 'aria-label': ariaLabel, ...props }: SliderProps): import("react/jsx-runtime").JSX.Element;
