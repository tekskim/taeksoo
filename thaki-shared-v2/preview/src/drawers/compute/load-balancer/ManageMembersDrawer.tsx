import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

interface InstanceRow {
  id: string;
  name: string;
  ipAddress: string;
  subnet: string;
  status: 'active' | 'error' | 'pending';
  [key: string]: unknown;
}

export interface ManageMembersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  poolName?: string;
}

const ITEMS_PER_PAGE = 5;

const mockInstances: InstanceRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: `inst-${i + 1}`,
  name: `instance-${String(i + 1).padStart(2, '0')}`,
  ipAddress: `10.0.${Math.floor(i / 4)}.${20 + i}`,
  subnet: i % 3 === 0 ? 'subnet-web' : i % 3 === 1 ? 'subnet-app' : 'subnet-data',
  status: (['active', 'active', 'pending', 'error'][i % 4] ?? 'active') as InstanceRow['status'],
}));

export function ManageMembersDrawer({
  isOpen,
  onClose,
  poolName = 'pool-api',
}: ManageMembersDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [port, setPort] = useState('80');
  const [weight, setWeight] = useState('1');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [portError, setPortError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedRows([]);
      setSearchQuery('');
      setCurrentPage(1);
      setPort('80');
      setWeight('1');
      setHasAttemptedSubmit(false);
      setPortError(null);
    }
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      mockInstances.filter((r) =>
        [r.name, r.ipAddress, r.subnet, r.status].some((field) =>
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

  const handleRemove = (id: string | number) => {
    setSelectedRows((prev) => prev.filter((r) => r !== id));
  };

  const selectedItems = mockInstances.filter((r) => selectedRows.includes(r.id));

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    const p = Number(port);
    if (Number.isNaN(p) || p < 1 || p > 65535) {
      setPortError('Enter a valid port (1–65535).');
      return;
    }
    setPortError(null);
    if (selectedRows.length === 0) return;
    onClose();
  };

  const statusVariant = (s: InstanceRow['status']) =>
    s === 'active' ? 'active' : s === 'error' ? 'error' : 'pending';

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'ipAddress', header: 'IP Address', sortable: true },
    { key: 'subnet', header: 'Subnet', sortable: true },
    { key: 'status', header: 'Status' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Manage members"
      description="Add backend instances to this pool."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Pool name" values={[poolName]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Instances</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">
              Select one or more instances to add as members.
            </p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search instances"
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
            <SelectableTable<InstanceRow>
              columns={columns}
              rows={paginated}
              selectionType="checkbox"
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
                    {row.ipAddress}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.subnet}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    <StatusIndicator variant={statusVariant(row.status)} layout="iconOnly" />
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
              {selectedItems.length === 0 ? (
                <span className="text-11 text-text-muted">No instances selected</span>
              ) : (
                selectedItems.map((item) => (
                  <Tag
                    key={item.id}
                    label={item.name}
                    variant="multiSelect"
                    onClose={() => handleRemove(item.id)}
                  />
                ))
              )}
            </div>
            {hasAttemptedSubmit && selectedRows.length === 0 && (
              <p className="text-11 text-danger" role="alert">
                Please select at least one instance.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-6">
          <FormField label="Port" required error={portError || undefined}>
            <Input
              type="number"
              value={port}
              onChange={(e) => {
                setPort(e.target.value);
                if (portError) setPortError(null);
              }}
              placeholder="80"
              error={!!portError}
              size="sm"
            />
          </FormField>
          <FormField label="Weight">
            <Input
              type="number"
              min={1}
              max={256}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="1"
              size="sm"
            />
          </FormField>
        </div>
      </div>
    </Overlay.Template>
  );
}
