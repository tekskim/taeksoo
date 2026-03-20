import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from '@shared/components/TabBar/TabBar';
import ToolBar from '@shared/components/ToolBar/ToolBar';
import type { BreadcrumbItem } from '@shared/components/Breadcrumb';
import { StorageSidebar } from '../components/StorageSidebar';

const SLUG_LABEL_MAP: Record<string, string> = {
  pools: 'Pools',
  hosts: 'Hosts',
  osds: 'OSDs',
  'physical-disks': 'Physical Disks',
  images: 'Images',
  buckets: 'Buckets',
  'file-systems': 'File Systems',
  nfs: 'NFS',
  performance: 'Overall Performance',
};

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const base: BreadcrumbItem = { label: 'Storage', path: '/storage' };

  const parts = pathname
    .replace(/^\/storage\/?/, '')
    .split('/')
    .filter(Boolean);
  if (parts.length === 0) return [base, { label: 'Home' }];

  const slug = parts[0];
  const slugLabel = SLUG_LABEL_MAP[slug] || slug;
  const slugPath = `/storage/${slug}`;

  if (parts.length === 1) return [base, { label: slugLabel }];

  if (parts[1] === 'create')
    return [base, { label: slugLabel, path: slugPath }, { label: 'Create' }];

  return [base, { label: slugLabel, path: slugPath }, { label: parts[1] }];
}

function getTabTitle(pathname: string): string {
  const parts = pathname
    .replace(/^\/storage\/?/, '')
    .split('/')
    .filter(Boolean);
  if (parts.length === 0) return 'Home';

  const slug = parts[0];
  const slugLabel = SLUG_LABEL_MAP[slug] || slug;

  if (parts[1] === 'create') return `Create - ${slugLabel}`;
  if (parts.length > 1 && parts[1] !== 'create') return parts[1];
  return slugLabel;
}

export function StorageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const breadcrumbItems = useMemo(() => getBreadcrumbItems(location.pathname), [location.pathname]);

  const tabTitle = useMemo(() => getTabTitle(location.pathname), [location.pathname]);

  const tabs = useMemo(() => [{ id: 'main', title: tabTitle, fixed: true }], [tabTitle]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      <StorageSidebar isCollapsed={!sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <TabBar
          tabs={tabs}
          activeTab="main"
          onTabClick={() => {}}
          onTabClose={() => {}}
          onAddTab={() => {}}
        />

        <ToolBar
          breadcrumbItems={breadcrumbItems}
          navigation={{
            canGoBack: true,
            canGoForward: false,
            onGoBack: () => window.history.back(),
            onGoForward: () => window.history.forward(),
          }}
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          langButton={null}
        />

        <main className="flex-1 overflow-auto pt-4 px-8 pb-20 content-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
