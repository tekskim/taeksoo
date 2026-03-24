import { useMemo, useState, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { CreateStaticRouteDrawer } from '../drawers/compute/network/CreateStaticRouteDrawer';
import { DisconnectSubnetDrawer } from '../drawers/compute/network/DisconnectSubnetDrawer';
import { ConnectSubnetDrawer } from '../drawers/compute/network/ConnectSubnetDrawer';
import { ExternalGatewaySettingDrawer } from '../drawers/compute/network/ExternalGatewaySettingDrawer';
import { EditRouterDrawer } from '../drawers/compute/network/EditRouterDrawer';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { Popover } from '@shared/components/Popover';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import {
  IconLink,
  IconLinkOff,
  IconTrash,
  IconDotsCircleHorizontal,
  IconChevronDown,
  IconCirclePlus,
  IconDownload,
} from '@tabler/icons-react';

type RouterStatus = 'active' | 'building' | 'error';
type PortStatus = 'active' | 'down' | 'build';

interface RouterDetail {
  id: string;
  name: string;
  status: RouterStatus;
  adminState: 'Up' | 'Down';
  access: string;
  externalGateway: boolean;
  createdAt: string;
  routerName: string;
  availabilityZone: string;
  availabilityZoneHint: string;
  description: string;
  network: { name: string; id: string } | null;
  snat: boolean;
  subnet: { name: string; id: string } | null;
  gatewayIp: string;
}

interface Port {
  id: string;
  name: string;
  status: PortStatus;
  fixedIp: string;
  /** Multiple IPs on one interface (e.g. dual-stack); when set, UI shows +N popover */
  fixedIps?: string[];
  macAddress: string;
  type: string;
  createdAt: string;
}

interface StaticRoute {
  id: string;
  destination: string;
  nextHop: string;
}

const mockRoutersMap: Record<string, RouterDetail> = {
  '29tgj234': {
    id: '29tgj234',
    name: 'router-01',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Sep 15, 2025 12:22:26',
    routerName: 'router-01',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01 (+3)',
    description: '-',
    network: { name: 'net-01', id: '29tgj234' },
    snat: true,
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    gatewayIp: '10.7.60.91',
  },
  'router-002': {
    id: 'router-002',
    name: 'main-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Sep 10, 2025 01:17:01',
    routerName: 'main-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'Main router',
    network: { name: 'external-net', id: 'net-002' },
    snat: true,
    subnet: { name: 'subnet-02', id: 'subnet-002' },
    gatewayIp: '10.7.60.92',
  },
  'router-003': {
    id: 'router-003',
    name: 'dev-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: false,
    createdAt: 'Sep 8, 2025 11:51:27',
    routerName: 'dev-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-02',
    description: 'Development router',
    network: { name: '-', id: '' },
    snat: false,
    subnet: { name: '-', id: '' },
    gatewayIp: '-',
  },
  'router-004': {
    id: 'router-004',
    name: 'prod-router',
    status: 'building',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Sep 5, 2025 14:12:36',
    routerName: 'prod-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'Production router',
    network: { name: 'prod-net', id: 'net-003' },
    snat: true,
    subnet: { name: 'subnet-03', id: 'subnet-003' },
    gatewayIp: '10.7.60.93',
  },
  'router-005': {
    id: 'router-005',
    name: 'test-router',
    status: 'active',
    adminState: 'Down',
    access: 'Project',
    externalGateway: false,
    createdAt: 'Sep 1, 2025 10:20:28',
    routerName: 'test-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-03',
    description: 'Test router',
    network: { name: '-', id: '' },
    snat: false,
    subnet: { name: '-', id: '' },
    gatewayIp: '-',
  },
  'router-006': {
    id: 'router-006',
    name: 'backup-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Aug 28, 2025 07:11:07',
    routerName: 'backup-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'Backup router',
    network: { name: 'backup-net', id: 'net-004' },
    snat: true,
    subnet: { name: 'subnet-04', id: 'subnet-004' },
    gatewayIp: '10.7.60.94',
  },
  'router-007': {
    id: 'router-007',
    name: 'dmz-router',
    status: 'error',
    adminState: 'Down',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Aug 25, 2025 10:32:16',
    routerName: 'dmz-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'DMZ router',
    network: { name: 'dmz-net', id: 'net-005' },
    snat: true,
    subnet: { name: 'subnet-05', id: 'subnet-005' },
    gatewayIp: '10.7.60.95',
  },
  'router-008': {
    id: 'router-008',
    name: 'internal-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: false,
    createdAt: 'Aug 20, 2025 23:27:51',
    routerName: 'internal-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-02',
    description: 'Internal router',
    network: { name: '-', id: '' },
    snat: false,
    subnet: { name: '-', id: '' },
    gatewayIp: '-',
  },
  'router-009': {
    id: 'router-009',
    name: 'edge-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Aug 15, 2025 12:22:26',
    routerName: 'edge-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'Edge router',
    network: { name: 'edge-net', id: 'net-006' },
    snat: true,
    subnet: { name: 'subnet-06', id: 'subnet-006' },
    gatewayIp: '10.7.60.96',
  },
  'router-010': {
    id: 'router-010',
    name: 'vpn-router',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    externalGateway: true,
    createdAt: 'Aug 10, 2025 01:17:01',
    routerName: 'vpn-router',
    availabilityZone: 'nova',
    availabilityZoneHint: 'zone-01',
    description: 'VPN router',
    network: { name: 'vpn-net', id: 'net-007' },
    snat: true,
    subnet: { name: 'subnet-07', id: 'subnet-007' },
    gatewayIp: '10.7.60.97',
  },
};

const defaultRouterDetail: RouterDetail = {
  id: 'unknown',
  name: 'Unknown Router',
  status: 'active',
  adminState: 'Up',
  access: 'Project',
  externalGateway: false,
  createdAt: '-',
  routerName: '-',
  availabilityZone: '-',
  availabilityZoneHint: '-',
  description: '-',
  network: { name: '-', id: '' },
  snat: false,
  subnet: { name: '-', id: '' },
  gatewayIp: '-',
};

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => {
  const date = new Date(2025, 8 - Math.floor(i / 10), 12 - (i % 28));
  const n = i + 1;
  const primary = `10.62.0.${n}`;
  const hasMulti = i % 7 === 0;
  return {
    id: `port-${String(n).padStart(3, '0')}`,
    name: `port-${String(n).padStart(2, '0')}`,
    status: 'active' as const,
    fixedIp: primary,
    fixedIps: hasMulti ? [primary, `10.62.1.${n}`, `fd00:62::${n}`, `10.62.2.${n}`] : undefined,
    macAddress: `fa:16:3e:${String(n).padStart(2, '0')}:ab:cd`,
    type: i % 2 === 0 ? 'Internal Interface' : 'External Interface',
    createdAt: date
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      .replace(',', ','),
  };
});

