import { TextareaHTMLAttributes } from 'react';
export type TextareaVariant = 'default' | 'code';
export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
    /** Textarea variant */
    variant?: TextareaVariant;
    /** Label text */
    label?: string;
    /** Helper text */
    helperText?: string;
    /** Error message */
    error?: string;
    /** Full width */
    fullWidth?: boolean;
    /** Show character count */
    showCount?: boolean;
    /** Max character count */
    maxLength?: number;
    /** Required field indicator */
    required?: boolean;
}
export declare const Textarea: import('react').ForwardRefExoticComponent<TextareaProps & import('react').RefAttributes<HTMLTextAreaElement>>;
