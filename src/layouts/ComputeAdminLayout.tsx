import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar, TopBar, Breadcrumb } from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Route to Label Mapping
   ---------------------------------------- */

const routeLabels: Record<string, string> = {
  '/compute-admin': 'Home',
  '/compute-admin/instances': 'Instances',
  '/compute-admin/instance-templates': 'Instance templates',
  '/compute-admin/instance-snapshots': 'Instance snapshots',
  '/compute-admin/images': 'Images',
  '/compute-admin/flavors': 'Flavors',
  '/compute-admin/host-aggregates': 'Host aggregates',
  '/compute-admin/bare-metal-nodes': 'Bare metal nodes',
  '/compute-admin/volumes': 'Volumes',
  '/compute-admin/volume-snapshots': 'Volume Snapshots',
  '/compute-admin/volume-backups': 'Volume backups',
  '/compute-admin/volume-types': 'Volume types',
  '/compute-admin/networks': 'Networks',
  '/compute-admin/routers': 'Routers',
  '/compute-admin/ports': 'Ports',
  '/compute-admin/floating-ips': 'Floating IPs',
  '/compute-admin/security-groups': 'Security groups',
  '/compute-admin/load-balancers': 'Load balancers',
  '/compute-admin/tenants': 'Tenants',
  '/compute-admin/metadata-definition': 'Metadata definition',
  '/compute-admin/monitor-overview': 'Monitor overview',
  '/compute-admin/physical-nodes': 'Physical nodes',
};

function getBreadcrumbLabel(path: string): string {
  // Check for exact match first
  if (routeLabels[path]) {
    return routeLabels[path];
  }
  // Check for partial match (detail pages)
  for (const [route, label] of Object.entries(routeLabels)) {
    if (path.startsWith(route + '/')) {
      return label;
    }
  }
  return path.split('/').pop() || 'Page';
}

/* ----------------------------------------
   ComputeAdminLayout Component
   ---------------------------------------- */

export function ComputeAdminLayout() {
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
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

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
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb items={[{ label: 'Compute Admin' }, { label: currentLabel }]} />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ComputeAdminLayout;
