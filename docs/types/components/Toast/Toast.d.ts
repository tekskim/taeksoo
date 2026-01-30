import { ReactNode } from 'react';
export type ToastVariant = 'success' | 'warning' | 'error' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export interface ToastLink {
    /** Link label text */
    label: string;
    /** Optional URL for external link */
    href?: string;
    /** Optional click handler */
    onClick?: () => void;
}
export interface ToastDetail {
    /** Optional error/status code */
    code?: string;
    /** Detail content/message */
    content: string;
}
export interface ToastData {
    id: string;
    variant: ToastVariant;
    message: string;
    /** Optional title for the toast */
    title?: string;
    /** Optional project/source label */
    project?: string;
    /** Optional timestamp (displayed as hh:mm format) */
    timestamp?: Date;
    /** Duration in ms before auto-dismiss (0 = never) */
    duration?: number;
    /** Whether the toast can be manually dismissed */
    dismissible?: boolean;
    /** Optional action button */
    action?: {
        label?: string;
        icon?: ReactNode;
        onClick: () => void;
    };
    /** Optional resource link (displays at bottom of toast) */
    link?: ToastLink;
    /** Optional expandable detail section */
    detail?: ToastDetail;
}
export interface ToastProps {
    /** Toast data */
    toast: ToastData;
    /** Called when toast should be removed */
    onDismiss: (id: string) => void;
    /** Custom className */
    className?: string;
}
export interface ToastContainerProps {
    /** Position of the toast container */
    position?: ToastPosition;
    /** Maximum number of toasts to show */
    maxToasts?: number;
    /** Custom className for container */
    className?: string;
}
export interface ToastContextValue {
    /** Show a toast */
    toast: (options: Omit<ToastData, 'id'>) => string;
    /** Show a success toast */
    success: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => string;
    /** Show a warning toast */
    warning: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => string;
    /** Show an error toast */
    error: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => string;
    /** Show an info toast */
    info: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => string;
    /** Dismiss a specific toast */
    dismiss: (id: string) => void;
    /** Dismiss all toasts */
    dismissAll: () => void;
}
export declare function useToast(): ToastContextValue;
export declare function Toast({ toast, onDismiss, className }: ToastProps): import("react/jsx-runtime").JSX.Element;
export declare function ToastContainer({ position, maxToasts, className }: ToastContainerProps): import("react/jsx-runtime").JSX.Element;
export declare function ToastProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
