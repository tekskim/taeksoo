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

interface CertRow {
  id: string;
  name: string;
  type: string;
  domain: string;
  expiration: string;
  status: 'valid' | 'expiring' | 'expired';
  [key: string]: unknown;
}

export interface ChangeServerCertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listenerName?: string;
}

const ITEMS_PER_PAGE = 5;

const mockCertificates: CertRow[] = [
  {
    id: 'c-1',
    name: 'api-prod-tls',
    type: 'SERVER',
    domain: 'api.example.com',
    expiration: 'Dec 31, 2026',
    status: 'valid',
  },
  {
    id: 'c-2',
    name: 'wildcard-app',
    type: 'SERVER',
    domain: '*.apps.example.com',
    expiration: 'Jun 20, 2026',
    status: 'valid',
  },
  {
    id: 'c-3',
    name: 'staging-ingress',
    type: 'SERVER',
    domain: 'staging.example.com',
    expiration: 'Nov 5, 2025',
    status: 'expiring',
  },
  {
    id: 'c-4',
    name: 'ldap-tls',
    type: 'SERVER',
    domain: 'ldap.corp.internal',
    expiration: 'Feb 28, 2026',
    status: 'valid',
  },
  {
    id: 'c-5',
    name: 'legacy-wildcard',
    type: 'SERVER',
    domain: '*.legacy.io',
    expiration: 'Jan 1, 2024',
    status: 'expired',
  },
  {
    id: 'c-6',
    name: 'grpc-edge',
    type: 'SERVER',
    domain: 'grpc.example.com',
    expiration: 'Aug 8, 2027',
    status: 'valid',
  },
];

export function ChangeServerCertificateDrawer({
  isOpen,
  onClose,
  listenerName = 'listener-https',
}: ChangeServerCertificateDrawerProps) {
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
      mockCertificates.filter((c) =>
        [c.name, c.type, c.domain, c.expiration, c.status].some((field) =>
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

  const selected = mockCertificates.find((c) => selectedRows.includes(c.id));

  const statusVariant = (s: CertRow['status']) =>
    s === 'valid' ? 'active' : s === 'expiring' ? 'building' : 'error';

  const statusLabel = (s: CertRow['status']) =>
    s === 'valid' ? 'Valid' : s === 'expiring' ? 'Expiring' : 'Expired';

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'domain', header: 'Domain', sortable: true },
    { key: 'expiration', header: 'Expiration', sortable: true },
    { key: 'status', header: 'Status' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Change server certificate"
      description="Select a server certificate for this listener."
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
              <span className="text-13 font-medium text-text leading-5">Certificate</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Select a server certificate.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates"
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
            <SelectableTable<CertRow>
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
                    {row.domain}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.expiration}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[4]}>
                    <StatusIndicator
                      variant={statusVariant(row.status)}
                      label={statusLabel(row.status)}
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
                <span className="text-11 text-text-muted">No certificate selected</span>
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
                Please select a certificate.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
