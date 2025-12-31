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
  { id: 'sg-001', name: 'sg-01', description: 'Web server access group', ingressRules: 3, egressRules: 3, createdAt: '2024-01-15', status: 'active' },
  { id: 'sg-002', name: 'default', description: 'Default security group', ingressRules: 2, egressRules: 2, createdAt: '2024-01-10', status: 'active' },
  { id: 'sg-003', name: 'db-sg', description: 'Database access group', ingressRules: 5, egressRules: 1, createdAt: '2024-02-01', status: 'active' },
  { id: 'sg-004', name: 'app-sg', description: 'Application server security group', ingressRules: 8, egressRules: 4, createdAt: '2024-02-15', status: 'active' },
  { id: 'sg-005', name: 'lb-sg', description: 'Load balancer security group', ingressRules: 4, egressRules: 2, createdAt: '2024-03-01', status: 'active' },
  { id: 'sg-006', name: 'cache-sg', description: 'Cache server access group', ingressRules: 2, egressRules: 1, createdAt: '2024-03-10', status: 'active' },
  { id: 'sg-007', name: 'monitor-sg', description: 'Monitoring access group', ingressRules: 6, egressRules: 3, createdAt: '2024-04-01', status: 'error' },
  { id: 'sg-008', name: 'vpn-sg', description: 'VPN access group', ingressRules: 10, egressRules: 5, createdAt: '2024-04-15', status: 'active' },
  { id: 'sg-009', name: 'admin-sg', description: 'Admin access group', ingressRules: 15, egressRules: 8, createdAt: '2024-05-01', status: 'active' },
  { id: 'sg-010', name: 'test-sg', description: 'Test environment security group', ingressRules: 1, egressRules: 1, createdAt: '2024-05-10', status: 'active' },
];

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const sgStatusMap: Record<SecurityGroupStatus, 'active' | 'error'> = {
  'active': 'active',
  'error': 'error',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function SecurityGroupsPage() {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [securityGroups] = useState(mockSecurityGroups);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<SecurityGroup | null>(null);

  // View preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const defaultColumnConfig: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, locked: true },
    { id: 'name', label: 'Name', visible: true, locked: true },
    { id: 'description', label: 'Description', visible: true },
    { id: 'ingressRules', label: 'Ingress Rules', visible: true },
    { id: 'egressRules', label: 'Egress Rules', visible: true },
    { id: 'actions', label: 'Action', visible: true, locked: true },
  ];

  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Context menu items
  const getContextMenuItems = (sg: SecurityGroup): ContextMenuItem[] => [
    { id: 'create-rule', label: 'Create Rule', onClick: () => console.log('Create rule:', sg.id) },
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit:', sg.id) },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => { setGroupToDelete(sg); setDeleteModalOpen(true); } },
  ];

  // Filter security groups based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return securityGroups;
    const query = searchQuery.toLowerCase();
    return securityGroups.filter(sg =>
      sg.name.toLowerCase().includes(query) ||
      sg.description.toLowerCase().includes(query)
    );
  }, [securityGroups, searchQuery]);

  const totalPages = Math.ceil(filteredGroups.length / rowsPerPage);

  // Paginated data
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredGroups.slice(start, start + rowsPerPage);
  }, [filteredGroups, currentPage, rowsPerPage]);

  // Table columns
  const columns: TableColumn<SecurityGroup>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, row) => (
        <StatusIndicator status={sgStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
          to={`/security-groups/${row.id}`}
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
    },
    {
      key: 'ingressRules',
      label: 'Ingress Rules',
      width: '112px',
    },
    {
      key: 'egressRules',
      label: 'Egress Rules',
      width: '109px',
    },
    {
      key: 'actions',
      label: 'Action',
      width: '72px',
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--action-icon-color)]" />
            </button>
          </ContextMenu>
        </div>
      ),
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
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

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
                { label: 'Security Groups' },
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
        {/* Main Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex justify-between items-center h-8 w-full">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Security Groups
              </h1>
              <Button variant="primary" size="md">
                Create Security Group
              </Button>
            </div>

            {/* Toolbar */}
            <ListToolbar
              primaryActions={
                <ListToolbar.Actions>
                  <div className="w-[280px]">
                    <SearchInput
                      placeholder="Find security group with filters"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button variant="secondary" size="sm" iconOnly icon={<IconDownload size={12} />} aria-label="Download" />
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
        title="Delete Security Group"
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
    </div>
  );
}
