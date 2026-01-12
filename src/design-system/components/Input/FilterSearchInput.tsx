import { forwardRef, useState, useCallback, useRef, useEffect, type InputHTMLAttributes, type KeyboardEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import { IconSearch, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   FilterSearchInput Types
   ---------------------------------------- */

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
  options?: { value: string; label: string }[];
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

export interface FilterSearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'value'> {
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
}

/* ----------------------------------------
   Size Styles
   ---------------------------------------- */

const sizes: Record<FilterSearchInputSize, string> = {
  sm: 'h-[var(--search-input-height-sm)] text-[length:var(--input-font-size-sm)]',
  md: 'h-[var(--search-input-height-md)] text-[length:var(--input-font-size-sm)]',
};

/* ----------------------------------------
   Filter Tag Component
   ---------------------------------------- */

interface FilterTagProps {
  label: string;
  value: string;
  onRemove?: () => void;
}

function FilterTag({ label, value, onRemove }: FilterTagProps) {
  return (
    <div className="flex items-center gap-1 h-6 px-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded text-[11px]">
      <span className="text-[var(--color-text-default)] font-medium">{label}</span>
      <span className="text-[var(--color-text-subtle)]">{value}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <IconX size={10} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------
   Filter Dropdown Menu
   ---------------------------------------- */

interface FilterDropdownProps {
  filters: FilterField[];
  onFilterSelect: (filter: FilterField) => void;
  selectedFilter: FilterField | null;
  onOptionSelect: (option: { value: string; label: string }) => void;
  onBack: () => void;
  isOpen: boolean;
}

function FilterDropdown({ 
  filters, 
  onFilterSelect, 
  selectedFilter, 
  onOptionSelect,
  onBack,
  isOpen 
}: FilterDropdownProps) {
  if (!isOpen) return null;

  // Show options if a select-type filter is selected
  if (selectedFilter && selectedFilter.type === 'select' && selectedFilter.options) {
    return (
      <div className="absolute left-0 top-full mt-1 w-[200px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg z-50 overflow-hidden">
        <div className="px-3 py-2 text-[10px] font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]">
          {selectedFilter.label}
        </div>
        <div className="py-1">
          {selectedFilter.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onOptionSelect(option)}
              className="w-full px-3 py-2 text-left text-[13px] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="border-t border-[var(--color-border-subtle)]">
          <button
            type="button"
            onClick={onBack}
            className="w-full px-3 py-2 text-left text-[12px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            ← Back to filters
          </button>
        </div>
      </div>
    );
  }

  // Show filter list
  return (
    <div className="absolute left-0 top-full mt-1 w-[200px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="px-3 py-2 text-[10px] font-medium text-[var(--color-text-subtle)] uppercase tracking-wide border-b border-[var(--color-border-subtle)]">
        Filter by
      </div>
      <div className="py-1">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterSelect(filter)}
            className="w-full px-3 py-2 text-left text-[13px] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   FilterSearchInput Component
   ---------------------------------------- */

export const FilterSearchInput = forwardRef<HTMLInputElement, FilterSearchInputProps>(
  (
    {
      size = 'md',
      filters = [],
      appliedFilters = [],
      onFiltersChange,
      onFilterRemove,
      onFiltersClear,
      searchValue = '',
      onSearchChange,
      fullWidth = false,
      clearFiltersLabel = 'Clear Filters',
      className = '',
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<FilterField | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
          setSelectedFilter(null);
          setInputValue('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle input focus
    const handleFocus = useCallback(() => {
      setIsFocused(true);
      if (filters.length > 0) {
        setIsDropdownOpen(true);
      }
    }, [filters.length]);

    // Handle input blur
    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    // Handle filter selection
    const handleFilterSelect = useCallback((filter: FilterField) => {
      setSelectedFilter(filter);
      if (filter.type === 'text') {
        setInputValue('');
        inputRef.current?.focus();
      }
    }, []);

    // Handle option selection (for select type filters)
    const handleOptionSelect = useCallback((option: { value: string; label: string }) => {
      if (!selectedFilter) return;

      const newFilter: AppliedFilter = {
        id: `${selectedFilter.id}-${Date.now()}`,
        fieldId: selectedFilter.id,
        fieldLabel: selectedFilter.label,
        value: option.value,
        valueLabel: option.label,
      };

      const newFilters = [...appliedFilters, newFilter];
      onFiltersChange?.(newFilters);
      
      // Reset state
      setSelectedFilter(null);
      setInputValue('');
      setIsDropdownOpen(false);
    }, [selectedFilter, appliedFilters, onFiltersChange]);

    // Handle text input submission
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        if (selectedFilter && selectedFilter.type === 'text') {
          // Submit filter
          const newFilter: AppliedFilter = {
            id: `${selectedFilter.id}-${Date.now()}`,
            fieldId: selectedFilter.id,
            fieldLabel: selectedFilter.label,
            value: inputValue.trim(),
          };

          const newFilters = [...appliedFilters, newFilter];
          onFiltersChange?.(newFilters);
          
          // Reset state
          setSelectedFilter(null);
          setInputValue('');
          setIsDropdownOpen(false);
        } else if (!selectedFilter) {
          // Regular search
          onSearchChange?.(inputValue.trim());
        }
      } else if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setSelectedFilter(null);
        setInputValue('');
      } else if (e.key === 'Backspace' && inputValue === '' && selectedFilter) {
        // Go back to filter list
        setSelectedFilter(null);
      }
    }, [inputValue, selectedFilter, appliedFilters, onFiltersChange, onSearchChange]);

    // Handle input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (!selectedFilter && filters.length === 0) {
        onSearchChange?.(e.target.value);
      }
    }, [selectedFilter, filters.length, onSearchChange]);

    // Handle back button in dropdown
    const handleBack = useCallback(() => {
      setSelectedFilter(null);
    }, []);

    // Handle filter removal
    const handleFilterRemove = useCallback((filterId: string) => {
      onFilterRemove?.(filterId);
      const newFilters = appliedFilters.filter(f => f.id !== filterId);
      onFiltersChange?.(newFilters);
    }, [appliedFilters, onFilterRemove, onFiltersChange]);

    // Handle clear all filters
    const handleClearFilters = useCallback(() => {
      onFiltersClear?.();
      onFiltersChange?.([]);
    }, [onFiltersClear, onFiltersChange]);

    // Build placeholder text
    const getPlaceholder = () => {
      if (selectedFilter) {
        return selectedFilter.placeholder || `Enter ${selectedFilter.label.toLowerCase()}...`;
      }
      return placeholder || (filters.length > 0 ? 'Search by attributes' : 'Search...');
    };

    // Build input display value
    const getInputPrefix = () => {
      if (selectedFilter) {
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-surface-subtle)] rounded text-[11px] mr-1">
            <span className="font-medium text-[var(--color-text-default)]">{selectedFilter.label}</span>
            <span className="text-[var(--color-border-strong)]">|</span>
          </span>
        );
      }
      return null;
    };

    // Width classes
    const widthClassRegex = /\bw-\[?[^\s]+\]?/g;
    const widthClasses = className.match(widthClassRegex) || [];
    const hasWidthClass = widthClasses.length > 0;
    const inputClassName = className.replace(widthClassRegex, '').trim();

    const wrapperClasses = twMerge(
      'flex flex-col gap-2',
      fullWidth || !hasWidthClass ? 'w-full' : widthClasses.join(' '),
    );

    const inputContainerClasses = twMerge(
      'flex items-center gap-1',
      'w-full',
      'px-[var(--input-padding-x)]',
      'bg-[var(--input-bg)]',
      'border-[length:var(--input-border-width)]',
      'border-solid',
      'border-[var(--input-border)]',
      'rounded-[var(--input-radius)]',
      'transition-all duration-[var(--duration-fast)]',
      isFocused && 'border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]',
      disabled && 'bg-[var(--input-bg-disabled)] cursor-not-allowed',
      sizes[size],
      inputClassName
    );

    return (
      <div className={wrapperClasses} ref={containerRef}>
        {/* Input Container */}
        <div className="relative">
          <div className={inputContainerClasses}>
            {/* Filter prefix (when filter is selected) */}
            {getInputPrefix()}
            
            {/* Input field */}
            <input
              ref={(node) => {
                // Handle both refs
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
              }}
              type="text"
              className={twMerge(
                'flex-1 bg-transparent outline-none',
                'text-[var(--color-text-default)]',
                'placeholder:text-[var(--color-text-subtle)]',
                disabled && 'cursor-not-allowed'
              )}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              disabled={disabled}
              {...props}
            />

            {/* Search icon */}
            <div className="text-[var(--color-text-subtle)] pointer-events-none">
              <IconSearch size={12} strokeWidth={2} />
            </div>
          </div>

          {/* Filter Dropdown */}
          {filters.length > 0 && (
            <FilterDropdown
              filters={filters}
              onFilterSelect={handleFilterSelect}
              selectedFilter={selectedFilter}
              onOptionSelect={handleOptionSelect}
              onBack={handleBack}
              isOpen={isDropdownOpen && !disabled}
            />
          )}
        </div>

        {/* Applied Filters */}
        {appliedFilters.length > 0 && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {appliedFilters.map((filter) => (
                <FilterTag
                  key={filter.id}
                  label={filter.fieldLabel}
                  value={filter.valueLabel || filter.value}
                  onRemove={() => handleFilterRemove(filter.id)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[12px] text-[var(--color-action-primary)] hover:underline whitespace-nowrap"
            >
              {clearFiltersLabel}
            </button>
          </div>
        )}
      </div>
    );
  }
);

FilterSearchInput.displayName = 'FilterSearchInput';

export default FilterSearchInput;

