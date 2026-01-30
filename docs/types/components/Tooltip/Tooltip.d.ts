import { ReactNode } from 'react';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipProps {
    /** Tooltip content */
    content: ReactNode;
    /** Trigger element */
    children: ReactNode;
    /** Position relative to trigger */
    position?: TooltipPosition;
    /** Delay before showing (ms) */
    delay?: number;
    /** Disable tooltip */
    disabled?: boolean;
}
export declare function Tooltip({ content, children, position, delay, disabled, }: TooltipProps): import("react/jsx-runtime").JSX.Element;
