import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { EditLoadBalancerDrawer } from '../drawers/compute/load-balancer/EditLoadBalancerDrawer';
import { AssociateFloatingIPToLBDrawer } from '../drawers/compute/load-balancer/AssociateFloatingIPToLBDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { Popover } from '@shared/components/Popover';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import containerIcon from '@shared/assets/app-icons/container.png';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type LoadBalancerStatus = 'active' | 'error' | 'building' | 'pending';

interface LoadBalancer {
  id: string;
  name: string;
  vipAddress: string;
  ownedNetwork: string;
  ownedNetworkId: string;
  floatingIp: string;
  floatingIpId: string;
  listeners: string;
  listenerId: string;
  listenerCount: number;
  createdAt: string;
  status: LoadBalancerStatus;
  origin?: 'container' | 'manual';
  [key: string]: unknown;
}

const mockLoadBalancers: LoadBalancer[] = [
  {
    id: 'lb-001',
    name: 'web-lb-01',
    vipAddress: '192.168.10.13',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    floatingIp: '192.168.10.13',
    floatingIpId: 'fip-001',
    listeners: 'listener-http-80',
    listenerId: '29tgj234',
    listenerCount: 2,
    createdAt: 'Oct 3, 2025 00:46:02',
    status: 'active',
    origin: 'container',
  },
  {
    id: 'lb-002',
    name: 'api-lb',
    vipAddress: '192.168.10.14',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    floatingIp: '192.168.10.14',
    floatingIpId: 'fip-002',
    listeners: 'listener-https-443',
    listenerId: '38fk29dk',
    listenerCount: 0,
    createdAt: 'Oct 2, 2025 17:33:45',
    status: 'active',
  },
  {
    id: 'lb-003',
    name: 'app-lb',
    vipAddress: '192.168.10.15',
    ownedNetwork: 'net-03',
    ownedNetworkId: 'net-003',
    floatingIp: '192.168.10.15',
    floatingIpId: 'fip-003',
    listeners: 'listener-tcp-8080',
    listenerId: '9dk38fj2',
    listenerCount: 1,
    createdAt: 'Oct 1, 2025 10:20:28',
    status: 'building',
    origin: 'container',
  },
  {
    id: 'lb-004',
    name: 'db-lb',
    vipAddress: '192.168.10.16',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    floatingIp: '-',
    floatingIpId: '',
    listeners: 'listener-mysql-3306',
    listenerId: 'k29dk38f',
    listenerCount: 0,
    createdAt: 'Sep 28, 2025 07:11:07',
    status: 'active',
  },
  {
    id: 'lb-005',
    name: 'cache-lb',
    vipAddress: '192.168.10.17',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    floatingIp: '-',
    floatingIpId: '',
    listeners: 'listener-redis-6379',
    listenerId: 'fj29dk38',
    listenerCount: 0,
    createdAt: 'Sep 25, 2025 10:32:16',
    status: 'active',
    origin: 'container',
  },
  {
    id: 'lb-006',
    name: 'internal-lb',
    vipAddress: '192.168.10.18',
    ownedNetwork: 'net-04',
    ownedNetworkId: 'net-004',
    floatingIp: '-',
    floatingIpId: '',
    listeners: 'listener-grpc-9090',
    listenerId: '8fj29dk3',
    listenerCount: 3,
    createdAt: 'Sep 20, 2025 23:27:51',
    status: 'error',
  },
  {
    id: 'lb-007',
    name: 'streaming-lb',
    vipAddress: '192.168.10.19',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    floatingIp: '192.168.10.19',
    floatingIpId: 'fip-007',
    listeners: 'listener-rtmp-1935',
    listenerId: 'dk38fj29',
    listenerCount: 0,
    createdAt: 'Sep 15, 2025 12:22:26',
    status: 'active',
  },
  {
    id: 'lb-008',
    name: 'mail-lb',
    vipAddress: '192.168.10.20',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    floatingIp: '192.168.10.20',
    floatingIpId: 'fip-008',
    listeners: 'listener-smtp-25',
    listenerId: '29dk38fj',
    listenerCount: 0,
    createdAt: 'Sep 10, 2025 01:17:01',
    status: 'pending',
  },
  {
    id: 'lb-009',
    name: 'vpn-lb',
    vipAddress: '192.168.10.21',
    ownedNetwork: 'net-03',
    ownedNetworkId: 'net-003',
    floatingIp: '192.168.10.21',
    floatingIpId: 'fip-009',
    listeners: 'listener-openvpn-1194',
    listenerId: '3fj29dk8',
    listenerCount: 0,
    createdAt: 'Sep 5, 2025 14:12:36',
    status: 'active',
  },
  {
    id: 'lb-010',
    name: 'monitoring-lb',
    vipAddress: '192.168.10.22',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    floatingIp: '-',
    floatingIpId: '',
    listeners: 'listener-http-3000',
    listenerId: 'j29dk38f',
    listenerCount: 4,
    createdAt: 'Sep 1, 2025 10:20:28',
    status: 'active',
  },
];

