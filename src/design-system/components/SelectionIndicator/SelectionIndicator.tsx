import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
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
}

/* ----------------------------------------
   SelectionIndicator Component
   
   Note: For error states (e.g., required selection missing),
   use the InlineMessage component instead.
   ---------------------------------------- */

export function SelectionIndicator({
  selectedItems = [],
  onRemove,
  emptyText = 'No item selected',
  rightContent,
  removable = true,
  className,
  ...props
}: SelectionIndicatorProps) {
  const hasSelection = selectedItems.length > 0;

  return (
    <div
      className={twMerge(
        'flex flex-row items-center justify-between gap-4 w-full',
        'px-3 py-2',
        'rounded-[var(--table-row-radius)]',
        'min-h-[42px]',
        'bg-[var(--color-surface-subtle)]',
        className
      )}
      {...props}
    >
      {/* Selection chips or empty text */}
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
        ) : (
          <span className="text-[12px] text-[var(--color-text-muted)]">
            {emptyText}
          </span>
        )}
      </div>

      {/* Right side content */}
      {rightContent && (
        <div className="flex items-center shrink-0">
          {rightContent}
        </div>
      )}
    </div>
  );
}

