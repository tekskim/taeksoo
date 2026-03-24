import { useState } from 'react';
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
import { EditFloatingIPDrawer } from '../drawers/compute/floating-ip/EditFloatingIPDrawer';
import { AssociateFloatingIPToPortDrawer } from '../drawers/compute/floating-ip/AssociateFloatingIPToPortDrawer';
import { DisassociateFloatingIPDrawer } from '../drawers/compute/floating-ip/DisassociateFloatingIPDrawer';

interface FloatingIPDetail {
  floatingIp: string;
  status: 'active' | 'error' | 'pending';
  fixedIp: string;
  port: string;
  router: string;
  createdAt: string;
}

const mockFloatingIPs: Record<string, FloatingIPDetail> = {
  'fip-001': {
    floatingIp: '203.0.113.45',
    status: 'active',
    fixedIp: '10.0.1.12',
    port: 'port-web-01',
    router: 'edge-router-01',
    createdAt: 'Aug 28, 2025 13:51:06',
  },
  'fip-002': {
    floatingIp: '198.51.100.8',
    status: 'active',
    fixedIp: '172.16.4.20',
    port: 'port-lb-vip',
    router: 'edge-router-01',
    createdAt: 'Aug 20, 2025 10:22:44',
  },
};

const defaultDetail: FloatingIPDetail = {
  floatingIp: '—',
  status: 'pending',
  fixedIp: '-',
  port: '-',
  router: '-',
  createdAt: '-',
};

const statusVariant: Record<FloatingIPDetail['status'], StatusVariant> = {
  active: 'active',
  error: 'error',
  pending: 'pending',
};

export function ComputeFloatingIPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const [editOpen, setEditOpen] = useState(false);
  const [associateOpen, setAssociateOpen] = useState(false);
  const [disassociateOpen, setDisassociateOpen] = useState(false);

  const data =
    id && mockFloatingIPs[id]
      ? mockFloatingIPs[id]
      : { ...defaultDetail, floatingIp: id ? `— (${id})` : defaultDetail.floatingIp };

  const title =
    id && mockFloatingIPs[id]
      ? mockFloatingIPs[id].floatingIp
      : id
        ? `Floating IP ${id}`
        : 'Floating IP';

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: data.status === 'active' ? 'Active' : data.status === 'error' ? 'Error' : 'Pending',
      accessory: <StatusIndicator variant={statusVariant[data.status]} layout="iconOnly" />,
    },
    { label: 'Fixed IP', value: data.fixedIp },
    { label: 'Port', value: data.port },
    { label: 'Router', value: data.router },
    { label: 'Created at', value: data.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Floating IP ID', value: id ?? '-' },
    { label: 'Floating IP address', value: data.floatingIp },
    { label: 'DNS name', value: '-' },
    { label: 'QoS policy', value: '-' },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm" onClick={() => setEditOpen(true)}>
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
        <ContextMenu.Item action={() => setAssociateOpen(true)}>Associate</ContextMenu.Item>
        <ContextMenu.Item action={() => setDisassociateOpen(true)}>Disassociate</ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Delete', id)} danger>
          <IconTrash size={12} stroke={1.5} /> Delete
        </ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <DetailPageHeader title={title} actions={actions} infoFields={infoFields} />

      <Tabs
        activeTabId={activeTab}
        onChange={(t) => setSearchParams({ tab: t }, { replace: true })}
        variant="line"
        size="sm"
        contentClassName="pt-6"
      >
        <Tab id="details" label="Details">
          <DetailCard title="Floating IP" fields={detailFields} />
        </Tab>
      </Tabs>

      <EditFloatingIPDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        floatingIpAddress={data.floatingIp}
      />
      <AssociateFloatingIPToPortDrawer
        isOpen={associateOpen}
        onClose={() => setAssociateOpen(false)}
        floatingIpAddress={data.floatingIp}
      />
      <DisassociateFloatingIPDrawer
        isOpen={disassociateOpen}
        onClose={() => setDisassociateOpen(false)}
        floatingIpAddress={data.floatingIp}
        associatedTo={`${data.port} · ${data.fixedIp}`}
      />
    </div>
  );
}
