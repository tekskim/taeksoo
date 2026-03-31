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
  PageShell,
  PageHeader,
  fixedColumns,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  Popover,
  Badge,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PolicyType = 'Anti-affinity' | 'Affinity' | 'Soft-anti-affinity' | 'Soft-affinity';

interface ServerGroup {
  id: string;
  name: string;
  policy: PolicyType;
  instances: { name: string; id: string }[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockServerGroups: ServerGroup[] = [
  {
    id: 'sg-001',
    name: 'server-1',
    policy: 'Anti-affinity',
    instances: [{ name: 'tk-instance', id: '294u92s2' }],
  },
  {
    id: 'sg-002',
    name: 'web-servers',
    policy: 'Anti-affinity',
    instances: [
      { name: 'web-01', id: 'a3f8k2m1' },
      { name: 'web-02', id: 'b7d4n9p3' },
      { name: 'web-03', id: 'c1e6q5r8' },
    ],
  },
  {
    id: 'sg-003',
    name: 'db-cluster',
    policy: 'Affinity',
    instances: [
      { name: 'db-primary', id: 'd9g2t7v4' },
      { name: 'db-replica', id: 'e5h8w3x6' },
    ],
  },
  {
    id: 'sg-004',
    name: 'cache-group',
    policy: 'Soft-anti-affinity',
    instances: [
      { name: 'redis-01', id: 'f2j4y1z9' },
      { name: 'redis-02', id: 'g8k6a3b5' },
    ],
  },
  {
    id: 'sg-005',
    name: 'app-servers',
    policy: 'Anti-affinity',
    instances: [
      { name: 'app-01', id: 'h4m9c7d2' },
      { name: 'app-02', id: 'i1n5e8f3' },
      { name: 'app-03', id: 'j6p2g4h7' },
      { name: 'app-04', id: 'k3q8i9j1' },
    ],
  },
  {
    id: 'sg-006',
    name: 'monitoring',
    policy: 'Soft-affinity',
    instances: [
      { name: 'prometheus', id: 'l7r4k2m5' },
      { name: 'grafana', id: 'm9s1l6n8' },
    ],
  },
  {
    id: 'sg-007',
    name: 'k8s-workers',
    policy: 'Anti-affinity',
    instances: [
      { name: 'worker-01', id: 'n5t3o7p4' },
      { name: 'worker-02', id: 'o2u8q1r6' },
      { name: 'worker-03', id: 'p8v4s3t9' },
    ],
  },
  {
    id: 'sg-008',
    name: 'k8s-masters',
    policy: 'Anti-affinity',
    instances: [
      { name: 'master-01', id: 'q4w9u5v2' },
      { name: 'master-02', id: 'r1x6w8y3' },
      { name: 'master-03', id: 's7z2x4a1' },
    ],
  },
  {
    id: 'sg-009',
    name: 'storage-nodes',
    policy: 'Affinity',
    instances: [
      { name: 'storage-01', id: 't3b8y6c5' },
      { name: 'storage-02', id: 'u9d4z2e7' },
    ],
  },
  {
    id: 'sg-010',
    name: 'load-balancers',
    policy: 'Anti-affinity',
    instances: [
      { name: 'lb-01', id: 'v5f1a9g3' },
      { name: 'lb-02', id: 'w2h7b4i8' },
    ],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
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
  { key: 'instances', label: 'Instances', type: 'text' },
];

export function ServerGroupsPage() {
  const [selectedServerGroups, setSelectedServerGroups] = useState<string[]>([]);
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
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

  const sidebarWidth = sidebarOpen ? 200 : 0;

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

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<ServerGroup>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/server-groups/${row.id}`}
            className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)] truncate">ID:{row.id}</span>
        </div>
      ),
    },
    {
      key: 'instances',
      label: 'Instances',
      flex: 1,
      sortable: true,
      render: (_, row) => {
        const first = row.instances[0];
        const extra = row.instances.length - 1;
        if (!first) return <span className="text-[var(--color-text-muted)]">—</span>;
        return (
          <div className="flex items-center gap-1 min-w-0">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-body-md text-[var(--color-text-default)] truncate">
                {first.name}
              </span>
              <span className="text-body-sm text-[var(--color-text-muted)] truncate">
                ID:{first.id}
              </span>
            </div>
            {extra > 0 && (
              <span className="ml-auto">
                <Popover
                  trigger="hover"
                  position="bottom"
                  delay={100}
                  hideDelay={100}
                  content={
                    <div className="p-3 min-w-[120px] max-w-[320px]">
                      <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                        All Instances ({row.instances.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {row.instances.map((inst, i) => (
                          <Badge key={i} theme="white" size="sm">
                            {inst.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors h-5 cursor-pointer">
                    +{extra}
                  </span>
                </Popover>
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
      width: fixedColumns.actions,
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
      .filter((col): col is TableColumn<ServerGroup> => col !== undefined);
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
              items={[{ label: 'Proj-1', href: '/project' }, { label: 'Server groups' }]}
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
    >
      <VStack gap={3}>
        {/* Page Header */}
        <PageHeader
          title="Server groups"
          actions={
            <Button variant="primary" size="md">
              Create Server Group
            </Button>
          }
        />

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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showSettings
          onSettingsClick={() => setIsPreferencesOpen(true)}
          totalItems={filteredServerGroups.length}
          selectedCount={selectedServerGroups.length}
        />

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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete server group"
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
    </PageShell>
  );
}

export default ServerGroupsPage;
