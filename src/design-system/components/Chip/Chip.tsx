import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type ChipVariant = 'default' | 'selected';

export interface ChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Label (category/field name) */
  label?: string;
  /** Value to display */
  value: string;
  /** Chip variant */
  variant?: ChipVariant;
  /** Show close button */
  onRemove?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Left icon */
  icon?: ReactNode;
}

/* ----------------------------------------
   Chip Component
   ---------------------------------------- */

export function Chip({
  label,
  value,
  variant = 'default',
  onRemove,
  disabled = false,
  icon,
  className = '',
  ...props
}: ChipProps) {
  const variantStyles = {
    default: 'border-[var(--chip-border)] pl-[var(--chip-padding-left)] pr-[var(--chip-padding-right)]',
    selected: 'border-[var(--chip-border-selected)] px-[var(--chip-padding-selected)]',
  };

  return (
    <div
      className={twMerge(
        'inline-flex items-center gap-[var(--chip-gap)]',
        'py-[var(--chip-padding-y)]',
        'bg-[var(--chip-bg)]',
        'border',
        'rounded-[var(--chip-radius)]',
        'text-[length:var(--chip-font-size)] leading-[var(--chip-line-height)]',
        'font-medium',
        variantStyles[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <span className="shrink-0 text-[var(--color-text-default)]">
          {icon}
        </span>
      )}

      {/* Label + Value */}
      <span className="flex items-center gap-1">
        {label && (
          <>
            <span className="text-[var(--color-text-default)]">{label}</span>
            <span className="text-[var(--chip-separator-color)]">|</span>
          </>
        )}
        <span className="text-[var(--color-text-default)]">{value}</span>
      </span>

      {/* Close Button */}
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          className={twMerge(
            'shrink-0 p-0.5 -mr-0.5',
            'text-[var(--color-text-default)]',
            'hover:text-[var(--color-text-muted)]',
            'rounded-sm',
            'transition-colors duration-[var(--duration-fast)]',
            'focus:outline-none focus:ring-1 focus:ring-[var(--color-border-focus)]',
          )}
          aria-label={`Remove ${label ? `${label}: ${value}` : value}`}
        >
          <IconX size={12} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

