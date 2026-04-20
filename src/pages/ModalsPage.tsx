import { useState, useCallback, createContext, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Modal,
  ConfirmModal,
  VStack,
  HStack,
  PageShell,
  TopBar,
  SearchInput,
  Badge,
  Disclosure,
} from '@/design-system';
import {
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconArrowLeft,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';

const ModalSearchContext = createContext('');

interface ModalListItemProps {
  title: string;
  description: string;
  category?: string;
  onOpen: () => void;
}

function ModalListItem({ title, description, category, onOpen }: ModalListItemProps) {
  const searchQuery = useContext(ModalSearchContext);
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
      className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)] transition-colors cursor-pointer group"
      onClick={onOpen}
    >
      <HStack gap={4} className="flex-1 items-center min-w-0">
        {category && (
          <Badge variant="info" size="sm" className="shrink-0 w-[100px] justify-center">
            {category}
          </Badge>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-label-lg text-[var(--color-text-default)] truncate">{title}</h3>
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
        Open
      </Button>
    </div>
  );
}

function DangerWarning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
      <IconAlertCircle size={14} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" />
      <p className="text-body-sm text-[var(--color-text-default)] leading-4">{children}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3 flex flex-col gap-1.5">
      <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">{label}</span>
      <span className="text-body-md text-[var(--color-text-default)] leading-4">{value}</span>
    </div>
  );
}

function InfoBoxCopyable({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3 flex flex-col gap-1.5">
      <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-body-md text-[var(--color-text-default)] leading-4">{value}</span>
        <button
          type="button"
          className={`shrink-0 transition-colors cursor-pointer bg-transparent border-0 p-0 ${copied ? 'text-[var(--color-state-success)]' : 'text-[var(--color-text-default)] hover:text-[var(--color-text-muted)]'}`}
          onClick={() => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          aria-label={`Copy ${label}`}
        >
          {copied ? <IconCheck size={14} stroke={2} /> : <IconCopy size={14} stroke={1.5} />}
        </button>
      </div>
    </div>
  );
}

function ScrollableList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
      <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">{label}</span>
      <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ModalButtons({
  onClose,
  onConfirm,
  confirmText = 'Delete',
  confirmVariant = 'danger',
}: {
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
}) {
  return (
    <div className="flex gap-2 w-full">
      <Button variant="outline" onClick={onClose} className="flex-1">
        Cancel
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm || onClose} className="flex-1">
        {confirmText}
      </Button>
    </div>
  );
}

interface SectionHeaderProps {
  label: string;
  badgeVariant?: 'info' | 'warning';
  count: number;
  isOpen: boolean;
  isSearching: boolean;
}

function SectionHeader({
  label,
  badgeVariant = 'info',
  count,
  isOpen,
  isSearching,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
      <div className="flex items-center gap-3">
        {isSearching || isOpen ? (
          <IconChevronDown size={16} className="text-[var(--color-text-subtle)]" />
        ) : (
          <IconChevronRight size={16} className="text-[var(--color-text-subtle)]" />
        )}
        <Badge variant={badgeVariant} size="sm" className="w-[110px] justify-center">
          {label}
        </Badge>
        <span className="text-body-lg font-semibold text-[var(--color-text-default)]">Modals</span>
        <span className="text-body-md text-[var(--color-text-subtle)]">({count} modals)</span>
      </div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
      {children}
    </h2>
  );
}

