import { cva } from 'class-variance-authority';

export const inlineMessageVariants = cva('flex items-start gap-2 p-3 rounded-base8', {
  variants: {
    type: {
      success: 'bg-success-bg',
      info: 'bg-info-weak-bg',
      warning: 'bg-[var(--primitive-color-orange50)]',
      error: 'bg-danger-bg',
    },
  },
  defaultVariants: {
    type: 'info',
  },
});

export const inlineMessageStyles = {
  button:
    'flex w-full flex-1 gap-2 border-0 bg-transparent p-0 text-left cursor-pointer outline-none focus-visible:outline-none',
  content: 'flex min-w-0 flex-1 items-start gap-2',
  expandableContent: 'flex min-w-0 flex-1 items-start gap-2',
  text: 'flex-1 break-words font-sans text-11 font-normal leading-16 text-text',
  textCollapsed: 'overflow-hidden text-ellipsis whitespace-nowrap',
  timestamp: 'shrink-0 whitespace-nowrap font-sans text-11 font-normal leading-16 text-text',
  close:
    'flex shrink-0 items-center justify-center border-0 bg-transparent p-0 text-text cursor-pointer outline-none hover:opacity-70 focus-visible:outline-none',
  chevron:
    'shrink-0 transition-transform duration-[var(--semantic-transition-normal)] ease-[var(--semantic-transition-easeOut)]',
  chevronExpanded: 'rotate-180',
} as const;
