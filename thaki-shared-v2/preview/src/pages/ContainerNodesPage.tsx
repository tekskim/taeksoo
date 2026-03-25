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
  IconCopy,
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface NodeRow {
  id: string;
  status: string;
  name: string;
  roles: string;
  version: string;
  externalIp: string;
  internalIp: string;
  os: string;
  cpuUsage: number;
  ramUsage: number;
  podsUsage: number;
  createdAt: string;
  [key: string]: unknown;
}

const nodesData: NodeRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'master-control-plane-high-availability-node-01',
    roles: 'Control Plane',
    version: 'v1.34',
    externalIp: '-',
    internalIp: '172.16.0.237',
    os: 'Linux',
    cpuUsage: 8,
    ramUsage: 23,
    podsUsage: 13,
    createdAt: 'Nov 1, 2025 08:12:34',
  },
  {
    id: '2',
    status: 'OK',
    name: 'worker-node-production-cluster-az1-pool-001',
    roles: 'Worker',
    version: 'v1.34',
    externalIp: '-',
    internalIp: '172.16.0.238',
    os: 'Linux',
    cpuUsage: 45,
    ramUsage: 67,
    podsUsage: 42,
    createdAt: 'Nov 1, 2025 09:45:22',
  },
  {
    id: '3',
    status: 'True',
    name: 'worker-node-production-cluster-az1-pool-002',
    roles: 'Worker',
    version: 'v1.34',
    externalIp: '-',
    internalIp: '172.16.0.239',
    os: 'Linux',
    cpuUsage: 32,
    ramUsage: 51,
    podsUsage: 28,
    createdAt: 'Nov 1, 2025 11:23:17',
  },
  {
    id: '4',
    status: 'Raw',
    name: 'worker-node-production-cluster-az2-pool-003',
    roles: 'Worker',
    version: 'v1.34',
    externalIp: '10.0.1.100',
    internalIp: '172.16.0.240',
    os: 'Linux',
    cpuUsage: 78,
    ramUsage: 82,
    podsUsage: 65,
    createdAt: 'Nov 2, 2025 14:30:41',
  },
  {
    id: '5',
    status: 'None',
    name: 'worker-node-production-cluster-az2-pool-004',
    roles: 'Worker',
    version: 'v1.34',
    externalIp: '-',
    internalIp: '172.16.0.241',
    os: 'Linux',
    cpuUsage: 0,
    ramUsage: 0,
    podsUsage: 0,
    createdAt: 'Nov 2, 2025 16:52:08',
  },
  {
    id: '6',
    status: 'ImagePullBackOff',
    name: 'worker-node-gpu-inference-accelerator-pool-001',
    roles: 'Worker, GPU',
    version: 'v1.34',
    externalIp: '10.0.1.101',
    internalIp: '172.16.0.242',
    os: 'Linux',
    cpuUsage: 92,
    ramUsage: 88,
    podsUsage: 75,
    createdAt: 'Nov 3, 2025 10:17:55',
  },
];

const INITIAL_FILTERS: FilterKeyWithValue[] = [
  {
    id: 'initial-name',
    key: 'name',
    label: 'Name',
    type: 'input',
    value: 'a',
    displayValue: 'a',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'roles', label: 'Roles', type: 'input', placeholder: 'Enter roles...' },
  { key: 'version', label: 'Version', type: 'input', placeholder: 'Enter version...' },
  { key: 'internalIp', label: 'Internal IP', type: 'input', placeholder: 'Enter IP...' },
  { key: 'externalIp', label: 'External IP', type: 'input', placeholder: 'Enter IP...' },
  { key: 'os', label: 'OS', type: 'input', placeholder: 'Enter OS...' },
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
  { key: 'cpuUsage', label: 'CPU usage', type: 'input', placeholder: 'Enter %...' },
  { key: 'ramUsage', label: 'RAM usage', type: 'input', placeholder: 'Enter %...' },
  { key: 'podsUsage', label: 'Pods usage', type: 'input', placeholder: 'Enter %...' },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function ProgressCell({ value }: { value: number }) {
  const color =
    value >= 90
      ? 'var(--color-state-danger)'
      : value >= 70
        ? 'var(--color-state-warning)'
        : 'var(--color-state-success)';
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-body-sm text-[var(--color-text-subtle)] shrink-0 w-8 text-right">
        {value}%
      </span>
    </div>
  );
}

