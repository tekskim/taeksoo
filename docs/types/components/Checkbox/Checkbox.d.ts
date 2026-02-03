import { InputHTMLAttributes, ReactNode } from 'react';
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Checkbox label */
    label?: ReactNode;
    /** Description text below label */
    description?: ReactNode;
    /** Indeterminate state (partially selected) */
    indeterminate?: boolean;
    /** Error state */
    error?: boolean;
    /** Error message */
    errorMessage?: string;
}
export declare const Checkbox: import('react').ForwardRefExoticComponent<CheckboxProps & import('react').RefAttributes<HTMLInputElement>>;
