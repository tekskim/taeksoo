import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/* ----------------------------------------
   Badge Types
   ---------------------------------------- */

export type BadgeTheme = 'blue' | 'red' | 'green' | 'yellow' | 'gray';
export type BadgeType = 'solid' | 'subtle';
export type BadgeSize = 'sm' | 'md' | 'lg';

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
  /** Color theme */
  theme?: BadgeTheme;
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
}

/* ----------------------------------------
   Badge Styles (using design tokens)
   ---------------------------------------- */

const themeStyles = {
  // Solid variants (colored bg + light text)
  solid: {
    blue: 'bg-[var(--color-blue-500)] text-[var(--color-blue-50)]',
    red: 'bg-[var(--color-red-500)] text-[var(--color-red-50)]',
    green: 'bg-[var(--color-green-500)] text-[var(--color-green-50)]',
    yellow: 'bg-[var(--color-orange-500)] text-white',
    gray: 'bg-[var(--color-slate-500)] text-[var(--color-slate-50)]',
  },
  // Subtle variants (light bg + colored text)
  subtle: {
    blue: 'bg-[var(--color-blue-50)] text-[var(--color-blue-600)]',
    red: 'bg-[var(--color-red-50)] text-[var(--color-red-600)]',
    green: 'bg-[var(--color-green-50)] text-[var(--color-green-600)]',
    yellow: 'bg-[var(--color-yellow-50)] text-[var(--color-orange-600)]',
    gray: 'bg-[var(--color-slate-100)] text-[var(--color-slate-600)]',
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

export function Badge({
  theme,
  type = 'solid',
  size = 'md',
  leftIcon,
  rightIcon,
  dot = false,
  children,
  className = '',
  variant,
  ...props
}: BadgeProps) {
  // Support legacy variant prop
  const resolvedTheme = theme ?? (variant ? variantToTheme[variant] : 'blue');
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
    blue: resolvedType === 'solid' ? 'bg-[var(--color-blue-200)]' : 'bg-[var(--color-blue-500)]',
    red: resolvedType === 'solid' ? 'bg-[var(--color-red-200)]' : 'bg-[var(--color-red-500)]',
    green: resolvedType === 'solid' ? 'bg-[var(--color-green-200)]' : 'bg-[var(--color-green-500)]',
    yellow: resolvedType === 'solid' ? 'bg-white' : 'bg-[var(--color-orange-500)]',
    gray: resolvedType === 'solid' ? 'bg-[var(--color-slate-200)]' : 'bg-[var(--color-slate-500)]',
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
}
