import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from '../../utils/cn';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';

/* ----------------------------------------
   Context
   ---------------------------------------- */

interface DropdownContextValue {
  isOpen: boolean;
  selectedValue: string;
  focusedValue: string;
  onSelect: (value: string, label: string) => void;
  onFocus: (value: string) => void;
  registerOption: (value: string, label: string, disabled?: boolean) => void;
  unregisterOption: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown.Root');
  }
  return context;
};

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DropdownRootProps {
  /** Children (Dropdown.Select, Dropdown.ComboBox) */
  children: ReactNode;
  /** Controlled value */
  value?: string;
  /** Default value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
}

export interface DropdownSelectProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Placeholder text */
  placeholder?: string;
  /** Children (Dropdown.Option) */
  children: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Width */
  width?: 'sm' | 'md' | 'lg' | number;
}

export interface DropdownOptionProps extends HTMLAttributes<HTMLDivElement> {
  /** Option value */
  value: string;
  /** Option label (defaults to children) */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Children */
  children: ReactNode;
}

export type DropdownDividerProps = HTMLAttributes<HTMLDivElement>;

export interface DropdownGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Group label */
  label?: string;
  /** Children */
  children: ReactNode;
}

/* ----------------------------------------
   Dropdown.Root
   ---------------------------------------- */

export function DropdownRoot({
  children,
  value: controlledValue,
  defaultValue = '',
  onChange,
  disabled = false,
}: DropdownRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focusedValue, setFocusedValue] = useState('');
  const [options, setOptions] = useState<Map<string, { label: string; disabled?: boolean }>>(
    new Map()
  );

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;

  const registerOption = useCallback((value: string, label: string, disabled?: boolean) => {
    setOptions((prev) => {
      const next = new Map(prev);
      next.set(value, { label, disabled });
      return next;
    });
  }, []);

  const unregisterOption = useCallback((value: string) => {
    setOptions((prev) => {
      const next = new Map(prev);
      next.delete(value);
      return next;
    });
  }, []);

  const onSelect = useCallback(
    (value: string, _label: string) => {
      if (!isControlled) {
        setInternalValue(value);
      }
      onChange?.(value);
      setIsOpen(false);
    },
    [isControlled, onChange]
  );

  const onFocus = useCallback((value: string) => {
    setFocusedValue(value);
  }, []);

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        selectedValue,
        focusedValue,
        onSelect,
        onFocus,
        registerOption,
        unregisterOption,
      }}
    >
      <DropdownStateContext.Provider value={{ isOpen, setIsOpen, disabled, options }}>
        {children}
      </DropdownStateContext.Provider>
    </DropdownContext.Provider>
  );
}

/* ----------------------------------------
   Internal State Context
   ---------------------------------------- */

interface DropdownStateContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  disabled: boolean;
  options: Map<string, { label: string; disabled?: boolean }>;
}

const DropdownStateContext = createContext<DropdownStateContextValue | null>(null);

const useDropdownState = () => {
  const context = useContext(DropdownStateContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown.Root');
  }
  return context;
};

/* ----------------------------------------
   Dropdown.Select
   ---------------------------------------- */

