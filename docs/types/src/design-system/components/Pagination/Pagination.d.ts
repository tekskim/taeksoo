import { default as React } from 'react';
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
    /** Current active page (1-indexed) */
    currentPage?: number;
    /** @deprecated thaki-ui compatibility - use currentPage instead */
    currentAt?: number;
    /** Total number of pages (provide this OR totalCount+size) */
    totalPages?: number;
    /** @deprecated thaki-ui compatibility - use totalPages instead */
    totalCount?: number;
    /** @deprecated thaki-ui compatibility - items per page, used with totalCount */
    size?: number;
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
}
export declare const Pagination: React.FC<PaginationProps>;
export default Pagination;
