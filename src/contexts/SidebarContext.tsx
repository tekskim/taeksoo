import React, { createContext, useContext, useState, useCallback } from 'react';

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
  const [isOpen, setIsOpen] = useState(defaultOpen);

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

