import { cva, type VariantProps } from 'class-variance-authority';

export const formFieldVariants = cva('flex flex-col gap-sm w-full', {
  variants: {
    disabled: {
      true: 'opacity-60 pointer-events-none',
    },
    error: {
      true: '',
    },
    success: {
      true: '',
    },
  },
});

export const labelVariants = cva(
  [
    'flex items-baseline gap-xs',
    'font-sans text-14 font-medium leading-20',
    '[color:var(--semantic-color-text)]',
    'cursor-pointer',
  ],
  {
    variants: {
      disabled: {
        true: '[color:var(--semantic-color-textMuted)] cursor-not-allowed',
      },
      error: {
        true: '[color:var(--semantic-color-error)]',
      },
      success: {
        true: '[color:var(--semantic-color-success)]',
      },
      focused: {
        true: '[color:var(--semantic-color-primary)]',
      },
    },
  }
);

export const descriptionStyles =
  'flex items-start gap-xs [color:var(--semantic-color-textMuted)] text-12 leading-16 font-normal m-0 w-full';

export const requiredIndicatorStyles =
  '[color:var(--semantic-color-error)] font-medium flex-shrink-0 ml-xs';

export const controlStyles = 'relative w-full';

export const messageAreaStyles = 'min-h-4 flex items-start';

export const hintStyles =
  'font-sans text-11 font-normal [color:var(--semantic-color-textMuted)] m-0 leading-16';

export const successStyles =
  'font-sans text-11 font-normal [color:var(--semantic-color-success)] m-0 leading-16 flex items-center gap-xs before:content-["✓"] before:text-14 before:font-bold';

export const errorStyles =
  'font-sans text-11 font-normal [color:var(--semantic-color-error)] m-0 leading-16';

export type FormFieldVariants = VariantProps<typeof formFieldVariants>;
