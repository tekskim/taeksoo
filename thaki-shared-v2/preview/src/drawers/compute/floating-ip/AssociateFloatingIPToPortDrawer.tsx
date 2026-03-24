import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

interface PortRow {
  id: string;
  portName: string;
  fixedIp: string;
  instance: string;
  network: string;
  [key: string]: unknown;
}

export interface AssociateFloatingIPToPortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  floatingIpAddress?: string;
}

const ITEMS_PER_PAGE = 5;

const mockPorts: PortRow[] = [
  {
    id: 'p-1',
    portName: 'web-01-eth0',
    fixedIp: '10.0.1.24',
    instance: 'instance-01',
    network: 'prod-vpc',
  },
  {
    id: 'p-2',
    portName: 'app-tier-a',
    fixedIp: '10.0.2.11',
    instance: 'instance-02',
    network: 'prod-vpc',
  },
  {
    id: 'p-3',
    portName: 'db-replica',
    fixedIp: '10.0.3.5',
    instance: 'instance-db-1',
    network: 'data-net',
  },
  {
    id: 'p-4',
    portName: 'lb-backend-1',
    fixedIp: '10.0.10.8',
    instance: 'lb-pool-1',
    network: 'shared-services',
  },
  {
    id: 'p-5',
    portName: 'staging-app',
    fixedIp: '172.16.5.40',
    instance: 'staging-01',
    network: 'staging',
  },
  {
    id: 'p-6',
    portName: 'analytics-eth0',
    fixedIp: '10.30.0.12',
    instance: 'analytics-01',
    network: 'analytics',
  },
  { id: 'p-7', portName: 'orphan-port', fixedIp: '10.20.1.9', instance: '—', network: 'edge' },
  {
    id: 'p-8',
    portName: 'mgmt-eni',
    fixedIp: '192.168.0.50',
    instance: 'bastion',
    network: 'mgmt',
  },
];

export function AssociateFloatingIPToPortDrawer({
  isOpen,
  onClose,
  floatingIpAddress = '203.0.113.50',
}: AssociateFloatingIPToPortDrawerProps) {
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
      mockPorts.filter((p) =>
        [p.portName, p.fixedIp, p.instance, p.network].some((field) =>
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

  const selected = mockPorts.find((p) => selectedRows.includes(p.id));

  const columns: TableColumn[] = [
    { key: 'portName', header: 'Port name', sortable: true },
    { key: 'fixedIp', header: 'Fixed IP', sortable: true },
    { key: 'instance', header: 'Instance', sortable: true },
    { key: 'network', header: 'Network', sortable: true },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Associate floating IP"
      description="Associate this floating IP to a port."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Associate"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Floating IP" values={[floatingIpAddress]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Port</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select a port to associate.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ports"
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
            <SelectableTable<PortRow>
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
                    {row.portName}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    {row.fixedIp}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.instance}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.network}
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
                <span className="text-11 text-text-muted">No port selected</span>
              ) : (
                <Tag
                  label={selected.portName}
                  variant="multiSelect"
                  onClose={() => setSelectedRows([])}
                />
              )}
            </div>
            {hasAttemptedSubmit && selectedRows.length === 0 && (
              <p className="text-11 text-danger" role="alert">
                Please select a port.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
