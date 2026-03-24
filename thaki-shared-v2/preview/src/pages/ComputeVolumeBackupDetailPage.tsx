import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconCirclePlus, IconTrash, IconEdit, IconRestore } from '@tabler/icons-react';

type BackupStatus = 'available' | 'creating' | 'restoring' | 'error' | 'deleting';
type BackupMode = 'Full Backup' | 'Incremental' | string;

interface VolumeBackupDetail {
  id: string;
  name: string;
  status: BackupStatus;
  size: string;
  createdAt: string;
  description: string;
  sourceVolume: string;
  sourceVolumeId: string;
  backupMode: BackupMode;
  container: string;
  availabilityZone: string;
}

const mockBackupDetails: Record<string, VolumeBackupDetail> = {
  'vbak-001': {
    id: 'vbak-001',
    name: 'db-data-backup',
    status: 'available',
    size: '1500GiB',
    createdAt: 'Sep 12, 2025 15:43:35',
    description: 'Database data backup',
    sourceVolume: 'vol-1',
    sourceVolumeId: 'vol-001',
    backupMode: 'Full Backup',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-002': {
    id: 'vbak-002',
    name: 'app-storage-backup',
    status: 'available',
    size: '500GiB',
    createdAt: 'Sep 10, 2025 01:17:01',
    description: 'Application storage backup',
    sourceVolume: 'vol-2',
    sourceVolumeId: 'vol-002',
    backupMode: 'Incremental',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-003': {
    id: 'vbak-003',
    name: 'backup-vol-backup',
    status: 'available',
    size: '2000GiB',
    createdAt: 'Sep 8, 2025 11:51:27',
    description: 'Backup volume snapshot',
    sourceVolume: 'vol-3',
    sourceVolumeId: 'vol-003',
    backupMode: 'Full Backup',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-004': {
    id: 'vbak-004',
    name: 'log-storage-backup',
    status: 'creating',
    size: '100GiB',
    createdAt: 'Sep 5, 2025 14:12:36',
    description: 'Log storage backup',
    sourceVolume: 'vol-4',
    sourceVolumeId: 'vol-004',
    backupMode: 'Incremental',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-005': {
    id: 'vbak-005',
    name: 'cache-vol-backup',
    status: 'available',
    size: '256GiB',
    createdAt: 'Aug 30, 2025 21:37:41',
    description: 'Cache volume backup',
    sourceVolume: 'vol-5',
    sourceVolumeId: 'vol-005',
    backupMode: 'Full Backup',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-006': {
    id: 'vbak-006',
    name: 'media-storage-backup',
    status: 'restoring',
    size: '5000GiB',
    createdAt: 'Aug 25, 2025 10:32:16',
    description: 'Media storage backup',
    sourceVolume: 'vol-6',
    sourceVolumeId: 'vol-006',
    backupMode: 'Full Backup',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-007': {
    id: 'vbak-007',
    name: 'temp-vol-backup',
    status: 'error',
    size: '50GiB',
    createdAt: 'Aug 20, 2025 23:27:51',
    description: 'Temporary volume backup',
    sourceVolume: 'vol-7',
    sourceVolumeId: 'vol-007',
    backupMode: 'Incremental',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-008': {
    id: 'vbak-008',
    name: 'ml-data-backup',
    status: 'available',
    size: '1000GiB',
    createdAt: 'Aug 15, 2025 12:22:26',
    description: 'ML data backup',
    sourceVolume: 'vol-8',
    sourceVolumeId: 'vol-008',
    backupMode: 'Full Backup',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-009': {
    id: 'vbak-009',
    name: 'archive-vol-backup',
    status: 'available',
    size: '10000GiB',
    createdAt: 'Aug 10, 2025 01:17:01',
    description: 'Archive volume backup',
    sourceVolume: 'vol-9',
    sourceVolumeId: 'vol-009',
    backupMode: 'Full Backup',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-010': {
    id: 'vbak-010',
    name: 'boot-vol-backup',
    status: 'deleting',
    size: '100GiB',
    createdAt: 'Aug 5, 2025 14:12:36',
    description: 'Boot volume backup',
    sourceVolume: 'vol-10',
    sourceVolumeId: 'vol-010',
    backupMode: 'Incremental',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
};

const defaultBackup: VolumeBackupDetail = {
  id: 'unknown',
  name: 'Unknown Backup',
  status: 'available',
  size: '0 GiB',
  createdAt: '-',
  description: '-',
  sourceVolume: '-',
  sourceVolumeId: '-',
  backupMode: '-',
  container: '-',
  availabilityZone: '-',
};

const statusDisplayMap: Record<BackupStatus, string> = {
  available: 'Available',
  creating: 'Creating',
  restoring: 'Restoring',
  error: 'Error',
  deleting: 'Deleting',
};

function backupStatusVariant(s: BackupStatus): StatusVariant {
  if (s === 'available') return 'active';
  if (s === 'creating' || s === 'restoring') return 'building';
  if (s === 'error') return 'error';
  return 'pending';
}

export function ComputeVolumeBackupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const backup = useMemo(
    () => (id && mockBackupDetails[id] ? mockBackupDetails[id] : defaultBackup),
    [id]
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: statusDisplayMap[backup.status],
      accessory: <StatusIndicator variant={backupStatusVariant(backup.status)} layout="iconOnly" />,
    },
    { label: 'ID', value: backup.id, showCopyButton: true, copyText: backup.id },
    { label: 'Size', value: backup.size },
    { label: 'Created at', value: backup.createdAt },
  ];

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={backup.name}
        actions={
          <div className="flex flex-wrap gap-1">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconCirclePlus size={12} stroke={1.5} /> Create volume
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconRestore size={12} stroke={1.5} /> Restore backup
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Volume backup Name" value={backup.name} />
                  <SectionCard.DataRow label="Description" value={backup.description} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Source" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Volume">
                    <Link
                      to={`/compute/volumes/${backup.sourceVolumeId}`}
                      className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
                    >
                      {backup.sourceVolume}
                    </Link>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Specifications" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Backup mode" value={String(backup.backupMode)} />
                  <SectionCard.DataRow label="Size" value={backup.size} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
