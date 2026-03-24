import { useState, useEffect, useMemo, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Pagination } from '@shared/components/Pagination';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Tag } from '@shared/components/Tag';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

interface DomainItem {
  id: string;
  name: string;
  driver: string;
  users: number;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface SetDefaultDomainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDefaultId?: string;
}

const defaultDomains: DomainItem[] = [
  {
    id: 'dom-1',
    name: 'corp-sql',
    driver: 'SQL',
    users: 128,
    status: 'Enabled',
    createdAt: 'Jan 04, 2024 09:12:00',
  },
  {
    id: 'dom-2',
    name: 'engineering-ldap',
    driver: 'LDAP',
    users: 84,
    status: 'Enabled',
    createdAt: 'Feb 18, 2024 11:30:22',
  },
  {
    id: 'dom-3',
    name: 'legacy-keystone',
    driver: 'Keystone',
    users: 42,
    status: 'Disabled',
    createdAt: 'Mar 02, 2024 14:05:10',
  },
  {
    id: 'dom-4',
    name: 'default-sql',
    driver: 'SQL',
    users: 512,
    status: 'Enabled',
    createdAt: 'Apr 21, 2024 08:45:33',
  },
  {
    id: 'dom-5',
    name: 'partners-ldap',
    driver: 'LDAP',
    users: 36,
    status: 'Enabled',
    createdAt: 'May 09, 2024 16:20:00',
  },
  {
    id: 'dom-6',
    name: 'sandbox-sql',
    driver: 'SQL',
    users: 12,
    status: 'Enabled',
    createdAt: 'Jun 01, 2024 10:00:00',
  },
  {
    id: 'dom-7',
    name: 'federal-ldap',
    driver: 'LDAP',
    users: 220,
    status: 'Enabled',
    createdAt: 'Jul 14, 2024 13:42:18',
  },
  {
    id: 'dom-8',
    name: 'staging-keystone',
    driver: 'Keystone',
    users: 58,
    status: 'Enabled',
    createdAt: 'Aug 03, 2024 07:55:40',
  },
  {
    id: 'dom-9',
    name: 'readonly-sql',
    driver: 'SQL',
    users: 7,
    status: 'Disabled',
    createdAt: 'Sep 22, 2024 12:11:05',
  },
  {
    id: 'dom-10',
    name: 'global-ldap',
    driver: 'LDAP',
    users: 1903,
    status: 'Enabled',
    createdAt: 'Oct 30, 2024 15:28:50',
  },
];

const ITEMS_PER_PAGE = 5;

export function SetDefaultDomainDrawer({
  isOpen,
  onClose,
  currentDefaultId,
}: SetDefaultDomainDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRows(currentDefaultId ? [currentDefaultId] : []);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, currentDefaultId]);

  const filteredDomains = useMemo(
    () =>
      defaultDomains.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.status.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const paginatedDomains = filteredDomains.slice(
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

  const selectedId = selectedRows[0];
  const selectedDomain = defaultDomains.find((d) => d.id === selectedId);

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'driver', header: 'Driver' },
    { key: 'users', header: 'Users' },
    { key: 'status', header: 'Status' },
    { key: 'createdAt', header: 'Created at', sortable: true },
  ];

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Set default domain"
      description="Select a domain to use as the default login domain. Users will authenticate against this domain by default."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3 w-full pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-13 font-medium text-text leading-5">Default domain</span>
              <span className="text-13 font-medium text-danger leading-5">*</span>
            </div>
            <p className="text-12 text-text-muted">Choose one domain from the list below.</p>
          </div>

          <div className="w-[280px]">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domains by attributes"
              size="sm"
            />
          </div>

          <Pagination
            totalCount={filteredDomains.length}
            size={ITEMS_PER_PAGE}
            currentAt={currentPage}
            onPageChange={setCurrentPage}
            totalCountLabel="items"
          />

          <div className="flex flex-col gap-2 w-full">
            <SelectableTable<DomainItem>
              columns={columns}
              rows={paginatedDomains}
              selectionType="radio"
              selectedRows={selectedRows}
              onRowSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              sort={sort}
              order={order}
              onSortChange={handleSortChange}
            >
              {paginatedDomains.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={columns[0]}>
                    <span className="text-primary font-medium">{row.name}</span>
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[1]}>
                    {row.driver}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[2]}>
                    {row.users}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[3]}>
                    {row.status}
                  </Table.Td>
                  <Table.Td rowData={row} column={columns[4]}>
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
              {!selectedDomain ? (
                <span className="text-11 text-text-muted">No domain selected</span>
              ) : (
                <Tag
                  label={selectedDomain.name}
                  variant="multiSelect"
                  onClose={() => setSelectedRows([])}
                />
              )}
            </div>
            {hasAttemptedSubmit && selectedRows.length === 0 && (
              <p className="text-11 text-danger" role="alert">
                Please select a default domain.
              </p>
            )}
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
