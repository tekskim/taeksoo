import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { IconChevronDown, IconCheck, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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

/* ----------------------------------------
   Select Component
   ---------------------------------------- */

export function Select({
  options,
  placeholder = 'Select an option',
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  helperText,
  error,
  disabled = false,
  fullWidth = false,
  size = 'md',
  width = 'md',
  className = '',
  required = false,
  clearable = false,
  clearLabel = 'Clear',
}: SelectProps) {
  const id = useId();
  const triggerId = `select-trigger-${id}`;
  const listboxId = `select-listbox-${id}`;

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Refs
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Controlled vs Uncontrolled
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === currentValue);

  // Get enabled options for keyboard navigation
  const enabledOptions = options.filter((opt) => !opt.disabled);

  // Update dropdown position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  // Handle open/close
  const openDropdown = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setIsOpen(true);
    // Set focus to selected or first enabled option
    const selectedIndex = enabledOptions.findIndex((opt) => opt.value === currentValue);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [disabled, updatePosition, enabledOptions, currentValue]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  // Handle selection
  const selectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      if (!isControlled) {
        setInternalValue(option.value);
      }
      onChange?.(option.value);
      closeDropdown();
    },
    [isControlled, onChange, closeDropdown]
  );

  // Handle clear
  const handleClear = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.('');
      closeDropdown();
    },
    [isControlled, onChange, closeDropdown]
  );

  // Check if has value for clearable
  const hasValue = !!currentValue;

  // Keyboard navigation
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          e.preventDefault();
          openDropdown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          openDropdown();
          break;
      }
    },
    [disabled, openDropdown]
  );

  const handleListboxKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next >= enabledOptions.length ? 0 : next;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? enabledOptions.length - 1 : next;
          });
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && enabledOptions[focusedIndex]) {
            selectOption(enabledOptions[focusedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeDropdown();
          break;
        case 'Tab':
          closeDropdown();
          break;
      }
    },
    [enabledOptions, focusedIndex, selectOption, closeDropdown]
  );

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        listboxRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      closeDropdown();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeDropdown]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  // Focus listbox when opened
  useEffect(() => {
    if (isOpen && listboxRef.current) {
      listboxRef.current.focus();
    }
  }, [isOpen]);

  // Width-based styles: xs (80px), sm (160px), md (240px), lg (320px), half (50%), full (100%)
  const widthStyles = {
    xs: 'w-[80px]',
    sm: 'w-[160px]',
    md: 'w-[240px]',
    lg: 'w-[320px]',
    half: 'w-1/2',
    full: 'w-full',
  };

  // Get width class or style
  const getWidthClass = () => {
    if (fullWidth) return 'w-full'; // backward compatibility
    if (typeof width === 'number') return `w-[${width}px]`;
    return widthStyles[width];
  };

  // Styles
  const wrapperClasses = twMerge('flex flex-col gap-[var(--input-label-gap)]', getWidthClass());

  // Size-based styles (height) - aligned with Input component
  const sizeStyles = {
    sm: 'h-[var(--input-height-sm)] pl-2 pr-2 text-body-sm leading-4',
    md: 'h-[var(--input-height-md)] pl-[var(--select-padding-x)] pr-2 text-[length:var(--select-font-size)] leading-[var(--select-line-height)]',
  };

  const triggerClasses = twMerge(
    'flex items-center justify-between gap-2',
    'w-full',
    sizeStyles[size],
    'bg-[var(--select-bg)]',
    'border border-solid rounded-[var(--select-radius)]',
    'transition-all duration-[var(--duration-fast)]',
    'cursor-pointer',
    // Border color based on state
    error
      ? 'border-[var(--input-border-error)]'
      : isOpen
        ? 'border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)]'
        : 'border-[var(--select-border)]',
    // Focus state (keyboard navigation)
    !isOpen &&
      !error &&
      !disabled &&
      'focus:border-[var(--select-border-focus)] focus:shadow-[0_0_0_1px_var(--select-border-focus)]',
    // Disabled
    disabled && 'bg-[var(--select-bg-disabled)] border-transparent cursor-not-allowed',
    className
  );

  const dropdownClasses = twMerge(
    'fixed z-[1300]',
    'bg-[var(--select-menu-bg)]',
    'border border-[var(--select-menu-border)]',
    'rounded-[var(--select-menu-radius)]',
    'shadow-[var(--select-menu-shadow)]',
    'overflow-hidden',
    'focus:outline-none'
  );

  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={triggerId} className="text-label-lg text-[var(--color-text-default)]">
          {label}
          {required && <span className="text-[var(--color-state-danger)] ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={!!error}
        disabled={disabled}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        className={triggerClasses}
      >
        <span
          className={twMerge(
            'text-body-md',
            selectedOption ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-muted)]',
            disabled && 'text-[var(--color-text-subtle)]'
          )}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {/* Clear button */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
              aria-label="Clear selection"
            >
              <IconX size={12} strokeWidth={2} />
            </button>
          )}
          <IconChevronDown
            size={16}
            stroke={1.5}
            className={twMerge(
              'transition-transform duration-[var(--duration-fast)]',
              'text-[var(--color-text-default)]',
              isOpen && 'rotate-180',
              disabled && 'text-[var(--color-text-subtle)]'
            )}
          />
        </div>
      </button>

      {/* Helper Text - below select */}
      {helperText && !error && (
        <p className="text-body-sm text-[var(--color-text-subtle)]">{helperText}</p>
      )}

      {/* Error */}
      {error && <p className="text-body-sm text-[var(--color-state-danger)]">{error}</p>}

      {/* Dropdown Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={triggerId}
            tabIndex={-1}
            onKeyDown={handleListboxKeyDown}
            className={dropdownClasses}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            {/* Clear option */}
            {clearable && (
              <div
                role="option"
                aria-selected={false}
                onClick={() => handleClear()}
                className={twMerge(
                  'flex items-center justify-between',
                  'px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]',
                  'text-body-md leading-[var(--select-item-line-height)]',
                  'cursor-pointer transition-colors duration-[var(--duration-fast)]',
                  'border-b border-[var(--color-border-subtle)]',
                  'text-[var(--color-text-muted)] hover:bg-[var(--select-item-hover-bg)] hover:text-[var(--color-text-default)]'
                )}
              >
                <span>{clearLabel}</span>
              </div>
            )}
            {options.map((option, index) => {
              const isSelected = option.value === currentValue;
              const isFocused = enabledOptions[focusedIndex]?.value === option.value;

              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => {
                    if (!option.disabled) {
                      const enabledIndex = enabledOptions.findIndex(
                        (o) => o.value === option.value
                      );
                      setFocusedIndex(enabledIndex);
                    }
                  }}
                  className={twMerge(
                    'flex items-center justify-between',
                    'px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]',
                    'text-body-md leading-[var(--select-item-line-height)]',
                    'cursor-pointer transition-colors duration-[var(--duration-fast)]',
                    // Border bottom (except last)
                    index < options.length - 1 && 'border-b border-[var(--color-border-subtle)]',
                    // States
                    option.disabled
                      ? 'text-[var(--color-text-subtle)] cursor-not-allowed'
                      : isSelected
                        ? 'bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)]'
                        : isFocused
                          ? 'bg-[var(--select-item-hover-bg)] text-[var(--color-text-default)]'
                          : 'text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)]'
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <IconCheck
                      size={14}
                      className="shrink-0 text-[var(--select-item-selected-text)]"
                    />
                  )}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
