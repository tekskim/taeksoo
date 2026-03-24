import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { EditNetworkDrawer } from '../drawers/compute/network/EditNetworkDrawer';
import { CreateSubnetDrawer } from '../drawers/compute/network/CreateSubnetDrawer';
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

interface NetworkDetail {
  name: string;
  status: 'active' | 'error' | 'pending';
  shared: boolean;
  external: boolean;
  adminState: string;
  createdAt: string;
  subnets: { id: string; name: string; cidr: string; gateway: string }[];
  ports: { id: string; name: string; fixedIps: string; status: string }[];
}

const mockNetworks: Record<string, NetworkDetail> = {
  'net-001': {
    name: 'prod-vpc-main',
    status: 'active',
    shared: false,
    external: false,
    adminState: 'UP',
    createdAt: 'Sep 12, 2025 09:23:41',
    subnets: [
      { id: 'sn-1', name: 'subnet-a', cidr: '10.0.1.0/24', gateway: '10.0.1.1' },
      { id: 'sn-2', name: 'subnet-b', cidr: '10.0.2.0/24', gateway: '10.0.2.1' },
    ],
    ports: [
      { id: 'p-1', name: 'port-web-01', fixedIps: '10.0.1.12', status: 'ACTIVE' },
      { id: 'p-2', name: 'port-db-01', fixedIps: '10.0.2.8', status: 'ACTIVE' },
    ],
  },
  'net-002': {
    name: 'shared-services',
    status: 'active',
    shared: true,
    external: false,
    adminState: 'UP',
    createdAt: 'Sep 11, 2025 14:07:22',
    subnets: [{ id: 'sn-3', name: 'svc-subnet', cidr: '172.16.0.0/20', gateway: '172.16.0.1' }],
    ports: [{ id: 'p-3', name: 'port-lb', fixedIps: '172.16.0.10', status: 'ACTIVE' }],
  },
};

const defaultDetail: NetworkDetail = {
  name: 'Unknown network',
  status: 'pending',
  shared: false,
  external: false,
  adminState: '-',
  createdAt: '-',
  subnets: [],
  ports: [],
};

const statusVariant: Record<NetworkDetail['status'], StatusVariant> = {
  active: 'active',
  error: 'error',
  pending: 'pending',
};

export function ComputeNetworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editNetworkOpen, setEditNetworkOpen] = useState(false);
  const [createSubnetOpen, setCreateSubnetOpen] = useState(false);
  const activeTab = searchParams.get('tab') || 'details';

  const data =
    id && mockNetworks[id]
      ? mockNetworks[id]
      : { ...defaultDetail, name: id ? `Network ${id}` : defaultDetail.name };

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: data.status === 'active' ? 'Active' : data.status === 'error' ? 'Error' : 'Pending',
      accessory: <StatusIndicator variant={statusVariant[data.status]} layout="iconOnly" />,
    },
    { label: 'Shared', value: data.shared ? 'Yes' : 'No' },
    { label: 'External', value: data.external ? 'Yes' : 'No' },
    { label: 'Admin state', value: data.adminState },
    { label: 'Created at', value: data.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Network ID', value: id ?? '-' },
    { label: 'Name', value: data.name },
    { label: 'MTU', value: '1500' },
    { label: 'Port security', value: 'Enabled' },
  ];

  const subnetColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'cidr', header: 'CIDR' },
    { key: 'gateway', header: 'Gateway' },
  ];

  const portColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'fixedIps', header: 'Fixed IPs' },
    { key: 'status', header: 'Status' },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        appearance="outline"
        size="sm"
        onClick={() => setEditNetworkOpen(true)}
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
        <ContextMenu.Item action={() => setCreateSubnetOpen(true)}>Create subnet</ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Duplicate', id)}>Duplicate</ContextMenu.Item>
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
          <div className="flex flex-col gap-6">
            <DetailCard title="Overview" fields={detailFields} />
            <div className="flex flex-col gap-4">
              <h3 className="text-14 font-semibold text-text m-0">Subnets</h3>
              <Table columns={subnetColumns} rows={data.subnets}>
                {data.subnets.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={subnetColumns[0]}>
                      {row.name}
                    </Table.Td>
                    <Table.Td rowData={row} column={subnetColumns[1]}>
                      {row.cidr}
                    </Table.Td>
                    <Table.Td rowData={row} column={subnetColumns[2]}>
                      {row.gateway}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-14 font-semibold text-text m-0">Ports</h3>
              <Table columns={portColumns} rows={data.ports}>
                {data.ports.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={portColumns[0]}>
                      {row.name}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[1]}>
                      {row.fixedIps}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[2]}>
                      {row.status}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </div>
        </Tab>
        <Tab id="subnets" label="Subnets">
          <div className="flex flex-col gap-3">
            <h3 className="text-14 font-semibold text-text m-0">Subnets</h3>
            <ul className="m-0 pl-5 text-12 text-text flex flex-col gap-2">
              {data.subnets.map((s) => (
                <li key={s.id}>
                  <span className="font-medium">{s.name}</span>
                  <span className="text-text-muted">
                    {' '}
                    — {s.cidr} (gateway {s.gateway})
                  </span>
                </li>
              ))}
              {data.subnets.length === 0 && <li className="text-text-muted">No subnets.</li>}
            </ul>
          </div>
        </Tab>
      </Tabs>

      <EditNetworkDrawer
        isOpen={editNetworkOpen}
        onClose={() => setEditNetworkOpen(false)}
        networkId={id}
        initialData={{
          name: data.name,
          shared: data.shared,
          adminStateUp: data.adminState === 'UP',
        }}
      />
      <CreateSubnetDrawer
        isOpen={createSubnetOpen}
        onClose={() => setCreateSubnetOpen(false)}
        networkName={data.name}
      />
    </div>
  );
}
