import { useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { RegisterCertificateDrawer } from '../drawers/compute/certificate/RegisterCertificateDrawer';
import { EditCertificateDrawer } from '../drawers/compute/certificate/EditCertificateDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Popover } from '@shared/components/Popover';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type CertificateStatus = 'active' | 'error' | 'pending';
type CertificateType = 'server' | 'ca';

interface Certificate {
  id: string;
  name: string;
  /** SAN / subject alternative names; empty for CA or N/A */
  sanDomains: string[];
  listener: string;
  listenerId: string;
  listenerCount: number;
  expiresAt: string;
  createdAt: string;
  type: CertificateType;
  status: CertificateStatus;
}

const mockCertificates: Certificate[] = [
  {
    id: 'cert-001',
    name: 'server-cert-1',
    sanDomains: ['www.domain.com', 'api.domain.com', 'cdn.domain.com', 'static.domain.com'],
    listener: 'listener-1',
    listenerId: '294u92s2',
    listenerCount: 10,
    expiresAt: 'Oct 5, 2025',
    createdAt: 'Oct 3, 2025 00:46:02',
    type: 'server',
    status: 'active',
  },
  {
    id: 'cert-002',
    name: 'api-cert',
    sanDomains: ['api.example.com', 'api-staging.example.com', 'api-internal.example.com'],
    listener: 'listener-api',
    listenerId: '38fj29dk',
    listenerCount: 2,
    expiresAt: 'Jan 15, 2026',
    createdAt: 'Sep 28, 2025 07:11:07',
    type: 'server',
    status: 'active',
  },
  {
    id: 'cert-003',
    name: 'wildcard-cert',
    sanDomains: [
      'www.example.org',
      'api.example.org',
      'app.example.org',
      'cdn.example.org',
      'mail.example.org',
      'docs.example.org',
    ],
    listener: 'listener-web',
    listenerId: '9dk38fj2',
    listenerCount: 0,
    expiresAt: 'Dec 1, 2025',
    createdAt: 'Sep 20, 2025 23:27:51',
    type: 'server',
    status: 'active',
  },
  {
    id: 'cert-004',
    name: 'staging-cert',
    sanDomains: ['staging.domain.com', 'staging-api.domain.com'],
    listener: 'listener-staging',
    listenerId: 'k29dk38f',
    listenerCount: 0,
    expiresAt: 'Nov 15, 2025',
    createdAt: 'Sep 15, 2025 12:22:26',
    type: 'server',
    status: 'pending',
  },
  {
    id: 'cert-005',
    name: 'internal-cert',
    sanDomains: [
      'internal.company.com',
      'svc.internal.company.com',
      'db.internal.company.com',
      'cache.internal.company.com',
      'queue.internal.company.com',
    ],
    listener: 'listener-internal',
    listenerId: 'fj29dk38',
    listenerCount: 5,
    expiresAt: 'Mar 20, 2026',
    createdAt: 'Sep 10, 2025 01:17:01',
    type: 'server',
    status: 'active',
  },
  {
    id: 'cert-006',
    name: 'root-ca',
    sanDomains: [],
    listener: '-',
    listenerId: '',
    listenerCount: 0,
    expiresAt: 'Jan 1, 2030',
    createdAt: 'Jan 1, 2025 10:20:28',
    type: 'ca',
    status: 'active',
  },
  {
    id: 'cert-007',
    name: 'intermediate-ca',
    sanDomains: [],
    listener: '-',
    listenerId: '',
    listenerCount: 0,
    expiresAt: 'Jun 15, 2028',
    createdAt: 'Jun 15, 2025 12:22:26',
    type: 'ca',
    status: 'active',
  },
  {
    id: 'cert-008',
    name: 'expired-cert',
    sanDomains: ['old.domain.com', 'legacy.old.domain.com', 'redirect.old.domain.com'],
    listener: '-',
    listenerId: '',
    listenerCount: 0,
    expiresAt: 'Aug 1, 2025',
    createdAt: 'Aug 1, 2024 10:20:28',
    type: 'server',
    status: 'error',
  },
  {
    id: 'cert-009',
    name: 'dev-ca',
    sanDomains: [],
    listener: '-',
    listenerId: '',
    listenerCount: 0,
    expiresAt: 'Dec 31, 2027',
    createdAt: 'Jan 15, 2025 12:22:26',
    type: 'ca',
    status: 'active',
  },
  {
    id: 'cert-010',
    name: 'client-auth-cert',
    sanDomains: ['auth.domain.com', 'auth-admin.domain.com'],
    listener: 'listener-auth',
    listenerId: '29dk38fj',
    listenerCount: 0,
    expiresAt: 'Jun 1, 2026',
    createdAt: 'Jun 1, 2025 10:20:28',
    type: 'server',
    status: 'active',
  },
];

const certStatusMap: Record<CertificateStatus, StatusVariant> = {
  active: 'active',
  error: 'error',
  pending: 'building',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'domain', label: 'Domain', type: 'input', placeholder: 'Enter domain...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function certMatches(c: Certificate, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  if (filter.key === 'domain') {
    return c.sanDomains.some((d) => d.toLowerCase().includes(fv));
  }
  const v = c[filter.key as keyof Certificate];
  if (typeof v === 'string') return v.toLowerCase().includes(fv);
  return true;
}

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'domain', label: 'Domain', visible: true },
  { key: 'expiration', label: 'Expiration', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeCertificatesPage() {
  const [registerDrawerOpen, setRegisterDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [menuTargetCert, setMenuTargetCert] = useState<Certificate | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'server';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    let filtered = mockCertificates.filter((c) => c.type === activeTab);
    if (appliedFilters.length === 0) return filtered;
    return filtered.filter((c) => appliedFilters.every((f) => certMatches(c, f)));
  }, [activeTab, appliedFilters]);

  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage, itemsPerPage]
  );

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
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'domain', header: 'SAN', sortable: true },
    { key: 'listener', header: 'Listener', sortable: true },
    { key: 'expiresAt', header: 'Expires at', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Certificates" />
        <Button variant="primary" size="md" onClick={() => setRegisterDrawerOpen(true)}>
          Register certificate
        </Button>
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={(id) => setActiveTab(id)}
        variant="line"
        size="sm"
        fullWidth
        contentClassName="hidden"
      >
        <Tab id="server" label="Server">
          <></>
        </Tab>
        <Tab id="ca" label="CA">
          <></>
        </Tab>
      </Tabs>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search certificate by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
          <IconTrash size={12} /> Delete
        </Button>
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
                  aria-label={`Remove ${filter.label}`}
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

      <SelectableTable<Certificate>
        columns={columns}
        rows={paginatedRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <StatusIndicator variant={certStatusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link to={`/compute/certificates/${row.id}`} className={linkClass}>
                  {row.name}
                </Link>
                <span className="text-11 leading-16 text-text-muted">ID : {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.sanDomains.length === 0 ? (
                '-'
              ) : (
                <span className="flex items-center gap-1 min-w-0 max-w-full">
                  <span className="truncate min-w-0">{row.sanDomains[0]}</span>
                  {row.sanDomains.length > 1 && (
                    <span className="ml-auto shrink-0">
                      <Popover
                        trigger="click"
                        position="bottom"
                        aria-label={`All SANs (${row.sanDomains.length})`}
                        content={
                          <div className="p-4 min-w-[160px] max-w-[320px]">
                            <div className="text-[10px] font-normal leading-[14px] text-text-muted mb-2">
                              All SANs ({row.sanDomains.length})
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {row.sanDomains.map((d, i) => (
                                <Badge key={i} theme="gry" size="sm" type="subtle">
                                  {d}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        }
                      >
                        <span className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded border border-transparent text-[10px] font-normal leading-[14px] text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer">
                          +{row.sanDomains.length - 1}
                        </span>
                      </Popover>
                    </span>
                  )}
                </span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.listener === '-' ? (
                '-'
              ) : (
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex w-full items-center gap-1">
                    <span className="text-12 leading-18 text-text">{row.listener}</span>
                    {row.listenerCount > 0 && (
                      <span className="ml-auto inline-flex shrink-0 items-center justify-center px-1.5 rounded text-10 leading-14 font-medium text-text-muted bg-surface-subtle h-5">
                        +{row.listenerCount}
                      </span>
                    )}
                  </div>
                  <span className="text-11 leading-16 text-text-muted">ID : {row.listenerId}</span>
                </div>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              <span
                className={
                  new Date(row.expiresAt) < new Date()
                    ? 'text-[var(--semantic-color-text-danger)]'
                    : ''
                }
              >
                {row.expiresAt}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {stripTime(row.createdAt)}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
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
                <ContextMenu.Item action={() => console.log('Download:', row.id)}>
                  Download
                </ContextMenu.Item>
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
