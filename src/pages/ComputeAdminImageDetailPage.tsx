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
import {
  IconTrash,
  IconEdit,
  IconBell,
  IconCopy,
  IconCheck,
  IconCirclePlus,
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
  // Basic information
  usageType: string;
  protected: boolean;
  description: string;
  // Tenant
  tenant: string;
  tenantId: string;
  // Specifications
  size: string;
  os: string;
  osAdmin: string;
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

// Image data map by ID - synced with ComputeAdminImagesPage mock data
const mockImagesMap: Record<string, ImageDetail> = {
  '29tgj234': {
    id: '29tgj234',
    name: 'Ubuntu-22.04-base',
    status: 'active',
    access: 'Project',
    createdAt: 'Sep 12, 2025',
    usageType: 'Common Server',
    protected: true,
    description: 'Base Ubuntu 22.04 image',
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    size: '16GiB',
    os: 'Ubuntu24.04',
    osAdmin: 'root',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '10 GiB',
    minRam: '1 GiB',
    owner: 'admin',
    visibility: 'Project',
    filename: '/v2/images/29tgj234/file',
    checksum: 'abc123',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {
      hw_qemu_guest_agent: 'yes',
      hw_disk_bus: 'scsi',
      'owner_specified.openstack.object': 'images/ubuntu-24.04-server',
      os_version: '24.04',
      'owner_specified.openstack.md5': '-',
      os_require_quiesce: 'yes',
      'owner_specified.openstack.sha256': '-',
      os_distro: 'ubuntu',
      image_type: 'image',
      hw_scsi_model: 'virtio-scsi',
      base_image_ref: '1e568eb7-a277-48f0-97d4-e481f2dd1ef4',
    },
  },
  'img-002': {
    id: 'img-002',
    name: 'CentOS-8-minimal',
    status: 'active',
    access: 'Private',
    createdAt: 'Sep 10, 2025',
    usageType: 'Common Server',
    protected: false,
    description: 'Minimal CentOS 8 installation',
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    size: '8GiB',
    os: 'CentOS8',
    osAdmin: 'root',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    minDisk: '10 GiB',
    minRam: '1 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/img-002/file',
    checksum: 'def456',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-003': {
    id: 'img-003',
    name: 'Rocky-Linux-9',
    status: 'active',
    access: 'Shared',
    createdAt: 'Sep 8, 2025',
    usageType: 'Common Server',
    protected: true,
    description: 'Rocky Linux 9 server image',
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    size: '12GiB',
    os: 'Rocky Linux 9',
    osAdmin: 'root',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '10 GiB',
    minRam: '1 GiB',
    owner: 'TK-project',
    visibility: 'Shared',
    filename: '/v2/images/img-003/file',
    checksum: 'ghi789',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-004': {
    id: 'img-004',
    name: 'Debian-12-standard',
    status: 'active',
    access: 'Public',
    createdAt: 'Sep 5, 2025',
    usageType: 'Common Server',
    protected: false,
    description: 'Standard Debian 12 image',
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    size: '10GiB',
    os: 'Debian 12',
    osAdmin: 'root',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    minDisk: '8 GiB',
    minRam: '512 MiB',
    owner: 'admin',
    visibility: 'Public',
    filename: '/v2/images/img-004/file',
    checksum: 'jkl012',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-005': {
    id: 'img-005',
    name: 'Ubuntu-20.04-LTS',
    status: 'active',
    access: 'Private',
    createdAt: 'Aug 28, 2025',
    usageType: 'Common Server',
    protected: true,
    description: 'Ubuntu 20.04 LTS server',
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    size: '14GiB',
    os: 'Ubuntu20.04',
    osAdmin: 'root',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '10 GiB',
    minRam: '1 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/img-005/file',
    checksum: 'mno345',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {
      hw_qemu_guest_agent: 'yes',
      hw_disk_bus: 'scsi',
      os_version: '20.04',
      os_distro: 'ubuntu',
      image_type: 'image',
      hw_scsi_model: 'virtio-scsi',
    },
  },
  'img-006': {
    id: 'img-006',
    name: 'Windows-Server-2022',
    status: 'saving',
    access: 'Shared',
    createdAt: 'Aug 25, 2025',
    usageType: 'Windows Server',
    protected: false,
    description: 'Windows Server 2022 Datacenter',
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    size: '32GiB',
    os: 'Windows Server 2022',
    osAdmin: 'Administrator',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    minDisk: '40 GiB',
    minRam: '4 GiB',
    owner: 'admin',
    visibility: 'Shared',
    filename: '/v2/images/img-006/file',
    checksum: 'pqr678',
    qemuGuestAgent: false,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-007': {
    id: 'img-007',
    name: 'Alpine-3.18-minimal',
    status: 'active',
    access: 'Public',
    createdAt: 'Aug 20, 2025',
    usageType: 'Common Server',
    protected: false,
    description: 'Lightweight Alpine Linux',
    tenant: 'Tenant D',
    tenantId: 'tenant-004',
    size: '256MiB',
    os: 'Alpine 3.18',
    osAdmin: 'root',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '1 GiB',
    minRam: '256 MiB',
    owner: 'admin',
    visibility: 'Public',
    filename: '/v2/images/img-007/file',
    checksum: 'stu901',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-008': {
    id: 'img-008',
    name: 'Fedora-39-workstation',
    status: 'active',
    access: 'Private',
    createdAt: 'Aug 15, 2025',
    usageType: 'Common Server',
    protected: true,
    description: 'Fedora 39 workstation image',
    tenant: 'Tenant C',
    tenantId: 'tenant-003',
    size: '20GiB',
    os: 'Fedora 39',
    osAdmin: 'root',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '15 GiB',
    minRam: '2 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/img-008/file',
    checksum: 'vwx234',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-009': {
    id: 'img-009',
    name: 'Oracle-Linux-8',
    status: 'error',
    access: 'Shared',
    createdAt: 'Aug 10, 2025',
    usageType: 'Common Server',
    protected: false,
    description: 'Oracle Linux 8 for databases',
    tenant: 'Tenant B',
    tenantId: 'tenant-002',
    size: '18GiB',
    os: 'Oracle Linux 8',
    osAdmin: 'root',
    diskFormat: 'QCOW2',
    containerFormat: 'Bare',
    minDisk: '12 GiB',
    minRam: '2 GiB',
    owner: 'admin',
    visibility: 'Shared',
    filename: '/v2/images/img-009/file',
    checksum: 'yza567',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
  'img-010': {
    id: 'img-010',
    name: 'Ubuntu-22.04-GPU',
    status: 'active',
    access: 'Private',
    createdAt: 'Aug 5, 2025',
    usageType: 'GPU Server',
    protected: true,
    description: 'Ubuntu with GPU drivers',
    tenant: 'Tenant A',
    tenantId: 'tenant-001',
    size: '24GiB',
    os: 'Ubuntu22.04',
    osAdmin: 'root',
    diskFormat: 'RAW',
    containerFormat: 'Bare',
    minDisk: '20 GiB',
    minRam: '4 GiB',
    owner: 'admin',
    visibility: 'Private',
    filename: '/v2/images/img-010/file',
    checksum: 'bcd890',
    qemuGuestAgent: true,
    cpuPolicy: 'Not select',
    cpuThreadPolicy: 'Not select',
    metadata: {},
  },
};

const defaultImageDetail: ImageDetail = {
  id: 'unknown',
  name: 'Unknown Image',
  status: 'active',
  access: 'Project',
  createdAt: '-',
  usageType: '-',
  protected: false,
  description: '-',
  tenant: '-',
  tenantId: '-',
  size: '-',
  os: '-',
  osAdmin: '-',
  diskFormat: '-',
  containerFormat: '-',
  minDisk: '-',
  minRam: '-',
  owner: '-',
  visibility: 'Private',
  filename: '-',
  checksum: '-',
  qemuGuestAgent: false,
  cpuPolicy: '-',
  cpuThreadPolicy: '-',
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
          <IconCheck size={16} className="text-[var(--color-state-success)]" />
        ) : (
          <IconCopy size={12} className="text-[var(--color-action-primary)]" />
        )}
      </button>
    </div>
  );
}

