import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseControllableOptions<T> {
  /** Controlled value */
  value?: T;
  /** Default value for uncontrolled mode */
  defaultValue?: T;
  /** Callback when value changes */
  onChange?: (value: T) => void;
}

/**
 * Hook for managing controlled/uncontrolled component state
 *
 * @example
 * ```tsx
 * function Input({ value, defaultValue, onChange }: InputProps) {
 *   const [internalValue, setValue, isControlled] = useControllable({
 *     value,
 *     defaultValue: defaultValue ?? '',
 *     onChange,
 *   });
 *
 *   return <input value={internalValue} onChange={(e) => setValue(e.target.value)} />;
 * }
 * ```
 */
export function useControllable<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableOptions<T>): [T, (value: T) => void, boolean] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue as T);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Track if this is the first render to avoid calling onChange on mount
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  return [currentValue, setValue, isControlled];
}

export default useControllable;
