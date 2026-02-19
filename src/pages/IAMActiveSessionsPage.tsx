import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  TopBar,
  Breadcrumb,
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
import { IconRefresh, IconCircleX } from '@tabler/icons-react';
import { IconAction } from '@/design-system';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ActiveSession {
  id: string;
  user: string;
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
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '10.2.40.25',
    device: 'Chrome/Mac OS',
  },
  {
    id: 'sess-002',
    user: 'thaki-kim',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '192.168.1.100',
    device: 'Firefox/Windows',
  },
  {
    id: 'sess-003',
    user: 'alex.johnson',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '10.2.40.32',
    device: 'Safari/iOS',
  },
  {
    id: 'sess-004',
    user: 'sarah.lee',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '172.16.0.50',
    device: 'Chrome/Windows',
  },
  {
    id: 'sess-005',
    user: 'mike.chen',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '10.2.40.88',
    device: 'Edge/Windows',
  },
  {
    id: 'sess-006',
    user: 'admin',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '10.2.40.1',
    device: 'Chrome/Linux',
  },
  {
    id: 'sess-007',
    user: 'jennifer.wang',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '192.168.2.75',
    device: 'Chrome/Mac OS',
  },
  {
    id: 'sess-008',
    user: 'david.park',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '10.2.40.105',
    device: 'Firefox/Mac OS',
  },
  {
    id: 'sess-009',
    user: 'emily.brown',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '172.16.0.120',
    device: 'Safari/Mac OS',
  },
  {
    id: 'sess-010',
    user: 'robert.kim',
    started: 'Nov 4, 2025',
    lastAccess: 'Nov 4, 2025',
    ipAddress: '10.2.40.200',
    device: 'Chrome/Android',
  },
];

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function IAMActiveSessionsPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    updateActiveTabLabel('Active sessions');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter sessions by search query
  const filteredSessions = mockSessions.filter(
    (session) =>
      session.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.device.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      onClick: () => console.log('Terminate all sessions of user', row.user),
    },
  ];

  // Breadcrumb items
  const breadcrumbItems = [{ label: 'IAM', href: '/iam' }, { label: 'Active sessions' }];

  // Table columns (using fixedColumns / columnMinWidths preset)
  const columns: TableColumn<ActiveSession>[] = [
    {
      key: 'user',
      label: 'User',
      flex: 1,
      minWidth: columnMinWidths.user,
      sortable: true,
      render: (value) => (
        <Link
          to={`/iam/users/${value}`}
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
      render: (_, row) => (
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
    >
      <VStack gap={3}>
        {/* Header */}
        <PageHeader title="Active sessions" />

        {/* Action Bar */}
        <VStack gap={3} className="w-full">
          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <SearchInput
                  placeholder="Search session by attributes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[var(--search-input-width)]"
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
          />
        </VStack>
      </VStack>
    </PageShell>
  );
}
