import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type PasswordSize = 'sm' | 'md';

export interface PasswordProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Input size */
  size?: PasswordSize;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error state or message */
  error?: boolean | string;
  /** Full width mode */
  fullWidth?: boolean;
  /** Show password toggle by default */
  showToggle?: boolean;
  /** Custom toggle button aria label for show state */
  showLabel?: string;
  /** Custom toggle button aria label for hide state */
  hideLabel?: string;
  /** Additional CSS classes */
  className?: string;

  // thaki-ui compatibility
  /** @deprecated Use error for validation states */
  success?: boolean;
}

/* ----------------------------------------
   Styles
   ---------------------------------------- */

const sizes: Record<PasswordSize, string> = {
  sm: 'h-[var(--input-height-sm)] text-[length:var(--input-font-size-sm)]',
  md: 'h-[var(--input-height-md)] text-[length:var(--input-font-size)]',
};

/* ----------------------------------------
   Password Component
   ---------------------------------------- */

export const Password = forwardRef<HTMLInputElement, PasswordProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error,
      fullWidth = false,
      showToggle = true,
      showLabel = 'Show password',
      hideLabel = 'Hide password',
      className = '',
      id,
      disabled,
      readOnly,
      required = false,
      success,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const errorMessage = typeof error === 'string' ? error : undefined;

    // Dev warnings for deprecated props
    if (process.env.NODE_ENV === 'development') {
      if (success) {
        console.warn('[Password] success prop is deprecated. Use error={false} for valid state.');
      }
    }

    // Get border color based on state
    const getBorderColor = () => {
      if (hasError) return 'border-[var(--input-border-error)]';
      if (success) return 'border-[var(--color-state-success)]';
      if (readOnly) return 'border-[var(--input-border-readonly)]';
      return 'border-[var(--input-border)]';
    };

    // Wrapper classes
    const wrapperClasses = twMerge(
      'flex flex-col gap-[var(--input-label-gap)]',
      fullWidth ? 'w-full' : 'w-[var(--input-default-width)]'
    );

    // Input container classes
    const inputContainerClasses = twMerge(
      'flex items-center',
      'w-full',
      sizes[size],
      'px-[var(--input-padding-x)]',
      'bg-[var(--input-bg)]',
      'border rounded-[var(--input-radius)]',
      getBorderColor(),
      'transition-colors duration-[var(--duration-fast)]',
      // Focus-within styles
      'focus-within:border-[var(--input-border-focus)]',
      // Disabled styles
      disabled && 'bg-[var(--input-bg-disabled)] cursor-not-allowed',
      // Read-only styles
      readOnly && 'bg-[var(--input-bg-readonly)]'
    );

    // Input classes
    const inputClasses = twMerge(
      'flex-1 h-full',
      'bg-transparent',
      'border-none outline-none',
      'text-[var(--color-text-default)]',
      'placeholder:text-[var(--input-placeholder)]',
      disabled && 'text-[var(--color-text-subtle)] cursor-not-allowed',
      readOnly && 'cursor-default',
      className
    );

    // Toggle button classes
    const toggleClasses = twMerge(
      'flex items-center justify-center',
      'p-1 ml-2',
      'rounded',
      'text-[var(--color-text-muted)]',
      'hover:text-[var(--color-text-default)]',
      'hover:bg-[var(--color-surface-subtle)]',
      'transition-colors duration-[var(--duration-fast)]',
      'cursor-pointer',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]',
      (disabled || readOnly) && 'pointer-events-none opacity-50'
    );

    return (
      <div className={wrapperClasses}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="text-label-sm text-[var(--color-text-default)]">
            {label}
            {required && <span className="text-[var(--color-state-danger)] ml-0.5">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className={inputContainerClasses}>
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={inputClasses}
            {...props}
          />

          {/* Toggle Button */}
          {showToggle && (
            <button
              type="button"
              tabIndex={disabled || readOnly ? -1 : 0}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? hideLabel : showLabel}
              className={toggleClasses}
            >
              {showPassword ? (
                <IconEyeOff size={size === 'sm' ? 14 : 16} stroke={1.5} />
              ) : (
                <IconEye size={size === 'sm' ? 14 : 16} stroke={1.5} />
              )}
            </button>
          )}
        </div>

        {/* Helper Text */}
        {helperText && !hasError && (
          <p id={`${inputId}-helper`} className="text-body-sm text-[var(--color-text-subtle)]">
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p id={`${inputId}-error`} className="text-body-sm text-[var(--color-state-danger)]">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Password.displayName = 'Password';

export default Password;
