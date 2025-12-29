import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  IconBell,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type VisibilityType = 'Public' | 'Private' | 'Project';

interface FlavorDetail {
  id: string;
  name: string;
  category: string;
  vcpu: number;
  ram: string;
  visibility: VisibilityType;
  createdAt: string;
  // Basic Information
  architecture: string;
  // Specification
  ephemeralDisk: string;
  numaNodes: string;
  // Advanced
  cpuPolicy: string;
  cpuThreadPolicy: string;
  memoryPage: string;
  internalNetworkBandwidth: string;
  storageIOPS: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFlavorDetail: FlavorDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'c1.large',
  category: 'Compute Optimized',
  vcpu: 2,
  ram: '4GiB',
  visibility: 'Public',
  createdAt: '2025-07-25 09:12:20',
  // Basic Information
  architecture: 'X86 Architecture',
  // Specification
  ephemeralDisk: '0GiB',
  numaNodes: '0GiB',
  // Advanced
  cpuPolicy: 'Dedicated',
  cpuThreadPolicy: 'Prefer',
  memoryPage: 'Any',
  internalNetworkBandwidth: '-',
  storageIOPS: '-',
};

/* ----------------------------------------
   Flavor Detail Page
   ---------------------------------------- */

export function FlavorDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  
  // In a real app, you would fetch the flavor data based on the ID
  const flavor = mockFlavorDetail;

  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Proj-1', href: '#' },
    { label: 'Flavors', href: '/flavors' },
    { label: flavor.name, href: `/flavors/${flavor.id}` },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main
        className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 ${
          sidebarOpen ? 'ml-[200px]' : 'ml-[var(--sidebar-collapsed-width)]'
        } flex-1`}
      >
        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate('/flavors')}
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
        <TabBar tabs={tabBarTabs} activeTabId={activeTabId} onTabClick={selectTab} onTabClose={closeTab} />

        <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
          <VStack gap={6} className="min-w-[1176px]">
            {/* Flavor Header Card */}
            <DetailHeader>
              <DetailHeader.Title>{flavor.name}</DetailHeader.Title>
              <DetailHeader.Actions>
                <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                  Create Instance
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                  Create Volume
                </Button>
              </DetailHeader.Actions>
              <DetailHeader.InfoGrid>
                <DetailHeader.InfoCard label="Category" value={flavor.category} />
                <DetailHeader.InfoCard label="ID" value={flavor.id} copyable />
                <DetailHeader.InfoCard label="vCPU" value={String(flavor.vcpu)} />
                <DetailHeader.InfoCard label="RAM" value={flavor.ram} />
                <DetailHeader.InfoCard label="Visibility" value={flavor.visibility} />
                <DetailHeader.InfoCard label="Created At" value={flavor.createdAt} />
              </DetailHeader.InfoGrid>
            </DetailHeader>

            {/* Flavor Tabs */}
            <div className="w-full">
              <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="md">
                <TabList className="gap-6">
                  <Tab value="details">Details</Tab>
                  <Tab value="instances">Instances</Tab>
                  <Tab value="parameters">Parameters</Tab>
                </TabList>

                {/* Details Tab Panel */}
                <TabPanel value="details">
                  <VStack gap={4} className="pt-6">
                    {/* Basic Information */}
                    <SectionCard>
                      <SectionCard.Header title="Basic Information" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Flavor Name" value={flavor.name} />
                        <SectionCard.DataRow label="Architecture" value={flavor.architecture} />
                        <SectionCard.DataRow label="Category" value={flavor.category} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Specification */}
                    <SectionCard>
                      <SectionCard.Header title="Specification" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="vCPU" value={String(flavor.vcpu)} />
                        <SectionCard.DataRow label="RAM" value={flavor.ram} />
                        <SectionCard.DataRow label="Ephemeral Disk" value={flavor.ephemeralDisk} />
                        <SectionCard.DataRow label="NUMA Nodes" value={flavor.numaNodes} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Advanced */}
                    <SectionCard>
                      <SectionCard.Header title="Advanced" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="CPU Policy" value={flavor.cpuPolicy} />
                        <SectionCard.DataRow label="CPU Thread Policy" value={flavor.cpuThreadPolicy} />
                        <SectionCard.DataRow label="Memory Page" value={flavor.memoryPage} />
                        <SectionCard.DataRow label="Internal Network Bandwidth" value={flavor.internalNetworkBandwidth} />
                        <SectionCard.DataRow label="Storage IOPS" value={flavor.storageIOPS} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Security */}
                    <SectionCard>
                      <SectionCard.Header title="Security" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Visibility" value={flavor.visibility} />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>
                </TabPanel>

                {/* Instances Tab Panel */}
                <TabPanel value="instances">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Instances using this flavor will be displayed here.</p>
                  </div>
                </TabPanel>

                {/* Parameters Tab Panel */}
                <TabPanel value="parameters">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Flavor parameters will be displayed here.</p>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </VStack>
        </div>
      </main>
    </div>
  );
}


