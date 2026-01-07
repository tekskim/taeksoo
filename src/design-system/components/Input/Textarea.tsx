import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

/* ----------------------------------------
   Textarea Types
   ---------------------------------------- */

export type TextareaVariant = 'default' | 'code';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Textarea variant */
  variant?: TextareaVariant;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Full width */
  fullWidth?: boolean;
  /** Show character count */
  showCount?: boolean;
  /** Max character count */
  maxLength?: number;
  /** Required field indicator */
  required?: boolean;
}

/* ----------------------------------------
   Textarea Component
   ---------------------------------------- */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      label,
      helperText,
      error,
      fullWidth = false,
      showCount = false,
      maxLength,
      className = '',
      id,
      disabled,
      readOnly,
      value,
      defaultValue,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate character count
    const currentLength = String(value ?? defaultValue ?? '').length;

    // Base styles
    const baseStyles = [
      'w-full',
      'min-h-[var(--textarea-min-height)]',
      'px-[var(--input-padding-x)]',
      'py-[var(--input-padding-y)]',
      'text-[length:var(--input-font-size)]',
      'leading-[var(--input-line-height)]',
      'bg-[var(--input-bg)]',
      'text-[var(--color-text-default)]',
      'border-[length:var(--input-border-width)]',
      'border-solid',
      'transition-all duration-[var(--duration-fast)]',
      'placeholder:text-[var(--color-text-subtle)]',
      'focus:outline-none',
      'resize-y',
    ];

    // Focus styles (not applied for readOnly)
    // Use box-shadow instead of border-width change to prevent text jumping
    const focusStyles = !readOnly ? [
      'focus:border-[var(--input-border-focus)]',
      'focus:shadow-[0_0_0_1px_var(--input-border-focus)]',
    ] : [];

    // Variant styles
    const variantStyles: Record<TextareaVariant, string> = {
      default: 'rounded-[var(--input-radius)]',
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
      ? 'bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed border-transparent resize-none'
      : '';

    // ReadOnly styles
    const readOnlyStyles = readOnly && !disabled
      ? 'cursor-default'
      : '';

    const textareaClasses = twMerge(
      baseStyles.join(' '),
      focusStyles.join(' '),
      variantStyles[variant],
      getBorderColor(),
      disabledStyles,
      readOnlyStyles,
      className
    );

    const wrapperClasses = [
      'flex flex-col gap-2',
      fullWidth ? 'w-full' : 'w-fit',
    ].join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-medium text-[var(--color-text-default)] text-[14px] leading-5"
          >
            {label}
            {required && (
              <span className="text-[var(--color-state-danger)] ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Helper Text - below label */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            {helperText}
          </p>
        )}

        <div className="relative h-fit">
          <textarea
            ref={ref}
            id={inputId}
            className={textareaClasses}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

