import { useState } from 'react';
import { useTabs } from '@/contexts/TabContext';
import { Sidebar } from '@/components/Sidebar';
import { TopBar, Breadcrumb, TabBar } from '@/design-system';
import { Button, VStack, HStack, Badge } from '@/design-system';

// Import all drawer components
import { CreateInstanceSnapshotDrawer, type InstanceInfo as SnapshotInstanceInfo } from '@/components/CreateInstanceSnapshotDrawer';
import { EditInstanceDrawer, type InstanceInfo as EditInstanceInfo } from '@/components/EditInstanceDrawer';
import { LockSettingDrawer, type InstanceInfo as LockInstanceInfo } from '@/components/LockSettingDrawer';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import { CreateVolumeSnapshotDrawer, type VolumeInfo } from '@/components/CreateVolumeSnapshotDrawer';
import { CreateVolumeBackupDrawer, type VolumeInfo as BackupVolumeInfo } from '@/components/CreateVolumeBackupDrawer';
import { CloneVolumeDrawer, type VolumeInfo as CloneVolumeInfo } from '@/components/CloneVolumeDrawer';
import { ExtendVolumeDrawer, type VolumeInfo as ExtendVolumeInfo } from '@/components/ExtendVolumeDrawer';
import { EditInstanceSnapshotDrawer, type InstanceSnapshotInfo } from '@/components/EditInstanceSnapshotDrawer';
import { CreateVolumeFromSnapshotDrawer, type InstanceSnapshotInfo as VolumeSnapshotInfo } from '@/components/CreateVolumeFromSnapshotDrawer';
import { CreateVolumeFromImageDrawer, type ImageInfo } from '@/components/CreateVolumeFromImageDrawer';
import { EditImageDrawer, type ImageInfo as EditImageInfo } from '@/components/EditImageDrawer';
import { CreateKeyPairDrawer } from '@/components/CreateKeyPairDrawer';
import { EditKeyPairDrawer, type KeyPairInfo } from '@/components/EditKeyPairDrawer';
import { CreateServerGroupDrawer } from '@/components/CreateServerGroupDrawer';
import { EditServerGroupDrawer, type ServerGroupInfo } from '@/components/EditServerGroupDrawer';
import { CreateImageFromVolumeDrawer, type VolumeInfo as ImageVolumeInfo } from '@/components/CreateImageFromVolumeDrawer';
import { EditVolumeDrawer, type VolumeInfo as EditVolumeVolumeInfo } from '@/components/EditVolumeDrawer';
import { ChangeVolumeTypeDrawer, type VolumeInfo as ChangeVolumeTypeVolumeInfo } from '@/components/ChangeVolumeTypeDrawer';
import { CreateTransferDrawer, type VolumeInfo as TransferVolumeInfo } from '@/components/CreateTransferDrawer';
import { EditVolumeBackupDrawer, type VolumeBackupInfo } from '@/components/EditVolumeBackupDrawer';
import { AcceptVolumeTransferDrawer } from '@/components/AcceptVolumeTransferDrawer';
import { EditVolumeSnapshotDrawer, type VolumeSnapshotInfo as EditVolumeSnapshotInfo } from '@/components/EditVolumeSnapshotDrawer';
import { CreateVolumeFromVolumeSnapshotDrawer, type VolumeSnapshotInfo as CreateVolFromSnapVolumeSnapshotInfo } from '@/components/CreateVolumeFromVolumeSnapshotDrawer';
import { CreateVolumeFromBackupDrawer, type VolumeBackupInfo as CreateVolFromBackupVolumeBackupInfo } from '@/components/CreateVolumeFromBackupDrawer';
import { AddL7PolicyDrawer } from '@/components/AddL7PolicyDrawer';
import { RegisterCertificateDrawer } from '@/components/RegisterCertificateDrawer';
import { CreateSecurityGroupRuleDrawer } from '@/components/CreateSecurityGroupRuleDrawer';
import { EditNetworkDrawer } from '@/components/EditNetworkDrawer';
import { EditRouterDrawer } from '@/components/EditRouterDrawer';
import { CreateStaticRouteDrawer } from '@/components/CreateStaticRouteDrawer';
import { EditPortDrawer } from '@/components/EditPortDrawer';
import { CreateAllowedAddressPairDrawer } from '@/components/CreateAllowedAddressPairDrawer';
import { EditFloatingIPDrawer } from '@/components/EditFloatingIPDrawer';
import { CreateSecurityGroupDrawer } from '@/components/CreateSecurityGroupDrawer';
import { EditSecurityGroupDrawer } from '@/components/EditSecurityGroupDrawer';
import { EditCertificateDrawer } from '@/components/EditCertificateDrawer';
import { EditLoadBalancerDrawer } from '@/components/EditLoadBalancerDrawer';
import { EditPoolDrawer } from '@/components/EditPoolDrawer';
import { AddL7RuleDrawer } from '@/components/AddL7RuleDrawer';
import { EditListenerDrawer } from '@/components/EditListenerDrawer';
import { AllocateIPDrawer } from '@/components/AllocateIPDrawer';
import { CreateHealthMonitorDrawer } from '@/components/CreateHealthMonitorDrawer';
import { EditMemberDrawer } from '@/components/EditMemberDrawer';

