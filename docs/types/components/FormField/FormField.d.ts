import { HTMLAttributes, ReactNode } from 'react';
export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
    /** Field ID - used to connect label with input */
    id?: string;
    /** Whether the field has an error */
    error?: boolean;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Whether the field is required */
    required?: boolean;
    /** Children elements */
    children: ReactNode;
}
export interface FormFieldLabelProps extends HTMLAttributes<HTMLLabelElement> {
    /** Label text */
    children: ReactNode;
    /** Whether to show required indicator */
    required?: boolean;
    /** Label size */
    size?: 'sm' | 'md';
}
export interface FormFieldHelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
    /** Helper text content */
    children: ReactNode;
}
export interface FormFieldErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
    /** Error message content */
    children: ReactNode;
}
export interface FormFieldControlProps extends HTMLAttributes<HTMLDivElement> {
    /** Control content (Input, Select, etc.) */
    children: ReactNode;
}
export declare const FormField: import('react').ForwardRefExoticComponent<FormFieldProps & import('react').RefAttributes<HTMLDivElement>> & {
    Label: import('react').ForwardRefExoticComponent<FormFieldLabelProps & import('react').RefAttributes<HTMLLabelElement>>;
    Control: import('react').ForwardRefExoticComponent<FormFieldControlProps & import('react').RefAttributes<HTMLDivElement>>;
    HelperText: import('react').ForwardRefExoticComponent<FormFieldHelperTextProps & import('react').RefAttributes<HTMLParagraphElement>>;
    ErrorMessage: import('react').ForwardRefExoticComponent<FormFieldErrorMessageProps & import('react').RefAttributes<HTMLParagraphElement>>;
};
