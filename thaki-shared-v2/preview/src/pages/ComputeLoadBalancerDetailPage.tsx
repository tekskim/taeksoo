import { useMemo, useState, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { ManageSNICertificateDrawer } from '../drawers/compute/load-balancer/ManageSNICertificateDrawer';
import { ChangeCACertificateDrawer } from '../drawers/compute/certificate/ChangeCACertificateDrawer';
import { ChangeServerCertificateDrawer } from '../drawers/compute/certificate/ChangeServerCertificateDrawer';
import { CreateHealthMonitorDrawer } from '../drawers/compute/load-balancer/CreateHealthMonitorDrawer';
import { ManageMembersDrawer } from '../drawers/compute/load-balancer/ManageMembersDrawer';
import { AddL7RuleDrawer } from '../drawers/compute/load-balancer/AddL7RuleDrawer';
import { AddL7PolicyDrawer } from '../drawers/compute/load-balancer/AddL7PolicyDrawer';
import { EditMemberDrawer } from '../drawers/compute/load-balancer/EditMemberDrawer';
import { EditPoolDrawer } from '../drawers/compute/load-balancer/EditPoolDrawer';
import { EditListenerDrawer } from '../drawers/compute/load-balancer/EditListenerDrawer';
import { AssociateFloatingIPToLBDrawer } from '../drawers/compute/load-balancer/AssociateFloatingIPToLBDrawer';
import { EditLoadBalancerDrawer } from '../drawers/compute/load-balancer/EditLoadBalancerDrawer';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Badge } from '@shared/components/Badge';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import {
  IconUnlink,
  IconLinkPlus,
  IconTrash,
  IconEdit,
  IconCirclePlus,
  IconDotsCircleHorizontal,
  IconDownload,
} from '@tabler/icons-react';

type LoadBalancerStatus = 'active' | 'pending' | 'error';
type ListenerStatus = 'active' | 'down' | 'error';

interface LoadBalancerDetail {
  id: string;
  name: string;
  status: LoadBalancerStatus;
  adminState: 'Up' | 'Down';
  vipAddress: string;
  createdAt: string;
  description: string;
  provider: string;
  ownedNetwork: { name: string; id: string } | null;
  subnet: { name: string; id: string } | null;
  floatingIp: { name: string; id: string } | null;
}

interface Listener {
  id: string;
  name: string;
  status: ListenerStatus;
  protocol: string;
  port: number;
  connectionLimit: number;
  adminState: 'Up' | 'Down';
}

const statusMap: Record<LoadBalancerStatus, StatusVariant> = {
  active: 'active',
  pending: 'building',
  error: 'error',
};

const mockLoadBalancersMap: Record<string, LoadBalancerDetail> = {
  'lb-001': {
    id: 'lb-001',
    name: 'web-lb-01',
    status: 'active',
    adminState: 'Up',
    vipAddress: '192.168.10.13',
    createdAt: 'Oct 3, 2025 00:46:02',
    description: '-',
    provider: 'ovn',
    ownedNetwork: { name: 'net-02', id: 'net-002' },
    subnet: { name: 'subnet-02', id: 'subnet-002' },
    floatingIp: { name: '192.168.10.13', id: 'fip-001' },
  },
  'lb-002': {
    id: 'lb-002',
    name: 'api-lb',
    status: 'active',
    adminState: 'Up',
    vipAddress: '192.168.10.14',
    createdAt: 'Oct 2, 2025 17:33:45',
    description: 'API Load balancer',
    provider: 'ovn',
    ownedNetwork: { name: 'net-01', id: 'net-001' },
    subnet: { name: 'subnet-01', id: 'subnet-001' },
    floatingIp: { name: '192.168.10.14', id: 'fip-002' },
  },
  'lb-003': {
    id: 'lb-003',
    name: 'app-lb',
    status: 'pending',
    adminState: 'Up',
    vipAddress: '192.168.10.15',
    createdAt: 'Oct 1, 2025 10:20:28',
    description: 'Application Load balancer',
    provider: 'ovn',
    ownedNetwork: { name: 'net-03', id: 'net-003' },
    subnet: { name: 'subnet-03', id: 'subnet-003' },
    floatingIp: { name: '192.168.10.15', id: 'fip-003' },
  },
};

const defaultLoadBalancer: LoadBalancerDetail = {
  id: 'lb-default',
  name: 'Unknown',
  status: 'active',
  adminState: 'Up',
  vipAddress: '-',
  createdAt: '-',
  description: '-',
  provider: 'ovn',
  ownedNetwork: { name: '-', id: '' },
  subnet: { name: '-', id: '' },
  floatingIp: { name: '-', id: '' },
};

