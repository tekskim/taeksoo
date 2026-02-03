import { ReactNode } from 'react';
export interface BreadcrumbItem {
    /** Display label */
    label: string;
    /** Link URL (optional for current item) */
    href?: string;
    /** Click handler (alternative to href) */
    onClick?: () => void;
    /** Icon to display before label */
    icon?: ReactNode;
}
export interface BreadcrumbProps {
    /** Breadcrumb items */
    items: BreadcrumbItem[];
    /** Custom separator (defaults to ChevronRight) */
    separator?: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Max items to show before collapsing (0 = no collapse) */
    maxItems?: number;
}
export declare function Breadcrumb({ items, separator, className, maxItems, }: BreadcrumbProps): import("react/jsx-runtime").JSX.Element;
