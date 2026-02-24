import { default as React } from 'react';
export interface FilterItem {
    id: string;
    field: string;
    value: string;
}
export interface ListToolbarProps {
    /** Primary actions (left side) - typically search, download */
    primaryActions?: React.ReactNode;
    /** Bulk actions - actions for selected items */
    bulkActions?: React.ReactNode;
    /** Whether to show divider between primary and bulk actions */
    showDivider?: boolean;
    /** Active filters */
    filters?: FilterItem[];
    /** Callback when a filter is removed */
    onFilterRemove?: (id: string) => void;
    /** Callback when all filters are cleared */
    onFiltersClear?: () => void;
    /** Label for clear filters button */
    clearFiltersLabel?: string;
    /** Additional class name */
    className?: string;
    /** Children for custom content */
    children?: React.ReactNode;
}
export interface ListToolbarActionsProps {
    children: React.ReactNode;
    className?: string;
}
export declare function ListToolbarActions({ children, className }: ListToolbarActionsProps): import("react/jsx-runtime").JSX.Element;
export interface ListToolbarDividerProps {
    className?: string;
}
export declare function ListToolbarDivider({ className }: ListToolbarDividerProps): import("react/jsx-runtime").JSX.Element;
export interface ListToolbarFiltersProps {
    filters: FilterItem[];
    onFilterRemove?: (id: string) => void;
    onFiltersClear?: () => void;
    clearFiltersLabel?: string;
    className?: string;
}
export declare function ListToolbarFilters({ filters, onFilterRemove, onFiltersClear, clearFiltersLabel, className, }: ListToolbarFiltersProps): import("react/jsx-runtime").JSX.Element | null;
export declare function ListToolbar({ primaryActions, bulkActions, showDivider, filters, onFilterRemove, onFiltersClear, clearFiltersLabel, className, children, }: ListToolbarProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ListToolbar {
    var Actions: typeof ListToolbarActions;
    var Divider: typeof ListToolbarDivider;
    var Filters: typeof ListToolbarFilters;
}
export default ListToolbar;
