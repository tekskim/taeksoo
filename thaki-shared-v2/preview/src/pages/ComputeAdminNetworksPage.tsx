import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { EditNetworkDrawer } from '../drawers/compute/network/EditNetworkDrawer';
import { CreateSubnetDrawer } from '../drawers/compute/network/CreateSubnetDrawer';
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

type NetworkStatus = 'active' | 'error' | 'building';

interface Network {
  id: string;
  name: string;
  tenant: string;
  subnetCidr: string[];
  external: boolean;
  shared: boolean;
  adminState: 'Up' | 'Down';
  diskTag: string;
  status: NetworkStatus;
  createdAt: string;
  [key: string]: unknown;
}

const mockNetworks: Network[] = [
  {
    id: 'net-001',
    name: 'net-01',
    tenant: 'admin',
    subnetCidr: ['10.62.0.0/24', '10.62.1.0/24', '10.62.2.0/24'],
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-01-15 09:30:00',
  },
  {
    id: 'net-002',
    name: 'internal-net',
    tenant: 'demo-project',
    subnetCidr: ['192.168.1.0/24', '192.168.2.0/24'],
    external: false,
    shared: false,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-01-20 14:15:00',
  },
  {
    id: 'net-003',
    name: 'dev-network',
    tenant: 'engineering',
    subnetCidr: ['10.10.0.0/16'],
    external: false,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-02-01 11:00:00',
  },
  {
    id: 'net-004',
    name: 'prod-net',
    tenant: 'production',
    subnetCidr: ['172.16.0.0/12', '172.17.0.0/16'],
    external: true,
    shared: false,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'building',
    createdAt: '2026-02-10 08:45:00',
  },
  {
    id: 'net-005',
    name: 'test-network',
    tenant: 'admin',
    subnetCidr: ['10.20.0.0/24'],
    external: false,
    shared: false,
    adminState: 'Down',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-02-15 16:30:00',
  },
  {
    id: 'net-006',
    name: 'dmz-net',
    tenant: 'demo-project',
    subnetCidr: ['10.30.0.0/24'],
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-02-20 10:00:00',
  },
  {
    id: 'net-007',
    name: 'management-net',
    tenant: 'engineering',
    subnetCidr: ['10.0.0.0/8'],
    external: false,
    shared: false,
    adminState: 'Down',
    diskTag: 'Project',
    status: 'error',
    createdAt: '2026-03-01 13:20:00',
  },
  {
    id: 'net-008',
    name: 'backup-network',
    tenant: 'production',
    subnetCidr: ['192.168.100.0/24'],
    external: false,
    shared: true,
    adminState: 'Up',
    diskTag: 'Project',
    status: 'active',
    createdAt: '2026-03-05 07:50:00',
  },
  {
    id: 'net-009',
    name: 'external-gateway',
    tenant: 'admin',
    subnetCidr: ['203.0.113.0/24'],
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'Shared',
    status: 'active',
    createdAt: '2026-03-10 15:10:00',
  },
  {
    id: 'net-010',
    name: 'provider-net',
    tenant: 'engineering',
    subnetCidr: ['198.51.100.0/24'],
    external: true,
    shared: true,
    adminState: 'Up',
    diskTag: 'External',
    status: 'active',
    createdAt: '2026-03-15 12:00:00',
  },
];

const networkStatusMap: Record<NetworkStatus, StatusVariant> = {
  active: 'active',
  error: 'error',
  building: 'building',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'tenant', label: 'Tenant', type: 'input', placeholder: 'Enter tenant...' },
  { key: 'subnetCidr', label: 'Subnet CIDR', type: 'input', placeholder: 'Enter subnet CIDR...' },
  {
    key: 'external',
    label: 'External',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'shared',
    label: 'Shared',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'adminState',
    label: 'Admin state',
    type: 'select',
    options: [
      { value: 'Up', label: 'Up' },
      { value: 'Down', label: 'Down' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'building', label: 'Building' },
    ],
  },
];

