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
  ConfirmModal,
  type TableColumn,
  type FilterField,
  type AppliedFilter,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PolicyType = 'Anti-affinity' | 'Affinity' | 'Soft-anti-affinity' | 'Soft-affinity';

interface ServerGroup {
  id: string;
  name: string;
  tenantId: string;
  tenantName: string;
  policy: PolicyType;
  instances: { id: string; name: string }[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockServerGroups: ServerGroup[] = [
  {
    id: 'sg-001',
    name: 'server-1',
    tenantId: 'tenant-001',
    tenantName: 'project-alpha',
    policy: 'Anti-affinity',
    instances: [{ id: 'inst-001', name: 'tk-instance' }],
  },
  {
    id: 'sg-002',
    name: 'web-servers',
    tenantId: 'tenant-002',
    tenantName: 'project-beta',
    policy: 'Anti-affinity',
    instances: [
      { id: 'inst-002', name: 'web-01' },
      { id: 'inst-003', name: 'web-02' },
      { id: 'inst-004', name: 'web-03' },
    ],
  },
  {
    id: 'sg-003',
    name: 'db-cluster',
    tenantId: 'tenant-001',
    tenantName: 'project-alpha',
    policy: 'Affinity',
    instances: [
      { id: 'inst-005', name: 'db-primary' },
      { id: 'inst-006', name: 'db-replica' },
    ],
  },
  {
    id: 'sg-004',
    name: 'cache-group',
    tenantId: 'tenant-003',
    tenantName: 'project-gamma',
    policy: 'Soft-anti-affinity',
    instances: [
      { id: 'inst-007', name: 'redis-01' },
      { id: 'inst-008', name: 'redis-02' },
    ],
  },
  {
    id: 'sg-005',
    name: 'app-servers',
    tenantId: 'tenant-002',
    tenantName: 'project-beta',
    policy: 'Anti-affinity',
    instances: [
      { id: 'inst-009', name: 'app-01' },
      { id: 'inst-010', name: 'app-02' },
      { id: 'inst-011', name: 'app-03' },
      { id: 'inst-012', name: 'app-04' },
    ],
  },
  {
    id: 'sg-006',
    name: 'monitoring',
    tenantId: 'tenant-001',
    tenantName: 'project-alpha',
    policy: 'Soft-affinity',
    instances: [
      { id: 'inst-013', name: 'prometheus' },
      { id: 'inst-014', name: 'grafana' },
    ],
  },
  {
    id: 'sg-007',
    name: 'k8s-workers',
    tenantId: 'tenant-004',
    tenantName: 'project-k8s',
    policy: 'Anti-affinity',
    instances: [
      { id: 'inst-015', name: 'worker-01' },
      { id: 'inst-016', name: 'worker-02' },
      { id: 'inst-017', name: 'worker-03' },
    ],
  },
  {
    id: 'sg-008',
    name: 'k8s-masters',
    tenantId: 'tenant-004',
    tenantName: 'project-k8s',
    policy: 'Anti-affinity',
    instances: [
      { id: 'inst-018', name: 'master-01' },
      { id: 'inst-019', name: 'master-02' },
      { id: 'inst-020', name: 'master-03' },
    ],
  },
  {
    id: 'sg-009',
    name: 'storage-nodes',
    tenantId: 'tenant-003',
    tenantName: 'project-gamma',
    policy: 'Affinity',
    instances: [
      { id: 'inst-021', name: 'storage-01' },
      { id: 'inst-022', name: 'storage-02' },
    ],
  },
  {
    id: 'sg-010',
    name: 'load-balancers',
    tenantId: 'tenant-002',
    tenantName: 'project-beta',
    policy: 'Anti-affinity',
    instances: [
      { id: 'inst-023', name: 'lb-01' },
      { id: 'inst-024', name: 'lb-02' },
    ],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'tenantName', label: 'Tenant', type: 'text' },
  {
    key: 'policy',
    label: 'Policy',
    type: 'select',
    options: [
      { value: 'Anti-affinity', label: 'Anti-affinity' },
      { value: 'Affinity', label: 'Affinity' },
      { value: 'Soft-anti-affinity', label: 'Soft-anti-affinity' },
      { value: 'Soft-affinity', label: 'Soft-affinity' },
    ],
  },
];

export function ComputeAdminServerGroupsPage() {
  const [selectedServerGroups, setSelectedServerGroups] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [serverGroups, setServerGroups] = useState(mockServerGroups);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serverGroupToDelete, setServerGroupToDelete] = useState<ServerGroup | null>(null);

  // View Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Default column config
  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'tenantName', label: 'Tenant', visible: true },
    { id: 'instances', label: 'Instances', visible: true },
    { id: 'policy', label: 'Policy', visible: true },
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

