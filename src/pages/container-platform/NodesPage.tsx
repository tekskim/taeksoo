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
import { nodes, getPlatformStatusTheme, clusterFilterOptions } from './containerPlatformMockData';
import type { ClusterNode, NodeStatus } from './containerPlatformTypes';

/* ----------------------------------------
   Nodes list (Phase 6)

   Read-only cross-cluster node inventory (NODE-01). Status rendered as a themed
   Badge (NODE-02). Search by node name + structured filters for cluster and
   status (NODE-03). Client-side pagination. Mirrors ClustersPage structure.
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

const STATUS_OPTIONS: { value: NodeStatus; label: string }[] = [
  { value: 'Ready', label: 'Ready' },
  { value: 'NotReady', label: 'NotReady' },
  { value: 'SchedulingDisabled', label: 'SchedulingDisabled' },
];

export default function NodesPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const clusterFilters = appliedFilters
      .filter((f) => f.fieldId === 'cluster')
      .map((f) => f.value);
    const statusFilters = appliedFilters.filter((f) => f.fieldId === 'status').map((f) => f.value);

    return nodes.filter((n) => {
      if (term && !n.name.toLowerCase().includes(term)) return false;
      if (clusterFilters.length > 0 && !clusterFilters.includes(n.clusterId)) return false;
      if (statusFilters.length > 0 && !statusFilters.includes(n.status)) return false;
      return true;
    });
  }, [searchValue, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredData.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const columns: TableColumn<ClusterNode>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium truncate block"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: NodeStatus) => (
        <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'roles',
      label: 'Roles',
      flex: 1,
      minWidth: columnMinWidths.roles,
      render: (value: ClusterNode['roles']) => value.join(', '),
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
      key: 'cpuCores',
      label: 'CPU',
      flex: 1,
      minWidth: columnMinWidths.cpu,
      render: (_, row) => `${row.cpuCores} cores · ${row.cpuUsagePct}%`,
    },
    {
      key: 'memoryGiB',
      label: 'Memory',
      flex: 1,
      minWidth: columnMinWidths.memory,
      render: (_, row) => `${row.memoryGiB} GiB · ${row.memUsagePct}%`,
    },
    {
      key: 'kubeletVersion',
      label: 'Kubelet Version',
      flex: 1,
      minWidth: columnMinWidths.version,
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
          breadcrumb={<Breadcrumb items={[{ label: 'Nodes' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Nodes" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                className="w-[var(--search-input-width)]"
                placeholder="Search nodes by name"
                searchValue={searchValue}
                onSearchChange={(value) => {
                  setSearchValue(value);
                  setPage(1);
                }}
                filters={[
                  {
                    id: 'cluster',
                    label: 'Cluster',
                    type: 'select',
                    options: clusterFilterOptions,
                  },
                  { id: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
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

        <Table<ClusterNode>
          columns={columns}
          data={pagedRows}
          rowKey="id"
          resizable={false}
          onRowClick={(row) => navigate(`/container-platform/nodes/${row.id}`)}
          emptyMessage="No nodes found."
        />
      </VStack>
    </PageShell>
  );
}
