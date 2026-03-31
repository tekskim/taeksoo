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

interface CaCertRow {
  id: string;
  name: string;
  type: string;
  expiration: string;
  status: 'valid' | 'expiring';
  [key: string]: unknown;
}

export interface ChangeCACertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listenerName?: string;
}

const ITEMS_PER_PAGE = 5;

const mockCaCertificates: CaCertRow[] = [
  { id: 'ca-1', name: 'internal-ca', type: 'CA', expiration: 'Jan 15, 2030', status: 'valid' },
  { id: 'ca-2', name: 'subordinate-ca', type: 'CA', expiration: 'Sep 9, 2029', status: 'valid' },
  { id: 'ca-3', name: 'corp-root', type: 'CA', expiration: 'Dec 1, 2028', status: 'valid' },
  { id: 'ca-4', name: 'staging-ca', type: 'CA', expiration: 'Mar 3, 2026', status: 'expiring' },
];

export function ChangeCACertificateDrawer({
  isOpen,
  onClose,
  listenerName = 'listener-https',
}: ChangeCACertificateDrawerProps) {
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
      mockCaCertificates.filter((c) =>
        [c.name, c.type, c.expiration, c.status].some((field) =>
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

  const selected = mockCaCertificates.find((c) => selectedRows.includes(c.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'expiration', header: 'Expiration', sortable: true },
    { key: 'status', header: 'Status' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Change CA certificate"
      description="Select a CA certificate for client verification."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Change"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Listener name" values={[listenerName]} />
        </div>

        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">CA certificate</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select a CA certificate.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CA certificates"
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
            <SelectableTable<CaCertRow>
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
                    {row.expiration}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    <StatusIndicator
                      variant={row.status === 'valid' ? 'active' : 'building'}
                      label={row.status === 'valid' ? 'Valid' : 'Expiring'}
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
                <span className="text-11 text-text-muted">No CA certificate selected</span>
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
                Please select a CA certificate.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
