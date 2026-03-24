import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { IconRefresh, IconCircleX, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface ActiveSession {
  id: string;
  user: string;
  started: string;
  lastAccess: string;
  ipAddress: string;
  device: string;
  [key: string]: unknown;
}

const mockSessions: ActiveSession[] = [
  {
    id: 'sess-001',
    user: 'thaki-kim',
    started: 'Sep 12, 2025 15:43:35',
    lastAccess: 'Sep 12, 2025 16:00:12',
    ipAddress: '192.168.1.100',
    device: 'Chrome / Windows',
  },
  {
    id: 'sess-002',
    user: 'alex.johnson',
    started: 'Sep 12, 2025 14:22:18',
    lastAccess: 'Sep 12, 2025 15:45:33',
    ipAddress: '192.168.1.101',
    device: 'Firefox / macOS',
  },
  {
    id: 'sess-003',
    user: 'sara.connor',
    started: 'Sep 12, 2025 10:15:42',
    lastAccess: 'Sep 12, 2025 14:30:27',
    ipAddress: '10.0.0.50',
    device: 'Safari / iOS',
  },
  {
    id: 'sess-004',
    user: 'john.doe',
    started: 'Sep 12, 2025 09:30:15',
    lastAccess: 'Sep 12, 2025 12:18:44',
    ipAddress: '172.16.0.25',
    device: 'Edge / Windows',
  },
  {
    id: 'sess-005',
    user: 'jane.smith',
    started: 'Sep 12, 2025 08:45:22',
    lastAccess: 'Sep 12, 2025 15:52:08',
    ipAddress: '192.168.2.50',
    device: 'Chrome / macOS',
  },
  {
    id: 'sess-006',
    user: 'mike.wilson',
    started: 'Sep 11, 2025 22:10:33',
    lastAccess: 'Sep 12, 2025 08:25:15',
    ipAddress: '10.0.1.100',
    device: 'Firefox / Linux',
  },
  {
    id: 'sess-007',
    user: 'emily.chen',
    started: 'Sep 11, 2025 18:30:45',
    lastAccess: 'Sep 12, 2025 10:15:22',
    ipAddress: '192.168.3.75',
    device: 'Chrome / Android',
  },
  {
    id: 'sess-008',
    user: 'david.lee',
    started: 'Sep 11, 2025 14:22:18',
    lastAccess: 'Sep 12, 2025 09:42:33',
    ipAddress: '172.16.1.50',
    device: 'Safari / macOS',
  },
  {
    id: 'sess-009',
    user: 'lisa.park',
    started: 'Sep 11, 2025 10:15:42',
    lastAccess: 'Sep 11, 2025 22:30:15',
    ipAddress: '10.0.2.25',
    device: 'Edge / macOS',
  },
  {
    id: 'sess-010',
    user: 'chris.taylor',
    started: 'Sep 11, 2025 08:45:22',
    lastAccess: 'Sep 11, 2025 18:15:44',
    ipAddress: '192.168.4.100',
    device: 'Chrome / Linux',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'user', label: 'User', type: 'input', placeholder: 'Enter username...' },
  { key: 'ipAddress', label: 'IP Address', type: 'input', placeholder: 'Enter IP address...' },
  { key: 'device', label: 'Device', type: 'input', placeholder: 'Enter device...' },
];

export function IAMActiveSessionsPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  const filteredSessions = useMemo(() => {
    if (appliedFilters.length === 0) return mockSessions;
    return mockSessions.filter((s) =>
      appliedFilters.every((f) => {
        const val = String(s[f.key] ?? '').toLowerCase();
        return val.includes(String(f.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const hasSelection = selectedRows.length > 0;

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const columns: TableColumn[] = [
    { key: 'user', header: 'User', sortable: true },
    { key: 'started', header: 'Started', sortable: true },
    { key: 'lastAccess', header: 'Last access', sortable: true },
    { key: 'ipAddress', header: 'IP address', sortable: true },
    { key: 'device', header: 'Device' },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Active sessions" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search sessions by attributes"
            defaultFilterKey="user"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Refresh">
            <IconRefresh size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
            <IconCircleX size={12} /> Terminate
          </Button>
        </div>
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
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
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
        totalCount={filteredSessions.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<ActiveSession>
        columns={columns}
        rows={paginatedSessions}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
      >
        {paginatedSessions.map((session) => (
          <Table.Tr key={session.id} rowData={session}>
            <Table.Td rowData={session} column={columns[0]}>
              <Link
                to={`/iam/users/${session.user}`}
                className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
              >
                {session.user}
              </Link>
            </Table.Td>
            <Table.Td rowData={session} column={columns[1]}>
              {session.started}
            </Table.Td>
            <Table.Td rowData={session} column={columns[2]}>
              {session.lastAccess}
            </Table.Td>
            <Table.Td rowData={session} column={columns[3]}>
              {session.ipAddress}
            </Table.Td>
            <Table.Td rowData={session} column={columns[4]}>
              {session.device}
            </Table.Td>
            <Table.Td rowData={session} column={columns[5]} preventClickPropagation>
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
                <ContextMenu.Item action={() => {}} danger>
                  Terminate this session
                </ContextMenu.Item>
                <ContextMenu.Item action={() => {}} danger>
                  Terminate all sessions of this user
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}
