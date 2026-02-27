import { Link, useLocation } from 'react-router-dom';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { allNavItems } from './navigationData';

export function PrevNextNav() {
  const location = useLocation();
  const currentIndex = allNavItems.findIndex((item) => item.path === location.pathname);
  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? allNavItems[currentIndex - 1] : null;
  const next = currentIndex < allNavItems.length - 1 ? allNavItems[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="flex items-stretch gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
      {prev ? (
        <Link
          to={prev.path}
          className="group flex-1 flex items-center gap-2 px-4 py-3 rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-surface-muted)] transition-colors"
        >
          <IconChevronLeft
            size={14}
            stroke={1.5}
            className="shrink-0 text-[var(--color-text-subtle)] group-hover:text-[var(--color-action-primary)] transition-colors"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-body-xs text-[var(--color-text-subtle)]">Previous</span>
            <span className="text-label-md text-[var(--color-text-default)] group-hover:text-[var(--color-action-primary)] transition-colors truncate">
              {prev.label}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          to={next.path}
          className="group flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-surface-muted)] transition-colors text-right"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-body-xs text-[var(--color-text-subtle)]">Next</span>
            <span className="text-label-md text-[var(--color-text-default)] group-hover:text-[var(--color-action-primary)] transition-colors truncate">
              {next.label}
            </span>
          </div>
          <IconChevronRight
            size={14}
            stroke={1.5}
            className="shrink-0 text-[var(--color-text-subtle)] group-hover:text-[var(--color-action-primary)] transition-colors"
          />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
