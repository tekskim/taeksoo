import { forwardRef, type InputHTMLAttributes, useState, useCallback } from 'react';
import { twMerge } from '../../utils/cn';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   NumberInput Types
   ---------------------------------------- */

export type NumberInputWidth = 'xs' | 'sm' | 'md' | 'lg' | 'half' | 'full';

export interface NumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue'
> {
  /** @deprecated Use FormField with label prop instead: <FormField label="Count"><NumberInput /></FormField> */
  label?: string;
  /** @deprecated Use FormField with helperText prop instead: <FormField helperText="Help"><NumberInput /></FormField> */
  helperText?: string;
  /** Error state (boolean) or error message (string). Prefer boolean with FormField errorMessage prop */
  error?: string | boolean;
  /** @deprecated Use width="full" instead */
  fullWidth?: boolean;
  /** Width variant: xs (80px), sm (160px), md (240px), lg (320px), half (50%), full (100%), or number for custom pixel width */
  width?: NumberInputWidth | number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step value */
  step?: number;
  /** Current value (controlled) */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Hide stepper buttons */
  hideSteppers?: boolean;
  /** Suffix text displayed inside the input (e.g. "GiB", "GB", "%") */
  suffix?: string;
}

/* ----------------------------------------
   NumberInput Component
   ---------------------------------------- */

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = false,
      width,
      min,
      max,
      step = 1,
      value: controlledValue,
      defaultValue,
      onChange,
      className = '',
      id,
      disabled,
      hideSteppers = false,
      suffix,
      ...props
    },
    ref
  ) => {
    const inputId = id || `number-input-${Math.random().toString(36).substr(2, 9)}`;

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<number | undefined>(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;

    // Clamp value within min/max bounds
    const clampValue = useCallback(
      (val: number) => {
        let clamped = val;
        if (min !== undefined && clamped < min) clamped = min;
        if (max !== undefined && clamped > max) clamped = max;
        return clamped;
      },
      [min, max]
    );

    // Update value
    const updateValue = useCallback(
      (newValue: number) => {
        const clamped = clampValue(newValue);
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onChange?.(clamped);
      },
      [isControlled, clampValue, onChange]
    );

    // Increment/Decrement handlers
    const increment = () => {
      if (disabled) return;
      updateValue((currentValue ?? 0) + step);
    };

    const decrement = () => {
      if (disabled) return;
      updateValue((currentValue ?? 0) - step);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') {
        if (!isControlled) {
          setInternalValue(undefined);
        }
        return;
      }
      const newValue = parseFloat(val);
      if (!isNaN(newValue)) {
        updateValue(newValue);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        decrement();
      }
    };

    // Base styles
    const inputClasses = twMerge(
      'w-full',
      'h-[var(--number-input-height)]',
      'pl-[var(--input-padding-x)]',
      hideSteppers ? 'pr-[var(--input-padding-x)]' : 'pr-8',
      'py-[var(--number-input-padding-y)]',
      'text-[length:var(--input-font-size)]',
      'leading-[var(--input-line-height)]',
      'bg-[var(--input-bg)]',
      'text-[var(--color-text-default)]',
      'border-[length:var(--input-border-width)]',
      'border-solid',
      'rounded-[var(--input-radius)]',
      'transition-all duration-[var(--duration-fast)]',
      'focus:outline-none',
      // Use box-shadow instead of border-width change to prevent text jumping
      'focus:border-[var(--input-border-focus)]',
      'focus:shadow-[0_0_0_1px_var(--input-border-focus)]',
      '[appearance:textfield]',
      '[&::-webkit-outer-spin-button]:appearance-none',
      '[&::-webkit-inner-spin-button]:appearance-none',
      error ? 'border-[var(--input-border-error)]' : 'border-[var(--input-border)]',
      disabled
        ? 'bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed'
        : ''
    );

    // Width-based styles
    const widthStyles: Record<NumberInputWidth, string> = {
      xs: 'w-[80px]',
      sm: 'w-[160px]',
      md: 'w-[240px]',
      lg: 'w-[320px]',
      half: 'w-1/2',
      full: 'w-full',
    };

    // Get width class
    const getWidthClass = () => {
      if (fullWidth) return 'w-full'; // backward compatibility
      if (width === undefined) return 'w-fit';
      if (typeof width === 'number') return `w-[${width}px]`;
      return widthStyles[width];
    };

    // Apply className to wrapper so width classes work correctly
    const wrapperClasses = twMerge(
      'flex flex-col gap-[var(--input-label-gap)]',
      getWidthClass(),
      className
    );

    const buttonClasses = [
      'flex items-center justify-center',
      'w-5 h-[14px]',
      'rounded-[var(--radius-sm)]',
      'text-[var(--color-text-subtle)]',
      'hover:text-[var(--color-text-default)]',
      'hover:bg-[var(--color-surface-muted)]',
      'active:bg-[var(--color-border-subtle)]',
      'transition-colors duration-[var(--duration-fast)]',
      disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
    ].join(' ');

    const coreElement = (
      <>
        {label && (
          <label htmlFor={inputId} className="text-label-lg text-[var(--color-text-default)]">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type="number"
            id={inputId}
            className={inputClasses}
            value={currentValue ?? ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Stepper buttons */}
          {!hideSteppers && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
              <button
                type="button"
                tabIndex={-1}
                className={buttonClasses}
                onClick={increment}
                disabled={
                  disabled ||
                  (max !== undefined && currentValue !== undefined && currentValue >= max)
                }
                aria-label="Increase value"
              >
                <IconChevronUp size={12} strokeWidth={2} />
              </button>
              <button
                type="button"
                tabIndex={-1}
                className={buttonClasses}
                onClick={decrement}
                disabled={
                  disabled ||
                  (min !== undefined && currentValue !== undefined && currentValue <= min)
                }
                aria-label="Decrease value"
              >
                <IconChevronDown size={12} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-body-sm text-[var(--color-state-danger)]">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-body-sm text-[var(--color-text-subtle)]">
            {helperText}
          </p>
        )}
      </>
    );

    if (suffix) {
      return (
        <div className={twMerge('flex items-center gap-[var(--primitive-spacing-2)]', className)}>
          <div className={wrapperClasses}>{coreElement}</div>
          <span className="text-body-md text-[var(--color-text-default)] shrink-0">{suffix}</span>
        </div>
      );
    }

    return <div className={wrapperClasses}>{coreElement}</div>;
  }
);

NumberInput.displayName = 'NumberInput';
