type Direction =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom';

type Size = { width: number; height: number };
type Viewport = { width: number; height: number };
type Rect = { top: number; bottom: number; left: number; right: number };

export type { Direction, Rect, Size, Viewport };
