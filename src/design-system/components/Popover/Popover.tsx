import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';

/* ----------------------------------------
   Popover Types
   ---------------------------------------- */

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'hover' | 'click';

export interface PopoverProps {
  /** Popover content - can be interactive */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  /** Position relative to trigger */
  position?: PopoverPosition;
  /** How to trigger the popover */
  trigger?: PopoverTrigger;
  /** Delay before showing (ms) - only for hover trigger */
  delay?: number;
  /** Delay before hiding (ms) - only for hover trigger */
  hideDelay?: number;
  /** Disable popover */
  disabled?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Close on outside click - default true for click trigger */
  closeOnOutsideClick?: boolean;
  /** Close on escape key - default true */
  closeOnEscape?: boolean;
  /** Show arrow */
  showArrow?: boolean;
  /** Custom class for popover content */
  className?: string;
  /** Accessible label for the popover */
  'aria-label'?: string;
}

/* ----------------------------------------
   Popover Component
   ---------------------------------------- */

export function Popover({
  content,
  children,
  position = 'bottom',
  trigger = 'click',
  delay = 200,
  hideDelay = 150,
  disabled = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showArrow = true,
  className = '',
  'aria-label': ariaLabel,
}: PopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<number | undefined>(undefined);
  const hideTimeoutRef = useRef<number | undefined>(undefined);

  // Controlled vs uncontrolled state
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange]
  );

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const gap = showArrow ? 8 : 4;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        y = triggerRect.top - popoverRect.height - gap;
        break;
      case 'bottom':
        x = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        y = triggerRect.bottom + gap;
        break;
      case 'left':
        x = triggerRect.left - popoverRect.width - gap;
        y = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        break;
      case 'right':
        x = triggerRect.right + gap;
        y = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        break;
    }

    // Keep popover within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - popoverRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - popoverRect.height - 8));

    setCoords({ x, y });
    setIsPositioned(true);
  }, [position, showArrow]);

  const clearTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
  }, []);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    clearTimeouts();

    if (trigger === 'hover') {
      showTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(true);
      }, delay);
    } else {
      setIsOpen(true);
    }
  }, [disabled, trigger, delay, setIsOpen, clearTimeouts]);

  const handleClose = useCallback(() => {
    clearTimeouts();

    if (trigger === 'hover') {
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
        setIsPositioned(false);
      }, hideDelay);
    } else {
      setIsOpen(false);
      setIsPositioned(false);
    }
  }, [trigger, hideDelay, setIsOpen, clearTimeouts]);

  const handleToggle = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [disabled, isOpen, handleOpen, handleClose]);

  const handleTriggerClick = useCallback(() => {
    if (trigger === 'click') {
      handleToggle();
    }
  }, [trigger, handleToggle]);

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (trigger === 'click') {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
      }
    },
    [trigger, handleToggle]
  );

  const handlePopoverMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      clearTimeouts();
    }
  }, [trigger, clearTimeouts]);

  const handlePopoverMouseLeave = useCallback(() => {
    if (trigger === 'hover') {
      handleClose();
    }
  }, [trigger, handleClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, handleClose]);

  // Handle outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick || trigger === 'hover') return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) {
        return;
      }
      handleClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnOutsideClick, trigger, handleClose]);

  // Update position when open
  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [isOpen, updatePosition]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, updatePosition]);

  // Cleanup timeouts
  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  // Arrow renderer using double-triangle technique (border triangle + fill triangle)
  // Same approach as PhysicalDisksPage OSD popover
  const renderArrow = (pos: PopoverPosition) => {
    switch (pos) {
      case 'bottom':
        return (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]">
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-[var(--color-border-default)]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-[-1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--color-surface-default)]" />
          </div>
        );
      case 'top':
        return (
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[var(--color-border-default)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-surface-default)]" />
          </div>
        );
      case 'left':
        return (
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-px">
            <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[7px] border-l-[var(--color-border-default)]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-[1px] w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[var(--color-surface-default)]" />
          </div>
        );
      case 'right':
        return (
          <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-px">
            <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-[var(--color-border-default)]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-[1px] w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[var(--color-surface-default)]" />
          </div>
        );
    }
  };

  const reactId = useId();
  const popoverId = `popover-${reactId}`;

  // Clone children to add ARIA attributes
  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'aria-expanded': isOpen,
        'aria-haspopup': 'dialog' as const,
        'aria-controls': isOpen ? popoverId : undefined,
      })
    : children;

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        onMouseEnter={trigger === 'hover' ? handleOpen : undefined}
        onMouseLeave={trigger === 'hover' ? handleClose : undefined}
        onFocus={trigger === 'hover' ? handleOpen : undefined}
        onBlur={trigger === 'hover' ? handleClose : undefined}
        className="inline-flex"
      >
        {enhancedChildren}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            role="dialog"
            aria-label={ariaLabel}
            aria-modal={trigger === 'click'}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
            className="fixed z-[var(--z-popover)] transition-opacity duration-[var(--duration-fast)]"
            style={{
              left: coords.x,
              top: coords.y,
              opacity: isPositioned ? 1 : 0,
            }}
          >
            <div className="relative">
              {/* Popover Box */}
              <div
                data-figma-name="Popover"
                className={`
                  bg-[var(--color-surface-default)]
                  border border-[var(--color-border-default)]
                  rounded-[var(--primitive-radius-lg)]
                  shadow-lg
                  ${className}
                `}
              >
                {content}
              </div>
              {/* Arrow */}
              {showArrow && renderArrow(position)}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
