import { useParams, useSearchParams } from 'react-router-dom';
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
  ];

  const poolColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'algorithm', header: 'Algorithm' },
    { key: 'protocol', header: 'Protocol' },
    { key: 'members', header: 'Members' },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm">
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
    </div>
  );
}
