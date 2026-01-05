import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ContextMenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Item status/variant */
  status?: 'default' | 'danger';
  /** Submenu items */
  submenu?: ContextMenuItem[];
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Divider after this item */
  divider?: boolean;
}

export interface ContextMenuProps {
  /** Menu items */
  items: ContextMenuItem[];
  /** Trigger element */
  children: React.ReactElement;
  /** Trigger type */
  trigger?: 'click' | 'contextmenu';
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

export interface ContextMenuContentProps {
  /** Menu items */
  items: ContextMenuItem[];
  /** Position */
  position: { x: number; y: number };
  /** Close handler */
  onClose: () => void;
  /** Parent direction (for submenu positioning) */
  parentDirection?: 'left' | 'right';
}

/* ----------------------------------------
   ContextMenuItem Component
   ---------------------------------------- */

const ContextMenuItemComponent: React.FC<{
  item: ContextMenuItem;
  onClose: () => void;
  parentDirection?: 'left' | 'right';
}> = ({ item, onClose, parentDirection: _parentDirection = 'right' }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const [submenuDirection, setSubmenuDirection] = useState<'left' | 'right'>('right');
  const itemRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Adjust submenu position after it renders
  useEffect(() => {
    if (showSubmenu && submenuRef.current && itemRef.current) {
      const submenuRect = submenuRef.current.getBoundingClientRect();
      const itemRect = itemRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = submenuPosition.x;
      let newY = submenuPosition.y;
      let newDirection: 'left' | 'right' = 'right';
      
      // Check if submenu overflows right edge
      if (submenuPosition.x + submenuRect.width > viewportWidth - 8) {
        // Position to the left of the parent item
        newX = itemRect.left - submenuRect.width - 4;
        newDirection = 'left';
      }
      
      // Check if submenu overflows bottom edge
      if (submenuPosition.y + submenuRect.height > viewportHeight - 8) {
        newY = Math.max(8, viewportHeight - submenuRect.height - 8);
      }
      
      // Check if submenu overflows left edge (when positioned left)
      if (newX < 8) {
        newX = 8;
      }
      
      if (newX !== submenuPosition.x || newY !== submenuPosition.y) {
        setSubmenuPosition({ x: newX, y: newY });
      }
      setSubmenuDirection(newDirection);
    }
  }, [showSubmenu, submenuPosition.x, submenuPosition.y]);

  const handleMouseEnter = () => {
    // Cancel any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (item.submenu && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      // Initially position to the right
      setSubmenuPosition({
        x: rect.right + 4,
        y: rect.top - 1, // Offset for border alignment
      });
      setShowSubmenu(true);
    }
  };

  const handleMouseLeave = () => {
    // Delay close to allow mouse to move to submenu
    closeTimeoutRef.current = window.setTimeout(() => {
      setShowSubmenu(false);
    }, 150);
  };

  const handleSubmenuMouseEnter = () => {
    // Cancel close when entering submenu
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleSubmenuMouseLeave = () => {
    setShowSubmenu(false);
  };

  const handleClick = () => {
    if (item.disabled) return;
    if (!item.submenu) {
      item.onClick?.();
      onClose();
    }
  };

  const hasSubmenu = item.submenu && item.submenu.length > 0;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={itemRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`
          flex items-center justify-between
          min-w-[var(--context-menu-min-width)]
          px-[var(--context-menu-padding-x)]
          py-[var(--context-menu-padding-y)]
          text-[length:var(--font-size-11)]
          leading-[var(--line-height-16)]
          whitespace-nowrap
          cursor-pointer
          transition-colors duration-[var(--duration-fast)]
          ${item.divider ? 'border-b border-[var(--color-border-subtle)]' : ''}
          ${item.status === 'danger'
            ? 'text-[var(--color-state-danger-text)] hover:bg-[var(--color-state-danger-bg)]'
            : 'text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)]'
          }
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${showSubmenu ? 'bg-[var(--context-menu-hover-bg)]' : ''}
        `}
      >
        <span>{item.label}</span>
        {hasSubmenu && (
          <IconChevronRight size={12} stroke={1} className="ml-6 shrink-0" />
        )}
      </div>

      {/* Submenu - rendered via portal */}
      {showSubmenu && item.submenu && createPortal(
        <div
          ref={submenuRef}
          onMouseEnter={handleSubmenuMouseEnter}
          onMouseLeave={handleSubmenuMouseLeave}
          className="
            fixed
            flex flex-col
            bg-[var(--color-surface-default)]
            border border-[var(--color-border-strong)]
            rounded-[var(--context-menu-radius)]
            shadow-[var(--shadow-md)]
            overflow-hidden
            z-[calc(var(--z-popover)+1)]
            max-h-[calc(100vh-16px)]
            overflow-y-auto
          "
          style={{
            left: submenuPosition.x,
            top: submenuPosition.y,
          }}
        >
          {item.submenu.map((subItem) => (
            <ContextMenuItemComponent
              key={subItem.id}
              item={subItem}
              onClose={onClose}
              parentDirection={submenuDirection}
            />
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

/* ----------------------------------------
   ContextMenuContent Component
   ---------------------------------------- */

const ContextMenuContent: React.FC<ContextMenuContentProps> = ({
  items,
  position,
  onClose,
  parentDirection = 'right',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX = position.x;
        let newY = position.y;

        // Adjust horizontal position - flip to left if overflows
        if (position.x + rect.width > viewportWidth - 8) {
          newX = Math.max(8, position.x - rect.width - 8);
        }

        // Adjust vertical position
        if (position.y + rect.height > viewportHeight - 8) {
          newY = Math.max(8, viewportHeight - rect.height - 8);
        }

        setAdjustedPosition({ x: newX, y: newY });
      }
    });
  }, [position]);

  return createPortal(
    <div
      ref={menuRef}
      className="
        fixed z-[var(--z-popover)]
        flex flex-col
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-strong)]
        rounded-[var(--context-menu-radius)]
        shadow-[var(--shadow-md)]
        overflow-hidden
        transition-opacity duration-[var(--duration-fast)]
      "
      style={{
        left: adjustedPosition?.x ?? position.x,
        top: adjustedPosition?.y ?? position.y,
        opacity: adjustedPosition ? 1 : 0,
      }}
    >
      {items.map((item) => (
        <ContextMenuItemComponent
          key={item.id}
          item={item}
          onClose={onClose}
          parentDirection={parentDirection}
        />
      ))}
    </div>,
    document.body
  );
};

/* ----------------------------------------
   ContextMenu Component
   ---------------------------------------- */

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  children,
  trigger = 'contextmenu',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    if (trigger === 'contextmenu') {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setIsOpen(true);
    } else {
      // Click trigger: toggle menu and position relative to trigger element
      if (isOpen) {
        setIsOpen(false);
        return;
      }
      
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({ x: rect.right + 4, y: rect.top });
      }
      setIsOpen(true);
    }
  }, [disabled, trigger, isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    // Delay to prevent immediate close
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  const triggerProps = trigger === 'contextmenu'
    ? { onContextMenu: handleOpen }
    : { onClick: handleOpen };

  return (
    <div ref={triggerRef} className={`inline-block w-fit ${className}`} {...triggerProps}>
      {children}
      {isOpen && (
        <ContextMenuContent
          items={items}
          position={position}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ContextMenu;

