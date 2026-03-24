import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import { ActionModal } from '@shared/components/ActionModal';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconExternalLink,
  IconDotsCircleHorizontal,
  IconCirclePlus,
  IconLinkPlus,
  IconBinaryTree,
  IconSettings,
  IconAlertCircle,
} from '@tabler/icons-react';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { stripTimeFromTableDate } from './tableDateDisplay';

type PortStatus = 'active' | 'down' | 'build';

interface PortDetail {
  id: string;
  name: string;
  status: PortStatus;
  createdAt: string;
  description: string;
  portSecurity: boolean;
  ownedNetwork: { name: string; id: string };
  subnet: { name: string; id: string };
  macAddress: string;
  attachedTo: { name: string; id: string; type: 'instance' | 'router' } | null;
}

interface FixedIP {
  id: string;
  fixedIp: string;
  floatingIp: { address: string; id: string } | null;
  ownedSubnet: { name: string; id: string };
  createdAt: string;
}

interface AllowedAddressPair {
  id: string;
  ipAddress: string;
  macAddress: string;
}

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const mockPortsMap: Record<string, PortDetail> = {
  'port-001': {
    id: 'port-001',
    name: 'port-01',
    status: 'active',
    createdAt: 'Sep 15, 2025 12:22:26',
    description: '-',
    portSecurity: true,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:32',
    attachedTo: { name: 'web-01', id: 'inst-001', type: 'instance' },
  },
  'port-002': {
    id: 'port-002',
    name: 'port-02',
    status: 'active',
    createdAt: 'Sep 10, 2025 01:17:01',
    description: '-',
    portSecurity: true,
    ownedNetwork: { name: 'net-02', id: 'net-002' },
    subnet: { name: 'subnet-02', id: 'subnet-002' },
    macAddress: 'fa:16:3e:34:85:33',
    attachedTo: { name: 'app-server', id: 'inst-002', type: 'instance' },
  },
  'port-003': {
    id: 'port-003',
    name: 'port-03',
    status: 'down',
    createdAt: 'Sep 8, 2025 11:51:27',
    description: '-',
    portSecurity: true,
    ownedNetwork: { name: 'net-03', id: 'net-003' },
    subnet: { name: 'subnet-03', id: 'subnet-003' },
    macAddress: 'fa:16:3e:34:85:34',
    attachedTo: null,
  },
  'port-004': {
    id: 'port-004',
    name: 'db-port',
    status: 'active',
    createdAt: 'Sep 5, 2025 14:12:36',
    description: 'Database port',
    portSecurity: true,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:35',
    attachedTo: { name: 'db-server', id: 'inst-003', type: 'instance' },
  },
  'port-005': {
    id: 'port-005',
    name: 'router-port-1',
    status: 'active',
    createdAt: 'Sep 1, 2025 10:20:28',
    description: 'Router port',
    portSecurity: false,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:36',
    attachedTo: { name: 'main-router', id: 'router-001', type: 'router' },
  },
  'port-006': {
    id: 'port-006',
    name: 'lb-port',
    status: 'active',
    createdAt: 'Aug 28, 2025 07:11:07',
    description: 'Load balancer port',
    portSecurity: true,
    ownedNetwork: { name: 'net-02', id: 'net-002' },
    subnet: { name: 'subnet-02', id: 'subnet-002' },
    macAddress: 'fa:16:3e:34:85:37',
    attachedTo: { name: 'load-balancer-01', id: 'lb-001', type: 'instance' },
  },
  'port-007': {
    id: 'port-007',
    name: 'cache-port',
    status: 'active',
    createdAt: 'Aug 25, 2025 10:32:16',
    description: 'Cache port',
    portSecurity: true,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:38',
    attachedTo: { name: 'redis-01', id: 'inst-004', type: 'instance' },
  },
  'port-008': {
    id: 'port-008',
    name: 'monitor-port',
    status: 'build',
    createdAt: 'Aug 20, 2025 23:27:51',
    description: 'Monitoring port',
    portSecurity: true,
    ownedNetwork: { name: 'net-03', id: 'net-003' },
    subnet: { name: 'subnet-03', id: 'subnet-003' },
    macAddress: 'fa:16:3e:34:85:39',
    attachedTo: { name: 'prometheus', id: 'inst-005', type: 'instance' },
  },
  'port-009': {
    id: 'port-009',
    name: 'test-port',
    status: 'down',
    createdAt: 'Aug 15, 2025 12:22:26',
    description: 'Test port',
    portSecurity: true,
    ownedNetwork: { name: 'net-04', id: 'net-004' },
    subnet: { name: 'subnet-04', id: 'subnet-004' },
    macAddress: 'fa:16:3e:34:85:40',
    attachedTo: null,
  },
  'port-010': {
    id: 'port-010',
    name: 'vpn-port',
    status: 'active',
    createdAt: 'Aug 10, 2025 01:17:01',
    description: 'VPN port',
    portSecurity: true,
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    macAddress: 'fa:16:3e:34:85:41',
    attachedTo: { name: 'vpn-gateway', id: 'vpn-001', type: 'instance' },
  },
};

