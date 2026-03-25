import { useState, useMemo, useCallback } from 'react';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { ActionModal } from '@shared/components/ActionModal';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { IconPlayerPlay, IconPlayerStop, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

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

const statusMap: Record<TaskStatus, StatusVariant> = {
  running: 'active',
  scheduled: 'building',
  completed: 'shutoff',
  failed: 'error',
  paused: 'paused',
};

const typeThemes: Record<string, 'blu' | 'ylw' | 'red' | 'gre' | 'gry'> = {
  Snapshot: 'blu',
  Resize: 'ylw',
  Restart: 'red',
  Backup: 'gre',
  Cleanup: 'gry',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Search tasks by name' },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'schedule', label: 'Schedule', visible: true },
  { key: 'lastRun', label: 'Last Run', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

function taskMatches(t: ScheduledTask, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  return t.name.toLowerCase().includes(fv);
}

export function ComputeScheduledTasksPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ScheduledTask | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return mockTasks;
    return mockTasks.filter((t) => appliedFilters.every((f) => taskMatches(t, f)));
  }, [appliedFilters]);

  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage, itemsPerPage]
  );

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 64, align: 'center' },
    { key: 'name', header: 'Task Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'target', header: 'Target' },
    { key: 'schedule', header: 'Schedule' },
    { key: 'lastExecution', header: 'Last Run', sortable: true },
    { key: 'nextExecution', header: 'Next Run' },
    { key: 'createdBy', header: 'Created by' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  const nameClass =
    'text-12 leading-18 font-medium text-primary hover:underline cursor-pointer no-underline';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Scheduled Tasks" />
        <Button variant="primary" size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
          Create Task
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <FilterSearchInput
          filterKeys={filterKeys}
          onFilterAdd={handleFilterAdd}
          selectedFilters={appliedFilters}
          placeholder="Search tasks by name"
          defaultFilterKey="name"
        />
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="secondary" size="sm" disabled={!hasSelection}>
          <IconPlayerPlay size={12} stroke={1.5} /> Run Now
        </Button>
        <Button appearance="outline" variant="secondary" size="sm" disabled={!hasSelection}>
          <IconPlayerStop size={12} stroke={1.5} /> Pause
        </Button>
        <Button
          appearance="outline"
          variant="muted"
          size="sm"
          disabled={!hasSelection}
          onClick={() => setBulkDeleteOpen(true)}
        >
          <IconTrash size={12} stroke={1.5} /> Delete
        </Button>
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
          <div className="flex items-center gap-1 flex-wrap">
            {appliedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
              >
                <span className="flex items-center gap-1">
                  <span className="text-text">{filter.label}</span>
                  <span className="text-border">|</span>
                  <span className="text-text">{filter.displayValue ?? filter.value}</span>
                </span>
                <button
                  type="button"
                  className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                  onClick={() => handleFilterRemove(filter.id!)}
                  aria-label={`Remove ${filter.label}`}
                >
                  <IconX size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
            onClick={() => {
              setAppliedFilters([]);
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <Pagination
        totalCount={filteredRows.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<ScheduledTask>
        columns={columns}
        rows={paginatedRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <span className={nameClass}>{row.name}</span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <Badge theme={typeThemes[row.type] ?? 'gry'} size="sm" type="subtle">
                {row.type}
              </Badge>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.target}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.schedule}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.lastExecution}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.nextExecution}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              {row.createdBy}
            </Table.Td>
            <Table.Td rowData={row} column={columns[8]} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              >
                <ContextMenu.Item action={() => console.log('Edit:', row.id)}>
                  Edit task
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Run now:', row.id)}>
                  Run now
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Toggle:', row.id)}>
                  {row.status === 'paused' ? 'Resume' : 'Pause'}
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Logs:', row.id)}>
                  View execution logs
                </ContextMenu.Item>
                <ContextMenu.Item action={() => setDeleteTarget(row)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
      <ActionModal
        appeared={!!deleteTarget}
        actionConfig={{
          title: 'Delete scheduled task',
          subtitle: `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`,
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
        }}
        onConfirm={() => {
          console.log('[Scheduled task] Delete confirmed', deleteTarget?.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <ActionModal
        appeared={bulkDeleteOpen}
        actionConfig={{
          title: 'Delete scheduled tasks',
          subtitle: `Are you sure you want to delete ${selectedRows.length} scheduled tasks? This action cannot be undone.`,
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
        }}
        onConfirm={() => {
          console.log('[Scheduled task] Bulk delete confirmed', selectedRows);
          setBulkDeleteOpen(false);
          setSelectedRows([]);
        }}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </div>
  );
}
