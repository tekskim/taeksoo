import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IconChevronRight } from '@tabler/icons-react';
import { Tooltip } from '../Tooltip';

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
  /** Tooltip content (shown on hover) */
  tooltip?: string;
  /** Tooltip position */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Submenu direction (left or right) */
  submenuDirection?: 'left' | 'right';
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
  /** Ref to the rendered menu element (for outside click detection) */
  menuRef?: React.RefObject<HTMLDivElement>;
  /** Trigger element ref (for positioning relative to trigger) */
  triggerRef?: React.RefObject<HTMLElement>;
}

/* ----------------------------------------
   ContextMenuItem Component
   ---------------------------------------- */

const ContextMenuItemComponent: React.FC<{
  item: ContextMenuItem;
  onClose: () => void;
  parentDirection?: 'left' | 'right';
  itemId?: string;
}> = ({ item, onClose, parentDirection: _parentDirection = 'right', itemId }) => {
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
      
      const preferredDirection = item.submenuDirection || 'right';
      let newX = submenuPosition.x;
      let newY = submenuPosition.y;
      let newDirection: 'left' | 'right' = preferredDirection;
      
      if (preferredDirection === 'left') {
        // Position to the left of the parent item
        newX = itemRect.left - submenuRect.width - 4;
        newDirection = 'left';
        
        // Check if submenu overflows left edge
        if (newX < 8) {
          newX = 8;
        }
      } else {
        // Position to the right (default)
        newX = itemRect.right + 4;
        newDirection = 'right';
        
        // Check if submenu overflows right edge
        if (newX + submenuRect.width > viewportWidth - 8) {
          // Fallback to left if right doesn't fit
          newX = itemRect.left - submenuRect.width - 4;
          newDirection = 'left';
          
          // Check if left also overflows
          if (newX < 8) {
            newX = 8;
          }
        }
      }
      
      // Check if submenu overflows bottom edge
      if (newY + submenuRect.height > viewportHeight - 8) {
        newY = Math.max(8, viewportHeight - submenuRect.height - 8);
      }
      
      if (newX !== submenuPosition.x || newY !== submenuPosition.y) {
        setSubmenuPosition({ x: newX, y: newY });
      }
      setSubmenuDirection(newDirection);
    }
  }, [showSubmenu, submenuPosition.x, submenuPosition.y, item.submenuDirection]);

  // Close other submenus when this one opens
  useEffect(() => {
    if (!item.submenu) return;

    const handleCloseOtherSubmenus = (e: CustomEvent) => {
      // Don't close if this is the item that triggered the event
      if (e.detail?.itemId === itemId) return;
      setShowSubmenu(false);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };

    window.addEventListener('close-context-submenus', handleCloseOtherSubmenus as EventListener);
    return () => {
      window.removeEventListener('close-context-submenus', handleCloseOtherSubmenus as EventListener);
    };
  }, [item.submenu, itemId]);

  const handleMouseEnter = () => {
    // Cancel any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (item.submenu && itemRef.current) {
      // Close other submenus before opening this one
      window.dispatchEvent(new CustomEvent('close-context-submenus', { detail: { itemId } }));
      
      const rect = itemRef.current.getBoundingClientRect();
      const direction = item.submenuDirection || 'right';
      
      // Position based on submenuDirection
      if (direction === 'left') {
        // Position to the left - we'll calculate exact position after render
        setSubmenuPosition({
          x: rect.left - 4, // Temporary, will be adjusted
          y: rect.top - 1,
        });
        setSubmenuDirection('left');
      } else {
        // Position to the right (default)
        setSubmenuPosition({
          x: rect.right + 4,
          y: rect.top - 1,
        });
        setSubmenuDirection('right');
      }
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

  // Some apps attach document-level outside-click handlers that can run before React's onClick
  // when portals are involved. Triggering leaf-item actions on mouse down makes the menu
  // interaction reliable while still feeling instant.
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // left click only
    if (item.disabled) return;
    if (!item.submenu) {
      e.preventDefault();
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

  const menuItem = (
    <div
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
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
  );

  return (
    <>
      {item.tooltip ? (
        <Tooltip content={item.tooltip} position={item.tooltipPosition || 'left'}>
          {menuItem}
        </Tooltip>
      ) : (
        menuItem
      )}

      {/* Submenu - rendered via portal */}
      {showSubmenu && item.submenu && createPortal(
        <div
          ref={submenuRef}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
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
            z-[5001]
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
              itemId={subItem.id}
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
  menuRef: externalMenuRef,
  triggerRef,
}) => {
  const internalMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = externalMenuRef ?? internalMenuRef;
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // position.x is the button center X
        // Calculate menu position so its center aligns with button center
        let newX = position.x - rect.width / 2;
        let newY = position.y;

        // Adjust horizontal position if menu overflows viewport
        if (newX < 8) {
          // Menu would overflow left edge, align to left edge
          newX = 8;
        } else if (newX + rect.width > viewportWidth - 8) {
          // Menu would overflow right edge, align to right edge
          newX = viewportWidth - rect.width - 8;
        }

        // Adjust vertical position
        if (position.y + rect.height > viewportHeight - 8) {
          newY = Math.max(8, viewportHeight - rect.height - 8);
        }

        setAdjustedPosition({ x: newX, y: newY });
      }
    });
  }, [position, triggerRef]);

  return createPortal(
    <div
      ref={menuRef}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="
        fixed z-[5000]
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
          itemId={item.id}
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
  const menuRef = useRef<HTMLDivElement>(null);

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
        // Position menu directly below the button, center-aligned
        // We'll calculate the exact center position in ContextMenuContent
        setPosition({ 
          x: rect.left + rect.width / 2, // Button center X
          y: rect.bottom + 4 
        });
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
      const target = e.target as Node;
      // Click inside trigger OR inside menu (portal) should NOT close.
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current) {
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
    : { onClickCapture: handleOpen };

  return (
    <div ref={triggerRef} className={`inline-block w-fit ${className}`} {...triggerProps}>
      {children}
      {isOpen && (
        <ContextMenuContent
          items={items}
          position={position}
          onClose={handleClose}
          menuRef={menuRef}
          triggerRef={triggerRef}
        />
      )}
    </div>
  );
};

export default ContextMenu;