const defaultPortDetail: PortDetail = {
  id: 'unknown',
  name: 'Unknown Port',
  status: 'active',
  createdAt: '-',
  description: '-',
  portSecurity: false,
  ownedNetwork: { name: '-', id: '' },
  subnet: { name: '-', id: '' },
  macAddress: '-',
  attachedTo: null,
};

const mockFixedIPs: FixedIP[] = Array.from({ length: 115 }, (_, i) => ({
  id: `fixed-ip-${String(i + 1).padStart(3, '0')}`,
  fixedIp: `10.0.0.${5 + i}`,
  floatingIp: i % 3 === 0 ? { address: `10.0.0.${5 + i}`, id: '29tgj234' } : null,
  ownedSubnet: { name: 'subnet-01', id: '29tgj234' },
  createdAt: 'Sep 1, 2025 10:20:28',
}));

const mockAllowedAddressPairs: AllowedAddressPair[] = Array.from({ length: 115 }, (_, i) => ({
  id: `aap-${String(i + 1).padStart(3, '0')}`,
  ipAddress: `10.0.0.${5 + (i % 250)}`,
  macAddress: `fa:12:34:56:78:${String(90 + (i % 10)).padStart(2, '0')}`,
}));

const mockSecurityGroups: SecurityGroup[] = Array.from({ length: 115 }, (_, i) => ({
  id: '29tgj234',
  name: `10.0.0.${5 + (i % 250)}`,
  description: '-',
  createdAt: 'Sep 3, 2025 00:46:02',
}));

const portStatusVariant: Record<PortStatus, StatusVariant> = {
  active: 'active',
  down: 'shutoff',
  build: 'building',
};

const ACTION_COL_WIDTH = 72;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1.5 min-w-0';

