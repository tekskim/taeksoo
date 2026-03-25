import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { EditVolumeSnapshotDrawer } from '../drawers/compute/volume/EditVolumeSnapshotDrawer';
import { Tabs, Tab } from '@shared/components/Tabs';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconCirclePlus, IconTrash, IconEdit, IconSettings } from '@tabler/icons-react';

type SnapshotStatus = 'available' | 'creating' | 'error' | 'deleting';

interface VolumeSnapshotDetail {
  id: string;
  name: string;
  status: SnapshotStatus;
  size: string;
  createdAt: string;
  description: string;
  sourceVolume: string;
  sourceVolumeId: string;
  tenant: string;
}

const mockSnapshotDetails: Record<string, VolumeSnapshotDetail> = {
  'vsnap-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'db-data-snap',
    status: 'available',
    size: '1500 GiB',
    createdAt: 'Jul 25, 2025 10:32:16',
    description: '-',
    sourceVolume: 'web-server-10',
    sourceVolumeId: 'vol-001',
    tenant: 'admin',
  },
  'vsnap-002': {
    id: '8395d0285f92542f04171b0ccd3deafe',
    name: 'app-storage-snap',
    status: 'available',
    size: '500 GiB',
    createdAt: 'Sep 10, 2025 01:17:01',
    description: 'Application storage snapshot',
    sourceVolume: 'app-volume-1',
    sourceVolumeId: 'vol-002',
    tenant: 'demo-project',
  },
  'vsnap-003': {
    id: '9406e1396g03653g15282c1dde4efbfg',
    name: 'backup-vol-snap',
    status: 'available',
    size: '2000 GiB',
    createdAt: 'Sep 8, 2025 16:55:10',
    description: 'Backup volume snapshot',
    sourceVolume: 'backup-storage',
    sourceVolumeId: 'vol-003',
    tenant: 'engineering',
  },
};

const defaultSnapshot: VolumeSnapshotDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'vol-snap-1',
  status: 'available',
  size: '1500 GiB',
  createdAt: 'Jul 25, 2025 10:32:16',
  description: '-',
  sourceVolume: 'web-server-10',
  sourceVolumeId: 'vol-001',
  tenant: 'admin',
};

const statusDisplayMap: Record<SnapshotStatus, string> = {
  available: 'Available',
  creating: 'Creating',
  error: 'Error',
  deleting: 'Deleting',
};

function snapStatusVariant(s: SnapshotStatus): StatusVariant {
  if (s === 'available') return 'active';
  if (s === 'creating') return 'building';
  if (s === 'error') return 'error';
  return 'pending';
}

const tenantLinkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeAdminVolumeSnapshotDetailPage() {
  const [editOpen, setEditOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const snapshot = useMemo(
    () => (id && mockSnapshotDetails[id] ? mockSnapshotDetails[id] : defaultSnapshot),
    [id]
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: statusDisplayMap[snapshot.status],
      accessory: <StatusIndicator variant={snapStatusVariant(snapshot.status)} layout="iconOnly" />,
    },
    { label: 'ID', value: snapshot.id, showCopyButton: true, copyText: snapshot.id },
    {
      label: 'Tenant',
      value: (
        <Link to={`/compute-admin/tenants/${snapshot.tenant}`} className={tenantLinkClass}>
          {snapshot.tenant}
        </Link>
      ),
    },
    { label: 'Size', value: snapshot.size },
    { label: 'Created at', value: snapshot.createdAt },
  ];

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={snapshot.name}
        actions={
          <div className="flex flex-wrap gap-1">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconCirclePlus size={12} stroke={1.5} /> Create volume
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconSettings size={12} stroke={1.5} /> Manage metadata
            </Button>
            <Button
              variant="secondary"
              appearance="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
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
                  <SectionCard.DataRow label="Tenant">
                    <Link
                      to={`/compute-admin/tenants/${snapshot.tenant}`}
                      className={tenantLinkClass}
                    >
                      {snapshot.tenant}
                    </Link>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Volume name" value={snapshot.name} />
                  <SectionCard.DataRow label="Description" value={snapshot.description} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Source" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Volume">
                    <Link
                      to={`/compute-admin/volumes/${snapshot.sourceVolumeId}`}
                      className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
                    >
                      {snapshot.sourceVolume}
                    </Link>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Specifications" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Size" value={snapshot.size} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Metadata" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="{metadata}" value="{value}" />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditVolumeSnapshotDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        snapshotId={snapshot.id}
        initialData={{ name: snapshot.name, description: snapshot.description }}
      />
    </div>
  );
}
