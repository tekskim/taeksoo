import { useState, useMemo } from 'react';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
  StatusIndicator,
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
import { CreateVolumeFromVolumeSnapshotDrawer } from '@/components/CreateVolumeFromVolumeSnapshotDrawer';
import { EditVolumeSnapshotDrawer } from '@/components/EditVolumeSnapshotDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SnapshotStatus = 'active' | 'creating' | 'error' | 'deleting';

interface VolumeSnapshot {
  id: string;
  name: string;
  size: string;
  sourceVolume: string;
  sourceVolumeId: string;
  createdAt: string;
  status: SnapshotStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumeSnapshots: VolumeSnapshot[] = [
  {
    id: 'vsnap-001',
    name: 'db-data-snap',
    size: '1500GiB',
    sourceVolume: 'vol-1',
    sourceVolumeId: 'vol-001',
    createdAt: 'Sep 12, 2025 15:43:35',
    status: 'active',
  },
  {
    id: 'vsnap-002',
    name: 'app-storage-snap',
    size: '500GiB',
    sourceVolume: 'vol-2',
    sourceVolumeId: 'vol-002',
    createdAt: 'Sep 10, 2025 01:17:01',
    status: 'active',
  },
  {
    id: 'vsnap-003',
    name: 'backup-vol-snap',
    size: '2000GiB',
    sourceVolume: 'vol-3',
    sourceVolumeId: 'vol-003',
    createdAt: 'Sep 8, 2025 11:51:27',
    status: 'active',
  },
  {
    id: 'vsnap-004',
    name: 'log-storage-snap',
    size: '100GiB',
    sourceVolume: 'vol-4',
    sourceVolumeId: 'vol-004',
    createdAt: 'Sep 5, 2025 14:12:36',
    status: 'creating',
  },
  {
    id: 'vsnap-005',
    name: 'cache-vol-snap',
    size: '256GiB',
    sourceVolume: 'vol-5',
    sourceVolumeId: 'vol-005',
    createdAt: 'Aug 30, 2025 21:37:41',
    status: 'active',
  },
  {
    id: 'vsnap-006',
    name: 'media-storage-snap',
    size: '5000GiB',
    sourceVolume: 'vol-6',
    sourceVolumeId: 'vol-006',
    createdAt: 'Aug 25, 2025 10:32:16',
    status: 'active',
  },
  {
    id: 'vsnap-007',
    name: 'temp-vol-snap',
    size: '50GiB',
    sourceVolume: 'vol-7',
    sourceVolumeId: 'vol-007',
    createdAt: 'Aug 20, 2025 23:27:51',
    status: 'error',
  },
  {
    id: 'vsnap-008',
    name: 'ml-data-snap',
    size: '1000GiB',
    sourceVolume: 'vol-8',
    sourceVolumeId: 'vol-008',
    createdAt: 'Aug 15, 2025 12:22:26',
    status: 'active',
  },
  {
    id: 'vsnap-009',
    name: 'archive-vol-snap',
    size: '10000GiB',
    sourceVolume: 'vol-9',
    sourceVolumeId: 'vol-009',
    createdAt: 'Aug 10, 2025 01:17:01',
    status: 'active',
  },
  {
    id: 'vsnap-010',
    name: 'boot-vol-snap',
    size: '100GiB',
    sourceVolume: 'vol-10',
    sourceVolumeId: 'vol-010',
    createdAt: 'Aug 5, 2025 14:12:36',
    status: 'deleting',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const volumeSnapshotStatusMap: Record<SnapshotStatus, 'active' | 'building' | 'error' | 'pending'> =
  {
    active: 'active',
    creating: 'building',
    error: 'error',
    deleting: 'pending',
  };

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'sourceVolume', label: 'Source volume', type: 'text' },
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

export function VolumeSnapshotsPage() {
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>([]);
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [snapshots, setSnapshots] = useState(mockVolumeSnapshots);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [snapshotToDelete, setSnapshotToDelete] = useState<VolumeSnapshot | null>(null);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [createVolumeOpen, setCreateVolumeOpen] = useState(false);
  const [editSnapshotOpen, setEditSnapshotOpen] = useState(false);
  const [selectedSnapshotForDrawer, setSelectedSnapshotForDrawer] = useState<VolumeSnapshot | null>(
    null
  );

  // Helper to parse size string to number
  const parseSizeToNumber = (size: string): number => {
    const match = size.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Drawer handlers
  const handleCreateVolume = (snapshot: VolumeSnapshot) => {
    setSelectedSnapshotForDrawer(snapshot);
    setCreateVolumeOpen(true);
  };

  const handleEditSnapshot = (snapshot: VolumeSnapshot) => {
    setSelectedSnapshotForDrawer(snapshot);
    setEditSnapshotOpen(true);
  };

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'sourceVolume', label: 'Source volume', visible: true },
    { id: 'createdAt', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle delete snapshot
  const handleDeleteClick = (snapshot: VolumeSnapshot) => {
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

  // Filter snapshots by search
  const filteredSnapshots = useMemo(() => {
    if (appliedFilters.length === 0) return snapshots;

    return snapshots.filter((snapshot) => {
      return appliedFilters.every((filter) => {
        const value = snapshot[filter.fieldId as keyof VolumeSnapshot];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });
  }, [snapshots, appliedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredSnapshots.length / rowsPerPage);
  const paginatedSnapshots = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredSnapshots.slice(start, end);
  }, [filteredSnapshots, currentPage, rowsPerPage]);

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<VolumeSnapshot>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator layout="icon-only" status={volumeSnapshotStatusMap[row.status]} />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/volume-snapshots/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">{row.id}</span>
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
      key: 'sourceVolume',
      label: 'Source volume',
      flex: 1,
      minWidth: columnMinWidths.sourceVolume,
      sortable: false,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/volumes/${row.sourceVolumeId}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.sourceVolume}
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            ID : {row.sourceVolumeId}
          </span>
        </div>
      ),
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
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'create-volume',
            label: 'Create volume',
            onClick: () => handleCreateVolume(row),
          },
          {
            id: 'manage-metadata',
            label: 'Manage metadata',
            onClick: () => console.log('Manage metadata:', row.id),
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
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
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
      .filter((col): col is TableColumn<VolumeSnapshot> => col !== undefined);
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Proj-1', href: '/project' }, { label: 'Volume snapshots' }]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader title="Volume snapshots" />

        {/* List Toolbar */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                filters={filterFields}
                appliedFilters={appliedFilters}
                onFiltersChange={setAppliedFilters}
                placeholder="Search snapshot by attributes"
                size="sm"
                className="w-[var(--search-input-width)]"
                hideAppliedFilters
              />
              <Button
                variant="secondary"
                size="sm"
                iconOnly
                icon={<IconDownload size={12} />}
                aria-label="Download"
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
          totalItems={filteredSnapshots.length}
          selectedCount={selectedSnapshots.length}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => setIsPreferencesOpen(true)}
        />

        {/* Table */}
        <Table
          columns={visibleColumns}
          data={paginatedSnapshots}
          rowKey="id"
          selectable
          selectedKeys={selectedSnapshots}
          onSelectionChange={setSelectedSnapshots}
        />
      </VStack>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete volume snapshot"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
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

      {/* Volume Snapshot Drawers */}
      <CreateVolumeFromVolumeSnapshotDrawer
        isOpen={createVolumeOpen}
        onClose={() => setCreateVolumeOpen(false)}
        volumeSnapshot={
          selectedSnapshotForDrawer
            ? {
                id: selectedSnapshotForDrawer.id,
                name: selectedSnapshotForDrawer.name,
                size: parseSizeToNumber(selectedSnapshotForDrawer.size),
              }
            : null
        }
      />

      <EditVolumeSnapshotDrawer
        isOpen={editSnapshotOpen}
        onClose={() => setEditSnapshotOpen(false)}
        volumeSnapshot={
          selectedSnapshotForDrawer
            ? {
                id: selectedSnapshotForDrawer.id,
                name: selectedSnapshotForDrawer.name,
              }
            : null
        }
      />
    </PageShell>
  );
}

export default VolumeSnapshotsPage;
