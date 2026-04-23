import { ReactNode, HTMLAttributes } from 'react';
export interface SectionCardProps extends HTMLAttributes<HTMLDivElement> {
    /** Child components */
    children: ReactNode;
    /** Active state - shows blue border */
    isActive?: boolean;
}
export declare function SectionCard({ children, isActive, className, ...props }: SectionCardProps): import("react/jsx-runtime").JSX.Element;
export declare namespace SectionCard {
    var Header: typeof SectionCardHeader;
    var Content: typeof SectionCardContent;
    var DataRow: typeof SectionCardDataRow;
}
export interface SectionCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Section title */
    title: string;
    /** Optional action buttons (e.g., Edit button) */
    actions?: ReactNode;
    /** Show divider below header (default: true) */
    showDivider?: boolean;
    /** Optional status icon (e.g., for Wizard sections) */
    statusIcon?: ReactNode;
    /** Optional description text below title, above divider */
    description?: string;
}
declare function SectionCardHeader({ title, actions, showDivider, statusIcon, description, className, ...props }: SectionCardHeaderProps): import("react/jsx-runtime").JSX.Element;
export interface SectionCardContentProps extends HTMLAttributes<HTMLDivElement> {
    /** Content children */
    children: ReactNode;
    /** Show dividers between children (default: true for DataRow lists, false for forms) */
    showDividers?: boolean;
    /** Gap between children (overrides default gap-3) */
    gap?: number;
}
declare function SectionCardContent({ children, className, showDividers, gap, ...props }: SectionCardContentProps): import("react/jsx-runtime").JSX.Element;
export interface SectionCardDataRowProps extends HTMLAttributes<HTMLDivElement> {
    /** Label for the data row */
    label: ReactNode;
    /** Value to display (string) - use this or children */
    value?: string;
    /** Custom content - use this for complex values like chips */
    children?: ReactNode;
    /** Render as a link */
    isLink?: boolean;
    /** Link destination (required if isLink is true) */
    linkHref?: string;
    /** @deprecated - no longer used, dividers are managed by Content */
    showDivider?: boolean;
}
declare function SectionCardDataRow({ label, value, children, isLink, linkHref, className, ...props }: SectionCardDataRowProps): import("react/jsx-runtime").JSX.Element;
export { SectionCardHeader, SectionCardContent, SectionCardDataRow };
