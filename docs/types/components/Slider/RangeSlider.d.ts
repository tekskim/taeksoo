import { HTMLAttributes } from 'react';
export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Current value (controlled) - [min, max] */
    value?: [number, number];
    /** Default value (uncontrolled) */
    defaultValue?: [number, number];
    /** Change handler */
    onChange?: (value: [number, number]) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Aria label */
    'aria-label'?: string;
}
export declare function RangeSlider({ min, max, step, value: controlledValue, defaultValue, onChange, disabled, className, 'aria-label': ariaLabel, ...props }: RangeSliderProps): import("react/jsx-runtime").JSX.Element;