export const DropdownSelect = forwardRef<HTMLButtonElement, DropdownSelectProps>(
  (
    {
      placeholder = 'Select an option',
      children,
      size = 'md',
      error = false,
      fullWidth = false,
      width = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const triggerId = `dropdown-trigger-${id}`;
    const listboxId = `dropdown-listbox-${id}`;

    const { selectedValue, focusedValue, onFocus } = useDropdownContext();
    const { isOpen, setIsOpen, disabled, options } = useDropdownState();

    const internalRef = useRef<HTMLButtonElement>(null);
    const triggerRef = (ref as React.RefObject<HTMLButtonElement>) || internalRef;
    const listboxRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    // Get selected label
    const selectedOption = options.get(selectedValue);
    const selectedLabel = selectedOption?.label;

    // Update dropdown position
    const updatePosition = useCallback(() => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }, [triggerRef]);

    const openDropdown = useCallback(() => {
      if (disabled) return;
      updatePosition();
      setIsOpen(true);
    }, [disabled, updatePosition, setIsOpen]);

    const closeDropdown = useCallback(() => {
      setIsOpen(false);
      triggerRef.current?.focus();
    }, [setIsOpen, triggerRef]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;

        const enabledOptions = Array.from(options.entries()).filter(([, opt]) => !opt.disabled);
        const currentIndex = enabledOptions.findIndex(([value]) => value === focusedValue);

        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (!isOpen) {
              openDropdown();
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (!isOpen) {
              openDropdown();
            } else {
              const nextIndex = currentIndex + 1;
              if (nextIndex < enabledOptions.length) {
                onFocus(enabledOptions[nextIndex][0]);
              }
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (isOpen) {
              const prevIndex = currentIndex - 1;
              if (prevIndex >= 0) {
                onFocus(enabledOptions[prevIndex][0]);
              }
            }
            break;
          case 'Escape':
            e.preventDefault();
            closeDropdown();
            break;
        }
      },
      [disabled, options, focusedValue, isOpen, openDropdown, closeDropdown, onFocus]
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
    }, [isOpen, closeDropdown, triggerRef]);

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

    // Width styles
    const widthStyles = {
      sm: 'w-[160px]',
      md: 'w-[240px]',
      lg: 'w-[360px]',
    };

    const getWidthClass = () => {
      if (fullWidth) return 'w-full';
      if (typeof width === 'number') return `w-[${width}px]`;
      return widthStyles[width];
    };

    // Size styles
    const sizeStyles = {
      sm: 'h-[var(--input-height-sm)] px-[var(--primitive-spacing-2)] text-body-sm',
      md: 'h-[var(--input-height-md)] px-[var(--select-padding-x)] text-body-md',
    };

    const triggerClasses = twMerge(
      'flex items-center justify-between gap-[var(--primitive-spacing-2)]',
      getWidthClass(),
      sizeStyles[size],
      'bg-[var(--select-bg)]',
      'border border-solid rounded-[var(--select-radius)]',
      'transition-colors duration-[var(--duration-fast)]',
      'cursor-pointer',
      error
        ? 'border-[var(--input-border-error)]'
        : isOpen
          ? 'border-[var(--select-border-focus)]'
          : 'border-[var(--select-border)]',
      disabled &&
        'bg-[var(--select-bg-disabled)] border-[var(--color-border-default)] cursor-not-allowed',
      className
    );

    const dropdownClasses = twMerge(
      'fixed z-[var(--z-popover)]',
      'bg-[var(--select-menu-bg)]',
      'border border-[var(--select-menu-border)]',
      'rounded-[var(--select-menu-radius)]',
      'shadow-[var(--select-menu-shadow)]',
      'overflow-hidden',
      'focus:outline-none',
      'py-[var(--primitive-spacing-1)]'
    );

    return (
      <>
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          disabled={disabled}
          onClick={() => (isOpen ? closeDropdown() : openDropdown())}
          onKeyDown={handleKeyDown}
          className={triggerClasses}
          {...props}
        >
          <span
            className={twMerge(
              'text-body-md truncate',
              selectedLabel ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-muted)]',
              disabled && 'text-[var(--color-text-subtle)]'
            )}
          >
            {selectedLabel ?? placeholder}
          </span>
          <IconChevronDown
            size={16}
            stroke={1.5}
            className={twMerge(
              'shrink-0 transition-transform duration-[var(--duration-fast)]',
              'text-[var(--color-text-default)]',
              isOpen && 'rotate-180',
              disabled && 'text-[var(--color-text-subtle)]'
            )}
          />
        </button>

        {isOpen &&
          createPortal(
            <div
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={triggerId}
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              className={dropdownClasses}
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
            >
              {children}
            </div>,
            document.body
          )}
      </>
    );
  }
);

DropdownSelect.displayName = 'Dropdown.Select';

/* ----------------------------------------
   Dropdown.Option
   ---------------------------------------- */

export function DropdownOption({
  value,
  label,
  disabled = false,
  children,
  className,
  ...props
}: DropdownOptionProps) {
  const { selectedValue, focusedValue, onSelect, onFocus, registerOption, unregisterOption } =
    useDropdownContext();

  const displayLabel = label ?? (typeof children === 'string' ? children : '');
  const isSelected = selectedValue === value;
  const isFocused = focusedValue === value;

  // Register option on mount
  useEffect(() => {
    registerOption(value, displayLabel, disabled);
    return () => unregisterOption(value);
  }, [value, displayLabel, disabled, registerOption, unregisterOption]);

  const handleClick = () => {
    if (!disabled) {
      onSelect(value, displayLabel);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      onFocus(value);
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={twMerge(
        'flex items-center justify-between',
        'px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]',
        'text-body-md',
        'cursor-pointer transition-colors duration-[var(--duration-fast)]',
        disabled
          ? 'text-[var(--color-text-subtle)] cursor-not-allowed'
          : isSelected
            ? 'bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)]'
            : isFocused
              ? 'bg-[var(--select-item-hover-bg)] text-[var(--color-text-default)]'
              : 'text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)]',
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <IconCheck size={14} className="shrink-0 text-[var(--select-item-selected-text)]" />
      )}
    </div>
  );
}

/* ----------------------------------------
   Dropdown.Divider
   ---------------------------------------- */

export function DropdownDivider({ className, ...props }: DropdownDividerProps) {
  return (
    <div
      role="separator"
      className={twMerge(
        'h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]',
        className
      )}
      {...props}
    />
  );
}

/* ----------------------------------------
   Dropdown.Group
   ---------------------------------------- */

export function DropdownGroup({ label, children, className, ...props }: DropdownGroupProps) {
  return (
    <div role="group" aria-label={label} className={className} {...props}>
      {label && (
        <div className="px-[var(--select-item-padding-x)] py-[var(--primitive-spacing-1)] text-label-sm text-[var(--color-text-subtle)]">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

/* ----------------------------------------
   Compound Export
   ---------------------------------------- */

export const Dropdown = {
  Root: DropdownRoot,
  Select: DropdownSelect,
  Option: DropdownOption,
  Divider: DropdownDivider,
  Group: DropdownGroup,
};

export default Dropdown;
