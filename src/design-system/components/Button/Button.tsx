import {
  forwardRef,
  memo,
  type ElementType,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   Button Variants (CVA with Design Tokens)
   ---------------------------------------- */

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'font-medium',
    'transition-colors duration-[var(--duration-fast)]',
    'focus-visible:outline-none',
    'focus-visible:ring-1',
    'focus-visible:ring-[var(--color-border-focus)]',
    'focus-visible:ring-offset-1',
    'cursor-pointer',
    'disabled:cursor-not-allowed',
    'rounded-[var(--button-radius)]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]',
          'hover:bg-[var(--color-action-primary-hover)]',
          'active:bg-[var(--color-action-primary-active)]',
          'disabled:bg-[var(--color-border-default)] disabled:text-[var(--color-text-subtle)]',
        ],
        secondary: [
          'bg-[var(--color-surface-default)] text-[var(--color-text-default)]',
          'border border-[var(--color-border-strong)]',
          'hover:bg-[var(--button-secondary-hover-bg)]',
          'active:bg-[var(--color-surface-default)]',
          'disabled:bg-[var(--color-surface-subtle)] disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-default)]',
        ],
        outline: [
          'bg-transparent text-[var(--color-text-default)]',
          'border border-[var(--color-border-strong)]',
          'hover:bg-[var(--button-secondary-hover-bg)]',
          'active:bg-[var(--color-surface-default)]',
          'disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-default)]',
        ],
        ghost: [
          'bg-transparent text-[var(--color-text-muted)]',
          'hover:bg-[var(--button-ghost-hover-bg)]',
          'active:bg-[var(--color-border-default)]',
          'disabled:text-[var(--color-text-disabled)]',
        ],
        muted: [
          'bg-[var(--color-surface-default)] text-[var(--color-text-muted)]',
          'border border-[var(--color-border-strong)]',
          'hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-default)] hover:border-[var(--color-border-strong)]',
          'active:bg-[var(--color-surface-default)]',
          'disabled:bg-[var(--color-surface-default)] disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-default)]',
        ],
        danger: [
          'bg-[var(--color-state-danger)] text-[var(--color-text-on-primary)]',
          'hover:bg-[var(--color-state-danger-hover)]',
          'active:bg-[var(--color-state-danger-active)]',
          'disabled:opacity-50',
        ],
        warning: [
          'bg-[var(--color-state-warning)] text-[var(--color-text-on-primary)]',
          'hover:bg-[var(--color-orange-600)]',
          'active:bg-[var(--color-orange-700)]',
          'disabled:opacity-50',
        ],
        link: [
          'bg-transparent text-[var(--color-action-primary)] p-0 min-w-0 h-auto rounded-none',
          'hover:underline hover:underline-offset-4',
          'active:text-[var(--color-action-primary-active)]',
          'disabled:text-[var(--color-text-disabled)] disabled:no-underline',
        ],
      },
      size: {
        xs: ['h-6', 'px-2', 'py-1', 'gap-1', 'min-w-[48px]', 'text-body-sm'],
        sm: [
          'h-[var(--button-height-sm)]',
          'px-[var(--button-padding-x-sm)]',
          'py-[var(--button-padding-y-sm)]',
          'gap-[var(--button-gap-sm)]',
          'min-w-[var(--button-min-width-sm)]',
          'text-[length:var(--button-font-size-sm)]',
          'leading-[var(--button-line-height-sm)]',
        ],
        md: [
          'h-[var(--button-height-md)]',
          'px-[var(--button-padding-x-md)]',
          'py-[var(--button-padding-y-md)]',
          'gap-[var(--button-gap-md)]',
          'min-w-[var(--button-min-width-md)]',
          'text-[length:var(--button-font-size-md)]',
          'leading-[var(--button-line-height-md)]',
        ],
        lg: [
          'h-[var(--button-height-lg)]',
          'px-[var(--button-padding-x-lg)]',
          'py-[var(--button-padding-y-lg)]',
          'gap-[var(--button-gap-lg)]',
          'min-w-[var(--button-min-width-lg)]',
          'text-[length:var(--button-font-size-lg)]',
          'leading-[var(--button-line-height-lg)]',
        ],
      },
      fullWidth: {
        true: 'w-full',
      },
      iconOnly: {
        true: 'min-w-0 p-0',
      },
    },
    compoundVariants: [
      // Icon-only size overrides - using ! to ensure these override size variant classes
      {
        iconOnly: true,
        size: 'xs',
        className: '!w-6 !min-w-0 !px-0 !py-0',
      },
      {
        iconOnly: true,
        size: 'sm',
        className: '!w-[var(--button-height-sm)] !min-w-0 !px-0 !py-0',
      },
      {
        iconOnly: true,
        size: 'md',
        className: '!w-[var(--button-height-md)] !min-w-0 !px-0 !py-0',
      },
      {
        iconOnly: true,
        size: 'lg',
        className: '!w-[var(--button-height-lg)] !min-w-0 !px-0 !py-0',
      },
      // Link variant - remove size constraints
      {
        variant: 'link',
        size: 'xs',
        className: 'h-auto min-w-0 px-0 py-0 text-body-sm',
      },
      {
        variant: 'link',
        size: 'sm',
        className: 'h-auto min-w-0 px-0 py-0 text-[length:var(--button-font-size-sm)]',
      },
      {
        variant: 'link',
        size: 'md',
        className: 'h-auto min-w-0 px-0 py-0 text-[length:var(--button-font-size-md)]',
      },
      {
        variant: 'link',
        size: 'lg',
        className: 'h-auto min-w-0 px-0 py-0 text-[length:var(--button-font-size-lg)]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/* ----------------------------------------
   Polymorphic Types
   ---------------------------------------- */

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<C extends ElementType, Props = object> = React.PropsWithChildren<
  Props & AsProp<C>
> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends ElementType> = ComponentPropsWithoutRef<C>['ref'] extends never
  ? React.Ref<Element>
  : ComponentPropsWithoutRef<C>['ref'];

type PolymorphicComponentPropWithRef<
  C extends ElementType,
  Props = object,
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

/* ----------------------------------------
   Button Props
   ---------------------------------------- */

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

// thaki-ui compatibility
export type ButtonAppearance = 'solid' | 'outline' | 'ghost';
export type ThakiButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'error'
  | 'warning'
  | 'muted';

// Map thaki-ui variant + appearance to tds variant
const resolveThakiVariant = (
  variant?: ButtonVariant | ThakiButtonVariant,
  appearance?: ButtonAppearance
): ButtonVariant => {
  // If no appearance, treat as normal tds variant
  if (!appearance || appearance === 'solid') {
    // Map thaki-ui specific variants
    if (variant === 'error') return 'danger';
    if (variant === 'tertiary') return 'secondary';
    if (variant === 'success') return 'primary'; // success maps to primary
    return variant as ButtonVariant;
  }

  // Handle appearance combinations
  if (appearance === 'outline') return 'outline';
  if (appearance === 'ghost') return 'ghost';

  return variant as ButtonVariant;
};

type ButtonBaseProps = {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  icon?: ReactNode;
  /** @deprecated thaki-ui compatibility - use variant directly */
  appearance?: ButtonAppearance;
} & VariantProps<typeof buttonVariants>;

type IconOnlyProps = {
  icon: ReactNode;
  'aria-label': string;
  children?: never;
};

type TextButtonProps = {
  icon?: never;
  'aria-label'?: string;
  children?: ReactNode;
};

export type ButtonProps<C extends ElementType = 'button'> = PolymorphicComponentPropWithRef<
  C,
  ButtonBaseProps & (IconOnlyProps | TextButtonProps)
>;

/* ----------------------------------------
   Button Component
   ---------------------------------------- */

type ButtonComponent = <C extends ElementType = 'button'>(
  props: ButtonProps<C>
) => React.ReactElement | null;

export const Button: ButtonComponent = forwardRef(
  <C extends ElementType = 'button'>(
    {
      as,
      variant: rawVariant = 'primary',
      appearance,
      size = 'md',
      fullWidth,
      iconOnly: _iconOnly, // Extract to prevent passing to DOM
      isLoading = false,
      leftIcon,
      rightIcon,
      icon,
      children,
      className,
      disabled,
      'aria-label': ariaLabel,
      ...props
    }: ButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    // thaki-ui compatibility: resolve variant + appearance combination
    const variant = resolveThakiVariant(rawVariant, appearance);

    const Component = as || 'button';
    const isIconOnly = !!icon;
    const isDisabled = disabled || isLoading;

    const classes = twMerge(
      buttonVariants({
        variant,
        size,
        fullWidth,
        iconOnly: isIconOnly,
      }),
      className
    );

    const buttonProps =
      Component === 'button'
        ? {
            type: ((props as { type?: 'button' | 'submit' | 'reset' }).type || 'button') as
              | 'button'
              | 'submit'
              | 'reset',
          }
        : {};

    return (
      <Component
        ref={ref}
        className={classes}
        disabled={Component === 'button' ? isDisabled : undefined}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        aria-label={ariaLabel}
        {...buttonProps}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size={size} />
            <span className="sr-only">Loading...</span>
          </>
        ) : isIconOnly ? (
          <span className="shrink-0 flex items-center justify-center">{icon}</span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Component>
    );
  }
) as ButtonComponent;

(Button as React.FC).displayName = 'Button';

/* ----------------------------------------
   Spinner (Accessible Loading Indicator)
   ---------------------------------------- */

const spinnerSizes: Record<NonNullable<ButtonSize>, string> = {
  xs: 'size-2.5',
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
};

const Spinner = memo(function Spinner({ size }: { size: ButtonSize }) {
  return (
    <svg
      className={`animate-spin ${spinnerSizes[size || 'md']}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
});

/* ----------------------------------------
   Exports
   ---------------------------------------- */

export { buttonVariants };
