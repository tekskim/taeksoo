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
import { IconDotsCircleHorizontal, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type NodeStatus = 'active' | 'available' | 'deploying' | 'error' | 'maintenance';

interface BareMetalNode extends Record<string, unknown> {
  id: string;
  name: string;
  uuid: string;
  status: NodeStatus;
  powerState: 'on' | 'off';
  provisionState: 'active' | 'deploying' | 'available' | 'error';
  driver: string;
  instanceUuid: string | null;
}

const mockBareMetalNodes: BareMetalNode[] = [
  {
    id: 'bm-001',
    name: 'bm-compute-01',
    uuid: '8f3c2a10-4b2d-4c8e-9a1f-2d3e4f5a6b7c',
    status: 'active',
    powerState: 'on',
    provisionState: 'active',
    driver: 'ipmi',
    instanceUuid: null,
  },
  {
    id: 'bm-002',
    name: 'bm-compute-02',
    uuid: '9a4d3b21-5c3e-5d9f-0b2g-3e4f5a6b7c8d',
    status: 'active',
    powerState: 'on',
    provisionState: 'active',
    driver: 'redfish',
    instanceUuid: 'i-0a1b2c3d4e5f6789',
  },
  {
    id: 'bm-003',
    name: 'bm-gpu-01',
    uuid: '1b5e4c32-6d4f-6e0g-1c3h-4f5a6b7c8d9e',
    status: 'available',
    powerState: 'on',
    provisionState: 'available',
    driver: 'ipmi',
    instanceUuid: null,
  },
  {
    id: 'bm-004',
    name: 'bm-storage-01',
    uuid: '2c6f5d43-7e5g-7f1h-2d4i-5a6b7c8d9e0f',
    status: 'deploying',
    powerState: 'on',
    provisionState: 'deploying',
    driver: 'ilo',
    instanceUuid: null,
  },
  {
    id: 'bm-005',
    name: 'bm-edge-01',
    uuid: '3d7g6e54-8f6h-8g2i-3e5j-6b7c8d9e0f1a',
    status: 'error',
    powerState: 'off',
    provisionState: 'error',
    driver: 'ipmi',
    instanceUuid: null,
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
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Filter by name...' },
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
  { key: 'driver', label: 'Driver', type: 'input', placeholder: 'Filter by driver...' },
];

function rowMatchesFilter(row: BareMetalNode, filter: FilterKeyWithValue): boolean {
  const q = String(filter.value ?? '').toLowerCase();
  if (!q) return true;
  switch (filter.key) {
    case 'name':
      return row.name.toLowerCase().includes(q);
    case 'status':
      return row.status === filter.value;
    case 'driver':
      return row.driver.toLowerCase().includes(q);
    default:
      return true;
  }
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'uuid', label: 'UUID', visible: true },
  { key: 'powerState', label: 'Power state', visible: true },
  { key: 'provisionState', label: 'Provision state', visible: true },
  { key: 'driver', label: 'Driver', visible: true },
  { key: 'instanceUuid', label: 'Instance UUID', visible: true },
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
      { key: 'uuid', header: 'UUID' },
      { key: 'powerState', header: 'Power state' },
      { key: 'provisionState', header: 'Provision state', sortable: true },
      { key: 'driver', header: 'Driver', sortable: true },
      { key: 'instanceUuid', header: 'Instance UUID' },
      { key: 'actions', header: 'Action', width: 60, align: 'center', clickable: false },
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
              <Link to={`/compute-admin/bare-metal-nodes/${row.id}`} className={linkClass}>
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={c('uuid')}>
              <span
                className="text-11 text-text-muted font-mono truncate block max-w-[200px]"
                title={row.uuid}
              >
                {row.uuid}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('powerState')}>
              <Badge theme={row.powerState === 'on' ? 'gre' : 'gry'} size="sm" type="subtle">
                {row.powerState === 'on' ? 'Power on' : 'Power off'}
              </Badge>
            </Table.Td>
            <Table.Td rowData={row} column={c('provisionState')}>
              <span className="text-12 text-text capitalize">{row.provisionState}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('driver')}>
              <span className="text-12 text-text">{row.driver}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('instanceUuid')}>
              {row.instanceUuid ? (
                <Link to={`/compute-admin/instances/${row.instanceUuid}`} className={linkClass}>
                  <span
                    className="font-mono text-11 truncate block max-w-[160px]"
                    title={row.instanceUuid}
                  >
                    {row.instanceUuid}
                  </span>
                </Link>
              ) : (
                <span className="text-12 text-text-muted">—</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    aria-label="Row actions"
                  >
                    <IconDotsCircleHorizontal size={16} stroke={1.5} />
                  </button>
                )}
              >
                <ContextMenu.Item action={() => console.log('inspect', row.id)}>
                  Inspect
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('power', row.id)}>
                  Power
                </ContextMenu.Item>
              </ContextMenu.Root>
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
