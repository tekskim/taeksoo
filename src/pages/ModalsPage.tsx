import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  VStack,
  HStack,
  Badge,
  Modal,
  Disclosure,
  PageShell,
  TopBar,
} from '@/design-system';
import {
  IconAlertCircle,
  IconChevronRight,
  IconChevronDown,
  IconCopy,
  IconCheck,
  IconArrowLeft,
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
import { DeleteAgentSourceModal } from '@/pages/design-system-sections/OverlayDemos';

/* ----------------------------------------
   Modal List Item Component ---------------------------------------- */

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
        Open{' '}
      </Button>
    </div>
  );
}

/* ----------------------------------------
   ModalsPage Component ---------------------------------------- */

export function ModalsPage() {
  const navigate = useNavigate();

  // Modal URL state
  const [searchParams, setSearchParams] = useSearchParams();
  const openModal = searchParams.get('modal');
  const openModalFn = useCallback(
    (id: string) => {
      setSearchParams({ modal: id }, { replace: true });
    },
    [setSearchParams]
  );
  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('modal');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Modal states

  // IAM Modal states
  const [usernameCopied, setUsernameCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Storage Modal states

  // Container Modal states

  // Compute Admin Modal states

  // Disclosure states
  const [isComputeOpen, setIsComputeOpen] = useState(false);
  const [isIAMOpen, setIsIAMOpen] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isComputeAdminOpen, setIsComputeAdminOpen] = useState(false);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);

  // AI Agent modal states

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
      <VStack gap={8}>
        {/* Page Description */}
        <p className="text-body-lg text-[var(--color-text-subtle)]">
          Collection of modal components used across the application. Click to preview each modal.
        </p>

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
                    Compute{' '}
                  </Badge>
                  <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                    Modals{' '}
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(16 modals)</span>
                </div>
              </div>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={4} className="pt-4">
                {/* Delete Modals */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Delete Modals{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete snapshot"
                      description="Confirm deletion of a snapshot with warning about permanent action."
                      category="Confirm"
                      size="sm"
                      onOpen={() => openModalFn('confirm-delete')}
                    />
                    <ModalListItem
                      title="Delete security group"
                      description="Confirm deletion of a single security group with warning."
                      category="Confirm"
                      size="sm"
                      onOpen={() => openModalFn('delete-security-group')}
                    />
                    <ModalListItem
                      title="Delete security groups (multiple)"
                      description="Confirm deletion of multiple security groups with scrollable list."
                      category="Confirm"
                      size="md"
                      onOpen={() => openModalFn('delete-security-groups-multiple')}
                    />
                    <ModalListItem
                      title="Delete rule"
                      description="Confirm deletion of a single security group rule."
                      category="Confirm"
                      size="sm"
                      onOpen={() => openModalFn('delete-rule')}
                    />
                    <ModalListItem
                      title="Delete rules (multiple)"
                      description="Confirm deletion of multiple rules with scrollable list and warning."
                      category="Confirm"
                      size="md"
                      onOpen={() => openModalFn('delete-rules-multiple')}
                    />
                  </div>
                </VStack>

                {/* Volume Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Volume Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Detach volume"
                      description="Confirm detachment of a volume with warning about data corruption."
                      category="Volume"
                      size="sm"
                      onOpen={() => openModalFn('detach-volume')}
                    />
                  </div>
                </VStack>

                {/* Backup Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Backup Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Restore backup"
                      description="Simple restore backup confirmation with volume info."
                      category="Backup"
                      size="sm"
                      onOpen={() => openModalFn('restore-backup-small')}
                    />
                    <ModalListItem
                      title="Restore backup (with instance name)"
                      description="Restore backup with volume and instance list information."
                      category="Backup"
                      size="md"
                      onOpen={() => openModalFn('restore-backup-medium')}
                    />
                    <ModalListItem
                      title="Restore backup (with instance name and warning)"
                      description="Restore backup with warning alert and disabled action button."
                      category="Backup"
                      size="lg"
                      onOpen={() => openModalFn('restore-backup-large')}
                    />
                  </div>
                </VStack>

                {/* Floating IP */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Floating IP{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Disassociate floating IP"
                      description="Confirm disassociation of a floating IP from a resource."
                      category="Network"
                      size="sm"
                      onOpen={() => openModalFn('disassociate-floating-i-p')}
                    />
                    <ModalListItem
                      title="Disassociate floating IP (Load balancer)"
                      description="Disassociate a floating IP from a load balancer."
                      category="Network"
                      size="sm"
                      onOpen={() => openModalFn('disassociate-floating-i-p-l-b')}
                    />
                    <ModalListItem
                      title="Release floating IP"
                      description="Release a single floating IP with warning about permanent action."
                      category="Network"
                      size="sm"
                      onOpen={() => openModalFn('release-floating-i-p-small')}
                    />
                    <ModalListItem
                      title="Release floating IP (Associated to)"
                      description="Release multiple floating IPs with scrollable list."
                      category="Network"
                      size="md"
                      onOpen={() => openModalFn('release-floating-i-p-medium')}
                    />
                  </div>
                </VStack>

                {/* Load balancers */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Load balancers{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete load balancer"
                      description="Delete a single load balancer with warning about associated resources."
                      category="Network"
                      size="sm"
                      onOpen={() => openModalFn('delete-load-balancer')}
                    />
                    <ModalListItem
                      title="Release load balancers"
                      description="Delete multiple load balancers with scrollable list and warning."
                      category="Network"
                      size="md"
                      onOpen={() => openModalFn('delete-load-balancers-multiple')}
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
                    IAM{' '}
                  </Badge>
                  <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                    Modals{' '}
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(29 modals)</span>
                </div>
              </div>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={4} className="pt-4">
                {/* User Management Modals */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    User Management{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete user"
                      description="Confirm deletion of a user with warning about permanent action."
                      category="User"
                      size="sm"
                      onOpen={() => openModalFn('delete-user')}
                    />
                    <ModalListItem
                      title="Delete users (Multiple)"
                      description="Delete multiple users with lists of deletable and non-deletable users."
                      category="User"
                      size="md"
                      onOpen={() => openModalFn('delete-users-multiple')}
                    />
                    <ModalListItem
                      title="Confirm user password"
                      description="Display username and password credentials with copy functionality."
                      category="User"
                      size="sm"
                      onOpen={() => openModalFn('confirm-user-password')}
                    />
                    <ModalListItem
                      title="Detach user group"
                      description="Confirm detaching a user from a user group with warning about permission removal."
                      category="User"
                      size="sm"
                      onOpen={() => openModalFn('detach-user-group')}
                    />
                    <ModalListItem
                      title="Detach role"
                      description="Confirm detaching a role from a user with warning about permission removal."
                      category="User"
                      size="sm"
                      onOpen={() => openModalFn('detach-role')}
                    />
                    <ModalListItem
                      title="Remove OTP MFA"
                      description="Confirm removing OTP MFA for a user with warning about re-registration."
                      category="User"
                      size="sm"
                      onOpen={() => openModalFn('remove-otp-mfa')}
                    />
                    <ModalListItem
                      title="Terminate all sessions"
                      description="Confirm terminating all sessions for a user with warning about sign-out."
                      category="User"
                      size="sm"
                      onOpen={() => openModalFn('terminate-all-sessions')}
                    />
                    <ModalListItem
                      title="Terminate session"
                      description="Confirm terminating a single session with warning about sign-out from device."
                      category="User"
                      size="sm"
                      onOpen={() => openModalFn('terminate-session')}
                    />
                    <ModalListItem
                      title="Remove user from group"
                      description="Confirm removing a user from a group with warning about permission removal."
                      category="User"
                      size="sm"
                      onOpen={() => openModalFn('remove-user-from-group')}
                    />
                    <ModalListItem
                      title="Delete role"
                      description="Confirm deleting a role with warning about permission removal."
                      category="Role"
                      size="sm"
                      onOpen={() => openModalFn('delete-role')}
                    />
                    <ModalListItem
                      title="Delete roles (Multiple)"
                      description="Confirm deleting multiple roles with lists of deletable and non-deletable roles."
                      category="Role"
                      size="md"
                      onOpen={() => openModalFn('delete-roles-multiple')}
                    />
                    <ModalListItem
                      title="Detach policy"
                      description="Confirm detaching a policy from a role with warning about permission revocation."
                      category="Role"
                      size="sm"
                      onOpen={() => openModalFn('detach-policy')}
                    />
                    <ModalListItem
                      title="Delete policy"
                      description="Confirm deleting a policy with warning about permanent removal and access loss."
                      category="Policy"
                      size="sm"
                      onOpen={() => openModalFn('delete-policy')}
                    />
                    <ModalListItem
                      title="Delete policies (Multiple)"
                      description="Confirm deleting multiple policies with lists of deletable/non-deletable policies."
                      category="Policy"
                      size="md"
                      onOpen={() => openModalFn('delete-policies-multiple')}
                    />
                    <ModalListItem
                      title="Revert policy version"
                      description="Confirm reverting a policy to a previous version with warning about permission changes."
                      category="Policy"
                      size="sm"
                      onOpen={() => openModalFn('revert-policy-version')}
                    />
                    <ModalListItem
                      title="Delete policy version"
                      description="Confirm deleting a specific policy version with warning about permanent removal."
                      category="Policy"
                      size="sm"
                      onOpen={() => openModalFn('delete-policy-version')}
                    />
                    <ModalListItem
                      title="Update MFA enforcement policy"
                      description="Confirm applying MFA enforcement policy changes with warning about authentication impact."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-mfa-enforcement')}
                    />
                    <ModalListItem
                      title="Update OTP policy"
                      description="Confirm applying OTP policy changes with warning about MFA method availability."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-otp-policy')}
                    />
                    <ModalListItem
                      title="Update OTP policy settings"
                      description="Confirm applying OTP policy settings changes without warning alert."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-otp-policy-settings')}
                    />
                    <ModalListItem
                      title="Update email policy"
                      description="Confirm applying email policy changes with warning about MFA method availability."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-email-policy')}
                    />
                    <ModalListItem
                      title="Update email policy settings"
                      description="Confirm applying email policy settings changes without warning alert."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-email-policy-settings')}
                    />
                    <ModalListItem
                      title="Update general session policy"
                      description="Confirm applying session policy changes for timeout and lifespan settings."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-general-session-policy')}
                    />
                    <ModalListItem
                      title="Delete domain"
                      description="Permanently delete a domain and all its configurations."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('delete-domain')}
                    />
                    <ModalListItem
                      title="Switch to domain"
                      description="Confirm switching to a different domain with unsaved changes warning."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('switch-to-domain')}
                    />
                    <ModalListItem
                      title="Delete system administrator"
                      description="Permanently delete a system administrator and their global access."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('delete-system-admin')}
                    />
                    <ModalListItem
                      title="Update password policy"
                      description="Confirm applying password policy changes for length, requirements, and expiration."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-password-policy')}
                    />
                    <ModalListItem
                      title="Update account lockout policy"
                      description="Confirm applying account lockout policy changes for lockout type settings."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-account-lockout-policy')}
                    />
                    <ModalListItem
                      title="Update token policy"
                      description="Confirm applying token policy changes for access and refresh token lifespan."
                      category="Security"
                      size="sm"
                      onOpen={() => openModalFn('update-token-policy')}
                    />
                  </div>
                </VStack>

                {/* General Modals */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    General{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Unsaved changes"
                      description="Confirm leaving page with unsaved changes."
                      category="Navigation"
                      size="sm"
                      onOpen={() => openModalFn('unsaved-changes')}
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
                    Container{' '}
                  </Badge>
                  <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                    Modals{' '}
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(12 modals)</span>
                </div>
              </div>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={4} className="pt-4">
                {/* Cluster Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Cluster Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete cluster"
                      description="Confirm deletion of a Kubernetes cluster."
                      category="Cluster"
                      size="sm"
                      onOpen={() => openModalFn('delete-cluster')}
                    />
                    <ModalListItem
                      title="Delete namespace"
                      description="Confirm deletion of a Kubernetes namespace."
                      category="Namespace"
                      size="sm"
                      onOpen={() => openModalFn('delete-namespace')}
                    />
                  </div>
                </VStack>

                {/* Workload Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Workload Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete pod"
                      description="Confirm deletion of a Kubernetes pod."
                      category="Pod"
                      size="sm"
                      onOpen={() => openModalFn('delete-pod')}
                    />
                    <ModalListItem
                      title="Delete deployment"
                      description="Confirm deletion of a Kubernetes deployment."
                      category="Deployment"
                      size="sm"
                      onOpen={() => openModalFn('delete-deployment')}
                    />
                    <ModalListItem
                      title="Redeploy deployment"
                      description="Redeploy a Kubernetes deployment with warning about downtime."
                      category="Deployment"
                      size="sm"
                      onOpen={() => openModalFn('redeploy-deployment')}
                    />
                    <ModalListItem
                      title="Roll back deployment"
                      description="Roll back a Kubernetes deployment to a previous revision."
                      category="Deployment"
                      size="sm"
                      onOpen={() => openModalFn('roll-back-deployment')}
                    />
                    <ModalListItem
                      title="Delete statefulSet"
                      description="Confirm deletion of a Kubernetes stateful set."
                      category="StatefulSet"
                      size="sm"
                      onOpen={() => openModalFn('delete-stateful-set')}
                    />
                    <ModalListItem
                      title="Redeploy statefulSet"
                      description="Redeploy a Kubernetes stateful set with warning about downtime."
                      category="StatefulSet"
                      size="sm"
                      onOpen={() => openModalFn('redeploy-stateful-set')}
                    />
                    <ModalListItem
                      title="Delete daemonSet"
                      description="Confirm deletion of a Kubernetes daemon set."
                      category="DaemonSet"
                      size="sm"
                      onOpen={() => openModalFn('delete-daemon-set')}
                    />
                    <ModalListItem
                      title="Redeploy daemonSet"
                      description="Redeploy a Kubernetes daemon set with warning about downtime."
                      category="DaemonSet"
                      size="sm"
                      onOpen={() => openModalFn('redeploy-daemon-set')}
                    />
                    <ModalListItem
                      title="Delete job"
                      description="Confirm deletion of a Kubernetes job."
                      category="Job"
                      size="sm"
                      onOpen={() => openModalFn('delete-job')}
                    />
                    <ModalListItem
                      title="Delete cronjob"
                      description="Confirm deletion of a Kubernetes cron job."
                      category="CronJob"
                      size="sm"
                      onOpen={() => openModalFn('delete-cron-job')}
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
                    Storage{' '}
                  </Badge>
                  <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                    Modals{' '}
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(1 modal)</span>
                </div>
              </div>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={4} className="pt-4">
                {/* Delete Modals */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Delete Modals{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete bucket"
                      description="Confirm deletion of a non-empty bucket with warning about permanent data loss."
                      category="Bucket"
                      size="sm"
                      onOpen={() => openModalFn('delete-bucket')}
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
                    Compute Admin{' '}
                  </Badge>
                  <span className="text-body-lg font-semibold text-[var(--color-text-default)]">
                    Modals{' '}
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(71 modals)</span>
                </div>
              </div>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={4} className="pt-4">
                {/* Single Instance Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Single Instance Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Stop instance"
                      description="Stop a single instance with warning about service interruption."
                      category="Instance"
                      size="sm"
                      onOpen={() => openModalFn('stop-instance')}
                    />
                    <ModalListItem
                      title="Reboot instance"
                      description="Reboot a single instance with warning about service interruption."
                      category="Instance"
                      size="sm"
                      onOpen={() => openModalFn('reboot-instance')}
                    />
                    <ModalListItem
                      title="Soft reboot instance"
                      description="Perform a soft reboot of a single instance."
                      category="Instance"
                      size="sm"
                      onOpen={() => openModalFn('soft-reboot-instance')}
                    />
                    <ModalListItem
                      title="Confirm resize"
                      description="Confirm the resized state of an instance."
                      category="Instance"
                      size="sm"
                      onOpen={() => openModalFn('confirm-resize')}
                    />
                    <ModalListItem
                      title="Revert resize"
                      description="Revert an instance to its previous state before resize."
                      category="Instance"
                      size="sm"
                      onOpen={() => openModalFn('revert-resize')}
                    />
                    <ModalListItem
                      title="Delete instance"
                      description="Permanently delete a single instance."
                      category="Instance"
                      size="sm"
                      onOpen={() => openModalFn('delete-instance')}
                    />
                    <ModalListItem
                      title="Shelve instance"
                      description="Shelve a single instance with warning about service interruption."
                      category="Instance"
                      size="sm"
                      onOpen={() => openModalFn('shelve-instance')}
                    />
                  </div>
                </VStack>

                {/* Multiple Instances Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Multiple Instances Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Start instances"
                      description="Start multiple selected instances with eligibility check."
                      category="Instances"
                      size="md"
                      onOpen={() => openModalFn('start-instances')}
                    />
                    <ModalListItem
                      title="Stop instances"
                      description="Stop multiple selected instances with eligibility check."
                      category="Instances"
                      size="md"
                      onOpen={() => openModalFn('stop-instances')}
                    />
                    <ModalListItem
                      title="Reboot instances"
                      description="Reboot multiple selected instances with eligibility check."
                      category="Instances"
                      size="md"
                      onOpen={() => openModalFn('reboot-instances')}
                    />
                    <ModalListItem
                      title="Delete instances"
                      description="Permanently delete multiple selected instances with eligibility check."
                      category="Instances"
                      size="md"
                      onOpen={() => openModalFn('delete-instances')}
                    />
                  </div>
                </VStack>

                {/* Resource Delete Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Resource Delete Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete instance template"
                      description="Permanently delete a single instance template."
                      category="Template"
                      size="sm"
                      onOpen={() => openModalFn('delete-instance-template')}
                    />
                    <ModalListItem
                      title="Delete instance templates"
                      description="Permanently delete multiple instance templates."
                      category="Templates"
                      size="md"
                      onOpen={() => openModalFn('delete-instance-templates')}
                    />
                    <ModalListItem
                      title="Delete image"
                      description="Permanently delete a single image."
                      category="Image"
                      size="sm"
                      onOpen={() => openModalFn('delete-image')}
                    />
                    <ModalListItem
                      title="Delete images"
                      description="Permanently delete multiple images with eligibility check."
                      category="Images"
                      size="md"
                      onOpen={() => openModalFn('delete-images')}
                    />
                    <ModalListItem
                      title="Delete snapshot"
                      description="Permanently delete a single snapshot."
                      category="Snapshot"
                      size="sm"
                      onOpen={() => openModalFn('delete-snapshot')}
                    />
                    <ModalListItem
                      title="Delete snapshots"
                      description="Permanently delete multiple snapshots with eligibility check."
                      category="Snapshots"
                      size="md"
                      onOpen={() => openModalFn('delete-snapshots')}
                    />
                  </div>
                </VStack>

                {/* Storage Delete Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Storage Delete Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete volume"
                      description="Permanently delete a single volume."
                      category="Volume"
                      size="sm"
                      onOpen={() => openModalFn('delete-volume')}
                    />
                    <ModalListItem
                      title="Delete volumes"
                      description="Permanently delete multiple volumes with eligibility check."
                      category="Volumes"
                      size="md"
                      onOpen={() => openModalFn('delete-volumes')}
                    />
                    <ModalListItem
                      title="Delete volume type"
                      description="Permanently delete a single volume type."
                      category="VolumeType"
                      size="sm"
                      onOpen={() => openModalFn('delete-volume-type')}
                    />
                    <ModalListItem
                      title="Delete volume types"
                      description="Permanently delete multiple volume types."
                      category="VolumeTypes"
                      size="sm"
                      onOpen={() => openModalFn('delete-volume-types')}
                    />
                    <ModalListItem
                      title="Delete backup"
                      description="Permanently delete a single backup."
                      category="Backup"
                      size="sm"
                      onOpen={() => openModalFn('delete-backup')}
                    />
                    <ModalListItem
                      title="Delete backups"
                      description="Permanently delete multiple backups with eligibility check."
                      category="Backups"
                      size="md"
                      onOpen={() => openModalFn('delete-backups')}
                    />
                    <ModalListItem
                      title="Delete encryption"
                      description="Remove encryption configuration from a volume type."
                      category="Encryption"
                      size="sm"
                      onOpen={() => openModalFn('delete-encryption')}
                    />
                    <ModalListItem
                      title="Delete extra spec"
                      description="Remove extra specification from a volume type."
                      category="ExtraSpec"
                      size="sm"
                      onOpen={() => openModalFn('delete-extra-spec')}
                    />
                    <ModalListItem
                      title="Delete extra specs"
                      description="Remove multiple extra specifications from a volume type."
                      category="ExtraSpecs"
                      size="sm"
                      onOpen={() => openModalFn('delete-extra-specs')}
                    />
                    <ModalListItem
                      title="Delete QoS spec"
                      description="Permanently delete a single QoS specification."
                      category="QoSSpec"
                      size="sm"
                      onOpen={() => openModalFn('delete-qo-s-spec')}
                    />
                    <ModalListItem
                      title="Delete QoS specs"
                      description="Permanently delete multiple QoS specifications."
                      category="QoSSpecs"
                      size="sm"
                      onOpen={() => openModalFn('delete-qo-s-specs')}
                    />
                    <ModalListItem
                      title="Delete QoS extra spec"
                      description="Remove extra specification from a QoS spec."
                      category="QoSExtra"
                      size="sm"
                      onOpen={() => openModalFn('delete-qo-s-extra-spec')}
                    />
                    <ModalListItem
                      title="Delete QoS extra specs"
                      description="Remove multiple extra specifications from a QoS spec."
                      category="QoSExtras"
                      size="sm"
                      onOpen={() => openModalFn('delete-qo-s-extra-specs')}
                    />
                  </div>
                </VStack>

                {/* Network Delete Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Network Delete Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete network"
                      description="Permanently delete a single network with warning."
                      category="Network"
                      size="sm"
                      onOpen={() => openModalFn('delete-network')}
                    />
                    <ModalListItem
                      title="Delete networks"
                      description="Permanently delete multiple networks with eligibility check."
                      category="Networks"
                      size="md"
                      onOpen={() => openModalFn('delete-networks')}
                    />
                    <ModalListItem
                      title="Delete subnet"
                      description="Permanently delete a single subnet with warning."
                      category="Subnet"
                      size="sm"
                      onOpen={() => openModalFn('delete-subnet')}
                    />
                    <ModalListItem
                      title="Delete subnets"
                      description="Permanently delete multiple subnets."
                      category="Subnets"
                      size="sm"
                      onOpen={() => openModalFn('delete-subnets')}
                    />
                    <ModalListItem
                      title="Delete port"
                      description="Permanently delete a single port with warning."
                      category="Port"
                      size="sm"
                      onOpen={() => openModalFn('delete-port')}
                    />
                    <ModalListItem
                      title="Delete ports"
                      description="Permanently delete multiple ports with warning."
                      category="Ports"
                      size="sm"
                      onOpen={() => openModalFn('delete-ports')}
                    />
                    <ModalListItem
                      title="Delete router"
                      description="Permanently delete a single router with warning."
                      category="Router"
                      size="sm"
                      onOpen={() => openModalFn('delete-router')}
                    />
                    <ModalListItem
                      title="Delete routers"
                      description="Permanently delete multiple routers with eligibility check."
                      category="Routers"
                      size="md"
                      onOpen={() => openModalFn('delete-routers')}
                    />
                    <ModalListItem
                      title="Delete static routes"
                      description="Permanently delete multiple static routes."
                      category="Routes"
                      size="sm"
                      onOpen={() => openModalFn('delete-static-routes')}
                    />
                    <ModalListItem
                      title="Remove DHCP agents"
                      description="Remove DHCP agents from a network."
                      category="DHCP"
                      size="sm"
                      onOpen={() => openModalFn('remove-d-h-c-p-agents')}
                    />
                    <ModalListItem
                      title="Release fixed IP"
                      description="Release a fixed IP address from a port."
                      category="IP"
                      size="sm"
                      onOpen={() => openModalFn('release-fixed-i-p')}
                    />
                    <ModalListItem
                      title="Delete allowed address pair"
                      description="Remove an allowed address pair from a port."
                      category="Address"
                      size="sm"
                      onOpen={() => openModalFn('delete-allowed-address-pair')}
                    />
                    <ModalListItem
                      title="Delete security group"
                      description="Permanently delete a single security group."
                      category="SecGroup"
                      size="sm"
                      onOpen={() => openModalFn('delete-security-group-admin')}
                    />
                    <ModalListItem
                      title="Delete security groups"
                      description="Permanently delete multiple security groups."
                      category="SecGroups"
                      size="md"
                      onOpen={() => openModalFn('delete-security-groups-admin')}
                    />
                    <ModalListItem
                      title="Delete firewall"
                      description="Permanently delete a single firewall."
                      category="Firewall"
                      size="sm"
                      onOpen={() => openModalFn('delete-firewall')}
                    />
                    <ModalListItem
                      title="Delete firewalls"
                      description="Permanently delete multiple firewalls."
                      category="Firewalls"
                      size="md"
                      onOpen={() => openModalFn('delete-firewalls')}
                    />
                    <ModalListItem
                      title="Unsaved changes"
                      description="Confirm leaving with unsaved changes."
                      category="Confirm"
                      size="sm"
                      onOpen={() => openModalFn('unsaved-changes-admin')}
                    />
                  </div>
                </VStack>

                {/* Load Balancer & Security Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Load Balancer & Security Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Disassociate floating IP"
                      description="Disassociate a floating IP from a resource."
                      category="FloatingIP"
                      size="sm"
                      onOpen={() => openModalFn('disassociate-floating-i-p')}
                    />
                    <ModalListItem
                      title="Release floating IP"
                      description="Release a single floating IP address."
                      category="FloatingIP"
                      size="sm"
                      onOpen={() => openModalFn('release-floating-i-p')}
                    />
                    <ModalListItem
                      title="Release floating IPs"
                      description="Release multiple floating IP addresses."
                      category="FloatingIPs"
                      size="sm"
                      onOpen={() => openModalFn('release-floating-i-ps')}
                    />
                    <ModalListItem
                      title="Delete load balancer"
                      description="Permanently delete a single load balancer."
                      category="LB"
                      size="sm"
                      onOpen={() => openModalFn('delete-load-balancer-admin')}
                    />
                    <ModalListItem
                      title="Delete load balancers"
                      description="Permanently delete multiple load balancers."
                      category="LBs"
                      size="md"
                      onOpen={() => openModalFn('delete-load-balancers-admin')}
                    />
                    <ModalListItem
                      title="Delete listener"
                      description="Permanently delete a single listener."
                      category="Listener"
                      size="sm"
                      onOpen={() => openModalFn('delete-listener')}
                    />
                    <ModalListItem
                      title="Delete listeners"
                      description="Permanently delete multiple listeners."
                      category="Listeners"
                      size="md"
                      onOpen={() => openModalFn('delete-listeners')}
                    />
                    <ModalListItem
                      title="Delete pool"
                      description="Permanently delete a single pool."
                      category="Pool"
                      size="sm"
                      onOpen={() => openModalFn('delete-pool')}
                    />
                    <ModalListItem
                      title="Delete pools"
                      description="Permanently delete multiple pools."
                      category="Pools"
                      size="md"
                      onOpen={() => openModalFn('delete-pools')}
                    />
                    <ModalListItem
                      title="Delete member"
                      description="Remove a single member from a pool."
                      category="Member"
                      size="sm"
                      onOpen={() => openModalFn('delete-member')}
                    />
                    <ModalListItem
                      title="Delete members"
                      description="Remove multiple members from a pool."
                      category="Members"
                      size="md"
                      onOpen={() => openModalFn('delete-members')}
                    />
                    <ModalListItem
                      title="Delete security group rule"
                      description="Permanently delete a single security group rule."
                      category="Rule"
                      size="sm"
                      onOpen={() => openModalFn('delete-security-group-rule')}
                    />
                    <ModalListItem
                      title="Delete security group rules"
                      description="Permanently delete multiple security group rules."
                      category="Rules"
                      size="md"
                      onOpen={() => openModalFn('delete-security-group-rules')}
                    />
                    <ModalListItem
                      title="Delete L7 policy"
                      description="Permanently delete a single L7 policy."
                      category="L7Policy"
                      size="sm"
                      onOpen={() => openModalFn('delete-l7-policy')}
                    />
                    <ModalListItem
                      title="Delete L7 policies"
                      description="Permanently delete multiple L7 policies."
                      category="L7Policies"
                      size="md"
                      onOpen={() => openModalFn('delete-l7-policies')}
                    />
                    <ModalListItem
                      title="Delete health monitor"
                      description="Permanently delete a health monitor from a pool."
                      category="Monitor"
                      size="sm"
                      onOpen={() => openModalFn('delete-health-monitor')}
                    />
                  </div>
                </VStack>

                {/* Firewall & Tenant Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Firewall & Tenant Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete firewall policy"
                      description="Permanently delete a single firewall policy."
                      category="FWPolicy"
                      size="sm"
                      onOpen={() => openModalFn('delete-firewall-policy')}
                    />
                    <ModalListItem
                      title="Delete firewall policies"
                      description="Permanently delete multiple firewall policies."
                      category="FWPolicies"
                      size="md"
                      onOpen={() => openModalFn('delete-firewall-policies')}
                    />
                    <ModalListItem
                      title="Delete firewall rule"
                      description="Permanently delete a single firewall rule."
                      category="FWRule"
                      size="sm"
                      onOpen={() => openModalFn('delete-firewall-rule')}
                    />
                    <ModalListItem
                      title="Delete firewall rules"
                      description="Permanently delete multiple firewall rules."
                      category="FWRules"
                      size="md"
                      onOpen={() => openModalFn('delete-firewall-rules')}
                    />
                    <ModalListItem
                      title="Delete tenant"
                      description="Permanently delete a single tenant."
                      category="Tenant"
                      size="sm"
                      onOpen={() => openModalFn('delete-tenant')}
                    />
                    <ModalListItem
                      title="Delete tenants"
                      description="Permanently delete multiple tenants."
                      category="Tenants"
                      size="sm"
                      onOpen={() => openModalFn('delete-tenants')}
                    />
                    <ModalListItem
                      title="Delete metadata"
                      description="Remove a single metadata entry."
                      category="Metadata"
                      size="sm"
                      onOpen={() => openModalFn('delete-metadata')}
                    />
                    <ModalListItem
                      title="Delete metadatas"
                      description="Remove multiple metadata entries."
                      category="Metadatas"
                      size="md"
                      onOpen={() => openModalFn('delete-metadatas')}
                    />
                    <ModalListItem
                      title="Manage member"
                      description="Redirect to IAM to manage users and groups."
                      category="IAM"
                      size="sm"
                      onOpen={() => openModalFn('manage-member')}
                    />
                  </div>
                </VStack>
              </VStack>
            </Disclosure.Panel>
          </Disclosure>

          {/* AI Agent Modals */}
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
                    Modals{' '}
                  </span>
                  <span className="text-body-md text-[var(--color-text-subtle)]">(1 modal)</span>
                </div>
              </div>
            </Disclosure.Trigger>
            <Disclosure.Panel>
              <VStack gap={4} className="pt-4">
                {/* Agent Actions */}
                <VStack gap={2}>
                  <h2 className="text-body-lg font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider px-1">
                    Agent Actions{' '}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <ModalListItem
                      title="Delete agent source"
                      description="Confirm deletion of an agent source with warning."
                      category="Agent"
                      size="sm"
                      onOpen={() => openModalFn('delete-agent-source')}
                    />
                  </div>
                </VStack>
              </VStack>
            </Disclosure.Panel>
          </Disclosure>
        </VStack>
      </VStack>

      {/* Modal components */}

      {/* Delete Snapshot Modal */}
      <Modal
        isOpen={openModal === 'confirm-delete'}
        onClose={closeModal}
        title="Delete snapshot"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Snapshot Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Snapshot name{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              2cdfafc1
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting a snapshot is a permanent action and cannot be undone. Any volumes or
              instances created from this snapshot will not be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Snapshot deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Security group Modal (Single) */}
      <Modal
        isOpen={openModal === 'delete-security-group'}
        onClose={closeModal}
        title="Delete security group"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Security group Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Security group{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">sg-01</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security group and all its rules.
              <br />
              If this group is attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security group deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Security groups Modal (Multiple) */}
      <Modal
        isOpen={openModal === 'delete-security-groups-multiple'}
        onClose={closeModal}
        title="Delete security groups"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Security groups Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Security groups(10)
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
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
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security groups and all its rules.
              <br />
              If these groups are attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security groups deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Rule Modal (Single) */}
      <Modal
        isOpen={openModal === 'delete-rule'}
        onClose={closeModal}
        title="Delete rule"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Rule Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Rule </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              Ingress TCP 80 from 0.0.0.0/0{' '}
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Rule deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Rules Modal (Multiple with Warning) */}
      <Modal
        isOpen={openModal === 'delete-rules-multiple'}
        onClose={closeModal}
        title="Delete rules"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Rules Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Rules(10)
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
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
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action will permanently delete the selected rules.
              <br />
              If these rules are attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Rules deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Detach volume Modal */}
      <Modal
        isOpen={openModal === 'detach-volume'}
        onClose={closeModal}
        title="Detach volume"
        description="This action detaches the volume."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume name{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">vol57</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Make sure the filesystem inside the instance is unmounted before detaching. Detaching
              a volume while the instance is running may cause data corruption.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Volume detached');
              closeModal();
            }}
            className="flex-1"
          >
            Release{' '}
          </Button>
        </div>
      </Modal>

      {/* Restore backup (Small) Modal */}
      <Modal
        isOpen={openModal === 'restore-backup-small'}
        onClose={closeModal}
        title="Restore backup"
        description="This action restores the backup."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume name{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Backup restored');
              closeModal();
            }}
            className="flex-1"
          >
            Restore{' '}
          </Button>
        </div>
      </Modal>

      {/* Restore backup (Medium) Modal */}
      <Modal
        isOpen={openModal === 'restore-backup-medium'}
        onClose={closeModal}
        title="Restore backup"
        description="This action restores the backup."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume name{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>

          {/* Instance Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance name{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-1 (Shutoff)</li>
              <li>dev-team (Shutoff)</li>
              <li>AI-training-02 (Shutoff)</li>
              <li>web-server-1 (Shutoff)</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Backup restored');
              closeModal();
            }}
            className="flex-1"
          >
            Restore{' '}
          </Button>
        </div>
      </Modal>

      {/* Restore backup (Large) Modal */}
      <Modal
        isOpen={openModal === 'restore-backup-large'}
        onClose={closeModal}
        title="Restore backup"
        description="This action restores the backup."
        size="lg"
      >
        <div className="flex flex-col gap-2">
          {/* Volume Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume name{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              vol-01 (Available)
            </span>
          </div>

          {/* Instance Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance name{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-1 (Shutoff)</li>
              <li>dev-team (Shutoff)</li>
              <li>AI-training-02 (Shutoff)</li>
              <li>web-server-1 (Shutoff)</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Restore cannot proceed. Change the backup status to Available or shut down the
              attached instance.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button variant="primary" size="md" disabled className="flex-1">
            Restore{' '}
          </Button>
        </div>
      </Modal>

      {/* Disassociate floating IP Modal */}
      <Modal
        isOpen={openModal === 'disassociate-floating-i-p'}
        onClose={closeModal}
        title="Disassociate floating IP"
        description="Disassociating will detach the floating IP from the selected resource. External access via this IP will stop immediately. The IP will remain in your project and can be re-associated later."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Floating IP{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              123.45.67.8{' '}
            </span>
          </div>

          {/* Associated to Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Associated to{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Type : Instance</li>
              <li>Name : server-01</li>
              <li>Fixed IP : 10.0.0.10</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Disassociate floating IP confirmed');
              closeModal();
            }}
            className="flex-1"
          >
            Disassociate{' '}
          </Button>
        </div>
      </Modal>

      {/* Disassociate floating IP (Load balancer) Modal */}
      <Modal
        isOpen={openModal === 'disassociate-floating-i-p-l-b'}
        onClose={closeModal}
        title="Disassociate floating IP"
        description="Disassociating will detach the floating IP from this load balancer. External access to the load balancer will be interrupted."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Load balancer Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Load balancer{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-lb-01(10.0.0.10)
            </span>
          </div>

          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Floating IP{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              123.45.67.8{' '}
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Disassociate floating IP from load balancer confirmed');
              closeModal();
            }}
            className="flex-1"
          >
            Disassociate{' '}
          </Button>
        </div>
      </Modal>

      {/* Release floating IP (Small) Modal */}
      <Modal
        isOpen={openModal === 'release-floating-i-p-small'}
        onClose={closeModal}
        title="Release floating IP"
        description="This action releases the floating IP."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Floating IP Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Floating IP{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              123.45.67.8{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Releasing will detach this IP from its target and remove it from your project.
              External access via this IP will stop immediately.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Release floating IP confirmed');
              closeModal();
            }}
            className="flex-1"
          >
            Release{' '}
          </Button>
        </div>
      </Modal>

      {/* Release floating IP (Medium) Modal */}
      <Modal
        isOpen={openModal === 'release-floating-i-p-medium'}
        onClose={closeModal}
        title="Release floating IP"
        description="This action releases the floating IP."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Associated to Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Associated to{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
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
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Releasing will detach these IPs from their target and remove them from your project.
              External access via these IP will stop immediately.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Disassociate floating IPs confirmed');
              closeModal();
            }}
            className="flex-1"
          >
            Disassociate{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Load balancer Modal (Single) */}
      <Modal
        isOpen={openModal === 'delete-load-balancer'}
        onClose={closeModal}
        title="Delete load balancer"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Load balancer Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Load balancer{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-lb-01{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              All listeners, pools, and members associated with it will be removed.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Load balancer deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Release Load balancers Modal (Multiple) */}
      <Modal
        isOpen={openModal === 'delete-load-balancers-multiple'}
        onClose={closeModal}
        title="Release load balancers"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Load balancers Info Box with Scrollable List */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Load balancers{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
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
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              All listeners, pools, and members associated with them will be removed.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Load balancers deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* ========================================
          IAM MODALS ======================================== */}

      {/* Delete User Modal */}
      <Modal
        isOpen={openModal === 'delete-user'}
        onClose={closeModal}
        title="Delete user"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">User </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DISPLAY NAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this user will permanently remove all associated access and sessions. This
              action cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('User deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Users (Multiple) Modal */}
      <Modal
        isOpen={openModal === 'delete-users-multiple'}
        onClose={closeModal}
        title="Delete users"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Users that can be deleted Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Users that can be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>web-server-03</li>
              <li>web-server-05</li>
              <li>web-server-07</li>
            </ul>
          </div>

          {/* Users that cannot be deleted Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Users that cannot be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>my-server-04 (Locked instances cannot be deleted.)</li>
              <li>my-server-03 (Instances in current state cannot be deleted.)</li>
              <li>my-server-02</li>
              <li>my-server-82</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these users will permanently remove all associated access and sessions. This
              action cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Users deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Confirm User Password Modal */}
      <Modal
        isOpen={openModal === 'confirm-user-password'}
        onClose={closeModal}
        title="Confirm user password"
        description="Review the username and password. The password can only be viewed at this step."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Username Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Username{' '}
            </span>
            <div className="flex items-center gap-1.5 min-h-[26px]">
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                john.doe{' '}
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
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Password{' '}
            </span>
            <div className="flex items-center gap-1.5 min-h-[26px]">
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
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
          <Button variant="primary" size="md" onClick={closeModal} className="flex-1">
            Close{' '}
          </Button>
        </div>
      </Modal>

      {/* Unsaved Changes Modal */}
      <Modal
        isOpen={openModal === 'unsaved-changes'}
        onClose={closeModal}
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
              closeModal();
            }}
            className="flex-1"
          >
            Leave{' '}
          </Button>
          <Button variant="primary" size="md" onClick={closeModal} className="flex-1">
            Stay{' '}
          </Button>
        </div>
      </Modal>

      {/* Detach User Group Modal */}
      <Modal
        isOpen={openModal === 'detach-user-group'}
        onClose={closeModal}
        title="Detach user group"
        description="This action detaches the user from the group."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">User </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DISPLAY NAME{' '}
            </span>
          </div>

          {/* User Group Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              User group{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              USERGROUP NAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Detaching this user will immediately remove all permissions granted through this
              group.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('User detached from group');
              closeModal();
            }}
            className="flex-1"
          >
            Detach{' '}
          </Button>
        </div>
      </Modal>

      {/* Detach Role Modal */}
      <Modal
        isOpen={openModal === 'detach-role'}
        onClose={closeModal}
        title="Detach role"
        description="This action detaches the role from the user."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">User </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DISPLAY NAME{' '}
            </span>
          </div>

          {/* Role Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Role </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              ROLENAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Detaching this role will immediately remove all permissions granted through this role.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Role detached from user');
              closeModal();
            }}
            className="flex-1"
          >
            Detach{' '}
          </Button>
        </div>
      </Modal>

      {/* Remove OTP MFA Modal */}
      <Modal
        isOpen={openModal === 'remove-otp-mfa'}
        onClose={closeModal}
        title="Remove OTP MFA"
        description="This action removes OTP MFA for the user."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">User </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DISPLAY NAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Removing OTP MFA will require the user to register OTP authentication again.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('OTP MFA removed');
              closeModal();
            }}
            className="flex-1"
          >
            Remove{' '}
          </Button>
        </div>
      </Modal>

      {/* Terminate All Sessions Modal */}
      <Modal
        isOpen={openModal === 'terminate-all-sessions'}
        onClose={closeModal}
        title="Terminate all sessions"
        description="This action terminates all sessions for the user."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">User </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DISPLAYNAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Terminating all sessions will immediately sign the user out from all devices and
              require re-authentication.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('All sessions terminated');
              closeModal();
            }}
            className="flex-1"
          >
            Terminate{' '}
          </Button>
        </div>
      </Modal>

      {/* Terminate Session Modal (Single Session) */}
      <Modal
        isOpen={openModal === 'terminate-session'}
        onClose={closeModal}
        title="Terminate session"
        description="This action terminates the session."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Session Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Session{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DISPLAYNAME (Browser/device)
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Terminating this session will sign the user out from this device and require
              re-authentication.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Session terminated');
              closeModal();
            }}
            className="flex-1"
          >
            Terminate{' '}
          </Button>
        </div>
      </Modal>

      {/* Remove User From Group Modal */}
      <Modal
        isOpen={openModal === 'remove-user-from-group'}
        onClose={closeModal}
        title="Remove user"
        description="This action removes the user from the group."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* User Group Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              User group{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              USERGROUP NAME{' '}
            </span>
          </div>

          {/* User Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">User </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DISPLAY NAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Removing this user will immediately remove all permissions granted through this group.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('User removed from group');
              closeModal();
            }}
            className="flex-1"
          >
            Remove{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Role Modal */}
      <Modal
        isOpen={openModal === 'delete-role'}
        onClose={closeModal}
        title="Delete role"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Role Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Role </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              ROLENAME
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this role will immediately remove all permissions granted through this role.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Role deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Roles (Multiple) Modal */}
      <Modal
        isOpen={openModal === 'delete-roles-multiple'}
        onClose={closeModal}
        title="Delete roles"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Roles that can be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Roles that can be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>web-server-03</li>
              <li>web-server-05</li>
              <li>web-server-07</li>
            </ul>
          </div>

          {/* Roles that cannot be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Roles that cannot be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>my-server-04 (Locked instances cannot be deleted.)</li>
              <li>my-server-03 (Instances in current state cannot be deleted.)</li>
              <li>my-server-02</li>
              <li>my-server-82</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these roles will immediately remove all permissions granted through these
              roles.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Multiple roles deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Detach Policy Modal */}
      <Modal
        isOpen={openModal === 'detach-policy'}
        onClose={closeModal}
        title="Detach policy"
        description="This action detaches the policy from the role."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Role Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Role </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              ROLENAME
            </span>
          </div>

          {/* Policy Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Policy{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              POLICYNAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Detaching this policy will immediately revoke permissions granted to this role through
              this policy.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Policy detached from role');
              closeModal();
            }}
            className="flex-1"
          >
            Detach{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Policy Modal */}
      <Modal
        isOpen={openModal === 'delete-policy'}
        onClose={closeModal}
        title="Delete policy"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Policy Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Policy{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              POLICYNAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This policy will be permanently removed. Users or roles attached to this policy will
              immediately lose access permissions.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Policy deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Policies (Multiple) Modal */}
      <Modal
        isOpen={openModal === 'delete-policies-multiple'}
        onClose={closeModal}
        title="Delete policies"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          {/* Policies that can be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Policies that can be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>web-server-03</li>
              <li>web-server-05</li>
              <li>web0server-07</li>
            </ul>
          </div>

          {/* Policies that cannot be deleted */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Policies that cannot be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>my-server-04 (Locked instances cannot be deleted.)</li>
              <li>my-server-03 (Instances in current state cannot be deleted.)</li>
              <li>my-server-02</li>
              <li>my-server-82</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              These policies will be permanently removed. Users or roles attached to these policies
              will immediately lose access permissions.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Multiple policies deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Revert Policy Version Modal */}
      <Modal
        isOpen={openModal === 'revert-policy-version'}
        onClose={closeModal}
        title="Revert policy version"
        description="This action reverts the policy to the selected version."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Current Version Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Current version{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">VERSION</span>
          </div>

          {/* Target Version Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Target version{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">VERSION</span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Reverting to this version will immediately replace the currently active policy and may
              change permissions for all roles using it.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Policy version reverted');
              closeModal();
            }}
            className="flex-1"
          >
            Revert{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Policy Version Modal */}
      <Modal
        isOpen={openModal === 'delete-policy-version'}
        onClose={closeModal}
        title="Delete policy version"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this version will permanently remove its policy definitions. This action
              cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Policy version deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Update MFA Enforcement Policy Modal */}
      <Modal
        isOpen={openModal === 'update-mfa-enforcement'}
        onClose={closeModal}
        title="Update MFA enforcement policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>MFA enforcement: Voluntary → Required for all users</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Updating MFA enforcement may immediately affect authentication requirements for all
              users.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('MFA enforcement policy updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* Update OTP Policy Modal */}
      <Modal
        isOpen={openModal === 'update-otp-policy'}
        onClose={closeModal}
        title="Update OTP policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>OTP policy: On → Off</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Turning off OTP authentication will remove OTP as an available MFA method for all
              users.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('OTP policy updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* Update OTP Policy Settings Modal */}
      <Modal
        isOpen={openModal === 'update-otp-policy-settings'}
        onClose={closeModal}
        title="Update OTP policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Look around Window: 1 → 0</li>
              <li>Reusable token: Off → On</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('OTP policy settings updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* Update Email Policy Modal */}
      <Modal
        isOpen={openModal === 'update-email-policy'}
        onClose={closeModal}
        title="Update email policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Email policy: On → Off</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Turning off email authentication will remove email as an available MFA method for all
              users.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Email policy updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* Update Email Policy Settings Modal */}
      <Modal
        isOpen={openModal === 'update-email-policy-settings'}
        onClose={closeModal}
        title="Update email policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Code validity period: 300 → 600 seconds</li>
              <li>Resend cooldown: 60 → 1 seconds</li>
              <li>Verification attempts(Time window): 10 → 40 minutes</li>
              <li>Verification attempts(Max attempts): 5 → 10 times</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Email policy settings updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* Update General Session Policy Modal */}
      <Modal
        isOpen={openModal === 'update-general-session-policy'}
        onClose={closeModal}
        title="Update general session policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Session idle timeout: 30 → 10 minutes</li>
              <li>Session max lifespan: 8 → 10 hours</li>
              <li>Login timeout: 30 → 10 minutes</li>
              <li>Login action timeout: 5 → 3 minutes</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('General session policy updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Domain Modal */}
      <Modal
        isOpen={openModal === 'delete-domain'}
        onClose={closeModal}
        title="Delete domain"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Domain Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              domain{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DOMAINNAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this domain will permanently remove all configurations, policies, and
              associations linked to it. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Domain deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Switch to Domain Modal */}
      <Modal
        isOpen={openModal === 'switch-to-domain'}
        onClose={closeModal}
        title="Switch to domain"
        description="Any unsaved changes may be lost when switching to another domain. Do you want to switch?"
        size="sm"
      >
        <div className="flex flex-col gap-2 items-center">
          {/* Current Domain Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 w-full">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Current domain{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              Domain A
            </span>
          </div>

          {/* Chevron Down Icon */}
          <IconChevronDown size={16} className="text-[var(--color-text-default)]" stroke={1.5} />

          {/* Target Domain Info Box */}
          <div className="bg-[#eff6ff] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 w-full">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Target domain{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              Domain B
            </span>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Switched to domain');
              closeModal();
            }}
            className="flex-1"
          >
            Switch{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete System Administrator Modal */}
      <Modal
        isOpen={openModal === 'delete-system-admin'}
        onClose={closeModal}
        title="Delete system administrator"
        description="Removing the selected instances is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* System Administrator Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              System administrator{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              DISPLAY NAME{' '}
            </span>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this system administrator will permanently remove their global access and
              cannot be undone.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('System administrator deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Update Password Policy Modal */}
      <Modal
        isOpen={openModal === 'update-password-policy'}
        onClose={closeModal}
        title="Update password policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Length: 8-64 → 1-100</li>
              <li>
                Requirements: Uppercase, Lowercase, number, Special character → Uppercase,
                Lowercase{' '}
              </li>
              <li>Exclusion rules: none → Username, Email</li>
              <li>Password expiration: 30 → 47 days</li>
              <li>Prevent password reuse: Off → On</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Password policy updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* Update Account Lockout Policy Modal */}
      <Modal
        isOpen={openModal === 'update-account-lockout-policy'}
        onClose={closeModal}
        title="Update account lockout policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>
                Lockout type: Lockout permanently after Temporary lockout → Lockout temporarily{' '}
              </li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Account lockout policy updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* Update Token Policy Modal */}
      <Modal
        isOpen={openModal === 'update-token-policy'}
        onClose={closeModal}
        title="Update token policy"
        description="This action applies the changes."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          {/* Changes Info Box */}
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Changes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
              <li>Access token lifespan: 10 → 15 minutes</li>
              <li>Refresh token lifespan: 7 → 3 days</li>
            </ul>
          </div>

          {/* Warning Alert Box */}
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Updating token settings may immediately affect authentication behavior across the
              system.
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Token policy updated');
              closeModal();
            }}
            className="flex-1"
          >
            Apply{' '}
          </Button>
        </div>
      </Modal>

      {/* =============================================
          STORAGE MODALS ============================================= */}

      {/* Delete Bucket Modal */}
      <Modal
        isOpen={openModal === 'delete-bucket'}
        onClose={closeModal}
        title="Delete bucket"
        size="sm"
      >
        {/* Warning Alert Box */}
        <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
          <IconAlertCircle
            size={14}
            className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
            stroke={1.5}
          />
          <div className="text-body-sm text-[var(--color-text-default)] leading-4">
            <p className="font-medium mb-1">Warning: Non-empty bucket</p>
            <ul className="list-disc ml-4 space-y-0.5">
              <li>All objects in this bucket will be deleted.</li>
              <li>This action is irreversible.</li>
            </ul>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Bucket deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* =============================================
          CONTAINER MODALS ============================================= */}

      {/* Delete Cluster Modal */}
      <DeleteClusterModal
        isOpen={openModal === 'delete-cluster'}
        onClose={closeModal}
        cluster={{ id: 'cluster-001', name: 'production-cluster' }}
        onConfirm={() => {
          console.log('Cluster deleted');
          closeModal();
        }}
      />

      {/* Delete Namespace Modal */}
      <DeleteNamespaceModal
        isOpen={openModal === 'delete-namespace'}
        onClose={closeModal}
        namespace={{ id: 'ns-001', name: 'default' }}
        onConfirm={() => {
          console.log('Namespace deleted');
          closeModal();
        }}
      />

      {/* Delete Pod Modal */}
      <DeletePodModal
        isOpen={openModal === 'delete-pod'}
        onClose={closeModal}
        pod={{ id: 'pod-001', name: 'nginx-deployment-7fb96c846b-abc12' }}
        onConfirm={() => {
          console.log('Pod deleted');
          closeModal();
        }}
      />

      {/* Delete Job Modal */}
      <DeleteJobModal
        isOpen={openModal === 'delete-job'}
        onClose={closeModal}
        job={{ id: 'job-001', name: 'backup-job-20240115' }}
        onConfirm={() => {
          console.log('Job deleted');
          closeModal();
        }}
      />

      {/* Delete CronJob Modal */}
      <DeleteCronJobModal
        isOpen={openModal === 'delete-cron-job'}
        onClose={closeModal}
        cronJob={{ id: 'cronjob-001', name: 'daily-backup' }}
        onConfirm={() => {
          console.log('CronJob deleted');
          closeModal();
        }}
      />

      {/* Delete Deployment Modal */}
      <DeleteDeploymentModal
        isOpen={openModal === 'delete-deployment'}
        onClose={closeModal}
        deployment={{ id: 'deploy-001', name: 'nginx-deployment' }}
        onConfirm={() => {
          console.log('Deployment deleted');
          closeModal();
        }}
      />

      {/* Delete StatefulSet Modal */}
      <DeleteStatefulSetModal
        isOpen={openModal === 'delete-stateful-set'}
        onClose={closeModal}
        statefulSet={{ id: 'sts-001', name: 'mysql-statefulset' }}
        onConfirm={() => {
          console.log('StatefulSet deleted');
          closeModal();
        }}
      />

      {/* Delete DaemonSet Modal */}
      <DeleteDaemonSetModal
        isOpen={openModal === 'delete-daemon-set'}
        onClose={closeModal}
        daemonSet={{ id: 'ds-001', name: 'fluentd-daemonset' }}
        onConfirm={() => {
          console.log('DaemonSet deleted');
          closeModal();
        }}
      />

      {/* Redeploy Deployment Modal */}
      <RedeployDeploymentModal
        isOpen={openModal === 'redeploy-deployment'}
        onClose={closeModal}
        deployment={{ id: 'deploy-001', name: 'nginx-deployment' }}
        onConfirm={() => {
          console.log('Deployment redeployed');
          closeModal();
        }}
      />

      {/* Redeploy StatefulSet Modal */}
      <RedeployStatefulSetModal
        isOpen={openModal === 'redeploy-stateful-set'}
        onClose={closeModal}
        statefulSet={{ id: 'sts-001', name: 'mysql-statefulset' }}
        onConfirm={() => {
          console.log('StatefulSet redeployed');
          closeModal();
        }}
      />

      {/* Redeploy DaemonSet Modal */}
      <RedeployDaemonSetModal
        isOpen={openModal === 'redeploy-daemon-set'}
        onClose={closeModal}
        daemonSet={{ id: 'ds-001', name: 'fluentd-daemonset' }}
        onConfirm={() => {
          console.log('DaemonSet redeployed');
          closeModal();
        }}
      />

      {/* Roll Back Deployment Modal */}
      <RollBackDeploymentModal
        isOpen={openModal === 'roll-back-deployment'}
        onClose={closeModal}
        deployment={{ id: 'deploy-001', name: 'nginx-deployment' }}
        onConfirm={(revisionId) => {
          console.log('Deployment rolled back to:', revisionId);
          closeModal();
        }}
      />

      {/* ----------------------------------------
         Compute Admin Modals ---------------------------------------- */}

      {/* Stop Instance Modal */}
      <Modal
        isOpen={openModal === 'stop-instance'}
        onClose={closeModal}
        title="Stop instance"
        description="This action stops the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-server-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action may interrupt the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instance stopped');
              closeModal();
            }}
            className="flex-1"
          >
            Stop{' '}
          </Button>
        </div>
      </Modal>

      {/* Reboot Instance Modal */}
      <Modal
        isOpen={openModal === 'reboot-instance'}
        onClose={closeModal}
        title="Reboot instance"
        description="This action reboots the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-server-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action may interrupt the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instance rebooted');
              closeModal();
            }}
            className="flex-1"
          >
            Reboot{' '}
          </Button>
        </div>
      </Modal>

      {/* Soft Reboot Instance Modal */}
      <Modal
        isOpen={openModal === 'soft-reboot-instance'}
        onClose={closeModal}
        title="Soft reboot instance"
        description="This action performs a soft reboot of the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-server-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action may interrupt the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instance soft rebooted');
              closeModal();
            }}
            className="flex-1"
          >
            Soft Reboot{' '}
          </Button>
        </div>
      </Modal>

      {/* Confirm Resize Modal */}
      <Modal
        isOpen={openModal === 'confirm-resize'}
        onClose={closeModal}
        title="Confirm resize"
        description="This action confirms the resized state of the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-server-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Confirming the resize may affect the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Resize confirmed');
              closeModal();
            }}
            className="flex-1"
          >
            Confirm{' '}
          </Button>
        </div>
      </Modal>

      {/* Revert Resize Modal */}
      <Modal
        isOpen={openModal === 'revert-resize'}
        onClose={closeModal}
        title="Revert resize"
        description="This action reverts the instance to its previous state before the resize."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-server-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Reverting the resize may affect the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Resize reverted');
              closeModal();
            }}
            className="flex-1"
          >
            Revert{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Instance Modal */}
      <Modal
        isOpen={openModal === 'delete-instance'}
        onClose={closeModal}
        title="Delete instance"
        description="Removing the instance is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-server-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this instance may interrupt the services running on it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Instance deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Shelve Instance Modal */}
      <Modal
        isOpen={openModal === 'shelve-instance'}
        onClose={closeModal}
        title="Shelve instance"
        description="This action shelves the instance."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-server-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action may interrupt the services running on the instance.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instance shelved');
              closeModal();
            }}
            className="flex-1"
          >
            Shelve{' '}
          </Button>
        </div>
      </Modal>

      {/* Start Instances Modal */}
      <Modal
        isOpen={openModal === 'start-instances'}
        onClose={closeModal}
        title="Start instances"
        description="This action starts the selected instances."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instances that can be started{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>api-server-01</li>
              <li>db-server-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instances that cannot be started{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-03</li>
              <li>web-server-04</li>
              <li>api-server-02</li>
              <li>db-server-02</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Starting these instances may affect the services running on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instances started');
              closeModal();
            }}
            className="flex-1"
          >
            Start{' '}
          </Button>
        </div>
      </Modal>

      {/* Stop Instances Modal */}
      <Modal
        isOpen={openModal === 'stop-instances'}
        onClose={closeModal}
        title="Stop instances"
        description="This action stops the selected instances."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instances that can be stopped{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>api-server-01</li>
              <li>db-server-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instances that cannot be stopped{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-03</li>
              <li>web-server-04</li>
              <li>api-server-02</li>
              <li>db-server-02</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Stopping these instances may interrupt the services running on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instances stopped');
              closeModal();
            }}
            className="flex-1"
          >
            Stop{' '}
          </Button>
        </div>
      </Modal>

      {/* Reboot Instances Modal */}
      <Modal
        isOpen={openModal === 'reboot-instances'}
        onClose={closeModal}
        title="Reboot instances"
        description="This action reboots the selected instances."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instances that can be rebooted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>api-server-01</li>
              <li>db-server-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instances that cannot be rebooted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-03</li>
              <li>web-server-04</li>
              <li>api-server-02</li>
              <li>db-server-02</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Rebooting these instances may interrupt the services running on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Instances rebooted');
              closeModal();
            }}
            className="flex-1"
          >
            Reboot{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Instances Modal */}
      <Modal
        isOpen={openModal === 'delete-instances'}
        onClose={closeModal}
        title="Delete instances"
        description="Removing the selected instances is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instances that can be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-01</li>
              <li>web-server-02</li>
              <li>api-server-01</li>
              <li>db-server-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instances that cannot be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-03</li>
              <li>web-server-04</li>
              <li>api-server-02</li>
              <li>db-server-02</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these instances may interrupt the services running on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Instances deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Instance Template Modal */}
      <Modal
        isOpen={openModal === 'delete-instance-template'}
        onClose={closeModal}
        title="Delete instance template"
        description="Deleting the instance template is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance Template{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-server-template-01{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Instance template deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Instance Templates Modal */}
      <Modal
        isOpen={openModal === 'delete-instance-templates'}
        onClose={closeModal}
        title="Delete instance templates"
        description="Deleting the selected instance templates is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Instance Templates{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-server-template-01</li>
              <li>api-server-template-01</li>
              <li>db-server-template-01</li>
              <li>cache-server-template-01</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Instance templates deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Image Modal */}
      <Modal
        isOpen={openModal === 'delete-image'}
        onClose={closeModal}
        title="Delete image"
        description="Deleting the image is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Image </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              ubuntu-22.04-server{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Image deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Images Modal */}
      <Modal
        isOpen={openModal === 'delete-images'}
        onClose={closeModal}
        title="Delete images"
        description="Deleting the selected images is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Images that can be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>ubuntu-22.04-server</li>
              <li>centos-8-stream</li>
              <li>debian-11-bullseye</li>
              <li>fedora-38-cloud</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Images that cannot be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>windows-2022-server (in use)</li>
              <li>rhel-9-base (protected)</li>
              <li>alpine-3.18 (in use)</li>
              <li>rocky-linux-9 (protected)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Images deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Snapshot Modal */}
      <Modal
        isOpen={openModal === 'delete-snapshot'}
        onClose={closeModal}
        title="Delete snapshot"
        description="Deleting the snapshot is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Snapshot{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              snapshot-2024-01-15{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Snapshot deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Snapshots Modal */}
      <Modal
        isOpen={openModal === 'delete-snapshots'}
        onClose={closeModal}
        title="Delete snapshots"
        description="Deleting the selected snapshots is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Snapshots that can be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>snapshot-2024-01-15</li>
              <li>snapshot-2024-01-10</li>
              <li>snapshot-2024-01-05</li>
              <li>snapshot-2024-01-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Snapshots that cannot be deleted{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>snapshot-2023-12-25 (in use)</li>
              <li>snapshot-2023-12-20 (protected)</li>
              <li>snapshot-2023-12-15 (in use)</li>
              <li>snapshot-2023-12-10 (protected)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Snapshots deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Volume Modal */}
      <Modal
        isOpen={openModal === 'delete-volume'}
        onClose={closeModal}
        title="Delete volume"
        description="Deleting the volume is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              volume-data-01{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Volume deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Volumes Modal */}
      <Modal
        isOpen={openModal === 'delete-volumes'}
        onClose={closeModal}
        title="Delete volumes"
        description="Deleting the selected volumes is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volumes that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>volume-data-01</li>
              <li>volume-data-02</li>
              <li>volume-data-03</li>
              <li>volume-data-04</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volumes that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>volume-data-05</li>
              <li>volume-data-06</li>
              <li>volume-data-07</li>
              <li>volume-data-08</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Volumes deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Volume Type Modal */}
      <Modal
        isOpen={openModal === 'delete-volume-type'}
        onClose={closeModal}
        title="Delete volume type"
        description="Deleting the volume type is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume type{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              ssd-performance{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Volume type deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Volume Types Modal */}
      <Modal
        isOpen={openModal === 'delete-volume-types'}
        onClose={closeModal}
        title="Delete volume types"
        description="Deleting the selected volume types is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume types{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>ssd-performance</li>
              <li>hdd-standard</li>
              <li>nvme-ultra</li>
              <li>ssd-economy</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Volume types deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Backup Modal */}
      <Modal
        isOpen={openModal === 'delete-backup'}
        onClose={closeModal}
        title="Delete backup"
        description="Deleting the backup is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Backup{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              backup-2024-01-15{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Backup deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Backups Modal */}
      <Modal
        isOpen={openModal === 'delete-backups'}
        onClose={closeModal}
        title="Delete backups"
        description="Deleting the selected backups is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Backups that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>backup-2024-01-15</li>
              <li>backup-2024-01-10</li>
              <li>backup-2024-01-05</li>
              <li>backup-2024-01-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Backups that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>backup-2023-12-25 (in progress)</li>
              <li>backup-2023-12-20 (restoring)</li>
              <li>backup-2023-12-15 (in progress)</li>
              <li>backup-2023-12-10 (restoring)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Backups deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Encryption Modal */}
      <Modal
        isOpen={openModal === 'delete-encryption'}
        onClose={closeModal}
        title="Delete encryption"
        description="This action removes the encryption configuration from the volume type."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume type{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              ssd-encrypted{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Encryption deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Extra Spec Modal */}
      <Modal
        isOpen={openModal === 'delete-extra-spec'}
        onClose={closeModal}
        title="Delete extra spec"
        description="This action removes the extra specification from the volume type."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume type{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              ssd-performance{' '}
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Extra spec{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              volume_backend_name=lvm{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Extra spec deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Extra Specs Modal */}
      <Modal
        isOpen={openModal === 'delete-extra-specs'}
        onClose={closeModal}
        title="Delete extra specs"
        description="Deleting the selected extra specifications is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume type{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              ssd-performance{' '}
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Extra specs{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>volume_backend_name=lvm</li>
              <li>max_iops=10000</li>
              <li>disk_type=ssd</li>
              <li>encryption=aes-256</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Extra specs deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete QoS Spec Modal */}
      <Modal
        isOpen={openModal === 'delete-qo-s-spec'}
        onClose={closeModal}
        title="Delete QoS spec"
        description="This action removes the QoS specification."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              QoS Spec{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              high-performance{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('QoS spec deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete QoS Specs Modal */}
      <Modal
        isOpen={openModal === 'delete-qo-s-specs'}
        onClose={closeModal}
        title="Delete QoS specs"
        description="This action removes the selected QoS specifications."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              QoS Specs{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>high-performance</li>
              <li>standard-iops</li>
              <li>economy-storage</li>
              <li>burst-optimized</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('QoS specs deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete QoS Extra Spec Modal */}
      <Modal
        isOpen={openModal === 'delete-qo-s-extra-spec'}
        onClose={closeModal}
        title="Delete extra spec"
        description="This action removes the extra specification from the volume type."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume type{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              high-performance{' '}
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Extra spec{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              minIOPS=1000{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('QoS extra spec deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete QoS Extra Specs Modal */}
      <Modal
        isOpen={openModal === 'delete-qo-s-extra-specs'}
        onClose={closeModal}
        title="Delete extra specs"
        description="Deleting the selected extra specifications is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Volume type{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              high-performance{' '}
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Extra specs{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>minIOPS=1000</li>
              <li>maxIOPS=10000</li>
              <li>burstIOPS=15000</li>
              <li>latency=low</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('QoS extra specs deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Network Modal */}
      <Modal
        isOpen={openModal === 'delete-network'}
        onClose={closeModal}
        title="Delete network"
        description="Deleting the network is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Network{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              internal-network-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this network may affect subnets, routers, or resources connected to it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Network deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Networks Modal */}
      <Modal
        isOpen={openModal === 'delete-networks'}
        onClose={closeModal}
        title="Delete networks"
        description="Removing the selected networks is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Networks that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>internal-network-01</li>
              <li>internal-network-02</li>
              <li>test-network-01</li>
              <li>dev-network-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Networks that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-network (in use)</li>
              <li>shared-network (external)</li>
              <li>management-network (system)</li>
              <li>public-network (external)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these networks may affect subnets, routers, or resources connected to them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Networks deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Subnet Modal */}
      <Modal
        isOpen={openModal === 'delete-subnet'}
        onClose={closeModal}
        title="Delete subnet"
        description="Deleting the subnet is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Subnet{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              subnet-192-168-1-0{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this subnet may affect routers, ports, or services connected to it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Subnet deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Subnets Modal */}
      <Modal
        isOpen={openModal === 'delete-subnets'}
        onClose={closeModal}
        title="Delete subnets"
        description="Deleting the selected subnets is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Extra specs{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>subnet-192-168-1-0</li>
              <li>subnet-10-0-0-0</li>
              <li>subnet-172-16-0-0</li>
              <li>subnet-192-168-2-0</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these subnets may affect routers, ports, or services connected to them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Subnets deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Port Modal */}
      <Modal
        isOpen={openModal === 'delete-port'}
        onClose={closeModal}
        title="Delete port"
        description="Deleting the port is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Port </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              port-abc12345{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this port may affect instances, routers, or services connected to it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Port deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Ports Modal */}
      <Modal
        isOpen={openModal === 'delete-ports'}
        onClose={closeModal}
        title="Delete ports"
        description="Deleting the selected ports is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Ports </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>port-abc12345</li>
              <li>port-def67890</li>
              <li>port-ghi11121</li>
              <li>port-jkl31415</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these ports may affect instances, routers, or services connected to them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Ports deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Router Modal */}
      <Modal
        isOpen={openModal === 'delete-router'}
        onClose={closeModal}
        title="Delete router"
        description="Deleting the router is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Router{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              main-router-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this router may affect networks, subnets, or resources connected to it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Router deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Routers Modal */}
      <Modal
        isOpen={openModal === 'delete-routers'}
        onClose={closeModal}
        title="Delete routers"
        description="Removing the selected routers is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Routers that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>main-router-01</li>
              <li>backup-router-01</li>
              <li>test-router-01</li>
              <li>dev-router-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Routers that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-router (in use)</li>
              <li>gateway-router (external)</li>
              <li>management-router (system)</li>
              <li>ha-router (high availability)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these routers may affect networks, subnets, or resources connected to them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Routers deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Static Routes Modal */}
      <Modal
        isOpen={openModal === 'delete-static-routes'}
        onClose={closeModal}
        title="Delete static routes"
        description="Deleting the selected static routers is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Static Routes{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>10.0.0.0/24 via 192.168.1.1</li>
              <li>172.16.0.0/16 via 192.168.1.1</li>
              <li>192.168.2.0/24 via 10.0.0.1</li>
              <li>0.0.0.0/0 via 192.168.1.254</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Removing these static routes may affect network traffic that depends on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Static routes deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Remove DHCP Agents Modal */}
      <Modal
        isOpen={openModal === 'remove-d-h-c-p-agents'}
        onClose={closeModal}
        title="Remove DHCP agents"
        description="This action removes the selected DHCP agents from the network."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Network{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              internal-network-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              DHCP Agents{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>dhcp-agent-001</li>
              <li>dhcp-agent-002</li>
              <li>dhcp-agent-003</li>
              <li>dhcp-agent-004</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Removing these DHCP agents may affect IP address assignment for instances in the
              network.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('DHCP agents removed');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Release Fixed IP Modal */}
      <Modal
        isOpen={openModal === 'release-fixed-i-p'}
        onClose={closeModal}
        title="Release fixed IP"
        description="This action releases the fixed IP from the port."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Port </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              port-abc12345{' '}
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Fixed IP{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              192.168.1.100{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Releasing this fixed IP may affect network connectivity for the port.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Fixed IP released');
              closeModal();
            }}
            className="flex-1"
          >
            Release{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Allowed Address Pair Modal */}
      <Modal
        isOpen={openModal === 'delete-allowed-address-pair'}
        onClose={closeModal}
        title="Delete allowed address pair"
        description="This action removes the allowed address pair from the port."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Port </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              port-abc12345{' '}
            </span>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              IP address{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              10.0.0.50{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these allowed address pairs may affect network access for the port.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Allowed address pair deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Security Group Admin Modal */}
      <Modal
        isOpen={openModal === 'delete-security-group-admin'}
        onClose={closeModal}
        title="Delete security group"
        description="Deleting the security group is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Security group{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-servers-sg{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security group and all its rules. If this
              group is attached to any instances, their network traffic may be affected.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security group deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Security Groups Admin Modal */}
      <Modal
        isOpen={openModal === 'delete-security-groups-admin'}
        onClose={closeModal}
        title="Delete security groups"
        description="Deleting the selected security groups is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Security groups that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-servers-sg</li>
              <li>database-sg</li>
              <li>api-servers-sg</li>
              <li>monitoring-sg</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Security groups that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>default (system)</li>
              <li>production-sg (in use)</li>
              <li>management-sg (system)</li>
              <li>bastion-sg (in use)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action will permanently delete the security groups and all their rules.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security groups deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Modal */}
      <Modal
        isOpen={openModal === 'delete-firewall'}
        onClose={closeModal}
        title="Delete firewall"
        description="Deleting the firewall is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewall{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              perimeter-firewall-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action will permanently delete the firewall and all its rules.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Firewalls Modal */}
      <Modal
        isOpen={openModal === 'delete-firewalls'}
        onClose={closeModal}
        title="Delete firewalls"
        description="Deleting the selected firewalls is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewalls that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>perimeter-firewall-01</li>
              <li>internal-firewall-01</li>
              <li>test-firewall-01</li>
              <li>dev-firewall-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewalls that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-firewall (in use)</li>
              <li>gateway-firewall (system)</li>
              <li>management-firewall (system)</li>
              <li>ha-firewall (high availability)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              This action will permanently delete the firewalls and all their rules.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewalls deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Unsaved Changes Admin Modal */}
      <Modal
        isOpen={openModal === 'unsaved-changes-admin'}
        onClose={closeModal}
        title="Unsaved changes"
        description="Any unsaved changes will be lost. Do you want to leave?"
        size="sm"
      >
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Leave{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Staying on page');
              closeModal();
            }}
            className="flex-1"
          >
            Stay{' '}
          </Button>
        </div>
      </Modal>

      {/* Release Floating IP Modal */}
      <Modal
        isOpen={openModal === 'release-floating-i-p'}
        onClose={closeModal}
        title="Release floating IP"
        description="Releasing the floating IP is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Floating IP{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              203.0.113.50{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Releasing this floating IP may limit external access for the associated resource.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Floating IP released');
              closeModal();
            }}
            className="flex-1"
          >
            Release{' '}
          </Button>
        </div>
      </Modal>

      {/* Release Floating IPs Modal */}
      <Modal
        isOpen={openModal === 'release-floating-i-ps'}
        onClose={closeModal}
        title="Release floating IPs"
        description="Releasing the floating IPs is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Floating IPs{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>203.0.113.50</li>
              <li>203.0.113.51</li>
              <li>203.0.113.52</li>
              <li>203.0.113.53</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Releasing these floating IPs may limit external access for the associated resource.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Floating IPs released');
              closeModal();
            }}
            className="flex-1"
          >
            Release{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Load Balancer Admin Modal */}
      <Modal
        isOpen={openModal === 'delete-load-balancer-admin'}
        onClose={closeModal}
        title="Delete load balancer"
        description="Removing the load balancer is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Load balancer{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-lb-01{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this load balancer may affect the listeners, pools that depend on it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Load balancer deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Load Balancers Admin Modal */}
      <Modal
        isOpen={openModal === 'delete-load-balancers-admin'}
        onClose={closeModal}
        title="Delete load balancers"
        description="Removing the load balancers is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Load balancers that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-lb-01</li>
              <li>api-lb-01</li>
              <li>staging-lb-01</li>
              <li>dev-lb-01</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Load balancers that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-lb (in use)</li>
              <li>gateway-lb (external)</li>
              <li>ha-lb-01 (high availability)</li>
              <li>critical-lb (protected)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these load balancers may affect the listeners, pools that depend on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Load balancers deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Listener Modal */}
      <Modal
        isOpen={openModal === 'delete-listener'}
        onClose={closeModal}
        title="Delete listener"
        description="Removing the listener is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Listener{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              http-listener-443{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Listener deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Listeners Modal */}
      <Modal
        isOpen={openModal === 'delete-listeners'}
        onClose={closeModal}
        title="Delete listeners"
        description="Removing the listeners is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Load balancers that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>http-listener-80</li>
              <li>https-listener-443</li>
              <li>api-listener-8080</li>
              <li>ws-listener-8443</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Load balancers that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-listener (in use)</li>
              <li>critical-listener (protected)</li>
              <li>ha-listener (high availability)</li>
              <li>gateway-listener (external)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Listeners deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Pool Modal */}
      <Modal
        isOpen={openModal === 'delete-pool'}
        onClose={closeModal}
        title="Delete pool"
        description="Removing the pool is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Pool </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-servers-pool{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this pool will also remove its associated members and health monitors.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Pool deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Pools Modal */}
      <Modal
        isOpen={openModal === 'delete-pools'}
        onClose={closeModal}
        title="Delete pools"
        description="Removing the pools is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Listeners that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-servers-pool</li>
              <li>api-servers-pool</li>
              <li>staging-pool</li>
              <li>dev-pool</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Listeners that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-pool (in use)</li>
              <li>critical-pool (protected)</li>
              <li>ha-pool (high availability)</li>
              <li>gateway-pool (external)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these pools will also remove their associated members and health monitors.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Pools deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Member Modal */}
      <Modal
        isOpen={openModal === 'delete-member'}
        onClose={closeModal}
        title="Delete member"
        description="Removing the member is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Member{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              192.168.1.10:8080{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Removing this member may affect traffic distribution for the pool.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Member deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Members Modal */}
      <Modal
        isOpen={openModal === 'delete-members'}
        onClose={closeModal}
        title="Delete members"
        description="Removing the members is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Members that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>192.168.1.10:8080</li>
              <li>192.168.1.11:8080</li>
              <li>192.168.1.12:8080</li>
              <li>192.168.1.13:8080</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Members that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>192.168.1.1:8080 (primary)</li>
              <li>192.168.1.2:8080 (backup)</li>
              <li>192.168.1.3:8080 (protected)</li>
              <li>192.168.1.4:8080 (critical)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Removing these members may affect traffic distribution for the pool.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Members deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Security Group Rule Modal */}
      <Modal
        isOpen={openModal === 'delete-security-group-rule'}
        onClose={closeModal}
        title="Delete rule"
        description="Removing the rule group is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">Rule </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              Ingress/TCP/443{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this rule may affect network access for the resources that rely on it.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security group rule deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Security Group Rules Modal */}
      <Modal
        isOpen={openModal === 'delete-security-group-rules'}
        onClose={closeModal}
        title="Delete rules"
        description="Removing the rules is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Rules that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>Ingress/TCP/80</li>
              <li>Ingress/TCP/443</li>
              <li>Egress/TCP/All</li>
              <li>Ingress/UDP/53</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Rules that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>Ingress/TCP/22 (SSH required)</li>
              <li>Egress/All/All (default)</li>
              <li>Ingress/ICMP/All (monitoring)</li>
              <li>Ingress/TCP/3389 (RDP required)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this rule may affect network access for the resources that rely on them.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Security group rules deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete L7 Policy Modal */}
      <Modal
        isOpen={openModal === 'delete-l7-policy'}
        onClose={closeModal}
        title="Delete L7 policy"
        description="Removing the L7 policy is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              L7 Policy{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              redirect-to-https{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this L7 policy may affect traffic routing for the listener.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('L7 policy deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete L7 Policies Modal */}
      <Modal
        isOpen={openModal === 'delete-l7-policies'}
        onClose={closeModal}
        title="Delete L7 policies"
        description="Removing the L7 policies is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              L7 Policies that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>redirect-to-https</li>
              <li>block-bad-bots</li>
              <li>rate-limit-api</li>
              <li>geo-redirect</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              L7 Policies that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>default-redirect (system)</li>
              <li>security-headers (required)</li>
              <li>cors-policy (protected)</li>
              <li>auth-redirect (critical)</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these L7 policies may affect traffic routing for the listeners.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('L7 policies deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Health Monitor Modal */}
      <Modal
        isOpen={openModal === 'delete-health-monitor'}
        onClose={closeModal}
        title="Delete health monitor"
        description="Removing the health monitor is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Health Monitor{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              http-health-check{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this health monitor may affect the pool&apos;s ability to detect unhealthy
              members.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Health monitor deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Policy Modal */}
      <Modal
        isOpen={openModal === 'delete-firewall-policy'}
        onClose={closeModal}
        title="Delete firewall policy"
        description="Deleting the firewall policy is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewall Policy{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              web-policy-01{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall policy deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Policies Modal */}
      <Modal
        isOpen={openModal === 'delete-firewall-policies'}
        onClose={closeModal}
        title="Delete firewall policies"
        description="Removing the selected firewall policies is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewall policies that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>web-policy-01</li>
              <li>api-policy-01</li>
              <li>staging-policy</li>
              <li>dev-policy</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewall policies that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>production-policy (in use)</li>
              <li>gateway-policy (system)</li>
              <li>default-policy (protected)</li>
              <li>critical-policy (in use)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall policies deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Rule Modal */}
      <Modal
        isOpen={openModal === 'delete-firewall-rule'}
        onClose={closeModal}
        title="Delete firewall rule"
        description="Deleting the firewall rule is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewall Rule{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              allow-https-443{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall rule deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Firewall Rules Modal */}
      <Modal
        isOpen={openModal === 'delete-firewall-rules'}
        onClose={closeModal}
        title="Delete firewall rules"
        description="Removing the selected firewall rules is permanent and cannot be undone."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewall rules that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>allow-https-443</li>
              <li>allow-http-80</li>
              <li>allow-ssh-22</li>
              <li>allow-dns-53</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Firewall rules that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>default-egress (system)</li>
              <li>management-access (protected)</li>
              <li>monitoring-rule (required)</li>
              <li>critical-ingress (in use)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Firewall rules deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Tenant Modal */}
      <Modal
        isOpen={openModal === 'delete-tenant'}
        onClose={closeModal}
        title="Delete tenant"
        description="Deleting the tenant is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Tenant{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              project-alpha{' '}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting this tenant does not delete the resources inside it. Those resources will
              remain and must be managed separately.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Tenant deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Tenants Modal */}
      <Modal
        isOpen={openModal === 'delete-tenants'}
        onClose={closeModal}
        title="Delete tenant"
        description="Removing the selected tenants is permanent and cannot be undone."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Tenants{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>project-alpha</li>
              <li>project-beta</li>
              <li>project-gamma</li>
              <li>project-delta</li>
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
            <IconAlertCircle
              size={14}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
              stroke={1.5}
            />
            <p className="text-body-sm text-[var(--color-text-default)] leading-4">
              Deleting these tenants does not delete the resources inside them. Those resources will
              remain and must be managed separately.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Tenants deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Metadata Modal */}
      <Modal
        isOpen={openModal === 'delete-metadata'}
        onClose={closeModal}
        title="Delete metadata"
        description="This action removes the metadata."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Metadata{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              environment=production{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Metadata deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Delete Metadatas Modal */}
      <Modal
        isOpen={openModal === 'delete-metadatas'}
        onClose={closeModal}
        title="Delete metadata"
        description="This action removes the selected metadata."
        size="md"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Metadata that can be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>environment=production</li>
              <li>team=platform</li>
              <li>cost-center=eng-001</li>
              <li>owner=admin</li>
            </ul>
          </div>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Metadata that cannot be delete{' '}
            </span>
            <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc list-inside">
              <li>system-id=xyz (system)</li>
              <li>created-by=admin (protected)</li>
              <li>managed-by=openstack (required)</li>
              <li>instance-type=vm (system)</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              console.log('Metadatas deleted');
              closeModal();
            }}
            className="flex-1"
          >
            Delete{' '}
          </Button>
        </div>
      </Modal>

      {/* Manage Member Modal */}
      <Modal
        isOpen={openModal === 'manage-member'}
        onClose={closeModal}
        title="Manage member"
        description="User management for this project is handled in the IAM app. You will be redirected to IAM to manage users and user groups."
        size="sm"
      >
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              Tenant{' '}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              project-alpha{' '}
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={closeModal} className="flex-1">
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Redirecting to IAM');
              closeModal();
            }}
            className="flex-1"
          >
            Go to IAM{' '}
          </Button>
        </div>
      </Modal>

      {/* ----------------------------------------
         AI Agent Modals ---------------------------------------- */}

      {/* Delete Agent Source Modal */}
      <DeleteAgentSourceModal
        isOpen={openModal === 'delete-agent-source'}
        onClose={closeModal}
        agentName="my-research-agent"
      />
    </PageShell>
  );
}

export default ModalsPage;
