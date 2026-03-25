import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { CreateRouterDrawer } from '../drawers/compute/network/CreateRouterDrawer';
import { EditRouterDrawer } from '../drawers/compute/network/EditRouterDrawer';
import { ConnectSubnetDrawer } from '../drawers/compute/network/ConnectSubnetDrawer';
import { DisconnectSubnetDrawer } from '../drawers/compute/network/DisconnectSubnetDrawer';
import { ExternalGatewaySettingDrawer } from '../drawers/compute/network/ExternalGatewaySettingDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { IconDownload, IconExternalLink, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type RouterStatus = 'active' | 'error' | 'building';

interface Router {
  id: string;
  name: string;
  tenant: string;
  portsCount: number;
  externalGateway: boolean;
  externalFixedIp: string;
  externalNetwork: string;
  externalNetworkId: string;
  adminState: boolean;
  status: RouterStatus;
  createdAt: string;
}

const mockRouters: Router[] = [
  {
    id: '29tgj234',
    name: 'router-01',
    tenant: 'demo-project',
    portsCount: 5,
    externalGateway: true,
    externalFixedIp: '10.7.60.91',
    externalNetwork: 'net-01',
    externalNetworkId: '29tgj234',
    adminState: true,
    status: 'active',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: 'router-002',
    name: 'main-router',
    tenant: 'production',
    portsCount: 3,
    externalGateway: true,
    externalFixedIp: '10.7.60.92',
    externalNetwork: 'external-net',
    externalNetworkId: 'net-002',
    adminState: true,
    status: 'active',
    createdAt: 'Sep 10, 2025 01:17:01',
  },
  {
    id: 'router-003',
    name: 'dev-router',
    tenant: 'admin',
    portsCount: 2,
    externalGateway: false,
    externalFixedIp: '-',
    externalNetwork: '-',
    externalNetworkId: '',
    adminState: true,
    status: 'active',
    createdAt: 'Sep 8, 2025 11:51:27',
  },
  {
    id: 'router-004',
    name: 'prod-router',
    tenant: 'engineering',
    portsCount: 8,
    externalGateway: true,
    externalFixedIp: '10.7.60.93',
    externalNetwork: 'prod-net',
    externalNetworkId: 'net-003',
    adminState: true,
    status: 'building',
    createdAt: 'Sep 5, 2025 14:12:36',
  },
  {
    id: 'router-005',
    name: 'test-router',
    tenant: 'demo-project',
    portsCount: 1,
    externalGateway: false,
    externalFixedIp: '-',
    externalNetwork: '-',
    externalNetworkId: '',
    adminState: false,
    status: 'active',
    createdAt: 'Aug 30, 2025 21:37:41',
  },
  {
    id: 'router-006',
    name: 'backup-router',
    tenant: 'production',
    portsCount: 4,
    externalGateway: true,
    externalFixedIp: '10.7.60.94',
    externalNetwork: 'backup-net',
    externalNetworkId: 'net-004',
    adminState: true,
    status: 'active',
    createdAt: 'Aug 25, 2025 10:32:16',
  },
  {
    id: 'router-007',
    name: 'dmz-router',
    tenant: 'admin',
    portsCount: 6,
    externalGateway: true,
    externalFixedIp: '10.7.60.95',
    externalNetwork: 'dmz-net',
    externalNetworkId: 'net-005',
    adminState: false,
    status: 'error',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
  {
    id: 'router-008',
    name: 'internal-router',
    tenant: 'engineering',
    portsCount: 2,
    externalGateway: false,
    externalFixedIp: '-',
    externalNetwork: '-',
    externalNetworkId: '',
    adminState: true,
    status: 'active',
    createdAt: 'Aug 15, 2025 12:22:26',
  },
  {
    id: 'router-009',
    name: 'edge-router',
    tenant: 'demo-project',
    portsCount: 7,
    externalGateway: true,
    externalFixedIp: '10.7.60.96',
    externalNetwork: 'edge-net',
    externalNetworkId: 'net-006',
    adminState: true,
    status: 'active',
    createdAt: 'Aug 10, 2025 01:17:01',
  },
  {
    id: 'router-010',
    name: 'vpn-router',
    tenant: 'production',
    portsCount: 3,
    externalGateway: true,
    externalFixedIp: '10.7.60.97',
    externalNetwork: 'vpn-net',
    externalNetworkId: 'net-007',
    adminState: true,
    status: 'active',
    createdAt: 'Aug 5, 2025 14:12:36',
  },
];

const routerStatusMap: Record<RouterStatus, StatusVariant> = {
  active: 'active',
  error: 'error',
  building: 'building',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'tenant', label: 'Tenant', type: 'input', placeholder: 'Enter tenant...' },
  {
    key: 'externalGateway',
    label: 'External gateway',
    type: 'select',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
  { key: 'externalFixedIp', label: 'External fixed IP', type: 'input', placeholder: 'Enter IP...' },
  {
    key: 'externalNetwork',
    label: 'External network',
    type: 'input',
    placeholder: 'Enter network...',
  },
  {
    key: 'adminState',
    label: 'Admin state',
    type: 'select',
    options: [
      { value: 'true', label: 'Up' },
      { value: 'false', label: 'Down' },
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

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function routerMatches(r: Router, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof Router;
  const value = String(r[key] ?? '').toLowerCase();
  return value.includes(fv);
}

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'tenant', label: 'Tenant', visible: true },
  { key: 'externalGateway', label: 'External Gateway', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminRoutersPage() {
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [createRouterOpen, setCreateRouterOpen] = useState(false);
  const [editRouterOpen, setEditRouterOpen] = useState(false);
  const [connectSubnetOpen, setConnectSubnetOpen] = useState(false);
  const [disconnectSubnetOpen, setDisconnectSubnetOpen] = useState(false);
  const [externalGwOpen, setExternalGwOpen] = useState(false);
  const [selectedRouter, setSelectedRouter] = useState<Router | null>(null);

  const [routers] = useState(mockRouters);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return routers;
    return routers.filter((r) => appliedFilters.every((f) => routerMatches(r, f)));
  }, [routers, appliedFilters]);

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
    { key: 'name', header: 'Name', sortable: true },
    { key: 'tenant', header: 'Tenant', sortable: true },
    { key: 'externalGateway', header: 'External gateway' },
    { key: 'externalFixedIp', header: 'External fixed IP', sortable: true },
    { key: 'externalNetwork', header: 'External network', sortable: true },
    { key: 'adminState', header: 'Admin state', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Routers" />
        <Button variant="primary" size="md" onClick={() => setCreateRouterOpen(true)}>
          Create router
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search router by attributes"
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

      <SelectableTable<Router>
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
              <StatusIndicator variant={routerStatusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link to={`/compute-admin/routers/${row.id}`} className={linkClass}>
                  {row.name}
                </Link>
                <span className="text-11 leading-16 text-text-muted">{row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="text-12 text-text truncate" title={row.tenant}>
                {row.tenant}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.externalGateway ? 'Yes' : 'No'}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.externalFixedIp}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.externalNetworkId ? (
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    to={`/compute-admin/networks/${row.externalNetworkId}`}
                    className={`inline-flex items-center gap-1 min-w-0 ${linkClass}`}
                  >
                    <span className="truncate">{row.externalNetwork}</span>
                    <IconExternalLink size={12} className="shrink-0 text-primary" />
                  </Link>
                  <span className="text-11 leading-16 text-text-muted">
                    ID : {row.externalNetworkId}
                  </span>
                </div>
              ) : (
                '-'
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              <Badge theme={row.adminState ? 'gre' : 'gry'} size="sm" type="subtle">
                {row.adminState ? 'Up' : 'Down'}
              </Badge>
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              {stripTime(row.createdAt)}
            </Table.Td>
            <Table.Td rowData={row} column={columns[8]} preventClickPropagation>
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
                    setSelectedRouter(row);
                    setConnectSubnetOpen(true);
                  }}
                >
                  Connect subnet
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedRouter(row);
                    setDisconnectSubnetOpen(true);
                  }}
                >
                  Disconnect subnet
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedRouter(row);
                    setExternalGwOpen(true);
                  }}
                >
                  External gateway Setting
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setSelectedRouter(row);
                    setEditRouterOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item action={() => {}} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
      <CreateRouterDrawer isOpen={createRouterOpen} onClose={() => setCreateRouterOpen(false)} />
      <EditRouterDrawer
        isOpen={editRouterOpen}
        onClose={() => {
          setEditRouterOpen(false);
          setSelectedRouter(null);
        }}
        routerId={selectedRouter?.id}
        initialData={
          selectedRouter
            ? { name: selectedRouter.name, adminStateUp: selectedRouter.adminState }
            : undefined
        }
      />
      <ConnectSubnetDrawer
        isOpen={connectSubnetOpen}
        onClose={() => {
          setConnectSubnetOpen(false);
          setSelectedRouter(null);
        }}
        routerName={selectedRouter?.name}
      />
      <DisconnectSubnetDrawer
        isOpen={disconnectSubnetOpen}
        onClose={() => {
          setDisconnectSubnetOpen(false);
          setSelectedRouter(null);
        }}
        routerName={selectedRouter?.name}
      />
      <ExternalGatewaySettingDrawer
        isOpen={externalGwOpen}
        onClose={() => {
          setExternalGwOpen(false);
          setSelectedRouter(null);
        }}
        routerName={selectedRouter?.name}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
