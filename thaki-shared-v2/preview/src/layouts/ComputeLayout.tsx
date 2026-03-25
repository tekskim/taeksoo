import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from '@shared/components/TabBar/TabBar';
import ToolBar from '@shared/components/ToolBar/ToolBar';
import type { BreadcrumbItem } from '@shared/components/Breadcrumb';
import { ComputeSidebar } from '../components/ComputeSidebar';

const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
  '/compute': [{ label: 'Compute', path: '/compute' }, { label: 'Home' }],
  '/compute/instances': [{ label: 'Compute', path: '/compute' }, { label: 'Instances' }],
  '/compute/instances/create': [
    { label: 'Compute', path: '/compute' },
    { label: 'Instances', path: '/compute/instances' },
    { label: 'Create instance' },
  ],
  '/compute/instance-templates': [
    { label: 'Compute', path: '/compute' },
    { label: 'Instance templates' },
  ],
  '/compute/instance-templates/create': [
    { label: 'Compute', path: '/compute' },
    { label: 'Instance templates', path: '/compute/instance-templates' },
    { label: 'Create template' },
  ],
  '/compute/instance-snapshots': [
    { label: 'Compute', path: '/compute' },
    { label: 'Instance snapshots' },
  ],
  '/compute/images': [{ label: 'Compute', path: '/compute' }, { label: 'Images' }],
  '/compute/images/create': [
    { label: 'Compute', path: '/compute' },
    { label: 'Images', path: '/compute/images' },
    { label: 'Create image' },
  ],
  '/compute/flavors': [{ label: 'Compute', path: '/compute' }, { label: 'Flavors' }],
  '/compute/key-pairs': [{ label: 'Compute', path: '/compute' }, { label: 'Key pairs' }],
  '/compute/server-groups': [{ label: 'Compute', path: '/compute' }, { label: 'Server groups' }],
  '/compute/volumes': [{ label: 'Compute', path: '/compute' }, { label: 'Volumes' }],
  '/compute/volumes/create': [
    { label: 'Compute', path: '/compute' },
    { label: 'Volumes', path: '/compute/volumes' },
    { label: 'Create volume' },
  ],
  '/compute/volume-snapshots': [
    { label: 'Compute', path: '/compute' },
    { label: 'Volume snapshots' },
  ],
  '/compute/volume-backups': [{ label: 'Compute', path: '/compute' }, { label: 'Volume backups' }],
  '/compute/networks': [{ label: 'Compute', path: '/compute' }, { label: 'Networks' }],
  '/compute/networks/create': [
    { label: 'Compute', path: '/compute' },
    { label: 'Networks', path: '/compute/networks' },
    { label: 'Create network' },
  ],
  '/compute/routers': [{ label: 'Compute', path: '/compute' }, { label: 'Routers' }],
  '/compute/ports': [{ label: 'Compute', path: '/compute' }, { label: 'Ports' }],
  '/compute/floating-ips': [{ label: 'Compute', path: '/compute' }, { label: 'Floating IPs' }],
  '/compute/security-groups': [
    { label: 'Compute', path: '/compute' },
    { label: 'Security groups' },
  ],
  '/compute/load-balancers': [{ label: 'Compute', path: '/compute' }, { label: 'Load balancers' }],
  '/compute/load-balancers/create': [
    { label: 'Compute', path: '/compute' },
    { label: 'Load balancers', path: '/compute/load-balancers' },
    { label: 'Create load balancer' },
  ],
  '/compute/firewalls': [{ label: 'Compute', path: '/compute' }, { label: 'NACL' }],
  '/compute/firewalls/create': [
    { label: 'Compute', path: '/compute' },
    { label: 'NACL', path: '/compute/firewalls' },
    { label: 'Create firewall' },
  ],
  '/compute/firewall/create-rule': [
    { label: 'Compute', path: '/compute' },
    { label: 'NACL', path: '/compute/firewalls' },
    { label: 'Create rule' },
  ],
  '/compute/certificates': [{ label: 'Compute', path: '/compute' }, { label: 'Certificates' }],
  '/compute/dns-zones': [{ label: 'Compute', path: '/compute' }, { label: 'DNS zones' }],
  '/compute/backup-policies': [
    { label: 'Compute', path: '/compute' },
    { label: 'Backup policies' },
  ],
  '/compute/scheduled-tasks': [
    { label: 'Compute', path: '/compute' },
    { label: 'Scheduled tasks' },
  ],
};

