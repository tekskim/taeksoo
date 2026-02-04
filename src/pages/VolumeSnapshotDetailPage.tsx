import { useState, useEffect } from 'react';
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
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SnapshotStatus = 'available' | 'creating' | 'error' | 'deleting';

interface VolumeSnapshotDetail {
  id: string;
  name: string;
  status: SnapshotStatus;
  size: string;
  createdAt: string;
  description: string;
  sourceVolume: string;
  sourceVolumeId: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSnapshotDetails: Record<string, VolumeSnapshotDetail> = {
  'vsnap-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'db-data-snap',
    status: 'available',
    size: '1500 GiB',
    createdAt: '2025-07-25 09:12:20',
    description: '-',
    sourceVolume: 'web-server-10',
    sourceVolumeId: 'vol-001',
  },
  'vsnap-002': {
    id: '8395d0285f92542f04171b0ccd3deafe',
    name: 'app-storage-snap',
    status: 'available',
    size: '500 GiB',
    createdAt: '2025-09-10 14:30:00',
    description: 'Application storage snapshot',
    sourceVolume: 'app-volume-1',
    sourceVolumeId: 'vol-002',
  },
  'vsnap-003': {
    id: '9406e1396g03653g15282c1dde4efbfg',
    name: 'backup-vol-snap',
    status: 'available',
    size: '2000 GiB',
    createdAt: '2025-09-08 10:15:00',
    description: 'Backup volume snapshot',
    sourceVolume: 'backup-storage',
    sourceVolumeId: 'vol-003',
  },
};

// Default snapshot for unknown IDs
const defaultSnapshot: VolumeSnapshotDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'vol-snap-1',
  status: 'available',
  size: '1500 GiB',
  createdAt: '2025-07-25 09:12:20',
  description: '-',
  sourceVolume: 'web-server-10',
  sourceVolumeId: 'vol-001',
};

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const statusDisplayMap: Record<SnapshotStatus, string> = {
  available: 'Available',
  creating: 'Creating',
  error: 'Error',
  deleting: 'Deleting',
};

const statusIndicatorMap: Record<SnapshotStatus, 'active' | 'building' | 'error' | 'pending'> = {
  available: 'active',
  creating: 'building',
  error: 'error',
  deleting: 'pending',
};

/* ----------------------------------------
   Volume snapshot Detail Page
   ---------------------------------------- */

export function VolumeSnapshotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');

  // Get snapshot data based on the ID
  const snapshot = id && mockSnapshotDetails[id] ? mockSnapshotDetails[id] : defaultSnapshot;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label when snapshot name changes
  useEffect(() => {
    if (snapshot.name) {
      updateActiveTabLabel(snapshot.name);
    }
  }, [snapshot.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Proj-1', href: '/' },
    { label: 'Volume snapshots', href: '/compute/volume-snapshots' },
    { label: snapshot.name },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
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
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => navigate('/volume-snapshots')}
            onForward={() => window.history.forward()}
            breadcrumb={<Breadcrumb items={breadcrumbItems} />}
            actions={
              <TopBarAction
                icon={<IconBell size={12} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Snapshot Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{snapshot.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                    Create volume
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={statusDisplayMap[snapshot.status]}
                    status={statusIndicatorMap[snapshot.status]}
                  />
                  <DetailHeader.InfoCard label="ID" value={snapshot.id} copyable />
                  <DetailHeader.InfoCard label="Size" value={snapshot.size} />
                  <DetailHeader.InfoCard label="Created at" value={snapshot.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Snapshot Tabs */}
              <div className="w-full">
                <Tabs
                  value={activeDetailTab}
                  onChange={setActiveDetailTab}
                  variant="underline"
                  size="sm"
                >
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
                          <SectionCard.DataRow label="Volume snapshot name" value={snapshot.name} />
                          <SectionCard.DataRow label="Description" value={snapshot.description} />
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Source */}
                      <SectionCard>
                        <SectionCard.Header title="Source" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Volume">
                            <Link
                              to={`/compute/volumes/${snapshot.sourceVolumeId}`}
                              className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {snapshot.sourceVolume}
                              <IconExternalLink size={16} stroke={1.5} />
                            </Link>
                          </SectionCard.DataRow>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Specifications */}
                      <SectionCard>
                        <SectionCard.Header title="Specifications" />
                        <SectionCard.Content>
                          <SectionCard.DataRow label="Size" value={snapshot.size} />
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
