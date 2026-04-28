import { createContext, useContext } from 'react';

export interface DesktopWindowControls {
  onMinimize: () => void;
  onSnapLeft: () => void;
  onSnapRight: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  isMaximized: boolean;
}

interface DesktopWindowContextValue {
  isDesktopWindow: boolean;
  controls?: DesktopWindowControls;
}

const DesktopWindowContext = createContext<DesktopWindowContextValue>({
  isDesktopWindow: false,
});

export const DesktopWindowProvider = DesktopWindowContext.Provider;

export function useIsDesktopWindow() {
  return useContext(DesktopWindowContext).isDesktopWindow;
}

export function useDesktopWindowControls() {
  return useContext(DesktopWindowContext).controls;
}
