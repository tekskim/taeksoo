import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from '@shared/components/TabBar/TabBar';
import ToolBar from '@shared/components/ToolBar/ToolBar';
import type { BreadcrumbItem } from '@shared/components/Breadcrumb';
import { ComputeAdminSidebar } from '../components/ComputeAdminSidebar';

const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
  '/compute-admin': [{ label: 'Compute Admin', path: '/compute-admin' }, { label: 'Home' }],
  '/compute-admin/instances': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Instances' },
  ],
  '/compute-admin/instances/create': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Instances', path: '/compute-admin/instances' },
    { label: 'Create instance' },
  ],
  '/compute-admin/instance-templates': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Instance templates' },
  ],
  '/compute-admin/instance-templates/create': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Instance templates', path: '/compute-admin/instance-templates' },
    { label: 'Create template' },
  ],
  '/compute-admin/instance-snapshots': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Instance snapshots' },
  ],
  '/compute-admin/images': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Images' },
  ],
  '/compute-admin/images/create': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Images', path: '/compute-admin/images' },
    { label: 'Create image' },
  ],
  '/compute-admin/flavors': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Flavors' },
  ],
  '/compute-admin/flavors/create': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Flavors', path: '/compute-admin/flavors' },
    { label: 'Create flavor' },
  ],
  '/compute-admin/server-groups': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Server groups' },
  ],
  '/compute-admin/host-aggregates': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Host aggregates' },
  ],
  '/compute-admin/bare-metal-nodes': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Bare metal nodes' },
  ],
  '/compute-admin/volumes': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Volumes' },
  ],
  '/compute-admin/volume-snapshots': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Volume snapshots' },
  ],
  '/compute-admin/volume-backups': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Volume backups' },
  ],
  '/compute-admin/volume-types': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Volume types' },
  ],
  '/compute-admin/networks': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Networks' },
  ],
  '/compute-admin/networks/create': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Networks', path: '/compute-admin/networks' },
    { label: 'Create network' },
  ],
  '/compute-admin/routers': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Routers' },
  ],
  '/compute-admin/ports': [{ label: 'Compute Admin', path: '/compute-admin' }, { label: 'Ports' }],
  '/compute-admin/floating-ips': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Floating IPs' },
  ],
  '/compute-admin/security-groups': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Security groups' },
  ],
  '/compute-admin/load-balancers': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Load balancers' },
  ],
  '/compute-admin/firewall': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Firewall' },
  ],
  '/compute-admin/firewall/create-rule': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Firewall', path: '/compute-admin/firewall' },
    { label: 'Create rule' },
  ],
  '/compute-admin/certificates': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Certificates' },
  ],
  '/compute-admin/tenants': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Tenants' },
  ],
  '/compute-admin/metadata-definition': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Metadata definition' },
  ],
  '/compute-admin/monitor-overview': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Monitor overview' },
  ],
  '/compute-admin/physical-nodes': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Physical nodes' },
  ],
  '/compute-admin/topology': [
    { label: 'Compute Admin', path: '/compute-admin' },
    { label: 'Topology' },
  ],
};

