import React, { useEffect, useCallback, useState, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { twMerge } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const OPEN_MS = 300;
const CLOSE_MS = 240;
const EASE_OPEN = 'cubic-bezier(0.32, 0.72, 0, 1)';
const EASE_CLOSE = 'cubic-bezier(0.4, 0, 0.2, 1)';

let openDrawerCount = 0;

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback when drawer should close */
  onClose: () => void;
  /** Drawer title */
  title?: string;
  /** Actions rendered beside the title (right-aligned) */
  titleActions?: React.ReactNode;
  /** Description text below the title */
  description?: string;
  /** Side from which the drawer appears */
  side?: 'left' | 'right';
  /** Width of the drawer */
  width?: string | number;
  /** @deprecated Close button has been removed from Drawer */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes drawer */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes drawer */
  closeOnEscape?: boolean;
  /** Children content */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Additional class name for the drawer */
  className?: string;
}

/* ----------------------------------------
   Drawer Component
   ---------------------------------------- */

export function Drawer({
  isOpen,
  onClose,
  title,
  titleActions,
  description,
  side = 'right',
  width = 320,
  showCloseButton: _showCloseButton,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  children,
  footer,
  className,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFirstDrawer, setIsFirstDrawer] = useState(false);
  const focusTrapRef = useFocusTrap<HTMLElement>(isOpen);
  const unmountTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) {
      clearTimeout(unmountTimer.current);
      const first = openDrawerCount === 0;
      openDrawerCount++;
      setIsFirstDrawer(first);
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
      return () => {
        openDrawerCount = Math.max(0, openDrawerCount - 1);
      };
    } else {
      setIsAnimating(false);
      unmountTimer.current = setTimeout(() => {
        setShouldRender(false);
      }, CLOSE_MS);
    }
    return () => clearTimeout(unmountTimer.current);
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!shouldRender) return null;

  const widthValue = typeof width === 'number' ? `${width}px` : width;

  const durationMs = isAnimating ? OPEN_MS : CLOSE_MS;
  const easing = isAnimating ? EASE_OPEN : EASE_CLOSE;

  const transitionStyle: React.CSSProperties = {
    transitionDuration: `${durationMs}ms`,
    transitionTimingFunction: easing,
  };

  return createPortal(
    <>
      {/* Backdrop — only the first open drawer renders the dim overlay */}
      {isFirstDrawer ? (
        <div
          className={twMerge(
            'fixed inset-0 z-[var(--z-modal)]',
            'bg-black/40',
            'transition-opacity',
            isAnimating ? 'opacity-100' : 'opacity-0'
          )}
          style={transitionStyle}
          onClick={closeOnBackdropClick ? onClose : undefined}
          aria-hidden="true"
        />
      ) : closeOnBackdropClick ? (
        <div className="fixed inset-0 z-[var(--z-modal)]" onClick={onClose} aria-hidden="true" />
      ) : null}

      {/* Drawer Panel */}
      <aside
        data-figma-name="[TDS] Overlay.Drawer"
        ref={focusTrapRef}
        className={twMerge(
          'fixed top-0 bottom-0 z-[var(--z-modal)]',
          'bg-[var(--color-surface-default)]',
          'flex flex-col',
          'shadow-2xl',
          'transition-transform will-change-transform',
          side === 'right' ? 'right-0' : 'left-0',
          isAnimating
            ? 'translate-x-0'
            : side === 'right'
              ? 'translate-x-full'
              : '-translate-x-full',
          className
        )}
        style={{ width: widthValue, ...transitionStyle }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={title && description ? descriptionId : undefined}
      >
        {/* Content */}
        <OverlayScrollbarsComponent
          options={{
            overflow: { x: 'hidden', y: 'scroll' },
            scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
          }}
          defer={false}
          className="flex-1 px-6 pt-4 pb-8"
        >
          {title && (
            <>
              <div className="flex items-center justify-between">
                <h2 id="drawer-title" className="text-heading-h5 text-[var(--color-text-default)]">
                  {title}
                </h2>
                {titleActions}
              </div>
              {description && (
                <p
                  id={descriptionId}
                  className="text-body-md text-[var(--color-text-subtle)] mt-1 mb-4"
                >
                  {description}
                </p>
              )}
              {!description && <div className="mb-4" />}
            </>
          )}
          {children}
        </OverlayScrollbarsComponent>

        {/* Footer */}
        {footer && (
          <div className="border-t border-[var(--color-border-default)] px-6 py-4 overflow-visible">
            {footer}
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}

export default Drawer;
