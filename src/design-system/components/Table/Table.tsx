import React, { useState, useMemo, useCallback } from 'react';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import { Checkbox } from '../Checkbox';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = any> {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  headerRender?: () => React.ReactNode;
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  hideSelectAll?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  onRowClick?: (row: T, rowIndex: number) => void;
  emptyMessage?: string;
  className?: string;
  rowHeight?: string;
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
  hideSelectAll = false,
  stickyHeader = false,
  maxHeight,
  onRowClick,
  emptyMessage = 'No data',
  className = '',
  rowHeight,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const getRowKey = useCallback((row: T): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return String(row[rowKey]);
  }, [rowKey]);

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

  const handleSelectRow = (key: string) => {
    if (selectedKeys.includes(key)) {
      onSelectionChange?.(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange?.([...selectedKeys, key]);
    }
  };

  const handleSelectAll = () => {
    const allKeys = sortedData.map(getRowKey);
    if (selectedKeys.length === sortedData.length && sortedData.length > 0) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(allKeys);
    }
  };

  const allSelected = sortedData.length > 0 && selectedKeys.length === sortedData.length;
  const someSelected = selectedKeys.length > 0 && selectedKeys.length < sortedData.length;

  const renderSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return <IconSelector size={14} stroke={1} className="text-[var(--color-text-disabled)]" />;
    }
    if (sortDirection === 'asc') {
      return <IconChevronUp size={14} stroke={1} className="text-[var(--color-action-primary)]" />;
    }
    return <IconChevronDown size={14} stroke={1} className="text-[var(--color-action-primary)]" />;
  };

  const enableStickyHeader = stickyHeader || !!maxHeight;

  const getColumnStyle = (column: TableColumn<T>): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    if (column.width) {
      style.width = column.width;
      style.flexShrink = 0;
    } else {
      style.flex = column.flex ?? 1;
      style.minWidth = 0;
    }
    
    if (column.minWidth) {
      style.minWidth = column.minWidth;
    }
    
    if (column.maxWidth) {
      style.maxWidth = column.maxWidth;
    }
    
    return style;
  };

  return (
    <div
      className={`flex flex-col gap-[var(--table-row-gap)] ${className}`}
      style={rowHeight ? { '--table-row-height': rowHeight } as React.CSSProperties : undefined}
    >
      <div
        className={`${maxHeight ? 'overflow-y-auto' : ''}`}
        style={{ ...(maxHeight ? { maxHeight } : {}) }}
      >
        {/* Header */}
        <div
          className={`
            flex items-stretch
            min-h-[var(--table-row-height)]
            bg-[var(--table-header-bg)]
            border border-[var(--color-border-default)]
            rounded-[var(--table-row-radius)]
            ${enableStickyHeader ? 'sticky top-0 z-10' : ''}
          `}
        >
          {selectable && (
            <div
              className="
                shrink-0
                flex items-center
                w-[var(--table-checkbox-width)]
                px-[var(--table-cell-padding-x)]
                py-[var(--table-header-padding-y)]
              "
            >
              {!hideSelectAll && (
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              )}
            </div>
          )}

          {columns.map((column, index) => {
            const isFirstColumn = index === 0;
            const showDivider = isFirstColumn ? selectable : true;
            
            return (
              <div
                key={column.key}
                className={`
                  flex items-center
                  px-[var(--table-cell-padding-x)]
                  py-[var(--table-header-padding-y)]
                  text-[length:var(--table-header-font-size)]
                  leading-[var(--table-line-height)]
                  font-medium
                  text-[var(--color-text-default)]
                  min-w-0
                  overflow-hidden
                  ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                  ${column.sortable ? 'cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors' : ''}
                  ${showDivider ? 'border-l border-[var(--color-border-default)]' : ''}
                `}
                style={getColumnStyle(column)}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
                title={column.label}
              >
                {column.headerRender ? (
                  column.headerRender()
                ) : (
                  <div
                    className={`
                      flex items-center gap-1 w-full min-w-0
                      ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end flex-row-reverse' : 'justify-start'}
                    `}
                  >
                    <span className="whitespace-nowrap truncate" title={column.label}>{column.label}</span>
                    {column.sortable && <span className="flex-shrink-0">{renderSortIcon(column.key)}</span>}
                  </div>
                )}
              </div>
            );
          })}
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
                    flex items-stretch
                    h-[var(--table-row-height)]
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
                  {selectable && (
                    <div
                      className="
                        shrink-0
                        flex items-center
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

                  {columns.map((column, colIndex) => {
                    const isFirstColumn = colIndex === 0;
                    const showCellDivider = isFirstColumn ? selectable : true;
                    
                    const cellValue = row[column.key];
                    const cellTitle = typeof cellValue === 'string' || typeof cellValue === 'number' ? String(cellValue) : undefined;
                    
                    return (
                      <div
                        key={column.key}
                        className={`
                          flex items-center
                          px-[var(--table-cell-padding-x)]
                          py-[var(--table-cell-padding-y)]
                          text-[length:var(--table-font-size)]
                          leading-[var(--table-line-height)]
                          text-[var(--color-text-default)]
                          min-w-0
                          overflow-hidden
                          ${column.align === 'center' ? 'justify-center text-center' : column.align === 'right' ? 'justify-end text-right' : 'justify-start text-left'}
                          ${showCellDivider ? 'border-l border-transparent' : ''}
                        `}
                        style={getColumnStyle(column)}
                        title={cellTitle}
                      >
                        {column.render ? (
                          column.render(row[column.key], row, rowIndex)
                        ) : (
                          <span className={`truncate w-full ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}>
                            {row[column.key]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;
