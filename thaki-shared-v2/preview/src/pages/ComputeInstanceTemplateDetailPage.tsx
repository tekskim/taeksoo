import { useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard/DetailCard';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';

type TemplateStatus = 'active' | 'disabled';

interface InstanceTemplateDetail {
  id: string;
  name: string;
  status: TemplateStatus;
  vCpu: string;
  ram: string;
  disk: string;
  image: string;
  keyPair: string;
  createdAt: string;
  availabilityZone: string;
  description: string;
  metadata: string;
}

const mockMap: Record<string, InstanceTemplateDetail> = {
  'tpl-001': {
    id: 'tpl-001',
    name: 'web-standard',
    status: 'active',
    vCpu: '4',
    ram: '8 GiB',
    disk: '80 GiB',
    image: 'Ubuntu 24.04',
    keyPair: 'default-key',
    createdAt: 'Mar 10, 2025 09:12:00',
    availabilityZone: 'keystone',
    description: 'Standard web tier template with balanced CPU and memory.',
    metadata: 'team=web, env=shared',
  },
  'tpl-002': {
    id: 'tpl-002',
    name: 'db-optimized',
    status: 'active',
    vCpu: '8',
    ram: '32 GiB',
    disk: '200 GiB',
    image: 'PostgreSQL 16 (Rocky 9)',
    keyPair: 'db-key',
    createdAt: 'Mar 8, 2025 14:30:22',
    availabilityZone: 'nova',
    description: 'High-memory profile for database workloads.',
    metadata: 'role=database',
  },
};

const defaultDetail: InstanceTemplateDetail = {
  id: '-',
  name: 'Unknown template',
  status: 'disabled',
  vCpu: '-',
  ram: '-',
  disk: '-',
  image: '-',
  keyPair: '-',
  createdAt: '-',
  availabilityZone: '-',
  description: '-',
  metadata: '-',
};

function statusVariant(s: TemplateStatus): StatusVariant {
  return s === 'active' ? 'active' : 'shutoff';
}

export function ComputeInstanceTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const t = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: t.name },
    {
      label: 'Status',
      value: t.status === 'active' ? 'Active' : 'Disabled',
      accessory: <StatusIndicator variant={statusVariant(t.status)} layout="iconOnly" />,
    },
    { label: 'vCPU', value: t.vCpu },
    { label: 'RAM', value: t.ram },
    { label: 'Disk', value: t.disk },
    { label: 'Image', value: t.image },
    { label: 'Key pair', value: t.keyPair },
    { label: 'Created at', value: t.createdAt },
  ];

  const basicFields: DetailCardField[] = [
    { label: 'Template name', value: t.name },
    { label: 'Template ID', value: t.id },
    { label: 'Status', value: t.status === 'active' ? 'Active' : 'Disabled' },
    { label: 'Availability zone', value: t.availabilityZone },
    { label: 'Description', value: t.description },
    { label: 'Created at', value: t.createdAt },
  ];

  const configFields: DetailCardField[] = [
    { label: 'vCPU', value: t.vCpu },
    { label: 'RAM', value: t.ram },
    { label: 'Root disk', value: t.disk },
    { label: 'Image', value: t.image },
    { label: 'Key pair', value: t.keyPair },
    { label: 'Metadata', value: t.metadata },
  ];

  const actions = (
    <ContextMenu.Root
      direction="bottom-end"
      gap={4}
      trigger={({ toggle }) => (
        <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
          Actions <IconChevronDown size={12} stroke={1.5} />
        </Button>
      )}
    >
      <ContextMenu.Item action={() => {}}>
        <span className="inline-flex items-center gap-1">
          <IconEdit size={12} stroke={1.5} /> Edit
        </span>
      </ContextMenu.Item>
      <ContextMenu.Item action={() => {}} danger>
        <span className="inline-flex items-center gap-1">
          <IconTrash size={12} stroke={1.5} /> Delete
        </span>
      </ContextMenu.Item>
    </ContextMenu.Root>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={t.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <DetailCard title="Basic information" fields={basicFields} />
              <DetailCard title="Configuration" fields={configFields} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
