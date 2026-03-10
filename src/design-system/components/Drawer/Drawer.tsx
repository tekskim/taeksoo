import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';

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
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const focusTrapRef = useFocusTrap<HTMLElement>(isOpen);

  // Handle mount/unmount with animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // Add/remove event listeners
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

  const backdropClasses = twMerge(
    'fixed inset-0 z-[var(--z-modal)]',
    'bg-black/60',
    'transition-opacity duration-300 ease-out',
    isAnimating ? 'opacity-100' : 'opacity-0'
  );

  const drawerClasses = twMerge(
    'fixed top-0 bottom-0 z-[var(--z-modal)]',
    'bg-[var(--color-surface-default)]',
    'flex flex-col',
    'shadow-2xl',
    'transition-transform duration-300 ease-out',
    side === 'right' ? 'right-0' : 'left-0',
    isAnimating ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
    className
  );

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={backdropClasses}
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        ref={focusTrapRef}
        className={drawerClasses}
        style={{ width: widthValue }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Content */}
        <div className="flex-1 px-6 pt-4 pb-8 drawer-scroll">
          {title && (
            <>
              <h2 id="drawer-title" className="text-heading-h5 text-[var(--color-text-default)]">
                {title}
              </h2>
              {description && (
                <p className="text-body-md text-[var(--color-text-subtle)] mt-1 mb-4">
                  {description}
                </p>
              )}
              {!description && <div className="mb-4" />}
            </>
          )}
          {children}
        </div>

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
