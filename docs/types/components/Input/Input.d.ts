import { InputHTMLAttributes, ReactNode } from 'react';
export type InputSize = 'sm' | 'md';
export type InputVariant = 'default' | 'search' | 'code';
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Input field size */
    size?: InputSize;
    /** Input variant */
    variant?: InputVariant;
    /** Label text */
    label?: string;
    /** Helper text */
    helperText?: string;
    /** Error message */
    error?: string;
    /** Full width */
    fullWidth?: boolean;
    /** Left icon/element */
    leftElement?: ReactNode;
    /** Right icon/element */
    rightElement?: ReactNode;
    /** Required field indicator */
    required?: boolean;
}
export declare const Input: import('react').ForwardRefExoticComponent<InputProps & import('react').RefAttributes<HTMLInputElement>>;
