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
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { CreateVolumeFromBackupDrawer } from '@/components/CreateVolumeFromBackupDrawer';
import { EditVolumeBackupDrawer } from '@/components/EditVolumeBackupDrawer';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type BackupStatus = 'active' | 'creating' | 'error' | 'restoring' | 'deleting';
type BackupMode = 'Full Backup' | 'Incremental';

interface VolumeBackup {
  id: string;
  name: string;
  size: string;
  sourceVolume: string;
  sourceVolumeId: string;
  backupMode: BackupMode;
  createdAt: string;
  status: BackupStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumeBackups: VolumeBackup[] = [
  {
    id: 'vbak-001',
    name: 'db-data-backup',
    size: '1500GiB',
    sourceVolume: 'vol-1',
    sourceVolumeId: 'vol-001',
    backupMode: 'Full Backup',
    createdAt: '2025-09-12',
    status: 'active',
  },
  {
    id: 'vbak-002',
    name: 'app-storage-backup',
    size: '500GiB',
    sourceVolume: 'vol-2',
    sourceVolumeId: 'vol-002',
    backupMode: 'Incremental',
    createdAt: '2025-09-10',
    status: 'active',
  },
  {
    id: 'vbak-003',
    name: 'backup-vol-backup',
    size: '2000GiB',
    sourceVolume: 'vol-3',
    sourceVolumeId: 'vol-003',
    backupMode: 'Full Backup',
    createdAt: '2025-09-08',
    status: 'active',
  },
  {
    id: 'vbak-004',
    name: 'log-storage-backup',
    size: '100GiB',
    sourceVolume: 'vol-4',
    sourceVolumeId: 'vol-004',
    backupMode: 'Incremental',
    createdAt: '2025-09-05',
    status: 'creating',
  },
  {
    id: 'vbak-005',
    name: 'cache-vol-backup',
    size: '256GiB',
    sourceVolume: 'vol-5',
    sourceVolumeId: 'vol-005',
    backupMode: 'Full Backup',
    createdAt: '2025-08-30',
    status: 'active',
  },
  {
    id: 'vbak-006',
    name: 'media-storage-backup',
    size: '5000GiB',
    sourceVolume: 'vol-6',
    sourceVolumeId: 'vol-006',
    backupMode: 'Full Backup',
    createdAt: '2025-08-25',
    status: 'restoring',
  },
  {
    id: 'vbak-007',
    name: 'temp-vol-backup',
    size: '50GiB',
    sourceVolume: 'vol-7',
    sourceVolumeId: 'vol-007',
    backupMode: 'Incremental',
    createdAt: '2025-08-20',
    status: 'error',
  },
  {
    id: 'vbak-008',
    name: 'ml-data-backup',
    size: '1000GiB',
    sourceVolume: 'vol-8',
    sourceVolumeId: 'vol-008',
    backupMode: 'Full Backup',
    createdAt: '2025-08-15',
    status: 'active',
  },
  {
    id: 'vbak-009',
    name: 'archive-vol-backup',
    size: '10000GiB',
    sourceVolume: 'vol-9',
    sourceVolumeId: 'vol-009',
    backupMode: 'Full Backup',
    createdAt: '2025-08-10',
    status: 'active',
  },
  {
    id: 'vbak-010',
    name: 'boot-vol-backup',
    size: '100GiB',
    sourceVolume: 'vol-10',
    sourceVolumeId: 'vol-010',
    backupMode: 'Incremental',
    createdAt: '2025-08-05',
    status: 'deleting',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const volumeBackupStatusMap: Record<BackupStatus, 'active' | 'building' | 'error' | 'pending'> = {
  active: 'active',
  creating: 'building',
  restoring: 'building',
  error: 'error',
  deleting: 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'sourceVolume', label: 'Source Volume', type: 'text' },
  {
    id: 'backupMode',
    label: 'Backup Mode',
    type: 'select',
    options: [
      { value: 'Full Backup', label: 'Full Backup' },
      { value: 'Incremental', label: 'Incremental' },
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
      { value: 'restoring', label: 'Restoring' },
      { value: 'deleting', label: 'Deleting' },
    ],
  },
];

export function ComputeAdminVolumeBackupsPage() {
  const [selectedBackups, setSelectedBackups] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [backups, setBackups] = useState(mockVolumeBackups);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<VolumeBackup | null>(null);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [createVolumeOpen, setCreateVolumeOpen] = useState(false);
  const [editBackupOpen, setEditBackupOpen] = useState(false);
  const [selectedBackupForDrawer, setSelectedBackupForDrawer] = useState<VolumeBackup | null>(null);

  // Helper to parse size string to number
  const parseSizeToNumber = (size: string): number => {
    const match = size.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Drawer handlers
  const handleCreateVolume = (backup: VolumeBackup) => {
    setSelectedBackupForDrawer(backup);
    setCreateVolumeOpen(true);
  };

  const handleEditBackup = (backup: VolumeBackup) => {
    setSelectedBackupForDrawer(backup);
    setEditBackupOpen(true);
  };

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'sourceVolume', label: 'Source volume', visible: true },
    { id: 'backupMode', label: 'Backup mode', visible: true },
    { id: 'createdAt', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle delete backup
  const handleDeleteClick = (backup: VolumeBackup) => {
    setBackupToDelete(backup);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (backupToDelete) {
      setBackups((prev) => prev.filter((b) => b.id !== backupToDelete.id));
      setDeleteModalOpen(false);
      setBackupToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setBackupToDelete(null);
  };

  // Filter backups by search
  const filteredBackups = useMemo(() => {
    if (appliedFilters.length === 0) return backups;

    return backups.filter((backup) => {
      return appliedFilters.every((filter) => {
        const value = backup[filter.fieldId as keyof VolumeBackup];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      });
    });
  }, [backups, appliedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredBackups.length / rowsPerPage);
  const paginatedBackups = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredBackups.slice(start, end);
  }, [filteredBackups, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<VolumeBackup>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '64px',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator status={volumeBackupStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value: string, row) => (
        <Link
          to={`/compute-admin/volume-backups/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'sourceVolume',
      label: 'Source volume',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/volumes/${row.sourceVolumeId}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.sourceVolume}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.sourceVolumeId}
          </span>
        </div>
      ),
    },
    {
      key: 'backupMode',
      label: 'Backup mode',
      flex: 1,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '64px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'create-volume',
            label: 'Create volume',
            onClick: () => handleCreateVolume(row),
          },
          {
            id: 'restore',
            label: 'Restore backup',
            onClick: () => console.log('Restore', row.name),
          },
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => handleEditBackup(row),
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
            <ContextMenu items={menuItems} trigger="click">
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
      .filter((col): col is TableColumn<VolumeBackup> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
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

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Compute Admin', href: '/compute-admin' },
                  { label: 'Volume backups' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Volume backups
                </h1>
                <Button>Create Backup</Button>
              </div>

              {/* List Toolbar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={filterFields}
                      appliedFilters={appliedFilters}
                      onFiltersChange={setAppliedFilters}
                      placeholder="Search backup by attributes"
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
                      disabled={selectedBackups.length === 0}
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
                totalItems={filteredBackups.length}
                selectedCount={selectedBackups.length}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
              />

              {/* Table */}
              <Table
                columns={visibleColumns}
                data={paginatedBackups}
                rowKey="id"
                selectable
                selectedKeys={selectedBackups}
                onSelectionChange={setSelectedBackups}
              />
            </VStack>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete Volume backup"
        description={`Are you sure you want to delete "${backupToDelete?.name}"? This action cannot be undone.`}
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

      {/* Volume Backup Drawers */}
      <CreateVolumeFromBackupDrawer
        isOpen={createVolumeOpen}
        onClose={() => setCreateVolumeOpen(false)}
        volumeBackup={
          selectedBackupForDrawer
            ? {
                id: selectedBackupForDrawer.id,
                name: selectedBackupForDrawer.name,
                size: parseSizeToNumber(selectedBackupForDrawer.size),
              }
            : null
        }
      />

      <EditVolumeBackupDrawer
        isOpen={editBackupOpen}
        onClose={() => setEditBackupOpen(false)}
        volumeBackup={
          selectedBackupForDrawer
            ? {
                id: selectedBackupForDrawer.id,
                name: selectedBackupForDrawer.name,
              }
            : null
        }
      />
    </div>
  );
}

export default ComputeAdminVolumeBackupsPage;
