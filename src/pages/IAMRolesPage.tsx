import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconDownload, IconTrash, IconDotsCircleHorizontal } from '@tabler/icons-react';
import {
  Button,
  Pagination,
  Table,
  SearchInput,
  TopBar,
  Breadcrumb,
  VStack,
  ContextMenu,
  TabBar,
  ListToolbar,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
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
  {
    id: 'role-001',
    name: 'admin',
    type: 'Built-in',
    policies: 'FullAccess',
    description: 'Full administrative access',
    scope: 'Global',
    createdAt: 'Jun 1, 2025 10:20:28',
  },
  {
    id: 'role-002',
    name: 'compute-admin',
    type: 'Built-in',
    policies: 'ReadCompute (+3)',
    description: '-',
    scope: '-',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'role-003',
    name: 'network-viewer',
    type: 'Built-in',
    policies: 'ViewNetwork (+1)',
    description: 'Read-only network access',
    scope: 'Project',
    createdAt: 'Jul 15, 2025 12:22:26',
  },
  {
    id: 'role-004',
    name: 'storage-manager',
    type: 'Custom',
    policies: 'ManageStorage (+2)',
    description: 'Storage management role',
    scope: 'Project',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
  {
    id: 'role-005',
    name: 'developer',
    type: 'Custom',
    policies: 'DeveloperAccess',
    description: 'Developer access role',
    scope: 'Project',
    createdAt: 'Sep 1, 2025 10:20:28',
  },
  {
    id: 'role-006',
    name: 'qa-tester',
    type: 'Custom',
    policies: 'QAAccess (+1)',
    description: 'QA tester access',
    scope: 'Project',
    createdAt: 'Sep 5, 2025 14:12:36',
  },
  {
    id: 'role-007',
    name: 'security-admin',
    type: 'Built-in',
    policies: 'SecurityFullAccess',
    description: 'Security administration',
    scope: 'Global',
    createdAt: 'Jun 15, 2025 12:22:26',
  },
  {
    id: 'role-008',
    name: 'billing-viewer',
    type: 'Built-in',
    policies: 'ViewBilling',
    description: 'View billing information',
    scope: 'Organization',
    createdAt: 'Jul 1, 2025 10:20:28',
  },
  {
    id: 'role-009',
    name: 'support-agent',
    type: 'Custom',
    policies: 'SupportAccess (+2)',
    description: 'Customer support access',
    scope: 'Global',
    createdAt: 'Aug 10, 2025 01:17:01',
  },
  {
    id: 'role-010',
    name: 'read-only',
    type: 'Built-in',
    policies: 'ReadAll',
    description: 'Read-only access to all',
    scope: 'Project',
    createdAt: 'Jun 20, 2025 23:27:51',
  },
];

/* ----------------------------------------
   IAM Roles Page
   ---------------------------------------- */
export default function IAMRolesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const itemsPerPage = 10;

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Roles');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter roles by search query
  const filteredRoles = mockRoles.filter(
    (role) =>
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
        {
          id: 'manage-policies',
          label: 'Manage policies',
          disabled: true,
          onClick: () => console.log('Manage policies', rowId),
        },
        { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate', rowId) },
        { id: 'edit', label: 'Edit', disabled: true, onClick: () => console.log('Edit', rowId) },
        {
          id: 'delete',
          label: 'Delete',
          disabled: true,
          onClick: () => console.log('Delete', rowId),
        },
      ];
    }
    // Custom roles: all items enabled
    return [
      {
        id: 'manage-policies',
        label: 'Manage policies',
        onClick: () => console.log('Manage policies', rowId),
      },
      { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate', rowId) },
      { id: 'edit', label: 'Edit', onClick: () => console.log('Edit', rowId) },
      {
        id: 'delete',
        label: 'Delete',
        status: 'danger',
        onClick: () => console.log('Delete', rowId),
      },
    ];
  };

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<Role>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
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
      flex: 1,
      minWidth: columnMinWidths.typeLg,
    },
    {
      key: 'policies',
      label: 'Policies',
      flex: 1,
      minWidth: columnMinWidths.policies,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
    },
    {
      key: 'scope',
      label: 'Scope',
      flex: 1,
      minWidth: columnMinWidths.scope,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu
          items={getContextMenuItems(row.id, row.type === 'Built-in')}
          trigger="click"
          align="right"
        >
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'Roles' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader
          title="Roles"
          actions={
            <Button variant="primary" size="md" onClick={() => navigate('/iam/roles/create')}>
              Create role
            </Button>
          }
        />

        {/* Table Content */}
        <VStack gap={3} className="w-full">
          {/* Action Bar */}
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <SearchInput
                  placeholder="Search roles by attributes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  disabled={selectedRows.length === 0}
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
    </PageShell>
  );
}
