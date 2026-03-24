import { useMemo, useState, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Tooltip } from '@shared/components/Tooltip';
import { Badge } from '@shared/components/Badge';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import {
  IconCirclePlus,
  IconTrash,
  IconExternalLink,
  IconDotsCircleHorizontal,
  IconCube,
  IconRouter,
  IconEdit,
} from '@tabler/icons-react';
import { stripTimeFromTableDate } from './tableDateDisplay';

type NetworkStatus = 'active' | 'building' | 'error' | 'down';
type SubnetStatus = 'active' | 'building' | 'error';

interface NetworkDetail {
  id: string;
  name: string;
  status: NetworkStatus;
  adminState: 'Up' | 'Down';
  access: string;
  external: boolean;
  createdAt: string;
  networkName: string;
  availabilityZone: string;
  availabilityZoneHint: string;
  description: string;
  mtu: number;
  portSecurity: boolean;
  routerExternal: boolean;
  providerNetworkType: string;
  providerPhysicalNetwork: string;
  segmentationId: string;
}

interface Subnet {
  id: string;
  name: string;
  status: SubnetStatus;
  cidr: string;
  gatewayIp: string;
  dhcpEnabled: boolean;
  portCount: number;
  createdAt: string;
}

interface Port {
  id: string;
  name: string;
  status: 'active' | 'down' | 'build';
  attachedTo: {
    name: string;
    id: string;
    type: 'instance' | 'router' | 'none';
  } | null;
  ownedNetwork: { name: string; id: string };
  securityGroups: string[];
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
}

const mockNetworksMap: Record<string, NetworkDetail> = {
  'net-001': {
    id: 'net-001',
    name: 'net-01',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: true,
    createdAt: 'Sep 15, 2025 12:22:26',
    networkName: 'net-01',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Public external network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: true,
    providerNetworkType: 'flat',
    providerPhysicalNetwork: 'external',
    segmentationId: '-',
  },
  'net-002': {
    id: 'net-002',
    name: 'internal-net',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: false,
    createdAt: 'Sep 10, 2025 01:17:01',
    networkName: 'internal-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Private network for project',
    mtu: 1450,
    portSecurity: true,
    routerExternal: false,
    providerNetworkType: 'vxlan',
    providerPhysicalNetwork: '-',
    segmentationId: '100',
  },
  'net-003': {
    id: 'net-003',
    name: 'dev-network',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: false,
    createdAt: 'Sep 5, 2025 14:12:36',
    networkName: 'dev-network',
    availabilityZone: 'keystone',
    availabilityZoneHint: '-',
    description: 'Development network',
    mtu: 1500,
    portSecurity: false,
    routerExternal: false,
    providerNetworkType: 'vlan',
    providerPhysicalNetwork: 'mgmt',
    segmentationId: '200',
  },
  'net-004': {
    id: 'net-004',
    name: 'prod-net',
    status: 'building',
    adminState: 'Up',
    access: 'Project',
    external: true,
    createdAt: 'Sep 1, 2025 10:20:28',
    networkName: 'prod-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Production network',
    mtu: 9000,
    portSecurity: false,
    routerExternal: false,
    providerNetworkType: 'vlan',
    providerPhysicalNetwork: 'storage',
    segmentationId: '300',
  },
  'net-005': {
    id: 'net-005',
    name: 'test-network',
    status: 'active',
    adminState: 'Down',
    access: 'Project',
    external: false,
    createdAt: 'Aug 25, 2025 10:32:16',
    networkName: 'test-network',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Test network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: false,
    providerNetworkType: 'vxlan',
    providerPhysicalNetwork: '-',
    segmentationId: '400',
  },
  'net-006': {
    id: 'net-006',
    name: 'dmz-net',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: true,
    createdAt: 'Aug 20, 2025 23:27:51',
    networkName: 'dmz-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'DMZ network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: true,
    providerNetworkType: 'flat',
    providerPhysicalNetwork: 'dmz',
    segmentationId: '-',
  },
  'net-007': {
    id: 'net-007',
    name: 'management-net',
    status: 'error',
    adminState: 'Down',
    access: 'Project',
    external: false,
    createdAt: 'Aug 15, 2025 12:22:26',
    networkName: 'management-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Management network',
    mtu: 1500,
    portSecurity: false,
    routerExternal: false,
    providerNetworkType: 'vlan',
    providerPhysicalNetwork: 'mgmt',
    segmentationId: '500',
  },
  'net-008': {
    id: 'net-008',
    name: 'backup-network',
    status: 'active',
    adminState: 'Up',
    access: 'Project',
    external: false,
    createdAt: 'Aug 10, 2025 01:17:01',
    networkName: 'backup-network',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Backup network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: false,
    providerNetworkType: 'vxlan',
    providerPhysicalNetwork: '-',
    segmentationId: '600',
  },
  'net-009': {
    id: 'net-009',
    name: 'external-gateway',
    status: 'active',
    adminState: 'Up',
    access: 'Shared',
    external: true,
    createdAt: 'Aug 5, 2025 14:12:36',
    networkName: 'external-gateway',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'External gateway network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: true,
    providerNetworkType: 'flat',
    providerPhysicalNetwork: 'external',
    segmentationId: '-',
  },
  'net-010': {
    id: 'net-010',
    name: 'provider-net',
    status: 'active',
    adminState: 'Up',
    access: 'External',
    external: true,
    createdAt: 'Aug 1, 2025 10:20:28',
    networkName: 'provider-net',
    availabilityZone: 'nova',
    availabilityZoneHint: '-',
    description: 'Provider network',
    mtu: 1500,
    portSecurity: true,
    routerExternal: true,
    providerNetworkType: 'flat',
    providerPhysicalNetwork: 'provider',
    segmentationId: '-',
  },
};

