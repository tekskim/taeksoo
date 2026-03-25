import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { IconTrash, IconDownload, IconRouter, IconCube, IconServer } from '@tabler/icons-react';
import { ActionModal } from '@shared/components/ActionModal';

interface FirewallDetail {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'down' | 'error';
  tenant: string;
  tenantId: string;
  adminState: 'Up' | 'Down';
  ingressPolicy: string;
  ingressPolicyId: string;
  egressPolicy: string;
  egressPolicyId: string;
  createdAt: string;
}

interface Port {
  id: string;
  name: string;
  status: 'active' | 'down' | 'build';
  attachedToType: string;
  attachedToName: string;
  attachedToId: string;
  network: string;
  networkId: string;
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
  adminState: 'Up' | 'Down';
}

const mockFirewallsMap: Record<string, FirewallDetail> = {
  'fw-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'nacl-1',
    description: 'Main NACL for web servers',
    status: 'active',
    tenant: 'tenantA',
    tenantId: 'tenant-001',
    adminState: 'Up',
    ingressPolicy: 'ingress-policy-1',
    ingressPolicyId: 'fwp-001',
    egressPolicy: 'egress-policy-1',
    egressPolicyId: 'fwp-002',
    createdAt: 'Dec 25, 2025 10:32:16',
  },
  'fw-002': {
    id: '8394e0285f92542f04171b0ccd3deff0',
    name: 'nacl-2',
    description: 'Database NACL',
    status: 'active',
    tenant: 'tenantB',
    tenantId: 'tenant-002',
    adminState: 'Up',
    ingressPolicy: 'db-ingress-policy',
    ingressPolicyId: 'fwp-003',
    egressPolicy: 'db-egress-policy',
    egressPolicyId: 'fwp-004',
    createdAt: 'Dec 20, 2025 23:27:51',
  },
};

const defaultFirewallDetail: FirewallDetail = {
  id: 'unknown',
  name: 'Unknown NACL',
  description: '-',
  status: 'down',
  tenant: '-',
  tenantId: '',
  adminState: 'Down',
  ingressPolicy: '-',
  ingressPolicyId: '',
  egressPolicy: '-',
  egressPolicyId: '',
  createdAt: '-',
};

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `port`,
  status: ['active', 'active', 'active', 'down', 'build'][i % 5] as 'active' | 'down' | 'build',
  attachedToType: ['Router(Interface)', 'Instance', 'Load Balancer'][i % 3],
  attachedToName: ['router', 'instance-1', 'lb-1'][i % 3],
  attachedToId: `${['router', 'instance', 'lb'][i % 3]}-${String(i + 1).padStart(3, '0')}`,
  network: `network`,
  networkId: `net-${String((i % 5) + 1).padStart(3, '0')}`,
  fixedIp: `10.70.0.${48 + i}`,
  floatingIp: i % 3 === 0 ? `203.0.113.${i}` : '-',
  macAddress: `fa:16:3e:77:62:${String(19 + i).padStart(2, '0')}`,
  adminState: i % 4 === 0 ? 'Down' : 'Up',
}));

const portStatusVariant: Record<Port['status'], StatusVariant> = {
  active: 'active',
  down: 'down',
  build: 'building',
};

