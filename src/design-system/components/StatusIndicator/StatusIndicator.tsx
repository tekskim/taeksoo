import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconBan,
  IconArchiveOff,
  IconPower,
  IconPlayerPause,
  IconLoader2,
} from '@tabler/icons-react';

/* ----------------------------------------
   Status Types & Configuration
   ---------------------------------------- */

export type StatusType =
  | 'active'
  | 'error'
  | 'suspended'
  | 'shelved'
  | 'shutoff'
  | 'paused'
  | 'building';

export type StatusLayout = 'default' | 'icon-only';

export interface StatusConfig {
  label: string;
  icon: ReactNode;
  bgColor: string;
}

const ICON_SIZE = 14;

const statusConfig: Record<StatusType, StatusConfig> = {
  active: {
    label: 'Active',
    icon: <IconCircleCheck size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-active-bg)]',
  },
  error: {
    label: 'Error',
    icon: <IconAlertTriangle size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-error-bg)]',
  },
  suspended: {
    label: 'Suspended',
    icon: <IconBan size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  shelved: {
    label: 'Shelved Offloaded',
    icon: <IconArchiveOff size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  shutoff: {
    label: 'Shutoff',
    icon: <IconPower size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  paused: {
    label: 'Paused',
    icon: <IconPlayerPause size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  building: {
    label: 'Building...',
    icon: <IconLoader2 size={ICON_SIZE} strokeWidth={2} className="animate-spin" />,
    bgColor: 'bg-[var(--status-building-bg)]',
  },
};

/* ----------------------------------------
   StatusIndicator Props
   ---------------------------------------- */

export interface StatusIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Status type */
  status: StatusType;
  /** Layout variant */
  layout?: StatusLayout;
  /** Custom label (overrides default) */
  label?: string;
}

/* ----------------------------------------
   StatusIndicator Component
   ---------------------------------------- */

export function StatusIndicator({
  status,
  layout = 'default',
  label,
  className = '',
  ...props
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.label;

  const baseStyles = [
    'inline-flex items-center',
    'gap-[var(--status-gap)]',
    'font-medium',
    'rounded-[var(--status-radius)]',
    'text-[var(--status-text)]',
    'text-[length:var(--status-font-size)]',
    'leading-[var(--status-line-height)]',
    'mr-2', // Ensure spacing from adjacent elements
  ].join(' ');

  const paddingStyles = layout === 'icon-only'
    ? 'p-[var(--status-padding-icon-only)]'
    : 'px-[var(--status-padding-x)] py-[var(--status-padding-y)]';

  const classes = twMerge(
    baseStyles,
    paddingStyles,
    config.bgColor,
    className
  );

  return (
    <span className={classes} role="status" aria-label={displayLabel} {...props}>
      <span className="shrink-0">{config.icon}</span>
      {layout !== 'icon-only' && <span>{displayLabel}</span>}
    </span>
  );
}




