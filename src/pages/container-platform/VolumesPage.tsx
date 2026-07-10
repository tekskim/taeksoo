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
  type BadgeProps,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { useNavigate } from 'react-router-dom';
import {
  ContainerPlatformSidebar,
  CONTAINER_PLATFORM_SIDEBAR_WIDTH,
} from './ContainerPlatformSidebar';
import { getVolumes, clusters, getPlatformStatusTheme } from './containerPlatformMockData';
import type { Volume, VolumeKind, VolumeStatus, ManagedBy } from './containerPlatformTypes';

/* ----------------------------------------
   Volumes list (Metis Run absorption)

   Read-only cross-cluster volume inventory. The Container Platform owns the
   volume plane, but each volume keeps its owning product (owner) and isolation
   scope so Metis/Maxis still get isolated volumes. Search by volume name with
   client-side pagination plus structured filters for owner, status, and cluster.
   Mirrors NamespacesPage / WorkloadsPage structure.
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

// Owner (managing product) badge theme. Small explicit map — reusable pattern
// so Workloads' "Managed by" column can mirror it.
const OWNER_THEME: Record<ManagedBy, BadgeProps['theme']> = {
  Aegis: 'blue',
  Maxis: 'green',
  Metis: 'yellow',
  'Metis Run': 'gray',
  Devspace: 'blue',
};

const OWNER_OPTIONS: { value: ManagedBy; label: string }[] = [
  { value: 'Aegis', label: 'Aegis' },
  { value: 'Maxis', label: 'Maxis' },
  { value: 'Metis', label: 'Metis' },
  { value: 'Metis Run', label: 'Metis Run' },
  { value: 'Devspace', label: 'Devspace' },
];

const STATUS_OPTIONS: { value: VolumeStatus; label: string }[] = [
  { value: 'Bound', label: 'Bound' },
  { value: 'Available', label: 'Available' },
  { value: 'Released', label: 'Released' },
  { value: 'Pending', label: 'Pending' },
];

const CLUSTER_OPTIONS = clusters.map((c) => ({ value: c.id, label: c.name }));

export default function VolumesPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const allVolumes = useMemo(() => getVolumes(), []);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const ownerFilters = appliedFilters.filter((f) => f.fieldId === 'owner').map((f) => f.value);
    const statusFilters = appliedFilters.filter((f) => f.fieldId === 'status').map((f) => f.value);
    const clusterFilters = appliedFilters
      .filter((f) => f.fieldId === 'cluster')
      .map((f) => f.value);

    return allVolumes.filter((v) => {
      if (term && !v.name.toLowerCase().includes(term)) return false;
      if (ownerFilters.length > 0 && !ownerFilters.includes(v.owner)) return false;
      if (statusFilters.length > 0 && !statusFilters.includes(v.status)) return false;
      if (clusterFilters.length > 0 && !clusterFilters.includes(v.clusterId)) return false;
      return true;
    });
  }, [allVolumes, searchValue, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredData.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const columns: TableColumn<Volume>[] = [
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
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: VolumeKind) => (
        <Badge theme={value === 'PV' ? 'blue' : 'gray'} type="subtle" size="sm">
          {value}
        </Badge>
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
      key: 'owner',
      label: 'Owner',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: ManagedBy) => (
        <Badge theme={OWNER_THEME[value]} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'capacityGiB',
      label: 'Capacity',
      flex: 1,
      minWidth: columnMinWidths.capacity,
      render: (value: number) => `${value} GiB`,
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (value: VolumeStatus) => (
        <Badge theme={getPlatformStatusTheme(value)} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'storageClass',
      label: 'Storage Class',
      flex: 1,
      minWidth: columnMinWidths.storageClass,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'accessMode',
      label: 'Access Mode',
      flex: 1,
      minWidth: columnMinWidths.accessModes,
    },
    {
      key: 'isolation',
      label: 'Isolation',
      flex: 1,
      minWidth: columnMinWidths.namespace,
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
          breadcrumb={<Breadcrumb items={[{ label: 'Volumes' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={3}>
        <PageHeader title="Volumes" />
        <p className="text-body-sm text-[var(--color-text-subtle)] -mt-2">
          Volumes absorbed from Metis Run — Container Platform owns the plane; each volume keeps its
          owner and isolation.
        </p>

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                className="w-[var(--search-input-width)]"
                placeholder="Search volumes by name"
                searchValue={searchValue}
                onSearchChange={(value) => {
                  setSearchValue(value);
                  setPage(1);
                }}
                filters={[
                  { id: 'owner', label: 'Owner', type: 'select', options: OWNER_OPTIONS },
                  { id: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
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

        <Table<Volume>
          columns={columns}
          data={pagedRows}
          rowKey="id"
          resizable={false}
          emptyMessage="No volumes found."
        />
      </VStack>
    </PageShell>
  );
}