const DETAIL_ROUTES: { prefix: string; listLabel: string; listPath: string }[] = [
  { prefix: '/compute/instances/', listLabel: 'Instances', listPath: '/compute/instances' },
  {
    prefix: '/compute/instance-templates/',
    listLabel: 'Instance templates',
    listPath: '/compute/instance-templates',
  },
  {
    prefix: '/compute/instance-snapshots/',
    listLabel: 'Instance snapshots',
    listPath: '/compute/instance-snapshots',
  },
  { prefix: '/compute/images/', listLabel: 'Images', listPath: '/compute/images' },
  { prefix: '/compute/flavors/', listLabel: 'Flavors', listPath: '/compute/flavors' },
  { prefix: '/compute/key-pairs/', listLabel: 'Key pairs', listPath: '/compute/key-pairs' },
  {
    prefix: '/compute/server-groups/',
    listLabel: 'Server groups',
    listPath: '/compute/server-groups',
  },
  { prefix: '/compute/volumes/', listLabel: 'Volumes', listPath: '/compute/volumes' },
  {
    prefix: '/compute/volume-snapshots/',
    listLabel: 'Volume snapshots',
    listPath: '/compute/volume-snapshots',
  },
  {
    prefix: '/compute/volume-backups/',
    listLabel: 'Volume backups',
    listPath: '/compute/volume-backups',
  },
  { prefix: '/compute/networks/', listLabel: 'Networks', listPath: '/compute/networks' },
  { prefix: '/compute/routers/', listLabel: 'Routers', listPath: '/compute/routers' },
  { prefix: '/compute/ports/', listLabel: 'Ports', listPath: '/compute/ports' },
  {
    prefix: '/compute/floating-ips/',
    listLabel: 'Floating IPs',
    listPath: '/compute/floating-ips',
  },
  {
    prefix: '/compute/security-groups/',
    listLabel: 'Security groups',
    listPath: '/compute/security-groups',
  },
  {
    prefix: '/compute/load-balancers/',
    listLabel: 'Load balancers',
    listPath: '/compute/load-balancers',
  },
  {
    prefix: '/compute/listeners/',
    listLabel: 'Load balancers',
    listPath: '/compute/load-balancers',
  },
  { prefix: '/compute/pools/', listLabel: 'Load balancers', listPath: '/compute/load-balancers' },
  {
    prefix: '/compute/l7-policies/',
    listLabel: 'Load balancers',
    listPath: '/compute/load-balancers',
  },
  { prefix: '/compute/firewalls/', listLabel: 'NACL', listPath: '/compute/firewalls' },
  { prefix: '/compute/firewall-policies/', listLabel: 'NACL', listPath: '/compute/firewalls' },
  { prefix: '/compute/firewall-rules/', listLabel: 'NACL', listPath: '/compute/firewalls' },
  {
    prefix: '/compute/certificates/',
    listLabel: 'Certificates',
    listPath: '/compute/certificates',
  },
  { prefix: '/compute/dns-zones/', listLabel: 'DNS zones', listPath: '/compute/dns-zones' },
  {
    prefix: '/compute/backup-policies/',
    listLabel: 'Backup policies',
    listPath: '/compute/backup-policies',
  },
  {
    prefix: '/compute/scheduled-tasks/',
    listLabel: 'Scheduled tasks',
    listPath: '/compute/scheduled-tasks',
  },
  { prefix: '/compute/subnets/', listLabel: 'Networks', listPath: '/compute/networks' },
];

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const exact = BREADCRUMB_MAP[pathname];
  if (exact) return exact;

  for (const route of DETAIL_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      const id = pathname.slice(route.prefix.length).split('/')[0] || '';
      return [
        { label: 'Compute', path: '/compute' },
        { label: route.listLabel, path: route.listPath },
        { label: id },
      ];
    }
  }

  return [{ label: 'Compute' }];
}

const TITLE_MAP: Record<string, string> = {
  '/compute': 'Compute home',
  '/compute/instances': 'Instances',
  '/compute/instances/create': 'Create instance',
  '/compute/instance-templates': 'Instance templates',
  '/compute/instance-templates/create': 'Create template',
  '/compute/instance-snapshots': 'Instance snapshots',
  '/compute/images': 'Images',
  '/compute/images/create': 'Create image',
  '/compute/flavors': 'Flavors',
  '/compute/key-pairs': 'Key pairs',
  '/compute/server-groups': 'Server groups',
  '/compute/volumes': 'Volumes',
  '/compute/volumes/create': 'Create volume',
  '/compute/volume-snapshots': 'Volume snapshots',
  '/compute/volume-backups': 'Volume backups',
  '/compute/networks': 'Networks',
  '/compute/networks/create': 'Create network',
  '/compute/routers': 'Routers',
  '/compute/ports': 'Ports',
  '/compute/floating-ips': 'Floating IPs',
  '/compute/security-groups': 'Security groups',
  '/compute/load-balancers': 'Load balancers',
  '/compute/load-balancers/create': 'Create load balancer',
  '/compute/firewalls': 'NACL',
  '/compute/firewalls/create': 'Create firewall',
  '/compute/firewall/create-rule': 'Create rule',
  '/compute/certificates': 'Certificates',
  '/compute/dns-zones': 'DNS zones',
  '/compute/backup-policies': 'Backup policies',
  '/compute/scheduled-tasks': 'Scheduled tasks',
};

function getTabTitle(pathname: string): string {
  const exact = TITLE_MAP[pathname];
  if (exact) return exact;

  for (const route of DETAIL_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      return pathname.slice(route.prefix.length).split('/')[0] || route.listLabel;
    }
  }

  return 'Compute';
}

export function ComputeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const breadcrumbItems = useMemo(() => getBreadcrumbItems(location.pathname), [location.pathname]);
  const tabTitle = useMemo(() => getTabTitle(location.pathname), [location.pathname]);
  const tabs = useMemo(() => [{ id: 'main', title: tabTitle, fixed: true }], [tabTitle]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      <ComputeSidebar isCollapsed={!sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

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
