import { createContext, useContext, useId, type ReactNode } from 'react';
import { customTwMerge as twMerge } from '../../utils/cn';

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
        className={twMerge('flex flex-col', className)}
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
      >
        {/* Group Label */}
        {/* Label ↔ Options: 12px, Label ↔ Description: 4px */}
        {label && (
          <legend
            id={labelId}
            className={`text-label-lg text-[var(--color-text-default)] ${description ? 'mb-[4px]' : 'mb-[12px]'}`}
          >
            {label}
          </legend>
        )}

        {/* Description */}
        {/* Description ↔ Options: 12px */}
        {/* Description uses text-body-md (12px/18px) */}
        {description && (
          <p id={descriptionId} className="text-body-md text-[var(--color-text-subtle)] mb-[12px]">
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
