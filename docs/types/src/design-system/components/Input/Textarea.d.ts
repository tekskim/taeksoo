import { TextareaHTMLAttributes } from 'react';
export type TextareaVariant = 'default' | 'code';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';
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
    /** Resize behavior */
    resize?: TextareaResize;
    /** Auto-resize based on content */
    autoResize?: boolean;
    /** Minimum rows (when autoResize is true) */
    minRows?: number;
    /** Maximum rows (when autoResize is true) */
    maxRows?: number;
    /** @deprecated Use error for validation */
    success?: boolean;
    /** @deprecated Use autoResize instead */
    autosize?: boolean;
}
export declare const Textarea: import('react').ForwardRefExoticComponent<TextareaProps & import('react').RefAttributes<HTMLTextAreaElement>>;
