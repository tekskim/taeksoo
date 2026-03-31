import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import {
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconX,
  IconChevronDown,
} from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function getRowFilterText(row: PersistentVolumeClaimRow, key: string): string {
  const v = row[key as keyof PersistentVolumeClaimRow];
  if (Array.isArray(v)) return v.join(' ');
  return String(v ?? '');
}

interface PersistentVolumeClaimRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  volume: string;
  capacity: string;
  accessModes: string;
  storageClass: string;
  volumeAttributesClass: string;
  createdAt: string;
  [key: string]: unknown;
}

const persistentVolumeClaimsData: PersistentVolumeClaimRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'cert-manager-tls-wildcard-production-domain-claim',
    namespace: 'default',
    volume: 'pvc-143076e7-d0b2-4d76-92fc-cea5cbe8b3a2',
    capacity: '10Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '1',
    createdAt: 'Nov 10, 2025 09:23:41',
  },
  {
    id: '2',
    status: 'True',
    name: 'data-postgresql-primary-statefulset-0-volume-claim',
    namespace: 'database',
    volume: 'pvc-abc12345-1234-5678-abcd-1234567890ab',
    capacity: '50Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '1',
    createdAt: 'Nov 9, 2025 14:07:22',
  },
  {
    id: '3',
    status: 'None',
    name: 'redis-cluster-sentinel-persistent-data-01',
    namespace: 'cache',
    volume: 'pvc-redis-data-001',
    capacity: '5Gi',
    accessModes: 'RWO',
    storageClass: 'local',
    volumeAttributesClass: '1',
    createdAt: 'Nov 8, 2025 11:45:33',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'pending-analytics-logs-storage-volume-claim',
    namespace: 'default',
    volume: '',
    capacity: '20Gi',
    accessModes: 'RWX',
    storageClass: 'nfs',
    volumeAttributesClass: '',
    createdAt: 'Nov 10, 2025 14:37:52',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'elasticsearch-cluster-data-node-statefulset-0',
    namespace: 'logging',
    volume: 'pvc-elastic-001',
    capacity: '100Gi',
    accessModes: 'RWO',
    storageClass: 'Ceph',
    volumeAttributesClass: '2',
    createdAt: 'Nov 7, 2025 16:52:08',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'namespace', label: 'Namespace', type: 'input', placeholder: 'Enter namespace...' },
  { key: 'capacity', label: 'Capacity', type: 'input', placeholder: 'Enter capacity...' },
  {
    key: 'accessModes',
    label: 'Access modes',
    type: 'input',
    placeholder: 'Enter access modes...',
  },
  {
    key: 'storageClass',
    label: 'Storage class',
    type: 'input',
    placeholder: 'Enter storage class...',
  },
  { key: 'createdAt', label: 'Created at', type: 'input', placeholder: 'Enter date...' },
];

export function ContainerPVCsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);

  const rowsPerPage = 10;

  const filteredRows = useMemo(
    () =>
      persistentVolumeClaimsData.filter((r) =>
        appliedFilters.every((f) => {
          const val = String(f.value ?? '').toLowerCase();
          if (!val) return true;
          return getRowFilterText(r, f.key).toLowerCase().includes(val);
        })
      ),
    [appliedFilters]
  );

  const paginatedData = useMemo(
    () => filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filteredRows, currentPage, rowsPerPage]
  );

  const handleFilterAdd = (filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  };

  const handleFilterRemove = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  };

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'volume', header: 'Volume', sortable: true },
    { key: 'capacity', header: 'Capacity' },
    { key: 'accessModes', header: 'Access modes' },
    { key: 'storageClass', header: 'Storage class' },
    { key: 'volumeAttributesClass', header: 'VolumeAttributesClass', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Persistent Volume Claims" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create persistent volume claim{' '}
              <IconChevronDown size={14} stroke={1.5} className="inline ml-1 align-middle" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/pvc/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/pvc/create-yaml')}>
            Create as YAML
          </ContextMenu.Item>
        </ContextMenu.Root>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search persistent volume claims by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
            <IconDownload size={12} /> Download YAML
          </Button>
          <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
            <IconTrash size={12} /> Delete
          </Button>
        </div>
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
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
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
        size={rowsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<PersistentVolumeClaimRow>
        columns={columns}
        rows={paginatedData}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
        selectOnRowClick={false}
      >
        {paginatedData.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <Tooltip content={row.status} direction="top">
                <Badge
                  theme="white"
                  size="sm"
                  className="max-w-[80px] inline-flex overflow-hidden !justify-start !text-left"
                >
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <Link
                to={`/container/pvc/${row.id}`}
                className={`${linkClass} truncate block`}
                title={row.name}
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="min-w-0 truncate block text-12 text-text" title={row.namespace}>
                {row.namespace}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.volume ? (
                <span className="truncate block w-full" title={row.volume}>
                  {row.volume}
                </span>
              ) : (
                <span className="text-text-subtle">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.capacity}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.accessModes}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.storageClass}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              {row.volumeAttributesClass ? (
                row.volumeAttributesClass
              ) : (
                <span className="text-text-subtle">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[8]}>
              {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={row} column={columns[9]} preventClickPropagation>
              <div className="flex items-center justify-center">
                <ContextMenu.Root
                  direction="bottom-end"
                  gap={4}
                  trigger={({ toggle }) => (
                    <button
                      type="button"
                      onClick={toggle}
                      className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
                      aria-label="Row actions"
                    >
                      <IconDotsCircleHorizontal
                        size={16}
                        stroke={1.5}
                        className="text-text-subtle"
                      />
                    </button>
                  )}
                >
                  <ContextMenu.Item action={() => navigate(`/container/pvc/${row.id}/edit`)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => navigate(`/container/pvc/${row.id}/edit-yaml`)}>
                    Edit YAML
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => console.log('Download YAML:', row.id)}>
                    Download YAML
                  </ContextMenu.Item>
                  <ContextMenu.Item danger action={() => console.log('Delete:', row.id)}>
                    Delete
                  </ContextMenu.Item>
                </ContextMenu.Root>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}
