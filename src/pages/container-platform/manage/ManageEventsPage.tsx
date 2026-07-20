import { useState, useMemo } from 'react';
import {
  PageHeader,
  VStack,
  Badge,
  Table,
  Pagination,
  ListToolbar,
  FilterSearchInput,
  type AppliedFilter,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ManageShell, useManageCluster } from './ManageShell';
import { getEventsByCluster, getPlatformStatusTheme } from '../containerPlatformMockData';
import type { ClusterEvent, EventType } from '../containerPlatformTypes';

/* ----------------------------------------
   Cluster manage — Events (this cluster's event stream)
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

const TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Warning', label: 'Warning' },
];

function formatAge(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function ManageEventsPage() {
  const { clusterId } = useManageCluster();
  const allRows = useMemo(() => getEventsByCluster(clusterId), [clusterId]);

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const typeFilters = appliedFilters.filter((f) => f.fieldId === 'type').map((f) => f.value);

    return allRows.filter((e) => {
      if (
        term &&
        !e.objectName.toLowerCase().includes(term) &&
        !e.message.toLowerCase().includes(term)
      )
        return false;
      if (typeFilters.length > 0 && !typeFilters.includes(e.type)) return false;
      return true;
    });
  }, [allRows, searchValue, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredData.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const columns: TableColumn<ClusterEvent>[] = [
    {
      key: 'type',
      label: 'Type',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: EventType) => (
        <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      flex: 1,
      minWidth: columnMinWidths.type,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'objectName',
      label: 'Object',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_, row) => (
        <span className="truncate block" title={`${row.objectKind}/${row.objectName}`}>
          {row.objectKind}/{row.objectName}
        </span>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      flex: 2,
      minWidth: columnMinWidths.name,
      render: (value: string) => (
        <span className="truncate block text-[var(--color-text-muted)]" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'ageMinutes',
      label: 'Age',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
      render: (value: number) => formatAge(value),
    },
  ];

  return (
    <ManageShell clusterId={clusterId} crumb="Events">
      <VStack gap={3}>
        <PageHeader title="Events" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                className="w-[var(--search-input-width)]"
                placeholder="Search events by object or message"
                searchValue={searchValue}
                onSearchChange={(value) => {
                  setSearchValue(value);
                  setPage(1);
                }}
                filters={[{ id: 'type', label: 'Type', type: 'select', options: TYPE_OPTIONS }]}
                appliedFilters={appliedFilters}
                onFiltersChange={(next) => {
                  setAppliedFilters(next);
                  setPage(1);
                }}
              />
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredData.length}
        />

        <Table<ClusterEvent>
          columns={columns}
          data={pagedRows}
          rowKey="id"
          resizable={false}
          emptyMessage="No events in this cluster."
        />
      </VStack>
    </ManageShell>
  );
}
