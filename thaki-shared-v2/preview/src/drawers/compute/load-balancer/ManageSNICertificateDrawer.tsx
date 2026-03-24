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
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface ManageSNICertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listenerName: string;
  initialSelectedIds?: string[];
}

interface CertRow {
  id: string;
  name: string;
  domain: string;
  type: string;
  expiration: string;
  status: 'valid' | 'expiring' | 'expired';
  [key: string]: unknown;
}

const ITEMS_PER_PAGE = 5;

const MOCK_CERTS: CertRow[] = [
  {
    id: 'sni-1',
    name: 'api-prod-tls',
    domain: 'api.example.com',
    type: 'RSA',
    expiration: 'Dec 31, 2026',
    status: 'valid',
  },
  {
    id: 'sni-2',
    name: 'wildcard-app',
    domain: '*.app.example.com',
    type: 'ECDSA',
    expiration: 'Jun 15, 2026',
    status: 'valid',
  },
  {
    id: 'sni-3',
    name: 'legacy-rsa',
    domain: 'legacy.example.com',
    type: 'RSA',
    expiration: 'Apr 2, 2026',
    status: 'expiring',
  },
  {
    id: 'sni-4',
    name: 'admin-console',
    domain: 'admin.example.com',
    type: 'RSA',
    expiration: 'Jan 10, 2025',
    status: 'expired',
  },
  {
    id: 'sni-5',
    name: 'cdn-edge',
    domain: 'cdn.example.com',
    type: 'ECDSA',
    expiration: 'Aug 22, 2027',
    status: 'valid',
  },
  {
    id: 'sni-6',
    name: 'internal-mtls',
    domain: 'internal.svc.local',
    type: 'RSA',
    expiration: 'Mar 1, 2026',
    status: 'valid',
  },
  {
    id: 'sni-7',
    name: 'staging-wildcard',
    domain: '*.staging.example.com',
    type: 'ECDSA',
    expiration: 'May 30, 2026',
    status: 'expiring',
  },
  {
    id: 'sni-8',
    name: 'partner-api',
    domain: 'partner-api.example.com',
    type: 'RSA',
    expiration: 'Nov 11, 2027',
    status: 'valid',
  },
];

const statusMap: Record<CertRow['status'], StatusVariant> = {
  valid: 'active',
  expiring: 'degraded',
  expired: 'error',
};

export function ManageSNICertificateDrawer({
  isOpen,
  onClose,
  listenerName,
  initialSelectedIds = [],
}: ManageSNICertificateDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const initialKey = initialSelectedIds.slice().sort().join(',');

  useEffect(() => {
    if (isOpen) {
      setSelectedRows([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
    }
  }, [isOpen, initialKey]);

  const filtered = useMemo(
    () =>
      MOCK_CERTS.filter((c) =>
        [c.name, c.domain, c.type, c.expiration, c.status].some((field) =>
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
    onClose();
  };

  const handleRemove = (id: string | number) => {
    setSelectedRows((prev) => prev.filter((r) => r !== id));
  };

  const selectedItems = MOCK_CERTS.filter((c) => selectedRows.includes(c.id));

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'domain', header: 'Domain', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'expiration', header: 'Expiration', sortable: true, align: 'right' },
    { key: 'status', header: 'Status', width: 100, align: 'center' },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Manage SNI certificate"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Listener name" values={[listenerName]} />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1">
            <span className="text-13 font-medium text-text leading-5">Certificates</span>
            <p className="text-12 text-text-muted">
              Select one or more SNI certificates for this listener.
            </p>
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
                    {row.name}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    {row.domain}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.type}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.expiration}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[4]}>
                    <StatusIndicator
                      variant={statusMap[row.status]}
                      label={
                        row.status === 'valid'
                          ? 'Valid'
                          : row.status === 'expiring'
                            ? 'Expiring'
                            : 'Expired'
                      }
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </SelectableTable>

            <div className="flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border border-border bg-surface-muted">
              {selectedItems.length === 0 ? (
                <span className="text-11 text-text-muted">No certificates selected</span>
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
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
