import { ReactNode } from 'react';
interface CheckboxGroupContextValue {
    name?: string;
    disabled?: boolean;
    error?: boolean;
}
export declare const useCheckboxGroup: () => CheckboxGroupContextValue;
export interface CheckboxGroupProps {
    /** Group label */
    label?: ReactNode;
    /** Description for the group */
    description?: ReactNode;
    /** Children (Checkbox components) */
    children: ReactNode;
    /** Form field name */
    name?: string;
    /** Disable all checkboxes in group */
    disabled?: boolean;
    /** Error state for all checkboxes */
    error?: boolean;
    /** Error message */
    errorMessage?: string;
    /** Layout direction */
    direction?: 'vertical' | 'horizontal';
    /** Additional CSS classes */
    className?: string;
}
export declare function CheckboxGroup({ label, description, children, name, disabled, error, errorMessage, direction, className, }: CheckboxGroupProps): import("react/jsx-runtime").JSX.Element;
export {};
