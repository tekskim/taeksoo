import { createContext, useContext } from 'react';

const DesktopWindowContext = createContext(false);

export const DesktopWindowProvider = DesktopWindowContext.Provider;

export function useIsDesktopWindow() {
  return useContext(DesktopWindowContext);
}
