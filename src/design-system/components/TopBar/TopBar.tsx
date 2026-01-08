import React, { type ReactNode } from 'react';
import {
  IconLayoutSidebar,
  IconArrowLeft,
  IconArrowRight,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface TopBarProps {
  /** Callback when sidebar toggle is clicked */
  onSidebarToggle?: () => void;
  /** Callback when back button is clicked */
  onBack?: () => void;
  /** Callback when forward button is clicked */
  onForward?: () => void;
  /** Whether back button is disabled */
  canGoBack?: boolean;
  /** Whether forward button is disabled */
  canGoForward?: boolean;
  /** Breadcrumb content (use Breadcrumb component) */
  breadcrumb?: ReactNode;
  /** Right side actions (icons, buttons) */
  actions?: ReactNode;
  /** Show sidebar toggle button */
  showSidebarToggle?: boolean;
  /** Show navigation buttons */
  showNavigation?: boolean;
  /** Custom class name */
  className?: string;
}

/* ----------------------------------------
   TopBar Component
   ---------------------------------------- */

export const TopBar: React.FC<TopBarProps> = ({
  onSidebarToggle,
  onBack,
  onForward,
  canGoBack = true,
  canGoForward = true,
  breadcrumb,
  actions,
  showSidebarToggle = true,
  showNavigation = true,
  className = '',
}) => {
  const iconButtonClass = `
    inline-flex items-center justify-center
    size-[var(--topbar-button-size)]
    rounded-[var(--topbar-button-radius)]
    text-[var(--color-text-muted)]
    transition-colors duration-[var(--duration-fast)]
    hover:bg-[var(--topbar-button-hover-bg)]
    hover:text-[var(--color-text-default)]
    disabled:text-[var(--color-text-disabled)]
    disabled:cursor-not-allowed
    disabled:hover:bg-transparent
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--color-border-focus)]
  `;

  return (
    <header
      className={`
        flex items-center
        w-full
        h-[var(--topbar-height)]
        px-[var(--topbar-padding-x)]
        gap-[var(--topbar-gap)]
        bg-[var(--color-surface-default)]
        border-b border-[var(--color-border-default)]
        ${className}
      `}
    >
      {/* Left Section: Sidebar Toggle + Navigation */}
      <div className="flex items-center gap-[var(--topbar-section-gap)]">
        {/* Sidebar Toggle */}
        {showSidebarToggle && (
          <button
            type="button"
            onClick={onSidebarToggle}
            className={iconButtonClass}
            aria-label="Toggle sidebar"
          >
            <IconLayoutSidebar size={16} stroke={1.5} />
          </button>
        )}

        {/* Navigation Buttons */}
        {showNavigation && (
          <div className="flex items-center gap-[var(--topbar-nav-gap)]">
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack}
              className={iconButtonClass}
              aria-label="Go back"
            >
              <IconArrowLeft size={12} stroke={1.5} />
            </button>
            <button
              type="button"
              onClick={onForward}
              disabled={!canGoForward}
              className={iconButtonClass}
              aria-label="Go forward"
            >
              <IconArrowRight size={12} stroke={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* Center Section: Breadcrumb */}
      <div className="flex-1 min-w-0">
        {breadcrumb}
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-[var(--topbar-action-gap)]">
        {actions}
      </div>
    </header>
  );
};

/* ----------------------------------------
   TopBarAction Component (for consistent action buttons)
   ---------------------------------------- */

export interface TopBarActionProps {
  /** Icon to display */
  icon: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Aria label for accessibility */
  'aria-label': string;
  /** Disabled state */
  disabled?: boolean;
  /** Show notification badge */
  badge?: boolean;
  /** Badge count (if > 0, shows count) */
  badgeCount?: number;
  /** Custom class name */
  className?: string;
}

export const TopBarAction: React.FC<TopBarActionProps> = ({
  icon,
  onClick,
  'aria-label': ariaLabel,
  disabled = false,
  badge = false,
  badgeCount,
  className = '',
}) => {
  const showBadge = badge || (badgeCount !== undefined && badgeCount > 0);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        inline-flex items-center justify-center
        size-[var(--topbar-button-size)]
        rounded-[var(--topbar-button-radius)]
        text-[var(--color-text-muted)]
        transition-colors duration-[var(--duration-fast)]
        hover:bg-[var(--topbar-button-hover-bg)]
        hover:text-[var(--color-text-default)]
        disabled:text-[var(--color-text-disabled)]
        disabled:cursor-not-allowed
        disabled:hover:bg-transparent
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--color-border-focus)]
        ${className}
      `}
      aria-label={ariaLabel}
    >
      {icon}
      {showBadge && (
        <span
          className={`
            absolute
            top-1 right-1
            min-w-[6px] h-[6px]
            ${badgeCount !== undefined && badgeCount > 0 
              ? 'min-w-[14px] h-[14px] text-[9px] font-medium text-white flex items-center justify-center' 
              : ''
            }
            bg-[var(--color-state-danger)]
            rounded-full
          `}
        >
          {badgeCount !== undefined && badgeCount > 0 && badgeCount <= 99 
            ? badgeCount 
            : badgeCount !== undefined && badgeCount > 99 
              ? '99+' 
              : null
          }
        </span>
      )}
    </button>
  );
};

export default TopBar;

