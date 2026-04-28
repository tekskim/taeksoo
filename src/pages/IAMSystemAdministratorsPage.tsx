import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconDownload, IconDotsCircleHorizontal, IconTrash } from '@tabler/icons-react';
import {
  Badge,
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
import { InlineCopyId } from '@/components/InlineCopyId';
import { CreateUserDrawer } from '@/components/CreateUserDrawer';
import { useTabs } from '@/contexts/TabContext';

/* ----------------------------------------
   Type Definitions
   ---------------------------------------- */
interface SystemAdmin {
  id: string;
  username: string;
  status: 'active' | 'deactivated';
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
    status: 'deactivated',
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
    status: 'deactivated',
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
      { value: 'deactivated', label: 'Deactivated' },
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

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
    {
      id: 'reset-password',
      label: 'Reset password',
      onClick: () => console.log('reset-password', row.id),
    },
    { id: 'edit', label: 'Edit', onClick: () => console.log('edit', row.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
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
          status={value === 'active' ? 'active' : 'deactivated'}
        />
      ),
    },
    {
      key: 'username',
      label: 'Username',
      flex: 1,
      minWidth: columnMinWidths.username,
      sortable: true,
      render: (value, row) => (
        <VStack gap={0.5} align="start">
          <Link
            to={`/iam/system-administrators/${value}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline"
          >
            {value}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] min-w-0">
            <span className="truncate" title={row.id}>
              ID : {row.id}
            </span>
            <InlineCopyId value={row.id} />
          </span>
        </VStack>
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
      render: (value: string) => {
        if (!value || value === '-') return <span>-</span>;
        const methods = value.split(' / ');
        return (
          <div className="flex items-center gap-1">
            {methods.map((method) => (
              <Badge key={method} theme="white" size="sm">
                {method}
              </Badge>
            ))}
          </div>
        );
      },
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
            <Button variant="primary" size="md" onClick={() => setIsCreateDrawerOpen(true)}>
              Create account
            </Button>
          }
        />

        {/* Table Content */}
        <VStack gap={3} className="w-full">
          <ListToolbar
            primaryActions={
              <>
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
                    onClick={() => console.log('Download')}
                  />
                </ListToolbar.Actions>
                <div className="w-px h-4 bg-[var(--color-border-default)] self-center" />
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconTrash size={12} />}
                  disabled={selectedItems.length === 0}
                  onClick={() => console.log('Delete')}
                >
                  Delete
                </Button>
              </>
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
            selectable
            selectedKeys={selectedItems}
            onSelectionChange={setSelectedItems}
            emptyMessage="No system administrators found"
            loading={loading}
          />
        </VStack>
      </VStack>

      {/* Create User Drawer */}
      <CreateUserDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSubmit={(data) => {
          console.log('Create user:', data);
        }}
      />
    </PageShell>
  );
}
