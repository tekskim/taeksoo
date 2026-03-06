import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  SectionCard,
  SearchInput,
  Table,
  Pagination,
  StatusIndicator,
  ContextMenu,
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconBell,
  IconTrash,
  IconChevronDown,
  IconDotsCircleHorizontal,
  IconExternalLink,
  IconDownload,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type VolumeStatus = 'available' | 'in-use' | 'error' | 'creating' | 'deleting';
type SnapshotStatus = 'available' | 'creating' | 'deleting' | 'error';
type BackupStatus = 'available' | 'creating' | 'restoring' | 'error';

interface VolumeDetail {
  id: string;
  name: string;
  status: VolumeStatus;
  size: string;
  createdAt: string;
  // Basic information
  volumeName: string;
  availabilityZone: string;
  description: string;
  // Attachments
  attachedTo: string | null;
  attachedToId: string | null;
  // Source
  dataSourceType: string;
  // Specifications
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

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Volume data map by ID - synced with VolumesPage mock data
const mockVolumesMap: Record<string, VolumeDetail> = {
  'vol-001': {
    id: 'vol-001',
    name: 'db-data',
    status: 'in-use',
    size: '1500GiB',
    createdAt: 'Sep 12, 2025',
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
    createdAt: 'Sep 10, 2025',
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
    createdAt: 'Sep 8, 2025',
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
    createdAt: 'Sep 5, 2025',
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
    createdAt: 'Aug 30, 2025',
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
    createdAt: 'Aug 25, 2025',
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
    createdAt: 'Aug 20, 2025',
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
    createdAt: 'Aug 15, 2025',
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
    createdAt: 'Aug 10, 2025',
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
    createdAt: 'Aug 5, 2025',
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

// Mock volume snapshots
const mockVolumeSnapshots: VolumeSnapshot[] = Array.from({ length: 115 }, (_, i) => ({
  id: `snap-${String(i + 1).padStart(3, '0')}`,
  name: `vol-snap-${String(34 + i).padStart(2, '0')}`,
  status: 'available' as SnapshotStatus,
  size: '1500GiB',
  createdAt: 'Sep 12, 2025',
}));

// Mock volume backups
const mockVolumeBackups: VolumeBackup[] = Array.from({ length: 115 }, (_, i) => ({
  id: `backup-${String(i + 1).padStart(3, '0')}`,
  name: `vol-backup-${String(34 + i).padStart(2, '0')}`,
  status: 'available' as BackupStatus,
  backupMode: 'Full Backup',
  size: '1500GiB',
  createdAt: 'Sep 12, 2025',
}));

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const volumeStatusDisplayMap: Record<VolumeStatus, string> = {
  available: 'Available',
  'in-use': 'In Use',
  error: 'Error',
  creating: 'Creating',
  deleting: 'Deleting',
};

const snapshotStatusMap: Record<SnapshotStatus, 'active' | 'building' | 'error' | 'pending'> = {
  available: 'active',
  creating: 'building',
  deleting: 'pending',
  error: 'error',
};

const backupStatusMap: Record<BackupStatus, 'active' | 'building' | 'error' | 'pending'> = {
  available: 'active',
  creating: 'building',
  restoring: 'pending',
  error: 'error',
};

/* ----------------------------------------
   Volume Detail Page
   ---------------------------------------- */

export function VolumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const volume = id ? mockVolumesMap[id] || defaultVolumeDetail : defaultVolumeDetail;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Snapshots tab state
  const [snapshotSearchQuery, setSnapshotSearchQuery] = useState('');
  const [snapshotCurrentPage, setSnapshotCurrentPage] = useState(1);
  const snapshotsPerPage = 10;

  // Backups tab state
  const [backupSearchQuery, setBackupSearchQuery] = useState('');
  const [backupCurrentPage, setBackupCurrentPage] = useState(1);
  const backupsPerPage = 10;

  // Preferences state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Volume data is already fetched based on ID above
  const snapshots = mockVolumeSnapshots;
  const backups = mockVolumeBackups;

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label to volume name
  useEffect(() => {
    if (volume.name) {
      updateActiveTabLabel(volume.name);
    }
  }, [volume.name, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Proj-1', href: '#' },
    { label: 'Volumes', href: '/compute/volumes' },
    { label: volume.name, href: `/volumes/${volume.id}` },
  ];

  // Filter snapshots by search query
  const filteredSnapshots = useMemo(() => {
    if (!snapshotSearchQuery) return snapshots;
    const query = snapshotSearchQuery.toLowerCase();
    return snapshots.filter(
      (snap) => snap.name.toLowerCase().includes(query) || snap.id.toLowerCase().includes(query)
    );
  }, [snapshots, snapshotSearchQuery]);

  const snapshotTotalPages = Math.ceil(filteredSnapshots.length / snapshotsPerPage);
  const paginatedSnapshots = filteredSnapshots.slice(
    (snapshotCurrentPage - 1) * snapshotsPerPage,
    snapshotCurrentPage * snapshotsPerPage
  );

  // Filter backups by search query
  const filteredBackups = useMemo(() => {
    if (!backupSearchQuery) return backups;
    const query = backupSearchQuery.toLowerCase();
    return backups.filter(
      (backup) =>
        backup.name.toLowerCase().includes(query) || backup.id.toLowerCase().includes(query)
    );
  }, [backups, backupSearchQuery]);

  const backupTotalPages = Math.ceil(filteredBackups.length / backupsPerPage);
  const paginatedBackups = filteredBackups.slice(
    (backupCurrentPage - 1) * backupsPerPage,
    backupCurrentPage * backupsPerPage
  );

  // Context menu items for snapshot actions
  const getSnapshotContextMenuItems = (_snapshot: VolumeSnapshot): ContextMenuItem[] => [
    { id: 'create-volume', label: 'Create volume', onClick: () => {} },
    { id: 'edit', label: 'Edit', onClick: () => {} },
    { id: 'delete', label: 'Delete', onClick: () => {}, status: 'danger' },
  ];

  // Context menu items for backup actions
  const getBackupContextMenuItems = (_backup: VolumeBackup): ContextMenuItem[] => [
    { id: 'create-volume', label: 'Create volume', onClick: () => {} },
    { id: 'restore-backup', label: 'Restore backup', onClick: () => {} },
    { id: 'edit', label: 'Edit', onClick: () => {} },
    { id: 'delete', label: 'Delete', onClick: () => {}, status: 'danger' },
  ];

  // Snapshot table columns
  const snapshotColumns: TableColumn<VolumeSnapshot>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={snapshotStatusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/volume-snapshots/${row.id}`}
            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      flex: 1,
      minWidth: columnMinWidths.action,
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center">
          <ContextMenu items={getSnapshotContextMenuItems(row)} trigger="click" align="right">
            <button
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
              onClick={(e) => e.stopPropagation()}
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  // Backup table columns
  const backupColumns: TableColumn<VolumeBackup>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={backupStatusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to={`/compute/volume-backups/${row.id}`}
            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </Link>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'backupMode',
      label: 'Backup mode',
      flex: 1,
      minWidth: columnMinWidths.backupMode,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      flex: 1,
      minWidth: columnMinWidths.action,
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center">
          <ContextMenu items={getBackupContextMenuItems(row)} trigger="click" align="right">
            <button
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
              onClick={(e) => e.stopPropagation()}
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Volume Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{volume.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
              Create transfer
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
            <ContextMenu
              items={
                [
                  {
                    id: 'data-protection',
                    label: 'Data protection',
                    onClick: () => console.log('Data protection'),
                  },
                  { id: 'operate', label: 'Operate', onClick: () => console.log('Operate') },
                  {
                    id: 'configuration',
                    label: 'Configuration',
                    submenu: [
                      {
                        id: 'extend-volume',
                        label: 'Extend volume',
                        onClick: () => console.log('Extend volume'),
                      },
                      {
                        id: 'change-type',
                        label: 'Change type',
                        onClick: () => console.log('Change type'),
                      },
                    ],
                  },
                  { id: 'edit', label: 'Edit', onClick: () => console.log('Edit') },
                ] as ContextMenuItem[]
              }
              trigger="click"
            >
              <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                More Actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={volumeStatusDisplayMap[volume.status]}
              status="active"
            />
            <DetailHeader.InfoCard label="ID" value={volume.id} copyable />
            <DetailHeader.InfoCard label="Size" value={volume.size} />
            <DetailHeader.InfoCard label="Created at" value={volume.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Volume Tabs */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="snapshots">Volume snapshots</Tab>
              <Tab value="backups">Volume backups</Tab>
            </TabList>

            {/* Details Tab Panel */}
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic information */}
                <SectionCard>
                  <SectionCard.Header title="Basic information" showEditButton onEdit={() => {}} />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Volume name" value={volume.volumeName} />
                    <SectionCard.DataRow
                      label="AZ(Availability zone)"
                      value={volume.availabilityZone}
                    />
                    <SectionCard.DataRow label="Description" value={volume.description} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Attachments */}
                <SectionCard>
                  <SectionCard.Header title="Attachments" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Attached to"
                      value={
                        volume.attachedTo && volume.attachedToId ? (
                          <Link
                            to={`/compute/instances/${volume.attachedToId}`}
                            className="inline-flex items-center gap-1.5 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
                          >
                            {volume.attachedTo}
                            <IconExternalLink
                              size={12}
                              className="text-[var(--color-action-primary)]"
                            />
                          </Link>
                        ) : (
                          '-'
                        )
                      }
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Source */}
                <SectionCard>
                  <SectionCard.Header title="Source" showEditButton onEdit={() => {}} />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Data source Type" value={volume.dataSourceType} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Specifications */}
                <SectionCard>
                  <SectionCard.Header title="Specifications" showEditButton onEdit={() => {}} />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Size" value={volume.size} />
                    <SectionCard.DataRow label="Volume type" value={volume.volumeType} />
                    <SectionCard.DataRow label="Bootable" value={volume.bootable ? 'Yes' : 'No'} />
                    <SectionCard.DataRow
                      label="Encryption"
                      value={volume.encryption ? 'Yes' : 'No'}
                    />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Volume snapshots Tab Panel */}
            <TabPanel value="snapshots" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                    Volume snapshots
                  </h2>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Create Snapshot
                  </Button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-1">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      placeholder="Search snapshot by attributes"
                      value={snapshotSearchQuery}
                      onChange={(e) => setSnapshotSearchQuery(e.target.value)}
                      onClear={() => setSnapshotSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconOnly
                    icon={<IconDownload size={12} stroke={1.5} />}
                    aria-label="Download"
                  />
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={snapshotCurrentPage}
                  totalPages={snapshotTotalPages}
                  onPageChange={setSnapshotCurrentPage}
                  totalItems={filteredSnapshots.length}
                />

                {/* Snapshots Table */}
                <Table<VolumeSnapshot>
                  columns={snapshotColumns}
                  data={paginatedSnapshots}
                  rowKey="id"
                  emptyMessage="No volume snapshots found"
                />
              </VStack>
            </TabPanel>

            {/* Volume backups Tab Panel */}
            <TabPanel value="backups" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                    Volume backups
                  </h2>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Create Backup
                  </Button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-1">
                  <div className="w-[var(--search-input-width)]">
                    <SearchInput
                      placeholder="Search backup by attributes"
                      value={backupSearchQuery}
                      onChange={(e) => setBackupSearchQuery(e.target.value)}
                      onClear={() => setBackupSearchQuery('')}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconOnly
                    icon={<IconDownload size={12} stroke={1.5} />}
                    aria-label="Download"
                  />
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={backupCurrentPage}
                  totalPages={backupTotalPages}
                  onPageChange={setBackupCurrentPage}
                  totalItems={filteredBackups.length}
                />

                {/* Backups Table */}
                <Table<VolumeBackup>
                  columns={backupColumns}
                  data={paginatedBackups}
                  rowKey="id"
                  emptyMessage="No volume backups found"
                />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default VolumeDetailPage;
