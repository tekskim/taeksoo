import { useState, useRef, useCallback, useEffect, type HTMLAttributes } from 'react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Current value (controlled) - [min, max] */
  value?: [number, number];
  /** Default value (uncontrolled) */
  defaultValue?: [number, number];
  /** Change handler */
  onChange?: (value: [number, number]) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Aria label */
  'aria-label'?: string;
}

/* ----------------------------------------
   RangeSlider Component
   ---------------------------------------- */

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = [25, 75],
  onChange,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Range Slider',
  ...props
}: RangeSliderProps) {
  // State
  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
  const [draggingThumb, setDraggingThumb] = useState<'min' | 'max' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Controlled vs Uncontrolled
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const [minValue, maxValue] = currentValue;

  // Calculate percentages
  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  // Update value
  const updateValue = useCallback(
    (newValue: [number, number]) => {
      // Clamp and step
      const clampedMin = Math.min(max, Math.max(min, newValue[0]));
      const clampedMax = Math.min(max, Math.max(min, newValue[1]));
      const steppedMin = Math.round(clampedMin / step) * step;
      const steppedMax = Math.round(clampedMax / step) * step;

      // Ensure min <= max
      const finalValue: [number, number] = [
        Math.min(steppedMin, steppedMax),
        Math.max(steppedMin, steppedMax),
      ];

      if (!isControlled) {
        setInternalValue(finalValue);
      }
      onChange?.(finalValue);
    },
    [isControlled, min, max, step, onChange]
  );

  // Calculate value from mouse/touch position
  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return min + percentage * (max - min);
    },
    [min, max]
  );

  // Determine which thumb to drag based on click position
  const getClosestThumb = useCallback(
    (value: number): 'min' | 'max' => {
      const distToMin = Math.abs(value - minValue);
      const distToMax = Math.abs(value - maxValue);
      return distToMin <= distToMax ? 'min' : 'max';
    },
    [minValue, maxValue]
  );

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, thumb?: 'min' | 'max') => {
      if (disabled) return;
      e.preventDefault();

      const value = getValueFromPosition(e.clientX);
      const activeThumb = thumb ?? getClosestThumb(value);
      setDraggingThumb(activeThumb);

      if (activeThumb === 'min') {
        updateValue([value, maxValue]);
      } else {
        updateValue([minValue, value]);
      }
    },
    [disabled, getValueFromPosition, getClosestThumb, updateValue, minValue, maxValue]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingThumb || disabled) return;

      const value = getValueFromPosition(e.clientX);
      if (draggingThumb === 'min') {
        updateValue([Math.min(value, maxValue), maxValue]);
      } else {
        updateValue([minValue, Math.max(value, minValue)]);
      }
    },
    [draggingThumb, disabled, getValueFromPosition, updateValue, minValue, maxValue]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingThumb(null);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, thumb?: 'min' | 'max') => {
      if (disabled) return;

      const value = getValueFromPosition(e.touches[0].clientX);
      const activeThumb = thumb ?? getClosestThumb(value);
      setDraggingThumb(activeThumb);

      if (activeThumb === 'min') {
        updateValue([value, maxValue]);
      } else {
        updateValue([minValue, value]);
      }
    },
    [disabled, getValueFromPosition, getClosestThumb, updateValue, minValue, maxValue]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!draggingThumb || disabled) return;

      const value = getValueFromPosition(e.touches[0].clientX);
      if (draggingThumb === 'min') {
        updateValue([Math.min(value, maxValue), maxValue]);
      } else {
        updateValue([minValue, Math.max(value, minValue)]);
      }
    },
    [draggingThumb, disabled, getValueFromPosition, updateValue, minValue, maxValue]
  );

  // Keyboard handler for thumbs
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, thumb: 'min' | 'max') => {
      if (disabled) return;

      let newValue: number;
      const currentThumbValue = thumb === 'min' ? minValue : maxValue;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          newValue = currentThumbValue + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          newValue = currentThumbValue - step;
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

      if (thumb === 'min') {
        updateValue([Math.min(newValue, maxValue), maxValue]);
      } else {
        updateValue([minValue, Math.max(newValue, minValue)]);
      }
    },
    [disabled, minValue, maxValue, step, min, max, updateValue]
  );

  // Global event listeners for dragging
  useEffect(() => {
    if (draggingThumb) {
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
  }, [draggingThumb, handleMouseMove, handleMouseUp, handleTouchMove]);

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
        onMouseDown={(e) => handleMouseDown(e)}
        onTouchStart={(e) => handleTouchStart(e)}
      >
        {/* Fill (between thumbs) */}
        <div
          className={twMerge(
            'absolute top-0 h-full',
            'bg-[var(--slider-fill-bg)]',
            'rounded-[var(--slider-track-radius)]',
            'transition-none'
          )}
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />

        {/* Min Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={`${ariaLabel} minimum`}
          aria-valuemin={min}
          aria-valuemax={maxValue}
          aria-valuenow={minValue}
          aria-disabled={disabled}
          onKeyDown={(e) => handleKeyDown(e, 'min')}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'min');
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouchStart(e, 'min');
          }}
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
            draggingThumb === 'min' && !disabled && 'cursor-grabbing',
            'z-10'
          )}
          style={{
            left: `calc(${minPercentage}% - 8px)`,
            marginTop: '-8px',
          }}
        />

        {/* Max Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={`${ariaLabel} maximum`}
          aria-valuemin={minValue}
          aria-valuemax={max}
          aria-valuenow={maxValue}
          aria-disabled={disabled}
          onKeyDown={(e) => handleKeyDown(e, 'max')}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'max');
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouchStart(e, 'max');
          }}
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
            draggingThumb === 'max' && !disabled && 'cursor-grabbing',
            'z-10'
          )}
          style={{
            left: `calc(${maxPercentage}% - 8px)`,
            marginTop: '-8px',
          }}
        />
      </div>
    </div>
  );
}
