import { cva } from 'class-variance-authority';

// Tab item container
export const tabItemStyles = cva(
  [
    'inline-flex items-center gap-2',
    'px-3',
    'bg-surface-subtle',
    'border-0 border-solid border-border-subtle border-r',
    'rounded-none cursor-pointer relative',
    'w-[160px] h-full',
    'select-none mb-0',
    'hover:bg-surface-muted',
    'group',
  ],
  {
    variants: {
      active: {
        true: [
          'bg-surface',
          'border-0 border-solid border-r border-border-subtle',
          'rounded-none shadow-none z-[2]',
        ],
      },
      isDragging: {
        true: 'opacity-60 cursor-grabbing z-[2]',
      },
      isDragOver: {
        true: 'border border-dashed border-primary bg-surface-hover',
      },
      alwaysShowClose: {
        true: '',
      },
    },
  },
);

// Tab title text
export const tabTitleStyles = cva(
  [
    'flex-1 whitespace-nowrap overflow-hidden text-ellipsis',
    'text-text-muted',
    '[font-size:var(--primitive-font-size12)]',
    '[font-weight:var(--primitive-font-weightRegular,400)]',
    '[line-height:var(--primitive-font-lineHeight16)]',
    'font-sans',
  ],
  {
    variants: {
      active: {
        true: 'text-text [font-weight:var(--primitive-font-weightMedium)]',
      },
    },
  },
);

// Close button
export const closeButtonStyles = cva(
  [
    'hidden items-center justify-center',
    'border-none bg-transparent cursor-pointer',
    'text-text-muted flex-shrink-0',
  ],
  {
    variants: {
      active: {
        true: 'inline-flex',
      },
      showOnHover: {
        true: 'group-hover:inline-flex',
      },
      alwaysShow: {
        true: 'inline-flex',
      },
    },
  },
);

// Title skeleton (로딩 중일 때)
export const tabTitleSkeletonStyles = 'flex-1 flex items-center';
