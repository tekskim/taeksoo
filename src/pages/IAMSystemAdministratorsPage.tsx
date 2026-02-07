import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconDownload, IconLock } from '@tabler/icons-react';
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
  StatusIndicator,
  PageShell,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IconAction } from '@/design-system/components/Icons';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Type Definitions
   ---------------------------------------- */
interface SystemAdmin {
  id: string;
  username: string;
  status: 'active' | 'inactive' | 'pending';
  locked: boolean;
  lastSignIn: string;
  mfa: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */
const mockSystemAdmins: SystemAdmin[] = [
  {
    id: 'admin-001',
    username: 'thaki-kim',
    status: 'active',
    locked: true,
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'admin-002',
    username: 'alex-jones',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 11, 2025',
    mfa: 'OTP',
    createdAt: 'Aug 15, 2025',
  },
  {
    id: 'admin-003',
    username: 'sarah-lee',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 10, 2025',
    mfa: 'Email',
    createdAt: 'Jul 20, 2025',
  },
  {
    id: 'admin-004',
    username: 'john-doe',
    status: 'inactive',
    locked: true,
    lastSignIn: 'Aug 25, 2025',
    mfa: '-',
    createdAt: 'Jun 10, 2025',
  },
  {
    id: 'admin-005',
    username: 'jane-smith',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP / Email',
    createdAt: 'Sep 1, 2025',
  },
  {
    id: 'admin-006',
    username: 'mike-wilson',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 8, 2025',
    mfa: 'OTP',
    createdAt: 'Aug 25, 2025',
  },
  {
    id: 'admin-007',
    username: 'emily-davis',
    status: 'pending',
    locked: false,
    lastSignIn: '-',
    mfa: '-',
    createdAt: 'Sep 10, 2025',
  },
  {
    id: 'admin-008',
    username: 'chris-martin',
    status: 'active',
    locked: true,
    lastSignIn: 'Sep 5, 2025',
    mfa: 'Email',
    createdAt: 'Jul 5, 2025',
  },
  {
    id: 'admin-009',
    username: 'lisa-anderson',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 12, 2025',
    mfa: 'OTP',
    createdAt: 'Jun 1, 2025',
  },
  {
    id: 'admin-010',
    username: 'david-brown',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 11, 2025',
    mfa: 'OTP / Email',
    createdAt: 'May 15, 2025',
  },
];

/* ----------------------------------------
   IAM System Administrators Page
   ---------------------------------------- */
export default function IAMSystemAdministratorsPage() {
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
    updateActiveTabLabel('System administrators');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter admins by search query
  const filteredAdmins = mockSystemAdmins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.mfa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Context menu items
  const contextMenuItems: ContextMenuItem[] = [
    { id: 'view', label: 'View details' },
    { id: 'edit', label: 'Edit account' },
    { id: 'reset-password', label: 'Reset password' },
    { type: 'divider' },
    { id: 'lock', label: 'Lock account' },
    { id: 'unlock', label: 'Unlock account' },
    { type: 'divider' },
    { id: 'delete', label: 'Delete account', danger: true },
  ];

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<SystemAdmin>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value) => (
        <StatusIndicator
          status={value === 'active' ? 'active' : value === 'inactive' ? 'shutoff' : 'building'}
        />
      ),
    },
    {
      key: 'username',
      label: 'Username',
      flex: 1,
      minWidth: columnMinWidths.username,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/system-administrators/${value}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'locked',
      label: 'Locked',
      width: fixedColumns.locked,
      align: 'center',
      render: (value) => (
        <div className="flex items-center justify-center w-full">
          {value ? (
            <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
          ) : null}
        </div>
      ),
    },
    {
      key: 'lastSignIn',
      label: 'Last sign-in',
      flex: 1,
      minWidth: columnMinWidths.lastSignIn,
      sortable: true,
    },
    {
      key: 'mfa',
      label: 'MFA',
      flex: 1,
      minWidth: columnMinWidths.mfa,
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
        <ContextMenu items={contextMenuItems} onSelect={(itemId) => console.log(itemId, row.id)}>
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <IconAction size={16} stroke={1} className="text-[var(--color-text-default)]" />
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
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'IAM', href: '/iam' }, { label: 'System administrators' }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <HStack justify="between" align="center" className="w-full">
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
            System administrators
          </h1>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/iam/system-administrators/create')}
          >
            Create account
          </Button>
        </HStack>

        {/* Table Content */}
        <VStack gap={3} className="w-full">
          {/* Action Bar */}
          <HStack gap={2} align="center">
            {/* Search */}
            <HStack gap={1} align="center">
              <SearchInput
                placeholder="Search accounts by attributes"
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
            </HStack>
          </HStack>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            totalItems={filteredAdmins.length}
            selectedCount={selectedRows.length}
          />

          {/* Table */}
          <Table<SystemAdmin> columns={columns} data={paginatedAdmins} rowKey="id" />
        </VStack>
      </VStack>
    </PageShell>
  );
}
