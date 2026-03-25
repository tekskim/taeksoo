import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { EditPortDrawer } from '../drawers/compute/network/EditPortDrawer';
import { EditPortSecurityGroupsDrawer } from '../drawers/compute/network/EditPortSecurityGroupsDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import { Popover } from '@shared/components/Popover';
import { Tooltip } from '@shared/components/Tooltip';
import { IconCube, IconDownload, IconRouter, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

const stripPortCreatedAtTime = (dateStr?: string) => (dateStr ? dateStr.split(' ')[0] : '-');

type PortStatus = 'active' | 'error' | 'building' | 'down';

interface Port {
  id: string;
  name: string;
  description: string;
  tenant: string;
  attachedTo: string | null;
  attachedToId: string | null;
  attachedType: 'instance' | 'router' | null;
  ownedNetwork: string;
  ownedNetworkId: string;
  securityGroupNames: string[];
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
  adminState: 'Up' | 'Down';
  createdAt: string;
  status: PortStatus;
}

const mockPorts: Port[] = [
  {
    id: 'port-001',
    name: 'port-01',
    tenant: 'production',
    attachedTo: 'web-01',
    attachedToId: 'inst-001',
    attachedType: 'instance',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroupNames: ['default-sg', 'web-sg', 'lb-sg', 'monitor-sg', 'backup-sg'],
    fixedIp: '10.7.60.91',
    floatingIp: '10.7.65.39',
    macAddress: 'fa:16:3e:34:85:32',
    description: 'Web server port',
    adminState: 'Up',
    createdAt: '2025-09-12 10:30:00',
    status: 'active',
  },
  {
    id: 'port-002',
    name: 'port-02',
    tenant: 'admin',
    attachedTo: 'app-server',
    attachedToId: 'inst-002',
    attachedType: 'instance',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    securityGroupNames: ['app-sg', 'internal-sg', 'cache-sg'],
    fixedIp: '10.7.60.92',
    floatingIp: '10.7.65.40',
    macAddress: 'fa:16:3e:34:85:33',
    description: 'Application server port',
    adminState: 'Up',
    createdAt: '2025-09-10 14:20:00',
    status: 'active',
  },
  {
    id: 'port-003',
    name: 'port-03',
    tenant: 'demo-project',
    attachedTo: null,
    attachedToId: null,
    attachedType: null,
    ownedNetwork: 'net-03',
    ownedNetworkId: 'net-003',
    securityGroupNames: ['default-sg'],
    fixedIp: '10.7.60.93',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:34',
    description: '',
    adminState: 'Down',
    createdAt: '2025-09-08 09:15:00',
    status: 'down',
  },
  {
    id: 'port-004',
    name: 'db-port',
    tenant: 'engineering',
    attachedTo: 'db-server',
    attachedToId: 'inst-003',
    attachedType: 'instance',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroupNames: ['db-sg'],
    fixedIp: '10.7.60.94',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:35',
    description: 'Database port',
    adminState: 'Up',
    createdAt: '2025-09-05 11:45:00',
    status: 'active',
  },
  {
    id: 'port-005',
    name: 'router-port-1',
    tenant: 'production',
    attachedTo: 'main-router',
    attachedToId: 'router-001',
    attachedType: 'router',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroupNames: [],
    fixedIp: '10.7.60.1',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:36',
    description: 'Router gateway port',
    adminState: 'Up',
    createdAt: '2025-08-28 08:00:00',
    status: 'active',
  },
  {
    id: 'port-006',
    name: 'lb-port',
    tenant: 'admin',
    attachedTo: 'load-balancer-01',
    attachedToId: 'lb-001',
    attachedType: 'instance',
    ownedNetwork: 'net-02',
    ownedNetworkId: 'net-002',
    securityGroupNames: ['lb-sg', 'public-sg'],
    fixedIp: '10.7.60.95',
    floatingIp: '10.7.65.41',
    macAddress: 'fa:16:3e:34:85:37',
    description: 'Load balancer VIP port',
    adminState: 'Up',
    createdAt: '2025-08-25 16:30:00',
    status: 'active',
  },
  {
    id: 'port-007',
    name: 'cache-port',
    tenant: 'demo-project',
    attachedTo: 'redis-01',
    attachedToId: 'inst-004',
    attachedType: 'instance',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroupNames: ['cache-sg'],
    fixedIp: '10.7.60.96',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:38',
    description: 'Redis cache port',
    adminState: 'Up',
    createdAt: '2025-08-20 13:10:00',
    status: 'active',
  },
  {
    id: 'port-008',
    name: 'monitor-port',
    tenant: 'engineering',
    attachedTo: 'prometheus',
    attachedToId: 'inst-005',
    attachedType: 'instance',
    ownedNetwork: 'net-03',
    ownedNetworkId: 'net-003',
    securityGroupNames: ['monitor-sg'],
    fixedIp: '10.7.60.97',
    floatingIp: '10.7.65.42',
    macAddress: 'fa:16:3e:34:85:39',
    description: 'Monitoring agent port',
    adminState: 'Up',
    createdAt: '2025-08-15 07:45:00',
    status: 'building',
  },
  {
    id: 'port-009',
    name: 'test-port',
    tenant: 'production',
    attachedTo: null,
    attachedToId: null,
    attachedType: null,
    ownedNetwork: 'net-04',
    ownedNetworkId: 'net-004',
    securityGroupNames: ['default-sg'],
    fixedIp: '10.7.60.98',
    floatingIp: '-',
    macAddress: 'fa:16:3e:34:85:40',
    description: '',
    adminState: 'Down',
    createdAt: '2025-08-10 15:00:00',
    status: 'error',
  },
  {
    id: 'port-010',
    name: 'vpn-port',
    tenant: 'admin',
    attachedTo: 'vpn-gateway',
    attachedToId: 'vpn-001',
    attachedType: 'instance',
    ownedNetwork: 'net-01',
    ownedNetworkId: 'net-001',
    securityGroupNames: ['vpn-sg'],
    fixedIp: '10.7.60.99',
    floatingIp: '10.7.65.43',
    macAddress: 'fa:16:3e:34:85:41',
    description: 'VPN gateway port',
    adminState: 'Up',
    createdAt: '2025-08-05 12:20:00',
    status: 'active',
  },
];

const portStatusMap: Record<PortStatus, StatusVariant> = {
  active: 'active',
  error: 'error',
  building: 'building',
  down: 'down',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input' },
  { key: 'description', label: 'Description', type: 'input' },
  { key: 'tenant', label: 'Tenant', type: 'input' },
  { key: 'attachedTo', label: 'Attached to', type: 'input' },
  { key: 'ownedNetwork', label: 'Network', type: 'input' },
  { key: 'fixedIp', label: 'Fixed IP', type: 'input' },
  { key: 'floatingIp', label: 'Floating IP', type: 'input' },
  { key: 'macAddress', label: 'MAC Address', type: 'input' },
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
      { value: 'down', label: 'Down' },
    ],
  },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function portMatches(p: Port, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  if (filter.key === 'securityGroups') {
    return p.securityGroupNames.some((n) => n.toLowerCase().includes(fv));
  }
  const key = filter.key as keyof Port;
  const value = String(p[key] ?? '').toLowerCase();
  return value.includes(fv);
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'tenant', label: 'Tenant', visible: true },
  { key: 'network', label: 'Network', visible: true },
  { key: 'fixedIps', label: 'Fixed IPs', visible: true },
  { key: 'macAddress', label: 'MAC Address', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminPortsPage() {
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [editPortOpen, setEditPortOpen] = useState(false);
  const [manageSgOpen, setManageSgOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [ports] = useState(mockPorts);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    let list = ports;
    if (activeTab === 'instance') {
      list = list.filter((p) => p.attachedType === 'instance');
    }
    if (appliedFilters.length === 0) return list;
    return list.filter((p) => appliedFilters.every((f) => portMatches(p, f)));
  }, [ports, appliedFilters, activeTab]);

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
    { key: 'status', header: 'Status', width: 64, align: 'center' },
    { key: 'name', header: 'Name', sortable: true, width: 180 },
    { key: 'tenant', header: 'Tenant', sortable: true, width: 120 },
    { key: 'attachedTo', header: 'Attached to', width: 160 },
    { key: 'ownedNetwork', header: 'Owned Network', sortable: true, width: 140 },
    { key: 'securityGroups', header: 'SG', width: 150 },
    { key: 'fixedIp', header: 'Fixed IP', width: 130 },
    { key: 'floatingIp', header: 'Floating IP', width: 130 },
    { key: 'description', header: 'Description', width: 140 },
    { key: 'macAddress', header: 'MAC Address', width: 150 },
    { key: 'adminState', header: 'Admin state', width: 100 },
    { key: 'createdAt', header: 'Created at', sortable: true, width: 130 },
    { key: 'actions', header: 'Action', width: 64, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Ports" />
        <Button variant="primary" size="md" onClick={() => navigate('/compute-admin/ports/create')}>
          Create virtual adapter
        </Button>
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={(id) => {
          setActiveTab(id);
          setCurrentPage(1);
        }}
        variant="line"
        size="sm"
        fullWidth
        contentClassName="hidden"
      >
        <Tab id="all" label="All">
          <></>
        </Tab>
        <Tab id="instance" label="Instance ports">
          <></>
        </Tab>
      </Tabs>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search port by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} stroke={1.5} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
          <IconTrash size={12} stroke={1.5} /> Delete
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

      <SelectableTable<Port>
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
        minWidth={1168}
      >
        {paginatedRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <StatusIndicator variant={portStatusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/ports/${row.id}`}
                  className={`${linkClass} truncate`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.name}
                </Link>
                <span className="text-11 leading-16 text-text-subtle">ID : {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="text-12 text-text truncate" title={row.tenant}>
                {row.tenant}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.attachedTo ? (
                <div className="flex items-center gap-2 justify-between w-full">
                  <div className="flex flex-col gap-0.5 min-w-0 text-left">
                    <Tooltip content={row.attachedTo} direction="top">
                      <Link
                        to={
                          row.attachedType === 'router'
                            ? `/routers/${row.attachedToId}`
                            : `/instances/${row.attachedToId}`
                        }
                        className={`inline-flex items-center gap-1 min-w-0 ${linkClass} truncate`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="truncate">{row.attachedTo}</span>
                      </Link>
                    </Tooltip>
                    <span className="text-11 leading-16 text-text-subtle truncate">
                      ID : {row.attachedToId?.substring(0, 8)}
                    </span>
                  </div>
                  <Tooltip
                    content={row.attachedType === 'router' ? 'Router' : 'Instance'}
                    direction="top"
                  >
                    <div className="flex-shrink-0 inline-flex items-center justify-center size-[22px] bg-surface border border-border rounded cursor-default">
                      {row.attachedType === 'router' ? (
                        <IconRouter size={12} stroke={1.5} className="text-text-subtle" />
                      ) : (
                        <IconCube size={12} stroke={1.5} className="text-text-subtle" />
                      )}
                    </div>
                  </Tooltip>
                </div>
              ) : (
                <span className="block text-left w-full">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Tooltip content={row.ownedNetwork} direction="top">
                  <Link
                    to={`/compute-admin/networks/${row.ownedNetworkId}`}
                    className={`inline-flex items-center gap-1 min-w-0 ${linkClass} truncate`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="truncate">{row.ownedNetwork}</span>
                  </Link>
                </Tooltip>
                <span className="text-11 leading-16 text-text-subtle truncate">
                  ID : {row.ownedNetworkId.substring(0, 8)}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.securityGroupNames.length === 0 ? (
                '-'
              ) : (
                <span className="flex items-center gap-1 min-w-0">
                  <span className="truncate min-w-0">{row.securityGroupNames[0]}</span>
                  {row.securityGroupNames.length > 1 && (
                    <span className="ml-auto shrink-0">
                      <Popover
                        trigger="click"
                        position="bottom"
                        aria-label={`All security groups (${row.securityGroupNames.length})`}
                        content={
                          <div className="p-4 min-w-[160px] max-w-[320px]">
                            <div className="text-[10px] font-normal leading-[14px] text-text-muted mb-2">
                              All security groups ({row.securityGroupNames.length})
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {row.securityGroupNames.map((name, i) => (
                                <Badge key={i} theme="gry" size="sm" type="subtle">
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        }
                      >
                        <span className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded border border-transparent text-[10px] font-normal leading-[14px] text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer">
                          +{row.securityGroupNames.length - 1}
                        </span>
                      </Popover>
                    </span>
                  )}
                </span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.fixedIp}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              {row.floatingIp}
            </Table.Td>
            <Table.Td rowData={row} column={columns[8]}>
              <span
                className="text-12 text-text truncate block max-w-[200px]"
                title={row.description}
              >
                {row.description}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[9]}>
              {row.macAddress}
            </Table.Td>
            <Table.Td rowData={row} column={columns[10]}>
              <Badge theme={row.adminState === 'Up' ? 'gre' : 'gry'} size="sm" type="subtle">
                {row.adminState}
              </Badge>
            </Table.Td>
            <Table.Td rowData={row} column={columns[11]}>
              {stripPortCreatedAtTime(row.createdAt)}
            </Table.Td>
            <Table.Td rowData={row} column={columns[12]} preventClickPropagation>
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
                  action={() => console.log('Attach instance:', row.id)}
                  disabled={!!row.attachedTo}
                >
                  Attach instance
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => console.log('Detach instance:', row.id)}
                  disabled={!row.attachedTo}
                >
                  Detach instance
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => console.log('Associate floating IP:', row.id)}
                  disabled={!!row.floatingIp}
                >
                  Associate floating IP
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => console.log('Disassociate floating IP:', row.id)}
                  disabled={!row.floatingIp}
                >
                  Disassociate floating IP
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Allocate IP:', row.id)}>
                  Allocate IP
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedPort(row);
                    setManageSgOpen(true);
                  }}
                >
                  Manage security groups
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedPort(row);
                    setEditPortOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete:', row.id)} danger>
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
      <EditPortDrawer
        isOpen={editPortOpen}
        onClose={() => {
          setEditPortOpen(false);
          setSelectedPort(null);
        }}
        portId={selectedPort?.id}
        initialData={
          selectedPort
            ? {
                name: selectedPort.name,
                description: '',
                adminStateUp: selectedPort.status !== 'down',
              }
            : undefined
        }
      />
      <EditPortSecurityGroupsDrawer
        isOpen={manageSgOpen}
        onClose={() => {
          setManageSgOpen(false);
          setSelectedPort(null);
        }}
        portName={selectedPort?.name}
      />
    </div>
  );
}
