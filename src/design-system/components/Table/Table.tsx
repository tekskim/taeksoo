import React, { useState, useMemo, useCallback } from 'react';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import { Checkbox } from '../Checkbox';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = any> {
  /** Unique column key */
  key: string;
  /** Column header label */
  label: string;
  /** Column width (e.g., '100px', '20%', 'auto') */
  width?: string;
  /** Flex grow for column */
  flex?: number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether column is sortable */
  sortable?: boolean;
  /** Custom cell renderer */
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

export interface TableProps<T = any> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Data rows */
  data: T[];
  /** Unique key field in data */
  rowKey: keyof T | ((row: T) => string);
  /** Enable row selection with checkboxes */
  selectable?: boolean;
  /** Selected row keys (controlled) */
  selectedKeys?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (keys: string[]) => void;
  /** Enable sticky header */
  stickyHeader?: boolean;
  /** Max height for scrollable table (enables sticky header) */
  maxHeight?: string;
  /** Callback when row is clicked */
  onRowClick?: (row: T, rowIndex: number) => void;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom class name */
  className?: string;
}

/* ----------------------------------------
   Table Component
   ---------------------------------------- */

export function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  stickyHeader = false,
  maxHeight,
  onRowClick,
  emptyMessage = 'No data',
  className = '',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Get row key
  const getRowKey = useCallback((row: T): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return String(row[rowKey]);
  }, [rowKey]);

  // Handle sort
  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  };

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  // Selection handlers
  const allSelected = data.length > 0 && selectedKeys.length === data.length;
  const someSelected = selectedKeys.length > 0 && selectedKeys.length < data.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data.map(getRowKey));
    }
  };

  const handleSelectRow = (key: string) => {
    if (selectedKeys.includes(key)) {
      onSelectionChange?.(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange?.([...selectedKeys, key]);
    }
  };

  // Render sort icon
  const renderSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return <IconSelector size={14} stroke={1.5} className="text-[var(--color-text-disabled)]" />;
    }
    if (sortDirection === 'asc') {
      return <IconChevronUp size={14} stroke={2} className="text-[var(--color-action-primary)]" />;
    }
    return <IconChevronDown size={14} stroke={2} className="text-[var(--color-action-primary)]" />;
  };

  const enableStickyHeader = stickyHeader || !!maxHeight;

  // Calculate min-width based on columns
  const minWidth = useMemo(() => {
    const widths = columns.map((col) => {
      if (col.width) {
        const parsed = parseInt(col.width, 10);
        return isNaN(parsed) ? 100 : parsed;
      }
      return 100; // default width
    });
    const checkboxWidth = selectable ? 48 : 0;
    return widths.reduce((sum, w) => sum + w, checkboxWidth);
  }, [columns, selectable]);

  return (
    <div
      className={`flex flex-col gap-[var(--table-row-gap)] ${className}`}
    >
      {/* Scrollable container - horizontal + vertical */}
      <div
        className={`table-scroll-container overflow-x-scroll ${maxHeight ? 'overflow-y-auto' : ''}`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {/* Inner container for min-width */}
        <div style={{ minWidth: `${minWidth}px` }}>
          {/* Header */}
          <div
            className={`
              flex items-center
              bg-[var(--table-header-bg)]
              border border-[var(--color-border-default)]
              rounded-[var(--table-row-radius)]
              ${enableStickyHeader ? 'sticky top-0 z-10' : ''}
            `}
          >
          {/* Selection checkbox */}
          {selectable && (
            <div
              className="
                shrink-0
                w-[var(--table-checkbox-width)]
                px-[var(--table-cell-padding-x)]
                py-[var(--table-header-padding-y)]
              "
            >
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={handleSelectAll}
                aria-label="Select all rows"
              />
            </div>
          )}

          {/* Column headers */}
          {columns.map((column) => (
            <div
              key={column.key}
              className={`
                px-[var(--table-cell-padding-x)]
                py-[var(--table-header-padding-y)]
                text-[length:var(--table-header-font-size)]
                leading-[var(--table-line-height)]
                font-medium
                text-[var(--color-text-default)]
                ${column.align === 'center' ? 'text-center' : ''}
                ${column.align === 'right' ? 'text-right' : 'text-left'}
                ${column.sortable ? 'cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors' : ''}
              `}
              style={{ 
                width: column.width,
                flex: column.flex ?? (column.width ? undefined : 1),
              }}
              onClick={column.sortable ? () => handleSort(column.key) : undefined}
            >
              <div
                className={`
                  inline-flex items-center gap-1
                  ${column.align === 'right' ? 'flex-row-reverse' : ''}
                `}
              >
                <span>{column.label}</span>
                {column.sortable && renderSortIcon(column.key)}
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)]">
          {sortedData.length === 0 ? (
            <div
              className="
                px-[var(--table-cell-padding-x)]
                py-[var(--table-empty-padding-y)]
                text-center
                text-[length:var(--table-font-size)]
                text-[var(--color-text-muted)]
                border border-[var(--color-border-default)]
                rounded-[var(--table-row-radius)]
                bg-[var(--color-surface-default)]
              "
            >
              {emptyMessage}
            </div>
          ) : (
            sortedData.map((row, rowIndex) => {
              const key = getRowKey(row);
              const isSelected = selectedKeys.includes(key);

              return (
                <div
                  key={key}
                  className={`
                    flex items-center
                    rounded-[var(--table-row-radius)]
                    transition-all
                    hover:bg-[var(--table-row-hover-bg)]
                    border border-[var(--color-border-default)]
                    ${isSelected 
                      ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]' 
                      : 'bg-[var(--color-surface-default)]'
                    }
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                >
                  {/* Selection checkbox */}
                  {selectable && (
                    <div
                      className="
                        shrink-0
                        w-[var(--table-checkbox-width)]
                        px-[var(--table-cell-padding-x)]
                        py-[var(--table-cell-padding-y)]
                      "
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </div>
                  )}

                  {/* Data cells */}
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={`
                        px-[var(--table-cell-padding-x)]
                        py-[var(--table-cell-padding-y)]
                        text-[length:var(--table-font-size)]
                        leading-[var(--table-line-height)]
                        text-[var(--color-text-default)]
                        ${column.align === 'center' ? 'text-center' : ''}
                        ${column.align === 'right' ? 'text-right' : 'text-left'}
                      `}
                      style={{ 
                        width: column.width,
                        flex: column.flex ?? (column.width ? undefined : 1),
                      }}
                    >
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key]}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
