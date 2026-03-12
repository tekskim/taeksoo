import { useState, useEffect } from 'react';
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
  ContextMenu,
  PageShell,
} from '@/design-system';
import type { ContextMenuItem } from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
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

// Mock data - synchronized with InstanceSnapshotsPage
const mockSnapshotsMap: Record<string, SnapshotDetail> = {
  'snap-001': {
    id: 'snap-001',
    name: 'Ubuntu-22.04-base',
    status: 'active',
    size: '16 GiB',
    createdAt: 'Sep 12, 2025 15:43:35',
    description: 'Base web server snapshot',
    sourceInstance: 'web-server-01',
    os: 'Ubuntu 22.04',
    minDisk: '16 GiB',
    minRam: '-',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    owner: 'TK-project',
    visibility: 'Private',
    protected: false,
    filename: '/v2/images/93c91160-75f8-40e4-899f-372539fb98a6/file',
    checksum: 'ffc34736c70569953d58a15a52b8a3bd',
    metadata: {
      hw_scsi_model: 'virtio-scsi',
      hw_qemu_guest_agent: 'yes',
      os_distro: 'ubuntu',
      hw_disk_bus: 'scsi',
      os_version: '22.04',
      os_require_quiesce: 'yes',
      image_type: 'snapshot',
      owner_user_name: 'admin',
      owner_project_name: 'test',
    },
  },
  'snap-002': {
    id: 'snap-002',
    name: 'CentOS-8-web',
    status: 'active',
    size: '32 GiB',
    createdAt: 'Sep 10, 2025 01:17:01',
    description: 'Database server backup',
    sourceInstance: 'db-server-01',
    os: 'CentOS 8',
    minDisk: '32 GiB',
    minRam: '4 GiB',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    owner: 'TK-project',
    visibility: 'Private',
    protected: false,
    filename: '/v2/images/db-server-snapshot/file',
    checksum: 'abc123def456',
    metadata: {
      os_distro: 'centos',
      os_version: '8',
      image_type: 'snapshot',
    },
  },
  'snap-003': {
    id: 'snap-003',
    name: 'Debian-12-db',
    status: 'active',
    size: '64 GiB',
    createdAt: 'Sep 8, 2025 11:51:27',
    description: 'Application server snapshot',
    sourceInstance: 'app-server-01',
    os: 'Debian 12',
    minDisk: '64 GiB',
    minRam: '8 GiB',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    owner: 'TK-project',
    visibility: 'Private',
    protected: true,
    filename: '/v2/images/app-server-snapshot/file',
    checksum: 'xyz789abc',
    metadata: {
      os_distro: 'debian',
      os_version: '12',
      image_type: 'snapshot',
    },
  },
};

const defaultSnapshotDetail: SnapshotDetail = {
  id: 'snap-default',
  name: 'Unknown Snapshot',
  status: 'active',
  size: '-',
  createdAt: '-',
  description: '-',
  sourceInstance: '-',
  os: '-',
  minDisk: '-',
  minRam: '-',
  diskFormat: '-',
  containerFormat: '-',
  owner: '-',
  visibility: 'Private',
  protected: false,
  filename: '-',
  checksum: '-',
  metadata: {},
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
      <span className="text-body-md leading-4 text-[var(--color-text-default)]">{value}</span>
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <IconCheck size={12} className="text-[var(--color-state-success)]" />
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Get snapshot based on URL id
  const snapshot = id ? mockSnapshotsMap[id] || defaultSnapshotDetail : defaultSnapshotDetail;

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
    { label: 'Instance snapshots', href: '/compute/instance-snapshots' },
    { label: snapshot.name },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
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
          onSidebarToggle={openSidebar}
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
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Snapshot Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{snapshot.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
              Create instance
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
            <ContextMenu
              items={
                [
                  {
                    id: 'create-volume',
                    label: 'Create volume',
                    onClick: () => console.log('Create volume'),
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
            <DetailHeader.InfoCard label="Status" value="Active" status="active" />
            <DetailHeader.InfoCard label="ID" value={snapshot.id} copyable />
            <DetailHeader.InfoCard label="Size" value={snapshot.size} />
            <DetailHeader.InfoCard label="Created at" value={snapshot.createdAt} />
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
                    <SectionCard.DataRow label="Snapshot name" value={snapshot.name} />
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
                          className="inline-flex items-center gap-1.5 text-label-md leading-4 text-[var(--color-action-primary)] hover:underline"
                        >
                          {snapshot.sourceInstance}
                          <IconExternalLink
                            size={12}
                            className="text-[var(--color-action-primary)]"
                          />
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
                    <SectionCard.DataRow
                      label="Min disk / Min RAM"
                      value={`${snapshot.minDisk} / ${snapshot.minRam}`}
                    />
                    <SectionCard.DataRow
                      label="Disk format / Container Format"
                      value={`${snapshot.diskFormat} / ${snapshot.containerFormat}`}
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Security */}
                <SectionCard>
                  <SectionCard.Header title="Security" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Owner" value={snapshot.owner} />
                    <SectionCard.DataRow label="Visibility" value={snapshot.visibility} />
                    <SectionCard.DataRow
                      label="Protected"
                      value={snapshot.protected ? 'Enabled' : 'Disabled'}
                    />
                    <div className="flex flex-col gap-3 w-full">
                      <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">
                          Filename
                        </span>
                        <CopyableValue value={snapshot.filename} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">
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
            <TabPanel value="metadata" className="pt-0">
              <VStack gap={4} className="pt-4">
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
    </PageShell>
  );
}
