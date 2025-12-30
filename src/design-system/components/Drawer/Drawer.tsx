import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { IconX } from '@tabler/icons-react';

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
  /** Side from which the drawer appears */
  side?: 'left' | 'right';
  /** Width of the drawer */
  width?: string | number;
  /** Whether to show close button */
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
  side = 'right',
  width = 320,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  children,
  footer,
  className,
}: DrawerProps) {
  // State to manage mount/unmount with animation
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Add/remove event listeners and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!shouldRender) return null;

  const widthValue = typeof width === 'number' ? `${width}px` : width;

  const backdropClasses = twMerge(
    'fixed inset-0 z-50',
    'bg-black/60',
    'transition-opacity duration-300 ease-out',
    isAnimating ? 'opacity-100' : 'opacity-0'
  );

  const drawerClasses = twMerge(
    'fixed top-0 bottom-0 z-50',
    'bg-[var(--color-surface-default)]',
    'flex flex-col',
    'shadow-2xl',
    'transition-transform duration-300 ease-out',
    side === 'right' ? 'right-0' : 'left-0',
    isAnimating
      ? 'translate-x-0'
      : side === 'right'
      ? 'translate-x-full'
      : '-translate-x-full',
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
        className={drawerClasses}
        style={{ width: widthValue }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
            {title && (
              <h2
                id="drawer-title"
                className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)] leading-[var(--line-height-24)]"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded hover:bg-[var(--color-surface-subtle)] transition-colors"
                aria-label="Close drawer"
              >
                <IconX size={16} className="text-[var(--color-text-muted)]" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 drawer-scroll">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-[var(--color-border-default)] px-6 py-4">
            {footer}
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}

export default Drawer;

