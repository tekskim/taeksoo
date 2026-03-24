import { cva, type VariantProps } from 'class-variance-authority';

/** Container: flex, gap 6px, items center */
export const checkboxContainerStyles = 'inline-flex items-center gap-[6px] cursor-pointer';

export const checkboxContainerDisabledStyles = 'cursor-not-allowed opacity-50';

/** Checkbox input: 16x16, border 2px, border-radius 4px */
export const checkboxInputVariants = cva(
  'control-input checkbox-input relative rounded-[4px] transition-[background-color,border-color] duration-150 ease-linear shrink-0',
  {
    variants: {
      size: {
        xs: 'size-3 checkbox-sm',
        sm: 'size-4 checkbox-sm',
        md: 'size-4 checkbox-md',
        lg: 'size-[18px] checkbox-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/** Label: 12px font, 16px line-height, regular weight, default text color */
export const checkboxLabelStyles =
  'cursor-pointer text-[12px] font-normal leading-[16px] text-text';

export type CheckboxInputVariants = VariantProps<typeof checkboxInputVariants>;
