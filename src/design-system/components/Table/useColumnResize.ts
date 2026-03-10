import { useState, useCallback, useRef, useEffect } from 'react';

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
  getResizedColumnStyle: (
    columnKey: string,
    originalStyle: React.CSSProperties,
    minWidth?: string,
    maxWidth?: string
  ) => React.CSSProperties;
  tableRef: React.RefObject<HTMLDivElement | null>;
  resetColumnWidth: (columnKey: string) => void;
  resetAllColumnWidths: () => void;
  /** Returns true if a resize just finished and header clicks should be ignored */
  shouldIgnoreHeaderClick: () => boolean;
  /** True when at least one column has been resized (snapshot applied) */
  hasResizedColumns: boolean;
}

const DEFAULT_MIN_WIDTH = 50;
const KEYBOARD_STEP = 10;

export function useColumnResize(options: UseColumnResizeOptions = {}): UseColumnResizeReturn {
  const { mode = 'onEnd', onColumnResize, minColumnWidth = DEFAULT_MIN_WIDTH } = options;

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumnKey, setResizingColumnKey] = useState<string | null>(null);

  const tableRef = useRef<HTMLDivElement | null>(null);

  const dragRef = useRef({
    startX: 0,
    startWidth: 0,
    columnKey: null as string | null,
    currentWidth: 0,
  });

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const columnWidthsRef = useRef(columnWidths);
  columnWidthsRef.current = columnWidths;

  const wasResizingRef = useRef(false);

  const isResizing = resizingColumnKey !== null;
  const hasResizedColumns = Object.keys(columnWidths).length > 0;

  const ensureSnapshot = useCallback(() => {
    if (Object.keys(columnWidthsRef.current).length > 0) return;
    const keys = optionsRef.current.resizableColumnKeys;
    if (!keys || keys.length === 0 || !tableRef.current) return;

    const snapshot: Record<string, number> = {};
    for (const key of keys) {
      const cell = tableRef.current.querySelector(
        `[data-column-key="${key}"]`
      ) as HTMLElement | null;
      if (cell) {
        snapshot[key] = cell.getBoundingClientRect().width;
      }
    }

    columnWidthsRef.current = snapshot;
    setColumnWidths(snapshot);
  }, []);

  const getHeaderCellWidth = useCallback(
    (columnKey: string): number => {
      if (!tableRef.current) return minColumnWidth;
      const headerCell = tableRef.current.querySelector(
        `[data-column-key="${columnKey}"]`
      ) as HTMLElement | null;
      if (!headerCell) return minColumnWidth;
      return headerCell.getBoundingClientRect().width;
    },
    [minColumnWidth]
  );

  const clampWidth = useCallback(
    (width: number, minW?: string, maxW?: string): number => {
      const min = minW ? parseInt(minW, 10) || minColumnWidth : minColumnWidth;
      let clamped = Math.max(width, min);
      if (maxW) {
        const max = parseInt(maxW, 10);
        if (max > 0) clamped = Math.min(clamped, max);
      }
      return clamped;
    },
    [minColumnWidth]
  );

  const applyDomPreview = useCallback((columnKey: string, width: number) => {
    if (!tableRef.current) return;
    const cells = tableRef.current.querySelectorAll(
      `[data-column-key="${columnKey}"]`
    ) as NodeListOf<HTMLElement>;
    cells.forEach((cell) => {
      cell.style.width = `${width}px`;
      cell.style.flexShrink = '0';
      cell.style.flexGrow = '0';
    });
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag.columnKey) return;

      const opts = optionsRef.current;
      const minW = opts.minColumnWidth ?? DEFAULT_MIN_WIDTH;
      const delta = e.clientX - drag.startX;
      const newWidth = Math.max(drag.startWidth + delta, minW);
      drag.currentWidth = newWidth;

      if (opts.mode === 'onChange') {
        setColumnWidths((prev) => ({ ...prev, [drag.columnKey!]: newWidth }));
        opts.onColumnResize?.(drag.columnKey, newWidth);
      } else {
        applyDomPreview(drag.columnKey, newWidth);
      }
    },
    [applyDomPreview]
  );

  const onMouseUp = useCallback(() => {
    const drag = dragRef.current;
    if (drag.columnKey) {
      const finalWidth = drag.currentWidth;
      const opts = optionsRef.current;

      setColumnWidths((prev) => ({ ...prev, [drag.columnKey!]: finalWidth }));

      if (opts.mode !== 'onChange') {
        opts.onColumnResize?.(drag.columnKey, finalWidth);
      }
    }

    drag.columnKey = null;
    setResizingColumnKey(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    setTimeout(() => {
      wasResizingRef.current = false;
    }, 0);
  }, [onMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [onMouseMove, onMouseUp]);

  const handleMouseDown = useCallback(
    (columnKey: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      wasResizingRef.current = true;
      ensureSnapshot();

      const currentWidth = columnWidthsRef.current[columnKey] ?? getHeaderCellWidth(columnKey);

      dragRef.current = {
        startX: e.clientX,
        startWidth: currentWidth,
        columnKey,
        currentWidth,
      };

      setResizingColumnKey(columnKey);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [getHeaderCellWidth, onMouseMove, onMouseUp, ensureSnapshot]
  );

  const handleDoubleClick = useCallback(
    (columnKey: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      ensureSnapshot();

      if (!tableRef.current) return;

      const cells = tableRef.current.querySelectorAll(
        `[data-column-key="${columnKey}"]`
      ) as NodeListOf<HTMLElement>;

      let maxContentWidth = 0;
      cells.forEach((cell) => {
        const inner = cell.firstElementChild as HTMLElement | null;
        if (inner) {
          const savedCellWidth = cell.style.width;
          const savedCellFlex = cell.style.flex;
          const savedOverflow = inner.style.overflow;
          const savedWhiteSpace = inner.style.whiteSpace;
          const savedTextOverflow = inner.style.textOverflow;

          cell.style.width = 'auto';
          cell.style.flex = '0 0 auto';
          inner.style.overflow = 'visible';
          inner.style.whiteSpace = 'nowrap';
          inner.style.textOverflow = 'clip';

          maxContentWidth = Math.max(maxContentWidth, inner.scrollWidth);

          cell.style.width = savedCellWidth;
          cell.style.flex = savedCellFlex;
          inner.style.overflow = savedOverflow;
          inner.style.whiteSpace = savedWhiteSpace;
          inner.style.textOverflow = savedTextOverflow;
        }
      });

      const paddingX =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--table-cell-padding-x')
        ) || 12;
      const optimalWidth = maxContentWidth + paddingX * 2 + 2;
      const finalWidth = Math.max(optimalWidth, minColumnWidth);

      setColumnWidths((prev) => ({ ...prev, [columnKey]: finalWidth }));
      onColumnResize?.(columnKey, finalWidth);
    },
    [minColumnWidth, onColumnResize, ensureSnapshot]
  );

  const handleKeyDown = useCallback(
    (columnKey: string, e: React.KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      ensureSnapshot();

      const currentWidth = columnWidthsRef.current[columnKey] ?? getHeaderCellWidth(columnKey);
      const delta = e.key === 'ArrowRight' ? KEYBOARD_STEP : -KEYBOARD_STEP;
      const newWidth = Math.max(currentWidth + delta, minColumnWidth);

      setColumnWidths((prev) => ({ ...prev, [columnKey]: newWidth }));
      onColumnResize?.(columnKey, newWidth);
    },
    [getHeaderCellWidth, minColumnWidth, onColumnResize, ensureSnapshot]
  );

  const shouldIgnoreHeaderClick = useCallback(() => wasResizingRef.current, []);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const getResizeHandleProps = useCallback(
    (columnKey: string, columnLabel: string): ResizeHandleProps => ({
      onClick: stopPropagation,
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(columnKey, e),
      onDoubleClick: (e: React.MouseEvent) => handleDoubleClick(columnKey, e),
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(columnKey, e),
      role: 'separator',
      tabIndex: 0,
      'aria-orientation': 'vertical' as const,
      'aria-valuenow': columnWidths[columnKey] ?? minColumnWidth,
      'aria-valuemin': minColumnWidth,
      'aria-label': `Resize column ${columnLabel}`,
    }),
    [
      stopPropagation,
      handleMouseDown,
      handleDoubleClick,
      handleKeyDown,
      columnWidths,
      minColumnWidth,
    ]
  );

  const getResizedColumnStyle = useCallback(
    (
      columnKey: string,
      originalStyle: React.CSSProperties,
      minWidth?: string,
      maxWidth?: string
    ): React.CSSProperties => {
      const resizedWidth = columnWidths[columnKey];

      if (resizedWidth !== undefined) {
        const clamped = clampWidth(resizedWidth, minWidth, maxWidth);
        return { width: clamped, flexShrink: 0, flexGrow: 0 };
      }

      return originalStyle;
    },
    [columnWidths, clampWidth]
  );

  const resetColumnWidth = useCallback((columnKey: string) => {
    setColumnWidths((prev) => {
      const next = { ...prev };
      delete next[columnKey];
      return next;
    });
  }, []);

  const resetAllColumnWidths = useCallback(() => {
    columnWidthsRef.current = {};
    setColumnWidths({});
  }, []);

  return {
    columnWidths,
    isResizing,
    resizingColumnKey,
    getResizeHandleProps,
    getResizedColumnStyle,
    tableRef,
    resetColumnWidth,
    resetAllColumnWidths,
    shouldIgnoreHeaderClick,
    hasResizedColumns,
  };
}
