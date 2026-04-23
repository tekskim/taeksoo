import { default as React } from 'react';
export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
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
    /** Close on backdrop click */
    closeOnBackdropClick?: boolean;
    /** Close on escape key */
    closeOnEscape?: boolean;
    /** Modal width (design system presets) */
    size?: 'sm' | 'md' | 'lg';
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
export declare function Modal({ isOpen, onClose, title, description, children, closeOnBackdropClick, closeOnEscape, size, className, ...rest }: ModalProps): React.ReactPortal | null;
export declare function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmText, cancelText, confirmVariant, infoLabel, infoValue, isLoading, ...props }: ConfirmModalProps): import("react/jsx-runtime").JSX.Element;
export default Modal;