function rowMatches(row: NodeRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  if (filter.key === 'cpuUsage' || filter.key === 'ramUsage' || filter.key === 'podsUsage') {
    return String(row[filter.key as keyof NodeRow])
      .toLowerCase()
      .includes(fv);
  }
  const key = filter.key as keyof NodeRow;
  return String(row[key] ?? '')
    .toLowerCase()
    .includes(fv);
}

export function ContainerNodesPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(
    () => nodesData.filter((r) => appliedFilters.every((f) => rowMatches(r, f))),
    [appliedFilters]
  );

  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage, itemsPerPage]
  );

  const hasSelection = selectedRows.length > 0;

  const handleSortChange = (nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  };

  const handleFilterAdd = (filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  };

  const handleFilterRemove = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  };

  const logAction = (label: string, row: NodeRow) => {
    console.log(`[Nodes] ${label}`, row.id, row.name);
  };

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'roles', header: 'Roles', sortable: true },
    { key: 'version', header: 'Version', sortable: true },
    { key: 'internalIp', header: 'Internal IP', sortable: true },
    { key: 'os', header: 'OS', sortable: true },
    { key: 'cpuUsage', header: 'CPU', sortable: true },
    { key: 'ramUsage', header: 'RAM', sortable: true },
    { key: 'podsUsage', header: 'Pods', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Nodes" size="large" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search nodes by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Nodes] Bulk Download YAML', selectedRows)}
          >
            <IconDownload size={12} /> Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Nodes] Bulk Delete', selectedRows)}
          >
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
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<NodeRow>
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
            <Table.Td rowData={row} column={c('status')}>
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
            <Table.Td rowData={row} column={c('name')}>
              <Link
                to={`/container/nodes/${row.name}`}
                className={`${linkClass} truncate block min-w-0`}
                title={row.name}
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={c('roles')}>
              <span className="truncate block min-w-0" title={row.roles}>
                {row.roles}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('version')}>
              {row.version}
            </Table.Td>
            <Table.Td rowData={row} column={c('internalIp')}>
              <span className="inline-flex items-center gap-1 min-w-0">
                <span className="truncate" title={row.internalIp}>
                  {row.internalIp}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void navigator.clipboard.writeText(row.internalIp);
                  }}
                  className="shrink-0 p-0.5 text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)]"
                  aria-label="Copy internal IP"
                >
                  <IconCopy size={12} stroke={1.5} />
                </button>
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('os')}>
              {row.os}
            </Table.Td>
            <Table.Td rowData={row} column={c('cpuUsage')}>
              <ProgressCell value={row.cpuUsage} />
            </Table.Td>
            <Table.Td rowData={row} column={c('ramUsage')}>
              <ProgressCell value={row.ramUsage} />
            </Table.Td>
            <Table.Td rowData={row} column={c('podsUsage')}>
              <ProgressCell value={row.podsUsage} />
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              <span className="truncate block min-w-0" title={row.createdAt}>
                {stripTime(row.createdAt)}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <div className="min-w-0 flex items-center justify-center w-full">
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
                      <IconDotsCircleHorizontal
                        size={16}
                        stroke={1.5}
                        className="text-text-subtle"
                      />
                    </button>
                  )}
                >
                  <ContextMenu.Item action={() => navigate(`/container/nodes/${row.name}/edit`)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => navigate(`/container/nodes/${row.name}/edit-yaml`)}
                  >
                    Edit YAML
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Download YAML', row)}>
                    Download YAML
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Delete', row)} danger>
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
