import { InputHTMLAttributes, ReactNode } from 'react';
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Radio label */
    label?: ReactNode;
    /** Description text */
    description?: ReactNode;
    /** Radio value */
    value: string;
    /** Children (alternative to label) */
    children?: ReactNode;
}
export declare const Radio: import('react').ForwardRefExoticComponent<RadioProps & import('react').RefAttributes<HTMLInputElement>>;
