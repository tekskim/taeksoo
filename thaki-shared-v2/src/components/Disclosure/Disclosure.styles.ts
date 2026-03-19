import { cva } from 'class-variance-authority';

export const disclosureSectionStyles = cva('block w-full disclosure-section', {
  variants: {
    disabled: {
      true: 'opacity-50 pointer-events-none',
    },
  },
});

export const disclosureHeaderStyles = cva(
  [
    'appearance-none border-none bg-transparent p-0',
    'flex items-center gap-sm cursor-pointer outline-none select-none',
    'focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary',
    'focus-visible:outline-offset-2 focus-visible:rounded-sm',
  ],
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed',
      },
    },
  }
);

export const disclosureIconWrapperStyles = cva(
  'flex items-center justify-center flex-shrink-0 transition-transform duration-200 ease-in-out',
  {
    variants: {
      expanded: {
        true: 'rotate-90',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      expanded: false,
    },
  }
);

export const disclosureLabelStyles =
  'font-sans text-14 font-medium leading-20 text-text whitespace-nowrap';

export const disclosureOptionalTextStyles =
  'text-12 font-normal leading-16 text-text-subtle';

export const disclosureContentStyles = 'w-full';
