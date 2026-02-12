import { useState, useRef, useCallback, useEffect, type HTMLAttributes } from 'react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Current value (controlled) */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Show value label */
  showValue?: boolean;
  /** Format value for display */
  formatValue?: (value: number) => string;
  /** Aria label */
  'aria-label'?: string;
}

/* ----------------------------------------
   Slider Component
   ---------------------------------------- */

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  disabled = false,
  showValue = false,
  formatValue = (v) => String(v),
  className = '',
  'aria-label': ariaLabel = 'Slider',
  ...props
}: SliderProps) {
  // State
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Controlled vs Uncontrolled
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Calculate percentage
  const percentage = ((currentValue - min) / (max - min)) * 100;

  // Update value
  const updateValue = useCallback(
    (newValue: number) => {
      // Clamp and step
      const clampedValue = Math.min(max, Math.max(min, newValue));
      const steppedValue = Math.round(clampedValue / step) * step;

      if (!isControlled) {
        setInternalValue(steppedValue);
      }
      onChange?.(steppedValue);
    },
    [isControlled, min, max, step, onChange]
  );

  // Calculate value from mouse/touch position
  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return currentValue;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = (clientX - rect.left) / rect.width;
      return min + percentage * (max - min);
    },
    [min, max, currentValue]
  );

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      updateValue(getValueFromPosition(e.clientX));
    },
    [disabled, getValueFromPosition, updateValue]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return;
      updateValue(getValueFromPosition(e.clientX));
    },
    [isDragging, disabled, getValueFromPosition, updateValue]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      setIsDragging(true);
      updateValue(getValueFromPosition(e.touches[0].clientX));
    },
    [disabled, getValueFromPosition, updateValue]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || disabled) return;
      updateValue(getValueFromPosition(e.touches[0].clientX));
    },
    [isDragging, disabled, getValueFromPosition, updateValue]
  );

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = currentValue;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          newValue = currentValue + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          newValue = currentValue - step;
          break;
        case 'Home':
          e.preventDefault();
          newValue = min;
          break;
        case 'End':
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }
      updateValue(newValue);
    },
    [disabled, currentValue, step, min, max, updateValue]
  );

  // Global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      className={twMerge(
        'flex items-center gap-[var(--slider-gap)]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className={twMerge(
          'relative flex-1 h-[var(--slider-track-height)]',
          'bg-[var(--slider-track-bg)]',
          'rounded-[var(--slider-track-radius)]',
          !disabled && 'cursor-pointer'
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Fill */}
        <div
          className={twMerge(
            'absolute top-0 left-0 h-full',
            'bg-[var(--slider-fill-bg)]',
            'rounded-[var(--slider-track-radius)]',
            'transition-none'
          )}
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          className={twMerge(
            'absolute top-1/2',
            'w-[var(--slider-thumb-size)] h-[var(--slider-thumb-size)]',
            'bg-[var(--slider-thumb-bg)]',
            'border-[length:var(--slider-thumb-border-width)] border-solid border-[var(--slider-thumb-border)]',
            'rounded-full',
            'shadow-[var(--slider-thumb-shadow)]',
            'transition-shadow duration-[var(--duration-fast)]',
            !disabled &&
              'cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--slider-thumb-border)] focus:ring-offset-1',
            isDragging && !disabled && 'cursor-grabbing'
          )}
          style={{
            left: `calc(${percentage}% - 8px)`,
            marginTop: '-8px',
          }}
        />
      </div>

      {/* Value Display */}
      {showValue && (
        <span className="text-[length:var(--slider-value-font-size)] text-[var(--color-text-default)] font-medium min-w-[3ch] text-right">
          {formatValue(currentValue)}
        </span>
      )}
    </div>
  );
}
