import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  PageShell,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconCirclePlus, IconTrash, IconEdit, IconBell, IconSettings } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type BackupStatus = 'available' | 'creating' | 'restoring' | 'error' | 'deleting';
type BackupMode = 'Full Backup' | 'Incremental';

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

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

// Volume backup data map by ID - synced with VolumeBackupsPage mock data
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

// Default backup for unknown IDs
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

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const statusDisplayMap: Record<BackupStatus, string> = {
  available: 'Available',
  creating: 'Creating',
  restoring: 'Restoring',
  error: 'Error',
  deleting: 'Deleting',
};

const statusIndicatorMap: Record<BackupStatus, 'active' | 'building' | 'error' | 'pending'> = {
  available: 'active',
  creating: 'building',
  restoring: 'building',
  error: 'error',
  deleting: 'pending',
};

/* ----------------------------------------
   Volume backup Detail Page
   ---------------------------------------- */

export function ComputeAdminVolumeBackupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Get backup data based on the ID
  const backup = id && mockBackupDetails[id] ? mockBackupDetails[id] : defaultBackup;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to backup name
  useEffect(() => {
    if (backup.name) {
      updateActiveTabLabel(backup.name);
    }
  }, [backup.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/' },
    { label: 'Volumes', href: '/compute-admin/volume-backups' },
    { label: backup.name },
  ];

  return (
    <PageShell
      sidebar={
        <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate('/volume-backups')}
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
        {/* Backup Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{backup.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
              Update status
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconSettings size={12} />}>
              Manage metadata
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={statusDisplayMap[backup.status]}
              status={statusIndicatorMap[backup.status]}
            />
            <DetailHeader.InfoCard label="ID" value={backup.id} copyable />
            <DetailHeader.InfoCard label="Tenant" value="tenantA" />
            <DetailHeader.InfoCard label="Size" value={backup.size} />
            <DetailHeader.InfoCard label="Created at" value={backup.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Backup Tabs */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
            </TabList>

            {/* Details Tab Panel */}
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic information */}
                <SectionCard>
                  <SectionCard.Header
                    title="Basic information"
                    actions={
                      <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                        Edit
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Volume backup Name" value={backup.name} />
                    <SectionCard.DataRow label="Description" value={backup.description} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Source */}
                <SectionCard>
                  <SectionCard.Header title="Source" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Volume"
                      value={backup.sourceVolume}
                      isLink
                      linkHref={`/compute-admin/volumes/${backup.sourceVolumeId}`}
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Specifications */}
                <SectionCard>
                  <SectionCard.Header title="Specifications" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Backup mode" value="Full backup" />
                    <SectionCard.DataRow label="Size" value={backup.size} />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}
