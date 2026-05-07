import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  SearchInput,
  Pagination,
  EmptyState,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  StatusIndicator,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconDatabase,
  IconEye,
  IconEdit as IconPencil,
  IconShield,
  IconPlayerPlay,
  IconAlertTriangle,
  IconCircleDot,
} from '@tabler/icons-react';
import {
  CreateVolumeDrawer,
  EditVolumeDrawer,
  SnapshotDrawer,
  CreateSnapshotDrawer,
  RestoreSnapshotDrawer,
  AddShareDrawer,
} from './VolumeDrawers';

const ITEMS_PER_PAGE = 9;
const SHARE_ITEMS_PER_PAGE = 12;

type VolumeTab = 'project-volumes' | 'my-storage' | 'my-shares' | 'shared-volumes';

interface VolumeItem {
  id: string;
  name: string;
  shortId: string;
  usedGb: number;
  totalGb: number;
  usagePercent: number;
  storageClass: string;
  status: 'running' | 'error' | 'stopped';
  createdAt: string;
  inUse: boolean;
}

interface ShareItem {
  id: string;
  name: string;
  size: string;
  sharedWith: number;
}

interface SharedVolumeItem {
  id: string;
  name: string;
  size: string;
  permission: 'Write' | 'Read' | 'Admin';
  sharedAt: string;
  expiresAt: string;
}

const MOCK_PROJECT_VOLUMES: VolumeItem[] = [
  {
    id: 'pv-01',
    name: 'lively-sunset-6041',
    shortId: '568so8dv',
    usedGb: 8,
    totalGb: 10,
    usagePercent: 80,
    storageClass: 'ssd-balanced',
    status: 'running',
    createdAt: '2026-01-07T12:00:00',
    inUse: false,
  },
  {
    id: 'pv-02',
    name: 'quiet-forest-2210',
    shortId: '9k2mnd1a',
    usedGb: 4,
    totalGb: 20,
    usagePercent: 20,
    storageClass: 'hdd-standard',
    status: 'running',
    createdAt: '2026-01-05T09:30:00',
    inUse: true,
  },
  {
    id: 'pv-03',
    name: 'neon-ridge-9932',
    shortId: 'pl4x9qwe',
    usedGb: 50,
    totalGb: 50,
    usagePercent: 100,
    storageClass: 'ssd-fast',
    status: 'error',
    createdAt: '2026-01-02T14:22:00',
    inUse: false,
  },
  {
    id: 'pv-04',
    name: 'calm-glacier-1188',
    shortId: 'z8r7tvc2',
    usedGb: 12,
    totalGb: 64,
    usagePercent: 19,
    storageClass: 'ssd-balanced',
    status: 'running',
    createdAt: '2025-12-28T08:15:00',
    inUse: false,
  },
  {
    id: 'pv-05',
    name: 'bright-comet-4402',
    shortId: 'm3hj7klp',
    usedGb: 0,
    totalGb: 32,
    usagePercent: 0,
    storageClass: 'hdd-standard',
    status: 'stopped',
    createdAt: '2025-12-20T11:45:00',
    inUse: false,
  },
  {
    id: 'pv-06',
    name: 'swift-river-7753',
    shortId: 'bx91n445',
    usedGb: 24,
    totalGb: 40,
    usagePercent: 60,
    storageClass: 'ssd-balanced',
    status: 'running',
    createdAt: '2025-12-18T16:00:00',
    inUse: true,
  },
  {
    id: 'pv-07',
    name: 'gentle-breeze-3094',
    shortId: 'qp02ww88',
    usedGb: 6,
    totalGb: 16,
    usagePercent: 38,
    storageClass: 'ssd-fast',
    status: 'running',
    createdAt: '2025-12-12T10:10:00',
    inUse: false,
  },
  {
    id: 'pv-08',
    name: 'silver-moon-8821',
    shortId: 'aa44ff12',
    usedGb: 100,
    totalGb: 100,
    usagePercent: 100,
    storageClass: 'ssd-fast',
    status: 'error',
    createdAt: '2025-12-01T13:33:00',
    inUse: false,
  },
  {
    id: 'pv-09',
    name: 'amber-dune-5560',
    shortId: 'cc77dd99',
    usedGb: 15,
    totalGb: 25,
    usagePercent: 60,
    storageClass: 'hdd-standard',
    status: 'running',
    createdAt: '2025-11-25T09:00:00',
    inUse: false,
  },
  {
    id: 'pv-10',
    name: 'azure-wave-6734',
    shortId: 'ee55bb33',
    usedGb: 2,
    totalGb: 8,
    usagePercent: 25,
    storageClass: 'ssd-balanced',
    status: 'running',
    createdAt: '2025-11-20T17:45:00',
    inUse: false,
  },
  {
    id: 'pv-11',
    name: 'crimson-peak-2299',
    shortId: 'ff66aa11',
    usedGb: 48,
    totalGb: 48,
    usagePercent: 100,
    storageClass: 'ssd-fast',
    status: 'running',
    createdAt: '2025-11-10T12:12:00',
    inUse: true,
  },
  {
    id: 'pv-12',
    name: 'emerald-field-5017',
    shortId: 'gg88cc22',
    usedGb: 10,
    totalGb: 100,
    usagePercent: 10,
    storageClass: 'hdd-standard',
    status: 'stopped',
    createdAt: '2025-11-01T08:20:00',
    inUse: false,
  },
];

