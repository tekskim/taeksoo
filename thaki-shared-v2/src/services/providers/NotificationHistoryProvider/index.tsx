import React, { createContext, ReactNode, useMemo } from 'react';
import { createNotificationHistoryStore, NotificationHistoryStoreApi } from '../../stores';

/**
 * Context for NotificationHistoryStore
 * Similar to overlay store pattern, this allows each app to have its own notification history
 */
export const NotificationHistoryContext = createContext<NotificationHistoryStoreApi | null>(null);

interface NotificationHistoryProviderProps {
  children: ReactNode;
}

/**
 * Provider component that creates and provides a notification history store instance.
 * Each app (IAM, Compute, etc.) should wrap its content with this provider to maintain
 * separate notification history contexts.
 */
const NotificationHistoryProvider: React.FC<NotificationHistoryProviderProps> = ({ children }) => {
  const value = useMemo(createNotificationHistoryStore, []);

  return (
    <NotificationHistoryContext.Provider value={value}>
      {children}
    </NotificationHistoryContext.Provider>
  );
};

export { NotificationHistoryProvider };
