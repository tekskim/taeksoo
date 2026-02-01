import { default as React } from 'react';
export type WindowControlType = 'minimize' | 'maximize' | 'close';
export interface WindowControlProps {
    /** Control type */
    type: WindowControlType;
    /** Click handler */
    onClick?: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
}
export interface WindowControlsProps {
    /** Show minimize button */
    showMinimize?: boolean;
    /** Show maximize button */
    showMaximize?: boolean;
    /** Show close button */
    showClose?: boolean;
    /** Minimize click handler */
    onMinimize?: () => void;
    /** Maximize click handler */
    onMaximize?: () => void;
    /** Close click handler */
    onClose?: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
}
export declare const WindowControl: React.FC<WindowControlProps>;
export declare const WindowControls: React.FC<WindowControlsProps>;
export default WindowControl;