const fwStatusVariant: Record<FirewallDetail['status'], StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const STATUS_COL_WIDTH = 60;
const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeFirewallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const firewall = useMemo(
    () => (id ? (mockFirewallsMap[id] ?? defaultFirewallDetail) : defaultFirewallDetail),
    [id]
  );

  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const portsPerPage = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const filteredPorts = useMemo(() => {
    if (!portSearchTerm) return mockPorts;
    const query = portSearchTerm.toLowerCase();
    return mockPorts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.network.toLowerCase().includes(query) ||
        p.fixedIp.toLowerCase().includes(query)
    );
  }, [portSearchTerm]);

  const paginatedPorts = filteredPorts.slice(
    (portCurrentPage - 1) * portsPerPage,
    portCurrentPage * portsPerPage
  );

  const statusLabel = firewall.status.charAt(0).toUpperCase() + firewall.status.slice(1);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: statusLabel,
      accessory: <StatusIndicator variant={fwStatusVariant[firewall.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: firewall.id, showCopyButton: true, copyText: firewall.id },
    { label: 'Tenant', value: firewall.tenant },
    { label: 'Admin state', value: firewall.adminState },
    { label: 'Created at', value: firewall.createdAt },
  ];

  const portColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'attachedTo', header: 'Attached to' },
    { key: 'network', header: 'Owned Network', sortable: true },
    { key: 'fixedIp', header: 'Fixed IP' },
    { key: 'floatingIp', header: 'Floating IP' },
    { key: 'macAddress', header: 'MAC Address' },
    { key: 'adminState', header: 'Admin state' },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={firewall.name}
        actions={
          <Button
            variant="secondary"
            appearance="outline"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
          >
            <IconTrash size={12} stroke={1.5} /> Delete
          </Button>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="pt-6">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="NACL name" value={firewall.name} />
                  <SectionCard.DataRow label="Description" value={firewall.description || '-'} />
                  <SectionCard.DataRow label="Admin state" value={firewall.adminState} />
                  <SectionCard.DataRow
                    label="Ingress policy"
                    value={
                      firewall.ingressPolicyId ? (
                        <Link
                          to={`/compute/firewall-policies/${firewall.ingressPolicyId}`}
                          className={linkClass}
                        >
                          {firewall.ingressPolicy}
                        </Link>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <SectionCard.DataRow
                    label="Egress policy"
                    value={
                      firewall.egressPolicyId ? (
                        <Link
                          to={`/compute/firewall-policies/${firewall.egressPolicyId}`}
                          className={linkClass}
                        >
                          {firewall.egressPolicy}
                        </Link>
                      ) : (
                        '-'
                      )
                    }
                  />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="ports" label="Ports">
            <div className="flex flex-col gap-3 pt-6">
              <h3 className="text-16 font-semibold leading-6 text-text m-0">Ports</h3>
              <div className="flex items-center gap-1">
                <input
                  type="search"
                  value={portSearchTerm}
                  onChange={(e) => {
                    setPortSearchTerm(e.target.value);
                    setPortCurrentPage(1);
                  }}
                  placeholder="Search ports by attributes"
                  className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 w-full max-w-[320px] outline-none"
                />
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded-md border border-border-strong bg-surface-default text-text hover:bg-surface-muted"
                  aria-label="Download"
                >
                  <IconDownload size={12} stroke={1.5} />
                </button>
              </div>
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
                onSortChange={(k, o) => {
                  setSort(k ?? '');
                  setOrder(o);
                }}
              >
                {paginatedPorts.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={portColumns[0]}>
                      <StatusIndicator variant={portStatusVariant[row.status]} layout="iconOnly" />
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute/ports/${row.id}`} className={linkClass}>
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted">ID: {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[2]}>
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <Link to={`/compute/routers/${row.attachedToId}`} className={linkClass}>
                            {row.attachedToName}
                          </Link>
                          <span className="text-11 text-text-muted">ID: {row.attachedToId}</span>
                        </div>
                        <Tooltip
                          content={
                            row.attachedToType === 'Router(Interface)'
                              ? 'Router'
                              : row.attachedToType === 'Instance'
                                ? 'Instance'
                                : 'Load Balancer'
                          }
                          direction="top"
                          focusable={false}
                        >
                          <div className="shrink-0 bg-surface-default border border-border rounded-sm p-1">
                            {row.attachedToType === 'Router(Interface)' ? (
                              <IconRouter size={12} stroke={1.5} className="text-text-muted" />
                            ) : row.attachedToType === 'Instance' ? (
                              <IconCube size={12} stroke={1.5} className="text-text-muted" />
                            ) : (
                              <IconServer size={12} stroke={1.5} className="text-text-muted" />
                            )}
                          </div>
                        </Tooltip>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[3]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute/networks/${row.networkId}`} className={linkClass}>
                          {row.network}
                        </Link>
                        <span className="text-11 text-text-muted">ID: {row.networkId}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[4]}>
                      {row.fixedIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[5]}>
                      {row.floatingIp}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[6]}>
                      {row.macAddress}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[7]}>
                      <Badge
                        theme={row.adminState === 'Up' ? 'gre' : 'gry'}
                        size="sm"
                        type="subtle"
                      >
                        {row.adminState}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <ActionModal
        appeared={deleteModalOpen}
        actionConfig={{
          title: 'Delete firewall',
          subtitle: `Are you sure you want to delete "${firewall.name}"? This action cannot be undone.`,
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
        }}
        onConfirm={() => {
          console.log('[Firewall] Delete confirmed');
          setDeleteModalOpen(false);
          navigate('/compute/firewalls');
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
