import { HTMLAttributes, ReactNode } from 'react';
export interface SelectionItem {
    /** Unique identifier for the item */
    id: string;
    /** Display label for the item */
    label: string;
}
export interface SelectionIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Selected items to display */
    selectedItems?: SelectionItem[];
    /** Callback when an item is removed */
    onRemove?: (id: string) => void;
    /** Text to show when no items are selected */
    emptyText?: string;
    /** Additional content to render on the right side */
    rightContent?: ReactNode;
    /** Whether to allow removing items */
    removable?: boolean;
    /** Whether to show error state */
    error?: boolean;
    /** Error message to display when in error state and no items selected */
    errorMessage?: string;
}
export declare function SelectionIndicator({ selectedItems, onRemove, emptyText, rightContent, removable, error, errorMessage, className, ...props }: SelectionIndicatorProps): import("react/jsx-runtime").JSX.Element;
