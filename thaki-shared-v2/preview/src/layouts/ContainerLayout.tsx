import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from '@shared/components/TabBar/TabBar';
import ToolBar from '@shared/components/ToolBar/ToolBar';
import type { BreadcrumbItem } from '@shared/components/Breadcrumb';
import { ContainerSidebar } from '../components/ContainerSidebar';

const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
  '/container': [{ label: 'Container', path: '/container' }, { label: 'Home' }],
  '/container/dashboard': [{ label: 'Container', path: '/container' }, { label: 'Dashboard' }],
  '/container/namespaces': [{ label: 'Container', path: '/container' }, { label: 'Namespaces' }],
  '/container/namespaces/create': [
    { label: 'Container', path: '/container' },
    { label: 'Namespaces', path: '/container/namespaces' },
    { label: 'Create' },
  ],
  '/container/nodes': [{ label: 'Container', path: '/container' }, { label: 'Nodes' }],
  '/container/events': [{ label: 'Container', path: '/container' }, { label: 'Events' }],
  '/container/cluster-management': [
    { label: 'Container', path: '/container' },
    { label: 'Cluster management' },
    { label: 'Clusters' },
  ],
  '/container/cluster-management/create': [
    { label: 'Container', path: '/container' },
    { label: 'Cluster management', path: '/container/cluster-management' },
    { label: 'Create' },
  ],
  '/container/deployments': [{ label: 'Container', path: '/container' }, { label: 'Deployments' }],
  '/container/deployments/create': [
    { label: 'Container', path: '/container' },
    { label: 'Deployments', path: '/container/deployments' },
    { label: 'Create' },
  ],
  '/container/statefulsets': [
    { label: 'Container', path: '/container' },
    { label: 'StatefulSets' },
  ],
  '/container/statefulsets/create': [
    { label: 'Container', path: '/container' },
    { label: 'StatefulSets', path: '/container/statefulsets' },
    { label: 'Create' },
  ],
  '/container/daemonsets': [{ label: 'Container', path: '/container' }, { label: 'DaemonSets' }],
  '/container/daemonsets/create': [
    { label: 'Container', path: '/container' },
    { label: 'DaemonSets', path: '/container/daemonsets' },
    { label: 'Create' },
  ],
  '/container/jobs': [{ label: 'Container', path: '/container' }, { label: 'Jobs' }],
  '/container/jobs/create': [
    { label: 'Container', path: '/container' },
    { label: 'Jobs', path: '/container/jobs' },
    { label: 'Create' },
  ],
  '/container/cronjobs': [{ label: 'Container', path: '/container' }, { label: 'CronJobs' }],
  '/container/cronjobs/create': [
    { label: 'Container', path: '/container' },
    { label: 'CronJobs', path: '/container/cronjobs' },
    { label: 'Create' },
  ],
  '/container/pods': [{ label: 'Container', path: '/container' }, { label: 'Pods' }],
  '/container/pods/create': [
    { label: 'Container', path: '/container' },
    { label: 'Pods', path: '/container/pods' },
    { label: 'Create' },
  ],
  '/container/services': [{ label: 'Container', path: '/container' }, { label: 'Services' }],
  '/container/services/create': [
    { label: 'Container', path: '/container' },
    { label: 'Services', path: '/container/services' },
    { label: 'Create' },
  ],
  '/container/ingresses': [{ label: 'Container', path: '/container' }, { label: 'Ingresses' }],
  '/container/ingresses/create': [
    { label: 'Container', path: '/container' },
    { label: 'Ingresses', path: '/container/ingresses' },
    { label: 'Create' },
  ],
  '/container/hpa': [{ label: 'Container', path: '/container' }, { label: 'HPA' }],
  '/container/hpa/create': [
    { label: 'Container', path: '/container' },
    { label: 'HPA', path: '/container/hpa' },
    { label: 'Create' },
  ],
  '/container/persistent-volumes': [
    { label: 'Container', path: '/container' },
    { label: 'Persistent volumes' },
  ],
  '/container/persistent-volumes/create': [
    { label: 'Container', path: '/container' },
    { label: 'Persistent volumes', path: '/container/persistent-volumes' },
    { label: 'Create' },
  ],
  '/container/persistent-volumes/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'Persistent volumes', path: '/container/persistent-volumes' },
    { label: 'Create YAML' },
  ],
  '/container/pvc': [{ label: 'Container', path: '/container' }, { label: 'PVCs' }],
  '/container/pvc/create': [
    { label: 'Container', path: '/container' },
    { label: 'PVCs', path: '/container/pvc' },
    { label: 'Create' },
  ],
  '/container/pvc/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'PVCs', path: '/container/pvc' },
    { label: 'Create YAML' },
  ],
  '/container/storage-classes': [
    { label: 'Container', path: '/container' },
    { label: 'Storage classes' },
  ],
  '/container/storage-classes/create': [
    { label: 'Container', path: '/container' },
    { label: 'Storage classes', path: '/container/storage-classes' },
    { label: 'Create' },
  ],
  '/container/storage-classes/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'Storage classes', path: '/container/storage-classes' },
    { label: 'Create YAML' },
  ],
  '/container/configmaps': [{ label: 'Container', path: '/container' }, { label: 'ConfigMaps' }],
  '/container/configmaps/create': [
    { label: 'Container', path: '/container' },
    { label: 'ConfigMaps', path: '/container/configmaps' },
    { label: 'Create' },
  ],
  '/container/configmaps/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'ConfigMaps', path: '/container/configmaps' },
    { label: 'Create YAML' },
  ],
  '/container/secrets': [{ label: 'Container', path: '/container' }, { label: 'Secrets' }],
  '/container/secrets/create': [
    { label: 'Container', path: '/container' },
    { label: 'Secrets', path: '/container/secrets' },
    { label: 'Create' },
  ],
  '/container/secrets/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'Secrets', path: '/container/secrets' },
    { label: 'Create YAML' },
  ],
  '/container/limit-ranges': [
    { label: 'Container', path: '/container' },
    { label: 'Limit ranges' },
  ],
  '/container/limit-ranges/create': [
    { label: 'Container', path: '/container' },
    { label: 'Limit ranges', path: '/container/limit-ranges' },
    { label: 'Create' },
  ],
  '/container/limit-ranges/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'Limit ranges', path: '/container/limit-ranges' },
    { label: 'Create YAML' },
  ],
  '/container/resource-quotas': [
    { label: 'Container', path: '/container' },
    { label: 'Resource quotas' },
  ],
  '/container/resource-quotas/create': [
    { label: 'Container', path: '/container' },
    { label: 'Resource quotas', path: '/container/resource-quotas' },
    { label: 'Create' },
  ],
  '/container/resource-quotas/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'Resource quotas', path: '/container/resource-quotas' },
    { label: 'Create YAML' },
  ],
  '/container/network-policies': [
    { label: 'Container', path: '/container' },
    { label: 'Network policies' },
  ],
  '/container/network-policies/create': [
    { label: 'Container', path: '/container' },
    { label: 'Network policies', path: '/container/network-policies' },
    { label: 'Create' },
  ],
  '/container/network-policies/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'Network policies', path: '/container/network-policies' },
    { label: 'Create YAML' },
  ],
  '/container/pdb': [
    { label: 'Container', path: '/container' },
    { label: 'Pod disruption budgets' },
  ],
  '/container/pdb/create': [
    { label: 'Container', path: '/container' },
    { label: 'Pod disruption budgets', path: '/container/pdb' },
    { label: 'Create' },
  ],
  '/container/pdb/create-yaml': [
    { label: 'Container', path: '/container' },
    { label: 'Pod disruption budgets', path: '/container/pdb' },
    { label: 'Create YAML' },
  ],
};

