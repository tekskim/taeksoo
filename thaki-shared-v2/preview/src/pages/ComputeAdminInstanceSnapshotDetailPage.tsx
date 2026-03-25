import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { EditInstanceSnapshotDrawer } from '../drawers/compute/image/EditInstanceSnapshotDrawer';
import { Tabs, Tab } from '@shared/components/Tabs';
import { ContextMenu } from '@shared/components/ContextMenu';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconCirclePlus, IconTrash, IconChevronDown, IconExternalLink } from '@tabler/icons-react';

interface SnapshotDetail {
  id: string;
  name: string;
  status: 'active' | 'building' | 'error' | 'pending';
  size: string;
  createdAt: string;
  description: string;
  sourceInstance: string;
  os: string;
  minDisk: string;
  minRam: string;
  diskFormat: string;
  containerFormat: string;
  owner: string;
  visibility: string;
  protected: boolean;
  filename: string;
  checksum: string;
  metadata: Record<string, string>;
}

const mockSnapshotsMap: Record<string, SnapshotDetail> = {
  'snap-001': {
    id: 'snap-001',
    name: 'Ubuntu-22.04-base',
    status: 'active',
    size: '16 GiB',
    createdAt: 'Sep 12, 2025 15:43:35',
    description: 'Base web server snapshot',
    sourceInstance: 'web-server-01',
    os: 'Ubuntu 22.04',
    minDisk: '16 GiB',
    minRam: '-',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    owner: 'TK-project',
    visibility: 'Private',
    protected: false,
    filename: '/v2/images/93c91160-75f8-40e4-899f-372539fb98a6/file',
    checksum: 'ffc34736c70569953d58a15a52b8a3bd',
    metadata: {
      hw_scsi_model: 'virtio-scsi',
      hw_qemu_guest_agent: 'yes',
      os_distro: 'ubuntu',
      hw_disk_bus: 'scsi',
      os_version: '24.04',
      os_require_quiesce: 'yes',
      'owner_specified.openstack.sha256': '-',
      'owner_specified.openstack.md5': '-',
      image_type: 'snapshot',
      'owner_specified.openstack.object': 'images/ubuntu-24.04-server',
      base_image_ref: '1e568eb7-a277-48f0-97d4-e481f2dd1ef4',
      owner_user_name: 'admin',
      owner_project_name: 'test',
      boot_roles: 'reader,member,load-balancer_member,manager',
      hw_machine_type: 'pc',
    },
  },
  'snap-002': {
    id: 'snap-002',
    name: 'CentOS-8-web',
    status: 'active',
    size: '32 GiB',
    createdAt: 'Sep 10, 2025 01:17:01',
    description: 'Database server backup',
    sourceInstance: 'db-server-01',
    os: 'CentOS 8',
    minDisk: '32 GiB',
    minRam: '4 GiB',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    owner: 'TK-project',
    visibility: 'Private',
    protected: false,
    filename: '/v2/images/db-server-snapshot/file',
    checksum: 'abc123def456',
    metadata: {
      os_distro: 'centos',
      os_version: '8',
      image_type: 'snapshot',
    },
  },
  'snap-003': {
    id: 'snap-003',
    name: 'Debian-12-db',
    status: 'active',
    size: '64 GiB',
    createdAt: 'Sep 8, 2025 11:51:27',
    description: 'Application server snapshot',
    sourceInstance: 'app-server-01',
    os: 'Debian 12',
    minDisk: '64 GiB',
    minRam: '8 GiB',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    owner: 'TK-project',
    visibility: 'Private',
    protected: true,
    filename: '/v2/images/app-server-snapshot/file',
    checksum: 'xyz789abc',
    metadata: {
      os_distro: 'debian',
      os_version: '12',
      image_type: 'snapshot',
    },
  },
};

const defaultSnapshotDetail: SnapshotDetail = {
  id: 'snap-default',
  name: 'Unknown Snapshot',
  status: 'active',
  size: '-',
  createdAt: '-',
  description: '-',
  sourceInstance: '-',
  os: '-',
  minDisk: '-',
  minRam: '-',
  diskFormat: '-',
  containerFormat: '-',
  owner: '-',
  visibility: 'Private',
  protected: false,
  filename: '-',
  checksum: '-',
  metadata: {},
};

function snapshotStatusVariant(s: SnapshotDetail['status']): StatusVariant {
  if (s === 'active') return 'active';
  if (s === 'building') return 'building';
  if (s === 'error') return 'error';
  return 'pending';
}

export function ComputeAdminInstanceSnapshotDetailPage() {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const snapshot = useMemo(
    () => (id ? mockSnapshotsMap[id] || defaultSnapshotDetail : defaultSnapshotDetail),
    [id]
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: 'Active',
      accessory: (
        <StatusIndicator variant={snapshotStatusVariant(snapshot.status)} layout="iconOnly" />
      ),
    },
    { label: 'ID', value: snapshot.id, showCopyButton: true, copyText: snapshot.id },
    { label: 'Tenant', value: 'demo-project' },
    { label: 'Size', value: snapshot.size },
    { label: 'Created at', value: snapshot.createdAt },
  ];

  const actions = (
    <div className="flex flex-wrap items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconCirclePlus size={12} stroke={1.5} /> Create instance
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTrash size={12} stroke={1.5} /> Delete
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
        <ContextMenu.Item action={() => console.log('Create volume')}>
          Create volume
        </ContextMenu.Item>
        <ContextMenu.Item action={() => setEditDrawerOpen(true)}>Edit</ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={snapshot.name} actions={actions} infoFields={infoFields} />

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
                  <SectionCard.DataRow label="Snapshot name" value={snapshot.name} />
                  <SectionCard.DataRow label="Description" value={snapshot.description} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Source" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Instance">
                    <Link
                      to="/compute-admin/instances"
                      className="inline-flex items-center gap-1.5 text-12 leading-18 font-medium text-primary hover:underline no-underline"
                    >
                      {snapshot.sourceInstance}
                      <IconExternalLink size={12} className="text-primary shrink-0" />
                    </Link>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Specifications" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Size" value={snapshot.size} />
                  <SectionCard.DataRow label="OS" value={snapshot.os} />
                  <SectionCard.DataRow
                    label="Min disk / Min RAM"
                    value={`${snapshot.minDisk} / ${snapshot.minRam}`}
                  />
                  <SectionCard.DataRow
                    label="Disk format / Container Format"
                    value={`${snapshot.diskFormat} / ${snapshot.containerFormat}`}
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Security" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Owner" value={snapshot.owner} />
                  <SectionCard.DataRow label="Visibility" value={snapshot.visibility} />
                  <SectionCard.DataRow
                    label="Protected"
                    value={snapshot.protected ? 'Enabled' : 'Disabled'}
                  />
                  <SectionCard.DataRow label="Filename">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text truncate">
                        {snapshot.filename}
                      </span>
                      <CopyButton text={snapshot.filename} />
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Checksum">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text truncate">
                        {snapshot.checksum}
                      </span>
                      <CopyButton text={snapshot.checksum} />
                    </div>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="metadata" label="Metadata">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Metadata" />
                <SectionCard.Content>
                  {Object.entries(snapshot.metadata).map(([key, value]) => (
                    <SectionCard.DataRow key={key} label={key} value={value} />
                  ))}
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditInstanceSnapshotDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        snapshotId={snapshot.id}
        initialData={{ name: snapshot.name, description: snapshot.description ?? '' }}
      />
    </div>
  );
}
