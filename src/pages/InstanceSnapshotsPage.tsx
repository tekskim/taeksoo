import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  StatusIndicator,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { CreateVolumeFromSnapshotDrawer } from '@/components/CreateVolumeFromSnapshotDrawer';
import { EditInstanceSnapshotDrawer } from '@/components/EditInstanceSnapshotDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SnapshotStatus = 'active' | 'creating' | 'error' | 'deleting';
type AccessType = 'Private' | 'Public';

interface InstanceSnapshot {
  id: string;
  name: string;
  status: SnapshotStatus;
  size: string;
  diskFormat: string;
  sourceInstance: string;
  sourceInstanceId: string;
  description: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSnapshots: InstanceSnapshot[] = [
  {
    id: 'snap-001',
    name: 'Ubuntu-22.04-base',
    status: 'active',
    size: '16GiB',
    diskFormat: 'RAW',
    sourceInstance: 'web-server-01',
    sourceInstanceId: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
    description: 'Base web server snapshot',
    createdAt: 'Sep 12, 2026 15:43:35',
  },
  {
    id: 'snap-002',
    name: 'CentOS-8-web',
    status: 'active',
    size: '32GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'db-server-01',
    sourceInstanceId: 'e5b8c0d31f2a49e7b6d4a3c2f1e09876',
    description: 'Database server backup',
    createdAt: 'Sep 10, 2026 01:17:01',
  },
  {
    id: 'snap-003',
    name: 'Debian-12-db',
    status: 'active',
    size: '64GiB',
    diskFormat: 'RAW',
    sourceInstance: 'analytics-01',
    sourceInstanceId: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    description: 'Application server snapshot',
    createdAt: 'Sep 8, 2026 11:51:27',
  },
  {
    id: 'snap-004',
    name: 'Rocky-9-ml',
    status: 'creating',
    size: '128GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'worker-node-01',
    sourceInstanceId: '7284d9174e81431e93060a9bbcf2cdfd',
    description: 'ML worker with GPU config',
    createdAt: 'Sep 7, 2026 04:38:10',
  },
  {
    id: 'snap-005',
    name: 'Ubuntu-22.04-k8s',
    status: 'active',
    size: '24GiB',
    diskFormat: 'RAW',
    sourceInstance: 'worker-node-02',
    sourceInstanceId: 'a3f1e8b204c647d8b5921ac3def08712',
    description: 'Kubernetes node snapshot',
    createdAt: 'Sep 5, 2026 14:12:36',
  },
  {
    id: 'snap-006',
    name: 'Alpine-3.18-minimal',
    status: 'active',
    size: '8GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'api-gateway-01',
    sourceInstanceId: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    description: 'Gateway server backup',
    createdAt: 'Sep 3, 2026 00:46:02',
  },
  {
    id: 'snap-007',
    name: 'Windows-Server-2022',
    status: 'active',
    size: '80GiB',
    diskFormat: 'RAW',
    sourceInstance: 'web-server-02',
    sourceInstanceId: '8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    description: 'Windows server snapshot',
    createdAt: 'Sep 1, 2026 10:20:28',
  },
  {
    id: 'snap-008',
    name: 'RHEL-8-enterprise',
    status: 'error',
    size: '48GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'master-node-01',
    sourceInstanceId: 'c9d2f5a63b7e4019a8e4b1d07c6e3f9a',
    description: 'Enterprise app backup',
    createdAt: 'Aug 28, 2026 07:11:07',
  },
  {
    id: 'snap-009',
    name: 'Fedora-39-dev',
    status: 'active',
    size: '20GiB',
    diskFormat: 'RAW',
    sourceInstance: 'gpu-node-01',
    sourceInstanceId: '1a4b7c9d3e5f2a8b6c0d4e7f9a1b3c5d',
    description: 'Development environment',
    createdAt: 'Aug 25, 2026 10:32:16',
  },
  {
    id: 'snap-010',
    name: 'Ubuntu-20.04-legacy',
    status: 'active',
    size: '40GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'gpu-node-02',
    sourceInstanceId: 'f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5',
    description: 'Legacy application backup',
    createdAt: 'Aug 20, 2026 23:27:51',
  },
  {
    id: 'snap-011',
    name: 'Arch-Linux-custom',
    status: 'active',
    size: '12GiB',
    diskFormat: 'RAW',
    sourceInstance: 'cache-server-01',
    sourceInstanceId: 'b0a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
    description: 'Custom build environment',
    createdAt: 'Aug 18, 2026 09:01:17',
  },
  {
    id: 'snap-012',
    name: 'openSUSE-15-prod',
    status: 'active',
    size: '36GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'api-gateway-02',
    sourceInstanceId: '4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    description: 'Production server snapshot',
    createdAt: 'Aug 15, 2026 12:22:26',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'sourceInstance', label: 'Source instance', type: 'text' },
  {
    id: 'diskFormat',
    label: 'Disk Format',
    type: 'select',
    options: [
      { value: 'RAW', label: 'RAW' },
      { value: 'QCOW2', label: 'QCOW2' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'creating', label: 'Creating' },
      { value: 'error', label: 'Error' },
      { value: 'deleting', label: 'Deleting' },
    ],
  },
];

export function InstanceSnapshotsPage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [snapshots, setSnapshots] = useState(mockSnapshots);
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>([]);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [snapshotToDelete, setSnapshotToDelete] = useState<InstanceSnapshot | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [createVolumeOpen, setCreateVolumeOpen] = useState(false);
  const [editSnapshotOpen, setEditSnapshotOpen] = useState(false);
  const [selectedSnapshotForDrawer, setSelectedSnapshotForDrawer] =
    useState<InstanceSnapshot | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Helper to parse size string to number
  const parseSizeToNumber = (size: string): number => {
    const match = size.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Drawer handlers
  const handleCreateVolume = (snapshot: InstanceSnapshot) => {
    setSelectedSnapshotForDrawer(snapshot);
    setCreateVolumeOpen(true);
  };

  const handleEditSnapshot = (snapshot: InstanceSnapshot) => {
    setSelectedSnapshotForDrawer(snapshot);
    setEditSnapshotOpen(true);
  };

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'diskFormat', label: 'Disk format', visible: true },
    { id: 'sourceInstance', label: 'Source instance', visible: true },
    { id: 'description', label: 'Description', visible: true },
    { id: 'createdAt', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Instance Snapshots');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter snapshots by search
  const filteredSnapshots = useMemo(() => {
    if (appliedFilters.length === 0) return snapshots;

    return snapshots.filter((s) => {
      return appliedFilters.every((filter) => {
        const value = String(s[filter.fieldId as keyof InstanceSnapshot] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [snapshots, appliedFilters]);

  const totalPages = Math.ceil(filteredSnapshots.length / rowsPerPage);

  // Handle delete
  const handleDeleteClick = (snapshot: InstanceSnapshot) => {
    setSnapshotToDelete(snapshot);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (snapshotToDelete) {
      setSnapshots((prev) => prev.filter((s) => s.id !== snapshotToDelete.id));
      setDeleteModalOpen(false);
      setSnapshotToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSnapshotToDelete(null);
  };

  // Selection handlers
  const toggleSelection = (id: string) => {
    setSelectedSnapshots((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    const currentPageIds = filteredSnapshots
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      .map((s) => s.id);

    const allSelected = currentPageIds.every((id) => selectedSnapshots.includes(id));

    if (allSelected) {
      setSelectedSnapshots((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedSnapshots((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  // Bulk delete handler
  const performBulkDelete = () => {
    setSnapshots((prev) => prev.filter((s) => !selectedSnapshots.includes(s.id)));
    setSelectedSnapshots([]);
  };

  // Get current page IDs for "select all" checkbox state
  const currentPageIds = filteredSnapshots
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((s) => s.id);
  const allCurrentPageSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedSnapshots.includes(id));
  const someCurrentPageSelected = currentPageIds.some((id) => selectedSnapshots.includes(id));

  // Status mapping
  const statusMap: Record<SnapshotStatus, 'active' | 'building' | 'error' | 'shutoff'> = {
    active: 'active',
    creating: 'building',
    error: 'error',
    deleting: 'shutoff',
  };

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<InstanceSnapshot>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/instance-snapshots/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.id}>
              ID : {row.id.slice(0, 8)}
            </span>
            <InlineCopyId value={row.id} />
          </span>
        </div>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
    },
    {
      key: 'diskFormat',
      label: 'Disk format',
      flex: 1,
      minWidth: columnMinWidths.diskFormat,
      sortable: true,
    },
    {
      key: 'sourceInstance',
      label: 'Source instance',
      flex: 1,
      minWidth: columnMinWidths.sourceInstance,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/instances/${row.sourceInstanceId}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.sourceInstance}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.sourceInstanceId}>
              ID : {row.sourceInstanceId.slice(0, 8)}
            </span>
            <InlineCopyId value={row.sourceInstanceId} />
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'create-instance',
            label: 'Create instance',
            onClick: () => console.log('Create instance from snapshot:', row.id),
          },
          {
            id: 'create-volume',
            label: 'Create volume',
            onClick: () => handleCreateVolume(row),
          },
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => handleEditSnapshot(row),
          },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => handleDeleteClick(row),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button
                aria-label="Row actions"
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
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

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<InstanceSnapshot> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Instance Snapshots' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader title="Instance snapshots" />

        {/* Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search snapshot by attributes"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} />}
                aria-label="Download"
                onClick={() => console.log('Download')}
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} />}
                disabled={selectedSnapshots.length === 0}
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => setIsPreferencesOpen(true)}
          totalItems={filteredSnapshots.length}
          selectedCount={selectedSnapshots.length}
        />

        {/* Table */}
        <Table<InstanceSnapshot>
          columns={visibleColumns}
          data={filteredSnapshots.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
          rowKey="id"
          emptyMessage="No snapshots found"
          selectable
          selectedKeys={selectedSnapshots}
          onSelectionChange={setSelectedSnapshots}
          loading={loading}
        />
      </VStack>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete snapshot"
        description="Removing the selected instance snapshots is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Snapshot name"
        infoValue={snapshotToDelete?.name}
      />

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={() => {
          performBulkDelete();
          setIsBulkDeleteOpen(false);
        }}
        title="Delete selected instance snapshots"
        description="Removing the selected instance snapshots is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {/* View Preferences Drawer */}
      <ViewPreferencesDrawer
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columnConfig}
        defaultColumns={defaultColumnConfig}
        onColumnsChange={setColumnConfig}
      />

      {/* Instance Snapshot Drawers */}
      <CreateVolumeFromSnapshotDrawer
        isOpen={createVolumeOpen}
        onClose={() => setCreateVolumeOpen(false)}
        snapshot={
          selectedSnapshotForDrawer
            ? {
                id: selectedSnapshotForDrawer.id,
                name: selectedSnapshotForDrawer.name,
                size: parseSizeToNumber(selectedSnapshotForDrawer.size),
              }
            : null
        }
      />

      <EditInstanceSnapshotDrawer
        isOpen={editSnapshotOpen}
        onClose={() => setEditSnapshotOpen(false)}
        snapshot={
          selectedSnapshotForDrawer
            ? {
                id: selectedSnapshotForDrawer.id,
                name: selectedSnapshotForDrawer.name,
                description: selectedSnapshotForDrawer.description,
              }
            : null
        }
      />
    </PageShell>
  );
}

export default InstanceSnapshotsPage;
