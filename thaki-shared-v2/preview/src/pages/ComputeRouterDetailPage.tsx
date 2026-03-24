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

interface RouterDetail {
  name: string;
  status: 'active' | 'error' | 'pending';
  externalGateway: string;
  adminState: string;
  createdAt: string;
  interfaces: { id: string; name: string; network: string; ip: string; status: string }[];
}

const mockRouters: Record<string, RouterDetail> = {
  'rtr-001': {
    name: 'edge-router-01',
    status: 'active',
    externalGateway: 'ext-gw-pool / 203.0.113.10',
    adminState: 'UP',
    createdAt: 'Aug 2, 2025 11:04:22',
    interfaces: [
      {
        id: 'if-1',
        name: 'interface-1',
        network: 'prod-vpc-main',
        ip: '10.0.0.1',
        status: 'ACTIVE',
      },
      { id: 'if-2', name: 'interface-2', network: 'dmz-net', ip: '192.168.50.1', status: 'ACTIVE' },
    ],
  },
  'rtr-002': {
    name: 'tenant-router',
    status: 'active',
    externalGateway: '—',
    adminState: 'UP',
    createdAt: 'Jul 18, 2025 08:15:09',
    interfaces: [
      {
        id: 'if-3',
        name: 'interface-1',
        network: 'staging-net',
        ip: '10.20.0.1',
        status: 'ACTIVE',
      },
    ],
  },
};

const defaultDetail: RouterDetail = {
  name: 'Unknown router',
  status: 'pending',
  externalGateway: '-',
  adminState: '-',
  createdAt: '-',
  interfaces: [],
};

const statusVariant: Record<RouterDetail['status'], StatusVariant> = {
  active: 'active',
  error: 'error',
  pending: 'pending',
};

export function ComputeRouterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const data =
    id && mockRouters[id]
      ? mockRouters[id]
      : { ...defaultDetail, name: id ? `Router ${id}` : defaultDetail.name };

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: data.status === 'active' ? 'Active' : data.status === 'error' ? 'Error' : 'Pending',
      accessory: <StatusIndicator variant={statusVariant[data.status]} layout="iconOnly" />,
    },
    { label: 'External gateway', value: data.externalGateway },
    { label: 'Admin state', value: data.adminState },
    { label: 'Created at', value: data.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Router ID', value: id ?? '-' },
    { label: 'Name', value: data.name },
    { label: 'Distributed', value: 'No' },
    { label: 'HA', value: 'Yes' },
  ];

  const ifColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'network', header: 'Network' },
    { key: 'ip', header: 'IP' },
    { key: 'status', header: 'Status' },
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
        <ContextMenu.Item action={() => console.log('Clear gateway', id)}>
          Clear gateway
        </ContextMenu.Item>
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
        <Tab id="interfaces" label="Interfaces">
          <div className="flex flex-col gap-4">
            <h3 className="text-14 font-semibold text-text m-0">Interfaces</h3>
            <Table columns={ifColumns} rows={data.interfaces}>
              {data.interfaces.map((row) => (
                <Table.Tr key={row.id} rowData={row}>
                  <Table.Td rowData={row} column={ifColumns[0]}>
                    {row.name}
                  </Table.Td>
                  <Table.Td rowData={row} column={ifColumns[1]}>
                    {row.network}
                  </Table.Td>
                  <Table.Td rowData={row} column={ifColumns[2]}>
                    {row.ip}
                  </Table.Td>
                  <Table.Td rowData={row} column={ifColumns[3]}>
                    {row.status}
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
