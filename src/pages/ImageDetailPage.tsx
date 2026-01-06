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
  IconTrash,
  IconEdit,
  IconBell,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ImageStatus = 'active' | 'queued' | 'saving' | 'error' | 'deleting';
type AccessType = 'Private' | 'Project' | 'Public';

interface ImageDetail {
  id: string;
  name: string;
  status: ImageStatus;
  access: AccessType;
  createdAt: string;
  // Basic Information
  usageType: string;
  protected: boolean;
  description: string;
  // Specifications
  size: string;
  os: string;
  diskFormat: string;
  containerFormat: string;
  minDisk: string;
  minRam: string;
  // Security
  owner: string;
  visibility: AccessType;
  filename: string;
  checksum: string;
  // Advanced
  qemuGuestAgent: boolean;
  cpuPolicy: string;
  cpuThreadPolicy: string;
  // Metadata
  metadata: Record<string, string>;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockImageDetail: ImageDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'Ubuntu-base',
  status: 'active',
  access: 'Project',
  createdAt: '2025-07-25 09:12:20',
  // Basic Information
  usageType: 'Common Server',
  protected: false,
  description: '-',
  // Specifications
  size: '700 MiB',
  os: 'Ubuntu 20.04',
  diskFormat: 'QCOW2',
  containerFormat: 'Bare',
  minDisk: '10 GiB',
  minRam: '-',
  // Security
  owner: 'TK-project',
  visibility: 'Private',
  filename: '/v2/images/93c91160-75f8-40e4-899f-372539fb98a6/file',
  checksum: 'ffc34736c70569953d58a15a52b8a3bd',
  // Advanced
  qemuGuestAgent: true,
  cpuPolicy: 'Not select',
  cpuThreadPolicy: 'Not select',
  // Metadata (ordered as per Figma design)
  metadata: {
    'hw_qemu_guest_agent': 'yes',
    'hw_disk_bus': 'scsi',
    'owner_specified.openstack.object': 'images/ubuntu-24.04-server',
    'os_version': '24.04',
    'owner_specified.openstack.md5': '-',
    'os_require_quiesce': 'yes',
    'owner_specified.openstack.sha256': '-',
    'os_distro': 'ubuntu',
    'image_type': 'image',
    'hw_scsi_model': 'virtio-scsi',
    'base_image_ref': '1e568eb7-a277-48f0-97d4-e481f2dd1ef4',
  },
};

/* ----------------------------------------
   Copyable Value Component
   ---------------------------------------- */

interface CopyableValueProps {
  value: string;
}

function CopyableValue({ value }: CopyableValueProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] leading-4 text-[var(--color-text-default)]">
        {value}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <IconCheck size={16} className="text-[var(--color-state-success)]" />
        ) : (
          <IconCopy size={12} className="text-[var(--color-action-primary)]" />
        )}
      </button>
    </div>
  );
}

/* ----------------------------------------
   Image Detail Page
   ---------------------------------------- */

export function ImageDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  
  // In a real app, you would fetch the image data based on the ID
  const image = mockImageDetail;

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
    { label: 'Home', href: '/' },
    { label: 'Images', href: '/compute/images' },
    { label: image.name },
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
            onBack={() => navigate('/images')}
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
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
          <VStack gap={6} className="min-w-[1176px]">
            {/* Image Header Card */}
            <DetailHeader>
              <DetailHeader.Title>{image.name}</DetailHeader.Title>
              <DetailHeader.Actions>
                <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                  Create Instance
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                  Create Volume
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                  Delete
                </Button>
              </DetailHeader.Actions>
              <DetailHeader.InfoGrid>
                <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                <DetailHeader.InfoCard label="ID" value={image.id} copyable />
                <DetailHeader.InfoCard label="Access" value={image.access} />
                <DetailHeader.InfoCard label="Created At" value={image.createdAt} />
              </DetailHeader.InfoGrid>
            </DetailHeader>

            {/* Image Tabs */}
            <div className="w-full">
              <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                <TabList>
                  <Tab value="details">Details</Tab>
                  <Tab value="metadata">Metadata</Tab>
                </TabList>

                {/* Details Tab Panel */}
                <TabPanel value="details">
                  <VStack gap={4} className="pt-6">
                    {/* Basic Information */}
                    <SectionCard>
                      <SectionCard.Header 
                        title="Basic Information" 
                        actions={
                          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                            Edit
                          </Button>
                        } 
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Image Name" value={image.name} />
                        <SectionCard.DataRow label="Usage Type" value={image.usageType} />
                        <SectionCard.DataRow label="Protected" value={image.protected ? 'Enabled' : 'Disabled'} />
                        <SectionCard.DataRow label="Description" value={image.description} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Specifications */}
                    <SectionCard>
                      <SectionCard.Header title="Specifications" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Size" value={image.size} />
                        <SectionCard.DataRow label="OS" value={image.os} />
                        <SectionCard.DataRow label="Disk Format / Container Format" value={`${image.diskFormat} / ${image.containerFormat}`} />
                        <SectionCard.DataRow label="Min Disk / Min RAM" value={`${image.minDisk} / ${image.minRam}`} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Security */}
                    <SectionCard>
                      <SectionCard.Header title="Security" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Owner" value={image.owner} />
                        <SectionCard.DataRow label="Visibility" value={image.visibility} />
                        {/* Filename with copy */}
                        <div className="flex flex-col gap-3 w-full">
                          <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                              Filename
                            </span>
                            <CopyableValue value={image.filename} />
                          </div>
                        </div>
                        {/* Checksum with copy */}
                        <div className="flex flex-col gap-3 w-full">
                          <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                              Checksum
                            </span>
                            <CopyableValue value={image.checksum} />
                          </div>
                        </div>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Advanced */}
                    <SectionCard>
                      <SectionCard.Header 
                        title="Advanced" 
                        actions={
                          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                            Edit
                          </Button>
                        } 
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="QEMU Guest Agent" value={image.qemuGuestAgent ? 'Enabled' : 'Disabled'} />
                        <SectionCard.DataRow label="CPU Policy" value={image.cpuPolicy} />
                        <SectionCard.DataRow label="CPU Thread Policy" value={image.cpuThreadPolicy} />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>
                </TabPanel>

                {/* Metadata Tab Panel */}
                <TabPanel value="metadata">
                  <VStack gap={4} className="pt-6">
                    <SectionCard>
                      <SectionCard.Header title="Metadata" />
                      <SectionCard.Content>
                        {Object.entries(image.metadata).map(([key, value]) => (
                          <SectionCard.DataRow
                            key={key}
                            label={key}
                            value={value}
                          />
                        ))}
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

