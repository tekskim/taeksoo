import { ReactNode, ChangeEvent } from 'react';
interface RadioGroupContextValue {
    name: string;
    value?: string;
    disabled?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export declare const useRadioGroup: () => RadioGroupContextValue | null;
export interface RadioGroupProps {
    /** Group label */
    label?: ReactNode;
    /** Description for the group */
    description?: ReactNode;
    /** Children (Radio components) */
    children: ReactNode;
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
export declare function RadioGroup({ label, description, children, name, value: controlledValue, defaultValue, onChange, disabled, error, errorMessage, direction, className, }: RadioGroupProps): import("react/jsx-runtime").JSX.Element;
export {};
