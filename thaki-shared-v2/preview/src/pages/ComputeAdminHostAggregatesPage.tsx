import { useCallback, useMemo, useState } from 'react';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Badge } from '@shared/components/Badge';
import { Popover } from '@shared/components/Popover';
import { Title } from '@shared/components/Title';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface HostAggregate extends Record<string, unknown> {
  id: string;
  name: string;
  availabilityZone: string;
  hosts: string[];
  metadata: { key: string; value: string }[];
  createdAt: string;
}

const mockHostAggregates: HostAggregate[] = [
  {
    id: 'ha-001',
    name: 'compute-general',
    availabilityZone: 'zone-a',
    hosts: ['host-a', 'host-b', 'host-c', 'host-d'],
    metadata: [
      { key: 'ssd', value: 'true' },
      { key: 'cpu_allocation_ratio', value: '16.0' },
    ],
    createdAt: 'Dec 25, 2025 09:15:33',
  },
  {
    id: 'ha-002',
    name: 'compute-gpu',
    availabilityZone: 'zone-a',
    hosts: ['gpu-host-1', 'gpu-host-2'],
    metadata: [
      { key: 'gpu', value: 'nvidia-a100' },
      { key: 'gpu_count', value: '8' },
    ],
    createdAt: 'Dec 25, 2025 10:42:18',
  },
  {
    id: 'ha-003',
    name: 'compute-memory',
    availabilityZone: 'zone-b',
    hosts: ['mem-host-1', 'mem-host-2', 'mem-host-3'],
    metadata: [{ key: 'memory', value: 'high' }],
    createdAt: 'Dec 25, 2025 14:08:52',
  },
  {
    id: 'ha-004',
    name: 'compute-storage',
    availabilityZone: 'zone-b',
    hosts: ['storage-1', 'storage-2'],
    metadata: [{ key: 'storage', value: 'nvme' }],
    createdAt: 'Dec 25, 2025 16:25:41',
  },
  {
    id: 'ha-005',
    name: 'compute-bare-metal',
    availabilityZone: 'zone-c',
    hosts: ['bm-host-1'],
    metadata: [{ key: 'bare-metal', value: 'true' }],
    createdAt: 'Dec 25, 2025 17:53:27',
  },
  {
    id: 'ha-006',
    name: 'compute-edge',
    availabilityZone: 'zone-d',
    hosts: ['edge-01', 'edge-02', 'edge-03'],
    metadata: [{ key: 'region', value: 'edge' }],
    createdAt: 'Dec 26, 2025 08:00:00',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Filter by name...' },
  {
    key: 'availabilityZone',
    label: 'Availability Zone',
    type: 'input',
    placeholder: 'Filter by availability zone...',
  },
];

function rowMatchesFilter(row: HostAggregate, filter: FilterKeyWithValue): boolean {
  const q = String(filter.value ?? '').toLowerCase();
  if (!q) return true;
  switch (filter.key) {
    case 'name':
      return row.name.toLowerCase().includes(q);
    case 'availabilityZone':
      return row.availabilityZone.toLowerCase().includes(q);
    default:
      return true;
  }
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'availabilityZone', label: 'Availability Zone', visible: true },
  { key: 'hosts', label: 'Hosts', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminHostAggregatesPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return mockHostAggregates;
    return mockHostAggregates.filter((row) =>
      appliedFilters.every((f) => rowMatchesFilter(row, f))
    );
  }, [appliedFilters]);

  const pageRows = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasSelection = selectedRows.length > 0;

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'availabilityZone', header: 'Availability Zone', sortable: true },
      { key: 'hosts', header: 'Hosts' },
      { key: 'createdAt', header: 'Created at', sortable: true },
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
        <Title title="Host aggregates" />
        <Button variant="primary" size="md">
          Create host aggregate
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search host aggregates by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
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

      <SelectableTable<HostAggregate>
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
            <Table.Td rowData={row} column={c('name')}>
              <span className="text-12 font-medium text-text">{row.name}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('availabilityZone')}>
              <span className="text-12 text-text">{row.availabilityZone}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('hosts')}>
              <span className="flex items-center gap-1 min-w-0 flex-wrap">
                {row.hosts.slice(0, 2).map((h) => (
                  <Badge key={h} theme="gry" size="sm" type="subtle">
                    {h}
                  </Badge>
                ))}
                {row.hosts.length > 2 && (
                  <Popover
                    trigger="click"
                    position="bottom"
                    aria-label={`All hosts (${row.hosts.length})`}
                    content={
                      <div className="p-4 min-w-[160px] max-w-[320px]">
                        <div className="text-[10px] font-normal leading-[14px] text-text-muted mb-2">
                          All hosts ({row.hosts.length})
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {row.hosts.map((h) => (
                            <Badge key={h} theme="gry" size="sm" type="subtle">
                              {h}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    }
                  >
                    <span className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded border border-transparent text-[10px] font-normal leading-[14px] text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer">
                      +{row.hosts.length - 2}
                    </span>
                  </Popover>
                )}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              <span className="text-12 text-text">
                {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
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
                <ContextMenu.Item action={() => console.log('edit', row.id)}>Edit</ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('manage hosts', row.id)}>
                  Manage hosts
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('delete', row.id)} danger>
                  Delete
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
