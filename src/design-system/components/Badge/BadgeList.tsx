import { memo, type ReactNode } from 'react';
import { Badge, type BadgeTheme, type BadgeType, type BadgeSize } from './Badge';
import { Popover } from '../Popover';

/* ----------------------------------------
   BadgeList Types
   ---------------------------------------- */

export interface BadgeListProps {
  /** Array of badge items to display */
  items: string[];
  /** Maximum number of badges to show before collapsing */
  maxVisible?: number;
  /** Max width per badge — enables truncation with ellipsis for long text (e.g. '120px') */
  maxBadgeWidth?: string;
  /** Badge size */
  size?: BadgeSize;
  /** Badge theme */
  theme?: BadgeTheme;
  /** Badge type */
  type?: BadgeType;
  /** Popover title when showing all items (default: auto-generated from count) */
  popoverTitle?: string;
  /** Custom render for each badge item */
  renderItem?: (item: string, index: number) => ReactNode;
}

/* ----------------------------------------
   BadgeList Component
   ---------------------------------------- */

export const BadgeList = memo(function BadgeList({
  items,
  maxVisible = 2,
  maxBadgeWidth,
  size = 'sm',
  theme,
  type,
  popoverTitle,
  renderItem,
}: BadgeListProps) {
  if (items.length === 0) return null;

  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  const renderBadge = (item: string, index: number, truncate?: boolean) =>
    renderItem ? (
      renderItem(item, index)
    ) : (
      <Badge
        key={index}
        size={size}
        theme={theme}
        type={type}
        className={truncate && maxBadgeWidth ? undefined : 'shrink-0'}
        style={truncate && maxBadgeWidth ? { maxWidth: maxBadgeWidth } : undefined}
        title={truncate && maxBadgeWidth ? item : undefined}
      >
        {truncate && maxBadgeWidth ? <span className="block truncate">{item}</span> : item}
      </Badge>
    );

  return (
    <div data-figma-name="BadgeList" className="flex flex-nowrap gap-1 items-center">
      {visibleItems.map((item, index) => renderBadge(item, index, true))}
      {remainingCount > 0 && (
        <Popover
          trigger="hover"
          position="top"
          delay={100}
          hideDelay={100}
          content={
            <div className="p-3 min-w-[120px] max-w-[320px] text-left">
              <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                {popoverTitle ?? `All items (${items.length})`}
              </div>
              <div className="flex flex-col gap-1">
                {items.map((item, index) => (
                  <Badge
                    key={index}
                    size={size}
                    theme={theme}
                    type={type}
                    className="w-fit max-w-full"
                  >
                    <span className="break-all">{item}</span>
                  </Badge>
                ))}
              </div>
            </div>
          }
        >
          <Badge theme="gray" type="subtle" size={size} className="shrink-0 cursor-pointer">
            +{remainingCount}
          </Badge>
        </Popover>
      )}
    </div>
  );
});