const RowMenuTrigger = ({ toggle }: { toggle: () => void }) => (
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

export function ComputePortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const port = useMemo(
    () => (id ? (mockPortsMap[id] ?? defaultPortDetail) : defaultPortDetail),
    [id]
  );

  const [fixedIpSearchTerm, setFixedIpSearchTerm] = useState('');
  const [fixedIpCurrentPage, setFixedIpCurrentPage] = useState(1);
  const [selectedFixedIPs] = useState<(string | number)[]>([]);
  const fixedIpsPerPage = 10;

  const [aapSearchTerm, setAapSearchTerm] = useState('');
  const [aapCurrentPage, setAapCurrentPage] = useState(1);
  const [selectedAaps] = useState<(string | number)[]>([]);
  const aapPerPage = 10;

  const [sgSearchTerm, setSgSearchTerm] = useState('');
  const [sgCurrentPage, setSgCurrentPage] = useState(1);
  const [selectedSgs] = useState<(string | number)[]>([]);
  const sgPerPage = 10;

  const [detachModalOpen, setDetachModalOpen] = useState(false);
  const [securityGroupToDetach, setSecurityGroupToDetach] = useState<SecurityGroup | null>(null);

  const [fSort, setFSort] = useState('');
  const [fOrder, setFOrder] = useState<SortOrder>('asc');
  const [aapSort, setAapSort] = useState('');
  const [aapOrder, setAapOrder] = useState<SortOrder>('asc');
  const [sgSort, setSgSort] = useState('');
  const [sgOrder, setSgOrder] = useState<SortOrder>('asc');

  const filteredFixedIPs = useMemo(() => {
    return mockFixedIPs.filter(
      (ip) =>
        ip.fixedIp.toLowerCase().includes(fixedIpSearchTerm.toLowerCase()) ||
        ip.ownedSubnet.name.toLowerCase().includes(fixedIpSearchTerm.toLowerCase()) ||
        (ip.floatingIp?.address.toLowerCase().includes(fixedIpSearchTerm.toLowerCase()) ?? false)
    );
  }, [fixedIpSearchTerm]);

  const paginatedFixedIPs = filteredFixedIPs.slice(
    (fixedIpCurrentPage - 1) * fixedIpsPerPage,
    fixedIpCurrentPage * fixedIpsPerPage
  );

  const filteredAaps = useMemo(() => {
    return mockAllowedAddressPairs.filter(
      (aap) =>
        aap.ipAddress.toLowerCase().includes(aapSearchTerm.toLowerCase()) ||
        aap.macAddress.toLowerCase().includes(aapSearchTerm.toLowerCase())
    );
  }, [aapSearchTerm]);

  const paginatedAaps = filteredAaps.slice(
    (aapCurrentPage - 1) * aapPerPage,
    aapCurrentPage * aapPerPage
  );

  const filteredSgs = useMemo(() => {
    return mockSecurityGroups.filter(
      (sg) =>
        sg.name.toLowerCase().includes(sgSearchTerm.toLowerCase()) ||
        sg.description.toLowerCase().includes(sgSearchTerm.toLowerCase())
    );
  }, [sgSearchTerm]);

  const paginatedSgs = filteredSgs.slice(
    (sgCurrentPage - 1) * sgPerPage,
    sgCurrentPage * sgPerPage
  );

  const statusText = port.status.charAt(0).toUpperCase() + port.status.slice(1);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: statusText,
      accessory: <StatusIndicator variant={portStatusVariant[port.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: port.id, showCopyButton: true, copyText: port.id },
    { label: 'Port security', value: port.portSecurity ? 'On' : 'Off' },
    { label: 'Created at', value: port.createdAt },
  ];

  const fixedIpColumns: TableColumn[] = useMemo(
    () => [
      { key: 'fixedIp', header: 'Fixed IP' },
      { key: 'floatingIp', header: 'Floating IP' },
      { key: 'ownedSubnet', header: 'Owned subnet', sortable: true },
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

  const aapColumns: TableColumn[] = useMemo(
    () => [
      { key: 'ipAddress', header: 'IP Address' },
      { key: 'macAddress', header: 'MAC Address' },
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

  const sgColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Security group', sortable: true },
      { key: 'description', header: 'Description', sortable: true },
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

  const handleDetach = () => {
    if (securityGroupToDetach) {
      console.log('Detaching', securityGroupToDetach.id, port.id);
    }
    setDetachModalOpen(false);
    setSecurityGroupToDetach(null);
  };

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={port.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
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
              <ContextMenu.Item action={() => {}}>Attach instance</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Detach instance</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Associate floating IP</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Disassociate floating IP</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Allocate IP</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Manage security groups</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Create allowed address pair</ContextMenu.Item>
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
                  <SectionCard.DataRow label="Port name" value={port.name} />
                  <SectionCard.DataRow label="Description" value={port.description} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Network" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Owned network">
                    <Link to={`/compute/networks/${port.ownedNetwork.id}`} className={linkClass}>
                      {port.ownedNetwork.name}
                      <IconExternalLink size={12} className="text-primary shrink-0" />
                    </Link>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Subnet">
                    <Link to={`/compute/networks/${port.subnet.id}`} className={linkClass}>
                      {port.subnet.name}
                      <IconExternalLink size={12} className="text-primary shrink-0" />
                    </Link>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="MAC Address">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text">{port.macAddress}</span>
                      {port.macAddress !== '-' && <CopyButton text={port.macAddress} />}
                    </div>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Attachments" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Attached to">
                    {port.attachedTo ? (
                      <Link
                        to={
                          port.attachedTo.type === 'instance'
                            ? `/compute/instances/${port.attachedTo.id}`
                            : `/compute/routers/${port.attachedTo.id}`
                        }
                        className={linkClass}
                      >
                        {port.attachedTo.name}
                        <IconExternalLink size={12} className="text-primary shrink-0" />
                      </Link>
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="fixed-ips" label="Fixed IPs">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-16 font-semibold text-text m-0">Fixed IPs</h3>
                <div className="flex items-center gap-1">
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconBinaryTree size={12} stroke={1.5} /> Allocate IP
                  </Button>
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconLinkPlus size={12} stroke={1.5} /> Associate floating IP
                  </Button>
                </div>
              </div>
              <input
                type="search"
                value={fixedIpSearchTerm}
                onChange={(e) => {
                  setFixedIpSearchTerm(e.target.value);
                  setFixedIpCurrentPage(1);
                }}
                placeholder="Search fixed IP by attributes"
                className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
              />
              <Pagination
                totalCount={filteredFixedIPs.length}
                size={fixedIpsPerPage}
                currentAt={fixedIpCurrentPage}
                onPageChange={setFixedIpCurrentPage}
                totalCountLabel="items"
                selectedCount={selectedFixedIPs.length}
              />
              <Table<FixedIP>
                columns={fixedIpColumns}
                rows={paginatedFixedIPs}
                sort={fSort}
                order={fOrder}
                onSortChange={(k, o) => {
                  setFSort(k ?? '');
                  setFOrder(o);
                }}
                stickyLastColumn
              >
                {paginatedFixedIPs.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={fixedIpColumns[0]}>
                      {row.fixedIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={fixedIpColumns[1]}>
                      {row.floatingIp ? (
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <Link
                            to={`/compute/floating-ips/${row.floatingIp.id}`}
                            className={linkClass}
                          >
                            {row.floatingIp.address}
                          </Link>
                          <span className="text-11 text-text-muted">ID : {row.floatingIp.id}</span>
                        </div>
                      ) : (
                        <span className="text-12 text-text-muted">-</span>
                      )}
                    </Table.Td>
                    <Table.Td rowData={row} column={fixedIpColumns[2]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute/subnets/${row.ownedSubnet.id}`} className={linkClass}>
                          {row.ownedSubnet.name}
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.ownedSubnet.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={fixedIpColumns[3]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <RowMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item action={() => console.log('Disassociate', row.id)} danger>
                          Disassociate floating IP
                        </ContextMenu.Item>
                        <ContextMenu.Item action={() => console.log('Release', row.id)} danger>
                          Release fixed IP
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          {port.status === 'active' && (
            <Tab id="allowed-address-pairs" label="Allowed Address Pairs">
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-16 font-semibold text-text m-0">Allowed Address Pairs</h3>
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconCirclePlus size={12} stroke={1.5} /> Create Allowed Address Pair
                  </Button>
                </div>
                <input
                  type="search"
                  value={aapSearchTerm}
                  onChange={(e) => {
                    setAapSearchTerm(e.target.value);
                    setAapCurrentPage(1);
                  }}
                  placeholder="Search address pair by attributes"
                  className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
                />
                <Pagination
                  totalCount={filteredAaps.length}
                  size={aapPerPage}
                  currentAt={aapCurrentPage}
                  onPageChange={setAapCurrentPage}
                  totalCountLabel="items"
                  selectedCount={selectedAaps.length}
                />
                <Table<AllowedAddressPair>
                  columns={aapColumns}
                  rows={paginatedAaps}
                  sort={aapSort}
                  order={aapOrder}
                  onSortChange={(k, o) => {
                    setAapSort(k ?? '');
                    setAapOrder(o);
                  }}
                  stickyLastColumn
                >
                  {paginatedAaps.map((row) => (
                    <Table.Tr key={row.id} rowData={row}>
                      <Table.Td rowData={row} column={aapColumns[0]}>
                        {row.ipAddress}
                      </Table.Td>
                      <Table.Td rowData={row} column={aapColumns[1]}>
                        {row.macAddress}
                      </Table.Td>
                      <Table.Td rowData={row} column={aapColumns[2]} preventClickPropagation>
                        <ContextMenu.Root
                          direction="bottom-end"
                          gap={4}
                          trigger={({ toggle }) => <RowMenuTrigger toggle={toggle} />}
                        >
                          <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
                            Delete
                          </ContextMenu.Item>
                        </ContextMenu.Root>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table>
              </div>
            </Tab>
          )}

          {port.status === 'active' && (
            <Tab id="security" label="Security">
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-16 font-semibold text-text m-0">Security groups</h3>
                  <Button variant="secondary" appearance="outline" size="sm">
                    <IconSettings size={12} stroke={1.5} /> Manage security Group
                  </Button>
                </div>
                <input
                  type="search"
                  value={sgSearchTerm}
                  onChange={(e) => {
                    setSgSearchTerm(e.target.value);
                    setSgCurrentPage(1);
                  }}
                  placeholder="Search security group by attributes"
                  className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
                />
                <Pagination
                  totalCount={filteredSgs.length}
                  size={sgPerPage}
                  currentAt={sgCurrentPage}
                  onPageChange={setSgCurrentPage}
                  totalCountLabel="items"
                  selectedCount={selectedSgs.length}
                />
                <Table<SecurityGroup>
                  columns={sgColumns}
                  rows={paginatedSgs}
                  sort={sgSort}
                  order={sgOrder}
                  onSortChange={(k, o) => {
                    setSgSort(k ?? '');
                    setSgOrder(o);
                  }}
                  stickyLastColumn
                >
                  {paginatedSgs.map((row) => (
                    <Table.Tr key={`${row.id}-${row.name}`} rowData={row}>
                      <Table.Td rowData={row} column={sgColumns[0]}>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <Link to={`/compute/security-groups/${row.id}`} className={linkClass}>
                            {row.name}
                            <IconExternalLink size={12} className="text-primary shrink-0" />
                          </Link>
                          <span className="text-11 text-text-muted">ID : {row.id}</span>
                        </div>
                      </Table.Td>
                      <Table.Td rowData={row} column={sgColumns[1]}>
                        {row.description}
                      </Table.Td>
                      <Table.Td rowData={row} column={sgColumns[2]}>
                        {stripTimeFromTableDate(row.createdAt)}
                      </Table.Td>
                      <Table.Td rowData={row} column={sgColumns[3]} preventClickPropagation>
                        <ContextMenu.Root
                          direction="bottom-end"
                          gap={4}
                          trigger={({ toggle }) => <RowMenuTrigger toggle={toggle} />}
                        >
                          <ContextMenu.Item
                            action={() => {
                              setSecurityGroupToDetach(row);
                              setDetachModalOpen(true);
                            }}
                            danger
                          >
                            Detach
                          </ContextMenu.Item>
                        </ContextMenu.Root>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table>
              </div>
            </Tab>
          )}
        </Tabs>
      </div>

      {detachModalOpen && (
        <ActionModal
          appeared={detachModalOpen}
          onConfirm={handleDetach}
          onCancel={() => {
            setDetachModalOpen(false);
            setSecurityGroupToDetach(null);
          }}
          actionConfig={{
            title: 'Detach security group',
            subtitle: 'This action detaches the security group from the port.',
            actionButtonText: 'Detach',
            actionButtonVariant: 'primary',
            cancelButtonText: 'Cancel',
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="bg-surface-subtle rounded-md px-4 py-3 flex flex-col gap-1.5">
              <span className="text-11 font-medium text-text-muted leading-4">Port</span>
              <span className="text-12 leading-18 text-text">{port.name}</span>
            </div>
            <div className="bg-surface-subtle rounded-md px-4 py-3 flex flex-col gap-1.5">
              <span className="text-11 font-medium text-text-muted leading-4">Security group</span>
              <span className="text-12 leading-18 text-text">
                {securityGroupToDetach?.name ?? '-'}
              </span>
            </div>
            <div className="bg-[var(--primitive-color-red50)] rounded-md p-3 flex gap-2 items-start">
              <IconAlertCircle size={14} className="text-error shrink-0 mt-0.5" />
              <span className="text-11 leading-16 text-text">
                Detaching this security group may affect network access for the port.
              </span>
            </div>
          </div>
        </ActionModal>
      )}
    </div>
  );
}
