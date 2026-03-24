import { cva, type VariantProps } from 'class-variance-authority';

export const fieldsetVariants = cva('border-none p-0 m-0 relative w-full', {
  variants: {
    variant: {
      default: 'border border-transparent rounded-md p-md bg-transparent',
      bordered: 'border border-border rounded-md p-md bg-transparent',
      elevated:
        'border border-border rounded-md p-md bg-[var(--component-layout-surface-default-bg)] shadow-sm',
    },
    active: {
      true: 'border-2 border-primary',
    },
    disabled: {
      true: 'opacity-60 pointer-events-none',
    },
    error: {
      true: 'border-[var(--semantic-color-error)]',
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      error: true,
      class: 'border border-[var(--semantic-color-error)] rounded-md',
    },
  ],
  defaultVariants: {
    variant: 'default',
  },
});

export const legendVariants = cva(
  [
    'relative font-sans text-16 font-semibold',
    '[color:var(--semantic-color-text)]',
    'leading-tight',
    'px-sm mb-sm',
    'bg-inherit',
  ],
  {
    variants: {
      error: {
        true: '[color:var(--semantic-color-error)]',
      },
      disabled: {
        true: '[color:var(--semantic-color-textMuted)]',
      },
    },
  }
);

export const descriptionStyles =
  'font-sans text-[length:var(--semantic-font-sizeXs)] font-normal [color:var(--semantic-color-textMuted)] leading-normal px-sm pt-sm pb-lg m-0';

export const contentVariants = cva('flex gap-md w-full', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row flex-wrap',
    },
  },
  defaultVariants: {
    direction: 'vertical',
  },
});

export const errorMessageStyles =
  'font-sans text-[length:var(--semantic-font-sizeXs)] font-medium [color:var(--semantic-color-error)] leading-normal px-lg pb-md m-0 flex items-center gap-xs before:content-["⚠"] before:text-14 before:flex-shrink-0';

export type FieldsetVariants = VariantProps<typeof fieldsetVariants>;
