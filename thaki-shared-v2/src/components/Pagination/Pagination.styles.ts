import { cva } from 'class-variance-authority';

export const paginationContainerStyles = 'inline-flex items-center';

// height: 24px, gap: 8px
export const pageListStyles = 'flex items-center gap-2 list-none p-0 m-0 h-6';

export const navButtonStyles = cva(
  // size: 24x24px, radius: 4px, font: 12px/16px Medium (matches TDS)
  [
    'flex items-center justify-center',
    'min-w-6 h-6 p-0 bg-transparent font-sans font-medium',
    '[border-radius:4px]',
    '[font-size:var(--semantic-font-size12)]',
    '[line-height:var(--semantic-font-lineHeight16)]',
    'transition-colors duration-150 ease',
    'hover:enabled:bg-surface-hover',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1',
    'disabled:opacity-100 disabled:[color:#94a3b8] disabled:cursor-not-allowed disabled:hover:bg-transparent',
  ],
  {
    variants: {
      type: {
        icon: '[color:var(--semantic-color-text)]',
        page: '[color:var(--semantic-color-textMuted)]',
        setting: '[color:var(--semantic-color-borderStrong)]',
      },
      current: {
        true: '[background-color:var(--semantic-color-primary)] [color:var(--semantic-color-onPrimary)] pointer-events-none disabled:opacity-100 disabled:[color:var(--semantic-color-onPrimary)]',
      },
    },
    defaultVariants: {
      type: 'page',
      current: false,
    },
  }
);

// ellipsis: 24x24px, text-muted color
export const ellipsisStyles = [
  'flex items-center justify-center min-w-6 h-6',
  '[color:var(--semantic-color-textMuted)]',
  '[font-size:var(--semantic-font-size12)]',
  '[line-height:var(--semantic-font-lineHeight16)]',
  'select-none pointer-events-none',
].join(' ');

// divider: vertical bar, 16px height, 1px width
export const dividerStyles = ['w-px h-4', '[background-color:var(--semantic-color-border)]'].join(
  ' '
);

// total count: text-subtle color, 11px font, regular weight (matches TDS text-body-sm)
export const totalCountStyles = [
  'flex items-center gap-0.5 h-6',
  '[color:var(--semantic-color-textSubtle)]',
  '[font-size:var(--semantic-font-size11)]',
  '[line-height:var(--semantic-font-lineHeight16)]',
  'font-sans font-normal whitespace-nowrap',
].join(' ');
