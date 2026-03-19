import React from 'react';
import type { NotificationHistoryItem } from '../../services/stores/notificationHistoryStore';
import { formatRelativeTime } from '../../services/utils';
import { cn } from '../../services/utils/cn';
import {
  notificationItemTimestampStyles,
  notificationItemWrapperStyles,
} from './NotificationPanel.styles';

interface NotificationItemProps {
  /** The notification data to display */
  notification: NotificationHistoryItem;
  /** Callback when notification is removed */
  onRemove: (id: string) => void;
}

/**
 * NotificationItem component
 *
 * Displays a single notification in the notification panel using Toast as the base component.
 * Supports read/unread states, dismiss action, and optional links.
 *
 * @example
 * <NotificationItem
 *   notification={{
 *     id: '1',
 *     type: 'positive',
 *     title: 'Instance created',
 *     description: 'web-server-01 created successfully.',
 *     timestamp: new Date(),
 *     read: false,
 *     linkUrl: '/instances/123',
 *     linkText: 'View instance',
 *   }}
 *   onRemove={(id) => console.log('Remove:', id)}
 * />
 */
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove: _onRemove,
}) => {
  // const handleDismiss = (): void => {
  //   onRemove(notification.id);
  // };

  return (
    <div className={cn(notificationItemWrapperStyles)}>
      {/* <Toast
        type={notification.type}
        title={notification.title}
        description={notification.description}
        linkText={notification.linkText}
        linkUrl={notification.linkUrl}
        handleDismiss={handleDismiss}
      /> */}

      {/* Timestamp footer */}
      <div className={notificationItemTimestampStyles}>
        {formatRelativeTime(notification.timestamp)}
      </div>
    </div>
  );
};

export default NotificationItem;
