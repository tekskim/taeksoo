import { ClassValue } from 'clsx';
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
