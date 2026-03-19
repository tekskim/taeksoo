import { cva } from 'class-variance-authority';

// TabContainer root (layout only)
export const tabContainerStyles =
  'flex-1 flex flex-col min-h-0 overflow-hidden';

// Min-width wrapper used *inside* the scrollable tab panel
export const tabContainerRootStyles =
  'min-w-[1240px] pt-4 px-8 pb-20 box-border';

// Tab content panel (scrollable container)
// NOTE: `scrollbar-gutter: stable` prevents layout shift when scrollbar appears/disappears
export const tabContentStyles = cva(
  [
    // NOTE: `min-w-0/min-h-0` are required so the panel can shrink below its
    'flex-1 min-w-0 min-h-0 overflow-auto [scrollbar-gutter:stable]',
    'bg-surface box-border relative select-text',
    'hidden',
  ],
  {
    variants: {
      active: {
        true: 'flex flex-col z-[1]',
      },
    },
  }
);

// Error state
export const errorStyles =
  'flex items-center justify-center h-full text-error text-[length:var(--semantic-typography-body-md-font-size)]';
