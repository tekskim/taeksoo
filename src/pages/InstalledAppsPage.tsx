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
  Pagination,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconDownload } from '@tabler/icons-react';
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
  chart: string;
  updatedAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const installedApps: InstalledApp[] = [
  {
    id: '1',
    name: 'postgresql-primary',
    version: '16.2.0',
    namespace: 'default',
    status: 'Deployed',
    chart: 'postgresql-16.2.0',
    updatedAt: 'Mar 15, 2026 10:30:00',
  },
  {
    id: '2',
    name: 'nginx-ingress',
    version: '4.11.0',
    namespace: 'ingress-nginx',
    status: 'Deployed',
    chart: 'nginx-ingress-4.11.0',
    updatedAt: 'Mar 10, 2026 14:22:00',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function InstalledAppsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredApps = installedApps.filter(
    (app) =>
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.chart.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getContextMenuItems = (row: InstalledApp): ContextMenuItem[] => [
    { id: 'upgrade', label: 'Upgrade', onClick: () => console.log('Upgrade', row.id) },
    { id: 'rollback', label: 'Rollback', onClick: () => console.log('Rollback', row.id) },
    {
      id: 'uninstall',
      label: 'Uninstall',
      status: 'danger',
      divider: true,
      onClick: () => console.log('Uninstall', row.id),
    },
  ];

  const columns: TableColumn<InstalledApp>[] = [
    {
      key: 'status',
      title: 'Status',
      ...fixedColumns.status,
      render: (row) => (
        <Badge theme={getContainerStatusTheme(row.status)} type="subtle" size="sm">
          {row.status}
        </Badge>
      ),
    },
    { key: 'name', title: 'Name', minWidth: columnMinWidths.name },
    { key: 'chart', title: 'Chart', minWidth: 160 },
    { key: 'version', title: 'Version', minWidth: 100 },
    { key: 'namespace', title: 'Namespace', minWidth: columnMinWidths.namespace },
    { key: 'updatedAt', title: 'Updated at', minWidth: columnMinWidths.createdAt, align: 'right' },
    {
      key: 'actions',
      title: '',
      ...fixedColumns.actions,
      render: (row) => (
        <ContextMenu items={getContextMenuItems(row)} trigger="click">
          <Button variant="ghost" size="sm" aria-label="More actions">
            ···
          </Button>
        </ContextMenu>
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
                placeholder="Search installed apps"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} />}
                aria-label="Download"
              />
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
          totalItems={filteredApps.length}
          selectedCount={selectedItems.length}
        />

        <Table
          columns={columns}
          data={filteredApps}
          rowKey="id"
          selectable
          selectedKeys={selectedItems}
          onSelectionChange={setSelectedItems}
          emptyMessage="No installed apps found"
        />
      </VStack>
    </PageShell>
  );
}
