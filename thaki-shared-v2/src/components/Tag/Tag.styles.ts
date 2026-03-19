import { cva, type VariantProps } from 'class-variance-authority';

export const tagVariants = cva(
  // Base styles - py: 4px, ps: 8px, pe: 6px, gap: 6px, radius: 6px
  'inline-flex items-center gap-1.5 py-1 ps-2 pe-1.5 bg-transparent border rounded-base6',
  {
    variants: {
      variant: {
        filter: 'bg-surface border-border text-text',
        multiSelect: 'bg-surface border-primary text-text',
      },
    },
    defaultVariants: {
      variant: 'filter',
    },
  }
);

// Text content wrapper - gap: 4px between label, separator, value
export const tagTextWrapperStyles =
  'inline-flex items-center gap-1 font-sans text-11 leading-16 font-medium whitespace-nowrap';

export const tagTextStyles = 'text-inherit';

export const tagSeparatorBase = 'text-border';

export const tagCloseButtonStyles =
  'flex items-center justify-center p-0 bg-transparent border-none cursor-pointer text-inherit transition-opacity duration-200 ease-out hover:opacity-[0.64] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1 focus-visible:rounded-base4 motion-reduce:transition-none';

export type TagVariants = VariantProps<typeof tagVariants>;
