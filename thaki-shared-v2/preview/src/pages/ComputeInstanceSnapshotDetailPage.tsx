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

type SnapshotStatus = 'active' | 'queued' | 'saving' | 'error';

interface InstanceSnapshotDetail {
  id: string;
  name: string;
  status: SnapshotStatus;
  size: string;
  diskFormat: string;
  createdAt: string;
  instanceId: string;
  instanceName: string;
}

const baseSnap: InstanceSnapshotDetail = {
  id: 'isnap-001',
  name: 'prod-web-20250310',
  status: 'active',
  size: '40 GiB',
  diskFormat: 'QCOW2',
  createdAt: 'Mar 10, 2025 07:15:30',
  instanceId: 'vm-001',
  instanceName: 'worker-node-01',
};

const mockMap: Record<string, InstanceSnapshotDetail> = {
  'isnap-001': baseSnap,
  'isnap-002': {
    id: 'isnap-002',
    name: 'db-primary-backup',
    status: 'saving',
    size: '200 GiB',
    diskFormat: 'RAW',
    createdAt: 'Mar 9, 2025 22:40:11',
    instanceId: 'vm-004',
    instanceName: 'db-server-01',
  },
  'snap-001': { ...baseSnap, id: 'snap-001' },
};

const defaultDetail: InstanceSnapshotDetail = {
  id: '-',
  name: 'Unknown snapshot',
  status: 'error',
  size: '-',
  diskFormat: '-',
  createdAt: '-',
  instanceId: '-',
  instanceName: '-',
};

function snapshotStatusVariant(s: SnapshotStatus): StatusVariant {
  if (s === 'active') return 'active';
  if (s === 'queued' || s === 'saving') return 'building';
  return 'error';
}

const statusLabel: Record<SnapshotStatus, string> = {
  active: 'Active',
  queued: 'Queued',
  saving: 'Saving',
  error: 'Error',
};

export function ComputeInstanceSnapshotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const s = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: s.name },
    {
      label: 'Status',
      value: statusLabel[s.status],
      accessory: <StatusIndicator variant={snapshotStatusVariant(s.status)} layout="iconOnly" />,
    },
    { label: 'Size', value: s.size },
    { label: 'Disk format', value: s.diskFormat },
    { label: 'Created at', value: s.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Snapshot name', value: s.name },
    { label: 'Snapshot ID', value: s.id },
    { label: 'Status', value: statusLabel[s.status] },
    { label: 'Size', value: s.size },
    { label: 'Disk format', value: s.diskFormat },
    { label: 'Source instance', value: `${s.instanceName} (${s.instanceId})` },
    { label: 'Created at', value: s.createdAt },
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
      <DetailPageHeader title={s.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <DetailCard title="Basic information" fields={detailFields} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
