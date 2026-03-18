import { memo, useState, useCallback, type ChangeEvent } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Checkbox } from '../Checkbox/Checkbox';
import { Badge, type BadgeTheme, type BadgeType } from '../Badge/Badge';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ChecklistItem {
  id: string;
  label: string;
  checked?: boolean;
  badge?: {
    text: string;
    theme?: BadgeTheme;
    type?: BadgeType;
  };
}

export interface ExpandableChecklistProps {
  /** Header label (parent checkbox) */
  label: string;
  /** Optional description below header label */
  description?: string;
  /** Optional badge for the header */
  badge?: {
    text: string;
    theme?: BadgeTheme;
    type?: BadgeType;
  };
  /** Child checklist items */
  items: ChecklistItem[];
  /** Called when any item's checked state changes */
  onChange?: (items: ChecklistItem[]) => void;
  /** Whether the list is initially expanded */
  defaultExpanded?: boolean;
  /** Additional class name */
  className?: string;
}

/* ----------------------------------------
   ExpandableChecklist Component
   ---------------------------------------- */

export const ExpandableChecklist = memo(function ExpandableChecklist({
  label,
  description,
  badge,
  items,
  onChange,
  defaultExpanded = false,
  className = '',
}: ExpandableChecklistProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const allChecked = items.length > 0 && items.every((item) => item.checked);
  const someChecked = items.some((item) => item.checked) && !allChecked;

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleHeaderCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const updated = items.map((item) => ({ ...item, checked: e.target.checked }));
      onChange?.(updated);
    },
    [items, onChange]
  );

  const handleItemCheck = useCallback(
    (id: string, e: ChangeEvent<HTMLInputElement>) => {
      const updated = items.map((item) =>
        item.id === id ? { ...item, checked: e.target.checked } : item
      );
      onChange?.(updated);
    },
    [items, onChange]
  );

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] ${className}`}
    >
      {/* Header */}
      <div
        className={`flex items-center bg-[var(--color-surface-default)]${expanded ? ' border-b border-[var(--color-border-default)]' : ''}`}
      >
        <div className="flex flex-1 flex-col gap-0.5 px-3 py-2 min-h-[40px] justify-center">
          {/* Row 1: Chevron + Checkbox + Badge */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleExpand}
              className="flex items-center justify-center shrink-0 size-3 text-[var(--color-text-muted)]"
              aria-expanded={expanded}
            >
              <IconChevronRight
                size={12}
                stroke={1.5}
                className={`transition-transform duration-[var(--duration-fast)] ${expanded ? 'rotate-90' : ''}`}
              />
            </button>
            <Checkbox
              label={label}
              checked={allChecked}
              indeterminate={someChecked}
              onChange={handleHeaderCheck}
            />
            {badge && (
              <Badge size="sm" theme={badge.theme ?? 'green'} type={badge.type ?? 'subtle'}>
                {badge.text}
              </Badge>
            )}
          </div>
          {/* Row 2: Spacer(16px = icon 12 + gap 4) + Description */}
          {description && (
            <div className="flex items-center">
              <div className="shrink-0 w-4" />
              <span className="text-body-sm text-[var(--color-text-muted)]">{description}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1 border-b border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-8 py-2 last:border-b-0"
            >
              <Checkbox
                label={item.label}
                checked={item.checked ?? false}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemCheck(item.id, e)}
              />
              {item.badge && (
                <Badge
                  size="sm"
                  theme={item.badge.theme ?? 'green'}
                  type={item.badge.type ?? 'subtle'}
                >
                  {item.badge.text}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
