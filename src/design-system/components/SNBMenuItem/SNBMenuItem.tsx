import React, { useState } from 'react';

export type SNBMenuItemStatus = 'default' | 'hover' | 'selected';
export type SNBMenuItemType = 'icon' | 'text';

export interface SNBMenuItemProps {
  /** Status of the menu item */
  status?: SNBMenuItemStatus;
  /** Type of menu item (icon or text) */
  type?: SNBMenuItemType;
  /** Icon element (for type="icon") */
  icon?: React.ReactNode;
  /** Text content (for type="text") */
  text?: string;
  /** Size of the icon (default: 22) */
  iconSize?: number;
  /** Click handler */
  onClick?: () => void;
  /** Additional class name */
  className?: string;
  /** Whether the item is selected (alternative to status="selected") */
  isSelected?: boolean;
  /** Children (alternative to icon prop) */
  children?: React.ReactNode;
}

/**
 * SNBMenuItem - Side Navigation Bar Menu Item
 *
 * A menu item component for the narrow side navigation bar.
 * Supports default, hover, and selected states with appropriate styling.
 *
 * Design tokens used:
 * - default: bg-white, icon: #64748b (text-muted)
 * - hover: bg-[#f8fafc] (surface-subtle), icon: #334155 (text-default)
 * - selected: bg-[#eff6ff] (info-weak-bg), icon: #2563eb (primary)
 */
export function SNBMenuItem({
  status: propStatus,
  type = 'icon',
  icon,
  text,
  iconSize = 22,
  onClick,
  className = '',
  isSelected = false,
  children,
}: SNBMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine effective status
  const status = propStatus || (isSelected ? 'selected' : isHovered ? 'hover' : 'default');

  // Background styles based on status
  const bgStyles = {
    default: 'bg-[var(--color-surface-default)]',
    hover: 'bg-[var(--color-surface-subtle)]',
    selected: 'bg-[var(--color-info-weak-bg,#eff6ff)]',
  };

  // Icon color styles based on status
  const iconColorStyles = {
    default: 'text-[var(--color-text-muted)]',
    hover: 'text-[var(--color-text-default)]',
    selected: 'text-[var(--color-action-primary)]',
  };

  // Text color styles based on status
  const textColorStyles = {
    default: 'text-[var(--color-text-muted)]',
    hover: 'text-[var(--color-text-default)]',
    selected: 'text-[var(--color-action-primary)]',
  };

  const baseClass = `
    flex flex-col gap-0.5 items-center justify-center
    px-2 py-1.5
    rounded-lg
    size-[38px]
    transition-colors
    cursor-pointer
  `;

  const renderIcon = () => {
    if (children) {
      // Clone children to add the color class
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
            className:
              `${(child.props as { className?: string }).className || ''} ${iconColorStyles[status]}`.trim(),
          });
        }
        return child;
      });
    }

    if (icon) {
      // Clone icon to add the color class
      if (React.isValidElement(icon)) {
        return React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className:
            `${(icon.props as { className?: string }).className || ''} ${iconColorStyles[status]}`.trim(),
        });
      }
      return icon;
    }

    return null;
  };

  return (
    <button
      className={`${baseClass} ${bgStyles[status]} ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {type === 'icon' && renderIcon()}
      {type === 'text' && (
        <span
          className={`text-heading-h4 ${textColorStyles[status]}`}
        >
          {text}
        </span>
      )}
    </button>
  );
}

export default SNBMenuItem;
