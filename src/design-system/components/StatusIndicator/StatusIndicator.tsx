import { cloneElement, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  IconAlertTriangle,
  IconPlugConnectedX,
  IconPower,
  IconPlayerPause,
  IconLoader,
  IconPlugConnected,
  IconEdit,
  IconRotateClockwise2,
  IconCircleDashedCheck,
  IconLivePhotoOff,
  IconTool,
  IconCircleX,
  IconAlertHexagon,
  IconShieldExclamation,
  IconCircleMinus,
  IconLivePhoto,
} from '@tabler/icons-react';

/* ----------------------------------------
   Status Types & Configuration
   ---------------------------------------- */

export type StatusType =
  | 'active'
  | 'error'
  | 'building'
  | 'deleting'
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

// Custom In-Use Icon (transfer/sync arrows)
const IconInUse = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2.6665 8V6C2.6665 5.46957 2.87722 4.96086 3.25229 4.58579C3.62736 4.21071 4.13607 4 4.6665 4H13.3332M13.3332 4L11.3332 2M13.3332 4L11.3332 6M13.3332 8V10C13.3332 10.5304 13.1225 11.0391 12.7474 11.4142C12.3723 11.7893 11.8636 12 11.3332 12H2.6665M2.6665 12L4.6665 14M2.6665 12L4.6665 10" 
      stroke="currentColor" 
      strokeWidth={1.25}
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Deleting Icon
const IconDeleting = ({ size = 16, strokeWidth = 1 }: { size?: number; strokeWidth?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M1.99854 4.24959H13.9998M2.74862 4.24959L3.4987 13.2506C3.4987 13.6484 3.65675 14.03 3.93809 14.3113C4.21942 14.5927 4.60099 14.7507 4.99886 14.7507H6.49902M13.2498 4.24959L12.9685 7.62496M5.74894 4.24959V1.99935C5.74894 1.80042 5.82797 1.60963 5.96864 1.46896C6.1093 1.32829 6.30009 1.24927 6.49902 1.24927H9.49935C9.69828 1.24927 9.88907 1.32829 10.0297 1.46896C10.1704 1.60963 10.2494 1.80042 10.2494 1.99935V4.24959M11.9998 10V9M13.4165 10.5833L14.1332 9.86667M13.9998 12H14.9998M13.4165 13.4167L14.1332 14.1333M11.9998 14V15M10.5832 13.4167L9.8665 14.1333M9.99984 12H8.99984M10.5832 10.5833L9.8665 9.86667M6.66634 7.33331V11.3333M9.33301 7.33331V8" 
      stroke="currentColor" 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export type StatusLayout = 'icon-only' | 'default' | 'badge';
export type StatusSize = 'sm' | 'md' | 'lg';

export interface StatusConfig {
  label: string;
  icon: ReactNode;
  bgColor: string;
}

const ICON_SIZE = 16;

const statusConfig: Record<StatusType, StatusConfig> = {
  // Success (Green) - using semantic color
  active: {
    label: 'Active',
    icon: <IconLivePhoto size={ICON_SIZE} strokeWidth={2} />,
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
    icon: <IconLoader size={ICON_SIZE} strokeWidth={2} className="animate-spin-slow" />,
    bgColor: 'bg-[var(--status-info-bg)]',
  },
  deleting: {
    label: 'Deleting...',
    icon: <IconDeleting size={ICON_SIZE} strokeWidth={1} />,
    bgColor: 'bg-[var(--status-info-bg)]',
  },
  // Warning (Orange) - using semantic color
  'verify-resized': {
    label: 'Verify Resized',
    icon: <IconCircleDashedCheck size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  degraded: {
    label: 'Degraded',
    icon: <IconAlertHexagon size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  'no-monitor': {
    label: 'No Monitor',
    icon: <IconShieldExclamation size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-warning-bg)]',
  },
  // Muted (Gray) - using semantic color
  suspended: {
    label: 'Suspended',
    icon: <IconCircleMinus size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  shelved: {
    label: 'Shelved Offloaded',
    icon: <IconPlugConnectedX size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  'shelved-offloaded': {
    label: 'Shelved Offloaded',
    icon: <IconPlugConnectedX size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  mounted: {
    label: 'Mounted',
    icon: <IconPlugConnected size={ICON_SIZE} strokeWidth={2} />,
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
    icon: <IconRotateClockwise2 size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  draft: {
    label: 'Draft',
    icon: <IconEdit size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  deactivated: {
    label: 'Deactivated',
    icon: <IconLivePhotoOff size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  'in-use': {
    label: 'In-use',
    icon: <IconInUse size={ICON_SIZE} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  maintenance: {
    label: 'Maintenance',
    icon: <IconTool size={ICON_SIZE} strokeWidth={2} />,
    bgColor: 'bg-[var(--status-muted-bg)]',
  },
  down: {
    label: 'Down',
    icon: <IconCircleX size={ICON_SIZE} strokeWidth={2} />,
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
  /** Size variant (only applies to icon-only layout) */
  size?: StatusSize;
  /** Custom label (overrides default) */
  label?: string;
}

/* ----------------------------------------
   StatusIndicator Component
   ---------------------------------------- */

export function StatusIndicator({
  status,
  layout = 'icon-only',
  size = 'md',
  label,
  className = '',
  ...props
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.label;

  // Size-based icon sizes for icon-only layout
  const iconSizes: Record<StatusSize, number> = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  // Size-based container sizes for icon-only layout
  const sizeStyles: Record<StatusSize, string> = {
    sm: 'size-[20px]',
    md: 'size-[24px]',
    lg: 'size-[28px]',
  };

  // For icon-only layout with size variant
  if (layout === 'icon-only') {
    const iconSize = iconSizes[size];
    const containerSize = sizeStyles[size];
    
    // Clone the icon with the appropriate size
    const clonedIcon = isValidElement(config.icon)
      ? cloneElement(config.icon as React.ReactElement<{ size?: number }>, { size: iconSize })
      : config.icon;
    
    const classes = twMerge(
      'inline-flex items-center justify-center',
      'rounded-full',
      'text-[var(--status-text)]',
      containerSize,
      config.bgColor,
      className
    );

    return (
      <span className={classes} role="status" aria-label={displayLabel} {...props}>
        <span className="shrink-0">
          {clonedIcon}
        </span>
      </span>
    );
  }

  // Badge layout - square-ish with icon and text
  if (layout === 'badge') {
    const baseStyles = [
      'inline-flex items-center',
      'gap-1.5',
      'font-medium',
      'rounded-md',
      'px-2 py-0.5',
      'text-[var(--status-text)]',
      'text-[11px]',
      'leading-4',
    ].join(' ');

    const classes = twMerge(
      baseStyles,
      config.bgColor,
      className
    );

    return (
      <span className={classes} role="status" aria-label={displayLabel} {...props}>
        <span className="shrink-0">{config.icon}</span>
        <span>{displayLabel}</span>
      </span>
    );
  }

  // Default layout with label (rounded pill shape)
  const baseStyles = [
    'inline-flex items-center',
    'gap-[var(--status-gap)]',
    'font-medium',
    'rounded-[var(--status-radius)]',
    'text-[var(--status-text)]',
    'text-[length:var(--status-font-size)]',
    'leading-[var(--status-line-height)]',
  ].join(' ');

  const paddingStyles = 'px-[var(--status-padding-x)] py-[var(--status-padding-y)]';

  const classes = twMerge(
    baseStyles,
    paddingStyles,
    config.bgColor,
    className
  );

  return (
    <span className={classes} role="status" aria-label={displayLabel} {...props}>
      <span className="shrink-0">{config.icon}</span>
      <span>{displayLabel}</span>
    </span>
  );
}





