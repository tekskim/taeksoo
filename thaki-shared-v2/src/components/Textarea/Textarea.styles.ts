import { cva, type VariantProps } from 'class-variance-authority';

export const textareaContainerStyles = 'w-full';

export const textareaVariants = cva(
  [
    'w-full border rounded-md',
    'font-sans font-normal leading-control',
    'bg-[var(--component-input-color-bg)]',
    'border-[var(--component-input-color-border)]',
    '[color:var(--component-input-color-text)]',
    'placeholder:text-[var(--component-input-color-placeholder)] placeholder:opacity-100',
    'transition-[border-color,background-color,box-shadow] duration-normal ease-in-out',
    'outline-none',
    'resize-y',
    'hover:enabled:border-[var(--component-input-color-borderFocus)]',
    'hover:enabled:bg-[var(--component-input-color-bgHover)]',
    'focus:border-[var(--component-input-color-borderFocus)]',
    'focus:bg-[var(--component-input-color-bg)]',
    'focus:shadow-[var(--semantic-control-border-focus-shadow)]',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-8 py-1.5 px-2 text-11',
        md: 'min-h-10 py-2 px-2.5 text-12',
        lg: 'min-h-[50px] py-2.5 px-3 text-14',
      },
      error: {
        true: [
          'border-[var(--component-input-color-borderError)]',
          'hover:enabled:border-[var(--component-input-color-borderError)]',
          'focus:border-[var(--component-input-color-borderError)]',
        ],
      },
      success: {
        true: [
          'border-[var(--component-input-color-borderSuccess)]',
          'hover:enabled:border-[var(--component-input-color-borderSuccess)]',
          'focus:border-[var(--component-input-color-borderSuccess)]',
        ],
      },
      disabled: {
        true: [
          'border-[var(--semantic-color-borderMuted)]',
          'bg-[var(--component-input-color-bgDisabled)]',
          '[color:var(--semantic-color-textMuted)]',
          'cursor-not-allowed',
          'resize-none',
          'placeholder:[color:var(--semantic-color-textLight)]',
        ],
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
      autoResize: {
        true: 'overflow-hidden resize-none',
      },
    },
    defaultVariants: {
      size: 'md',
      resize: 'vertical',
    },
  }
);

export const characterCountVariants = cva(
  'flex justify-end mt-xs text-[length:var(--semantic-font-sizeXs)] [color:var(--semantic-color-textMuted)] select-none',
  {
    variants: {
      near: {
        true: '[color:var(--semantic-color-warning)]',
      },
      over: {
        true: '[color:var(--semantic-color-error)]',
      },
    },
  }
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
