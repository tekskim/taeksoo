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
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { CreateVolumeSnapshotDrawer } from '@/components/CreateVolumeSnapshotDrawer';
import { CreateVolumeBackupDrawer } from '@/components/CreateVolumeBackupDrawer';
import { CloneVolumeDrawer } from '@/components/CloneVolumeDrawer';
import { RestoreFromSnapshotDrawer } from '@/components/RestoreFromSnapshotDrawer';
import { CreateImageFromVolumeDrawer } from '@/components/CreateImageFromVolumeDrawer';
import { EditVolumeDrawer } from '@/components/EditVolumeDrawer';
import { ExtendVolumeDrawer } from '@/components/ExtendVolumeDrawer';
import { ChangeVolumeTypeDrawer } from '@/components/ChangeVolumeTypeDrawer';
import { CreateTransferDrawer } from '@/components/CreateTransferDrawer';
import { AttachVolumeDrawer } from '@/components/AttachVolumeDrawer';
import { DetachVolumeDrawer } from '@/components/DetachVolumeDrawer';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
  IconTransfer,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type VolumeStatus = 'active' | 'in-use' | 'error' | 'pending';

interface Volume {
  id: string;
  name: string;
  size: string;
  type: string;
  diskTag: string;
  attachedTo: string | null;
  attachedToId: string | null;
  createdAt: string;
  status: VolumeStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumes: Volume[] = [
  {
    id: 'vol-001',
    name: 'db-data',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data disk',
    attachedTo: 'web-server-1',
    attachedToId: 'inst-001',
    createdAt: 'Sep 12, 2025',
    status: 'in-use',
  },
  {
    id: 'vol-002',
    name: 'app-storage',
    size: '500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data disk',
    attachedTo: 'app-server-1',
    attachedToId: 'inst-002',
    createdAt: 'Sep 10, 2025',
    status: 'in-use',
  },
  {
    id: 'vol-003',
    name: 'backup-vol',
    size: '2000GiB',
    type: 'SSD',
    diskTag: 'Backup',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Sep 8, 2025',
    status: 'active',
  },
  {
    id: 'vol-004',
    name: 'log-storage',
    size: '100GiB',
    type: '_DEFAULT_',
    diskTag: 'Logs',
    attachedTo: 'log-server',
    attachedToId: 'inst-003',
    createdAt: 'Sep 5, 2025',
    status: 'in-use',
  },
  {
    id: 'vol-005',
    name: 'cache-vol',
    size: '256GiB',
    type: 'NVMe',
    diskTag: 'Cache',
    attachedTo: 'cache-01',
    attachedToId: 'inst-004',
    createdAt: 'Aug 30, 2025',
    status: 'in-use',
  },
  {
    id: 'vol-006',
    name: 'media-storage',
    size: '5000GiB',
    type: 'HDD',
    diskTag: 'Media',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Aug 25, 2025',
    status: 'active',
  },
  {
    id: 'vol-007',
    name: 'temp-vol',
    size: '50GiB',
    type: '_DEFAULT_',
    diskTag: 'Temporary',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Aug 20, 2025',
    status: 'pending',
  },
  {
    id: 'vol-008',
    name: 'ml-data',
    size: '1000GiB',
    type: 'NVMe',
    diskTag: 'ML Dataset',
    attachedTo: 'gpu-server-1',
    attachedToId: 'inst-005',
    createdAt: 'Aug 15, 2025',
    status: 'in-use',
  },
  {
    id: 'vol-009',
    name: 'archive-vol',
    size: '10000GiB',
    type: 'HDD',
    diskTag: 'Archive',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Aug 10, 2025',
    status: 'active',
  },
  {
    id: 'vol-010',
    name: 'boot-vol-01',
    size: '100GiB',
    type: 'SSD',
    diskTag: 'Boot',
    attachedTo: 'web-server-2',
    attachedToId: 'inst-006',
    createdAt: 'Aug 5, 2025',
    status: 'in-use',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const volumeStatusMap: Record<VolumeStatus, 'active' | 'in-use' | 'error' | 'pending'> = {
  active: 'active',
  'in-use': 'in-use',
  error: 'error',
  pending: 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: '_DEFAULT_', label: '_DEFAULT_' },
      { value: 'SSD', label: 'SSD' },
      { value: 'NVMe', label: 'NVMe' },
      { value: 'HDD', label: 'HDD' },
    ],
  },
  { key: 'diskTag', label: 'Disk tag', type: 'text' },
  { key: 'attachedTo', label: 'Attached to', type: 'text' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'in-use', label: 'In use' },
      { value: 'error', label: 'Error' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

export function VolumesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [volumes, setVolumes] = useState(mockVolumes);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [volumeToDelete, setVolumeToDelete] = useState<Volume | null>(null);

  // Selection state
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [createSnapshotOpen, setCreateSnapshotOpen] = useState(false);
  const [createBackupOpen, setCreateBackupOpen] = useState(false);
  const [cloneVolumeOpen, setCloneVolumeOpen] = useState(false);
  const [restoreSnapshotOpen, setRestoreSnapshotOpen] = useState(false);
  const [createImageOpen, setCreateImageOpen] = useState(false);
  const [editVolumeOpen, setEditVolumeOpen] = useState(false);
  const [extendVolumeOpen, setExtendVolumeOpen] = useState(false);
  const [changeTypeOpen, setChangeTypeOpen] = useState(false);
  const [createTransferOpen, setCreateTransferOpen] = useState(false);
  const [attachInstanceOpen, setAttachInstanceOpen] = useState(false);
  const [detachInstanceOpen, setDetachInstanceOpen] = useState(false);
  const [selectedVolumeForDrawer, setSelectedVolumeForDrawer] = useState<Volume | null>(null);

  // Helper to parse size string to number (e.g., '1500GiB' -> 1500)
  const parseSizeToNumber = (size: string): number => {
    const match = size.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Drawer handlers
  const handleCreateSnapshot = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setCreateSnapshotOpen(true);
  };

  const handleCreateBackup = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setCreateBackupOpen(true);
  };

