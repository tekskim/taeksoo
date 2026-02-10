import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
  type ChangeEvent,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { Radio } from './Radio';

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

/** Option type for array-based usage (thaki-ui compatibility) */
export interface RadioOption {
  /** Option value */
  value: string;
  /** Option label */
  label: ReactNode;
  /** Option description */
  description?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Group label */
  label?: ReactNode;
  /** Description for the group */
  description?: ReactNode;
  /** Children (Radio components) - use this OR options */
  children?: ReactNode;
  /** Options array (thaki-ui compatible) - use this OR children */
  options?: RadioOption[];
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
  options,
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

  // Render content: either children or options-based Radio components
  const renderContent = () => {
    if (options && options.length > 0) {
      return options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
          disabled={option.disabled}
        />
      ));
    }
    return children;
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
        className={twMerge('flex flex-col gap-0', className)}
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
            className={`text-label-lg text-[var(--color-text-default)] ${description ? 'mb-[var(--primitive-spacing-1)]' : 'mb-[var(--primitive-spacing-3)]'}`}
          >
            {label}
          </legend>
        )}

        {/* Description */}
        {/* Description ↔ Options: 12px */}
        {/* Description uses text-body-md (12px/18px) */}
        {description && (
          <p
            id={descriptionId}
            className="text-body-md text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-3)]"
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
          {renderContent()}
        </div>

        {/* Error message — 8px gap from options */}
        {error && errorMessage && (
          <p
            id={errorId}
            role="alert"
            className="text-body-sm text-[var(--color-state-danger)] mt-[var(--primitive-spacing-2)]"
          >
            {errorMessage}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}
