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
  IconBell,
  IconPlayerPlay,
  IconPlayerStop,
  IconPlus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type TaskStatus = 'running' | 'scheduled' | 'completed' | 'failed' | 'paused';

interface ScheduledTask {
  id: string;
  name: string;
  status: TaskStatus;
  type: 'Snapshot' | 'Resize' | 'Restart' | 'Backup' | 'Cleanup';
  target: string;
  schedule: string;
  lastExecution: string;
  nextExecution: string;
  createdBy: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTasks: ScheduledTask[] = [
  {
    id: 'task-001',
    name: 'Auto-snapshot DB volumes',
    status: 'scheduled',
    type: 'Snapshot',
    target: 'db-data, db-logs',
    schedule: 'Daily at 02:00 UTC',
    lastExecution: 'Nov 10, 2025 02:00',
    nextExecution: 'Nov 11, 2025 02:00',
    createdBy: 'admin',
    createdAt: 'Oct 1, 2025 09:23:41',
  },
  {
    id: 'task-002',
    name: 'Weekly instance restart',
    status: 'scheduled',
    type: 'Restart',
    target: 'web-server-01, web-server-02',
    schedule: 'Sunday at 04:00 UTC',
    lastExecution: 'Nov 9, 2025 04:00',
    nextExecution: 'Nov 16, 2025 04:00',
    createdBy: 'devops',
    createdAt: 'Sep 20, 2025 14:07:22',
  },
  {
    id: 'task-003',
    name: 'Temp file cleanup',
    status: 'running',
    type: 'Cleanup',
    target: 'All instances',
    schedule: 'Every 6 hours',
    lastExecution: 'Nov 10, 2025 12:00',
    nextExecution: 'Nov 10, 2025 18:00',
    createdBy: 'system',
    createdAt: 'Aug 15, 2025 11:45:33',
  },
  {
    id: 'task-004',
    name: 'Scale-down dev instances',
    status: 'paused',
    type: 'Resize',
    target: 'dev-*',
    schedule: 'Weekdays at 20:00 UTC',
    lastExecution: 'Nov 8, 2025 20:00',
    nextExecution: '-',
    createdBy: 'admin',
    createdAt: 'Oct 15, 2025 16:52:08',
  },
  {
    id: 'task-005',
    name: 'Nightly backup - prod',
    status: 'completed',
    type: 'Backup',
    target: 'prod-*',
    schedule: 'Daily at 01:00 UTC',
    lastExecution: 'Nov 10, 2025 01:00',
    nextExecution: 'Nov 11, 2025 01:00',
    createdBy: 'admin',
    createdAt: 'Jul 1, 2025 08:30:15',
  },
  {
    id: 'task-006',
    name: 'GPU node snapshot',
    status: 'failed',
    type: 'Snapshot',
    target: 'gpu-node-01, gpu-node-02',
    schedule: 'Every 12 hours',
    lastExecution: 'Nov 10, 2025 00:00',
    nextExecution: 'Nov 10, 2025 12:00',
    createdBy: 'ml-team',
    createdAt: 'Nov 1, 2025 13:19:44',
  },
  {
    id: 'task-007',
    name: 'Log rotation',
    status: 'scheduled',
    type: 'Cleanup',
    target: 'monitoring-*, logging-*',
    schedule: 'Daily at 03:00 UTC',
    lastExecution: 'Nov 10, 2025 03:00',
    nextExecution: 'Nov 11, 2025 03:00',
    createdBy: 'system',
    createdAt: 'Jun 1, 2025 10:41:27',
  },
  {
    id: 'task-008',
    name: 'Scale-up prod instances',
    status: 'scheduled',
    type: 'Resize',
    target: 'prod-api-*',
    schedule: 'Weekdays at 08:00 UTC',
    lastExecution: 'Nov 10, 2025 08:00',
    nextExecution: 'Nov 11, 2025 08:00',
    createdBy: 'admin',
    createdAt: 'Oct 15, 2025 16:52:08',
  },
];

/* ----------------------------------------
   Status Config
   ---------------------------------------- */

const statusMap: Record<TaskStatus, 'active' | 'building' | 'paused' | 'error' | 'shutoff'> = {
  running: 'active',
  scheduled: 'building',
  completed: 'shutoff',
  failed: 'error',
  paused: 'paused',
};

/* ----------------------------------------
   Scheduled Tasks Page
   ---------------------------------------- */

export function ScheduledTasksPage() {
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    updateActiveTabLabel('Scheduled Tasks');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;
  const rowsPerPage = 10;
  const totalPages = Math.ceil(mockTasks.length / rowsPerPage);
  const paginatedData = mockTasks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getContextMenuItems = (row: ScheduledTask): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit task', onClick: () => console.log('Edit:', row.id) },
    { id: 'run-now', label: 'Run now', onClick: () => console.log('Run now:', row.id) },
    {
      id: row.status === 'paused' ? 'resume' : 'pause',
      label: row.status === 'paused' ? 'Resume' : 'Pause',
      onClick: () => console.log('Toggle:', row.id),
    },
    { id: 'view-logs', label: 'View execution logs', onClick: () => console.log('Logs:', row.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete:', row.id),
    },
  ];

  const typeColors: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'muted'> = {
    Snapshot: 'info',
    Resize: 'warning',
    Restart: 'danger',
    Backup: 'success',
    Cleanup: 'muted',
  };

  const columns: TableColumn<ScheduledTask>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Task Name',
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
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: 80,
      render: (value: string) => (
        <Badge variant={typeColors[value] || 'muted'} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'target',
      label: 'Target',
      flex: 2,
      minWidth: 120,
    },
    {
      key: 'schedule',
      label: 'Schedule',
      flex: 2,
      minWidth: 140,
    },
    {
      key: 'lastExecution',
      label: 'Last Run',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'nextExecution',
      label: 'Next Run',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
    },
    {
      key: 'createdBy',
      label: 'Created by',
      flex: 1,
      minWidth: 80,
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
              items={[{ label: 'Proj-1', href: '/compute' }, { label: 'Scheduled Tasks' }]}
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
          title="Scheduled Tasks"
          actions={
            <Button size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
              Create Task
            </Button>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search tasks by name"
                size="sm"
                className="w-[var(--search-input-width)]"
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
                leftIcon={<IconPlayerStop size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Pause
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
          totalItems={mockTasks.length}
          selectedCount={selectedRows.length}
        />

        <Table<ScheduledTask>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No scheduled tasks found"
        />
      </VStack>
    </PageShell>
  );
}

export default ScheduledTasksPage;
