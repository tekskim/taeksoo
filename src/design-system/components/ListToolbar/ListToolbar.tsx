import React from 'react';
import { customTwMerge as twMerge } from '../../utils/cn';
import { Chip } from '../Chip';
import { HStack } from '../../layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FilterItem {
  id: string;
  field: string;
  value: string;
}

export interface ListToolbarProps {
  /** Primary actions (left side) - typically search, download */
  primaryActions?: React.ReactNode;
  /** Bulk actions - actions for selected items */
  bulkActions?: React.ReactNode;
  /** Whether to show divider between primary and bulk actions */
  showDivider?: boolean;
  /** Active filters */
  filters?: FilterItem[];
  /** Callback when a filter is removed */
  onFilterRemove?: (id: string) => void;
  /** Callback when all filters are cleared */
  onFiltersClear?: () => void;
  /** Label for clear filters button */
  clearFiltersLabel?: string;
  /** Additional class name */
  className?: string;
  /** Children for custom content */
  children?: React.ReactNode;
}

/* ----------------------------------------
   Sub-components
   ---------------------------------------- */

export interface ListToolbarActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function ListToolbarActions({ children, className }: ListToolbarActionsProps) {
  return (
    <HStack gap={1} className={className}>
      {children}
    </HStack>
  );
}

export interface ListToolbarDividerProps {
  className?: string;
}

export function ListToolbarDivider({ className }: ListToolbarDividerProps) {
  return <div className={twMerge('h-4 w-px bg-[var(--color-border-default)]', className)} />;
}

export interface ListToolbarFiltersProps {
  filters: FilterItem[];
  onFilterRemove?: (id: string) => void;
  onFiltersClear?: () => void;
  clearFiltersLabel?: string;
  className?: string;
}

export function ListToolbarFilters({
  filters,
  onFilterRemove,
  onFiltersClear,
  clearFiltersLabel = 'Clear Filters',
  className,
}: ListToolbarFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div
      className={twMerge(
        'flex items-center justify-between pl-2 pr-4 py-2',
        'bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.field}
            value={filter.value}
            onRemove={onFilterRemove ? () => onFilterRemove(filter.id) : undefined}
          />
        ))}
      </div>
      {onFiltersClear && (
        <button
          onClick={onFiltersClear}
          className="text-label-sm font-medium text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors"
        >
          {clearFiltersLabel}
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export function ListToolbar({
  primaryActions,
  bulkActions,
  showDivider = true,
  filters = [],
  onFilterRemove,
  onFiltersClear,
  clearFiltersLabel = 'Clear Filters',
  className,
  children,
}: ListToolbarProps) {
  const hasActions = primaryActions || bulkActions || children;
  const hasFilters = filters.length > 0;

  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      {/* Actions Bar */}
      {hasActions && (
        <div className="flex items-center gap-2">
          {primaryActions}
          {showDivider && primaryActions && bulkActions && <ListToolbarDivider />}
          {bulkActions}
          {children}
        </div>
      )}

      {/* Filter Bar */}
      {hasFilters && (
        <ListToolbarFilters
          filters={filters}
          onFilterRemove={onFilterRemove}
          onFiltersClear={onFiltersClear}
          clearFiltersLabel={clearFiltersLabel}
        />
      )}
    </div>
  );
}

/* ----------------------------------------
   Compound Component Pattern
   ---------------------------------------- */

ListToolbar.Actions = ListToolbarActions;
ListToolbar.Divider = ListToolbarDivider;
ListToolbar.Filters = ListToolbarFilters;

export default ListToolbar;
