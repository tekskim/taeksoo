import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  SearchInput,
  PageShell,
  PageHeader,
  ConfirmModal,
  StatusIndicator,
  Tooltip,
  EmptyState,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconPackages, IconTrash, IconEdit, IconDotsCircleHorizontal, IconSearch } from '@tabler/icons-react';
import type { InstalledApp, InstalledAppStatus } from '@/pages/apps/appsTypes';
import { installedAppsMock } from '@/pages/apps/appsMockData';

function toTitleCase(s: string): string {
  return s
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const statusMap: Record<InstalledAppStatus, 'active' | 'building' | 'error' | 'muted'> = {
  Deployed: 'active',
  Pending: 'building',
  Failed: 'error',
};

/* ----------------------------------------
   Apps > Installed Apps (Cluster-scoped)
   FR-006 목록 조회, FR-007 상세(Resources/Values YAML), FR-008 Values 다운로드,
   FR-009 Delete, FR-010~013 Edit/Upgrade
   ---------------------------------------- */

export function InstalledAppsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<InstalledApp | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const filteredApps = searchQuery.trim()
    ? installedAppsMock.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.namespace.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : installedAppsMock;

  const openDetail = (app: InstalledApp) => {
    navigate(`/container/apps/installed-apps/${app.id}`);
  };

  const openDeleteModal = (app: InstalledApp, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    setAppToDelete(app);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;
    setDeleteSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setDeleteSubmitting(false);
    setDeleteModalOpen(false);
    setAppToDelete(null);
  };

  const openEditPage = (app: InstalledApp, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    navigate(`/container/apps/installed-apps/${app.id}/edit`);
  };

  const columns: TableColumn<InstalledApp>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      minWidth: 120,
      render: (value: InstalledAppStatus, row) => (
        <Tooltip content={row.status === 'Failed' && row.errorMessage ? row.errorMessage : value}>
          <StatusIndicator status={statusMap[value]} label={value} />
        </Tooltip>
      ),
    },
    {
      key: 'name',
      label: 'App name',
      flex: 1,
      minWidth: 120,
      render: (value: string, row) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline"
          onClick={() => openDetail(row)}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      width: '100px',
    },
    {
      key: 'namespace',
      label: 'Namespace',
      width: '120px',
    },
    {
      key: 'chart',
      label: 'Chart',
      flex: 1,
      minWidth: 180,
      render: (value: string | undefined, row) => value ?? '—',
    },
    {
      key: 'lastDeployed',
      label: 'Last deployed',
      flex: 1,
      minWidth: 140,
      render: (value: string | undefined, row) => value ?? row.installedAt ?? '—',
    },
    {
      key: 'actions',
      label: 'Action',
      width: '64px',
      align: 'center',
      render: (_, row) => {
        const isPending = row.status === 'Pending';
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit-upgrade',
            label: 'Edit / Upgrade',
            icon: <IconEdit size={14} stroke={1.5} />,
            onClick: () => openEditPage(row),
            divider: true,
            disabled: isPending,
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: <IconTrash size={14} stroke={1.5} />,
            onClick: () => openDeleteModal(row),
            variant: 'danger',
            disabled: isPending,
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button
                type="button"
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group cursor-pointer"
                aria-label="Actions"
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
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
                { label: 'Apps', href: '/container/apps/catalog' },
                { label: 'Installed Apps' },
              ]}
            />
          }
          actions={
            <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Installed Apps" />

        <HStack gap={2} align="center">
          <SearchInput
            placeholder="Search by app name"
            size="sm"
            className="w-[var(--search-input-width)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </HStack>

        {filteredApps.length === 0 ? (
          searchQuery.trim() ? (
            <EmptyState
              variant="inline"
              icon={<IconSearch size={48} stroke={1} />}
              title="결과 없음"
              description="검색 조건에 맞는 설치된 앱이 없습니다."
            />
          ) : (
            <EmptyState
              variant="card"
              icon={<IconPackages size={48} stroke={1} />}
              title="No installed apps"
              description="Install apps from the Catalog to see them here."
            />
          )
        ) : (
          <Table<InstalledApp>
            columns={columns}
            data={filteredApps}
            rowKey="id"
          />
        )}
      </VStack>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete App"
        description="This will remove the release and its Kubernetes resources. This action cannot be undone."
        infoLabel="App"
        infoValue={appToDelete ? `${appToDelete.name} (${appToDelete.namespace})` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleteSubmitting}
      />

    </PageShell>
  );
}

export default InstalledAppsPage;
