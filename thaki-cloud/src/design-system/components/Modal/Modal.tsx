import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { Button } from '../Button';
import { WindowControl } from '../WindowControl';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal description/message */
  description?: string;
  /** Modal content (children) */
  children?: React.ReactNode;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Custom class name */
  className?: string;
}

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'danger' | 'warning';
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Info box content */
  infoLabel?: string;
  /** Info box value */
  infoValue?: string;
  /** Loading state */
  isLoading?: boolean;
}

/* ----------------------------------------
   Modal Component
   ---------------------------------------- */

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
}: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  if (!shouldRender) return null;

  const sizeClasses = {
    sm: 'w-[344px]',
    md: 'w-[344px]',
    lg: 'w-[344px]',
  };

  const backdropClasses = twMerge(
    'fixed inset-0 z-[var(--z-modal)]',
    'bg-black/60',
    'flex items-center justify-center',
    'transition-opacity duration-200 ease-out',
    isAnimating ? 'opacity-100' : 'opacity-0'
  );

  const modalClasses = twMerge(
    'bg-[var(--color-surface-default)]',
    'border border-[var(--color-border-default)]',
    'rounded-[var(--radius-lg)]',
    'shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]',
    'p-4',
    'flex flex-col gap-6',
    'transition-all duration-200 ease-out',
    isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    sizeClasses[size],
    className
  );

  return createPortal(
    <div className={backdropClasses} onClick={handleBackdropClick}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)] leading-6">
              {title}
            </h2>
            {showCloseButton && (
              <WindowControl
                type="close"
                onClick={onClose}
                className="flex-shrink-0 -mt-1 -mr-1"
              />
            )}
          </div>
          {description && (
            <p className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)] leading-4">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ----------------------------------------
   ConfirmModal Component
   ---------------------------------------- */

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  infoLabel,
  infoValue,
  isLoading = false,
  size = 'sm',
  ...props
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      {...props}
    >
      {/* Info Box */}
      {infoLabel && infoValue && (
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)] font-medium leading-[18px]">
            {infoLabel}
          </span>
          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] leading-4">
            {infoValue}
          </span>
        </div>
      )}

      {/* Button Group */}
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          size="md"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1"
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          size="md"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default Modal;

