import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from '@shared/components/TabBar/TabBar';
import ToolBar from '@shared/components/ToolBar/ToolBar';
import type { BreadcrumbItem } from '@shared/components/Breadcrumb';
import { CloudBuilderSidebar } from '../components/CloudBuilderSidebar';

const SLUG_LABEL_MAP: Record<string, string> = {
  discovery: 'Discovery',
  servers: 'Servers',
  switch: 'Switch',
  'severs0.7': 'Servers (0.7v)',
  services: 'Compute services',
  'compute-services': 'Compute nodes',
  'network-agents': 'Network agents',
  'block-storage-services': 'Block storage services',
  'orchestration-services': 'Orchestration services',
};

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const base: BreadcrumbItem = { label: 'Cloud Builder', path: '/cloudbuilder/discovery' };

  const parts = pathname
    .replace(/^\/cloudbuilder\/?/, '')
    .split('/')
    .filter(Boolean);
  if (parts.length === 0) return [base, { label: 'Discovery' }];

  const slug = parts[0];
  const slugLabel = SLUG_LABEL_MAP[slug] || slug;
  const slugPath = `/cloudbuilder/${slug}`;

  if (parts.length === 1) return [base, { label: slugLabel }];

  if (parts[1] === 'create')
    return [base, { label: slugLabel, path: slugPath }, { label: 'Create' }];

  if (parts[1] === 'detail' && parts[2]) {
    return [base, { label: slugLabel, path: slugPath }, { label: parts[2] }];
  }

  return [base, { label: slugLabel }];
}

function getTabTitle(pathname: string): string {
  const parts = pathname
    .replace(/^\/cloudbuilder\/?/, '')
    .split('/')
    .filter(Boolean);
  if (parts.length === 0) return 'Discovery';

  const slug = parts[0];
  const slugLabel = SLUG_LABEL_MAP[slug] || slug;

  if (parts[1] === 'create') return `Create - ${slugLabel}`;
  if (parts[1] === 'detail' && parts[2]) return parts[2];
  return slugLabel;
}

export function CloudBuilderLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const breadcrumbItems = useMemo(() => getBreadcrumbItems(location.pathname), [location.pathname]);

  const tabTitle = useMemo(() => getTabTitle(location.pathname), [location.pathname]);

  const tabs = useMemo(() => [{ id: 'main', title: tabTitle, fixed: true }], [tabTitle]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      <CloudBuilderSidebar
        isCollapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

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
