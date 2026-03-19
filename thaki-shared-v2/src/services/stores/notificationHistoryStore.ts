import { create, StoreApi } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * @description
 * NotificationHistoryItem represents a single notification record in the history.
 */
interface NotificationHistoryItem {
  /** Unique identifier for this notification */
  id: string;
  /** Notification title */
  title?: string;
  /** Notification description */
  description?: string;
  /** Notification type */
  type?: 'positive' | 'negative';
  /** Optional link text */
  linkText?: string;
  /** Optional link URL */
  linkUrl?: string;
  /** Timestamp when notification was created */
  timestamp: Date;
}

/**
 * @description
 * NotificationHistoryStore manages the notification history state.
 */
interface NotificationHistoryStore {
  /** Array of all notification history items */
  notifications: NotificationHistoryItem[];
  /** Add a new notification to history */
  addNotification: (
    notification: Omit<NotificationHistoryItem, 'id' | 'timestamp'>
  ) => void;
  /** Remove a notification by ID */
  removeNotification: (id: string) => void;
  /** Clear all notifications */
  clearAll: () => void;
  /** Get count of notifications */
  getUnreadCount: () => number;
}

type NotificationHistoryStoreApi = StoreApi<NotificationHistoryStore>;

/**
 * Creates a notification history store for each package app to maintain separate notification contexts.
 *
 * @returns Notification history store
 */
const createNotificationHistoryStore = (): NotificationHistoryStoreApi => {
  const notificationHistoryStore: NotificationHistoryStoreApi =
    create<NotificationHistoryStore>()(
      subscribeWithSelector((set, get) => ({
        notifications: [],

        addNotification: notification => {
          const newNotification: NotificationHistoryItem = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: new Date(),
          };

          set(state => ({
            notifications: [newNotification, ...state.notifications],
          }));
        },

        removeNotification: (id: string) => {
          set(state => ({
            notifications: state.notifications.filter(
              notification => notification.id !== id
            ),
          }));
        },

        clearAll: () => {
          set({ notifications: [] });
        },

        getUnreadCount: () => {
          return get().notifications.length;
        },
      }))
    );

  return notificationHistoryStore;
};

export default createNotificationHistoryStore;
export type {
  NotificationHistoryItem,
  NotificationHistoryStore,
  NotificationHistoryStoreApi,
};
