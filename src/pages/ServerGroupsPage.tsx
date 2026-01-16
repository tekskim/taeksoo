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
  Checkbox,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PolicyType = 'Anti-affinity' | 'Affinity' | 'Soft-anti-affinity' | 'Soft-affinity';

interface ServerGroup {
  id: string;
  name: string;
  policy: PolicyType;
  instances: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockServerGroups: ServerGroup[] = [
  { id: 'sg-001', name: 'server-1', policy: 'Anti-affinity', instances: 'tk-instance' },
  { id: 'sg-002', name: 'web-servers', policy: 'Anti-affinity', instances: 'web-01, web-02, web-03' },
  { id: 'sg-003', name: 'db-cluster', policy: 'Affinity', instances: 'db-primary, db-replica' },
  { id: 'sg-004', name: 'cache-group', policy: 'Soft-anti-affinity', instances: 'redis-01, redis-02' },
  { id: 'sg-005', name: 'app-servers', policy: 'Anti-affinity', instances: 'app-01, app-02, app-03, app-04' },
  { id: 'sg-006', name: 'monitoring', policy: 'Soft-affinity', instances: 'prometheus, grafana' },
  { id: 'sg-007', name: 'k8s-workers', policy: 'Anti-affinity', instances: 'worker-01, worker-02, worker-03' },
  { id: 'sg-008', name: 'k8s-masters', policy: 'Anti-affinity', instances: 'master-01, master-02, master-03' },
  { id: 'sg-009', name: 'storage-nodes', policy: 'Affinity', instances: 'storage-01, storage-02' },
  { id: 'sg-010', name: 'load-balancers', policy: 'Anti-affinity', instances: 'lb-01, lb-02' },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'policy', label: 'Policy', type: 'select', options: [
    { value: 'Anti-affinity', label: 'Anti-affinity' },
    { value: 'Affinity', label: 'Affinity' },
    { value: 'Soft-anti-affinity', label: 'Soft-anti-affinity' },
    { value: 'Soft-affinity', label: 'Soft-affinity' },
  ]},
  { key: 'instances', label: 'Instances', type: 'text' },
];

export function ServerGroupsPage() {
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
    { id: 'policy', label: 'Policy', visible: true },
    { id: 'instances', label: 'Instances', visible: true },
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
        <Link
          to={`/compute/server-groups/${row.id}`}
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'policy',
      label: 'Policy',
      flex: 1,
      sortable: true,
    },
    {
      key: 'instances',
      label: 'Instances',
      flex: 1,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '64px',
      align: 'center',
      render: (_, row) => {
        const menuItems: ContextMenuItem[] = [
          {
            id: 'create-instance',
            label: 'Create instance',
            onClick: () => console.log('Create instance in server group:', row.id),
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
                <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig
      .filter((col) => col.visible)
      .map((col) => col.id);

    const columnMap = new Map(columns.map((col) => [col.key, col]));

    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<ServerGroup> => col !== undefined);
  }, [columns, columnConfig]);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
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
                { label: 'Proj-1', href: '/project' },
                { label: 'Server groups' },
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
              <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                Server group
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
                    className="w-[320px]"
                  />
                  <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
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
        title="Delete Server group"
        description="Are you sure you want to delete this server group? This action cannot be undone."
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

export default ServerGroupsPage;

