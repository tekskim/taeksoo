import { cva, type VariantProps } from 'class-variance-authority';

export const spinnerVariants = cva('inline-block relative', {
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const spinnerInnerVariants = cva('rounded-full border-solid animate-spin', {
  variants: {
    size: {
      xs: 'size-3 border-[1.5px]',
      sm: 'size-4 border-2',
      md: 'size-6 border-[3px]',
      lg: 'size-8 border-4',
    },
    color: {
      primary: 'spinner-primary',
      secondary: 'spinner-secondary',
      white: 'spinner-white',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
export type SpinnerInnerVariants = VariantProps<typeof spinnerInnerVariants>;
