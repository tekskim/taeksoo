export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
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
    /** Label text */
    label?: string;
    /** Helper text */
    helperText?: string;
    /** Error message */
    error?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Full width */
    fullWidth?: boolean;
    /** Size variant (height) */
    size?: 'sm' | 'md';
    /** Width variant: sm (160px), md (240px), lg (320px) */
    width?: 'sm' | 'md' | 'lg';
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
