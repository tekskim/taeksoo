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

interface HPARow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  workload: string;
  minReplicas: number;
  maxReplicas: number;
  currentReplicas: number;
  createdAt: string;
  [key: string]: unknown;
}

const hpaData: HPARow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'frontend-web-application-horizontal-autoscaler',
    namespace: 'namespaceName',
    workload: 'workloadName',
    minReplicas: 1,
    maxReplicas: 10,
    currentReplicas: 5,
    createdAt: 'Nov 10, 2025 10:15:33',
  },
  {
    id: '2',
    status: 'True',
    name: 'backend-api-gateway-cpu-memory-autoscaler',
    namespace: 'default',
    workload: 'api-deployment',
    minReplicas: 2,
    maxReplicas: 20,
    currentReplicas: 8,
    createdAt: 'Nov 9, 2025 15:28:47',
  },
  {
    id: '3',
    status: 'CreateContainerConfigError',
    name: 'frontend-web-production-pending-workload-autoscaler',
    namespace: 'production',
    workload: 'web-deployment',
    minReplicas: 3,
    maxReplicas: 15,
    currentReplicas: 3,
    createdAt: 'Nov 8, 2025 08:52:19',
  },
  {
    id: '4',
    status: 'ImagePullBackOff',
    name: 'staging-environment-workload-autoscaler',
    namespace: 'staging',
    workload: 'staging-deployment',
    minReplicas: 1,
    maxReplicas: 5,
    currentReplicas: 1,
    createdAt: 'Nov 7, 2025 13:44:26',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'namespace', label: 'Namespace', type: 'input', placeholder: 'Enter namespace...' },
  { key: 'workload', label: 'Workload', type: 'input', placeholder: 'Enter workload...' },
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Enter status...' },
];

export function ContainerHPAPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);

  const rowsPerPage = 10;

  const filteredRows = useMemo(
    () =>
      hpaData.filter((r) =>
        appliedFilters.every((f) => {
          const val = String(f.value ?? '').toLowerCase();
          if (!val) return true;
          return String(r[f.key as keyof HPARow] ?? '')
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
    { key: 'workload', header: 'Workload', sortable: true },
    { key: 'minReplicas', header: 'Minimum replicas', sortable: true },
    { key: 'maxReplicas', header: 'Maximum replicas', sortable: true },
    { key: 'currentReplicas', header: 'Current replicas', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'action', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Horizontal pod autoscalers" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create horizontal pod autoscaler{' '}
              <IconChevronDown size={14} stroke={1.5} className="inline ml-1 align-middle" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/hpa/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/hpa/create-yaml')}>
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
            placeholder="Search horizontal pod autoscalers by attributes"
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

      <SelectableTable<HPARow>
        columns={columns}
        rows={paginatedData}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
        onClickRow={(row) => navigate(`/container/hpa/${row.id}`)}
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
              <div className="min-w-0">
                <Link
                  to={`/container/hpa/${row.id}`}
                  className={`${linkClass} truncate block`}
                  title={row.name}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.name}
                </Link>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="truncate block" title={row.namespace}>
                {row.namespace}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              <span className="truncate block" title={row.workload}>
                {row.workload}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.minReplicas}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.maxReplicas}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.currentReplicas}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              <span
                className="truncate block"
                title={row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
              >
                {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[8]} preventClickPropagation>
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
                  <ContextMenu.Item action={() => navigate(`/container/hpa/${row.id}/edit-yaml`)}>
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
