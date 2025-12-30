import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

/* ----------------------------------------
   MenuItem Types
   ---------------------------------------- */

export interface MenuItemProps {
  /** Menu icon */
  icon?: ReactNode;
  /** Menu label */
  label: string;
  /** Link URL */
  href?: string;
  /** Active state */
  active?: boolean;
  /** Badge text (New, Beta, etc.) */
  badge?: string;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

/* ----------------------------------------
   MenuItem Component (using design tokens)
   ---------------------------------------- */

export function MenuItem({
  icon,
  label,
  href,
  active = false,
  badge,
  onClick,
  disabled = false,
}: MenuItemProps) {
  const baseStyles = [
    'w-full',
    'px-[var(--menu-item-padding-x)]',
    'py-[var(--menu-item-padding-y)]',
    'rounded-[var(--menu-item-radius)]',
    'flex items-center',
    'gap-[var(--menu-item-gap)]',
    'text-[length:var(--font-size-11)]',
    'transition-colors duration-[var(--duration-fast)]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
  ].join(' ');

  const stateStyles = active
    ? 'bg-[var(--menu-item-active-bg,var(--color-state-info-bg))] text-[var(--menu-item-active-text,var(--color-action-primary))] font-medium'
    : disabled
    ? 'text-[var(--color-text-disabled)] cursor-not-allowed'
    : 'text-[var(--color-text-default)] hover:bg-[var(--menu-item-hover-bg)] font-normal';

  const content = (
    <>
      {icon && (
        <span className={`shrink-0 ${active ? 'text-[var(--menu-item-active-text,var(--color-action-primary))]' : 'text-[var(--color-text-default)]'}`}>
          {icon}
        </span>
      )}
      <span className="flex-1 text-left truncate">{label}</span>
      {badge && (
        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[var(--menu-item-active-bg,var(--color-state-info-bg))] text-[var(--menu-item-active-text,var(--color-action-primary))] rounded">
          {badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          // If onClick is provided, prevent default navigation and call onClick
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        className={twMerge(baseStyles, stateStyles)}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={twMerge(baseStyles, stateStyles)}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled}
    >
      {content}
    </button>
  );
}
