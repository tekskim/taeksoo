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
    /** @deprecated thaki-ui compatibility - label when checked */
    checkedLabel?: string;
    /** @deprecated thaki-ui compatibility - label when unchecked */
    uncheckedLabel?: string;
}
export declare const Toggle: import('react').ForwardRefExoticComponent<ToggleProps & import('react').RefAttributes<HTMLInputElement>>;