const mockListeners: Listener[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29fg234${String(i).padStart(2, '0')}`,
  name: `listener-http-80`,
  status: ['active', 'active', 'active', 'down', 'error'][i % 5] as ListenerStatus,
  protocol: 'HTTP',
  port: 80,
  connectionLimit: 2,
  adminState: i % 10 === 0 ? 'Down' : 'Up',
}));

const listenerStatusMap: Record<ListenerStatus, StatusVariant> = {
  active: 'active',
  down: 'down',
  error: 'error',
};

const STATUS_COL_WIDTH = 60;
const ACTION_COL_WIDTH = 72;
const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1.5 min-w-0';

const ListenerMenuTrigger = ({ toggle }: { toggle: () => void }) => (
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

export function ComputeLoadBalancerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const loadBalancer = useMemo(
    () => (id ? (mockLoadBalancersMap[id] ?? defaultLoadBalancer) : defaultLoadBalancer),
    [id]
  );

  const [sniListener, setSniListener] = useState<{ id: string; name: string } | null>(null);
  const [editLbOpen, setEditLbOpen] = useState(false);
  const [associateFipOpen, setAssociateFipOpen] = useState(false);
  const [editListenerOpen, setEditListenerOpen] = useState(false);
  const [changeServerCertOpen, setChangeServerCertOpen] = useState(false);
  const [changeCaCertOpen, setChangeCaCertOpen] = useState(false);
  const [addL7PolicyOpen, setAddL7PolicyOpen] = useState(false);
  const [addL7RuleOpen, setAddL7RuleOpen] = useState(false);
  const [editPoolOpen, setEditPoolOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [createHealthMonOpen, setCreateHealthMonOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [activeListener, setActiveListener] = useState<Listener | null>(null);
  const [activePool, setActivePool] = useState<{
    id: string;
    name: string;
    algorithm: string;
    protocol: string;
  } | null>(null);

  const [listenerSearchTerm, setListenerSearchTerm] = useState('');
  const [listenerCurrentPage, setListenerCurrentPage] = useState(1);
  const [selectedListeners, setSelectedListeners] = useState<(string | number)[]>([]);
  const listenersPerPage = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSort = useCallback((k: string | null, o: SortOrder) => {
    setSort(k ?? '');
    setOrder(o);
  }, []);

  const filteredListeners = useMemo(() => {
    if (!listenerSearchTerm) return mockListeners;
    const query = listenerSearchTerm.toLowerCase();
    return mockListeners.filter(
      (l) => l.name.toLowerCase().includes(query) || l.protocol.toLowerCase().includes(query)
    );
  }, [listenerSearchTerm]);

  const paginatedListeners = filteredListeners.slice(
    (listenerCurrentPage - 1) * listenersPerPage,
    listenerCurrentPage * listenersPerPage
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: loadBalancer.status === 'active' ? 'Available' : loadBalancer.status,
      accessory: <StatusIndicator variant={statusMap[loadBalancer.status]} layout="iconOnly" />,
    },
    { label: 'ID', value: loadBalancer.id, showCopyButton: true, copyText: loadBalancer.id },
    { label: 'VIP Address', value: loadBalancer.vipAddress },
    { label: 'Admin state', value: loadBalancer.adminState },
    { label: 'Origin', value: loadBalancer.provider },
    { label: 'Created at', value: loadBalancer.createdAt },
  ];

  const listenerColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'protocol', header: 'Protocol', sortable: true },
      { key: 'port', header: 'Port', sortable: true },
      { key: 'connectionLimit', header: 'Connection limit', sortable: true },
      { key: 'adminState', header: 'Admin state' },
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
        title={loadBalancer.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setAssociateFipOpen(true)}
            >
              <IconLinkPlus size={12} stroke={1.5} /> Associate floating IP
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconUnlink size={12} stroke={1.5} /> Disassociate floating IP
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconCirclePlus size={12} stroke={1.5} /> Create listener
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setEditLbOpen(true)}
            >
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
        <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Load balancer name" value={loadBalancer.name} />
                  <SectionCard.DataRow label="Description" value={loadBalancer.description} />
                  <SectionCard.DataRow label="Admin state" value={loadBalancer.adminState} />
                  <SectionCard.DataRow label="Provider" value={loadBalancer.provider} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Network" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="VIP Address" value={loadBalancer.vipAddress} />
                  <SectionCard.DataRow label="Owned network">
                    {loadBalancer.ownedNetwork && loadBalancer.ownedNetwork.id ? (
                      <Link
                        to={`/compute/networks/${loadBalancer.ownedNetwork.id}`}
                        className={linkClass}
                      >
                        {loadBalancer.ownedNetwork.name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Subnet">
                    {loadBalancer.subnet && loadBalancer.subnet.id ? (
                      <Link to={`/compute/subnets/${loadBalancer.subnet.id}`} className={linkClass}>
                        {loadBalancer.subnet.name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Floating IP">
                    {loadBalancer.floatingIp && loadBalancer.floatingIp.id ? (
                      <Link
                        to={`/compute/floating-ips/${loadBalancer.floatingIp.id}`}
                        className={linkClass}
                      >
                        {loadBalancer.floatingIp.name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="listeners" label="Listeners">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-16 font-semibold text-text m-0">Listener</h3>
                <Button variant="secondary" appearance="outline" size="sm">
                  <IconCirclePlus size={12} stroke={1.5} /> Create listener
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <input
                    type="search"
                    value={listenerSearchTerm}
                    onChange={(e) => {
                      setListenerSearchTerm(e.target.value);
                      setListenerCurrentPage(1);
                    }}
                    placeholder="Search listener by attributes"
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
                  disabled={selectedListeners.length === 0}
                >
                  <IconTrash size={12} stroke={1.5} /> Delete
                </Button>
              </div>
              <Pagination
                totalCount={filteredListeners.length}
                size={listenersPerPage}
                currentAt={listenerCurrentPage}
                onPageChange={setListenerCurrentPage}
                totalCountLabel="items"
                selectedCount={selectedListeners.length}
                onSettingClick={() => {}}
              />
              <SelectableTable<Listener>
                columns={listenerColumns}
                rows={paginatedListeners}
                selectionType="checkbox"
                selectedRows={selectedListeners}
                onRowSelectionChange={setSelectedListeners}
                getRowId={(row) => row.id}
                sort={sort}
                order={order}
                onSortChange={handleSort}
                stickyLastColumn
              >
                {paginatedListeners.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={listenerColumns[0]}>
                      <StatusIndicator variant={listenerStatusMap[row.status]} layout="iconOnly" />
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute/listeners/${row.id}`} className={linkClass}>
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[2]}>
                      {row.protocol}
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[3]}>
                      {row.port}
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[4]}>
                      {row.connectionLimit}
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[5]}>
                      <Badge
                        theme={row.adminState === 'Up' ? 'gre' : 'gry'}
                        size="sm"
                        type="subtle"
                      >
                        {row.adminState}
                      </Badge>
                    </Table.Td>
                    <Table.Td rowData={row} column={listenerColumns[6]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <ListenerMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item
                          action={() => {
                            setActiveListener(row);
                            setEditListenerOpen(true);
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
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditLoadBalancerDrawer
        isOpen={editLbOpen}
        onClose={() => setEditLbOpen(false)}
        loadBalancerId={id}
        initialData={{ name: loadBalancer.name, description: '', adminUp: true }}
      />
      <AssociateFloatingIPToLBDrawer
        isOpen={associateFipOpen}
        onClose={() => setAssociateFipOpen(false)}
        loadBalancerName={loadBalancer.name}
        vipAddress={loadBalancer.vipAddress}
      />
      <EditListenerDrawer
        isOpen={editListenerOpen}
        onClose={() => {
          setEditListenerOpen(false);
          setActiveListener(null);
        }}
        listenerId={activeListener?.id}
        initialData={
          activeListener
            ? {
                name: activeListener.name,
                description: '',
                protocol: activeListener.protocol,
                port: activeListener.port,
                connectionLimit: '-1',
                adminUp: true,
              }
            : undefined
        }
      />
      <ChangeServerCertificateDrawer
        isOpen={changeServerCertOpen}
        onClose={() => {
          setChangeServerCertOpen(false);
          setActiveListener(null);
        }}
        listenerName={activeListener?.name}
      />
      <ChangeCACertificateDrawer
        isOpen={changeCaCertOpen}
        onClose={() => {
          setChangeCaCertOpen(false);
          setActiveListener(null);
        }}
        listenerName={activeListener?.name}
      />
      <AddL7PolicyDrawer
        isOpen={addL7PolicyOpen}
        onClose={() => {
          setAddL7PolicyOpen(false);
          setActiveListener(null);
        }}
      />
      <AddL7RuleDrawer
        isOpen={addL7RuleOpen}
        onClose={() => {
          setAddL7RuleOpen(false);
          setActiveListener(null);
        }}
      />
      <EditPoolDrawer
        isOpen={editPoolOpen}
        onClose={() => {
          setEditPoolOpen(false);
          setActivePool(null);
        }}
        poolId={activePool?.id}
        initialData={
          activePool
            ? {
                name: activePool.name,
                description: '',
                algorithm: activePool.algorithm,
                sessionPersistence: 'None',
                adminUp: true,
              }
            : undefined
        }
      />
      <ManageMembersDrawer
        isOpen={manageMembersOpen}
        onClose={() => {
          setManageMembersOpen(false);
          setActivePool(null);
        }}
        poolName={activePool?.name}
      />
      <CreateHealthMonitorDrawer
        isOpen={createHealthMonOpen}
        onClose={() => {
          setCreateHealthMonOpen(false);
          setActivePool(null);
        }}
      />
      <EditMemberDrawer
        isOpen={editMemberOpen}
        onClose={() => {
          setEditMemberOpen(false);
          setActivePool(null);
        }}
        memberId={activePool ? `${activePool.id}-mb-1` : undefined}
        initialData={{ name: 'member-01', weight: 1, adminUp: true }}
      />
      <ManageSNICertificateDrawer
        isOpen={!!sniListener}
        onClose={() => setSniListener(null)}
        listenerName={sniListener?.name ?? ''}
      />
    </div>
  );
}
