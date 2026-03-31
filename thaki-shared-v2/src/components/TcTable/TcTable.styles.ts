/**
 * TcTable styles
 *
 * Token-based, minimal table styling.
 * Cell edge rounding & side borders auto-applied via :first-child / :last-child.
 */

// ── Table ──────────────────────────────────────────
export const tableWrapperClassName = 'relative w-full overflow-x-scroll';
export const tableClassnames =
  'min-w-full w-fit-content table-fixed border-separate [border-spacing:0_var(--semantic-space-xs)] text-left bg-transparent';

// ── Header ─────────────────────────────────────────
export const thClassnames =
  'px-3 py-0 min-w-[50px] text-11 font-medium leading-16 text-text bg-inherit select-none';

// ── Cell ───────────────────────────────────────────
export const tdClassnames = 'px-3 py-sm text-xs leading-4 text-text align-middle bg-inherit';

export const tdContentClassnames = 'td-content flex items-center gap-2';

// ── Row ────────────────────────────────────────────
// Edge cells auto-rounded; side borders applied via :first-child / :last-child.
// NOTE: class strings MUST be literals — Tailwind's JIT scanner cannot resolve dynamic expressions.
export const trClassnames = [
  'h-10',
  // borders
  '[&>*]:border-y [&>*]:border-border',
  // edge rounding + side borders
  '[&>:first-child]:rounded-l-base6 [&>:first-child]:border-l',
  '[&>:last-child]:rounded-r-base6 [&>:last-child]:border-r',
  // default alignment — all cells left-aligned
  '[&>*]:text-left [&>*>.td-content]:justify-start',
  // explicit alignment overrides — text + flex justify paired
  '[&>.center]:text-center [&>.center>.td-content]:justify-center',
  '[&>.right]:text-right [&>.right>.td-content]:justify-end',
  // icon column override
  '[&>.icon-col]:text-center [&>.icon-col>.td-content]:justify-center',
].join(' ');

export const stickyLastColumnClassnames =
  '[&>:last-child]:sticky [&>:last-child]:right-0 [&>:last-child]:z-20 [&>:last-child]:bg-inherit [&>:last-child]:[box-shadow:-8px_0_10px_-10px_rgba(0,0,0,0.16)]';

// ── Icon column ───────────────────────────────────
export const iconColumnClassnames = 'icon-col w-[70px]';

export const theadTrClassnames = 'bg-border-subtle [&>*]:border-r';
export const bodyTrClassnames = 'bg-surface';
export const trClickableClassnames = 'cursor-pointer';

// ── Select cell ────────────────────────────────────
export const selectCellClassnames =
  'w-10 min-w-[50px] px-0 text-center cursor-pointer !border-r-none';
export const selectInnerClassnames = 'flex items-center justify-center h-full';

// ── Expand ─────────────────────────────────────────
export const expandButtonClassnames =
  'duration-200 hover:text-text focus:outline-2 focus:outline-primary focus:outline-offset-2 focus:rounded-sm';

export const expandIconClassnames = 'transition-transform duration-200';

export const expandIconExpandedClassnames = 'rotate-90';

// ── Sort ───────────────────────────────────────────
export const thContentClassnames =
  'inline-flex items-center gap-[var(--semantic-space-1-5)] max-w-full overflow-hidden';

export const thSortableClassnames = 'cursor-pointer hover:opacity-80';

export const thLabelClassnames = 'min-w-0 truncate';

export const sortIconClassnames =
  'inline-flex items-center justify-center text-text-muted opacity-40 shrink-0 transition-transform duration-200';

export const sortIconActiveClassnames = 'opacity-100 text-text';

export const sortIconAscClassnames = 'rotate-180';

// ── Empty ──────────────────────────────────────────
export const emptyTextClassnames = 'h-[300px] flex items-center justify-center text-text-muted';

// ── Expanded ───────────────────────────────────────
export const expandedTdClassnames =
  '!p-0 border border-border rounded-base6 bg-inherit overflow-hidden';

// ── Skeleton ───────────────────────────────────────
export const skeletonClassnames = 'h-full w-full rounded animate-skeleton';
