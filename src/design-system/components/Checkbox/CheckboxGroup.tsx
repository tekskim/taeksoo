import { createContext, useContext, useId, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/* ----------------------------------------
   CheckboxGroup Context
   ---------------------------------------- */

interface CheckboxGroupContextValue {
  name?: string;
  disabled?: boolean;
  error?: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue>({});

export const useCheckboxGroup = () => useContext(CheckboxGroupContext);

/* ----------------------------------------
   CheckboxGroup Types
   ---------------------------------------- */

export interface CheckboxGroupProps {
  /** Group label */
  label?: ReactNode;
  /** Description for the group */
  description?: ReactNode;
  /** Children (Checkbox components) */
  children: ReactNode;
  /** Form field name */
  name?: string;
  /** Disable all checkboxes in group */
  disabled?: boolean;
  /** Error state for all checkboxes */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Additional CSS classes */
  className?: string;
}

/* ----------------------------------------
   CheckboxGroup Component
   ---------------------------------------- */

export function CheckboxGroup({
  label,
  description,
  children,
  name,
  disabled = false,
  error = false,
  errorMessage,
  direction = 'vertical',
  className = '',
}: CheckboxGroupProps) {
  const groupId = useId();
  const labelId = label ? `${groupId}-label` : undefined;
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = errorMessage ? `${groupId}-error` : undefined;

  return (
    <CheckboxGroupContext.Provider value={{ name, disabled, error }}>
      <fieldset
        className={twMerge('flex flex-col gap-[var(--checkbox-group-gap)]', className)}
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
      >
        {/* Group Label */}
        {label && (
          <legend
            id={labelId}
            className="text-[length:var(--checkbox-group-label-size)] leading-[var(--checkbox-group-label-line-height)] font-medium text-[var(--color-text-default)] mb-[var(--checkbox-group-label-gap)]"
          >
            {label}
          </legend>
        )}

        {/* Description */}
        {description && (
          <p
            id={descriptionId}
            className="text-[length:var(--checkbox-description-size)] leading-[var(--checkbox-description-line-height)] text-[var(--checkbox-description-color)] -mt-1"
          >
            {description}
          </p>
        )}

        {/* Checkboxes */}
        <div
          className={twMerge(
            'flex',
            direction === 'vertical'
              ? 'flex-col gap-[var(--checkbox-group-item-gap)]'
              : 'flex-row flex-wrap gap-[var(--checkbox-group-item-gap-horizontal)]'
          )}
        >
          {children}
        </div>

        {/* Error message */}
        {error && errorMessage && (
          <p
            id={errorId}
            role="alert"
            className="text-[length:var(--checkbox-error-size)] leading-[var(--checkbox-error-line-height)] text-[var(--checkbox-error-text)]"
          >
            {errorMessage}
          </p>
        )}
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
}