/** Distinct IDs for \"My storage\" tab */
const MOCK_MY_STORAGE_VOLUMES: VolumeItem[] = MOCK_PROJECT_VOLUMES.map((v, i) => ({
  ...v,
  id: `ms-${v.id}`,
  name: `${v.name}-mine`,
  shortId: v.shortId.split('').reverse().join('').slice(0, 8),
  usedGb: Math.min(v.totalGb, v.usedGb + (i % 3)),
}));

const MOCK_SHARES: ShareItem[] = [
  { id: 'sh-1', name: 'team-dataset-alpha', size: '200 GB', sharedWith: 8 },
  { id: 'sh-2', name: 'fine-tuned-weights-q4', size: '120 GB', sharedWith: 3 },
  { id: 'sh-3', name: 'evaluation-snapshots', size: '64 GB', sharedWith: 12 },
  { id: 'sh-4', name: 'shared-notebooks-cache', size: '32 GB', sharedWith: 5 },
  { id: 'sh-5', name: 'ml-artifacts-archive', size: '500 GB', sharedWith: 20 },
  { id: 'sh-6', name: 'tmp-scratch-exchange', size: '16 GB', sharedWith: 2 },
  { id: 'sh-7', name: 'public-benchmark-data', size: '256 GB', sharedWith: 45 },
  { id: 'sh-8', name: 'project-kafka-dump', size: '80 GB', sharedWith: 6 },
  { id: 'sh-9', name: 'legal-hold-volume', size: '40 GB', sharedWith: 4 },
];

const MOCK_SHARED_VOLUMES: SharedVolumeItem[] = [
  {
    id: 'sv-1',
    name: 'research-pool-ssd',
    size: '200 GB',
    permission: 'Write',
    sharedAt: '2026-01-04T10:00:00',
    expiresAt: '2026-04-04T23:59:59',
  },
  {
    id: 'sv-2',
    name: 'frozen-embeddings-v2',
    size: '450 GB',
    permission: 'Read',
    sharedAt: '2025-12-22T14:30:00',
    expiresAt: '2026-06-30T23:59:59',
  },
  {
    id: 'sv-3',
    name: 'platform-backup-weekly',
    size: '1024 GB',
    permission: 'Admin',
    sharedAt: '2025-12-01T09:00:00',
    expiresAt: '2027-12-01T09:00:00',
  },
  {
    id: 'sv-4',
    name: 'gpu-node-scratch',
    size: '64 GB',
    permission: 'Write',
    sharedAt: '2026-01-01T08:00:00',
    expiresAt: '2026-02-01T08:00:00',
  },
  {
    id: 'sv-5',
    name: 'label-studio-media',
    size: '180 GB',
    permission: 'Read',
    sharedAt: '2025-11-15T12:45:00',
    expiresAt: '2026-11-15T12:45:00',
  },
  {
    id: 'sv-6',
    name: 'cross-team-dataset',
    size: '320 GB',
    permission: 'Read',
    sharedAt: '2025-10-30T16:20:00',
    expiresAt: '2026-01-30T16:20:00',
  },
];

function formatCardDate(iso: string): string {
  const d = new Date(iso);
  const mon = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = String(d.getDate()).padStart(2, '0');
  const y = d.getFullYear();
  return `${mon} ${day}, ${y}`;
}

