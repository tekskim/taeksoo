import { InputHTMLAttributes, ReactNode } from 'react';
export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Toggle label */
    label?: ReactNode;
    /** Description text */
    description?: ReactNode;
    /** Controlled checked state */
    checked?: boolean;
    /** Default checked state (uncontrolled) */
    defaultChecked?: boolean;
    /** Disabled state */
    disabled?: boolean;
}
export declare const Toggle: import('react').ForwardRefExoticComponent<ToggleProps & import('react').RefAttributes<HTMLInputElement>>;