export function ModalsPage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const openModal = searchParams.get('modal');
  const openModalFn = useCallback(
    (id: string) => setSearchParams({ modal: id }, { replace: true }),
    [setSearchParams]
  );
  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('modal');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const [modalSearch, setModalSearch] = useState('');
  const isSearching = modalSearch.trim().length > 0;

  const [isComputeOpen, setIsComputeOpen] = useState(false);
  const [isIAMOpen, setIsIAMOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [isComputeAdminOpen, setIsComputeAdminOpen] = useState(false);
  const [isCloudBuilderOpen, setIsCloudBuilderOpen] = useState(false);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);

  const [usernameCopied, setUsernameCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

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
              <h1 className="text-heading-h5 text-[var(--color-text-default)]">Modal Components</h1>
            </HStack>
          }
        />
      }
      contentClassName="max-w-7xl mx-auto px-8 py-8"
    >
      <ModalSearchContext.Provider value={modalSearch}>
        <VStack gap={8}>
          <VStack gap={4}>
            <p className="text-body-lg text-[var(--color-text-subtle)]">
              Collection of modal components used across the application. Click to preview each
              modal.
            </p>
            <SearchInput
              placeholder="Search modals by name, description, or category..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              className="w-[400px]"
            />
          </VStack>

          <VStack gap={4}>
            {/* ============================================================
               COMPUTE
               ============================================================ */}
            <Disclosure open={isSearching || isComputeOpen} onChange={setIsComputeOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <SectionHeader
                  label="Compute"
                  count={15}
                  isOpen={isComputeOpen}
                  isSearching={isSearching}
                />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  <VStack gap={2}>
                    <SubHeading>Snapshot / Security group</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete snapshot"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Snapshot"
                        onOpen={() => openModalFn('delete-snapshot')}
                      />
                      <ModalListItem
                        title="Delete security group"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Security"
                        onOpen={() => openModalFn('delete-security-group')}
                      />
                      <ModalListItem
                        title="Delete security groups"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Security"
                        onOpen={() => openModalFn('delete-security-groups')}
                      />
                      <ModalListItem
                        title="Delete rule"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Security"
                        onOpen={() => openModalFn('delete-rule')}
                      />
                      <ModalListItem
                        title="Delete rules"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Security"
                        onOpen={() => openModalFn('delete-rules')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Volume / Backup</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Detach volume"
                        description="This action detaches the volume."
                        category="Volume"
                        onOpen={() => openModalFn('detach-volume')}
                      />
                      <ModalListItem
                        title="Restore backup"
                        description="This action restores the backup."
                        category="Backup"
                        onOpen={() => openModalFn('restore-backup-sm')}
                      />
                      <ModalListItem
                        title="Restore backup (medium)"
                        description="This action restores the backup."
                        category="Backup"
                        onOpen={() => openModalFn('restore-backup-md')}
                      />
                      <ModalListItem
                        title="Restore backup (large)"
                        description="This action restores the backup."
                        category="Backup"
                        onOpen={() => openModalFn('restore-backup-lg')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Floating IP / Load balancer</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Disassociate floating IP"
                        description="Disassociating will detach the floating IP from the selected resource."
                        category="FIP"
                        onOpen={() => openModalFn('disassociate-fip')}
                      />
                      <ModalListItem
                        title="Disassociate floating IP (LB)"
                        description="Disassociating will detach the floating IP from this load balancer."
                        category="FIP"
                        onOpen={() => openModalFn('disassociate-fip-lb')}
                      />
                      <ModalListItem
                        title="Release floating IP"
                        description="This action releases the floating IP."
                        category="FIP"
                        onOpen={() => openModalFn('release-fip')}
                      />
                      <ModalListItem
                        title="Release floating IPs"
                        description="This action releases the floating IP."
                        category="FIP"
                        onOpen={() => openModalFn('release-fips')}
                      />
                      <ModalListItem
                        title="Delete load balancer"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="LB"
                        onOpen={() => openModalFn('delete-lb')}
                      />
                      <ModalListItem
                        title="Release load balancers"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="LB"
                        onOpen={() => openModalFn('release-lbs')}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* ============================================================
               IAM
               ============================================================ */}
            <Disclosure open={isSearching || isIAMOpen} onChange={setIsIAMOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <SectionHeader
                  label="IAM"
                  count={39}
                  isOpen={isIAMOpen}
                  isSearching={isSearching}
                />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  <VStack gap={2}>
                    <SubHeading>User management</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete user"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="User"
                        onOpen={() => openModalFn('delete-user')}
                      />
                      <ModalListItem
                        title="Delete users"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="User"
                        onOpen={() => openModalFn('delete-users')}
                      />
                      <ModalListItem
                        title="Confirm user password"
                        description="Review the username and password. The password can only be viewed at this step."
                        category="User"
                        onOpen={() => openModalFn('confirm-password')}
                      />
                      <ModalListItem
                        title="Unsaved changes"
                        description="Any unsaved changes will be lost. Do you want to leave?"
                        category="General"
                        onOpen={() => openModalFn('unsaved-changes')}
                      />
                      <ModalListItem
                        title="Detach user group"
                        description="This action detaches the user from the group."
                        category="Group"
                        onOpen={() => openModalFn('detach-user-group')}
                      />
                      <ModalListItem
                        title="Detach role"
                        description="This action detaches the role from the user."
                        category="Role"
                        onOpen={() => openModalFn('detach-role')}
                      />
                      <ModalListItem
                        title="Remove OTP MFA"
                        description="This action removes OTP MFA for the user."
                        category="MFA"
                        onOpen={() => openModalFn('remove-otp-mfa')}
                      />
                      <ModalListItem
                        title="Terminate all sessions"
                        description="This action terminates all sessions for the user."
                        category="Session"
                        onOpen={() => openModalFn('terminate-all-sessions')}
                      />
                      <ModalListItem
                        title="Terminate session"
                        description="This action terminates the session."
                        category="Session"
                        onOpen={() => openModalFn('terminate-session')}
                      />
                      <ModalListItem
                        title="Remove user"
                        description="This action removes the user from the group."
                        category="Group"
                        onOpen={() => openModalFn('remove-user')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Role / Policy</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete role"
                        description="If this role has active temporary grants, deleting it removes all of those grants."
                        category="Role"
                        onOpen={() => openModalFn('delete-role')}
                      />
                      <ModalListItem
                        title="Delete roles"
                        description="If any selected roles have active temporary grants, deleting them removes all of those grants."
                        category="Role"
                        onOpen={() => openModalFn('delete-roles')}
                      />
                      <ModalListItem
                        title="Revoke access"
                        description="Temporary access is revoked immediately, regardless of the scheduled end time."
                        category="Role"
                        onOpen={() => openModalFn('revoke-access-single')}
                      />
                      <ModalListItem
                        title="Revoke access (bulk)"
                        description="Temporary access is revoked immediately, regardless of the scheduled end time."
                        category="Role"
                        onOpen={() => openModalFn('revoke-access-bulk')}
                      />
                      <ModalListItem
                        title="Detach policy"
                        description="This action detaches the policy from the role."
                        category="Policy"
                        onOpen={() => openModalFn('detach-policy')}
                      />
                      <ModalListItem
                        title="Delete policy"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Policy"
                        onOpen={() => openModalFn('delete-policy')}
                      />
                      <ModalListItem
                        title="Delete policies"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Policy"
                        onOpen={() => openModalFn('delete-policies')}
                      />
                      <ModalListItem
                        title="Revert policy version"
                        description="This action reverts the policy to the selected version."
                        category="Policy"
                        onOpen={() => openModalFn('revert-policy-version')}
                      />
                      <ModalListItem
                        title="Delete policy version"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Policy"
                        onOpen={() => openModalFn('delete-policy-version')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Policy settings</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Update MFA enforcement policy"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-mfa-policy')}
                      />
                      <ModalListItem
                        title="Update OTP policy (enable)"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-otp-enable')}
                      />
                      <ModalListItem
                        title="Update OTP policy (disable)"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-otp-disable')}
                      />
                      <ModalListItem
                        title="Update email policy (enable)"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-email-enable')}
                      />
                      <ModalListItem
                        title="Update email policy (disable)"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-email-disable')}
                      />
                      <ModalListItem
                        title="Update general session policy"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-session-policy')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Domain / Admin</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete domain"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Domain"
                        onOpen={() => openModalFn('delete-domain')}
                      />
                      <ModalListItem
                        title="Switch to domain"
                        description="Any unsaved changes may be lost when switching to another domain."
                        category="Domain"
                        onOpen={() => openModalFn('switch-domain')}
                      />
                      <ModalListItem
                        title="Delete system administrator"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Admin"
                        onOpen={() => openModalFn('delete-system-admin')}
                      />
                      <ModalListItem
                        title="Update password policy"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-password-policy')}
                      />
                      <ModalListItem
                        title="Update account lockout policy"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-lockout-policy')}
                      />
                      <ModalListItem
                        title="Update token policy"
                        description="This action applies the changes."
                        category="Policy"
                        onOpen={() => openModalFn('update-token-policy')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Service Account</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Regenerate client secret"
                        description="The current secret stops working immediately."
                        category="Service Account"
                        onOpen={() => openModalFn('regenerate-client-secret')}
                      />
                      <ModalListItem
                        title="New client secret (result)"
                        description="Credentials are shown only once. Copy and store them securely."
                        category="Service Account"
                        onOpen={() => openModalFn('new-client-secret')}
                      />
                      <ModalListItem
                        title="New API key (result)"
                        description="Credentials are shown only once. Copy and store them securely."
                        category="Service Account"
                        onOpen={() => openModalFn('new-api-key')}
                      />
                      <ModalListItem
                        title="Reset API key"
                        description="The current key stops working immediately."
                        category="Service Account"
                        onOpen={() => openModalFn('reset-api-key')}
                      />
                      <ModalListItem
                        title="Delete API key"
                        description="This key stops working immediately and cannot be restored."
                        category="Service Account"
                        onOpen={() => openModalFn('delete-api-key')}
                      />
                      <ModalListItem
                        title="Delete service account"
                        description="All credentials and permission bindings will be removed."
                        category="Service Account"
                        onOpen={() => openModalFn('delete-service-account')}
                      />
                      <ModalListItem
                        title="Delete service accounts"
                        description="All credentials and permission bindings for these accounts will be removed."
                        category="Service Account"
                        onOpen={() => openModalFn('delete-service-accounts')}
                      />
                      <ModalListItem
                        title="New client secret (close)"
                        description="Credentials are shown only once. Uses Close button variant."
                        category="Service Account"
                        onOpen={() => openModalFn('new-client-secret-close')}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* ============================================================
               STORAGE
               ============================================================ */}
            <Disclosure open={isSearching || isStorageOpen} onChange={setIsStorageOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <SectionHeader
                  label="Storage"
                  count={1}
                  isOpen={isStorageOpen}
                  isSearching={isSearching}
                />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete bucket"
                      description="This action permanently deletes the bucket and all its contents."
                      category="Bucket"
                      onOpen={() => openModalFn('delete-bucket')}
                    />
                  </div>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* ============================================================
               CONTAINER
               ============================================================ */}
            <Disclosure open={isSearching || isContainerOpen} onChange={setIsContainerOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <SectionHeader
                  label="Container"
                  count={12}
                  isOpen={isContainerOpen}
                  isSearching={isSearching}
                />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  <VStack gap={2}>
                    <SubHeading>Delete resources</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete cluster"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Cluster"
                        onOpen={() => openModalFn('delete-cluster')}
                      />
                      <ModalListItem
                        title="Delete namespace"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Namespace"
                        onOpen={() => openModalFn('delete-namespace')}
                      />
                      <ModalListItem
                        title="Delete pod"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Pod"
                        onOpen={() => openModalFn('delete-pod')}
                      />
                      <ModalListItem
                        title="Delete job"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Job"
                        onOpen={() => openModalFn('delete-job')}
                      />
                      <ModalListItem
                        title="Delete CronJob"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="CronJob"
                        onOpen={() => openModalFn('delete-cronjob')}
                      />
                      <ModalListItem
                        title="Delete deployment"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Deployment"
                        onOpen={() => openModalFn('delete-deployment')}
                      />
                      <ModalListItem
                        title="Delete StatefulSet"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="StatefulSet"
                        onOpen={() => openModalFn('delete-statefulset')}
                      />
                      <ModalListItem
                        title="Delete DaemonSet"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="DaemonSet"
                        onOpen={() => openModalFn('delete-daemonset')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Workload actions</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Redeploy deployment"
                        description="Are you sure you want to redeploy this deployment?"
                        category="Deployment"
                        onOpen={() => openModalFn('redeploy-deployment')}
                      />
                      <ModalListItem
                        title="Redeploy StatefulSet"
                        description="Are you sure you want to redeploy this StatefulSet?"
                        category="StatefulSet"
                        onOpen={() => openModalFn('redeploy-statefulset')}
                      />
                      <ModalListItem
                        title="Redeploy DaemonSet"
                        description="Are you sure you want to redeploy this DaemonSet?"
                        category="DaemonSet"
                        onOpen={() => openModalFn('redeploy-daemonset')}
                      />
                      <ModalListItem
                        title="Roll back deployment"
                        description="Select a revision to roll back to."
                        category="Deployment"
                        onOpen={() => openModalFn('rollback-deployment')}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* ============================================================
               COMPUTE ADMIN
               ============================================================ */}
            <Disclosure open={isSearching || isComputeAdminOpen} onChange={setIsComputeAdminOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <SectionHeader
                  label="Compute Admin"
                  badgeVariant="warning"
                  count={71}
                  isOpen={isComputeAdminOpen}
                  isSearching={isSearching}
                />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  <VStack gap={2}>
                    <SubHeading>Instance actions (single)</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Stop instance"
                        description="This action stops the instance."
                        category="Instance"
                        onOpen={() => openModalFn('admin-stop-instance')}
                      />
                      <ModalListItem
                        title="Reboot instance"
                        description="This action reboots the instance."
                        category="Instance"
                        onOpen={() => openModalFn('admin-reboot-instance')}
                      />
                      <ModalListItem
                        title="Soft reboot instance"
                        description="This action performs a soft reboot of the instance."
                        category="Instance"
                        onOpen={() => openModalFn('admin-soft-reboot')}
                      />
                      <ModalListItem
                        title="Confirm resize"
                        description="This action confirms the resized state of the instance."
                        category="Instance"
                        onOpen={() => openModalFn('admin-confirm-resize')}
                      />
                      <ModalListItem
                        title="Revert resize"
                        description="This action reverts the instance to its previous state before the resize."
                        category="Instance"
                        onOpen={() => openModalFn('admin-revert-resize')}
                      />
                      <ModalListItem
                        title="Delete instance"
                        description="Removing the instance is permanent and cannot be undone."
                        category="Instance"
                        onOpen={() => openModalFn('admin-delete-instance')}
                      />
                      <ModalListItem
                        title="Shelve instance"
                        description="This action shelves the instance."
                        category="Instance"
                        onOpen={() => openModalFn('admin-shelve-instance')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Instance actions (bulk)</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Start instances"
                        description="This action starts the selected instances."
                        category="Instance"
                        onOpen={() => openModalFn('admin-start-instances')}
                      />
                      <ModalListItem
                        title="Stop instances"
                        description="This action stops the selected instances."
                        category="Instance"
                        onOpen={() => openModalFn('admin-stop-instances')}
                      />
                      <ModalListItem
                        title="Reboot instances"
                        description="This action reboots the selected instances."
                        category="Instance"
                        onOpen={() => openModalFn('admin-reboot-instances')}
                      />
                      <ModalListItem
                        title="Delete instances"
                        description="Removing the selected instances is permanent and cannot be undone."
                        category="Instance"
                        onOpen={() => openModalFn('admin-delete-instances')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Templates / Images / Snapshots</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete instance template"
                        description="Deleting the instance template is permanent and cannot be undone."
                        category="Template"
                        onOpen={() => openModalFn('admin-delete-template')}
                      />
                      <ModalListItem
                        title="Delete instance templates"
                        description="Deleting the selected instance templates is permanent and cannot be undone."
                        category="Template"
                        onOpen={() => openModalFn('admin-delete-templates')}
                      />
                      <ModalListItem
                        title="Delete image"
                        description="Deleting the image is permanent and cannot be undone."
                        category="Image"
                        onOpen={() => openModalFn('admin-delete-image')}
                      />
                      <ModalListItem
                        title="Delete images"
                        description="Deleting the selected images is permanent and cannot be undone."
                        category="Image"
                        onOpen={() => openModalFn('admin-delete-images')}
                      />
                      <ModalListItem
                        title="Delete snapshot"
                        description="Deleting the snapshot is permanent and cannot be undone."
                        category="Snapshot"
                        onOpen={() => openModalFn('admin-delete-snapshot')}
                      />
                      <ModalListItem
                        title="Delete snapshots"
                        description="Deleting the selected snapshots is permanent and cannot be undone."
                        category="Snapshot"
                        onOpen={() => openModalFn('admin-delete-snapshots')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Volumes / Types / Backups</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete volume"
                        description="Deleting the volume is permanent and cannot be undone."
                        category="Volume"
                        onOpen={() => openModalFn('admin-delete-volume')}
                      />
                      <ModalListItem
                        title="Delete volumes"
                        description="Deleting the selected volumes is permanent and cannot be undone."
                        category="Volume"
                        onOpen={() => openModalFn('admin-delete-volumes')}
                      />
                      <ModalListItem
                        title="Delete volume type"
                        description="Deleting the volume type is permanent and cannot be undone."
                        category="VolumeType"
                        onOpen={() => openModalFn('admin-delete-volume-type')}
                      />
                      <ModalListItem
                        title="Delete volume types"
                        description="Deleting the selected volume types is permanent and cannot be undone."
                        category="VolumeType"
                        onOpen={() => openModalFn('admin-delete-volume-types')}
                      />
                      <ModalListItem
                        title="Delete backup"
                        description="Deleting the backup is permanent and cannot be undone."
                        category="Backup"
                        onOpen={() => openModalFn('admin-delete-backup')}
                      />
                      <ModalListItem
                        title="Delete backups"
                        description="Deleting the selected backups is permanent and cannot be undone."
                        category="Backup"
                        onOpen={() => openModalFn('admin-delete-backups')}
                      />
                      <ModalListItem
                        title="Delete encryption"
                        description="This action removes the encryption configuration from the volume type."
                        category="Encryption"
                        onOpen={() => openModalFn('admin-delete-encryption')}
                      />
                      <ModalListItem
                        title="Delete extra spec"
                        description="This action removes the extra specification from the volume type."
                        category="ExtraSpec"
                        onOpen={() => openModalFn('admin-delete-extra-spec')}
                      />
                      <ModalListItem
                        title="Delete extra specs"
                        description="Deleting the selected extra specifications is permanent and cannot be undone."
                        category="ExtraSpec"
                        onOpen={() => openModalFn('admin-delete-extra-specs')}
                      />
                      <ModalListItem
                        title="Delete QoS spec"
                        description="This action removes the QoS specification."
                        category="QoS"
                        onOpen={() => openModalFn('admin-delete-qos-spec')}
                      />
                      <ModalListItem
                        title="Delete QoS specs"
                        description="This action removes the selected QoS specifications."
                        category="QoS"
                        onOpen={() => openModalFn('admin-delete-qos-specs')}
                      />
                      <ModalListItem
                        title="Delete extra spec (QoS)"
                        description="This action removes the extra specification from the volume type."
                        category="QoS"
                        onOpen={() => openModalFn('admin-delete-extra-spec-qos')}
                      />
                      <ModalListItem
                        title="Delete extra specs (QoS)"
                        description="Deleting the selected extra specifications is permanent and cannot be undone."
                        category="QoS"
                        onOpen={() => openModalFn('admin-delete-extra-specs-qos')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Networks / Subnets / Ports / Routers</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete network"
                        description="Deleting the network is permanent and cannot be undone."
                        category="Network"
                        onOpen={() => openModalFn('admin-delete-network')}
                      />
                      <ModalListItem
                        title="Delete networks"
                        description="Removing the selected networks is permanent and cannot be undone."
                        category="Network"
                        onOpen={() => openModalFn('admin-delete-networks')}
                      />
                      <ModalListItem
                        title="Delete subnet"
                        description="Deleting the subnet is permanent and cannot be undone."
                        category="Subnet"
                        onOpen={() => openModalFn('admin-delete-subnet')}
                      />
                      <ModalListItem
                        title="Delete subnets"
                        description="Deleting the selected subnets is permanent and cannot be undone."
                        category="Subnet"
                        onOpen={() => openModalFn('admin-delete-subnets')}
                      />
                      <ModalListItem
                        title="Delete port"
                        description="Deleting the port is permanent and cannot be undone."
                        category="Port"
                        onOpen={() => openModalFn('admin-delete-port')}
                      />
                      <ModalListItem
                        title="Delete ports"
                        description="Deleting the selected ports is permanent and cannot be undone."
                        category="Port"
                        onOpen={() => openModalFn('admin-delete-ports')}
                      />
                      <ModalListItem
                        title="Delete router"
                        description="Deleting the router is permanent and cannot be undone."
                        category="Router"
                        onOpen={() => openModalFn('admin-delete-router')}
                      />
                      <ModalListItem
                        title="Delete routers"
                        description="Removing the selected routers is permanent and cannot be undone."
                        category="Router"
                        onOpen={() => openModalFn('admin-delete-routers')}
                      />
                      <ModalListItem
                        title="Delete static routes"
                        description="Deleting the selected static routes is permanent and cannot be undone."
                        category="Router"
                        onOpen={() => openModalFn('admin-delete-static-routes')}
                      />
                      <ModalListItem
                        title="Remove DHCP agents"
                        description="This action removes the selected DHCP agents from the network."
                        category="Network"
                        onOpen={() => openModalFn('admin-remove-dhcp-agents')}
                      />
                      <ModalListItem
                        title="Release fixed IP"
                        description="This action releases the fixed IP from the port."
                        category="Port"
                        onOpen={() => openModalFn('admin-release-fixed-ip')}
                      />
                      <ModalListItem
                        title="Delete allowed address pair"
                        description="This action removes the allowed address pair from the port."
                        category="Port"
                        onOpen={() => openModalFn('admin-delete-address-pair')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Security groups / Firewalls</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete security group"
                        description="Deleting the security group is permanent and cannot be undone."
                        category="Security"
                        onOpen={() => openModalFn('admin-delete-sg')}
                      />
                      <ModalListItem
                        title="Delete security groups"
                        description="Deleting the selected security groups is permanent and cannot be undone."
                        category="Security"
                        onOpen={() => openModalFn('admin-delete-sgs')}
                      />
                      <ModalListItem
                        title="Delete firewall"
                        description="Deleting the firewall is permanent and cannot be undone."
                        category="Firewall"
                        onOpen={() => openModalFn('admin-delete-firewall')}
                      />
                      <ModalListItem
                        title="Delete firewalls"
                        description="Deleting the selected firewalls is permanent and cannot be undone."
                        category="Firewall"
                        onOpen={() => openModalFn('admin-delete-firewalls')}
                      />
                      <ModalListItem
                        title="Delete firewall policy"
                        description="Deleting the firewall policy is permanent and cannot be undone."
                        category="Firewall"
                        onOpen={() => openModalFn('admin-delete-fw-policy')}
                      />
                      <ModalListItem
                        title="Delete firewall policies"
                        description="Removing the selected firewall policies is permanent and cannot be undone."
                        category="Firewall"
                        onOpen={() => openModalFn('admin-delete-fw-policies')}
                      />
                      <ModalListItem
                        title="Delete firewall rule"
                        description="Deleting the firewall rule is permanent and cannot be undone."
                        category="Firewall"
                        onOpen={() => openModalFn('admin-delete-fw-rule')}
                      />
                      <ModalListItem
                        title="Delete firewall rules"
                        description="Removing the selected firewall rules is permanent and cannot be undone."
                        category="Firewall"
                        onOpen={() => openModalFn('admin-delete-fw-rules')}
                      />
                      <ModalListItem
                        title="Delete rule"
                        description="Removing the rule group is permanent and cannot be undone."
                        category="Security"
                        onOpen={() => openModalFn('admin-delete-sg-rule')}
                      />
                      <ModalListItem
                        title="Delete rules"
                        description="Removing the rules is permanent and cannot be undone."
                        category="Security"
                        onOpen={() => openModalFn('admin-delete-sg-rules')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Floating IPs / Load balancers</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Unsaved changes"
                        description="Any unsaved changes will be lost. Do you want to leave?"
                        category="General"
                        onOpen={() => openModalFn('admin-unsaved-changes')}
                      />
                      <ModalListItem
                        title="Release floating IP"
                        description="Releasing the floating IP is permanent and cannot be undone."
                        category="FIP"
                        onOpen={() => openModalFn('admin-release-fip')}
                      />
                      <ModalListItem
                        title="Release floating IPs"
                        description="Releasing the floating IPs is permanent and cannot be undone."
                        category="FIP"
                        onOpen={() => openModalFn('admin-release-fips')}
                      />
                      <ModalListItem
                        title="Delete load balancer"
                        description="Removing the load balancer is permanent and cannot be undone."
                        category="LB"
                        onOpen={() => openModalFn('admin-delete-lb')}
                      />
                      <ModalListItem
                        title="Delete load balancers"
                        description="Removing the load balancers is permanent and cannot be undone."
                        category="LB"
                        onOpen={() => openModalFn('admin-delete-lbs')}
                      />
                      <ModalListItem
                        title="Delete listener"
                        description="Removing the listener is permanent and cannot be undone."
                        category="Listener"
                        onOpen={() => openModalFn('admin-delete-listener')}
                      />
                      <ModalListItem
                        title="Delete listeners"
                        description="Removing the listeners is permanent and cannot be undone."
                        category="Listener"
                        onOpen={() => openModalFn('admin-delete-listeners')}
                      />
                      <ModalListItem
                        title="Delete pool"
                        description="Removing the pool is permanent and cannot be undone."
                        category="Pool"
                        onOpen={() => openModalFn('admin-delete-pool')}
                      />
                      <ModalListItem
                        title="Delete pools"
                        description="Removing the pools is permanent and cannot be undone."
                        category="Pool"
                        onOpen={() => openModalFn('admin-delete-pools')}
                      />
                      <ModalListItem
                        title="Delete member"
                        description="Removing the member is permanent and cannot be undone."
                        category="Member"
                        onOpen={() => openModalFn('admin-delete-member')}
                      />
                      <ModalListItem
                        title="Delete members"
                        description="Removing the members is permanent and cannot be undone."
                        category="Member"
                        onOpen={() => openModalFn('admin-delete-members')}
                      />
                      <ModalListItem
                        title="Delete L7 policy"
                        description="Removing the L7 policy is permanent and cannot be undone."
                        category="L7"
                        onOpen={() => openModalFn('admin-delete-l7-policy')}
                      />
                      <ModalListItem
                        title="Delete L7 policies"
                        description="Removing the L7 policies is permanent and cannot be undone."
                        category="L7"
                        onOpen={() => openModalFn('admin-delete-l7-policies')}
                      />
                      <ModalListItem
                        title="Delete health monitor"
                        description="Removing the health monitor is permanent and cannot be undone."
                        category="Health"
                        onOpen={() => openModalFn('admin-delete-health-monitor')}
                      />
                    </div>
                  </VStack>
                  <VStack gap={2}>
                    <SubHeading>Tenants / Metadata</SubHeading>
                    <div className="flex flex-col gap-2">
                      <ModalListItem
                        title="Delete tenant"
                        description="Deleting the tenant is permanent and cannot be undone."
                        category="Tenant"
                        onOpen={() => openModalFn('admin-delete-tenant')}
                      />
                      <ModalListItem
                        title="Delete tenants"
                        description="Removing the selected tenants is permanent and cannot be undone."
                        category="Tenant"
                        onOpen={() => openModalFn('admin-delete-tenants')}
                      />
                      <ModalListItem
                        title="Delete metadata"
                        description="This action removes the metadata."
                        category="Metadata"
                        onOpen={() => openModalFn('admin-delete-metadata')}
                      />
                      <ModalListItem
                        title="Delete metadata (bulk)"
                        description="This action removes the selected metadata."
                        category="Metadata"
                        onOpen={() => openModalFn('admin-delete-metadatas')}
                      />
                      <ModalListItem
                        title="Manage member"
                        description="Redirect to IAM to manage users and user groups."
                        category="Tenant"
                        onOpen={() => openModalFn('admin-manage-member')}
                      />
                    </div>
                  </VStack>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* ============================================================
               CLOUD BUILDER
               ============================================================ */}
            <Disclosure open={isSearching || isCloudBuilderOpen} onChange={setIsCloudBuilderOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <SectionHeader
                  label="Cloud Builder"
                  count={2}
                  isOpen={isCloudBuilderOpen}
                  isSearching={isSearching}
                />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Enable compute service"
                      description="Change this service status to Enabled?"
                      category="Service"
                      onOpen={() => openModalFn('enable-compute-service')}
                    />
                    <ModalListItem
                      title="Disable compute service"
                      description="Change this service status to Disabled?"
                      category="Service"
                      onOpen={() => openModalFn('disable-compute-service')}
                    />
                  </div>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>

            {/* ============================================================
               AI AGENT
               ============================================================ */}
            <Disclosure open={isSearching || isAIAgentOpen} onChange={setIsAIAgentOpen}>
              <Disclosure.Trigger className="w-full [&>span:first-child]:hidden">
                <SectionHeader
                  label="AI Agent"
                  count={1}
                  isOpen={isAIAgentOpen}
                  isSearching={isSearching}
                />
              </Disclosure.Trigger>
              <Disclosure.Panel>
                <VStack gap={4} className="pt-4">
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete agent source"
                      description="Are you sure you want to delete this agent source? This action cannot be undone."
                      category="Agent"
                      onOpen={() => openModalFn('delete-agent-source')}
                    />
                  </div>
                </VStack>
              </Disclosure.Panel>
            </Disclosure>
          </VStack>
        </VStack>
      </ModalSearchContext.Provider>

      {/* ================================================================
         MODAL INSTANCES — Compute
         ================================================================ */}
      <ConfirmModal
        isOpen={openModal === 'delete-snapshot'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete snapshot"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Snapshot name"
        infoValue="2cdfafc1"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-security-group'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete security group"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Security group"
        infoValue="sg-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'delete-security-groups'}
        onClose={closeModal}
        title="Delete security groups"
        description="Removing the selected instances is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Security groups(10)"
            items={[
              'sg-01',
              'sg-02',
              'sg-03',
              'sg-04',
              'sg-05',
              'sg-06',
              'sg-07',
              'sg-08',
              'sg-09',
              'sg-10',
            ]}
          />
          <DangerWarning>
            This action will permanently delete the security groups and all its rules. If these
            groups are attached to any instances, their network traffic may be affected.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'delete-rule'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete rule"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Rule"
        infoValue="Ingress/TCP/22"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'delete-rules'}
        onClose={closeModal}
        title="Delete rules"
        description="Removing the selected instances is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Rules"
            items={['Ingress/TCP/22', 'Ingress/TCP/80', 'Ingress/TCP/443', 'Egress/All']}
          />
          <DangerWarning>This action will permanently delete the selected rules.</DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'detach-volume'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Detach volume"
        description="This action detaches the volume."
        infoLabel="Volume"
        infoValue="data-vol-01"
        confirmText="Detach"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'restore-backup-sm'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Restore backup"
        description="This action restores the backup."
        infoLabel="Backup"
        infoValue="backup-2024-01"
        confirmText="Restore"
        confirmVariant="primary"
      />
      <Modal
        isOpen={openModal === 'restore-backup-md'}
        onClose={closeModal}
        title="Restore backup"
        description="This action restores the backup."
      >
        <div className="flex flex-col gap-2">
          <InfoBox label="Volume" value="data-vol-01" />
          <DangerWarning>
            The current volume data will be overwritten with the backup data.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Restore" confirmVariant="primary" />
      </Modal>
      <Modal
        isOpen={openModal === 'restore-backup-lg'}
        onClose={closeModal}
        title="Restore backup"
        description="This action restores the backup."
      >
        <div className="flex flex-col gap-2">
          <InfoBox label="Volume" value="data-vol-01" />
          <InfoBox label="New volume name" value="data-vol-01-restored" />
          <DangerWarning>
            The current volume data will be overwritten with the backup data.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Restore" confirmVariant="primary" />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'disassociate-fip'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Disassociate floating IP"
        description="Disassociating will detach the floating IP from the selected resource. External access via this IP will stop immediately."
        infoLabel="Floating IP"
        infoValue="203.0.113.50"
        confirmText="Disassociate"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'disassociate-fip-lb'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Disassociate floating IP"
        description="Disassociating will detach the floating IP from this load balancer."
        infoLabel="Floating IP"
        infoValue="198.51.100.20"
        confirmText="Disassociate"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'release-fip'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Release floating IP"
        description="This action releases the floating IP."
        infoLabel="Floating IP"
        infoValue="203.0.113.50"
        confirmText="Release"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'release-fips'}
        onClose={closeModal}
        title="Release floating IPs"
        description="This action releases the floating IP."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Floating IPs"
            items={['203.0.113.50', '203.0.113.51', '203.0.113.52', '203.0.113.53']}
          />
          <DangerWarning>
            Releasing these floating IPs will remove external access for associated resources.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Release" />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'delete-lb'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete load balancer"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Load balancer"
        infoValue="web-lb-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'release-lbs'}
        onClose={closeModal}
        title="Release load balancers"
        description="Removing the selected instances is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Load balancers"
            items={['web-lb-01', 'api-lb-01', 'staging-lb', 'dev-lb']}
          />
          <DangerWarning>
            Deleting these load balancers may affect listeners and pools that depend on them.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>

      {/* ================================================================
         MODAL INSTANCES — IAM
         ================================================================ */}
      <ConfirmModal
        isOpen={openModal === 'delete-user'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete user"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="User"
        infoValue="john.doe@example.com"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'delete-users'}
        onClose={closeModal}
        title="Delete users"
        description="Removing the selected instances is permanent and cannot be undone."
      >
        <ScrollableList
          label="Users"
          items={[
            'john.doe@example.com',
            'jane.smith@example.com',
            'admin@example.com',
            'dev@example.com',
          ]}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <Modal
        isOpen={openModal === 'confirm-password'}
        onClose={closeModal}
        title="Confirm user password"
        description="Review the username and password. The password can only be viewed at this step."
      >
        <div className="flex flex-col gap-3">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Username
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                newuser01
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={usernameCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              aria-label="Copy username"
              onClick={() => {
                navigator.clipboard.writeText('newuser01');
                setUsernameCopied(true);
                setTimeout(() => setUsernameCopied(false), 2000);
              }}
            />
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Password
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4 font-mono">
                Temp1234!@#
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={passwordCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              aria-label="Copy password"
              onClick={() => {
                navigator.clipboard.writeText('Temp1234!@#');
                setPasswordCopied(true);
                setTimeout(() => setPasswordCopied(false), 2000);
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="primary" onClick={closeModal} className="flex-1">
            Done
          </Button>
        </div>
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'unsaved-changes'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Unsaved changes"
        description="Any unsaved changes will be lost. Do you want to leave?"
        confirmText="Stay"
        confirmVariant="primary"
        cancelText="Leave"
      />
      <Modal
        isOpen={openModal === 'detach-user-group'}
        onClose={closeModal}
        title="Detach user group"
        description="This action detaches the user from the group."
      >
        <ScrollableList
          label="User groups"
          items={['developers', 'qa-team', 'ops-team', 'security-team']}
        />
        <ModalButtons onClose={closeModal} confirmText="Detach" confirmVariant="danger" />
      </Modal>
      <Modal
        isOpen={openModal === 'detach-role'}
        onClose={closeModal}
        title="Detach role"
        description="This action detaches the role from the user."
      >
        <ScrollableList label="Roles" items={['admin', 'developer', 'viewer', 'operator']} />
        <ModalButtons onClose={closeModal} confirmText="Detach" confirmVariant="danger" />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'remove-otp-mfa'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Remove OTP MFA"
        description="This action removes OTP MFA for the user."
        infoLabel="User"
        infoValue="admin@thaki.cloud"
        confirmText="Remove"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'terminate-all-sessions'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Terminate all sessions"
        description="This action terminates all sessions for the user."
        infoLabel="User"
        infoValue="admin@thaki.cloud"
        confirmText="Terminate"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'terminate-session'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Terminate session"
        description="This action terminates the session."
        infoLabel="Session"
        infoValue="sess-abc123"
        confirmText="Terminate"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'remove-user'}
        onClose={closeModal}
        title="Remove user"
        description="This action removes the user from the group."
      >
        <ScrollableList
          label="Users"
          items={['john.doe@example.com', 'jane.smith@example.com', 'admin@example.com']}
        />
        <ModalButtons onClose={closeModal} confirmText="Remove" confirmVariant="danger" />
      </Modal>
      <Modal isOpen={openModal === 'delete-role'} onClose={closeModal} title="Delete role">
        <div className="flex flex-col gap-2">
          <InfoBox label="Role" value="developer-role" />
          <DangerWarning>
            If this role has active temporary grants, deleting it removes all of those grants.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Delete" confirmVariant="danger" />
      </Modal>
      <Modal isOpen={openModal === 'delete-roles'} onClose={closeModal} title="Delete roles">
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Roles"
            items={['developer-role', 'viewer-role', 'operator-role', 'auditor-role']}
          />
          <DangerWarning>
            If any selected roles have active temporary grants, deleting them removes all of those
            grants.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Delete" confirmVariant="danger" />
      </Modal>
      <Modal
        isOpen={openModal === 'revoke-access-single'}
        onClose={closeModal}
        title="Revoke access"
      >
        <div className="flex flex-col gap-2">
          <InfoBox label="Principal" value="john.doe@example.com" />
          <InfoBox label="Role" value="developer-role" />
          <InfoBox label="Scheduled end" value="Apr 30, 2026 23:59:59 (UTC+9)" />
          <DangerWarning>
            Temporary access is revoked immediately, regardless of the scheduled end time.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Revoke" confirmVariant="danger" />
      </Modal>
      <Modal isOpen={openModal === 'revoke-access-bulk'} onClose={closeModal} title="Revoke access">
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Grants"
            items={[
              'john.doe / developer-role / Apr 30, 2026',
              'jane.smith / viewer-role / May 15, 2026',
              'ops-bot / operator-role / Jun 01, 2026',
            ]}
          />
          <DangerWarning>
            Temporary access is revoked immediately, regardless of the scheduled end time.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Revoke" confirmVariant="danger" />
      </Modal>
      <Modal
        isOpen={openModal === 'detach-policy'}
        onClose={closeModal}
        title="Detach policy"
        description="This action detaches the policy from the role."
      >
        <ScrollableList
          label="Policies"
          items={['read-only-policy', 'admin-policy', 'network-policy']}
        />
        <ModalButtons onClose={closeModal} confirmText="Detach" confirmVariant="danger" />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'delete-policy'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete policy"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Policy"
        infoValue="read-only-policy"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'delete-policies'}
        onClose={closeModal}
        title="Delete policies"
        description="Removing the selected instances is permanent and cannot be undone."
      >
        <ScrollableList
          label="Policies"
          items={['read-only-policy', 'admin-policy', 'network-policy', 'storage-policy']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'revert-policy-version'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Revert policy version"
        description="This action reverts the policy to the selected version."
        infoLabel="Version"
        infoValue="v2 → v1"
        confirmText="Revert"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-policy-version'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete policy version"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Policy version"
        infoValue="v3"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'update-mfa-policy'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update MFA enforcement policy"
        description="This action applies the changes."
        infoLabel="Change"
        infoValue="Required → Optional"
        confirmText="Apply"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'update-otp-enable'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update OTP policy"
        description="This action applies the changes."
        infoLabel="Change"
        infoValue="Disabled → Enabled"
        confirmText="Apply"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'update-otp-disable'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update OTP policy"
        description="This action applies the changes."
        infoLabel="Change"
        infoValue="Enabled → Disabled"
        confirmText="Apply"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'update-email-enable'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update email policy"
        description="This action applies the changes."
        infoLabel="Change"
        infoValue="Disabled → Enabled"
        confirmText="Apply"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'update-email-disable'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update email policy"
        description="This action applies the changes."
        infoLabel="Change"
        infoValue="Enabled → Disabled"
        confirmText="Apply"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'update-session-policy'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update general session policy"
        description="This action applies the changes."
        confirmText="Apply"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-domain'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete domain"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Domain"
        infoValue="example.com"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'switch-domain'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Switch to domain"
        description="Any unsaved changes may be lost when switching to another domain. Do you want to switch?"
        infoLabel="Domain"
        infoValue="thaki.cloud"
        confirmText="Switch"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-system-admin'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete system administrator"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Administrator"
        infoValue="admin@system.local"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'update-password-policy'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update password policy"
        description="This action applies the changes."
        confirmText="Apply"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'update-lockout-policy'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update account lockout policy"
        description="This action applies the changes."
        confirmText="Apply"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'update-token-policy'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Update token policy"
        description="This action applies the changes."
        infoLabel="Change"
        infoValue="24h → 12h"
        confirmText="Apply"
        confirmVariant="primary"
      />

      {/* — Service Account — */}
      <Modal
        isOpen={openModal === 'regenerate-client-secret'}
        onClose={closeModal}
        title="Regenerate client secret"
      >
        <div className="flex flex-col gap-2">
          <InfoBox label="Name" value="ci-pipeline-bot" />
          <InfoBoxCopyable label="Client ID" value="sa-client-abc123" />
          <DangerWarning>
            The current secret stops working immediately. The new secret is shown only once on the
            next screen.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Regenerate" confirmVariant="primary" />
      </Modal>
      <Modal
        isOpen={openModal === 'new-client-secret'}
        onClose={closeModal}
        title="New client secret"
      >
        <div className="flex flex-col gap-2">
          <InfoBox label="Name" value="ci-pipeline-bot" />
          <InfoBoxCopyable label="Client ID" value="sa-client-abc123" />
          <InfoBoxCopyable label="New client secret" value="sk-xxxx-xxxx-xxxx-xxxx" />
          <DangerWarning>
            These credentials are shown only once. Copy and store them securely before you close
            this dialog.
          </DangerWarning>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="primary" onClick={closeModal} className="flex-1">
            Done
          </Button>
        </div>
      </Modal>
      <Modal isOpen={openModal === 'new-api-key'} onClose={closeModal} title="New API key">
        <div className="flex flex-col gap-2">
          <InfoBoxCopyable label="Key ID" value="ak-key-abc123" />
          <InfoBoxCopyable label="New API key" value="thaki_sk_live_xxxxxxxxxxxx" />
          <DangerWarning>
            These credentials are shown only once. Copy and store them securely before you close
            this dialog.
          </DangerWarning>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="primary" onClick={closeModal} className="flex-1">
            Done
          </Button>
        </div>
      </Modal>
      <Modal isOpen={openModal === 'reset-api-key'} onClose={closeModal} title="Reset API key">
        <div className="flex flex-col gap-2">
          <InfoBoxCopyable label="Key ID" value="ak-key-abc123" />
          <DangerWarning>
            The current key stops working immediately. The new key is shown only once on the next
            screen.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Reset" confirmVariant="primary" />
      </Modal>
      <Modal isOpen={openModal === 'delete-api-key'} onClose={closeModal} title="Delete API key">
        <div className="flex flex-col gap-2">
          <InfoBox label="Key ID" value="ak-key-abc123" />
          <DangerWarning>
            This key stops working immediately. Requests that use it will fail, and the key cannot
            be restored.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Delete" confirmVariant="danger" />
      </Modal>
      <Modal
        isOpen={openModal === 'delete-service-account'}
        onClose={closeModal}
        title="Delete service account"
      >
        <div className="flex flex-col gap-2">
          <InfoBox label="Service account" value="ci-pipeline-bot" />
          <DangerWarning>
            Client ID, Client Secret, all API keys, and permission bindings for this account will be
            removed.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Delete" confirmVariant="danger" />
      </Modal>
      <Modal
        isOpen={openModal === 'delete-service-accounts'}
        onClose={closeModal}
        title="Delete service accounts"
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Service accounts"
            items={['ci-pipeline-bot', 'monitoring-agent', 'backup-service', 'deploy-bot']}
          />
          <DangerWarning>
            Client ID, Client Secret, all API keys, and permission bindings for these accounts will
            be removed.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} confirmText="Delete" confirmVariant="danger" />
      </Modal>
      <Modal
        isOpen={openModal === 'new-client-secret-close'}
        onClose={closeModal}
        title="New client secret"
      >
        <div className="flex flex-col gap-2">
          <InfoBox label="Name" value="ci-pipeline-bot" />
          <InfoBoxCopyable label="Client ID" value="sa-client-abc123" />
          <InfoBoxCopyable label="New client secret" value="sk-xxxx-xxxx-xxxx-xxxx" />
          <DangerWarning>
            These credentials are shown only once. Copy and store them securely before you close
            this dialog.
          </DangerWarning>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="primary" onClick={closeModal} className="flex-1">
            Close
          </Button>
        </div>
      </Modal>

      {/* ================================================================
         MODAL INSTANCES — Storage
         ================================================================ */}
      <Modal isOpen={openModal === 'delete-bucket'} onClose={closeModal} title="Delete bucket">
        <DangerWarning>
          Deleting this bucket will permanently remove all objects stored within it. This action
          cannot be undone.
        </DangerWarning>
        <ModalButtons onClose={closeModal} />
      </Modal>

      {/* ================================================================
         MODAL INSTANCES — Container
         ================================================================ */}
      <ConfirmModal
        isOpen={openModal === 'delete-cluster'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete cluster"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Cluster"
        infoValue="prod-cluster-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-namespace'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete namespace"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Namespace"
        infoValue="monitoring"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-pod'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete pod"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Pod"
        infoValue="nginx-7d9f..."
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-job'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete job"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Job"
        infoValue="data-migration-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-cronjob'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete CronJob"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="CronJob"
        infoValue="backup-daily"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-deployment'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete deployment"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="Deployment"
        infoValue="web-frontend"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-statefulset'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete StatefulSet"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="StatefulSet"
        infoValue="redis-cluster"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'delete-daemonset'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete DaemonSet"
        description="Removing the selected instances is permanent and cannot be undone."
        infoLabel="DaemonSet"
        infoValue="log-collector"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'redeploy-deployment'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Redeploy deployment"
        description="Are you sure you want to redeploy this deployment?"
        infoLabel="Deployment"
        infoValue="web-frontend"
        confirmText="Redeploy"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'redeploy-statefulset'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Redeploy StatefulSet"
        description="Are you sure you want to redeploy this StatefulSet?"
        infoLabel="StatefulSet"
        infoValue="redis-cluster"
        confirmText="Redeploy"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'redeploy-daemonset'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Redeploy DaemonSet"
        description="Are you sure you want to redeploy this DaemonSet?"
        infoLabel="DaemonSet"
        infoValue="log-collector"
        confirmText="Redeploy"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'rollback-deployment'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Roll back deployment"
        description="Select a revision to roll back to."
        infoLabel="Deployment"
        infoValue="web-frontend"
        confirmText="Roll back"
        confirmVariant="primary"
      />

      {/* ================================================================
         MODAL INSTANCES — Compute Admin
         ================================================================ */}
      <ConfirmModal
        isOpen={openModal === 'admin-stop-instance'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Stop instance"
        description="This action stops the instance."
        infoLabel="Instance"
        infoValue="web-server-01"
        confirmText="Stop"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-reboot-instance'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Reboot instance"
        description="This action reboots the instance."
        infoLabel="Instance"
        infoValue="web-server-01"
        confirmText="Reboot"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-soft-reboot'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Soft reboot instance"
        description="This action performs a soft reboot of the instance."
        infoLabel="Instance"
        infoValue="web-server-01"
        confirmText="Soft Reboot"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-confirm-resize'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Confirm resize"
        description="This action confirms the resized state of the instance."
        infoLabel="Instance"
        infoValue="web-server-01"
        confirmText="Confirm"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-revert-resize'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Revert resize"
        description="This action reverts the instance to its previous state before the resize."
        infoLabel="Instance"
        infoValue="web-server-01"
        confirmText="Revert"
        confirmVariant="warning"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-delete-instance'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete instance"
        description="Removing the instance is permanent and cannot be undone."
        infoLabel="Instance"
        infoValue="web-server-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-shelve-instance'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Shelve instance"
        description="This action shelves the instance."
        infoLabel="Instance"
        infoValue="web-server-01"
        confirmText="Shelve"
        confirmVariant="primary"
      />
      <Modal
        isOpen={openModal === 'admin-start-instances'}
        onClose={closeModal}
        title="Start instances"
        description="This action starts the selected instances."
      >
        <ScrollableList
          label="Instances"
          items={['web-server-01', 'web-server-02', 'api-server-01', 'db-server-01']}
        />
        <ModalButtons onClose={closeModal} confirmText="Start" confirmVariant="primary" />
      </Modal>
      <Modal
        isOpen={openModal === 'admin-stop-instances'}
        onClose={closeModal}
        title="Stop instances"
        description="This action stops the selected instances."
      >
        <ScrollableList
          label="Instances"
          items={['web-server-01', 'web-server-02', 'api-server-01', 'db-server-01']}
        />
        <ModalButtons onClose={closeModal} confirmText="Stop" confirmVariant="danger" />
      </Modal>
      <Modal
        isOpen={openModal === 'admin-reboot-instances'}
        onClose={closeModal}
        title="Reboot instances"
        description="This action reboots the selected instances."
      >
        <ScrollableList
          label="Instances"
          items={['web-server-01', 'web-server-02', 'api-server-01', 'db-server-01']}
        />
        <ModalButtons onClose={closeModal} confirmText="Reboot" confirmVariant="danger" />
      </Modal>
      <Modal
        isOpen={openModal === 'admin-delete-instances'}
        onClose={closeModal}
        title="Delete instances"
        description="Removing the selected instances is permanent and cannot be undone."
      >
        <ScrollableList
          label="Instances"
          items={['web-server-01', 'web-server-02', 'api-server-01', 'db-server-01']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-template'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete instance template"
        description="Deleting the instance template is permanent and cannot be undone."
        infoLabel="Template"
        infoValue="web-template-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-templates'}
        onClose={closeModal}
        title="Delete instance templates"
        description="Deleting the selected instance templates is permanent and cannot be undone."
      >
        <ScrollableList
          label="Templates"
          items={['web-template-01', 'api-template-01', 'db-template-01', 'dev-template']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-image'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete image"
        description="Deleting the image is permanent and cannot be undone."
        infoLabel="Image"
        infoValue="ubuntu-22.04"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-images'}
        onClose={closeModal}
        title="Delete images"
        description="Deleting the selected images is permanent and cannot be undone."
      >
        <ScrollableList
          label="Images"
          items={['ubuntu-22.04', 'centos-9', 'debian-12', 'rocky-9']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-snapshot'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete snapshot"
        description="Deleting the snapshot is permanent and cannot be undone."
        infoLabel="Snapshot"
        infoValue="snap-20240101"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-snapshots'}
        onClose={closeModal}
        title="Delete snapshots"
        description="Deleting the selected snapshots is permanent and cannot be undone."
      >
        <ScrollableList
          label="Snapshots"
          items={['snap-20240101', 'snap-20240201', 'snap-20240301', 'snap-20240401']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-volume'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete volume"
        description="Deleting the volume is permanent and cannot be undone."
        infoLabel="Volume"
        infoValue="data-vol-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-volumes'}
        onClose={closeModal}
        title="Delete volumes"
        description="Deleting the selected volumes is permanent and cannot be undone."
      >
        <ScrollableList
          label="Volumes"
          items={['data-vol-01', 'data-vol-02', 'log-vol-01', 'backup-vol']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-volume-type'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete volume type"
        description="Deleting the volume type is permanent and cannot be undone."
        infoLabel="Volume type"
        infoValue="SSD-Premium"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-volume-types'}
        onClose={closeModal}
        title="Delete volume types"
        description="Deleting the selected volume types is permanent and cannot be undone."
      >
        <ScrollableList
          label="Volume types"
          items={['SSD-Premium', 'SSD-Standard', 'HDD-Archive', 'NVMe-Ultra']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-backup'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete backup"
        description="Deleting the backup is permanent and cannot be undone."
        infoLabel="Backup"
        infoValue="backup-2024-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-backups'}
        onClose={closeModal}
        title="Delete backups"
        description="Deleting the selected backups is permanent and cannot be undone."
      >
        <ScrollableList
          label="Backups"
          items={['backup-2024-01', 'backup-2024-02', 'backup-2024-03', 'backup-2024-04']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-encryption'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete encryption"
        description="This action removes the encryption configuration from the volume type."
        infoLabel="Volume type"
        infoValue="SSD-Premium"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-delete-extra-spec'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete extra spec"
        description="This action removes the extra specification from the volume type."
        infoLabel="Extra spec"
        infoValue="volume_backend_name=lvm"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-extra-specs'}
        onClose={closeModal}
        title="Delete extra specs"
        description="Deleting the selected extra specifications is permanent and cannot be undone."
      >
        <ScrollableList
          label="Extra specs"
          items={['volume_backend_name=lvm', 'max_iops=3000', 'min_throughput=100MB/s']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-qos-spec'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete QoS spec"
        description="This action removes the QoS specification."
        infoLabel="QoS spec"
        infoValue="high-iops"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-qos-specs'}
        onClose={closeModal}
        title="Delete QoS specs"
        description="This action removes the selected QoS specifications."
      >
        <ScrollableList label="QoS specs" items={['high-iops', 'balanced', 'economy', 'burst']} />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-extra-spec-qos'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete extra spec"
        description="This action removes the extra specification from the volume type."
        infoLabel="Extra spec"
        infoValue="read_iops_sec=3000"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-extra-specs-qos'}
        onClose={closeModal}
        title="Delete extra specs"
        description="Deleting the selected extra specifications is permanent and cannot be undone."
      >
        <ScrollableList
          label="Extra specs"
          items={[
            'read_iops_sec=3000',
            'write_iops_sec=2000',
            'read_bytes_sec=100MB',
            'write_bytes_sec=80MB',
          ]}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-network'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete network"
        description="Deleting the network is permanent and cannot be undone."
        infoLabel="Network"
        infoValue="private-net-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-networks'}
        onClose={closeModal}
        title="Delete networks"
        description="Removing the selected networks is permanent and cannot be undone."
      >
        <ScrollableList
          label="Networks"
          items={['private-net-01', 'private-net-02', 'dev-net', 'staging-net']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-subnet'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete subnet"
        description="Deleting the subnet is permanent and cannot be undone."
        infoLabel="Subnet"
        infoValue="subnet-192-168-1"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-subnets'}
        onClose={closeModal}
        title="Delete subnets"
        description="Deleting the selected subnets is permanent and cannot be undone."
      >
        <ScrollableList
          label="Subnets"
          items={['subnet-192-168-1', 'subnet-10-0-1', 'subnet-172-16-0', 'subnet-dev']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-port'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete port"
        description="Deleting the port is permanent and cannot be undone."
        infoLabel="Port"
        infoValue="port-abc123"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-ports'}
        onClose={closeModal}
        title="Delete ports"
        description="Deleting the selected ports is permanent and cannot be undone."
      >
        <ScrollableList
          label="Ports"
          items={['port-abc123', 'port-def456', 'port-ghi789', 'port-jkl012']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-router'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete router"
        description="Deleting the router is permanent and cannot be undone."
        infoLabel="Router"
        infoValue="main-router"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-routers'}
        onClose={closeModal}
        title="Delete routers"
        description="Removing the selected routers is permanent and cannot be undone."
      >
        <ScrollableList
          label="Routers"
          items={['main-router', 'dev-router', 'staging-router', 'test-router']}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <Modal
        isOpen={openModal === 'admin-delete-static-routes'}
        onClose={closeModal}
        title="Delete static routes"
        description="Deleting the selected static routes is permanent and cannot be undone."
      >
        <ScrollableList
          label="Static routes"
          items={[
            '10.0.0.0/24 → 192.168.1.1',
            '172.16.0.0/16 → 192.168.1.1',
            '10.10.0.0/24 → 10.0.0.1',
          ]}
        />
        <ModalButtons onClose={closeModal} />
      </Modal>
      <Modal
        isOpen={openModal === 'admin-remove-dhcp-agents'}
        onClose={closeModal}
        title="Remove DHCP agents"
        description="This action removes the selected DHCP agents from the network."
      >
        <ScrollableList
          label="DHCP agents"
          items={['agent-01@host-1', 'agent-02@host-2', 'agent-03@host-3']}
        />
        <ModalButtons onClose={closeModal} confirmText="Remove" confirmVariant="danger" />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-release-fixed-ip'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Release fixed IP"
        description="This action releases the fixed IP from the port."
        infoLabel="Fixed IP"
        infoValue="192.168.1.100"
        confirmText="Release"
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-delete-address-pair'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete allowed address pair"
        description="This action removes the allowed address pair from the port."
        infoLabel="Address pair"
        infoValue="10.0.0.0/24 / fa:16:3e:xx:xx:xx"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-delete-sg'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete security group"
        description="Deleting the security group is permanent and cannot be undone."
        infoLabel="Security group"
        infoValue="web-servers-sg"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-sgs'}
        onClose={closeModal}
        title="Delete security groups"
        description="Deleting the selected security groups is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Security groups that can be deleted"
            items={['web-servers-sg', 'database-sg', 'api-servers-sg', 'monitoring-sg']}
          />
          <ScrollableList
            label="Security groups that cannot be deleted"
            items={[
              'default (system)',
              'production-sg (in use)',
              'management-sg (system)',
              'bastion-sg (in use)',
            ]}
          />
          <DangerWarning>
            This action will permanently delete the security groups and all their rules.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-firewall'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete firewall"
        description="Deleting the firewall is permanent and cannot be undone."
        infoLabel="Firewall"
        infoValue="perimeter-firewall-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-firewalls'}
        onClose={closeModal}
        title="Delete firewalls"
        description="Deleting the selected firewalls is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Firewalls that can be deleted"
            items={[
              'perimeter-firewall-01',
              'internal-firewall-01',
              'test-firewall-01',
              'dev-firewall-01',
            ]}
          />
          <ScrollableList
            label="Firewalls that cannot be deleted"
            items={[
              'production-firewall (in use)',
              'gateway-firewall (system)',
              'management-firewall (system)',
              'ha-firewall (high availability)',
            ]}
          />
          <DangerWarning>
            This action will permanently delete the firewalls and all their rules.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-fw-policy'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete firewall policy"
        description="Deleting the firewall policy is permanent and cannot be undone."
        infoLabel="Firewall Policy"
        infoValue="web-policy-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-fw-policies'}
        onClose={closeModal}
        title="Delete firewall policies"
        description="Removing the selected firewall policies is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Firewall policies that can be deleted"
            items={['web-policy-01', 'api-policy-01', 'staging-policy', 'dev-policy']}
          />
          <ScrollableList
            label="Firewall policies that cannot be deleted"
            items={[
              'production-policy (in use)',
              'gateway-policy (system)',
              'default-policy (protected)',
              'critical-policy (in use)',
            ]}
          />
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-fw-rule'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete firewall rule"
        description="Deleting the firewall rule is permanent and cannot be undone."
        infoLabel="Firewall Rule"
        infoValue="allow-https-443"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-fw-rules'}
        onClose={closeModal}
        title="Delete firewall rules"
        description="Removing the selected firewall rules is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Firewall rules that can be deleted"
            items={['allow-https-443', 'allow-http-80', 'allow-ssh-22', 'allow-dns-53']}
          />
          <ScrollableList
            label="Firewall rules that cannot be deleted"
            items={[
              'default-egress (system)',
              'management-access (protected)',
              'monitoring-rule (required)',
              'critical-ingress (in use)',
            ]}
          />
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-sg-rule'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete rule"
        description="Removing the rule group is permanent and cannot be undone."
        infoLabel="Rule"
        infoValue="Ingress/TCP/443"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-sg-rules'}
        onClose={closeModal}
        title="Delete rules"
        description="Removing the rules is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Rules that can be deleted"
            items={['Ingress/TCP/80', 'Ingress/TCP/443', 'Egress/TCP/All', 'Ingress/UDP/53']}
          />
          <ScrollableList
            label="Rules that cannot be deleted"
            items={[
              'Ingress/TCP/22 (SSH required)',
              'Egress/All/All (default)',
              'Ingress/ICMP/All (monitoring)',
              'Ingress/TCP/3389 (RDP required)',
            ]}
          />
          <DangerWarning>
            Deleting these rules may affect network access for the resources that rely on them.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-unsaved-changes'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Unsaved changes"
        description="Any unsaved changes will be lost. Do you want to leave?"
        confirmText="Stay"
        confirmVariant="primary"
        cancelText="Leave"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-release-fip'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Release floating IP"
        description="Releasing the floating IP is permanent and cannot be undone."
        infoLabel="Floating IP"
        infoValue="203.0.113.50"
        confirmText="Release"
        confirmVariant="primary"
      />
      <Modal
        isOpen={openModal === 'admin-release-fips'}
        onClose={closeModal}
        title="Release floating IPs"
        description="Releasing the floating IPs is permanent and cannot be undone."
      >
        <ScrollableList
          label="Floating IPs"
          items={['203.0.113.50', '203.0.113.51', '203.0.113.52', '203.0.113.53']}
        />
        <ModalButtons onClose={closeModal} confirmText="Release" confirmVariant="primary" />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-lb'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete load balancer"
        description="Removing the load balancer is permanent and cannot be undone."
        infoLabel="Load balancer"
        infoValue="web-lb-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-lbs'}
        onClose={closeModal}
        title="Delete load balancers"
        description="Removing the load balancers is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Load balancers that can be deleted"
            items={['web-lb-01', 'api-lb-01', 'staging-lb-01', 'dev-lb-01']}
          />
          <ScrollableList
            label="Load balancers that cannot be deleted"
            items={[
              'production-lb (in use)',
              'gateway-lb (external)',
              'ha-lb-01 (high availability)',
              'critical-lb (protected)',
            ]}
          />
          <DangerWarning>
            Deleting these load balancers may affect the listeners, pools that depend on them.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-listener'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete listener"
        description="Removing the listener is permanent and cannot be undone."
        infoLabel="Listener"
        infoValue="http-listener-443"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-listeners'}
        onClose={closeModal}
        title="Delete listeners"
        description="Removing the listeners is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Listeners that can be deleted"
            items={[
              'http-listener-80',
              'https-listener-443',
              'api-listener-8080',
              'ws-listener-8443',
            ]}
          />
          <ScrollableList
            label="Listeners that cannot be deleted"
            items={[
              'production-listener (in use)',
              'critical-listener (protected)',
              'ha-listener (high availability)',
              'gateway-listener (external)',
            ]}
          />
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-pool'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete pool"
        description="Removing the pool is permanent and cannot be undone."
        infoLabel="Pool"
        infoValue="web-servers-pool"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-pools'}
        onClose={closeModal}
        title="Delete pools"
        description="Removing the pools is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Pools that can be deleted"
            items={['web-servers-pool', 'api-servers-pool', 'staging-pool', 'dev-pool']}
          />
          <ScrollableList
            label="Pools that cannot be deleted"
            items={[
              'production-pool (in use)',
              'critical-pool (protected)',
              'ha-pool (high availability)',
              'gateway-pool (external)',
            ]}
          />
          <DangerWarning>
            Deleting these pools will also remove their associated members and health monitors.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-member'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete member"
        description="Removing the member is permanent and cannot be undone."
        infoLabel="Member"
        infoValue="192.168.1.10:8080"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-members'}
        onClose={closeModal}
        title="Delete members"
        description="Removing the members is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Members that can be deleted"
            items={[
              '192.168.1.10:8080',
              '192.168.1.11:8080',
              '192.168.1.12:8080',
              '192.168.1.13:8080',
            ]}
          />
          <ScrollableList
            label="Members that cannot be deleted"
            items={[
              '192.168.1.1:8080 (primary)',
              '192.168.1.2:8080 (backup)',
              '192.168.1.3:8080 (protected)',
              '192.168.1.4:8080 (critical)',
            ]}
          />
          <DangerWarning>
            Removing these members may affect traffic distribution for the pool.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-l7-policy'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete L7 policy"
        description="Removing the L7 policy is permanent and cannot be undone."
        infoLabel="L7 Policy"
        infoValue="redirect-to-https"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-l7-policies'}
        onClose={closeModal}
        title="Delete L7 policies"
        description="Removing the L7 policies is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="L7 Policies that can be deleted"
            items={['redirect-to-https', 'block-bad-bots', 'rate-limit-api', 'geo-redirect']}
          />
          <ScrollableList
            label="L7 Policies that cannot be deleted"
            items={[
              'default-redirect (system)',
              'security-headers (required)',
              'cors-policy (protected)',
              'auth-redirect (critical)',
            ]}
          />
          <DangerWarning>
            Deleting these L7 policies may affect traffic routing for the listeners.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-health-monitor'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete health monitor"
        description="Removing the health monitor is permanent and cannot be undone."
        infoLabel="Health Monitor"
        infoValue="http-health-check"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={openModal === 'admin-delete-tenant'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete tenant"
        description="Deleting the tenant is permanent and cannot be undone."
        infoLabel="Tenant"
        infoValue="project-alpha"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-tenants'}
        onClose={closeModal}
        title="Delete tenants"
        description="Removing the selected tenants is permanent and cannot be undone."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Tenants"
            items={['project-alpha', 'project-beta', 'project-gamma', 'project-delta']}
          />
          <DangerWarning>
            Deleting these tenants does not delete the resources inside them. Those resources will
            remain and must be managed separately.
          </DangerWarning>
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-delete-metadata'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete metadata"
        description="This action removes the metadata."
        infoLabel="Metadata"
        infoValue="environment=production"
        confirmText="Delete"
        confirmVariant="danger"
      />
      <Modal
        isOpen={openModal === 'admin-delete-metadatas'}
        onClose={closeModal}
        title="Delete metadata"
        description="This action removes the selected metadata."
      >
        <div className="flex flex-col gap-2">
          <ScrollableList
            label="Metadata that can be deleted"
            items={[
              'environment=production',
              'team=platform',
              'cost-center=eng-001',
              'owner=admin',
            ]}
          />
          <ScrollableList
            label="Metadata that cannot be deleted"
            items={[
              'system-id=xyz (system)',
              'created-by=admin (protected)',
              'managed-by=openstack (required)',
              'instance-type=vm (system)',
            ]}
          />
        </div>
        <ModalButtons onClose={closeModal} />
      </Modal>
      <ConfirmModal
        isOpen={openModal === 'admin-manage-member'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Manage member"
        description="User management for this project is handled in the IAM app. You will be redirected to IAM to manage users and user groups."
        infoLabel="Tenant"
        infoValue="project-alpha"
        confirmText="Go to IAM"
        confirmVariant="primary"
      />

      {/* ================================================================
         MODAL INSTANCES — Cloud Builder
         ================================================================ */}
      <ConfirmModal
        isOpen={openModal === 'enable-compute-service'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Enable compute service"
        description="Change this service status to Enabled?"
        confirmText="Enable"
        confirmVariant="primary"
      />
      <Modal
        isOpen={openModal === 'disable-compute-service'}
        onClose={closeModal}
        title="Disable compute service"
        description="Change this service status to Disabled?"
      >
        <div className="flex flex-col gap-2">
          <span className="text-label-lg text-[var(--color-text-default)]">
            Reason <span className="text-[var(--color-state-danger)]">*</span>
          </span>
          <textarea
            className="w-full min-h-[80px] px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] resize-y outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
            placeholder="Enter a reason for disabling"
          />
        </div>
        <ModalButtons onClose={closeModal} confirmText="Disable" confirmVariant="primary" />
      </Modal>

      {/* ================================================================
         MODAL INSTANCES — AI Agent
         ================================================================ */}
      <ConfirmModal
        isOpen={openModal === 'delete-agent-source'}
        onClose={closeModal}
        onConfirm={closeModal}
        title="Delete agent source"
        description="Are you sure you want to delete this agent source? This action cannot be undone."
        infoLabel="Agent name"
        infoValue="my-research-agent"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </PageShell>
  );
}

export default ModalsPage;
