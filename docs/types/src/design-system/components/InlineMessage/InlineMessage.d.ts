import { HTMLAttributes, ReactNode } from 'react';
export type InlineMessageVariant = 'success' | 'warning' | 'error' | 'info';
export type ThakiInlineMessageType = InlineMessageVariant;
export interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
    /** Message variant (also accepts thaki-ui 'type') */
    variant?: InlineMessageVariant;
    /** Message content */
    children?: ReactNode;
    /** Hide icon */
    hideIcon?: boolean;
    /** Custom icon */
    icon?: ReactNode;
    /** @deprecated thaki-ui compatibility - use variant instead */
    type?: ThakiInlineMessageType;
    /** @deprecated thaki-ui compatibility - use children instead */
    message?: ReactNode;
    /** @deprecated thaki-ui compatibility - close button (not implemented, handle in parent) */
    closable?: boolean;
    /** @deprecated thaki-ui compatibility - close callback */
    onClose?: () => void;
    /** @deprecated thaki-ui compatibility - expandable content (not implemented) */
    expandable?: boolean;
}
export declare function InlineMessage({ variant: rawVariant, children, hideIcon, icon, className, type, message, closable, onClose, expandable, ...props }: InlineMessageProps): import("react/jsx-runtime").JSX.Element;
