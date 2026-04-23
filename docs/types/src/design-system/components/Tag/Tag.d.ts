import { HTMLAttributes, ReactNode } from 'react';
export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type TagSize = 'sm' | 'md' | 'lg';
export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    /** Tag content */
    children: ReactNode;
    /** Tag variant/color */
    variant?: TagVariant;
    /** Tag size */
    size?: TagSize;
    /** Show close button */
    closable?: boolean;
    /** Close button click handler */
    onClose?: () => void;
    /** Left icon */
    icon?: ReactNode;
    /** Disabled state */
    disabled?: boolean;
    /** Rounded style (pill shape) */
    rounded?: boolean;
    /** Outline style (bordered, no fill) */
    outline?: boolean;
    /** Clickable tag */
    clickable?: boolean;
    /** Additional CSS classes */
    className?: string;
}
export declare const Tag: import('react').ForwardRefExoticComponent<TagProps & import('react').RefAttributes<HTMLSpanElement>>;
export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Gap between tags */
    gap?: 'sm' | 'md' | 'lg';
    /** Children tags */
    children: ReactNode;
}
export declare const TagGroup: import('react').ForwardRefExoticComponent<TagGroupProps & import('react').RefAttributes<HTMLDivElement>>;
export default Tag;
