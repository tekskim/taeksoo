import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { AllocateFloatingIPDrawer } from '../drawers/compute/floating-ip/AllocateFloatingIPDrawer';
import { EditFloatingIPDrawer } from '../drawers/compute/floating-ip/EditFloatingIPDrawer';
import { AssociateFloatingIPToPortDrawer } from '../drawers/compute/floating-ip/AssociateFloatingIPToPortDrawer';
import { DisassociateFloatingIPDrawer } from '../drawers/compute/floating-ip/DisassociateFloatingIPDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { Tooltip } from '@shared/components/Tooltip';
import {
  IconBinaryTree,
  IconCube,
  IconDownload,
  IconExternalLink,
  IconUnlink,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type FloatingIPStatus = 'active' | 'error' | 'down';

interface FloatingIP {
  id: string;
  floatingIp: string;
  tenant: string;
  associatedTo: string | null;
  associatedToId: string | null;
  fixedIp: string;
  network: string;
  networkId: string;
  createdAt: string;
  status: FloatingIPStatus;
}

const TENANTS = ['admin', 'demo-project', 'engineering', 'production'] as const;

const mockFloatingIPs: FloatingIP[] = [
  {
    id: 'fip-001',
    floatingIp: '172.24.4.228',
    tenant: TENANTS[0],
    associatedTo: 'web-01',
    associatedToId: 'inst-001',
    fixedIp: '10.7.65.39',
    network: 'net-01',
    networkId: 'net-001',
    createdAt: 'Oct 1, 2025 10:20:28',
    status: 'active',
  },
  {
    id: 'fip-002',
    floatingIp: '172.24.4.229',
    tenant: TENANTS[1],
    associatedTo: 'app-server',
    associatedToId: 'inst-002',
    fixedIp: '10.7.65.40',
    network: 'net-02',
    networkId: 'net-002',
    createdAt: 'Oct 2, 2025 17:33:45',
    status: 'active',
  },
  {
    id: 'fip-003',
    floatingIp: '172.24.4.230',
    tenant: TENANTS[2],
    associatedTo: null,
    associatedToId: null,
    fixedIp: '-',
    network: 'net-01',
    networkId: 'net-001',
    createdAt: 'Oct 3, 2025 00:46:02',
    status: 'down',
  },
  {
    id: 'fip-004',
    floatingIp: '172.24.4.231',
    tenant: TENANTS[3],
    associatedTo: 'db-server',
    associatedToId: 'inst-003',
    fixedIp: '10.7.65.41',
    network: 'net-03',
    networkId: 'net-003',
    createdAt: 'Sep 28, 2025 07:11:07',
    status: 'active',
  },
  {
    id: 'fip-005',
    floatingIp: '172.24.4.232',
    tenant: TENANTS[0],
    associatedTo: 'load-balancer',
    associatedToId: 'lb-001',
    fixedIp: '10.7.65.42',
    network: 'net-01',
    networkId: 'net-001',
    createdAt: 'Sep 25, 2025 10:32:16',
    status: 'active',
  },
  {
    id: 'fip-006',
    floatingIp: '172.24.4.233',
    tenant: TENANTS[1],
    associatedTo: null,
    associatedToId: null,
    fixedIp: '-',
    network: 'net-02',
    networkId: 'net-002',
    createdAt: 'Sep 20, 2025 23:27:51',
    status: 'error',
  },
  {
    id: 'fip-007',
    floatingIp: '172.24.4.234',
    tenant: TENANTS[2],
    associatedTo: 'monitoring',
    associatedToId: 'inst-004',
    fixedIp: '10.7.65.43',
    network: 'net-01',
    networkId: 'net-001',
    createdAt: 'Sep 15, 2025 12:22:26',
    status: 'active',
  },
  {
    id: 'fip-008',
    floatingIp: '172.24.4.235',
    tenant: TENANTS[3],
    associatedTo: 'vpn-gateway',
    associatedToId: 'vpn-001',
    fixedIp: '10.7.65.44',
    network: 'net-04',
    networkId: 'net-004',
    createdAt: 'Sep 10, 2025 01:17:01',
    status: 'active',
  },
  {
    id: 'fip-009',
    floatingIp: '172.24.4.236',
    tenant: TENANTS[0],
    associatedTo: null,
    associatedToId: null,
    fixedIp: '-',
    network: 'net-03',
    networkId: 'net-003',
    createdAt: 'Sep 5, 2025 14:12:36',
    status: 'down',
  },
  {
    id: 'fip-010',
    floatingIp: '172.24.4.237',
    tenant: TENANTS[1],
    associatedTo: 'backup-server',
    associatedToId: 'inst-005',
    fixedIp: '10.7.65.45',
    network: 'net-01',
    networkId: 'net-001',
    createdAt: 'Sep 1, 2025 10:20:28',
    status: 'active',
  },
];

const floatingIPStatusMap: Record<FloatingIPStatus, StatusVariant> = {
  active: 'active',
  error: 'error',
  down: 'down',
};

const filterKeys: FilterKey[] = [
  { key: 'floatingIp', label: 'Floating IP', type: 'input' },
  { key: 'tenant', label: 'Tenant', type: 'input' },
  { key: 'associatedTo', label: 'Associated to', type: 'input' },
  { key: 'fixedIp', label: 'Fixed IP', type: 'input' },
  { key: 'network', label: 'Network', type: 'input' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'down', label: 'Down' },
    ],
  },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function fipMatches(f: FloatingIP, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof FloatingIP;
  const value = String(f[key] ?? '').toLowerCase();
  return value.includes(fv);
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'floatingIp', label: 'Floating IP', visible: true, locked: true },
  { key: 'fixedIp', label: 'Fixed IP', visible: true },
  { key: 'port', label: 'Port', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminFloatingIPsPage() {
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [associateOpen, setAssociateOpen] = useState(false);
  const [disassociateOpen, setDisassociateOpen] = useState(false);
  const [selectedFloatingIP, setSelectedFloatingIP] = useState<FloatingIP | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const [floatingIPs] = useState(mockFloatingIPs);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return floatingIPs;
    return floatingIPs.filter((f) => appliedFilters.every((fl) => fipMatches(f, fl)));
  }, [floatingIPs, appliedFilters]);

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
    { key: 'floatingIp', header: 'Floating IP', sortable: true },
    { key: 'tenant', header: 'Tenant', sortable: true },
    { key: 'associatedTo', header: 'Associated to' },
    { key: 'fixedIp', header: 'Fixed IP', sortable: true },
    { key: 'network', header: 'Network', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Floating IPs" />
        <Button
          variant="primary"
          size="md"
          leftIcon={<IconBinaryTree size={12} stroke={1.5} />}
          onClick={() => setAllocateOpen(true)}
        >
          Allocate Floating IP
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search floating IP by attributes"
            defaultFilterKey="floatingIp"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} stroke={1.5} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
          <IconUnlink size={12} stroke={1.5} /> Release
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

      <SelectableTable<FloatingIP>
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
              <StatusIndicator variant={floatingIPStatusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/floating-ips/${row.id}`}
                  className={`${linkClass} truncate`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.floatingIp}
                </Link>
                <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="text-12 leading-18 text-text truncate">{row.tenant}</span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.associatedTo ? (
                <div className="flex items-center gap-2 justify-between w-full">
                  <div className="flex flex-col gap-0.5 min-w-0 text-left">
                    <Tooltip content={row.associatedTo} direction="top">
                      <Link
                        to={`/compute-admin/instances/${row.associatedToId}`}
                        className={`inline-flex items-center gap-1 min-w-0 ${linkClass} truncate`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="truncate">{row.associatedTo}</span>
                        <IconExternalLink size={12} className="flex-shrink-0 text-primary" />
                      </Link>
                    </Tooltip>
                    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                      ID : {row.associatedToId?.substring(0, 8)}
                    </span>
                  </div>
                  <Tooltip content="Instance" direction="top">
                    <div className="flex-shrink-0 inline-flex items-center justify-center size-[22px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-sm)] cursor-default">
                      <IconCube
                        size={12}
                        stroke={1.5}
                        className="text-[var(--color-text-subtle)]"
                      />
                    </div>
                  </Tooltip>
                </div>
              ) : (
                <span className="block text-left w-full">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.fixedIp}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Tooltip content={row.network} direction="top">
                  <Link
                    to={`/compute-admin/networks/${row.networkId}`}
                    className={`inline-flex items-center gap-1 min-w-0 ${linkClass} truncate`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="truncate">{row.network}</span>
                    <IconExternalLink size={12} className="flex-shrink-0 text-primary" />
                  </Link>
                </Tooltip>
                <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                  ID : {row.networkId.substring(0, 8)}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {stripTime(row.createdAt)}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]} preventClickPropagation>
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
                <ContextMenu.Item
                  action={() => {
                    setSelectedFloatingIP(row);
                    setAssociateOpen(true);
                  }}
                  disabled={!!row.associatedTo}
                >
                  Associate
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedFloatingIP(row);
                    setDisassociateOpen(true);
                  }}
                  disabled={!row.associatedTo}
                >
                  Disassociate
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedFloatingIP(row);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Release:', row.id)} danger>
                  Release
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
      <AllocateFloatingIPDrawer isOpen={allocateOpen} onClose={() => setAllocateOpen(false)} />
      <EditFloatingIPDrawer
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedFloatingIP(null);
        }}
        floatingIpAddress={selectedFloatingIP?.floatingIp}
      />
      <AssociateFloatingIPToPortDrawer
        isOpen={associateOpen}
        onClose={() => {
          setAssociateOpen(false);
          setSelectedFloatingIP(null);
        }}
        floatingIpAddress={selectedFloatingIP?.floatingIp}
      />
      <DisassociateFloatingIPDrawer
        isOpen={disassociateOpen}
        onClose={() => {
          setDisassociateOpen(false);
          setSelectedFloatingIP(null);
        }}
        floatingIpAddress={selectedFloatingIP?.floatingIp}
        associatedTo={
          selectedFloatingIP?.associatedTo
            ? `${selectedFloatingIP.associatedTo} · ${selectedFloatingIP.fixedIp}`
            : undefined
        }
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
