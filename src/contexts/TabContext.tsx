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
  updateActiveTabLabel: (label: string) => void;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const TABS_STORAGE_KEY = 'tabs-state';
const ACTIVE_TAB_STORAGE_KEY = 'active-tab-id';

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
    '/compute': 'Home',
    '/compute/home': 'Home',
    '/compute/instances': 'Instances',
    '/compute/instances/create': 'Create Instance',
    '/compute/instance-templates': 'Instance Templates',
    '/compute/instance-snapshots': 'Instance Snapshots',
    '/compute/images': 'Images',
    '/compute/flavors': 'Flavors',
    '/compute/key-pairs': 'Key Pairs',
    '/compute/server-groups': 'Server Groups',
    '/compute/volumes': 'Volumes',
    '/compute/volume-snapshots': 'Volume Snapshots',
    '/compute/volume-backups': 'Volume Backups',
    '/compute/networks': 'Networks',
    '/compute/routers': 'Routers',
    '/compute/ports': 'Ports',
    '/compute/floating-ips': 'Floating IPs',
    '/compute/security-groups': 'Security Groups',
    '/compute/load-balancers': 'Load Balancers',
    '/compute/certificates': 'Certificates',
    '/compute/topology': 'Topology',
    '/design/components': 'Design System',
    '/design/drawers': 'Drawers',
    '/design/modals': 'Modals',
  };
  
  // Check for exact match first
  if (pathLabelMap[path]) {
    return pathLabelMap[path];
  }
  
  // Check for detail pages (e.g., /compute/volumes/vol-001)
  for (const [basePath, label] of Object.entries(pathLabelMap)) {
    if (basePath !== '/' && path.startsWith(basePath + '/')) {
      // Extract the ID from the path for detail pages
      const id = path.split('/').pop();
      return `${label} - ${id}`;
    }
  }
  
  // Default: use just the last segment
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'Home';
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
}

export function TabProvider({ children, defaultTabs = [] }: TabProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize from localStorage or use defaultTabs
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    try {
      const stored = localStorage.getItem(TABS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }
    return defaultTabs;
  });
  
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    const stored = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
    if (stored) {
      return stored;
    }
    return defaultTabs[0]?.id || '';
  });
  
  // Use ref to access latest tabs without re-creating callbacks
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  // Persist tabs to localStorage
  useEffect(() => {
    localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  // Persist active tab to localStorage
  useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTabId);
  }, [activeTabId]);

  // On initial mount, navigate to the active tab's path if different from current location
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && tabs.length > 0) {
      initializedRef.current = true;
      const activeTab = tabs.find(t => t.id === activeTabId);
      if (activeTab && activeTab.path !== location.pathname) {
        // Navigate to the active tab's path
        navigate(activeTab.path, { replace: true });
      }
    }
  }, [tabs, activeTabId, location.pathname, navigate]);

  // Sync tab with current route when location changes
  useEffect(() => {
    if (!initializedRef.current) return;
    
    const currentPath = location.pathname;
    const currentLabel = getLabelFromPath(currentPath);
    
    setTabs((prevTabs) => {
      // Find if there's already a tab for this path (compare pathname without query string)
      const existingTab = prevTabs.find((t) => {
        const tabPathname = t.path.split('?')[0];
        return tabPathname === currentPath;
      });
      
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

  // Update the label of the active tab
  const updateActiveTabLabel = useCallback((label: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, label } : tab
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
        updateActiveTabLabel,
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
