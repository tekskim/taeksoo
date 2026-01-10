import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  HStack,
  TopBar,
  Breadcrumb,
  ContextMenu,
  TabBar,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh } from '@tabler/icons-react';
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
    started: '2025-11-04 14:31:34',
    lastAccess: '2025-11-04 15:23:22',
    ipAddress: '10.2.40.25',
    device: 'Chrome/Mac OS',
  },
  {
    id: 'sess-002',
    user: 'thaki-kim',
    started: '2025-11-04 09:15:00',
    lastAccess: '2025-11-04 15:20:45',
    ipAddress: '192.168.1.100',
    device: 'Firefox/Windows',
  },
  {
    id: 'sess-003',
    user: 'alex.johnson',
    started: '2025-11-04 10:22:18',
    lastAccess: '2025-11-04 14:55:30',
    ipAddress: '10.2.40.32',
    device: 'Safari/iOS',
  },
  {
    id: 'sess-004',
    user: 'sarah.lee',
    started: '2025-11-04 08:00:00',
    lastAccess: '2025-11-04 15:10:12',
    ipAddress: '172.16.0.50',
    device: 'Chrome/Windows',
  },
  {
    id: 'sess-005',
    user: 'mike.chen',
    started: '2025-11-04 11:45:22',
    lastAccess: '2025-11-04 15:05:00',
    ipAddress: '10.2.40.88',
    device: 'Edge/Windows',
  },
  {
    id: 'sess-006',
    user: 'admin',
    started: '2025-11-04 07:30:00',
    lastAccess: '2025-11-04 15:22:55',
    ipAddress: '10.2.40.1',
    device: 'Chrome/Linux',
  },
  {
    id: 'sess-007',
    user: 'jennifer.wang',
    started: '2025-11-04 13:00:15',
    lastAccess: '2025-11-04 14:45:33',
    ipAddress: '192.168.2.75',
    device: 'Chrome/Mac OS',
  },
  {
    id: 'sess-008',
    user: 'david.park',
    started: '2025-11-04 12:30:45',
    lastAccess: '2025-11-04 15:18:20',
    ipAddress: '10.2.40.105',
    device: 'Firefox/Mac OS',
  },
  {
    id: 'sess-009',
    user: 'emily.brown',
    started: '2025-11-04 09:45:00',
    lastAccess: '2025-11-04 14:30:00',
    ipAddress: '172.16.0.120',
    device: 'Safari/Mac OS',
  },
  {
    id: 'sess-010',
    user: 'robert.kim',
    started: '2025-11-04 10:00:00',
    lastAccess: '2025-11-04 15:15:45',
    ipAddress: '10.2.40.200',
    device: 'Chrome/Android',
  },
];

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function IAMActiveSessionsPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    updateActiveTabLabel('Active Sessions');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Filter sessions by search query
  const filteredSessions = mockSessions.filter(session =>
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

  // Context menu items
  const contextMenuItems: ContextMenuItem[] = [
    { id: 'terminate', label: 'Terminate session', danger: true },
    { id: 'view-details', label: 'View details' },
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'IAM', href: '/iam' },
    { label: 'Active Sessions' },
  ];

  // Table columns
  const columns: TableColumn<ActiveSession>[] = [
    {
      key: 'user',
      label: 'User',
      flex: 1,
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
      sortable: true,
    },
    {
      key: 'lastAccess',
      label: 'Last access',
      flex: 1,
      sortable: true,
    },
    {
      key: 'ipAddress',
      label: 'IP address',
      flex: 1,
      sortable: true,
    },
    {
      key: 'device',
      label: 'Device',
      flex: 1,
    },
    {
      key: 'id',
      label: 'Action',
      width: 72,
      align: 'center',
      render: (_, row) => (
        <ContextMenu items={contextMenuItems} onSelect={(itemId) => console.log(itemId, row.id)}>
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <IconAction size={16} stroke={1} />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        <TabBar
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={3}>
              {/* Header */}
              <HStack justify="between" align="center" className="w-full min-h-[28px]">
                <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                  Active Sessions
                </h1>
              </HStack>

              {/* Action Bar */}
              <VStack gap={3} className="w-full">
                <HStack gap={2} align="center">
                  {/* Search */}
                  <HStack gap={1} align="center">
                    <SearchInput
                      placeholder="Find session with filters"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[280px]"
                    />

                    {/* Refresh Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconRefresh size={16} stroke={1.5} />}
                      aria-label="Refresh"
                    />
                  </HStack>

                  {/* Divider */}
                  <div className="w-px h-4 bg-[var(--color-border-default)]" />

                  {/* Actions */}
                  <Button variant="secondary" size="sm" disabled={selectedRows.length === 0}>
                    Terminate
                  </Button>
                </HStack>

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
          </div>
        </div>
      </main>
    </div>
  );
}

