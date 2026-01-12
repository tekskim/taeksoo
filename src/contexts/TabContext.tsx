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
  moveTab: (fromIndex: number, toIndex: number) => void;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

// Helper function to get current app from path
function getAppFromPath(path: string): string {
  // Agent service routes - all treated as one app
  const agentServiceRoutes = ['/agent', '/chat', '/mcp-tools'];
  for (const route of agentServiceRoutes) {
    if (path.startsWith(route)) {
      return '/agent'; // All agent service routes share the same app
    }
  }
  
  const appPrefixes = ['/cloudbuilder', '/compute', '/storage', '/desktop', '/design', '/container', '/ai-platform'];
  for (const prefix of appPrefixes) {
    if (path.startsWith(prefix)) {
      return prefix;
    }
  }
  return '/'; // default app (home)
}

// Get app-specific storage keys
function getStorageKeys(app: string) {
  const appKey = app === '/' ? 'home' : app.slice(1); // remove leading slash
  return {
    tabs: `tabs-state-${appKey}`,
    activeTab: `active-tab-id-${appKey}`,
  };
}

// Get default home tab for an app
function getDefaultHomeTab(app: string): TabItem {
  const appHomeMap: Record<string, { path: string; label: string }> = {
    '/cloudbuilder': { path: '/cloudbuilder', label: 'Home' },
    '/compute': { path: '/compute', label: 'Home' },
    '/storage': { path: '/storage', label: 'Home' },
    '/agent': { path: '/agent', label: 'Home' }, // Agent service home
    '/desktop': { path: '/desktop', label: 'Home' },
    '/design': { path: '/design', label: 'Home' },
    '/container': { path: '/container', label: 'Dashboard' },
    '/ai-platform': { path: '/ai-platform', label: 'Dashboard' },
    '/': { path: '/', label: 'Home' },
  };
  
  const homeInfo = appHomeMap[app] || { path: '/', label: 'Home' };
  return {
    id: `${app === '/' ? 'home' : app.slice(1)}-home`,
    label: homeInfo.label,
    path: homeInfo.path,
    closable: true,
  };
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

// Helper function to get label from path - returns the most recent breadcrumb item
function getLabelFromPath(path: string): string {
  const pathLabelMap: Record<string, string> = {
    '/': 'Home',
    '/home': 'Home',
    '/compute': 'Home',
    '/compute/home': 'Home',
    '/compute/instances': 'Instances',
    '/compute/instances/create': 'Create instance',
    '/compute/instance-templates': 'Instance templates',
    '/compute/instance-snapshots': 'Instance snapshots',
    '/compute/images': 'Images',
    '/compute/flavors': 'Flavors',
    '/compute/key-pairs': 'Key pairs',
    '/compute/server-groups': 'Server groups',
    '/compute/volumes': 'Volumes',
    '/compute/volume-snapshots': 'Volume snapshots',
    '/compute/volume-backups': 'Volume backups',
    '/compute/networks': 'Networks',
    '/compute/routers': 'Routers',
    '/compute/ports': 'Ports',
    '/compute/floating-ips': 'Floating IPs',
    '/compute/security-groups': 'Security groups',
    '/compute/load-balancers': 'Load balancers',
    '/compute/certificates': 'Certificates',
    '/compute/topology': 'Topology',
    '/compute/console': 'Console',
    '/agent': 'Home',
    '/agent/list': 'Agent',
    '/agent/create': 'Create agent',
    '/agent/storage': 'Data sources',
    '/chat': 'Chat',
    '/mcp-tools': 'MCP Tools',
    '/storage': 'Home',
    '/storage/osds': 'OSDs',
    '/storage/hosts': 'Hosts',
    '/storage/pools': 'Pools',
    '/design': 'Design system',
    '/design/components': 'Design system',
    '/design/drawers': 'Drawers',
    '/design/modals': 'Modals',
    '/design-system': 'Design system',
    '/container': 'Dashboard',
    '/ai-platform': 'Dashboard',
    '/ai-platform/workloads': 'Workloads',
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
  
  // Track current app
  const [currentApp, setCurrentApp] = useState<string>(() => getAppFromPath(location.pathname));
  
  // Initialize from localStorage or use defaultTabs
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    const app = getAppFromPath(location.pathname);
    const storageKeys = getStorageKeys(app);
    try {
      const stored = localStorage.getItem(storageKeys.tabs);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }
    // Return default home tab for the app
    return [getDefaultHomeTab(app)];
  });
  
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    const app = getAppFromPath(location.pathname);
    const storageKeys = getStorageKeys(app);
    const stored = localStorage.getItem(storageKeys.activeTab);
    if (stored) {
      return stored;
    }
    return getDefaultHomeTab(app).id;
  });
  
  // Use ref to access latest tabs without re-creating callbacks
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  // Refs for controlling location sync behavior
  const initializedRef = useRef(false);
  const skipNextLocationSyncRef = useRef(false);

  // Detect app change and reset tabs to default
  useEffect(() => {
    const newApp = getAppFromPath(location.pathname);
    if (newApp !== currentApp) {
      setCurrentApp(newApp);
      
      // Skip location sync when switching apps to prevent duplicate tab creation
      skipNextLocationSyncRef.current = true;
      
      // Always reset to default home tab when entering a new app
      const homeTab = getDefaultHomeTab(newApp);
      setTabs([homeTab]);
      setActiveTabId(homeTab.id);
    }
  }, [location.pathname, currentApp]);

  // Persist tabs to localStorage (app-specific)
  useEffect(() => {
    const storageKeys = getStorageKeys(currentApp);
    localStorage.setItem(storageKeys.tabs, JSON.stringify(tabs));
  }, [tabs, currentApp]);

  // Persist active tab to localStorage (app-specific)
  useEffect(() => {
    const storageKeys = getStorageKeys(currentApp);
    localStorage.setItem(storageKeys.activeTab, activeTabId);
  }, [activeTabId, currentApp]);

  // On initial mount, sync tabs with current URL (prioritize current URL over stored active tab)
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
  // 각 탭은 독립적 - 다른 탭에 같은 경로가 있어도 현재 탭만 업데이트
  useEffect(() => {
    if (!initializedRef.current) return;
    
    // 새 탭 추가 또는 탭 선택 시 sync 건너뛰기
    if (skipNextLocationSyncRef.current) {
      skipNextLocationSyncRef.current = false;
      return;
    }
    
    const currentPath = location.pathname;
    const currentLabel = getLabelFromPath(currentPath);
    
    setTabs((prevTabs) => {
      // 현재 활성 탭 찾기
      const activeTab = prevTabs.find((t) => t.id === activeTabId);
      
      if (activeTab) {
        // 경로가 다르면 현재 탭 업데이트 (다른 탭에 같은 경로가 있어도 무시)
        if (activeTab.path !== currentPath) {
          return prevTabs.map((tab) =>
            tab.id === activeTabId ? { ...tab, path: currentPath, label: currentLabel } : tab
          );
        }
        return prevTabs;
      } else {
        // 활성 탭이 없으면 새 탭 생성
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
      
      // 탭이 모두 닫히면 현재 앱의 홈 탭 생성
      if (newTabs.length === 0) {
        const homeTab = getDefaultHomeTab(currentApp);
        setActiveTabId(homeTab.id);
        navigate(homeTab.path);
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
  }, [navigate, activeTabId, currentApp]);

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
    
    // Agent service routes - all go to /agent home
    const agentServiceRoutes = ['/agent', '/chat', '/mcp-tools'];
    const isAgentService = agentServiceRoutes.some(route => currentPath.startsWith(route));
    
    if (isAgentService) {
      const newTabId = `home-${Date.now()}`;
      const newTab: TabItem = {
        id: newTabId,
        label: 'Home',
        path: '/agent',
        closable: true,
      };
      addTab(newTab);
      skipNextLocationSyncRef.current = true;
      navigate('/agent');
      return;
    }
    
    // 애플리케이션별 홈 페이지 매핑 (라벨은 모두 Home으로 통일)
    const appHomeMap: Record<string, { path: string; label: string }> = {
      '/cloudbuilder': { path: '/cloudbuilder', label: 'Home' },
      '/compute': { path: '/compute', label: 'Home' },
      '/storage': { path: '/storage', label: 'Home' },
      '/desktop': { path: '/desktop', label: 'Home' },
      '/design': { path: '/design', label: 'Home' },
      '/container': { path: '/container', label: 'Dashboard' },
      '/ai-platform': { path: '/ai-platform', label: 'Dashboard' },
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

  // Move tab from one position to another (for drag and drop reordering)
  const moveTab = useCallback((fromIndex: number, toIndex: number) => {
    setTabs((prevTabs) => {
      if (fromIndex === toIndex) return prevTabs;
      if (fromIndex < 0 || fromIndex >= prevTabs.length) return prevTabs;
      if (toIndex < 0 || toIndex >= prevTabs.length) return prevTabs;
      
      const newTabs = [...prevTabs];
      const [movedTab] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, movedTab);
      return newTabs;
    });
  }, []);

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
        moveTab,
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
