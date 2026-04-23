import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconDownload, IconLock, IconDotsCircleHorizontal } from '@tabler/icons-react';
import {
  Button,
  Pagination,
  Table,
  FilterSearchInput,
  TopBar,
  Breadcrumb,
  VStack,
  ListToolbar,
  ContextMenu,
  TabBar,
  StatusIndicator,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
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
    lastSignIn: 'Sep 12, 2026',
    mfa: 'OTP / Email',
    createdAt: 'Sep 12, 2026 08:15:22',
  },
  {
    id: 'admin-002',
    username: 'alex-jones',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 11, 2026',
    mfa: 'OTP',
    createdAt: 'Aug 15, 2026 10:42:38',
  },
  {
    id: 'admin-003',
    username: 'sarah-lee',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 10, 2026',
    mfa: 'Email',
    createdAt: 'Jul 20, 2026 14:28:15',
  },
  {
    id: 'admin-004',
    username: 'john-doe',
    status: 'inactive',
    locked: true,
    lastSignIn: 'Aug 25, 2026',
    mfa: '-',
    createdAt: 'Jun 10, 2026 09:55:42',
  },
  {
    id: 'admin-005',
    username: 'jane-smith',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 12, 2026',
    mfa: 'OTP / Email',
    createdAt: 'Sep 1, 2026 16:18:33',
  },
  {
    id: 'admin-006',
    username: 'mike-wilson',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 8, 2026',
    mfa: 'OTP',
    createdAt: 'Aug 25, 2026 11:32:47',
  },
  {
    id: 'admin-007',
    username: 'emily-davis',
    status: 'pending',
    locked: false,
    lastSignIn: '-',
    mfa: '-',
    createdAt: 'Sep 10, 2026 13:45:21',
  },
  {
    id: 'admin-008',
    username: 'chris-martin',
    status: 'active',
    locked: true,
    lastSignIn: 'Sep 5, 2026',
    mfa: 'Email',
    createdAt: 'Jul 5, 2026 10:22:55',
  },
  {
    id: 'admin-009',
    username: 'lisa-anderson',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 12, 2026',
    mfa: 'OTP',
    createdAt: 'Jun 1, 2026 15:48:12',
  },
  {
    id: 'admin-010',
    username: 'david-brown',
    status: 'active',
    locked: false,
    lastSignIn: 'Sep 11, 2026',
    mfa: 'OTP / Email',
    createdAt: 'May 15, 2026 08:35:39',
  },
];

const systemAdminFilterFields: FilterField[] = [
  { id: 'username', label: 'Username', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    id: 'locked',
    label: 'Locked',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  { id: 'mfa', label: 'MFA', type: 'text' },
];

/* ----------------------------------------
   IAM System Administrators Page
   ---------------------------------------- */
export default function IAMSystemAdministratorsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const itemsPerPage = 10;

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('System administrators');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter admins
  const filteredAdmins = useMemo(() => {
    if (appliedFilters.length === 0) return mockSystemAdmins;
    return mockSystemAdmins.filter((admin) =>
      appliedFilters.every((f) => {
        if (f.fieldId === 'status') return admin.status === f.value;
        if (f.fieldId === 'locked') return String(admin.locked) === f.value;
        if (f.fieldId === 'username') {
          return admin.username.toLowerCase().includes(f.value.toLowerCase());
        }
        if (f.fieldId === 'mfa') {
          return admin.mfa.toLowerCase().includes(f.value.toLowerCase());
        }
        return true;
      })
    );
  }, [appliedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Context menu items
  const getContextMenuItems = (row: SystemAdmin): ContextMenuItem[] => [
    { id: 'view', label: 'View details', onClick: () => console.log('view', row.id) },
    { id: 'edit', label: 'Edit account', onClick: () => console.log('edit', row.id) },
    {
      id: 'reset-password',
      label: 'Reset password',
      onClick: () => console.log('reset-password', row.id),
    },
    { id: 'lock', label: 'Lock account', onClick: () => console.log('lock', row.id) },
    { id: 'unlock', label: 'Unlock account', onClick: () => console.log('unlock', row.id) },
    {
      id: 'delete',
      label: 'Delete account',
      status: 'danger',
      onClick: () => console.log('delete', row.id),
    },
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
          layout="icon-only"
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
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
          <button
            aria-label="Row actions"
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'System Administrators' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader
          title="System administrators"
          actions={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/iam/system-administrators/create')}
            >
              Create account
            </Button>
          }
        />

        {/* Table Content */}
        <VStack gap={3} className="w-full">
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <FilterSearchInput
                  filters={systemAdminFilterFields}
                  appliedFilters={appliedFilters}
                  onFiltersChange={setAppliedFilters}
                  placeholder="Search system administrators by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                  hideAppliedFilters
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<IconDownload size={12} />}
                  aria-label="Download"
                />
              </ListToolbar.Actions>
            }
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showSettings
            totalItems={filteredAdmins.length}
          />

          {/* Table */}
          <Table<SystemAdmin>
            columns={columns}
            data={paginatedAdmins}
            rowKey="id"
            emptyMessage="No system administrators found"
            loading={loading}
          />
        </VStack>
      </VStack>
    </PageShell>
  );
}
