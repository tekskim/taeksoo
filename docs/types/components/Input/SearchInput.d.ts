import { InputHTMLAttributes } from 'react';
export type SearchInputSize = 'sm' | 'md';
export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /** Input size */
    size?: SearchInputSize;
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
