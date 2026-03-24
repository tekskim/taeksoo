import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { EditLoadBalancerDrawer } from '../drawers/compute/load-balancer/EditLoadBalancerDrawer';
import { AssociateFloatingIPToLBDrawer } from '../drawers/compute/load-balancer/AssociateFloatingIPToLBDrawer';
import { EditListenerDrawer } from '../drawers/compute/load-balancer/EditListenerDrawer';
import { EditPoolDrawer } from '../drawers/compute/load-balancer/EditPoolDrawer';
import { EditMemberDrawer } from '../drawers/compute/load-balancer/EditMemberDrawer';
import { AddL7PolicyDrawer } from '../drawers/compute/load-balancer/AddL7PolicyDrawer';
import { AddL7RuleDrawer } from '../drawers/compute/load-balancer/AddL7RuleDrawer';
import { ManageMembersDrawer } from '../drawers/compute/load-balancer/ManageMembersDrawer';
import { CreateHealthMonitorDrawer } from '../drawers/compute/load-balancer/CreateHealthMonitorDrawer';
import { ChangeServerCertificateDrawer } from '../drawers/compute/certificate/ChangeServerCertificateDrawer';
import { ChangeCACertificateDrawer } from '../drawers/compute/certificate/ChangeCACertificateDrawer';
import { DetailPageHeader } from '@shared/components/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader';
import { DetailCard } from '@shared/components/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Table } from '@shared/components/Table';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';
import { ManageSNICertificateDrawer } from '../drawers/compute/load-balancer/ManageSNICertificateDrawer';

interface LoadBalancerDetail {
  name: string;
  status: 'active' | 'error' | 'pending';
  vipAddress: string;
  provider: string;
  createdAt: string;
  listeners: { id: string; name: string; protocol: string; port: string; defaultPool: string }[];
  pools: { id: string; name: string; algorithm: string; protocol: string; members: string }[];
}

const mockLoadBalancers: Record<string, LoadBalancerDetail> = {
  'lb-001': {
    name: 'api-public-lb',
    status: 'active',
    vipAddress: '10.0.10.50',
    provider: 'amphora',
    createdAt: 'Jun 12, 2025 15:33:18',
    listeners: [
      {
        id: 'ln-1',
        name: 'listener-https',
        protocol: 'HTTPS',
        port: '443',
        defaultPool: 'pool-api',
      },
      { id: 'ln-2', name: 'listener-http', protocol: 'HTTP', port: '80', defaultPool: 'pool-api' },
    ],
    pools: [
      { id: 'pl-1', name: 'pool-api', algorithm: 'ROUND_ROBIN', protocol: 'HTTP', members: '3' },
      {
        id: 'pl-2',
        name: 'pool-admin',
        algorithm: 'LEAST_CONNECTIONS',
        protocol: 'HTTP',
        members: '2',
      },
    ],
  },
  'lb-002': {
    name: 'internal-svc-lb',
    status: 'active',
    vipAddress: '172.16.8.100',
    provider: 'ovn',
    createdAt: 'May 22, 2025 09:07:41',
    listeners: [
      { id: 'ln-3', name: 'listener-tcp', protocol: 'TCP', port: '6443', defaultPool: 'pool-k8s' },
    ],
    pools: [
      { id: 'pl-3', name: 'pool-k8s', algorithm: 'SOURCE_IP_PORT', protocol: 'TCP', members: '5' },
    ],
  },
};

const defaultDetail: LoadBalancerDetail = {
  name: 'Unknown load balancer',
  status: 'pending',
  vipAddress: '-',
  provider: '-',
  createdAt: '-',
  listeners: [],
  pools: [],
};

const statusVariant: Record<LoadBalancerDetail['status'], StatusVariant> = {
  active: 'active',
  error: 'error',
  pending: 'pending',
};

