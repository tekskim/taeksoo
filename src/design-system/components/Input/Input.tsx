import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/* ----------------------------------------
   Input Types
   ---------------------------------------- */

export type InputSize = 'sm' | 'md';
export type InputVariant = 'default' | 'search' | 'code';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input field size */
  size?: InputSize;
  /** Input variant */
  variant?: InputVariant;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Full width */
  fullWidth?: boolean;
  /** Left icon/element */
  leftElement?: ReactNode;
  /** Right icon/element */
  rightElement?: ReactNode;
  /** Required field indicator */
  required?: boolean;
}

/* ----------------------------------------
   Size Styles (using design tokens)
   ---------------------------------------- */

const sizes: Record<InputSize, string> = {
  sm: 'h-[var(--input-height-sm)] text-[length:var(--input-font-size-sm)]',
  md: 'h-[var(--input-height-md)] text-[length:var(--input-font-size)]',
};

const labelSizes: Record<InputSize, string> = {
  sm: 'text-[14px] leading-5',
  md: 'text-[14px] leading-5',
};

/* ----------------------------------------
   Input Component
   ---------------------------------------- */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      label,
      helperText,
      error,
      fullWidth = false,
      leftElement,
      rightElement,
      className = '',
      id,
      disabled,
      readOnly,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base styles
    const baseInputStyles = [
      'w-full',
      'px-[var(--input-padding-x)]',
      'py-[var(--input-padding-y)]',
      'leading-[var(--line-height-20)]',
      'bg-[var(--input-bg)]',
      'text-[var(--color-text-default)]',
      'border-[length:var(--input-border-width)]',
      'border-solid',
      'transition-all duration-[var(--duration-fast)]',
      'placeholder:text-[var(--color-text-subtle)]',
      'focus:outline-none',
    ];

    // Focus styles (not applied for readOnly)
    // Use box-shadow instead of border-width change to prevent text jumping
    const focusStyles = !readOnly
      ? [
          'focus:border-[var(--input-border-focus)]',
          'focus:shadow-[0_0_0_1px_var(--input-border-focus)]',
        ]
      : [];

    // Variant styles
    const variantStyles: Record<InputVariant, string> = {
      default: 'rounded-[var(--input-radius)]',
      search: 'rounded-[var(--input-radius)]',
      code: 'rounded-[var(--input-radius-code)] font-mono',
    };

    // Border color based on state
    const getBorderColor = () => {
      if (error) return 'border-[var(--input-border-error)]';
      if (readOnly) return 'border-[var(--input-border-readonly)]';
      return 'border-[var(--input-border)]';
    };

    // Disabled styles
    const disabledStyles = disabled
      ? 'bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed border-transparent'
      : '';

    // ReadOnly styles
    const readOnlyStyles = readOnly && !disabled ? 'cursor-default' : '';

    const inputClasses = twMerge(
      baseInputStyles.join(' '),
      focusStyles.join(' '),
      sizes[size],
      variantStyles[variant],
      getBorderColor(),
      disabledStyles,
      readOnlyStyles,
      leftElement ? 'pl-8' : '',
      rightElement ? 'pr-8' : '',
      className
    );

    const wrapperClasses = ['flex flex-col gap-2', fullWidth ? 'w-full' : 'w-fit'].join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className={`font-medium text-[var(--color-text-default)] text-[14px] leading-5`}
          >
            {label}
            {required && <span className="text-[var(--color-state-danger)] ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {leftElement && (
            <div className="absolute left-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]">
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightElement && (
            <div className="absolute right-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]">
              {rightElement}
            </div>
          )}
        </div>

        {/* Helper Text - below input */}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[length:var(--font-size-11)] text-[var(--color-state-danger)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