const defaultNetworkDetail: NetworkDetail = {
  id: 'unknown',
  name: 'Unknown Network',
  status: 'active',
  adminState: 'Up',
  access: 'Project',
  external: false,
  createdAt: '-',
  networkName: '-',
  availabilityZone: '-',
  availabilityZoneHint: '-',
  description: '-',
  mtu: 1500,
  portSecurity: true,
  routerExternal: false,
  providerNetworkType: '-',
  providerPhysicalNetwork: '-',
  segmentationId: '-',
};

const mockSubnets: Subnet[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tg234${String(i).padStart(3, '0')}`,
  name: `subnet-1`,
  status: 'active' as SubnetStatus,
  cidr: '192.168.16/24',
  gatewayIp: '192.168.11',
  dhcpEnabled: true,
  portCount: 2,
  createdAt: 'Jan 15, 2025 12:22:26',
}));

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `port-01`,
  status: 'active' as const,
  attachedTo: {
    name: 'web-01',
    id: '29tgj234',
    type: i % 3 === 0 ? ('router' as const) : ('instance' as const),
  },
  ownedNetwork: { name: 'net-01', id: '29tgj234' },
  securityGroups: ['default-sg', 'web-sg', 'db-sg', 'app-sg', 'monitor-sg'],
  fixedIp: '10760.91',
  floatingIp: '10765.39',
  macAddress: 'fa:16:3e:34:85:32',
}));

const portStatusVariant: Record<Port['status'], StatusVariant> = {
  active: 'active',
  build: 'building',
  down: 'shutoff',
};

const STATUS_COL_WIDTH = 60;
const ACTION_COL_WIDTH = 72;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1 min-w-0';

const SubnetMenuTrigger = ({ toggle }: { toggle: () => void }) => (
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

export function ComputeNetworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const network = useMemo(
    () => (id ? (mockNetworksMap[id] ?? defaultNetworkDetail) : defaultNetworkDetail),
    [id]
  );

  const [subnetSearchTerm, setSubnetSearchTerm] = useState('');
  const [subnetCurrentPage, setSubnetCurrentPage] = useState(1);
  const [subnetSort, setSubnetSort] = useState('');
  const [subnetOrder, setSubnetOrder] = useState<SortOrder>('asc');
  const [selectedSubnets, setSelectedSubnets] = useState<(string | number)[]>([]);
  const subnetsPerPage = 10;

  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const [portSort, setPortSort] = useState('');
  const [portOrder, setPortOrder] = useState<SortOrder>('asc');

  const handleSubnetSort = useCallback((k: string | null, o: SortOrder) => {
    setSubnetSort(k ?? '');
    setSubnetOrder(o);
  }, []);
  const handlePortSort = useCallback((k: string | null, o: SortOrder) => {
    setPortSort(k ?? '');
    setPortOrder(o);
  }, []);

  const filteredSubnets = useMemo(() => {
    return mockSubnets.filter(
      (s) =>
        s.name.toLowerCase().includes(subnetSearchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(subnetSearchTerm.toLowerCase()) ||
        s.cidr.toLowerCase().includes(subnetSearchTerm.toLowerCase())
    );
  }, [subnetSearchTerm]);

  const sortedSubnets = useMemo(() => {
    const sorted = [...filteredSubnets];
    if (!subnetSort) return sorted;
    sorted.sort((a, b) => {
      const av = a[subnetSort as keyof Subnet];
      const bv = b[subnetSort as keyof Subnet];
      if (typeof av === 'string' && typeof bv === 'string') {
        return subnetOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      if (typeof av === 'number' && typeof bv === 'number') {
        return subnetOrder === 'asc' ? av - bv : bv - av;
      }
      return 0;
    });
    return sorted;
  }, [filteredSubnets, subnetSort, subnetOrder]);

  const paginatedSubnets = sortedSubnets.slice(
    (subnetCurrentPage - 1) * subnetsPerPage,
    subnetCurrentPage * subnetsPerPage
  );

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

  const portsPerPage = 10;
  const paginatedPorts = sortedPorts.slice(
    (portCurrentPage - 1) * portsPerPage,
    portCurrentPage * portsPerPage
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: 'Available',
      accessory: <StatusIndicator variant="active" layout="iconOnly" />,
    },
    { label: 'ID', value: network.id, showCopyButton: true, copyText: network.id },
    { label: 'Admin state', value: network.adminState },
    { label: 'Access', value: network.access },
    { label: 'External', value: network.external ? 'Yes' : 'No' },
    { label: 'Created at', value: network.createdAt },
  ];

  const subnetColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'cidr', header: 'CIDR' },
      { key: 'gatewayIp', header: 'Gateway IP', sortable: true },
      { key: 'portCount', header: 'Port count', sortable: true },
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

  const portColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'attachedTo', header: 'Attached to' },
      { key: 'ownedNetwork', header: 'Owned network', sortable: true },
      { key: 'securityGroups', header: 'SG' },
      { key: 'fixedIp', header: 'Fixed IP' },
      { key: 'floatingIp', header: 'Floating IP' },
      { key: 'macAddress', header: 'MAC Address' },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={network.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconCirclePlus size={12} stroke={1.5} /> Create subnet
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
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
                  <SectionCard.DataRow label="Network name" value={network.networkName} />
                  <SectionCard.DataRow
                    label="AZ(Availability zone)"
                    value={network.availabilityZone}
                  />
                  <SectionCard.DataRow
                    label="AZ(Availability zone) Hint"
                    value={network.availabilityZoneHint}
                  />
                  <SectionCard.DataRow label="Description" value={network.description} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Specification" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="MTU" value={String(network.mtu)} />
                  <SectionCard.DataRow
                    label="Port security"
                    value={network.portSecurity ? 'Yes' : 'No'}
                  />
                  <SectionCard.DataRow
                    label="Router external"
                    value={network.routerExternal ? 'Yes' : 'No'}
                  />
                  <SectionCard.DataRow
                    label="Provider network Type"
                    value={network.providerNetworkType}
                  />
                  <SectionCard.DataRow
                    label="Provider physical Network"
                    value={network.providerPhysicalNetwork}
                  />
                  <SectionCard.DataRow label="Segmentation ID" value={network.segmentationId} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="subnets" label="Subnets">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between h-7">
                <h3 className="text-16 font-semibold leading-6 text-text m-0">Subnets</h3>
                <Button variant="secondary" appearance="outline" size="sm">
                  <IconCirclePlus size={12} stroke={1.5} /> Create subnet
                </Button>
              </div>
              <input
                type="search"
                value={subnetSearchTerm}
                onChange={(e) => {
                  setSubnetSearchTerm(e.target.value);
                  setSubnetCurrentPage(1);
                }}
                placeholder="Search subnet by attributes"
                className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-[280px] outline-none"
              />
              <Pagination
                totalCount={filteredSubnets.length}
                size={subnetsPerPage}
                currentAt={subnetCurrentPage}
                onPageChange={setSubnetCurrentPage}
                totalCountLabel="items"
                selectedCount={selectedSubnets.length}
              />
              <SelectableTable<Subnet>
                columns={subnetColumns}
                rows={paginatedSubnets}
                selectionType="checkbox"
                selectedRows={selectedSubnets}
                onRowSelectionChange={setSelectedSubnets}
                getRowId={(row) => row.id}
                sort={subnetSort}
                order={subnetOrder}
                onSortChange={handleSubnetSort}
                stickyLastColumn
              >
                {paginatedSubnets.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={subnetColumns[0]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/subnets/${row.id}`}
                          className={linkClass}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.name}
                          <IconExternalLink size={12} className="text-primary shrink-0" />
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={subnetColumns[1]}>
                      {row.cidr}
                    </Table.Td>
                    <Table.Td rowData={row} column={subnetColumns[2]}>
                      {row.gatewayIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={subnetColumns[3]}>
                      {row.portCount}
                    </Table.Td>
                    <Table.Td rowData={row} column={subnetColumns[4]}>
                      {stripTimeFromTableDate(row.createdAt)}
                    </Table.Td>
                    <Table.Td rowData={row} column={subnetColumns[5]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <SubnetMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item action={() => console.log('Edit', row.id)}>
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
            </div>
          </Tab>

          <Tab id="ports" label="Ports">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between h-7">
                <h3 className="text-16 font-semibold leading-6 text-text m-0">Ports</h3>
              </div>
              <input
                type="search"
                value={portSearchTerm}
                onChange={(e) => {
                  setPortSearchTerm(e.target.value);
                  setPortCurrentPage(1);
                }}
                placeholder="Search port by attributes"
                className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-[280px] outline-none"
              />
              <Pagination
                totalCount={filteredPorts.length}
                size={portsPerPage}
                currentAt={portCurrentPage}
                onPageChange={setPortCurrentPage}
                totalCountLabel="items"
              />
              <Table<Port>
                columns={portColumns}
                rows={paginatedPorts}
                sort={portSort}
                order={portOrder}
                onSortChange={handlePortSort}
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
                          <IconExternalLink size={12} className="text-primary shrink-0" />
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[2]}>
                      {row.attachedTo ? (
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <Link
                              to={
                                row.attachedTo.type === 'router'
                                  ? `/compute/routers/${row.attachedTo.id}`
                                  : `/compute/instances/${row.attachedTo.id}`
                              }
                              className={linkClass}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {row.attachedTo.name}
                              <IconExternalLink size={12} className="text-primary shrink-0" />
                            </Link>
                            <span className="text-11 text-text-muted">
                              ID : {row.attachedTo.id}
                            </span>
                          </div>
                          <Tooltip
                            content={row.attachedTo.type === 'router' ? 'Router' : 'Instance'}
                            direction="top"
                            focusable={false}
                          >
                            <div className="shrink-0 inline-flex items-center justify-center size-[22px] bg-surface-default border border-border rounded-sm cursor-default">
                              {row.attachedTo.type === 'router' ? (
                                <IconRouter size={12} stroke={1.5} className="text-text-muted" />
                              ) : (
                                <IconCube size={12} stroke={1.5} className="text-text-muted" />
                              )}
                            </div>
                          </Tooltip>
                        </div>
                      ) : (
                        <span className="text-12 text-text-muted">-</span>
                      )}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[3]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/networks/${row.ownedNetwork.id}`}
                          className={linkClass}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.ownedNetwork.name}
                          <IconExternalLink size={12} className="text-primary shrink-0" />
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.ownedNetwork.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[4]}>
                      {(() => {
                        const sgCount = row.securityGroups.length;
                        const displaySg = row.securityGroups[0];
                        const additionalCount = sgCount - 1;
                        return (
                          <span className="flex items-center gap-1 text-12 text-text min-w-0">
                            <span className="truncate">{displaySg}</span>
                            {additionalCount > 0 && (
                              <Tooltip
                                content={
                                  <div className="flex flex-col gap-1 max-w-[280px]">
                                    <span className="text-11 font-medium text-text-muted">
                                      All Security Groups ({sgCount})
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {row.securityGroups.map((sg, i) => (
                                        <Badge key={i} theme="gry" size="sm" type="subtle">
                                          {sg}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                }
                                direction="bottom"
                                focusable={false}
                              >
                                <span className="inline-flex shrink-0 items-center justify-center px-1.5 rounded text-11 font-medium text-text-muted bg-surface-subtle hover:bg-surface-muted h-5 cursor-default">
                                  +{additionalCount}
                                </span>
                              </Tooltip>
                            )}
                          </span>
                        );
                      })()}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[5]}>
                      {row.fixedIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[6]}>
                      {row.floatingIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[7]}>
                      {row.macAddress}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
