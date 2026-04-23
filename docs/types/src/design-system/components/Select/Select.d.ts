import { ReactNode } from 'react';
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    /** Optional icon rendered before the label */
    icon?: ReactNode;
}
export interface SelectProps {
    /** Options to display */
    options: SelectOption[];
    /** Placeholder text */
    placeholder?: string;
    /** Current value (controlled) */
    value?: string;
    /** Default value (uncontrolled) */
    defaultValue?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** @deprecated Use FormField with label prop instead: <FormField label="Type"><Select /></FormField> */
    label?: string;
    /** @deprecated Use FormField with helperText prop instead: <FormField helperText="Help"><Select /></FormField> */
    helperText?: string;
    /** Error state (boolean) or error message (string). Prefer boolean with FormField errorMessage prop */
    error?: string | boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Full width */
    fullWidth?: boolean;
    /** Size variant (height) */
    size?: 'sm' | 'md';
    /** Width variant: xs (80px), sm (160px), md (240px), lg (320px), half (50%), full (100%), or number for custom pixel width */
    width?: 'xs' | 'sm' | 'md' | 'lg' | 'half' | 'full' | number;
    /** Additional CSS classes */
    className?: string;
    /** Required field indicator */
    required?: boolean;
    /** Show clear button when has value */
    clearable?: boolean;
    /** Text for clear option in dropdown */
    clearLabel?: string;
}
export declare function Select({ options, placeholder, value: controlledValue, defaultValue, onChange, label, helperText, error, disabled, fullWidth, size, width, className, required, clearable, clearLabel, }: SelectProps): import("react/jsx-runtime").JSX.Element;
