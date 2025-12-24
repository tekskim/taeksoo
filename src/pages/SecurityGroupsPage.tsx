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
} from '@tabler/icons-react';

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
  status: SecurityGroupStatus;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSecurityGroups: SecurityGroup[] = [
  { id: 'sg-001', name: 'sg-01', description: 'Web server access group', ingressRules: 3, egressRules: 3, status: 'active' },
  { id: 'sg-002', name: 'default', description: 'Default security group', ingressRules: 2, egressRules: 2, status: 'active' },
  { id: 'sg-003', name: 'db-sg', description: 'Database access group', ingressRules: 5, egressRules: 1, status: 'active' },
  { id: 'sg-004', name: 'app-sg', description: 'Application server security group', ingressRules: 8, egressRules: 4, status: 'active' },
  { id: 'sg-005', name: 'lb-sg', description: 'Load balancer security group', ingressRules: 4, egressRules: 2, status: 'active' },
  { id: 'sg-006', name: 'cache-sg', description: 'Cache server access group', ingressRules: 2, egressRules: 1, status: 'active' },
  { id: 'sg-007', name: 'monitor-sg', description: 'Monitoring access group', ingressRules: 6, egressRules: 3, status: 'error' },
  { id: 'sg-008', name: 'vpn-sg', description: 'VPN access group', ingressRules: 10, egressRules: 5, status: 'active' },
  { id: 'sg-009', name: 'admin-sg', description: 'Admin access group', ingressRules: 15, egressRules: 8, status: 'active' },
  { id: 'sg-010', name: 'test-sg', description: 'Test environment security group', ingressRules: 1, egressRules: 1, status: 'active' },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [securityGroups] = useState(mockSecurityGroups);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<SecurityGroup | null>(null);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Context menu items
  const getContextMenuItems = (sg: SecurityGroup): ContextMenuItem[] => [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Rules' },
    { id: 'delete', label: 'Delete', status: 'danger' },
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

  const totalPages = Math.ceil(filteredGroups.length / 10);

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
      render: (value: string) => (
        <span className="font-medium text-[var(--color-action-primary)]">{value}</span>
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
          <ContextMenu
            items={getContextMenuItems(row)}
            onSelect={(itemId) => {
              if (itemId === 'delete') {
                setGroupToDelete(row);
                setDeleteModalOpen(true);
              }
            }}
          >
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsVertical size={16} stroke={1} className="text-[var(--color-text-default)]" />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  const handleContextMenuSelect = (itemId: string) => {
    if (itemId === 'delete' && groupToDelete) {
      // Handle delete
      setDeleteModalOpen(false);
      setGroupToDelete(null);
    }
  };

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
          showAddButton={false}
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

        {/* Main Content */}
        <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
          <VStack gap={3}>
            {/* Page Header */}
            <div className="flex justify-between items-center h-8 w-full">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Security Groups
              </h1>
              <Button variant="primary" size="md" leftIcon={<IconPlus size={14} />}>
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
                  <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
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
              onPageChange={setCurrentPage}
              selectedCount={selectedGroups.length}
            />

            {/* Table */}
            <Table
              columns={columns}
              data={filteredGroups}
              rowKey="id"
              selectable
              selectedKeys={selectedGroups}
              onSelectionChange={setSelectedGroups}
            />
          </VStack>
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
        message={`Are you sure you want to delete "${groupToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={() => handleContextMenuSelect('delete')}
      />
    </div>
  );
}