const DETAIL_ROUTES: { prefix: string; listLabel: string; listPath: string }[] = [
  {
    prefix: '/compute-admin/instances/',
    listLabel: 'Instances',
    listPath: '/compute-admin/instances',
  },
  {
    prefix: '/compute-admin/instance-templates/',
    listLabel: 'Instance templates',
    listPath: '/compute-admin/instance-templates',
  },
  {
    prefix: '/compute-admin/instance-snapshots/',
    listLabel: 'Instance snapshots',
    listPath: '/compute-admin/instance-snapshots',
  },
  { prefix: '/compute-admin/images/', listLabel: 'Images', listPath: '/compute-admin/images' },
  { prefix: '/compute-admin/flavors/', listLabel: 'Flavors', listPath: '/compute-admin/flavors' },
  {
    prefix: '/compute-admin/server-groups/',
    listLabel: 'Server groups',
    listPath: '/compute-admin/server-groups',
  },
  { prefix: '/compute-admin/volumes/', listLabel: 'Volumes', listPath: '/compute-admin/volumes' },
  {
    prefix: '/compute-admin/volume-snapshots/',
    listLabel: 'Volume snapshots',
    listPath: '/compute-admin/volume-snapshots',
  },
  {
    prefix: '/compute-admin/volume-backups/',
    listLabel: 'Volume backups',
    listPath: '/compute-admin/volume-backups',
  },
  {
    prefix: '/compute-admin/volume-types/',
    listLabel: 'Volume types',
    listPath: '/compute-admin/volume-types',
  },
  {
    prefix: '/compute-admin/qos-specs/',
    listLabel: 'Volume types',
    listPath: '/compute-admin/volume-types',
  },
  {
    prefix: '/compute-admin/networks/',
    listLabel: 'Networks',
    listPath: '/compute-admin/networks',
  },
  { prefix: '/compute-admin/subnets/', listLabel: 'Networks', listPath: '/compute-admin/networks' },
  { prefix: '/compute-admin/routers/', listLabel: 'Routers', listPath: '/compute-admin/routers' },
  { prefix: '/compute-admin/ports/', listLabel: 'Ports', listPath: '/compute-admin/ports' },
  {
    prefix: '/compute-admin/floating-ips/',
    listLabel: 'Floating IPs',
    listPath: '/compute-admin/floating-ips',
  },
  {
    prefix: '/compute-admin/security-groups/',
    listLabel: 'Security groups',
    listPath: '/compute-admin/security-groups',
  },
  {
    prefix: '/compute-admin/load-balancers/',
    listLabel: 'Load balancers',
    listPath: '/compute-admin/load-balancers',
  },
  {
    prefix: '/compute-admin/listeners/',
    listLabel: 'Load balancers',
    listPath: '/compute-admin/load-balancers',
  },
  {
    prefix: '/compute-admin/pools/',
    listLabel: 'Load balancers',
    listPath: '/compute-admin/load-balancers',
  },
  {
    prefix: '/compute-admin/l7-policies/',
    listLabel: 'Load balancers',
    listPath: '/compute-admin/load-balancers',
  },
  {
    prefix: '/compute-admin/firewalls/',
    listLabel: 'Firewall',
    listPath: '/compute-admin/firewall',
  },
  {
    prefix: '/compute-admin/firewall-policies/',
    listLabel: 'Firewall',
    listPath: '/compute-admin/firewall',
  },
  {
    prefix: '/compute-admin/firewall-rules/',
    listLabel: 'Firewall',
    listPath: '/compute-admin/firewall',
  },
  {
    prefix: '/compute-admin/certificates/',
    listLabel: 'Certificates',
    listPath: '/compute-admin/certificates',
  },
  { prefix: '/compute-admin/tenants/', listLabel: 'Tenants', listPath: '/compute-admin/tenants' },
  {
    prefix: '/compute-admin/metadata-definition/',
    listLabel: 'Metadata definition',
    listPath: '/compute-admin/metadata-definition',
  },
  {
    prefix: '/compute-admin/bare-metal-nodes/',
    listLabel: 'Bare metal nodes',
    listPath: '/compute-admin/bare-metal-nodes',
  },
  {
    prefix: '/compute-admin/physical-nodes/',
    listLabel: 'Physical nodes',
    listPath: '/compute-admin/physical-nodes',
  },
  {
    prefix: '/compute-admin/console/',
    listLabel: 'Instances',
    listPath: '/compute-admin/instances',
  },
];

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const exact = BREADCRUMB_MAP[pathname];
  if (exact) return exact;

  for (const route of DETAIL_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      const id = pathname.slice(route.prefix.length).split('/')[0] || '';
      return [
        { label: 'Compute Admin', path: '/compute-admin' },
        { label: route.listLabel, path: route.listPath },
        { label: id },
      ];
    }
  }

  return [{ label: 'Compute Admin' }];
}

const TITLE_MAP: Record<string, string> = {
  '/compute-admin': 'Compute Admin home',
  '/compute-admin/instances': 'Instances',
  '/compute-admin/instances/create': 'Create instance',
  '/compute-admin/instance-templates': 'Instance templates',
  '/compute-admin/instance-templates/create': 'Create template',
  '/compute-admin/instance-snapshots': 'Instance snapshots',
  '/compute-admin/images': 'Images',
  '/compute-admin/images/create': 'Create image',
  '/compute-admin/flavors': 'Flavors',
  '/compute-admin/flavors/create': 'Create flavor',
  '/compute-admin/server-groups': 'Server groups',
  '/compute-admin/host-aggregates': 'Host aggregates',
  '/compute-admin/bare-metal-nodes': 'Bare metal nodes',
  '/compute-admin/volumes': 'Volumes',
  '/compute-admin/volume-snapshots': 'Volume snapshots',
  '/compute-admin/volume-backups': 'Volume backups',
  '/compute-admin/volume-types': 'Volume types',
  '/compute-admin/networks': 'Networks',
  '/compute-admin/networks/create': 'Create network',
  '/compute-admin/routers': 'Routers',
  '/compute-admin/ports': 'Ports',
  '/compute-admin/floating-ips': 'Floating IPs',
  '/compute-admin/security-groups': 'Security groups',
  '/compute-admin/load-balancers': 'Load balancers',
  '/compute-admin/firewall': 'Firewall',
  '/compute-admin/firewall/create-rule': 'Create rule',
  '/compute-admin/certificates': 'Certificates',
  '/compute-admin/tenants': 'Tenants',
  '/compute-admin/metadata-definition': 'Metadata definition',
  '/compute-admin/monitor-overview': 'Monitor overview',
  '/compute-admin/physical-nodes': 'Physical nodes',
  '/compute-admin/topology': 'Topology',
};

function getTabTitle(pathname: string): string {
  const exact = TITLE_MAP[pathname];
  if (exact) return exact;

  for (const route of DETAIL_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      return pathname.slice(route.prefix.length).split('/')[0] || route.listLabel;
    }
  }

  return 'Compute Admin';
}

export function ComputeAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const breadcrumbItems = useMemo(() => getBreadcrumbItems(location.pathname), [location.pathname]);
  const tabTitle = useMemo(() => getTabTitle(location.pathname), [location.pathname]);
  const tabs = useMemo(() => [{ id: 'main', title: tabTitle, fixed: true }], [tabTitle]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      <ComputeAdminSidebar
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

        <main className="flex-1 overflow-auto py-6 px-8 content-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
