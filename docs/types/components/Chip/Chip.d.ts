import { HTMLAttributes, ReactNode } from 'react';
export type ChipVariant = 'default' | 'selected';
export interface ChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Label (category/field name) */
    label?: string;
    /** Value to display */
    value: string;
    /** Chip variant */
    variant?: ChipVariant;
    /** Show close button */
    onRemove?: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Left icon */
    icon?: ReactNode;
    /** Max width for truncation */
    maxWidth?: string;
}
export declare const Chip: import('react').NamedExoticComponent<ChipProps>;
