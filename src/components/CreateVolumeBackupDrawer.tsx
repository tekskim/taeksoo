import { useState, useMemo } from 'react';
import { 
  Drawer, 
  Button, 
  Radio,
  RadioGroup,
  Input,
  SearchInput,
  Pagination,
  Table,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface VolumeItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  size: string;
  attachTo?: string;
  attachToId?: string;
  diskTag: string;
}

export interface CreateVolumeBackupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumes?: VolumeItem[];
  volumeBackupQuota?: { used: number; total: number };
  defaultTypeBackupQuota?: { used: number; total: number | 'unlimited' };
  onCreate?: (data: {
    volumeId: string;
    backupMode: 'full' | 'incremental';
    name: string;
    description?: string;
  }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockVolumes: VolumeItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `vol-${i + 1}`,
  name: `vol-0${(i % 9) + 1}`,
  status: 'active',
  size: '10 GiB',
  attachTo: 'web-server-1',
  attachToId: `server-${i + 1}`,
  diskTag: 'Data Disk',
}));

/* ----------------------------------------
   Quota Bar Component
   ---------------------------------------- */

function QuotaBar({ 
  label, 
  used, 
  total 
}: { 
  label: string; 
  used: number; 
  total: number | 'unlimited';
}) {
  const isUnlimited = total === 'unlimited';
  const percentage = isUnlimited ? 0 : Math.min((used / (total as number)) * 100, 100);
  
  return (
    <VStack gap={2} className="w-full">
      <HStack justifyContent="between" className="w-full">
        <span className="text-[14px] font-medium text-[var(--color-text-default)]">
          {label}
        </span>
        <HStack gap={0} alignItems="center">
          <span className="text-[12px] text-[var(--color-text-default)]">
            {used}/
          </span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" />
          ) : (
            <span className="text-[12px] text-[var(--color-text-default)]">{total}</span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-surface-muted)] rounded-full overflow-hidden flex">
        <div 
          className="h-full rounded-full bg-[var(--color-state-success)]"
          style={{ width: isUnlimited ? '5%' : `${percentage}%` }}
        />
        <div 
          className="h-full rounded-full bg-[#bbf7d0] -ml-1"
          style={{ width: isUnlimited ? '5%' : `${percentage}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateVolumeBackupDrawer Component
   ---------------------------------------- */

export function CreateVolumeBackupDrawer({
  isOpen,
  onClose,
  volumes = mockVolumes,
  volumeBackupQuota = { used: 2, total: 10 },
  defaultTypeBackupQuota = { used: 2, total: 'unlimited' },
  onCreate,
}: CreateVolumeBackupDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);
  const [backupMode, setBackupMode] = useState<'full' | 'incremental'>('full');
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 5;

  // Filter volumes based on search
  const filteredVolumes = useMemo(() => 
    volumes.filter(volume =>
      volume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volume.attachTo?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [volumes, searchTerm]
  );

  // Paginate
  const paginatedVolumes = filteredVolumes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const volumeColumns: TableColumn<VolumeItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="volume-backup-select"
          value={row.id}
          checked={selectedVolumeId === row.id}
          onChange={() => setSelectedVolumeId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator status={item.status} layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, item) => (
        <HStack gap={1.5}>
          <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-link)]">
            {item.name}
          </span>
          <IconExternalLink size={12} className="text-[var(--color-link)]" />
        </HStack>
      ),
    },
    { 
      key: 'size', 
      label: 'Size',
      sortable: true,
    },
    {
      key: 'attachTo',
      label: 'Attach To',
      render: (_, item) => item.attachTo ? (
        <HStack gap={1.5}>
          <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-link)]">
            {item.attachTo}
          </span>
          <IconExternalLink size={12} className="text-[var(--color-link)]" />
        </HStack>
      ) : (
        <span className="text-[12px] text-[var(--color-text-muted)]">-</span>
      ),
    },
    { 
      key: 'diskTag', 
      label: 'Disk Tag',
      sortable: true,
    },
  ];

  const handleCreate = async () => {
    if (!selectedVolumeId || !backupName.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate?.({
        volumeId: selectedVolumeId,
        backupMode,
        name: backupName.trim(),
        description: description.trim() || undefined,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedVolumeId(null);
    setSearchTerm('');
    setBackupMode('full');
    setBackupName('');
    setDescription('');
    setCurrentPage(1);
    onClose();
  };

  const isFormValid = selectedVolumeId && backupName.trim().length > 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Volume Backup"
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            size="md"
            className="w-[152px]"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreate}
            disabled={isSubmitting || !isFormValid}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Volumes Section */}
        <VStack gap={3} className="w-full">
          <h6 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Volumes
          </h6>

          {/* Search Input */}
          <SearchInput
            placeholder="Find volume with filters"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-[280px]"
          />

          {/* Pagination */}
          <HStack gap={2} alignItems="center">
            <Pagination 
              totalItems={filteredVolumes.length} 
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredVolumes.length} items
            </span>
          </HStack>

          {/* Volume Table */}
          <div className="overflow-auto">
            <Table<VolumeItem>
              columns={volumeColumns}
              data={paginatedVolumes}
              rowKey="id"
              selectedKeys={selectedVolumeId ? [selectedVolumeId] : []}
              onRowClick={(row) => setSelectedVolumeId(row.id)}
              emptyMessage="No volumes available"
            />
          </div>
        </VStack>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border-subtle)]" />

        {/* Backup Mode */}
        <VStack gap={3}>
          <h6 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Backup mode
          </h6>
          <RadioGroup value={backupMode} onChange={(val) => setBackupMode(val as 'full' | 'incremental')}>
            <VStack gap={3} alignItems="start">
              <Radio value="full" label="Full Backup" />
              <Radio value="incremental" label="Increment Backup" />
            </VStack>
          </RadioGroup>
        </VStack>

        {/* Volume Backup Name */}
        <VStack gap={2}>
          <h6 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Volume Backup name
          </h6>
          <Input
            placeholder="e.g. data-backup"
            value={backupName}
            onChange={(e) => setBackupName(e.target.value)}
            className="w-full"
          />
          <p className="text-[11px] text-[var(--color-text-subtle)]">
            Allowed: 1-128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description (optional) */}
        <VStack gap={2}>
          <h6 className="text-[14px] font-medium text-[var(--color-text-default)]">
            Description (optional)
          </h6>
          <Input
            placeholder="e.g. data-snap"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </VStack>

        {/* Quota Section */}
        <VStack gap={6} className="w-full pt-4 border-t border-[var(--color-border-subtle)]">
          <QuotaBar 
            label="Volume Backup Quota" 
            used={volumeBackupQuota.used} 
            total={volumeBackupQuota.total} 
          />
          <QuotaBar 
            label="_DEFAULT_type Backup Quota" 
            used={defaultTypeBackupQuota.used} 
            total={defaultTypeBackupQuota.total} 
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateVolumeBackupDrawer;
