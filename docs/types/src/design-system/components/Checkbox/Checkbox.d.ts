import { InputHTMLAttributes, ReactNode } from 'react';
type ThakiOnChange = (checked: boolean) => void;
type StandardOnChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
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
    /** Change handler (supports both standard event and thaki-ui boolean signature) */
    onChange?: StandardOnChange | ThakiOnChange;
    /** Apply 2px top offset to checkbox box for multiline label alignment */
    multiline?: boolean;
}
export declare const Checkbox: import('react').ForwardRefExoticComponent<CheckboxProps & import('react').RefAttributes<HTMLInputElement>>;
export {};
