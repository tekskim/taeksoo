import { useEffect, useMemo, useState } from 'react';
import {
  Drawer,
  Button,
  HStack,
  VStack,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  NumberInput,
  SearchInput,
  Pagination,
  Table,
  InfoBox,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { ContextMenu } from '@/design-system';
import { IconDotsVertical } from '@tabler/icons-react';

/* -------------------------------------------------------------------------- */
/* Shared options                                                             */
/* -------------------------------------------------------------------------- */

const STORAGE_CLASS_OPTIONS = [
  { value: 'nfs-individual', label: 'NFS (Individual)' },
  { value: 'nfs-shared', label: 'NFS (Shared)' },
  { value: 'block', label: 'Block Storage' },
];

const ACCESS_MODE_OPTIONS = [
  {
    value: 'rwx',
    label: 'ReadWriteMany (RWX) - Multiple Pods read/write',
  },
  {
    value: 'rwo',
    label: 'ReadWriteOnce (RWO) - Single Pod read/write',
  },
  {
    value: 'rox',
    label: 'ReadOnlyMany (ROX) - Multiple Pods read only',
  },
];

const SHARE_TARGET_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'group', label: 'Group' },
  { value: 'project', label: 'Project' },
];

const USER_OPTIONS = [
  { value: 'alice', label: 'Alice Kim' },
  { value: 'bob', label: 'Bob Lee' },
  { value: 'carol', label: 'Carol Park' },
];

const PERMISSION_OPTIONS = [
  { value: 'read', label: 'Read only' },
  { value: 'read-write', label: 'Read/Write' },
  { value: 'admin', label: 'Admin' },
];

/* -------------------------------------------------------------------------- */
/* SnapshotDrawer — mock data                                                 */
/* -------------------------------------------------------------------------- */

export type SnapshotRow = {
  id: string;
  status: 'active' | 'building';
  name: string;
  size: string;
  createdAt: string;
};

const MOCK_SNAPSHOTS: SnapshotRow[] = [
  { id: 's1', status: 'active', name: 'snap-daily-001', size: '20 GB', createdAt: 'Sep 26, 2025' },
  {
    id: 's2',
    status: 'building',
    name: 'snap-pre-upgrade',
    size: '32 GB',
    createdAt: 'Sep 26, 2025',
  },
  { id: 's3', status: 'active', name: 'snap-backup-mon', size: '20 GB', createdAt: 'Sep 26, 2025' },
  { id: 's4', status: 'active', name: 'snap-backup-tue', size: '20 GB', createdAt: 'Sep 26, 2025' },
  {
    id: 's5',
    status: 'building',
    name: 'snap-migration',
    size: '64 GB',
    createdAt: 'Sep 26, 2025',
  },
  { id: 's6', status: 'active', name: 'snap-staging', size: '12 GB', createdAt: 'Sep 26, 2025' },
  { id: 's7', status: 'active', name: 'snap-drill-01', size: '20 GB', createdAt: 'Sep 26, 2025' },
  { id: 's8', status: 'building', name: 'snap-drill-02', size: '20 GB', createdAt: 'Sep 26, 2025' },
  { id: 's9', status: 'active', name: 'snap-archive-q3', size: '48 GB', createdAt: 'Sep 26, 2025' },
  { id: 's10', status: 'active', name: 'snap-handoff', size: '16 GB', createdAt: 'Sep 26, 2025' },
  {
    id: 's11',
    status: 'building',
    name: 'snap-restore-test',
    size: '20 GB',
    createdAt: 'Sep 26, 2025',
  },
  { id: 's12', status: 'active', name: 'snap-final', size: '24 GB', createdAt: 'Sep 26, 2025' },
];

const SNAPSHOT_PAGE_SIZE = 5;

/* -------------------------------------------------------------------------- */
/* 1. CreateVolumeDrawer                                                       */
/* -------------------------------------------------------------------------- */

