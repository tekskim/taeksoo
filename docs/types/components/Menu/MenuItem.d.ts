import { ReactNode } from 'react';
export interface MenuItemProps {
    /** Menu icon */
    icon?: ReactNode;
    /** Menu label */
    label: string;
    /** Link URL */
    href?: string;
    /** Active state */
    active?: boolean;
    /** Badge text (New, Beta, etc.) */
    badge?: string;
    /** Click handler */
    onClick?: () => void;
    /** Disabled state */
    disabled?: boolean;
}
export declare function MenuItem({ icon, label, href, active, badge, onClick, disabled, }: MenuItemProps): import("react/jsx-runtime").JSX.Element;
