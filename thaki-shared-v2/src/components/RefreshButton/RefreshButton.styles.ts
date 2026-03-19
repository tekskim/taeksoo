import { cva, type VariantProps } from 'class-variance-authority';

export const refreshContainerVariants = cva('relative border-primary', {
  variants: {
    size: {
      sm: 'h-5',
      md: 'h-6',
      lg: 'h-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const refreshIconStyles = 'flex items-center justify-center';

export const refreshRotateStyles = 'animate-spin';

export const refreshCountVariants = cva(
  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-inherit',
  {
    variants: {
      size: {
        sm: 'text-[0.6rem]',
        md: 'text-[0.65rem]',
        lg: 'text-[0.7rem]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export type RefreshContainerVariants = VariantProps<typeof refreshContainerVariants>;
export type RefreshCountVariants = VariantProps<typeof refreshCountVariants>;
