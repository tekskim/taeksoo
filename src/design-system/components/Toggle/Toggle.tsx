import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   Toggle Types
   ---------------------------------------- */

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Toggle label */
  label?: ReactNode;
  /** Description text */
  description?: ReactNode;
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** @deprecated thaki-ui compatibility - label when checked */
  checkedLabel?: string;
  /** @deprecated thaki-ui compatibility - label when unchecked */
  uncheckedLabel?: string;
}

/* ----------------------------------------
   Toggle Component
   ---------------------------------------- */

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label: rawLabel,
      description,
      checked,
      defaultChecked,
      disabled = false,
      onChange,
      className = '',
      id,
      // thaki-ui compatibility props
      checkedLabel,
      uncheckedLabel,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;

    // Internal state for uncontrolled mode
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

    // Use controlled value if provided, otherwise use internal state
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    // thaki-ui compatibility: support checkedLabel/uncheckedLabel
    const label = rawLabel ?? (isChecked ? checkedLabel : uncheckedLabel);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      onChange?.(e);
    };

    return (
      <div className={twMerge('flex flex-col gap-[var(--toggle-description-gap)]', className)}>
        <label
          htmlFor={inputId}
          className={twMerge(
            'inline-flex items-center gap-[var(--toggle-gap)] cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        >
          {/* Hidden native checkbox */}
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            id={inputId}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            aria-checked={isChecked}
            aria-describedby={descriptionId}
            className="sr-only peer"
            {...props}
          />

          {/* Toggle track */}
          <span
            className={twMerge(
              'relative shrink-0',
              'w-[var(--toggle-width)] h-[var(--toggle-height)]',
              'rounded-[var(--toggle-radius)]',
              'transition-colors duration-[var(--duration-fast)]',
              // Background color based on state
              isChecked
                ? disabled
                  ? 'bg-[var(--toggle-checked-disabled-bg)]'
                  : 'bg-[var(--toggle-checked-bg)]'
                : disabled
                  ? 'bg-[var(--toggle-disabled-bg)]'
                  : 'bg-[var(--toggle-bg)]'
            )}
          >
            {/* Toggle thumb */}
            <span
              className={twMerge(
                'absolute top-[var(--toggle-padding)] left-[var(--toggle-padding)]',
                'w-[var(--toggle-thumb-size)] h-[var(--toggle-thumb-size)]',
                'rounded-full',
                'transition-transform duration-[var(--duration-fast)]',
                // Thumb color
                disabled ? 'bg-[var(--toggle-thumb-disabled)]' : 'bg-[var(--toggle-thumb)]',
                // Position based on state
                isChecked && 'translate-x-[var(--toggle-thumb-translate)]'
              )}
            />
          </span>

          {/* Label */}
          {label && (
            <span
              className={twMerge(
                'text-[length:var(--toggle-label-size)] leading-[var(--toggle-label-line-height)] font-normal',
                disabled
                  ? 'text-[var(--toggle-label-disabled)]'
                  : 'text-[var(--toggle-label-color)]'
              )}
            >
              {label}
            </span>
          )}
        </label>

        {/* Description */}
        {description && (
          <p
            id={descriptionId}
            className="text-[length:var(--toggle-description-size)] leading-[var(--toggle-description-line-height)] text-[var(--toggle-description-color)] ml-[calc(var(--toggle-width)+var(--toggle-gap))]"
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
