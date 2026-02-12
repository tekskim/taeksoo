import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Custom tailwind-merge that understands our design system's
 * typography utility classes (text-heading-*, text-body-*, text-label-*).
 *
 * Without this, twMerge treats e.g. `text-body-sm` as a text-color class
 * and incorrectly removes it when paired with `text-[var(--color-*)]`.
 */
export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-heading-h1',
        'text-heading-h2',
        'text-heading-h3',
        'text-heading-h4',
        'text-heading-h5',
        'text-heading-h6',
        'text-heading-h7',
        'text-body-lg',
        'text-body-md',
        'text-body-sm',
        'text-body-xs',
        'text-label-lg',
        'text-label-md',
        'text-label-sm',
      ],
    },
  },
});

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
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
