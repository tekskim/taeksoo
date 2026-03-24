import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

interface FloatingIpItem {
  id: string;
  address: string;
  status: string;
  pool: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface AssociateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName?: string;
}

const ITEMS_PER_PAGE = 5;

const mockFloatingIps: FloatingIpItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: `fip-${i + 1}`,
  address: `203.0.113.${10 + i}`,
  status: 'available',
  pool: i % 2 === 0 ? 'public-pool-a' : 'public-pool-b',
  createdAt: `Feb ${String((i % 28) + 1).padStart(2, '0')}, 2025`,
}));

export function AssociateFloatingIPDrawer({
  isOpen,
  onClose,
  instanceName = 'my-instance',
}: AssociateFloatingIPDrawerProps) {
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
      mockFloatingIps.filter((f) =>
        [f.address, f.status, f.pool, f.createdAt].some((field) =>
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

  const selected = mockFloatingIps.find((f) => selectedRows.includes(f.id));

  const columns: TableColumn[] = [
    { key: 'address', header: 'Floating IP', sortable: true },
    { key: 'status', header: 'Status' },
    { key: 'pool', header: 'Pool', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Associate floating IP"
      description="Associate a floating IP to this instance's port."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Associate"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Instance name" values={[instanceName]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Floating IP</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select an available floating IP.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search floating IPs"
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
            <SelectableTable<FloatingIpItem>
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
                    {row.address}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    <StatusIndicator variant="active" label="Available" />
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.pool}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.createdAt}
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
                <span className="text-11 text-text-muted">No floating IP selected</span>
              ) : (
                <Tag
                  label={selected.address}
                  variant="multiSelect"
                  onClose={() => setSelectedRows([])}
                />
              )}
            </div>
            {hasAttemptedSubmit && selectedRows.length === 0 && (
              <p className="text-11 text-danger" role="alert">
                Please select a floating IP.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
