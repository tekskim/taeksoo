import { cva } from 'class-variance-authority';

export const overlayStyles = cva(
  'absolute top-0 left-0 w-full h-full z-[var(--semantic-z-overlay,2001)]',
  {
    variants: {
      global: {
        true: 'fixed z-[var(--semantic-z-overlay-global,2002)]',
      },
    },
  }
);

export const overlayContentStyles = cva('absolute bg-surface shadow-lg', {
  variants: {
    type: {
      'drawer-horizontal': [
        'w-fit max-w-[90vw] h-full top-0 right-0',
        'translate-x-full transition-transform duration-300 ease-in-out',
        'bg-surface border-l border-border shadow-lg',
        'flex flex-col overflow-y-hidden',
      ],
      'drawer-vertical': [
        'w-full h-fit left-0 bottom-0 absolute',
        'translate-y-full transition-transform duration-300 ease-in-out',
      ],
      modal: [
        'w-[21.5rem] h-fit',
        'top-1/2 left-1/2 absolute',
        'opacity-0 translate-x-[-50%] translate-y-[-50%] scale-95',
        'transition-[opacity,transform] duration-300 ease',
        'bg-[var(--component-modal-color-bg)] border border-border',
        'rounded-[var(--semantic-radius-modal)] shadow-[var(--semantic-shadow-modal)]',
        'overflow-hidden',
      ],
    },
    size: {
      sm: '',
      md: '',
    },
    appeared: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      type: 'drawer-horizontal',
      size: 'sm',
      className: 'w-[376px] max-w-[376px]',
    },
    {
      type: 'drawer-horizontal',
      size: 'md',
      className: 'w-[680px] max-w-[680px]',
    },
    {
      type: 'drawer-horizontal',
      appeared: true,
      className: 'translate-x-0',
    },
    {
      type: 'drawer-vertical',
      appeared: true,
      className: 'translate-y-0',
    },
    {
      type: 'modal',
      appeared: true,
      className: 'opacity-100 scale-100',
    },
  ],
  defaultVariants: {
    type: 'drawer-horizontal',
  },
});

export const overlayHeaderStyles = cva(
  'flex flex-col items-stretch gap-2 p-4 pb-0',
  {
    variants: {
      type: {
        'drawer-horizontal': 'px-6 pt-4 pb-0 [&>:first-child]:self-start',
        'drawer-vertical': '[&>:first-child]:self-end',
        modal: 'mb-3',
      },
    },
  }
);

// Title: 16px SemiBold, line-height 24px, text color
export const overlayTitleStyles =
  'm-0 [font-size:var(--semantic-font-size16)] font-semibold [line-height:var(--semantic-font-lineHeight24)] [color:var(--semantic-color-text)]';

// Description: 12px Regular, line-height 16px, textMuted color
export const overlayDescriptionStyles =
  'm-0 [font-size:var(--semantic-font-size12)] font-normal [line-height:var(--semantic-font-lineHeight16)] [color:var(--semantic-color-textMuted)] whitespace-normal break-words';

export const overlayBodyStyles = cva('text-text text-14 px-4', {
  variants: {
    type: {
      'drawer-horizontal': 'flex-1 overflow-y-auto px-6 pt-3 pb-6',
      'drawer-vertical': '',
      modal: '',
    },
  },
});

export const overlayFooterStyles = cva('', {
  variants: {
    type: {
      'drawer-horizontal': 'flex-shrink-0 mt-auto border-t border-border',
      'drawer-vertical': '',
      modal: '',
    },
  },
});

// Button styles for modal (full width)
export const overlayModalButtonStyles = 'w-full py-3 px-6 text-14';

// Default footer buttons
export const overlayButtonBaseStyles =
  'min-w-[80px] w-[152px] py-2 px-3 rounded-[var(--primitive-radius-base6)] text-12 font-medium leading-16 transition-colors duration-200';

export const overlayFooterWithButtonsStyles =
  'flex items-center justify-center gap-2 py-4 px-6';

export const overlayDrawerFooterBorderStyles = 'border-t border-border-subtle';
