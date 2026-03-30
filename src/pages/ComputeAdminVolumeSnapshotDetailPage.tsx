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
import { IconCirclePlus, IconTrash, IconBell, IconSettings } from '@tabler/icons-react';

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
    createdAt: 'Jul 25, 2025 10:32:16',
    description: '-',
    sourceVolume: 'web-server-10',
    sourceVolumeId: 'vol-001',
  },
  'vsnap-002': {
    id: '8395d0285f92542f04171b0ccd3deafe',
    name: 'app-storage-snap',
    status: 'available',
    size: '500 GiB',
    createdAt: 'Sep 10, 2025 01:17:01',
    description: 'Application storage snapshot',
    sourceVolume: 'app-volume-1',
    sourceVolumeId: 'vol-002',
  },
  'vsnap-003': {
    id: '9406e1396g03653g15282c1dde4efbfg',
    name: 'backup-vol-snap',
    status: 'available',
    size: '2000 GiB',
    createdAt: 'Sep 8, 2025 11:51:27',
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
  createdAt: 'Jul 25, 2025 10:32:16',
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

export function ComputeAdminVolumeSnapshotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

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
    { label: 'Compute Admin', href: '/' },
    { label: 'Volume snapshots', href: '/compute-admin/volume-snapshots' },
    { label: snapshot.name },
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
          onBack={() => navigate('/volume-snapshots')}
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
        {/* Snapshot Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{snapshot.name}</DetailHeader.Title>
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
              value={statusDisplayMap[snapshot.status]}
              status={statusIndicatorMap[snapshot.status]}
            />
            <DetailHeader.InfoCard label="ID" value={snapshot.id} copyable />
            <DetailHeader.InfoCard label="Tenant" value="tenantA" />
            <DetailHeader.InfoCard label="Host" value="host" />
            <DetailHeader.InfoCard label="Size" value={snapshot.size} />
            <DetailHeader.InfoCard label="Created at" value={snapshot.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Snapshot Tabs */}
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
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Volume snapshot name" value={snapshot.name} />
                    <SectionCard.DataRow label="Description" value={snapshot.description} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Source */}
                <SectionCard>
                  <SectionCard.Header title="Source" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="Volume"
                      value={snapshot.sourceVolume}
                      isLink
                      linkHref={`/compute-admin/volumes/${snapshot.sourceVolumeId}`}
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Specifications */}
                <SectionCard>
                  <SectionCard.Header title="Specifications" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Size" value={snapshot.size} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Metadata */}
                <SectionCard>
                  <SectionCard.Header title="Metadata" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="{metadata}" value="{value}" />
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
