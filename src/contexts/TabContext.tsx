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

// Helper function to get label from path - returns the most recent breadcrumb item
function getLabelFromPath(path: string): string {
  const pathLabelMap: Record<string, string> = {
    '/': 'Home',
    '/home': 'Home',
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
    '/compute/console': 'Console',
    '/agent': 'Agent',
    '/agent/create': 'Create Agent',
    '/chat': 'Chat',
    '/storage': 'Home',
    '/storage/osds': 'OSDs',
    '/storage/hosts': 'Hosts',
    '/storage/pools': 'Pools',
    '/mcp-tools': 'MCP Tools',
    '/design': 'Design System',
    '/design/components': 'Design System',
    '/design/drawers': 'Drawers',
    '/design/modals': 'Modals',
    '/design-system': 'Design System',
  };
  
  // Check for exact match first
  if (pathLabelMap[path]) {
    return pathLabelMap[path];
  }
  
  // Detail page patterns - use simple ID, page component will update with entity name
  // The page component should call updateActiveTabLabel() with the actual entity name
  
  // For all other paths, use just the last segment (most recent breadcrumb)
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'Home';
  // Format: capitalize first letter and replace hyphens with spaces
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

  // On initial mount, sync tabs with current URL (prioritize current URL over stored active tab)
  const initializedRef = useRef(false);
  const skipNextLocationSyncRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const currentPath = location.pathname;
      
      // Check if there's a tab matching the current URL
      const matchingTab = tabsRef.current.find((t) => {
        const tabPathname = t.path.split('?')[0];
        return tabPathname === currentPath;
      });
      
      if (matchingTab) {
        // Activate the matching tab
        setActiveTabId(matchingTab.id);
      } else if (tabsRef.current.length > 0) {
        // Update the active tab's path instead of creating a new one
        const activeTab = tabsRef.current.find((t) => t.id === activeTabId);
        if (activeTab) {
          const currentLabel = getLabelFromPath(currentPath);
          setTabs((prev) => prev.map((tab) => 
            tab.id === activeTab.id ? { ...tab, path: currentPath, label: currentLabel } : tab
          ));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Sync tab with current route when location changes
  useEffect(() => {
    if (!initializedRef.current) return;
    
    // 새 탭 추가 시 sync 건너뛰기
    if (skipNextLocationSyncRef.current) {
      skipNextLocationSyncRef.current = false;
      return;
    }
    
    const currentPath = location.pathname;
    const currentLabel = getLabelFromPath(currentPath);
    
    setTabs((prevTabs) => {
      // Find if there's already a tab for this path (compare pathname without query string)
      const existingTab = prevTabs.find((t) => {
        const tabPathname = t.path.split('?')[0];
        return tabPathname === currentPath;
      });
      
      if (existingTab) {
        // Tab exists, just make sure it's active - DON'T update the label
        // (let page components update it via updateActiveTabLabel)
        setActiveTabId(existingTab.id);
        return prevTabs;
      }
      
      // Update the active tab's path, or create new tab if none exists
      const activeTab = prevTabs.find((t) => t.id === activeTabId);
      if (activeTab) {
        // Only update path and label if the path is actually different
        if (activeTab.path !== currentPath) {
          return prevTabs.map((tab) =>
            tab.id === activeTabId ? { ...tab, path: currentPath, label: currentLabel } : tab
          );
        }
        return prevTabs;
      } else {
        // No active tab, create a new one
        const newTab: TabItem = {
          id: `${currentPath.replace(/\//g, '-')}-${Date.now()}`,
          label: currentLabel,
          path: currentPath,
          closable: true,
        };
        setActiveTabId(newTab.id);
        return [...prevTabs, newTab];
      }
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
      const closedIndex = prev.findIndex((t) => t.id === tabId);
      const newTabs = prev.filter((t) => t.id !== tabId);
      
      // 탭이 모두 닫히면 홈 탭 생성
      if (newTabs.length === 0) {
        const homeTab: TabItem = {
          id: 'home',
          label: 'Home',
          path: '/',
          closable: true,
        };
        setActiveTabId(homeTab.id);
        navigate('/');
        return [homeTab];
      }
      
      // 닫는 탭이 현재 활성 탭인 경우에만 다른 탭으로 이동
      if (tabId === activeTabId) {
        // 인접한 탭으로 이동 (왼쪽 우선, 없으면 오른쪽)
        const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
        const newActiveTab = newTabs[newActiveIndex];
        setActiveTabId(newActiveTab.id);
        navigate(newActiveTab.path);
      }
      
      return newTabs;
    });
  }, [navigate, activeTabId]);

  // Select a tab - simplified, no location sync needed
  const selectTab = useCallback((tabId: string) => {
    const tab = tabsRef.current.find((t) => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      skipNextLocationSyncRef.current = true; // 탭 선택 시 sync 건너뛰기
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

  // Add a new empty tab (for + button) - opens current app's home page
  const addNewTab = useCallback(() => {
    const currentPath = location.pathname;
    
    // 애플리케이션별 홈 페이지 매핑 (라벨은 모두 Home으로 통일)
    const appHomeMap: Record<string, { path: string; label: string }> = {
      '/cloudbuilder': { path: '/cloudbuilder', label: 'Home' },
      '/compute': { path: '/compute', label: 'Home' },
      '/storage': { path: '/storage', label: 'Home' },
      '/agent': { path: '/agent', label: 'Home' },
      '/desktop': { path: '/desktop', label: 'Home' },
      '/design': { path: '/design', label: 'Home' },
    };
    
    // 현재 경로에서 애플리케이션 찾기
    let targetApp = { path: '/', label: 'Home' };
    for (const [prefix, appInfo] of Object.entries(appHomeMap)) {
      if (currentPath.startsWith(prefix)) {
        targetApp = appInfo;
        break;
      }
    }
    
    const newTabId = `${targetApp.label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newTab: TabItem = {
      id: newTabId,
      label: targetApp.label,
      path: targetApp.path,
      closable: true,
    };
    addTab(newTab);
    skipNextLocationSyncRef.current = true; // 새 탭 추가 시 sync 건너뛰기
    navigate(targetApp.path);
  }, [addTab, navigate, location.pathname]);

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
