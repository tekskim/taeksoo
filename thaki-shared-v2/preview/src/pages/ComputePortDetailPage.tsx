import { useParams, useSearchParams } from 'react-router-dom';
import { DetailPageHeader } from '@shared/components/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader';
import { DetailCard } from '@shared/components/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';

interface PortDetail {
  name: string;
  status: 'active' | 'error' | 'pending';
  network: string;
  fixedIps: string;
  macAddress: string;
  deviceOwner: string;
  createdAt: string;
}

const mockPorts: Record<string, PortDetail> = {
  'port-001': {
    name: 'instance-01-eth0',
    status: 'active',
    network: 'prod-vpc-main',
    fixedIps: '10.0.1.24',
    macAddress: 'fa:16:3e:4a:2b:c1',
    deviceOwner: 'compute:instance-7f3a',
    createdAt: 'Sep 12, 2025 09:23:41',
  },
  'port-002': {
    name: 'lb-vip-port',
    status: 'active',
    network: 'shared-services',
    fixedIps: '10.0.10.5, 10.0.10.6',
    macAddress: 'fa:16:3e:88:aa:01',
    deviceOwner: 'network:floatingip',
    createdAt: 'Sep 11, 2025 14:07:22',
  },
};

const defaultDetail: PortDetail = {
  name: 'Unknown port',
  status: 'pending',
  network: '-',
  fixedIps: '-',
  macAddress: '-',
  deviceOwner: '-',
  createdAt: '-',
};

const statusVariant: Record<PortDetail['status'], StatusVariant> = {
  active: 'active',
  error: 'error',
  pending: 'pending',
};

export function ComputePortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const data =
    id && mockPorts[id]
      ? mockPorts[id]
      : { ...defaultDetail, name: id ? `Port ${id}` : defaultDetail.name };

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: data.status === 'active' ? 'Active' : data.status === 'error' ? 'Error' : 'Pending',
      accessory: <StatusIndicator variant={statusVariant[data.status]} layout="iconOnly" />,
    },
    { label: 'Network', value: data.network },
    { label: 'Fixed IPs', value: data.fixedIps },
    { label: 'MAC address', value: data.macAddress },
    { label: 'Device owner', value: data.deviceOwner },
    { label: 'Created at', value: data.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Port ID', value: id ?? '-' },
    { label: 'Name', value: data.name },
    { label: 'Binding: VNIC type', value: 'normal' },
    { label: 'Binding: host ID', value: 'hv-04' },
    { label: 'Security groups', value: 'default, web-tier' },
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
        <ContextMenu.Item action={() => console.log('Detach', id)}>
          Detach interface
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
          <DetailCard title="Port information" fields={detailFields} />
        </Tab>
      </Tabs>
    </div>
  );
}
