import { ReactNode, HTMLAttributes } from 'react';
export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Default open state (uncontrolled) */
    defaultOpen?: boolean;
    /** Controlled open state */
    open?: boolean;
    /** Callback when open state changes */
    onChange?: (open: boolean) => void;
    children: ReactNode;
}
export interface DisclosureTriggerProps extends HTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}
export interface DisclosurePanelProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
export declare function Disclosure({ defaultOpen, open: controlledOpen, onChange, children, className, ...props }: DisclosureProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Disclosure {
    var Trigger: typeof DisclosureTrigger;
    var Panel: typeof DisclosurePanel;
}
export declare function DisclosureTrigger({ children, className, ...props }: DisclosureTriggerProps): import("react/jsx-runtime").JSX.Element;
export declare function DisclosurePanel({ children, className, ...props }: DisclosurePanelProps): import("react/jsx-runtime").JSX.Element | null;
