import { cva } from 'class-variance-authority';

// Tab selector container
export const tabSelectorStyles = cva(
  'flex items-center border-b border-border',
  {
    variants: {
      variant: {
        small: 'gap-4', // 16px - Figma TabMenuSmall
        medium: 'gap-6', // 24px - Figma Tab/Medium
        pill: [
          'gap-2 bg-surface-muted border-0', // gap-2 = 8px (Figma: spacing-xs)
          'border border-border-muted rounded-md', // rounded-md = 6px (Figma)
          'p-xxs w-fit', // p-xxs = 4px (Figma: spacing-xxs)
        ],
      },
      layout: {
        horizontal: '',
        vertical: 'flex-col items-stretch border-b-0 border-r border-border',
      },
    },
    defaultVariants: {
      variant: 'medium',
      layout: 'horizontal',
    },
  }
);

// Tab button
export const tabButtonStyles = cva(
  [
    'px-3 py-0 pb-2.5 bg-transparent cursor-pointer', // px-3=12px, pb-2.5=10px from Figma
    'transition-all duration-normal ease-out',
    'border-0 border-b-2 border-b-transparent', // border-b after border-0
    'whitespace-nowrap min-w-[80px] relative text-center', // min-w + text-center from Figma
    'text-text-subtle font-medium font-sans', // Figma: color-text-subtle (#64748b)
    'hover:not-disabled:text-text',
    'disabled:cursor-not-allowed disabled:opacity-disabled',
  ],
  {
    variants: {
      variant: {
        small: 'text-[12px] leading-[16px]', // 12px/16px
        medium: 'text-[14px] leading-[20px]', // 14px/20px
        pill: [
          'flex justify-center items-center min-w-[100px]', // Figma: w-[100px]
          'py-2 px-3 gap-1', // py-2 = 8px, px-3 = 12px, gap-1 = 4px (Figma)
          'text-[11px] leading-[16px]', // Figma: font-size-11, line-height-16
          'border border-transparent rounded-md', // rounded-md = 6px (Figma)
          'text-text', // Figma: color-text-default for inactive
          'hover:not-disabled:bg-transparent',
        ],
      },
      active: {
        true: '',
      },
      layout: {
        horizontal: '',
        vertical:
          'text-left border-b-transparent border-r-2 border-r-transparent',
      },
    },
    compoundVariants: [
      // Default variants - active state
      {
        variant: 'small',
        active: true,
        className: 'border-b-primary text-primary',
      },
      {
        variant: 'medium',
        active: true,
        className: 'border-b-primary text-primary',
      },
      // Pill variant - active state (Figma: white bg, default border, primary text)
      {
        variant: 'pill',
        active: true,
        className: 'border border-border-muted bg-surface text-primary',
      },
      // Vertical layout - active state (small/medium)
      {
        layout: 'vertical',
        active: true,
        variant: 'small',
        className: 'border-r-primary border-b-transparent',
      },
      {
        layout: 'vertical',
        active: true,
        variant: 'medium',
        className: 'border-r-primary border-b-transparent',
      },
    ],
    defaultVariants: {
      variant: 'medium',
      active: false,
      layout: 'horizontal',
    },
  }
);
