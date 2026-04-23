import { ButtonHTMLAttributes, ReactNode } from 'react';
export type CopyButtonVariant = 'default' | 'ghost' | 'outline';
export type CopyButtonSize = 'sm' | 'md' | 'lg';
export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /** Text to copy to clipboard */
    value: string;
    /** Button variant */
    variant?: CopyButtonVariant;
    /** Button size */
    size?: CopyButtonSize;
    /** Custom copy icon */
    copyIcon?: ReactNode;
    /** Custom success icon */
    successIcon?: ReactNode;
    /** Label text (optional, shows text next to icon) */
    label?: string;
    /** Success label (shown after copy) */
    successLabel?: string;
    /** Time to show success state (ms) */
    successDuration?: number;
    /** Callback on successful copy */
    onCopy?: (value: string) => void;
    /** Callback on copy error */
    onError?: (error: Error) => void;
    /** Show only icon (no label) */
    iconOnly?: boolean;
    /** Tooltip text */
    tooltip?: string;
    /** Additional CSS classes */
    className?: string;
}
export declare const CopyButton: import('react').ForwardRefExoticComponent<CopyButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export interface CopyableProps {
    /** Value to display and copy */
    value: string;
    /** Truncate the displayed value */
    truncate?: boolean;
    /** Max width for truncation */
    maxWidth?: string | number;
    /** Size of the copy button */
    size?: CopyButtonSize;
    /** Additional CSS classes for the container */
    className?: string;
    /** Callback on successful copy */
    onCopy?: (value: string) => void;
}
export declare const Copyable: import('react').ForwardRefExoticComponent<CopyableProps & import('react').RefAttributes<HTMLDivElement>>;
export default CopyButton;
