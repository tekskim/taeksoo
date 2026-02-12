import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { customTwMerge as twMerge } from '../../utils/cn';

/* ----------------------------------------
   Input Types
   ---------------------------------------- */

export type InputSize = 'sm' | 'md';
// thaki-ui compatibility: support xs and lg sizes
export type InputSizeAlias = 'xs' | 'lg';
export type InputVariant = 'default' | 'search' | 'code';
export type InputWidth = 'xs' | 'sm' | 'md' | 'lg' | 'half' | 'full';

// thaki-ui compatibility types
type FilterProp = RegExp | ((value: string) => string);

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input field size (also accepts thaki-ui xs, lg) */
  size?: InputSize | InputSizeAlias;
  /** Input variant */
  variant?: InputVariant;
  /** @deprecated Use FormField with label prop instead: <FormField label="Name"><Input /></FormField> */
  label?: string;
  /** @deprecated Use FormField with helperText prop instead: <FormField helperText="Help"><Input /></FormField> */
  helperText?: string;
  /** Error state (boolean) or error message (string). Prefer boolean with FormField errorMessage prop */
  error?: string | boolean;
  /** @deprecated Use width="full" instead */
  fullWidth?: boolean;
  /** Width variant: xs (80px), sm (160px), md (240px), lg (320px), half (50%), full (100%), or number for custom pixel width */
  width?: InputWidth | number;
  /** Left icon/element */
  leftElement?: ReactNode;
  /** Right icon/element */
  rightElement?: ReactNode;
  /** Required field indicator */
  required?: boolean;
  /** @deprecated thaki-ui compatibility - success state (use error={false} instead) */
  success?: boolean;
  /** @deprecated thaki-ui compatibility - input filter (implement in onChange instead) */
  filter?: FilterProp;
  /** @deprecated thaki-ui compatibility - show password toggle (use type="password" with rightElement) */
  showPasswordToggle?: boolean;
}

/* ----------------------------------------
   Size Styles (using design tokens)
   ---------------------------------------- */

const sizes: Record<InputSize | InputSizeAlias, string> = {
  xs: 'h-6 text-body-sm', // thaki-ui compatibility
  sm: 'h-[var(--input-height-sm)] text-[length:var(--input-font-size-sm)]',
  md: 'h-[var(--input-height-md)] text-[length:var(--input-font-size)]',
  lg: 'h-10 text-body-lg', // thaki-ui compatibility
};

const labelSizes: Record<InputSize, string> = {
  sm: 'text-body-lg leading-5',
  md: 'text-body-lg leading-5',
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
      width,
      leftElement,
      rightElement,
      className = '',
      id,
      disabled,
      readOnly,
      required = false,
      // thaki-ui compatibility props (deprecated but supported)
      success,
      filter,
      showPasswordToggle,
      ...props
    },
    ref
  ) => {
    // thaki-ui compatibility: warn about deprecated props in development
    if (process.env.NODE_ENV === 'development') {
      if (filter)
        console.warn('[Input] filter prop is deprecated. Implement filtering in onChange handler.');
      if (showPasswordToggle)
        console.warn(
          '[Input] showPasswordToggle is deprecated. Use type="password" with a custom rightElement.'
        );
      if (success)
        console.warn('[Input] success prop is deprecated. Use error={false} for valid state.');
    }
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
      // thaki-ui compatibility: success state shows green border
      if (success) return 'border-[var(--color-state-success)]';
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

    // Width-based styles
    const widthStyles: Record<InputWidth, string> = {
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

    const wrapperClasses = twMerge(
      'flex flex-col gap-[var(--primitive-spacing-2)]',
      getWidthClass()
    );

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className={`text-label-lg text-[var(--color-text-default)]`}>
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
            <div className="absolute right-[var(--input-icon-offset)] top-1/2 -translate-y-1/2 flex items-center text-[var(--color-text-subtle)]">
              {rightElement}
            </div>
          )}
        </div>

        {/* Helper Text - below input */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-body-sm text-[var(--color-text-subtle)]">
            {helperText}
          </p>
        )}

        {typeof error === 'string' && error && (
          <p id={`${inputId}-error`} className="text-body-sm text-[var(--color-state-danger)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
