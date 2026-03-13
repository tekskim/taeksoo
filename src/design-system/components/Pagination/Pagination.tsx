import React, { useMemo } from 'react';
import { IconChevronLeft, IconChevronRight, IconSettings } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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

/* ----------------------------------------
   Helper Functions
   ---------------------------------------- */

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const DOTS = 'dots';

/* ----------------------------------------
   Pagination Component
   ---------------------------------------- */

export const Pagination: React.FC<PaginationProps> = ({
  currentPage: rawCurrentPage,
  currentAt,
  totalPages: rawTotalPages,
  totalCount,
  size: pageSize,
  onPageChange,
  siblingCount = 1,
  // showFirstLast = true, // Reserved for future use
  disabled = false,
  showSettings = false,
  onSettingsClick,
  totalItems,
  selectedCount = 0,
  className = '',
  ...rest
}) => {
  // thaki-ui compatibility: support currentAt as alias for currentPage
  const currentPage = rawCurrentPage ?? currentAt ?? 1;

  // thaki-ui compatibility: calculate totalPages from totalCount + size
  const totalPages =
    rawTotalPages ?? (totalCount && pageSize ? Math.ceil(totalCount / pageSize) : 0);
  // Generate pagination range with dots
  const paginationRange = useMemo(() => {
    // Total page numbers to show = siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    // Case 1: Total pages is less than page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but right dots to show
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: No right dots to show, but left dots to show
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots to show
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalPages, siblingCount, currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 0) return null;

  const baseButtonClass = `
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    leading-[var(--pagination-line-height)]
    font-medium
    rounded-[var(--pagination-radius)]
    transition-colors duration-[var(--duration-fast)]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--color-border-focus)]
  `;

  const pageButtonClass = `
    ${baseButtonClass}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    cursor-pointer
  `;

  const activePageClass = `
    ${baseButtonClass}
    bg-[var(--color-action-primary)]
    text-[var(--color-text-on-primary)]
  `;

  const navButtonClass = `
    ${baseButtonClass}
    text-[var(--pagination-text)]
    hover:bg-[var(--pagination-hover-bg)]
    hover:text-[var(--pagination-text-hover)]
    disabled:text-[var(--color-text-disabled)]
    disabled:cursor-not-allowed
    disabled:hover:bg-transparent
  `;

  const dotsClass = `
    inline-flex items-center justify-center
    size-[var(--pagination-item-size)]
    text-[length:var(--pagination-font-size)]
    text-[var(--pagination-text)]
  `;

  return (
    <nav
      aria-label="Pagination"
      className={`inline-flex items-center gap-[var(--pagination-gap)] ${className}`}
      {...rest}
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={disabled || currentPage === 1}
        className={navButtonClass}
        aria-label="Previous page"
      >
        <IconChevronLeft size={14} stroke={1} />
      </button>

      {/* Page Numbers */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <span key={`dots-${index}`} className={dotsClass}>
              ···
            </span>
          );
        }

        const page = pageNumber as number;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePageClick(page)}
            disabled={disabled}
            className={isActive ? activePageClass : pageButtonClass}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={disabled || currentPage === totalPages}
        className={navButtonClass}
        aria-label="Next page"
      >
        <IconChevronRight size={14} stroke={1} />
      </button>

      {/* Settings Button */}
      {showSettings && (
        <button
          type="button"
          onClick={onSettingsClick}
          disabled={disabled}
          className={navButtonClass}
          aria-label="Pagination settings"
        >
          <IconSettings size={16} stroke={1} />
        </button>
      )}

      {/* Divider and Total Items / Selected Count */}
      {totalItems !== undefined && (
        <>
          <div className="h-4 w-px bg-[var(--color-border-default)]" />
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            {selectedCount > 0 ? (
              <span>
                <span className="text-[var(--color-text-default)] font-medium">
                  {selectedCount} selected
                </span>
                <span className="text-[var(--color-text-muted)]"> / {totalItems} items</span>
              </span>
            ) : (
              `${totalItems} items`
            )}
          </span>
        </>
      )}
    </nav>
  );
};

export default Pagination;
