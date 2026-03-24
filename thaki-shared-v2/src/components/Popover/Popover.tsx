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

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'hover' | 'click';

export interface PopoverProps {
  content: ReactNode;
  children: ReactNode;
  position?: PopoverPosition;
  trigger?: PopoverTrigger;
  delay?: number;
  hideDelay?: number;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showArrow?: boolean;
  className?: string;
  'aria-label'?: string;
}

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

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) setInternalIsOpen(open);
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
      showTimeoutRef.current = window.setTimeout(() => setIsOpen(true), delay);
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
    if (isOpen) handleClose();
    else handleOpen();
  }, [disabled, isOpen, handleOpen, handleClose]);

  const handleTriggerClick = useCallback(() => {
    if (trigger === 'click') handleToggle();
  }, [trigger, handleToggle]);

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (trigger === 'click' && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        handleToggle();
      }
    },
    [trigger, handleToggle]
  );

  const handlePopoverMouseEnter = useCallback(() => {
    if (trigger === 'hover') clearTimeouts();
  }, [trigger, clearTimeouts]);

  const handlePopoverMouseLeave = useCallback(() => {
    if (trigger === 'hover') handleClose();
  }, [trigger, handleClose]);

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

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick || trigger === 'hover') return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      handleClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnOutsideClick, trigger, handleClose]);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => updatePosition());
  }, [isOpen, updatePosition]);

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

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const renderArrow = (pos: PopoverPosition) => {
    const outer = 'var(--semantic-color-border, #e2e8f0)';
    const inner = 'var(--semantic-color-surface, #fff)';
    switch (pos) {
      case 'bottom':
        return (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderBottom: `7px solid ${outer}`,
              }}
            />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-[-1px] w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: `6px solid ${inner}`,
              }}
            />
          </div>
        );
      case 'top':
        return (
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `7px solid ${outer}`,
              }}
            />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${inner}`,
              }}
            />
          </div>
        );
      case 'left':
        return (
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-px">
            <div
              className="w-0 h-0"
              style={{
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderLeft: `7px solid ${outer}`,
              }}
            />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-[1px] w-0 h-0"
              style={{
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: `6px solid ${inner}`,
              }}
            />
          </div>
        );
      case 'right':
        return (
          <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-px">
            <div
              className="w-0 h-0"
              style={{
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderRight: `7px solid ${outer}`,
              }}
            />
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-[1px] w-0 h-0"
              style={{
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: `6px solid ${inner}`,
              }}
            />
          </div>
        );
    }
  };

  const reactId = useId();
  const popoverId = `popover-${reactId}`;

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
            className="fixed z-50 transition-opacity duration-150"
            style={{ left: coords.x, top: coords.y, opacity: isPositioned ? 1 : 0 }}
          >
            <div className="relative">
              <div className={`bg-surface border border-border rounded-lg shadow-lg ${className}`}>
                {content}
              </div>
              {showArrow && renderArrow(position)}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Popover;