export function ComputeLoadBalancerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
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
  const [activeListener, setActiveListener] = useState<{
    id: string;
    name: string;
    protocol: string;
    port: string;
  } | null>(null);
  const [activePool, setActivePool] = useState<{
    id: string;
    name: string;
    algorithm: string;
    protocol: string;
  } | null>(null);

  const data =
    id && mockLoadBalancers[id]
      ? mockLoadBalancers[id]
      : { ...defaultDetail, name: id ? `Load balancer ${id}` : defaultDetail.name };

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: data.status === 'active' ? 'Active' : data.status === 'error' ? 'Error' : 'Pending',
      accessory: <StatusIndicator variant={statusVariant[data.status]} layout="iconOnly" />,
    },
    { label: 'VIP address', value: data.vipAddress },
    { label: 'Provider', value: data.provider },
    { label: 'Created at', value: data.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Load balancer ID', value: id ?? '-' },
    { label: 'Name', value: data.name },
    { label: 'Flavor', value: 'medium' },
    { label: 'Availability zone', value: 'az-1' },
  ];

  const listenerColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'protocol', header: 'Protocol' },
    { key: 'port', header: 'Port' },
    { key: 'defaultPool', header: 'Default pool' },
    { key: 'actions', header: 'Actions', width: 60, align: 'center' },
  ];

  const poolColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'algorithm', header: 'Algorithm' },
    { key: 'protocol', header: 'Protocol' },
    { key: 'members', header: 'Members' },
    { key: 'actions', header: 'Actions', width: 60, align: 'center' },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        appearance="outline"
        size="sm"
        onClick={() => setEditLbOpen(true)}
      >
        <IconEdit size={12} stroke={1.5} /> Edit
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
        <ContextMenu.Item action={() => setAssociateFipOpen(true)}>
          Associate floating IP
        </ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Failover', id)}>Failover</ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Delete', id)} danger>
          <IconTrash size={12} stroke={1.5} /> Delete
        </ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={data.name} actions={actions} infoFields={infoFields} />

      <Tabs
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        variant="line"
        size="sm"
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Basic information" fields={detailFields} />
        </Tab>
        <Tab id="listeners" label="Listeners">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text m-0">Listeners</h3>
            <Table columns={listenerColumns} rows={data.listeners}>
              {data.listeners.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={listenerColumns[0]}>
                    {row.name}
                  </Table.Td>
                  <Table.Td rowData={row} column={listenerColumns[1]}>
                    {row.protocol}
                  </Table.Td>
                  <Table.Td rowData={row} column={listenerColumns[2]}>
                    {row.port}
                  </Table.Td>
                  <Table.Td rowData={row} column={listenerColumns[3]}>
                    {row.defaultPool}
                  </Table.Td>
                  <Table.Td rowData={row} column={listenerColumns[4]} preventClickPropagation>
                    <ContextMenu.Root
                      direction="bottom-end"
                      gap={4}
                      trigger={({ toggle }) => (
                        <button
                          type="button"
                          onClick={toggle}
                          className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
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
                          setActiveListener({
                            id: row.id,
                            name: row.name,
                            protocol: row.protocol,
                            port: row.port,
                          });
                          setEditListenerOpen(true);
                        }}
                      >
                        Edit listener
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        action={() => {
                          setActiveListener({
                            id: row.id,
                            name: row.name,
                            protocol: row.protocol,
                            port: row.port,
                          });
                          setChangeServerCertOpen(true);
                        }}
                      >
                        Change server certificate
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        action={() => {
                          setSniListener({ id: row.id, name: row.name });
                        }}
                      >
                        Manage SNI certificates
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        action={() => {
                          setActiveListener({
                            id: row.id,
                            name: row.name,
                            protocol: row.protocol,
                            port: row.port,
                          });
                          setChangeCaCertOpen(true);
                        }}
                      >
                        Change CA certificate
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        action={() => {
                          setActiveListener({
                            id: row.id,
                            name: row.name,
                            protocol: row.protocol,
                            port: row.port,
                          });
                          setAddL7PolicyOpen(true);
                        }}
                      >
                        Add L7 policy
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        action={() => {
                          setActiveListener({
                            id: row.id,
                            name: row.name,
                            protocol: row.protocol,
                            port: row.port,
                          });
                          setAddL7RuleOpen(true);
                        }}
                      >
                        Add L7 rule
                      </ContextMenu.Item>
                    </ContextMenu.Root>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
        <Tab id="pools" label="Pools">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text m-0">Pools</h3>
            <Table columns={poolColumns} rows={data.pools}>
              {data.pools.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={poolColumns[0]}>
                    {row.name}
                  </Table.Td>
                  <Table.Td rowData={row} column={poolColumns[1]}>
                    {row.algorithm}
                  </Table.Td>
                  <Table.Td rowData={row} column={poolColumns[2]}>
                    {row.protocol}
                  </Table.Td>
                  <Table.Td rowData={row} column={poolColumns[3]}>
                    {row.members}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table>
          </div>
        </Tab>
      </Tabs>

      <EditLoadBalancerDrawer
        isOpen={editLbOpen}
        onClose={() => setEditLbOpen(false)}
        loadBalancerId={id}
        initialData={{ name: data.name, description: '', adminUp: true }}
      />
      <AssociateFloatingIPToLBDrawer
        isOpen={associateFipOpen}
        onClose={() => setAssociateFipOpen(false)}
        loadBalancerName={data.name}
        vipAddress={data.vipAddress}
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