export interface CreateVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateVolumeDrawer({ isOpen, onClose }: CreateVolumeDrawerProps) {
  const [volumeName, setVolumeName] = useState('');
  const [description, setDescription] = useState('');
  const [sizeGb, setSizeGb] = useState(20);
  const [storageClass, setStorageClass] = useState(STORAGE_CLASS_OPTIONS[0].value);
  const [accessMode, setAccessMode] = useState(ACCESS_MODE_OPTIONS[0].value);
  const [mountPath, setMountPath] = useState('/workspace');
  const [autoBackup, setAutoBackup] = useState(false);

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create volume"
      description="Provision a new volume with the specified storage configuration and access settings."
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Create
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField label="Volume name" required>
          <Input
            placeholder="Lable"
            value={volumeName}
            onChange={(e) => setVolumeName(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Description" required>
          <Textarea
            placeholder="Add an description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Size" description="Total capacity allocated to this volume." required>
          <NumberInput min={0} suffix="GB" value={sizeGb} onChange={setSizeGb} width="full" />
        </FormField>
        <FormField
          label="Storage class"
          description="Storage backend and performance profile for the volume."
        >
          <Select
            options={STORAGE_CLASS_OPTIONS}
            value={storageClass}
            onChange={setStorageClass}
            fullWidth
          />
        </FormField>
        <FormField
          label="Access mode"
          description="How many pods can mount the volume and whether it is read/write."
        >
          <Select
            options={ACCESS_MODE_OPTIONS}
            value={accessMode}
            onChange={setAccessMode}
            fullWidth
          />
        </FormField>
        <FormField
          label="Default mount path"
          description="Path inside the container where the volume is mounted by default."
        >
          <Input
            placeholder="/workspace"
            value={mountPath}
            onChange={(e) => setMountPath(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Enable auto backup" spacing="loose">
          <Checkbox
            label="Automatically back up this volume on schedule"
            checked={autoBackup}
            onChange={(e) => setAutoBackup(e.target.checked)}
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. EditVolumeDrawer                                                         */
/* -------------------------------------------------------------------------- */

export type VolumeFormModel = {
  id: string;
  name: string;
  description: string;
  sizeGb: number;
  storageClass: string;
  accessMode: string;
  mountPath: string;
  autoBackup: boolean;
};

export interface EditVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume?: VolumeFormModel | null;
}

export function EditVolumeDrawer({ isOpen, onClose, volume }: EditVolumeDrawerProps) {
  const [volumeName, setVolumeName] = useState('');
  const [description, setDescription] = useState('');
  const [sizeGb, setSizeGb] = useState(0);
  const [storageClass, setStorageClass] = useState(STORAGE_CLASS_OPTIONS[0].value);
  const [accessMode, setAccessMode] = useState(ACCESS_MODE_OPTIONS[0].value);
  const [mountPath, setMountPath] = useState('');
  const [autoBackup, setAutoBackup] = useState(false);

  useEffect(() => {
    if (!isOpen || !volume) return;
    setVolumeName(volume.name);
    setDescription(volume.description);
    setSizeGb(volume.sizeGb);
    setStorageClass(volume.storageClass || STORAGE_CLASS_OPTIONS[0].value);
    setAccessMode(volume.accessMode || ACCESS_MODE_OPTIONS[0].value);
    setMountPath(volume.mountPath);
    setAutoBackup(volume.autoBackup);
  }, [isOpen, volume]);

  const handleSubmit = () => {
    onClose();
  };

  const displayName = volume?.name ?? '—';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit volume"
      description="Provision a new volume with the specified storage configuration and access settings."
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <InfoBox label="Volume name" value={displayName} />
        <FormField label="Volume name" required>
          <Input
            placeholder="Lable"
            value={volumeName}
            onChange={(e) => setVolumeName(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Description" required>
          <Textarea
            placeholder="Add an description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Size" description="Total capacity allocated to this volume." required>
          <NumberInput min={0} suffix="GB" value={sizeGb} onChange={setSizeGb} width="full" />
        </FormField>
        <FormField
          label="Storage class"
          description="Storage backend and performance profile for the volume."
        >
          <Select
            options={STORAGE_CLASS_OPTIONS}
            value={storageClass}
            onChange={setStorageClass}
            fullWidth
          />
        </FormField>
        <FormField
          label="Access mode"
          description="How many pods can mount the volume and whether it is read/write."
        >
          <Select
            options={ACCESS_MODE_OPTIONS}
            value={accessMode}
            onChange={setAccessMode}
            fullWidth
          />
        </FormField>
        <FormField
          label="Default mount path"
          description="Path inside the container where the volume is mounted by default."
        >
          <Input
            placeholder="/workspace"
            value={mountPath}
            onChange={(e) => setMountPath(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Enable auto backup" spacing="loose">
          <Checkbox
            label="Automatically back up this volume on schedule"
            checked={autoBackup}
            onChange={(e) => setAutoBackup(e.target.checked)}
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. SnapshotDrawer                                                          */
/* -------------------------------------------------------------------------- */

export interface SnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
  onCreateSnapshot: () => void;
  onRestoreSnapshot: (snapshot: SnapshotRow) => void;
}

export function SnapshotDrawer({
  isOpen,
  onClose,
  volumeName = '—',
  onCreateSnapshot,
  onRestoreSnapshot,
}: SnapshotDrawerProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_SNAPSHOTS;
    return MOCK_SNAPSHOTS.filter((row) => row.name.toLowerCase().includes(q));
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / SNAPSHOT_PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * SNAPSHOT_PAGE_SIZE;
    return filtered.slice(start, start + SNAPSHOT_PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const snapshotColumns: TableColumn<SnapshotRow>[] = useMemo(
    () => [
      {
        key: 'status',
        header: 'Status',
        width: '60px',
        align: 'center',
        render: (_v, row) => (
          <StatusIndicator
            status={row.status === 'active' ? 'active' : 'building'}
            layout="icon-only"
            size="sm"
          />
        ),
      },
      { key: 'name', header: 'Name', sortable: true, minWidth: '120px' },
      { key: 'size', header: 'Size', minWidth: '80px', align: 'right' },
      { key: 'createdAt', header: 'Created at', minWidth: '100px', align: 'right' },
      {
        key: 'action',
        header: 'Action',
        width: '72px',
        align: 'center',
        render: (_v, row) => {
          const isBuilding = row.status === 'building';
          return (
            <ContextMenu
              items={[
                {
                  id: 'restore',
                  label: 'Restore',
                  onClick: () => onRestoreSnapshot(row),
                  disabled: isBuilding,
                },
                {
                  id: 'delete',
                  label: 'Delete',
                  status: 'danger' as const,
                  divider: true,
                  onClick: () => {},
                },
              ]}
              trigger="click"
            >
              <Button
                variant="ghost"
                size="sm"
                icon={<IconDotsVertical size={14} />}
                aria-label="Actions"
              />
            </ContextMenu>
          );
        },
      },
    ],
    [onRestoreSnapshot]
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Snapshot"
      titleActions={
        <Button variant="outline" size="sm" onClick={onCreateSnapshot}>
          Create snapshot
        </Button>
      }
      description="A brief description to provide additional details or context about the snapshot."
      width={696}
      footer={
        <div className="flex justify-center w-full">
          <Button variant="secondary" onClick={onClose} className="min-w-[200px]">
            Close
          </Button>
        </div>
      }
    >
      <VStack gap={4}>
        <InfoBox label="Volume" value={volumeName} />
        <SearchInput
          placeholder="Find packages"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[240px]"
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filtered.length}
          siblingCount={1}
          showFirstLast={false}
        />
        <Table<SnapshotRow>
          columns={snapshotColumns}
          data={paginated}
          rowKey="id"
          resizable={false}
        />
      </VStack>
    </Drawer>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. CreateSnapshotDrawer                                                     */
/* -------------------------------------------------------------------------- */

export interface CreateSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSnapshotDrawer({ isOpen, onClose }: CreateSnapshotDrawerProps) {
  const [snapshotName, setSnapshotName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create snapshot"
      description="Create a snapshot of this volume to capture its current system state as an image."
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Create
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField label="Snapshot name" required>
          <Input
            placeholder="Lable"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            placeholder="Add an description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. RestoreSnapshotDrawer                                                   */
/* -------------------------------------------------------------------------- */

export type RestoreSnapshotMeta = {
  name: string;
  volumeName: string;
  createdAt: string;
  sizeGb: number;
};

export interface RestoreSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot?: RestoreSnapshotMeta | null;
}

export function RestoreSnapshotDrawer({ isOpen, onClose, snapshot }: RestoreSnapshotDrawerProps) {
  const [newVolumeName, setNewVolumeName] = useState('');
  const [sizeGb, setSizeGb] = useState(20);
  const [description, setDescription] = useState('');

  const snapSize = snapshot?.sizeGb ?? 20;

  useEffect(() => {
    if (!isOpen) return;
    setNewVolumeName('');
    setSizeGb(snapshot?.sizeGb ?? 20);
    setDescription('');
  }, [isOpen, snapshot]);

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Restore snapshot"
      description="Restore the selected snapshot to recover its data to a volume."
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Restore
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <InfoBox.Group>
          <InfoBox label="Original volume" value={snapshot?.volumeName ?? '—'} />
          <InfoBox label="Snapshot created at" value={snapshot?.createdAt ?? 'Sep 26, 2025'} />
          <InfoBox label="Snapshot status">
            <StatusIndicator status="active" label="Ready" />
          </InfoBox>
        </InfoBox.Group>
        <FormField label="New volume name" required>
          <Input
            placeholder="Lable"
            value={newVolumeName}
            onChange={(e) => setNewVolumeName(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Size" required helperText={`Snapshot size: ${snapSize} GB (expand only)`}>
          <NumberInput
            min={snapSize}
            suffix="GB"
            value={sizeGb}
            onChange={setSizeGb}
            width="full"
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            placeholder="Add an description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. AddShareDrawer                                                          */
/* -------------------------------------------------------------------------- */

export interface AddShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddShareDrawer({ isOpen, onClose }: AddShareDrawerProps) {
  const [targetType, setTargetType] = useState(SHARE_TARGET_OPTIONS[0].value);
  const [userId, setUserId] = useState('');
  const [permission, setPermission] = useState(PERMISSION_OPTIONS[0].value);
  const [expiration, setExpiration] = useState('');

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add share"
      description="Add a new shared access configuration to allow additional resources to mount the volume."
      width={696}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Add
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Share target type"
          description="Choose whether access is granted to a user, group, or project."
          required
        >
          <Select
            options={SHARE_TARGET_OPTIONS}
            value={targetType}
            onChange={setTargetType}
            fullWidth
          />
        </FormField>
        <FormField label="Select user" required>
          <Select
            options={USER_OPTIONS}
            placeholder="Select a user"
            value={userId}
            onChange={setUserId}
            fullWidth
            clearable
          />
        </FormField>
        <FormField label="Permission" required>
          <Select
            options={PERMISSION_OPTIONS}
            value={permission}
            onChange={setPermission}
            fullWidth
          />
        </FormField>
        <FormField label="Expiration date" helperText="If not set, it will be shared permanently.">
          <Input
            placeholder="Month. Day. Year."
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}