function filterCellValue(n: Network, field: string): string {
  const raw = n[field as keyof Network];
  if (Array.isArray(raw)) {
    return String(raw).toLowerCase();
  }
  return String(raw || '').toLowerCase();
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'tenant', label: 'Tenant', visible: true },
  { key: 'subnets', label: 'Subnets', visible: true },
  { key: 'shared', label: 'Shared', visible: true },
  { key: 'external', label: 'External', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminNetworksPage() {
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [editNetworkOpen, setEditNetworkOpen] = useState(false);
  const [createSubnetOpen, setCreateSubnetOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'current';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const filteredNetworks = useMemo(() => {
    let filtered = mockNetworks;

    if (activeTab === 'current') {
      filtered = filtered.filter((n) => n.diskTag === 'Project');
    } else if (activeTab === 'shared') {
      filtered = filtered.filter((n) => n.diskTag === 'Shared');
    } else if (activeTab === 'external') {
      filtered = filtered.filter((n) => n.diskTag === 'External');
    }

    if (appliedFilters.length > 0) {
      filtered = filtered.filter((n) =>
        appliedFilters.every((filter) => {
          const value = filterCellValue(n, filter.key);
          return value.includes(String(filter.value ?? '').toLowerCase());
        })
      );
    }

    return filtered;
  }, [appliedFilters, activeTab]);

  const itemsPerPage = 10;
  const pageRows = filteredNetworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const hasSelection = selectedRows.length > 0;

  const sharedColumnHeader = activeTab === 'current' ? 'Shared' : 'Is Current Tenant';

  const columns: TableColumn[] = useMemo(() => {
    const base: TableColumn[] = [
      { key: 'status', header: 'Status', width: 80, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'tenant', header: 'Tenant', sortable: true },
      { key: 'subnetCidr', header: 'Subnet CIDR' },
      { key: 'external', header: 'External' },
      { key: 'diskTag', header: sharedColumnHeader, sortable: true },
      { key: 'adminState', header: 'Admin state' },
      { key: 'createdAt', header: 'Created at', sortable: true },
      { key: 'actions', header: 'Action', width: 60, align: 'center' },
    ];
    if (activeTab === 'external') {
      return base.filter((col) => col.key !== 'external');
    }
    return base;
  }, [activeTab, sharedColumnHeader]);

  const c = (key: string) => columns.find((col) => col.key === key)!;

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Networks" />
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/compute-admin/networks/create')}
        >
          Create network
        </Button>
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={setActiveTab}
        size="sm"
        variant="line"
        contentClassName="hidden"
        fullWidth
      >
        <Tab id="current" label="Current tenant">
          {null}
        </Tab>
        <Tab id="shared" label="Shared">
          {null}
        </Tab>
        <Tab id="external" label="External">
          {null}
        </Tab>
      </Tabs>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search network by attributes"
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
        totalCount={filteredNetworks.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<Network>
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
            <Table.Td rowData={row} column={c('status')}>
              <StatusIndicator variant={networkStatusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/networks/${row.id}`}
                  className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
                >
                  {row.name}
                </Link>
                <span className="text-11 leading-16 text-text-muted">{row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={c('tenant')}>
              <span className="text-12 text-text truncate" title={row.tenant}>
                {row.tenant}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('subnetCidr')}>
              <span className="flex items-center gap-1 min-w-0">
                <span className="truncate">{row.subnetCidr[0]}</span>
                {row.subnetCidr.length > 1 && (
                  <span className="ml-auto shrink-0">
                    <Popover
                      trigger="click"
                      position="bottom"
                      aria-label={`All subnet CIDRs (${row.subnetCidr.length})`}
                      content={
                        <div className="p-4 min-w-[160px] max-w-[320px]">
                          <div className="text-[10px] font-normal leading-[14px] text-text-muted mb-2">
                            All Subnet CIDRs ({row.subnetCidr.length})
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {row.subnetCidr.map((cidr, i) => (
                              <Badge key={i} theme="gry" size="sm" type="subtle">
                                {cidr}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <span className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded border border-transparent text-[10px] font-normal leading-[14px] text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer">
                        +{row.subnetCidr.length - 1}
                      </span>
                    </Popover>
                  </span>
                )}
              </span>
            </Table.Td>
            {activeTab !== 'external' && (
              <Table.Td rowData={row} column={c('external')}>
                {row.external ? 'Yes' : 'No'}
              </Table.Td>
            )}
            <Table.Td rowData={row} column={c('shared')}>
              {row.shared ? 'Yes' : 'No'}
            </Table.Td>
            <Table.Td rowData={row} column={c('adminState')}>
              <Badge theme={row.adminState === 'Up' ? 'gre' : 'gry'} size="sm" type="subtle">
                {row.adminState}
              </Badge>
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
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
                    setSelectedNetwork(row);
                    setCreateSubnetOpen(true);
                  }}
                >
                  Create subnet
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedNetwork(row);
                    setEditNetworkOpen(true);
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
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
      <EditNetworkDrawer
        isOpen={editNetworkOpen}
        onClose={() => {
          setEditNetworkOpen(false);
          setSelectedNetwork(null);
        }}
        networkId={selectedNetwork?.id}
        initialData={
          selectedNetwork
            ? {
                name: selectedNetwork.name,
                shared: selectedNetwork.shared,
                adminStateUp: selectedNetwork.adminState === 'Up',
              }
            : undefined
        }
      />
      <CreateSubnetDrawer
        isOpen={createSubnetOpen}
        onClose={() => {
          setCreateSubnetOpen(false);
          setSelectedNetwork(null);
        }}
        networkName={selectedNetwork?.name}
      />
    </div>
  );
}