  // Handle delete server group
  const handleDeleteClick = (serverGroup: ServerGroup) => {
    setServerGroupToDelete(serverGroup);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serverGroupToDelete) {
      setServerGroups((prev) => prev.filter((sg) => sg.id !== serverGroupToDelete.id));
      setDeleteModalOpen(false);
      setServerGroupToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setServerGroupToDelete(null);
  };

  // Filter server groups by search
  const filteredServerGroups = useMemo(() => {
    if (appliedFilters.length === 0) return serverGroups;

    return serverGroups.filter((sg) => {
      return appliedFilters.every((filter) => {
        const value = String(sg[filter.field as keyof ServerGroup] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [serverGroups, appliedFilters]);

  const totalPages = Math.ceil(filteredServerGroups.length / rowsPerPage);

  // Paginated data
  const paginatedServerGroups = useMemo(() => {
    return filteredServerGroups.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredServerGroups, currentPage, rowsPerPage]);

  // Selection handlers
  const toggleSelection = (id: string) => {
    setSelectedServerGroups((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedServerGroups.length === paginatedServerGroups.length) {
      setSelectedServerGroups([]);
    } else {
      setSelectedServerGroups(paginatedServerGroups.map((sg) => sg.id));
    }
  };

  const handleBulkDelete = () => {
    setServerGroups((prev) => prev.filter((sg) => !selectedServerGroups.includes(sg.id)));
    setSelectedServerGroups([]);
  };

  // Table columns
  const columns: TableColumn<ServerGroup>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/server-groups/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'tenantName',
      label: 'Tenant',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/tenants/${row.tenantId}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.tenantName}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.tenantId}</span>
        </div>
      ),
    },
    {
      key: 'instances',
      label: 'Instances',
      flex: 1,
      sortable: true,
      render: (_, row) => {
        const instanceCount = row.instances.length;
        const firstInstance = row.instances[0];
        const additionalCount = instanceCount - 1;

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-body-md text-[var(--color-text-default)]">
              {firstInstance?.name || '-'}
              {additionalCount > 0 && ` (+${additionalCount})`}
            </span>
            {firstInstance && (
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                ID: {firstInstance.id}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'policy',
      label: 'Policy',
      flex: 1,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            onClick={() => handleDeleteClick(row)}
          >
            <IconTrash size={16} stroke={1.5} className="text-[var(--color-state-danger)]" />
          </button>
        </div>
      ),
    },
  ];

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig.filter((col) => col.visible).map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<ServerGroup> => col !== undefined);
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
                  { label: 'Server Groups' },
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
          {/* Page Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Server Groups
                </h1>
              </div>

              {/* List Toolbar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={filterFields}
                      appliedFilters={appliedFilters}
                      onFiltersChange={setAppliedFilters}
                      placeholder="Search server group by attributes"
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
                bulkActions={
                  <ListToolbar.Actions>
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconTrash size={12} />}
                      disabled={selectedServerGroups.length === 0}
                      onClick={handleBulkDelete}
                    >
                      Delete
                    </Button>
                  </ListToolbar.Actions>
                }
              />

              {/* Pagination */}
              {filteredServerGroups.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  onSettingsClick={() => setIsPreferencesOpen(true)}
                  totalItems={filteredServerGroups.length}
                  selectedCount={selectedServerGroups.length}
                />
              )}

              {/* Server groups Table */}
              <Table<ServerGroup>
                columns={visibleColumns}
                data={paginatedServerGroups}
                rowKey="id"
                emptyMessage="No server groups found"
                selectable
                selectedKeys={selectedServerGroups}
                onSelectionChange={setSelectedServerGroups}
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
        title="Delete Server Group"
        description="Removing the selected instances is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Server group name"
        infoValue={serverGroupToDelete?.name}
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
    </div>
  );
}

export default ComputeAdminServerGroupsPage;
