import { Children, type ReactNode, type HTMLAttributes } from 'react';
import { twMerge } from '../../utils/cn';
import { InfoBox } from '../InfoBox/InfoBox';
import type { StatusType } from '../StatusIndicator';

/* ----------------------------------------
   DetailHeader - Main Container
   ---------------------------------------- */

export interface DetailHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Child components */
  children: ReactNode;
}

export function DetailHeader({ children, className, ...props }: DetailHeaderProps) {
  return (
    <div
      data-figma-name="[TDS] DetailPageHeader"
      className={twMerge(
        'bg-[var(--color-surface-default)]',
        'border border-[var(--color-border-default)]',
        'rounded-lg',
        'px-4 pt-3 pb-3',
        'w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------
   DetailHeader.Title
   ---------------------------------------- */

export interface DetailHeaderTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Title text or children */
  children: ReactNode;
}

function DetailHeaderTitle({ children, className, ...props }: DetailHeaderTitleProps) {
  return (
    <h5
      data-figma-name="[TDS] DetailPageHeader/Title"
      className={twMerge('text-heading-h5', 'text-[var(--color-text-default)]', 'mb-3', className)}
      {...props}
    >
      {children}
    </h5>
  );
}

/* ----------------------------------------
   DetailHeader.Actions
   ---------------------------------------- */

export interface DetailHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Action buttons */
  children: ReactNode;
}

function DetailHeaderActions({ children, className, ...props }: DetailHeaderActionsProps) {
  return (
    <div
      data-figma-name="[TDS] DetailPageHeader/Actions"
      className={twMerge('flex items-center gap-1', 'mb-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------
   DetailHeader.InfoGrid
   ---------------------------------------- */

export interface DetailHeaderInfoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** InfoCard components */
  children: ReactNode;
}

/**
 * Get the row layout based on the number of cards.
 * | Cards | Layout       |
 * |-------|------------- |
 * | 1–4   | single row   |
 * | 5     | 3 / 2        |
 * | 6     | 4 / 2        |
 * | 7     | 4 / 3        |
 * | 8     | 4 / 4        |
 * | 9     | 4 / 3 / 2    |
 * | 10    | 4 / 4 / 2    |
 * | 11    | 4 / 4 / 3    |
 * | 12    | 4 / 4 / 4    |
 */
function getRowLayout(count: number): number[] {
  if (count <= 4) return [count];
  if (count === 5) return [3, 2];
  if (count === 6) return [4, 2];
  if (count === 7) return [4, 3];
  if (count === 8) return [4, 4];
  if (count === 9) return [4, 3, 2];
  if (count === 10) return [4, 4, 2];
  if (count === 11) return [4, 4, 3];
  if (count === 12) return [4, 4, 4];
  const rows: number[] = [];
  let remaining = count;
  while (remaining > 0) {
    rows.push(Math.min(4, remaining));
    remaining -= Math.min(4, remaining);
  }
  return rows;
}

function DetailHeaderInfoGrid({ children, className, ...props }: DetailHeaderInfoGridProps) {
  const childArray = Children.toArray(children);
  const count = childArray.length;
  const rowLayout = getRowLayout(count);

  if (rowLayout.length === 1) {
    return (
      <div
        data-figma-name="[TDS] DetailPageHeader/InfoGrid"
        className={twMerge('flex items-stretch gap-3', 'w-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  let index = 0;
  const rows = rowLayout.map((rowCount) => {
    const rowChildren = childArray.slice(index, index + rowCount);
    index += rowCount;
    return rowChildren;
  });

  return (
    <div
      data-figma-name="[TDS] DetailPageHeader/InfoGrid"
      className={twMerge('flex flex-col gap-3', 'w-full', className)}
      {...props}
    >
      {rows.map((rowChildren, rowIndex) => (
        <div key={rowIndex} className="flex items-stretch gap-3 w-full">
          {rowChildren}
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------
   DetailHeader.InfoCard
   Thin wrapper around InfoBox with flex-1
   ---------------------------------------- */

export interface DetailHeaderInfoCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Label for the info card */
  label: string;
  /** Value to display - can be string or ReactNode */
  value: ReactNode;
  /** Show copy button for the value (only works with string values) */
  copyable?: boolean;
  /** Show status indicator instead of value */
  status?: StatusType;
  /** Tooltip text for help icon next to label */
  tooltip?: string;
}

function DetailHeaderInfoCard({
  label,
  value,
  copyable = false,
  status,
  tooltip,
  className,
}: DetailHeaderInfoCardProps) {
  return (
    <InfoBox
      label={label}
      value={value}
      tooltip={tooltip}
      copyable={copyable}
      status={status}
      className={twMerge('flex-1', className)}
    />
  );
}

/* ----------------------------------------
   Compound Component Assembly
   ---------------------------------------- */

DetailHeader.Title = DetailHeaderTitle;
DetailHeader.Actions = DetailHeaderActions;
DetailHeader.InfoGrid = DetailHeaderInfoGrid;
DetailHeader.InfoCard = DetailHeaderInfoCard;

export { DetailHeaderTitle, DetailHeaderActions, DetailHeaderInfoGrid, DetailHeaderInfoCard };
