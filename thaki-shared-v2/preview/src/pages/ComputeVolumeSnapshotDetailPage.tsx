import { Link, useParams, useSearchParams } from 'react-router-dom';
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

type VolumeSnapshotStatus = 'available' | 'error';

interface VolumeSnapshotDetail {
  id: string;
  name: string;
  status: VolumeSnapshotStatus;
  volume: string;
  volumeId: string;
  size: string;
  createdAt: string;
  description: string;
}

const mockMap: Record<string, VolumeSnapshotDetail> = {
  'vsnap-001': {
    id: 'vsnap-001',
    name: 'db-primary-daily',
    status: 'available',
    volume: 'db-primary-vol',
    volumeId: 'vol-002',
    size: '500 GiB',
    createdAt: 'Mar 10, 2025 02:00:00',
    description: 'Automated daily snapshot before backup window.',
  },
  'vsnap-002': {
    id: 'vsnap-002',
    name: 'web-data-weekly',
    status: 'available',
    volume: 'web-data-01',
    volumeId: 'vol-001',
    size: '100 GiB',
    createdAt: 'Mar 9, 2025 03:15:30',
    description: 'Weekly retention for web tier data volume.',
  },
};

const defaultDetail: VolumeSnapshotDetail = {
  id: '-',
  name: 'Unknown snapshot',
  status: 'error',
  volume: '-',
  volumeId: '-',
  size: '-',
  createdAt: '-',
  description: '-',
};

function snapStatusVariant(s: VolumeSnapshotStatus): StatusVariant {
  return s === 'available' ? 'active' : 'error';
}

export function ComputeVolumeSnapshotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const s = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: s.name },
    {
      label: 'Status',
      value: s.status === 'available' ? 'Available' : 'Error',
      accessory: <StatusIndicator variant={snapStatusVariant(s.status)} layout="iconOnly" />,
    },
    {
      label: 'Volume',
      value:
        s.volumeId !== '-' ? (
          <Link
            to={`/compute/volumes/${s.volumeId}`}
            className="text-primary font-medium hover:underline"
          >
            {s.volume}
          </Link>
        ) : (
          s.volume
        ),
    },
    { label: 'Size', value: s.size },
    { label: 'Created at', value: s.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Snapshot ID', value: s.id },
    { label: 'Name', value: s.name },
    { label: 'Status', value: s.status === 'available' ? 'Available' : 'Error' },
    { label: 'Source volume', value: s.volume },
    { label: 'Size', value: s.size },
    { label: 'Description', value: s.description },
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