function PermissionRow({ permission }: { permission: SharedVolumeItem['permission'] }) {
  const icon =
    permission === 'Write' ? (
      <IconPencil size={14} className="text-[var(--color-text-subtle)]" />
    ) : permission === 'Read' ? (
      <IconEye size={14} className="text-[var(--color-text-subtle)]" />
    ) : (
      <IconShield size={14} className="text-[var(--color-text-subtle)]" />
    );

  return (
    <HStack gap={1.5} align="center" className="text-body-md text-[var(--color-text-default)]">
      {icon}
      <span>{permission}</span>
    </HStack>
  );
}

function VolumeCard({
  volume,
  onSnapshot,
  onShare,
  onEdit,
  onDelete,
}: {
  volume: VolumeItem;
  onSnapshot: (v: VolumeItem) => void;
  onShare: (v: VolumeItem) => void;
  onEdit: (v: VolumeItem) => void;
  onDelete: (v: VolumeItem) => void;
}) {
  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 hover:border-[var(--color-border-strong)] transition-colors"
      data-figma-name="[TDS] Volume card"
    >
      {/* Row 1: StatusIndicator + Name/ID + Percent/Size */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <HStack gap={3} align="start" className="min-w-0 flex-1">
          <StatusIndicator
            status={
              volume.status === 'running'
                ? 'active'
                : volume.status === 'error'
                  ? 'error'
                  : 'building'
            }
            layout="icon-only"
            size="sm"
          />
          <VStack gap={1} className="min-w-0 flex-1">
            <span className="text-heading-h5 text-[var(--color-text-default)] truncate block">
              {volume.name}
            </span>
            <span className="text-body-md text-[var(--color-text-subtle)]">{volume.shortId}</span>
          </VStack>
        </HStack>
        <VStack gap={1} align="end" className="shrink-0">
          <span className="text-heading-h5 text-[var(--color-text-default)] tabular-nums">
            {volume.usagePercent}%
          </span>
          <span className="text-body-md text-[var(--color-text-subtle)] tabular-nums">
            {volume.usedGb}GB / {volume.totalGb}GB
          </span>
        </VStack>
      </div>

      {/* Row 2: Metadata — Storage | Created at */}
      <HStack gap={2} align="center" className="text-body-sm">
        <HStack gap={1} align="center">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Storage</span>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            {volume.storageClass}
          </span>
        </HStack>
        <div className="w-px h-[10px] bg-[var(--color-border-default)]" />
        <HStack gap={1} align="center">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Created at</span>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            {formatCardDate(volume.createdAt)}
          </span>
        </HStack>
      </HStack>

      {/* Row 3: Action buttons — right aligned */}
      <HStack gap={1} justify="end" className="mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            stop(e);
            onSnapshot(volume);
          }}
        >
          Snapshot
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            stop(e);
            onShare(volume);
          }}
        >
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            stop(e);
            onEdit(volume);
          }}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            stop(e);
            onDelete(volume);
          }}
        >
          Delete
        </Button>
      </HStack>
    </div>
  );
}

function ShareVolumeCard({ share, onShare }: { share: ShareItem; onShare: () => void }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 hover:border-[var(--color-border-strong)] transition-colors"
      data-figma-name="[TDS] Share volume card"
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        <HStack gap={3} align="start" className="min-w-0 flex-1">
          <StatusIndicator status="active" layout="icon-only" size="sm" />
          <span className="text-heading-h5 text-[var(--color-text-default)] truncate block min-w-0 flex-1">
            {share.name}
          </span>
        </HStack>
        <span className="text-heading-h5 text-[var(--color-text-default)] tabular-nums shrink-0">
          {share.size}
        </span>
      </div>
      <span className="text-label-sm text-[var(--color-text-subtle)]">
        shared with: {share.sharedWith}
      </span>
      <div className="flex justify-end mt-auto">
        <Button variant="outline" size="sm" onClick={onShare}>
          Share
        </Button>
      </div>
    </div>
  );
}

function SharedWithMeCard({ item }: { item: SharedVolumeItem }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 hover:border-[var(--color-border-strong)] transition-colors"
      data-figma-name="[TDS] Shared volume card"
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        <HStack gap={3} align="start" className="min-w-0 flex-1">
          <StatusIndicator status="active" layout="icon-only" size="sm" />
          <span className="text-heading-h5 text-[var(--color-text-default)] truncate block min-w-0 flex-1">
            {item.name}
          </span>
        </HStack>
        <span className="text-heading-h5 text-[var(--color-text-default)] tabular-nums shrink-0">
          {item.size}
        </span>
      </div>
      <PermissionRow permission={item.permission} />
      <HStack gap={2} align="center" className="text-label-sm text-[var(--color-text-subtle)]">
        <span>Shared at: {formatCardDate(item.sharedAt)}</span>
        <span>Expires at: {formatCardDate(item.expiresAt)}</span>
      </HStack>
    </div>
  );
}

