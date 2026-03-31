import { cva } from 'class-variance-authority';

export const radioGroupStyles = cva('flex gap-3 border-none p-0 m-0', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row flex-wrap gap-[var(--semantic-space-inline)]',
    },
    disabled: {
      true: 'opacity-60 cursor-not-allowed',
    },
  },
  defaultVariants: {
    direction: 'vertical',
  },
});

export const radioGroupLegendStyles =
  'block mb-[var(--semantic-space-inline)] text-sm text-text-muted';

export const radioGroupRequiredStyles = 'text-error mr-1';

export const radioGroupErrorStyles = 'text-xs text-error mt-[var(--semantic-space-inline)]';
