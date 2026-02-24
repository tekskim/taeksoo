import { default as React } from 'react';
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
export declare function Modal({ isOpen, onClose, title, description, children, size, showCloseButton: _showCloseButton, closeOnBackdropClick, closeOnEscape, className, }: ModalProps): React.ReactPortal | null;
export declare function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmText, cancelText, confirmVariant, infoLabel, infoValue, isLoading, size, ...props }: ConfirmModalProps): import("react/jsx-runtime").JSX.Element;
export default Modal;
