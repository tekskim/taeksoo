import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   Badge Types
   ---------------------------------------- */

export type BadgeTheme = 'blue' | 'red' | 'green' | 'yellow' | 'gray' | 'white';
// thaki-ui compatibility aliases
export type BadgeThemeAlias = 'blu' | 'gry' | 'gre' | 'ylw';

const themeAliasMap: Record<BadgeThemeAlias, BadgeTheme> = {
  blu: 'blue',
  gry: 'gray',
  gre: 'green',
  ylw: 'yellow',
};
export type BadgeType = 'solid' | 'subtle';
export type BadgeSize = 'sm' | 'md';
// thaki-ui compatibility
export type BadgeLayout = 'text-only' | 'left-icon' | 'right-icon';

// Legacy variant support (backward compatibility)
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

const variantToTheme: Record<BadgeVariant, BadgeTheme> = {
  default: 'gray',
  primary: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'blue',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color theme (also accepts thaki-ui aliases: blu, gry, gre, ylw) */
  theme?: BadgeTheme | BadgeThemeAlias;
  /** Style type */
  type?: BadgeType;
  /** Badge size */
  size?: BadgeSize;
  /** Left icon */
  leftIcon?: ReactNode;
  /** Right icon */
  rightIcon?: ReactNode;
  /** Show dot indicator */
  dot?: boolean;
  /** Badge content */
  children: ReactNode;
  /** @deprecated Use theme prop instead */
  variant?: BadgeVariant;
  /** @deprecated thaki-ui compatibility - use leftIcon/rightIcon instead */
  layout?: BadgeLayout;
  /** @deprecated thaki-ui compatibility - use leftIcon/rightIcon instead */
  icon?: ReactNode;
}

/* ----------------------------------------
   Badge Styles (using design tokens)
   ---------------------------------------- */

const themeStyles = {
  // Solid variants (colored bg + light text)
  solid: {
    blue: 'bg-[var(--color-state-info)] text-white',
    red: 'bg-[var(--color-state-danger)] text-white',
    green: 'bg-[var(--color-state-success)] text-white',
    yellow: 'bg-[var(--color-state-warning)] text-white',
    gray: 'bg-[var(--color-text-subtle)] text-white',
    white:
      'bg-[var(--color-surface-default)] text-[var(--color-text-default)] shadow-[inset_0_0_0_1px_var(--badge-white-border)]',
  },
  subtle: {
    blue: 'bg-[var(--badge-subtle-blue-bg)] text-[var(--badge-subtle-blue-text)]',
    red: 'bg-[var(--badge-subtle-red-bg)] text-[var(--badge-subtle-red-text)]',
    green: 'bg-[var(--badge-subtle-green-bg)] text-[var(--badge-subtle-green-text)]',
    yellow: 'bg-[var(--badge-subtle-yellow-bg)] text-[var(--badge-subtle-yellow-text)]',
    gray: 'bg-[var(--badge-subtle-gray-bg)] text-[var(--badge-subtle-gray-text)]',
    white:
      'bg-[var(--color-surface-default)] text-[var(--color-text-default)] shadow-[inset_0_0_0_1px_var(--badge-white-border)]',
  },
} as const;

const sizes = {
  sm: [
    'h-5',
    'px-[var(--badge-padding-x-sm)]',
    'text-[length:var(--badge-font-size-sm)]',
    'leading-[var(--badge-line-height-sm)]',
  ],
  md: [
    'h-6',
    'px-[var(--badge-padding-x-md)]',
    'text-[length:var(--badge-font-size-md)]',
    'leading-[var(--badge-line-height-md)]',
  ],
} as const;

/* ----------------------------------------
   Badge Component
   ---------------------------------------- */

export const Badge = memo(function Badge({
  theme,
  type = 'solid',
  size = 'md',
  leftIcon: rawLeftIcon,
  rightIcon: rawRightIcon,
  dot = false,
  children,
  className = '',
  variant,
  layout,
  icon,
  ...props
}: BadgeProps) {
  // thaki-ui compatibility: resolve layout + icon to leftIcon/rightIcon
  const leftIcon = layout === 'left-icon' && icon ? icon : rawLeftIcon;
  const rightIcon = layout === 'right-icon' && icon ? icon : rawRightIcon;
  // Support legacy variant prop and thaki-ui theme aliases
  const normalizedTheme =
    theme && theme in themeAliasMap
      ? themeAliasMap[theme as BadgeThemeAlias]
      : (theme as BadgeTheme | undefined);
  const resolvedTheme = normalizedTheme ?? (variant ? variantToTheme[variant] : 'white');
  // Legacy variants use subtle type by default
  const resolvedType = variant && !theme ? 'subtle' : type;

  const baseStyles = [
    'inline-flex items-center justify-center',
    'gap-[var(--badge-gap)]',
    'font-medium',
    'min-w-[20px] text-center',
    'rounded-[var(--badge-radius)]',
  ].join(' ');

  const classes = twMerge(
    baseStyles,
    themeStyles[resolvedType][resolvedTheme],
    sizes[size].join(' '),
    className
  );

  const dotColors: Record<BadgeTheme, string> = {
    blue:
      resolvedType === 'solid'
        ? 'bg-[var(--color-surface-default)]/50'
        : 'bg-[var(--color-state-info)]',
    red:
      resolvedType === 'solid'
        ? 'bg-[var(--color-surface-default)]/50'
        : 'bg-[var(--color-state-danger)]',
    green:
      resolvedType === 'solid'
        ? 'bg-[var(--color-surface-default)]/50'
        : 'bg-[var(--color-state-success)]',
    yellow:
      resolvedType === 'solid'
        ? 'bg-[var(--color-surface-default)]/50'
        : 'bg-[var(--color-state-warning)]',
    gray:
      resolvedType === 'solid'
        ? 'bg-[var(--color-surface-default)]/50'
        : 'bg-[var(--color-text-subtle)]',
    white: 'bg-[var(--color-text-default)]',
  };

  return (
    <span data-figma-name="[TDS] Badge" className={classes} {...props}>
      {dot && (
        <span
          className={`size-[var(--badge-dot-size)] rounded-full shrink-0 ${dotColors[resolvedTheme]}`}
        />
      )}
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </span>
  );
});
