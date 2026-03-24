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

interface SubnetItem {
  id: string;
  name: string;
  cidr: string;
  network: string;
  ipVersion: string;
  [key: string]: unknown;
}

export interface ConnectSubnetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routerName?: string;
}

const mockSubnets: SubnetItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: `subnet-${i + 1}`,
  name: `subnet-${i + 1}`,
  cidr: `10.0.${i}.0/24`,
  network: `network-${(i % 3) + 1}`,
  ipVersion: 'IPv4',
}));

const ITEMS_PER_PAGE = 5;

export function ConnectSubnetDrawer({
  isOpen,
  onClose,
  routerName = '',
}: ConnectSubnetDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    if (isOpen) {
      setSelectedRows([]);
      setSearchQuery('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      mockSubnets.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.cidr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.network.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleSubmit = () => {
    if (selectedRows.length === 0) return;
    onClose();
  };

  const selectedItem = mockSubnets.find((s) => selectedRows.includes(s.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'cidr', header: 'CIDR' },
    { key: 'network', header: 'Network' },
    { key: 'ipVersion', header: 'IP version' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Connect subnet"
      description="Connect a subnet to this router."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Connect"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <InfoContainer label="Router" values={[routerName]} />

        <div className="flex flex-col gap-3 w-full pb-5">
          <span className="text-13 font-medium text-text">Select a subnet</span>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subnets"
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
            <SelectableTable<SubnetItem>
              columns={columns}
              rows={paged}
              selectionType="radio"
              selectedRows={selectedRows}
              onRowSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              sort={sort}
              order={order}
              onSortChange={handleSortChange}
            >
              {paged.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={columns[0]}>
                    <span className="text-primary font-medium">{row.name}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    {row.cidr}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.network}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.ipVersion}
                  </Table.Td>
                </Table.Tr>
              ))}
            </SelectableTable>

            <div className="flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border border-border bg-surface-muted">
              {selectedItem ? (
                <Tag
                  label={selectedItem.name}
                  variant="multiSelect"
                  onClose={() => setSelectedRows([])}
                />
              ) : (
                <span className="text-11 text-text-muted">No subnet selected</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
