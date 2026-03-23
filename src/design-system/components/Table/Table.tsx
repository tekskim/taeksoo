import React, { useState, useMemo, useCallback } from 'react';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';
import { cn } from '../../utils/cn';
import { useColumnResize } from './useColumnResize';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = any> {
  key: string;
  /** Column header text */
  label: string;
  /** @deprecated Use label instead (thaki-ui compatibility) */
  header?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  /** Whether this column can be resized. Defaults to true for flex columns, false for fixed-width columns */
  resizable?: boolean;
  /** Pin column to 'left' or 'right' edge during horizontal scroll */
  sticky?: 'left' | 'right';
  headerRender?: () => React.ReactNode;
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

export interface TableProps<T = any> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  columns: TableColumn<T>[];
  /** Table data */
  data?: T[];
  /** @deprecated Use data instead (thaki-ui compatibility) */
  rows?: T[];
  rowKey: keyof T | ((row: T) => string);
  selectable?: boolean;
  selectionType?: 'checkbox' | 'radio';
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  hideSelectAll?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  onRowClick?: (row: T, rowIndex: number) => void;
  emptyMessage?: string;
  rowHeight?: string;
  /** Render expanded content below a row. Return null to collapse. */
  expandedContent?: (row: T, rowIndex: number) => React.ReactNode | null;
  /** Enable column resizing. Defaults to true */
  resizable?: boolean;
  /** Resize timing: 'onChange' for real-time, 'onEnd' for after drag. Defaults to 'onEnd' */
  columnResizeMode?: 'onChange' | 'onEnd';
  /** Callback when a column width changes via resize */
  onColumnResize?: (columnKey: string, width: number) => void;
  /** Global minimum column width in px. Defaults to 50 */
  minColumnWidth?: number;
}

/* ----------------------------------------
   Alignment maps
   ---------------------------------------- */

const HEADER_ALIGN_CLS: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const CELL_ALIGN_CLS: Record<string, string> = {
  left: 'justify-start text-left',
  center: 'justify-center text-center',
  right: 'justify-end text-right',
};

const INNER_ALIGN_CLS: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end flex-row-reverse',
};

/* ----------------------------------------
   Table Component
   ---------------------------------------- */

