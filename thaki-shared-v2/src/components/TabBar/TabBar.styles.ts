import { cva } from 'class-variance-authority';

// TabBar container
export const tabBarContainerStyles = [
  'flex items-center flex-shrink-0 min-w-0 w-full max-w-full',
  'overflow-hidden relative mb-0',
  'bg-surface',
  'h-9',
  'border-b border-border',
  'text-[length:var(--primitive-font-size12,0.75rem)] leading-[var(--primitive-font-lineHeight18,1.125rem)]',
].join(' ');

// Tabs wrapper
export const tabsWrapperStyles = cva(
  [
    'flex gap-0 flex-1 min-w-0 items-center',
    'overflow-hidden pr-0 h-full',
    'transition-none',
  ],
  {
    variants: {
      scrollable: {
        true: [
          'overflow-x-auto',
          '[scrollbar-width:none] [-ms-overflow-style:none]',
          '[&::-webkit-scrollbar]:hidden',
        ],
      },
    },
  }
);

// Add tab button — 28x28, radius 4px, matching TDS --tabbar-add-size
export const addTabButtonStyles = [
  'flex-shrink-0 size-7 !p-0',
  'flex items-center justify-center',
  'mx-1 mb-0 rounded-sm',
  'hover:bg-surface-muted',
].join(' ');
