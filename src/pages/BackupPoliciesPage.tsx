import { useState, useEffect } from 'react';
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
  StatusIndicator,
  Badge,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
  IconPlayerPlay,
  IconPlus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type PolicyStatus = 'active' | 'paused' | 'error';

interface BackupPolicy {
  id: string;
  name: string;
  status: PolicyStatus;
  schedule: string;
  retention: string;
  targetCount: number;
  lastRun: string;
  nextRun: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPolicies: BackupPolicy[] = [
  {
    id: 'bp-001',
    name: 'daily-db-backup',
    status: 'active',
    schedule: 'Every day at 02:00 UTC',
    retention: '30 days',
    targetCount: 3,
    lastRun: 'Nov 10, 2025 02:00',
    nextRun: 'Nov 11, 2025 02:00',
    createdAt: 'Oct 1, 2025 10:20:28',
  },
  {
    id: 'bp-002',
    name: 'weekly-full-backup',
    status: 'active',
    schedule: 'Every Sunday at 00:00 UTC',
    retention: '90 days',
    targetCount: 12,
    lastRun: 'Nov 9, 2025 00:00',
    nextRun: 'Nov 16, 2025 00:00',
    createdAt: 'Sep 15, 2025 12:22:26',
  },
  {
    id: 'bp-003',
    name: 'hourly-log-snapshot',
    status: 'active',
    schedule: 'Every hour',
    retention: '7 days',
    targetCount: 2,
    lastRun: 'Nov 10, 2025 14:00',
    nextRun: 'Nov 10, 2025 15:00',
    createdAt: 'Oct 20, 2025 23:27:51',
  },
  {
    id: 'bp-004',
    name: 'monthly-archive',
    status: 'paused',
    schedule: '1st of every month at 03:00 UTC',
    retention: '365 days',
    targetCount: 8,
    lastRun: 'Nov 1, 2025 03:00',
    nextRun: '-',
    createdAt: 'Aug 1, 2025 10:20:28',
  },
  {
    id: 'bp-005',
    name: 'staging-backup',
    status: 'error',
    schedule: 'Every day at 04:00 UTC',
    retention: '14 days',
    targetCount: 5,
    lastRun: 'Nov 9, 2025 04:00',
    nextRun: 'Nov 11, 2025 04:00',
    createdAt: 'Oct 10, 2025 01:17:01',
  },
  {
    id: 'bp-006',
    name: 'gpu-cluster-snapshot',
    status: 'active',
    schedule: 'Every 6 hours',
    retention: '3 days',
    targetCount: 4,
    lastRun: 'Nov 10, 2025 12:00',
    nextRun: 'Nov 10, 2025 18:00',
    createdAt: 'Nov 1, 2025 10:20:28',
  },
];

/* ----------------------------------------
   Status Config
   ---------------------------------------- */

const statusMap: Record<PolicyStatus, 'active' | 'paused' | 'error'> = {
  active: 'active',
  paused: 'paused',
  error: 'error',
};

/* ----------------------------------------
   Backup Policies Page
   ---------------------------------------- */

export function BackupPoliciesPage() {
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    updateActiveTabLabel('Backup Policies');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;
  const rowsPerPage = 10;
  const totalPages = Math.ceil(mockPolicies.length / rowsPerPage);
  const paginatedData = mockPolicies.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getContextMenuItems = (row: BackupPolicy): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit policy', onClick: () => console.log('Edit:', row.id) },
    {
      id: 'run-now',
      label: 'Run now',
      onClick: () => console.log('Run now:', row.id),
    },
    {
      id: row.status === 'paused' ? 'resume' : 'pause',
      label: row.status === 'paused' ? 'Resume' : 'Pause',
      onClick: () => console.log('Toggle:', row.id),
    },
    { id: 'view-history', label: 'View history', onClick: () => console.log('History:', row.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete:', row.id),
    },
  ];

  const columns: TableColumn<BackupPolicy>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Policy Name',
      flex: 2,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span className="text-label-md text-[var(--color-action-primary)] hover:underline cursor-pointer">
          {value}
        </span>
      ),
    },
    {
      key: 'schedule',
      label: 'Schedule',
      flex: 2,
      minWidth: 160,
    },
    {
      key: 'retention',
      label: 'Retention',
      flex: 1,
      minWidth: 80,
    },
    {
      key: 'targetCount',
      label: 'Targets',
      flex: 1,
      minWidth: 70,
      sortable: true,
      render: (value: number) => (
        <Badge variant="muted" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'lastRun',
      label: 'Last Run',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'nextRun',
      label: 'Next Run',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
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
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Proj-1', href: '/compute' }, { label: 'Backup Policies' }]}
            />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Backup Policies"
          actions={
            <Button size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
              Create Policy
            </Button>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search policies by name"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} stroke={1.5} />}
                aria-label="Export"
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Run Now
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={mockPolicies.length}
          selectedCount={selectedRows.length}
        />

        <Table<BackupPolicy>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No backup policies found"
        />
      </VStack>
    </PageShell>
  );
}

export default BackupPoliciesPage;
