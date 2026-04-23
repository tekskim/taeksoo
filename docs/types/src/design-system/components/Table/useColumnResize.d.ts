export interface UseColumnResizeOptions {
    /** Resize mode: 'onEnd' updates after drag, 'onChange' updates in real-time */
    mode?: 'onChange' | 'onEnd';
    /** Callback when a column width changes */
    onColumnResize?: (columnKey: string, width: number) => void;
    /** Global minimum column width (px). Defaults to 50 */
    minColumnWidth?: number;
    /** Keys of resizable columns. On first resize, these columns are snapshotted to fixed pixel widths */
    resizableColumnKeys?: string[];
}
export interface ResizeHandleProps {
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onDoubleClick: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    role: 'separator';
    tabIndex: number;
    'aria-orientation': 'vertical';
    'aria-valuenow': number | undefined;
    'aria-valuemin': number;
    'aria-label': string;
}
export interface UseColumnResizeReturn {
    columnWidths: Record<string, number>;
    isResizing: boolean;
    resizingColumnKey: string | null;
    getResizeHandleProps: (columnKey: string, columnLabel: string) => ResizeHandleProps;
    getResizedColumnStyle: (columnKey: string, originalStyle: React.CSSProperties, minWidth?: string, maxWidth?: string) => React.CSSProperties;
    tableRef: React.RefObject<HTMLDivElement | null>;
    resetColumnWidth: (columnKey: string) => void;
    resetAllColumnWidths: () => void;
    /** Returns true if a resize just finished and header clicks should be ignored */
    shouldIgnoreHeaderClick: () => boolean;
    /** True when at least one column has been resized (snapshot applied) */
    hasResizedColumns: boolean;
}
export declare function useColumnResize(options?: UseColumnResizeOptions): UseColumnResizeReturn;
