import { cva } from 'class-variance-authority';

export const paginationContainerStyles = 'inline-flex items-center';

// height: 24px, gap: 8px
export const pageListStyles = 'flex items-center gap-2 list-none p-0 m-0 h-6';

export const navButtonStyles = cva(
  // size: 24x24px, radius: 6px, font: 11px/16px Medium
  [
    'flex items-center justify-center',
    'min-w-6 h-6 p-0 bg-transparent font-sans font-medium',
    '[border-radius:var(--semantic-radius-base6)]',
    '[font-size:var(--semantic-font-size11)]',
    '[line-height:var(--semantic-font-lineHeight16)]',
    'transition-colors duration-200 ease',
    'hover:enabled:bg-surface-hover',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-0.5',
    'disabled:color-border-strong',
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

// ellipsis: 24x24px, text-light color
export const ellipsisStyles = [
  'flex items-center justify-center min-w-6 h-6',
  '[color:var(--semantic-color-textLight)]',
  '[font-size:var(--semantic-font-size11)]',
  '[line-height:var(--semantic-font-lineHeight16)]',
  'select-none pointer-events-none',
].join(' ');

// divider: vertical bar, 16px height, 1px width
export const dividerStyles = [
  'w-px h-4',
  '[background-color:var(--semantic-color-border)]',
].join(' ');

// total count: text-muted color, 11px font
export const totalCountStyles = [
  'flex items-center gap-0.5 h-6',
  '[color:var(--semantic-color-textMuted)]',
  '[font-size:var(--semantic-font-size11)]',
  '[line-height:var(--semantic-font-lineHeight16)]',
  'font-sans font-medium whitespace-nowrap',
].join(' ');
