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
import {
  getVolumesByCluster,
  getPlatformStatusTheme,
  getManagedByTheme,
} from '../containerPlatformMockData';
import type { Volume, VolumeKind, VolumeStatus, ManagedBy } from '../containerPlatformTypes';

/* ----------------------------------------
   Cluster manage — Volumes (PV/PVC in this cluster)
   ---------------------------------------- */

const ROWS_PER_PAGE = 10;

const KIND_OPTIONS: { value: VolumeKind; label: string }[] = [
  { value: 'PV', label: 'PV' },
  { value: 'PVC', label: 'PVC' },
];

const STATUS_OPTIONS: { value: VolumeStatus; label: string }[] = [
  { value: 'Bound', label: 'Bound' },
  { value: 'Available', label: 'Available' },
  { value: 'Released', label: 'Released' },
  { value: 'Pending', label: 'Pending' },
];

export default function ManageVolumesPage() {
  const { clusterId } = useManageCluster();
  const allRows = useMemo(() => getVolumesByCluster(clusterId), [clusterId]);

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const filteredData = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    const kindFilters = appliedFilters.filter((f) => f.fieldId === 'kind').map((f) => f.value);
    const statusFilters = appliedFilters.filter((f) => f.fieldId === 'status').map((f) => f.value);

    return allRows.filter((v) => {
      if (term && !v.name.toLowerCase().includes(term)) return false;
      if (kindFilters.length > 0 && !kindFilters.includes(v.kind)) return false;
      if (statusFilters.length > 0 && !statusFilters.includes(v.status)) return false;
      return true;
    });
  }, [allRows, searchValue, appliedFilters]);

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
      key: 'owner',
      label: 'Owner',
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
    {
      key: 'capacityGiB',
      label: 'Capacity',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
      render: (value: number) => `${value} GiB`,
    },
    {
      key: 'storageClass',
      label: 'Storage class',
      flex: 1,
      minWidth: columnMinWidths.type,
      render: (value: string) => (
        <span className="truncate block" title={value}>
          {value}
        </span>
      ),
    },
    { key: 'accessMode', label: 'Access', flex: 1, minWidth: columnMinWidths.type },
  ];

  return (
    <ManageShell clusterId={clusterId} crumb="Volumes">
      <VStack gap={3}>
        <PageHeader title="Volumes" />

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

        <Table<Volume>
          columns={columns}
          data={pagedRows}
          rowKey="id"
          resizable={false}
          emptyMessage="No volumes in this cluster."
        />
      </VStack>
    </ManageShell>
  );
}
