import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { IconCircleX } from '@tabler/icons-react';
import { Chip } from '../Chip';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SelectionItem {
  /** Unique identifier for the item */
  id: string;
  /** Display label for the item */
  label: string;
}

export interface SelectionIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Selected items to display */
  selectedItems?: SelectionItem[];
  /** Callback when an item is removed */
  onRemove?: (id: string) => void;
  /** Text to show when no items are selected */
  emptyText?: string;
  /** Additional content to render on the right side */
  rightContent?: ReactNode;
  /** Whether to allow removing items */
  removable?: boolean;
  /** Whether to show error state */
  error?: boolean;
  /** Error message to display when in error state and no items selected */
  errorMessage?: string;
}

/* ----------------------------------------
   SelectionIndicator Component
   ---------------------------------------- */

export function SelectionIndicator({
  selectedItems = [],
  onRemove,
  emptyText = 'No item selected',
  rightContent,
  removable = true,
  error = false,
  errorMessage,
  className,
  ...props
}: SelectionIndicatorProps) {
  const hasSelection = selectedItems.length > 0;
  const showError = error && !hasSelection;

  return (
    <div
      className={twMerge(
        'flex flex-row items-center justify-between gap-4 w-full',
        'px-3 py-2',
        'rounded-[var(--table-row-radius)]',
        'min-h-[42px]',
        showError ? 'bg-[var(--inline-message-error-bg)]' : 'bg-[var(--color-surface-subtle)]',
        className
      )}
      role={showError ? 'status' : undefined}
      {...props}
    >
      {/* Selection chips, empty text, or error message */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasSelection ? (
          selectedItems.map((item) => (
            <Chip
              key={item.id}
              value={item.label}
              variant="selected"
              onRemove={removable && onRemove ? () => onRemove(item.id) : undefined}
            />
          ))
        ) : showError ? (
          <>
            <IconCircleX
              size={16}
              className="text-[var(--inline-message-error-icon)] shrink-0"
              strokeWidth={1.5}
            />
            <span className="text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)]">
              {errorMessage || emptyText}
            </span>
          </>
        ) : (
          <span className="text-body-md text-[var(--color-text-muted)]">{emptyText}</span>
        )}
      </div>

      {/* Right side content */}
      {rightContent && <div className="flex items-center shrink-0">{rightContent}</div>}
    </div>
  );
}
