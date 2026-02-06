import { useState, useEffect } from 'react';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  ContextMenu,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { ManageRolesDrawer } from '@/components/ManageRolesDrawer';
import { ManageUsersDrawer } from '@/components/ManageUsersDrawer';
import { EditUserGroupDrawer } from '@/components/EditUserGroupDrawer';
import { IconDownload, IconTrash } from '@tabler/icons-react';
import { IconAction } from '@/design-system';
import { Link, useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type GroupType = 'Built-in' | 'Custom';
type GroupStatus = 'active' | 'inactive';

interface UserGroup {
  id: string;
  name: string;
  type: GroupType;
  status: GroupStatus;
  roles: string;
  userCount: number;
  description: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockUserGroups: UserGroup[] = [
  {
    id: 'ug-001',
    name: 'dev-admin-group',
    type: 'Custom',
    status: 'active',
    roles: 'admin (+3)',
    userCount: 100,
    description: 'Development team administrators',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'ug-002',
    name: 'ops-team',
    type: 'Custom',
    status: 'inactive',
    roles: 'network-admin (+1)',
    userCount: 25,
    description: 'Operations team',
    createdAt: 'Sep 10, 2025',
  },
  {
    id: 'ug-003',
    name: 'qa-team',
    type: 'Custom',
    status: 'active',
    roles: 'qa-lead (+2)',
    userCount: 15,
    description: 'Quality assurance team',
    createdAt: 'Sep 8, 2025',
  },
  {
    id: 'ug-004',
    name: 'viewers',
    type: 'Built-in',
    status: 'active',
    roles: 'Viewer (+3)',
    userCount: 130,
    description: '-',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'ug-005',
    name: 'administrators',
    type: 'Built-in',
    status: 'active',
    roles: 'super-admin',
    userCount: 5,
    description: 'System administrators',
    createdAt: 'Aug 1, 2025',
  },
  {
    id: 'ug-006',
    name: 'developers',
    type: 'Custom',
    status: 'active',
    roles: 'developer (+2)',
    userCount: 45,
    description: 'Development team',
    createdAt: 'Aug 15, 2025',
  },
  {
    id: 'ug-007',
    name: 'security-team',
    type: 'Custom',
    status: 'inactive',
    roles: 'security-admin',
    userCount: 8,
    description: 'Security operations',
    createdAt: 'Jul 20, 2025',
  },
  {
    id: 'ug-008',
    name: 'support-team',
    type: 'Custom',
    status: 'active',
    roles: 'support (+1)',
    userCount: 20,
    description: 'Customer support team',
    createdAt: 'Jul 10, 2025',
  },
  {
    id: 'ug-009',
    name: 'data-analysts',
    type: 'Custom',
    status: 'active',
    roles: 'analyst',
    userCount: 12,
    description: 'Data analysis team',
    createdAt: 'Jun 25, 2025',
  },
  {
    id: 'ug-010',
    name: 'external-users',
    type: 'Custom',
    status: 'inactive',
    roles: 'viewer',
    userCount: 50,
    description: 'External partners',
    createdAt: 'Jun 1, 2025',
  },
];

/* ----------------------------------------
   IAM User groups Page
   ---------------------------------------- */

export function IAMUserGroupsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('User groups');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter user groups by search query
  const filteredGroups = mockUserGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.roles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selection state
  const hasSelection = selectedRows.length > 0;

  // Drawer states
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [selectedGroupForDrawer, setSelectedGroupForDrawer] = useState<UserGroup | null>(null);

  // Drawer handlers
  const handleManageRoles = (group: UserGroup) => {
    setSelectedGroupForDrawer(group);
    setManageRolesOpen(true);
  };

  const handleManageUsers = (group: UserGroup) => {
    setSelectedGroupForDrawer(group);
    setManageUsersOpen(true);
  };

  const handleEditGroup = (group: UserGroup) => {
    setSelectedGroupForDrawer(group);
    setEditGroupOpen(true);
  };

  // Context menu items factory
  const getContextMenuItems = (row: UserGroup): ContextMenuItem[] => {
    const isInactive = row.status === 'inactive';
    if (isInactive) {
      // Inactive group: Manage roles, Edit, Delete disabled; Duplicate not shown
      return [
        {
          id: 'manage-roles',
          label: 'Manage roles',
          disabled: true,
          onClick: () => handleManageRoles(row),
        },
        { id: 'manage-users', label: 'Manage users', onClick: () => handleManageUsers(row) },
        { id: 'edit', label: 'Edit', disabled: true, onClick: () => handleEditGroup(row) },
        {
          id: 'delete',
          label: 'Delete',
          disabled: true,
          onClick: () => console.log('Delete', row.id),
        },
      ];
    }
    // Active group: all items enabled
    return [
      { id: 'manage-roles', label: 'Manage roles', onClick: () => handleManageRoles(row) },
      { id: 'manage-users', label: 'Manage users', onClick: () => handleManageUsers(row) },
      { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate', row.id) },
      { id: 'edit', label: 'Edit', onClick: () => handleEditGroup(row) },
      {
        id: 'delete',
        label: 'Delete',
        status: 'danger',
        onClick: () => console.log('Delete', row.id),
      },
    ];
  };

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<UserGroup>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/user-groups/${value}`}
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
      key: 'roles',
      label: 'Roles',
      flex: 1,
      minWidth: columnMinWidths.roles,
      sortable: true,
    },
    {
      key: 'userCount',
      label: 'User count',
      flex: 1,
      minWidth: columnMinWidths.userCount,
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
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
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'User groups' }]} />
          }
        />

        {/* Content */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full">
                <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  User groups
                </h1>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/iam/user-groups/create')}
                >
                  Create user group
                </Button>
              </HStack>

              {/* Search and Actions */}
              <VStack gap={3} className="w-full">
                {/* Action Bar */}
                <ListToolbar
                  primaryActions={
                    <ListToolbar.Actions>
                      <SearchInput
                        placeholder="Search user groups by attributes"
                        value={searchQuery}
                        onChange={setSearchQuery}
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
                        disabled={!hasSelection}
                        leftIcon={<IconTrash size={12} />}
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
                  selectedCount={selectedRows.length}
                  showSettings
                  onPageChange={setCurrentPage}
                />

                {/* Table */}
                <Table<UserGroup>
                  columns={columns}
                  data={paginatedGroups}
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

      {/* User Group Drawers */}
      <ManageRolesDrawer
        isOpen={manageRolesOpen}
        onClose={() => setManageRolesOpen(false)}
        userName={selectedGroupForDrawer?.name}
      />

      <ManageUsersDrawer
        isOpen={manageUsersOpen}
        onClose={() => setManageUsersOpen(false)}
        userGroupName={selectedGroupForDrawer?.name}
      />

      <EditUserGroupDrawer
        isOpen={editGroupOpen}
        onClose={() => setEditGroupOpen(false)}
        initialData={
          selectedGroupForDrawer
            ? {
                name: selectedGroupForDrawer.name,
                description: selectedGroupForDrawer.description,
              }
            : undefined
        }
      />
    </div>
  );
}

export default IAMUserGroupsPage;
