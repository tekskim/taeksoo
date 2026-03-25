import { useMemo, useState, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Tooltip } from '@shared/components/Tooltip';
import { Badge } from '@shared/components/Badge';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconEdit, IconTrash, IconExternalLink, IconCube, IconRouter } from '@tabler/icons-react';

type PortStatus = 'active' | 'down' | 'build';

interface SubnetDetail {
  id: string;
  name: string;
  tenant: string;
  cidr: string;
  gatewayIp: string;
  createdAt: string;
  allocationPools: string;
  dhcp: boolean;
  dns: string;
  hostRoutes: string;
  network: {
    name: string;
    id: string;
  };
}

interface Port extends Record<string, unknown> {
  id: string;
  name: string;
  status: PortStatus;
  attachedTo: {
    name: string;
    id: string;
    type: 'instance' | 'router';
  } | null;
  ownedNetwork: {
    name: string;
    id: string;
  };
  securityGroups: string[];
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
}

const mockSubnetDetail: SubnetDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'subnet-1',
  tenant: 'demo-project',
  cidr: '192.168.2.0/24',
  gatewayIp: '192.168.2.1',
  createdAt: 'Jul 25, 2025 10:32:16',
  allocationPools: '192.168.2.2 - 192.168.2.254',
  dhcp: true,
  dns: '-',
  hostRoutes: '-',
  network: {
    name: 'web-server-10',
    id: 'net-001',
  },
};

const mockSubnets: Record<string, SubnetDetail> = {
  '29tg234000': mockSubnetDetail,
  'subnet-001': mockSubnetDetail,
  'subnet-002': {
    ...mockSubnetDetail,
    id: 'subnet-002',
    name: 'subnet-2',
    tenant: 'engineering',
    cidr: '192.168.3.0/24',
    gatewayIp: '192.168.3.1',
  },
  'subnet-003': {
    ...mockSubnetDetail,
    id: 'subnet-003',
    name: 'subnet-3',
    tenant: 'production',
    cidr: '192.168.4.0/24',
    gatewayIp: '192.168.4.1',
  },
};

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `port-${String(i + 1).padStart(2, '0')}`,
  status: ['active', 'down', 'build'][i % 3] as PortStatus,
  attachedTo: {
    name: `web-${String(i + 1).padStart(2, '0')}`,
    id: `29tgj${String(i).padStart(3, '0')}`,
    type: i % 5 === 0 ? 'router' : 'instance',
  },
  ownedNetwork: {
    name: 'net-01',
    id: '29ttgj234',
  },
  securityGroups: ['default-sg', 'web-sg', 'db-sg', 'app-sg', 'monitor-sg'].slice(0, (i % 5) + 1),
  fixedIp: `10760.${91 + (i % 10)}`,
  floatingIp: `10765.${39 + (i % 10)}`,
  macAddress: `fa:16:3e:34:85:${String(32 + (i % 50)).padStart(2, '0')}`,
}));

const portStatusMap: Record<PortStatus, StatusVariant> = {
  active: 'active',
  down: 'shutoff',
  build: 'building',
};

const STATUS_COL_WIDTH = 60;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1.5 min-w-0';

export function ComputeAdminSubnetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const subnet = useMemo(() => (id && mockSubnets[id] ? mockSubnets[id] : mockSubnetDetail), [id]);

  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const portsPerPage = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSort = useCallback((k: string | null, o: SortOrder) => {
    setSort(k ?? '');
    setOrder(o);
  }, []);

  const filteredPorts = useMemo(() => {
    return mockPorts.filter(
      (port) =>
        port.name.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
        port.macAddress.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
        port.fixedIp.toLowerCase().includes(portSearchTerm.toLowerCase()) ||
        (port.attachedTo?.name.toLowerCase().includes(portSearchTerm.toLowerCase()) ?? false)
    );
  }, [portSearchTerm]);

  const paginatedPorts = filteredPorts.slice(
    (portCurrentPage - 1) * portsPerPage,
    portCurrentPage * portsPerPage
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'ID', value: subnet.id, showCopyButton: true, copyText: subnet.id },
    { label: 'Tenant', value: subnet.tenant },
    { label: 'CIDR', value: subnet.cidr },
    { label: 'Gateway IP', value: subnet.gatewayIp },
    { label: 'Created at', value: subnet.createdAt },
  ];

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
        title={subnet.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
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
                  <SectionCard.DataRow label="Subnet name" value={subnet.name} />
                  <SectionCard.DataRow label="Tenant" value={subnet.tenant} />
                  <SectionCard.DataRow label="CIDR" value={subnet.cidr} />
                  <SectionCard.DataRow label="Gateway IP" value={subnet.gatewayIp} />
                  <SectionCard.DataRow label="Allocation pools" value={subnet.allocationPools} />
                  <SectionCard.DataRow label="DHCP" value={subnet.dhcp ? 'On' : 'Off'} />
                  <SectionCard.DataRow label="DNS" value={subnet.dns} />
                  <SectionCard.DataRow label="Host routes" value={subnet.hostRoutes} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Network" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Network">
                    <Link to={`/compute-admin/networks/${subnet.network.id}`} className={linkClass}>
                      {subnet.network.name}
                      <IconExternalLink size={12} className="text-primary shrink-0" />
                    </Link>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
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
                className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
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
                sort={sort}
                order={order}
                onSortChange={handleSort}
              >
                {paginatedPorts.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={portColumns[0]}>
                      <StatusIndicator variant={portStatusMap[row.status]} layout="iconOnly" />
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute-admin/ports/${row.id}`} className={linkClass}>
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
                                  ? `/compute-admin/routers/${row.attachedTo.id}`
                                  : `/compute-admin/instances/${row.attachedTo.id}`
                              }
                              className={linkClass}
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
                          to={`/compute-admin/networks/${row.ownedNetwork.id}`}
                          className={linkClass}
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
