import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../../services/utils/cn';
import { inputVariants } from './Input.styles';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value' | 'defaultValue' | 'size'
> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  hideSteppers?: boolean;
  suffix?: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      size = 'sm',
      error,
      min,
      max,
      step = 1,
      value: controlledValue,
      defaultValue,
      onChange,
      className,
      disabled,
      hideSteppers = false,
      suffix,
      style,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<number | undefined>(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;

    const clampValue = useCallback(
      (val: number) => {
        let clamped = val;
        if (min !== undefined && clamped < min) clamped = min;
        if (max !== undefined && clamped > max) clamped = max;
        return clamped;
      },
      [min, max]
    );

    const updateValue = useCallback(
      (newValue: number) => {
        const clamped = clampValue(newValue);
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onChange?.(clamped);
      },
      [isControlled, clampValue, onChange]
    );

    const increment = useCallback(() => {
      if (disabled) return;
      updateValue((currentValue ?? 0) + step);
    }, [disabled, currentValue, step, updateValue]);

    const decrement = useCallback(() => {
      if (disabled) return;
      updateValue((currentValue ?? 0) - step);
    }, [disabled, currentValue, step, updateValue]);

    const repeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const directionRef = useRef<'up' | 'down' | null>(null);
    const incrementRef = useRef(increment);
    const decrementRef = useRef(decrement);
    incrementRef.current = increment;
    decrementRef.current = decrement;

    const stopContinuousAction = useCallback(() => {
      if (repeatTimerRef.current) {
        clearTimeout(repeatTimerRef.current);
        repeatTimerRef.current = null;
      }
      if (repeatIntervalRef.current) {
        clearInterval(repeatIntervalRef.current);
        repeatIntervalRef.current = null;
      }
      directionRef.current = null;
    }, []);

    const startContinuousAction = useCallback(
      (direction: 'up' | 'down') => {
        stopContinuousAction();
        directionRef.current = direction;
        const fire = () => {
          if (directionRef.current === 'up') incrementRef.current();
          else if (directionRef.current === 'down') decrementRef.current();
        };
        fire();
        repeatTimerRef.current = setTimeout(() => {
          repeatIntervalRef.current = setInterval(fire, 60);
        }, 400);
      },
      [stopContinuousAction]
    );

    useEffect(() => stopContinuousAction, [stopContinuousAction]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') {
        if (!isControlled) {
          setInternalValue(undefined);
        }
        return;
      }
      const newValue = parseFloat(val);
      if (!isNaN(newValue)) {
        updateValue(newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        decrement();
      }
    };

    const stepperBtnClass = cn(
      'flex items-center justify-center',
      'w-5 h-[14px]',
      'rounded-sm',
      'text-[var(--semantic-color-textLight)]',
      'hover:text-[var(--semantic-color-text)]',
      'hover:bg-[var(--semantic-color-bgMuted)]',
      'active:bg-[var(--semantic-color-borderMuted)]',
      'transition-colors duration-150',
      disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'
    );

    const inputEl = (
      <div className={cn('relative', className)} style={style}>
        <input
          ref={ref}
          type="number"
          className={cn(
            inputVariants({ size, error, disabled }),
            hideSteppers ? '' : 'pr-8',
            '[appearance:textfield]',
            '[&::-webkit-outer-spin-button]:appearance-none',
            '[&::-webkit-inner-spin-button]:appearance-none'
          )}
          value={currentValue ?? ''}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          aria-invalid={error || undefined}
          {...props}
        />

        {!hideSteppers && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
            <button
              type="button"
              tabIndex={-1}
              className={stepperBtnClass}
              onPointerDown={() => startContinuousAction('up')}
              onPointerUp={stopContinuousAction}
              onPointerLeave={stopContinuousAction}
              disabled={
                disabled || (max !== undefined && currentValue !== undefined && currentValue >= max)
              }
              aria-label="Increase value"
            >
              <IconChevronUp size={12} strokeWidth={2} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className={stepperBtnClass}
              onPointerDown={() => startContinuousAction('down')}
              onPointerUp={stopContinuousAction}
              onPointerLeave={stopContinuousAction}
              disabled={
                disabled || (min !== undefined && currentValue !== undefined && currentValue <= min)
              }
              aria-label="Decrease value"
            >
              <IconChevronDown size={12} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    );

    if (suffix) {
      return (
        <div className="flex items-center gap-2 shrink-0">
          {inputEl}
          <span className="text-12 leading-18 text-text shrink-0">{suffix}</span>
        </div>
      );
    }

    return inputEl;
  }
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
