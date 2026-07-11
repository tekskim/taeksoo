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
import {
  workloads,
  clusters,
  getPlatformStatusTheme,
  getManagedByTheme,
} from './containerPlatformMockData';
import type { Workload, WorkloadKind, WorkloadStatus, ManagedBy } from './containerPlatformTypes';

/* ----------------------------------------
   Workloads list (Phases 7 + 8)

   Read-only cross-cluster workload inventory (WKL-01). Search by workload name
   with client-side pagination (WKL-03) plus structured filters for kind and
   cluster (WKL-02), combined via the same FilterSearchInput used by ClustersPage.
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

const KIND_OPTIONS: { value: WorkloadKind; label: string }[] = [
  { value: 'Deployment', label: 'Deployment' },
  { value: 'StatefulSet', label: 'StatefulSet' },
  { value: 'DaemonSet', label: 'DaemonSet' },
  { value: 'Job', label: 'Job' },
  { value: 'Pod', label: 'Pod' },
];

const MANAGED_BY_OPTIONS: { value: ManagedBy; label: string }[] = [
  { value: 'Aegis', label: 'Aegis' },
  { value: 'Maxis', label: 'Maxis' },
  { value: 'Metis', label: 'Metis' },
  { value: 'Metis Run', label: 'Metis Run' },
  { value: 'Devspace', label: 'Devspace' },
];

const CLUSTER_OPTIONS = clusters.map((c) => ({ value: c.id, label: c.name }));

export default function WorkloadsPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const kindFilters = appliedFilters.filter((f) => f.fieldId === 'kind').map((f) => f.value);
    const clusterFilters = appliedFilters
      .filter((f) => f.fieldId === 'cluster')
      .map((f) => f.value);
    const managedByFilters = appliedFilters
      .filter((f) => f.fieldId === 'managedBy')
      .map((f) => f.value);

    return workloads.filter((w) => {
      if (term && !w.name.toLowerCase().includes(term)) return false;
      if (kindFilters.length > 0 && !kindFilters.includes(w.kind)) return false;
      if (clusterFilters.length > 0 && !clusterFilters.includes(w.clusterId)) return false;
      if (managedByFilters.length > 0 && !managedByFilters.includes(w.managedBy)) return false;
      return true;
    });
  }, [searchValue, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredData.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const columns: TableColumn<Workload>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-text-default)] font-medium truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'kind',
      label: 'Kind',
      flex: 1,
      minWidth: columnMinWidths.type,
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
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: WorkloadStatus) => (
        <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'managedBy',
      label: 'Managed by',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: ManagedBy) => (
        <Badge theme={getManagedByTheme(value)} type="solid" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'ready',
      label: 'Replicas',
      flex: 1,
      minWidth: columnMinWidths.replicas,
      render: (_, row) => `${row.ready}/${row.desired}`,
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
          breadcrumb={<Breadcrumb items={[{ label: 'Workloads' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Workloads" />
        <p className="text-body-sm text-[var(--color-text-subtle)] -mt-2">
          Everything runs on the Container Platform substrate; &lsquo;Managed by&rsquo; shows which
          product owns it.
        </p>

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                className="w-[var(--search-input-width)]"
                placeholder="Search workloads by name"
                searchValue={searchValue}
                onSearchChange={(value) => {
                  setSearchValue(value);
                  setPage(1);
                }}
                filters={[
                  { id: 'kind', label: 'Kind', type: 'select', options: KIND_OPTIONS },
                  { id: 'cluster', label: 'Cluster', type: 'select', options: CLUSTER_OPTIONS },
                  {
                    id: 'managedBy',
                    label: 'Managed by',
                    type: 'select',
                    options: MANAGED_BY_OPTIONS,
                  },
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

        <Table<Workload>
          columns={columns}
          data={pagedRows}
          rowKey="id"
          resizable={false}
          emptyMessage="No workloads found."
        />
      </VStack>
    </PageShell>
  );
}
