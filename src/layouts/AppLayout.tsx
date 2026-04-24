import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { TabBar, TopBar, Breadcrumb } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Route to Label Mapping
   ---------------------------------------- */

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/instances': 'Instances',
  '/instance-templates': 'Instance templates',
  '/instance-snapshots': 'Instance snapshots',
  '/images': 'Images',
  '/flavors': 'Flavors',
  '/key-pairs': 'Key pairs',
  '/server-groups': 'Server groups',
  '/volumes': 'Volumes',
  '/design-system': 'Design system',
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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

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
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
            onWindowClose={() => navigate('/')}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={<Breadcrumb items={[{ label: currentLabel }]} />}
          />
        </div>

        {/* Scrollable Content Area */}
        <OverlayScrollbarsComponent
          options={{
            overflow: { x: 'hidden', y: 'scroll' },
            scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
          }}
          defer={false}
          className="flex-1 min-w-[var(--layout-content-min-width)] overscroll-contain"
        >
          {children || <Outlet />}
        </OverlayScrollbarsComponent>
      </main>
    </div>
  );
}

export default AppLayout;
