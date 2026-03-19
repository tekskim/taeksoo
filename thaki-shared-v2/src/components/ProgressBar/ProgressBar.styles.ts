import { cva, type VariantProps } from 'class-variance-authority';

export const progressContainerStyles = 'flex flex-col gap-xs w-full m-0';

export const progressHeaderStyles = 'flex justify-between items-center';

export const progressLabelStyles = 'text-text text-14 font-medium leading-5';

export const progressPercentageStyles = 'text-text text-12 font-normal leading-4 flex items-center gap-1';

export const progressInfinityStyles = 'flex items-center gap-1';

export const progressDetailStyles = 'opacity-70';

export const progressWrapperStyles = 'relative w-full block h-1';

export const progressTrackVariants = cva(
  'progress-track w-full h-full block rounded-lg overflow-hidden focus:outline-2 focus:outline-primary focus:outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'progress-primary',
        success: 'progress-success',
        warning: 'progress-warning',
        danger: 'progress-danger',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
);

export const progressPendingOverlayVariants = cva(
  'absolute top-0 bottom-0 h-full opacity-40 rounded-r-lg transition-all duration-normal ease-in-out pointer-events-none z-[1]',
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        danger: 'bg-error',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
);

export type ProgressTrackVariants = VariantProps<typeof progressTrackVariants>;
export type ProgressPendingOverlayVariants = VariantProps<typeof progressPendingOverlayVariants>;
