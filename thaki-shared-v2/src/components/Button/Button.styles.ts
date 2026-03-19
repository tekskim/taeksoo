import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-1.5',
    'font-sans font-medium',
    'transition-colors duration-normal ease-in-out',
    'cursor-pointer border-none outline-none box-border',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    '[&>*]:flex-shrink-0 [&>*]:min-w-0',
  ],
  {
    variants: {
      appearance: {
        solid: '',
        outline: 'border border-solid',
        ghost: '',
      },
      variant: {
        primary: '',
        secondary: '',
        tertiary: '',
        success: '',
        error: '',
        warning: '',
        muted: '',
      },
      size: {
        xs: 'w-6 h-6 p-0 rounded-full text-11 leading-4',
        sm: 'h-control-sm px-2.5 py-1.5 rounded-md text-11 leading-4',
        md: 'h-control-md px-3 py-2 rounded-md text-11 leading-4',
        lg: 'h-control-lg px-4 py-2.5 rounded-md text-12 leading-5',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      iconOnly: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Icon-only: square buttons with width = height, centered content
      {
        size: 'sm',
        iconOnly: true,
        class: 'w-[var(--semantic-control-height-sm)] px-0',
      },
      {
        size: 'md',
        iconOnly: true,
        class: 'w-[var(--semantic-control-height-md)] px-0',
      },
      {
        size: 'lg',
        iconOnly: true,
        class: 'w-[var(--semantic-control-height-lg)] px-0',
      },

      // ===== SOLID =====
      // NOTE: Using [color:...] instead of text-[...] to avoid tailwind-merge conflict with text-{size} classes
      {
        appearance: 'solid',
        variant: 'primary',
        class:
          'bg-[var(--component-button-solid-primary-bg)] [color:var(--component-button-solid-primary-text)] hover:enabled:bg-[var(--component-button-solid-primary-bgHover)]',
      },
      {
        appearance: 'solid',
        variant: 'secondary',
        class:
          'bg-[var(--component-button-solid-secondary-bg)] [color:var(--component-button-solid-secondary-text)] hover:enabled:bg-[var(--component-button-solid-secondary-bgHover)]',
      },
      {
        appearance: 'solid',
        variant: 'tertiary',
        class:
          'bg-[var(--component-button-solid-tertiary-bg)] [color:var(--component-button-solid-tertiary-text)] hover:enabled:bg-[var(--component-button-solid-tertiary-bgHover)]',
      },
      {
        appearance: 'solid',
        variant: 'success',
        class:
          'bg-[var(--component-button-solid-success-bg)] [color:var(--component-button-solid-success-text)] hover:enabled:bg-[var(--component-button-solid-success-bgHover)]',
      },
      {
        appearance: 'solid',
        variant: 'error',
        class:
          'bg-[var(--component-button-solid-error-bg)] [color:var(--component-button-solid-error-text)] hover:enabled:bg-[var(--component-button-solid-error-bgHover)]',
      },
      {
        appearance: 'solid',
        variant: 'warning',
        class:
          'bg-[var(--component-button-solid-warning-bg)] [color:var(--component-button-solid-warning-text)] hover:enabled:bg-[var(--component-button-solid-warning-bgHover)]',
      },
      {
        appearance: 'solid',
        variant: 'muted',
        class:
          'bg-[var(--component-button-solid-muted-bg)] [color:var(--component-button-solid-muted-text)] hover:enabled:bg-[var(--component-button-solid-muted-bgHover)]',
      },

      // ===== OUTLINE =====
      {
        appearance: 'outline',
        variant: 'primary',
        class:
          'bg-[var(--component-button-outline-primary-bg)] [color:var(--component-button-outline-primary-text)] border-[var(--component-button-outline-primary-border)] hover:enabled:bg-[var(--component-button-outline-primary-bgHover)] hover:enabled:[color:var(--component-button-outline-primary-textHover)] hover:enabled:border-[var(--component-button-outline-primary-borderHover)]',
      },
      {
        appearance: 'outline',
        variant: 'secondary',
        class:
          'bg-[var(--component-button-outline-secondary-bg)] [color:var(--component-button-outline-secondary-text)] border-border-strong hover:enabled:bg-[var(--component-button-outline-secondary-bgHover)] hover:enabled:[color:var(--component-button-outline-secondary-textHover)]',
      },
      {
        appearance: 'outline',
        variant: 'tertiary',
        class:
          'bg-[var(--component-button-outline-tertiary-bg)] [color:var(--component-button-outline-tertiary-text)] border-[var(--component-button-outline-tertiary-border)] hover:enabled:bg-[var(--component-button-outline-tertiary-bgHover)] hover:enabled:[color:var(--component-button-outline-tertiary-textHover)] hover:enabled:border-[var(--component-button-outline-tertiary-borderHover)]',
      },
      {
        appearance: 'outline',
        variant: 'success',
        class:
          'bg-[var(--component-button-outline-success-bg)] [color:var(--component-button-outline-success-text)] border-[var(--component-button-outline-success-border)] hover:enabled:bg-[var(--component-button-outline-success-bgHover)] hover:enabled:[color:var(--component-button-outline-success-textHover)] hover:enabled:border-[var(--component-button-outline-success-borderHover)]',
      },
      {
        appearance: 'outline',
        variant: 'error',
        class:
          'bg-[var(--component-button-outline-error-bg)] [color:var(--component-button-outline-error-text)] border-[var(--component-button-outline-error-border)] hover:enabled:bg-[var(--component-button-outline-error-bgHover)] hover:enabled:[color:var(--component-button-outline-error-textHover)] hover:enabled:border-[var(--component-button-outline-error-borderHover)]',
      },
      {
        appearance: 'outline',
        variant: 'warning',
        class:
          'bg-[var(--component-button-outline-warning-bg)] [color:var(--component-button-outline-warning-text)] border-[var(--component-button-outline-warning-border)] hover:enabled:bg-[var(--component-button-outline-warning-bgHover)] hover:enabled:[color:var(--component-button-outline-warning-textHover)] hover:enabled:border-[var(--component-button-outline-warning-borderHover)]',
      },
      {
        appearance: 'outline',
        variant: 'muted',
        class:
          'bg-[var(--component-button-outline-muted-bg)] [color:var(--component-button-outline-muted-text)] border-[var(--component-button-outline-muted-border)] hover:enabled:bg-[var(--component-button-outline-muted-bgHover)] hover:enabled:[color:var(--component-button-outline-muted-textHover)] hover:enabled:border-[var(--component-button-outline-muted-borderHover)]',
      },

      // ===== GHOST =====
      {
        appearance: 'ghost',
        variant: 'primary',
        class:
          'bg-[var(--component-button-ghost-primary-bg)] [color:var(--component-button-ghost-primary-text)] hover:enabled:bg-[var(--component-button-ghost-primary-bgHover)] hover:enabled:[color:var(--component-button-ghost-primary-textHover)]',
      },
      {
        appearance: 'ghost',
        variant: 'secondary',
        class:
          'bg-[var(--component-button-ghost-secondary-bg)] [color:var(--component-button-ghost-secondary-text)] hover:enabled:bg-[var(--component-button-ghost-secondary-bgHover)] hover:enabled:[color:var(--component-button-ghost-secondary-textHover)]',
      },
      {
        appearance: 'ghost',
        variant: 'tertiary',
        class:
          'bg-[var(--component-button-ghost-tertiary-bg)] [color:var(--component-button-ghost-tertiary-text)] hover:enabled:bg-[var(--component-button-ghost-tertiary-bgHover)] hover:enabled:[color:var(--component-button-ghost-tertiary-textHover)]',
      },
      {
        appearance: 'ghost',
        variant: 'success',
        class:
          'bg-[var(--component-button-ghost-success-bg)] [color:var(--component-button-ghost-success-text)] hover:enabled:bg-[var(--component-button-ghost-success-bgHover)] hover:enabled:[color:var(--component-button-ghost-success-textHover)]',
      },
      {
        appearance: 'ghost',
        variant: 'error',
        class:
          'bg-[var(--component-button-ghost-error-bg)] [color:var(--component-button-ghost-error-text)] hover:enabled:bg-[var(--component-button-ghost-error-bgHover)] hover:enabled:[color:var(--component-button-ghost-error-textHover)]',
      },
      {
        appearance: 'ghost',
        variant: 'warning',
        class:
          'bg-[var(--component-button-ghost-warning-bg)] [color:var(--component-button-ghost-warning-text)] hover:enabled:bg-[var(--component-button-ghost-warning-bgHover)] hover:enabled:[color:var(--component-button-ghost-warning-textHover)]',
      },
      {
        appearance: 'ghost',
        variant: 'muted',
        class:
          'bg-[var(--component-button-ghost-muted-bg)] [color:var(--component-button-ghost-muted-text)] hover:enabled:bg-[var(--component-button-ghost-muted-bgHover)] hover:enabled:[color:var(--component-button-ghost-muted-textHover)]',
      },
    ],
    defaultVariants: {
      appearance: 'solid',
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      iconOnly: false,
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
