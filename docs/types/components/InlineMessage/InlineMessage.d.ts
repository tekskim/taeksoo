import { HTMLAttributes, ReactNode } from 'react';
export type InlineMessageVariant = 'success' | 'warning' | 'error' | 'info';
export interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
    /** Message variant */
    variant?: InlineMessageVariant;
    /** Message content */
    children: ReactNode;
    /** Hide icon */
    hideIcon?: boolean;
    /** Custom icon */
    icon?: ReactNode;
}
export declare function InlineMessage({ variant, children, hideIcon, icon, className, ...props }: InlineMessageProps): import("react/jsx-runtime").JSX.Element;
