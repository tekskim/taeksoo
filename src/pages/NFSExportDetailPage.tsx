import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  Table,
  PageShell,
  columnMinWidths,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTrash, IconEdit } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface NFSExportDetail {
  id: string;
  accessType: string;
  cephfsFilesystem: string;
  cephfsUser: string;
  cluster: string;
  nfsProtocol: string;
  path: string;
  pseudo: string;
  securityLabel: string;
  squash: string;
  storageBackend: string;
  transport: string;
}

interface NFSClient {
  id: string;
  addresses: string;
  accessType: string;
  squash: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNFSExportDetails: Record<string, NFSExportDetail> = {
  'nfs-1': {
    id: 'nfs-1',
    accessType: 'RW',
    cephfsFilesystem: 'perf-test-hdd',
    cephfsUser: 'nfs.nfs-cephfs.perf-test-hdd.72954886',
    cluster: 'nfs-cephfs',
    nfsProtocol: 'NFSv4',
    path: '/volumes/_nogroup/data/16372efe-f02b-4c3b-b6a7-35daa2e66951',
    pseudo: '/perf-test-hdd/data',
    securityLabel: '',
    squash: 'None',
    storageBackend: 'CephFS',
    transport: 'TCP',
  },
  'nfs-2': {
    id: 'nfs-2',
    accessType: 'RW',
    cephfsFilesystem: 'perf-test',
    cephfsUser: 'nfs.nfs-cephfs.perf-test.83012456',
    cluster: 'nfs-cephfs',
    nfsProtocol: 'NFSv4',
    path: '/volumes/_nogroup/data/b7193136-465f-411a-99dc-e796a9a45871',
    pseudo: '/perf-test/data',
    securityLabel: '',
    squash: 'None',
    storageBackend: 'CephFS',
    transport: 'TCP',
  },
  'nfs-3': {
    id: 'nfs-3',
    accessType: 'RW',
    cephfsFilesystem: 'ai-platform',
    cephfsUser: 'nfs.nfs-cephfs.ai-platform.59201743',
    cluster: 'nfs-cephfs',
    nfsProtocol: 'NFSv4',
    path: '/volumes/_nogroup/data/f3870068-7314-400c-ac04-c810c343eeba',
    pseudo: '/ai-platform/data',
    securityLabel: '',
    squash: 'None',
    storageBackend: 'CephFS',
    transport: 'TCP',
  },
};

const mockClients: NFSClient[] = [];

/* ----------------------------------------
   NFS Export Detail Page
   ---------------------------------------- */

export function NFSExportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const exportData = id ? mockNFSExportDetails[id] : undefined;

  useEffect(() => {
    if (exportData?.pseudo) {
      updateActiveTabLabel(exportData.pseudo);
    }
  }, [exportData?.pseudo, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const clientColumns: TableColumn<NFSClient>[] = [
    {
      key: 'addresses',
      label: 'Addresses',
      flex: 2,
      minWidth: columnMinWidths.nameWide,
      sortable: true,
    },
    {
      key: 'accessType',
      label: 'Access Type',
      flex: 1,
      minWidth: columnMinWidths.status,
      sortable: true,
    },
    {
      key: 'squash',
      label: 'Squash',
      flex: 1,
      minWidth: columnMinWidths.status,
      sortable: true,
    },
  ];

  if (!exportData) {
    return (
      <PageShell
        sidebar={
          <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
        }
        sidebarWidth={sidebarWidth}
        topBar={
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/storage' },
                  { label: 'NFS', href: '/storage/nfs' },
                  { label: 'Not Found' },
                ]}
              />
            }
          />
        }
      >
        <div className="p-8 text-[var(--color-text-muted)]">NFS export not found.</div>
      </PageShell>
    );
  }

  return (
    <PageShell
      sidebar={
        <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Home', href: '/storage' },
                { label: 'NFS', href: '/storage/nfs' },
                { label: exportData.pseudo },
              ]}
            />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6} className="min-w-[1176px]">
        <DetailHeader>
          <DetailHeader.Title>{exportData.pseudo}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
              Delete
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} stroke={1.5} />}>
              Edit
            </Button>
          </DetailHeader.Actions>
        </DetailHeader>

        <div className="w-full">
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="clients">Clients ({mockClients.length})</Tab>
            </TabList>

            <TabPanel value="details" className="pt-4">
              <SectionCard>
                <SectionCard.Content>
                  <SectionCard.DataRow label="Access Type" value={exportData.accessType} />
                  <SectionCard.DataRow
                    label="CephFS Filesystem"
                    value={exportData.cephfsFilesystem}
                  />
                  <SectionCard.DataRow label="CephFS User" value={exportData.cephfsUser} />
                  <SectionCard.DataRow label="Cluster" value={exportData.cluster} />
                  <SectionCard.DataRow label="NFS Protocol" value={exportData.nfsProtocol} />
                  <SectionCard.DataRow label="Path" value={exportData.path} />
                  <SectionCard.DataRow label="Pseudo" value={exportData.pseudo} />
                  <SectionCard.DataRow
                    label="Security Label"
                    value={exportData.securityLabel || '-'}
                  />
                  <SectionCard.DataRow label="Squash" value={exportData.squash} />
                  <SectionCard.DataRow label="Storage Backend" value={exportData.storageBackend} />
                  <SectionCard.DataRow label="Transport" value={exportData.transport} />
                </SectionCard.Content>
              </SectionCard>
            </TabPanel>

            <TabPanel value="clients" className="pt-4">
              <Table<NFSClient>
                columns={clientColumns}
                data={mockClients}
                rowKey="id"
                emptyMessage="No data to display"
              />
              <div className="mt-2 text-body-sm text-[var(--color-text-muted)]">
                {mockClients.length} total
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default NFSExportDetailPage;
