import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type SnapshotStatus = 'active' | 'creating' | 'error' | 'deleting';

interface InstanceSnapshot {
  id: string;
  name: string;
  status: SnapshotStatus;
  size: string;
  diskFormat: string;
  sourceInstance: string;
  sourceInstanceId: string;
  description: string;
  createdAt: string;
}

const mockSnapshots: InstanceSnapshot[] = [
  {
    id: 'snap-001',
    name: 'Ubuntu-22.04-base',
    status: 'active',
    size: '16GiB',
    diskFormat: 'RAW',
    sourceInstance: 'web-server-01',
    sourceInstanceId: 'vm-001',
    description: 'Base web server snapshot',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'snap-002',
    name: 'CentOS-8-web',
    status: 'active',
    size: '32GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'db-server-01',
    sourceInstanceId: 'vm-002',
    description: 'Database server backup',
    createdAt: 'Sep 10, 2025 01:17:01',
  },
  {
    id: 'snap-003',
    name: 'Debian-12-db',
    status: 'active',
    size: '64GiB',
    diskFormat: 'RAW',
    sourceInstance: 'app-server-01',
    sourceInstanceId: 'vm-003',
    description: 'Application server snapshot',
    createdAt: 'Sep 8, 2025 11:51:27',
  },
  {
    id: 'snap-004',
    name: 'Rocky-9-ml',
    status: 'creating',
    size: '128GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'ml-worker-01',
    sourceInstanceId: 'vm-004',
    description: 'ML worker with GPU config',
    createdAt: 'Sep 7, 2025 04:38:10',
  },
  {
    id: 'snap-005',
    name: 'Ubuntu-22.04-k8s',
    status: 'active',
    size: '24GiB',
    diskFormat: 'RAW',
    sourceInstance: 'k8s-node-01',
    sourceInstanceId: 'vm-005',
    description: 'Kubernetes node snapshot',
    createdAt: 'Sep 5, 2025 14:12:36',
  },
  {
    id: 'snap-006',
    name: 'Alpine-3.18-minimal',
    status: 'active',
    size: '8GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'gateway-01',
    sourceInstanceId: 'vm-006',
    description: 'Gateway server backup',
    createdAt: 'Sep 3, 2025 00:46:02',
  },
  {
    id: 'snap-007',
    name: 'Windows-Server-2022',
    status: 'active',
    size: '80GiB',
    diskFormat: 'RAW',
    sourceInstance: 'win-server-01',
    sourceInstanceId: 'vm-007',
    description: 'Windows server snapshot',
    createdAt: 'Sep 1, 2025 10:20:28',
  },
  {
    id: 'snap-008',
    name: 'RHEL-8-enterprise',
    status: 'error',
    size: '48GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'enterprise-01',
    sourceInstanceId: 'vm-008',
    description: 'Enterprise app backup',
    createdAt: 'Aug 28, 2025 07:11:07',
  },
  {
    id: 'snap-009',
    name: 'Fedora-39-dev',
    status: 'active',
    size: '20GiB',
    diskFormat: 'RAW',
    sourceInstance: 'dev-server-01',
    sourceInstanceId: 'vm-009',
    description: 'Development environment',
    createdAt: 'Aug 25, 2025 10:32:16',
  },
  {
    id: 'snap-010',
    name: 'Ubuntu-20.04-legacy',
    status: 'active',
    size: '40GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'legacy-app-01',
    sourceInstanceId: 'vm-010',
    description: 'Legacy application backup',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
  {
    id: 'snap-011',
    name: 'Arch-Linux-custom',
    status: 'active',
    size: '12GiB',
    diskFormat: 'RAW',
    sourceInstance: 'custom-build-01',
    sourceInstanceId: 'vm-011',
    description: 'Custom build environment',
    createdAt: 'Aug 18, 2025 09:01:17',
  },
  {
    id: 'snap-012',
    name: 'openSUSE-15-prod',
    status: 'active',
    size: '36GiB',
    diskFormat: 'QCOW2',
    sourceInstance: 'prod-server-01',
    sourceInstanceId: 'vm-012',
    description: 'Production server snapshot',
    createdAt: 'Aug 15, 2025 12:22:26',
  },
];

const statusMap: Record<SnapshotStatus, StatusVariant> = {
  active: 'active',
  creating: 'building',
  error: 'error',
  deleting: 'shutoff',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'sourceInstance',
    label: 'Source instance',
    type: 'input',
    placeholder: 'Enter source...',
  },
  {
    key: 'diskFormat',
    label: 'Disk Format',
    type: 'select',
    options: [
      { value: 'RAW', label: 'RAW' },
      { value: 'QCOW2', label: 'QCOW2' },
    ],
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

function snapMatchesFilter(s: InstanceSnapshot, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof InstanceSnapshot;
  const value = String(s[key] ?? '').toLowerCase();
  return value.includes(fv);
}

function stripTime(iso: string): string {
  return iso.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

export function ComputeInstanceSnapshotsPage() {
  const [snapshots, setSnapshots] = useState(mockSnapshots);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return snapshots;
    return snapshots.filter((s) => appliedFilters.every((f) => snapMatchesFilter(s, f)));
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

  const handleRowDelete = (row: InstanceSnapshot) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== row.id));
  };

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'diskFormat', header: 'Disk format', sortable: true },
    { key: 'sourceInstance', header: 'Source instance', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Instance snapshots" />
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
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<InstanceSnapshot>
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
                <Link to={`/compute/instance-snapshots/${row.id}`} className={linkClass}>
                  {row.name}
                </Link>
                <span className="text-11 leading-16 text-text-muted">ID : {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.size}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.diskFormat}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link to={`/compute/instances/${row.sourceInstanceId}`} className={linkClass}>
                  {row.sourceInstance}
                </Link>
                <span className="text-11 leading-16 text-text-muted">
                  ID : {row.sourceInstanceId}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.description}
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
                  action={() => console.log('Create instance from snapshot:', row.id)}
                >
                  Create instance
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Create volume', row.id)}>
                  Create volume
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Edit snapshot', row.id)}>
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
    </div>
  );
}
