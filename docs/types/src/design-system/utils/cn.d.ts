import { ClassValue } from 'clsx';
/**
 * Custom tailwind-merge that understands our design-system typography utilities.
 * Without this, twMerge treats `text-body-sm` as a text-color class and strips it
 * when combined with `text-[color:var(--color-...)]`.
 */
export declare const twMerge: (...classLists: import('tailwind-merge').ClassNameValue[]) => string;
/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 *
 * @example
 * ```tsx
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * cn('text-sm', { 'font-bold': isBold })
 * ```
 */
export declare function cn(...inputs: ClassValue[]): string;
