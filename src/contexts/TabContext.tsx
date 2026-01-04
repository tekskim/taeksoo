import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

// Helper function to get label from path
function getLabelFromPath(path: string): string {
  const pathLabelMap: Record<string, string> = {
    '/': 'Home',
    '/home': 'Home',
    '/instances': 'Instances',
    '/instance-templates': 'Instance Templates',
    '/instance-snapshots': 'Instance Snapshots',
    '/images': 'Images',
    '/flavors': 'Flavors',
    '/key-pairs': 'Key Pairs',
    '/server-groups': 'Server Groups',
    '/volumes': 'Volumes',
    '/volume-snapshots': 'Volume Snapshots',
    '/volume-backups': 'Volume Backups',
    '/networks': 'Networks',
    '/routers': 'Routers',
    '/ports': 'Ports',
    '/floating-ips': 'Floating IPs',
    '/security-groups': 'Security Groups',
    '/load-balancers': 'Load Balancers',
    '/certificates': 'Certificates',
    '/topology': 'Topology',
    '/design-system': 'Design System',
    '/drawers': 'Drawers',
    '/modals': 'Modals',
  };
  
  // Check for exact match first
  if (pathLabelMap[path]) {
    return pathLabelMap[path];
  }
  
  // Check for detail pages (e.g., /volumes/vol-001)
  for (const [basePath, label] of Object.entries(pathLabelMap)) {
    if (basePath !== '/' && path.startsWith(basePath + '/')) {
      // Extract the ID from the path for detail pages
      const id = path.split('/').pop();
      return `${label} - ${id}`;
    }
  }
  
  // Default: capitalize the path
  return path.split('/').filter(Boolean).map(s => 
    s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')
  ).join(' > ') || 'Home';
}

export function TabProvider({ children, defaultTabs = [] }: TabProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [tabs, setTabs] = useState<TabItem[]>(defaultTabs);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabs[0]?.id || '');
  
  // Use ref to access latest tabs without re-creating callbacks
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  // Sync tab with current route when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    const currentLabel = getLabelFromPath(currentPath);
    
    setTabs((prevTabs) => {
      // Find if there's already a tab for this path
      const existingTab = prevTabs.find((t) => t.path === currentPath);
      
      if (existingTab) {
        // Tab exists, just make sure it's active
        setActiveTabId(existingTab.id);
        return prevTabs;
      }
      
      // Update the active tab's path and label
      return prevTabs.map((tab) => {
        if (tab.id === tabsRef.current.find((t) => t.id === activeTabId)?.id) {
          return { ...tab, path: currentPath, label: currentLabel };
        }
        return tab;
      });
    });
  }, [location.pathname, activeTabId]);

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
