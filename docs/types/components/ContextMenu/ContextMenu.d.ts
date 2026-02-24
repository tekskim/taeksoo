import { default as React } from 'react';
export interface ContextMenuItem {
    /** Unique identifier */
    id: string;
    /** Display label */
    label: string;
    /** Item status/variant */
    status?: 'default' | 'danger';
    /** Submenu items */
    submenu?: ContextMenuItem[];
    /** Click handler */
    onClick?: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Divider after this item */
    divider?: boolean;
    /** Tooltip content (shown on hover) */
    tooltip?: string;
    /** Tooltip position */
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
    /** Submenu direction (left or right) */
    submenuDirection?: 'left' | 'right';
    /** Icon element to display before label */
    icon?: React.ReactNode;
}
export interface ContextMenuProps {
    /** Menu items */
    items: ContextMenuItem[];
    /** Trigger element */
    children: React.ReactElement;
    /** Trigger type */
    trigger?: 'click' | 'contextmenu';
    /** Disabled state */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
    /** Minimum top position for dropdown */
    minTop?: number;
    /** Alignment of dropdown relative to trigger (for click trigger) */
    align?: 'left' | 'right';
}
export interface ContextMenuContentProps {
    /** Menu items */
    items: ContextMenuItem[];
    /** Position */
    position: {
        x: number;
        y: number;
    };
    /** Close handler */
    onClose: () => void;
    /** Parent direction (for submenu positioning) */
    parentDirection?: 'left' | 'right';
    /** Ref to the rendered menu element (for outside click detection) */
    menuRef?: React.RefObject<HTMLDivElement>;
    /** Trigger element ref (for positioning relative to trigger) */
    triggerRef?: React.RefObject<HTMLElement>;
    /** Minimum top position for dropdown */
    minTop?: number;
    /** Alignment of dropdown relative to trigger */
    align?: 'left' | 'right';
    /** Trigger width for right alignment calculation */
    triggerWidth?: number;
}
export declare const ContextMenu: React.FC<ContextMenuProps>;
export default ContextMenu;
