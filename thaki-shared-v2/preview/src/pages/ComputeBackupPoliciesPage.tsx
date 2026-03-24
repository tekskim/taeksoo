import { useState, useMemo, useCallback } from 'react';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { IconDownload, IconPlayerPlay, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

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

const statusMap: Record<PolicyStatus, StatusVariant> = {
  active: 'active',
  paused: 'paused',
  error: 'error',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Search policies by name' },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'schedule', label: 'Schedule', visible: true },
  { key: 'retention', label: 'Retention', visible: true },
  { key: 'enabled', label: 'Enabled', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

function policyMatches(p: BackupPolicy, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  return p.name.toLowerCase().includes(fv);
}

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

export function ComputeBackupPoliciesPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return mockPolicies;
    return mockPolicies.filter((p) => appliedFilters.every((f) => policyMatches(p, f)));
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
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Policy Name', sortable: true },
    { key: 'schedule', header: 'Schedule' },
    { key: 'retention', header: 'Retention' },
    { key: 'targetCount', header: 'Targets', sortable: true },
    { key: 'lastRun', header: 'Last Run', sortable: true },
    { key: 'nextRun', header: 'Next Run' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Backup Policies" />
        <Button variant="primary" size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
          Create Policy
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search policies by name"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Export">
            <IconDownload size={12} stroke={1.5} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="secondary" size="sm" disabled={!hasSelection}>
          <IconPlayerPlay size={12} stroke={1.5} /> Run Now
        </Button>
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
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

      <SelectableTable<BackupPolicy>
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
              <span className="text-12 leading-18 font-medium text-primary hover:underline cursor-pointer">
                {row.name}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.schedule}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.retention}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              <Badge theme="gry" size="sm" type="subtle">
                {row.targetCount}
              </Badge>
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.lastRun}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.nextRun}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              {stripTime(row.createdAt)}
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
                  Edit policy
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Run now:', row.id)}>
                  Run now
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Toggle:', row.id)}>
                  {row.status === 'paused' ? 'Resume' : 'Pause'}
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('History:', row.id)}>
                  View history
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete:', row.id)} danger>
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
    </div>
  );
}
