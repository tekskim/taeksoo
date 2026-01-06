import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell } from '@tabler/icons-react';

/* ----------------------------------------
   Route to Label Mapping
   ---------------------------------------- */

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/instances': 'Instances',
  '/instance-templates': 'Instance Templates',
  '/instance-snapshots': 'Instance Snapshots',
  '/images': 'Images',
  '/flavors': 'Flavors',
  '/key-pairs': 'Key Pairs',
  '/server-groups': 'Server Groups',
  '/volumes': 'Volumes',
  '/design-system': 'Design System',
};

function getBreadcrumbLabel(path: string): string {
  return routeLabels[path] || path.split('/').pop() || 'Page';
}

/* ----------------------------------------
   AppLayout Component
   ---------------------------------------- */

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    selectTab(tabId);
  };

  // Handle tab close
  const handleTabClose = (tabId: string) => {
    closeTab(tabId);
  };

  // Get current page label for breadcrumb
  const currentLabel = getBreadcrumbLabel(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main
        className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 overflow-x-auto ${
          sidebarOpen ? 'ml-[200px]' : 'ml-0'
        }`}
      >
        <div className="min-w-[var(--layout-content-min-width)]">
        {/* Fixed Header Area */}
        <div className="sticky top-0 z-30 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Proj-1', href: '/project' },
                  { label: currentLabel },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Page Content */}
        {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;