/* ----------------------------------------
   Compute Admin Image Detail Page
   ---------------------------------------- */

export function ComputeAdminImageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const image = id ? mockImagesMap[id] || defaultImageDetail : defaultImageDetail;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to image name
  useEffect(() => {
    if (image.name) {
      updateActiveTabLabel(image.name);
    }
  }, [image.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Compute Admin', href: '/' },
    { label: 'Images', href: '/compute-admin/images' },
    { label: image.name },
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
          onBack={() => navigate('/compute-admin/images')}
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
        {/* Image Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{image.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
              Manage metadata
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
              Manage access
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard label="Status" value="Active" status="active" />
            <DetailHeader.InfoCard label="ID" value={image.id} copyable />
            <DetailHeader.InfoCard label="Tenant" value={image.tenant} />
            <DetailHeader.InfoCard label="Visibility" value={image.access} />
            <DetailHeader.InfoCard label="Protected" value={image.protected ? 'Yes' : 'No'} />
            <DetailHeader.InfoCard label="Created at" value={image.createdAt} />
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
                    <SectionCard.DataRow label="Image name" value={image.name} />
                    <SectionCard.DataRow label="Description" value={image.description} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Specifications */}
                <SectionCard>
                  <SectionCard.Header title="Specifications" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Size" value={image.size} />
                    <SectionCard.DataRow label="OS" value={image.os} />
                    <SectionCard.DataRow label="OS Admin" value={image.osAdmin} />
                    <SectionCard.DataRow
                      label="Disk format / container format"
                      value={`${image.diskFormat} / ${image.containerFormat}`}
                    />
                    <SectionCard.DataRow
                      label="Min disk / Min RAM"
                      value={`${image.minDisk} / ${image.minRam}`}
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Security */}
                <SectionCard>
                  <SectionCard.Header title="Security" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Owner" value={image.owner} />
                    <SectionCard.DataRow label="Visibility" value={image.visibility} />
                    <SectionCard.DataRow
                      label="Protected"
                      value={image.protected ? 'Enabled' : 'Disabled'}
                    />
                    {/* Filename with copy */}
                    <div className="flex flex-col gap-3 w-full">
                      <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">
                          Filename
                        </span>
                        <CopyableValue value={image.filename} />
                      </div>
                    </div>
                    {/* Checksum with copy */}
                    <div className="flex flex-col gap-3 w-full">
                      <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">
                          Checksum
                        </span>
                        <CopyableValue value={image.checksum} />
                      </div>
                    </div>
                  </SectionCard.Content>
                </SectionCard>

                {/* Advanced */}
                <SectionCard>
                  <SectionCard.Header title="Advanced" />
                  <SectionCard.Content>
                    <SectionCard.DataRow
                      label="QEMU Guest Agent"
                      value={image.qemuGuestAgent ? 'Enabled' : 'Disabled'}
                    />
                    <SectionCard.DataRow label="CPU Policy" value={image.cpuPolicy} />
                    <SectionCard.DataRow label="CPU Thread Policy" value={image.cpuThreadPolicy} />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Metadata Tab Panel */}
            <TabPanel value="metadata" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Metadata Card - matching Figma design */}
                <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 pt-3 pb-4 w-full flex flex-col gap-3">
                  {/* Title */}
                  <div className="h-8 flex items-center">
                    <span className="text-heading-h5 text-[var(--color-text-default)]">
                      Metadata
                    </span>
                  </div>

                  {/* Data Rows */}
                  {Object.entries(image.metadata).length > 0 ? (
                    Object.entries(image.metadata).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-3 w-full">
                        {/* Divider */}
                        <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                        {/* Row Content */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-label-sm leading-4 text-[var(--color-text-subtle)]">
                            {key}
                          </span>
                          <span className="text-body-md leading-4 text-[var(--color-text-default)]">
                            {value || '-'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-[var(--color-text-muted)]">
                      No metadata available
                    </div>
                  )}
                </div>
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default ComputeAdminImageDetailPage;
