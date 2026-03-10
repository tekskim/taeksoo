import { useState, useCallback, createContext, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  VStack,
  HStack,
  Badge,
  Disclosure,
  PageShell,
  TopBar,
  SearchInput,
} from '@/design-system';
import { IconChevronRight, IconChevronDown, IconArrowLeft } from '@tabler/icons-react';

const DrawerSearchContext = createContext('');

// Import all drawer components
import {
  CreateInstanceSnapshotDrawer,
  type InstanceInfo as SnapshotInstanceInfo,
} from '@/components/CreateInstanceSnapshotDrawer';
import {
  EditInstanceDrawer,
  type InstanceInfo as EditInstanceInfo,
} from '@/components/EditInstanceDrawer';
import {
  LockSettingDrawer,
  type InstanceInfo as LockInstanceInfo,
} from '@/components/LockSettingDrawer';
import {
  BootSettingDrawer,
  type VolumeInfo as BootVolumeInfo,
} from '@/components/BootSettingDrawer';
import { ViewPreferencesDrawer, type ColumnConfig } from '@/components/ViewPreferencesDrawer';
import {
  CreateVolumeSnapshotDrawer,
  type VolumeInfo,
} from '@/components/CreateVolumeSnapshotDrawer';
import {
  CreateVolumeBackupDrawer,
  type VolumeInfo as BackupVolumeInfo,
} from '@/components/CreateVolumeBackupDrawer';
import {
  CloneVolumeDrawer,
  type VolumeInfo as CloneVolumeInfo,
} from '@/components/CloneVolumeDrawer';
import {
  ExtendVolumeDrawer,
  type VolumeInfo as ExtendVolumeInfo,
} from '@/components/ExtendVolumeDrawer';
import {
  EditInstanceSnapshotDrawer,
  type InstanceSnapshotInfo,
} from '@/components/EditInstanceSnapshotDrawer';
import {
  CreateVolumeFromSnapshotDrawer,
  type InstanceSnapshotInfo as VolumeSnapshotInfo,
} from '@/components/CreateVolumeFromSnapshotDrawer';
import {
  CreateVolumeFromImageDrawer,
  type ImageInfo,
} from '@/components/CreateVolumeFromImageDrawer';
import { EditImageDrawer, type ImageInfo as EditImageInfo } from '@/components/EditImageDrawer';
import { CreateKeyPairDrawer } from '@/components/CreateKeyPairDrawer';
import { EditKeyPairDrawer, type KeyPairInfo } from '@/components/EditKeyPairDrawer';
import { CreateServerGroupDrawer } from '@/components/CreateServerGroupDrawer';
import { EditServerGroupDrawer, type ServerGroupInfo } from '@/components/EditServerGroupDrawer';
import {
  CreateImageFromVolumeDrawer,
  type VolumeInfo as ImageVolumeInfo,
} from '@/components/CreateImageFromVolumeDrawer';
import {
  EditVolumeDrawer,
  type VolumeInfo as EditVolumeVolumeInfo,
} from '@/components/EditVolumeDrawer';
import {
  ChangeVolumeTypeDrawer,
  type VolumeInfo as ChangeVolumeTypeVolumeInfo,
} from '@/components/ChangeVolumeTypeDrawer';
import {
  CreateTransferDrawer,
  type VolumeInfo as TransferVolumeInfo,
} from '@/components/CreateTransferDrawer';
import { EditVolumeBackupDrawer, type VolumeBackupInfo } from '@/components/EditVolumeBackupDrawer';
import { AcceptVolumeTransferDrawer } from '@/components/AcceptVolumeTransferDrawer';
import {
  EditVolumeSnapshotDrawer,
  type VolumeSnapshotInfo as EditVolumeSnapshotInfo,
} from '@/components/EditVolumeSnapshotDrawer';
import {
  CreateVolumeFromVolumeSnapshotDrawer,
  type VolumeSnapshotInfo as CreateVolFromSnapVolumeSnapshotInfo,
} from '@/components/CreateVolumeFromVolumeSnapshotDrawer';
import {
  CreateVolumeFromBackupDrawer,
  type VolumeBackupInfo as CreateVolFromBackupVolumeBackupInfo,
} from '@/components/CreateVolumeFromBackupDrawer';
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
import {
  DetachVolumeDrawer,
  type InstanceInfo as DetachInstanceInfo,
} from '@/components/DetachVolumeDrawer';
import {
  AttachInterfaceDrawer,
  type InstanceInfo as AttachInterfaceInstanceInfo,
} from '@/components/AttachInterfaceDrawer';
import {
  DetachInterfaceDrawer,
  type InstanceInfo as DetachInterfaceInstanceInfo,
} from '@/components/DetachInterfaceDrawer';
import { AssociateFloatingIPDrawer } from '@/components/AssociateFloatingIPDrawer';
import {
  DisassociateFloatingIPDrawer,
  type InstanceInfo as DisassociateFloatingIPInstanceInfo,
} from '@/components/DisassociateFloatingIPDrawer';
import { ManageSecurityGroupsDrawer } from '@/components/ManageSecurityGroupsDrawer';
import {
  ManageTagsDrawer,
  type InstanceInfo as ManageTagsInstanceInfo,
} from '@/components/ManageTagsDrawer';
import {
  RescueInstanceDrawer,
  type InstanceInfo as RescueInstanceInfo,
} from '@/components/RescueInstanceDrawer';
import {
  RebuildInstanceDrawer,
  type InstanceInfo as RebuildInstanceInfo,
} from '@/components/RebuildInstanceDrawer';
import {
  ResizeInstanceDrawer,
  type InstanceInfo as ResizeInstanceInfo,
} from '@/components/ResizeInstanceDrawer';
import { CreateVolumeBackupWithSelectionDrawer } from '@/components/CreateVolumeBackupWithSelectionDrawer';
import { RestoreFromSnapshotDrawer } from '@/components/RestoreFromSnapshotDrawer';
import { AttachVolumeDrawer } from '@/components/AttachVolumeDrawer';
import { AttachInstanceDrawer } from '@/components/AttachInstanceDrawer';
import { ChangeVolumeTypeDrawer } from '@/components/ChangeVolumeTypeDrawer';
import { CreateSubnetDrawer } from '@/components/CreateSubnetDrawer';
import { CreateRouterDrawer } from '@/components/CreateRouterDrawer';
import { AttachPortToInstanceDrawer } from '@/components/AttachPortToInstanceDrawer';
import { EditPortSecurityGroupsDrawer } from '@/components/EditPortSecurityGroupsDrawer';
import { AssociateFloatingIPToLBDrawer } from '@/components/AssociateFloatingIPToLBDrawer';
import { ChangeServerCertificateDrawer } from '@/components/ChangeServerCertificateDrawer';
import { ChangeCACertificateDrawer } from '@/components/ChangeCACertificateDrawer';
import { ManageSNICertificateDrawer } from '@/components/ManageSNICertificateDrawer';
import { ExternalGatewaySettingDrawer } from '@/components/ExternalGatewaySettingDrawer';
import { ConnectSubnetDrawer } from '@/components/ConnectSubnetDrawer';
import { AssociateFloatingIPToPortDrawer } from '@/components/AssociateFloatingIPToPortDrawer';
import { DisconnectSubnetDrawer } from '@/components/DisconnectSubnetDrawer';
import { ManageMembersDrawer } from '@/components/ManageMembersDrawer';
import { AllocateFloatingIPDrawer } from '@/components/AllocateFloatingIPDrawer';
import { IdentifyDeviceDrawer } from '@/components/IdentifyDeviceDrawer';
import { CreateFolderDrawer } from '@/components/CreateFolderDrawer';
import { CreateObjectDrawer } from '@/components/CreateObjectDrawer';
import { MoveFilesDrawer } from '@/components/MoveFilesDrawer';
import { EditObjectDrawer } from '@/components/EditObjectDrawer';
import { ManageUserGroupsDrawer } from '@/components/ManageUserGroupsDrawer';
import { ManageUsersDrawer } from '@/components/ManageUsersDrawer';
import { ManageRolesDrawer } from '@/components/ManageRolesDrawer';
import { ResetPasswordDrawer } from '@/components/ResetPasswordDrawer';
import { EditUserDrawer } from '@/components/EditUserDrawer';
import { EditUserGroupDrawer } from '@/components/EditUserGroupDrawer';
import { ManagePoliciesDrawer } from '@/components/ManagePoliciesDrawer';
import { EditRoleDrawer } from '@/components/EditRoleDrawer';
import { CreateDomainDrawer } from '@/components/CreateDomainDrawer';
import { EditDomainDrawer } from '@/components/EditDomainDrawer';
import { SetDefaultDomainDrawer } from '@/components/SetDefaultDomainDrawer';
import { AdminLockSettingDrawer } from '@/components/AdminLockSettingDrawer';
import { EditSystemAdminDrawer } from '@/components/EditSystemAdminDrawer';
import {
  MigrateInstanceDrawer,
  type MigrateInstanceInfo,
} from '@/components/MigrateInstanceDrawer';
import {
  LiveMigrateInstanceDrawer,
  type LiveMigrateInstanceInfo,
} from '@/components/LiveMigrateInstanceDrawer';
import {
  ManageMetadataDrawer,
  type ManageMetadataImageInfo,
} from '@/components/ManageMetadataDrawer';
import {
  MigrateVolumeDrawer,
  type MigrateVolumeInfo as MigrateVolumeVolumeInfo,
} from '@/components/MigrateVolumeDrawer';
import { ManageRulesDrawer, type FirewallPolicyInfo } from '@/components/ManageRulesDrawer';
import {
  ModifyQuotasDrawer,
  type TenantInfo as ModifyQuotasTenantInfo,
} from '@/components/ModifyQuotasDrawer';
import { ResourceTypeSearchDrawer } from '@/components/ResourceTypeSearchDrawer';

