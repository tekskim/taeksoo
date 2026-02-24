import { HTMLAttributes, ReactNode } from 'react';
export type BadgeTheme = 'blue' | 'red' | 'green' | 'yellow' | 'gray';
export type BadgeType = 'solid' | 'subtle';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Color theme */
    theme?: BadgeTheme;
    /** Style type */
    type?: BadgeType;
    /** Badge size */
    size?: BadgeSize;
    /** Left icon */
    leftIcon?: ReactNode;
    /** Right icon */
    rightIcon?: ReactNode;
    /** Show dot indicator */
    dot?: boolean;
    /** Badge content */
    children: ReactNode;
    /** @deprecated Use theme prop instead */
    variant?: BadgeVariant;
}
export declare const Badge: import('react').NamedExoticComponent<BadgeProps>;
