import { useState, useEffect } from 'react';
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
  StatusIndicator,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconBell,
  IconPencil,
  IconTrash,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type AccessType = 'Personal' | 'Project' | 'Public';

interface InstanceTemplateDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  imageId: string;
  flavor: string;
  flavorId: string;
  vcpu: number;
  ram: string;
  disk: string;
  network: string;
  networkId: string;
  subnet: string;
  subnetId: string;
  securityGroups: string[];
  floatingIp: string;
  keyPair: string;
  access: AccessType;
  favorite: boolean;
  createdAt: string;
  createdBy: string;
  // Advanced settings
  availabilityZone: string;
  serverGroup: string;
  userData: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTemplateDetail: InstanceTemplateDetail = {
  id: 'tpl-001',
  name: 'web-server-template',
  description: 'Standard web server template for production deployments',
  image: 'Ubuntu 22.04 LTS',
  imageId: 'img-ubuntu-2204',
  flavor: 'm1.large',
  flavorId: 'flv-m1-large',
  vcpu: 16,
  ram: '32GiB',
  disk: '50GiB',
  network: 'public-net',
  networkId: 'net-public-001',
  subnet: '10.0.0.0/24',
  subnetId: 'subnet-001',
  securityGroups: ['default', 'web-servers', 'ssh-access'],
  floatingIp: 'Auto',
  keyPair: 'my-keypair',
  access: 'Project',
  favorite: true,
  createdAt: '2025-07-25 09:12:20',
  createdBy: 'admin@thaki.cloud',
  // Advanced settings
  availabilityZone: 'nova',
  serverGroup: 'web-servers-group',
  userData: '#!/bin/bash\napt-get update\napt-get install -y nginx',
};

/* ----------------------------------------
   Instance Template Detail Page
   ---------------------------------------- */

export function InstanceTemplateDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [isFavorite, setIsFavorite] = useState(mockTemplateDetail.favorite);
  
  // In a real app, you would fetch the template data based on the ID
  const template = mockTemplateDetail;

  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel } = useTabs();

  // Update tab label to template name
  useEffect(() => {
    if (template.name) {
      updateActiveTabLabel(template.name);
    }
  }, [template.name, updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const breadcrumbItems = [
    { label: 'Proj-1', href: '#' },
    { label: 'Instance Templates', href: '/compute/instance-templates' },
    { label: template.name },
  ];

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => navigate('/instance-templates')}
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
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
          <VStack gap={6} className="min-w-[1176px]">
            {/* Template Header Card */}
            <DetailHeader>
              <DetailHeader.Title>
                <div className="flex items-center gap-3">
                  <span>{template.name}</span>
                  <button
                    onClick={handleToggleFavorite}
                    className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite ? (
                      <IconStarFilled size={16} className="text-yellow-400" />
                    ) : (
                      <IconStar size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                    )}
                  </button>
                </div>
              </DetailHeader.Title>
              <DetailHeader.Actions>
                <Button variant="primary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                  Create Instance
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconPencil size={12} />}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" leftIcon={<IconTrash size={12} />}>
                  Delete
                </Button>
              </DetailHeader.Actions>
              <DetailHeader.InfoGrid>
                <DetailHeader.InfoCard label="Image" value={template.image} />
                <DetailHeader.InfoCard label="ID" value={template.id} copyable />
                <DetailHeader.InfoCard label="Flavor" value={template.flavor} />
                <DetailHeader.InfoCard label="Access" value={template.access} />
                <DetailHeader.InfoCard label="Created At" value={template.createdAt} />
              </DetailHeader.InfoGrid>
            </DetailHeader>

            {/* Template Tabs */}
            <div className="w-full">
              <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                <TabList>
                  <Tab value="details">Details</Tab>
                  <Tab value="instances">Instances</Tab>
                  <Tab value="history">History</Tab>
                </TabList>

                {/* Details Tab Panel */}
                <TabPanel value="details">
                  <VStack gap={4} className="pt-6">
                    {/* Basic Information */}
                    <SectionCard>
                      <SectionCard.Header title="Basic Information" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Template Name" value={template.name} />
                        <SectionCard.DataRow label="Description" value={template.description || '-'} />
                        <SectionCard.DataRow label="Access Level" value={template.access} />
                        <SectionCard.DataRow label="Created By" value={template.createdBy} />
                        <SectionCard.DataRow label="Created At" value={template.createdAt} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Compute Configuration */}
                    <SectionCard>
                      <SectionCard.Header title="Compute Configuration" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Image" value={template.image} />
                        <SectionCard.DataRow label="Image ID" value={template.imageId} />
                        <SectionCard.DataRow label="Flavor" value={template.flavor} />
                        <SectionCard.DataRow label="Flavor ID" value={template.flavorId} />
                        <SectionCard.DataRow label="vCPU" value={String(template.vcpu)} />
                        <SectionCard.DataRow label="RAM" value={template.ram} />
                        <SectionCard.DataRow label="Root Disk" value={template.disk} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Network Configuration */}
                    <SectionCard>
                      <SectionCard.Header title="Network Configuration" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Network" value={template.network} />
                        <SectionCard.DataRow label="Network ID" value={template.networkId} />
                        <SectionCard.DataRow label="Subnet" value={template.subnet} />
                        <SectionCard.DataRow label="Floating IP" value={template.floatingIp} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Security */}
                    <SectionCard>
                      <SectionCard.Header title="Security" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Key Pair" value={template.keyPair || '-'} />
                        <SectionCard.DataRow 
                          label="Security Groups" 
                          value={
                            <div className="flex flex-wrap gap-2">
                              {template.securityGroups.map((sg) => (
                                <span
                                  key={sg}
                                  className="px-2 py-0.5 text-xs bg-[var(--color-surface-muted)] text-[var(--color-text-default)] rounded"
                                >
                                  {sg}
                                </span>
                              ))}
                            </div>
                          } 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Advanced Settings */}
                    <SectionCard>
                      <SectionCard.Header title="Advanced Settings" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Availability Zone" value={template.availabilityZone || '-'} />
                        <SectionCard.DataRow label="Server Group" value={template.serverGroup || '-'} />
                        <SectionCard.DataRow 
                          label="User Data" 
                          value={
                            template.userData ? (
                              <pre className="text-xs bg-[var(--color-surface-muted)] p-2 rounded overflow-x-auto max-w-[600px]">
                                {template.userData}
                              </pre>
                            ) : '-'
                          } 
                        />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>
                </TabPanel>

                {/* Instances Tab Panel */}
                <TabPanel value="instances">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Instances created from this template will be displayed here.</p>
                  </div>
                </TabPanel>

                {/* History Tab Panel */}
                <TabPanel value="history">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Template modification history will be displayed here.</p>
                  </div>
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

export default InstanceTemplateDetailPage;




