import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Badge } from '@shared/components/Badge';
import { Title } from '@shared/components/Title';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import {
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconX,
  IconCirclePlus,
} from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type NodeStatus = 'active' | 'available' | 'deploying' | 'error' | 'maintenance';
type PowerState = 'Power On' | 'Power Off';

interface BareMetalNode extends Record<string, unknown> {
  id: string;
  name: string;
  status: NodeStatus;
  tenant: { id: string; name: string } | null;
  powerState: PowerState;
  maintained: boolean;
  cpu: number;
  ram: string;
  disk: string;
  gpu: string | null;
  npu: string | null;
}

const mockBareMetalNodes: BareMetalNode[] = [
  {
    id: '12345678',
    name: 'node',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345679',
    name: 'node',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345680',
    name: 'node',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345681',
    name: 'node',
    status: 'active',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345682',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345683',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345684',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345685',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345686',
    name: 'node',
    status: 'available',
    tenant: null,
    powerState: 'Power On',
    maintained: true,
    cpu: 32,
    ram: '128GiB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
  {
    id: '12345687',
    name: 'node',
    status: 'deploying',
    tenant: { id: '12345678', name: 'tenant' },
    powerState: 'Power On',
    maintained: false,
    cpu: 32,
    ram: '128 GB',
    disk: '2GiB',
    gpu: null,
    npu: null,
  },
];

const statusMap: Record<NodeStatus, StatusVariant> = {
  active: 'active',
  available: 'pending',
  deploying: 'building',
  error: 'error',
  maintenance: 'paused',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'available', label: 'Available' },
      { value: 'deploying', label: 'Deploying' },
      { value: 'error', label: 'Error' },
      { value: 'maintenance', label: 'Maintenance' },
    ],
  },
  {
    key: 'powerState',
    label: 'Power State',
    type: 'select',
    options: [
      { value: 'Power On', label: 'Power On' },
      { value: 'Power Off', label: 'Power Off' },
    ],
  },
];

function rowMatchesFilter(row: BareMetalNode, filter: FilterKeyWithValue): boolean {
  const raw = filter.value;
  if (raw === undefined || raw === null || raw === '') return true;
  switch (filter.key) {
    case 'name':
      return row.name.toLowerCase().includes(String(raw).toLowerCase());
    case 'status':
      return row.status === filter.value;
    case 'powerState':
      return row.powerState === filter.value;
    default:
      return true;
  }
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'tenant', label: 'Tenant', visible: true },
  { key: 'powerState', label: 'Power State', visible: true },
  { key: 'maintained', label: 'Maintained', visible: true },
  { key: 'cpu', label: 'CPU', visible: true },
  { key: 'ram', label: 'RAM', visible: true },
  { key: 'disk', label: 'Disk', visible: true },
  { key: 'gpu', label: 'GPU', visible: true },
  { key: 'npu', label: 'NPU', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeAdminBareMetalNodesPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return mockBareMetalNodes;
    return mockBareMetalNodes.filter((row) =>
      appliedFilters.every((f) => rowMatchesFilter(row, f))
    );
  }, [appliedFilters]);

  const pageRows = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasSelection = selectedRows.length > 0;

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: 72, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'tenant', header: 'Tenant', sortable: true },
      { key: 'powerState', header: 'Power State', sortable: true },
      { key: 'maintained', header: 'Maintained', sortable: true },
      { key: 'cpu', header: 'CPU', sortable: true },
      { key: 'ram', header: 'RAM', sortable: true },
      { key: 'disk', header: 'Disk', sortable: true },
      { key: 'gpu', header: 'GPU', sortable: true },
      { key: 'npu', header: 'NPU', sortable: true },
      { key: 'actions', header: 'Action', width: 110, align: 'center', clickable: false },
    ],
    []
  );

  const c = (key: string) => columns.find((col) => col.key === key)!;

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Bare metal nodes" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search bare metal nodes by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
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
        totalCount={filtered.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<BareMetalNode>
        columns={columns}
        rows={pageRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('status')}>
              <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/bare-metal-nodes/${row.id}`}
                  className={`${linkClass} truncate`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.name}
                </Link>
                <span className="text-11 text-text-muted">ID: {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={c('tenant')}>
              {row.tenant ? (
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    to={`/compute-admin/tenants/${row.tenant.id}`}
                    className={`${linkClass} truncate`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {row.tenant.name}
                  </Link>
                  <span className="text-11 text-text-muted">ID: {row.tenant.id}</span>
                </div>
              ) : (
                <span className="text-12 text-text-muted">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={c('powerState')}>
              <Badge theme={row.powerState === 'Power On' ? 'gre' : 'gry'} size="sm" type="subtle">
                {row.powerState}
              </Badge>
            </Table.Td>
            <Table.Td rowData={row} column={c('maintained')}>
              <span className="text-12 text-text">{row.maintained ? 'Yes' : 'No'}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('cpu')}>
              {row.cpu}
            </Table.Td>
            <Table.Td rowData={row} column={c('ram')}>
              {row.ram}
            </Table.Td>
            <Table.Td rowData={row} column={c('disk')}>
              {row.disk}
            </Table.Td>
            <Table.Td rowData={row} column={c('gpu')}>
              {row.gpu ?? '-'}
            </Table.Td>
            <Table.Td rowData={row} column={c('npu')}>
              {row.npu ?? '-'}
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <div className="flex items-center justify-center w-full">
                {row.tenant ? (
                  <Button appearance="outline" variant="secondary" size="sm">
                    Release
                  </Button>
                ) : (
                  <Button
                    appearance="outline"
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} />}
                  >
                    Assign
                  </Button>
                )}
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
