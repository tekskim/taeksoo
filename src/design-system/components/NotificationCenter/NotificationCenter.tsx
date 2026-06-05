import React, { useState } from 'react';
import {
  IconCircleCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconCheckbox,
  IconChevronUp,
  IconChevronDown,
} from '@tabler/icons-react';
import { Tabs, TabList, Tab } from '../Tabs';
import { Chip } from '../Chip';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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

/* ----------------------------------------
   NotificationCenter Component
   ---------------------------------------- */

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  selectedId,
  onClose,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('all');

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'error') return notification.type === 'error';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const errorCount = notifications.filter((n) => n.type === 'error').length;

  return (
    <div
      data-figma-name="[TDS] NotificationCenter"
      className={`
        w-[360px]
        bg-[var(--color-surface-default)]
        rounded-lg
        border border-[var(--color-border-default)]
        shadow-lg
        overflow-hidden
        ${className}
      `}
    >
      {/* Header with Tabs */}
      <div className="relative pt-3 pb-0">
        {/* Mark all as read button - positioned top right, vertically centered */}
        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="
            absolute right-4 top-1/2 -translate-y-1/2 z-20
            flex items-center justify-center
            size-7
            rounded-md
            text-[var(--color-text-muted)]
            hover:bg-[var(--color-surface-subtle)]
            hover:text-[var(--color-text-default)]
            transition-colors
            group
          "
          aria-label="Mark all as read"
        >
          <IconCheckbox size={16} stroke={1.5} />
          {/* Tooltip */}
          <span
            className="
            absolute top-full right-0 mt-1
            px-2 py-1
            bg-[var(--color-text-default)]
            text-[var(--color-surface-default)]
            text-body-sm
            rounded
            whitespace-nowrap
            opacity-0
            group-hover:opacity-100
            transition-opacity
            pointer-events-none
            z-10
          "
          >
            Mark all as read
          </span>
        </button>

        {/* Tabs - full width */}
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="underline"
          size="sm"
          className="w-full"
        >
          <TabList className="w-full px-4">
            <Tab value="all">All</Tab>
            <Tab value="unread">
              Unread
              {unreadCount > 0 && (
                <span className="ml-1 text-[var(--color-text-muted)]">({unreadCount})</span>
              )}
            </Tab>
            <Tab value="error">
              Error
              {errorCount > 0 && (
                <span className="ml-1 text-[var(--color-text-muted)]">({errorCount})</span>
              )}
            </Tab>
          </TabList>
        </Tabs>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto p-2 drawer-scroll">
        {filteredNotifications.length === 0 ? (
          <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)] text-body-md">
            No notifications
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isSelected={notification.id === selectedId}
                onMarkAsRead={onMarkAsRead}
                onClick={onNotificationClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------
   NotificationCard Component
   ---------------------------------------- */

interface NotificationCardProps {
  notification: NotificationItem;
  isSelected?: boolean;
  onMarkAsRead?: (id: string) => void;
  onClick?: (notification: NotificationItem) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isSelected,
  onMarkAsRead,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return (
          <IconCircleCheck size={16} stroke={1.5} className="text-[var(--color-state-success)]" />
        );
      case 'error':
        return (
          <IconAlertTriangle size={16} stroke={1.5} className="text-[var(--color-state-danger)]" />
        );
      case 'warning':
        return (
          <IconAlertCircle size={16} stroke={1.5} className="text-[var(--color-state-warning)]" />
        );
      case 'info':
      default:
        return <IconInfoCircle size={16} stroke={1.5} className="text-[var(--color-state-info)]" />;
    }
  };

  const hasDetail =
    notification.detail && (notification.detail.code || notification.detail.message);

  return (
    <div
      data-figma-name="[TDS] NotificationItem"
      className={`
        relative
        rounded-lg
        border
        transition-all
        border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]
        ${!notification.isRead ? 'bg-[var(--color-surface-subtle)]' : 'bg-[var(--color-surface-default)]'}
      `}
    >
      {/* Main Content */}
      <div
        onClick={() => {
          if (!notification.isRead) {
            onMarkAsRead?.(notification.id);
          }
          onClick?.(notification);
        }}
        className="flex gap-3 p-3 cursor-pointer"
      >
        {/* Icon */}
        <div className="shrink-0 pt-0.5">{getIcon(notification.type)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Message */}
          <p className="text-body-md text-[var(--color-text-default)] mb-2 pr-6">
            {notification.message}
          </p>

          {/* Project Tag */}
          {notification.project && <Chip value={notification.project} variant="default" />}
        </div>

        {/* Right side - Unread indicator & Time */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          {/* Unread dot indicator */}
          <div className="size-6 flex items-center justify-center">
            {!notification.isRead && (
              <div className="size-2 rounded-full bg-[var(--color-action-primary)]" />
            )}
          </div>

          {/* Time */}
          <span className="text-body-md text-[var(--color-text-muted)]">{notification.time}</span>
        </div>
      </div>

      {/* View Detail Toggle */}
      {hasDetail && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="
              flex items-center justify-end gap-1
              w-full px-3 py-2
              text-body-sm
              text-[var(--color-text-muted)]
              hover:text-[var(--color-text-default)]
              border-t border-[var(--color-border-subtle)]
              transition-colors
            "
          >
            <span>View detail</span>
            {isExpanded ? (
              <IconChevronUp size={14} stroke={1.5} />
            ) : (
              <IconChevronDown size={14} stroke={1.5} />
            )}
          </button>

          {/* Detail Content */}
          {isExpanded && (
            <div className="px-3 pb-3">
              <div className="p-3 bg-[var(--color-surface-subtle)] rounded-md">
                {notification.detail?.code && (
                  <p className="text-label-md text-[var(--color-text-default)] mb-1">
                    code: {notification.detail.code}
                  </p>
                )}
                {notification.detail?.message && (
                  <p className="text-body-md text-[var(--color-text-muted)]">
                    {notification.detail.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
