import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Tag content */
  children: ReactNode;
  /** Tag variant/color */
  variant?: TagVariant;
  /** Tag size */
  size?: TagSize;
  /** Show close button */
  closable?: boolean;
  /** Close button click handler */
  onClose?: () => void;
  /** Left icon */
  icon?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Rounded style (pill shape) */
  rounded?: boolean;
  /** Outline style (bordered, no fill) */
  outline?: boolean;
  /** Clickable tag */
  clickable?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/* ----------------------------------------
   Styles
   ---------------------------------------- */

const variantStyles: Record<TagVariant, { solid: string; outline: string }> = {
  default: {
    solid: 'bg-[var(--color-surface-muted)] text-[var(--color-text-default)] border-transparent',
    outline: 'bg-transparent text-[var(--color-text-default)] border-[var(--color-border-default)]',
  },
  primary: {
    solid: 'bg-[var(--color-action-primary)] text-white border-transparent',
    outline:
      'bg-transparent text-[var(--color-action-primary)] border-[var(--color-action-primary)]',
  },
  success: {
    solid: 'bg-[var(--color-state-success)] text-white border-transparent',
    outline:
      'bg-[var(--color-state-success-subtle)] text-[var(--color-state-success)] border-[var(--color-state-success)]',
  },
  warning: {
    solid: 'bg-[var(--color-state-warning)] text-white border-transparent',
    outline:
      'bg-[var(--color-state-warning-subtle)] text-[var(--color-state-warning)] border-[var(--color-state-warning)]',
  },
  danger: {
    solid: 'bg-[var(--color-state-danger)] text-white border-transparent',
    outline:
      'bg-[var(--color-state-danger-subtle)] text-[var(--color-state-danger)] border-[var(--color-state-danger)]',
  },
  info: {
    solid: 'bg-[var(--color-state-info)] text-white border-transparent',
    outline:
      'bg-[var(--color-state-info-subtle)] text-[var(--color-state-info)] border-[var(--color-state-info)]',
  },
};

const sizeStyles: Record<TagSize, { container: string; icon: number; closeIcon: number }> = {
  sm: {
    container: 'h-5 px-1.5 text-[10px] gap-1',
    icon: 10,
    closeIcon: 10,
  },
  md: {
    container: 'h-6 px-2 text-[11px] gap-1.5',
    icon: 12,
    closeIcon: 12,
  },
  lg: {
    container: 'h-7 px-2.5 text-[12px] gap-1.5',
    icon: 14,
    closeIcon: 14,
  },
};

/* ----------------------------------------
   Tag Component
   ---------------------------------------- */

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      closable = false,
      onClose,
      icon,
      disabled = false,
      rounded = false,
      outline = false,
      clickable = false,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const isClickable = clickable || !!onClick;
    const sizeConfig = sizeStyles[size];
    const variantConfig = variantStyles[variant];

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose?.();
    };

    return (
      <span
        ref={ref}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable && !disabled ? 0 : undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={
          isClickable && !disabled
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLSpanElement>);
                }
              }
            : undefined
        }
        className={twMerge(
          'inline-flex items-center justify-center',
          'border',
          'font-medium',
          'leading-none',
          'whitespace-nowrap',
          sizeConfig.container,
          outline ? variantConfig.outline : variantConfig.solid,
          rounded ? 'rounded-full' : 'rounded',
          isClickable && !disabled && 'cursor-pointer hover:opacity-80 transition-opacity',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {/* Left Icon */}
        {icon && <span className="shrink-0 flex items-center">{icon}</span>}

        {/* Content */}
        <span className="truncate">{children}</span>

        {/* Close Button */}
        {closable && (
          <button
            type="button"
            onClick={handleClose}
            disabled={disabled}
            className={twMerge(
              'shrink-0 flex items-center justify-center',
              'rounded-full',
              'hover:bg-black/10',
              'transition-colors',
              'focus:outline-none',
              disabled && 'pointer-events-none'
            )}
            aria-label="Remove tag"
          >
            <IconX size={sizeConfig.closeIcon} strokeWidth={2} />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

/* ----------------------------------------
   TagGroup Component
   ---------------------------------------- */

export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between tags */
  gap?: 'sm' | 'md' | 'lg';
  /** Children tags */
  children: ReactNode;
}

const gapStyles: Record<string, string> = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
};

export const TagGroup = forwardRef<HTMLDivElement, TagGroupProps>(
  ({ gap = 'md', children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge('flex flex-wrap items-center', gapStyles[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TagGroup.displayName = 'TagGroup';

export default Tag;
