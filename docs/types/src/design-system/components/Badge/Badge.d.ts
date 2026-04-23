import { HTMLAttributes, ReactNode } from 'react';
export type BadgeTheme = 'blue' | 'red' | 'green' | 'yellow' | 'gray' | 'white';
export type BadgeThemeAlias = 'blu' | 'gry' | 'gre' | 'ylw';
export type BadgeType = 'subtle';
export type BadgeSize = 'sm' | 'md';
export type BadgeLayout = 'text-only' | 'left-icon' | 'right-icon';
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Color theme (also accepts thaki-ui aliases: blu, gry, gre, ylw) */
    theme?: BadgeTheme | BadgeThemeAlias;
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
    /** @deprecated thaki-ui compatibility - use leftIcon/rightIcon instead */
    layout?: BadgeLayout;
    /** @deprecated thaki-ui compatibility - use leftIcon/rightIcon instead */
    icon?: ReactNode;
}
export declare const Badge: import('react').NamedExoticComponent<BadgeProps>;
