import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import type { DetailCardField } from '@shared/components/DetailCard/DetailCard';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Table } from '@shared/components/Table';
import { IconEdit, IconTrash, IconChevronDown } from '@tabler/icons-react';
import type { TableColumn } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { CreateVolumeBackupDrawer } from '../drawers/compute/volume/CreateVolumeBackupDrawer';
import { CreateVolumeSnapshotDrawer } from '../drawers/compute/volume/CreateVolumeSnapshotDrawer';
import { EditVolumeDrawer } from '../drawers/compute/volume/EditVolumeDrawer';
import { ExtendVolumeDrawer } from '../drawers/compute/volume/ExtendVolumeDrawer';

type VolumeStatus = 'active' | 'in-use' | 'error' | 'pending';
type VolumeType = 'SSD' | 'NVMe' | 'HDD';

interface VolumeDetail {
  id: string;
  name: string;
  status: VolumeStatus;
  size: string;
  type: VolumeType;
  attachedTo: string;
  attachedInstanceId: string;
  createdAt: string;
  bootable: string;
  az: string;
}

interface VolSnapRow {
  id: string;
  name: string;
  status: 'available' | 'error';
  size: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockMap: Record<string, VolumeDetail> = {
  'vol-001': {
    id: 'vol-001',
    name: 'web-data-01',
    status: 'in-use',
    size: '100 GiB',
    type: 'SSD',
    attachedTo: 'instance-web-01',
    attachedInstanceId: 'vm-007',
    createdAt: 'Mar 9, 2025 15:20:00',
    bootable: 'No',
    az: 'keystone',
  },
  'vol-002': {
    id: 'vol-002',
    name: 'db-primary-vol',
    status: 'in-use',
    size: '500 GiB',
    type: 'NVMe',
    attachedTo: 'instance-db-01',
    attachedInstanceId: 'vm-004',
    createdAt: 'Mar 7, 2025 11:05:22',
    bootable: 'Yes',
    az: 'nova',
  },
};

const defaultDetail: VolumeDetail = {
  id: '-',
  name: 'Unknown volume',
  status: 'pending',
  size: '-',
  type: 'SSD',
  attachedTo: '-',
  attachedInstanceId: '-',
  createdAt: '-',
  bootable: '-',
  az: '-',
};

function volumeStatusVariant(s: VolumeStatus): StatusVariant {
  if (s === 'error') return 'error';
  if (s === 'in-use') return 'inUse';
  if (s === 'pending') return 'pending';
  return 'active';
}

const statusLabel: Record<VolumeStatus, string> = {
  active: 'Available',
  'in-use': 'In use',
  error: 'Error',
  pending: 'Pending',
};

const mockSnapshots: VolSnapRow[] = [
  {
    id: 'vsnap-002',
    name: 'web-data-weekly',
    status: 'available',
    size: '100 GiB',
    createdAt: 'Mar 9, 2025 03:15:30',
  },
  {
    id: 'vsnap-006',
    name: 'temp-snap-784',
    status: 'available',
    size: '80 GiB',
    createdAt: 'Feb 14, 2025 11:11:11',
  },
];

const snapColumns: TableColumn[] = [
  { key: 'status', header: 'Status', width: 72, align: 'center' },
  { key: 'name', header: 'Name' },
  { key: 'size', header: 'Size' },
  { key: 'createdAt', header: 'Created at' },
];

function volumeSizeToGiB(size: string): number {
  const g = size.match(/^([\d.]+)\s*GiB/i);
  if (g) return Math.max(1, Math.floor(Number(g[1])));
  const t = size.match(/^([\d.]+)\s*TiB/i);
  if (t) return Math.max(1, Math.floor(Number(t[1]) * 1024));
  return 10;
}

export function ComputeVolumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const [editOpen, setEditOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);

  const v = id ? (mockMap[id] ?? defaultDetail) : defaultDetail;

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'Name', value: v.name },
    {
      label: 'Status',
      value: statusLabel[v.status],
      accessory: <StatusIndicator variant={volumeStatusVariant(v.status)} layout="iconOnly" />,
    },
    { label: 'Size', value: v.size },
    { label: 'Type', value: v.type },
    {
      label: 'Attached to',
      value:
        v.attachedInstanceId !== '-' ? (
          <Link
            to={`/compute/instances/${v.attachedInstanceId}`}
            className="text-primary font-medium hover:underline"
          >
            {v.attachedTo}
          </Link>
        ) : (
          v.attachedTo
        ),
    },
    { label: 'Created at', value: v.createdAt },
  ];

  const detailFields: DetailCardField[] = [
    { label: 'Volume ID', value: v.id },
    { label: 'Name', value: v.name },
    { label: 'Size', value: v.size },
    { label: 'Type', value: v.type },
    { label: 'Availability zone', value: v.az },
    { label: 'Bootable', value: v.bootable },
    { label: 'Attached instance', value: v.attachedTo },
    { label: 'Created at', value: v.createdAt },
  ];

  const actions = (
    <div className="flex items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm" onClick={() => {}}>
        Edit
      </Button>
      <Button variant="error" appearance="outline" size="sm" onClick={() => {}}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader title={v.name} actions={actions} infoFields={infoFields} />

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
          <Tab id="volume-snapshots" label="Volume snapshots">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-14 font-semibold leading-5 text-text m-0">Volume snapshots</h2>
              <Table columns={snapColumns} rows={mockSnapshots}>
                {mockSnapshots.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={snapColumns[0]}>
                      <StatusIndicator
                        variant={row.status === 'available' ? 'active' : 'error'}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={snapColumns[1]}>
                      <Link
                        to={`/compute/volume-snapshots/${row.id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {row.name}
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={snapColumns[2]}>
                      {row.size}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapColumns[3]}>
                      {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <EditVolumeDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        volumeId={v.id}
        initialData={{ name: v.name, description: '' }}
      />
      <ExtendVolumeDrawer
        isOpen={extendOpen}
        onClose={() => setExtendOpen(false)}
        volumeName={v.name}
        currentSizeLabel={v.size}
        currentSizeGiB={volumeSizeToGiB(v.size)}
      />
      <CreateVolumeSnapshotDrawer
        isOpen={snapshotOpen}
        onClose={() => setSnapshotOpen(false)}
        volumeName={v.name}
      />
      <CreateVolumeBackupDrawer
        isOpen={backupOpen}
        onClose={() => setBackupOpen(false)}
        volumeName={v.name}
      />
    </div>
  );
}
