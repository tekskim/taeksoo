import { default as React } from 'react';
export interface PaginationProps {
    /** Current active page (1-indexed) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
    /** Number of sibling pages to show on each side of current page */
    siblingCount?: number;
    /** Show first/last page buttons */
    showFirstLast?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Show settings button */
    showSettings?: boolean;
    /** Callback when settings button is clicked */
    onSettingsClick?: () => void;
    /** Total number of items (displayed after divider) */
    totalItems?: number;
    /** Number of selected items */
    selectedCount?: number;
    /** Custom class name */
    className?: string;
}
export declare const Pagination: React.FC<PaginationProps>;
export default Pagination;
