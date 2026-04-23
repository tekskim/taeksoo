import { InputHTMLAttributes } from 'react';
export type NumberInputWidth = 'xs' | 'sm' | 'md' | 'lg' | 'half' | 'full';
export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'defaultValue'> {
    /** @deprecated Use FormField with label prop instead: <FormField label="Count"><NumberInput /></FormField> */
    label?: string;
    /** @deprecated Use FormField with helperText prop instead: <FormField helperText="Help"><NumberInput /></FormField> */
    helperText?: string;
    /** Error state (boolean) or error message (string). Prefer boolean with FormField errorMessage prop */
    error?: string | boolean;
    /** @deprecated Use width="full" instead */
    fullWidth?: boolean;
    /** Width variant: xs (80px), sm (160px), md (240px), lg (360px), half (50%), full (100%), or number for custom pixel width */
    width?: NumberInputWidth | number;
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
    /** Suffix text displayed inside the input (e.g. "GiB", "GB", "%") */
    suffix?: string;
}
export declare const NumberInput: import('react').ForwardRefExoticComponent<NumberInputProps & import('react').RefAttributes<HTMLInputElement>>;
