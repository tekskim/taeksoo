import { createContext, useContext, useId, useState, type ReactNode, type ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';

/* ----------------------------------------
   RadioGroup Context
   ---------------------------------------- */

interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => useContext(RadioGroupContext);

/* ----------------------------------------
   RadioGroup Types
   ---------------------------------------- */

export interface RadioGroupProps {
  /** Group label */
  label?: ReactNode;
  /** Description for the group */
  description?: ReactNode;
  /** Children (Radio components) */
  children: ReactNode;
  /** Form field name */
  name?: string;
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Disable all radios in group */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Additional CSS classes */
  className?: string;
}

/* ----------------------------------------
   RadioGroup Component
   ---------------------------------------- */

export function RadioGroup({
  label,
  description,
  children,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  direction = 'vertical',
  className = '',
}: RadioGroupProps) {
  const groupId = useId();
  const groupName = name ?? groupId;
  const labelId = label ? `${groupId}-label` : undefined;
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = errorMessage ? `${groupId}-error` : undefined;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Use controlled value if provided
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider
      value={{
        name: groupName,
        value: currentValue,
        disabled,
        onChange: handleChange,
      }}
    >
      <fieldset
        className={twMerge('flex flex-col gap-[var(--radio-group-gap)]', className)}
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
      >
        {/* Group Label */}
        {label && (
          <legend
            id={labelId}
            className="text-[length:var(--radio-group-label-size)] leading-[var(--radio-group-label-line-height)] font-medium text-[var(--color-text-default)] mb-[var(--radio-group-label-gap)]"
          >
            {label}
          </legend>
        )}

        {/* Description */}
        {description && (
          <p
            id={descriptionId}
            className="text-[length:var(--radio-description-size)] leading-[var(--radio-description-line-height)] text-[var(--radio-description-color)] -mt-2"
          >
            {description}
          </p>
        )}

        {/* Radios */}
        <div
          role="radiogroup"
          className={twMerge(
            'flex',
            direction === 'vertical'
              ? 'flex-col gap-[var(--radio-group-item-gap)]'
              : 'flex-row flex-wrap gap-[var(--radio-group-item-gap-horizontal)]'
          )}
        >
          {children}
        </div>

        {/* Error message */}
        {error && errorMessage && (
          <p
            id={errorId}
            role="alert"
            className="text-[length:var(--radio-error-size)] leading-[var(--radio-error-line-height)] text-[var(--radio-error-text)]"
          >
            {errorMessage}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}




