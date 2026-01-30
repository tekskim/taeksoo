import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, VStack, HStack, Badge, Disclosure } from '@/design-system';
import { IconChevronRight, IconChevronDown, IconArrowLeft } from '@tabler/icons-react';

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
import {
  ManageSecurityGroupsDrawer,
  type InstanceInfo as ManageSecurityGroupsInstanceInfo,
} from '@/components/ManageSecurityGroupsDrawer';
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
import { ResourceTypeSearchDrawer } from '@/components/ResourceTypeSearchDrawer';
import {
  EditBasicInfoDrawer,
  EditModelSettingsDrawer,
  EditPromptSettingsDrawer,
  ConnectDataSourceDrawer,
  ConnectMCPServerDrawer,
} from '@/pages/design-system-sections/OverlayDemos';

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

const mockAssociateFloatingIP = {
  address: '172.24.4.228',
};

const mockDisassociateFloatingIPInstance: DisassociateFloatingIPInstanceInfo = {
  id: 'inst-001',
  name: 'tk-test',
};

const mockManageSecurityGroupsInstance: ManageSecurityGroupsInstanceInfo = {
  id: 'inst-001',
  name: 'web-server-10',
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

  // App section disclosure states
  const [isComputeOpen, setIsComputeOpen] = useState(false);
  const [isIAMOpen, setIsIAMOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);

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
  const [isCreateVolumeFromVolumeSnapshotOpen, setIsCreateVolumeFromVolumeSnapshotOpen] =
    useState(false);
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
  const [isDetachVolumeOpen, setIsDetachVolumeOpen] = useState(false);
  const [isAttachInterfaceOpen, setIsAttachInterfaceOpen] = useState(false);
  const [isDetachInterfaceOpen, setIsDetachInterfaceOpen] = useState(false);
  const [isAssociateFloatingIPOpen, setIsAssociateFloatingIPOpen] = useState(false);
  const [isDisassociateFloatingIPOpen, setIsDisassociateFloatingIPOpen] = useState(false);
  const [isManageSecurityGroupsOpen, setIsManageSecurityGroupsOpen] = useState(false);
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
  const [isRescueInstanceOpen, setIsRescueInstanceOpen] = useState(false);
  const [isRebuildInstanceOpen, setIsRebuildInstanceOpen] = useState(false);
  const [isResizeInstanceOpen, setIsResizeInstanceOpen] = useState(false);
  const [isCreateVolumeBackupWithSelectionOpen, setIsCreateVolumeBackupWithSelectionOpen] =
    useState(false);
  const [isRestoreFromSnapshotOpen, setIsRestoreFromSnapshotOpen] = useState(false);
  const [isAttachVolumeOpen, setIsAttachVolumeOpen] = useState(false);
  const [isCreateSubnetOpen, setIsCreateSubnetOpen] = useState(false);
  const [isCreateRouterOpen, setIsCreateRouterOpen] = useState(false);
  const [isAttachPortToInstanceOpen, setIsAttachPortToInstanceOpen] = useState(false);
  const [isEditPortSecurityGroupsOpen, setIsEditPortSecurityGroupsOpen] = useState(false);
  const [isAssociateFloatingIPToLBOpen, setIsAssociateFloatingIPToLBOpen] = useState(false);
  const [isChangeServerCertificateOpen, setIsChangeServerCertificateOpen] = useState(false);
  const [isChangeCACertificateOpen, setIsChangeCACertificateOpen] = useState(false);
  const [isManageSNICertificateOpen, setIsManageSNICertificateOpen] = useState(false);
  const [isExternalGatewaySettingOpen, setIsExternalGatewaySettingOpen] = useState(false);
  const [isConnectSubnetOpen, setIsConnectSubnetOpen] = useState(false);
  const [isAssociateFloatingIPToPortOpen, setIsAssociateFloatingIPToPortOpen] = useState(false);
  const [isDisconnectSubnetOpen, setIsDisconnectSubnetOpen] = useState(false);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [isAllocateFloatingIPOpen, setIsAllocateFloatingIPOpen] = useState(false);

  // Storage Drawer states
  const [isIdentifyDeviceOpen, setIsIdentifyDeviceOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isCreateObjectOpen, setIsCreateObjectOpen] = useState(false);
  const [isMoveFilesOpen, setIsMoveFilesOpen] = useState(false);
  const [isEditObjectOpen, setIsEditObjectOpen] = useState(false);

  // IAM drawer states
  const [isManageUserGroupsOpen, setIsManageUserGroupsOpen] = useState(false);
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const [isManageRolesOpen, setIsManageRolesOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isEditUserGroupOpen, setIsEditUserGroupOpen] = useState(false);
  const [isManagePoliciesOpen, setIsManagePoliciesOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isCreateDomainOpen, setIsCreateDomainOpen] = useState(false);
  const [isEditDomainOpen, setIsEditDomainOpen] = useState(false);
  const [isSetDefaultDomainOpen, setIsSetDefaultDomainOpen] = useState(false);
  const [isAdminLockSettingOpen, setIsAdminLockSettingOpen] = useState(false);
  const [isEditSystemAdminOpen, setIsEditSystemAdminOpen] = useState(false);

  // Container drawer states
  const [isResourceTypeSearchOpen, setIsResourceTypeSearchOpen] = useState(false);

  // AI Agent drawer states
  const [isEditBasicInfoOpen, setIsEditBasicInfoOpen] = useState(false);
  const [isEditModelSettingsOpen, setIsEditModelSettingsOpen] = useState(false);
  const [isEditPromptSettingsOpen, setIsEditPromptSettingsOpen] = useState(false);
  const [isConnectDataSourceOpen, setIsConnectDataSourceOpen] = useState(false);
  const [isConnectMCPServerOpen, setIsConnectMCPServerOpen] = useState(false);

  // ViewPreferences state
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columns, setColumns] = useState<ColumnConfig[]>(mockViewPreferencesColumns);

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-subtle)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<IconArrowLeft size={14} />}
              onClick={() => navigate('/')}
            >
              Back
            </Button>
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">Drawer Components</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <VStack gap={8}>
            {/* Page Description */}
            <p className="text-body-lg text-[var(--color-text-subtle)]">
              Collection of drawer components used across the application. Click to preview each
              drawer.
            </p>

            {/* Drawer Categories */}
            <VStack gap={4}>
              {/* Compute App Drawers */}
              <Disclosure open={isComputeOpen} onChange={setIsComputeOpen}>
                <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                  <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                    <div className="flex items-center gap-3">
                      {isComputeOpen ? (
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
                        (70 drawers)
                      </span>
                    </div>
                  </div>
                </Disclosure.Trigger>
                <Disclosure.Panel>
                  <VStack gap={4} className="pt-4">
                    {/* Instance Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Instance Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Create instance snapshot"
                          description="Create a snapshot of an instance to capture its current system state as an image."
                          category="Instance"
                          onOpen={() => setIsCreateSnapshotOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Edit instance"
                          description="Edit instance name and description. Allows modification of basic instance metadata."
                          category="Instance"
                          onOpen={() => setIsEditInstanceOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Lock setting"
                          description="Lock or unlock an instance to prevent accidental deletion or modification."
                          category="Instance"
                          onOpen={() => setIsLockSettingOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Manage Tags"
                          description="Add, edit, or remove tags to categorize and manage resources."
                          category="Instance"
                          onOpen={() => setIsManageTagsOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Rescue Instance"
                          description="Create a temporary recovery server using your instance's root disk."
                          category="Instance"
                          onOpen={() => setIsRescueInstanceOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Rebuild Instance"
                          description="Rebuild the instance by reinstalling the operating system using a new image."
                          category="Instance"
                          onOpen={() => setIsRebuildInstanceOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Resize Instance"
                          description="Change the flavor to adjust vCPU, memory, or disk capacity."
                          category="Instance"
                          onOpen={() => setIsResizeInstanceOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                      </div>
                    </VStack>

                    {/* Instance Snapshot Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Instance Snapshot Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Edit instance Snapshot"
                          description="Edit the name and description of an instance snapshot."
                          category="Snapshot"
                          onOpen={() => setIsEditInstanceSnapshotOpen(true)}
                          linked
                          linkedTo="Instance Snapshots"
                        />
                        <DrawerCard
                          title="Create volume from Instance Snapshot"
                          description="Create a new volume from an instance snapshot, containing the same data as the snapshot's system disk."
                          category="Snapshot"
                          onOpen={() => setIsCreateVolumeFromSnapshotOpen(true)}
                          linked
                          linkedTo="Instance Snapshots"
                        />
                      </div>
                    </VStack>

                    {/* Volume Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Volume Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Create volume snapshot"
                          description="Create a snapshot of a volume to back up its current data state for later restoration."
                          category="Volume"
                          onOpen={() => setIsCreateVolumeSnapshotOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Create volume backup"
                          description="Create a full backup of a volume and store it in the backup service for disaster recovery."
                          category="Volume"
                          onOpen={() => setIsCreateVolumeBackupOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Create volume backup (with selection)"
                          description="Create a volume backup with volume selection table, search, and pagination."
                          category="Volume"
                          onOpen={() => setIsCreateVolumeBackupWithSelectionOpen(true)}
                        />
                        <DrawerCard
                          title="Restore from snapshot"
                          description="Restore a volume from a snapshot by selecting from available snapshots."
                          category="Volume"
                          onOpen={() => setIsRestoreFromSnapshotOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Attach volume"
                          description="Attach a volume to an instance by selecting from available instances."
                          category="Volume"
                          onOpen={() => setIsAttachVolumeOpen(true)}
                          linked
                          linkedTo="Instance List, Volumes"
                        />
                        <DrawerCard
                          title="Create subnet"
                          description="Create a new subnet with CIDR, gateway, DHCP, and advanced network settings."
                          category="Network"
                          onOpen={() => setIsCreateSubnetOpen(true)}
                          linked
                          linkedTo="Networks"
                        />
                        <DrawerCard
                          title="Create router"
                          description="Create a virtual router to route traffic between networks with external gateway options."
                          category="Network"
                          onOpen={() => setIsCreateRouterOpen(true)}
                        />
                        <DrawerCard
                          title="Attach port to instance"
                          description="Attach a network port to an instance with Fixed IP, Floating IP, and availability zone."
                          category="Network"
                          onOpen={() => setIsAttachPortToInstanceOpen(true)}
                          linked
                          linkedTo="Ports"
                        />
                        <DrawerCard
                          title="Clone volume"
                          description="Create an exact copy of a volume for testing, backup, or new instance creation."
                          category="Volume"
                          onOpen={() => setIsCloneVolumeOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Extend volume"
                          description="Increase the size of a volume to expand its storage capacity."
                          category="Volume"
                          onOpen={() => setIsExtendVolumeOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Create image from Volume"
                          description="Create a new image using a volume as the source. The image will contain all data currently stored on the volume."
                          category="Volume"
                          onOpen={() => setIsCreateImageFromVolumeOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Edit Volume"
                          description="Edit the name and description of an existing volume."
                          category="Volume"
                          onOpen={() => setIsEditVolumeOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Change volume Type"
                          description="Change the storage type of this volume to another available volume type."
                          category="Volume"
                          onOpen={() => setIsChangeVolumeTypeOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Create transfer"
                          description="Create a transfer request to share this volume with another project."
                          category="Volume"
                          onOpen={() => setIsCreateTransferOpen(true)}
                          linked
                          linkedTo="Volumes"
                        />
                        <DrawerCard
                          title="Edit Volume backup"
                          description="Edit the name and description of an existing volume backup."
                          category="Volume"
                          onOpen={() => setIsEditVolumeBackupOpen(true)}
                          linked
                          linkedTo="Volume Backups"
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
                          linked
                          linkedTo="Volume Snapshots"
                        />
                        <DrawerCard
                          title="Create volume from Snapshot"
                          description="Create a new volume from an existing volume snapshot with customizable capacity and type."
                          category="Volume"
                          onOpen={() => setIsCreateVolumeFromVolumeSnapshotOpen(true)}
                          linked
                          linkedTo="Volume Snapshots"
                        />
                        <DrawerCard
                          title="Create volume from Backup"
                          description="Create a new volume from an existing volume backup with customizable capacity, type, and availability zone."
                          category="Volume"
                          onOpen={() => setIsCreateVolumeFromBackupOpen(true)}
                          linked
                          linkedTo="Volume Backups"
                        />
                        <DrawerCard
                          title="Detach Volume"
                          description="Detach a volume from an instance. Once detached, it will no longer be accessible from the instance."
                          category="Volume"
                          onOpen={() => setIsDetachVolumeOpen(true)}
                          linked
                          linkedTo="Instance List, Volumes"
                        />
                      </div>
                    </VStack>

                    {/* Image Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Image Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Create volume from Image"
                          description="Create a new volume using the selected image. The new volume will contain an identical copy of the image data."
                          category="Image"
                          onOpen={() => setIsCreateVolumeFromImageOpen(true)}
                          linked
                          linkedTo="Images"
                        />
                        <DrawerCard
                          title="Edit Image"
                          description="Edit image name and description. Allows modification of basic image metadata."
                          category="Image"
                          onOpen={() => setIsEditImageOpen(true)}
                          linked
                          linkedTo="Images"
                        />
                      </div>
                    </VStack>

                    {/* Key pair Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Key pair Actions{' '}
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
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Server group Actions{' '}
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
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Network Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Edit Network"
                          description="Edit network settings including name, description, admin state, and port security."
                          category="Network"
                          onOpen={() => setIsEditNetworkOpen(true)}
                          linked
                          linkedTo="Networks"
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
                          linked
                          linkedTo="Ports"
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
                          linked
                          linkedTo="Floating IPs"
                        />
                        <DrawerCard
                          title="Allocate IP"
                          description="Assign an additional fixed IP address to a port from a subnet."
                          category="Port"
                          onOpen={() => setIsAllocateIPOpen(true)}
                        />
                        <DrawerCard
                          title="Attach Interface"
                          description="Attach a new network interface to this instance. Connect it to another network or subnet for additional access."
                          category="Network"
                          onOpen={() => setIsAttachInterfaceOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Detach Interface"
                          description="Detach a network interface from this instance. This may interrupt connectivity if the selected port is primary."
                          category="Network"
                          onOpen={() => setIsDetachInterfaceOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Associate Floating IP"
                          description="Assign a floating IP to this instance for external network access."
                          category="Floating IP"
                          onOpen={() => setIsAssociateFloatingIPOpen(true)}
                          linked
                          linkedTo="Instance List, Floating IPs"
                        />
                        <DrawerCard
                          title="Disassociate Floating IP"
                          description="Remove the association between a floating IP and this instance. The instance will lose external network access through that IP."
                          category="Floating IP"
                          onOpen={() => setIsDisassociateFloatingIPOpen(true)}
                          linked
                          linkedTo="Instance List, Floating IPs, LBs"
                        />
                        <DrawerCard
                          title="Allocate Floating IP"
                          description="Allocate a new floating IP from an external network pool with optional DNS settings."
                          category="Floating IP"
                          onOpen={() => setIsAllocateFloatingIPOpen(true)}
                        />
                        <DrawerCard
                          title="External Gateway Setting"
                          description="Configure external gateway for a router to enable access to external networks."
                          category="Router"
                          onOpen={() => setIsExternalGatewaySettingOpen(true)}
                        />
                        <DrawerCard
                          title="Connect Subnet"
                          description="Connect an existing subnet to a router to enable routing between networks."
                          category="Router"
                          onOpen={() => setIsConnectSubnetOpen(true)}
                        />
                        <DrawerCard
                          title="Associate Floating IP to Port"
                          description="Associate a floating IP with a port to enable external network access."
                          category="Port"
                          onOpen={() => setIsAssociateFloatingIPToPortOpen(true)}
                          linked
                          linkedTo="Ports"
                        />
                        <DrawerCard
                          title="Disconnect Subnet"
                          description="Disconnect a subnet from a router to remove its routing path."
                          category="Router"
                          onOpen={() => setIsDisconnectSubnetOpen(true)}
                        />
                      </div>
                    </VStack>

                    {/* Security group Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Security group Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Create Security group Rule"
                          description="Create a rule to define allowed inbound or outbound network traffic for your security group."
                          category="Security group"
                          onOpen={() => setIsCreateSecurityGroupRuleOpen(true)}
                          linked
                          linkedTo="Security Groups"
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
                          linked
                          linkedTo="Security Groups"
                        />
                        <DrawerCard
                          title="Manage Security Groups"
                          description="Attach or detach security groups for an interface to control inbound and outbound traffic."
                          category="Security group"
                          onOpen={() => setIsManageSecurityGroupsOpen(true)}
                          linked
                          linkedTo="Instance List"
                        />
                        <DrawerCard
                          title="Edit Port Security Groups"
                          description="Manage security groups on a port with port security toggle and multi-select table."
                          category="Port"
                          onOpen={() => setIsEditPortSecurityGroupsOpen(true)}
                          linked
                          linkedTo="Ports"
                        />
                      </div>
                    </VStack>

                    {/* Load balancer Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Load balancer Actions{' '}
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
                          linked
                          linkedTo="Load Balancers"
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
                        <DrawerCard
                          title="Manage Members"
                          description="Manage pool members by adding instances or external members with configurable port and weight."
                          category="Load balancer"
                          onOpen={() => setIsManageMembersOpen(true)}
                        />
                        <DrawerCard
                          title="Associate Floating IP to LB"
                          description="Associate a floating IP to a load balancer for external access."
                          category="Load balancer"
                          onOpen={() => setIsAssociateFloatingIPToLBOpen(true)}
                          linked
                          linkedTo="Load Balancers"
                        />
                        <DrawerCard
                          title="Change Server Certificate"
                          description="Change the server certificate for a listener with certificate selection table."
                          category="Certificate"
                          onOpen={() => setIsChangeServerCertificateOpen(true)}
                        />
                        <DrawerCard
                          title="Change CA Certificate"
                          description="Change the CA certificate for a listener with certificate selection table."
                          category="Certificate"
                          onOpen={() => setIsChangeCACertificateOpen(true)}
                        />
                        <DrawerCard
                          title="Manage SNI Certificate"
                          description="Enable SNI and manage multiple SNI certificates for a listener."
                          category="Certificate"
                          onOpen={() => setIsManageSNICertificateOpen(true)}
                        />
                      </div>
                    </VStack>
                  </VStack>
                </Disclosure.Panel>
              </Disclosure>

              {/* IAM App Drawers */}
              <Disclosure open={isIAMOpen} onChange={setIsIAMOpen}>
                <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                  <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                    <div className="flex items-center gap-3">
                      {isIAMOpen ? (
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
                        User Management Actions{' '}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Manage User Groups"
                          description="Add or remove user groups for a specific user."
                          category="User"
                          onOpen={() => setIsManageUserGroupsOpen(true)}
                          linked
                          linkedTo="IAM Users"
                        />
                        <DrawerCard
                          title="Manage Roles"
                          description="Add or remove roles directly assigned to a specific user."
                          category="User"
                          onOpen={() => setIsManageRolesOpen(true)}
                          linked
                          linkedTo="IAM Users, User Groups"
                        />
                        <DrawerCard
                          title="Reset Password"
                          description="Reset the login password for a specific user."
                          category="User"
                          onOpen={() => setIsResetPasswordOpen(true)}
                        />
                        <DrawerCard
                          title="Edit User"
                          description="Edit the user's basic information like email and display name."
                          category="User"
                          onOpen={() => setIsEditUserOpen(true)}
                          linked
                          linkedTo="IAM Users"
                        />
                      </div>
                    </VStack>

                    {/* User Group Management */}
                    <VStack gap={2}>
                      <h3 className="text-body-sm font-semibold text-[var(--color-text-subtle)] tracking-wider uppercase">
                        User Group Management Actions{' '}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Manage Users"
                          description="Add or remove members of a user group."
                          category="User Group"
                          onOpen={() => setIsManageUsersOpen(true)}
                          linked
                          linkedTo="IAM User Groups"
                        />
                        <DrawerCard
                          title="Edit User Group"
                          description="Edit the user group's basic information."
                          category="User Group"
                          onOpen={() => setIsEditUserGroupOpen(true)}
                          linked
                          linkedTo="IAM User Groups"
                        />
                      </div>
                    </VStack>

                    {/* Role Management */}
                    <VStack gap={2}>
                      <h3 className="text-body-sm font-semibold text-[var(--color-text-subtle)] tracking-wider uppercase">
                        Role Management Actions{' '}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Manage Policies"
                          description="Add or remove policies of a role."
                          onOpen={() => setIsManagePoliciesOpen(true)}
                          badge="Role"
                        />
                        <DrawerCard
                          title="Edit Role"
                          description="Edit basic information for a role."
                          onOpen={() => setIsEditRoleOpen(true)}
                          badge="Role"
                        />
                      </div>
                    </VStack>

                    {/* Domain Management */}
                    <VStack gap={2}>
                      <h3 className="text-body-sm font-semibold text-[var(--color-text-subtle)] tracking-wider uppercase">
                        Domain Management Actions{' '}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Create Domain"
                          description="Create a new domain to manage resources and policies independently."
                          onOpen={() => setIsCreateDomainOpen(true)}
                          badge="Domain"
                        />
                        <DrawerCard
                          title="Edit Domain"
                          description="Edit the domain's basic information."
                          onOpen={() => setIsEditDomainOpen(true)}
                          badge="Domain"
                        />
                        <DrawerCard
                          title="Set Default Domain"
                          description="Set the default domain for the system administrator."
                          onOpen={() => setIsSetDefaultDomainOpen(true)}
                          badge="Domain"
                        />
                        <DrawerCard
                          title="Lock Setting"
                          description="Lock or unlock a system administrator account."
                          onOpen={() => setIsAdminLockSettingOpen(true)}
                          badge="Admin"
                        />
                        <DrawerCard
                          title="Edit System Administrator"
                          description="Edit the system administrator's basic information."
                          onOpen={() => setIsEditSystemAdminOpen(true)}
                          badge="Admin"
                        />
                      </div>
                    </VStack>
                  </VStack>
                </Disclosure.Panel>
              </Disclosure>

              {/* Storage App Drawers */}
              <Disclosure open={isStorageOpen} onChange={setIsStorageOpen}>
                <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                  <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                    <div className="flex items-center gap-3">
                      {isStorageOpen ? (
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
                        Object Storage Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Create Folder"
                          description="Create a new folder in a bucket with a specified parent location."
                          category="Object Storage"
                          onOpen={() => setIsCreateFolderOpen(true)}
                        />
                        <DrawerCard
                          title="Create Object"
                          description="Upload files to a bucket with ACL settings and tags."
                          category="Object Storage"
                          onOpen={() => setIsCreateObjectOpen(true)}
                        />
                        <DrawerCard
                          title="Move Files"
                          description="Move files or folders to a different location within the bucket."
                          category="Object Storage"
                          onOpen={() => setIsMoveFilesOpen(true)}
                        />
                        <DrawerCard
                          title="Edit Object"
                          description="Edit object name and manage tags."
                          category="Object Storage"
                          onOpen={() => setIsEditObjectOpen(true)}
                        />
                      </div>
                    </VStack>

                    {/* Physical Disk Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Physical Disk Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Identify Device"
                          description="Indicate the LED on a physical disk to identify the device."
                          category="Physical Disk"
                          onOpen={() => setIsIdentifyDeviceOpen(true)}
                        />
                      </div>
                    </VStack>
                  </VStack>
                </Disclosure.Panel>
              </Disclosure>

              {/* Container App Drawers */}
              <Disclosure open={isContainerOpen} onChange={setIsContainerOpen}>
                <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                  <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                    <div className="flex items-center gap-3">
                      {isContainerOpen ? (
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
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        (1 drawer)
                      </span>
                    </div>
                  </div>
                </Disclosure.Trigger>
                <Disclosure.Panel>
                  <VStack gap={4} className="pt-4">
                    {/* Resource Search Actions */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Resource Search Actions{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Resource Type Search"
                          description="Search and navigate Kubernetes resource types across clusters with categorized resource lists."
                          category="Search"
                          onOpen={() => setIsResourceTypeSearchOpen(true)}
                        />
                      </div>
                    </VStack>
                  </VStack>
                </Disclosure.Panel>
              </Disclosure>

              {/* AI Agent Drawers */}
              <Disclosure open={isAIAgentOpen} onChange={setIsAIAgentOpen}>
                <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                  <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                    <div className="flex items-center gap-3">
                      {isAIAgentOpen ? (
                        <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
                      ) : (
                        <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
                      )}
                      <Badge variant="info" size="sm" className="w-[70px] justify-center">
                        AI Agent{' '}
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
                    {/* Agent Settings */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Agent Settings{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Edit Basic Information"
                          description="Edit agent name, description, status, and tags."
                          category="Settings"
                          onOpen={() => setIsEditBasicInfoOpen(true)}
                        />
                        <DrawerCard
                          title="Edit Model Settings"
                          description="Configure model provider, model, temperature, and max tokens."
                          category="Settings"
                          onOpen={() => setIsEditModelSettingsOpen(true)}
                        />
                        <DrawerCard
                          title="Edit Prompt Settings"
                          description="Set system prompt, tone, and max iteration count."
                          category="Settings"
                          onOpen={() => setIsEditPromptSettingsOpen(true)}
                        />
                      </div>
                    </VStack>
                    {/* Agent Connections */}
                    <VStack gap={2}>
                      <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                        Agent Connections{' '}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <DrawerCard
                          title="Connect Data Source"
                          description="Select and connect data sources to the agent."
                          category="Connection"
                          onOpen={() => setIsConnectDataSourceOpen(true)}
                        />
                        <DrawerCard
                          title="Connect MCP Server"
                          description="Select and connect MCP servers to the agent."
                          category="Connection"
                          onOpen={() => setIsConnectMCPServerOpen(true)}
                        />
                      </div>
                    </VStack>
                  </VStack>
                </Disclosure.Panel>
              </Disclosure>

              {/* Table Settings */}
              <VStack gap={2}>
                <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                  Table Settings{' '}
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
            </VStack>
          </VStack>
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
          console.log('Create volume from snapshot:', {
            volumeName,
            description,
            capacity,
            volumeType,
          });
        }}
      />

      <CreateVolumeFromBackupDrawer
        isOpen={isCreateVolumeFromBackupOpen}
        onClose={() => setIsCreateVolumeFromBackupOpen(false)}
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
        isOpen={isAddL7PolicyOpen}
        onClose={() => setIsAddL7PolicyOpen(false)}
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
        isOpen={isRegisterCertificateOpen}
        onClose={() => setIsRegisterCertificateOpen(false)}
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
        isOpen={isCreateSecurityGroupRuleOpen}
        onClose={() => setIsCreateSecurityGroupRuleOpen(false)}
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

      <DetachVolumeDrawer
        isOpen={isDetachVolumeOpen}
        onClose={() => setIsDetachVolumeOpen(false)}
        instance={mockDetachInstance}
        onDetach={(volumeId) => {
          console.log('Detach volume:', { volumeId });
        }}
      />

      <AttachInterfaceDrawer
        isOpen={isAttachInterfaceOpen}
        onClose={() => setIsAttachInterfaceOpen(false)}
        instance={mockAttachInterfaceInstance}
        onAttach={(networkId, fixedIp) => {
          console.log('Attach interface:', { networkId, fixedIp });
        }}
      />

      <DetachInterfaceDrawer
        isOpen={isDetachInterfaceOpen}
        onClose={() => setIsDetachInterfaceOpen(false)}
        instance={mockDetachInterfaceInstance}
        onDetach={(interfaceId) => {
          console.log('Detach interface:', { interfaceId });
        }}
      />

      <AssociateFloatingIPDrawer
        isOpen={isAssociateFloatingIPOpen}
        onClose={() => setIsAssociateFloatingIPOpen(false)}
        floatingIP={mockAssociateFloatingIP}
        onSubmit={(data) => {
          console.log('Associate floating IP:', data);
        }}
      />

      <DisassociateFloatingIPDrawer
        isOpen={isDisassociateFloatingIPOpen}
        onClose={() => setIsDisassociateFloatingIPOpen(false)}
        instance={mockDisassociateFloatingIPInstance}
        onDisassociate={(floatingIpId) => {
          console.log('Disassociate floating IP:', { floatingIpId });
        }}
      />

      <ManageSecurityGroupsDrawer
        isOpen={isManageSecurityGroupsOpen}
        onClose={() => setIsManageSecurityGroupsOpen(false)}
        instance={mockManageSecurityGroupsInstance}
        onSave={(interfaceId, securityGroupIds) => {
          console.log('Manage security groups:', { interfaceId, securityGroupIds });
        }}
      />

      <ManageTagsDrawer
        isOpen={isManageTagsOpen}
        onClose={() => setIsManageTagsOpen(false)}
        instance={mockManageTagsInstance}
        onSave={(tags) => {
          console.log('Manage tags:', tags);
        }}
      />

      <RescueInstanceDrawer
        isOpen={isRescueInstanceOpen}
        onClose={() => setIsRescueInstanceOpen(false)}
        instance={mockRescueInstance}
        onRescue={(imageOption) => {
          console.log('Rescue instance with image option:', imageOption);
        }}
      />

      <RebuildInstanceDrawer
        isOpen={isRebuildInstanceOpen}
        onClose={() => setIsRebuildInstanceOpen(false)}
        instance={mockRebuildInstance}
        onRebuild={(imageOption) => {
          console.log('Rebuild instance with image option:', imageOption);
        }}
      />

      <ResizeInstanceDrawer
        isOpen={isResizeInstanceOpen}
        onClose={() => setIsResizeInstanceOpen(false)}
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
        isOpen={isCreateVolumeBackupWithSelectionOpen}
        onClose={() => setIsCreateVolumeBackupWithSelectionOpen(false)}
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
        isOpen={isRestoreFromSnapshotOpen}
        onClose={() => setIsRestoreFromSnapshotOpen(false)}
        volume={{ id: 'vol-03', name: 'vol-03' }}
        onRestore={(snapshotId) => {
          console.log('Restore from snapshot:', { snapshotId });
        }}
      />

      <AttachVolumeDrawer
        isOpen={isAttachVolumeOpen}
        onClose={() => setIsAttachVolumeOpen(false)}
        volume={{ id: 'vol-03', name: 'vol-03' }}
        onAttach={(instanceId) => {
          console.log('Attach volume to instance:', { instanceId });
        }}
      />

      <CreateSubnetDrawer
        isOpen={isCreateSubnetOpen}
        onClose={() => setIsCreateSubnetOpen(false)}
        networkId="network-01"
        networkName="private-network"
        onSubmit={(data) => {
          console.log('Create subnet:', data);
        }}
      />

      <CreateRouterDrawer
        isOpen={isCreateRouterOpen}
        onClose={() => setIsCreateRouterOpen(false)}
        onSubmit={(data) => {
          console.log('Create router:', data);
        }}
      />

      <AttachPortToInstanceDrawer
        isOpen={isAttachPortToInstanceOpen}
        onClose={() => setIsAttachPortToInstanceOpen(false)}
        portId="port-01"
        portName="port-01"
        onSubmit={(data) => {
          console.log('Attach port to instance:', data);
        }}
      />

      <EditPortSecurityGroupsDrawer
        isOpen={isEditPortSecurityGroupsOpen}
        onClose={() => setIsEditPortSecurityGroupsOpen(false)}
        port={{
          id: 'port-001',
          name: 'port-10',
        }}
        onSave={(data) => {
          console.log('Edit port security groups:', data);
        }}
      />

      <AssociateFloatingIPToLBDrawer
        isOpen={isAssociateFloatingIPToLBOpen}
        onClose={() => setIsAssociateFloatingIPToLBOpen(false)}
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
        isOpen={isChangeServerCertificateOpen}
        onClose={() => setIsChangeServerCertificateOpen(false)}
        currentCertificate={{
          name: 'server-cert-1',
          expiresAt: '2025-10-10',
        }}
        onChangeCertificate={(certificateId) => {
          console.log('Change server certificate:', certificateId);
        }}
      />

      <ChangeCACertificateDrawer
        isOpen={isChangeCACertificateOpen}
        onClose={() => setIsChangeCACertificateOpen(false)}
        currentCertificate={{
          name: 'ca-cert-1',
          expiredOn: '2025-10-10',
        }}
        onSubmit={(certificateId) => {
          console.log('Change CA certificate:', certificateId);
        }}
      />

      <ManageSNICertificateDrawer
        isOpen={isManageSNICertificateOpen}
        onClose={() => setIsManageSNICertificateOpen(false)}
        initialSniEnabled={true}
        onSubmit={(data) => {
          console.log('Manage SNI certificate:', data);
        }}
      />

      <ExternalGatewaySettingDrawer
        isOpen={isExternalGatewaySettingOpen}
        onClose={() => setIsExternalGatewaySettingOpen(false)}
        router={{ name: 'router-01' }}
        initialGatewayEnabled={true}
        onSubmit={(data) => {
          console.log('External gateway setting:', data);
        }}
      />

      <ConnectSubnetDrawer
        isOpen={isConnectSubnetOpen}
        onClose={() => setIsConnectSubnetOpen(false)}
        router={{ name: 'router-01' }}
        onSubmit={(data) => {
          console.log('Connect subnet:', data);
        }}
      />

      <AssociateFloatingIPToPortDrawer
        isOpen={isAssociateFloatingIPToPortOpen}
        onClose={() => setIsAssociateFloatingIPToPortOpen(false)}
        port={{ name: 'port-10' }}
        onSubmit={(data) => {
          console.log('Associate floating IP to port:', data);
        }}
      />

      <DisconnectSubnetDrawer
        isOpen={isDisconnectSubnetOpen}
        onClose={() => setIsDisconnectSubnetOpen(false)}
        router={{ name: 'router-01' }}
        onSubmit={(subnetId) => {
          console.log('Disconnect subnet:', subnetId);
        }}
      />

      <ManageMembersDrawer
        isOpen={isManageMembersOpen}
        onClose={() => setIsManageMembersOpen(false)}
        pool={{ name: 'pool-http' }}
        onSubmit={(members) => {
          console.log('Manage members:', members);
        }}
      />

      <AllocateFloatingIPDrawer
        isOpen={isAllocateFloatingIPOpen}
        onClose={() => setIsAllocateFloatingIPOpen(false)}
        floatingIPQuota={{ used: 2, total: 10 }}
        onSubmit={(data) => {
          console.log('Allocate floating IP:', data);
        }}
      />

      {/* =============================================
          STORAGE DRAWERS ============================================= */}

      {/* Create Folder Drawer */}
      <CreateFolderDrawer
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        bucketName="my-bucket"
        currentPath="/folder A"
        onSubmit={(folderName, parentPath) => {
          console.log('Create folder:', folderName, 'in', parentPath);
        }}
      />

      {/* Create Object Drawer */}
      <CreateObjectDrawer
        isOpen={isCreateObjectOpen}
        onClose={() => setIsCreateObjectOpen(false)}
        currentPath="/bucket/folder"
        onSubmit={(data) => {
          console.log('Create object:', data);
        }}
      />

      {/* Move Files Drawer */}
      <MoveFilesDrawer
        isOpen={isMoveFilesOpen}
        onClose={() => setIsMoveFilesOpen(false)}
        currentPath="folder/~"
        onSubmit={(targetPath) => {
          console.log('Move files to:', targetPath);
        }}
      />

      {/* Edit Object Drawer */}
      <EditObjectDrawer
        isOpen={isEditObjectOpen}
        onClose={() => setIsEditObjectOpen(false)}
        objectName="{Current Folder Name}"
        onSubmit={(name, tags) => {
          console.log('Edit object:', name, tags);
        }}
      />

      {/* Identify Device Drawer */}
      <IdentifyDeviceDrawer
        isOpen={isIdentifyDeviceOpen}
        onClose={() => setIsIdentifyDeviceOpen(false)}
        onSubmit={(duration) => {
          console.log('Identify device with duration:', duration);
        }}
      />

      {/* Manage User Groups Drawer */}
      <ManageUserGroupsDrawer
        isOpen={isManageUserGroupsOpen}
        onClose={() => setIsManageUserGroupsOpen(false)}
        userName="thaki.kim"
        onSubmit={(data) => {
          console.log('Manage user groups:', data);
        }}
      />

      {/* Manage Users Drawer */}
      <ManageUsersDrawer
        isOpen={isManageUsersOpen}
        onClose={() => setIsManageUsersOpen(false)}
        userGroupName="MemberGroup"
        onSubmit={(data) => {
          console.log('Manage users:', data);
        }}
      />

      {/* Manage Roles Drawer */}
      <ManageRolesDrawer
        isOpen={isManageRolesOpen}
        onClose={() => setIsManageRolesOpen(false)}
        userName="thaki.kim"
        onSubmit={(data) => {
          console.log('Manage roles:', data);
        }}
      />

      {/* Reset Password Drawer */}
      <ResetPasswordDrawer
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        userName="thaki.kim"
        onSubmit={(data) => {
          console.log('Reset password:', data);
        }}
      />

      {/* Edit User Drawer */}
      <EditUserDrawer
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
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
        isOpen={isEditUserGroupOpen}
        onClose={() => setIsEditUserGroupOpen(false)}
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
        isOpen={isManagePoliciesOpen}
        onClose={() => setIsManagePoliciesOpen(false)}
        roleName="member"
        onSubmit={(data) => {
          console.log('Manage policies:', data);
        }}
      />

      {/* Edit Role Drawer */}
      <EditRoleDrawer
        isOpen={isEditRoleOpen}
        onClose={() => setIsEditRoleOpen(false)}
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
        isOpen={isCreateDomainOpen}
        onClose={() => setIsCreateDomainOpen(false)}
        onSubmit={(data) => {
          console.log('Create domain:', data);
        }}
      />

      {/* Edit Domain Drawer */}
      <EditDomainDrawer
        isOpen={isEditDomainOpen}
        onClose={() => setIsEditDomainOpen(false)}
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
        isOpen={isSetDefaultDomainOpen}
        onClose={() => setIsSetDefaultDomainOpen(false)}
        adminUsername="thaki.kim"
        onSubmit={(domainId) => {
          console.log('Set default domain:', domainId);
        }}
      />

      {/* Admin Lock Setting Drawer */}
      <AdminLockSettingDrawer
        isOpen={isAdminLockSettingOpen}
        onClose={() => setIsAdminLockSettingOpen(false)}
        adminUsername="thaki.kim"
        initialLocked={true}
        onSubmit={(locked) => {
          console.log('Admin lock setting:', locked);
        }}
      />

      {/* Edit System Admin Drawer */}
      <EditSystemAdminDrawer
        isOpen={isEditSystemAdminOpen}
        onClose={() => setIsEditSystemAdminOpen(false)}
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
          CONTAINER DRAWERS ============================================= */}

      {/* Resource Type Search Drawer */}
      <ResourceTypeSearchDrawer
        isOpen={isResourceTypeSearchOpen}
        onClose={() => setIsResourceTypeSearchOpen(false)}
        onSelect={(categoryId, resourceId, resourceName) => {
          console.log('Resource selected:', { categoryId, resourceId, resourceName });
        }}
      />

      {/* =============================================
          AI AGENT DRAWERS ============================================= */}

      {/* Edit Basic Information Drawer */}
      <EditBasicInfoDrawer
        isOpen={isEditBasicInfoOpen}
        onClose={() => setIsEditBasicInfoOpen(false)}
      />

      {/* Edit Model Settings Drawer */}
      <EditModelSettingsDrawer
        isOpen={isEditModelSettingsOpen}
        onClose={() => setIsEditModelSettingsOpen(false)}
      />

      {/* Edit Prompt Settings Drawer */}
      <EditPromptSettingsDrawer
        isOpen={isEditPromptSettingsOpen}
        onClose={() => setIsEditPromptSettingsOpen(false)}
      />

      {/* Connect Data Source Drawer */}
      <ConnectDataSourceDrawer
        isOpen={isConnectDataSourceOpen}
        onClose={() => setIsConnectDataSourceOpen(false)}
      />

      {/* Connect MCP Server Drawer */}
      <ConnectMCPServerDrawer
        isOpen={isConnectMCPServerOpen}
        onClose={() => setIsConnectMCPServerOpen(false)}
      />
    </div>
  );
}

export default DrawersPage;
