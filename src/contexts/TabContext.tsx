import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface TabItem {
  id: string;
  label: string;
  path: string;
  closable?: boolean;
}

interface TabContextValue {
  tabs: TabItem[];
  activeTabId: string;
  addTab: (tab: TabItem) => void;
  addNewTab: () => void;
  closeTab: (tabId: string) => void;
  selectTab: (tabId: string) => void;
  openInNewTab: (id: string, label: string, path: string) => void;
  updateActiveTab: (label: string, path: string) => void;
}

/* ----------------------------------------
   Context
   ---------------------------------------- */

const TabContext = createContext<TabContextValue | null>(null);

/* ----------------------------------------
   Provider
   ---------------------------------------- */

interface TabProviderProps {
  children: React.ReactNode;
  defaultTabs?: TabItem[];
}

export function TabProvider({ children, defaultTabs = [] }: TabProviderProps) {
  const navigate = useNavigate();
  
  const [tabs, setTabs] = useState<TabItem[]>(defaultTabs);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabs[0]?.id || '');
  
  // Use ref to access latest tabs without re-creating callbacks
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  // Add a new tab
  const addTab = useCallback((tab: TabItem) => {
    setTabs((prev) => {
      const exists = prev.find((t) => t.id === tab.id);
      if (exists) {
        return prev;
      }
      return [...prev, tab];
    });
    setActiveTabId(tab.id);
  }, []);

  // Close a tab
  const closeTab = useCallback((tabId: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.id !== tabId);
      return newTabs;
    });
    
    // Check if we need to switch tabs
    setActiveTabId((currentActiveId) => {
      if (currentActiveId === tabId) {
        const currentTabs = tabsRef.current;
        const newTabs = currentTabs.filter((t) => t.id !== tabId);
        if (newTabs.length > 0) {
          const closedIndex = currentTabs.findIndex((t) => t.id === tabId);
          const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
          const newActiveTab = newTabs[newActiveIndex];
          // Navigate to the new active tab
          setTimeout(() => navigate(newActiveTab.path), 0);
          return newActiveTab.id;
        }
      }
      return currentActiveId;
    });
  }, [navigate]);

  // Select a tab - simplified, no location sync needed
  const selectTab = useCallback((tabId: string) => {
    const tab = tabsRef.current.find((t) => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      navigate(tab.path);
    }
  }, [navigate]);

  // Open in new tab (convenience method)
  const openInNewTab = useCallback((id: string, label: string, path: string) => {
    const newTab: TabItem = {
      id,
      label,
      path,
      closable: true,
    };
    addTab(newTab);
    navigate(path);
  }, [addTab, navigate]);

  // Add a new empty tab (for + button) - opens Home page
  const addNewTab = useCallback(() => {
    const newTabId = `home-${Date.now()}`;
    const newTab: TabItem = {
      id: newTabId,
      label: 'Home',
      path: '/',
      closable: true,
    };
    addTab(newTab);
    navigate('/');
  }, [addTab, navigate]);

  // Update the active tab's label and path (for syncing with navigation)
  const updateActiveTab = useCallback((label: string, path: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, label, path } : tab
      )
    );
  }, [activeTabId]);

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        addNewTab,
        closeTab,
        selectTab,
        openInNewTab,
        updateActiveTab,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

/* ----------------------------------------
   Hook
   ---------------------------------------- */

export function useTabs() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
}

export default TabContext;
