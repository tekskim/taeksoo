import React, { useEffect, useRef, useState } from 'react';
import useClickOutside from '../../services/hooks/useClickOutside';
import { Dropdown } from '../Dropdown';
import {
  notificationPanelBackgroundStyles,
  notificationPanelContainerStyles,
  notificationPanelHeaderStyles,
  notificationPanelInnerStyles,
} from './NotificationPanel.styles';

interface NotificationPanelProps {
  /** Whether the panel is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
}

/**
 * NotificationPanel component
 *
 * Displays notification history next to the notification icon in the ToolBar.
 * Shows all recorded notifications with ability to mark as read or dismiss.
 */
const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  // Close panel when clicking outside
  useClickOutside(panelRef, {
    onClickOutside: (event) => {
      // Check if click is inside a dropdown portal (e.g., filter dropdown options)
      const isDropdownPortal = (event.target as HTMLElement).closest('.dropdown-options');

      const isNotificationButton = (event.target as HTMLElement).closest('.notification-button');

      if (isDropdownPortal || isNotificationButton) {
        return; // Don't close if clicking inside dropdown portal or notification button
      }

      onClose();
    },
    enabled: isOpen,
  });

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          ref={panelRef}
          className={notificationPanelContainerStyles}
          role="dialog"
          aria-label="Notification History"
          aria-modal="false"
        >
          <div className={notificationPanelBackgroundStyles} />

          <div className={notificationPanelInnerStyles}>
            {/* Header */}
            <div className={notificationPanelHeaderStyles}>
              <Dropdown.Select
                value={filter}
                onChange={(value) => setFilter(value as 'all' | 'positive' | 'negative')}
                size="sm"
              >
                <Dropdown.Option value="all" label="All" />
                <Dropdown.Option value="positive" label="Success" />
                <Dropdown.Option value="negative" label="Error" />
              </Dropdown.Select>
            </div>

            {/* Content */}
            {/* <div className={notificationPanelContentStyles}>
              {notifications.length === 0 ? (
                <div className={notificationPanelEmptyStyles}>
                  <Typography.Text color="secondary">
                    No notifications yet
                  </Typography.Text>
                </div>
              ) : (
                notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={removeNotification}
                  />
                ))
              )}
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPanel;
