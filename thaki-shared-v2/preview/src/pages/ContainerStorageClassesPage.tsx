import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import {
  IconDotsCircleHorizontal,
  IconDownload,
  IconTrash,
  IconX,
  IconChevronDown,
  IconCheck,
} from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

const searchInputClass =
  'h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 outline-none shrink-0 w-[min(100%,320px)]';

interface StorageClassRow {
  id: string;
  status: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  [key: string]: unknown;
}

const storageClassesData: StorageClassRow[] = [
  {
    id: '1',
    status: 'OK',
    name: 'ceph-rbd-high-performance-ssd-storage-class',
    isDefault: true,
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '2',
    status: 'True',
    name: 'nfs-shared-persistent-general-purpose-storage',
    isDefault: false,
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '3',
    status: 'None',
    name: 'ceph-rbd-block-storage-replicated-storage-class',
    isDefault: false,
    createdAt: 'Nov 9, 2025 18:04:44',
  },
  {
    id: '4',
    status: 'CreateContainerConfigError',
    name: 'nfs-client-provisioner-shared-storage-class',
    isDefault: false,
    createdAt: 'Nov 8, 2025 11:51:27',
  },
  {
    id: '5',
    status: 'ImagePullBackOff',
    name: 'local-path-provisioner-single-node-storage',
    isDefault: false,
    createdAt: 'Nov 7, 2025 04:38:10',
  },
];

export function ContainerStorageClassesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([
    { key: 'Name', value: 'a' },
  ]);

  const rowsPerPage = 10;
  const paginatedData = useMemo(
    () => storageClassesData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [currentPage, rowsPerPage]
  );

  const handleRemoveFilter = useCallback((index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearFilters = useCallback(() => setFilters([]), []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'isDefault', header: 'Default', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Storage classes" />
        <ContextMenu.Root
          direction="bottom-end"
          gap={4}
          trigger={({ toggle }) => (
            <Button variant="primary" size="md" onClick={toggle}>
              Create storage class{' '}
              <IconChevronDown size={14} stroke={1.5} className="inline ml-1 align-middle" />
            </Button>
          )}
        >
          <ContextMenu.Item action={() => navigate('/container/storage-classes/create')}>
            Create as form
          </ContextMenu.Item>
          <ContextMenu.Item action={() => navigate('/container/storage-classes/create-yaml')}>
            Create as YAML
          </ContextMenu.Item>
        </ContextMenu.Root>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 min-h-7 w-full flex-wrap">
          <div className="flex items-center gap-1">
            <input
              type="search"
              placeholder="Search storage classes by attributes"
              className={searchInputClass}
              aria-label="Search storage classes by attributes"
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
        totalCount={storageClassesData.length}
        size={rowsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<StorageClassRow>
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
                <Badge theme="white" size="sm" className="max-w-[80px] inline-flex">
                  <span className="truncate">{row.status}</span>
                </Badge>
              </Tooltip>
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <Link
                to={`/container/storage-classes/${row.id}`}
                className={`${linkClass} min-w-0 truncate block`}
                title={row.name}
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.isDefault ? (
                <IconCheck size={16} className="text-text" stroke={2} />
              ) : (
                <span className="text-text-subtle">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              <span className="min-w-0 truncate block" title={row.createdAt}>
                {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]} preventClickPropagation>
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
                  {!row.isDefault && (
                    <ContextMenu.Item action={() => console.log('Set as default:', row.id)}>
                      Set as default
                    </ContextMenu.Item>
                  )}
                  <ContextMenu.Item
                    action={() => navigate(`/container/storage-classes/${row.id}/edit`)}
                  >
                    Edit config
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => navigate(`/container/storage-classes/${row.id}/edit-yaml`)}
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