const lbStatusMap: Record<LoadBalancerStatus, StatusVariant> = {
  active: 'active',
  error: 'error',
  building: 'building',
  pending: 'pending',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'vipAddress', label: 'VIP Address', type: 'input', placeholder: 'Enter VIP...' },
  { key: 'ownedNetwork', label: 'Network', type: 'input', placeholder: 'Enter network...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'error', label: 'Error' },
      { value: 'building', label: 'Building' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'vipAddress', label: 'VIP Address', visible: true },
  { key: 'provider', label: 'Provider', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeLoadBalancersPage() {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [associateFipDrawerOpen, setAssociateFipDrawerOpen] = useState(false);
  const [menuTargetLb, setMenuTargetLb] = useState<LoadBalancer | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return mockLoadBalancers;
    return mockLoadBalancers.filter((lb) =>
      appliedFilters.every((filter) => {
        const value = lb[filter.key as keyof LoadBalancer];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(String(filter.value ?? '').toLowerCase());
        }
        return true;
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
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'vipAddress', header: 'VIP Address', sortable: true },
    { key: 'ownedNetwork', header: 'Owned network', sortable: true },
    { key: 'floatingIp', header: 'Floating IP' },
    { key: 'listeners', header: 'Listeners' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Load balancers" />
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/compute/load-balancers/create')}
        >
          Create Load Balancer
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search load balancer by attributes"
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

      <SelectableTable<LoadBalancer>
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
              <StatusIndicator variant={lbStatusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={c('name')}>
              <div className="flex items-center gap-2 min-w-0">
                {row.origin === 'container' && (
                  <Tooltip
                    content="This load balancer was created via the Container cluster."
                    direction="top"
                    focusable={false}
                  >
                    <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-[4px] border border-border bg-surface">
                      <img src={containerIcon} alt="" className="w-4 h-4" />
                    </div>
                  </Tooltip>
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    to={`/compute/load-balancers/${row.id}`}
                    className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                  >
                    {row.name}
                  </Link>
                  <span className="text-11 leading-16 text-text-muted truncate">ID : {row.id}</span>
                </div>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={c('vipAddress')}>
              {row.vipAddress}
            </Table.Td>
            <Table.Td rowData={row} column={c('ownedNetwork')}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute/networks/${row.ownedNetworkId}`}
                  className="inline-flex items-center gap-1.5 min-w-0 text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                >
                  {row.ownedNetwork}
                </Link>
                <span className="text-11 leading-16 text-text-muted">
                  ID : {row.ownedNetworkId.substring(0, 8)}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={c('floatingIp')}>
              {row.floatingIpId ? (
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    to={`/compute/floating-ips/${row.floatingIpId}`}
                    className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                  >
                    {row.floatingIp}
                  </Link>
                  <span className="text-11 leading-16 text-text-muted">
                    ID : {row.floatingIpId}
                  </span>
                </div>
              ) : (
                '-'
              )}
            </Table.Td>
            <Table.Td rowData={row} column={c('listeners')}>
              <div className="flex w-full items-center gap-1 min-w-0">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-12 leading-18 text-text truncate">{row.listeners}</span>
                  <span className="text-11 leading-16 text-text-muted">ID : {row.listenerId}</span>
                </div>
                {row.listenerCount > 0 && (
                  <span className="ml-auto shrink-0">
                    <Popover
                      trigger="click"
                      position="bottom"
                      aria-label={`All listeners (${row.listenerCount + 1})`}
                      content={
                        <div className="p-4 min-w-[160px] max-w-[320px]">
                          <div className="text-[10px] font-normal leading-[14px] text-text-muted mb-2">
                            All Listeners ({row.listenerCount + 1})
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <Badge theme="gry" size="sm" type="subtle">
                              {row.listeners}
                            </Badge>
                            {Array.from({ length: row.listenerCount }, (_, i) => (
                              <Badge key={i} theme="gry" size="sm" type="subtle">
                                listener-{i + 2}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <span className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded border border-transparent text-[10px] font-normal leading-[14px] text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer">
                        +{row.listenerCount}
                      </span>
                    </Popover>
                  </span>
                )}
              </div>
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
                  disabled={!!row.floatingIpId}
                  action={() => {
                    setMenuTargetLb(row);
                    setAssociateFipDrawerOpen(true);
                  }}
                >
                  Associate floating IP
                </ContextMenu.Item>
                <ContextMenu.Item
                  disabled={!row.floatingIpId}
                  action={() => console.log('Disassociate floating IP', row.id)}
                >
                  Disassociate floating IP
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Create listener', row.id)}>
                  Create listener
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setMenuTargetLb(row);
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
      <EditLoadBalancerDrawer
        isOpen={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setMenuTargetLb(null);
        }}
        loadBalancerId={menuTargetLb?.id}
        initialData={
          menuTargetLb ? { name: menuTargetLb.name, description: '', adminUp: true } : undefined
        }
      />
      <AssociateFloatingIPToLBDrawer
        isOpen={associateFipDrawerOpen}
        onClose={() => {
          setAssociateFipDrawerOpen(false);
          setMenuTargetLb(null);
        }}
        loadBalancerName={menuTargetLb?.name}
        vipAddress={menuTargetLb?.vipAddress}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
