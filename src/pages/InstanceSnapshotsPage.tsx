import { useState, useMemo } from 'react';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  HStack,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  StatusIndicator,
  ListToolbar,
  ContextMenu,
  ConfirmModal,
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
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SnapshotStatus = 'active' | 'creating' | 'error' | 'deleting';
type AccessType = 'Private' | 'Project' | 'Public';

interface InstanceSnapshot {
  id: string;
  name: string;
  status: SnapshotStatus;
  os: string;
  size: string;
  access: AccessType;
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
    os: 'Ubuntu 24.04',
    size: '16GiB',
    access: 'Private',
    createdAt: '2025-09-12',
  },
  {
    id: 'snap-002',
    name: 'web-server-snapshot',
    status: 'active',
    os: 'Ubuntu 22.04 LTS',
    size: '32GiB',
    access: 'Project',
    createdAt: '2025-09-10',
  },
  {
    id: 'snap-003',
    name: 'db-backup-20250908',
    status: 'active',
    os: 'Rocky Linux 9',
    size: '64GiB',
    access: 'Private',
    createdAt: '2025-09-08',
  },
  {
    id: 'snap-004',
    name: 'ml-training-checkpoint',
    status: 'creating',
    os: 'Ubuntu 22.04 LTS',
    size: '128GiB',
    access: 'Private',
    createdAt: '2025-09-07',
  },
  {
    id: 'snap-005',
    name: 'k8s-node-image',
    status: 'active',
    os: 'Rocky Linux 9',
    size: '24GiB',
    access: 'Project',
    createdAt: '2025-09-05',
  },
  {
    id: 'snap-006',
    name: 'dev-environment-v2',
    status: 'active',
    os: 'Ubuntu 24.04',
    size: '48GiB',
    access: 'Private',
    createdAt: '2025-09-03',
  },
  {
    id: 'snap-007',
    name: 'monitoring-stack',
    status: 'active',
    os: 'Debian 12',
    size: '20GiB',
    access: 'Public',
    createdAt: '2025-09-01',
  },
  {
    id: 'snap-008',
    name: 'legacy-app-backup',
    status: 'error',
    os: 'CentOS 7',
    size: '80GiB',
    access: 'Private',
    createdAt: '2025-08-28',
  },
  {
    id: 'snap-009',
    name: 'test-environment',
    status: 'active',
    os: 'Ubuntu 22.04 LTS',
    size: '16GiB',
    access: 'Private',
    createdAt: '2025-08-25',
  },
  {
    id: 'snap-010',
    name: 'production-baseline',
    status: 'active',
    os: 'Rocky Linux 9',
    size: '40GiB',
    access: 'Project',
    createdAt: '2025-08-20',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function InstanceSnapshotsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [snapshots, setSnapshots] = useState(mockSnapshots);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [snapshotToDelete, setSnapshotToDelete] = useState<InstanceSnapshot | null>(null);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const pageSize = 10;

  // Filter snapshots by search
  const filteredSnapshots = useMemo(() => {
    if (!searchQuery) return snapshots;
    const query = searchQuery.toLowerCase();
    return snapshots.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.os.toLowerCase().includes(query)
    );
  }, [snapshots, searchQuery]);

  const totalPages = Math.ceil(filteredSnapshots.length / pageSize);

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

  // Status mapping
  const statusMap: Record<SnapshotStatus, 'active' | 'building' | 'error' | 'shutoff'> = {
    active: 'active',
    creating: 'building',
    error: 'error',
    deleting: 'shutoff',
  };

  // Table columns
  const columns: TableColumn<InstanceSnapshot>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      sortable: true,
      render: (_, row) => (
        <StatusIndicator status={statusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1.5,
      sortable: true,
      render: (_, row) => (
        <a
          href={`/instance-snapshots/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </a>
      ),
    },
    {
      key: 'os',
      label: 'OS',
      flex: 1,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      width: '100px',
      sortable: true,
    },
    {
      key: 'access',
      label: 'Access',
      width: '100px',
      sortable: false,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '120px',
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
            id: 'create-instance',
            label: 'Create Instance',
            onClick: () => console.log('Create instance from snapshot:', row.id),
          },
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => console.log('Edit snapshot:', row.id),
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
              <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
                <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-subtle)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
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

        {/* Top Bar with Breadcrumb Navigation */}
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
                { label: 'Instance Snapshots' },
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

        {/* Page Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex items-center justify-between h-8">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Instance Snapshots
              </h1>
              <Button leftIcon={<IconPlus size={16} />}>
                Create Snapshot
              </Button>
            </div>

            {/* Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find Snapshot with filters"
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
                    disabled={selectedSnapshots.length === 0}
                  >
                    Delete
                  </Button>
                </ListToolbar.Actions>
              }
            />

            {/* Pagination */}
            {filteredSnapshots.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showSettings
                totalItems={filteredSnapshots.length}
                selectedCount={selectedSnapshots.length}
              />
            )}

            {/* Table */}
            <Table<InstanceSnapshot>
              columns={columns}
              data={filteredSnapshots}
              rowKey="id"
              selectable
              selectedKeys={selectedSnapshots}
              onSelectionChange={setSelectedSnapshots}
              emptyMessage="No snapshots found"
            />
          </VStack>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Snapshot"
        description="Are you sure you want to delete this snapshot? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Snapshot name"
        infoValue={snapshotToDelete?.name}
      />
    </div>
  );
}

export default InstanceSnapshotsPage;

