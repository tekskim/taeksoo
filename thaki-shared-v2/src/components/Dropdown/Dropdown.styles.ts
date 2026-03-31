import { cva } from 'class-variance-authority';

export const dropdownContainerStyles = cva('relative inline-block w-full min-w-[80px]', {
  variants: {
    loading: {
      true: 'opacity-50 pointer-events-none',
    },
  },
});

export const dropdownTriggerStyles = 'relative flex items-center w-full';

export const dropdownTriggerButtonStyles = cva(
  [
    'w-full flex items-center justify-between min-w-[80px]',
    'border border-solid border-border-strong rounded-base6',
    'font-sans font-normal text-12 leading-16',
    'bg-surface cursor-pointer',
    'transition-colors duration-normal ease-in-out',
    'hover:enabled:border-border-strong',
    'focus:outline-none focus:border-2 focus:border-primary',
    'disabled:bg-gray-200 disabled:border-border disabled:cursor-not-allowed disabled:text-text-subtle',
  ],
  {
    variants: {
      size: {
        sm: 'h-[28px] py-2 px-2.5 text-12 min-w-[80px]',
        md: 'h-[32px] py-2 px-2.5 text-12',
        lg: 'h-control-lg py-2.5 px-3 text-14 min-w-[140px]',
      },
      isInput: {
        true: 'pr-[calc(0.5rem+12px+0.5rem)]', // padding-right for icon
      },
      hasValue: {
        true: 'text-text',
        false: 'text-text-muted',
      },
    },
    defaultVariants: {
      size: 'md',
      hasValue: false,
    },
  }
);

export const dropdownValueStyles = 'text-left overflow-hidden text-ellipsis whitespace-nowrap';

export const dropdownArrowStyles = cva(
  [
    'flex-shrink-0 text-text',
    'transition-transform duration-normal ease-in-out',
    'pointer-events-none',
  ],
  {
    variants: {
      opened: {
        true: 'rotate-180',
      },
      isInput: {
        true: 'absolute right-2 top-1/2 -translate-y-1/2',
        false: 'ml-[var(--semantic-control-gap)]',
      },
    },
    compoundVariants: [
      {
        isInput: true,
        opened: true,
        class: '-translate-y-1/2 rotate-180',
      },
    ],
    defaultVariants: {
      opened: false,
      isInput: false,
    },
  }
);

export const dropdownOptionsStyles = cva(
  [
    'overflow-y-auto overflow-x-hidden',
    'text-text bg-surface',
    'border border-solid border-border-strong rounded-base6',
    'shadow-[0px_13px_4px_0px_rgba(0,0,0,0),0px_8px_3px_0px_rgba(0,0,0,0.01),0px_5px_3px_0px_rgba(0,0,0,0.05),0px_2px_2px_0px_rgba(0,0,0,0.09),0px_1px_1px_0px_rgba(0,0,0,0.1)]',
    'list-none p-0 m-0',
    'box-border',
  ],
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
  }
);

export const dropdownOptionStyles = cva(
  [
    'py-1.5 px-3',
    'text-12 leading-16 font-medium text-text',
    'cursor-pointer',
    'border-b border-border-subtle last:border-b-0',
    'transition-colors duration-normal ease-in-out',
    'hover:bg-surface-hover',
    'break-words',
  ],
  {
    variants: {
      size: {
        sm: 'py-1.5 px-3 text-12',
        md: 'py-1.5 px-3 text-12',
        lg: 'py-2 px-3 text-14',
      },
      focused: {
        true: 'bg-surface-hover',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const noResultStyles =
  'py-1.5 px-3 flex items-center text-12 leading-16 font-medium text-text-subtle';

export const noResultButtonStyles =
  'w-full h-full bg-transparent border-none outline-none text-text-subtle cursor-default';