/* ----------------------------------------
   Mock Data for Drawers ---------------------------------------- */

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

const mockBootVolume: BootVolumeInfo = {
  id: 'vol-005',
  name: 'vol32',
  size: '92 GiB',
  isBootable: true,
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
  os: 'ubuntu',
  osVersion: '24.24',
  osAdmin: 'root',
  isProtected: true,
  minDisk: 30,
  minRam: 30,
  qemuGuestAgent: true,
  cpuPolicy: 'none',
  cpuThreadPolicy: 'none',
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

const mockDetachInstance: DetachInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
};

const mockAttachInterfaceInstance: AttachInterfaceInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
};

const mockDetachInterfaceInstance: DetachInterfaceInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
};

const mockAssociateFloatingIPPort = {
  id: 'port-30',
  name: 'port-30',
};

const mockDisassociateFloatingIPInstance: DisassociateFloatingIPInstanceInfo = {
  id: 'inst-001',
  name: 'tk-test',
};

const mockManageSecurityGroupsInstance = {
  id: 'inst-01',
  name: 'web-server-01',
};

const mockManageTagsInstance: ManageTagsInstanceInfo = {
  id: 'inst-001',
  name: 'my-web-01',
};

const mockRescueInstance: RescueInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
  currentImage: 'ubuntu-24.04',
  protocol: 'HTTP',
};

const mockRebuildInstance: RebuildInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
  currentImage: 'ubuntu-24.04',
};

const mockMigrateInstance: MigrateInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
  currentHost: 'host-01',
};

const mockLiveMigrateInstance: LiveMigrateInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
  currentHost: 'host-01',
};

const mockManageMetadataImage: ManageMetadataImageInfo = {
  id: 'img-001',
  name: 'image',
};

const mockMigrateVolume: MigrateVolumeVolumeInfo = {
  id: 'vol-001',
  name: 'name',
  currentBackend: 'host-01',
};

const mockFirewallPolicy: FirewallPolicyInfo = {
  id: 'policy-001',
  name: 'name',
};

const mockQuotasTenant: ModifyQuotasTenantInfo = {
  id: 'tenant-001',
  name: 'tenant',
};

const mockResizeInstance: ResizeInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
  currentFlavor: {
    id: 'flavor-001',
    name: 'xlarge',
    vcpu: 2,
    ram: '2GiB',
    disk: '50GiB',
    ephemeralDisk: '0GiB',
    gpu: 2,
    npu: 2,
  },
};

/* ----------------------------------------
   Drawer List Item Component ---------------------------------------- */

interface DrawerListItemProps {
  title: string;
  description: string;
  category?: string;
  onOpen: () => void;
  linked?: boolean;
  linkedTo?: string;
}

function DrawerListItem({
  title,
  description,
  category,
  onOpen,
  linked,
  linkedTo,
}: DrawerListItemProps) {
  const searchQuery = useContext(DrawerSearchContext);
  if (
    searchQuery &&
    !title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !description.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !(category && category.toLowerCase().includes(searchQuery.toLowerCase()))
  ) {
    return null;
  }

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
          <HStack gap={2} className="items-center">
            <h3 className="text-label-lg text-[var(--color-text-default)] truncate">{title}</h3>
            {linked && (
              <Badge variant="success" size="sm" className="shrink-0">
                {linkedTo || '연결됨'}
              </Badge>
            )}
          </HStack>
          <p className="text-body-md text-[var(--color-text-subtle)] truncate mt-0.5">
            {description}
          </p>
        </div>
      </HStack>
      <Button
        variant="secondary"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Open{' '}
      </Button>
    </div>
  );
}

// Alias for backward compatibility
const DrawerCard = DrawerListItem;

/* ----------------------------------------
   DrawersPage Component ---------------------------------------- */

