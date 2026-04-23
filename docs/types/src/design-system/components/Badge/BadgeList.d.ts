import { ReactNode } from 'react';
import { BadgeTheme, BadgeType, BadgeSize } from './Badge';
export interface BadgeListProps {
    /** Array of badge items to display */
    items: string[];
    /** Maximum number of badges to show before collapsing */
    maxVisible?: number;
    /** Max width per badge — enables truncation with ellipsis for long text (e.g. '120px') */
    maxBadgeWidth?: string;
    /** Badge size */
    size?: BadgeSize;
    /** Badge theme */
    theme?: BadgeTheme;
    /** Badge type */
    type?: BadgeType;
    /** Popover title when showing all items (default: auto-generated from count) */
    popoverTitle?: string;
    /** Custom render for each badge item */
    renderItem?: (item: string, index: number) => ReactNode;
    /** Align the +N overflow trigger to the right, pushing it away from the badges */
    overflowAlign?: 'inline' | 'right';
}
export declare const BadgeList: import('react').NamedExoticComponent<BadgeListProps>;
