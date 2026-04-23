import { default as React } from 'react';
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
export declare function Drawer({ isOpen, onClose, title, description, side, width, showCloseButton: _showCloseButton, closeOnBackdropClick, closeOnEscape, children, footer, className, }: DrawerProps): React.ReactPortal | null;
export default Drawer;
