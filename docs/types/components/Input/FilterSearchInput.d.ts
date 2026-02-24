import { InputHTMLAttributes } from 'react';
export type FilterSearchInputSize = 'sm' | 'md';
/** Filter field type - text for freeform input, select for predefined options */
export type FilterFieldType = 'text' | 'select';
/** Filter field definition */
export interface FilterField {
    /** Unique identifier for the filter */
    id: string;
    /** Display label */
    label: string;
    /** Type of filter - text input or select */
    type: FilterFieldType;
    /** Options for select type filters */
    options?: {
        value: string;
        label: string;
    }[];
    /** Placeholder text for text type filters */
    placeholder?: string;
}
/** Applied filter value */
export interface AppliedFilter {
    /** Unique ID for this applied filter instance */
    id: string;
    /** Field ID this filter applies to */
    fieldId: string;
    /** Field label for display */
    fieldLabel: string;
    /** Selected/entered value */
    value: string;
    /** Display label for the value (for select types) */
    valueLabel?: string;
}
export interface FilterSearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'value'> {
    /** Input size */
    size?: FilterSearchInputSize;
    /** Available filter fields */
    filters?: FilterField[];
    /** Currently applied filters */
    appliedFilters?: AppliedFilter[];
    /** Callback when filters change */
    onFiltersChange?: (filters: AppliedFilter[]) => void;
    /** Callback when a single filter is removed */
    onFilterRemove?: (filterId: string) => void;
    /** Callback when all filters are cleared */
    onFiltersClear?: () => void;
    /** Search value (for freeform search without filter) */
    searchValue?: string;
    /** Callback when search value changes */
    onSearchChange?: (value: string) => void;
    /** Full width */
    fullWidth?: boolean;
    /** Clear filters button label */
    clearFiltersLabel?: string;
    /** Hide applied filters display (useful when rendering filters externally) */
    hideAppliedFilters?: boolean;
}
export declare const FilterSearchInput: import('react').ForwardRefExoticComponent<FilterSearchInputProps & import('react').RefAttributes<HTMLInputElement>>;
export default FilterSearchInput;
