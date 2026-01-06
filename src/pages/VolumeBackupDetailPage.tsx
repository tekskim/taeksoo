import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconTrash,
  IconEdit,
  IconBell,
  IconExternalLink,
  IconRestore,
} from '@tabler/icons-react';

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

const mockBackupDetails: Record<string, VolumeBackupDetail> = {
  'vbak-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'db-data-backup',
    status: 'available',
    size: '1500 GiB',
    createdAt: '2025-07-25 09:12:20',
    description: 'Database data backup for production',
    sourceVolume: 'vol-1',
    sourceVolumeId: 'vol-001',
    backupMode: 'Full Backup',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-002': {
    id: '8395d0285f92542f04171b0ccd3deafe',
    name: 'app-storage-backup',
    status: 'available',
    size: '500 GiB',
    createdAt: '2025-09-10 14:30:00',
    description: 'Application storage backup',
    sourceVolume: 'app-volume-1',
    sourceVolumeId: 'vol-002',
    backupMode: 'Incremental',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
  'vbak-003': {
    id: '9406e1396g03653g15282c1dde4efbfg',
    name: 'backup-vol-backup',
    status: 'available',
    size: '2000 GiB',
    createdAt: '2025-09-08 10:15:00',
    description: 'Backup volume snapshot',
    sourceVolume: 'backup-storage',
    sourceVolumeId: 'vol-003',
    backupMode: 'Full Backup',
    container: 'cinder-backups',
    availabilityZone: 'nova',
  },
};

// Default backup for unknown IDs
const defaultBackup: VolumeBackupDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'vol-backup-1',
  status: 'available',
  size: '1500 GiB',
  createdAt: '2025-07-25 09:12:20',
  description: '-',
  sourceVolume: 'web-server-10',
  sourceVolumeId: 'vol-001',
  backupMode: 'Full Backup',
  container: 'cinder-backups',
  availabilityZone: 'nova',
};

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const statusDisplayMap: Record<BackupStatus, string> = {
  'available': 'Available',
  'creating': 'Creating',
  'restoring': 'Restoring',
  'error': 'Error',
  'deleting': 'Deleting',
};

const statusIndicatorMap: Record<BackupStatus, 'active' | 'building' | 'error' | 'pending'> = {
  'available': 'active',
  'creating': 'building',
  'restoring': 'building',
  'error': 'error',
  'deleting': 'pending',
};

/* ----------------------------------------
   Volume Backup Detail Page
   ---------------------------------------- */

export function VolumeBackupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  
  // Get backup data based on the ID
  const backup = id && mockBackupDetails[id] ? mockBackupDetails[id] : defaultBackup;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Volumes', href: '/compute/volume-backups' },
    { label: backup.name },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Backup Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{backup.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Create Volume
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconRestore size={12} />}>
                    Restore Backup
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
                  <DetailHeader.InfoCard label="Size" value={backup.size} />
                  <DetailHeader.InfoCard label="Created At" value={backup.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Backup Tabs */}
              <div className="w-full">
                <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="details">Details</Tab>
                  </TabList>

                  {/* Details Tab Panel */}
                  <TabPanel value="details">
                    <VStack gap={4} className="pt-6">
                      {/* Basic Information */}
                      <SectionCard>
                        <SectionCard.Header 
                          title="Basic Infomation" 
                          actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>Edit</Button>}
                        />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Volume Backup Name" value={backup.name} />
                          <SectionCard.DataRow label="Description" value={backup.description} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Source */}
                      <SectionCard>
                        <SectionCard.Header title="Source" />
                        <SectionCard.Content>
                          <div className="flex flex-col gap-3 w-full">
                            <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                                Volume
                              </span>
                              <Link 
                                to={`/volumes/${backup.sourceVolumeId}`}
                                className="inline-flex items-center gap-1.5 text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
                              >
                                {backup.sourceVolume}
                                <IconExternalLink size={12} stroke={1.5} />
                              </Link>
                            </div>
                          </div>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Specifications */}
                      <SectionCard>
                        <SectionCard.Header title="Specifications" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Size" value={backup.size} />
                        </SectionCard.Content>
                      </SectionCard>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