function HeaderStorageCard({
  title,
  used,
  total,
  unit = 'GB',
}: {
  title: string;
  used: number;
  total: number;
  unit?: string;
}) {
  const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="flex flex-col gap-2 justify-center rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-3 py-2 min-h-[40px]">
      <HStack gap={3} align="center" className="w-full">
        <span className="text-label-sm text-[var(--color-text-default)] whitespace-nowrap">
          {title}
        </span>
        <span className="text-label-sm text-[var(--color-text-subtle)] whitespace-nowrap">
          {used} {unit} / {total} {unit}
        </span>
      </HStack>
      <div className="flex h-1 w-full items-start isolate">
        <div
          className="h-1 rounded-full bg-[var(--color-text-subtle)] -mr-1 z-[2] shrink-0"
          style={{ width: `${percent}%` }}
        />
        <div className="flex-1 h-1 rounded-full bg-[var(--color-border-default)] z-[1]" />
      </div>
    </div>
  );
}

function InfoMetricCard({
  label,
  value,
  indicatorBg,
  icon,
}: {
  label: string;
  value: number;
  indicatorBg: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex-1 min-w-0 flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3">
      <VStack gap={1.5}>
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{value}</span>
      </VStack>
      <div
        className={`${indicatorBg} flex items-center justify-center rounded-full size-6 shrink-0`}
      >
        {icon}
      </div>
    </div>
  );
}

function filterVolumesByName(list: VolumeItem[], q: string): VolumeItem[] {
  const trimmed = q.trim().toLowerCase();
  if (!trimmed) return list;
  return list.filter((v) => v.name.toLowerCase().includes(trimmed));
}

