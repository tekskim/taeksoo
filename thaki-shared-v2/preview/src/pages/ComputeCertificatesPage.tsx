import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterCertificateDrawer } from '../drawers/compute/certificate/RegisterCertificateDrawer';
import { EditCertificateDrawer } from '../drawers/compute/certificate/EditCertificateDrawer';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

type CertType = 'server' | 'ca' | 'client';

interface CertificateRow {
  id: string;
  name: string;
  type: CertType;
  domain: string;
  expiration: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockRows: CertificateRow[] = [
  {
    id: 'cert-001',
    name: 'api-prod-tls',
    type: 'server',
    domain: 'api.example.com',
    expiration: 'Dec 31, 2026',
    createdAt: 'Sep 12, 2025 09:23:41',
  },
  {
    id: 'cert-002',
    name: 'internal-ca',
    type: 'ca',
    domain: '—',
    expiration: 'Jan 15, 2030',
    createdAt: 'Sep 11, 2025 14:07:22',
  },
  {
    id: 'cert-003',
    name: 'vpn-client-bundle',
    type: 'client',
    domain: 'vpn.example.com',
    expiration: 'Mar 1, 2027',
    createdAt: 'Sep 10, 2025 11:45:33',
  },
  {
    id: 'cert-004',
    name: 'wildcard-app',
    type: 'server',
    domain: '*.apps.example.com',
    expiration: 'Jun 20, 2026',
    createdAt: 'Aug 1, 2025 16:52:08',
  },
  {
    id: 'cert-005',
    name: 'staging-ingress',
    type: 'server',
    domain: 'staging.example.com',
    expiration: 'Nov 5, 2025',
    createdAt: 'Jan 5, 2025 08:30:15',
  },
  {
    id: 'cert-006',
    name: 'mtls-sidecar',
    type: 'client',
    domain: 'mesh.local',
    expiration: 'Apr 12, 2028',
    createdAt: 'Apr 18, 2025 13:19:44',
  },
  {
    id: 'cert-007',
    name: 'subordinate-ca',
    type: 'ca',
    domain: '—',
    expiration: 'Sep 9, 2029',
    createdAt: 'Mar 22, 2025 10:41:27',
  },
  {
    id: 'cert-008',
    name: 'ldap-tls',
    type: 'server',
    domain: 'ldap.corp.internal',
    expiration: 'Feb 28, 2026',
    createdAt: 'Feb 14, 2025 17:03:56',
  },
  {
    id: 'cert-009',
    name: 'backup-s3',
    type: 'client',
    domain: 's3.amazonaws.com',
    expiration: 'Jul 4, 2027',
    createdAt: 'May 30, 2025 12:28:19',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'server', label: 'Server' },
      { value: 'ca', label: 'CA' },
      { value: 'client', label: 'Client' },
    ],
  },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'domain', label: 'Domain', visible: true },
  { key: 'expiration', label: 'Expiration', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeCertificatesPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [registerDrawerOpen, setRegisterDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [menuTargetCert, setMenuTargetCert] = useState<CertificateRow | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return mockRows;
    return mockRows.filter((row) =>
      appliedFilters.every((filter) => {
        const val = String(row[filter.key] ?? '').toLowerCase();
        return val.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const pageRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasSelection = selectedRows.length > 0;

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'domain', header: 'Domain' },
    { key: 'expiration', header: 'Expiration', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Certificates" />
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            onClick={() => setRegisterDrawerOpen(true)}
          >
            Register certificate
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/compute/certificates/create')}
          >
            Create certificate
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search certificates by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
            <IconTrash size={12} /> Delete
          </Button>
        </div>
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
          <div className="flex items-center gap-1 flex-wrap">
            {appliedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
              >
                <span className="flex items-center gap-1">
                  <span className="text-text">{filter.label}</span>
                  <span className="text-border">|</span>
                  <span className="text-text">{filter.displayValue ?? filter.value}</span>
                </span>
                <button
                  type="button"
                  className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                  onClick={() => handleFilterRemove(filter.id!)}
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
                >
                  <IconX size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
            onClick={() => {
              setAppliedFilters([]);
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <Pagination
        totalCount={filteredRows.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<CertificateRow>
        columns={columns}
        rows={pageRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <Link
                to={`/compute/certificates/${row.id}`}
                className="text-primary font-medium hover:underline"
              >
                {row.name}
              </Link>
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
              {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              >
                <ContextMenu.Item
                  action={() => {
                    setMenuTargetCert(row);
                    setEditDrawerOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <RegisterCertificateDrawer
        isOpen={registerDrawerOpen}
        onClose={() => setRegisterDrawerOpen(false)}
      />
      <EditCertificateDrawer
        isOpen={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setMenuTargetCert(null);
        }}
        certificateId={menuTargetCert?.id}
        initialData={menuTargetCert ? { name: menuTargetCert.name, description: '' } : undefined}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
