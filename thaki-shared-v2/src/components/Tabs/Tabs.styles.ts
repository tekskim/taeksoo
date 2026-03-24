import { cva } from 'class-variance-authority';

export const tabContainerStyles = 'flex flex-col';

export const tabContentStyles = 'flex-1 pt-0';

export const tabNoneStyles = 'hidden';

export const tabChildrenStyles = 'pt-6';

export const tabHeaderWrapperStyles = 'flex items-center relative w-full overflow-hidden';

export const scrollButtonStyles = cva(
  [
    'flex items-center justify-center',
    'min-w-8 h-8 p-0',
    'bg-surface border-none rounded-sm',
    'cursor-pointer z-raised flex-shrink-0',
    'transition-all duration-normal ease-out',
    'hover:not-disabled:bg-surface-hover',
  ],
  {
    variants: {
      position: {
        left: 'mr-xs',
        right: 'ml-xs',
      },
      disabled: {
        true: 'opacity-disabled cursor-not-allowed',
      },
    },
  }
);

export const tabHeaderStyles = cva(['inline-flex items-stretch min-w-0', 'relative'], {
  variants: {
    variant: {
      line: ['border-b border-border', 'gap-2'],
      button: [
        'bg-surface-subtle',
        'shadow-[inset_0_0_0_1px_var(--semantic-color-borderSubtle)]',
        'rounded-lg',
        'p-1 gap-1',
        'h-10',
        '!w-fit',
      ],
    },
    scrollable: {
      true: [
        'overflow-x-auto overflow-y-hidden',
        'scrollbar-hide',
        'flex-nowrap flex-1 min-w-0 w-full',
        'px-sm -mx-sm',
        '[scrollbar-width:none] [-ms-overflow-style:none]',
        '[&::-webkit-scrollbar]:hidden',
      ],
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
  },
  defaultVariants: {
    variant: 'line',
  },
});

export const tabButtonStyles = cva(
  [
    'bg-transparent',
    'border-0',
    'cursor-pointer',
    'whitespace-nowrap flex-shrink-0 min-w-[80px] text-center',
    'font-medium font-sans',
    'relative',
    'transition-colors duration-150 ease-out',
    'disabled:opacity-disabled disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'text-12 leading-4',
        md: 'text-14 leading-5',
      },
      variant: {
        line: [
          'flex flex-col items-center gap-[10px]',
          'px-0 pt-0 pb-0',
          'text-text-subtle',
          'after:content-[""] after:relative after:w-full after:h-[2px] after:bg-transparent after:z-20',
        ],
        button: ['flex items-center justify-center', 'border-none', 'text-text'],
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'line',
        active: true,
        className: 'text-primary after:bg-primary',
      },
      {
        variant: 'line',
        active: false,
        className: 'hover:text-text',
      },
      {
        variant: 'button',
        size: 'sm',
        className: 'text-12 leading-4 h-8 px-3 min-w-[80px] rounded-md',
      },
      {
        variant: 'button',
        size: 'md',
        className: 'h-8 px-3 min-w-[80px] rounded-md',
      },
      {
        variant: 'button',
        active: true,
        className:
          'bg-surface shadow-[inset_0_0_0_1px_var(--semantic-color-border),0_1px_2px_0_rgba(0,0,0,0.05)] text-primary',
      },
      {
        variant: 'button',
        active: false,
        className: 'bg-transparent text-text hover:bg-surface',
      },
    ],
    defaultVariants: {
      size: 'sm',
      variant: 'line',
      active: false,
    },
  }
);
