import React from 'react';
import { CurrentTabIdContext } from './CurrentTabIdContext';

export { CurrentTabIdContext } from './CurrentTabIdContext';

interface CurrentTabIdProviderProps {
  tabId: string;
  children: React.ReactNode;
}

export const CurrentTabIdProvider: React.FC<CurrentTabIdProviderProps> = ({
  tabId,
  children,
}) => {
  return (
    <CurrentTabIdContext.Provider value={tabId}>
      {children}
    </CurrentTabIdContext.Provider>
  );
};