const DETAIL_ROUTES: { prefix: string; listLabel: string; listPath: string }[] = [
  { prefix: '/container/namespaces/', listLabel: 'Namespaces', listPath: '/container/namespaces' },
  { prefix: '/container/nodes/', listLabel: 'Nodes', listPath: '/container/nodes' },
  {
    prefix: '/container/cluster-management/',
    listLabel: 'Cluster management',
    listPath: '/container/cluster-management',
  },
  {
    prefix: '/container/deployments/',
    listLabel: 'Deployments',
    listPath: '/container/deployments',
  },
  {
    prefix: '/container/statefulsets/',
    listLabel: 'StatefulSets',
    listPath: '/container/statefulsets',
  },
  { prefix: '/container/daemonsets/', listLabel: 'DaemonSets', listPath: '/container/daemonsets' },
  { prefix: '/container/jobs/', listLabel: 'Jobs', listPath: '/container/jobs' },
  { prefix: '/container/cronjobs/', listLabel: 'CronJobs', listPath: '/container/cronjobs' },
  { prefix: '/container/pods/', listLabel: 'Pods', listPath: '/container/pods' },
  { prefix: '/container/services/', listLabel: 'Services', listPath: '/container/services' },
  { prefix: '/container/ingresses/', listLabel: 'Ingresses', listPath: '/container/ingresses' },
  { prefix: '/container/hpa/', listLabel: 'HPA', listPath: '/container/hpa' },
  {
    prefix: '/container/persistent-volumes/',
    listLabel: 'Persistent volumes',
    listPath: '/container/persistent-volumes',
  },
  { prefix: '/container/pvc/', listLabel: 'PVCs', listPath: '/container/pvc' },
  {
    prefix: '/container/storage-classes/',
    listLabel: 'Storage classes',
    listPath: '/container/storage-classes',
  },
  { prefix: '/container/configmaps/', listLabel: 'ConfigMaps', listPath: '/container/configmaps' },
  { prefix: '/container/secrets/', listLabel: 'Secrets', listPath: '/container/secrets' },
  {
    prefix: '/container/limit-ranges/',
    listLabel: 'Limit ranges',
    listPath: '/container/limit-ranges',
  },
  {
    prefix: '/container/resource-quotas/',
    listLabel: 'Resource quotas',
    listPath: '/container/resource-quotas',
  },
  {
    prefix: '/container/network-policies/',
    listLabel: 'Network policies',
    listPath: '/container/network-policies',
  },
  { prefix: '/container/pdb/', listLabel: 'Pod disruption budgets', listPath: '/container/pdb' },
  { prefix: '/container/console/', listLabel: 'Console', listPath: '/container' },
];

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const exact = BREADCRUMB_MAP[pathname];
  if (exact) return exact;

  const nodeEditMatch = pathname.match(/^\/container\/nodes\/([^/]+)\/edit$/);
  if (nodeEditMatch) {
    const nid = nodeEditMatch[1];
    return [
      { label: 'Container', path: '/container' },
      { label: 'Nodes', path: '/container/nodes' },
      { label: nid, path: `/container/nodes/${nid}` },
      { label: 'Edit' },
    ];
  }

  for (const route of DETAIL_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      const id = pathname.slice(route.prefix.length).split('/')[0] || '';
      return [
        { label: 'Container', path: '/container' },
        { label: route.listLabel, path: route.listPath },
        { label: id },
      ];
    }
  }

  return [{ label: 'Container' }];
}

