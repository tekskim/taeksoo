import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRadioGroup } from './RadioGroup';

/* ----------------------------------------
   Radio Types
   ---------------------------------------- */

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Radio label */
  label?: ReactNode;
  /** Description text */
  description?: ReactNode;
  /** Radio value */
  value: string;
}

/* ----------------------------------------
   Radio Component
   ---------------------------------------- */

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      value,
      disabled: propDisabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;

    // Get context from RadioGroup if available
    const groupContext = useRadioGroup();
    const name = props.name ?? groupContext?.name;
    const disabled = propDisabled ?? groupContext?.disabled ?? false;
    const isChecked = groupContext ? groupContext.value === value : props.checked;
    const onChange = groupContext?.onChange ?? props.onChange;

    return (
      <div className={twMerge('flex flex-col gap-[var(--radio-description-gap)]', className)}>
        <label
          htmlFor={inputId}
          className={twMerge(
            'inline-flex items-center gap-[var(--radio-gap)] cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        >
          {/* Hidden native radio */}
          <input
            ref={ref}
            type="radio"
            id={inputId}
            name={name}
            value={value}
            checked={isChecked}
            disabled={disabled}
            onChange={onChange}
            aria-describedby={descriptionId}
            className="sr-only peer"
            {...props}
          />

          {/* Custom radio circle */}
          <span
            className={twMerge(
              'shrink-0',
              'w-[var(--radio-size)] h-[var(--radio-size)]',
              'rounded-full',
              'transition-all duration-[var(--duration-fast)]',
              // Border and background based on state
              disabled
                ? 'bg-[var(--radio-disabled-bg)]'
                : isChecked
                  ? 'border-[length:var(--radio-checked-border-width)] border-[var(--radio-checked-border)] bg-white'
                  : 'border-[length:var(--radio-border-width)] border-[var(--radio-border)] bg-white',
            )}
          />

          {/* Label */}
          {label && (
            <span
              className={twMerge(
                'text-[length:var(--radio-label-size)] leading-[var(--radio-label-line-height)] font-normal',
                disabled
                  ? 'text-[var(--radio-label-disabled)]'
                  : 'text-[var(--radio-label-color)]'
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
            className="text-[length:var(--radio-description-size)] leading-[var(--radio-description-line-height)] text-[var(--radio-description-color)] ml-[calc(var(--radio-size)+var(--radio-gap))]"
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

