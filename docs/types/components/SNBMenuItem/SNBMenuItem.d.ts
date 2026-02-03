import { default as React } from 'react';
export type SNBMenuItemStatus = 'default' | 'hover' | 'selected';
export type SNBMenuItemType = 'icon' | 'text';
export interface SNBMenuItemProps {
    /** Status of the menu item */
    status?: SNBMenuItemStatus;
    /** Type of menu item (icon or text) */
    type?: SNBMenuItemType;
    /** Icon element (for type="icon") */
    icon?: React.ReactNode;
    /** Text content (for type="text") */
    text?: string;
    /** Size of the icon (default: 22) */
    iconSize?: number;
    /** Click handler */
    onClick?: () => void;
    /** Additional class name */
    className?: string;
    /** Whether the item is selected (alternative to status="selected") */
    isSelected?: boolean;
    /** Children (alternative to icon prop) */
    children?: React.ReactNode;
}
/**
 * SNBMenuItem - Side Navigation Bar Menu Item
 *
 * A menu item component for the narrow side navigation bar.
 * Supports default, hover, and selected states with appropriate styling.
 *
 * Design tokens used:
 * - default: bg-white, icon: #64748b (text-muted)
 * - hover: bg-[#f8fafc] (surface-subtle), icon: #334155 (text-default)
 * - selected: bg-[#eff6ff] (info-weak-bg), icon: #2563eb (primary)
 */
export declare function SNBMenuItem({ status: propStatus, type, icon, text, iconSize, onClick, className, isSelected, children, }: SNBMenuItemProps): import("react/jsx-runtime").JSX.Element;
export default SNBMenuItem;
