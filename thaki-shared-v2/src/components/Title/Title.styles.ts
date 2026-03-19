import { cva, type VariantProps } from 'class-variance-authority';

export const titleWrapperVariants = cva('flex items-center', {
  variants: {
    size: {
      small: 'gap-1.5 text-14 leading-5 font-medium',
      medium: 'gap-1 text-14 leading-5 font-semibold',
      large: 'text-16 leading-6 font-semibold',
      xlarge: 'gap-1 text-18 leading-7 font-semibold',
    },
  },
  defaultVariants: {
    size: 'large',
  },
});

export const titleTextStyles = 'text-text m-0 font-inherit text-inherit leading-inherit';

export const counterTextStyles = 'text-text-muted m-0 font-medium text-inherit leading-inherit';

export const skeletonContainerVariants = cva('', {
  variants: {
    size: {
      small: 'h-5 w-[120px]',
      medium: 'h-5 w-[140px]',
      large: 'h-6 w-[160px]',
      xlarge: 'h-7 w-[200px]',
    },
  },
  defaultVariants: {
    size: 'large',
  },
});

export type TitleWrapperVariants = VariantProps<typeof titleWrapperVariants>;