const mockStaticRoutes: StaticRoute[] = Array.from({ length: 115 }, (_, i) => ({
  id: `route-${String(i + 1).padStart(3, '0')}`,
  destination: '10.7.61.0/24',
  nextHop: '192.168.10.50',
}));

const routerStatusVariant: Record<RouterStatus, StatusVariant> = {
  active: 'active',
  building: 'building',
  error: 'error',
};

const portStatusVariant: Record<PortStatus, StatusVariant> = {
  active: 'active',
  build: 'building',
  down: 'shutoff',
};

const STATUS_COL_WIDTH = 60;
const ACTION_COL_WIDTH = 72;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline truncate';

const PortMenuTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      toggle();
    }}
    className="p-1.5 rounded-md hover:bg-surface-muted border-none bg-transparent inline-flex"
    aria-label="Row actions"
  >
    <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-text-subtle" />
  </button>
);

export function ComputeRouterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const router = useMemo(
    () => (id ? (mockRoutersMap[id] ?? defaultRouterDetail) : defaultRouterDetail),
    [id]
  );

  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const [portSort, setPortSort] = useState('');
  const [portOrder, setPortOrder] = useState<SortOrder>('asc');
  const [selectedPorts, setSelectedPorts] = useState<(string | number)[]>([]);
  const portsPerPage = 10;

  const [routeSearchTerm, setRouteSearchTerm] = useState('');
  const [routeCurrentPage, setRouteCurrentPage] = useState(1);
  const [selectedRoutes, setSelectedRoutes] = useState<(string | number)[]>([]);
  const routesPerPage = 10;

  const handlePortSort = useCallback((k: string | null, o: SortOrder) => {
    setPortSort(k ?? '');
    setPortOrder(o);
  }, []);

  const filteredPorts = useMemo(() => {
    return mockPorts.filter(
      (p) =>
        p.name.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
        p.macAddress.toLowerCase().includes(portSearchTerm.toLowerCase())
    );
  }, [portSearchTerm]);

  const sortedPorts = useMemo(() => {
    const sorted = [...filteredPorts];
    if (!portSort) return sorted;
    sorted.sort((a, b) => {
      const av = a[portSort as keyof Port];
      const bv = b[portSort as keyof Port];
      if (typeof av === 'string' && typeof bv === 'string') {
        return portOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return 0;
    });
    return sorted;
  }, [filteredPorts, portSort, portOrder]);

  const paginatedPorts = sortedPorts.slice(
    (portCurrentPage - 1) * portsPerPage,
    portCurrentPage * portsPerPage
  );

  const filteredRoutes = useMemo(() => {
    return mockStaticRoutes.filter(
      (r) =>
        r.destination.toLowerCase().includes(routeSearchTerm.toLowerCase()) ||
        r.nextHop.toLowerCase().includes(routeSearchTerm.toLowerCase())
    );
  }, [routeSearchTerm]);

  const paginatedRoutes = filteredRoutes.slice(
    (routeCurrentPage - 1) * routesPerPage,
    routeCurrentPage * routesPerPage
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: 'Available',
      accessory: <StatusIndicator variant={routerStatusVariant[router.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: router.id, showCopyButton: true, copyText: router.id },
    { label: 'Admin state', value: router.adminState },
    { label: 'External gateway', value: router.externalGateway ? 'Yes' : 'No' },
    { label: 'Created at', value: router.createdAt },
  ];

  const portColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name' },
      { key: 'fixedIp', header: 'Fixed IP' },
      { key: 'macAddress', header: 'MAC Address' },
      { key: 'type', header: 'Type' },
      { key: 'createdAt', header: 'Created at', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  const staticRouteColumns: TableColumn[] = useMemo(
    () => [
      { key: 'destination', header: 'Destination CIDR' },
      { key: 'nextHop', header: 'Next hop', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={router.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconLink size={12} stroke={1.5} /> Connect subnet
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
            <ContextMenu.Root
              direction="bottom-end"
              gap={4}
              trigger={({ toggle }) => (
                <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                  More actions <IconChevronDown size={12} stroke={1.5} />
                </Button>
              )}
            >
              <ContextMenu.Item action={() => setDisconnectSubnetOpen(true)} danger>
                Disconnect subnet
              </ContextMenu.Item>
              <ContextMenu.Item action={() => setExternalGwOpen(true)}>
                External gateway Setting
              </ContextMenu.Item>
              <ContextMenu.Item action={() => setStaticRouteOpen(true)}>
                Create static Route
              </ContextMenu.Item>
              <ContextMenu.Item action={() => setEditRouterOpen(true)}>Edit</ContextMenu.Item>
            </ContextMenu.Root>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Router name" value={router.routerName} />
                  <SectionCard.DataRow label="Description" value={router.description} />
                  <SectionCard.DataRow label="Admin state" value={router.adminState} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="External network" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Network"
                    value={
                      router.network && router.network.id ? (
                        <Link to={`/compute/networks/${router.network.id}`} className={linkClass}>
                          {router.network.name}
                        </Link>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <SectionCard.DataRow label="SNAT" value={router.snat ? 'Yes' : 'No'} />
                  <SectionCard.DataRow
                    label="Subnet"
                    value={
                      router.subnet && router.subnet.id ? (
                        <Link to={`/compute/subnets/${router.subnet.id}`} className={linkClass}>
                          {router.subnet.name}
                        </Link>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <SectionCard.DataRow label="Gateway IP" value={router.gatewayIp} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="ports" label="Ports">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between min-h-[28px]">
                <h3 className="text-16 font-semibold text-text m-0">Ports</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <input
                    type="search"
                    value={portSearchTerm}
                    onChange={(e) => {
                      setPortSearchTerm(e.target.value);
                      setPortCurrentPage(1);
                    }}
                    placeholder="Search interface by attributes"
                    className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
                  />
                  <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
                    <IconDownload size={12} stroke={1.5} />
                  </Button>
                </div>
                <div className="h-4 w-px bg-border" />
                <Button
                  variant="muted"
                  appearance="ghost"
                  size="sm"
                  disabled={selectedPorts.length === 0}
                >
                  <IconLinkOff size={12} stroke={1.5} /> Disconnect
                </Button>
              </div>
              <Pagination
                totalCount={filteredPorts.length}
                size={portsPerPage}
                currentAt={portCurrentPage}
                onPageChange={setPortCurrentPage}
                totalCountLabel="items"
                selectedCount={selectedPorts.length}
              />
              <SelectableTable<Port>
                columns={portColumns}
                rows={paginatedPorts}
                selectionType="checkbox"
                selectedRows={selectedPorts}
                onRowSelectionChange={setSelectedPorts}
                getRowId={(row) => row.id}
                sort={portSort}
                order={portOrder}
                onSortChange={handlePortSort}
                stickyLastColumn
              >
                {paginatedPorts.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={portColumns[0]}>
                      <StatusIndicator variant={portStatusVariant[row.status]} layout="iconOnly" />
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/ports/${row.id}`}
                          className={linkClass}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted truncate">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[2]}>
                      {row.fixedIps && row.fixedIps.length > 1 ? (
                        <span className="flex items-center gap-1 min-w-0">
                          <span className="truncate">{row.fixedIps[0]}</span>
                          <span className="ml-auto shrink-0">
                            <Popover
                              trigger="click"
                              position="bottom"
                              aria-label={`All fixed IPs (${row.fixedIps.length})`}
                              content={
                                <div className="p-4 min-w-[160px] max-w-[320px]">
                                  <div className="text-[10px] font-normal leading-[14px] text-text-muted mb-2">
                                    All Fixed IPs ({row.fixedIps.length})
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    {row.fixedIps.map((ip) => (
                                      <span key={ip} className="text-12 leading-18 text-text">
                                        {ip}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              }
                            >
                              <span className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded border border-transparent text-[10px] font-normal leading-[14px] text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer">
                                +{row.fixedIps.length - 1}
                              </span>
                            </Popover>
                          </span>
                        </span>
                      ) : (
                        row.fixedIp
                      )}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[3]}>
                      {row.macAddress}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[4]}>
                      {row.type}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[5]}>
                      {row.createdAt}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[6]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <PortMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item action={() => console.log('Disconnect', row.id)} danger>
                          Disconnect
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            </div>
          </Tab>

          <Tab id="static-routes" label="Static routes">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between min-h-[28px]">
                <h3 className="text-16 font-semibold text-text m-0">Static Route</h3>
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  onClick={() => setStaticRouteOpen(true)}
                >
                  <IconCirclePlus size={12} stroke={1.5} /> Create static route
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="search"
                  value={routeSearchTerm}
                  onChange={(e) => {
                    setRouteSearchTerm(e.target.value);
                    setRouteCurrentPage(1);
                  }}
                  placeholder="Search static route by attributes"
                  className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
                />
                <div className="h-4 w-px bg-border" />
                <Button
                  variant="muted"
                  appearance="ghost"
                  size="sm"
                  disabled={selectedRoutes.length === 0}
                >
                  <IconTrash size={12} stroke={1.5} /> Delete
                </Button>
              </div>
              <Pagination
                totalCount={filteredRoutes.length}
                size={routesPerPage}
                currentAt={routeCurrentPage}
                onPageChange={setRouteCurrentPage}
                totalCountLabel="items"
                selectedCount={selectedRoutes.length}
              />
              <SelectableTable<StaticRoute>
                columns={staticRouteColumns}
                rows={paginatedRoutes}
                selectionType="checkbox"
                selectedRows={selectedRoutes}
                onRowSelectionChange={setSelectedRoutes}
                getRowId={(row) => row.id}
                stickyLastColumn
              >
                {paginatedRoutes.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={staticRouteColumns[0]}>
                      {row.destination}
                    </Table.Td>
                    <Table.Td rowData={row} column={staticRouteColumns[1]}>
                      {row.nextHop}
                    </Table.Td>
                    <Table.Td rowData={row} column={staticRouteColumns[2]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <PortMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item action={() => console.log('Delete route', row.id)} danger>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </SelectableTable>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditRouterDrawer
        isOpen={editRouterOpen}
        onClose={() => setEditRouterOpen(false)}
        routerId={id}
        initialData={{
          name: router.name,
          description: router.description,
          adminStateUp: router.adminState === 'Up',
        }}
      />
      <ExternalGatewaySettingDrawer
        isOpen={externalGwOpen}
        onClose={() => setExternalGwOpen(false)}
        routerName={router.name}
      />
      <ConnectSubnetDrawer
        isOpen={connectSubnetOpen}
        onClose={() => setConnectSubnetOpen(false)}
        routerName={router.name}
      />
      <DisconnectSubnetDrawer
        isOpen={disconnectSubnetOpen}
        onClose={() => setDisconnectSubnetOpen(false)}
        routerName={router.name}
      />
      <CreateStaticRouteDrawer
        isOpen={staticRouteOpen}
        onClose={() => setStaticRouteOpen(false)}
        routerName={router.name}
      />
    </div>
  );
}
