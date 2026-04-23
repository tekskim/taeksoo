import { ReactNode } from 'react';
export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'hover' | 'click';
export type PopoverAlign = 'center' | 'start' | 'end';
export interface PopoverProps {
    /** Popover content - can be interactive */
    content: ReactNode;
    /** Trigger element */
    children: ReactNode;
    /** Position relative to trigger */
    position?: PopoverPosition;
    /** Horizontal alignment for top/bottom, vertical for left/right */
    align?: PopoverAlign;
    /** How to trigger the popover */
    trigger?: PopoverTrigger;
    /** Delay before showing (ms) - only for hover trigger */
    delay?: number;
    /** Delay before hiding (ms) - only for hover trigger */
    hideDelay?: number;
    /** Disable popover */
    disabled?: boolean;
    /** Controlled open state */
    isOpen?: boolean;
    /** Callback when open state changes */
    onOpenChange?: (isOpen: boolean) => void;
    /** Close on outside click - default true for click trigger */
    closeOnOutsideClick?: boolean;
    /** Close on escape key - default true */
    closeOnEscape?: boolean;
    /** Show arrow */
    showArrow?: boolean;
    /** Custom class for popover content */
    className?: string;
    /** Accessible label for the popover */
    'aria-label'?: string;
}
export declare function Popover({ content, children, position, align, trigger, delay, hideDelay, disabled, isOpen: controlledIsOpen, onOpenChange, closeOnOutsideClick, closeOnEscape, showArrow, className, 'aria-label': ariaLabel, }: PopoverProps): import("react/jsx-runtime").JSX.Element;
