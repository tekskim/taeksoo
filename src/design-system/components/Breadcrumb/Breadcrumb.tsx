import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Breadcrumb Types
   ---------------------------------------- */

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link URL (optional for current item) */
  href?: string;
  /** Click handler (alternative to href) */
  onClick?: () => void;
  /** Icon to display before label */
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Custom separator (defaults to ChevronRight) */
  separator?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Max items to show before collapsing (0 = no collapse) */
  maxItems?: number;
}

/* ----------------------------------------
   Breadcrumb Component
   ---------------------------------------- */

export function Breadcrumb({ items, separator, className = '', maxItems = 0 }: BreadcrumbProps) {
  // Collapse middle items if maxItems is set
  const displayItems =
    maxItems > 0 && items.length > maxItems
      ? [...items.slice(0, 1), { label: '...', href: undefined }, ...items.slice(-(maxItems - 1))]
      : items;

  const defaultSeparator = (
    <IconChevronRight
      size={12}
      className="text-[var(--breadcrumb-separator-color)] shrink-0"
      strokeWidth={1.5}
    />
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={twMerge('flex items-center gap-[var(--breadcrumb-gap)]', className)}
    >
      <ol className="flex items-center gap-[var(--breadcrumb-gap)] list-none m-0 p-0">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-[var(--breadcrumb-gap)]"
            >
              {/* Separator (not before first item) */}
              {index > 0 && <span aria-hidden="true">{separator ?? defaultSeparator}</span>}

              {/* Breadcrumb Item */}
              {isEllipsis ? (
                <span className="text-[length:var(--breadcrumb-font-size)] leading-[var(--breadcrumb-line-height)] font-medium text-[var(--breadcrumb-text-color)]">
                  {item.label}
                </span>
              ) : isLast ? (
                <span
                  aria-current="page"
                  className="inline-flex items-center text-[length:var(--breadcrumb-font-size)] leading-[var(--breadcrumb-line-height)] font-medium text-[var(--breadcrumb-text-current)]"
                >
                  {item.icon && <span className="mr-1 flex items-center">{item.icon}</span>}
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  onClick={item.onClick}
                  className="inline-flex items-center text-[length:var(--breadcrumb-font-size)] leading-[var(--breadcrumb-line-height)] font-medium text-[var(--breadcrumb-text-color)] hover:text-[var(--breadcrumb-text-hover)] transition-colors duration-[var(--duration-fast)]"
                >
                  {item.icon && <span className="mr-1 flex items-center">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="inline-flex items-center text-[length:var(--breadcrumb-font-size)] leading-[var(--breadcrumb-line-height)] font-medium text-[var(--breadcrumb-text-color)] hover:text-[var(--breadcrumb-text-hover)] transition-colors duration-[var(--duration-fast)] bg-transparent border-none cursor-pointer p-0"
                >
                  {item.icon && <span className="mr-1 flex items-center">{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
