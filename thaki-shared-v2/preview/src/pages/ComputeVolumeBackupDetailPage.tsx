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

type BackupStatus = 'available' | 'error' | 'restoring';

interface VolumeBackupDetail {
  id: string;
  name: string;
  status: BackupStatus;
  volume: string;
  volumeId: string;
  size: string;
  backupMode: string;
  createdAt: string;
  container: string;
}

const mockMap: Record<string, VolumeBackupDetail> = {
  'vb-001': {
    id: 'vb-001',
    name: 'vol-backup-daily',
    status: 'available',
    volume: 'boot-vol-prod-01',
    volumeId: 'vol-001',
    size: '80 GiB',
    backupMode: 'Full',
    createdAt: 'Sep 12, 2025 09:23:41',
    container: 'backup-daily-pool',
  },
  'vb-002': {
    id: 'vb-002',
    name: 'db-snapshot-weekly',
    status: 'available',
    volume: 'postgres-data-1',
    volumeId: 'vol-002',
    size: '512 GiB',
    backupMode: 'Incremental',
    createdAt: 'Sep 11, 2025 14:07:22',
    container: 'backup-weekly-pool',
  },
};

const defaultDetail: VolumeBackupDetail = {
  id: '-',
  name: 'Unknown backup',
  status: 'error',
  volume: '-',
  volumeId: '-',
  size: '-',
  backupMode: '-',
  createdAt: '-',
  container: '-',
};

function backupStatusVariant(s: BackupStatus): StatusVariant {
  if (s === 'available') return 'active';
  if (s === 'restoring') return 'building';
  return 'error';
}

const statusLabel: Record<BackupStatus, string> = {
  available: 'Available',
  error: 'Error',
  restoring: 'Restoring',
};

export function ComputeVolumeBackupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const b = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: b.name },
    {
      label: 'Status',
      value: statusLabel[b.status],
      accessory: <StatusIndicator variant={backupStatusVariant(b.status)} layout="iconOnly" />,
    },
    {
      label: 'Volume',
      value:
        b.volumeId !== '-' ? (
          <Link
            to={`/compute/volumes/${b.volumeId}`}
            className="text-primary font-medium hover:underline"
          >
            {b.volume}
          </Link>
        ) : (
          b.volume
        ),
    },
    { label: 'Size', value: b.size },
    { label: 'Backup mode', value: b.backupMode },
    { label: 'Created at', value: b.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Backup ID', value: b.id },
    { label: 'Name', value: b.name },
    { label: 'Status', value: statusLabel[b.status] },
    { label: 'Source volume', value: b.volume },
    { label: 'Size', value: b.size },
    { label: 'Backup mode', value: b.backupMode },
    { label: 'Container', value: b.container },
    { label: 'Created at', value: b.createdAt },
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
      <DetailPageHeader title={b.name} actions={actions} infoFields={infoFields} />

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
