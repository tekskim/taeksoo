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
  ContextMenu,
} from '@/design-system';
import type { ContextMenuItem } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconCirclePlus,
  IconTrash,
  IconEdit,
  IconBell,
  IconCopy,
  IconCheck,
  IconChevronDown,
  IconExternalLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface SnapshotDetail {
  id: string;
  name: string;
  status: 'active' | 'building' | 'error' | 'pending';
  size: string;
  createdAt: string;
  description: string;
  sourceInstance: string;
  os: string;
  minDisk: string;
  minRam: string;
  diskFormat: string;
  containerFormat: string;
  owner: string;
  visibility: string;
  protected: boolean;
  filename: string;
  checksum: string;
  metadata: Record<string, string>;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSnapshotDetail: SnapshotDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'web-large',
  status: 'active',
  size: '30 GiB',
  createdAt: '2025-07-25 09:12:20',
  description: '-',
  sourceInstance: 'web-server-10',
  os: 'Ubuntu 20.04',
  minDisk: '30 GiB',
  minRam: '-',
  diskFormat: 'RAW',
  containerFormat: 'Bare',
  owner: 'TK-project',
  visibility: 'Private',
  protected: false,
  filename: '/v2/images/93c91160-75f8-40e4-899f-372539fb98a6/file',
  checksum: 'ffc34736c70569953d58a15a52b8a3bd',
  metadata: {
    'hw_scsi_model': 'virtio-scsi',
    'hw_qemu_guest_agent': 'yes',
    'os_distro': 'ubuntu',
    'hw_disk_bus': 'scsi',
    'os_version': '24.04',
    'os_require_quiesce': 'yes',
    'owner_specified.openstack.sha256': '-',
    'owner_specified.openstack.md5': '-',
    'image_type': 'snapshot',
    'owner_specified.openstack.object': 'images/ubuntu-24.04-server',
    'base_image_ref': '1e568eb7-a277-48f0-97d4-e481f2dd1ef4',
    'owner_user_name': 'admin',
    'owner_project_name': 'test',
    'boot_roles': 'reader,member,load-balancer_member,manager',
    'hw_machine_type': 'pc',
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
   Instance Snapshot Detail Page
   ---------------------------------------- */

export function InstanceSnapshotDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  
  // In a real app, you would fetch the snapshot data based on the ID
  const snapshot = mockSnapshotDetail;

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
    { label: 'Instance Snapshots', href: '/instance-snapshots' },
    { label: snapshot.name },
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
            onBack={() => navigate('/instance-snapshots')}
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
            {/* Snapshot Header Card */}
            <DetailHeader>
              <DetailHeader.Title>{snapshot.name}</DetailHeader.Title>
              <DetailHeader.Actions>
                <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                  Create Instance
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                  Delete
                </Button>
                <ContextMenu
                  items={[
                    { id: 'create-volume', label: 'Create Volume', onClick: () => console.log('Create Volume') },
                    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit') },
                  ] as ContextMenuItem[]}
                  trigger="click"
                >
                  <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                    More Actions
                  </Button>
                </ContextMenu>
              </DetailHeader.Actions>
              <DetailHeader.InfoGrid>
                <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                <DetailHeader.InfoCard label="ID" value={snapshot.id} copyable />
                <DetailHeader.InfoCard label="Size" value={snapshot.size} />
                <DetailHeader.InfoCard label="Created At" value={snapshot.createdAt} />
              </DetailHeader.InfoGrid>
            </DetailHeader>

            {/* Snapshot Tabs */}
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
                        actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>Edit</Button>}
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Snapshot Name" value={snapshot.name} />
                        <SectionCard.DataRow label="Description" value={snapshot.description} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Source */}
                    <SectionCard>
                      <SectionCard.Header title="Source" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Instance" 
                          value={
                            <Link
                              to="/instances"
                              className="inline-flex items-center gap-1.5 text-[12px] font-medium leading-4 text-[var(--color-action-primary)] hover:underline"
                            >
                              {snapshot.sourceInstance}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          }
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Specifications */}
                    <SectionCard>
                      <SectionCard.Header title="Specifications" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Size" value={snapshot.size} />
                        <SectionCard.DataRow label="OS" value={snapshot.os} />
                        <SectionCard.DataRow label="Min Disk / Min RAM" value={`${snapshot.minDisk} / ${snapshot.minRam}`} />
                        <SectionCard.DataRow label="Disk Format / Container Format" value={`${snapshot.diskFormat} / ${snapshot.containerFormat}`} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Security */}
                    <SectionCard>
                      <SectionCard.Header title="Security" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Owner" value={snapshot.owner} />
                        <SectionCard.DataRow label="Visibility" value={snapshot.visibility} />
                        <SectionCard.DataRow label="Protected" value={snapshot.protected ? 'Enabled' : 'Disabled'} />
                        <div className="flex flex-col gap-3 w-full">
                          <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                              Filename
                            </span>
                            <CopyableValue value={snapshot.filename} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                          <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-medium leading-4 text-[var(--color-text-subtle)]">
                              Checksum
                            </span>
                            <CopyableValue value={snapshot.checksum} />
                          </div>
                        </div>
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
                        {Object.entries(snapshot.metadata).map(([key, value], index) => (
                          <SectionCard.DataRow
                            key={key}
                            label={key}
                            value={value}
                            showDivider={index === 0 ? true : true}
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

