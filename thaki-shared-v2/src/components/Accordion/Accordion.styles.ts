import { cva } from 'class-variance-authority';

export const accordionGroupStyles = 'flex flex-col w-full';

export const accordionItemStyles = cva(
  'block relative w-full accordion-item group',
  {
    variants: {
      disabled: {
        true: '',
      },
    },
  },
);

export const accordionHeaderStyles = cva(
  [
    'block w-full cursor-pointer outline-none bg-transparent border-none p-0',
    'accordion-header',
  ],
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
    },
  },
);

export const accordionContentStyles = [
  'accordion-content',
  'grid grid-rows-[0fr] overflow-hidden',
  'transition-[grid-template-rows] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
  'group-data-[open=true]:grid-rows-[1fr] group-data-[open=true]:duration-[400ms] group-data-[open=true]:overflow-x-auto group-data-[open=true]:overflow-y-hidden group-data-[open=true]:bg-surface',
  '[&>*]:min-h-0 [&>*]:opacity-0 [&>*]:transition-opacity [&>*]:duration-[250ms] [&>*]:ease-[cubic-bezier(0.16,1,0.3,1)]',
  'group-data-[open=true]:[&>*]:opacity-100 group-data-[open=true]:[&>*]:duration-[300ms] group-data-[open=true]:[&>*]:delay-[100ms]',
].join(' ');
