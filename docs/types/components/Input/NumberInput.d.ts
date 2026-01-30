import { InputHTMLAttributes } from 'react';
export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'defaultValue'> {
    /** Label text */
    label?: string;
    /** Helper text */
    helperText?: string;
    /** Error message */
    error?: string;
    /** Full width */
    fullWidth?: boolean;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step value */
    step?: number;
    /** Current value (controlled) */
    value?: number;
    /** Default value (uncontrolled) */
    defaultValue?: number;
    /** Change handler */
    onChange?: (value: number) => void;
    /** Hide stepper buttons */
    hideSteppers?: boolean;
}
export declare const NumberInput: import('react').ForwardRefExoticComponent<NumberInputProps & import('react').RefAttributes<HTMLInputElement>>;
