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

type ImageStatus = 'active' | 'queued' | 'error';
type ImageType = 'image' | 'snapshot';
type Visibility = 'public' | 'private';

interface ImageDetail {
  id: string;
  name: string;
  status: ImageStatus;
  type: ImageType;
  size: string;
  visibility: Visibility;
  minDisk: string;
  minRam: string;
  createdAt: string;
  description: string;
  checksum: string;
}

const mockMap: Record<string, ImageDetail> = {
  'img-001': {
    id: 'img-001',
    name: 'ubuntu-22.04-lts',
    status: 'active',
    type: 'image',
    size: '2.1 GiB',
    visibility: 'public',
    minDisk: '20 GiB',
    minRam: '2 GiB',
    createdAt: 'Mar 1, 2025 10:00:00',
    description: 'Official Ubuntu 22.04 LTS cloud image.',
    checksum: 'sha256:7c4e2a1b…',
  },
  'img-002': {
    id: 'img-002',
    name: 'custom-app-golden',
    status: 'active',
    type: 'snapshot',
    size: '45 GiB',
    visibility: 'private',
    minDisk: '50 GiB',
    minRam: '4 GiB',
    createdAt: 'Feb 26, 2025 15:30:45',
    description: 'Golden image for internal app stack.',
    checksum: 'sha256:9d3f88ee…',
  },
};

const defaultDetail: ImageDetail = {
  id: '-',
  name: 'Unknown image',
  status: 'error',
  type: 'image',
  size: '-',
  visibility: 'private',
  minDisk: '-',
  minRam: '-',
  createdAt: '-',
  description: '-',
  checksum: '-',
};

function imageStatusVariant(s: ImageStatus): StatusVariant {
  if (s === 'active') return 'active';
  if (s === 'queued') return 'building';
  return 'error';
}

const statusLabel: Record<ImageStatus, string> = {
  active: 'Active',
  queued: 'Queued',
  error: 'Error',
};

export function ComputeImageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const img = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: img.name },
    {
      label: 'Status',
      value: statusLabel[img.status],
      accessory: <StatusIndicator variant={imageStatusVariant(img.status)} layout="iconOnly" />,
    },
    { label: 'Type', value: img.type === 'image' ? 'Image' : 'Snapshot' },
    { label: 'Size', value: img.size },
    { label: 'Visibility', value: img.visibility === 'public' ? 'Public' : 'Private' },
    { label: 'Min disk', value: img.minDisk },
    { label: 'Min RAM', value: img.minRam },
    { label: 'Created at', value: img.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Image ID', value: img.id },
    { label: 'Description', value: img.description },
    { label: 'Checksum', value: img.checksum },
    { label: 'Architecture', value: 'x86_64' },
    { label: 'Container format', value: 'bare' },
    { label: 'Disk format', value: 'QCOW2' },
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
      <DetailPageHeader title={img.name} actions={actions} infoFields={infoFields} />

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
