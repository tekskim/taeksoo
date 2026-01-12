import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconDownload, IconTrash } from '@tabler/icons-react';
import {
  Button,
  Pagination,
  Table,
  SearchInput,
  TopBar,
  Breadcrumb,
  VStack,
  HStack,
  ContextMenu,
  TabBar,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IconAction } from '@/design-system/components/Icons';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Type Definitions
   ---------------------------------------- */
interface Role {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  policies: string;
  description: string;
  scope: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */
const mockRoles: Role[] = [
  { id: 'role-001', name: 'admin', type: 'Built-in', policies: 'FullAccess', description: 'Full administrative access', scope: 'Global', createdAt: '2025-06-01' },
  { id: 'role-002', name: 'compute-admin', type: 'Built-in', policies: 'ReadCompute (+3)', description: '-', scope: '-', createdAt: '2025-09-12' },
  { id: 'role-003', name: 'network-viewer', type: 'Built-in', policies: 'ViewNetwork (+1)', description: 'Read-only network access', scope: 'Project', createdAt: '2025-07-15' },
  { id: 'role-004', name: 'storage-manager', type: 'Custom', policies: 'ManageStorage (+2)', description: 'Storage management role', scope: 'Project', createdAt: '2025-08-20' },
  { id: 'role-005', name: 'developer', type: 'Custom', policies: 'DeveloperAccess', description: 'Developer access role', scope: 'Project', createdAt: '2025-09-01' },
  { id: 'role-006', name: 'qa-tester', type: 'Custom', policies: 'QAAccess (+1)', description: 'QA tester access', scope: 'Project', createdAt: '2025-09-05' },
  { id: 'role-007', name: 'security-admin', type: 'Built-in', policies: 'SecurityFullAccess', description: 'Security administration', scope: 'Global', createdAt: '2025-06-15' },
  { id: 'role-008', name: 'billing-viewer', type: 'Built-in', policies: 'ViewBilling', description: 'View billing information', scope: 'Organization', createdAt: '2025-07-01' },
  { id: 'role-009', name: 'support-agent', type: 'Custom', policies: 'SupportAccess (+2)', description: 'Customer support access', scope: 'Global', createdAt: '2025-08-10' },
  { id: 'role-010', name: 'read-only', type: 'Built-in', policies: 'ReadAll', description: 'Read-only access to all', scope: 'Project', createdAt: '2025-06-20' },
];

/* ----------------------------------------
   IAM Roles Page
   ---------------------------------------- */
export default function IAMRolesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();
  const itemsPerPage = 10;

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Roles');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter roles by search query
  const filteredRoles = mockRoles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.policies.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Context menu items factory
  const getContextMenuItems = (rowId: string, isBuiltIn: boolean): ContextMenuItem[] => {
    if (isBuiltIn) {
      // Built-in roles: Manage policies, Edit, Delete disabled
      return [
        { id: 'manage-policies', label: 'Manage policies', disabled: true, onClick: () => console.log('Manage policies', rowId) },
        { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate', rowId) },
        { id: 'edit', label: 'Edit', disabled: true, onClick: () => console.log('Edit', rowId) },
        { id: 'delete', label: 'Delete', disabled: true, onClick: () => console.log('Delete', rowId) },
      ];
    }
    // Custom roles: all items enabled
    return [
      { id: 'manage-policies', label: 'Manage policies', onClick: () => console.log('Manage policies', rowId) },
      { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate', rowId) },
      { id: 'edit', label: 'Edit', onClick: () => console.log('Edit', rowId) },
      { id: 'delete', label: 'Delete', status: 'danger', onClick: () => console.log('Delete', rowId) },
    ];
  };

  // Table columns
  const columns: TableColumn<Role>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/roles/${value}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      width: 100,
    },
    {
      key: 'policies',
      label: 'Policies',
      flex: 1,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
    },
    {
      key: 'scope',
      label: 'Scope',
      flex: 1,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
    },
    {
      key: 'id',
      label: 'Action',
      width: 72,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu items={getContextMenuItems(row.id, row.type === 'Built-in')} trigger="click">
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'IAM', href: '/iam' },
                { label: 'Roles' },
              ]}
            />
          }
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full">
                <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                  Roles
                </h1>
                <Button variant="primary" size="sm">
                  Create role
                </Button>
              </HStack>

              {/* Table Content */}
              <VStack gap={3} className="w-full">
                {/* Action Bar */}
                <HStack gap={2} align="center">
                  {/* Search */}
                  <HStack gap={1} align="center">
                    <SearchInput
                      placeholder="Search roles by attributes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[280px]"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconDownload size={12} />}
                      aria-label="Download"
                    />
                  </HStack>

                  {/* Divider */}
                  <div className="w-px h-4 bg-[var(--color-border-default)]" />

                  {/* Actions */}
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                    disabled={selectedRows.length === 0}
                  >
                    Delete
                  </Button>
                </HStack>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  totalItems={filteredRoles.length}
                  selectedCount={selectedRows.length}
                />

                {/* Table */}
                <Table<Role>
                  columns={columns}
                  data={paginatedRoles}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedRows}
                  onSelectionChange={setSelectedRows}
                />
              </VStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
