import { InputHTMLAttributes } from 'react';
export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /** @deprecated Single size only (28px). Prop kept for backward compatibility. */
    size?: 'sm' | 'md';
    /** Label text */
    label?: string;
    /** Full width */
    fullWidth?: boolean;
    /** Show clear button when has value */
    clearable?: boolean;
    /** Callback when clear button is clicked */
    onClear?: () => void;
}
export declare const SearchInput: import('react').ForwardRefExoticComponent<SearchInputProps & import('react').RefAttributes<HTMLInputElement>>;
