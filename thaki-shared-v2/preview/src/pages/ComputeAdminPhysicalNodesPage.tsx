import { useCallback, useMemo, useState } from 'react';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type NodeHealth = 'active' | 'warning' | 'error' | 'maintenance';

interface PhysicalNode extends Record<string, unknown> {
  id: string;
  hostname: string;
  status: NodeHealth;
  ip: string;
  vcpuUsed: number;
  vcpuTotal: number;
  ramUsedGiB: number;
  ramTotalGiB: number;
  diskUsedTiB: number;
  diskTotalTiB: number;
  runningVms: number;
}

const mockPhysicalNodes: PhysicalNode[] = [
  {
    id: 'pn-01',
    hostname: 'compute-01.region-a',
    status: 'active',
    ip: '10.0.0.11',
    vcpuUsed: 112,
    vcpuTotal: 128,
    ramUsedGiB: 896,
    ramTotalGiB: 1024,
    diskUsedTiB: 12.4,
    diskTotalTiB: 16,
    runningVms: 48,
  },
  {
    id: 'pn-02',
    hostname: 'compute-02.region-a',
    status: 'active',
    ip: '10.0.0.12',
    vcpuUsed: 96,
    vcpuTotal: 128,
    ramUsedGiB: 720,
    ramTotalGiB: 1024,
    diskUsedTiB: 9.1,
    diskTotalTiB: 16,
    runningVms: 41,
  },
  {
    id: 'pn-03',
    hostname: 'compute-03.region-b',
    status: 'warning',
    ip: '10.0.1.13',
    vcpuUsed: 120,
    vcpuTotal: 128,
    ramUsedGiB: 1008,
    ramTotalGiB: 1024,
    diskUsedTiB: 14.8,
    diskTotalTiB: 16,
    runningVms: 52,
  },
  {
    id: 'pn-04',
    hostname: 'compute-04.region-b',
    status: 'active',
    ip: '10.0.1.14',
    vcpuUsed: 64,
    vcpuTotal: 96,
    ramUsedGiB: 384,
    ramTotalGiB: 768,
    diskUsedTiB: 5.2,
    diskTotalTiB: 12,
    runningVms: 28,
  },
  {
    id: 'pn-05',
    hostname: 'compute-gpu-01',
    status: 'active',
    ip: '10.0.2.21',
    vcpuUsed: 56,
    vcpuTotal: 64,
    ramUsedGiB: 448,
    ramTotalGiB: 512,
    diskUsedTiB: 3.8,
    diskTotalTiB: 8,
    runningVms: 12,
  },
  {
    id: 'pn-06',
    hostname: 'compute-gpu-02',
    status: 'maintenance',
    ip: '10.0.2.22',
    vcpuUsed: 0,
    vcpuTotal: 64,
    ramUsedGiB: 32,
    ramTotalGiB: 512,
    diskUsedTiB: 1.1,
    diskTotalTiB: 8,
    runningVms: 0,
  },
  {
    id: 'pn-07',
    hostname: 'storage-01',
    status: 'active',
    ip: '10.0.3.31',
    vcpuUsed: 24,
    vcpuTotal: 48,
    ramUsedGiB: 192,
    ramTotalGiB: 384,
    diskUsedTiB: 42.0,
    diskTotalTiB: 64,
    runningVms: 6,
  },
  {
    id: 'pn-08',
    hostname: 'storage-02',
    status: 'error',
    ip: '10.0.3.32',
    vcpuUsed: 8,
    vcpuTotal: 48,
    ramUsedGiB: 64,
    ramTotalGiB: 384,
    diskUsedTiB: 38.2,
    diskTotalTiB: 64,
    runningVms: 2,
  },
  {
    id: 'pn-09',
    hostname: 'edge-01',
    status: 'active',
    ip: '172.16.10.5',
    vcpuUsed: 40,
    vcpuTotal: 48,
    ramUsedGiB: 256,
    ramTotalGiB: 384,
    diskUsedTiB: 2.4,
    diskTotalTiB: 4,
    runningVms: 19,
  },
];

const statusMap: Record<NodeHealth, StatusVariant> = {
  active: 'active',
  warning: 'pending',
  error: 'error',
  maintenance: 'paused',
};

const filterKeys: FilterKey[] = [
  { key: 'hostname', label: 'Hostname', type: 'input', placeholder: 'Filter by hostname...' },
  { key: 'ip', label: 'IP', type: 'input', placeholder: 'Filter by IP...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'warning', label: 'Warning' },
      { value: 'error', label: 'Error' },
      { value: 'maintenance', label: 'Maintenance' },
    ],
  },
];

function rowMatchesFilter(row: PhysicalNode, filter: FilterKeyWithValue): boolean {
  const q = String(filter.value ?? '').toLowerCase();
  if (!q) return true;
  switch (filter.key) {
    case 'hostname':
      return row.hostname.toLowerCase().includes(q);
    case 'ip':
      return row.ip.toLowerCase().includes(q);
    case 'status':
      return row.status === filter.value;
    default:
      return true;
  }
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'hostname', label: 'Hostname', visible: true, locked: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'ip', label: 'IP Address', visible: true },
  { key: 'vcpu', label: 'vCPU', visible: true },
  { key: 'ram', label: 'RAM', visible: true },
  { key: 'disk', label: 'Disk', visible: true },
  { key: 'runningVms', label: 'Running VMs', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminPhysicalNodesPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return mockPhysicalNodes;
    return mockPhysicalNodes.filter((row) => appliedFilters.every((f) => rowMatchesFilter(row, f)));
  }, [appliedFilters]);

  const pageRows = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasSelection = selectedRows.length > 0;

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'hostname', header: 'Hostname', sortable: true },
      { key: 'status', header: 'Status', width: 72, align: 'center' },
      { key: 'ip', header: 'IP Address', sortable: true },
      { key: 'vcpu', header: 'vCPU (used/total)', align: 'right' },
      { key: 'ram', header: 'RAM (used/total)', align: 'right' },
      { key: 'disk', header: 'Disk (used/total)', align: 'right' },
      { key: 'runningVms', header: 'Running VMs', align: 'right', sortable: true },
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
        <Title title="Physical nodes" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search physical nodes by attributes"
            defaultFilterKey="hostname"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
          <IconTrash size={12} /> Drain
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

      <SelectableTable<PhysicalNode>
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
            <Table.Td rowData={row} column={c('hostname')}>
              <span className="text-12 font-medium text-text">{row.hostname}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('status')}>
              <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={c('ip')}>
              <span className="text-12 text-text font-mono">{row.ip}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('vcpu')}>
              <span className="text-12 text-text text-right block tabular-nums">
                {row.vcpuUsed} / {row.vcpuTotal}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('ram')}>
              <span className="text-12 text-text text-right block tabular-nums">
                {row.ramUsedGiB} / {row.ramTotalGiB} GiB
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('disk')}>
              <span className="text-12 text-text text-right block tabular-nums">
                {row.diskUsedTiB} / {row.diskTotalTiB} TiB
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('runningVms')}>
              <span className="text-12 text-text text-right block tabular-nums">
                {row.runningVms}
              </span>
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
                <ContextMenu.Item action={() => console.log('console', row.id)}>
                  Console
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('maintenance', row.id)}>
                  Maintenance
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
