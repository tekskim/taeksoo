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
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
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

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;

