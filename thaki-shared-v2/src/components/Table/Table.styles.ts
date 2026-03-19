/**
 * Table component Tailwind styles
 *
 * Maps CSS module classes to Tailwind utilities.
 * Complex pseudo-elements (::after for column dividers) are in tailwind.css @layer components.
 */

export const tableStyles = {
  // Container
  container: 'overflow-x-auto bg-transparent',

  // Table
  table:
    'w-full min-w-[600px] border-separate text-left table-fixed box-border bg-transparent relative',
  tableAuto:
    'w-full border-separate text-left table-auto box-border bg-transparent relative',
  tableSpacing: '[border-spacing:0_var(--semantic-space-xs)]',
  resizing:
    'select-none cursor-col-resize pointer-events-auto [&_*]:pointer-events-none [&_.resize-handle]:pointer-events-auto [&_*]:!transition-none',

  // Header
  thead: 'sticky top-0',
  theadTr: 'bg-surface-subtle',

  // Header Cell (th) - font-size: 11px, line-height: 16px
  th: 'relative box-border h-12 px-[12px] py-0 min-w-[50px] text-text text-11 font-medium leading-16 bg-inherit border-t border-b border-border overflow-hidden text-ellipsis whitespace-nowrap select-none',
  thFirst:
    '!rounded-tl-base6 !rounded-bl-base6 !pl-[12px] !border-l !border-border',
  thLast:
    '!rounded-tr-base6 !rounded-br-base6 !pr-[12px] !border-r !border-border',
  thSelectionCell:
    '!pl-[12px] !pr-[12px] !overflow-visible !whitespace-normal !text-clip !rounded-tl-base6 !rounded-bl-base6 !border-l !border-border',
  thContent:
    'flex items-center gap-[var(--semantic-space-1-5)] min-w-0 overflow-hidden',
  thLabel: 'min-w-0 truncate',
  thClickable: 'cursor-pointer select-none hover:opacity-80',

  // Sort icon
  sortIcon:
    'inline-flex items-center justify-center text-text-muted opacity-40 shrink-0',
  sortIconActive: 'opacity-100 text-text',
  sortIconHover: 'opacity-70',

  // Row (tr)
  tr: 'bg-surface h-12',
  trError: 'bg-error-light',
  trSelected: '!bg-info-weak-bg [&_td]:!border-primary',
  trClickable: 'cursor-pointer',

  // Data Cell (td)
  td: 'box-border py-[6px] px-[12px] text-[0.75rem] leading-[1rem] text-text align-middle border-t border-b border-border bg-inherit [&>[data-layout="stack"][data-direction="vertical"]]:gap-[var(--semantic-space-0-5)]',
  tdText: 'block min-w-0',
  tdFirst:
    'rounded-tl-base6 rounded-bl-base6 border-l border-border',
  tdLast: 'rounded-tr-base6 rounded-br-base6 border-r border-border',
  tdSelectionCell:
    'pl-[12px] pr-[12px] !overflow-visible !whitespace-normal !text-clip text-left cursor-pointer !rounded-tl-base6 !rounded-bl-base6 !border-l !border-border',
  tdActionCell: 'overflow-visible text-clip whitespace-normal',
  tdActionColumn:
    '[&>[data-layout="stack"][data-direction="horizontal"]]:gap-[var(--semantic-space-xs)] [&>[data-layout="stack"][data-direction="horizontal"]]:justify-center [&>[data-layout="stack"][data-direction="horizontal"]]:items-center [&>[data-layout="stack"][data-direction="horizontal"]]:w-full',

  // No padding cell (loading/empty states) - full row span
  noPad:
    '!p-0 whitespace-normal overflow-visible text-clip h-10 align-middle [&>*]:h-full [&>*]:w-full [&>*]:block',
  // Full row cell (loading/empty) with both first and last styling
  noPadFullRow:
    '!rounded-tl-base6 !rounded-bl-base6 !rounded-tr-base6 !rounded-br-base6 !border-l !border-r !border-border overflow-hidden',
  noPadFirst: 'pl-0',
  noPadLast: 'pr-0',
  // Empty state cell (no fixed height)
  emptyCell: '!p-0 whitespace-normal overflow-visible text-clip align-middle',
  emptyCellFullRow:
    '!rounded-tl-base6 !rounded-bl-base6 !rounded-tr-base6 !rounded-br-base6 !border-l !border-r !border-border overflow-hidden',

  // Alignment
  alignLeft: 'text-left [&>*]:text-left',
  alignCenter: 'text-center [&>*]:text-center [&>*]:mx-auto',
  alignRight: 'text-right [&>*]:text-right [&>*]:ml-auto',

  // Empty state
  emptyState:
    'flex flex-col items-center justify-center min-h-60 gap-sm text-center text-text w-full',

  // Sticky last column
  stickyLast: 'sticky right-0 z-[2]',
  stickyLastTh: 'z-[3]',
  stickyLastTheadBg: 'bg-surface-subtle',
  stickyLastTbodyBg: 'bg-surface',

  // Column divider (needs CSS for ::after pseudo-element)
  columnDivider: 'table-th-divider',

  // Resize handle
  resizeHandle: 'absolute top-0 -right-2 w-4 h-full cursor-col-resize z-10',

  // Expandable table styles
  expandedRow: 'bg-surface',
  expandedContent: '!p-0 border-t border-border bg-surface',
  expandCellWrapper: 'flex items-center gap-sm w-full',
  expandButton:
    'inline-flex items-center justify-center p-0 border-none bg-transparent cursor-pointer text-text-muted transition-colors duration-200 flex-shrink-0 hover:text-text focus:outline-2 focus:outline-primary focus:outline-offset-2 focus:rounded-sm',
  expandCellContent: 'flex-1 overflow-hidden text-ellipsis whitespace-nowrap',

  // Selection cell label
  selectionCellLabel: 'flex items-center min-h-8 cursor-pointer',
} as const;

