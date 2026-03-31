import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { CreateVolumeFromVolumeSnapshotDrawer } from '../drawers/compute/volume/CreateVolumeFromVolumeSnapshotDrawer';
import { EditVolumeSnapshotDrawer } from '../drawers/compute/volume/EditVolumeSnapshotDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type SnapshotStatus = 'active' | 'creating' | 'error' | 'deleting';

interface VolumeSnapshot {
  id: string;
  name: string;
  tenant: string;
  tenantId: string;
  host: string;
  size: string;
  sourceVolume: string;
  sourceVolumeId: string;
  createdAt: string;
  status: SnapshotStatus;
}

const mockVolumeSnapshots: VolumeSnapshot[] = [
  {
    id: 'vsnap-001',
    name: 'db-data-snap',
    tenant: 'production',
    tenantId: 'tenant-001',
    host: 'host-01',
    size: '1500GiB',
    sourceVolume: 'vol-1',
    sourceVolumeId: 'vol-001',
    createdAt: 'Sep 12, 2025 15:43:35',
    status: 'active',
  },
  {
    id: 'vsnap-002',
    name: 'app-storage-snap',
    tenant: 'admin',
    tenantId: 'tenant-002',
    host: 'host-02',
    size: '500GiB',
    sourceVolume: 'vol-2',
    sourceVolumeId: 'vol-002',
    createdAt: 'Sep 10, 2025 01:17:01',
    status: 'active',
  },
  {
    id: 'vsnap-003',
    name: 'backup-vol-snap',
    tenant: 'demo-project',
    tenantId: 'tenant-001',
    host: 'host-01',
    size: '2000GiB',
    sourceVolume: 'vol-3',
    sourceVolumeId: 'vol-003',
    createdAt: 'Sep 8, 2025 11:51:27',
    status: 'active',
  },
  {
    id: 'vsnap-004',
    name: 'log-storage-snap',
    tenant: 'engineering',
    tenantId: 'tenant-003',
    host: 'host-03',
    size: '100GiB',
    sourceVolume: 'vol-4',
    sourceVolumeId: 'vol-004',
    createdAt: 'Sep 5, 2025 14:12:36',
    status: 'creating',
  },
  {
    id: 'vsnap-005',
    name: 'cache-vol-snap',
    tenant: 'production',
    tenantId: 'tenant-002',
    host: 'host-02',
    size: '256GiB',
    sourceVolume: 'vol-5',
    sourceVolumeId: 'vol-005',
    createdAt: 'Aug 30, 2025 21:37:41',
    status: 'active',
  },
  {
    id: 'vsnap-006',
    name: 'media-storage-snap',
    tenant: 'admin',
    tenantId: 'tenant-001',
    host: 'host-01',
    size: '5000GiB',
    sourceVolume: 'vol-6',
    sourceVolumeId: 'vol-006',
    createdAt: 'Aug 25, 2025 10:32:16',
    status: 'active',
  },
  {
    id: 'vsnap-007',
    name: 'temp-vol-snap',
    tenant: 'demo-project',
    tenantId: 'tenant-003',
    host: 'host-03',
    size: '50GiB',
    sourceVolume: 'vol-7',
    sourceVolumeId: 'vol-007',
    createdAt: 'Aug 20, 2025 23:27:51',
    status: 'error',
  },
  {
    id: 'vsnap-008',
    name: 'ml-data-snap',
    tenant: 'engineering',
    size: '1000GiB',
    sourceVolume: 'vol-8',
    sourceVolumeId: 'vol-008',
    createdAt: 'Aug 15, 2025 12:22:26',
    status: 'active',
  },
  {
    id: 'vsnap-009',
    name: 'archive-vol-snap',
    tenant: 'production',
    tenantId: 'tenant-001',
    host: 'host-01',
    size: '10000GiB',
    sourceVolume: 'vol-9',
    sourceVolumeId: 'vol-009',
    createdAt: 'Aug 10, 2025 01:17:01',
    status: 'active',
  },
  {
    id: 'vsnap-010',
    name: 'boot-vol-snap',
    tenant: 'admin',
    tenantId: 'tenant-003',
    host: 'host-03',
    size: '100GiB',
    sourceVolume: 'vol-10',
    sourceVolumeId: 'vol-010',
    createdAt: 'Aug 5, 2025 14:12:36',
    status: 'deleting',
  },
];

