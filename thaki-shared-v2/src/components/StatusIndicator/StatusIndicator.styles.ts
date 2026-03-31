import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Color scheme styles - maps color scheme to background color
 */
export const colorSchemeStyles = {
  success: 'bg-[var(--primitive-color-green400)]',
  danger: 'bg-[var(--primitive-color-red400)]',
  warning: 'bg-[var(--primitive-color-orange400)]',
  muted: 'bg-[var(--primitive-color-slate500)]',
  info: 'bg-[var(--primitive-color-blue400)]',
} as const;

export const statusIndicatorVariants = cva(
  'inline-flex !w-fit items-center justify-center gap-1 px-1.5 py-1 rounded-2xl text-text-inverse font-sans text-11 leading-16 font-medium whitespace-nowrap',
  {
    variants: {
      // Keep variant for backward compatibility (used by existing code)
      // Now color is applied via colorSchemeStyles
      variant: {
        active: '',
        error: '',
        suspended: '',
        shelved: '',
        shutoff: '',
        paused: '',
        building: '',
      },
      iconOnly: {
        true: 'p-1 rounded-full !w-6 !h-6', // 24x24px container, inner icon 16x16px
        false: '',
      },
    },
    defaultVariants: {
      iconOnly: false,
    },
  }
);

export const statusLabelStyles = 'text-center';

export type StatusIndicatorVariants = VariantProps<typeof statusIndicatorVariants>;
