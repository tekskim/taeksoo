import { useState, useMemo } from 'react';
import {
  PageHeader,
  VStack,
  Badge,
  Button,
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
import { ManageShell, useManageCluster } from './ManageShell';
import { manageBasePath } from '../ClusterManageSidebar';
import {
  getWorkloadsByCluster,
  getPlatformStatusTheme,
  getManagedByTheme,
} from '../containerPlatformMockData';
import type { Workload, WorkloadKind, WorkloadStatus, ManagedBy } from '../containerPlatformTypes';

/* ----------------------------------------
   Cluster manage — Workloads

   Cluster-scoped workload list with a create entry point. Rows drill into a
   simple detail; Create Deployment opens the simplified create concept.
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

const KIND_OPTIONS: { value: WorkloadKind; label: string }[] = [
  { value: 'Deployment', label: 'Deployment' },
  { value: 'StatefulSet', label: 'StatefulSet' },
  { value: 'DaemonSet', label: 'DaemonSet' },
  { value: 'Job', label: 'Job' },
  { value: 'Pod', label: 'Pod' },
];

const STATUS_OPTIONS: { value: WorkloadStatus; label: string }[] = [
  { value: 'Running', label: 'Running' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Failed', label: 'Failed' },
  { value: 'Succeeded', label: 'Succeeded' },
];

export default function ManageWorkloadsPage() {
  const navigate = useNavigate();
  const { clusterId } = useManageCluster();
  const base = manageBasePath(clusterId);

  const allRows = useMemo(() => getWorkloadsByCluster(clusterId), [clusterId]);

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const kindFilters = appliedFilters.filter((f) => f.fieldId === 'kind').map((f) => f.value);
    const statusFilters = appliedFilters.filter((f) => f.fieldId === 'status').map((f) => f.value);

    return allRows.filter((w) => {
      if (term && !w.name.toLowerCase().includes(term)) return false;
      if (kindFilters.length > 0 && !kindFilters.includes(w.kind)) return false;
      if (statusFilters.length > 0 && !statusFilters.includes(w.status)) return false;
      return true;
    });
  }, [allRows, searchValue, appliedFilters]);

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
    { key: 'kind', label: 'Kind', flex: 1, minWidth: columnMinWidths.type },
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
    <ManageShell clusterId={clusterId} crumb="Workloads">
      <VStack gap={3}>
        <PageHeader
          title="Workloads"
          actions={
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`${base}/workloads/create`)}
            >
              Create Deployment
            </Button>
          }
        />

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

        <Table<Workload>
          columns={columns}
          data={pagedRows}
          rowKey="id"
          onRowClick={(row) => navigate(`${base}/workloads/${row.id}`)}
          resizable={false}
          emptyMessage="No workloads in this cluster."
        />
      </VStack>
    </ManageShell>
  );
}
