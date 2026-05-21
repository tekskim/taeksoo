import React, { useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { IconCheckbox, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { Tabs, TabList, Tab } from '../Tabs';
import { Badge } from '../Badge';
import type { BadgeTheme } from '../Badge/Badge';

/* ----------------------------------------
   Types
   ---------------------------------------- */

/** Alert App: critical | warning, Other App: success | failed */
export type NotificationType = 'critical' | 'warning' | 'success' | 'failed';

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
  /** For critical alerts: whether it has been resolved (moves from Critical Alert Section to regular list) */
  isResolved?: boolean;
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
  /** Callback when a critical alert is resolved */
  onResolveCritical?: (id: string) => void;
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
  onResolveCritical,
  selectedId,
  onClose,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const isAlertType = (n: NotificationItem) =>
    (n.type === 'critical' || n.type === 'warning') && !n.isResolved;

  const alertNotifications = notifications.filter(isAlertType);
  const regularNotifications = notifications.filter((n) => !isAlertType(n));

  const filteredRegular = regularNotifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return true;
  });

  const unreadCount = regularNotifications.filter((n) => !n.isRead).length;

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
        flex flex-col
        ${className}
      `}
    >
      {/* Header with Tabs */}
      <div className="relative pt-3 pb-0 shrink-0">
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
          </TabList>
        </Tabs>
      </div>

      {filteredRegular.length === 0 && alertNotifications.length === 0 ? (
        <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)] text-body-md">
          No notifications
        </div>
      ) : (
        <OverlayScrollbarsComponent
          options={{
            overflow: { x: 'hidden', y: 'scroll' },
            scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
          }}
          defer={false}
          className="flex-1"
        >
          <div className="flex flex-col gap-0 p-2">
            {/* Alert Section */}
            {alertNotifications.length > 0 && (
              <div className="pb-2">
                <div className="flex items-center gap-1 px-1 pb-1.5">
                  <span className="text-label-sm text-[var(--color-text-muted)]">Alert</span>
                  <span className="text-label-sm text-[var(--color-text-subtle)]">
                    {alertNotifications.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {alertNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      isSelected={notification.id === selectedId}
                      onMarkAsRead={onMarkAsRead}
                      onClick={onNotificationClick}
                      isAlertSection
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Notification Section */}
            {filteredRegular.length > 0 && (
              <>
                <div className="flex items-center gap-1 px-1 pb-1.5 pt-1">
                  <span className="text-label-sm text-[var(--color-text-muted)]">Notification</span>
                  <span className="text-label-sm text-[var(--color-text-subtle)]">
                    {filteredRegular.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {filteredRegular.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      isSelected={notification.id === selectedId}
                      onMarkAsRead={onMarkAsRead}
                      onClick={onNotificationClick}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </OverlayScrollbarsComponent>
      )}
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
  isAlertSection?: boolean;
}

const typeBadgeMap: Record<NotificationType, { label: string; theme: BadgeTheme }> = {
  critical: { label: 'Critical', theme: 'red' },
  warning: { label: 'Warning', theme: 'yellow' },
  success: { label: 'Success', theme: 'green' },
  failed: { label: 'Failed', theme: 'red' },
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isSelected,
  onMarkAsRead,
  onClick,
  isAlertSection,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetail =
    notification.detail && (notification.detail.code || notification.detail.message);

  const showViewDetail = hasDetail && notification.type === 'failed';

  return (
    <div
      data-figma-name="[TDS] NotificationItem"
      className={`
        relative
        rounded-lg
        transition-all
        ${
          isAlertSection
            ? notification.type === 'critical'
              ? 'bg-[var(--inline-message-error-bg)]'
              : 'bg-[var(--color-state-warning-bg)]'
            : `border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] ${!notification.isRead ? 'bg-[var(--color-surface-subtle)]' : 'bg-[var(--color-surface-default)]'}`
        }
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
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-label-md text-[var(--color-text-default)] mb-1 pr-6">
            {notification.message}
          </p>

          <div className="flex items-center gap-1.5 mb-1 min-w-0">
            <Badge theme={typeBadgeMap[notification.type].theme} size="sm" className="shrink-0">
              {typeBadgeMap[notification.type].label}
            </Badge>
            {notification.project && (
              <Badge
                theme="white"
                size="sm"
                className="overflow-hidden min-w-0"
                title={notification.project}
              >
                <span className="block truncate">{notification.project}</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Right side - Unread indicator & Time */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div className="size-6 flex items-center justify-center">
            {!notification.isRead && !isAlertSection && (
              <div className="size-2 rounded-full bg-[var(--color-action-primary)]" />
            )}
          </div>
          <span className="text-body-sm text-[var(--color-text-muted)]">{notification.time}</span>
        </div>
      </div>

      {/* View Detail Toggle */}
      {showViewDetail && (
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
      )}

      {/* Detail Content */}
      {showViewDetail && isExpanded && (
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
    </div>
  );
};

export default NotificationCenter;
