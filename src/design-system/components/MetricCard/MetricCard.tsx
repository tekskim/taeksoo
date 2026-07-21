import { type ReactNode } from 'react';
import { IconHelpCircle } from '@tabler/icons-react';
import { twMerge } from '../../utils/cn';
import { Tooltip } from '../Tooltip';

export type MetricAccent = 'success' | 'error';

export interface MetricCardProps {
  title: string;
  value: ReactNode;
  tooltip?: string;
  /** Colored status dot before title */
  accent?: MetricAccent;
  className?: string;
}

export interface MetricCardGroupProps {
  children: ReactNode;
  className?: string;
}

function MetricCardGroup({ children, className = '' }: MetricCardGroupProps) {
  return (
    <div className={twMerge('flex gap-2 w-full', className)} role="group">
      {children}
    </div>
  );
}

function MetricCardBase({ title, value, tooltip, accent, className = '' }: MetricCardProps) {
  return (
    <div
      data-figma-name="[TDS] MetricCard"
      className={twMerge(
        'flex-1 min-w-0 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3',
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          {accent === 'success' && (
            <span
              className="size-2 shrink-0 rounded-full bg-[var(--color-state-success)]"
              aria-hidden
            />
          )}
          {accent === 'error' && (
            <span
              className="size-2 shrink-0 rounded-full bg-[var(--color-state-danger)]"
              aria-hidden
            />
          )}
          <span className="text-label-sm text-[var(--color-text-subtle)]">{title}</span>
          {tooltip && (
            <Tooltip content={tooltip}>
              <IconHelpCircle size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
            </Tooltip>
          )}
        </div>
        <div className="text-body-md text-[var(--color-text-default)]">{value}</div>
      </div>
    </div>
  );
}

export const MetricCard = Object.assign(MetricCardBase, { Group: MetricCardGroup });