export function DrawersPage() {
  const navigate = useNavigate();

  // Drawer URL state
  const [searchParams, setSearchParams] = useSearchParams();
  const openDrawer = searchParams.get('drawer');
  const openDrawerFn = useCallback(
    (id: string) => {
      setSearchParams({ drawer: id }, { replace: true });
    },
    [setSearchParams]
  );
  const closeDrawer = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('drawer');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Search state
  const [drawerSearch, setDrawerSearch] = useState('');
  const isSearching = drawerSearch.trim().length > 0;

  // App section disclosure states
  const [isComputeOpen, setIsComputeOpen] = useState(false);
  const [isComputeAdminOpen, setIsComputeAdminOpen] = useState(false);
  const [isIAMOpen, setIsIAMOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);

  // Drawer states

  // Compute Admin Drawer states

  // Storage Drawer states

  // IAM drawer states

  // Container drawer states

  // ViewPreferences state
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columns, setColumns] = useState<ColumnConfig[]>(mockViewPreferencesColumns);

  const sidebarWidth = 0;

  return (
    <PageShell
      sidebarWidth={sidebarWidth}
      topBar={
        <TopBar
          breadcrumb={
            <HStack gap={4} align="center">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<IconArrowLeft size={14} />}
                onClick={() => navigate('/')}
              >
                Back
              </Button>
              <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                Drawer components
              </h1>
            </HStack>
          }
        />
      }
      contentClassName="max-w-7xl mx-auto px-8 py-8"
    >
      <DrawerSearchContext.Provider value={drawerSearch}>
        <VStack gap={8}>
          {/* Page Description + Search */}
          <VStack gap={4}>
            <p className="text-body-lg text-[var(--color-text-subtle)]">
              Collection of drawer components used across the application. Click to preview each
              drawer.
            </p>
            <SearchInput
              placeholder="Search drawers by name, description, or category..."
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
              className="w-[400px]"
            />
          </VStack>

          {/* Drawer Categories */}
          <VStack gap={4}>
            {/* Compute App Drawers */}
            <Disclosure open={isSearching || isComputeOpen} onChange={setIsComputeOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                  <div className="flex items-center gap-3">
                    {isSearching || isComputeOpen ? (
                      <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
                    ) : (
                      <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
                    )}
                    <Badge variant="info" size="sm" className="w-[70px] justify-center">
                      Compute{' '}
                    </Badge>
                    <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                      Drawers{' '}
                    </span>
                    <span className="text-body-md text-[var(--color-text-subtle)]">
                      (73 drawers)
                    </span>
                  </div>
                </div>
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  {/* Instance Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Instance actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Create instance snapshot"
                        description="Create a snapshot of an instance to capture its current system state as an image."
                        category="Instance"
                        onOpen={() => openDrawerFn('create-snapshot')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Edit instance"
                        description="Edit instance name and description. Allows modification of basic instance metadata."
                        category="Instance"
                        onOpen={() => openDrawerFn('edit-instance')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Lock setting"
                        description="Lock or unlock an instance to prevent accidental deletion or modification."
                        category="Instance"
                        onOpen={() => openDrawerFn('lock-setting')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Manage tags"
                        description="Add, edit, or remove tags to categorize and manage resources."
                        category="Instance"
                        onOpen={() => openDrawerFn('manage-tags')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Rescue instance"
                        description="Create a temporary recovery server using your instance's root disk."
                        category="Instance"
                        onOpen={() => openDrawerFn('rescue-instance')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Rebuild instance"
                        description="Rebuild the instance by reinstalling the operating system using a new image."
                        category="Instance"
                        onOpen={() => openDrawerFn('rebuild-instance')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Resize instance"
                        description="Change the flavor to adjust vCPU, memory, or disk capacity."
                        category="Instance"
                        onOpen={() => openDrawerFn('resize-instance')}
                        linked
                        linkedTo="Instance list"
                      />
                    </div>
                  </VStack>

                  {/* Instance Snapshot Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Instance snapshot actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Edit instance snapshot"
                        description="Edit the name and description of an instance snapshot."
                        category="Snapshot"
                        onOpen={() => openDrawerFn('edit-instance-snapshot')}
                        linked
                        linkedTo="Instance snapshots"
                      />
                      <DrawerCard
                        title="Create volume from instance snapshot"
                        description="Create a new volume from an instance snapshot, containing the same data as the snapshot's system disk."
                        category="Snapshot"
                        onOpen={() => openDrawerFn('create-volume-from-snapshot')}
                        linked
                        linkedTo="Instance snapshots"
                      />
                    </div>
                  </VStack>

                  {/* Volume Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Volume actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Create volume snapshot"
                        description="Create a snapshot of a volume to back up its current data state for later restoration."
                        category="Volume"
                        onOpen={() => openDrawerFn('create-volume-snapshot')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Create volume backup"
                        description="Create a full backup of a volume and store it in the backup service for disaster recovery."
                        category="Volume"
                        onOpen={() => openDrawerFn('create-volume-backup')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Create volume backup (with selection)"
                        description="Create a volume backup with volume selection table, search, and pagination."
                        category="Volume"
                        onOpen={() => openDrawerFn('create-volume-backup-with-selection')}
                      />
                      <DrawerCard
                        title="Restore from snapshot"
                        description="Restore a volume from a snapshot by selecting from available snapshots."
                        category="Volume"
                        onOpen={() => openDrawerFn('restore-from-snapshot')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Attach volume"
                        description="Attach a volume to an instance by selecting from available instances."
                        category="Volume"
                        onOpen={() => openDrawerFn('attach-volume')}
                        linked
                        linkedTo="Instance list, Volumes"
                      />
                      <DrawerCard
                        title="Attach instance"
                        description="Attach an instance to a volume by selecting from available instances."
                        category="Volume"
                        onOpen={() => openDrawerFn('attach-instance')}
                        linked
                        linkedTo="Instance list, Volumes"
                      />
                      <DrawerCard
                        title="Change type"
                        description="Change the storage type of a volume to another available volume type."
                        category="Volume"
                        onOpen={() => openDrawerFn('change-volume-type')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Create subnet"
                        description="Create a new subnet with CIDR, gateway, DHCP, and advanced network settings."
                        category="Network"
                        onOpen={() => openDrawerFn('create-subnet')}
                        linked
                        linkedTo="Networks"
                      />
                      <DrawerCard
                        title="Create router"
                        description="Create a virtual router to route traffic between networks with external gateway options."
                        category="Network"
                        onOpen={() => openDrawerFn('create-router')}
                      />
                      <DrawerCard
                        title="Attach port to instance"
                        description="Attach a network port to an instance with Fixed IP, Floating IP, and availability zone."
                        category="Network"
                        onOpen={() => openDrawerFn('attach-port-to-instance')}
                        linked
                        linkedTo="Ports"
                      />
                      <DrawerCard
                        title="Clone volume"
                        description="Create an exact copy of a volume for testing, backup, or new instance creation."
                        category="Volume"
                        onOpen={() => openDrawerFn('clone-volume')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Extend volume"
                        description="Increase the size of a volume to expand its storage capacity."
                        category="Volume"
                        onOpen={() => openDrawerFn('extend-volume')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Create image from volume"
                        description="Create a new image using a volume as the source. The image will contain all data currently stored on the volume."
                        category="Volume"
                        onOpen={() => openDrawerFn('create-image-from-volume')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Edit volume"
                        description="Edit the name and description of an existing volume."
                        category="Volume"
                        onOpen={() => openDrawerFn('edit-volume')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Boot setting"
                        description="Enable or disable a volume as a boot source for new instances."
                        category="Volume"
                        onOpen={() => openDrawerFn('boot-setting')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Change volume type"
                        description="Change the storage type of this volume to another available volume type."
                        category="Volume"
                        onOpen={() => openDrawerFn('change-volume-type')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Create transfer"
                        description="Create a transfer request to share this volume with another project."
                        category="Volume"
                        onOpen={() => openDrawerFn('create-transfer')}
                        linked
                        linkedTo="Volumes"
                      />
                      <DrawerCard
                        title="Edit volume backup"
                        description="Edit the name and description of an existing volume backup."
                        category="Volume"
                        onOpen={() => openDrawerFn('edit-volume-backup')}
                        linked
                        linkedTo="Volume backups"
                      />
                      <DrawerCard
                        title="Accept volume transfer"
                        description="Accept a volume transfer using the provided transfer ID and authorization key."
                        category="Volume"
                        onOpen={() => openDrawerFn('accept-volume-transfer')}
                      />
                      <DrawerCard
                        title="Edit volume snapshot"
                        description="Edit the name and description of an existing volume snapshot."
                        category="Volume"
                        onOpen={() => openDrawerFn('edit-volume-snapshot')}
                        linked
                        linkedTo="Volume snapshots"
                      />
                      <DrawerCard
                        title="Create volume from snapshot"
                        description="Create a new volume from an existing volume snapshot with customizable capacity and type."
                        category="Volume"
                        onOpen={() => openDrawerFn('create-volume-from-volume-snapshot')}
                        linked
                        linkedTo="Volume snapshots"
                      />
                      <DrawerCard
                        title="Create volume from backup"
                        description="Create a new volume from an existing volume backup with customizable capacity, type, and availability zone."
                        category="Volume"
                        onOpen={() => openDrawerFn('create-volume-from-backup')}
                        linked
                        linkedTo="Volume backups"
                      />
                      <DrawerCard
                        title="Detach volume"
                        description="Detach a volume from an instance. Once detached, it will no longer be accessible from the instance."
                        category="Volume"
                        onOpen={() => openDrawerFn('detach-volume')}
                        linked
                        linkedTo="Instance list, Volumes"
                      />
                    </div>
                  </VStack>

                  {/* Image Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Image actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Create volume from image"
                        description="Create a new volume using the selected image. The new volume will contain an identical copy of the image data."
                        category="Image"
                        onOpen={() => openDrawerFn('create-volume-from-image')}
                        linked
                        linkedTo="Images"
                      />
                      <DrawerCard
                        title="Edit image"
                        description="Edit image name and description. Allows modification of basic image metadata."
                        category="Image"
                        onOpen={() => openDrawerFn('edit-image')}
                        linked
                        linkedTo="Images"
                      />
                    </div>
                  </VStack>

                  {/* Key pair Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Key pair actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Create key pair"
                        description="Create a new SSH key pair or import an existing public key to securely access your instances."
                        category="Key pair"
                        onOpen={() => openDrawerFn('create-key-pair')}
                      />
                      <DrawerCard
                        title="Edit key pair"
                        description="Edit the name of an existing SSH key pair."
                        category="Key pair"
                        onOpen={() => openDrawerFn('edit-key-pair')}
                      />
                    </div>
                  </VStack>

                  {/* Server group Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Server group actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Create server group"
                        description="Create a server group to control how instances are placed across compute hosts using affinity/anti-affinity policies."
                        category="Server group"
                        onOpen={() => openDrawerFn('create-server-group')}
                      />
                      <DrawerCard
                        title="Edit server group"
                        description="Edit the name of an existing server group."
                        category="Server group"
                        onOpen={() => openDrawerFn('edit-server-group')}
                      />
                    </div>
                  </VStack>

                  {/* Network Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Network actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Edit network"
                        description="Edit network settings including name, description, admin state, and port security."
                        category="Network"
                        onOpen={() => openDrawerFn('edit-network')}
                        linked
                        linkedTo="Networks"
                      />
                      <DrawerCard
                        title="Edit router"
                        description="Edit router settings including name, description, and admin state."
                        category="Router"
                        onOpen={() => openDrawerFn('edit-router')}
                      />
                      <DrawerCard
                        title="Create static route"
                        description="Add a static route to manually define traffic paths beyond connected subnets."
                        category="Router"
                        onOpen={() => openDrawerFn('create-static-route')}
                      />
                      <DrawerCard
                        title="Edit port"
                        description="Edit port settings including name and description."
                        category="Port"
                        onOpen={() => openDrawerFn('edit-port')}
                        linked
                        linkedTo="Ports"
                      />
                      <DrawerCard
                        title="Create allowed address pair"
                        description="Specify additional IP or MAC addresses that are allowed to pass through this port."
                        category="Port"
                        onOpen={() => openDrawerFn('create-allowed-address-pair')}
                      />
                      <DrawerCard
                        title="Edit floating IP"
                        description="Edit floating IP description."
                        category="Floating IP"
                        onOpen={() => openDrawerFn('edit-floating-i-p')}
                        linked
                        linkedTo="Floating IPs"
                      />
                      <DrawerCard
                        title="Allocate IP"
                        description="Assign an additional fixed IP address to a port from a subnet."
                        category="Port"
                        onOpen={() => openDrawerFn('allocate-i-p')}
                      />
                      <DrawerCard
                        title="Attach interface"
                        description="Attach a new network interface to this instance. Connect it to another network or subnet for additional access."
                        category="Network"
                        onOpen={() => openDrawerFn('attach-interface')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Detach interface"
                        description="Detach a network interface from this instance. This may interrupt connectivity if the selected port is primary."
                        category="Network"
                        onOpen={() => openDrawerFn('detach-interface')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Associate floating IP"
                        description="Assign a floating IP to this instance for external network access."
                        category="Floating IP"
                        onOpen={() => openDrawerFn('associate-floating-i-p')}
                        linked
                        linkedTo="Instance list, Floating IPs"
                      />
                      <DrawerCard
                        title="Disassociate floating IP"
                        description="Remove the association between a floating IP and this instance. The instance will lose external network access through that IP."
                        category="Floating IP"
                        onOpen={() => openDrawerFn('disassociate-floating-i-p')}
                        linked
                        linkedTo="Instance list, Floating IPs, LBs"
                      />
                      <DrawerCard
                        title="Allocate floating IP"
                        description="Allocate a new floating IP from an external network pool with optional DNS settings."
                        category="Floating IP"
                        onOpen={() => openDrawerFn('allocate-floating-i-p')}
                      />
                      <DrawerCard
                        title="External gateway setting"
                        description="Configure external gateway for a router to enable access to external networks."
                        category="Router"
                        onOpen={() => openDrawerFn('external-gateway-setting')}
                      />
                      <DrawerCard
                        title="Connect subnet"
                        description="Connect an existing subnet to a router to enable routing between networks."
                        category="Router"
                        onOpen={() => openDrawerFn('connect-subnet')}
                      />
                      <DrawerCard
                        title="Associate floating IP to port"
                        description="Associate a floating IP with a port to enable external network access."
                        category="Port"
                        onOpen={() => openDrawerFn('associate-floating-i-p-to-port')}
                        linked
                        linkedTo="Ports"
                      />
                      <DrawerCard
                        title="Disconnect subnet"
                        description="Disconnect a subnet from a router to remove its routing path."
                        category="Router"
                        onOpen={() => openDrawerFn('disconnect-subnet')}
                      />
                    </div>
                  </VStack>

                  {/* Security group Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Security group actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Create security group rule"
                        description="Create a rule to define allowed inbound or outbound network traffic for your security group."
                        category="Security group"
                        onOpen={() => openDrawerFn('create-security-group-rule')}
                        linked
                        linkedTo="Security groups"
                      />
                      <DrawerCard
                        title="Create security group"
                        description="Create a security group to define network access rules for your instances."
                        category="Security group"
                        onOpen={() => openDrawerFn('create-security-group')}
                      />
                      <DrawerCard
                        title="Edit security group"
                        description="Edit security group name and description."
                        category="Security group"
                        onOpen={() => openDrawerFn('edit-security-group')}
                        linked
                        linkedTo="Security groups"
                      />
                      <DrawerCard
                        title="Manage security groups"
                        description="Attach or detach security groups for an interface to control inbound and outbound traffic."
                        category="Security group"
                        onOpen={() => openDrawerFn('manage-security-groups')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Edit port security groups"
                        description="Manage security groups on a port with port security toggle and multi-select table."
                        category="Port"
                        onOpen={() => openDrawerFn('edit-port-security-groups')}
                        linked
                        linkedTo="Ports"
                      />
                    </div>
                  </VStack>

                  {/* Load balancer Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Load balancer actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Add L7 policy"
                        description="Add an L7 policy to control traffic routing based on layer 7 attributes like URL path or headers."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('add-l7-policy')}
                      />
                      <DrawerCard
                        title="Register certificate"
                        description="Register a certificate issued by an external CA for use within Compute resources."
                        category="Certificate"
                        onOpen={() => openDrawerFn('register-certificate')}
                      />
                      <DrawerCard
                        title="Edit certificate"
                        description="Edit certificate name and description."
                        category="Certificate"
                        onOpen={() => openDrawerFn('edit-certificate')}
                      />
                      <DrawerCard
                        title="Edit load balancer"
                        description="Edit load balancer name, description, and admin state."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('edit-load-balancer')}
                        linked
                        linkedTo="Load balancers"
                      />
                      <DrawerCard
                        title="Edit pool"
                        description="Edit pool settings including algorithm, session persistence, TLS, and admin state."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('edit-pool')}
                      />
                      <DrawerCard
                        title="Add L7 rule"
                        description="Add an L7 rule to match incoming requests based on headers, paths, or other attributes."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('add-l7-rule')}
                      />
                      <DrawerCard
                        title="Edit listener"
                        description="Edit listener settings including name, connection limits, timeouts, and allowed CIDRs."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('edit-listener')}
                      />
                      <DrawerCard
                        title="Create health monitor"
                        description="Create a health monitor for a pool to check backend member availability."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('create-health-monitor')}
                      />
                      <DrawerCard
                        title="Edit member"
                        description="Edit pool member settings including weight, monitor address, backup, and admin state."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('edit-member')}
                      />
                      <DrawerCard
                        title="Manage members"
                        description="Manage pool members by adding instances or external members with configurable port and weight."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('manage-members')}
                      />
                      <DrawerCard
                        title="Associate floating IP to LB"
                        description="Associate a floating IP to a load balancer for external access."
                        category="Load balancer"
                        onOpen={() => openDrawerFn('associate-floating-i-p-to-l-b')}
                        linked
                        linkedTo="Load balancers"
                      />
                      <DrawerCard
                        title="Change server certificate"
                        description="Change the server certificate for a listener with certificate selection table."
                        category="Certificate"
                        onOpen={() => openDrawerFn('change-server-certificate')}
                      />
                      <DrawerCard
                        title="Change CA certificate"
                        description="Change the CA certificate for a listener with certificate selection table."
                        category="Certificate"
                        onOpen={() => openDrawerFn('change-c-a-certificate')}
                      />
                      <DrawerCard
                        title="Manage SNI certificate"
                        description="Enable SNI and manage multiple SNI certificates for a listener."
                        category="Certificate"
                        onOpen={() => openDrawerFn('manage-s-n-i-certificate')}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* Compute Admin App Drawers */}
            <Disclosure open={isSearching || isComputeAdminOpen} onChange={setIsComputeAdminOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                  <div className="flex items-center gap-3">
                    {isSearching || isComputeAdminOpen ? (
                      <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
                    ) : (
                      <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
                    )}
                    <Badge variant="warning" size="sm" className="w-[110px] justify-center">
                      Compute Admin{' '}
                    </Badge>
                    <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                      Drawers{' '}
                    </span>
                    <span className="text-body-md text-[var(--color-text-subtle)]">
                      (6 drawers)
                    </span>
                  </div>
                </div>
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  {/* Instance actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Instance actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Migrate instance"
                        description="Migrate the instance to a different host. Migration does not change the instance configuration or data."
                        category="Instance"
                        onOpen={() => openDrawerFn('migrate-instance')}
                        linked
                        linkedTo="Instance list"
                      />
                      <DrawerCard
                        title="Live migrate instance"
                        description="Live migrate the instance to a different host without shutting it down."
                        category="Instance"
                        onOpen={() => openDrawerFn('live-migrate-instance')}
                        linked
                        linkedTo="Instance list"
                      />
                    </div>
                  </VStack>

                  {/* Image actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Image actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Manage metadata"
                        description="Select existing metadata or define new metadata to apply to the image."
                        category="Image"
                        onOpen={() => openDrawerFn('manage-metadata')}
                        linked
                        linkedTo="Image list"
                      />
                    </div>
                  </VStack>

                  {/* Volume actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Volume actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Migrate volume"
                        description="Migrates the volume to a different storage backend. The volume may be limited in availability during the migration process."
                        category="Volume"
                        onOpen={() => openDrawerFn('migrate-volume')}
                        linked
                        linkedTo="Volume list"
                      />
                    </div>
                  </VStack>

                  {/* Network actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Network actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Manage rules"
                        description="Select rules from the list to add to the firewall policy."
                        category="Network"
                        onOpen={() => openDrawerFn('manage-rules')}
                        linked
                        linkedTo="Firewall policies"
                      />
                    </div>
                  </VStack>

                  {/* Tenant actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Tenant actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Modify quotas"
                        description="Modifies the resource usage limits allocated to the tenant."
                        category="Tenant"
                        onOpen={() => openDrawerFn('modify-quotas')}
                        linked
                        linkedTo="Tenant detail"
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* IAM App Drawers */}
            <Disclosure open={isSearching || isIAMOpen} onChange={setIsIAMOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                  <div className="flex items-center gap-3">
                    {isSearching || isIAMOpen ? (
                      <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
                    ) : (
                      <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
                    )}
                    <Badge variant="info" size="sm" className="w-[70px] justify-center">
                      IAM{' '}
                    </Badge>
                    <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                      Drawers{' '}
                    </span>
                    <span className="text-body-md text-[var(--color-text-subtle)]">
                      (13 drawers)
                    </span>
                  </div>
                </div>
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  {/* USER MANAGEMENT ACTIONS */}
                  <VStack gap={2}>
                    <h3 className="text-body-sm font-semibold text-[var(--color-text-subtle)] tracking-wider uppercase">
                      User management actions{' '}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Manage user groups"
                        description="Add or remove user groups for a specific user."
                        category="User"
                        onOpen={() => openDrawerFn('manage-user-groups')}
                        linked
                        linkedTo="IAM users"
                      />
                      <DrawerCard
                        title="Manage roles"
                        description="Add or remove roles directly assigned to a specific user."
                        category="User"
                        onOpen={() => openDrawerFn('manage-roles')}
                        linked
                        linkedTo="IAM users, User groups"
                      />
                      <DrawerCard
                        title="Reset password"
                        description="Reset the login password for a specific user."
                        category="User"
                        onOpen={() => openDrawerFn('reset-password')}
                      />
                      <DrawerCard
                        title="Edit user"
                        description="Edit the user's basic information like email and display name."
                        category="User"
                        onOpen={() => openDrawerFn('edit-user')}
                        linked
                        linkedTo="IAM users"
                      />
                    </div>
                  </VStack>

                  {/* User Group Management */}
                  <VStack gap={2}>
                    <h3 className="text-body-sm font-semibold text-[var(--color-text-subtle)] tracking-wider uppercase">
                      User group management actions{' '}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Manage users"
                        description="Add or remove members of a user group."
                        category="User group"
                        onOpen={() => openDrawerFn('manage-users')}
                        linked
                        linkedTo="IAM user groups"
                      />
                      <DrawerCard
                        title="Edit user group"
                        description="Edit the user group's basic information."
                        category="User group"
                        onOpen={() => openDrawerFn('edit-user-group')}
                        linked
                        linkedTo="IAM user groups"
                      />
                    </div>
                  </VStack>

                  {/* Role Management */}
                  <VStack gap={2}>
                    <h3 className="text-body-sm font-semibold text-[var(--color-text-subtle)] tracking-wider uppercase">
                      Role management actions{' '}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Manage policies"
                        description="Add or remove policies of a role."
                        onOpen={() => openDrawerFn('manage-policies')}
                        badge="Role"
                      />
                      <DrawerCard
                        title="Edit role"
                        description="Edit basic information for a role."
                        onOpen={() => openDrawerFn('edit-role')}
                        badge="Role"
                      />
                    </div>
                  </VStack>

                  {/* Domain Management */}
                  <VStack gap={2}>
                    <h3 className="text-body-sm font-semibold text-[var(--color-text-subtle)] tracking-wider uppercase">
                      Domain management actions{' '}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Create domain"
                        description="Create a new domain to manage resources and policies independently."
                        onOpen={() => openDrawerFn('create-domain')}
                        badge="Domain"
                      />
                      <DrawerCard
                        title="Edit domain"
                        description="Edit the domain's basic information."
                        onOpen={() => openDrawerFn('edit-domain')}
                        badge="Domain"
                      />
                      <DrawerCard
                        title="Set default domain"
                        description="Set the default domain for the system administrator."
                        onOpen={() => openDrawerFn('set-default-domain')}
                        badge="Domain"
                      />
                      <DrawerCard
                        title="Lock setting"
                        description="Lock or unlock a system administrator account."
                        onOpen={() => openDrawerFn('admin-lock-setting')}
                        badge="Admin"
                      />
                      <DrawerCard
                        title="Edit system administrator"
                        description="Edit the system administrator's basic information."
                        onOpen={() => openDrawerFn('edit-system-admin')}
                        badge="Admin"
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* Storage App Drawers */}
            <Disclosure open={isSearching || isStorageOpen} onChange={setIsStorageOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                  <div className="flex items-center gap-3">
                    {isSearching || isStorageOpen ? (
                      <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
                    ) : (
                      <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
                    )}
                    <Badge variant="info" size="sm" className="w-[70px] justify-center">
                      Storage{' '}
                    </Badge>
                    <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                      Drawers{' '}
                    </span>
                    <span className="text-body-md text-[var(--color-text-subtle)]">
                      (5 drawers)
                    </span>
                  </div>
                </div>
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  {/* Object Storage Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Object storage actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Create folder"
                        description="Create a new folder in a bucket with a specified parent location."
                        category="Object storage"
                        onOpen={() => openDrawerFn('create-folder')}
                      />
                      <DrawerCard
                        title="Create object"
                        description="Upload files to a bucket with ACL settings and tags."
                        category="Object storage"
                        onOpen={() => openDrawerFn('create-object')}
                      />
                      <DrawerCard
                        title="Move files"
                        description="Move files or folders to a different location within the bucket."
                        category="Object storage"
                        onOpen={() => openDrawerFn('move-files')}
                      />
                      <DrawerCard
                        title="Edit object"
                        description="Edit object name and manage tags."
                        category="Object storage"
                        onOpen={() => openDrawerFn('edit-object')}
                      />
                    </div>
                  </VStack>

                  {/* Physical Disk Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Physical disk actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Identify device"
                        description="Indicate the LED on a physical disk to identify the device."
                        category="Physical disk"
                        onOpen={() => openDrawerFn('identify-device')}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* Container App Drawers */}
            <Disclosure open={isSearching || isContainerOpen} onChange={setIsContainerOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                  <div className="flex items-center gap-3">
                    {isSearching || isContainerOpen ? (
                      <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
                    ) : (
                      <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
                    )}
                    <Badge variant="info" size="sm" className="w-[70px] justify-center">
                      Container{' '}
                    </Badge>
                    <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                      Drawers{' '}
                    </span>
                    <span className="text-body-md text-[var(--color-text-subtle)]">(1 drawer)</span>
                  </div>
                </div>
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  {/* Resource Search Actions */}
                  <VStack gap={2}>
                    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                      Resource search actions{' '}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <DrawerCard
                        title="Resource type search"
                        description="Search and navigate Kubernetes resource types across clusters with categorized resource lists."
                        category="Search"
                        onOpen={() => openDrawerFn('resource-type-search')}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* Table Settings */}
            <VStack gap={2}>
              <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                Table settings{' '}
              </h2>
              <div className="flex flex-col gap-2">
                <DrawerCard
                  title="View preferences"
                  description="Customize table view by showing/hiding columns, reordering columns, and adjusting rows per page."
                  category="Table"
                  onOpen={() => openDrawerFn('view-preferences')}
                />
              </div>
            </VStack>
          </VStack>
        </VStack>
      </DrawerSearchContext.Provider>

      {/* Drawer components */}
      <CreateInstanceSnapshotDrawer
        isOpen={openDrawer === 'create-snapshot'}
        onClose={closeDrawer}
        instance={mockSnapshotInstance}
        onSubmit={(name, description) => {
          console.log('Create snapshot:', { name, description });
        }}
      />

      <EditInstanceDrawer
        isOpen={openDrawer === 'edit-instance'}
        onClose={closeDrawer}
        instance={mockEditInstance}
        onSubmit={(name, description) => {
          console.log('Edit instance:', { name, description });
        }}
      />

      <LockSettingDrawer
        isOpen={openDrawer === 'lock-setting'}
        onClose={closeDrawer}
        instance={mockLockInstance}
        onSubmit={(isLocked) => {
          console.log('Lock setting:', { isLocked });
        }}
      />

      <BootSettingDrawer
        isOpen={openDrawer === 'boot-setting'}
        onClose={closeDrawer}
        volume={mockBootVolume}
        onSubmit={(isBootable) => {
          console.log('Boot setting:', { isBootable });
        }}
      />

      <ViewPreferencesDrawer
        isOpen={openDrawer === 'view-preferences'}
        onClose={closeDrawer}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        columns={columns}
        onColumnsChange={setColumns}
        defaultColumns={mockViewPreferencesColumns}
      />

      <CreateVolumeSnapshotDrawer
        isOpen={openDrawer === 'create-volume-snapshot'}
        onClose={closeDrawer}
        volume={mockVolume}
        volumeSnapshotQuota={{ used: 2, total: 10 }}
        typeSnapshotQuota={{ used: 2, total: null }}
        onSubmit={(name) => {
          console.log('Create volume snapshot:', { name });
        }}
      />

      <CreateVolumeBackupDrawer
        isOpen={openDrawer === 'create-volume-backup'}
        onClose={closeDrawer}
        volume={mockBackupVolume}
        volumeBackupQuota={{ used: 1, total: 10 }}
        volumeBackupCapacityQuota={{ used: 20, total: 1000 }}
        onSubmit={(name, mode) => {
          console.log('Create volume backup:', { name, mode });
        }}
      />

      <CloneVolumeDrawer
        isOpen={openDrawer === 'clone-volume'}
        onClose={closeDrawer}
        volume={mockCloneVolume}
        minCapacity={50}
        maxCapacity={951}
        volumeQuota={{ used: 2, total: 10 }}
        volumeCapacityQuota={{ used: 20, total: 1000 }}
        typeQuota={{ used: 2, total: null }}
        typeCapacityQuota={{ used: 2, total: null }}
        onSubmit={(name, capacity, volumeType) => {
          console.log('Clone volume:', { name, capacity, volumeType });
        }}
      />

      <ExtendVolumeDrawer
        isOpen={openDrawer === 'extend-volume'}
        onClose={closeDrawer}
        volume={mockExtendVolume}
        minCapacity={50}
        maxCapacity={951}
        volumeCapacityQuota={{ used: 20, total: 1000 }}
        typeCapacityQuota={{ used: 2, total: null }}
        onSubmit={(newCapacity) => {
          console.log('Extend volume:', { newCapacity });
        }}
      />

      <EditInstanceSnapshotDrawer
        isOpen={openDrawer === 'edit-instance-snapshot'}
        onClose={closeDrawer}
        snapshot={mockInstanceSnapshot}
        onSubmit={(name, description) => {
          console.log('Edit instance snapshot:', { name, description });
        }}
      />

      <CreateVolumeFromSnapshotDrawer
        isOpen={openDrawer === 'create-volume-from-snapshot'}
        onClose={closeDrawer}
        snapshot={mockVolumeSnapshot}
        minCapacity={70}
        maxCapacity={1756}
        volumeQuota={{ used: 2, total: 10 }}
        volumeCapacityQuota={{ used: 20, total: 1000 }}
        typeQuota={{ used: 2, total: null }}
        typeCapacityQuota={{ used: 2, total: null }}
        onSubmit={(volumeName, capacity, volumeType) => {
          console.log('Create volume from snapshot:', { volumeName, capacity, volumeType });
        }}
      />

      <CreateVolumeFromImageDrawer
        isOpen={openDrawer === 'create-volume-from-image'}
        onClose={closeDrawer}
        image={mockImage}
        minCapacity={30}
        maxCapacity={1756}
        volumeQuota={{ used: 2, total: 10 }}
        volumeCapacityQuota={{ used: 20, total: 1000 }}
        typeQuota={{ used: 2, total: null }}
        typeCapacityQuota={{ used: 2, total: null }}
        onSubmit={(volumeName, capacity, volumeType) => {
          console.log('Create volume from image:', { volumeName, capacity, volumeType });
        }}
      />

      <EditImageDrawer
        isOpen={openDrawer === 'edit-image'}
        onClose={closeDrawer}
        image={mockEditImage}
        onSubmit={(name, description) => {
          console.log('Edit image:', { name, description });
        }}
      />

      <CreateKeyPairDrawer
        isOpen={openDrawer === 'create-key-pair'}
        onClose={closeDrawer}
        keyPairQuota={{ used: 2, total: 10 }}
        onSubmit={(name, type, publicKey) => {
          console.log('Create key pair:', { name, type, publicKey });
        }}
      />

      <EditKeyPairDrawer
        isOpen={openDrawer === 'edit-key-pair'}
        onClose={closeDrawer}
        keyPair={mockKeyPair}
        onSubmit={(name) => {
          console.log('Edit key pair:', { name });
        }}
      />

      <CreateServerGroupDrawer
        isOpen={openDrawer === 'create-server-group'}
        onClose={closeDrawer}
        serverGroupQuota={{ used: 2, total: 10 }}
        onSubmit={(name, policy) => {
          console.log('Create server group:', { name, policy });
        }}
      />

      <EditServerGroupDrawer
        isOpen={openDrawer === 'edit-server-group'}
        onClose={closeDrawer}
        serverGroup={mockServerGroup}
        onSubmit={(name) => {
          console.log('Edit server group:', { name });
        }}
      />

      <CreateImageFromVolumeDrawer
        isOpen={openDrawer === 'create-image-from-volume'}
        onClose={closeDrawer}
        volume={mockImageVolume}
        onSubmit={(imageName, diskFormat) => {
          console.log('Create image from volume:', { imageName, diskFormat });
        }}
      />

      <EditVolumeDrawer
        isOpen={openDrawer === 'edit-volume'}
        onClose={closeDrawer}
        volume={mockEditVolume}
        onSubmit={(name, description) => {
          console.log('Edit volume:', { name, description });
        }}
      />

      <ChangeVolumeTypeDrawer
        isOpen={openDrawer === 'change-volume-type'}
        onClose={closeDrawer}
        volume={mockChangeTypeVolume}
        onSubmit={(newVolumeType) => {
          console.log('Change volume type:', { newVolumeType });
        }}
      />

      <CreateTransferDrawer
        isOpen={openDrawer === 'create-transfer'}
        onClose={closeDrawer}
        volume={mockTransferVolume}
        onSubmit={(transferName) => {
          console.log('Create transfer:', { transferName });
        }}
      />

      <EditVolumeBackupDrawer
        isOpen={openDrawer === 'edit-volume-backup'}
        onClose={closeDrawer}
        volumeBackup={mockVolumeBackup}
        onSubmit={(name, description) => {
          console.log('Edit volume backup:', { name, description });
        }}
      />

      <AcceptVolumeTransferDrawer
        isOpen={openDrawer === 'accept-volume-transfer'}
        onClose={closeDrawer}
        onSubmit={(transferId, authKey) => {
          console.log('Accept volume transfer:', { transferId, authKey });
        }}
      />

      <EditVolumeSnapshotDrawer
        isOpen={openDrawer === 'edit-volume-snapshot'}
        onClose={closeDrawer}
        volumeSnapshot={mockEditVolumeSnapshot}
        onSubmit={(name, description) => {
          console.log('Edit volume snapshot:', { name, description });
        }}
      />

      <CreateVolumeFromVolumeSnapshotDrawer
        isOpen={openDrawer === 'create-volume-from-volume-snapshot'}
        onClose={closeDrawer}
        volumeSnapshot={mockVolumeSnapshotForCreate}
        onSubmit={(volumeName, description, capacity, volumeType) => {
          console.log('Create volume from snapshot:', {
            volumeName,
            description,
            capacity,
            volumeType,
          });
        }}
      />

      <CreateVolumeFromBackupDrawer
        isOpen={openDrawer === 'create-volume-from-backup'}
        onClose={closeDrawer}
        volumeBackup={mockVolumeBackupForCreate}
        onSubmit={(volumeName, description, capacity, volumeType, az) => {
          console.log('Create volume from backup:', {
            volumeName,
            description,
            capacity,
            volumeType,
            az,
          });
        }}
      />

      <AddL7PolicyDrawer
        isOpen={openDrawer === 'add-l7-policy'}
        onClose={closeDrawer}
        onSubmit={(policyName, description, action, targetPool, position, adminStateUp) => {
          console.log('Add L7 policy:', {
            policyName,
            description,
            action,
            targetPool,
            position,
            adminStateUp,
          });
        }}
      />

      <RegisterCertificateDrawer
        isOpen={openDrawer === 'register-certificate'}
        onClose={closeDrawer}
        onSubmit={(type, name, description, certificateBody, privateKey, intermediateCert) => {
          console.log('Register certificate:', {
            type,
            name,
            description,
            certificateBody,
            privateKey,
            intermediateCert,
          });
        }}
      />

      <CreateSecurityGroupRuleDrawer
        isOpen={openDrawer === 'create-security-group-rule'}
        onClose={closeDrawer}
        ruleQuota={{ used: 2, total: 10 }}
        securityGroups={[
          { value: 'sg-1', label: 'default' },
          { value: 'sg-2', label: 'web-servers' },
          { value: 'sg-3', label: 'db-servers' },
        ]}
        onSubmit={(direction, protocol, portRangeType, portRange, remoteType, remoteValue) => {
          console.log('Create security group rule:', {
            direction,
            protocol,
            portRangeType,
            portRange,
            remoteType,
            remoteValue,
          });
        }}
      />

      <EditNetworkDrawer
        isOpen={openDrawer === 'edit-network'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'edit-router'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'create-static-route'}
        onClose={closeDrawer}
        router={{
          id: 'router-123',
          name: 'router-01',
        }}
        onSubmit={(destinationCidr, nextHop) => {
          console.log('Create static route:', { destinationCidr, nextHop });
        }}
      />

      <EditPortDrawer
        isOpen={openDrawer === 'edit-port'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'create-allowed-address-pair'}
        onClose={closeDrawer}
        onSubmit={(cidr, macAddressType, macAddress) => {
          console.log('Create allowed address pair:', { cidr, macAddressType, macAddress });
        }}
      />

      <EditFloatingIPDrawer
        isOpen={openDrawer === 'edit-floating-i-p'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'create-security-group'}
        onClose={closeDrawer}
        quota={{
          used: 2,
          limit: 10,
        }}
        onSubmit={(name, description) => {
          console.log('Create security group:', { name, description });
        }}
      />

      <EditSecurityGroupDrawer
        isOpen={openDrawer === 'edit-security-group'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'edit-certificate'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'edit-load-balancer'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'edit-pool'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'add-l7-rule'}
        onClose={closeDrawer}
        onSubmit={(data) => {
          console.log('Add L7 rule:', data);
        }}
      />

      <EditListenerDrawer
        isOpen={openDrawer === 'edit-listener'}
        onClose={closeDrawer}
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
        isOpen={openDrawer === 'allocate-i-p'}
        onClose={closeDrawer}
        port={{
          id: 'port-001',
          name: 'port-10',
          networkName: 'net-01',
        }}
        subnets={[
          {
            id: 'subnet-001',
            name: 'subnet-01',
            cidr: '10.62.0.0/24',
            ipRangeStart: '10.62.0.31',
            ipRangeEnd: '10.62.0.77',
          },
          {
            id: 'subnet-002',
            name: 'subnet-02',
            cidr: '10.63.0.0/24',
            ipRangeStart: '10.63.0.10',
            ipRangeEnd: '10.63.0.100',
          },
        ]}
        onSubmit={(data) => {
          console.log('Allocate IP:', data);
        }}
      />

      <CreateHealthMonitorDrawer
        isOpen={openDrawer === 'create-health-monitor'}
        onClose={closeDrawer}
        pool={{
          id: 'pool-001',
          name: 'pool-http',
        }}
        onSubmit={(data) => {
          console.log('Create health monitor:', data);
        }}
      />

      <EditMemberDrawer
        isOpen={openDrawer === 'edit-member'}
        onClose={closeDrawer}
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

      <DetachVolumeDrawer
        isOpen={openDrawer === 'detach-volume'}
        onClose={closeDrawer}
        instance={mockDetachInstance}
        onDetach={(volumeId) => {
          console.log('Detach volume:', { volumeId });
        }}
      />

      <AttachInterfaceDrawer
        isOpen={openDrawer === 'attach-interface'}
        onClose={closeDrawer}
        instance={mockAttachInterfaceInstance}
        onAttach={(networkId, fixedIp) => {
          console.log('Attach interface:', { networkId, fixedIp });
        }}
      />

      <DetachInterfaceDrawer
        isOpen={openDrawer === 'detach-interface'}
        onClose={closeDrawer}
        instance={mockDetachInterfaceInstance}
        onDetach={(interfaceId) => {
          console.log('Detach interface:', { interfaceId });
        }}
      />

      <AssociateFloatingIPDrawer
        isOpen={openDrawer === 'associate-floating-i-p'}
        onClose={closeDrawer}
        port={mockAssociateFloatingIPPort}
        onSubmit={(data) => {
          console.log('Associate floating IP:', data);
        }}
      />

      <DisassociateFloatingIPDrawer
        isOpen={openDrawer === 'disassociate-floating-i-p'}
        onClose={closeDrawer}
        instance={mockDisassociateFloatingIPInstance}
        onDisassociate={(floatingIpId) => {
          console.log('Disassociate floating IP:', { floatingIpId });
        }}
      />

      <ManageSecurityGroupsDrawer
        isOpen={openDrawer === 'manage-security-groups'}
        onClose={closeDrawer}
        instance={mockManageSecurityGroupsInstance}
        portName="port-01"
        onSave={(securityGroupIds, portSecurityEnabled) => {
          console.log('Manage security groups:', { securityGroupIds, portSecurityEnabled });
        }}
      />

      <ManageTagsDrawer
        isOpen={openDrawer === 'manage-tags'}
        onClose={closeDrawer}
        instance={mockManageTagsInstance}
        onSave={(tags) => {
          console.log('Manage tags:', tags);
        }}
      />

      <RescueInstanceDrawer
        isOpen={openDrawer === 'rescue-instance'}
        onClose={closeDrawer}
        instance={mockRescueInstance}
        onRescue={(imageOption) => {
          console.log('Rescue instance with image option:', imageOption);
        }}
      />

      <RebuildInstanceDrawer
        isOpen={openDrawer === 'rebuild-instance'}
        onClose={closeDrawer}
        instance={mockRebuildInstance}
        onRebuild={(imageOption) => {
          console.log('Rebuild instance with image option:', imageOption);
        }}
      />

      <ResizeInstanceDrawer
        isOpen={openDrawer === 'resize-instance'}
        onClose={closeDrawer}
        instance={mockResizeInstance}
        onResize={(targetFlavorId, approvalMethod, autoConfirmMinutes, autoConfirmAction) => {
          console.log('Resize instance:', {
            targetFlavorId,
            approvalMethod,
            autoConfirmMinutes,
            autoConfirmAction,
          });
        }}
      />

      <CreateVolumeBackupWithSelectionDrawer
        isOpen={openDrawer === 'create-volume-backup-with-selection'}
        onClose={closeDrawer}
        onSubmit={(volumeId, backupName, description, mode) => {
          console.log('Create volume backup with selection:', {
            volumeId,
            backupName,
            description,
            mode,
          });
        }}
      />

      <RestoreFromSnapshotDrawer
        isOpen={openDrawer === 'restore-from-snapshot'}
        onClose={closeDrawer}
        volume={{ id: 'vol-03', name: 'vol-03' }}
        onRestore={(snapshotId) => {
          console.log('Restore from snapshot:', { snapshotId });
        }}
      />

      <AttachVolumeDrawer
        isOpen={openDrawer === 'attach-volume'}
        onClose={closeDrawer}
        volume={{ id: 'vol-03', name: 'vol-03' }}
        onAttach={(instanceId) => {
          console.log('Attach volume to instance:', { instanceId });
        }}
      />

      <AttachInstanceDrawer
        isOpen={openDrawer === 'attach-instance'}
        onClose={closeDrawer}
        volume={{ id: 'vol-03', name: 'vol-03' }}
        onAttach={(instanceId) => {
          console.log('Attach instance:', { instanceId });
        }}
      />

      <ChangeVolumeTypeDrawer
        isOpen={openDrawer === 'change-volume-type'}
        onClose={closeDrawer}
        volume={{ id: 'vol-05', name: 'vol-05', currentType: 'DEFAULT' }}
        onSubmit={(newType) => {
          console.log('Change volume type:', { newType });
        }}
      />

      <CreateSubnetDrawer
        isOpen={openDrawer === 'create-subnet'}
        onClose={closeDrawer}
        networkId="network-01"
        networkName="private-network"
        onSubmit={(data) => {
          console.log('Create subnet:', data);
        }}
      />

      <CreateRouterDrawer
        isOpen={openDrawer === 'create-router'}
        onClose={closeDrawer}
        onSubmit={(data) => {
          console.log('Create router:', data);
        }}
      />

      <AttachPortToInstanceDrawer
        isOpen={openDrawer === 'attach-port-to-instance'}
        onClose={closeDrawer}
        portId="port-01"
        portName="port-01"
        onSubmit={(data) => {
          console.log('Attach port to instance:', data);
        }}
      />

      <EditPortSecurityGroupsDrawer
        isOpen={openDrawer === 'edit-port-security-groups'}
        onClose={closeDrawer}
        port={{
          id: 'port-001',
          name: 'port-10',
        }}
        onSave={(data) => {
          console.log('Edit port security groups:', data);
        }}
      />

      <AssociateFloatingIPToLBDrawer
        isOpen={openDrawer === 'associate-floating-i-p-to-l-b'}
        onClose={closeDrawer}
        loadBalancer={{
          id: 'lb-001',
          name: 'web-lb-01',
          networkId: 'net-001',
          networkName: 'net-01',
        }}
        onAssociate={(floatingIpId) => {
          console.log('Associate floating IP to LB:', floatingIpId);
        }}
      />

      <ChangeServerCertificateDrawer
        isOpen={openDrawer === 'change-server-certificate'}
        onClose={closeDrawer}
        listenerName="listener-http-80"
        currentCertificate={{
          name: 'server-cert-1',
          expiresAt: 'Oct 10, 2025',
        }}
        onChangeCertificate={(certificateId) => {
          console.log('Change server certificate:', certificateId);
        }}
      />

      <ChangeCACertificateDrawer
        isOpen={openDrawer === 'change-c-a-certificate'}
        onClose={closeDrawer}
        listenerName="listener-http-80"
        currentCertificate={{
          name: 'ca-cert-1',
          expiredOn: 'Oct 10, 2025',
        }}
        onSubmit={(certificateId) => {
          console.log('Change CA certificate:', certificateId);
        }}
      />

      <ManageSNICertificateDrawer
        isOpen={openDrawer === 'manage-s-n-i-certificate'}
        onClose={closeDrawer}
        listenerName="listener-http-80"
        initialSniEnabled={true}
        onSubmit={(data) => {
          console.log('Manage SNI certificate:', data);
        }}
      />

      <ExternalGatewaySettingDrawer
        isOpen={openDrawer === 'external-gateway-setting'}
        onClose={closeDrawer}
        router={{ name: 'router-01' }}
        initialGatewayEnabled={true}
        onSubmit={(data) => {
          console.log('External gateway setting:', data);
        }}
      />

      <ConnectSubnetDrawer
        isOpen={openDrawer === 'connect-subnet'}
        onClose={closeDrawer}
        router={{ name: 'router-01' }}
        onSubmit={(data) => {
          console.log('Connect subnet:', data);
        }}
      />

      <AssociateFloatingIPToPortDrawer
        isOpen={openDrawer === 'associate-floating-i-p-to-port'}
        onClose={closeDrawer}
        port={{ name: 'port-10' }}
        onSubmit={(data) => {
          console.log('Associate floating IP to port:', data);
        }}
      />

      <DisconnectSubnetDrawer
        isOpen={openDrawer === 'disconnect-subnet'}
        onClose={closeDrawer}
        router={{ name: 'router-01' }}
        onSubmit={(subnetId) => {
          console.log('Disconnect subnet:', subnetId);
        }}
      />

      <ManageMembersDrawer
        isOpen={openDrawer === 'manage-members'}
        onClose={closeDrawer}
        pool={{ name: 'pool-http' }}
        onSubmit={(members) => {
          console.log('Manage members:', members);
        }}
      />

      <AllocateFloatingIPDrawer
        isOpen={openDrawer === 'allocate-floating-i-p'}
        onClose={closeDrawer}
        floatingIPQuota={{ used: 2, total: 10 }}
        onSubmit={(data) => {
          console.log('Allocate floating IP:', data);
        }}
      />

      {/* =============================================
          STORAGE DRAWERS ============================================= */}

      {/* Create Folder Drawer */}
      <CreateFolderDrawer
        isOpen={openDrawer === 'create-folder'}
        onClose={closeDrawer}
        bucketName="my-bucket"
        currentPath="/folder A"
        onSubmit={(folderName, parentPath) => {
          console.log('Create folder:', folderName, 'in', parentPath);
        }}
      />

      {/* Create Object Drawer */}
      <CreateObjectDrawer
        isOpen={openDrawer === 'create-object'}
        onClose={closeDrawer}
        currentPath="/bucket/folder"
        onSubmit={(data) => {
          console.log('Create object:', data);
        }}
      />

      {/* Move Files Drawer */}
      <MoveFilesDrawer
        isOpen={openDrawer === 'move-files'}
        onClose={closeDrawer}
        currentPath="folder/~"
        onSubmit={(targetPath) => {
          console.log('Move files to:', targetPath);
        }}
      />

      {/* Edit Object Drawer */}
      <EditObjectDrawer
        isOpen={openDrawer === 'edit-object'}
        onClose={closeDrawer}
        objectName="{Current Folder Name}"
        onSubmit={(name, tags) => {
          console.log('Edit object:', name, tags);
        }}
      />

      {/* Identify Device Drawer */}
      <IdentifyDeviceDrawer
        isOpen={openDrawer === 'identify-device'}
        onClose={closeDrawer}
        onSubmit={(duration) => {
          console.log('Identify device with duration:', duration);
        }}
      />

      {/* Manage User Groups Drawer */}
      <ManageUserGroupsDrawer
        isOpen={openDrawer === 'manage-user-groups'}
        onClose={closeDrawer}
        userName="thaki.kim"
        onSubmit={(data) => {
          console.log('Manage user groups:', data);
        }}
      />

      {/* Manage Users Drawer */}
      <ManageUsersDrawer
        isOpen={openDrawer === 'manage-users'}
        onClose={closeDrawer}
        userGroupName="MemberGroup"
        onSubmit={(data) => {
          console.log('Manage users:', data);
        }}
      />

      {/* Manage Roles Drawer */}
      <ManageRolesDrawer
        isOpen={openDrawer === 'manage-roles'}
        onClose={closeDrawer}
        userName="thaki.kim"
        onSubmit={(data) => {
          console.log('Manage roles:', data);
        }}
      />

      {/* Reset Password Drawer */}
      <ResetPasswordDrawer
        isOpen={openDrawer === 'reset-password'}
        onClose={closeDrawer}
        userName="thaki.kim"
        onSubmit={(data) => {
          console.log('Reset password:', data);
        }}
      />

      {/* Edit User Drawer */}
      <EditUserDrawer
        isOpen={openDrawer === 'edit-user'}
        onClose={closeDrawer}
        userName="thaki-kim"
        initialData={{
          email: 'user@example.com',
          displayName: '',
          enabled: true,
        }}
        onSubmit={(data) => {
          console.log('Edit user:', data);
        }}
      />

      {/* Edit User Group Drawer */}
      <EditUserGroupDrawer
        isOpen={openDrawer === 'edit-user-group'}
        onClose={closeDrawer}
        initialData={{
          name: 'MemberGroup',
          description: '',
        }}
        onSubmit={(data) => {
          console.log('Edit user group:', data);
        }}
      />

      {/* Manage Policies Drawer */}
      <ManagePoliciesDrawer
        isOpen={openDrawer === 'manage-policies'}
        onClose={closeDrawer}
        roleName="member"
        onSubmit={(data) => {
          console.log('Manage policies:', data);
        }}
      />

      {/* Edit Role Drawer */}
      <EditRoleDrawer
        isOpen={openDrawer === 'edit-role'}
        onClose={closeDrawer}
        initialData={{
          name: 'Member',
          description: '',
        }}
        onSubmit={(data) => {
          console.log('Edit role:', data);
        }}
      />

      {/* Create Domain Drawer */}
      <CreateDomainDrawer
        isOpen={openDrawer === 'create-domain'}
        onClose={closeDrawer}
        onSubmit={(data) => {
          console.log('Create domain:', data);
        }}
      />

      {/* Edit Domain Drawer */}
      <EditDomainDrawer
        isOpen={openDrawer === 'edit-domain'}
        onClose={closeDrawer}
        initialData={{
          name: 'domain',
          description: '',
          enabled: true,
        }}
        onSubmit={(data) => {
          console.log('Edit domain:', data);
        }}
      />

      {/* Set Default Domain Drawer */}
      <SetDefaultDomainDrawer
        isOpen={openDrawer === 'set-default-domain'}
        onClose={closeDrawer}
        adminUsername="thaki.kim"
        onSubmit={(domainId) => {
          console.log('Set default domain:', domainId);
        }}
      />

      {/* Admin Lock Setting Drawer */}
      <AdminLockSettingDrawer
        isOpen={openDrawer === 'admin-lock-setting'}
        onClose={closeDrawer}
        adminUsername="thaki.kim"
        initialLocked={true}
        onSubmit={(locked) => {
          console.log('Admin lock setting:', locked);
        }}
      />

      {/* Edit System Admin Drawer */}
      <EditSystemAdminDrawer
        isOpen={openDrawer === 'edit-system-admin'}
        onClose={closeDrawer}
        initialData={{
          username: 'thaki-kim',
          email: 'user@example.com',
          displayName: '',
          enabled: true,
        }}
        onSubmit={(data) => {
          console.log('Edit system admin:', data);
        }}
      />

      {/* =============================================
          COMPUTE ADMIN DRAWERS ============================================= */}

      {/* Migrate Instance Drawer */}
      <MigrateInstanceDrawer
        isOpen={openDrawer === 'migrate-instance'}
        onClose={closeDrawer}
        instance={mockMigrateInstance}
        onMigrate={(hostId) => {
          console.log('Migrate instance to host:', hostId);
        }}
      />

      {/* Live Migrate Instance Drawer */}
      <LiveMigrateInstanceDrawer
        isOpen={openDrawer === 'live-migrate-instance'}
        onClose={closeDrawer}
        instance={mockLiveMigrateInstance}
        onLiveMigrate={(hostId, blockMigrate) => {
          console.log('Live migrate instance to host:', hostId, 'block migrate:', blockMigrate);
        }}
      />

      {/* Manage Metadata Drawer */}
      <ManageMetadataDrawer
        isOpen={openDrawer === 'manage-metadata'}
        onClose={closeDrawer}
        image={mockManageMetadataImage}
        onSave={(metadata) => {
          console.log('Save metadata:', metadata);
        }}
      />

      {/* Migrate Volume Drawer */}
      <MigrateVolumeDrawer
        isOpen={openDrawer === 'migrate-volume'}
        onClose={closeDrawer}
        volume={mockMigrateVolume}
        onMigrate={(backendId) => {
          console.log('Migrate volume to backend:', backendId);
        }}
      />

      {/* Manage Rules Drawer */}
      <ManageRulesDrawer
        isOpen={openDrawer === 'manage-rules'}
        onClose={closeDrawer}
        policy={mockFirewallPolicy}
        onSave={(ruleIds) => {
          console.log('Save firewall rules:', ruleIds);
        }}
      />

      {/* Modify Quotas Drawer */}
      <ModifyQuotasDrawer
        isOpen={openDrawer === 'modify-quotas'}
        onClose={closeDrawer}
        tenant={mockQuotasTenant}
        onSave={(quotas) => {
          console.log('Save quotas:', quotas);
        }}
      />

      {/* =============================================
          CONTAINER DRAWERS ============================================= */}

      {/* Resource Type Search Drawer */}
      <ResourceTypeSearchDrawer
        isOpen={openDrawer === 'resource-type-search'}
        onClose={closeDrawer}
        onSelect={(categoryId, resourceId, resourceName) => {
          console.log('Resource selected:', { categoryId, resourceId, resourceName });
        }}
      />

      {/* =============================================
          AI AGENT DRAWERS ============================================= */}
    </PageShell>
  );
}

export default DrawersPage;
