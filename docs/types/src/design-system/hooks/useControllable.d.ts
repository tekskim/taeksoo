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
export declare function useControllable<T>({ value: controlledValue, defaultValue, onChange, }: UseControllableOptions<T>): [T, (value: T) => void, boolean];
export default useControllable;