function VolumeListSection({
  sourceVolumes,
  filteredVolumes,
  paginatedVolumes,
  searchToolbar,
  onSnapshot,
  onShare,
  onEdit,
  onDelete,
}: {
  sourceVolumes: VolumeItem[];
  filteredVolumes: VolumeItem[];
  paginatedVolumes: VolumeItem[];
  searchToolbar: ReactNode;
  onSnapshot: (v: VolumeItem) => void;
  onShare: (v: VolumeItem) => void;
  onEdit: (v: VolumeItem) => void;
  onDelete: (v: VolumeItem) => void;
}) {
  const runningCount = useMemo(
    () => sourceVolumes.filter((v) => v.status === 'running').length,
    [sourceVolumes]
  );
  const errorCount = useMemo(
    () => sourceVolumes.filter((v) => v.status === 'error').length,
    [sourceVolumes]
  );
  const inUseCount = useMemo(() => sourceVolumes.filter((v) => v.inUse).length, [sourceVolumes]);

  return (
    <VStack gap={3} className="pt-4">
      <div className="flex gap-2 w-full">
        <InfoMetricCard
          label="Running"
          value={runningCount}
          indicatorBg="bg-[#60a5fa]"
          icon={<IconPlayerPlay size={16} className="text-white" />}
        />
        <InfoMetricCard
          label="error"
          value={errorCount}
          indicatorBg="bg-[#f87171]"
          icon={<IconAlertTriangle size={16} className="text-white" />}
        />
        <InfoMetricCard
          label="In use"
          value={inUseCount}
          indicatorBg="bg-[var(--color-text-muted)]"
          icon={<IconCircleDot size={16} className="text-white" />}
        />
      </div>
      {searchToolbar}
      {filteredVolumes.length === 0 ? (
        <EmptyState
          variant="inline"
          icon={<IconDatabase size={48} stroke={1} />}
          title="No volumes found"
          description="Try adjusting your search."
        />
      ) : (
        <div className="grid grid-cols-3 gap-4 w-full">
          {paginatedVolumes.map((v) => (
            <VolumeCard
              key={v.id}
              volume={v}
              onSnapshot={onSnapshot}
              onShare={onShare}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </VStack>
  );
}

export function VolumesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [activeTab, setActiveTab] = useState<VolumeTab>('project-volumes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCreateSnapshotOpen, setIsCreateSnapshotOpen] = useState(false);
  const [isRestoreSnapshotOpen, setIsRestoreSnapshotOpen] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<VolumeItem | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);

  useEffect(() => {
    updateActiveTabLabel('Volumes');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredProjectVolumes = useMemo(
    () => filterVolumesByName(MOCK_PROJECT_VOLUMES, searchQuery),
    [searchQuery]
  );

  const filteredMyVolumes = useMemo(
    () => filterVolumesByName(MOCK_MY_STORAGE_VOLUMES, searchQuery),
    [searchQuery]
  );

  const projectVolumeTotalPages = Math.max(
    1,
    Math.ceil(filteredProjectVolumes.length / ITEMS_PER_PAGE)
  );
  const myVolumeTotalPages = Math.max(1, Math.ceil(filteredMyVolumes.length / ITEMS_PER_PAGE));

  const volumeTotalPages =
    activeTab === 'project-volumes'
      ? projectVolumeTotalPages
      : activeTab === 'my-storage'
        ? myVolumeTotalPages
        : 1;

  const filteredShares = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_SHARES;
    return MOCK_SHARES.filter((s) => s.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredSharedVolumes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_SHARED_VOLUMES;
    return MOCK_SHARED_VOLUMES.filter((s) => s.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const shareTotalPages = Math.max(1, Math.ceil(filteredShares.length / SHARE_ITEMS_PER_PAGE));
  const sharedVolTotalPages = Math.max(1, Math.ceil(filteredSharedVolumes.length / ITEMS_PER_PAGE));

  const paginatedProjectVolumes = useMemo(
    () =>
      filteredProjectVolumes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredProjectVolumes, currentPage]
  );

  const paginatedMyVolumes = useMemo(
    () => filteredMyVolumes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredMyVolumes, currentPage]
  );

  const paginatedShares = useMemo(
    () =>
      filteredShares.slice(
        (currentPage - 1) * SHARE_ITEMS_PER_PAGE,
        currentPage * SHARE_ITEMS_PER_PAGE
      ),
    [filteredShares, currentPage]
  );

  const paginatedSharedVolumes = useMemo(
    () =>
      filteredSharedVolumes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredSharedVolumes, currentPage]
  );

  useEffect(() => {
    const max =
      activeTab === 'project-volumes'
        ? projectVolumeTotalPages
        : activeTab === 'my-storage'
          ? myVolumeTotalPages
          : activeTab === 'my-shares'
            ? shareTotalPages
            : sharedVolTotalPages;
    setCurrentPage((p) => Math.min(p, max));
  }, [
    activeTab,
    projectVolumeTotalPages,
    myVolumeTotalPages,
    shareTotalPages,
    sharedVolTotalPages,
  ]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const openSnapshot = useCallback((v: VolumeItem) => {
    setSelectedVolume(v);
    setIsSnapshotOpen(true);
  }, []);

  const openShareVolume = useCallback((v: VolumeItem) => {
    setSelectedVolume(v);
    setIsShareOpen(true);
  }, []);

  const openEdit = useCallback((v: VolumeItem) => {
    setSelectedVolume(v);
    setIsEditOpen(true);
  }, []);

  const openDelete = useCallback((v: VolumeItem) => {
    setSelectedVolume(v);
  }, []);

  const listPagination =
    activeTab === 'project-volumes' || activeTab === 'my-storage' ? (
      <Pagination
        currentPage={currentPage}
        totalPages={volumeTotalPages}
        onPageChange={setCurrentPage}
        totalItems={
          activeTab === 'project-volumes' ? filteredProjectVolumes.length : filteredMyVolumes.length
        }
        selectedCount={0}
      />
    ) : activeTab === 'my-shares' ? (
      <Pagination
        currentPage={currentPage}
        totalPages={shareTotalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredShares.length}
        selectedCount={0}
      />
    ) : (
      <Pagination
        currentPage={currentPage}
        totalPages={sharedVolTotalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredSharedVolumes.length}
        selectedCount={0}
      />
    );

  const searchBlock = (
    <>
      <SearchInput
        size="sm"
        placeholder="Find volumes with filters"
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleSearchClear}
        className="w-[280px]"
        aria-label="Search volumes by name"
      />
      {listPagination}
    </>
  );

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={<Breadcrumb items={[{ label: 'Infrastructure' }, { label: 'Volumes' }]} />}
          actions={
            <button
              type="button"
              className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={3} className="pb-20">
        <PageHeader
          title="Volumes"
          actions={
            <HStack gap={3} align="center">
              <HStack gap={2} align="center">
                <HeaderStorageCard title="Storage Usage" used={20} total={500} />
                <HeaderStorageCard title="Personal Storage / Custom" used={25} total={100} />
              </HStack>
              <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
                Create volume
              </Button>
            </HStack>
          }
        />

        <Tabs
          value={activeTab}
          onChange={(v) => setActiveTab(v as VolumeTab)}
          variant="underline"
          size="sm"
        >
          <TabList>
            <Tab value="project-volumes">Project volumes</Tab>
            <Tab value="my-storage">My storage</Tab>
            <Tab value="my-shares">My shares</Tab>
            <Tab value="shared-volumes">Shared volumes</Tab>
          </TabList>

          <TabPanel value="project-volumes" className="pt-0">
            <VolumeListSection
              sourceVolumes={MOCK_PROJECT_VOLUMES}
              filteredVolumes={filteredProjectVolumes}
              paginatedVolumes={paginatedProjectVolumes}
              searchToolbar={searchBlock}
              onSnapshot={openSnapshot}
              onShare={openShareVolume}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </TabPanel>

          <TabPanel value="my-storage" className="pt-0">
            <VolumeListSection
              sourceVolumes={MOCK_MY_STORAGE_VOLUMES}
              filteredVolumes={filteredMyVolumes}
              paginatedVolumes={paginatedMyVolumes}
              searchToolbar={searchBlock}
              onSnapshot={openSnapshot}
              onShare={openShareVolume}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </TabPanel>

          <TabPanel value="my-shares" className="pt-0">
            <VStack gap={3} className="pt-4">
              {searchBlock}
              {filteredShares.length === 0 ? (
                <EmptyState
                  variant="inline"
                  icon={<IconDatabase size={48} stroke={1} />}
                  title="No shares found"
                  description="Try adjusting your search."
                />
              ) : (
                <div className="grid grid-cols-4 gap-4 w-full">
                  {paginatedShares.map((s) => (
                    <ShareVolumeCard key={s.id} share={s} onShare={() => setIsShareOpen(true)} />
                  ))}
                </div>
              )}
            </VStack>
          </TabPanel>

          <TabPanel value="shared-volumes" className="pt-0">
            <VStack gap={3} className="pt-4">
              {searchBlock}
              {filteredSharedVolumes.length === 0 ? (
                <EmptyState
                  variant="inline"
                  icon={<IconDatabase size={48} stroke={1} />}
                  title="No shared volumes"
                  description="Try adjusting your search."
                />
              ) : (
                <div className="grid grid-cols-3 gap-4 w-full">
                  {paginatedSharedVolumes.map((item) => (
                    <SharedWithMeCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      <CreateVolumeDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditVolumeDrawer
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedVolume(null);
        }}
        volume={
          selectedVolume
            ? {
                id: selectedVolume.id,
                name: selectedVolume.name,
                description: '',
                sizeGb: selectedVolume.totalGb,
                storageClass: selectedVolume.storageClass,
                accessMode: 'ReadWriteMany (RWX) - Multiple Pods read/write',
                mountPath: '/workspace',
                autoBackup: true,
              }
            : null
        }
      />
      <SnapshotDrawer
        isOpen={isSnapshotOpen}
        onClose={() => {
          setIsSnapshotOpen(false);
          setSelectedVolume(null);
        }}
        volumeName={selectedVolume?.name}
        onCreateSnapshot={() => {
          setIsCreateSnapshotOpen(true);
        }}
        onRestoreSnapshot={(snapshot: any) => {
          setSelectedSnapshot(snapshot);
          setIsRestoreSnapshotOpen(true);
        }}
      />
      <CreateSnapshotDrawer
        isOpen={isCreateSnapshotOpen}
        onClose={() => setIsCreateSnapshotOpen(false)}
      />
      <RestoreSnapshotDrawer
        isOpen={isRestoreSnapshotOpen}
        onClose={() => {
          setIsRestoreSnapshotOpen(false);
          setSelectedSnapshot(null);
        }}
        snapshot={
          selectedSnapshot
            ? {
                name: selectedSnapshot.name ?? 'snapshot-001',
                volumeName: selectedVolume?.name ?? '',
                createdAt: selectedSnapshot.createdAt ?? 'Sep 26, 2025',
                sizeGb: 20,
              }
            : null
        }
      />
      <AddShareDrawer isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </PageShell>
  );
}

export default VolumesPage;
