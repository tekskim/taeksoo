import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { TopBar, Breadcrumb, TabBar } from '@/design-system';
import { Button, VStack, HStack, Badge, Modal, Disclosure } from '@/design-system';
import {
  IconAlertCircle,
  IconChevronRight,
  IconChevronDown,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';
import { DeleteClusterModal } from '@/components/DeleteClusterModal';
import { DeleteNamespaceModal } from '@/components/DeleteNamespaceModal';
import { DeletePodModal } from '@/components/DeletePodModal';
import { DeleteJobModal } from '@/components/DeleteJobModal';
import { DeleteCronJobModal } from '@/components/DeleteCronJobModal';
import { DeleteDeploymentModal } from '@/components/DeleteDeploymentModal';
import { DeleteStatefulSetModal } from '@/components/DeleteStatefulSetModal';
import { DeleteDaemonSetModal } from '@/components/DeleteDaemonSetModal';
import { RedeployDeploymentModal } from '@/components/RedeployDeploymentModal';
import { RedeployStatefulSetModal } from '@/components/RedeployStatefulSetModal';
import { RedeployDaemonSetModal } from '@/components/RedeployDaemonSetModal';
import { RollBackDeploymentModal } from '@/components/RollBackDeploymentModal';

/* ----------------------------------------
   Modal List Item Component
   ---------------------------------------- */

interface ModalListItemProps {
  title: string;
  description: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
  onOpen: () => void;
}

function ModalListItem({ title, description, category, size, onOpen }: ModalListItemProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)] transition-colors cursor-pointer group"
      onClick={onOpen}
    >
      <HStack gap={3} className="flex-1 items-center min-w-0">
        {size && (
          <Badge
            variant={size === 'lg' ? 'yellow' : size === 'md' ? 'info' : 'gray'}
            size="sm"
            className="shrink-0 w-[32px] justify-center font-mono uppercase"
          >
            {size}
          </Badge>
        )}
        {category && (
          <Badge variant="purple" size="sm" className="shrink-0 w-[100px] justify-center">
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
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Open
      </Button>
    </div>
  );
}

/* ----------------------------------------
   ModalsPage Component
   ---------------------------------------- */