  const handleCloneVolume = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setCloneVolumeOpen(true);
  };

  const handleRestoreSnapshot = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setRestoreSnapshotOpen(true);
  };

  const handleCreateImage = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setCreateImageOpen(true);
  };

  const handleEditVolume = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setEditVolumeOpen(true);
  };

  const handleExtendVolume = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setExtendVolumeOpen(true);
  };

  const handleChangeType = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setChangeTypeOpen(true);
  };

  const handleCreateTransfer = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setCreateTransferOpen(true);
  };

  const handleAttachInstance = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setAttachInstanceOpen(true);
  };

  const handleDetachInstance = (volume: Volume) => {
    setSelectedVolumeForDrawer(volume);
    setDetachInstanceOpen(true);
  };

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'size', label: 'Size', visible: true },
    { id: 'type', label: 'Type', visible: true },
    { id: 'diskTag', label: 'Disk tag', visible: true },
    { id: 'attachedTo', label: 'Attached to', visible: true },
    { id: 'createdAt', label: 'Created at', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, openInNewTab, addNewTab, moveTab } = useTabs();

  // Handle opening instance in new tab
  const handleOpenInNewTab = (instanceId: string, instanceName: string) => {
    openInNewTab(instanceId, instanceName, `/instances/${instanceId}`);
  };

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle delete volume
  const handleDeleteClick = (volume: Volume) => {
    setVolumeToDelete(volume);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (volumeToDelete) {
      setVolumes((prev) => prev.filter((v) => v.id !== volumeToDelete.id));
      setDeleteModalOpen(false);
      setVolumeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setVolumeToDelete(null);
  };

  // Filter volumes by applied filters
  const filteredVolumes = useMemo(() => {
    if (appliedFilters.length === 0) return volumes;

    return volumes.filter((v) => {
      return appliedFilters.every((filter) => {
        const value = String(v[filter.field as keyof Volume] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [volumes, appliedFilters]);

  const totalPages = Math.ceil(filteredVolumes.length / rowsPerPage);

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Volume>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={volumeStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <Link
          to={`/compute/volumes/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
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
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
    },
    {
      key: 'diskTag',
      label: 'Disk tag',
      flex: 1,
      minWidth: columnMinWidths.diskTag,
    },
    {
      key: 'attachedTo',
      label: 'Attached to',
      flex: 1,
      minWidth: columnMinWidths.attachedTo,
      sortable: true,
      render: (_, row) =>
        row.attachedTo && row.attachedToId ? (
          <div className="flex flex-col gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenInNewTab(row.attachedToId!, row.attachedTo!);
              }}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            >
              {row.attachedTo}
              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
            </button>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              ID : {row.attachedToId}
            </span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'data-protection',
            label: 'Data protection',
            submenu: [
              {
                id: 'create-snapshot',
                label: 'Create volume snapshot',
                onClick: () => handleCreateSnapshot(row),
              },
              {
                id: 'create-backup',
                label: 'Create volume backup',
                onClick: () => handleCreateBackup(row),
              },
              { id: 'clone-volume', label: 'Clone volume', onClick: () => handleCloneVolume(row) },
              {
                id: 'restore-snapshot',
                label: 'Restore from Snapshot',
                onClick: () => handleRestoreSnapshot(row),
              },
            ],
          },
          {
            id: 'operate',
            label: 'Operate',
            submenu: [
              {
                id: 'create-instance',
                label: 'Create instance',
                onClick: () => console.log('Create instance:', row.id),
              },
              { id: 'create-image', label: 'Create image', onClick: () => handleCreateImage(row) },
              {
                id: 'attach-instance',
                label: 'Attach instance',
                onClick: () => handleAttachInstance(row),
              },
              {
                id: 'detach-instance',
                label: 'Detach instance',
                onClick: () => handleDetachInstance(row),
                disabled: !row.attachedTo,
              },
              {
                id: 'boot-setting',
                label: 'Boot setting',
                onClick: () => console.log('Boot setting:', row.id),
              },
            ],
          },
          {
            id: 'configuration',
            label: 'Configuration',
            submenu: [
              { id: 'edit', label: 'Edit', onClick: () => handleEditVolume(row) },
              {
                id: 'extend-volume',
                label: 'Extend volume',
                onClick: () => handleExtendVolume(row),
              },
              {
                id: 'change-volume-type',
                label: 'Change volume Type',
                onClick: () => handleChangeType(row),
              },
            ],
          },
          {
            id: 'create-transfer',
            label: 'Create transfer',
            onClick: () => handleCreateTransfer(row),
          },
          {
            id: 'cancel-transfer',
            label: 'Cancel transfer',
            onClick: () => console.log('Cancel transfer:', row.id),
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
      .filter((col): col is TableColumn<Volume> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

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
              <Breadcrumb items={[{ label: 'Proj-1', href: '/project' }, { label: 'Volumes' }]} />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">Volumes</h1>
                <Button size="md" as={Link} to="/compute/volumes/create">
                  Create volume
                </Button>
              </div>

              {/* List Toolbar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={filterFields}
                      appliedFilters={appliedFilters}
                      onFiltersChange={setAppliedFilters}
                      placeholder="Search volume by attributes"
                      className="w-[var(--search-input-width)]"
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
                    <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled>
                      Delete
                    </Button>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconTransfer size={12} />}
                      disabled
                    >
                      Accept Volume Transfer
                    </Button>
                  </ListToolbar.Actions>
                }
              />

              {/* Pagination */}
              {filteredVolumes.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  onSettingsClick={() => setIsPreferencesOpen(true)}
                  totalItems={filteredVolumes.length}
                  selectedCount={selectedVolumes.length}
                />
              )}

              {/* Volumes Table */}
              <Table<Volume>
                columns={visibleColumns}
                data={filteredVolumes.slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                )}
                rowKey="id"
                emptyMessage="No volumes found"
                selectable
                selectedKeys={selectedVolumes}
                onSelectionChange={setSelectedVolumes}
              />
            </VStack>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete volume"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Volume name"
        infoValue={volumeToDelete?.name}
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

      {/* Volume Drawers */}
      <CreateVolumeSnapshotDrawer
        isOpen={createSnapshotOpen}
        onClose={() => setCreateSnapshotOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
                size: parseSizeToNumber(selectedVolumeForDrawer.size),
              }
            : null
        }
      />

      <CreateVolumeBackupDrawer
        isOpen={createBackupOpen}
        onClose={() => setCreateBackupOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
                size: parseSizeToNumber(selectedVolumeForDrawer.size),
              }
            : null
        }
      />

      <CloneVolumeDrawer
        isOpen={cloneVolumeOpen}
        onClose={() => setCloneVolumeOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
                size: parseSizeToNumber(selectedVolumeForDrawer.size),
              }
            : null
        }
      />

      <RestoreFromSnapshotDrawer
        isOpen={restoreSnapshotOpen}
        onClose={() => setRestoreSnapshotOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
              }
            : { id: '', name: '' }
        }
      />

      <CreateImageFromVolumeDrawer
        isOpen={createImageOpen}
        onClose={() => setCreateImageOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
                size: parseSizeToNumber(selectedVolumeForDrawer.size),
              }
            : null
        }
      />

      <EditVolumeDrawer
        isOpen={editVolumeOpen}
        onClose={() => setEditVolumeOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
              }
            : null
        }
      />

      <ExtendVolumeDrawer
        isOpen={extendVolumeOpen}
        onClose={() => setExtendVolumeOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
                size: parseSizeToNumber(selectedVolumeForDrawer.size),
              }
            : null
        }
      />

      <ChangeVolumeTypeDrawer
        isOpen={changeTypeOpen}
        onClose={() => setChangeTypeOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
                currentType: selectedVolumeForDrawer.type,
              }
            : null
        }
      />

      <CreateTransferDrawer
        isOpen={createTransferOpen}
        onClose={() => setCreateTransferOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
                size: parseSizeToNumber(selectedVolumeForDrawer.size),
              }
            : null
        }
      />

      <AttachVolumeDrawer
        isOpen={attachInstanceOpen}
        onClose={() => setAttachInstanceOpen(false)}
        volume={
          selectedVolumeForDrawer
            ? {
                id: selectedVolumeForDrawer.id,
                name: selectedVolumeForDrawer.name,
              }
            : { id: '', name: '' }
        }
      />

      <DetachVolumeDrawer
        isOpen={detachInstanceOpen}
        onClose={() => setDetachInstanceOpen(false)}
        instance={
          selectedVolumeForDrawer?.attachedTo && selectedVolumeForDrawer?.attachedToId
            ? {
                id: selectedVolumeForDrawer.attachedToId,
                name: selectedVolumeForDrawer.attachedTo,
              }
            : { id: '', name: '' }
        }
      />
    </div>
  );
}

export default VolumesPage;
