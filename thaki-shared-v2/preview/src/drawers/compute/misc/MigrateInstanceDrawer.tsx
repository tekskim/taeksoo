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

interface HostItem {
  id: string;
  hostname: string;
  status: string;
  instances: number;
  vcpusUsed: string;
  ramUsed: string;
  [key: string]: unknown;
}

export interface MigrateInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName?: string;
}

const ITEMS_PER_PAGE = 5;

const mockHosts: HostItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: `host-${i + 1}`,
  hostname: `compute-node-${String(i + 1).padStart(2, '0')}.region.local`,
  status: i % 3 === 0 ? 'maintenance' : 'active',
  instances: 12 + i * 3,
  vcpusUsed: `${40 + i * 8} / 128`,
  ramUsed: `${120 + i * 16} / 512 GiB`,
}));

export function MigrateInstanceDrawer({
  isOpen,
  onClose,
  instanceName = 'my-instance',
}: MigrateInstanceDrawerProps) {
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
      mockHosts.filter((h) =>
        [h.hostname, h.status, String(h.instances), h.vcpusUsed, h.ramUsed].some((field) =>
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

  const selected = mockHosts.find((h) => selectedRows.includes(h.id));

  const columns: TableColumn[] = [
    { key: 'hostname', header: 'Hostname', sortable: true },
    { key: 'status', header: 'Status' },
    { key: 'instances', header: 'Instances', sortable: true },
    { key: 'vcpusUsed', header: 'vCPUs used' },
    { key: 'ramUsed', header: 'RAM used' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Migrate instance"
      description="Cold migrate this instance to another host."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Migrate"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Instance name" values={[instanceName]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Target host</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select a destination host for cold migration.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
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
            <SelectableTable<HostItem>
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
                    {row.hostname}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    <StatusIndicator
                      variant={row.status === 'active' ? 'active' : 'paused'}
                      label={row.status === 'active' ? 'Active' : 'Maintenance'}
                    />
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.instances}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.vcpusUsed}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[4]}>
                    {row.ramUsed}
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
                <span className="text-11 text-text-muted">No host selected</span>
              ) : (
                <Tag
                  label={selected.hostname}
                  variant="multiSelect"
                  onClose={() => setSelectedRows([])}
                />
              )}
            </div>
            {hasAttemptedSubmit && selectedRows.length === 0 && (
              <p className="text-11 text-danger" role="alert">
                Please select a host.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
