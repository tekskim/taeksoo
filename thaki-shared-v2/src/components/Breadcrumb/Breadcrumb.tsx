import React, { memo } from 'react';
import { cn } from '../../services';
import { ChevronRightIcon } from '../Icon/svg/wrapped';
import { Skeleton } from '../Skeleton';
import {
  breadcrumbLinkStyles,
  breadcrumbListStyles,
  breadcrumbStyles,
  breadcrumbTextStyles,
  separatorStyles,
  breadcrumbSkeletonStyles,
} from './Breadcrumb.styles';

interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
  /** 로딩 중일 때 스켈레톤 표시 */
  isLoading?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = memo(({ items, className }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={cn(breadcrumbStyles, className)} aria-label="Breadcrumb">
      <div className={breadcrumbListStyles}>
        {items.map((item, index) => (
          <React.Fragment key={`${item.path || item.label}-${index}`}>
            {index > 0 && (
              <div className={separatorStyles}>
                <ChevronRightIcon size={8} color="currentColor" />
              </div>
            )}

            {item.isLoading ? (
              <span className={breadcrumbSkeletonStyles}>
                <Skeleton className="w-20 h-4" borderRadius="2px" />
              </span>
            ) : item.onClick || item.path ? (
              <button
                type="button"
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  }
                }}
                className={breadcrumbLinkStyles}
                title={`Go to ${item.label}`}
              >
                <span className={breadcrumbTextStyles()}>{item.label}</span>
              </button>
            ) : (
              <span className={breadcrumbTextStyles({ current: true })} aria-current="page">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
export type { BreadcrumbItem, BreadcrumbProps };
