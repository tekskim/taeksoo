import { default as React, ReactNode } from 'react';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
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
export declare function Tooltip({ content, children, position, delay, disabled, ...rest }: TooltipProps): import("react/jsx-runtime").JSX.Element;
