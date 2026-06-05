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
  Button,
  Modal,
  InfoBox,
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
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { installedAppsMock } from '@/pages/apps/appsMockData';
import type { InstalledApp } from '@/pages/apps/appsTypes';

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function InstalledAppsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<InstalledApp | null>(null);

  const filteredApps = installedAppsMock.filter(
    (app) =>
      !searchQuery ||
      app.releaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      onClick: () => setDeleteTarget(row),
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
      key: 'releaseName',
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
    { key: 'name', label: 'Chart name', minWidth: '140px' },
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
      sticky: 'right',
      render: (_value, row) => (
        <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            >
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Installed apps' }]} />}
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Installed apps" />

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

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete App"
        description="This will remove the Helm release and all associated Kubernetes resources. This action cannot be undone."
        size="sm"
      >
        <InfoBox
          label="App / Namespace"
          value={deleteTarget ? `${deleteTarget.releaseName} / ${deleteTarget.namespace}` : ''}
        />
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log('Delete', deleteTarget?.id);
              setDeleteTarget(null);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </PageShell>
  );
}
