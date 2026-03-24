import { useMemo, useSearchParams } from 'react';
import { useParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import { ContextMenu } from '@shared/components/ContextMenu';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { IconCirclePlus, IconTrash, IconEdit, IconChevronDown } from '@tabler/icons-react';

type ImageStatus = 'active' | 'queued' | 'saving' | 'error' | 'deleting';
type AccessType = 'Private' | 'Project' | 'Public';

interface ImageDetail {
  id: string;
  name: string;
  status: ImageStatus;
  access: AccessType;
  createdAt: string;
  usageType: string;
  protected: boolean;
  description: string;
  size: string;
  os: string;
  diskFormat: string;
  containerFormat: string;
  minDisk: string;
  minRam: string;
  owner: string;
  visibility: AccessType;
  filename: string;
  checksum: string;
  qemuGuestAgent: boolean;
  cpuPolicy: string;
  cpuThreadPolicy: string;
  metadata: Record<string, string>;
}

const mockImagesMap: Record<string, ImageDetail> = {
  '29tgj234': {
    id: '29tgj234',
    name: 'Ubuntu-22.04-base',
    status: 'active',
    access: 'Private',
    createdAt: 'Sep 12, 2025 15:43:35',
    usageType: 'Common Server',
    protected: true,
    description: 'Base Ubuntu 22.04 image',
    size: '16GiB',
    os: 'Ubuntu24.04',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '10 GiB',
    minRam: '1 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/29tgj234/file',
    checksum: 'abc123',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {
      hw_qemu_guest_agent: 'yes',
      hw_disk_bus: 'scsi',
      'owner_specified.openstack.object': 'images/ubuntu-24.04-server',
      os_version: '24.04',
      'owner_specified.openstack.md5': '-',
      os_require_quiesce: 'yes',
      'owner_specified.openstack.sha256': '-',
      os_distro: 'ubuntu',
      image_type: 'image',
      hw_scsi_model: 'virtio-scsi',
      base_image_ref: '1e568eb7-a277-48f0-97d4-e481f2dd1ef4',
    },
  },
  'img-002': {
    id: 'img-002',
    name: 'CentOS-8-minimal',
    status: 'active',
    access: 'Private',
    createdAt: 'Sep 10, 2025 01:17:01',
    usageType: 'Common Server',
    protected: false,
    description: 'Minimal CentOS 8 installation',
    size: '8GiB',
    os: 'CentOS8',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    minDisk: '10 GiB',
    minRam: '1 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/img-002/file',
    checksum: 'def456',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-003': {
    id: 'img-003',
    name: 'Rocky-Linux-9',
    status: 'active',
    access: 'Shared',
    createdAt: 'Sep 8, 2025 11:51:27',
    usageType: 'Common Server',
    protected: true,
    description: 'Rocky Linux 9 server image',
    size: '12GiB',
    os: 'Rocky Linux 9',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '10 GiB',
    minRam: '1 GiB',
    owner: 'TK-project',
    visibility: 'Shared',
    filename: '/v2/images/img-003/file',
    checksum: 'ghi789',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-004': {
    id: 'img-004',
    name: 'Debian-12-standard',
    status: 'active',
    access: 'Public',
    createdAt: 'Sep 5, 2025 14:12:36',
    usageType: 'Common Server',
    protected: false,
    description: 'Standard Debian 12 image',
    size: '10GiB',
    os: 'Debian 12',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    minDisk: '8 GiB',
    minRam: '512 MiB',
    owner: 'admin',
    visibility: 'Public',
    filename: '/v2/images/img-004/file',
    checksum: 'jkl012',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-005': {
    id: 'img-005',
    name: 'Ubuntu-20.04-LTS',
    status: 'active',
    access: 'Private',
    createdAt: 'Aug 28, 2025 07:11:07',
    usageType: 'Common Server',
    protected: true,
    description: 'Ubuntu 20.04 LTS server',
    size: '14GiB',
    os: 'Ubuntu20.04',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '10 GiB',
    minRam: '1 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/img-005/file',
    checksum: 'mno345',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {
      hw_qemu_guest_agent: 'yes',
      hw_disk_bus: 'scsi',
      os_version: '20.04',
      os_distro: 'ubuntu',
      image_type: 'image',
      hw_scsi_model: 'virtio-scsi',
    },
  },
  'img-006': {
    id: 'img-006',
    name: 'Windows-Server-2022',
    status: 'saving',
    access: 'Shared',
    createdAt: 'Aug 25, 2025 10:32:16',
    usageType: 'Windows Server',
    protected: false,
    description: 'Windows Server 2022 Datacenter',
    size: '32GiB',
    os: 'Windows Server 2022',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    minDisk: '40 GiB',
    minRam: '4 GiB',
    owner: 'admin',
    visibility: 'Shared',
    filename: '/v2/images/img-006/file',
    checksum: 'pqr678',
    qemuGuestAgent: false,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-007': {
    id: 'img-007',
    name: 'Alpine-3.18-minimal',
    status: 'active',
    access: 'Public',
    createdAt: 'Aug 20, 2025 23:27:51',
    usageType: 'Common Server',
    protected: false,
    description: 'Lightweight Alpine Linux',
    size: '256MiB',
    os: 'Alpine 3.18',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '1 GiB',
    minRam: '256 MiB',
    owner: 'admin',
    visibility: 'Public',
    filename: '/v2/images/img-007/file',
    checksum: 'stu901',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-008': {
    id: 'img-008',
    name: 'Fedora-39-workstation',
    status: 'active',
    access: 'Private',
    createdAt: 'Aug 15, 2025 12:22:26',
    usageType: 'Common Server',
    protected: true,
    description: 'Fedora 39 workstation image',
    size: '20GiB',
    os: 'Fedora 39',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '15 GiB',
    minRam: '2 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/img-008/file',
    checksum: 'vwx234',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-009': {
    id: 'img-009',
    name: 'Oracle-Linux-8',
    status: 'error',
    access: 'Shared',
    createdAt: 'Aug 10, 2025 01:17:01',
    usageType: 'Common Server',
    protected: false,
    description: 'Oracle Linux 8 for databases',
    size: '18GiB',
    os: 'Oracle Linux 8',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    minDisk: '12 GiB',
    minRam: '2 GiB',
    owner: 'admin',
    visibility: 'Shared',
    filename: '/v2/images/img-009/file',
    checksum: 'yza567',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-010': {
    id: 'img-010',
    name: 'Ubuntu-22.04-GPU',
    status: 'active',
    access: 'Private',
    createdAt: 'Aug 5, 2025 14:12:36',
    usageType: 'GPU Server',
    protected: true,
    description: 'Ubuntu with GPU drivers',
    size: '24GiB',
    os: 'Ubuntu22.04',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '20 GiB',
    minRam: '4 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/img-010/file',
    checksum: 'bcd890',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
};

const defaultImageDetail: ImageDetail = {
  id: 'unknown',
  name: 'Unknown Image',
  status: 'active',
  access: 'Project',
  createdAt: '-',
  usageType: '-',
  protected: false,
  description: '-',
  size: '-',
  os: '-',
  diskFormat: '-',
  containerFormat: '-',
  minDisk: '-',
  minRam: '-',
  owner: '-',
  visibility: 'Private',
  filename: '-',
  checksum: '-',
  qemuGuestAgent: false,
  cpuPolicy: '-',
  cpuThreadPolicy: '-',
  metadata: {},
};

export function ComputeImageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const image = useMemo(
    () => (id ? (mockImagesMap[id] ?? defaultImageDetail) : defaultImageDetail),
    [id]
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: 'Active',
      accessory: <StatusIndicator variant="active" layout="iconOnly" />,
    },
    { label: 'ID', value: image.id, showCopyButton: true, copyText: image.id },
    { label: 'Visibility', value: 'Project' },
    { label: 'Protected', value: image.protected ? 'Enabled' : 'Disabled' },
    { label: 'Created at', value: image.createdAt },
  ];

  const actions = (
    <div className="flex items-center gap-1 flex-wrap">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconCirclePlus size={12} stroke={1.5} /> Create instance
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconEdit size={12} stroke={1.5} /> Edit
      </Button>
      <Button variant="secondary" appearance="outline" size="sm">
        <IconTrash size={12} stroke={1.5} /> Delete
      </Button>
      <ContextMenu.Root
        direction="bottom-end"
        gap={4}
        subContextMenuDirection="right-top"
        trigger={({ toggle }) => (
          <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
            More actions <IconChevronDown size={12} stroke={1.5} />
          </Button>
        )}
      >
        <ContextMenu.Item action={() => console.log('Create instance Template')}>
          Create instance Template
        </ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Create volume')}>
          Create volume
        </ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={image.name} actions={actions} infoFields={infoFields} />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Image name" value={image.name} />
                  <SectionCard.DataRow label="Description" value={image.description} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Specifications" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Size" value={image.size} />
                  <SectionCard.DataRow label="OS" value={image.os} />
                  <SectionCard.DataRow label="OS admin" value={image.os} />
                  <SectionCard.DataRow
                    label="Disk format/Container format"
                    value={`${image.diskFormat} / ${image.containerFormat}`}
                  />
                  <SectionCard.DataRow
                    label="Min disk / Min RAM"
                    value={`${image.minDisk} / ${image.minRam}`}
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Security" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Owner" value={image.owner} />
                  <SectionCard.DataRow label="Visibility" value={image.visibility} />
                  <SectionCard.DataRow
                    label="Protected"
                    value={image.protected ? 'Enabled' : 'Disabled'}
                  />
                  <SectionCard.DataRow label="Filename">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text truncate">
                        {image.filename}
                      </span>
                      <CopyButton text={image.filename} />
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="Checksum">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text truncate">
                        {image.checksum}
                      </span>
                      <CopyButton text={image.checksum} />
                    </div>
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header
                  title="Advanced"
                  actions={
                    <Button variant="secondary" appearance="outline" size="sm">
                      <IconEdit size={12} stroke={1.5} /> Edit
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="QEMU Guest Agent"
                    value={image.qemuGuestAgent ? 'Enabled' : 'Disabled'}
                  />
                  <SectionCard.DataRow label="CPU Policy" value={image.cpuPolicy} />
                  <SectionCard.DataRow label="CPU Thread Policy" value={image.cpuThreadPolicy} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="metadata" label="Metadata">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Metadata" />
                <SectionCard.Content>
                  {Object.entries(image.metadata).length > 0 ? (
                    Object.entries(image.metadata).map(([key, value]) => (
                      <SectionCard.DataRow key={key} label={key} value={value} />
                    ))
                  ) : (
                    <div className="py-4 text-center text-12 leading-18 text-text-muted">
                      No metadata available
                    </div>
                  )}
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
