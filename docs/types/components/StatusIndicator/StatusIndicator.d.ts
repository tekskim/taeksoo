import { HTMLAttributes, ReactNode } from 'react';
export type StatusType = 'active' | 'error' | 'building' | 'deleting' | 'suspended' | 'shelved' | 'shelved-offloaded' | 'mounted' | 'shutoff' | 'paused' | 'pending' | 'draft' | 'verify-resized' | 'deactivated' | 'in-use' | 'maintenance' | 'degraded' | 'no-monitor' | 'down';
export type StatusLayout = 'icon-only' | 'default' | 'badge';
export type StatusSize = 'sm' | 'md' | 'lg';
export interface StatusConfig {
    label: string;
    icon: ReactNode;
    bgColor: string;
}
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
export declare const StatusIndicator: import('react').NamedExoticComponent<StatusIndicatorProps>;
