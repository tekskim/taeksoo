import { cva, type VariantProps } from 'class-variance-authority';

export const radioContainerStyles =
  'inline-flex items-center gap-1.5 cursor-pointer font-sans text-12 font-normal leading-16 text-text';

export const radioContainerDisabledStyles = 'cursor-not-allowed text-text-light';

export const radioInputVariants = cva(
  'control-input radio-input rounded-full text-sm shrink-0 self-center',
  {
    variants: {
      size: {
        xs: 'size-3 radio-sm',
        sm: 'size-[14px] radio-sm',
        md: 'size-4 radio-md',
        lg: 'size-[18px] radio-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const radioLabelStyles = 'cursor-pointer text-12 font-normal leading-16 text-text block';

export type RadioInputVariants = VariantProps<typeof radioInputVariants>;
