import { default as React } from 'react';
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
export interface TableProps<T = any> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
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
    /** Keys of rows that should not be selectable */
    disabledKeys?: string[];
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
    /** Show skeleton loading rows instead of data */
    loading?: boolean;
    /** Number of skeleton rows to display when loading. Defaults to 10 */
    loadingRows?: number;
}
export declare function Table<T extends Record<string, any>>({ columns: rawColumns, data, rows, rowKey, selectable, selectionType, selectedKeys, onSelectionChange, disabledKeys, hideSelectAll, stickyHeader, maxHeight, onRowClick, expandedContent, emptyMessage, className, rowHeight, resizable, columnResizeMode, onColumnResize, minColumnWidth, loading, loadingRows, ...rest }: TableProps<T>): import("react/jsx-runtime").JSX.Element;
export default Table;
