import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Title } from '@shared/components/Title';
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

interface SecretRow {
  id: string;
  name: string;
  namespace: string;
  type: string;
  data: string;
  createdAt: string;
  [key: string]: unknown;
}

const secretsData: SecretRow[] = [
  {
    id: '1',
    name: 'database-postgresql-connection-credentials-secret',
    namespace: 'namespaceName',
    type: 'Opaque',
    data: 'keyName01 (+3)',
    createdAt: 'Nov 10, 2025 09:23:41',
  },
  {
    id: '2',
    name: 'database-mysql-replication-user-credentials-secret',
    namespace: 'default',
    type: 'Opaque',
    data: 'username, password (+1)',
    createdAt: 'Nov 9, 2025 14:07:22',
  },
  {
    id: '3',
    name: 'tls-certificate-wildcard-production-domain',
    namespace: 'nginx-ingress',
    type: 'kubernetes.io/tls',
    data: 'tls.crt, tls.key',
    createdAt: 'Nov 8, 2025 11:45:33',
  },
  {
    id: '4',
    name: 'docker-registry-pull-image-credentials-secret',
    namespace: 'default',
    type: 'kubernetes.io/dockerconfigjson',
    data: '.dockerconfigjson',
    createdAt: 'Nov 7, 2025 16:52:08',
  },
  {
    id: '5',
    name: 'service-account-token-default-namespace-secret',
    namespace: 'kube-system',
    type: 'kubernetes.io/service-account-token',
    data: 'ca.crt, namespace, token',
    createdAt: 'Nov 6, 2025 08:30:15',
  },
];

export function ContainerSecretsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' },
  ]);

  const rowsPerPage = 10;
  const paginatedData = useMemo(
    () => secretsData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [currentPage, rowsPerPage]
  );

  const handleRemoveFilter = useCallback((index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearFilters = useCallback(() => setFilters([]), []);

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'namespace', header: 'Namespace', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'data', header: 'Data', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Secrets" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create secret{' '}
              <IconChevronDown size={14} stroke={1.5} className="inline ml-1 align-middle" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/secrets/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/secrets/create-yaml')}>
            Create as YAML
          </ContextMenu.Item>
        </ContextMenu.Root>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 min-h-7 w-full flex-wrap">
          <div className="flex items-center gap-1">
            <input
              type="search"
              placeholder="Search secrets by attributes"
              className={searchInputClass}
              aria-label="Search secrets by attributes"
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
        totalCount={secretsData.length}
        size={rowsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<SecretRow>
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
              <div className="min-w-0">
                <Link
                  to={`/container/secrets/${row.id}`}
                  className={`${linkClass} truncate block`}
                  title={row.name}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.name}
                </Link>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="min-w-0">
                <span className="text-12 text-text truncate block" title={row.namespace}>
                  {row.namespace}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <div className="min-w-0">
                <span className="text-text truncate block" title={row.type}>
                  {row.type}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              <div className="min-w-0">
                <span className="text-text truncate block" title={row.data}>
                  {row.data}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              <span className="whitespace-nowrap" title={row.createdAt}>
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
                  <ContextMenu.Item action={() => navigate(`/container/secrets/${row.id}/edit`)}>
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => navigate(`/container/secrets/${row.id}/edit-yaml`)}
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
