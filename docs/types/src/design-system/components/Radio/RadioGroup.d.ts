import { ReactNode, ChangeEvent } from 'react';
interface RadioGroupContextValue {
    name: string;
    value?: string;
    disabled?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export declare const useRadioGroup: () => RadioGroupContextValue | null;
/** Option type for array-based usage (thaki-ui compatibility) */
export interface RadioOption {
    /** Option value */
    value: string;
    /** Option label */
    label: ReactNode;
    /** Option description */
    description?: ReactNode;
    /** Disabled state */
    disabled?: boolean;
}
export interface RadioGroupProps {
    /** Group label */
    label?: ReactNode;
    /** Description for the group */
    description?: ReactNode;
    /** Children (Radio components) - use this OR options */
    children?: ReactNode;
    /** Options array (thaki-ui compatible) - use this OR children */
    options?: RadioOption[];
    /** Form field name */
    name?: string;
    /** Controlled value */
    value?: string;
    /** Default value (uncontrolled) */
    defaultValue?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Disable all radios in group */
    disabled?: boolean;
    /** Error state */
    error?: boolean;
    /** Error message */
    errorMessage?: string;
    /** Layout direction */
    direction?: 'vertical' | 'horizontal';
    /** Additional CSS classes */
    className?: string;
}
export declare function RadioGroup({ label, description, children, options, name, value: controlledValue, defaultValue, onChange, disabled, error, errorMessage, direction, className, }: RadioGroupProps): import("react/jsx-runtime").JSX.Element;
export {};