const TITLE_MAP: Record<string, string> = {
  '/container': 'Container home',
  '/container/dashboard': 'Dashboard',
  '/container/namespaces': 'Namespaces',
  '/container/nodes': 'Nodes',
  '/container/events': 'Events',
  '/container/cluster-management': 'Cluster management',
  '/container/deployments': 'Deployments',
  '/container/statefulsets': 'StatefulSets',
  '/container/daemonsets': 'DaemonSets',
  '/container/jobs': 'Jobs',
  '/container/cronjobs': 'CronJobs',
  '/container/pods': 'Pods',
  '/container/services': 'Services',
  '/container/ingresses': 'Ingresses',
  '/container/hpa': 'HPA',
  '/container/persistent-volumes': 'Persistent volumes',
  '/container/pvc': 'PVCs',
  '/container/storage-classes': 'Storage classes',
  '/container/configmaps': 'ConfigMaps',
  '/container/secrets': 'Secrets',
  '/container/limit-ranges': 'Limit ranges',
  '/container/resource-quotas': 'Resource quotas',
  '/container/network-policies': 'Network policies',
  '/container/pdb': 'Pod disruption budgets',
};

function getTabTitle(pathname: string): string {
  const exact = TITLE_MAP[pathname];
  if (exact) return exact;

  if (pathname.endsWith('/create')) {
    const parent = pathname.replace(/\/create$/, '');
    return `Create ${(TITLE_MAP[parent] || '').toLowerCase()}`;
  }

  if (pathname.endsWith('/create-yaml')) {
    const parent = pathname.replace(/\/create-yaml$/, '');
    return `Create ${(TITLE_MAP[parent] || '').toLowerCase()} (YAML)`;
  }

  if (/^\/container\/nodes\/[^/]+\/edit$/.test(pathname)) {
    const parts = pathname.split('/');
    return `Edit: ${parts[3] ?? 'node'}`;
  }

  if (pathname.startsWith('/container/console/')) {
    const id = pathname.slice('/container/console/'.length).split('/')[0];
    return id ? `Kubectl: ${id}` : 'Console';
  }

  for (const route of DETAIL_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      return pathname.slice(route.prefix.length).split('/')[0] || route.listLabel;
    }
  }

  return 'Container';
}

export function ContainerLayout() {
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();

  const breadcrumbItems = useMemo(() => getBreadcrumbItems(location.pathname), [location.pathname]);
  const tabTitle = useMemo(() => getTabTitle(location.pathname), [location.pathname]);
  const tabs = useMemo(() => [{ id: 'main', title: tabTitle, fixed: true }], [tabTitle]);

  const isHomePage = location.pathname === '/container';
  const showMenuPanel = menuOpen && !isHomePage;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      <ContainerSidebar isOpen={menuOpen} onToggle={() => setMenuOpen((prev) => !prev)} />

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
          isSidebarOpen={showMenuPanel}
          onToggleSidebar={() => setMenuOpen((prev) => !prev)}
          langButton={null}
        />

        <main className="flex-1 overflow-auto py-6 px-8 content-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
