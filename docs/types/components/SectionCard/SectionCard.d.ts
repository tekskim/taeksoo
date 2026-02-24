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
    /** Show divider below header (default: false) */
    showDivider?: boolean;
}
declare function SectionCardHeader({ title, actions, showDivider, className, ...props }: SectionCardHeaderProps): import("react/jsx-runtime").JSX.Element;
export interface SectionCardContentProps extends HTMLAttributes<HTMLDivElement> {
    /** Content children */
    children: ReactNode;
    /** Gap between items (default: 3) */
    gap?: 1 | 2 | 3 | 4 | 5 | 6;
}
declare function SectionCardContent({ children, gap, className, ...props }: SectionCardContentProps): import("react/jsx-runtime").JSX.Element;
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
    /** Show divider above (default: true) */
    showDivider?: boolean;
}
declare function SectionCardDataRow({ label, value, children, isLink, linkHref, showDivider, className, ...props }: SectionCardDataRowProps): import("react/jsx-runtime").JSX.Element;
export { SectionCardHeader, SectionCardContent, SectionCardDataRow, };
