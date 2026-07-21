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
import { getNamespaces, clusterFilterOptions } from './containerPlatformMockData';
import type { Namespace, ClusterSource } from './containerPlatformTypes';

/* ----------------------------------------
   Namespaces list (Phase C1a)

   Read-only cross-cluster namespace inventory derived from the workload estate.
   Search by namespace name + structured filters for cluster and source. Client-side
   pagination. Mirrors ClustersPage / NodesPage structure.
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

const SOURCE_OPTIONS: { value: ClusterSource; label: string }[] = [
  { value: 'Aegis', label: 'Aegis' },
  { value: 'Metis', label: 'Metis' },
];

export default function NamespacesPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const allNamespaces = useMemo(() => getNamespaces(), []);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const clusterFilters = appliedFilters
      .filter((f) => f.fieldId === 'cluster')
      .map((f) => f.value);
    const sourceFilters = appliedFilters.filter((f) => f.fieldId === 'source').map((f) => f.value);

    return allNamespaces.filter((ns) => {
      if (term && !ns.name.toLowerCase().includes(term)) return false;
      if (clusterFilters.length > 0 && !clusterFilters.includes(ns.clusterId)) return false;
      if (sourceFilters.length > 0 && !sourceFilters.includes(ns.source)) return false;
      return true;
    });
  }, [allNamespaces, searchValue, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredData.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const columns: TableColumn<Namespace>[] = [
    {
      key: 'name',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-text-default)] font-medium truncate block" title={value}>
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
      key: 'workloadCount',
      label: 'Workloads',
      flex: 1,
      minWidth: columnMinWidths.count,
      sortable: true,
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
          breadcrumb={<Breadcrumb items={[{ label: 'Namespaces' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Namespaces" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                className="w-[var(--search-input-width)]"
                placeholder="Search namespaces by name"
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
                  { id: 'source', label: 'Source', type: 'select', options: SOURCE_OPTIONS },
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

        <Table<Namespace>
          columns={columns}
          data={pagedRows}
          rowKey="id"
          resizable={false}
          emptyMessage="No namespaces found."
        />
      </VStack>
    </PageShell>
  );
}