/* ----------------------------------------
   Mock Data for Drawers
   ---------------------------------------- */

const mockSnapshotInstance: SnapshotInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-01',
  status: 'active',
  image: 'Ubuntu 22.04 LTS',
  flavor: 'm1.medium',
};

const mockEditInstance: EditInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-01',
  description: 'Main web server for production environment',
};

const mockLockInstance: LockInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-01',
  isLocked: false,
};

const mockViewPreferencesColumns: ColumnConfig[] = [
  { id: 'status', label: 'Status', visible: true, locked: true },
  { id: 'name', label: 'Name', visible: true, locked: true },
  { id: 'image', label: 'Image', visible: true },
  { id: 'flavor', label: 'Flavor', visible: true },
  { id: 'vcpu', label: 'vCPU', visible: true },
  { id: 'ram', label: 'RAM', visible: true },
  { id: 'network', label: 'Network', visible: true },
  { id: 'createdAt', label: 'Created at', visible: false },
  { id: 'actions', label: 'Action', visible: true, locked: true },
];

const mockVolume: VolumeInfo = {
  id: 'vol-001',
  name: 'vol32',
  size: 40,
};

const mockBackupVolume: BackupVolumeInfo = {
  id: 'vol-002',
  name: 'vol32',
  size: 92,
};

const mockCloneVolume: CloneVolumeInfo = {
  id: 'vol-003',
  name: 'vol57',
  size: 50,
};

const mockExtendVolume: ExtendVolumeInfo = {
  id: 'vol-004',
  name: 'vol57',
  size: 49,
};

const mockInstanceSnapshot: InstanceSnapshotInfo = {
  id: 'snap-001',
  name: 'data-snap',
  description: '',
};

const mockVolumeSnapshot: VolumeSnapshotInfo = {
  id: 'snap-002',
  name: 'data-snap',
  size: 30,
};

const mockImage: ImageInfo = {
  id: 'img-001',
  name: 'Ubuntu-22.04-base',
  size: 30,
};

const mockEditImage: EditImageInfo = {
  id: 'img-002',
  name: 'tk-instance',
  description: '',
};

const mockKeyPair: KeyPairInfo = {
  id: 'key-001',
  name: 'dev-key',
};

const mockServerGroup: ServerGroupInfo = {
  id: 'sg-001',
  name: 'server-01',
};

const mockImageVolume: ImageVolumeInfo = {
  id: 'vol-img-001',
  name: 'db-date',
  size: 1500,
};

const mockEditVolume: EditVolumeVolumeInfo = {
  id: 'vol-edit-001',
  name: 'vol-05',
  description: '',
};

const mockChangeTypeVolume: ChangeVolumeTypeVolumeInfo = {
  id: 'vol-type-001',
  name: 'vol-05',
  currentType: '_DEFAULT_',
};

const mockTransferVolume: TransferVolumeInfo = {
  id: 'vol-transfer-001',
  name: 'vol-05',
  size: 30,
};

const mockVolumeBackup: VolumeBackupInfo = {
  id: 'vol-backup-001',
  name: 'vol-snap-05',
  description: '',
};

const mockEditVolumeSnapshot: EditVolumeSnapshotInfo = {
  id: 'vol-snapshot-001',
  name: 'vol-snap-05',
  description: '',
};

const mockVolumeSnapshotForCreate: CreateVolFromSnapVolumeSnapshotInfo = {
  id: 'vol-snap-create-001',
  name: 'vol-05-snap-20251020',
  size: 10,
};

const mockVolumeBackupForCreate: CreateVolFromBackupVolumeBackupInfo = {
  id: 'vol-backup-create-001',
  name: 'vol-05-backup-20251020',
  size: 10,
};

/* ----------------------------------------
   Drawer List Item Component
   ---------------------------------------- */

interface DrawerListItemProps {
  title: string;
  description: string;
  category?: string;
  onOpen: () => void;
}

function DrawerListItem({ title, description, category, onOpen }: DrawerListItemProps) {
  return (
    <div 
      className="flex items-center justify-between px-4 py-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)] transition-colors cursor-pointer group"
      onClick={onOpen}
    >
      <HStack gap={4} className="flex-1 items-center min-w-0">
        {category && (
          <Badge variant="info" size="sm" className="shrink-0 w-[100px] justify-center">
            {category}
          </Badge>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)] truncate">
            {title}
          </h3>
          <p className="text-[12px] text-[var(--color-text-subtle)] truncate mt-0.5">
            {description}
          </p>
        </div>
      </HStack>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Open
      </Button>
    </div>
  );
}

// Alias for backward compatibility
const DrawerCard = DrawerListItem;

/* ----------------------------------------
   DrawersPage Component
   ---------------------------------------- */

