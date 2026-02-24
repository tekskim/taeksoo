import { ReactNode } from 'react';
export interface MenuSectionProps {
    /** Section title */
    title: string;
    /** Menu items */
    children: ReactNode;
    /** Default open state */
    defaultOpen?: boolean;
    /** Collapsible */
    collapsible?: boolean;
    /** Click handler for title */
    onTitleClick?: () => void;
}
export declare function MenuSection({ title, children, defaultOpen, collapsible, onTitleClick, }: MenuSectionProps): import("react/jsx-runtime").JSX.Element;
