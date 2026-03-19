import { cva, type VariantProps } from 'class-variance-authority';

export const titleVariants = cva('m-0 text-text cursor-inherit', {
  variants: {
    level: {
      1: 'text-xxl font-bold',
      2: 'text-xl font-bold',
      3: 'text-lg font-semibold',
      4: 'text-md font-medium',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-text-muted',
      text: 'text-text',
      'text-muted': 'text-text-muted',
      error: 'text-error',
      warning: 'text-warning',
      info: 'text-info',
      success: 'text-success',
    },
  },
  defaultVariants: {
    level: 1,
  },
});

export const textVariants = cva('m-0 cursor-inherit', {
  variants: {
    variant: {
      paragraph: 'text-sm text-text break-keep break-words whitespace-normal',
      detail: 'text-xs text-text',
      caption: 'text-xs text-text-muted',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-text-muted',
      text: 'text-text',
      'text-muted': 'text-text-muted',
      error: 'text-error',
      warning: 'text-warning',
      info: 'text-info',
      success: 'text-success',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
  },
});

export const labelVariants = cva('text-sm text-text font-medium cursor-inherit', {
  variants: {
    color: {
      primary: 'text-primary',
      secondary: 'text-text-muted',
      text: 'text-text',
      'text-muted': 'text-text-muted',
      error: 'text-error',
      warning: 'text-warning',
      info: 'text-info',
      success: 'text-success',
    },
  },
});

export type TitleVariants = VariantProps<typeof titleVariants>;
export type TextVariants = VariantProps<typeof textVariants>;
export type LabelVariants = VariantProps<typeof labelVariants>;
