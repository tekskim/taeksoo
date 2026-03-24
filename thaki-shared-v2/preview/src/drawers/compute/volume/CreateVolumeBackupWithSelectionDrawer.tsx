import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Toggle } from '@shared/components/Toggle';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateVolumeBackupWithSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type VolStatus = 'active' | 'in-use' | 'error' | 'pending';
type VolType = 'SSD' | 'NVMe' | 'HDD';

interface VolumePickRow {
  id: string;
  name: string;
  size: string;
  status: VolStatus;
  type: VolType;
  createdAt: string;
  [key: string]: unknown;
}

const ITEMS_PER_PAGE = 5;

const MOCK_VOLUMES: VolumePickRow[] = [
  {
    id: 'vbk-v1',
    name: 'web-data-01',
    size: '100 GiB',
    status: 'in-use',
    type: 'SSD',
    createdAt: 'Mar 9, 2025 15:20:00',
  },
  {
    id: 'vbk-v2',
    name: 'db-primary-vol',
    size: '500 GiB',
    status: 'in-use',
    type: 'NVMe',
    createdAt: 'Mar 7, 2025 11:05:22',
  },
  {
    id: 'vbk-v3',
    name: 'archive-cold',
    size: '2 TiB',
    status: 'active',
    type: 'HDD',
    createdAt: 'Mar 2, 2025 09:12:45',
  },
  {
    id: 'vbk-v4',
    name: 'cache-tier',
    size: '50 GiB',
    status: 'active',
    type: 'SSD',
    createdAt: 'Feb 28, 2025 18:33:10',
  },
  {
    id: 'vbk-v5',
    name: 'k8s-etcd',
    size: '20 GiB',
    status: 'in-use',
    type: 'NVMe',
    createdAt: 'Feb 20, 2025 07:40:33',
  },
  {
    id: 'vbk-v6',
    name: 'temp-clone',
    size: '80 GiB',
    status: 'pending',
    type: 'SSD',
    createdAt: 'Feb 15, 2025 13:00:00',
  },
  {
    id: 'vbk-v7',
    name: 'logs-buffer',
    size: '200 GiB',
    status: 'active',
    type: 'HDD',
    createdAt: 'Jan 30, 2025 16:16:16',
  },
  {
    id: 'vbk-v8',
    name: 'ml-dataset',
    size: '1 TiB',
    status: 'in-use',
    type: 'NVMe',
    createdAt: 'Jan 8, 2025 10:22:55',
  },
];

const statusMap: Record<VolStatus, StatusVariant> = {
  active: 'active',
  'in-use': 'inUse',
  error: 'error',
  pending: 'pending',
};

export function CreateVolumeBackupWithSelectionDrawer({
  isOpen,
  onClose,
}: CreateVolumeBackupWithSelectionDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [incremental, setIncremental] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedRows([]);
      setSearchQuery('');
      setCurrentPage(1);
      setBackupName('');
      setDescription('');
      setIncremental(false);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      MOCK_VOLUMES.filter((v) =>
        [v.name, v.size, v.status, v.type, v.createdAt].some((field) =>
          String(field).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [searchQuery]
  );

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (selectedRows.length === 0) return;
    if (!backupName.trim()) {
      setNameError('Please enter a backup name.');
      return;
    }
    setNameError(null);
    onClose();
  };

  const selected = MOCK_VOLUMES.find((v) => selectedRows.includes(v.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'size', header: 'Size', sortable: true, align: 'right' },
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true, align: 'right' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Create volume backup"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Volume</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select the volume to back up.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search volumes"
              size="sm"
            />
          </div>

          <Pagination
            totalCount={filtered.length}
            size={ITEMS_PER_PAGE}
            currentAt={currentPage}
            onPageChange={setCurrentPage}
            totalCountLabel="items"
          />

          <div className="flex flex-col gap-2 w-full">
            <SelectableTable<VolumePickRow>
              columns={columns}
              rows={paginated}
              selectionType="radio"
              selectedRows={selectedRows}
              onRowSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              sort={sort}
              order={order}
              onSortChange={handleSortChange}
            >
              {paginated.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={columns[0]}>
                    <span className="text-primary font-medium">{row.name}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    {row.size}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.type}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[4]}>
                    {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                  </Table.Td>
                </Table.Tr>
              ))}
            </SelectableTable>

            <div
              className={`flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border ${
                hasAttemptedSubmit && selectedRows.length === 0
                  ? 'border-danger bg-danger-light'
                  : 'border-border bg-surface-muted'
              }`}
            >
              {!selected ? (
                <span className="text-11 text-text-muted">No volume selected</span>
              ) : (
                <Tag
                  label={selected.name}
                  variant="multiSelect"
                  onClose={() => setSelectedRows([])}
                />
              )}
            </div>
            {hasAttemptedSubmit && selectedRows.length === 0 && (
              <p className="text-11 text-danger" role="alert">
                Please select a volume.
              </p>
            )}
          </div>
        </div>

        {selected ? (
          <div className="flex flex-col gap-6">
            <FormField label="Backup name" required error={nameError || undefined}>
              <Input
                value={backupName}
                onChange={(e) => {
                  setBackupName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="Enter backup name"
                error={!!nameError}
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows={4}
                size="sm"
              />
            </FormField>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-12 font-medium text-text">Incremental</span>
                <span className="text-12 text-text-muted">
                  Only store changes since the last backup when possible.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Toggle checked={incremental} onChange={(e) => setIncremental(e.target.checked)} />
                <span className="text-12 text-text">{incremental ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Overlay.Template>
  );
}
