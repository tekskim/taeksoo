import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md';
export type SelectMenuPlacement = 'top' | 'bottom' | 'auto';

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
  /** Size variant */
  size?: SelectSize;
  /** Menu placement direction */
  menuPlacement?: SelectMenuPlacement;
  /** Additional CSS classes */
  className?: string;
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
  menuPlacement = 'bottom',
  className = '',
}: SelectProps) {
  const id = useId();
  const triggerId = `select-trigger-${id}`;
  const listboxId = `select-listbox-${id}`;

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

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
    
    // For 'top' placement, position from bottom of viewport
    if (menuPlacement === 'top') {
      setDropdownStyle({
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        width: rect.width,
        maxHeight: rect.top - 16,
      });
    } else if (menuPlacement === 'auto') {
      // Auto: check available space
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      const estimatedHeight = options.length * 32 + 8;
      
      if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
        setDropdownStyle({
          bottom: window.innerHeight - rect.top + 4,
          left: rect.left,
          width: rect.width,
          maxHeight: spaceAbove,
        });
      } else {
        setDropdownStyle({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          maxHeight: spaceBelow,
        });
      }
    } else {
      // Default: bottom
      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        maxHeight: window.innerHeight - rect.bottom - 16,
      });
    }
  }, [menuPlacement, options.length]);

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
  const selectOption = useCallback((option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    closeDropdown();
  }, [isControlled, onChange, closeDropdown]);

  // Keyboard navigation
  const handleTriggerKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [disabled, openDropdown]);

  const handleListboxKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [enabledOptions, focusedIndex, selectOption, closeDropdown]);

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

  // Styles
  const wrapperClasses = twMerge(
    'flex flex-col gap-[var(--input-label-gap)]',
    fullWidth ? 'w-full' : 'w-fit',
  );

  // Size styles
  const sizeStyles = {
    sm: {
      trigger: 'h-[28px] px-2 text-[11px] leading-[16px] min-w-[60px] gap-1',
      item: 'px-2 py-1 text-[11px] leading-[16px]',
      icon: 14,
      checkIcon: 12,
    },
    md: {
      trigger: 'px-[var(--select-padding-x)] py-[var(--select-padding-y)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] min-w-[80px] gap-2',
      item: 'px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-[length:var(--select-item-font-size)] leading-[var(--select-item-line-height)]',
      icon: 16,
      checkIcon: 14,
    },
  };

  const currentSize = sizeStyles[size];

  const triggerClasses = twMerge(
    'flex items-center justify-between',
    'w-full',
    currentSize.trigger,
    'bg-[var(--select-bg)]',
    'border border-solid rounded-[var(--select-radius)]',
    'transition-colors duration-[var(--duration-fast)]',
    'cursor-pointer',
    // Border & ring for focus (prevents size change)
    error
      ? 'border-[var(--input-border-error)]'
      : isOpen
        ? 'border-[var(--select-border-focus)] ring-1 ring-[var(--select-border-focus)]'
        : 'border-[var(--select-border)]',
    // Disabled
    disabled && 'bg-[var(--select-bg-disabled)] border-[var(--color-border-default)] cursor-not-allowed',
    className
  );

  const dropdownClasses = twMerge(
    'fixed z-50',
    'bg-[var(--select-menu-bg)]',
    'border border-[var(--select-menu-border)]',
    'rounded-[var(--select-menu-radius)]',
    'shadow-[var(--select-menu-shadow)]',
    'overflow-y-auto',
    'focus:outline-none',
  );

  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label
          htmlFor={triggerId}
          className="font-medium text-[var(--color-text-default)] text-[length:var(--font-size-11)]"
        >
          {label}
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
            selectedOption
              ? 'text-[var(--color-text-default)]'
              : 'text-[var(--color-text-muted)]',
            disabled && 'text-[var(--color-text-subtle)]'
          )}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <IconChevronDown
          size={currentSize.icon}
          stroke={1.5}
          className={twMerge(
            'shrink-0 transition-transform duration-[var(--duration-fast)]',
            'text-[var(--color-text-default)]',
            isOpen && 'rotate-180',
            disabled && 'text-[var(--color-text-subtle)]'
          )}
        />
      </button>

      {/* Error */}
      {error && (
        <p className="text-[length:var(--font-size-11)] text-[var(--color-state-danger)]">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          {helperText}
        </p>
      )}

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
            style={dropdownStyle}
          >
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
                      const enabledIndex = enabledOptions.findIndex((o) => o.value === option.value);
                      setFocusedIndex(enabledIndex);
                    }
                  }}
                  className={twMerge(
                    'flex items-center justify-between',
                    currentSize.item,
                    'font-medium',
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
                          : 'text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)]',
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <IconCheck size={currentSize.checkIcon} className="shrink-0 text-[var(--select-item-selected-text)]" />
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