export function ModalsPage() {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modal states
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleteSecurityGroupOpen, setIsDeleteSecurityGroupOpen] = useState(false);
  const [isDeleteSecurityGroupsMultipleOpen, setIsDeleteSecurityGroupsMultipleOpen] =
    useState(false);
  const [isDeleteRuleOpen, setIsDeleteRuleOpen] = useState(false);
  const [isDeleteRulesMultipleOpen, setIsDeleteRulesMultipleOpen] = useState(false);
  const [isDetachVolumeOpen, setIsDetachVolumeOpen] = useState(false);
  const [isRestoreBackupSmallOpen, setIsRestoreBackupSmallOpen] = useState(false);
  const [isRestoreBackupMediumOpen, setIsRestoreBackupMediumOpen] = useState(false);
  const [isRestoreBackupLargeOpen, setIsRestoreBackupLargeOpen] = useState(false);
  const [isDisassociateFloatingIPOpen, setIsDisassociateFloatingIPOpen] = useState(false);
  const [isDisassociateFloatingIPLBOpen, setIsDisassociateFloatingIPLBOpen] = useState(false);
  const [isReleaseFloatingIPSmallOpen, setIsReleaseFloatingIPSmallOpen] = useState(false);
  const [isReleaseFloatingIPMediumOpen, setIsReleaseFloatingIPMediumOpen] = useState(false);
  const [isDeleteLoadBalancerOpen, setIsDeleteLoadBalancerOpen] = useState(false);
  const [isDeleteLoadBalancersMultipleOpen, setIsDeleteLoadBalancersMultipleOpen] = useState(false);

  // IAM Modal states
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isDeleteUsersMultipleOpen, setIsDeleteUsersMultipleOpen] = useState(false);
  const [isConfirmUserPasswordOpen, setIsConfirmUserPasswordOpen] = useState(false);
  const [isUnsavedChangesOpen, setIsUnsavedChangesOpen] = useState(false);
  const [isDetachUserGroupOpen, setIsDetachUserGroupOpen] = useState(false);
  const [isDetachRoleOpen, setIsDetachRoleOpen] = useState(false);
  const [isRemoveOtpMfaOpen, setIsRemoveOtpMfaOpen] = useState(false);
  const [isTerminateAllSessionsOpen, setIsTerminateAllSessionsOpen] = useState(false);
  const [isTerminateSessionOpen, setIsTerminateSessionOpen] = useState(false);
  const [isRemoveUserFromGroupOpen, setIsRemoveUserFromGroupOpen] = useState(false);
  const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState(false);
  const [isDeleteRolesMultipleOpen, setIsDeleteRolesMultipleOpen] = useState(false);
  const [isDetachPolicyOpen, setIsDetachPolicyOpen] = useState(false);
  const [isDeletePolicyOpen, setIsDeletePolicyOpen] = useState(false);
  const [isDeletePoliciesMultipleOpen, setIsDeletePoliciesMultipleOpen] = useState(false);
  const [isRevertPolicyVersionOpen, setIsRevertPolicyVersionOpen] = useState(false);
  const [isDeletePolicyVersionOpen, setIsDeletePolicyVersionOpen] = useState(false);
  const [isUpdateMfaEnforcementOpen, setIsUpdateMfaEnforcementOpen] = useState(false);
  const [isUpdateOtpPolicyOpen, setIsUpdateOtpPolicyOpen] = useState(false);
  const [isUpdateOtpPolicySettingsOpen, setIsUpdateOtpPolicySettingsOpen] = useState(false);
  const [isUpdateEmailPolicyOpen, setIsUpdateEmailPolicyOpen] = useState(false);
  const [isUpdateEmailPolicySettingsOpen, setIsUpdateEmailPolicySettingsOpen] = useState(false);
  const [isUpdateGeneralSessionPolicyOpen, setIsUpdateGeneralSessionPolicyOpen] = useState(false);
  const [isDeleteDomainOpen, setIsDeleteDomainOpen] = useState(false);
  const [isSwitchToDomainOpen, setIsSwitchToDomainOpen] = useState(false);
  const [isDeleteSystemAdminOpen, setIsDeleteSystemAdminOpen] = useState(false);
  const [isUpdatePasswordPolicyOpen, setIsUpdatePasswordPolicyOpen] = useState(false);
  const [isUpdateAccountLockoutPolicyOpen, setIsUpdateAccountLockoutPolicyOpen] = useState(false);
  const [isUpdateTokenPolicyOpen, setIsUpdateTokenPolicyOpen] = useState(false);
  const [usernameCopied, setUsernameCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Storage Modal states
  const [isDeleteBucketOpen, setIsDeleteBucketOpen] = useState(false);

  // Container Modal states
  const [isDeleteClusterOpen, setIsDeleteClusterOpen] = useState(false);
  const [isDeleteNamespaceOpen, setIsDeleteNamespaceOpen] = useState(false);
  const [isDeletePodOpen, setIsDeletePodOpen] = useState(false);
  const [isDeleteJobOpen, setIsDeleteJobOpen] = useState(false);
  const [isDeleteCronJobOpen, setIsDeleteCronJobOpen] = useState(false);
  const [isDeleteDeploymentOpen, setIsDeleteDeploymentOpen] = useState(false);
  const [isDeleteStatefulSetOpen, setIsDeleteStatefulSetOpen] = useState(false);
  const [isDeleteDaemonSetOpen, setIsDeleteDaemonSetOpen] = useState(false);
  const [isRedeployDeploymentOpen, setIsRedeployDeploymentOpen] = useState(false);
  const [isRedeployStatefulSetOpen, setIsRedeployStatefulSetOpen] = useState(false);
  const [isRedeployDaemonSetOpen, setIsRedeployDaemonSetOpen] = useState(false);
  const [isRollBackDeploymentOpen, setIsRollBackDeploymentOpen] = useState(false);

  // Compute Admin Modal states
  const [isStopInstanceOpen, setIsStopInstanceOpen] = useState(false);
  const [isRebootInstanceOpen, setIsRebootInstanceOpen] = useState(false);
  const [isSoftRebootInstanceOpen, setIsSoftRebootInstanceOpen] = useState(false);
  const [isConfirmResizeOpen, setIsConfirmResizeOpen] = useState(false);
  const [isRevertResizeOpen, setIsRevertResizeOpen] = useState(false);
  const [isDeleteInstanceOpen, setIsDeleteInstanceOpen] = useState(false);
  const [isShelveInstanceOpen, setIsShelveInstanceOpen] = useState(false);
  const [isStartInstancesOpen, setIsStartInstancesOpen] = useState(false);
  const [isStopInstancesOpen, setIsStopInstancesOpen] = useState(false);
  const [isRebootInstancesOpen, setIsRebootInstancesOpen] = useState(false);
  const [isDeleteInstancesOpen, setIsDeleteInstancesOpen] = useState(false);
  const [isDeleteInstanceTemplateOpen, setIsDeleteInstanceTemplateOpen] = useState(false);
  const [isDeleteInstanceTemplatesOpen, setIsDeleteInstanceTemplatesOpen] = useState(false);
  const [isDeleteImageOpen, setIsDeleteImageOpen] = useState(false);
  const [isDeleteImagesOpen, setIsDeleteImagesOpen] = useState(false);
  const [isDeleteSnapshotOpen, setIsDeleteSnapshotOpen] = useState(false);
  const [isDeleteSnapshotsOpen, setIsDeleteSnapshotsOpen] = useState(false);
  const [isDeleteVolumeOpen, setIsDeleteVolumeOpen] = useState(false);
  const [isDeleteVolumesOpen, setIsDeleteVolumesOpen] = useState(false);
  const [isDeleteVolumeTypeOpen, setIsDeleteVolumeTypeOpen] = useState(false);
  const [isDeleteVolumeTypesOpen, setIsDeleteVolumeTypesOpen] = useState(false);
  const [isDeleteBackupOpen, setIsDeleteBackupOpen] = useState(false);
  const [isDeleteBackupsOpen, setIsDeleteBackupsOpen] = useState(false);
  const [isDeleteEncryptionOpen, setIsDeleteEncryptionOpen] = useState(false);
  const [isDeleteExtraSpecOpen, setIsDeleteExtraSpecOpen] = useState(false);
  const [isDeleteExtraSpecsOpen, setIsDeleteExtraSpecsOpen] = useState(false);
  const [isDeleteQoSSpecOpen, setIsDeleteQoSSpecOpen] = useState(false);
  const [isDeleteQoSSpecsOpen, setIsDeleteQoSSpecsOpen] = useState(false);
  const [isDeleteQoSExtraSpecOpen, setIsDeleteQoSExtraSpecOpen] = useState(false);
  const [isDeleteQoSExtraSpecsOpen, setIsDeleteQoSExtraSpecsOpen] = useState(false);
  const [isDeleteNetworkOpen, setIsDeleteNetworkOpen] = useState(false);
  const [isDeleteNetworksOpen, setIsDeleteNetworksOpen] = useState(false);
  const [isDeleteSubnetOpen, setIsDeleteSubnetOpen] = useState(false);
  const [isDeleteSubnetsOpen, setIsDeleteSubnetsOpen] = useState(false);
  const [isDeletePortOpen, setIsDeletePortOpen] = useState(false);
  const [isDeletePortsOpen, setIsDeletePortsOpen] = useState(false);
  const [isDeleteRouterOpen, setIsDeleteRouterOpen] = useState(false);
  const [isDeleteRoutersOpen, setIsDeleteRoutersOpen] = useState(false);
  const [isDeleteStaticRoutesOpen, setIsDeleteStaticRoutesOpen] = useState(false);
  const [isRemoveDHCPAgentsOpen, setIsRemoveDHCPAgentsOpen] = useState(false);
  const [isReleaseFixedIPOpen, setIsReleaseFixedIPOpen] = useState(false);
  const [isDeleteAllowedAddressPairOpen, setIsDeleteAllowedAddressPairOpen] = useState(false);
  const [isDeleteSecurityGroupAdminOpen, setIsDeleteSecurityGroupAdminOpen] = useState(false);
  const [isDeleteSecurityGroupsAdminOpen, setIsDeleteSecurityGroupsAdminOpen] = useState(false);
  const [isDeleteFirewallOpen, setIsDeleteFirewallOpen] = useState(false);
  const [isDeleteFirewallsOpen, setIsDeleteFirewallsOpen] = useState(false);
  const [isUnsavedChangesAdminOpen, setIsUnsavedChangesAdminOpen] = useState(false);
  const [isReleaseFloatingIPOpen, setIsReleaseFloatingIPOpen] = useState(false);
  const [isReleaseFloatingIPsOpen, setIsReleaseFloatingIPsOpen] = useState(false);
  const [isDeleteLoadBalancerAdminOpen, setIsDeleteLoadBalancerAdminOpen] = useState(false);
  const [isDeleteLoadBalancersAdminOpen, setIsDeleteLoadBalancersAdminOpen] = useState(false);
  const [isDeleteListenerOpen, setIsDeleteListenerOpen] = useState(false);
  const [isDeleteListenersOpen, setIsDeleteListenersOpen] = useState(false);
  const [isDeletePoolOpen, setIsDeletePoolOpen] = useState(false);
  const [isDeletePoolsOpen, setIsDeletePoolsOpen] = useState(false);
  const [isDeleteMemberOpen, setIsDeleteMemberOpen] = useState(false);
  const [isDeleteMembersOpen, setIsDeleteMembersOpen] = useState(false);
  const [isDeleteSecurityGroupRuleOpen, setIsDeleteSecurityGroupRuleOpen] = useState(false);
  const [isDeleteSecurityGroupRulesOpen, setIsDeleteSecurityGroupRulesOpen] = useState(false);
  const [isDeleteL7PolicyOpen, setIsDeleteL7PolicyOpen] = useState(false);
  const [isDeleteL7PoliciesOpen, setIsDeleteL7PoliciesOpen] = useState(false);
  const [isDeleteHealthMonitorOpen, setIsDeleteHealthMonitorOpen] = useState(false);
  const [isDeleteFirewallPolicyOpen, setIsDeleteFirewallPolicyOpen] = useState(false);
  const [isDeleteFirewallPoliciesOpen, setIsDeleteFirewallPoliciesOpen] = useState(false);
  const [isDeleteFirewallRuleOpen, setIsDeleteFirewallRuleOpen] = useState(false);
  const [isDeleteFirewallRulesOpen, setIsDeleteFirewallRulesOpen] = useState(false);
  const [isDeleteTenantOpen, setIsDeleteTenantOpen] = useState(false);
  const [isDeleteTenantsOpen, setIsDeleteTenantsOpen] = useState(false);
  const [isDeleteMetadataOpen, setIsDeleteMetadataOpen] = useState(false);
  const [isDeleteMetadatasOpen, setIsDeleteMetadatasOpen] = useState(false);
  const [isManageMemberOpen, setIsManageMemberOpen] = useState(false);

  // Disclosure states
  const [isComputeOpen, setIsComputeOpen] = useState(false);
  const [isIAMOpen, setIsIAMOpen] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isComputeAdminOpen, setIsComputeAdminOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'}`}
      >
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
                items={[{ label: 'Design system', href: '/design-system' }, { label: 'Modals' }]}
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
                  Modal components
                </h1>
                <p className="text-[14px] text-[var(--color-text-subtle)]">
                  Collection of modal components used across the application. Click to preview each
                  modal.
                </p>
              </VStack>

              {/* Modal Categories by App */}
              <VStack gap={4}>
                {/* Compute App Modals */}
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
                          Compute
                        </Badge>
                        <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Modals
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          (16 modals)
                        </span>
                      </div>
                    </div>
                  </Disclosure.Trigger>
                  <Disclosure.Panel>
                    <VStack gap={4} className="pt-4">
                      {/* Delete Modals */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Delete Modals
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Snapshot"
                            description="Confirm deletion of a snapshot with warning about permanent action."
                            category="Confirm"
                            size="sm"
                            onOpen={() => setIsConfirmDeleteOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Security group"
                            description="Confirm deletion of a single security group with warning."
                            category="Confirm"
                            size="sm"
                            onOpen={() => setIsDeleteSecurityGroupOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Security groups (Multiple)"
                            description="Confirm deletion of multiple security groups with scrollable list."
                            category="Confirm"
                            size="md"
                            onOpen={() => setIsDeleteSecurityGroupsMultipleOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Rule"
                            description="Confirm deletion of a single security group rule."
                            category="Confirm"
                            size="sm"
                            onOpen={() => setIsDeleteRuleOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Rules (Multiple)"
                            description="Confirm deletion of multiple rules with scrollable list and warning."
                            category="Confirm"
                            size="md"
                            onOpen={() => setIsDeleteRulesMultipleOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Volume Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Volume Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Detach volume"
                            description="Confirm detachment of a volume with warning about data corruption."
                            category="Volume"
                            size="sm"
                            onOpen={() => setIsDetachVolumeOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Backup Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Backup Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Restore backup"
                            description="Simple restore backup confirmation with volume info."
                            category="Backup"
                            size="sm"
                            onOpen={() => setIsRestoreBackupSmallOpen(true)}
                          />
                          <ModalListItem
                            title="Restore backup (with instance name)"
                            description="Restore backup with volume and instance list information."
                            category="Backup"
                            size="md"
                            onOpen={() => setIsRestoreBackupMediumOpen(true)}
                          />
                          <ModalListItem
                            title="Restore backup (with instance name and warning)"
                            description="Restore backup with warning alert and disabled action button."
                            category="Backup"
                            size="lg"
                            onOpen={() => setIsRestoreBackupLargeOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Floating IP */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Floating IP
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Disassociate floating IP"
                            description="Confirm disassociation of a floating IP from a resource."
                            category="Network"
                            size="sm"
                            onOpen={() => setIsDisassociateFloatingIPOpen(true)}
                          />
                          <ModalListItem
                            title="Disassociate floating IP (Load balancer)"
                            description="Disassociate a floating IP from a load balancer."
                            category="Network"
                            size="sm"
                            onOpen={() => setIsDisassociateFloatingIPLBOpen(true)}
                          />
                          <ModalListItem
                            title="Release floating IP"
                            description="Release a single floating IP with warning about permanent action."
                            category="Network"
                            size="sm"
                            onOpen={() => setIsReleaseFloatingIPSmallOpen(true)}
                          />
                          <ModalListItem
                            title="Release floating IP (Associated to)"
                            description="Release multiple floating IPs with scrollable list."
                            category="Network"
                            size="md"
                            onOpen={() => setIsReleaseFloatingIPMediumOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Load balancers */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Load balancers
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Load balancer"
                            description="Delete a single load balancer with warning about associated resources."
                            category="Network"
                            size="sm"
                            onOpen={() => setIsDeleteLoadBalancerOpen(true)}
                          />
                          <ModalListItem
                            title="Release Load balancers"
                            description="Delete multiple load balancers with scrollable list and warning."
                            category="Network"
                            size="md"
                            onOpen={() => setIsDeleteLoadBalancersMultipleOpen(true)}
                          />
                        </div>
                      </VStack>
                    </VStack>
                  </Disclosure.Panel>
                </Disclosure>

                {/* IAM App Modals */}
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
                          IAM
                        </Badge>
                        <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Modals
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          (29 modals)
                        </span>
                      </div>
                    </div>
                  </Disclosure.Trigger>
                  <Disclosure.Panel>
                    <VStack gap={4} className="pt-4">
                      {/* User Management Modals */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          User Management
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete user"
                            description="Confirm deletion of a user with warning about permanent action."
                            category="User"
                            size="sm"
                            onOpen={() => setIsDeleteUserOpen(true)}
                          />
                          <ModalListItem
                            title="Delete users (Multiple)"
                            description="Delete multiple users with lists of deletable and non-deletable users."
                            category="User"
                            size="md"
                            onOpen={() => setIsDeleteUsersMultipleOpen(true)}
                          />
                          <ModalListItem
                            title="Confirm user password"
                            description="Display username and password credentials with copy functionality."
                            category="User"
                            size="sm"
                            onOpen={() => setIsConfirmUserPasswordOpen(true)}
                          />
                          <ModalListItem
                            title="Detach user group"
                            description="Confirm detaching a user from a user group with warning about permission removal."
                            category="User"
                            size="sm"
                            onOpen={() => setIsDetachUserGroupOpen(true)}
                          />
                          <ModalListItem
                            title="Detach role"
                            description="Confirm detaching a role from a user with warning about permission removal."
                            category="User"
                            size="sm"
                            onOpen={() => setIsDetachRoleOpen(true)}
                          />
                          <ModalListItem
                            title="Remove OTP MFA"
                            description="Confirm removing OTP MFA for a user with warning about re-registration."
                            category="User"
                            size="sm"
                            onOpen={() => setIsRemoveOtpMfaOpen(true)}
                          />
                          <ModalListItem
                            title="Terminate all sessions"
                            description="Confirm terminating all sessions for a user with warning about sign-out."
                            category="User"
                            size="sm"
                            onOpen={() => setIsTerminateAllSessionsOpen(true)}
                          />
                          <ModalListItem
                            title="Terminate session"
                            description="Confirm terminating a single session with warning about sign-out from device."
                            category="User"
                            size="sm"
                            onOpen={() => setIsTerminateSessionOpen(true)}
                          />
                          <ModalListItem
                            title="Remove user from group"
                            description="Confirm removing a user from a group with warning about permission removal."
                            category="User"
                            size="sm"
                            onOpen={() => setIsRemoveUserFromGroupOpen(true)}
                          />
                          <ModalListItem
                            title="Delete role"
                            description="Confirm deleting a role with warning about permission removal."
                            category="Role"
                            size="sm"
                            onOpen={() => setIsDeleteRoleOpen(true)}
                          />
                          <ModalListItem
                            title="Delete roles (Multiple)"
                            description="Confirm deleting multiple roles with lists of deletable and non-deletable roles."
                            category="Role"
                            size="md"
                            onOpen={() => setIsDeleteRolesMultipleOpen(true)}
                          />
                          <ModalListItem
                            title="Detach policy"
                            description="Confirm detaching a policy from a role with warning about permission revocation."
                            category="Role"
                            size="sm"
                            onOpen={() => setIsDetachPolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Delete policy"
                            description="Confirm deleting a policy with warning about permanent removal and access loss."
                            category="Policy"
                            size="sm"
                            onOpen={() => setIsDeletePolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Delete policies (Multiple)"
                            description="Confirm deleting multiple policies with lists of deletable/non-deletable policies."
                            category="Policy"
                            size="md"
                            onOpen={() => setIsDeletePoliciesMultipleOpen(true)}
                          />
                          <ModalListItem
                            title="Revert policy version"
                            description="Confirm reverting a policy to a previous version with warning about permission changes."
                            category="Policy"
                            size="sm"
                            onOpen={() => setIsRevertPolicyVersionOpen(true)}
                          />
                          <ModalListItem
                            title="Delete policy version"
                            description="Confirm deleting a specific policy version with warning about permanent removal."
                            category="Policy"
                            size="sm"
                            onOpen={() => setIsDeletePolicyVersionOpen(true)}
                          />
                          <ModalListItem
                            title="Update MFA enforcement policy"
                            description="Confirm applying MFA enforcement policy changes with warning about authentication impact."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdateMfaEnforcementOpen(true)}
                          />
                          <ModalListItem
                            title="Update OTP policy"
                            description="Confirm applying OTP policy changes with warning about MFA method availability."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdateOtpPolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Update OTP policy settings"
                            description="Confirm applying OTP policy settings changes without warning alert."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdateOtpPolicySettingsOpen(true)}
                          />
                          <ModalListItem
                            title="Update email policy"
                            description="Confirm applying email policy changes with warning about MFA method availability."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdateEmailPolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Update email policy settings"
                            description="Confirm applying email policy settings changes without warning alert."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdateEmailPolicySettingsOpen(true)}
                          />
                          <ModalListItem
                            title="Update general session policy"
                            description="Confirm applying session policy changes for timeout and lifespan settings."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdateGeneralSessionPolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Delete domain"
                            description="Permanently delete a domain and all its configurations."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsDeleteDomainOpen(true)}
                          />
                          <ModalListItem
                            title="Switch to domain"
                            description="Confirm switching to a different domain with unsaved changes warning."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsSwitchToDomainOpen(true)}
                          />
                          <ModalListItem
                            title="Delete system administrator"
                            description="Permanently delete a system administrator and their global access."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsDeleteSystemAdminOpen(true)}
                          />
                          <ModalListItem
                            title="Update password policy"
                            description="Confirm applying password policy changes for length, requirements, and expiration."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdatePasswordPolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Update account lockout policy"
                            description="Confirm applying account lockout policy changes for lockout type settings."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdateAccountLockoutPolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Update token policy"
                            description="Confirm applying token policy changes for access and refresh token lifespan."
                            category="Security"
                            size="sm"
                            onOpen={() => setIsUpdateTokenPolicyOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* General Modals */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          General
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Unsaved changes"
                            description="Confirm leaving page with unsaved changes."
                            category="Navigation"
                            size="sm"
                            onOpen={() => setIsUnsavedChangesOpen(true)}
                          />
                        </div>
                      </VStack>
                    </VStack>
                  </Disclosure.Panel>
                </Disclosure>

                {/* Container App Modals - Placeholder for future */}
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
                          Container
                        </Badge>
                        <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Modals
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          (12 modals)
                        </span>
                      </div>
                    </div>
                  </Disclosure.Trigger>
                  <Disclosure.Panel>
                    <VStack gap={4} className="pt-4">
                      {/* Cluster Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Cluster Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Cluster"
                            description="Confirm deletion of a Kubernetes cluster."
                            category="Cluster"
                            size="sm"
                            onOpen={() => setIsDeleteClusterOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Namespace"
                            description="Confirm deletion of a Kubernetes namespace."
                            category="Namespace"
                            size="sm"
                            onOpen={() => setIsDeleteNamespaceOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Workload Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Workload Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Pod"
                            description="Confirm deletion of a Kubernetes pod."
                            category="Pod"
                            size="sm"
                            onOpen={() => setIsDeletePodOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Deployment"
                            description="Confirm deletion of a Kubernetes deployment."
                            category="Deployment"
                            size="sm"
                            onOpen={() => setIsDeleteDeploymentOpen(true)}
                          />
                          <ModalListItem
                            title="Redeploy Deployment"
                            description="Redeploy a Kubernetes deployment with warning about downtime."
                            category="Deployment"
                            size="sm"
                            onOpen={() => setIsRedeployDeploymentOpen(true)}
                          />
                          <ModalListItem
                            title="Roll Back Deployment"
                            description="Roll back a Kubernetes deployment to a previous revision."
                            category="Deployment"
                            size="sm"
                            onOpen={() => setIsRollBackDeploymentOpen(true)}
                          />
                          <ModalListItem
                            title="Delete StatefulSet"
                            description="Confirm deletion of a Kubernetes stateful set."
                            category="StatefulSet"
                            size="sm"
                            onOpen={() => setIsDeleteStatefulSetOpen(true)}
                          />
                          <ModalListItem
                            title="Redeploy StatefulSet"
                            description="Redeploy a Kubernetes stateful set with warning about downtime."
                            category="StatefulSet"
                            size="sm"
                            onOpen={() => setIsRedeployStatefulSetOpen(true)}
                          />
                          <ModalListItem
                            title="Delete DaemonSet"
                            description="Confirm deletion of a Kubernetes daemon set."
                            category="DaemonSet"
                            size="sm"
                            onOpen={() => setIsDeleteDaemonSetOpen(true)}
                          />
                          <ModalListItem
                            title="Redeploy DaemonSet"
                            description="Redeploy a Kubernetes daemon set with warning about downtime."
                            category="DaemonSet"
                            size="sm"
                            onOpen={() => setIsRedeployDaemonSetOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Job"
                            description="Confirm deletion of a Kubernetes job."
                            category="Job"
                            size="sm"
                            onOpen={() => setIsDeleteJobOpen(true)}
                          />
                          <ModalListItem
                            title="Delete CronJob"
                            description="Confirm deletion of a Kubernetes cron job."
                            category="CronJob"
                            size="sm"
                            onOpen={() => setIsDeleteCronJobOpen(true)}
                          />
                        </div>
                      </VStack>
                    </VStack>
                  </Disclosure.Panel>
                </Disclosure>

                {/* Storage App Modals */}
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
                          Storage
                        </Badge>
                        <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Modals
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          (1 modal)
                        </span>
                      </div>
                    </div>
                  </Disclosure.Trigger>
                  <Disclosure.Panel>
                    <VStack gap={4} className="pt-4">
                      {/* Delete Modals */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Delete Modals
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Bucket"
                            description="Confirm deletion of a non-empty bucket with warning about permanent data loss."
                            category="Bucket"
                            size="sm"
                            onOpen={() => setIsDeleteBucketOpen(true)}
                          />
                        </div>
                      </VStack>
                    </VStack>
                  </Disclosure.Panel>
                </Disclosure>

                {/* Compute Admin Modals */}
                <Disclosure open={isComputeAdminOpen} onChange={setIsComputeAdminOpen}>
                  <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                    <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                      <div className="flex items-center gap-3">
                        {isComputeAdminOpen ? (
                          <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
                        ) : (
                          <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
                        )}
                        <Badge variant="info" size="sm" className="w-[100px] justify-center">
                          Compute Admin
                        </Badge>
                        <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Modals
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          (71 modals)
                        </span>
                      </div>
                    </div>
                  </Disclosure.Trigger>
                  <Disclosure.Panel>
                    <VStack gap={4} className="pt-4">
                      {/* Single Instance Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Single Instance Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Stop Instance"
                            description="Stop a single instance with warning about service interruption."
                            category="Instance"
                            size="sm"
                            onOpen={() => setIsStopInstanceOpen(true)}
                          />
                          <ModalListItem
                            title="Reboot Instance"
                            description="Reboot a single instance with warning about service interruption."
                            category="Instance"
                            size="sm"
                            onOpen={() => setIsRebootInstanceOpen(true)}
                          />
                          <ModalListItem
                            title="Soft Reboot Instance"
                            description="Perform a soft reboot of a single instance."
                            category="Instance"
                            size="sm"
                            onOpen={() => setIsSoftRebootInstanceOpen(true)}
                          />
                          <ModalListItem
                            title="Confirm Resize"
                            description="Confirm the resized state of an instance."
                            category="Instance"
                            size="sm"
                            onOpen={() => setIsConfirmResizeOpen(true)}
                          />
                          <ModalListItem
                            title="Revert Resize"
                            description="Revert an instance to its previous state before resize."
                            category="Instance"
                            size="sm"
                            onOpen={() => setIsRevertResizeOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Instance"
                            description="Permanently delete a single instance."
                            category="Instance"
                            size="sm"
                            onOpen={() => setIsDeleteInstanceOpen(true)}
                          />
                          <ModalListItem
                            title="Shelve Instance"
                            description="Shelve a single instance with warning about service interruption."
                            category="Instance"
                            size="sm"
                            onOpen={() => setIsShelveInstanceOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Multiple Instances Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Multiple Instances Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Start Instances"
                            description="Start multiple selected instances with eligibility check."
                            category="Instances"
                            size="md"
                            onOpen={() => setIsStartInstancesOpen(true)}
                          />
                          <ModalListItem
                            title="Stop Instances"
                            description="Stop multiple selected instances with eligibility check."
                            category="Instances"
                            size="md"
                            onOpen={() => setIsStopInstancesOpen(true)}
                          />
                          <ModalListItem
                            title="Reboot Instances"
                            description="Reboot multiple selected instances with eligibility check."
                            category="Instances"
                            size="md"
                            onOpen={() => setIsRebootInstancesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Instances"
                            description="Permanently delete multiple selected instances with eligibility check."
                            category="Instances"
                            size="md"
                            onOpen={() => setIsDeleteInstancesOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Resource Delete Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Resource Delete Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Instance Template"
                            description="Permanently delete a single instance template."
                            category="Template"
                            size="sm"
                            onOpen={() => setIsDeleteInstanceTemplateOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Instance Templates"
                            description="Permanently delete multiple instance templates."
                            category="Templates"
                            size="md"
                            onOpen={() => setIsDeleteInstanceTemplatesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Image"
                            description="Permanently delete a single image."
                            category="Image"
                            size="sm"
                            onOpen={() => setIsDeleteImageOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Images"
                            description="Permanently delete multiple images with eligibility check."
                            category="Images"
                            size="md"
                            onOpen={() => setIsDeleteImagesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Snapshot"
                            description="Permanently delete a single snapshot."
                            category="Snapshot"
                            size="sm"
                            onOpen={() => setIsDeleteSnapshotOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Snapshots"
                            description="Permanently delete multiple snapshots with eligibility check."
                            category="Snapshots"
                            size="md"
                            onOpen={() => setIsDeleteSnapshotsOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Storage Delete Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Storage Delete Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Volume"
                            description="Permanently delete a single volume."
                            category="Volume"
                            size="sm"
                            onOpen={() => setIsDeleteVolumeOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Volumes"
                            description="Permanently delete multiple volumes with eligibility check."
                            category="Volumes"
                            size="md"
                            onOpen={() => setIsDeleteVolumesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Volume Type"
                            description="Permanently delete a single volume type."
                            category="VolumeType"
                            size="sm"
                            onOpen={() => setIsDeleteVolumeTypeOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Volume Types"
                            description="Permanently delete multiple volume types."
                            category="VolumeTypes"
                            size="sm"
                            onOpen={() => setIsDeleteVolumeTypesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Backup"
                            description="Permanently delete a single backup."
                            category="Backup"
                            size="sm"
                            onOpen={() => setIsDeleteBackupOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Backups"
                            description="Permanently delete multiple backups with eligibility check."
                            category="Backups"
                            size="md"
                            onOpen={() => setIsDeleteBackupsOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Encryption"
                            description="Remove encryption configuration from a volume type."
                            category="Encryption"
                            size="sm"
                            onOpen={() => setIsDeleteEncryptionOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Extra Spec"
                            description="Remove extra specification from a volume type."
                            category="ExtraSpec"
                            size="sm"
                            onOpen={() => setIsDeleteExtraSpecOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Extra Specs"
                            description="Remove multiple extra specifications from a volume type."
                            category="ExtraSpecs"
                            size="sm"
                            onOpen={() => setIsDeleteExtraSpecsOpen(true)}
                          />
                          <ModalListItem
                            title="Delete QoS Spec"
                            description="Permanently delete a single QoS specification."
                            category="QoSSpec"
                            size="sm"
                            onOpen={() => setIsDeleteQoSSpecOpen(true)}
                          />
                          <ModalListItem
                            title="Delete QoS Specs"
                            description="Permanently delete multiple QoS specifications."
                            category="QoSSpecs"
                            size="sm"
                            onOpen={() => setIsDeleteQoSSpecsOpen(true)}
                          />
                          <ModalListItem
                            title="Delete QoS Extra Spec"
                            description="Remove extra specification from a QoS spec."
                            category="QoSExtra"
                            size="sm"
                            onOpen={() => setIsDeleteQoSExtraSpecOpen(true)}
                          />
                          <ModalListItem
                            title="Delete QoS Extra Specs"
                            description="Remove multiple extra specifications from a QoS spec."
                            category="QoSExtras"
                            size="sm"
                            onOpen={() => setIsDeleteQoSExtraSpecsOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Network Delete Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Network Delete Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Network"
                            description="Permanently delete a single network with warning."
                            category="Network"
                            size="sm"
                            onOpen={() => setIsDeleteNetworkOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Networks"
                            description="Permanently delete multiple networks with eligibility check."
                            category="Networks"
                            size="md"
                            onOpen={() => setIsDeleteNetworksOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Subnet"
                            description="Permanently delete a single subnet with warning."
                            category="Subnet"
                            size="sm"
                            onOpen={() => setIsDeleteSubnetOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Subnets"
                            description="Permanently delete multiple subnets."
                            category="Subnets"
                            size="sm"
                            onOpen={() => setIsDeleteSubnetsOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Port"
                            description="Permanently delete a single port with warning."
                            category="Port"
                            size="sm"
                            onOpen={() => setIsDeletePortOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Ports"
                            description="Permanently delete multiple ports with warning."
                            category="Ports"
                            size="sm"
                            onOpen={() => setIsDeletePortsOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Router"
                            description="Permanently delete a single router with warning."
                            category="Router"
                            size="sm"
                            onOpen={() => setIsDeleteRouterOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Routers"
                            description="Permanently delete multiple routers with eligibility check."
                            category="Routers"
                            size="md"
                            onOpen={() => setIsDeleteRoutersOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Static Routes"
                            description="Permanently delete multiple static routes."
                            category="Routes"
                            size="sm"
                            onOpen={() => setIsDeleteStaticRoutesOpen(true)}
                          />
                          <ModalListItem
                            title="Remove DHCP Agents"
                            description="Remove DHCP agents from a network."
                            category="DHCP"
                            size="sm"
                            onOpen={() => setIsRemoveDHCPAgentsOpen(true)}
                          />
                          <ModalListItem
                            title="Release Fixed IP"
                            description="Release a fixed IP address from a port."
                            category="IP"
                            size="sm"
                            onOpen={() => setIsReleaseFixedIPOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Allowed Address Pair"
                            description="Remove an allowed address pair from a port."
                            category="Address"
                            size="sm"
                            onOpen={() => setIsDeleteAllowedAddressPairOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Security Group"
                            description="Permanently delete a single security group."
                            category="SecGroup"
                            size="sm"
                            onOpen={() => setIsDeleteSecurityGroupAdminOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Security Groups"
                            description="Permanently delete multiple security groups."
                            category="SecGroups"
                            size="md"
                            onOpen={() => setIsDeleteSecurityGroupsAdminOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Firewall"
                            description="Permanently delete a single firewall."
                            category="Firewall"
                            size="sm"
                            onOpen={() => setIsDeleteFirewallOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Firewalls"
                            description="Permanently delete multiple firewalls."
                            category="Firewalls"
                            size="md"
                            onOpen={() => setIsDeleteFirewallsOpen(true)}
                          />
                          <ModalListItem
                            title="Unsaved Changes"
                            description="Confirm leaving with unsaved changes."
                            category="Confirm"
                            size="sm"
                            onOpen={() => setIsUnsavedChangesAdminOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Load Balancer & Security Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Load Balancer & Security Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Disassociate Floating IP"
                            description="Disassociate a floating IP from a resource."
                            category="FloatingIP"
                            size="sm"
                            onOpen={() => setIsDisassociateFloatingIPOpen(true)}
                          />
                          <ModalListItem
                            title="Release Floating IP"
                            description="Release a single floating IP address."
                            category="FloatingIP"
                            size="sm"
                            onOpen={() => setIsReleaseFloatingIPOpen(true)}
                          />
                          <ModalListItem
                            title="Release Floating IPs"
                            description="Release multiple floating IP addresses."
                            category="FloatingIPs"
                            size="sm"
                            onOpen={() => setIsReleaseFloatingIPsOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Load Balancer"
                            description="Permanently delete a single load balancer."
                            category="LB"
                            size="sm"
                            onOpen={() => setIsDeleteLoadBalancerAdminOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Load Balancers"
                            description="Permanently delete multiple load balancers."
                            category="LBs"
                            size="md"
                            onOpen={() => setIsDeleteLoadBalancersAdminOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Listener"
                            description="Permanently delete a single listener."
                            category="Listener"
                            size="sm"
                            onOpen={() => setIsDeleteListenerOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Listeners"
                            description="Permanently delete multiple listeners."
                            category="Listeners"
                            size="md"
                            onOpen={() => setIsDeleteListenersOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Pool"
                            description="Permanently delete a single pool."
                            category="Pool"
                            size="sm"
                            onOpen={() => setIsDeletePoolOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Pools"
                            description="Permanently delete multiple pools."
                            category="Pools"
                            size="md"
                            onOpen={() => setIsDeletePoolsOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Member"
                            description="Remove a single member from a pool."
                            category="Member"
                            size="sm"
                            onOpen={() => setIsDeleteMemberOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Members"
                            description="Remove multiple members from a pool."
                            category="Members"
                            size="md"
                            onOpen={() => setIsDeleteMembersOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Security Group Rule"
                            description="Permanently delete a single security group rule."
                            category="Rule"
                            size="sm"
                            onOpen={() => setIsDeleteSecurityGroupRuleOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Security Group Rules"
                            description="Permanently delete multiple security group rules."
                            category="Rules"
                            size="md"
                            onOpen={() => setIsDeleteSecurityGroupRulesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete L7 Policy"
                            description="Permanently delete a single L7 policy."
                            category="L7Policy"
                            size="sm"
                            onOpen={() => setIsDeleteL7PolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Delete L7 Policies"
                            description="Permanently delete multiple L7 policies."
                            category="L7Policies"
                            size="md"
                            onOpen={() => setIsDeleteL7PoliciesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Health Monitor"
                            description="Permanently delete a health monitor from a pool."
                            category="Monitor"
                            size="sm"
                            onOpen={() => setIsDeleteHealthMonitorOpen(true)}
                          />
                        </div>
                      </VStack>

                      {/* Firewall & Tenant Actions */}
                      <VStack gap={2}>
                        <h2 className="text-[14px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                          Firewall & Tenant Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                          <ModalListItem
                            title="Delete Firewall Policy"
                            description="Permanently delete a single firewall policy."
                            category="FWPolicy"
                            size="sm"
                            onOpen={() => setIsDeleteFirewallPolicyOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Firewall Policies"
                            description="Permanently delete multiple firewall policies."
                            category="FWPolicies"
                            size="md"
                            onOpen={() => setIsDeleteFirewallPoliciesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Firewall Rule"
                            description="Permanently delete a single firewall rule."
                            category="FWRule"
                            size="sm"
                            onOpen={() => setIsDeleteFirewallRuleOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Firewall Rules"
                            description="Permanently delete multiple firewall rules."
                            category="FWRules"
                            size="md"
                            onOpen={() => setIsDeleteFirewallRulesOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Tenant"
                            description="Permanently delete a single tenant."
                            category="Tenant"
                            size="sm"
                            onOpen={() => setIsDeleteTenantOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Tenants"
                            description="Permanently delete multiple tenants."
                            category="Tenants"
                            size="sm"
                            onOpen={() => setIsDeleteTenantsOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Metadata"
                            description="Remove a single metadata entry."
                            category="Metadata"
                            size="sm"
                            onOpen={() => setIsDeleteMetadataOpen(true)}
                          />
                          <ModalListItem
                            title="Delete Metadatas"
                            description="Remove multiple metadata entries."
                            category="Metadatas"
                            size="md"
                            onOpen={() => setIsDeleteMetadatasOpen(true)}
                          />
                          <ModalListItem
                            title="Manage Member"
                            description="Redirect to IAM to manage users and groups."
                            category="IAM"
                            size="sm"
                            onOpen={() => setIsManageMemberOpen(true)}
                          />
                        </div>
                      </VStack>
                    </VStack>
                  </Disclosure.Panel>
                </Disclosure>
              </VStack>
            </VStack>
          </div>
        </div>
      </main>

      {/* Modal components */}

      {/* Delete Snapshot Modal */}
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="Delete Snapshot"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Snapshot Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Snapshot name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">2cdfafc1</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting a snapshot is a permanent action and cannot be undone. Any volumes or
              instances created from this snapshot will not be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsConfirmDeleteOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Snapshot deleted');
              setIsConfirmDeleteOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Security group Modal (Single) */}
      <Modal
        isOpen={isDeleteSecurityGroupOpen}
        onClose={() => setIsDeleteSecurityGroupOpen(false)}
        title="Delete Security group"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Security group Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Security group
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">sg-01</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security group and all its rules.
              <br />
              If this group is attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSecurityGroupOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security group deleted');
              setIsDeleteSecurityGroupOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Security groups Modal (Multiple) */}
      <Modal
        isOpen={isDeleteSecurityGroupsMultipleOpen}
        onClose={() => setIsDeleteSecurityGroupsMultipleOpen(false)}
        title="Delete Security groups"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Security groups Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Security groups(10)
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>sg-01</li>
              <li>sg-02</li>
              <li>sg-03</li>
              <li>sg-04</li>
              <li>sg-05</li>
              <li>sg-06</li>
              <li>sg-07</li>
              <li>sg-08</li>
              <li>sg-09</li>
              <li>sg-10</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security groups and all its rules.
              <br />
              If these groups are attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSecurityGroupsMultipleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security groups deleted');
              setIsDeleteSecurityGroupsMultipleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Rule Modal (Single) */}
      <Modal
        isOpen={isDeleteRuleOpen}
        onClose={() => setIsDeleteRuleOpen(false)}
        title="Delete Rule"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Rule Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Rule
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              Ingress TCP 80 from 0.0.0.0/0
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteRuleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Rule deleted');
              setIsDeleteRuleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Rules Modal (Multiple with Warning) */}
      <Modal
        isOpen={isDeleteRulesMultipleOpen}
        onClose={() => setIsDeleteRulesMultipleOpen(false)}
        title="Delete Rules"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Rules Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Rules(10)
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Ingress TCP 80 from 0.0.0.0/0</li>
              <li>Ingress TCP 443 from 0.0.0.0/0</li>
              <li>Ingress TCP 22 from 10.0.0.0/8</li>
              <li>Egress TCP 80 to 0.0.0.0/0</li>
              <li>Egress TCP 443 to 0.0.0.0/0</li>
              <li>Ingress UDP 53 from 0.0.0.0/0</li>
              <li>Egress UDP 53 to 0.0.0.0/0</li>
              <li>Ingress ICMP from 0.0.0.0/0</li>
              <li>Egress ICMP to 0.0.0.0/0</li>
              <li>Ingress TCP 3306 from 10.0.0.0/8</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the selected rules.
              <br />
              If these rules are attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteRulesMultipleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Rules deleted');
              setIsDeleteRulesMultipleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Detach volume Modal */}
      <Modal
        isOpen={isDetachVolumeOpen}
        onClose={() => setIsDetachVolumeOpen(false)}
        title="Detach volume"
        description="This action detaches the volume."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">vol57</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Make sure the filesystem inside the instance is unmounted before detaching. Detaching
              a volume while the instance is running may cause data corruption.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDetachVolumeOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Volume detached');
              setIsDetachVolumeOpen(false);
            }}
            className="flex-1"
          >
            Release
          </Button>
        </div>
      </Modal>

      {/* Restore backup (Small) Modal */}
      <Modal
        isOpen={isRestoreBackupSmallOpen}
        onClose={() => setIsRestoreBackupSmallOpen(false)}
        title="Restore backup"
        description="This action restores the backup."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRestoreBackupSmallOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Backup restored');
              setIsRestoreBackupSmallOpen(false);
            }}
            className="flex-1"
          >
            Restore
          </Button>
        </div>
      </Modal>

      {/* Restore backup (Medium) Modal */}
      <Modal
        isOpen={isRestoreBackupMediumOpen}
        onClose={() => setIsRestoreBackupMediumOpen(false)}
        title="Restore backup"
        description="This action restores the backup."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>

          {/* Instance Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance name
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-1 (Shutoff)</li>
              <li>dev-team (Shutoff)</li>
              <li>AI-training-02 (Shutoff)</li>
              <li>web-server-1 (Shutoff)</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRestoreBackupMediumOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Backup restored');
              setIsRestoreBackupMediumOpen(false);
            }}
            className="flex-1"
          >
            Restore
          </Button>
        </div>
      </Modal>

      {/* Restore backup (Large) Modal */}
      <Modal
        isOpen={isRestoreBackupLargeOpen}
        onClose={() => setIsRestoreBackupLargeOpen(false)}
        title="Restore backup"
        description="This action restores the backup."
        size="lg"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>

          {/* Instance Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance name
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-1 (Shutoff)</li>
              <li>dev-team (Shutoff)</li>
              <li>AI-training-02 (Shutoff)</li>
              <li>web-server-1 (Shutoff)</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Restore cannot proceed. Change the backup status to Available or shut down the
              attached instance.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRestoreBackupLargeOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button variant="primary" size="md" disabled className="flex-1">
            Restore
          </Button>
        </div>
      </Modal>

      {/* Disassociate floating IP Modal */}
      <Modal
        isOpen={isDisassociateFloatingIPOpen}
        onClose={() => setIsDisassociateFloatingIPOpen(false)}
        title="Disassociate floating IP"
        description="Disassociating will detach the floating IP from the selected resource. External access via this IP will stop immediately. The IP will remain in your project and can be re-associated later."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Floating IP
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              123.45.67.8
            </span>
          </div>

          {/* Associated to Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Associated to
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Type : Instance</li>
              <li>Name : server-01</li>
              <li>Fixed IP : 10.0.0.10</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDisassociateFloatingIPOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Disassociate floating IP confirmed');
              setIsDisassociateFloatingIPOpen(false);
            }}
            className="flex-1"
          >
            Disassociate
          </Button>
        </div>
      </Modal>

      {/* Disassociate floating IP (Load balancer) Modal */}
      <Modal
        isOpen={isDisassociateFloatingIPLBOpen}
        onClose={() => setIsDisassociateFloatingIPLBOpen(false)}
        title="Disassociate floating IP"
        description="Disassociating will detach the floating IP from this load balancer. External access to the load balancer will be interrupted."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Load balancer Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load balancer
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-lb-01(10.0.0.10)
            </span>
          </div>

          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Floating IP
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              123.45.67.8
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDisassociateFloatingIPLBOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Disassociate floating IP from load balancer confirmed');
              setIsDisassociateFloatingIPLBOpen(false);
            }}
            className="flex-1"
          >
            Disassociate
          </Button>
        </div>
      </Modal>

      {/* Release floating IP (Small) Modal */}
      <Modal
        isOpen={isReleaseFloatingIPSmallOpen}
        onClose={() => setIsReleaseFloatingIPSmallOpen(false)}
        title="Release floating IP"
        description="This action releases the floating IP."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Floating IP
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              123.45.67.8
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing will detach this IP from its target and remove it from your project.
              External access via this IP will stop immediately.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReleaseFloatingIPSmallOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Release floating IP confirmed');
              setIsReleaseFloatingIPSmallOpen(false);
            }}
            className="flex-1"
          >
            Release
          </Button>
        </div>
      </Modal>

      {/* Release floating IP (Medium) Modal */}
      <Modal
        isOpen={isReleaseFloatingIPMediumOpen}
        onClose={() => setIsReleaseFloatingIPMediumOpen(false)}
        title="Release floating IP"
        description="This action releases the floating IP."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Associated to Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Associated to
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>123.45.67.8</li>
              <li>123.45.67.2</li>
              <li>123.45.67.4</li>
              <li>123.45.67.7</li>
              <li>123.45.67.1</li>
              <li>123.45.67.2</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing will detach these IPs from their target and remove them from your project.
              External access via these IP will stop immediately.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReleaseFloatingIPMediumOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Disassociate floating IPs confirmed');
              setIsReleaseFloatingIPMediumOpen(false);
            }}
            className="flex-1"
          >
            Disassociate
          </Button>
        </div>
      </Modal>

      {/* Delete Load balancer Modal (Single) */}
      <Modal
        isOpen={isDeleteLoadBalancerOpen}
        onClose={() => setIsDeleteLoadBalancerOpen(false)}
        title="Delete Load balancer"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Load balancer Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load balancer
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-lb-01
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              All listeners, pools, and members associated with it will be removed.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteLoadBalancerOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Load balancer deleted');
              setIsDeleteLoadBalancerOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Release Load balancers Modal (Multiple) */}
      <Modal
        isOpen={isDeleteLoadBalancersMultipleOpen}
        onClose={() => setIsDeleteLoadBalancersMultipleOpen(false)}
        title="Release Load balancers"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Load balancers Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load balancers
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-lb-01</li>
              <li>web-lb-02</li>
              <li>web-lb-03</li>
              <li>web-lb-04</li>
              <li>web-lb-05</li>
              <li>web-lb-06</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              All listeners, pools, and members associated with them will be removed.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteLoadBalancersMultipleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Load balancers deleted');
              setIsDeleteLoadBalancersMultipleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* ========================================
          IAM MODALS
          ======================================== */}

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteUserOpen}
        onClose={() => setIsDeleteUserOpen(false)}
        title="Delete user"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              User
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DISPLAY NAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this user will permanently remove all associated access and sessions. This
              action cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteUserOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('User deleted');
              setIsDeleteUserOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Users (Multiple) Modal */}
      <Modal
        isOpen={isDeleteUsersMultipleOpen}
        onClose={() => setIsDeleteUsersMultipleOpen(false)}
        title="Delete users"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Users that can be deleted Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Users that can be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>web-server-03</li>
              <li>web-server-05</li>
              <li>web-server-07</li>
            </ul>
          </div>

          {/* Users that cannot be deleted Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Users that cannot be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>my-server-04 (Locked instances cannot be deleted.)</li>
              <li>my-server-03 (Instances in current state cannot be deleted.)</li>
              <li>my-server-02</li>
              <li>my-server-82</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these users will permanently remove all associated access and sessions. This
              action cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteUsersMultipleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Users deleted');
              setIsDeleteUsersMultipleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Confirm User Password Modal */}
      <Modal
        isOpen={isConfirmUserPasswordOpen}
        onClose={() => setIsConfirmUserPasswordOpen(false)}
        title="Confirm user password"
        description="Review the username and password. The password can only be viewed at this step."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Username Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Username
            </span>
            <div className="flex items-center gap-1.5 min-h-[26px]">
              <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                john.doe
              </span>
              <button
                className="shrink-0 p-0.5 rounded hover:bg-[var(--color-surface-default)] transition-colors"
                aria-label="Copy to clipboard"
                onClick={() => {
                  navigator.clipboard.writeText('john.doe');
                  setUsernameCopied(true);
                  setTimeout(() => setUsernameCopied(false), 2000);
                }}
              >
                {usernameCopied ? (
                  <IconCheck size={12} className="text-[var(--color-state-success)]" />
                ) : (
                  <IconCopy size={12} className="text-[var(--color-action-primary)]" />
                )}
              </button>
            </div>
          </div>

          {/* Password Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Password
            </span>
            <div className="flex items-center gap-1.5 min-h-[26px]">
              <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                TempP@ss123!
              </span>
              <button
                className="shrink-0 p-0.5 rounded hover:bg-[var(--color-surface-default)] transition-colors"
                aria-label="Copy to clipboard"
                onClick={() => {
                  navigator.clipboard.writeText('TempP@ss123!');
                  setPasswordCopied(true);
                  setTimeout(() => setPasswordCopied(false), 2000);
                }}
              >
                {passwordCopied ? (
                  <IconCheck size={12} className="text-[var(--color-state-success)]" />
                ) : (
                  <IconCopy size={12} className="text-[var(--color-action-primary)]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex w-full">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsConfirmUserPasswordOpen(false)}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </Modal>

      {/* Unsaved Changes Modal */}
      <Modal
        isOpen={isUnsavedChangesOpen}
        onClose={() => setIsUnsavedChangesOpen(false)}
        title="Unsaved changes"
        description="Any unsaved changes will be lost. Do you want to leave?"
        size="sm"
      >
        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              console.log('Leave clicked');
              setIsUnsavedChangesOpen(false);
            }}
            className="flex-1"
          >
            Leave
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsUnsavedChangesOpen(false)}
            className="flex-1"
          >
            Stay
          </Button>
        </div>
      </Modal>

      {/* Detach User Group Modal */}
      <Modal
        isOpen={isDetachUserGroupOpen}
        onClose={() => setIsDetachUserGroupOpen(false)}
        title="Detach user group"
        description="This action detaches the user from the group."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              User
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DISPLAY NAME
            </span>
          </div>

          {/* User Group Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              User group
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              USERGROUP NAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Detaching this user will immediately remove all permissions granted through this
              group.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDetachUserGroupOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('User detached from group');
              setIsDetachUserGroupOpen(false);
            }}
            className="flex-1"
          >
            Detach
          </Button>
        </div>
      </Modal>

      {/* Detach Role Modal */}
      <Modal
        isOpen={isDetachRoleOpen}
        onClose={() => setIsDetachRoleOpen(false)}
        title="Detach role"
        description="This action detaches the role from the user."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              User
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DISPLAY NAME
            </span>
          </div>

          {/* Role Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Role
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">ROLENAME</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Detaching this role will immediately remove all permissions granted through this role.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDetachRoleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Role detached from user');
              setIsDetachRoleOpen(false);
            }}
            className="flex-1"
          >
            Detach
          </Button>
        </div>
      </Modal>

      {/* Remove OTP MFA Modal */}
      <Modal
        isOpen={isRemoveOtpMfaOpen}
        onClose={() => setIsRemoveOtpMfaOpen(false)}
        title="Remove OTP MFA"
        description="This action removes OTP MFA for the user."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              User
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DISPLAY NAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Removing OTP MFA will require the user to register OTP authentication again.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRemoveOtpMfaOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('OTP MFA removed');
              setIsRemoveOtpMfaOpen(false);
            }}
            className="flex-1"
          >
            Remove
          </Button>
        </div>
      </Modal>

      {/* Terminate All Sessions Modal */}
      <Modal
        isOpen={isTerminateAllSessionsOpen}
        onClose={() => setIsTerminateAllSessionsOpen(false)}
        title="Terminate all sessions"
        description="This action terminates all sessions for the user."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              User
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DISPLAYNAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Terminating all sessions will immediately sign the user out from all devices and
              require re-authentication.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsTerminateAllSessionsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('All sessions terminated');
              setIsTerminateAllSessionsOpen(false);
            }}
            className="flex-1"
          >
            Terminate
          </Button>
        </div>
      </Modal>

      {/* Terminate Session Modal (Single Session) */}
      <Modal
        isOpen={isTerminateSessionOpen}
        onClose={() => setIsTerminateSessionOpen(false)}
        title="Terminate session"
        description="This action terminates the session."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Session Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Session
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DISPLAYNAME (Browser/device)
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Terminating this session will sign the user out from this device and require
              re-authentication.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsTerminateSessionOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Session terminated');
              setIsTerminateSessionOpen(false);
            }}
            className="flex-1"
          >
            Terminate
          </Button>
        </div>
      </Modal>

      {/* Remove User From Group Modal */}
      <Modal
        isOpen={isRemoveUserFromGroupOpen}
        onClose={() => setIsRemoveUserFromGroupOpen(false)}
        title="Remove user"
        description="This action removes the user from the group."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Group Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              User group
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              USERGROUP NAME
            </span>
          </div>

          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              User
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DISPLAY NAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Removing this user will immediately remove all permissions granted through this group.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRemoveUserFromGroupOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('User removed from group');
              setIsRemoveUserFromGroupOpen(false);
            }}
            className="flex-1"
          >
            Remove
          </Button>
        </div>
      </Modal>

      {/* Delete Role Modal */}
      <Modal
        isOpen={isDeleteRoleOpen}
        onClose={() => setIsDeleteRoleOpen(false)}
        title="Delete role"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Role Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Role
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">ROLENAME</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this role will immediately remove all permissions granted through this role.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteRoleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Role deleted');
              setIsDeleteRoleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Roles (Multiple) Modal */}
      <Modal
        isOpen={isDeleteRolesMultipleOpen}
        onClose={() => setIsDeleteRolesMultipleOpen(false)}
        title="Delete roles"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Roles that can be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Roles that can be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>web-server-03</li>
              <li>web-server-05</li>
              <li>web-server-07</li>
            </ul>
          </div>

          {/* Roles that cannot be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Roles that cannot be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>my-server-04 (Locked instances cannot be deleted.)</li>
              <li>my-server-03 (Instances in current state cannot be deleted.)</li>
              <li>my-server-02</li>
              <li>my-server-82</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these roles will immediately remove all permissions granted through these
              roles.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteRolesMultipleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Multiple roles deleted');
              setIsDeleteRolesMultipleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Detach Policy Modal */}
      <Modal
        isOpen={isDetachPolicyOpen}
        onClose={() => setIsDetachPolicyOpen(false)}
        title="Detach policy"
        description="This action detaches the policy from the role."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Role Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Role
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">ROLENAME</span>
          </div>

          {/* Policy Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Policy
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              POLICYNAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Detaching this policy will immediately revoke permissions granted to this role through
              this policy.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDetachPolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Policy detached from role');
              setIsDetachPolicyOpen(false);
            }}
            className="flex-1"
          >
            Detach
          </Button>
        </div>
      </Modal>

      {/* Delete Policy Modal */}
      <Modal
        isOpen={isDeletePolicyOpen}
        onClose={() => setIsDeletePolicyOpen(false)}
        title="Delete policy"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Policy Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Policy
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              POLICYNAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This policy will be permanently removed. Users or roles attached to this policy will
              immediately lose access permissions.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeletePolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Policy deleted');
              setIsDeletePolicyOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Policies (Multiple) Modal */}
      <Modal
        isOpen={isDeletePoliciesMultipleOpen}
        onClose={() => setIsDeletePoliciesMultipleOpen(false)}
        title="Delete policies"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Policies that can be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Policies that can be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>web-server-03</li>
              <li>web-server-05</li>
              <li>web0server-07</li>
            </ul>
          </div>

          {/* Policies that cannot be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Policies that cannot be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>my-server-04 (Locked instances cannot be deleted.)</li>
              <li>my-server-03 (Instances in current state cannot be deleted.)</li>
              <li>my-server-02</li>
              <li>my-server-82</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              These policies will be permanently removed. Users or roles attached to these policies
              will immediately lose access permissions.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeletePoliciesMultipleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Multiple policies deleted');
              setIsDeletePoliciesMultipleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Revert Policy Version Modal */}
      <Modal
        isOpen={isRevertPolicyVersionOpen}
        onClose={() => setIsRevertPolicyVersionOpen(false)}
        title="Revert policy version"
        description="This action reverts the policy to the selected version."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Current Version Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Current version
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">VERSION</span>
          </div>

          {/* Target Version Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Target version
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">VERSION</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Reverting to this version will immediately replace the currently active policy and may
              change permissions for all roles using it.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRevertPolicyVersionOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Policy version reverted');
              setIsRevertPolicyVersionOpen(false);
            }}
            className="flex-1"
          >
            Revert
          </Button>
        </div>
      </Modal>

      {/* Delete Policy Version Modal */}
      <Modal
        isOpen={isDeletePolicyVersionOpen}
        onClose={() => setIsDeletePolicyVersionOpen(false)}
        title="Delete policy version"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this version will permanently remove its policy definitions. This action
              cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeletePolicyVersionOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Policy version deleted');
              setIsDeletePolicyVersionOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Update MFA Enforcement Policy Modal */}
      <Modal
        isOpen={isUpdateMfaEnforcementOpen}
        onClose={() => setIsUpdateMfaEnforcementOpen(false)}
        title="Update MFA enforcement policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>MFA enforcement: Voluntary → Required for all users</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Updating MFA enforcement may immediately affect authentication requirements for all
              users.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdateMfaEnforcementOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('MFA enforcement policy updated');
              setIsUpdateMfaEnforcementOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Update OTP Policy Modal */}
      <Modal
        isOpen={isUpdateOtpPolicyOpen}
        onClose={() => setIsUpdateOtpPolicyOpen(false)}
        title="Update OTP policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>OTP policy: On → Off</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Turning off OTP authentication will remove OTP as an available MFA method for all
              users.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdateOtpPolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('OTP policy updated');
              setIsUpdateOtpPolicyOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Update OTP Policy Settings Modal */}
      <Modal
        isOpen={isUpdateOtpPolicySettingsOpen}
        onClose={() => setIsUpdateOtpPolicySettingsOpen(false)}
        title="Update OTP policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Look around Window: 1 → 0</li>
              <li>Reusable token: Off → On</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdateOtpPolicySettingsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('OTP policy settings updated');
              setIsUpdateOtpPolicySettingsOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Update Email Policy Modal */}
      <Modal
        isOpen={isUpdateEmailPolicyOpen}
        onClose={() => setIsUpdateEmailPolicyOpen(false)}
        title="Update email policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Email policy: On → Off</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Turning off email authentication will remove email as an available MFA method for all
              users.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdateEmailPolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Email policy updated');
              setIsUpdateEmailPolicyOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Update Email Policy Settings Modal */}
      <Modal
        isOpen={isUpdateEmailPolicySettingsOpen}
        onClose={() => setIsUpdateEmailPolicySettingsOpen(false)}
        title="Update email policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Code validity period: 300 → 600 seconds</li>
              <li>Resend cooldown: 60 → 1 seconds</li>
              <li>Verification attempts(Time window): 10 → 40 minutes</li>
              <li>Verification attempts(Max attempts): 5 → 10 times</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdateEmailPolicySettingsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Email policy settings updated');
              setIsUpdateEmailPolicySettingsOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Update General Session Policy Modal */}
      <Modal
        isOpen={isUpdateGeneralSessionPolicyOpen}
        onClose={() => setIsUpdateGeneralSessionPolicyOpen(false)}
        title="Update general session policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Session idle timeout: 30 → 10 minutes</li>
              <li>Session max lifespan: 8 → 10 hours</li>
              <li>Login timeout: 30 → 10 minutes</li>
              <li>Login action timeout: 5 → 3 minutes</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdateGeneralSessionPolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('General session policy updated');
              setIsUpdateGeneralSessionPolicyOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Delete Domain Modal */}
      <Modal
        isOpen={isDeleteDomainOpen}
        onClose={() => setIsDeleteDomainOpen(false)}
        title="Delete domain"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Domain Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              domain
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DOMAINNAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this domain will permanently remove all configurations, policies, and
              associations linked to it. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteDomainOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Domain deleted');
              setIsDeleteDomainOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Switch to Domain Modal */}
      <Modal
        isOpen={isSwitchToDomainOpen}
        onClose={() => setIsSwitchToDomainOpen(false)}
        title="Switch to domain"
        description="Any unsaved changes may be lost when switching to another domain. Do you want to switch?"
        size="sm"
      >
        <div className="flex flex-col gap-2 items-center">
          {/* Current Domain Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 w-full">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Current domain
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">Domain A</span>
          </div>

          {/* Chevron Down Icon */}
          <IconChevronDown size={16} className="text-[var(--color-text-default)]" stroke={1.5} />

          {/* Target Domain Info Box */}
          <div className="bg-[#eff6ff] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 w-full">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Target domain
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">Domain B</span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsSwitchToDomainOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Switched to domain');
              setIsSwitchToDomainOpen(false);
            }}
            className="flex-1"
          >
            Switch
          </Button>
        </div>
      </Modal>

      {/* Delete System Administrator Modal */}
      <Modal
        isOpen={isDeleteSystemAdminOpen}
        onClose={() => setIsDeleteSystemAdminOpen(false)}
        title="Delete system administrator"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* System Administrator Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              System administrator
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              DISPLAY NAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this system administrator will permanently remove their global access and
              cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSystemAdminOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('System administrator deleted');
              setIsDeleteSystemAdminOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Update Password Policy Modal */}
      <Modal
        isOpen={isUpdatePasswordPolicyOpen}
        onClose={() => setIsUpdatePasswordPolicyOpen(false)}
        title="Update password policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Length: 8-64 → 1-100</li>
              <li>
                Requirements: Uppercase, Lowercase, number, Special character → Uppercase, Lowercase
              </li>
              <li>Exclusion rules: none → Username, Email</li>
              <li>Password expiration: 30 → 47 days</li>
              <li>Prevent password reuse: Off → On</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdatePasswordPolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Password policy updated');
              setIsUpdatePasswordPolicyOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Update Account Lockout Policy Modal */}
      <Modal
        isOpen={isUpdateAccountLockoutPolicyOpen}
        onClose={() => setIsUpdateAccountLockoutPolicyOpen(false)}
        title="Update account lockout policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>
                Lockout type: Lockout permanently after Temporary lockout → Lockout temporarily
              </li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdateAccountLockoutPolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Account lockout policy updated');
              setIsUpdateAccountLockoutPolicyOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Update Token Policy Modal */}
      <Modal
        isOpen={isUpdateTokenPolicyOpen}
        onClose={() => setIsUpdateTokenPolicyOpen(false)}
        title="Update token policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Access token lifespan: 10 → 15 minutes</li>
              <li>Refresh token lifespan: 7 → 3 days</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Updating token settings may immediately affect authentication behavior across the
              system.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUpdateTokenPolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Token policy updated');
              setIsUpdateTokenPolicyOpen(false);
            }}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* =============================================
          STORAGE MODALS
          ============================================= */}

      {/* Delete Bucket Modal */}
      <Modal
        isOpen={isDeleteBucketOpen}
        onClose={() => setIsDeleteBucketOpen(false)}
        title="Delete bucket"
        size="sm"
      >
        {/* Warning Alert Box */}
        <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
          <IconAlertCircle
            size={16}
            className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
            stroke={1.5}
          />
          <div className="text-[11px] text-[var(--color-text-default)] leading-4">
            <p className="font-medium mb-1">Warning: Non-empty bucket</p>
            <ul className="list-disc ml-4 space-y-0.5">
              <li>All objects in this bucket will be deleted.</li>
              <li>This action is irreversible.</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteBucketOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Bucket deleted');
              setIsDeleteBucketOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* =============================================
          CONTAINER MODALS
          ============================================= */}

      {/* Delete Cluster Modal */}
      <DeleteClusterModal
        isOpen={isDeleteClusterOpen}
        onClose={() => setIsDeleteClusterOpen(false)}
        cluster={{ id: 'cluster-001', name: 'production-cluster' }}
        onConfirm={() => {
          console.log('Cluster deleted');
          setIsDeleteClusterOpen(false);
        }}
      />

      {/* Delete Namespace Modal */}
      <DeleteNamespaceModal
        isOpen={isDeleteNamespaceOpen}
        onClose={() => setIsDeleteNamespaceOpen(false)}
        namespace={{ id: 'ns-001', name: 'default' }}
        onConfirm={() => {
          console.log('Namespace deleted');
          setIsDeleteNamespaceOpen(false);
        }}
      />

      {/* Delete Pod Modal */}
      <DeletePodModal
        isOpen={isDeletePodOpen}
        onClose={() => setIsDeletePodOpen(false)}
        pod={{ id: 'pod-001', name: 'nginx-deployment-7fb96c846b-abc12' }}
        onConfirm={() => {
          console.log('Pod deleted');
          setIsDeletePodOpen(false);
        }}
      />

      {/* Delete Job Modal */}
      <DeleteJobModal
        isOpen={isDeleteJobOpen}
        onClose={() => setIsDeleteJobOpen(false)}
        job={{ id: 'job-001', name: 'backup-job-20240115' }}
        onConfirm={() => {
          console.log('Job deleted');
          setIsDeleteJobOpen(false);
        }}
      />

      {/* Delete CronJob Modal */}
      <DeleteCronJobModal
        isOpen={isDeleteCronJobOpen}
        onClose={() => setIsDeleteCronJobOpen(false)}
        cronJob={{ id: 'cronjob-001', name: 'daily-backup' }}
        onConfirm={() => {
          console.log('CronJob deleted');
          setIsDeleteCronJobOpen(false);
        }}
      />

      {/* Delete Deployment Modal */}
      <DeleteDeploymentModal
        isOpen={isDeleteDeploymentOpen}
        onClose={() => setIsDeleteDeploymentOpen(false)}
        deployment={{ id: 'deploy-001', name: 'nginx-deployment' }}
        onConfirm={() => {
          console.log('Deployment deleted');
          setIsDeleteDeploymentOpen(false);
        }}
      />

      {/* Delete StatefulSet Modal */}
      <DeleteStatefulSetModal
        isOpen={isDeleteStatefulSetOpen}
        onClose={() => setIsDeleteStatefulSetOpen(false)}
        statefulSet={{ id: 'sts-001', name: 'mysql-statefulset' }}
        onConfirm={() => {
          console.log('StatefulSet deleted');
          setIsDeleteStatefulSetOpen(false);
        }}
      />

      {/* Delete DaemonSet Modal */}
      <DeleteDaemonSetModal
        isOpen={isDeleteDaemonSetOpen}
        onClose={() => setIsDeleteDaemonSetOpen(false)}
        daemonSet={{ id: 'ds-001', name: 'fluentd-daemonset' }}
        onConfirm={() => {
          console.log('DaemonSet deleted');
          setIsDeleteDaemonSetOpen(false);
        }}
      />

      {/* Redeploy Deployment Modal */}
      <RedeployDeploymentModal
        isOpen={isRedeployDeploymentOpen}
        onClose={() => setIsRedeployDeploymentOpen(false)}
        deployment={{ id: 'deploy-001', name: 'nginx-deployment' }}
        onConfirm={() => {
          console.log('Deployment redeployed');
          setIsRedeployDeploymentOpen(false);
        }}
      />

      {/* Redeploy StatefulSet Modal */}
      <RedeployStatefulSetModal
        isOpen={isRedeployStatefulSetOpen}
        onClose={() => setIsRedeployStatefulSetOpen(false)}
        statefulSet={{ id: 'sts-001', name: 'mysql-statefulset' }}
        onConfirm={() => {
          console.log('StatefulSet redeployed');
          setIsRedeployStatefulSetOpen(false);
        }}
      />

      {/* Redeploy DaemonSet Modal */}
      <RedeployDaemonSetModal
        isOpen={isRedeployDaemonSetOpen}
        onClose={() => setIsRedeployDaemonSetOpen(false)}
        daemonSet={{ id: 'ds-001', name: 'fluentd-daemonset' }}
        onConfirm={() => {
          console.log('DaemonSet redeployed');
          setIsRedeployDaemonSetOpen(false);
        }}
      />

      {/* Roll Back Deployment Modal */}
      <RollBackDeploymentModal
        isOpen={isRollBackDeploymentOpen}
        onClose={() => setIsRollBackDeploymentOpen(false)}
        deployment={{ id: 'deploy-001', name: 'nginx-deployment' }}
        onConfirm={(revisionId) => {
          console.log('Deployment rolled back to:', revisionId);
          setIsRollBackDeploymentOpen(false);
        }}
      />

      {/* ----------------------------------------
         Compute Admin Modals
         ---------------------------------------- */}

      {/* Stop Instance Modal */}
      <Modal
        isOpen={isStopInstanceOpen}
        onClose={() => setIsStopInstanceOpen(false)}
        title="Stop Instance"
        description="This action stops the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-server-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action may interrupt the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsStopInstanceOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instance stopped');
              setIsStopInstanceOpen(false);
            }}
            className="flex-1"
          >
            Stop
          </Button>
        </div>
      </Modal>

      {/* Reboot Instance Modal */}
      <Modal
        isOpen={isRebootInstanceOpen}
        onClose={() => setIsRebootInstanceOpen(false)}
        title="Reboot Instance"
        description="This action reboots the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-server-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action may interrupt the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRebootInstanceOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instance rebooted');
              setIsRebootInstanceOpen(false);
            }}
            className="flex-1"
          >
            Reboot
          </Button>
        </div>
      </Modal>

      {/* Soft Reboot Instance Modal */}
      <Modal
        isOpen={isSoftRebootInstanceOpen}
        onClose={() => setIsSoftRebootInstanceOpen(false)}
        title="Soft Reboot Instance"
        description="This action performs a soft reboot of the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-server-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action may interrupt the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsSoftRebootInstanceOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instance soft rebooted');
              setIsSoftRebootInstanceOpen(false);
            }}
            className="flex-1"
          >
            Soft Reboot
          </Button>
        </div>
      </Modal>

      {/* Confirm Resize Modal */}
      <Modal
        isOpen={isConfirmResizeOpen}
        onClose={() => setIsConfirmResizeOpen(false)}
        title="Confirm Resize"
        description="This action confirms the resized state of the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-server-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Confirming the resize may affect the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsConfirmResizeOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Resize confirmed');
              setIsConfirmResizeOpen(false);
            }}
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </Modal>

      {/* Revert Resize Modal */}
      <Modal
        isOpen={isRevertResizeOpen}
        onClose={() => setIsRevertResizeOpen(false)}
        title="Revert Resize"
        description="This action reverts the instance to its previous state before the resize."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-server-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Reverting the resize may affect the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRevertResizeOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Resize reverted');
              setIsRevertResizeOpen(false);
            }}
            className="flex-1"
          >
            Revert
          </Button>
        </div>
      </Modal>

      {/* Delete Instance Modal */}
      <Modal
        isOpen={isDeleteInstanceOpen}
        onClose={() => setIsDeleteInstanceOpen(false)}
        title="Delete Instance"
        description="Removing the instance is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-server-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this instance may interrupt the services running on it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteInstanceOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Instance deleted');
              setIsDeleteInstanceOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Shelve Instance Modal */}
      <Modal
        isOpen={isShelveInstanceOpen}
        onClose={() => setIsShelveInstanceOpen(false)}
        title="Shelve Instance"
        description="This action shelves the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-server-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action may interrupt the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsShelveInstanceOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instance shelved');
              setIsShelveInstanceOpen(false);
            }}
            className="flex-1"
          >
            Shelve
          </Button>
        </div>
      </Modal>

      {/* Start Instances Modal */}
      <Modal
        isOpen={isStartInstancesOpen}
        onClose={() => setIsStartInstancesOpen(false)}
        title="Start Instances"
        description="This action starts the selected instances."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instances that can be started
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>api-server-01</li>
              <li>db-server-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instances that cannot be started
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-03</li>
              <li>web-server-04</li>
              <li>api-server-02</li>
              <li>db-server-02</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Starting these instances may affect the services running on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsStartInstancesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instances started');
              setIsStartInstancesOpen(false);
            }}
            className="flex-1"
          >
            Start
          </Button>
        </div>
      </Modal>

      {/* Stop Instances Modal */}
      <Modal
        isOpen={isStopInstancesOpen}
        onClose={() => setIsStopInstancesOpen(false)}
        title="Stop Instances"
        description="This action stops the selected instances."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instances that can be stopped
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>api-server-01</li>
              <li>db-server-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instances that cannot be stopped
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-03</li>
              <li>web-server-04</li>
              <li>api-server-02</li>
              <li>db-server-02</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Stopping these instances may interrupt the services running on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsStopInstancesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instances stopped');
              setIsStopInstancesOpen(false);
            }}
            className="flex-1"
          >
            Stop
          </Button>
        </div>
      </Modal>

      {/* Reboot Instances Modal */}
      <Modal
        isOpen={isRebootInstancesOpen}
        onClose={() => setIsRebootInstancesOpen(false)}
        title="Reboot Instances"
        description="This action reboots the selected instances."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instances that can be rebooted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>api-server-01</li>
              <li>db-server-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instances that cannot be rebooted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-03</li>
              <li>web-server-04</li>
              <li>api-server-02</li>
              <li>db-server-02</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Rebooting these instances may interrupt the services running on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRebootInstancesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instances rebooted');
              setIsRebootInstancesOpen(false);
            }}
            className="flex-1"
          >
            Reboot
          </Button>
        </div>
      </Modal>

      {/* Delete Instances Modal */}
      <Modal
        isOpen={isDeleteInstancesOpen}
        onClose={() => setIsDeleteInstancesOpen(false)}
        title="Delete Instances"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instances that can be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>api-server-01</li>
              <li>db-server-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instances that cannot be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-03</li>
              <li>web-server-04</li>
              <li>api-server-02</li>
              <li>db-server-02</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these instances may interrupt the services running on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteInstancesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Instances deleted');
              setIsDeleteInstancesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Instance Template Modal */}
      <Modal
        isOpen={isDeleteInstanceTemplateOpen}
        onClose={() => setIsDeleteInstanceTemplateOpen(false)}
        title="Delete Instance Template"
        description="Deleting the instance template is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance Template
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-server-template-01
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteInstanceTemplateOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Instance template deleted');
              setIsDeleteInstanceTemplateOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Instance Templates Modal */}
      <Modal
        isOpen={isDeleteInstanceTemplatesOpen}
        onClose={() => setIsDeleteInstanceTemplatesOpen(false)}
        title="Delete Instance Templates"
        description="Deleting the selected instance templates is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Instance Templates
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-template-01</li>
              <li>api-server-template-01</li>
              <li>db-server-template-01</li>
              <li>cache-server-template-01</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteInstanceTemplatesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Instance templates deleted');
              setIsDeleteInstanceTemplatesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Image Modal */}
      <Modal
        isOpen={isDeleteImageOpen}
        onClose={() => setIsDeleteImageOpen(false)}
        title="Delete Image"
        description="Deleting the image is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Image
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              ubuntu-22.04-server
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteImageOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Image deleted');
              setIsDeleteImageOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Images Modal */}
      <Modal
        isOpen={isDeleteImagesOpen}
        onClose={() => setIsDeleteImagesOpen(false)}
        title="Delete Images"
        description="Deleting the selected images is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Images that can be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>ubuntu-22.04-server</li>
              <li>centos-8-stream</li>
              <li>debian-11-bullseye</li>
              <li>fedora-38-cloud</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Images that cannot be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>windows-2022-server (in use)</li>
              <li>rhel-9-base (protected)</li>
              <li>alpine-3.18 (in use)</li>
              <li>rocky-linux-9 (protected)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteImagesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Images deleted');
              setIsDeleteImagesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Snapshot Modal */}
      <Modal
        isOpen={isDeleteSnapshotOpen}
        onClose={() => setIsDeleteSnapshotOpen(false)}
        title="Delete Snapshot"
        description="Deleting the snapshot is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Snapshot
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              snapshot-2024-01-15
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSnapshotOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Snapshot deleted');
              setIsDeleteSnapshotOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Snapshots Modal */}
      <Modal
        isOpen={isDeleteSnapshotsOpen}
        onClose={() => setIsDeleteSnapshotsOpen(false)}
        title="Delete Snapshots"
        description="Deleting the selected snapshots is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Snapshots that can be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>snapshot-2024-01-15</li>
              <li>snapshot-2024-01-10</li>
              <li>snapshot-2024-01-05</li>
              <li>snapshot-2024-01-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Snapshots that cannot be deleted
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>snapshot-2023-12-25 (in use)</li>
              <li>snapshot-2023-12-20 (protected)</li>
              <li>snapshot-2023-12-15 (in use)</li>
              <li>snapshot-2023-12-10 (protected)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSnapshotsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Snapshots deleted');
              setIsDeleteSnapshotsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Volume Modal */}
      <Modal
        isOpen={isDeleteVolumeOpen}
        onClose={() => setIsDeleteVolumeOpen(false)}
        title="Delete Volume"
        description="Deleting the volume is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              volume-data-01
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteVolumeOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Volume deleted');
              setIsDeleteVolumeOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Volumes Modal */}
      <Modal
        isOpen={isDeleteVolumesOpen}
        onClose={() => setIsDeleteVolumesOpen(false)}
        title="Delete Volumes"
        description="Deleting the selected volumes is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volumes that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>volume-data-01</li>
              <li>volume-data-02</li>
              <li>volume-data-03</li>
              <li>volume-data-04</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volumes that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>volume-data-05</li>
              <li>volume-data-06</li>
              <li>volume-data-07</li>
              <li>volume-data-08</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteVolumesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Volumes deleted');
              setIsDeleteVolumesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Volume Type Modal */}
      <Modal
        isOpen={isDeleteVolumeTypeOpen}
        onClose={() => setIsDeleteVolumeTypeOpen(false)}
        title="Delete Volume Type"
        description="Deleting the volume type is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume type
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              ssd-performance
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteVolumeTypeOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Volume type deleted');
              setIsDeleteVolumeTypeOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Volume Types Modal */}
      <Modal
        isOpen={isDeleteVolumeTypesOpen}
        onClose={() => setIsDeleteVolumeTypesOpen(false)}
        title="Delete Volume Types"
        description="Deleting the selected volume types is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume types
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>ssd-performance</li>
              <li>hdd-standard</li>
              <li>nvme-ultra</li>
              <li>ssd-economy</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteVolumeTypesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Volume types deleted');
              setIsDeleteVolumeTypesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Backup Modal */}
      <Modal
        isOpen={isDeleteBackupOpen}
        onClose={() => setIsDeleteBackupOpen(false)}
        title="Delete Backup"
        description="Deleting the backup is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Backup
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              backup-2024-01-15
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteBackupOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Backup deleted');
              setIsDeleteBackupOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Backups Modal */}
      <Modal
        isOpen={isDeleteBackupsOpen}
        onClose={() => setIsDeleteBackupsOpen(false)}
        title="Delete Backups"
        description="Deleting the selected backups is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Backups that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>backup-2024-01-15</li>
              <li>backup-2024-01-10</li>
              <li>backup-2024-01-05</li>
              <li>backup-2024-01-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Backups that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>backup-2023-12-25 (in progress)</li>
              <li>backup-2023-12-20 (restoring)</li>
              <li>backup-2023-12-15 (in progress)</li>
              <li>backup-2023-12-10 (restoring)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteBackupsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Backups deleted');
              setIsDeleteBackupsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Encryption Modal */}
      <Modal
        isOpen={isDeleteEncryptionOpen}
        onClose={() => setIsDeleteEncryptionOpen(false)}
        title="Delete Encryption"
        description="This action removes the encryption configuration from the volume type."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume type
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              ssd-encrypted
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteEncryptionOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Encryption deleted');
              setIsDeleteEncryptionOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Extra Spec Modal */}
      <Modal
        isOpen={isDeleteExtraSpecOpen}
        onClose={() => setIsDeleteExtraSpecOpen(false)}
        title="Delete Extra Spec"
        description="This action removes the extra specification from the volume type."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume type
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              ssd-performance
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Extra spec
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              volume_backend_name=lvm
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteExtraSpecOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Extra spec deleted');
              setIsDeleteExtraSpecOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Extra Specs Modal */}
      <Modal
        isOpen={isDeleteExtraSpecsOpen}
        onClose={() => setIsDeleteExtraSpecsOpen(false)}
        title="Delete Extra Specs"
        description="Deleting the selected extra specifications is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume type
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              ssd-performance
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Extra specs
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>volume_backend_name=lvm</li>
              <li>max_iops=10000</li>
              <li>disk_type=ssd</li>
              <li>encryption=aes-256</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteExtraSpecsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Extra specs deleted');
              setIsDeleteExtraSpecsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete QoS Spec Modal */}
      <Modal
        isOpen={isDeleteQoSSpecOpen}
        onClose={() => setIsDeleteQoSSpecOpen(false)}
        title="Delete QoS Spec"
        description="This action removes the QoS specification."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              QoS Spec
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              high-performance
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteQoSSpecOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('QoS spec deleted');
              setIsDeleteQoSSpecOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete QoS Specs Modal */}
      <Modal
        isOpen={isDeleteQoSSpecsOpen}
        onClose={() => setIsDeleteQoSSpecsOpen(false)}
        title="Delete QoS Specs"
        description="This action removes the selected QoS specifications."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              QoS Specs
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>high-performance</li>
              <li>standard-iops</li>
              <li>economy-storage</li>
              <li>burst-optimized</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteQoSSpecsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('QoS specs deleted');
              setIsDeleteQoSSpecsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete QoS Extra Spec Modal */}
      <Modal
        isOpen={isDeleteQoSExtraSpecOpen}
        onClose={() => setIsDeleteQoSExtraSpecOpen(false)}
        title="Delete Extra Spec"
        description="This action removes the extra specification from the volume type."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume type
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              high-performance
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Extra spec
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              minIOPS=1000
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteQoSExtraSpecOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('QoS extra spec deleted');
              setIsDeleteQoSExtraSpecOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete QoS Extra Specs Modal */}
      <Modal
        isOpen={isDeleteQoSExtraSpecsOpen}
        onClose={() => setIsDeleteQoSExtraSpecsOpen(false)}
        title="Delete Extra Specs"
        description="Deleting the selected extra specifications is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume type
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              high-performance
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Extra specs
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>minIOPS=1000</li>
              <li>maxIOPS=10000</li>
              <li>burstIOPS=15000</li>
              <li>latency=low</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteQoSExtraSpecsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('QoS extra specs deleted');
              setIsDeleteQoSExtraSpecsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Network Modal */}
      <Modal
        isOpen={isDeleteNetworkOpen}
        onClose={() => setIsDeleteNetworkOpen(false)}
        title="Delete Network"
        description="Deleting the network is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Network
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              internal-network-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this network may affect subnets, routers, or resources connected to it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteNetworkOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Network deleted');
              setIsDeleteNetworkOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Networks Modal */}
      <Modal
        isOpen={isDeleteNetworksOpen}
        onClose={() => setIsDeleteNetworksOpen(false)}
        title="Delete Networks"
        description="Removing the selected networks is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Networks that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>internal-network-01</li>
              <li>internal-network-02</li>
              <li>test-network-01</li>
              <li>dev-network-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Networks that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-network (in use)</li>
              <li>shared-network (external)</li>
              <li>management-network (system)</li>
              <li>public-network (external)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these networks may affect subnets, routers, or resources connected to them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteNetworksOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Networks deleted');
              setIsDeleteNetworksOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Subnet Modal */}
      <Modal
        isOpen={isDeleteSubnetOpen}
        onClose={() => setIsDeleteSubnetOpen(false)}
        title="Delete Subnet"
        description="Deleting the subnet is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Subnet
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              subnet-192-168-1-0
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this subnet may affect routers, ports, or services connected to it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSubnetOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Subnet deleted');
              setIsDeleteSubnetOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Subnets Modal */}
      <Modal
        isOpen={isDeleteSubnetsOpen}
        onClose={() => setIsDeleteSubnetsOpen(false)}
        title="Delete Subnets"
        description="Deleting the selected subnets is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Extra specs
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>subnet-192-168-1-0</li>
              <li>subnet-10-0-0-0</li>
              <li>subnet-172-16-0-0</li>
              <li>subnet-192-168-2-0</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these subnets may affect routers, ports, or services connected to them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSubnetsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Subnets deleted');
              setIsDeleteSubnetsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Port Modal */}
      <Modal
        isOpen={isDeletePortOpen}
        onClose={() => setIsDeletePortOpen(false)}
        title="Delete Port"
        description="Deleting the port is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Port
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              port-abc12345
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this port may affect instances, routers, or services connected to it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeletePortOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Port deleted');
              setIsDeletePortOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Ports Modal */}
      <Modal
        isOpen={isDeletePortsOpen}
        onClose={() => setIsDeletePortsOpen(false)}
        title="Delete Ports"
        description="Deleting the selected ports is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Ports
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>port-abc12345</li>
              <li>port-def67890</li>
              <li>port-ghi11121</li>
              <li>port-jkl31415</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these ports may affect instances, routers, or services connected to them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeletePortsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Ports deleted');
              setIsDeletePortsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Router Modal */}
      <Modal
        isOpen={isDeleteRouterOpen}
        onClose={() => setIsDeleteRouterOpen(false)}
        title="Delete Router"
        description="Deleting the router is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Router
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              main-router-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this router may affect networks, subnets, or resources connected to it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteRouterOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Router deleted');
              setIsDeleteRouterOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Routers Modal */}
      <Modal
        isOpen={isDeleteRoutersOpen}
        onClose={() => setIsDeleteRoutersOpen(false)}
        title="Delete Routers"
        description="Removing the selected routers is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Routers that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>main-router-01</li>
              <li>backup-router-01</li>
              <li>test-router-01</li>
              <li>dev-router-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Routers that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-router (in use)</li>
              <li>gateway-router (external)</li>
              <li>management-router (system)</li>
              <li>ha-router (high availability)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these routers may affect networks, subnets, or resources connected to them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteRoutersOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Routers deleted');
              setIsDeleteRoutersOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Static Routes Modal */}
      <Modal
        isOpen={isDeleteStaticRoutesOpen}
        onClose={() => setIsDeleteStaticRoutesOpen(false)}
        title="Delete Static Routes"
        description="Deleting the selected static routers is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Static Routes
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>10.0.0.0/24 via 192.168.1.1</li>
              <li>172.16.0.0/16 via 192.168.1.1</li>
              <li>192.168.2.0/24 via 10.0.0.1</li>
              <li>0.0.0.0/0 via 192.168.1.254</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Removing these static routes may affect network traffic that depends on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteStaticRoutesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Static routes deleted');
              setIsDeleteStaticRoutesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Remove DHCP Agents Modal */}
      <Modal
        isOpen={isRemoveDHCPAgentsOpen}
        onClose={() => setIsRemoveDHCPAgentsOpen(false)}
        title="Remove DHCP Agents"
        description="This action removes the selected DHCP agents from the network."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Network
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              internal-network-01
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              DHCP Agents
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>dhcp-agent-001</li>
              <li>dhcp-agent-002</li>
              <li>dhcp-agent-003</li>
              <li>dhcp-agent-004</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Removing these DHCP agents may affect IP address assignment for instances in the
              network.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRemoveDHCPAgentsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('DHCP agents removed');
              setIsRemoveDHCPAgentsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Release Fixed IP Modal */}
      <Modal
        isOpen={isReleaseFixedIPOpen}
        onClose={() => setIsReleaseFixedIPOpen(false)}
        title="Release fixed IP"
        description="This action releases the fixed IP from the port."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Port
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              port-abc12345
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Fixed IP
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              192.168.1.100
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing this fixed IP may affect network connectivity for the port.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReleaseFixedIPOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Fixed IP released');
              setIsReleaseFixedIPOpen(false);
            }}
            className="flex-1"
          >
            Release
          </Button>
        </div>
      </Modal>

      {/* Delete Allowed Address Pair Modal */}
      <Modal
        isOpen={isDeleteAllowedAddressPairOpen}
        onClose={() => setIsDeleteAllowedAddressPairOpen(false)}
        title="Delete Allowed Address Pair"
        description="This action removes the allowed address pair from the port."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Port
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              port-abc12345
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              IP address
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              10.0.0.50
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these allowed address pairs may affect network access for the port.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteAllowedAddressPairOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Allowed address pair deleted');
              setIsDeleteAllowedAddressPairOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Security Group Admin Modal */}
      <Modal
        isOpen={isDeleteSecurityGroupAdminOpen}
        onClose={() => setIsDeleteSecurityGroupAdminOpen(false)}
        title="Delete Security Group"
        description="Deleting the security group is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Security group
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-servers-sg
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security group and all its rules. If this
              group is attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSecurityGroupAdminOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security group deleted');
              setIsDeleteSecurityGroupAdminOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Security Groups Admin Modal */}
      <Modal
        isOpen={isDeleteSecurityGroupsAdminOpen}
        onClose={() => setIsDeleteSecurityGroupsAdminOpen(false)}
        title="Delete Security Groups"
        description="Deleting the selected security groups is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Security groups that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-servers-sg</li>
              <li>database-sg</li>
              <li>api-servers-sg</li>
              <li>monitoring-sg</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Security groups that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>default (system)</li>
              <li>production-sg (in use)</li>
              <li>management-sg (system)</li>
              <li>bastion-sg (in use)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security groups and all their rules.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSecurityGroupsAdminOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security groups deleted');
              setIsDeleteSecurityGroupsAdminOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Modal */}
      <Modal
        isOpen={isDeleteFirewallOpen}
        onClose={() => setIsDeleteFirewallOpen(false)}
        title="Delete Firewall"
        description="Deleting the firewall is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewall
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              perimeter-firewall-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the firewall and all its rules.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteFirewallOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall deleted');
              setIsDeleteFirewallOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Firewalls Modal */}
      <Modal
        isOpen={isDeleteFirewallsOpen}
        onClose={() => setIsDeleteFirewallsOpen(false)}
        title="Delete Firewalls"
        description="Deleting the selected firewalls is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewalls that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>perimeter-firewall-01</li>
              <li>internal-firewall-01</li>
              <li>test-firewall-01</li>
              <li>dev-firewall-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewalls that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-firewall (in use)</li>
              <li>gateway-firewall (system)</li>
              <li>management-firewall (system)</li>
              <li>ha-firewall (high availability)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the firewalls and all their rules.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteFirewallsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewalls deleted');
              setIsDeleteFirewallsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Unsaved Changes Admin Modal */}
      <Modal
        isOpen={isUnsavedChangesAdminOpen}
        onClose={() => setIsUnsavedChangesAdminOpen(false)}
        title="Unsaved changes"
        description="Any unsaved changes will be lost. Do you want to leave?"
        size="sm"
      >
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsUnsavedChangesAdminOpen(false)}
            className="flex-1"
          >
            Leave
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Staying on page');
              setIsUnsavedChangesAdminOpen(false);
            }}
            className="flex-1"
          >
            Stay
          </Button>
        </div>
      </Modal>

      {/* Release Floating IP Modal */}
      <Modal
        isOpen={isReleaseFloatingIPOpen}
        onClose={() => setIsReleaseFloatingIPOpen(false)}
        title="Release Floating IP"
        description="Releasing the floating IP is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Floating IP
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              203.0.113.50
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing this floating IP may limit external access for the associated resource.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReleaseFloatingIPOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Floating IP released');
              setIsReleaseFloatingIPOpen(false);
            }}
            className="flex-1"
          >
            Release
          </Button>
        </div>
      </Modal>

      {/* Release Floating IPs Modal */}
      <Modal
        isOpen={isReleaseFloatingIPsOpen}
        onClose={() => setIsReleaseFloatingIPsOpen(false)}
        title="Release Floating IPs"
        description="Releasing the floating IPs is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Floating IPs
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>203.0.113.50</li>
              <li>203.0.113.51</li>
              <li>203.0.113.52</li>
              <li>203.0.113.53</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing these floating IPs may limit external access for the associated resource.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReleaseFloatingIPsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Floating IPs released');
              setIsReleaseFloatingIPsOpen(false);
            }}
            className="flex-1"
          >
            Release
          </Button>
        </div>
      </Modal>

      {/* Delete Load Balancer Admin Modal */}
      <Modal
        isOpen={isDeleteLoadBalancerAdminOpen}
        onClose={() => setIsDeleteLoadBalancerAdminOpen(false)}
        title="Delete Load Balancer"
        description="Removing the load balancer is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load balancer
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-lb-01
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this load balancer may affect the listeners, pools that depend on it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteLoadBalancerAdminOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Load balancer deleted');
              setIsDeleteLoadBalancerAdminOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Load Balancers Admin Modal */}
      <Modal
        isOpen={isDeleteLoadBalancersAdminOpen}
        onClose={() => setIsDeleteLoadBalancersAdminOpen(false)}
        title="Delete load balancers"
        description="Removing the load balancers is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load balancers that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-lb-01</li>
              <li>api-lb-01</li>
              <li>staging-lb-01</li>
              <li>dev-lb-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load balancers that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-lb (in use)</li>
              <li>gateway-lb (external)</li>
              <li>ha-lb-01 (high availability)</li>
              <li>critical-lb (protected)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these load balancers may affect the listeners, pools that depend on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteLoadBalancersAdminOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Load balancers deleted');
              setIsDeleteLoadBalancersAdminOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Listener Modal */}
      <Modal
        isOpen={isDeleteListenerOpen}
        onClose={() => setIsDeleteListenerOpen(false)}
        title="Delete Listener"
        description="Removing the listener is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Listener
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              http-listener-443
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteListenerOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Listener deleted');
              setIsDeleteListenerOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Listeners Modal */}
      <Modal
        isOpen={isDeleteListenersOpen}
        onClose={() => setIsDeleteListenersOpen(false)}
        title="Delete Listeners"
        description="Removing the listeners is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load balancers that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>http-listener-80</li>
              <li>https-listener-443</li>
              <li>api-listener-8080</li>
              <li>ws-listener-8443</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Load balancers that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-listener (in use)</li>
              <li>critical-listener (protected)</li>
              <li>ha-listener (high availability)</li>
              <li>gateway-listener (external)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteListenersOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Listeners deleted');
              setIsDeleteListenersOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Pool Modal */}
      <Modal
        isOpen={isDeletePoolOpen}
        onClose={() => setIsDeletePoolOpen(false)}
        title="Delete Pool"
        description="Removing the pool is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Pool
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-servers-pool
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this pool will also remove its associated members and health monitors.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeletePoolOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Pool deleted');
              setIsDeletePoolOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Pools Modal */}
      <Modal
        isOpen={isDeletePoolsOpen}
        onClose={() => setIsDeletePoolsOpen(false)}
        title="Delete pools"
        description="Removing the pools is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Listeners that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-servers-pool</li>
              <li>api-servers-pool</li>
              <li>staging-pool</li>
              <li>dev-pool</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Listeners that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-pool (in use)</li>
              <li>critical-pool (protected)</li>
              <li>ha-pool (high availability)</li>
              <li>gateway-pool (external)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these pools will also remove their associated members and health monitors.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeletePoolsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Pools deleted');
              setIsDeletePoolsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Member Modal */}
      <Modal
        isOpen={isDeleteMemberOpen}
        onClose={() => setIsDeleteMemberOpen(false)}
        title="Delete Member"
        description="Removing the member is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Member
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              192.168.1.10:8080
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Removing this member may affect traffic distribution for the pool.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteMemberOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Member deleted');
              setIsDeleteMemberOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Members Modal */}
      <Modal
        isOpen={isDeleteMembersOpen}
        onClose={() => setIsDeleteMembersOpen(false)}
        title="Delete Members"
        description="Removing the members is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Members that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>192.168.1.10:8080</li>
              <li>192.168.1.11:8080</li>
              <li>192.168.1.12:8080</li>
              <li>192.168.1.13:8080</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Members that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>192.168.1.1:8080 (primary)</li>
              <li>192.168.1.2:8080 (backup)</li>
              <li>192.168.1.3:8080 (protected)</li>
              <li>192.168.1.4:8080 (critical)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Removing these members may affect traffic distribution for the pool.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteMembersOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Members deleted');
              setIsDeleteMembersOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Security Group Rule Modal */}
      <Modal
        isOpen={isDeleteSecurityGroupRuleOpen}
        onClose={() => setIsDeleteSecurityGroupRuleOpen(false)}
        title="Delete Rule"
        description="Removing the rule group is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Rule
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              Ingress/TCP/443
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this rule may affect network access for the resources that rely on it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSecurityGroupRuleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security group rule deleted');
              setIsDeleteSecurityGroupRuleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Security Group Rules Modal */}
      <Modal
        isOpen={isDeleteSecurityGroupRulesOpen}
        onClose={() => setIsDeleteSecurityGroupRulesOpen(false)}
        title="Delete Rules"
        description="Removing the rules is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Rules that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>Ingress/TCP/80</li>
              <li>Ingress/TCP/443</li>
              <li>Egress/TCP/All</li>
              <li>Ingress/UDP/53</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Rules that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>Ingress/TCP/22 (SSH required)</li>
              <li>Egress/All/All (default)</li>
              <li>Ingress/ICMP/All (monitoring)</li>
              <li>Ingress/TCP/3389 (RDP required)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this rule may affect network access for the resources that rely on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteSecurityGroupRulesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security group rules deleted');
              setIsDeleteSecurityGroupRulesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete L7 Policy Modal */}
      <Modal
        isOpen={isDeleteL7PolicyOpen}
        onClose={() => setIsDeleteL7PolicyOpen(false)}
        title="Delete L7 Policy"
        description="Removing the L7 policy is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              L7 Policy
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              redirect-to-https
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this L7 policy may affect traffic routing for the listener.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteL7PolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('L7 policy deleted');
              setIsDeleteL7PolicyOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete L7 Policies Modal */}
      <Modal
        isOpen={isDeleteL7PoliciesOpen}
        onClose={() => setIsDeleteL7PoliciesOpen(false)}
        title="Delete L7 Policies"
        description="Removing the L7 policies is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              L7 Policies that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>redirect-to-https</li>
              <li>block-bad-bots</li>
              <li>rate-limit-api</li>
              <li>geo-redirect</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              L7 Policies that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>default-redirect (system)</li>
              <li>security-headers (required)</li>
              <li>cors-policy (protected)</li>
              <li>auth-redirect (critical)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these L7 policies may affect traffic routing for the listeners.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteL7PoliciesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('L7 policies deleted');
              setIsDeleteL7PoliciesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Health Monitor Modal */}
      <Modal
        isOpen={isDeleteHealthMonitorOpen}
        onClose={() => setIsDeleteHealthMonitorOpen(false)}
        title="Delete Health Monitor"
        description="Removing the health monitor is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Health Monitor
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              http-health-check
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this health monitor may affect the pool&apos;s ability to detect unhealthy
              members.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteHealthMonitorOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Health monitor deleted');
              setIsDeleteHealthMonitorOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Policy Modal */}
      <Modal
        isOpen={isDeleteFirewallPolicyOpen}
        onClose={() => setIsDeleteFirewallPolicyOpen(false)}
        title="Delete Firewall Policy"
        description="Deleting the firewall policy is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewall Policy
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              web-policy-01
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteFirewallPolicyOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall policy deleted');
              setIsDeleteFirewallPolicyOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Policies Modal */}
      <Modal
        isOpen={isDeleteFirewallPoliciesOpen}
        onClose={() => setIsDeleteFirewallPoliciesOpen(false)}
        title="Delete Firewall Policies"
        description="Removing the selected firewall policies is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewall policies that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-policy-01</li>
              <li>api-policy-01</li>
              <li>staging-policy</li>
              <li>dev-policy</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewall policies that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-policy (in use)</li>
              <li>gateway-policy (system)</li>
              <li>default-policy (protected)</li>
              <li>critical-policy (in use)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteFirewallPoliciesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall policies deleted');
              setIsDeleteFirewallPoliciesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Rule Modal */}
      <Modal
        isOpen={isDeleteFirewallRuleOpen}
        onClose={() => setIsDeleteFirewallRuleOpen(false)}
        title="Delete Firewall Rule"
        description="Deleting the firewall rule is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewall Rule
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              allow-https-443
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteFirewallRuleOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall rule deleted');
              setIsDeleteFirewallRuleOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Rules Modal */}
      <Modal
        isOpen={isDeleteFirewallRulesOpen}
        onClose={() => setIsDeleteFirewallRulesOpen(false)}
        title="Delete Firewall Rules"
        description="Removing the selected firewall rules is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewall rules that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>allow-https-443</li>
              <li>allow-http-80</li>
              <li>allow-ssh-22</li>
              <li>allow-dns-53</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Firewall rules that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>default-egress (system)</li>
              <li>management-access (protected)</li>
              <li>monitoring-rule (required)</li>
              <li>critical-ingress (in use)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteFirewallRulesOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall rules deleted');
              setIsDeleteFirewallRulesOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Tenant Modal */}
      <Modal
        isOpen={isDeleteTenantOpen}
        onClose={() => setIsDeleteTenantOpen(false)}
        title="Delete Tenant"
        description="Deleting the tenant is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Tenant
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              project-alpha
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this tenant does not delete the resources inside it. Those resources will
              remain and must be managed separately.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteTenantOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Tenant deleted');
              setIsDeleteTenantOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Tenants Modal */}
      <Modal
        isOpen={isDeleteTenantsOpen}
        onClose={() => setIsDeleteTenantsOpen(false)}
        title="Delete Tenant"
        description="Removing the selected tenants is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Tenants
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>project-alpha</li>
              <li>project-beta</li>
              <li>project-gamma</li>
              <li>project-delta</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these tenants does not delete the resources inside them. Those resources will
              remain and must be managed separately.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteTenantsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Tenants deleted');
              setIsDeleteTenantsOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Metadata Modal */}
      <Modal
        isOpen={isDeleteMetadataOpen}
        onClose={() => setIsDeleteMetadataOpen(false)}
        title="Delete Metadata"
        description="This action removes the metadata."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Metadata
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              environment=production
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteMetadataOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Metadata deleted');
              setIsDeleteMetadataOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Delete Metadatas Modal */}
      <Modal
        isOpen={isDeleteMetadatasOpen}
        onClose={() => setIsDeleteMetadatasOpen(false)}
        title="Delete Metadata"
        description="This action removes the selected metadata."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Metadata that can be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>environment=production</li>
              <li>team=platform</li>
              <li>cost-center=eng-001</li>
              <li>owner=admin</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Metadata that cannot be delete
            </span>
            <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>system-id=xyz (system)</li>
              <li>created-by=admin (protected)</li>
              <li>managed-by=openstack (required)</li>
              <li>instance-type=vm (system)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsDeleteMetadatasOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Metadatas deleted');
              setIsDeleteMetadatasOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Manage Member Modal */}
      <Modal
        isOpen={isManageMemberOpen}
        onClose={() => setIsManageMemberOpen(false)}
        title="Manage Member"
        description="User management for this project is handled in the IAM app. You will be redirected to IAM to manage users and user groups."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Tenant
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              project-alpha
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsManageMemberOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Redirecting to IAM');
              setIsManageMemberOpen(false);
            }}
            className="flex-1"
          >
            Go to IAM
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalsPage;