/**
 * Combine table styles conditionally
 */
export function getTableClasses(
  isResizing: boolean,
  tableLayout: 'fixed' | 'auto' = 'fixed'
): string {
  return [
    tableLayout === 'auto' ? tableStyles.tableAuto : tableStyles.table,
    tableStyles.tableSpacing,
    isResizing && tableStyles.resizing,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Get th classes based on position and state
 */
export function getThClasses(options: {
  isFirst: boolean;
  isLast: boolean;
  isSelectionCell?: boolean;
  isSortable?: boolean;
  isSticky?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}): string {
  const {
    isFirst,
    isLast,
    isSelectionCell,
    isSortable,
    isSticky,
    align,
    className,
  } = options;

  return [
    tableStyles.th,
    tableStyles.columnDivider,
    // Selection cell은 자체 first 스타일 포함하므로 thFirst 적용 안함
    isFirst && !isSelectionCell && tableStyles.thFirst,
    isSelectionCell && tableStyles.thSelectionCell,
    isLast && tableStyles.thLast,
    isSortable && 'sortable',
    isSticky && tableStyles.stickyLast,
    isSticky && tableStyles.stickyLastTh,
    isSticky && tableStyles.stickyLastTheadBg,
    align === 'left' && tableStyles.alignLeft,
    align === 'center' && tableStyles.alignCenter,
    align === 'right' && tableStyles.alignRight,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Get td classes based on position and state
 */
export function getTdClasses(options: {
  isFirst: boolean;
  isLast: boolean;
  isSelectionCell?: boolean;
  isActionCell?: boolean;
  isNoPad?: boolean;
  isFullRow?: boolean; // full row span (loading/empty states)
  isSticky?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}): string {
  const {
    isFirst,
    isLast,
    isSelectionCell,
    isActionCell,
    isNoPad,
    isFullRow,
    isSticky,
    align,
    className,
  } = options;

  return [
    tableStyles.td,
    // Selection cell은 자체 first 스타일 포함하므로 tdFirst 적용 안함
    isFirst && !isSelectionCell && tableStyles.tdFirst,
    isSelectionCell && tableStyles.tdSelectionCell,
    isLast && tableStyles.tdLast,
    isActionCell && tableStyles.tdActionCell,
    isNoPad && tableStyles.noPad,
    isNoPad && isFullRow && tableStyles.noPadFullRow,
    isNoPad && isFirst && !isFullRow && tableStyles.noPadFirst,
    isNoPad && isLast && !isFullRow && tableStyles.noPadLast,
    isSticky && tableStyles.stickyLast,
    isSticky && tableStyles.stickyLastTbodyBg,
    align === 'left' && tableStyles.alignLeft,
    align === 'center' && tableStyles.alignCenter,
    align === 'right' && tableStyles.alignRight,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Get tr classes based on state
 */
export function getTrClasses(options: {
  isError?: boolean;
  isSelected?: boolean;
  isClickable?: boolean;
  isExpanded?: boolean;
  className?: string;
}): string {
  const { isError, isSelected, isClickable, isExpanded, className } = options;

  return [
    tableStyles.tr,
    isError && tableStyles.trError,
    isSelected && tableStyles.trSelected,
    isClickable && tableStyles.trClickable,
    isExpanded && tableStyles.expandedRow,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
