import { useState, useMemo } from 'react';
import {
  Button,
  SearchInput,
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
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPlus,
  IconDotsVertical,
  IconTrash,
  IconDownload,
  IconBell,
  IconExternalLink,
} from '@tabler/icons-react';

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
  { id: 'vbak-001', name: 'db-data-backup', size: '1500GiB', sourceVolume: 'vol-1', sourceVolumeId: 'vol-001', backupMode: 'Full Backup', createdAt: '2025-09-12', status: 'active' },
  { id: 'vbak-002', name: 'app-storage-backup', size: '500GiB', sourceVolume: 'vol-2', sourceVolumeId: 'vol-002', backupMode: 'Incremental', createdAt: '2025-09-10', status: 'active' },
  { id: 'vbak-003', name: 'backup-vol-backup', size: '2000GiB', sourceVolume: 'vol-3', sourceVolumeId: 'vol-003', backupMode: 'Full Backup', createdAt: '2025-09-08', status: 'active' },
  { id: 'vbak-004', name: 'log-storage-backup', size: '100GiB', sourceVolume: 'vol-4', sourceVolumeId: 'vol-004', backupMode: 'Incremental', createdAt: '2025-09-05', status: 'creating' },
  { id: 'vbak-005', name: 'cache-vol-backup', size: '256GiB', sourceVolume: 'vol-5', sourceVolumeId: 'vol-005', backupMode: 'Full Backup', createdAt: '2025-08-30', status: 'active' },
  { id: 'vbak-006', name: 'media-storage-backup', size: '5000GiB', sourceVolume: 'vol-6', sourceVolumeId: 'vol-006', backupMode: 'Full Backup', createdAt: '2025-08-25', status: 'restoring' },
  { id: 'vbak-007', name: 'temp-vol-backup', size: '50GiB', sourceVolume: 'vol-7', sourceVolumeId: 'vol-007', backupMode: 'Incremental', createdAt: '2025-08-20', status: 'error' },
  { id: 'vbak-008', name: 'ml-data-backup', size: '1000GiB', sourceVolume: 'vol-8', sourceVolumeId: 'vol-008', backupMode: 'Full Backup', createdAt: '2025-08-15', status: 'active' },
  { id: 'vbak-009', name: 'archive-vol-backup', size: '10000GiB', sourceVolume: 'vol-9', sourceVolumeId: 'vol-009', backupMode: 'Full Backup', createdAt: '2025-08-10', status: 'active' },
  { id: 'vbak-010', name: 'boot-vol-backup', size: '100GiB', sourceVolume: 'vol-10', sourceVolumeId: 'vol-010', backupMode: 'Incremental', createdAt: '2025-08-05', status: 'deleting' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const volumeBackupStatusMap: Record<BackupStatus, 'active' | 'building' | 'error' | 'pending'> = {
  'active': 'active',
  'creating': 'building',
  'restoring': 'building',
  'error': 'error',
  'deleting': 'pending',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function VolumeBackupsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBackups, setSelectedBackups] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [backups, setBackups] = useState(mockVolumeBackups);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<VolumeBackup | null>(null);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const pageSize = 10;

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
    if (!searchQuery) return backups;
    
    return backups.filter(
      (backup) =>
        backup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        backup.sourceVolume.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [backups, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredBackups.length / pageSize);
  const paginatedBackups = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredBackups.slice(start, end);
  }, [filteredBackups, currentPage, pageSize]);

  // Table columns
  const columns: TableColumn<VolumeBackup>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
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
      render: (value: string) => (
        <span className="font-medium text-[var(--color-action-primary)]">{value}</span>
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
      label: 'Source Volume',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <a
          href={`/volumes/${row.sourceVolumeId}`}
          className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.sourceVolume}
          <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
        </a>
      ),
    },
    {
      key: 'backupMode',
      label: 'Backup Mode',
      flex: 1,
      sortable: false,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'restore',
            label: 'Restore to Volume',
            onClick: () => console.log('Restore', row.name),
          },
          {
            id: 'edit',
            label: 'Edit Metadata',
            onClick: () => console.log('Edit', row.name),
          },
          { id: 'divider', type: 'divider' },
          {
            id: 'delete',
            label: 'Delete',
            onClick: () => handleDeleteClick(row),
            status: 'danger',
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems}>
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
                <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-default)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main
        className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 ${
          sidebarOpen ? 'ml-[200px]' : 'ml-0'
        }`}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
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
                { label: 'Proj-1', href: '/project' },
                { label: 'Volume Backups' },
              ]}
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

        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Volume Backups
              </h1>
              <Button leftIcon={<IconPlus size={16} />}>
                Create Backup
              </Button>
            </div>

            {/* List Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find backup with filters"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
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
            />

            {/* Table */}
            <Table
              columns={columns}
              data={paginatedBackups}
              rowKey="id"
              selectable={true}
              selectedKeys={selectedBackups}
              onSelectionChange={setSelectedBackups}
            />
          </VStack>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete Volume Backup"
        message={`Are you sure you want to delete "${backupToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default VolumeBackupsPage;

