import { forwardRef, type InputHTMLAttributes, useState, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { IconSearch, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   SearchInput Types
   ---------------------------------------- */

export type SearchInputSize = 'sm' | 'md';

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
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

/* ----------------------------------------
   Size Styles
   ---------------------------------------- */

const sizes: Record<SearchInputSize, string> = {
  sm: 'h-[var(--search-input-height-sm)] text-[length:var(--input-font-size-sm)]',
  md: 'h-[var(--search-input-height-md)] text-[length:var(--input-font-size-sm)]',
};

/* ----------------------------------------
   SearchInput Component
   ---------------------------------------- */

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size = 'md',
      label,
      fullWidth = false,
      clearable = true,
      onClear,
      className = '',
      id,
      disabled,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || `search-input-${Math.random().toString(36).substr(2, 9)}`;

    // Track value for clear button visibility
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = String(currentValue).length > 0;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (value === undefined) {
          setInternalValue(e.target.value);
        }
        onChange?.(e);
      },
      [value, onChange]
    );

    const handleClear = useCallback(() => {
      if (value === undefined) {
        setInternalValue('');
      }
      onClear?.();
    }, [value, onClear]);

    // Extract width-related and margin-related classes from className to apply to wrapper only
    const widthClassRegex = /\bw-\[?[^\s]+\]?/g;
    const marginClassRegex = /\b(m[tblrxy]?-\[?[^\s]+\]?)/g;
    const widthClasses = className.match(widthClassRegex) || [];
    const marginClasses = className.match(marginClassRegex) || [];
    const hasWidthClass = widthClasses.length > 0;

    // Remove width and margin classes from input className
    const inputClassName = className
      .replace(widthClassRegex, '')
      .replace(marginClassRegex, '')
      .trim();

    // Base styles - icons are on the right (search icon + optional clear button)
    const inputClasses = twMerge(
      'w-full',
      'pl-[var(--input-padding-x)]',
      // Extra padding when both clear button and search icon are shown
      clearable && hasValue && !disabled ? 'pr-14' : 'pr-8',
      'py-[var(--input-padding-y)]',
      'leading-[var(--input-line-height)]',
      'bg-[var(--input-bg)]',
      'text-[var(--color-text-default)]',
      'border-[length:var(--input-border-width)]',
      'border-solid',
      'border-[var(--input-border)]',
      'rounded-[var(--input-radius)]',
      'transition-all duration-[var(--duration-fast)]',
      'placeholder:text-[var(--color-text-subtle)]',
      'focus:outline-none',
      // Use box-shadow instead of border-width change to prevent text jumping
      'focus:border-[var(--input-border-focus)]',
      'focus:shadow-[0_0_0_1px_var(--input-border-focus)]',
      disabled
        ? 'bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed'
        : '',
      sizes[size],
      inputClassName
    );

    const wrapperClasses = twMerge(
      'flex flex-col gap-[var(--input-label-gap)]',
      // Default to w-full so the input fills its container
      fullWidth || !hasWidthClass ? 'w-full' : widthClasses.join(' '),
      marginClasses.join(' ')
    );

    return (
      <div className={wrapperClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-sm text-[var(--color-text-default)]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type="search"
            id={inputId}
            className={inputClasses}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            aria-label={label || 'Search'}
            {...props}
          />

          {/* Clear button - shown to the left of search icon when has value */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors duration-[var(--duration-fast)]"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <IconX size={12} strokeWidth={2} />
            </button>
          )}

          {/* Search icon - always visible on the right */}
          <div className="absolute right-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] pointer-events-none">
            <IconSearch size={12} strokeWidth={2} />
          </div>
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
