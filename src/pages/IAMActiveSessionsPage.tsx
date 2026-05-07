import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  FilterSearchInput,
  Table,
  Pagination,
  VStack,
  TopBar,
  Breadcrumb,
  ContextMenu,
  TabBar,
  ListToolbar,
  ConfirmModal,
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
import { IconRefresh, IconCircleX, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ActiveSession {
  id: string;
  /** Display label in the User column (may differ from IAM username). */
  user: string;
  /** Username key for routes and mockUsersMap in IAMUserDetailPage. */
  userId: string;
  started: string;
  lastAccess: string;
  ipAddress: string;
  device: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSessions: ActiveSession[] = [
  {
    id: 'sess-001',
    user: 'user A',
    userId: 'john.doe',
    started: 'Nov 4, 2026 14:31:34',
    lastAccess: 'Nov 4, 2026 14:45:12',
    ipAddress: '10.2.40.25',
    device: 'Chrome/Mac OS',
  },
  {
    id: 'sess-002',
    user: 'thaki.kim',
    userId: 'thaki-kim',
    started: 'Nov 4, 2026 09:15:22',
    lastAccess: 'Nov 4, 2026 13:58:47',
    ipAddress: '192.168.1.100',
    device: 'Firefox/Windows',
  },
  {
    id: 'sess-003',
    user: 'Alex Johnson',
    userId: 'alex.johnson',
    started: 'Nov 4, 2026 11:02:05',
    lastAccess: 'Nov 4, 2026 14:20:33',
    ipAddress: '10.2.40.32',
    device: 'Safari/iOS',
  },
  {
    id: 'sess-004',
    user: 'sarah.lee',
    userId: 'sara.connor',
    started: 'Nov 4, 2026 08:44:18',
    lastAccess: 'Nov 4, 2026 12:30:55',
    ipAddress: '172.16.0.50',
    device: 'Chrome/Windows',
  },
  {
    id: 'sess-005',
    user: 'mike.chen',
    userId: 'mike.wilson',
    started: 'Nov 4, 2026 10:33:41',
    lastAccess: 'Nov 4, 2026 14:12:09',
    ipAddress: '10.2.40.88',
    device: 'Edge/Windows',
  },
  {
    id: 'sess-006',
    user: 'admin',
    userId: 'jane.smith',
    started: 'Nov 4, 2026 07:20:56',
    lastAccess: 'Nov 4, 2026 11:45:28',
    ipAddress: '10.2.40.1',
    device: 'Chrome/Linux',
  },
  {
    id: 'sess-007',
    user: 'jennifer.wang',
    userId: 'lisa.park',
    started: 'Nov 4, 2026 13:05:14',
    lastAccess: 'Nov 4, 2026 14:38:42',
    ipAddress: '192.168.2.75',
    device: 'Chrome/Mac OS',
  },
  {
    id: 'sess-008',
    user: 'david.park',
    userId: 'david.lee',
    started: 'Nov 4, 2026 06:50:33',
    lastAccess: 'Nov 4, 2026 10:22:17',
    ipAddress: '10.2.40.105',
    device: 'Firefox/Mac OS',
  },
  {
    id: 'sess-009',
    user: 'emily.brown',
    userId: 'emily.chen',
    started: 'Nov 4, 2026 12:18:07',
    lastAccess: 'Nov 4, 2026 14:50:23',
    ipAddress: '172.16.0.120',
    device: 'Safari/Mac OS',
  },
  {
    id: 'sess-010',
    user: 'robert.kim',
    userId: 'chris.taylor',
    started: 'Nov 4, 2026 15:01:48',
    lastAccess: 'Nov 4, 2026 15:10:05',
    ipAddress: '10.2.40.200',
    device: 'Chrome/Android',
  },
];

const filterFields: FilterField[] = [
  { id: 'user', label: 'User', type: 'text' },
  { id: 'started', label: 'Started', type: 'text' },
  { id: 'lastAccess', label: 'Last access', type: 'text' },
  { id: 'ipAddress', label: 'IP address', type: 'text' },
  { id: 'device', label: 'Device', type: 'text' },
];

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function IAMActiveSessionsPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sessions, setSessions] = useState(mockSessions);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    updateActiveTabLabel('Active sessions');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      return appliedFilters.every((filter) => {
        if (filter.fieldId === 'user') {
          const combined = `${session.user} ${session.userId}`.toLowerCase();
          return combined.includes(filter.value.toLowerCase());
        }
        const value = String(session[filter.fieldId as keyof ActiveSession] ?? '').toLowerCase();
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [sessions, appliedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBulkDelete = () => {
    setSessions((prev) => prev.filter((s) => !selectedRows.includes(s.id)));
    setIsBulkDeleteOpen(false);
    setSelectedRows([]);
  };

  // Context menu items factory
  const getContextMenuItems = (row: ActiveSession): ContextMenuItem[] => [
    {
      id: 'terminate-session',
      label: 'Terminate this session',
      onClick: () => console.log('Terminate session', row.id),
    },
    {
      id: 'terminate-all',
      label: 'Terminate all sessions of this user',
      onClick: () => console.log('Terminate all sessions of user', row.userId),
    },
  ];

  // Breadcrumb items
  const breadcrumbItems = [{ label: 'Active Sessions' }];

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<ActiveSession>[] = [
    {
      key: 'user',
      label: 'User',
      flex: 1,
      minWidth: columnMinWidths.user,
      sortable: true,
      render: (value, row) => (
        <Link
          to={`/iam/users/${row.userId}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'started',
      label: 'Started',
      flex: 1,
      minWidth: columnMinWidths.started,
      sortable: true,
    },
    {
      key: 'lastAccess',
      label: 'Last access',
      flex: 1,
      minWidth: columnMinWidths.lastAccess,
      sortable: true,
    },
    {
      key: 'ipAddress',
      label: 'IP address',
      flex: 1,
      minWidth: columnMinWidths.ipAddress,
      sortable: true,
    },
    {
      key: 'device',
      label: 'Device',
      flex: 1,
      minWidth: columnMinWidths.device,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_, row) => (
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
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader title="Active sessions" />

        {/* Action Bar */}
        <VStack gap={3} className="w-full">
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <FilterSearchInput
                  filters={filterFields}
                  appliedFilters={appliedFilters}
                  onFiltersChange={setAppliedFilters}
                  placeholder="Search session by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                  hideAppliedFilters
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<IconRefresh size={12} stroke={1.5} />}
                  aria-label="Refresh"
                />
              </ListToolbar.Actions>
            }
            bulkActions={
              <ListToolbar.Actions>
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconCircleX size={12} stroke={1.5} />}
                  disabled={selectedRows.length === 0}
                  onClick={() => setIsBulkDeleteOpen(true)}
                >
                  Terminate
                </Button>
              </ListToolbar.Actions>
            }
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSessions.length}
            selectedCount={selectedRows.length}
            showSettings
            onPageChange={setCurrentPage}
          />

          {/* Table */}
          <Table<ActiveSession>
            columns={columns}
            data={paginatedSessions}
            rowKey="id"
            selectable
            selectedKeys={selectedRows}
            onSelectionChange={setSelectedRows}
            emptyMessage="No active sessions found"
            loading={loading}
          />
        </VStack>
      </VStack>

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Terminate selected sessions"
        description="The selected sessions will be ended. Users may need to sign in again."
        confirmText="Terminate"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="Selected count"
        infoValue={`${selectedRows.length} session(s)`}
      />
    </PageShell>
  );
}
