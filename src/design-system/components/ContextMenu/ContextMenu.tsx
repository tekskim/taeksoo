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
  /** Icon element to display before label */
  icon?: React.ReactNode;
}

export interface ContextMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Menu items */
  items: ContextMenuItem[];
  /** Trigger element */
  children: React.ReactElement;
  /** Trigger type */
  trigger?: 'click' | 'contextmenu';
  /** Disabled state */
  disabled?: boolean;
  /** Minimum top position for dropdown */
  minTop?: number;
  /** Alignment of dropdown relative to trigger (for click trigger) */
  align?: 'left' | 'right';
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
  /** Minimum top position for dropdown */
  minTop?: number;
  /** Alignment of dropdown relative to trigger */
  align?: 'left' | 'right';
  /** Trigger width for right alignment calculation */
  triggerWidth?: number;
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
      window.removeEventListener(
        'close-context-submenus',
        handleCloseOtherSubmenus as EventListener
      );
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
      role="menuitem"
      tabIndex={-1}
      aria-disabled={item.disabled || undefined}
      aria-haspopup={hasSubmenu ? 'menu' : undefined}
      aria-expanded={hasSubmenu ? showSubmenu : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={`
        flex items-center justify-between
        min-w-[var(--context-menu-min-width)]
        px-[var(--context-menu-padding-x)]
        py-[var(--context-menu-padding-y)]
        text-body-sm
        whitespace-nowrap
        cursor-pointer
        transition-colors duration-[var(--duration-fast)]
        outline-none
        ${item.divider ? 'border-b border-[var(--color-border-subtle)]' : ''}
        ${
          item.status === 'danger'
            ? 'text-[var(--color-state-danger)] hover:bg-[var(--color-state-danger-bg)] focus-visible:bg-[var(--color-state-danger-bg)]'
            : 'text-[var(--color-text-default)] hover:bg-[var(--context-menu-hover-bg)] focus-visible:bg-[var(--context-menu-hover-bg)]'
        }
        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${showSubmenu ? 'bg-[var(--context-menu-hover-bg)]' : ''}
      `}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {item.icon && (
          <span className="shrink-0 text-[var(--color-text-muted)] flex items-center">
            {item.icon}
          </span>
        )}
        <span className="flex-1">{item.label}</span>
      </div>
      {hasSubmenu && <IconChevronRight size={12} stroke={1} className="ml-6 shrink-0" />}
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
      {showSubmenu &&
        item.submenu &&
        createPortal(
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
            z-[calc(var(--z-context-menu)+1)]
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
  minTop,
  align = 'left',
  triggerWidth = 0,
}) => {
  const internalMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = externalMenuRef ?? internalMenuRef;
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX: number;
        if (align === 'right') {
          newX = position.x + triggerWidth - rect.width;
        } else {
          newX = position.x;
        }
        let newY = position.y;

        if (newX + rect.width > viewportWidth - 8) {
          newX = viewportWidth - rect.width - 8;
        }
        if (newX < 8) {
          newX = 8;
        }

        if (position.y + rect.height > viewportHeight - 8) {
          newY = Math.max(8, viewportHeight - rect.height - 8);
        }

        if (minTop !== undefined && newY < minTop) {
          newY = minTop;
        }

        setAdjustedPosition({ x: newX, y: newY });
      }
    });
  }, [position, triggerRef, minTop, align, triggerWidth]);

  // Focus first item on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      if (menuRef.current) {
        const firstItem = menuRef.current.querySelector<HTMLElement>('[role="menuitem"]');
        firstItem?.focus();
      }
    });
  }, []);

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const menu = menuRef.current;
      if (!menu) return;

      const menuItems = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
      );
      if (menuItems.length === 0) return;

      const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[next].focus();
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prev].focus();
          break;
        }
        case 'Home': {
          e.preventDefault();
          menuItems[0].focus();
          break;
        }
        case 'End': {
          e.preventDefault();
          menuItems[menuItems.length - 1].focus();
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (currentIndex >= 0) {
            menuItems[currentIndex].click();
          }
          break;
        }
      }
    },
    [onClose]
  );

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleMenuKeyDown}
      className="
        fixed z-[var(--z-context-menu)]
        flex flex-col
        bg-[var(--color-surface-default)]
        border border-[var(--color-border-strong)]
        rounded-[var(--context-menu-radius)]
        shadow-[var(--shadow-md)]
        overflow-hidden
        transition-opacity duration-[var(--duration-fast)]
        outline-none
      "
      style={{
        left: adjustedPosition?.x ?? position.x,
        top: adjustedPosition?.y ?? position.y,
        opacity: adjustedPosition ? 1 : 0,
      }}
      tabIndex={-1}
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
  minTop,
  align = 'left',
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [triggerWidth, setTriggerWidth] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleOpen = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      previousFocusRef.current = document.activeElement as HTMLElement;

      if (trigger === 'contextmenu') {
        e.preventDefault();

        const closeEvent = new CustomEvent('contextmenu:close-all');
        document.dispatchEvent(closeEvent);

        setPosition({ x: e.clientX, y: e.clientY });
        setTriggerWidth(0);
        setIsOpen(true);
      } else {
        if (isOpen) {
          setIsOpen(false);
          return;
        }

        if (triggerRef.current) {
          const triggerElement = triggerRef.current.firstElementChild as HTMLElement | null;
          const rect =
            triggerElement?.getBoundingClientRect() ?? triggerRef.current.getBoundingClientRect();
          setPosition({
            x: rect.left,
            y: rect.bottom + 4,
          });
          setTriggerWidth(rect.width);
        }
        setIsOpen(true);
      }
    },
    [disabled, trigger, isOpen]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      try {
        previousFocusRef.current.focus();
      } catch {
        // Element may have been removed from DOM
      }
    }
  }, []);

  // Close on click outside and when other context menu opens
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isOpen) return;

      const target = e.target as Node;
      // Click inside trigger OR inside menu (portal) should NOT close.
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current) {
        handleClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    // 다른 컨텍스트 메뉴가 열릴 때 현재 메뉴 닫기
    const handleCloseAll = () => {
      if (isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      // Delay to prevent immediate close
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }, 0);
    }

    // 전역 이벤트 리스너는 항상 등록
    document.addEventListener('contextmenu:close-all', handleCloseAll);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('contextmenu:close-all', handleCloseAll);
    };
  }, [isOpen, handleClose]);

  const triggerProps =
    trigger === 'contextmenu' ? { onContextMenu: handleOpen } : { onClickCapture: handleOpen };

  return (
    <div ref={triggerRef} className={`inline-block w-fit ${className}`} {...rest} {...triggerProps}>
      {children}
      {isOpen && (
        <ContextMenuContent
          items={items}
          position={position}
          onClose={handleClose}
          menuRef={menuRef}
          triggerRef={triggerRef}
          minTop={minTop}
          align={align}
          triggerWidth={triggerWidth}
        />
      )}
    </div>
  );
};

export default ContextMenu;
