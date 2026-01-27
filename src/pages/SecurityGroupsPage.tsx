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
  columnWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { CreateSecurityGroupRuleDrawer } from '@/components/CreateSecurityGroupRuleDrawer';
import { EditSecurityGroupDrawer } from '@/components/EditSecurityGroupDrawer';
import { IconDotsCircleHorizontal, IconTrash, IconDownload, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SecurityGroupStatus = 'active' | 'error';

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  ingressRules: number;
  egressRules: number;
  createdAt: string;
  status: SecurityGroupStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSecurityGroups: SecurityGroup[] = [
  {
    id: 'sg-001',
    name: 'sg-01',
    description: 'Web server access group',
    ingressRules: 3,
    egressRules: 3,
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'sg-002',
    name: 'default',
    description: 'Default security group',
    ingressRules: 2,
    egressRules: 2,
    createdAt: '2024-01-10',
    status: 'active',
  },
  {
    id: 'sg-003',
    name: 'db-sg',
    description: 'Database access group',
    ingressRules: 5,
    egressRules: 1,
    createdAt: '2024-02-01',
    status: 'active',
  },
  {
    id: 'sg-004',
    name: 'app-sg',
    description: 'Application server security group',
    ingressRules: 8,
    egressRules: 4,
    createdAt: '2024-02-15',
    status: 'active',
  },
  {
    id: 'sg-005',
    name: 'lb-sg',
    description: 'Load balancer security group',
    ingressRules: 4,
    egressRules: 2,
    createdAt: '2024-03-01',
    status: 'active',
  },
  {
    id: 'sg-006',
    name: 'cache-sg',
    description: 'Cache server access group',
    ingressRules: 2,
    egressRules: 1,
    createdAt: '2024-03-10',
    status: 'active',
  },
  {
    id: 'sg-007',
    name: 'monitor-sg',
    description: 'Monitoring access group',
    ingressRules: 6,
    egressRules: 3,
    createdAt: '2024-04-01',
    status: 'error',
  },
  {
    id: 'sg-008',
    name: 'vpn-sg',
    description: 'VPN access group',
    ingressRules: 10,
    egressRules: 5,
    createdAt: '2024-04-15',
    status: 'active',
  },
  {
    id: 'sg-009',
    name: 'admin-sg',
    description: 'Admin access group',
    ingressRules: 15,
    egressRules: 8,
    createdAt: '2024-05-01',
    status: 'active',
  },
  {
    id: 'sg-010',
    name: 'test-sg',
    description: 'Test environment security group',
    ingressRules: 1,
    egressRules: 1,
    createdAt: '2024-05-10',
    status: 'active',
  },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const sgStatusMap: Record<SecurityGroupStatus, 'active' | 'error'> = {
  active: 'active',
  error: 'error',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

// Filter fields configuration
const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
];

export function SecurityGroupsPage() {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [securityGroups] = useState(mockSecurityGroups);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<SecurityGroup | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Drawer states
  const [createRuleOpen, setCreateRuleOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [selectedGroupForDrawer, setSelectedGroupForDrawer] = useState<SecurityGroup | null>(null);

  // Drawer handlers
  const handleCreateRule = (sg: SecurityGroup) => {
    setSelectedGroupForDrawer(sg);
    setCreateRuleOpen(true);
  };

  const handleEditGroup = (sg: SecurityGroup) => {
    setSelectedGroupForDrawer(sg);
    setEditGroupOpen(true);
  };

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'description', label: 'Description', visible: true },
    { id: 'ingressRules', label: 'Ingress rules', visible: true },
    { id: 'egressRules', label: 'Egress rules', visible: true },
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

  // Context menu items
  const getContextMenuItems = (sg: SecurityGroup): ContextMenuItem[] => [
    { id: 'create-rule', label: 'Create rule', onClick: () => handleCreateRule(sg) },
    { id: 'edit', label: 'Edit', onClick: () => handleEditGroup(sg) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => {
        setGroupToDelete(sg);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Filter security groups based on search
  const filteredGroups = useMemo(() => {
    if (appliedFilters.length === 0) return securityGroups;

    return securityGroups.filter((sg) => {
      return appliedFilters.every((filter) => {
        const value = String(sg[filter.field as keyof SecurityGroup] || '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [securityGroups, appliedFilters]);

  const totalPages = Math.ceil(filteredGroups.length / rowsPerPage);

  // Paginated data
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredGroups.slice(start, start + rowsPerPage);
  }, [filteredGroups, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<SecurityGroup>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute/security-groups/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      sortable: true,
    },
    {
      key: 'ingressRules',
      label: 'Ingress rules',
      width: columnWidths.ingressRules,
      sortable: true,
    },
    {
      key: 'egressRules',
      label: 'Egress rules',
      width: columnWidths.egressRules,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      width: columnWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: columnWidths.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
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
      .filter((col): col is TableColumn<SecurityGroup> => col !== undefined);
  }, [columns, columnConfig]);

  const handleContextMenuSelect = (itemId: string) => {
    if (itemId === 'delete' && groupToDelete) {
      // Handle delete
      setDeleteModalOpen(false);
      setGroupToDelete(null);
    }
  };

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
              <Breadcrumb
                items={[{ label: 'Proj-1', href: '/project' }, { label: 'Security groups' }]}
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
          {/* Main Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex justify-between items-center h-8 w-full">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Security groups
                </h1>
                <Button variant="primary" size="md">
                  Create Security group
                </Button>
              </div>

              {/* Toolbar */}
              <ListToolbar
                primaryActions={
                  <ListToolbar.Actions>
                    <FilterSearchInput
                      filters={filterFields}
                      appliedFilters={appliedFilters}
                      onFiltersChange={setAppliedFilters}
                      placeholder="Search security group by attributes"
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
                    <Button
                      variant="muted"
                      size="sm"
                      leftIcon={<IconTrash size={12} />}
                      disabled={selectedGroups.length === 0}
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
                totalItems={filteredGroups.length}
                selectedCount={selectedGroups.length}
                onPageChange={setCurrentPage}
                showSettings
                onSettingsClick={() => setIsPreferencesOpen(true)}
              />

              {/* Table */}
              <Table
                columns={visibleColumns}
                data={paginatedGroups}
                rowKey="id"
                selectable
                selectedKeys={selectedGroups}
                onSelectionChange={setSelectedGroups}
              />
            </VStack>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setGroupToDelete(null);
        }}
        title="Delete Security group"
        description={`Are you sure you want to delete "${groupToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => handleContextMenuSelect('delete')}
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

      {/* Security Group Drawers */}
      <CreateSecurityGroupRuleDrawer
        isOpen={createRuleOpen}
        onClose={() => setCreateRuleOpen(false)}
        securityGroupId={selectedGroupForDrawer?.id}
      />

      <EditSecurityGroupDrawer
        isOpen={editGroupOpen}
        onClose={() => setEditGroupOpen(false)}
        securityGroup={{
          id: selectedGroupForDrawer?.id || '',
          name: selectedGroupForDrawer?.name || '',
          description: selectedGroupForDrawer?.description,
        }}
      />
    </div>
  );
}
