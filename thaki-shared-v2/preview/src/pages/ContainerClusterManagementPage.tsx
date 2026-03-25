import { useState, useMemo, useCallback } from 'react';
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
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface Cluster {
  id: string;
  name: string;
  status: string;
  kubernetesVersion: string;
  cpu: string;
  memory: string;
  pods: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockClusters: Cluster[] = [
  {
    id: 'cluster-001',
    name: 'production-kubernetes-high-availability-cluster',
    status: 'OK',
    kubernetesVersion: 'v1.34',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    createdAt: 'Nov 11, 2025 08:30:18',
  },
  {
    id: 'cluster-002',
    name: 'staging-development-testing-environment-cluster',
    status: 'OK',
    kubernetesVersion: 'v1.33.4',
    cpu: '4 cores',
    memory: '8 GiB',
    pods: '23/110',
    createdAt: 'Oct 6, 2025 21:25:53',
  },
  {
    id: 'cluster-003',
    name: 'production-microservices-platform-cluster',
    status: 'True',
    kubernetesVersion: 'v1.32.2',
    cpu: '16 cores',
    memory: '32 GiB',
    pods: '89/110',
    createdAt: 'Sep 15, 2025 12:22:26',
  },
  {
    id: 'cluster-004',
    name: 'staging-integration-testing-environment-cluster',
    status: 'None',
    kubernetesVersion: 'v1.33.1',
    cpu: '4 cores',
    memory: '8 GiB',
    pods: '12/110',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
  {
    id: 'cluster-005',
    name: 'development-sandbox-experimental-cluster',
    status: 'ImagePullBackOff',
    kubernetesVersion: 'v1.31.0',
    cpu: '2 cores',
    memory: '4 GiB',
    pods: '5/110',
    createdAt: 'Jul 10, 2025 01:17:01',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter cluster name...' },
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
  {
    key: 'kubernetesVersion',
    label: 'Kubernetes version',
    type: 'input',
    placeholder: 'Enter version...',
  },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function clusterMatchesFilter(cluster: Cluster, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof Cluster;
  const raw = cluster[key];
  return String(raw ?? '')
    .toLowerCase()
    .includes(fv);
}

export function ContainerClusterManagementPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return mockClusters;
    return mockClusters.filter((c) => appliedFilters.every((f) => clusterMatchesFilter(c, f)));
  }, [appliedFilters]);

  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage, itemsPerPage]
  );

  const hasSelection = selectedRows.length > 0;

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

  const logAction = useCallback((label: string, row: Cluster) => {
    console.log(`[Clusters] ${label}`, row.id, row.name);
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 120 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'kubernetesVersion', header: 'Kubernetes version', sortable: true },
    { key: 'cpu', header: 'CPU', sortable: true },
    { key: 'memory', header: 'Memory', sortable: true },
    { key: 'pods', header: 'Pods', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Clusters" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create cluster
              <IconChevronDown size={14} stroke={1.5} className="ml-1" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/cluster-management/create')}>
            Create as form
          </ContextMenu.Item>
        </ContextMenu.Root>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search clusters with attributes"
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
            onClick={() => console.log('[Clusters] Bulk Download KubeConfig', selectedRows)}
          >
            <IconDownload size={12} /> Download KubeConfig
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Clusters] Bulk Download YAML', selectedRows)}
          >
            <IconDownload size={12} /> Download YAML
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Clusters] Bulk Delete', selectedRows)}
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
        onSettingClick={() => {}}
        settingAriaLabel="Pagination settings"
      />

      <SelectableTable<Cluster>
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
                to={`/container/cluster-management/${row.id}`}
                className={`${linkClass} truncate block min-w-0`}
                title={row.name}
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={c('kubernetesVersion')}>
              {row.kubernetesVersion}
            </Table.Td>
            <Table.Td rowData={row} column={c('cpu')}>
              {row.cpu}
            </Table.Td>
            <Table.Td rowData={row} column={c('memory')}>
              {row.memory}
            </Table.Td>
            <Table.Td rowData={row} column={c('pods')}>
              {row.pods}
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              {stripTime(row.createdAt)}
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
              <div className="flex items-center justify-center w-full">
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
                  <ContextMenu.Item action={() => logAction('Kubectl Shell', row)}>
                    Kubectl Shell
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Download KubeConfig', row)}>
                    Download KubeConfig
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Copy KubeConfig to Clipboard', row)}>
                    Copy KubeConfig to Clipboard
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('View YAML', row)}>
                    View YAML
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