export function DrawersPage() {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Drawer states
  const [isCreateSnapshotOpen, setIsCreateSnapshotOpen] = useState(false);
  const [isEditInstanceOpen, setIsEditInstanceOpen] = useState(false);
  const [isLockSettingOpen, setIsLockSettingOpen] = useState(false);
  const [isViewPreferencesOpen, setIsViewPreferencesOpen] = useState(false);
  const [isCreateVolumeSnapshotOpen, setIsCreateVolumeSnapshotOpen] = useState(false);
  const [isCreateVolumeBackupOpen, setIsCreateVolumeBackupOpen] = useState(false);
  const [isCloneVolumeOpen, setIsCloneVolumeOpen] = useState(false);
  const [isExtendVolumeOpen, setIsExtendVolumeOpen] = useState(false);
  const [isEditInstanceSnapshotOpen, setIsEditInstanceSnapshotOpen] = useState(false);
  const [isCreateVolumeFromSnapshotOpen, setIsCreateVolumeFromSnapshotOpen] = useState(false);
  const [isCreateVolumeFromImageOpen, setIsCreateVolumeFromImageOpen] = useState(false);
  const [isEditImageOpen, setIsEditImageOpen] = useState(false);
  const [isCreateKeyPairOpen, setIsCreateKeyPairOpen] = useState(false);
  const [isEditKeyPairOpen, setIsEditKeyPairOpen] = useState(false);
  const [isCreateServerGroupOpen, setIsCreateServerGroupOpen] = useState(false);
  const [isEditServerGroupOpen, setIsEditServerGroupOpen] = useState(false);
  const [isCreateImageFromVolumeOpen, setIsCreateImageFromVolumeOpen] = useState(false);
  const [isEditVolumeOpen, setIsEditVolumeOpen] = useState(false);
  const [isChangeVolumeTypeOpen, setIsChangeVolumeTypeOpen] = useState(false);
  const [isCreateTransferOpen, setIsCreateTransferOpen] = useState(false);
  const [isEditVolumeBackupOpen, setIsEditVolumeBackupOpen] = useState(false);
  const [isAcceptVolumeTransferOpen, setIsAcceptVolumeTransferOpen] = useState(false);
  const [isEditVolumeSnapshotOpen, setIsEditVolumeSnapshotOpen] = useState(false);
  const [isCreateVolumeFromVolumeSnapshotOpen, setIsCreateVolumeFromVolumeSnapshotOpen] = useState(false);
  const [isCreateVolumeFromBackupOpen, setIsCreateVolumeFromBackupOpen] = useState(false);
  const [isAddL7PolicyOpen, setIsAddL7PolicyOpen] = useState(false);
  const [isRegisterCertificateOpen, setIsRegisterCertificateOpen] = useState(false);
  const [isCreateSecurityGroupRuleOpen, setIsCreateSecurityGroupRuleOpen] = useState(false);
  const [isEditNetworkOpen, setIsEditNetworkOpen] = useState(false);
  const [isEditRouterOpen, setIsEditRouterOpen] = useState(false);
  const [isCreateStaticRouteOpen, setIsCreateStaticRouteOpen] = useState(false);
  const [isEditPortOpen, setIsEditPortOpen] = useState(false);
  const [isCreateAllowedAddressPairOpen, setIsCreateAllowedAddressPairOpen] = useState(false);
  const [isEditFloatingIPOpen, setIsEditFloatingIPOpen] = useState(false);
  const [isCreateSecurityGroupOpen, setIsCreateSecurityGroupOpen] = useState(false);
  const [isEditSecurityGroupOpen, setIsEditSecurityGroupOpen] = useState(false);
  const [isEditCertificateOpen, setIsEditCertificateOpen] = useState(false);
  const [isEditLoadBalancerOpen, setIsEditLoadBalancerOpen] = useState(false);
  const [isEditPoolOpen, setIsEditPoolOpen] = useState(false);
  const [isAddL7RuleOpen, setIsAddL7RuleOpen] = useState(false);
  const [isEditListenerOpen, setIsEditListenerOpen] = useState(false);
  const [isAllocateIPOpen, setIsAllocateIPOpen] = useState(false);
  const [isCreateHealthMonitorOpen, setIsCreateHealthMonitorOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);

  // ViewPreferences state
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columns, setColumns] = useState<ColumnConfig[]>(mockViewPreferencesColumns);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}>
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* TabBar */}
          <TabBar
            tabs={tabs.map((tab) => ({
              id: tab.id,
              label: tab.label,
              closable: tab.closable,
            }))}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* TopBar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Design system', href: '/design-system' },
                  { label: 'Drawers' },
                ]}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          {/* Content */}
          <div className="px-8 py-6">
            <VStack gap={8}>
              {/* Header */}
              <VStack gap={2}>
                <h1 className="text-[24px] font-semibold text-[var(--color-text-default)]">
                  Drawer components
                </h1>
                <p className="text-[14px] text-[var(--color-text-subtle)]">
                  Collection of drawer components used across the application. Click to preview each drawer.
                </p>
              </VStack>

              {/* Drawer Categories */}
              <VStack gap={4}>
                {/* Instance Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Instance Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Create instance snapshot"
                      description="Create a snapshot of an instance to capture its current system state as an image."
                      category="Instance"
                      onOpen={() => setIsCreateSnapshotOpen(true)}
                    />
                    <DrawerCard
                      title="Edit instance"
                      description="Edit instance name and description. Allows modification of basic instance metadata."
                      category="Instance"
                      onOpen={() => setIsEditInstanceOpen(true)}
                    />
                    <DrawerCard
                      title="Lock setting"
                      description="Lock or unlock an instance to prevent accidental deletion or modification."
                      category="Instance"
                      onOpen={() => setIsLockSettingOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Instance Snapshot Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Instance Snapshot Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Edit instance Snapshot"
                      description="Edit the name and description of an instance snapshot."
                      category="Snapshot"
                      onOpen={() => setIsEditInstanceSnapshotOpen(true)}
                    />
                    <DrawerCard
                      title="Create volume from Instance Snapshot"
                      description="Create a new volume from an instance snapshot, containing the same data as the snapshot's system disk."
                      category="Snapshot"
                      onOpen={() => setIsCreateVolumeFromSnapshotOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Volume Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Volume Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Create volume snapshot"
                      description="Create a snapshot of a volume to back up its current data state for later restoration."
                      category="Volume"
                      onOpen={() => setIsCreateVolumeSnapshotOpen(true)}
                    />
                    <DrawerCard
                      title="Create volume backup"
                      description="Create a full backup of a volume and store it in the backup service for disaster recovery."
                      category="Volume"
                      onOpen={() => setIsCreateVolumeBackupOpen(true)}
                    />
                    <DrawerCard
                      title="Clone volume"
                      description="Create an exact copy of a volume for testing, backup, or new instance creation."
                      category="Volume"
                      onOpen={() => setIsCloneVolumeOpen(true)}
                    />
                    <DrawerCard
                      title="Extend volume"
                      description="Increase the size of a volume to expand its storage capacity."
                      category="Volume"
                      onOpen={() => setIsExtendVolumeOpen(true)}
                    />
                    <DrawerCard
                      title="Create image from Volume"
                      description="Create a new image using a volume as the source. The image will contain all data currently stored on the volume."
                      category="Volume"
                      onOpen={() => setIsCreateImageFromVolumeOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Volume"
                      description="Edit the name and description of an existing volume."
                      category="Volume"
                      onOpen={() => setIsEditVolumeOpen(true)}
                    />
                    <DrawerCard
                      title="Change volume Type"
                      description="Change the storage type of this volume to another available volume type."
                      category="Volume"
                      onOpen={() => setIsChangeVolumeTypeOpen(true)}
                    />
                    <DrawerCard
                      title="Create transfer"
                      description="Create a transfer request to share this volume with another project."
                      category="Volume"
                      onOpen={() => setIsCreateTransferOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Volume backup"
                      description="Edit the name and description of an existing volume backup."
                      category="Volume"
                      onOpen={() => setIsEditVolumeBackupOpen(true)}
                    />
                    <DrawerCard
                      title="Accept Volume Transfer"
                      description="Accept a volume transfer using the provided transfer ID and authorization key."
                      category="Volume"
                      onOpen={() => setIsAcceptVolumeTransferOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Volume snapshot"
                      description="Edit the name and description of an existing volume snapshot."
                      category="Volume"
                      onOpen={() => setIsEditVolumeSnapshotOpen(true)}
                    />
                    <DrawerCard
                      title="Create volume from Snapshot"
                      description="Create a new volume from an existing volume snapshot with customizable capacity and type."
                      category="Volume"
                      onOpen={() => setIsCreateVolumeFromVolumeSnapshotOpen(true)}
                    />
                    <DrawerCard
                      title="Create volume from Backup"
                      description="Create a new volume from an existing volume backup with customizable capacity, type, and availability zone."
                      category="Volume"
                      onOpen={() => setIsCreateVolumeFromBackupOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Image Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Image Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Create volume from Image"
                      description="Create a new volume using the selected image. The new volume will contain an identical copy of the image data."
                      category="Image"
                      onOpen={() => setIsCreateVolumeFromImageOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Image"
                      description="Edit image name and description. Allows modification of basic image metadata."
                      category="Image"
                      onOpen={() => setIsEditImageOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Key pair Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Key pair Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Create Key pair"
                      description="Create a new SSH key pair or import an existing public key to securely access your instances."
                      category="Key pair"
                      onOpen={() => setIsCreateKeyPairOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Key pair"
                      description="Edit the name of an existing SSH key pair."
                      category="Key pair"
                      onOpen={() => setIsEditKeyPairOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Server group Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Server group Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Create Server group"
                      description="Create a server group to control how instances are placed across compute hosts using affinity/anti-affinity policies."
                      category="Server group"
                      onOpen={() => setIsCreateServerGroupOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Server group"
                      description="Edit the name of an existing server group."
                      category="Server group"
                      onOpen={() => setIsEditServerGroupOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Network Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Network Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Edit Network"
                      description="Edit network settings including name, description, admin state, and port security."
                      category="Network"
                      onOpen={() => setIsEditNetworkOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Router"
                      description="Edit router settings including name, description, and admin state."
                      category="Router"
                      onOpen={() => setIsEditRouterOpen(true)}
                    />
                    <DrawerCard
                      title="Create static Route"
                      description="Add a static route to manually define traffic paths beyond connected subnets."
                      category="Router"
                      onOpen={() => setIsCreateStaticRouteOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Port"
                      description="Edit port settings including name and description."
                      category="Port"
                      onOpen={() => setIsEditPortOpen(true)}
                    />
                    <DrawerCard
                      title="Create Allowed Address Pair"
                      description="Specify additional IP or MAC addresses that are allowed to pass through this port."
                      category="Port"
                      onOpen={() => setIsCreateAllowedAddressPairOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Floating IP"
                      description="Edit floating IP description."
                      category="Floating IP"
                      onOpen={() => setIsEditFloatingIPOpen(true)}
                    />
                    <DrawerCard
                      title="Allocate IP"
                      description="Assign an additional fixed IP address to a port from a subnet."
                      category="Port"
                      onOpen={() => setIsAllocateIPOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Security group Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Security group Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Create Security group Rule"
                      description="Create a rule to define allowed inbound or outbound network traffic for your security group."
                      category="Security group"
                      onOpen={() => setIsCreateSecurityGroupRuleOpen(true)}
                    />
                    <DrawerCard
                      title="Create Security group"
                      description="Create a security group to define network access rules for your instances."
                      category="Security group"
                      onOpen={() => setIsCreateSecurityGroupOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Security group"
                      description="Edit security group name and description."
                      category="Security group"
                      onOpen={() => setIsEditSecurityGroupOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Load balancer Actions */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Load balancer Actions
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="Add L7 Policy"
                      description="Add an L7 policy to control traffic routing based on layer 7 attributes like URL path or headers."
                      category="Load balancer"
                      onOpen={() => setIsAddL7PolicyOpen(true)}
                    />
                    <DrawerCard
                      title="Register certificate"
                      description="Register a certificate issued by an external CA for use within Compute resources."
                      category="Certificate"
                      onOpen={() => setIsRegisterCertificateOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Certificate"
                      description="Edit certificate name and description."
                      category="Certificate"
                      onOpen={() => setIsEditCertificateOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Load balancer"
                      description="Edit load balancer name, description, and admin state."
                      category="Load balancer"
                      onOpen={() => setIsEditLoadBalancerOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Pool"
                      description="Edit pool settings including algorithm, session persistence, TLS, and admin state."
                      category="Load balancer"
                      onOpen={() => setIsEditPoolOpen(true)}
                    />
                    <DrawerCard
                      title="Add L7 Rule"
                      description="Add an L7 rule to match incoming requests based on headers, paths, or other attributes."
                      category="Load balancer"
                      onOpen={() => setIsAddL7RuleOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Listener"
                      description="Edit listener settings including name, connection limits, timeouts, and allowed CIDRs."
                      category="Load balancer"
                      onOpen={() => setIsEditListenerOpen(true)}
                    />
                    <DrawerCard
                      title="Create Health Monitor"
                      description="Create a health monitor for a pool to check backend member availability."
                      category="Load balancer"
                      onOpen={() => setIsCreateHealthMonitorOpen(true)}
                    />
                    <DrawerCard
                      title="Edit Member"
                      description="Edit pool member settings including weight, monitor address, backup, and admin state."
                      category="Load balancer"
                      onOpen={() => setIsEditMemberOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Table Settings */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Table Settings
                  </h2>
                  <div className="flex flex-col gap-2">
                    <DrawerCard
                      title="View Preferences"
                      description="Customize table view by showing/hiding columns, reordering columns, and adjusting rows per page."
                      category="Table"
                      onOpen={() => setIsViewPreferencesOpen(true)}
                    />
                  </div>
                </VStack>

                {/* Placeholder for Future Drawers */}
                <VStack gap={2}>
                  <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Coming Soon
                  </h2>
                  <div className="flex flex-col gap-2">
                    <div className="p-6 rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                      <VStack gap={2} className="items-center justify-center h-full">
                        <p className="text-[14px] text-[var(--color-text-muted)]">
                          More drawers will be added here...
                        </p>
                      </VStack>
                    </div>
                  </div>
                </VStack>
              </VStack>
            </VStack>
          </div>
        </div>
      </main>

      {/* Drawer components */}
      <CreateInstanceSnapshotDrawer
        isOpen={isCreateSnapshotOpen}
        onClose={() => setIsCreateSnapshotOpen(false)}
        instance={mockSnapshotInstance}
        onSubmit={(name, description) => {
          console.log('Create snapshot:', { name, description });
        }}
      />

      <EditInstanceDrawer
        isOpen={isEditInstanceOpen}
        onClose={() => setIsEditInstanceOpen(false)}
        instance={mockEditInstance}
        onSubmit={(name, description) => {
          console.log('Edit instance:', { name, description });
        }}
      />

      <LockSettingDrawer
        isOpen={isLockSettingOpen}
        onClose={() => setIsLockSettingOpen(false)}
        instance={mockLockInstance}
        onSubmit={(isLocked) => {
          console.log('Lock setting:', { isLocked });
        }}
      />

      <ViewPreferencesDrawer
        isOpen={isViewPreferencesOpen}
        onClose={() => setIsViewPreferencesOpen(false)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columns}
        onColumnsChange={setColumns}
        defaultColumns={mockViewPreferencesColumns}
      />

      <CreateVolumeSnapshotDrawer
        isOpen={isCreateVolumeSnapshotOpen}
        onClose={() => setIsCreateVolumeSnapshotOpen(false)}
        volume={mockVolume}
        volumeSnapshotQuota={{ used: 2, total: 10 }}
        typeSnapshotQuota={{ used: 2, total: null }}
        onSubmit={(name) => {
          console.log('Create volume snapshot:', { name });
        }}
      />

      <CreateVolumeBackupDrawer
        isOpen={isCreateVolumeBackupOpen}
        onClose={() => setIsCreateVolumeBackupOpen(false)}
        volume={mockBackupVolume}
        volumeBackupQuota={{ used: 1, total: 10 }}
        volumeBackupCapacityQuota={{ used: 20, total: 1000 }}
        onSubmit={(name, mode) => {
          console.log('Create volume backup:', { name, mode });
        }}
      />

      <CloneVolumeDrawer
        isOpen={isCloneVolumeOpen}
        onClose={() => setIsCloneVolumeOpen(false)}
        volume={mockCloneVolume}
        minCapacity={201}
        maxCapacity={2000}
        volumeQuota={{ used: 2, total: 10 }}
        volumeCapacityQuota={{ used: 20, total: 1000 }}
        typeQuota={{ used: 2, total: null }}
        typeCapacityQuota={{ used: 2, total: null }}
        onSubmit={(name, capacity, volumeType) => {
          console.log('Clone volume:', { name, capacity, volumeType });
        }}
      />

      <ExtendVolumeDrawer
        isOpen={isExtendVolumeOpen}
        onClose={() => setIsExtendVolumeOpen(false)}
        volume={mockExtendVolume}
        minCapacity={201}
        maxCapacity={2000}
        volumeCapacityQuota={{ used: 20, total: 1000 }}
        typeCapacityQuota={{ used: 2, total: null }}
        onSubmit={(newCapacity) => {
          console.log('Extend volume:', { newCapacity });
        }}
      />

      <EditInstanceSnapshotDrawer
        isOpen={isEditInstanceSnapshotOpen}
        onClose={() => setIsEditInstanceSnapshotOpen(false)}
        snapshot={mockInstanceSnapshot}
        onSubmit={(name, description) => {
          console.log('Edit instance snapshot:', { name, description });
        }}
      />

      <CreateVolumeFromSnapshotDrawer
        isOpen={isCreateVolumeFromSnapshotOpen}
        onClose={() => setIsCreateVolumeFromSnapshotOpen(false)}
        snapshot={mockVolumeSnapshot}
        minCapacity={201}
        maxCapacity={2000}
        volumeQuota={{ used: 2, total: 10 }}
        volumeCapacityQuota={{ used: 20, total: 1000 }}
        typeQuota={{ used: 2, total: null }}
        typeCapacityQuota={{ used: 2, total: null }}
        onSubmit={(volumeName, capacity, volumeType) => {
          console.log('Create volume from snapshot:', { volumeName, capacity, volumeType });
        }}
      />

      <CreateVolumeFromImageDrawer
        isOpen={isCreateVolumeFromImageOpen}
        onClose={() => setIsCreateVolumeFromImageOpen(false)}
        image={mockImage}
        minCapacity={201}
        maxCapacity={2000}
        volumeQuota={{ used: 2, total: 10 }}
        volumeCapacityQuota={{ used: 20, total: 1000 }}
        typeQuota={{ used: 2, total: null }}
        typeCapacityQuota={{ used: 2, total: null }}
        onSubmit={(volumeName, capacity, volumeType) => {
          console.log('Create volume from image:', { volumeName, capacity, volumeType });
        }}
      />

      <EditImageDrawer
        isOpen={isEditImageOpen}
        onClose={() => setIsEditImageOpen(false)}
        image={mockEditImage}
        onSubmit={(name, description) => {
          console.log('Edit image:', { name, description });
        }}
      />

      <CreateKeyPairDrawer
        isOpen={isCreateKeyPairOpen}
        onClose={() => setIsCreateKeyPairOpen(false)}
        keyPairQuota={{ used: 2, total: 10 }}
        onSubmit={(name, type, publicKey) => {
          console.log('Create key pair:', { name, type, publicKey });
        }}
      />

      <EditKeyPairDrawer
        isOpen={isEditKeyPairOpen}
        onClose={() => setIsEditKeyPairOpen(false)}
        keyPair={mockKeyPair}
        onSubmit={(name) => {
          console.log('Edit key pair:', { name });
        }}
      />

      <CreateServerGroupDrawer
        isOpen={isCreateServerGroupOpen}
        onClose={() => setIsCreateServerGroupOpen(false)}
        serverGroupQuota={{ used: 2, total: 10 }}
        onSubmit={(name, policy) => {
          console.log('Create server group:', { name, policy });
        }}
      />

      <EditServerGroupDrawer
        isOpen={isEditServerGroupOpen}
        onClose={() => setIsEditServerGroupOpen(false)}
        serverGroup={mockServerGroup}
        onSubmit={(name) => {
          console.log('Edit server group:', { name });
        }}
      />

      <CreateImageFromVolumeDrawer
        isOpen={isCreateImageFromVolumeOpen}
        onClose={() => setIsCreateImageFromVolumeOpen(false)}
        volume={mockImageVolume}
        onSubmit={(imageName, diskFormat) => {
          console.log('Create image from volume:', { imageName, diskFormat });
        }}
      />

      <EditVolumeDrawer
        isOpen={isEditVolumeOpen}
        onClose={() => setIsEditVolumeOpen(false)}
        volume={mockEditVolume}
        onSubmit={(name, description) => {
          console.log('Edit volume:', { name, description });
        }}
      />

      <ChangeVolumeTypeDrawer
        isOpen={isChangeVolumeTypeOpen}
        onClose={() => setIsChangeVolumeTypeOpen(false)}
        volume={mockChangeTypeVolume}
        onSubmit={(newVolumeType) => {
          console.log('Change volume type:', { newVolumeType });
        }}
      />

      <CreateTransferDrawer
        isOpen={isCreateTransferOpen}
        onClose={() => setIsCreateTransferOpen(false)}
        volume={mockTransferVolume}
        onSubmit={(transferName) => {
          console.log('Create transfer:', { transferName });
        }}
      />

      <EditVolumeBackupDrawer
        isOpen={isEditVolumeBackupOpen}
        onClose={() => setIsEditVolumeBackupOpen(false)}
        volumeBackup={mockVolumeBackup}
        onSubmit={(name, description) => {
          console.log('Edit volume backup:', { name, description });
        }}
      />

      <AcceptVolumeTransferDrawer
        isOpen={isAcceptVolumeTransferOpen}
        onClose={() => setIsAcceptVolumeTransferOpen(false)}
        onSubmit={(transferId, authKey) => {
          console.log('Accept volume transfer:', { transferId, authKey });
        }}
      />

      <EditVolumeSnapshotDrawer
        isOpen={isEditVolumeSnapshotOpen}
        onClose={() => setIsEditVolumeSnapshotOpen(false)}
        volumeSnapshot={mockEditVolumeSnapshot}
        onSubmit={(name, description) => {
          console.log('Edit volume snapshot:', { name, description });
        }}
      />

      <CreateVolumeFromVolumeSnapshotDrawer
        isOpen={isCreateVolumeFromVolumeSnapshotOpen}
        onClose={() => setIsCreateVolumeFromVolumeSnapshotOpen(false)}
        volumeSnapshot={mockVolumeSnapshotForCreate}
        onSubmit={(volumeName, description, capacity, volumeType) => {
          console.log('Create volume from snapshot:', { volumeName, description, capacity, volumeType });
        }}
      />

      <CreateVolumeFromBackupDrawer
        isOpen={isCreateVolumeFromBackupOpen}
        onClose={() => setIsCreateVolumeFromBackupOpen(false)}
        volumeBackup={mockVolumeBackupForCreate}
        onSubmit={(volumeName, description, capacity, volumeType, az) => {
          console.log('Create volume from backup:', { volumeName, description, capacity, volumeType, az });
        }}
      />

      <AddL7PolicyDrawer
        isOpen={isAddL7PolicyOpen}
        onClose={() => setIsAddL7PolicyOpen(false)}
        onSubmit={(policyName, description, action, targetPool, position, adminStateUp) => {
          console.log('Add L7 policy:', { policyName, description, action, targetPool, position, adminStateUp });
        }}
      />

      <RegisterCertificateDrawer
        isOpen={isRegisterCertificateOpen}
        onClose={() => setIsRegisterCertificateOpen(false)}
        onSubmit={(type, name, description, certificateBody, privateKey, intermediateCert) => {
          console.log('Register certificate:', { type, name, description, certificateBody, privateKey, intermediateCert });
        }}
      />

      <CreateSecurityGroupRuleDrawer
        isOpen={isCreateSecurityGroupRuleOpen}
        onClose={() => setIsCreateSecurityGroupRuleOpen(false)}
        ruleQuota={{ used: 2, total: 10 }}
        securityGroups={[
          { value: 'sg-1', label: 'default' },
          { value: 'sg-2', label: 'web-servers' },
          { value: 'sg-3', label: 'db-servers' },
        ]}
        onSubmit={(direction, protocol, portRangeType, portRange, remoteType, remoteValue) => {
          console.log('Create security group rule:', { direction, protocol, portRangeType, portRange, remoteType, remoteValue });
        }}
      />

      <EditNetworkDrawer
        isOpen={isEditNetworkOpen}
        onClose={() => setIsEditNetworkOpen(false)}
        network={{
          id: 'net-123',
          name: 'net-1',
          description: '',
          adminStateUp: true,
          portSecurityEnabled: true,
        }}
        onSubmit={(name, description, adminStateUp, portSecurityEnabled) => {
          console.log('Edit network:', { name, description, adminStateUp, portSecurityEnabled });
        }}
      />

      <EditRouterDrawer
        isOpen={isEditRouterOpen}
        onClose={() => setIsEditRouterOpen(false)}
        router={{
          id: 'router-123',
          name: 'net-1',
          description: '',
          adminStateUp: true,
        }}
        onSubmit={(name, description, adminStateUp) => {
          console.log('Edit router:', { name, description, adminStateUp });
        }}
      />

      <CreateStaticRouteDrawer
        isOpen={isCreateStaticRouteOpen}
        onClose={() => setIsCreateStaticRouteOpen(false)}
        router={{
          id: 'router-123',
          name: 'router-01',
        }}
        onSubmit={(destinationCidr, nextHop) => {
          console.log('Create static route:', { destinationCidr, nextHop });
        }}
      />

      <EditPortDrawer
        isOpen={isEditPortOpen}
        onClose={() => setIsEditPortOpen(false)}
        port={{
          id: 'port-123',
          name: 'port-01',
          description: '',
        }}
        onSubmit={(name, description) => {
          console.log('Edit port:', { name, description });
        }}
      />

      <CreateAllowedAddressPairDrawer
        isOpen={isCreateAllowedAddressPairOpen}
        onClose={() => setIsCreateAllowedAddressPairOpen(false)}
        onSubmit={(cidr, macAddressType, macAddress) => {
          console.log('Create allowed address pair:', { cidr, macAddressType, macAddress });
        }}
      />

      <EditFloatingIPDrawer
        isOpen={isEditFloatingIPOpen}
        onClose={() => setIsEditFloatingIPOpen(false)}
        floatingIP={{
          id: 'fip-123',
          ipAddress: '172.24.4.228',
          description: '',
        }}
        onSubmit={(description) => {
          console.log('Edit floating IP:', { description });
        }}
      />

      <CreateSecurityGroupDrawer
        isOpen={isCreateSecurityGroupOpen}
        onClose={() => setIsCreateSecurityGroupOpen(false)}
        quota={{
          used: 2,
          limit: 10,
        }}
        onSubmit={(name, description) => {
          console.log('Create security group:', { name, description });
        }}
      />

      <EditSecurityGroupDrawer
        isOpen={isEditSecurityGroupOpen}
        onClose={() => setIsEditSecurityGroupOpen(false)}
        securityGroup={{
          id: 'sg-123',
          name: 'web-server-sg',
          description: 'Web server access group',
        }}
        onSubmit={(name, description) => {
          console.log('Edit security group:', { name, description });
        }}
      />

      <EditCertificateDrawer
        isOpen={isEditCertificateOpen}
        onClose={() => setIsEditCertificateOpen(false)}
        certificate={{
          id: 'cert-123',
          name: 'my-ssl-cert',
          description: '',
        }}
        onSubmit={(name, description) => {
          console.log('Edit certificate:', { name, description });
        }}
      />

      <EditLoadBalancerDrawer
        isOpen={isEditLoadBalancerOpen}
        onClose={() => setIsEditLoadBalancerOpen(false)}
        loadBalancer={{
          id: 'lb-123',
          name: 'web-lb-01',
          description: '',
          adminStateUp: true,
        }}
        onSubmit={(name, description, adminStateUp) => {
          console.log('Edit load balancer:', { name, description, adminStateUp });
        }}
      />

      <EditPoolDrawer
        isOpen={isEditPoolOpen}
        onClose={() => setIsEditPoolOpen(false)}
        pool={{
          id: 'pool-123',
          name: 'pool-http',
          description: '',
          algorithm: 'ROUND_ROBIN',
          protocol: 'HTTP',
          sessionPersistenceType: 'APP_COOKIE',
          sessionPersistenceCookieName: '',
          tlsEnabled: true,
          tlsCiphers: '',
          adminStateUp: true,
        }}
        onSubmit={(data) => {
          console.log('Edit pool:', data);
        }}
      />

      <AddL7RuleDrawer
        isOpen={isAddL7RuleOpen}
        onClose={() => setIsAddL7RuleOpen(false)}
        onSubmit={(data) => {
          console.log('Add L7 rule:', data);
        }}
      />

      <EditListenerDrawer
        isOpen={isEditListenerOpen}
        onClose={() => setIsEditListenerOpen(false)}
        listener={{
          id: 'listener-123',
          name: 'listener-http-80',
          description: '',
          protocol: 'HTTP',
          port: 80,
          connectionLimit: -1,
          xForwardedFor: false,
          xForwardedPort: false,
          clientDataTimeout: 50000,
          memberConnectTimeout: 50000,
          memberDataTimeout: 50000,
          tcpInspectTimeout: 0,
          allowedCidrs: ['10.62.0.32/24'],
          adminStateUp: true,
        }}
        onSubmit={(data) => {
          console.log('Edit listener:', data);
        }}
      />

      <AllocateIPDrawer
        isOpen={isAllocateIPOpen}
        onClose={() => setIsAllocateIPOpen(false)}
        port={{
          id: 'port-001',
          name: 'port-10',
          networkName: 'net-01',
        }}
        subnets={[
          { id: 'subnet-001', name: 'subnet-01', cidr: '10.62.0.0/24', ipRangeStart: '10.62.0.31', ipRangeEnd: '10.62.0.77' },
          { id: 'subnet-002', name: 'subnet-02', cidr: '10.63.0.0/24', ipRangeStart: '10.63.0.10', ipRangeEnd: '10.63.0.100' },
        ]}
        onSubmit={(data) => {
          console.log('Allocate IP:', data);
        }}
      />

      <CreateHealthMonitorDrawer
        isOpen={isCreateHealthMonitorOpen}
        onClose={() => setIsCreateHealthMonitorOpen(false)}
        pool={{
          id: 'pool-001',
          name: 'pool-http',
        }}
        onSubmit={(data) => {
          console.log('Create health monitor:', data);
        }}
      />

      <EditMemberDrawer
        isOpen={isEditMemberOpen}
        onClose={() => setIsEditMemberOpen(false)}
        member={{
          id: 'member-001',
          source: 'instance-usw-1a',
          ipAddress: '10.63.0.46',
          port: 80,
          weight: 5,
          monitorIpAddress: '',
          monitorPort: undefined,
          backup: false,
          adminStateUp: true,
        }}
        onSubmit={(data) => {
          console.log('Edit member:', data);
        }}
      />
    </div>
  );
}

export default DrawersPage;

