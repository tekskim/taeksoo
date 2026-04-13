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
    <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4">
      {prev ? (
        <Link
          to={prev.path}
          className="group flex items-center gap-1.5 text-body-md text-[var(--color-text-default)] hover:text-[var(--color-action-primary)] transition-colors"
        >
          <IconChevronLeft
            size={14}
            stroke={1.5}
            className="shrink-0 text-[var(--color-text-subtle)] group-hover:text-[var(--color-action-primary)] transition-colors"
          />
          {prev.label}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={next.path}
          className="group flex items-center gap-1.5 text-body-md text-[var(--color-text-default)] hover:text-[var(--color-action-primary)] transition-colors ml-auto"
        >
          {next.label}
          <IconChevronRight
            size={14}
            stroke={1.5}
            className="shrink-0 text-[var(--color-text-subtle)] group-hover:text-[var(--color-action-primary)] transition-colors"
          />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
