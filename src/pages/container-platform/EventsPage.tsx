import { useState, useMemo } from 'react';
import {
  PageShell,
  PageHeader,
  TopBar,
  Breadcrumb,
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
import { useNavigate } from 'react-router-dom';
import {
  ContainerPlatformSidebar,
  CONTAINER_PLATFORM_SIDEBAR_WIDTH,
} from './ContainerPlatformSidebar';
import { getEvents, clusters, getPlatformStatusTheme } from './containerPlatformMockData';
import type { ClusterEvent, EventType } from './containerPlatformTypes';

/* ----------------------------------------
   Events list (Phase C1b)

   Read-only cross-cluster event stream (Rancher-style). Type rendered as a themed
   Badge (Warning -> yellow, Normal -> gray). Search by reason / object name /
   message + structured filters for type and cluster. Client-side pagination.
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

const TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Warning', label: 'Warning' },
];

const CLUSTER_OPTIONS = clusters.map((c) => ({ value: c.id, label: c.name }));

/** Compact relative age: minutes under an hour, otherwise whole hours. */
function formatAge(ageMinutes: number): string {
  if (ageMinutes < 60) return `${ageMinutes}m`;
  return `${Math.floor(ageMinutes / 60)}h`;
}

export default function EventsPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const allEvents = useMemo(() => getEvents(), []);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const typeFilters = appliedFilters.filter((f) => f.fieldId === 'type').map((f) => f.value);
    const clusterFilters = appliedFilters
      .filter((f) => f.fieldId === 'cluster')
      .map((f) => f.value);

    return allEvents.filter((e) => {
      if (
        term &&
        !e.reason.toLowerCase().includes(term) &&
        !e.objectName.toLowerCase().includes(term) &&
        !e.message.toLowerCase().includes(term)
      )
        return false;
      if (typeFilters.length > 0 && !typeFilters.includes(e.type)) return false;
      if (clusterFilters.length > 0 && !clusterFilters.includes(e.clusterId)) return false;
      return true;
    });
  }, [allEvents, searchValue, appliedFilters]);

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
      minWidth: columnMinWidths.reason,
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
      minWidth: columnMinWidths.object,
      render: (_: unknown, row: ClusterEvent) => {
        const label = `${row.objectKind}/${row.objectName}`;
        return (
          <span className="truncate block" title={label}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'clusterName',
      label: 'Cluster',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'ageMinutes',
      label: 'Age',
      flex: 1,
      minWidth: columnMinWidths.duration,
      render: (value: number) => formatAge(value),
    },
    {
      key: 'message',
      label: 'Message',
      flex: 1,
      minWidth: columnMinWidths.message,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<ContainerPlatformSidebar />}
      sidebarWidth={CONTAINER_PLATFORM_SIDEBAR_WIDTH}
      topBar={
        <TopBar
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Events' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Events" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                className="w-[var(--search-input-width)]"
                placeholder="Search events by reason, object, or message"
                searchValue={searchValue}
                onSearchChange={(value) => {
                  setSearchValue(value);
                  setPage(1);
                }}
                filters={[
                  { id: 'type', label: 'Type', type: 'select', options: TYPE_OPTIONS },
                  { id: 'cluster', label: 'Cluster', type: 'select', options: CLUSTER_OPTIONS },
                ]}
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
          emptyMessage="No events found."
        />
      </VStack>
    </PageShell>
  );
}
