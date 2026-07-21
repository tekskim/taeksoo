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
import { ContainerPlatformTabBar } from './ContainerPlatformTabBar';
import { clusters, getPlatformStatusTheme } from './containerPlatformMockData';
import type { Cluster, ClusterSource, HealthStatus } from './containerPlatformTypes';

/* ----------------------------------------
   Clusters list (Phase 4)

   Read-only cross-cluster inventory. Search by name + structured filters for
   source (Aegis/Metis) and status (Healthy/Warning/Critical). Client-side
   pagination. Rows link to the cluster detail route.
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

const SOURCE_OPTIONS: { value: ClusterSource; label: string }[] = [
  { value: 'Aegis', label: 'Aegis' },
  { value: 'Metis', label: 'Metis' },
];

const STATUS_OPTIONS: { value: HealthStatus; label: string }[] = [
  { value: 'Healthy', label: 'Healthy' },
  { value: 'Warning', label: 'Warning' },
  { value: 'Critical', label: 'Critical' },
];

export default function ClustersPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const sourceFilters = appliedFilters.filter((f) => f.fieldId === 'source').map((f) => f.value);
    const statusFilters = appliedFilters.filter((f) => f.fieldId === 'status').map((f) => f.value);

    return clusters.filter((c) => {
      if (term && !c.name.toLowerCase().includes(term)) return false;
      if (sourceFilters.length > 0 && !sourceFilters.includes(c.source)) return false;
      if (statusFilters.length > 0 && !statusFilters.includes(c.status)) return false;
      return true;
    });
  }, [searchValue, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredData.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const columns: TableColumn<Cluster>[] = [
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
      key: 'source',
      label: 'Source',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: ClusterSource) => (
        <Badge theme={value === 'Aegis' ? 'blue' : 'gray'} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: HealthStatus) => (
        <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'k8sVersion',
      label: 'K8s Version',
      flex: 1,
      minWidth: columnMinWidths.version,
    },
    {
      key: 'nodeCount',
      label: 'Nodes',
      flex: 1,
      minWidth: columnMinWidths.roles,
      sortable: true,
    },
    {
      key: 'workloadCount',
      label: 'Workloads',
      flex: 1,
      minWidth: columnMinWidths.roles,
      sortable: true,
    },
    {
      key: 'region',
      label: 'Region',
      flex: 1,
      minWidth: columnMinWidths.name,
    },
  ];

  return (
    <PageShell
      sidebar={<ContainerPlatformSidebar />}
      sidebarWidth={CONTAINER_PLATFORM_SIDEBAR_WIDTH}
      tabBar={<ContainerPlatformTabBar />}
      topBar={
        <TopBar
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Clusters' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Clusters" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                className="w-[var(--search-input-width)]"
                placeholder="Search clusters by name"
                searchValue={searchValue}
                onSearchChange={(value) => {
                  setSearchValue(value);
                  setPage(1);
                }}
                filters={[
                  { id: 'source', label: 'Source', type: 'select', options: SOURCE_OPTIONS },
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

        <Table<Cluster>
          columns={columns}
          data={pagedRows}
          rowKey="id"
          resizable={false}
          onRowClick={(row) => navigate(`/container-platform/clusters/${row.id}`)}
          emptyMessage="No clusters found."
        />
      </VStack>
    </PageShell>
  );
}
