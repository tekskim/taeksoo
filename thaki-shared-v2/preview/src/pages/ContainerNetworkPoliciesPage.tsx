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

interface NetworkPolicyRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  podSelector: string;
  createdAt: string;
  [key: string]: unknown;
}

const networkPoliciesData: NetworkPolicyRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'networkpolicyName',
    namespace: 'default',
    podSelector: 'foo1=bar1 (+6)',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '2',
    status: 'True',
    name: 'networkpolicyName2',
    namespace: 'default',
    podSelector: '-',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '3',
    status: 'None',
    name: 'deny-all-ingress',
    namespace: 'production',
    podSelector: 'app=web',
    createdAt: 'Nov 9, 2025 18:04:44',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'allow-frontend',
    namespace: 'kube-system',
    podSelector: 'tier=frontend (+2)',
    createdAt: 'Nov 8, 2025 11:51:27',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'restrict-egress',
    namespace: 'staging',
    podSelector: 'env=staging',
    createdAt: 'Nov 7, 2025 04:38:10',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'namespace', label: 'Namespace', type: 'input', placeholder: 'Enter namespace...' },
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
  {
    key: 'podSelector',
    label: 'Pod selector',
    type: 'input',
    placeholder: 'Enter pod selector...',
  },
  { key: 'createdAt', label: 'Created at', type: 'input', placeholder: 'Enter created at...' },
];

export function ContainerNetworkPoliciesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);

  const rowsPerPage = 10;
  const filteredRows = useMemo(
    () =>
      networkPoliciesData.filter((r) =>
        appliedFilters.every((f) => {
          const val = String(f.value ?? '').toLowerCase();
          if (!val) return true;
          return String(r[f.key as keyof NetworkPolicyRow] ?? '')
            .toLowerCase()
            .includes(val);
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
    { key: 'podSelector', header: 'Pod selector' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Network policies" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create network policy{' '}
              <IconChevronDown size={14} stroke={1.5} className="inline ml-1 align-middle" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/network-policies/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/network-policies/create-yaml')}>
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
            placeholder="Search network policies by attributes"
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

      <SelectableTable<NetworkPolicyRow>
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
                to={`/container/network-policies/${row.id}`}
                className={`${linkClass} truncate`}
                title={row.name}
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="text-text">{row.namespace}</span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              <span className="text-text truncate" title={row.podSelector}>
                {row.podSelector}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              <span className="truncate whitespace-nowrap" title={row.createdAt}>
                {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]} preventClickPropagation>
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
                  <ContextMenu.Item action={() => console.log('Edit Config:', row.id)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => console.log('Edit YAML:', row.id)}>
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
