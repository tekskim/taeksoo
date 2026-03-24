import { useState, useEffect, useCallback, useMemo } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

interface SnapshotRow {
  id: string;
  name: string;
  size: string;
  status: 'available' | 'error';
  createdAt: string;
  [key: string]: unknown;
}

export interface RestoreFromSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
}

const ITEMS_PER_PAGE = 5;

const MOCK_SNAPSHOTS: SnapshotRow[] = [
  {
    id: 'vsnap-r1',
    name: 'daily-2025-03-10',
    size: '100 GiB',
    status: 'available',
    createdAt: 'Mar 10, 2025 02:00:00',
  },
  {
    id: 'vsnap-r2',
    name: 'pre-upgrade',
    size: '100 GiB',
    status: 'available',
    createdAt: 'Mar 5, 2025 14:00:00',
  },
  {
    id: 'vsnap-r3',
    name: 'weekly-backup',
    size: '100 GiB',
    status: 'available',
    createdAt: 'Mar 2, 2025 09:30:00',
  },
  {
    id: 'vsnap-r4',
    name: 'manual-checkpoint',
    size: '100 GiB',
    status: 'error',
    createdAt: 'Feb 20, 2025 18:22:00',
  },
  {
    id: 'vsnap-r5',
    name: 'archive-snap',
    size: '100 GiB',
    status: 'available',
    createdAt: 'Jan 15, 2025 11:45:00',
  },
];

const statusMap: Record<SnapshotRow['status'], StatusVariant> = {
  available: 'active',
  error: 'error',
};

export function RestoreFromSnapshotDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
}: RestoreFromSnapshotDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRows([]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      MOCK_SNAPSHOTS.filter((s) =>
        [s.name, s.size, s.status, s.createdAt].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
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

  const selected = MOCK_SNAPSHOTS.find((s) => selectedRows.includes(s.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'status', header: 'Status', width: 100, align: 'center' },
    { key: 'createdAt', header: 'Created at', sortable: true },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Restore from snapshot"
      description="Restore this volume from a snapshot."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Restore"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume name" values={[volumeName]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Snapshot</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select one snapshot to restore from.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snapshots"
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
            <SelectableTable<SnapshotRow>
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
                <span className="text-11 text-text-muted">No snapshot selected</span>
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
                Please select a snapshot.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
