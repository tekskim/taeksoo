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
  IconPlug,
  IconPencil,
  IconResize,
  IconCircleX,
  IconLink,
  IconSettings,
  IconGauge,
  IconEyeOff,
  IconCircleMinus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Status Types & Configuration
   ---------------------------------------- */

export type StatusType =
  | 'active'
  | 'error'
  | 'building'
  | 'suspended'
  | 'shelved'
  | 'shelved-offloaded'
  | 'mounted'
  | 'shutoff'
  | 'paused'
  | 'pending'
  | 'draft'
  | 'verify-resized'
  | 'deactivated'
  | 'in-use'
  | 'maintenance'
  | 'degraded'
  | 'no-monitor'
  | 'down';

export type StatusLayout = 'default' | 'icon-only';

export interface StatusConfig {
  label: string;
  icon: ReactNode;
  bgColor: string;
}

const ICON_SIZE = 14;

const statusConfig: Record<StatusType, StatusConfig> = {
  // Success (Green) - using semantic color
  active: {
    label: 'Active',
    icon: <IconCircleCheck size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-success-bg)]',
  },
  // Danger (Red) - using semantic color
  error: {
    label: 'Error',
    icon: <IconAlertTriangle size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-danger-bg)]',
  },
  // Info (Blue) - using semantic color
  building: {
    label: 'Building...',
    icon: <IconLoader2 size={ICON_SIZE} strokeWidth={2} className="animate-spin" />,
    bgColor: 'bg-[var(--status-info-bg)]',
  },
  // Warning (Orange) - using semantic color
  'verify-resized': {
    label: 'Verify Resized',
    icon: <IconResize size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  degraded: {
    label: 'Degraded',
    icon: <IconGauge size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  'no-monitor': {
    label: 'No Monitor',
    icon: <IconEyeOff size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  // Muted (Gray) - using semantic color
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
  'shelved-offloaded': {
    label: 'Shelved Offloaded',
    icon: <IconArchiveOff size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  mounted: {
    label: 'Mounted',
    icon: <IconPlug size={ICON_SIZE} strokeWidth={2} />,
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
  pending: {
    label: 'Pending',
    icon: <IconPencil size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  draft: {
    label: 'Draft',
    icon: <IconPencil size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  deactivated: {
    label: 'Deactivated',
    icon: <IconCircleX size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  'in-use': {
    label: 'In-use',
    icon: <IconLink size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  maintenance: {
    label: 'Maintenance',
    icon: <IconSettings size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  down: {
    label: 'Down',
    icon: <IconCircleMinus size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
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





