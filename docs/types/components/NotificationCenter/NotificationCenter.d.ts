import { default as React } from 'react';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export interface NotificationDetail {
    /** Error/Response code */
    code?: string | number;
    /** Detailed message */
    message?: string;
}
export interface NotificationItem {
    /** Unique identifier */
    id: string;
    /** Notification type */
    type: NotificationType;
    /** Main message */
    message: string;
    /** Timestamp */
    time: string;
    /** Project name */
    project?: string;
    /** Whether the notification has been read */
    isRead?: boolean;
    /** Detail information (expandable) */
    detail?: NotificationDetail;
}
export interface NotificationCenterProps {
    /** List of notifications */
    notifications: NotificationItem[];
    /** Callback when notification is marked as read */
    onMarkAsRead?: (id: string) => void;
    /** Callback when all notifications are marked as read */
    onMarkAllAsRead?: () => void;
    /** Callback when notification is clicked */
    onNotificationClick?: (notification: NotificationItem) => void;
    /** Currently selected notification id */
    selectedId?: string;
    /** Callback when panel is closed */
    onClose?: () => void;
    /** Custom class name */
    className?: string;
}
export declare const NotificationCenter: React.FC<NotificationCenterProps>;
export default NotificationCenter;
