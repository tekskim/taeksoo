import { useMemo, useState, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { ExtendVolumeDrawer } from '../drawers/compute/volume/ExtendVolumeDrawer';
import { EditVolumeDrawer } from '../drawers/compute/volume/EditVolumeDrawer';
import { CreateVolumeSnapshotDrawer } from '../drawers/compute/volume/CreateVolumeSnapshotDrawer';
import { CreateVolumeBackupDrawer } from '../drawers/compute/volume/CreateVolumeBackupDrawer';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import {
  IconCirclePlus,
  IconTrash,
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconDownload,
  IconEdit,
} from '@tabler/icons-react';
import { stripTimeFromTableDate } from './tableDateDisplay';

type VolumeStatus =
  | 'available'
  | 'in-use'
  | 'error'
  | 'creating'
  | 'deleting'
  | 'active'
  | 'pending';
type SnapshotStatus = 'available' | 'creating' | 'deleting' | 'error';
type BackupStatus = 'available' | 'creating' | 'restoring' | 'error';

interface VolumeDetail {
  id: string;
  name: string;
  status: VolumeStatus;
  size: string;
  createdAt: string;
  volumeName: string;
  availabilityZone: string;
  description: string;
  attachedTo: string | null;
  attachedToId: string | null;
  dataSourceType: string;
  volumeType: string;
  bootable: boolean;
  encryption: boolean;
}

interface VolumeSnapshot {
  id: string;
  name: string;
  status: SnapshotStatus;
  size: string;
  createdAt: string;
}

interface VolumeBackup {
  id: string;
  name: string;
  status: BackupStatus;
  backupMode: string;
  size: string;
  createdAt: string;
}

const mockVolumesMap: Record<string, VolumeDetail> = {
  'vol-001': {
    id: 'vol-001',
    name: 'db-data',
    status: 'in-use',
    size: '1500GiB',
    createdAt: 'Sep 12, 2025 15:43:35',
    volumeName: 'db-data',
    availabilityZone: 'nova',
    description: 'Database data volume',
    attachedTo: 'web-server-1',
    attachedToId: 'inst-001',
    dataSourceType: 'Blank Volume',
    volumeType: '_DEFAULT_',
    bootable: false,
    encryption: false,
  },
  'vol-002': {
    id: 'vol-002',
    name: 'app-storage',
    status: 'in-use',
    size: '500GiB',
    createdAt: 'Sep 10, 2025 01:17:01',
    volumeName: 'app-storage',
    availabilityZone: 'nova',
    description: 'Application storage',
    attachedTo: 'app-server-1',
    attachedToId: 'inst-002',
    dataSourceType: 'Blank Volume',
    volumeType: '_DEFAULT_',
    bootable: false,
    encryption: false,
  },
  'vol-003': {
    id: 'vol-003',
    name: 'backup-vol',
    status: 'active',
    size: '2000GiB',
    createdAt: 'Sep 8, 2025 11:51:27',
    volumeName: 'backup-vol',
    availabilityZone: 'nova',
    description: 'Backup storage',
    attachedTo: null,
    attachedToId: null,
    dataSourceType: 'Blank Volume',
    volumeType: 'SSD',
    bootable: false,
    encryption: true,
  },
  'vol-004': {
    id: 'vol-004',
    name: 'log-storage',
    status: 'in-use',
    size: '100GiB',
    createdAt: 'Sep 5, 2025 14:12:36',
    volumeName: 'log-storage',
    availabilityZone: 'nova',
    description: 'Log storage volume',
    attachedTo: 'log-server',
    attachedToId: 'inst-003',
    dataSourceType: 'Blank Volume',
    volumeType: '_DEFAULT_',
    bootable: false,
    encryption: false,
  },
  'vol-005': {
    id: 'vol-005',
    name: 'cache-vol',
    status: 'in-use',
    size: '256GiB',
    createdAt: 'Aug 30, 2025 21:37:41',
    volumeName: 'cache-vol',
    availabilityZone: 'nova',
    description: 'Cache volume',
    attachedTo: 'cache-01',
    attachedToId: 'inst-004',
    dataSourceType: 'Blank Volume',
    volumeType: 'NVMe',
    bootable: false,
    encryption: false,
  },
  'vol-006': {
    id: 'vol-006',
    name: 'media-storage',
    status: 'active',
    size: '5000GiB',
    createdAt: 'Aug 25, 2025 10:32:16',
    volumeName: 'media-storage',
    availabilityZone: 'nova',
    description: 'Media storage volume',
    attachedTo: null,
    attachedToId: null,
    dataSourceType: 'Blank Volume',
    volumeType: 'HDD',
    bootable: false,
    encryption: false,
  },
  'vol-007': {
    id: 'vol-007',
    name: 'temp-vol',
    status: 'pending',
    size: '50GiB',
    createdAt: 'Aug 20, 2025 23:27:51',
    volumeName: 'temp-vol',
    availabilityZone: 'nova',
    description: 'Temporary volume',
    attachedTo: null,
    attachedToId: null,
    dataSourceType: 'Blank Volume',
    volumeType: '_DEFAULT_',
    bootable: false,
    encryption: false,
  },
  'vol-008': {
    id: 'vol-008',
    name: 'ml-data',
    status: 'in-use',
    size: '1000GiB',
    createdAt: 'Aug 15, 2025 12:22:26',
    volumeName: 'ml-data',
    availabilityZone: 'nova',
    description: 'ML Dataset volume',
    attachedTo: 'gpu-server-1',
    attachedToId: 'inst-005',
    dataSourceType: 'Blank Volume',
    volumeType: 'NVMe',
    bootable: false,
    encryption: true,
  },
  'vol-009': {
    id: 'vol-009',
    name: 'archive-vol',
    status: 'active',
    size: '10000GiB',
    createdAt: 'Aug 10, 2025 01:17:01',
    volumeName: 'archive-vol',
    availabilityZone: 'nova',
    description: 'Archive storage',
    attachedTo: null,
    attachedToId: null,
    dataSourceType: 'Blank Volume',
    volumeType: 'HDD',
    bootable: false,
    encryption: false,
  },
  'vol-010': {
    id: 'vol-010',
    name: 'boot-vol-01',
    status: 'in-use',
    size: '100GiB',
    createdAt: 'Aug 5, 2025 14:12:36',
    volumeName: 'boot-vol-01',
    availabilityZone: 'nova',
    description: 'Boot volume',
    attachedTo: 'web-server-2',
    attachedToId: 'inst-006',
    dataSourceType: 'Image',
    volumeType: 'SSD',
    bootable: true,
    encryption: false,
  },
};

const defaultVolumeDetail: VolumeDetail = {
  id: 'unknown',
  name: 'Unknown Volume',
  status: 'available',
  size: '0 GiB',
  createdAt: '-',
  volumeName: '-',
  availabilityZone: '-',
  description: '-',
  attachedTo: null,
  attachedToId: null,
  dataSourceType: '-',
  volumeType: '-',
  bootable: false,
  encryption: false,
};

const mockVolumeSnapshots: VolumeSnapshot[] = Array.from({ length: 115 }, (_, i) => ({
  id: `snap-${String(i + 1).padStart(3, '0')}`,
  name: `vol-snap-${String(34 + i).padStart(2, '0')}`,
  status: 'available' as SnapshotStatus,
  size: '1500GiB',
  createdAt: 'Sep 12, 2025 15:43:35',
}));

const mockVolumeBackups: VolumeBackup[] = Array.from({ length: 115 }, (_, i) => ({
  id: `backup-${String(i + 1).padStart(3, '0')}`,
  name: `vol-backup-${String(34 + i).padStart(2, '0')}`,
  status: 'available' as BackupStatus,
  backupMode: 'Full Backup',
  size: '1500GiB',
  createdAt: 'Sep 12, 2025 15:43:35',
}));

const volumeStatusDisplayMap: Record<VolumeStatus, string> = {
  available: 'Available',
  'in-use': 'In Use',
  error: 'Error',
  creating: 'Creating',
  deleting: 'Deleting',
  active: 'Available',
  pending: 'Creating',
};

const snapshotStatusVariant: Record<SnapshotStatus, StatusVariant> = {
  available: 'active',
  creating: 'building',
  deleting: 'pending',
  error: 'error',
};

const backupStatusVariant: Record<BackupStatus, StatusVariant> = {
  available: 'active',
  creating: 'building',
  restoring: 'pending',
  error: 'error',
};

const STATUS_COL_WIDTH = 60;
const ACTION_COL_WIDTH = 72;
const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

const SnapshotMenuTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      toggle();
    }}
    className="p-1.5 rounded-md hover:bg-surface-muted transition-colors border-none bg-transparent inline-flex"
    aria-label="Row actions"
  >
    <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-text-subtle" />
  </button>
);

