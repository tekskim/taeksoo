import { default as React } from 'react';
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
export declare function Table<T extends Record<string, any>>({ columns, data, rowKey, selectable, selectedKeys, onSelectionChange, hideSelectAll, stickyHeader, maxHeight, onRowClick, emptyMessage, className, rowHeight, }: TableProps<T>): import("react/jsx-runtime").JSX.Element;
export default Table;
