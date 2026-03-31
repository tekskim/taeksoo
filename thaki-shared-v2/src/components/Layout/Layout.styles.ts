/**
 * Layout component Tailwind styles using CVA
 */
import { cva } from 'class-variance-authority';

// Container styles
export const containerStyles = cva('w-full', {
  variants: {
    maxWidth: {
      sm: 'max-w-[640px]',
      md: 'max-w-[768px]',
      lg: 'max-w-[1024px]',
      xl: 'w-full',
    },
    padding: {
      sm: 'p-[var(--component-layout-padding-sm)]',
      md: 'p-[var(--component-layout-padding-md)]',
      lg: 'p-[var(--component-layout-padding-lg)]',
    },
  },
});

// Block styles
export const blockStyles = cva(
  [
    'border border-border bg-[var(--component-layout-surface-default-bg)]',
    'rounded-[var(--component-layout-radius-md)] shadow-[var(--component-layout-shadow)]',
    'flex flex-col relative',
  ],
  {
    variants: {
      variant: {
        default: 'border-border bg-[var(--component-layout-surface-default-bg)]',
        secondary: 'border-border-muted bg-[var(--component-layout-surface-secondary-bg)]',
        info: 'border-[var(--component-layout-surface-info-border)] bg-[var(--component-layout-surface-info-bg)]',
        success: 'border-success bg-[var(--component-layout-surface-success-bg)]',
        warning: 'border-warning bg-warning-light',
        error: 'border-error bg-error-light',
      },
      padding: {
        sm: 'p-[var(--component-layout-padding-sm)]',
        md: 'p-[var(--component-layout-padding-md)]',
        lg: 'p-[var(--component-layout-padding-lg)]',
      },
      borderRadius: {
        sm: 'rounded-[var(--component-layout-radius-sm)]',
        md: 'rounded-[var(--component-layout-radius-md)]',
        lg: 'rounded-[var(--component-layout-radius-lg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Block header styles
export const blockHeaderStyles =
  'py-[var(--component-layout-padding-md)] px-[var(--component-layout-padding-lg)] border-b border-border flex items-center gap-[var(--component-layout-section-header-gap)] flex-shrink-0';

// Block icon styles
export const blockIconStyles = 'text-lg text-text-muted flex items-center justify-center';

// Block header text wrapper
export const blockHeaderTextStyles = 'flex-1 min-w-0';

// Block title styles
export const blockTitleStyles =
  'text-[var(--component-layout-section-title-size)] font-[var(--component-layout-section-title-weight)] text-text m-0 leading-tight';

// Block subtitle styles
export const blockSubtitleStyles =
  'text-[var(--component-layout-section-subtitle-size)] text-text-muted mt-xs mb-0 leading-normal';

// Block content styles
export const blockContentStyles = 'p-[var(--component-layout-padding-lg)] flex-1 flex flex-col';

// Stack styles
export const stackStyles = cva('flex min-w-0', {
  variants: {
    direction: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    gap: {
      xs: 'gap-[var(--component-layout-gap-xs)]',
      sm: 'gap-[var(--component-layout-gap-sm)]',
      md: 'gap-[var(--component-layout-gap-md)]',
      lg: 'gap-[var(--component-layout-gap-lg)]',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: '',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    wrap: false,
  },
});

// Grid container styles
export const gridContainerStyles = cva('grid gap-[var(--component-layout-grid-gap)]', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    },
    gap: {
      xs: 'gap-[var(--component-layout-gap-xs)]',
      sm: 'gap-[var(--component-layout-gap-sm)]',
      md: 'gap-[var(--component-layout-gap-md)]',
      lg: 'gap-[var(--component-layout-gap-lg)]',
    },
  },
  defaultVariants: {
    columns: 12,
  },
});

// Grid item styles
export const gridItemStyles = cva('col-span-1', {
  variants: {
    colSpan: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
      full: 'col-span-full',
    },
    colStart: {
      1: 'col-start-1',
      2: 'col-start-2',
      3: 'col-start-3',
      4: 'col-start-4',
      5: 'col-start-5',
      6: 'col-start-6',
    },
  },
});

// Divider styles
export const dividerStyles = cva('border-none m-0', {
  variants: {
    direction: {
      horizontal: 'h-px w-full bg-border',
      vertical: 'w-px h-full bg-border',
    },
    spacing: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    // Horizontal spacing
    {
      direction: 'horizontal',
      spacing: 'xs',
      class: 'my-[var(--component-layout-gap-xs)]',
    },
    {
      direction: 'horizontal',
      spacing: 'sm',
      class: 'my-[var(--component-layout-gap-sm)]',
    },
    {
      direction: 'horizontal',
      spacing: 'md',
      class: 'my-[var(--component-layout-gap-md)]',
    },
    {
      direction: 'horizontal',
      spacing: 'lg',
      class: 'my-[var(--component-layout-gap-lg)]',
    },
    // Vertical spacing
    {
      direction: 'vertical',
      spacing: 'xs',
      class: 'mx-[var(--component-layout-gap-xs)] my-0',
    },
    {
      direction: 'vertical',
      spacing: 'sm',
      class: 'mx-[var(--component-layout-gap-sm)] my-0',
    },
    {
      direction: 'vertical',
      spacing: 'md',
      class: 'mx-[var(--component-layout-gap-md)] my-0',
    },
    {
      direction: 'vertical',
      spacing: 'lg',
      class: 'mx-[var(--component-layout-gap-lg)] my-0',
    },
  ],
  defaultVariants: {
    direction: 'horizontal',
  },
});