export function ComputeVolumeDetailPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const volume = useMemo(
    () => (id ? (mockVolumesMap[id] ?? defaultVolumeDetail) : defaultVolumeDetail),
    [id]
  );

  const [snapshotSearchQuery, setSnapshotSearchQuery] = useState('');
  const [snapshotCurrentPage, setSnapshotCurrentPage] = useState(1);
  const [backupSearchQuery, setBackupSearchQuery] = useState('');
  const [backupCurrentPage, setBackupCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [snapSort, setSnapSort] = useState('');
  const [snapOrder, setSnapOrder] = useState<SortOrder>('asc');
  const [backupSort, setBackupSort] = useState('');
  const [backupOrder, setBackupOrder] = useState<SortOrder>('asc');
  const handleSnapSort = useCallback((k: string | null, o: SortOrder) => {
    setSnapSort(k ?? '');
    setSnapOrder(o);
  }, []);
  const handleBackupSort = useCallback((k: string | null, o: SortOrder) => {
    setBackupSort(k ?? '');
    setBackupOrder(o);
  }, []);

  const filteredSnapshots = useMemo(() => {
    if (!snapshotSearchQuery) return mockVolumeSnapshots;
    const q = snapshotSearchQuery.toLowerCase();
    return mockVolumeSnapshots.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [snapshotSearchQuery]);

  const filteredBackups = useMemo(() => {
    if (!backupSearchQuery) return mockVolumeBackups;
    const q = backupSearchQuery.toLowerCase();
    return mockVolumeBackups.filter(
      (b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
    );
  }, [backupSearchQuery]);

  const snapshotTotalPages = Math.ceil(filteredSnapshots.length / rowsPerPage);
  const paginatedSnapshots = filteredSnapshots.slice(
    (snapshotCurrentPage - 1) * rowsPerPage,
    snapshotCurrentPage * rowsPerPage
  );
  const backupTotalPages = Math.ceil(filteredBackups.length / rowsPerPage);
  const paginatedBackups = filteredBackups.slice(
    (backupCurrentPage - 1) * rowsPerPage,
    backupCurrentPage * rowsPerPage
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: volumeStatusDisplayMap[volume.status],
      accessory: <StatusIndicator variant="active" layout="iconOnly" />,
    },
    { label: 'ID', value: volume.id, showCopyButton: true, copyText: volume.id },
    { label: 'Origin', value: 'Container' },
    { label: 'Size', value: volume.size },
    { label: 'Created at', value: volume.createdAt },
  ];

  const detailsActions = (
    <div className="flex items-center gap-1 flex-wrap">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconCirclePlus size={12} stroke={1.5} /> Create transfer
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
        <ContextMenu.SubItems label="Data protection" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => setSnapshotOpen(true)}>
            Create volume snapshot
          </ContextMenu.Item>
          <ContextMenu.Item action={() => setBackupOpen(true)}>
            Create volume backup
          </ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.SubItems label="Configuration" subContextMenuDirection="right-top">
          <ContextMenu.Item action={() => setExtendOpen(true)}>Extend volume</ContextMenu.Item>
          <ContextMenu.Item action={() => console.log('Change type')}>Change type</ContextMenu.Item>
        </ContextMenu.SubItems>
        <ContextMenu.Item action={() => setEditOpen(true)}>Edit</ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  const otherTabActions = (
    <div className="flex items-center gap-1 flex-wrap">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconCirclePlus size={12} stroke={1.5} /> Update status
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
        trigger={({ toggle }) => (
          <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
            More actions <IconChevronDown size={12} stroke={1.5} />
          </Button>
        )}
      >
        <ContextMenu.Item action={() => console.log('Update status')}>
          Update status
        </ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Edit')}>Edit</ContextMenu.Item>
        <ContextMenu.Item action={() => console.log('Delete')} danger>
          Delete
        </ContextMenu.Item>
      </ContextMenu.Root>
    </div>
  );

  const snapshotColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'size', header: 'Size', sortable: true },
      { key: 'createdAt', header: 'Created at', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  const backupColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'backupMode', header: 'Backup mode', sortable: true },
      { key: 'size', header: 'Size', sortable: true },
      { key: 'createdAt', header: 'Created at', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={volume.name}
        actions={activeDetailTab === 'details' ? detailsActions : otherTabActions}
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Volume name" value={volume.volumeName} />
                  <SectionCard.DataRow
                    label="AZ(Availability zone)"
                    value={volume.availabilityZone}
                  />
                  <SectionCard.DataRow label="Bootable" value={volume.bootable ? 'Yes' : 'No'} />
                  <SectionCard.DataRow label="Description" value={volume.description} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Attachments" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Attached to"
                    value={
                      volume.attachedTo && volume.attachedToId ? (
                        <Link
                          to={`/compute/instances/${volume.attachedToId}`}
                          className={linkClass}
                        >
                          {volume.attachedTo}
                        </Link>
                      ) : (
                        '-'
                      )
                    }
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header
                  title="Source"
                  actions={
                    <Button variant="secondary" appearance="outline" size="sm">
                      <IconEdit size={12} stroke={1.5} /> Edit
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Volume snapshot"
                    value={
                      <Link to="/compute/volume-snapshots/snap-001" className={linkClass}>
                        snapshot
                      </Link>
                    }
                  />
                  <SectionCard.DataRow
                    label="Image"
                    value={
                      <Link to="/compute/images/img-001" className={linkClass}>
                        image
                      </Link>
                    }
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header
                  title="Specifications"
                  actions={
                    <Button
                      variant="secondary"
                      appearance="outline"
                      size="sm"
                      onClick={() => setEditOpen(true)}
                    >
                      <IconEdit size={12} stroke={1.5} /> Edit
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Size" value={volume.size} />
                  <SectionCard.DataRow label="Volume type" value={volume.volumeType} />
                  <SectionCard.DataRow
                    label="Encryption"
                    value={volume.encryption ? 'Yes' : 'No'}
                  />
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

          <Tab id="snapshots" label="Volume snapshots">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-16 font-semibold leading-6 text-text m-0">Volume snapshots</h2>
              <div className="flex items-center gap-1">
                <input
                  type="search"
                  placeholder="Search snapshot by attributes"
                  value={snapshotSearchQuery}
                  onChange={(e) => {
                    setSnapshotSearchQuery(e.target.value);
                    setSnapshotCurrentPage(1);
                  }}
                  className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 leading-[18px] w-full max-w-[320px] outline-none"
                />
                <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
                  <IconDownload size={12} stroke={1.5} />
                </Button>
              </div>
              <Pagination
                totalCount={filteredSnapshots.length}
                size={rowsPerPage}
                currentAt={snapshotCurrentPage}
                onPageChange={setSnapshotCurrentPage}
                totalCountLabel="items"
              />
              <Table<VolumeSnapshot>
                columns={snapshotColumns}
                rows={paginatedSnapshots}
                sort={snapSort}
                order={snapOrder}
                onSortChange={handleSnapSort}
                stickyLastColumn
              >
                {paginatedSnapshots.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={snapshotColumns[0]}>
                      <StatusIndicator
                        variant={snapshotStatusVariant[row.status]}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute/volume-snapshots/${row.id}`} className={linkClass}>
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[2]}>
                      {row.size}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[3]}>
                      {stripTimeFromTableDate(row.createdAt)}
                    </Table.Td>
                    <Table.Td rowData={row} column={snapshotColumns[4]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <SnapshotMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item action={() => {}}>Create volume</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Edit</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}} danger>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="backups" label="Volume backups">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-16 font-semibold leading-6 text-text m-0">Volume backups</h2>
              <div className="flex items-center gap-1">
                <input
                  type="search"
                  placeholder="Search backup by attributes"
                  value={backupSearchQuery}
                  onChange={(e) => {
                    setBackupSearchQuery(e.target.value);
                    setBackupCurrentPage(1);
                  }}
                  className="h-8 px-2.5 rounded-md border border-border-strong bg-surface-default text-12 leading-[18px] w-full max-w-[320px] outline-none"
                />
                <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
                  <IconDownload size={12} stroke={1.5} />
                </Button>
              </div>
              <Pagination
                totalCount={filteredBackups.length}
                size={rowsPerPage}
                currentAt={backupCurrentPage}
                onPageChange={setBackupCurrentPage}
                totalCountLabel="items"
              />
              <Table<VolumeBackup>
                columns={backupColumns}
                rows={paginatedBackups}
                sort={backupSort}
                order={backupOrder}
                onSortChange={handleBackupSort}
                stickyLastColumn
              >
                {paginatedBackups.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={backupColumns[0]}>
                      <StatusIndicator
                        variant={backupStatusVariant[row.status]}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={backupColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link to={`/compute/volume-backups/${row.id}`} className={linkClass}>
                          {row.name}
                        </Link>
                        <span className="text-11 text-text-muted">ID : {row.id}</span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={backupColumns[2]}>
                      {row.backupMode}
                    </Table.Td>
                    <Table.Td rowData={row} column={backupColumns[3]}>
                      {row.size}
                    </Table.Td>
                    <Table.Td rowData={row} column={backupColumns[4]}>
                      {stripTimeFromTableDate(row.createdAt)}
                    </Table.Td>
                    <Table.Td rowData={row} column={backupColumns[5]} preventClickPropagation>
                      <ContextMenu.Root
                        direction="bottom-end"
                        gap={4}
                        trigger={({ toggle }) => <SnapshotMenuTrigger toggle={toggle} />}
                      >
                        <ContextMenu.Item action={() => {}}>Create volume</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Restore backup</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}}>Edit</ContextMenu.Item>
                        <ContextMenu.Item action={() => {}} danger>
                          Delete
                        </ContextMenu.Item>
                      </ContextMenu.Root>
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
