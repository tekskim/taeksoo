/**
 * Installed Apps — FR-020 설치된 앱 목록 조회, FR-023 앱 삭제
 *
 * 정책서 4-1: 앱 이름, 버전, 설치된 네임스페이스, 현재 상태
 * 정책서 4-4: 삭제 확인 다이얼로그에 앱 이름 + 네임스페이스 명시
 * 정책서 2-5: Pending(Spinner) / Deployed(녹색) / Failed(빨간색)
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  PageShell,
  PageHeader,
  ConfirmModal,
  StatusIndicator,
  Tooltip,
  EmptyState,
  ContextMenu,
  ListToolbar,
  FilterSearchInput,
  Badge,
  type TableColumn,
  type ContextMenuItem,
  type AppliedFilter,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPackages,
  IconTrash,
  IconEdit,
  IconDotsCircleHorizontal,
  IconSearch,
} from '@tabler/icons-react';
import type { InstalledApp, InstalledAppStatus } from '@/pages/apps/appsTypes';
import { installedAppsMock } from '@/pages/apps/appsMockData';

/** 정책서 2-5: 상태 → StatusIndicator 매핑 */
const statusIndicatorMap: Record<InstalledAppStatus, 'active' | 'building' | 'error'> = {
  Deployed: 'active',
  Pending: 'building',
  Failed: 'error',
};

/* ────────────────────────────────────────────────────────────
   InstalledAppsPage
   ──────────────────────────────────────────────────────────── */

export function InstalledAppsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<InstalledApp | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  /* ── 필터 적용 ── */
  const filteredApps = useMemo(() => {
    const nameFilter = appliedFilters.find((f) => f.id === 'name')?.value ?? '';
    const chartFilter = appliedFilters.find((f) => f.id === 'chart')?.value ?? '';
    const nsFilter = appliedFilters.find((f) => f.id === 'namespace')?.value ?? '';
    const statusFilter = appliedFilters.find((f) => f.id === 'status')?.value ?? '';

    return installedAppsMock.filter((app) => {
      if (nameFilter && !app.releaseName.toLowerCase().includes(nameFilter.toLowerCase()))
        return false;
      if (chartFilter && !app.name.toLowerCase().includes(chartFilter.toLowerCase())) return false;
      if (nsFilter && !app.namespace.toLowerCase().includes(nsFilter.toLowerCase())) return false;
      if (statusFilter && app.status !== statusFilter) return false;
      return true;
    });
  }, [appliedFilters]);

  const filterFields = [
    {
      id: 'name',
      label: 'App name',
      type: 'text' as const,
      placeholder: 'Search by app name (release)...',
    },
    {
      id: 'chart',
      label: 'Chart name',
      type: 'text' as const,
      placeholder: 'Search by chart name...',
    },
    {
      id: 'namespace',
      label: 'Namespace',
      type: 'text' as const,
      placeholder: 'Search by namespace...',
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'Deployed', label: 'Deployed' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Failed', label: 'Failed' },
      ],
    },
  ];

  /* ── Handlers ── */
  const openDetail = (app: InstalledApp) => {
    navigate(`/container/apps/installed-apps/${app.id}`);
  };

  const openEditPage = (app: InstalledApp, e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    navigate(`/container/apps/installed-apps/${app.id}/edit`);
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

  /* ── Table columns (정책서 4-1) ── */
  const columns: TableColumn<InstalledApp>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      minWidth: 120,
      align: 'center',
      render: (value: InstalledAppStatus, row) => {
        const indicator = (
          <StatusIndicator status={statusIndicatorMap[value]} label={value} layout="default" />
        );
        if (value === 'Failed' && row.errorMessage) {
          return (
            <Tooltip content={row.errorMessage} position="top">
              {indicator}
            </Tooltip>
          );
        }
        return indicator;
      },
    },
    {
      key: 'releaseName',
      label: 'App name',
      flex: 1,
      minWidth: 140,
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
      key: 'namespace',
      label: 'Namespace',
      minWidth: 120,
      width: '130px',
    },
    {
      key: 'name',
      label: 'Chart name',
      minWidth: 120,
      width: '140px',
      render: (value: string) => (
        <span className="text-body-md text-[var(--color-text-muted)]">{value}</span>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      width: '100px',
      render: (value: string) => (
        <Badge variant="default" size="sm">
          v{value}
        </Badge>
      ),
    },
    {
      key: 'lastDeployed',
      label: 'Last deployed',
      flex: 1,
      minWidth: 140,
      render: (value: string | undefined, row) => (
        <span className="text-body-md text-[var(--color-text-muted)]">
          {value ?? row.installedAt ?? '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '64px',
      align: 'center',
      render: (_, row) => {
        const isEditDisabled = row.status === 'Pending';
        const menuItems: ContextMenuItem[] = [
          {
            id: 'edit',
            label: 'Edit',
            icon: <IconEdit size={14} stroke={1.5} />,
            onClick: () => openEditPage(row),
            disabled: isEditDisabled,
            divider: true,
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: <IconTrash size={14} stroke={1.5} />,
            onClick: () => openDeleteModal(row),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button
                type="button"
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
                aria-label={`Actions for ${row.releaseName}`}
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

  const isEmpty = filteredApps.length === 0;
  const hasFilters = appliedFilters.length > 0;

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
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Installed Apps" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search installed apps by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
            </ListToolbar.Actions>
          }
          filters={appliedFilters.map((f) => ({
            id: f.id,
            label: filterFields.find((ff) => ff.id === f.id)?.label ?? f.id,
            value: String(f.value),
          }))}
          onFilterRemove={(id) => setAppliedFilters((prev) => prev.filter((f) => f.id !== id))}
          onFiltersClear={() => setAppliedFilters([])}
        />

        {isEmpty ? (
          hasFilters ? (
            <EmptyState
              variant="inline"
              icon={<IconSearch size={48} stroke={1} />}
              title="No results found"
              description="No installed apps match the selected filters. Try adjusting your search criteria."
            />
          ) : (
            <EmptyState
              variant="card"
              icon={<IconPackages size={48} stroke={1} />}
              title="No installed apps"
              description="Install apps from the Catalog to see them here."
              action={
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/container/apps/catalog')}
                >
                  Go to Catalog
                </Button>
              }
            />
          )
        ) : (
          <Table<InstalledApp> columns={columns} data={filteredApps} rowKey="id" />
        )}
      </VStack>

      {/* 정책서 4-4: 삭제 확인 다이얼로그에 앱 이름 + 네임스페이스 명시 */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAppToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete App"
        description="This will remove the Helm release and all associated Kubernetes resources. This action cannot be undone."
        infoLabel="App / Namespace"
        infoValue={appToDelete ? `${appToDelete.releaseName} / ${appToDelete.namespace}` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleteSubmitting}
      />
    </PageShell>
  );
}

export default InstalledAppsPage;
