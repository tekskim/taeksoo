import { forwardRef, useRef, useEffect, type TextareaHTMLAttributes } from 'react';
import { customTwMerge as twMerge } from '../../utils/cn';

/* ----------------------------------------
   Textarea Types
   ---------------------------------------- */

export type TextareaVariant = 'default' | 'code';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'children'
> {
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
  /** Resize behavior */
  resize?: TextareaResize;
  /** Auto-resize based on content */
  autoResize?: boolean;
  /** Minimum rows (when autoResize is true) */
  minRows?: number;
  /** Maximum rows (when autoResize is true) */
  maxRows?: number;

  // thaki-ui compatibility
  /** @deprecated Use error for validation */
  success?: boolean;
  /** @deprecated Use autoResize instead */
  autosize?: boolean;
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
      resize = 'vertical',
      autoResize = false,
      minRows = 3,
      maxRows,
      success,
      autosize,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // thaki-ui compatibility: autosize -> autoResize
    const shouldAutoResize = autoResize || autosize;

    // Dev warnings for deprecated props
    if (process.env.NODE_ENV === 'development') {
      if (success) {
        console.warn('[Textarea] success prop is deprecated. Use error={false} for valid state.');
      }
      if (autosize) {
        console.warn('[Textarea] autosize prop is deprecated. Use autoResize instead.');
      }
    }

    // Calculate character count
    const currentLength = String(value ?? defaultValue ?? '').length;

    // Auto-resize functionality
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea || !shouldAutoResize) return;

      // Reset height to calculate scrollHeight properly
      textarea.style.height = 'auto';

      // Calculate line height (approximate)
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
      const paddingY =
        parseInt(getComputedStyle(textarea).paddingTop) +
          parseInt(getComputedStyle(textarea).paddingBottom) || 16;

      const minHeight = lineHeight * minRows + paddingY;
      const maxHeight = maxRows ? lineHeight * maxRows + paddingY : Infinity;

      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    };

    useEffect(() => {
      if (shouldAutoResize) {
        adjustHeight();
      }
    }, [value, shouldAutoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (shouldAutoResize) {
        adjustHeight();
      }
    };

    // Resize styles
    const resizeStyles: Record<TextareaResize, string> = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

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
    const variantStyles: Record<TextareaVariant, string> = {
      default: 'rounded-[var(--input-radius)]',
      code: 'rounded-[var(--input-radius-code)] font-mono',
    };

    // Border color based on state
    const getBorderColor = () => {
      if (error) return 'border-[var(--input-border-error)]';
      if (success) return 'border-[var(--color-state-success)]';
      if (readOnly) return 'border-[var(--input-border-readonly)]';
      return 'border-[var(--input-border)]';
    };

    // Disabled styles
    const disabledStyles = disabled
      ? 'bg-[var(--input-bg-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed border-transparent resize-none'
      : '';

    // ReadOnly styles
    const readOnlyStyles = readOnly && !disabled ? 'cursor-default' : '';

    const textareaClasses = twMerge(
      baseStyles.join(' '),
      focusStyles.join(' '),
      variantStyles[variant],
      getBorderColor(),
      disabledStyles,
      readOnlyStyles,
      !disabled && !shouldAutoResize && resizeStyles[resize],
      shouldAutoResize && 'resize-none overflow-hidden',
      className
    );

    const wrapperClasses = ['flex flex-col gap-2', fullWidth ? 'w-full' : 'w-fit'].join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className="text-label-lg text-[var(--color-text-default)]">
            {label}
            {required && <span className="text-[var(--color-state-danger)] ml-0.5">*</span>}
          </label>
        )}

        {/* Helper Text - below label */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-body-sm text-[var(--color-text-subtle)]">
            {helperText}
          </p>
        )}

        <div className="relative h-fit">
          <textarea
            ref={textareaRef}
            id={inputId}
            className={textareaClasses}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            rows={shouldAutoResize ? minRows : props.rows}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            onChange={handleChange}
            {...props}
          />

          {/* Character count */}
          {showCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-body-sm text-[var(--color-text-subtle)]">
              {currentLength}/{maxLength}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} className="text-body-sm text-[var(--color-state-danger)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
