import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface SidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const SIDEBAR_STORAGE_KEY = 'sidebar-open';

/* ----------------------------------------
   Context
   ---------------------------------------- */

const SidebarContext = createContext<SidebarContextValue | null>(null);

/* ----------------------------------------
   Provider
   ---------------------------------------- */

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  // Initialize from localStorage or use defaultOpen
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    return defaultOpen;
  });

  // Persist to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

/* ----------------------------------------
   Hook
   ---------------------------------------- */

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export default SidebarContext;

