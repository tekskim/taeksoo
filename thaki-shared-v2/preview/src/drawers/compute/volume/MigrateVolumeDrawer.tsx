import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface MigrateVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName: string;
}

interface BackendRow {
  id: string;
  name: string;
  type: string;
  availableCapacity: string;
  status: 'active' | 'degraded' | 'maintenance';
  [key: string]: unknown;
}

const ITEMS_PER_PAGE = 5;

const MOCK_BACKENDS: BackendRow[] = [
  {
    id: 'be-1',
    name: 'ceph-ssd-pool-a',
    type: 'SSD',
    availableCapacity: '42 TiB',
    status: 'active',
  },
  {
    id: 'be-2',
    name: 'ceph-hdd-archive',
    type: 'HDD',
    availableCapacity: '180 TiB',
    status: 'active',
  },
  {
    id: 'be-3',
    name: 'nvme-local-rack-1',
    type: 'NVMe',
    availableCapacity: '8 TiB',
    status: 'degraded',
  },
  {
    id: 'be-4',
    name: 'netapp-svm-prod',
    type: 'SSD',
    availableCapacity: '25 TiB',
    status: 'active',
  },
  {
    id: 'be-5',
    name: 'legacy-iscsi-cluster',
    type: 'HDD',
    availableCapacity: '6 TiB',
    status: 'maintenance',
  },
];

const statusMap: Record<BackendRow['status'], StatusVariant> = {
  active: 'active',
  degraded: 'degraded',
  maintenance: 'paused',
};

export function MigrateVolumeDrawer({ isOpen, onClose, volumeName }: MigrateVolumeDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [forceMigration, setForceMigration] = useState(false);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForceMigration(false);
      setSelectedRows([]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      MOCK_BACKENDS.filter((b) =>
        [b.name, b.type, b.availableCapacity, b.status].some((field) =>
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
    onClose();
  };

  const selected = MOCK_BACKENDS.find((b) => selectedRows.includes(b.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Backend name', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'availableCapacity', header: 'Available capacity', sortable: true, align: 'right' },
    { key: 'status', header: 'Status', width: 100, align: 'center' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Migrate volume"
      description="Migrate this volume to a different storage backend."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Migrate"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume name" values={[volumeName]} />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Storage backend</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select a destination backend for migration.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search backends"
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
            <SelectableTable<BackendRow>
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
                    {row.name}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    {row.type}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.availableCapacity}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    <StatusIndicator
                      variant={statusMap[row.status]}
                      label={
                        row.status === 'active'
                          ? 'Active'
                          : row.status === 'degraded'
                            ? 'Degraded'
                            : 'Maintenance'
                      }
                    />
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
                <span className="text-11 text-text-muted">No backend selected</span>
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
                Please select a storage backend.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-2">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Force migration</span>
            <span className="text-12 text-text-muted">
              Proceed even if the backend reports warnings or non-ideal conditions.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle
              checked={forceMigration}
              onChange={(e) => setForceMigration(e.target.checked)}
            />
            <span className="text-12 text-text">{forceMigration ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