const statusMap: Record<SnapshotStatus, StatusVariant> = {
  active: 'active',
  creating: 'building',
  error: 'error',
  deleting: 'deleting',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'tenant', label: 'Tenant', type: 'input', placeholder: 'Enter tenant...' },
  {
    key: 'sourceVolume',
    label: 'Source volume',
    type: 'input',
    placeholder: 'Enter source volume...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'creating', label: 'Creating' },
      { value: 'error', label: 'Error' },
      { value: 'deleting', label: 'Deleting' },
    ],
  },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function rowMatches(s: VolumeSnapshot, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const v = s[filter.key as keyof VolumeSnapshot];
  if (typeof v === 'string') return v.toLowerCase().includes(fv);
  return true;
}

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'tenant', label: 'Tenant', visible: true },
  { key: 'volume', label: 'Volume', visible: true },
  { key: 'size', label: 'Size', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminVolumeSnapshotsPage() {
  const [selectedSnapshot, setSelectedSnapshot] = useState<VolumeSnapshot | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createFromSnapOpen, setCreateFromSnapOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const clearSelectedSnapshot = useCallback(() => setSelectedSnapshot(null), []);

  const [snapshots, setSnapshots] = useState(mockVolumeSnapshots);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return snapshots;
    return snapshots.filter((s) => appliedFilters.every((f) => rowMatches(s, f)));
  }, [snapshots, appliedFilters]);

  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage, itemsPerPage]
  );

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const handleBulkDelete = () => {
    setSnapshots((prev) => prev.filter((s) => !selectedRows.includes(s.id)));
    setSelectedRows([]);
  };

  const handleRowDelete = (row: VolumeSnapshot) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== row.id));
  };

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 64, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'tenant', header: 'Tenant', sortable: true },
    { key: 'host', header: 'Host', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'sourceVolume', header: 'Source volume' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Volume snapshots" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search snapshot by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button
          appearance="outline"
          variant="muted"
          size="sm"
          disabled={!hasSelection}
          onClick={handleBulkDelete}
        >
          <IconTrash size={12} /> Delete
        </Button>
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
                  aria-label={`Remove ${filter.label}`}
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
        totalCount={filteredRows.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<VolumeSnapshot>
        columns={columns}
        rows={paginatedRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link to={`/compute-admin/volume-snapshots/${row.id}`} className={linkClass}>
                  {row.name}
                </Link>
                <span className="text-11 leading-16 text-text-muted">{row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/tenants/${row.tenantId}`}
                  className={linkClass}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.tenant}
                </Link>
                <span className="text-11 leading-16 text-text-muted">ID: {row.tenantId}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              <span className="text-12 text-text truncate" title={row.host}>
                {row.host}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.size}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link to={`/compute-admin/volumes/${row.sourceVolumeId}`} className={linkClass}>
                  {row.sourceVolume}
                </Link>
                <span className="text-11 leading-16 text-text-muted">
                  ID : {row.sourceVolumeId}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {stripTime(row.createdAt)}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]} preventClickPropagation>
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
                <ContextMenu.Item
                  action={() => {
                    setSelectedSnapshot(row);
                    setCreateFromSnapOpen(true);
                  }}
                >
                  Create volume
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Manage metadata:', row.id)}>
                  Manage metadata
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedSnapshot(row);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item action={() => handleRowDelete(row)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
      <EditVolumeSnapshotDrawer
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          clearSelectedSnapshot();
        }}
        snapshotId={selectedSnapshot?.id}
        initialData={
          selectedSnapshot
            ? { name: selectedSnapshot.name, description: '' }
            : { name: '', description: '' }
        }
      />
      <CreateVolumeFromVolumeSnapshotDrawer
        isOpen={createFromSnapOpen}
        onClose={() => {
          setCreateFromSnapOpen(false);
          clearSelectedSnapshot();
        }}
        snapshotName={selectedSnapshot?.name}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
