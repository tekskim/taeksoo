import { InputHTMLAttributes } from 'react';
export type PasswordSize = 'sm' | 'md';
export interface PasswordProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    /** Input size */
    size?: PasswordSize;
    /** Label text */
    label?: string;
    /** Helper text */
    helperText?: string;
    /** Error state or message */
    error?: boolean | string;
    /** Full width mode */
    fullWidth?: boolean;
    /** Show password toggle by default */
    showToggle?: boolean;
    /** Custom toggle button aria label for show state */
    showLabel?: string;
    /** Custom toggle button aria label for hide state */
    hideLabel?: string;
    /** Additional CSS classes */
    className?: string;
    /** @deprecated Use error for validation states */
    success?: boolean;
}
export declare const Password: import('react').ForwardRefExoticComponent<PasswordProps & import('react').RefAttributes<HTMLInputElement>>;
export default Password;
