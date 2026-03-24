import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Popover } from '@shared/components/Popover';
import { Tooltip } from '@shared/components/Tooltip';
import {
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconX,
  IconChevronDown,
} from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

const searchInputClass =
  'h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 outline-none shrink-0 w-[min(100%,320px)]';

interface ServiceRow {
  id: string;
  status: string;
  name: string;
  namespace: string;
  target: string[];
  selector: string[];
  type: 'ClusterIP' | 'ClusterIP (Headless)' | 'ExternalName' | 'LoadBalancer' | 'NodePort';
  ipAddresses: string[];
  createdAt: string;
  [key: string]: unknown;
}

const servicesData: ServiceRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'frontend-web-application-loadbalancer-service',
    namespace: 'namespaceName',
    target: ['http + 80/TCP', 'https-internal + 444/TCP'],
    selector: ['key1=value1'],
    type: 'LoadBalancer',
    ipAddresses: ['10.96.0.1', '203.0.113.10'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '2',
    status: 'True',
    name: 'backend-api-gateway-cluster-internal-service',
    namespace: 'namespaceName',
    target: ['myport + 80/TCP'],
    selector: ['key1=value1', 'key2=value2', 'key3=value3'],
    type: 'ClusterIP (Headless)',
    ipAddresses: ['None'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '3',
    status: 'None',
    name: 'external-database-connection-externalname-service',
    namespace: 'namespaceName',
    target: ['my.database.example.com'],
    selector: ['-'],
    type: 'ExternalName',
    ipAddresses: ['-'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'ingress-nginx-loadbalancer-external-service',
    namespace: 'namespaceName',
    target: ['80/TCP', '443/TCP'],
    selector: ['key1=value1', 'key2=value2'],
    type: 'LoadBalancer',
    ipAddresses: ['10.96.12.34', '203.0.113.50'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'legacy-application-nodeport-external-access-service',
    namespace: 'namespaceName',
    target: ['[Any Node]:31575'],
    selector: ['key1=value1'],
    type: 'NodePort',
    ipAddresses: ['10.96.5.67'],
    createdAt: 'Nov 10, 2025 01:17:01',
  },
];

export function ContainerServicesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);

  const rowsPerPage = 10;
  const paginatedData = useMemo(
    () => servicesData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [currentPage, rowsPerPage]
  );

  const handleRemoveFilter = useCallback((index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'target', header: 'Target' },
    { key: 'ipAddresses', header: 'IP addresses', sortable: true },
    { key: 'selector', header: 'Selector' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 100, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Services" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create service{' '}
              <IconChevronDown size={14} stroke={1.5} className="inline ml-1 align-middle" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/services/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/services/create-yaml')}>
            Create as YAML
          </ContextMenu.Item>
        </ContextMenu.Root>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 min-h-7 w-full flex-wrap">
          <div className="flex items-center gap-1">
            <input
              type="search"
              placeholder="Search service by attributes"
              className={searchInputClass}
              aria-label="Search service by attributes"
            />
            <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
              <IconDownload size={12} />
            </Button>
          </div>
          <div className="h-4 w-px bg-border shrink-0" />
          <div className="flex items-center gap-1">
            <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
              <IconDownload size={12} /> Download YAML
            </Button>
            <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
              <IconTrash size={12} /> Delete
            </Button>
          </div>
        </div>

        {filters.length > 0 && (
          <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
            <div className="flex items-center gap-1 flex-wrap">
              {filters.map((filter, index) => (
                <span
                  key={`${filter.key}-${index}`}
                  className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
                >
                  <span className="flex items-center gap-1">
                    <span className="text-text">{filter.key}</span>
                    <span className="text-border">|</span>
                    <span className="text-text">{filter.value}</span>
                  </span>
                  <button
                    type="button"
                    className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                    onClick={() => handleRemoveFilter(index)}
                    aria-label={`Remove ${filter.key}: ${filter.value}`}
                  >
                    <IconX size={12} strokeWidth={2} />
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <Pagination
        totalCount={servicesData.length}
        size={rowsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<ServiceRow>
        columns={columns}
        rows={paginatedData}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        stickyLastColumn
        onClickRow={(row) => navigate(`/container/services/${row.id}`)}
      >
        {paginatedData.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <span className="min-w-0 block">
                <Tooltip content={row.status} direction="top">
                  <Badge theme="white" size="sm" className="max-w-[80px] inline-flex">
                    <span className="truncate">{row.status}</span>
                  </Badge>
                </Tooltip>
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="min-w-0">
                <Link
                  to={`/container/services/${row.id}`}
                  className={`${linkClass} truncate block`}
                  title={row.name}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.name}
                </Link>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="truncate block min-w-0" title={row.namespace}>
                {row.namespace}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              <span className="truncate block min-w-0" title={row.type}>
                {row.type}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              <div className="flex items-center gap-1 min-w-0">
                <span className="truncate min-w-0" title={row.target[0]}>
                  {row.target[0]}
                </span>
                {row.target.length > 1 && (
                  <Popover
                    trigger="hover"
                    position="bottom"
                    delay={100}
                    hideDelay={100}
                    content={
                      <div className="p-3 min-w-[120px] max-w-[320px]">
                        <div className="text-11 font-medium text-text-muted mb-2">
                          All targets ({row.target.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {row.target.map((item, i) => (
                            <Badge key={i} theme="white" size="sm">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    }
                  >
                    <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-11 font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors h-5 cursor-pointer">
                      +{row.target.length - 1}
                    </span>
                  </Popover>
                )}
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              <div className="flex w-full items-center gap-1 min-w-0">
                <span className="truncate min-w-0 flex-1" title={row.ipAddresses[0]}>
                  {row.ipAddresses[0]}
                </span>
                {row.ipAddresses.length > 1 && (
                  <span className="ml-auto">
                    <Popover
                      trigger="hover"
                      position="bottom"
                      delay={100}
                      hideDelay={100}
                      content={
                        <div className="p-3 min-w-[120px] max-w-[320px]">
                          <div className="text-11 font-medium text-text-muted mb-2">
                            All IP addresses ({row.ipAddresses.length})
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {row.ipAddresses.map((item, i) => (
                              <Badge key={i} theme="white" size="sm">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-11 font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors h-5 cursor-pointer">
                        +{row.ipAddresses.length - 1}
                      </span>
                    </Popover>
                  </span>
                )}
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              <div className="flex items-center gap-1 min-w-0">
                <span className="truncate min-w-0" title={row.selector[0]}>
                  {row.selector[0]}
                </span>
                {row.selector.length > 1 && (
                  <Popover
                    trigger="hover"
                    position="bottom"
                    delay={100}
                    hideDelay={100}
                    content={
                      <div className="p-3 min-w-[120px] max-w-[320px]">
                        <div className="text-11 font-medium text-text-muted mb-2">
                          All selectors ({row.selector.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {row.selector.map((item, i) => (
                            <Badge key={i} theme="white" size="sm">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    }
                  >
                    <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-11 font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors h-5 cursor-pointer">
                      +{row.selector.length - 1}
                    </span>
                  </Popover>
                )}
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              <span
                className="truncate block min-w-0"
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
                  <ContextMenu.Item
                    action={() => navigate(`/container/services/${row.id}/edit-yaml`)}
                  >
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