export function Table<T extends Record<string, any>>({
  columns: rawColumns,
  data,
  rows,
  rowKey,
  selectable = false,
  selectionType = 'checkbox',
  selectedKeys = [],
  onSelectionChange,
  hideSelectAll = false,
  stickyHeader = false,
  maxHeight,
  onRowClick,
  expandedContent,
  emptyMessage = 'No data',
  className = '',
  rowHeight,
  resizable = true,
  columnResizeMode = 'onEnd',
  onColumnResize,
  minColumnWidth,
  ...rest
}: TableProps<T>) {
  const tableData = data ?? rows ?? [];

  const columns = rawColumns.map((col) => ({
    ...col,
    label: col.label || col.header || '',
  }));

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const resizableColumnKeys = useMemo(() => {
    if (!resizable) return [];
    return rawColumns
      .filter((c) => {
        if (c.resizable !== undefined) return c.resizable;
        return !c.width;
      })
      .map((c) => c.key);
  }, [rawColumns, resizable]);

  const {
    isResizing,
    resizingColumnKey,
    getResizeHandleProps,
    getResizedColumnStyle,
    tableRef,
    shouldIgnoreHeaderClick,
    hasResizedColumns,
  } = useColumnResize({
    mode: columnResizeMode,
    onColumnResize,
    minColumnWidth,
    resizableColumnKeys,
  });

  const getRowKey = useCallback(
    (row: T): string => {
      if (typeof rowKey === 'function') {
        return rowKey(row);
      }
      return String(row[rowKey]);
    },
    [rowKey]
  );

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
    if (!sortKey || !sortDirection) return tableData;

    return [...tableData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tableData, sortKey, sortDirection]);

  const handleSelectRow = (key: string) => {
    if (selectionType === 'radio') {
      onSelectionChange?.(selectedKeys.includes(key) ? [] : [key]);
    } else {
      if (selectedKeys.includes(key)) {
        onSelectionChange?.(selectedKeys.filter((k) => k !== key));
      } else {
        onSelectionChange?.([...selectedKeys, key]);
      }
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
      return <IconSelector size={14} stroke={1} className="text-[var(--color-text-subtle)]" />;
    }
    if (sortDirection === 'asc') {
      return <IconChevronUp size={14} stroke={1} className="text-[var(--color-action-primary)]" />;
    }
    return <IconChevronDown size={14} stroke={1} className="text-[var(--color-action-primary)]" />;
  };

  const enableStickyHeader = stickyHeader || !!maxHeight;
  const hasStickyColumns = columns.some((c) => c.sticky);

  const isColumnResizable = (column: TableColumn<T>): boolean => {
    if (!resizable) return false;
    if (column.resizable !== undefined) return column.resizable;
    return !column.width;
  };

  const getColumnStyle = (column: TableColumn<T>): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (column.width) {
      style.width = column.width;
      style.flexShrink = 0;
      style.flexGrow = 0;
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

  const getEffectiveColumnStyle = (column: TableColumn<T>): React.CSSProperties => {
    const baseStyle = getColumnStyle(column);
    return !resizable || !isColumnResizable(column)
      ? { ...baseStyle }
      : getResizedColumnStyle(column.key, baseStyle, column.minWidth, column.maxWidth);
  };

  const scrollColumns = hasStickyColumns ? columns.filter((c) => !c.sticky) : columns;
  const stickyRightColumns = hasStickyColumns ? columns.filter((c) => c.sticky === 'right') : [];

  const stickyRightWidth = stickyRightColumns.reduce((sum, c) => {
    const w = c.width ? parseInt(c.width, 10) : 72;
    return sum + w;
  }, 0);

  const renderHeaderCell = (column: TableColumn<T>, index: number, showFirstDivider: boolean) => {
    const isFirstColumn = index === 0;
    const showDivider = isFirstColumn ? showFirstDivider : true;
    const columnResizable = isColumnResizable(column);
    const align = column.align || 'left';

    return (
      <div
        key={column.key}
        data-column-key={column.key}
        className={cn(
          'relative flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]',
          'text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)]',
          'min-w-0 overflow-hidden',
          HEADER_ALIGN_CLS[align],
          column.sortable &&
            'cursor-pointer select-none hover:text-[var(--color-action-primary)] transition-colors',
          showDivider && 'border-l border-[var(--color-border-default)]'
        )}
        style={getEffectiveColumnStyle(column)}
        onClick={
          column.sortable
            ? () => {
                if (!shouldIgnoreHeaderClick()) handleSort(column.key);
              }
            : undefined
        }
        title={column.label}
      >
        {column.headerRender ? (
          column.headerRender()
        ) : (
          <div className={cn('flex items-center gap-1 w-full min-w-0', INNER_ALIGN_CLS[align])}>
            <span className="whitespace-nowrap truncate" title={column.label}>
              {column.label}
            </span>
            {column.sortable && <span className="flex-shrink-0">{renderSortIcon(column.key)}</span>}
          </div>
        )}
        {columnResizable && (
          <div
            className={cn(
              'absolute top-0 right-0 h-full w-[var(--table-resize-handle-width)] cursor-col-resize z-[1] flex items-center justify-center',
              "after:content-[''] after:absolute after:top-2 after:bottom-2 after:w-[1px] after:rounded-full",
              'after:bg-[var(--table-resize-handle-hover-color)] after:opacity-0 after:transition-opacity after:duration-150',
              resizingColumnKey !== column.key && 'hover:after:opacity-100',
              resizingColumnKey === column.key && 'after:opacity-100'
            )}
            {...getResizeHandleProps(column.key, column.label)}
          />
        )}
      </div>
    );
  };

  const renderBodyCell = (
    column: TableColumn<T>,
    row: T,
    rowIndex: number,
    colIndex: number,
    isSelected: boolean,
    showFirstDivider: boolean
  ) => {
    const isFirstColumn = colIndex === 0;
    const showCellDivider = isFirstColumn ? showFirstDivider : true;
    const align = column.align || 'left';
    const cellValue = row[column.key];
    const cellTitle =
      typeof cellValue === 'string' || typeof cellValue === 'number'
        ? String(cellValue)
        : undefined;

    return (
      <div
        key={column.key}
        data-column-key={column.key}
        className={cn(
          'flex items-center',
          'px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]',
          'text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]',
          'min-w-0 overflow-hidden',
          CELL_ALIGN_CLS[align],
          showCellDivider && 'border-l border-transparent'
        )}
        style={getEffectiveColumnStyle(column)}
        title={cellTitle}
      >
        <div
          className={cn(
            'truncate w-full min-w-0',
            align === 'center' && 'text-center flex justify-center',
            align === 'right' && 'text-right'
          )}
        >
          {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
        </div>
      </div>
    );
  };

  if (hasStickyColumns) {
    return (
      <div
        data-figma-name="[TDS] Table"
        {...rest}
        ref={tableRef}
        className={cn('flex flex-col gap-[var(--table-row-gap)]', className)}
        style={rowHeight ? ({ '--table-row-height': rowHeight } as React.CSSProperties) : undefined}
      >
        <div className="flex">
          {/* Scrollable area */}
          <div
            className={cn('flex-1 min-w-0 overflow-x-auto', maxHeight && 'overflow-y-auto')}
            style={maxHeight ? { maxHeight } : undefined}
          >
            <div className="min-w-fit w-full">
              {/* Header */}
              <div
                className={cn(
                  'flex items-stretch min-h-[var(--table-row-height)] w-full',
                  'bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-l-[var(--table-row-radius)]',
                  'border-r-0',
                  enableStickyHeader && 'sticky top-0 z-10',
                  isResizing && 'select-none'
                )}
              >
                {selectable && (
                  <div className="shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]">
                    {!hideSelectAll && selectionType !== 'radio' && (
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    )}
                  </div>
                )}
                {scrollColumns.map((col, i) => renderHeaderCell(col, i, selectable))}
                {hasResizedColumns && (
                  <div style={{ flex: '1 0 0', minWidth: 0 }} aria-hidden="true" />
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)] w-full">
                {sortedData.length === 0 ? (
                  <div
                    className={cn(
                      'px-[var(--table-cell-padding-x)] py-[var(--table-empty-padding-y)] text-center',
                      'text-[length:var(--table-font-size)] text-[var(--color-text-muted)]',
                      'border border-[var(--color-border-default)] rounded-l-[var(--table-row-radius)] border-r-0 bg-[var(--color-surface-default)]'
                    )}
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
                        className={cn(
                          'flex items-stretch min-h-[var(--table-row-height)] w-full',
                          'rounded-l-[var(--table-row-radius)] border border-[var(--color-border-default)] border-r-0',
                          'transition-all hover:bg-[var(--table-row-hover-bg)]',
                          isSelected
                            ? 'bg-[var(--table-row-selected-bg)] border-[var(--table-row-selected-border)]'
                            : 'bg-[var(--color-surface-default)]',
                          onRowClick && 'cursor-pointer'
                        )}
                        onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                      >
                        {selectable && (
                          <div
                            className="shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {selectionType === 'radio' ? (
                              <Radio
                                checked={isSelected}
                                onChange={() => handleSelectRow(key)}
                                aria-label={`Select row ${rowIndex + 1}`}
                              />
                            ) : (
                              <Checkbox
                                checked={isSelected}
                                onChange={() => handleSelectRow(key)}
                                aria-label={`Select row ${rowIndex + 1}`}
                              />
                            )}
                          </div>
                        )}
                        {scrollColumns.map((col, i) =>
                          renderBodyCell(col, row, rowIndex, i, isSelected, selectable)
                        )}
                        {hasResizedColumns && (
                          <div style={{ flex: '1 0 0', minWidth: 0 }} aria-hidden="true" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Fixed right column(s) */}
          <div
            className="shrink-0 flex flex-col gap-[var(--table-row-gap)]"
            style={{ width: stickyRightWidth }}
          >
            {/* Header */}
            <div
              className={cn(
                'flex items-stretch min-h-[var(--table-row-height)]',
                'bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-r-[var(--table-row-radius)]',
                'border-l-0'
              )}
            >
              {stickyRightColumns.map((col, i) => renderHeaderCell(col, i, true))}
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[var(--table-row-gap)]">
              {sortedData.length === 0 ? (
                <div
                  className={cn(
                    'min-h-[var(--table-row-height)]',
                    'border border-[var(--color-border-default)] rounded-r-[var(--table-row-radius)] border-l-0 bg-[var(--color-surface-default)]'
                  )}
                />
              ) : (
                sortedData.map((row, rowIndex) => {
                  const key = getRowKey(row);
                  const isSelected = selectedKeys.includes(key);
                  return (
                    <div
                      key={key}
                      className={cn(
                        'flex items-stretch min-h-[var(--table-row-height)]',
                        'rounded-r-[var(--table-row-radius)] border border-[var(--color-border-default)] border-l-0',
                        'transition-all hover:bg-[var(--table-row-hover-bg)]',
                        isSelected
                          ? 'bg-[var(--table-row-selected-bg)] border-[var(--table-row-selected-border)]'
                          : 'bg-[var(--color-surface-default)]',
                        onRowClick && 'cursor-pointer'
                      )}
                      onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                    >
                      {stickyRightColumns.map((col, i) =>
                        renderBodyCell(col, row, rowIndex, i, isSelected, true)
                      )}
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

  return (
    <div
      data-figma-name="[TDS] Table"
      {...rest}
      ref={tableRef}
      className={cn('flex flex-col gap-[var(--table-row-gap)]', className)}
      style={rowHeight ? ({ '--table-row-height': rowHeight } as React.CSSProperties) : undefined}
    >
      <div
        className={cn('overflow-x-auto', maxHeight && 'overflow-y-auto')}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <div className="min-w-fit w-full">
          {/* Header */}
          <div
            className={cn(
              'flex items-stretch min-h-[var(--table-row-height)] w-full',
              'bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]',
              enableStickyHeader && 'sticky top-0 z-10',
              isResizing && 'select-none'
            )}
          >
            {selectable && (
              <div className="shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)]">
                {!hideSelectAll && selectionType !== 'radio' && (
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                )}
              </div>
            )}
            {columns.map((column, index) => renderHeaderCell(column, index, selectable))}
            {hasResizedColumns && <div style={{ flex: '1 0 0', minWidth: 0 }} aria-hidden="true" />}
          </div>

          {/* Body */}
          <div className="flex flex-col gap-[var(--table-row-gap)] mt-[var(--table-row-gap)] w-full">
            {sortedData.length === 0 ? (
              <div
                className={cn(
                  'px-[var(--table-cell-padding-x)] py-[var(--table-empty-padding-y)] text-center',
                  'text-[length:var(--table-font-size)] text-[var(--color-text-muted)]',
                  'border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] bg-[var(--color-surface-default)]'
                )}
              >
                {emptyMessage}
              </div>
            ) : (
              sortedData.map((row, rowIndex) => {
                const key = getRowKey(row);
                const isSelected = selectedKeys.includes(key);
                const expanded = expandedContent?.(row, rowIndex);
                return (
                  <div
                    key={key}
                    className={cn(
                      'rounded-[var(--table-row-radius)] overflow-hidden',
                      'border border-[var(--color-border-default)]',
                      isSelected
                        ? 'bg-[var(--table-row-selected-bg)] border-[var(--table-row-selected-border)]'
                        : 'bg-[var(--color-surface-default)]'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-stretch min-h-[var(--table-row-height)] w-full',
                        'transition-all hover:bg-[var(--table-row-hover-bg)]',
                        onRowClick && 'cursor-pointer'
                      )}
                      onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                    >
                      {selectable && (
                        <div
                          className="shrink-0 flex items-center w-[var(--table-checkbox-width)] px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {selectionType === 'radio' ? (
                            <Radio
                              checked={isSelected}
                              onChange={() => handleSelectRow(key)}
                              aria-label={`Select row ${rowIndex + 1}`}
                            />
                          ) : (
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelectRow(key)}
                              aria-label={`Select row ${rowIndex + 1}`}
                            />
                          )}
                        </div>
                      )}
                      {columns.map((col, i) =>
                        renderBodyCell(col, row, rowIndex, i, isSelected, selectable)
                      )}
                      {hasResizedColumns && (
                        <div style={{ flex: '1 0 0', minWidth: 0 }} aria-hidden="true" />
                      )}
                    </div>
                    {expanded && (
                      <div className="border-t border-[var(--color-border-subtle)]">{expanded}</div>
                    )}
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
