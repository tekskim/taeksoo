import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { customTwMerge as twMerge } from '../../utils/cn';

/* ----------------------------------------
   Badge Types
   ---------------------------------------- */

export type BadgeTheme = 'blue' | 'red' | 'green' | 'yellow' | 'gray';
// thaki-ui compatibility aliases
export type BadgeThemeAlias = 'blu' | 'gry' | 'gre' | 'ylw';

const themeAliasMap: Record<BadgeThemeAlias, BadgeTheme> = {
  blu: 'blue',
  gry: 'gray',
  gre: 'green',
  ylw: 'yellow',
};
export type BadgeType = 'solid' | 'subtle';
export type BadgeSize = 'sm' | 'md' | 'lg';
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
  },
  // Subtle variants (light bg + colored text) - uses semantic tokens for dark mode support
  subtle: {
    blue: 'bg-[var(--color-blue-100)] text-[var(--color-state-info-text)]',
    red: 'bg-[var(--color-red-100)] text-[var(--color-state-danger-text)]',
    green: 'bg-[var(--color-green-100)] text-[var(--color-state-success-text)]',
    yellow: 'bg-[var(--color-orange-100)] text-[var(--color-state-warning-text)]',
    gray: 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
  },
} as const;

const sizes = {
  sm: [
    'px-[var(--badge-padding-x-sm)]',
    'py-[var(--badge-padding-y-sm)]',
    'text-[length:var(--badge-font-size-sm)]',
    'leading-[var(--badge-line-height-sm)]',
  ],
  md: [
    'px-[var(--badge-padding-x-md)]',
    'py-[var(--badge-padding-y-md)]',
    'text-[length:var(--badge-font-size-md)]',
    'leading-[var(--badge-line-height-md)]',
  ],
  lg: [
    'px-[var(--badge-padding-x-lg)]',
    'py-[var(--badge-padding-y-lg)]',
    'text-[length:var(--badge-font-size-lg)]',
    'leading-[var(--badge-line-height-lg)]',
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
  const resolvedTheme = normalizedTheme ?? (variant ? variantToTheme[variant] : 'blue');
  // Legacy variants use subtle type by default
  const resolvedType = variant && !theme ? 'subtle' : type;

  const baseStyles = [
    'inline-flex items-center',
    'gap-[var(--badge-gap)]',
    'font-medium',
    'rounded-[var(--badge-radius)]',
  ].join(' ');

  const classes = twMerge(
    baseStyles,
    themeStyles[resolvedType][resolvedTheme],
    sizes[size].join(' '),
    className
  );

  const dotColors: Record<BadgeTheme, string> = {
    blue: resolvedType === 'solid' ? 'bg-white/50' : 'bg-[var(--color-state-info)]',
    red: resolvedType === 'solid' ? 'bg-white/50' : 'bg-[var(--color-state-danger)]',
    green: resolvedType === 'solid' ? 'bg-white/50' : 'bg-[var(--color-state-success)]',
    yellow: resolvedType === 'solid' ? 'bg-white/50' : 'bg-[var(--color-state-warning)]',
    gray: resolvedType === 'solid' ? 'bg-white/50' : 'bg-[var(--color-text-subtle)]',
  };

  return (
    <span className={classes} {...props}>
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
