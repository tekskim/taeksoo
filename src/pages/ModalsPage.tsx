import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { TopBar, Breadcrumb, TabBar } from '@/design-system';
import { Button, VStack, HStack, Badge, Modal, Disclosure } from '@/design-system';
import { IconAlertCircle, IconChevronRight, IconChevronDown, IconCopy, IconCheck } from '@tabler/icons-react';

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
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
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
  const [isDeleteSecurityGroupsMultipleOpen, setIsDeleteSecurityGroupsMultipleOpen] = useState(false);
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
  const [usernameCopied, setUsernameCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  
  // Disclosure states
  const [isComputeOpen, setIsComputeOpen] = useState(false);
  const [isIAMOpen, setIsIAMOpen] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);

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
                  { label: 'Modals' },
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
                  Modal components
                </h1>
                <p className="text-[14px] text-[var(--color-text-subtle)]">
                  Collection of modal components used across the application. Click to preview each modal.
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
                        <Badge variant="info" size="sm" className="w-[70px] justify-center">Compute</Badge>
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
                        <Badge variant="info" size="sm" className="w-[70px] justify-center">IAM</Badge>
                        <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Modals
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          (18 modals)
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
                        <Badge variant="info" size="sm" className="w-[70px] justify-center">Container</Badge>
                        <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Modals
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          (0 modals)
                        </span>
                      </div>
                    </div>
                  </Disclosure.Trigger>
                  <Disclosure.Panel>
                    <div className="p-6 mt-4 rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                      <VStack gap={2} className="items-center justify-center h-full">
                        <p className="text-[14px] text-[var(--color-text-muted)]">
                          Container modals will be added here...
                        </p>
                      </VStack>
                    </div>
                  </Disclosure.Panel>
                </Disclosure>

                {/* Storage App Modals - Placeholder for future */}
                <Disclosure open={isStorageOpen} onChange={setIsStorageOpen}>
                  <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                    <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
                      <div className="flex items-center gap-3">
                        {isStorageOpen ? (
                          <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
                        ) : (
                          <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
                        )}
                        <Badge variant="info" size="sm" className="w-[70px] justify-center">Storage</Badge>
                        <span className="text-[14px] font-semibold text-[var(--color-text-default)]">
                          Modals
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          (0 modals)
                        </span>
                      </div>
                    </div>
                  </Disclosure.Trigger>
                  <Disclosure.Panel>
                    <div className="p-6 mt-4 rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                      <VStack gap={2} className="items-center justify-center h-full">
                        <p className="text-[14px] text-[var(--color-text-muted)]">
                          Storage modals will be added here...
                        </p>
                      </VStack>
                    </div>
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
        description="Are you sure you want to delete this Snapshot?"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Snapshot Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Snapshot name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              2cdfafc1
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting a snapshot is a permanent action and cannot be undone. Any volumes or instances created from this snapshot will not be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsConfirmDeleteOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description="Are you sure you want to delete this security group? This action cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Security group Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Security group
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              sg-01
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security group and all its rules.
              <br />
              If this group is attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteSecurityGroupOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description="Are you sure you want to delete the selected security groups? This action cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Security groups Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security groups and all its rules.
              <br />
              If these groups are attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteSecurityGroupsMultipleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description="Are you sure you want to delete this rule? This action cannot be undone."
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
          <Button variant="outline" size="md" onClick={() => setIsDeleteRuleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description="Are you sure you want to delete the selected rules? This action cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Rules Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This action will permanently delete the selected rules.
              <br />
              If these rules are attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteRulesMultipleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description="Are you sure you want to detach this volume?"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Volume name
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              vol57
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Make sure the filesystem inside the instance is unmounted before detaching. Detaching a volume while the instance is running may cause data corruption.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDetachVolumeOpen(false)} className="flex-1">
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
        description="Are you sure you want to delete this template? Large volume backups may impact performance and network throughput."
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
          <Button variant="outline" size="md" onClick={() => setIsRestoreBackupSmallOpen(false)} className="flex-1">
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
        description="Are you sure you want to delete this template? Large volume backups may impact performance and network throughput."
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
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
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
          <Button variant="outline" size="md" onClick={() => setIsRestoreBackupMediumOpen(false)} className="flex-1">
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
        description="Are you sure you want to delete this template? Large volume backups may impact performance and network throughput."
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
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Restore cannot proceed. Change the backup status to Available or shut down the attached instance.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsRestoreBackupLargeOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            disabled
            className="flex-1"
          >
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
          <Button variant="outline" size="md" onClick={() => setIsDisassociateFloatingIPOpen(false)} className="flex-1">
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
          <Button variant="outline" size="md" onClick={() => setIsDisassociateFloatingIPLBOpen(false)} className="flex-1">
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
        description="Are you sure you want to release this floating IP? This action cannot be undone."
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing will detach this IP from its target and remove it from your project. External access via this IP will stop immediately.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsReleaseFloatingIPSmallOpen(false)} className="flex-1">
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
        description="Are you sure you want to release this floating IP? This action cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Associated to Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Releasing will detach these IPs from their target and remove them from your project. External access via these IP will stop immediately.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsReleaseFloatingIPMediumOpen(false)} className="flex-1">
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
        description="Are you sure you want to delete this load balancer? This action cannot be undone."
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              All listeners, pools, and members associated with it will be removed.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteLoadBalancerOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description="Are you sure you want to delete the selected load balancers? This action cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Load balancers Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              All listeners, pools, and members associated with them will be removed.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteLoadBalancersMultipleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description={<>Are you sure you want to delete user "DISPLAY NAME"?<br />Deletes user "DISPLAY NAME" permanently.</>}
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this user will permanently remove all associated access and sessions. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteUserOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description="Are you sure you want to delete these users?"
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Users that can be deleted Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
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
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these users will permanently remove all associated access and sessions. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsDeleteUsersMultipleOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="primary" 
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
        description="Are you sure you want to detach user 'DISPLAY NAME' from this group?"
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Detaching this user will immediately remove all permissions granted through this group.
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
        description={`Are you sure you want to detach role "ROLENAME" from user "DISPLAYNAME"?`}
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
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              ROLENAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
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
        description="Are you sure you want to remove OTP MFA for user 'DISPLAYNAME'?"
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
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
        description="Are you sure you want to terminate all sessions for user 'DISPLAYNAME'?"
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Terminating all sessions will immediately sign the user out from all devices and require re-authentication.
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
        description="Are you sure you want to terminate this session?"
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Terminating this session will sign the user out from this device and require re-authentication.
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
        description="Are you sure you want to remove user 'DISPLAYNAME' from group 'GROUPNAME'?"
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
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
        description="Are you sure you want to delete role 'ROLENAME'?"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Role Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Role
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              ROLENAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
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
            variant="primary" 
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
        description="Are you sure you want to delete these roles?"
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Roles that can be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Roles that can be deleted
            </span>
            <ul className="list-disc list-inside text-[12px] text-[var(--color-text-default)] leading-4">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>web-server-03</li>
              <li>web-server-05</li>
              <li>web-server-07</li>
            </ul>
          </div>

          {/* Roles that cannot be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Roles that cannot be deleted
            </span>
            <ul className="list-disc list-inside text-[12px] text-[var(--color-text-default)] leading-4">
              <li>my-server-04 (Locked instances cannot be deleted.)</li>
              <li>my-server-03 (Instances in current state cannot be deleted.)</li>
              <li>my-server-02</li>
              <li>my-server-82</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting these roles will immediately remove all permissions granted through these roles.
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
            variant="primary" 
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
        description="Are you sure you want to detach this policy from the role?"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Role Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Role
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              ROLENAME
            </span>
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Detaching this policy will immediately revoke permissions granted to this role through this policy.
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
        description="Are you sure you want to delete this policy?"
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
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              This policy will be permanently removed. Users or roles attached to this policy will immediately lose access permissions.
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
            variant="primary" 
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
        description="Are you sure you want to delete these policies"
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Policies that can be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Policies that can be deleted
            </span>
            <ul className="list-disc list-inside text-[12px] text-[var(--color-text-default)] leading-4">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>web-server-03</li>
              <li>web-server-05</li>
              <li>web0server-07</li>
            </ul>
          </div>

          {/* Policies that cannot be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto sidebar-scroll">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Policies that cannot be deleted
            </span>
            <ul className="list-disc list-inside text-[12px] text-[var(--color-text-default)] leading-4">
              <li>my-server-04 (Locked instances cannot be deleted.)</li>
              <li>my-server-03 (Instances in current state cannot be deleted.)</li>
              <li>my-server-02</li>
              <li>my-server-82</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              These policies will be permanently removed. Users or roles attached to these policies will immediately lose access permissions.
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
            variant="primary" 
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
        description="Are you sure you want to revert policy 'POLICYNAME' to 'VERSION'?"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Current Version Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Current version
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              VERSION
            </span>
          </div>

          {/* Target Version Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Target version
            </span>
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              VERSION
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Reverting to this version will immediately replace the currently active policy and may change permissions for all roles using it.
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
        description={`Are you sure you want to delete "VERSION"?`}
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Deleting this version will permanently remove its policy definitions. This action cannot be undone.
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
            variant="primary" 
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
        description="Are you sure you want to apply these changes?"
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              Changes
            </span>
            <ul className="list-disc list-inside text-[12px] text-[var(--color-text-default)] leading-4">
              <li>MFA enforcement: Voluntary → Required for all users</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
            <p className="text-[11px] text-[var(--color-text-default)] leading-4">
              Updating MFA enforcement may immediately affect authentication requirements for all users.
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
    </div>
  );
}

export default ModalsPage;

