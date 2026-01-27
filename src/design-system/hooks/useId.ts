import { useId as useReactId } from 'react';

/**
 * Hook to generate unique IDs for accessibility
 * Wraps React's useId with optional prefix support
 *
 * @example
 * ```tsx
 * function Input({ id: providedId }: { id?: string }) {
 *   const generatedId = useStableId('input');
 *   const id = providedId ?? generatedId;
 *
 *   return <input id={id} />;
 * }
 * ```
 */
export function useStableId(prefix?: string): string {
  const id = useReactId();
  return prefix ? `${prefix}-${id}` : id;
}

export default useStableId;
