import { useState } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  Table,
  Badge,
  SearchInput,
  ListToolbar,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { Link, useNavigate } from 'react-router-dom';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';

function TopBarActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
      aria-label={label}
    >
      <span className="text-[var(--color-text-muted)]">{icon}</span>
    </button>
  );
}

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface InstalledApp {
  id: string;
  name: string;
  version: string;
  namespace: string;
  status: string;
  chartName: string;
  lastDeployed: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const installedApps: InstalledApp[] = [
  {
    id: '1',
    name: 'postgresql-1',
    version: 'v16.2',
    namespace: 'default',
    status: 'Deployed',
    chartName: 'postgresql',
    lastDeployed: 'Mar 01, 2026',
  },
  {
    id: '2',
    name: 'kafka',
    version: 'v08.33',
    namespace: 'data',
    status: 'Deployed',
    chartName: 'kafka',
    lastDeployed: 'Mar 10, 2026',
  },
  {
    id: '3',
    name: 'valkey',
    version: 'v80.2',
    namespace: 'cache',
    status: 'Deployed',
    chartName: 'valkey',
    lastDeployed: 'Mar 06, 2026',
  },
  {
    id: '4',
    name: 'nginx-1',
    version: 'v4.05',
    namespace: 'ingress-nginx',
    status: 'Deployed',
    chartName: 'nginx',
    lastDeployed: 'Mar 08, 2026',
  },
  {
    id: '5',
    name: 'milvus',
    version: 'v4.27',
    namespace: 'ai',
    status: 'Pending',
    chartName: 'milvus',
    lastDeployed: 'Mar 12, 2026',
  },
  {
    id: '6',
    name: 'postgresql-1',
    version: 'v16.30',
    namespace: 'ai',
    status: 'Failed',
    chartName: 'postgresql',
    lastDeployed: 'Mar 12, 2026',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function InstalledAppsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = installedApps.filter(
    (app) =>
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.chartName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.namespace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getContextMenuItems = (row: InstalledApp): ContextMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      onClick: () => navigate(`/container/installed-apps/${row.id}/edit`),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
      onClick: () => console.log('Delete', row.id),
    },
  ];

  const columns: TableColumn<InstalledApp>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      render: (_value, row) => (
        <Badge theme={getContainerStatusTheme(row.status)} type="subtle" size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'name',
      label: 'App name',
      minWidth: columnMinWidths.name,
      render: (value, row) => (
        <Link
          to={`/container/installed-apps/${row.id}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline truncate block min-w-0"
        >
          {value}
        </Link>
      ),
    },
    { key: 'namespace', label: 'Namespace', minWidth: columnMinWidths.namespace },
    { key: 'chartName', label: 'Chart name', minWidth: '140px' },
    {
      key: 'version',
      label: 'Version',
      minWidth: '100px',
      render: (value) => (
        <Badge theme="white" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'lastDeployed',
      label: 'Last deployed',
      minWidth: columnMinWidths.createdAt,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_value, row) => (
        <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-muted)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/catalog' },
                { label: 'Installed Apps' },
              ]}
            />
          }
          actions={
            <>
              <TopBarActionButton icon={<IconTerminal2 size={16} stroke={1.5} />} label="Console" />
              <TopBarActionButton
                icon={<IconBell size={16} stroke={1.5} />}
                label="Notifications"
              />
            </>
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader title="Installed Apps" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search installed apps by attributes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                size="sm"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
        />

        <Table
          columns={columns}
          data={filteredApps}
          rowKey="id"
          emptyMessage="No installed apps found"
        />
      </VStack>
    </PageShell>
  );
}
