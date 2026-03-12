import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, VStack, HStack, PageShell, TopBar } from '@/design-system';
import {
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconCopy,
  IconCheck,
  IconArrowLeft,
} from '@tabler/icons-react';

/* ----------------------------------------
   ModalPreview — renders modal content inline as a card
   ---------------------------------------- */

interface ModalPreviewProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

function ModalPreview({ title, description, children }: ModalPreviewProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-xl)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 flex flex-col gap-4 w-[344px]">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h2>
        {description && (
          <p className="text-body-md text-[var(--color-text-subtle)]">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function CategorySection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <VStack gap={4}>
      <button
        className="flex items-center gap-2 px-1 cursor-pointer bg-transparent border-none outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <IconChevronDown size={14} className="text-[var(--color-text-muted)]" />
        ) : (
          <IconChevronRight size={14} className="text-[var(--color-text-muted)]" />
        )}
        <span className="text-heading-h6 text-[var(--color-text-default)]">{title}</span>
      </button>
      {isOpen && <div className="flex flex-wrap items-start gap-4">{children}</div>}
    </VStack>
  );
}

/* ----------------------------------------
   ModalsPage Component ---------------------------------------- */

export function ModalsPage() {
  const navigate = useNavigate();

  // IAM Modal states
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
      <VStack gap={10}>
        {/* Page Description */}
        <p className="text-body-lg text-[var(--color-text-subtle)]">
          All modal components displayed inline for quick review.
        </p>

        {/* ============================================================
           COMPUTE MODALS
           ============================================================ */}
        <CategorySection title="Compute">
          {/* Delete Snapshot Modal */}
          <ModalPreview
            title="Delete snapshot"
            description="Removing the selected instances is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Security group Modal (Single) */}
          <ModalPreview
            title="Delete security group"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              {/* Security group Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Security group{' '}
                </span>
                <span className="text-body-md text-[var(--color-text-default)] leading-4">
                  sg-01
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
                  This action will permanently delete the security group and all its rules.
                  <br />
                  If this group is attached to any instances, their network traffic may be affected.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Security groups Modal (Multiple) */}
          <ModalPreview
            title="Delete security groups"
            description="Removing the selected instances is permanent and cannot be undone."
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
                  If these groups are attached to any instances, their network traffic may be
                  affected.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Rule Modal (Single) */}
          <ModalPreview
            title="Delete rule"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              {/* Rule Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Rule{' '}
                </span>
                <span className="text-body-md text-[var(--color-text-default)] leading-4">
                  Ingress TCP 80 from 0.0.0.0/0{' '}
                </span>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Rules Modal (Multiple with Warning) */}
          <ModalPreview
            title="Delete rules"
            description="Removing the selected instances is permanent and cannot be undone."
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
                  If these rules are attached to any instances, their network traffic may be
                  affected.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Detach volume Modal */}
          <ModalPreview title="Detach volume" description="This action detaches the volume.">
            <div className="flex flex-col gap-2">
              {/* Volume Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Volume name{' '}
                </span>
                <span className="text-body-md text-[var(--color-text-default)] leading-4">
                  vol57
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
                  Make sure the filesystem inside the instance is unmounted before detaching.
                  Detaching a volume while the instance is running may cause data corruption.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Release{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Restore backup (Small) Modal */}
          <ModalPreview title="Restore backup" description="This action restores the backup.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Restore{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Restore backup (Medium) Modal */}
          <ModalPreview title="Restore backup" description="This action restores the backup.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Restore{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Restore backup (Large) Modal */}
          <ModalPreview title="Restore backup" description="This action restores the backup.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" disabled className="flex-1">
                Restore{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Disassociate floating IP Modal */}
          <ModalPreview
            title="Disassociate floating IP"
            description="Disassociating will detach the floating IP from the selected resource. External access via this IP will stop immediately. The IP will remain in your project and can be re-associated later."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Disassociate{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Disassociate floating IP (Load balancer) Modal */}
          <ModalPreview
            title="Disassociate floating IP"
            description="Disassociating will detach the floating IP from this load balancer. External access to the load balancer will be interrupted."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Disassociate{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Release floating IP (Small) Modal */}
          <ModalPreview
            title="Release floating IP"
            description="This action releases the floating IP."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Release{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Release floating IP (Medium) Modal */}
          <ModalPreview
            title="Release floating IP"
            description="This action releases the floating IP."
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
                  Releasing will detach these IPs from their target and remove them from your
                  project. External access via these IP will stop immediately.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Disassociate{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Load balancer Modal (Single) */}
          <ModalPreview
            title="Delete load balancer"
            description="Removing the selected instances is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Release Load balancers Modal (Multiple) */}
          <ModalPreview
            title="Release load balancers"
            description="Removing the selected instances is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>
        </CategorySection>

        {/* ============================================================
           IAM MODALS
           ============================================================ */}
        <CategorySection title="IAM">
          {/* Delete User Modal */}
          <ModalPreview
            title="Delete user"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              {/* User Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  User{' '}
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
                  Deleting this user will permanently remove all associated access and sessions.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Users (Multiple) Modal */}
          <ModalPreview
            title="Delete users"
            description="Removing the selected instances is permanent and cannot be undone."
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
                  Deleting these users will permanently remove all associated access and sessions.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Confirm User Password Modal */}
          <ModalPreview
            title="Confirm user password"
            description="Review the username and password. The password can only be viewed at this step."
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
              <Button variant="primary" className="flex-1">
                Close{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Unsaved Changes Modal */}
          <ModalPreview
            title="Unsaved changes"
            description="Any unsaved changes will be lost. Do you want to leave?"
          >
            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Leave{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Stay{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Detach User Group Modal */}
          <ModalPreview
            title="Detach user group"
            description="This action detaches the user from the group."
          >
            <div className="flex flex-col gap-2">
              {/* User Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  User{' '}
                </span>
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Detach{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Detach Role Modal */}
          <ModalPreview
            title="Detach role"
            description="This action detaches the role from the user."
          >
            <div className="flex flex-col gap-2">
              {/* User Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  User{' '}
                </span>
                <span className="text-body-md text-[var(--color-text-default)] leading-4">
                  DISPLAY NAME{' '}
                </span>
              </div>

              {/* Role Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Role{' '}
                </span>
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
                  Detaching this role will immediately remove all permissions granted through this
                  role.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Detach{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Remove OTP MFA Modal */}
          <ModalPreview
            title="Remove OTP MFA"
            description="This action removes OTP MFA for the user."
          >
            <div className="flex flex-col gap-2">
              {/* User Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  User{' '}
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
                  Removing OTP MFA will require the user to register OTP authentication again.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Remove{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Terminate All Sessions Modal */}
          <ModalPreview
            title="Terminate all sessions"
            description="This action terminates all sessions for the user."
          >
            <div className="flex flex-col gap-2">
              {/* User Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  User{' '}
                </span>
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Terminate{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Terminate Session Modal (Single Session) */}
          <ModalPreview title="Terminate session" description="This action terminates the session.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Terminate{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Remove User From Group Modal */}
          <ModalPreview
            title="Remove user"
            description="This action removes the user from the group."
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
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  User{' '}
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
                  Removing this user will immediately remove all permissions granted through this
                  group.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Remove{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Role Modal */}
          <ModalPreview
            title="Delete role"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              {/* Role Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Role{' '}
                </span>
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
                  Deleting this role will immediately remove all permissions granted through this
                  role.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Roles (Multiple) Modal */}
          <ModalPreview
            title="Delete roles"
            description="Removing the selected instances is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Detach Policy Modal */}
          <ModalPreview
            title="Detach policy"
            description="This action detaches the policy from the role."
          >
            <div className="flex flex-col gap-2">
              {/* Role Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Role{' '}
                </span>
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
                  Detaching this policy will immediately revoke permissions granted to this role
                  through this policy.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Detach{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Policy Modal */}
          <ModalPreview
            title="Delete policy"
            description="Removing the selected instances is permanent and cannot be undone."
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
                  This policy will be permanently removed. Users or roles attached to this policy
                  will immediately lose access permissions.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Policies (Multiple) Modal */}
          <ModalPreview
            title="Delete policies"
            description="Removing the selected instances is permanent and cannot be undone."
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
                  These policies will be permanently removed. Users or roles attached to these
                  policies will immediately lose access permissions.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Revert Policy Version Modal */}
          <ModalPreview
            title="Revert policy version"
            description="This action reverts the policy to the selected version."
          >
            <div className="flex flex-col gap-2">
              {/* Current Version Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Current version{' '}
                </span>
                <span className="text-body-md text-[var(--color-text-default)] leading-4">
                  VERSION
                </span>
              </div>

              {/* Target Version Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Target version{' '}
                </span>
                <span className="text-body-md text-[var(--color-text-default)] leading-4">
                  VERSION
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
                  Reverting to this version will immediately replace the currently active policy and
                  may change permissions for all roles using it.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Revert{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Policy Version Modal */}
          <ModalPreview
            title="Delete policy version"
            description="Removing the selected instances is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update MFA Enforcement Policy Modal */}
          <ModalPreview
            title="Update MFA enforcement policy"
            description="This action applies the changes."
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
                  Updating MFA enforcement may immediately affect authentication requirements for
                  all users.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update OTP Policy Modal */}
          <ModalPreview title="Update OTP policy" description="This action applies the changes.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update OTP Policy Settings Modal */}
          <ModalPreview title="Update OTP policy" description="This action applies the changes.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update Email Policy Modal */}
          <ModalPreview title="Update email policy" description="This action applies the changes.">
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
                  Turning off email authentication will remove email as an available MFA method for
                  all users.
                </p>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update Email Policy Settings Modal */}
          <ModalPreview title="Update email policy" description="This action applies the changes.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update General Session Policy Modal */}
          <ModalPreview
            title="Update general session policy"
            description="This action applies the changes."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Domain Modal */}
          <ModalPreview
            title="Delete domain"
            description="Removing the selected instances is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Switch to Domain Modal */}
          <ModalPreview
            title="Switch to domain"
            description="Any unsaved changes may be lost when switching to another domain. Do you want to switch?"
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
              <IconChevronDown
                size={16}
                className="text-[var(--color-text-default)]"
                stroke={1.5}
              />

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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Switch{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete System Administrator Modal */}
          <ModalPreview
            title="Delete system administrator"
            description="Removing the selected instances is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update Password Policy Modal */}
          <ModalPreview
            title="Update password policy"
            description="This action applies the changes."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update Account Lockout Policy Modal */}
          <ModalPreview
            title="Update account lockout policy"
            description="This action applies the changes."
          >
            <div className="flex flex-col gap-2">
              {/* Changes Info Box */}
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Changes{' '}
                </span>
                <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
                  <li>
                    Lockout type: Lockout permanently after Temporary lockout → Lockout
                    temporarily{' '}
                  </li>
                </ul>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Update Token Policy Modal */}
          <ModalPreview title="Update token policy" description="This action applies the changes.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Apply{' '}
              </Button>
            </div>
          </ModalPreview>
        </CategorySection>

        {/* ============================================================
           STORAGE MODALS
           ============================================================ */}
        <CategorySection title="Storage">
          {/* Delete Bucket Modal */}
          <ModalPreview title="Delete bucket">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>
        </CategorySection>

        {/* ============================================================
           CONTAINER MODALS
           ============================================================ */}
        <CategorySection title="Container">
          <ModalPreview
            title="Delete cluster"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Cluster name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                production-cluster
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Delete namespace"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Namespace name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                default
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Delete pod"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Pod name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                nginx-deployment-7fb96c846b-abc12
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Delete job"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Job name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                backup-job-20240115
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Delete CronJob"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                CronJob name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                daily-backup
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Delete deployment"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Deployment name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                nginx-deployment
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Delete StatefulSet"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                StatefulSet name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                mysql-statefulset
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Delete DaemonSet"
            description="Removing the selected instances is permanent and cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                DaemonSet name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                fluentd-daemonset
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Redeploy deployment"
            description="Are you sure you want to redeploy this deployment?"
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Deployment name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                nginx-deployment
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" className="flex-1">
                Redeploy
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Redeploy StatefulSet"
            description="Are you sure you want to redeploy this StatefulSet?"
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                StatefulSet name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                mysql-statefulset
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" className="flex-1">
                Redeploy
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Redeploy DaemonSet"
            description="Are you sure you want to redeploy this DaemonSet?"
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                DaemonSet name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                fluentd-daemonset
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" className="flex-1">
                Redeploy
              </Button>
            </div>
          </ModalPreview>

          <ModalPreview
            title="Roll back deployment"
            description="Select a revision to roll back to."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Deployment name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                nginx-deployment
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Roll Back
              </Button>
            </div>
          </ModalPreview>
        </CategorySection>

        {/* ============================================================
           COMPUTE ADMIN MODALS
           ============================================================ */}
        <CategorySection title="Compute Admin">
          {/* Stop Instance Modal */}
          <ModalPreview title="Stop instance" description="This action stops the instance.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Stop{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Reboot Instance Modal */}
          <ModalPreview title="Reboot instance" description="This action reboots the instance.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Reboot{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Soft Reboot Instance Modal */}
          <ModalPreview
            title="Soft reboot instance"
            description="This action performs a soft reboot of the instance."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Soft Reboot{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Confirm Resize Modal */}
          <ModalPreview
            title="Confirm resize"
            description="This action confirms the resized state of the instance."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Confirm{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Revert Resize Modal */}
          <ModalPreview
            title="Revert resize"
            description="This action reverts the instance to its previous state before the resize."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Revert{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Instance Modal */}
          <ModalPreview
            title="Delete instance"
            description="Removing the instance is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Shelve Instance Modal */}
          <ModalPreview title="Shelve instance" description="This action shelves the instance.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Shelve{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Start Instances Modal */}
          <ModalPreview
            title="Start instances"
            description="This action starts the selected instances."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Start{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Stop Instances Modal */}
          <ModalPreview
            title="Stop instances"
            description="This action stops the selected instances."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Stop{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Reboot Instances Modal */}
          <ModalPreview
            title="Reboot instances"
            description="This action reboots the selected instances."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Reboot{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Instances Modal */}
          <ModalPreview
            title="Delete instances"
            description="Removing the selected instances is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Instance Template Modal */}
          <ModalPreview
            title="Delete instance template"
            description="Deleting the instance template is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Instance Templates Modal */}
          <ModalPreview
            title="Delete instance templates"
            description="Deleting the selected instance templates is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Image Modal */}
          <ModalPreview
            title="Delete image"
            description="Deleting the image is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Image{' '}
                </span>
                <span className="text-body-md text-[var(--color-text-default)] leading-4">
                  ubuntu-22.04-server{' '}
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Images Modal */}
          <ModalPreview
            title="Delete images"
            description="Deleting the selected images is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Snapshot Modal */}
          <ModalPreview
            title="Delete snapshot"
            description="Deleting the snapshot is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Snapshots Modal */}
          <ModalPreview
            title="Delete snapshots"
            description="Deleting the selected snapshots is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Volume Modal */}
          <ModalPreview
            title="Delete volume"
            description="Deleting the volume is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Volumes Modal */}
          <ModalPreview
            title="Delete volumes"
            description="Deleting the selected volumes is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Volume Type Modal */}
          <ModalPreview
            title="Delete volume type"
            description="Deleting the volume type is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Volume Types Modal */}
          <ModalPreview
            title="Delete volume types"
            description="Deleting the selected volume types is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Backup Modal */}
          <ModalPreview
            title="Delete backup"
            description="Deleting the backup is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Backups Modal */}
          <ModalPreview
            title="Delete backups"
            description="Deleting the selected backups is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Encryption Modal */}
          <ModalPreview
            title="Delete encryption"
            description="This action removes the encryption configuration from the volume type."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Extra Spec Modal */}
          <ModalPreview
            title="Delete extra spec"
            description="This action removes the extra specification from the volume type."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Extra Specs Modal */}
          <ModalPreview
            title="Delete extra specs"
            description="Deleting the selected extra specifications is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete QoS Spec Modal */}
          <ModalPreview
            title="Delete QoS spec"
            description="This action removes the QoS specification."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete QoS Specs Modal */}
          <ModalPreview
            title="Delete QoS specs"
            description="This action removes the selected QoS specifications."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete QoS Extra Spec Modal */}
          <ModalPreview
            title="Delete extra spec"
            description="This action removes the extra specification from the volume type."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete QoS Extra Specs Modal */}
          <ModalPreview
            title="Delete extra specs"
            description="Deleting the selected extra specifications is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Network Modal */}
          <ModalPreview
            title="Delete network"
            description="Deleting the network is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Networks Modal */}
          <ModalPreview
            title="Delete networks"
            description="Removing the selected networks is permanent and cannot be undone."
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
                  Deleting these networks may affect subnets, routers, or resources connected to
                  them.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Subnet Modal */}
          <ModalPreview
            title="Delete subnet"
            description="Deleting the subnet is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Subnets Modal */}
          <ModalPreview
            title="Delete subnets"
            description="Deleting the selected subnets is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Port Modal */}
          <ModalPreview
            title="Delete port"
            description="Deleting the port is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Port{' '}
                </span>
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Ports Modal */}
          <ModalPreview
            title="Delete ports"
            description="Deleting the selected ports is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 max-h-[96px] overflow-y-auto modal-scroll">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Ports{' '}
                </span>
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Router Modal */}
          <ModalPreview
            title="Delete router"
            description="Deleting the router is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Routers Modal */}
          <ModalPreview
            title="Delete routers"
            description="Removing the selected routers is permanent and cannot be undone."
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
                  Deleting these routers may affect networks, subnets, or resources connected to
                  them.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Static Routes Modal */}
          <ModalPreview
            title="Delete static routes"
            description="Deleting the selected static routers is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Remove DHCP Agents Modal */}
          <ModalPreview
            title="Remove DHCP agents"
            description="This action removes the selected DHCP agents from the network."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Release Fixed IP Modal */}
          <ModalPreview
            title="Release fixed IP"
            description="This action releases the fixed IP from the port."
          >
            <div className="flex flex-col gap-2">
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Port{' '}
                </span>
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Release{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Allowed Address Pair Modal */}
          <ModalPreview
            title="Delete allowed address pair"
            description="This action removes the allowed address pair from the port."
          >
            <div className="flex flex-col gap-2">
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Port{' '}
                </span>
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Security Group Admin Modal */}
          <ModalPreview
            title="Delete security group"
            description="Deleting the security group is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Security Groups Admin Modal */}
          <ModalPreview
            title="Delete security groups"
            description="Deleting the selected security groups is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Firewall Modal */}
          <ModalPreview
            title="Delete firewall"
            description="Deleting the firewall is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Firewalls Modal */}
          <ModalPreview
            title="Delete firewalls"
            description="Deleting the selected firewalls is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Unsaved Changes Admin Modal */}
          <ModalPreview
            title="Unsaved changes"
            description="Any unsaved changes will be lost. Do you want to leave?"
          >
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Leave{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Stay{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Release Floating IP Modal */}
          <ModalPreview
            title="Release floating IP"
            description="Releasing the floating IP is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Release{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Release Floating IPs Modal */}
          <ModalPreview
            title="Release floating IPs"
            description="Releasing the floating IPs is permanent and cannot be undone."
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
                  Releasing these floating IPs may limit external access for the associated
                  resource.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Release{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Load Balancer Admin Modal */}
          <ModalPreview
            title="Delete load balancer"
            description="Removing the load balancer is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Load Balancers Admin Modal */}
          <ModalPreview
            title="Delete load balancers"
            description="Removing the load balancers is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Listener Modal */}
          <ModalPreview
            title="Delete listener"
            description="Removing the listener is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Listeners Modal */}
          <ModalPreview
            title="Delete listeners"
            description="Removing the listeners is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Pool Modal */}
          <ModalPreview
            title="Delete pool"
            description="Removing the pool is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Pool{' '}
                </span>
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Pools Modal */}
          <ModalPreview
            title="Delete pools"
            description="Removing the pools is permanent and cannot be undone."
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
                  Deleting these pools will also remove their associated members and health
                  monitors.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Member Modal */}
          <ModalPreview
            title="Delete member"
            description="Removing the member is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Members Modal */}
          <ModalPreview
            title="Delete members"
            description="Removing the members is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Security Group Rule Modal */}
          <ModalPreview
            title="Delete rule"
            description="Removing the rule group is permanent and cannot be undone."
          >
            <div className="flex flex-col gap-2">
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                  Rule{' '}
                </span>
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Security Group Rules Modal */}
          <ModalPreview
            title="Delete rules"
            description="Removing the rules is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete L7 Policy Modal */}
          <ModalPreview
            title="Delete L7 policy"
            description="Removing the L7 policy is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete L7 Policies Modal */}
          <ModalPreview
            title="Delete L7 policies"
            description="Removing the L7 policies is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Health Monitor Modal */}
          <ModalPreview
            title="Delete health monitor"
            description="Removing the health monitor is permanent and cannot be undone."
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
                  Deleting this health monitor may affect the pool&apos;s ability to detect
                  unhealthy members.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Firewall Policy Modal */}
          <ModalPreview
            title="Delete firewall policy"
            description="Deleting the firewall policy is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Firewall Policies Modal */}
          <ModalPreview
            title="Delete firewall policies"
            description="Removing the selected firewall policies is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Firewall Rule Modal */}
          <ModalPreview
            title="Delete firewall rule"
            description="Deleting the firewall rule is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Firewall Rules Modal */}
          <ModalPreview
            title="Delete firewall rules"
            description="Removing the selected firewall rules is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Tenant Modal */}
          <ModalPreview
            title="Delete tenant"
            description="Deleting the tenant is permanent and cannot be undone."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Tenants Modal */}
          <ModalPreview
            title="Delete tenant"
            description="Removing the selected tenants is permanent and cannot be undone."
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
                  Deleting these tenants does not delete the resources inside them. Those resources
                  will remain and must be managed separately.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Metadata Modal */}
          <ModalPreview title="Delete metadata" description="This action removes the metadata.">
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Delete Metadatas Modal */}
          <ModalPreview
            title="Delete metadata"
            description="This action removes the selected metadata."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="danger" className="flex-1">
                Delete{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Manage Member Modal */}
          <ModalPreview
            title="Manage member"
            description="User management for this project is handled in the IAM app. You will be redirected to IAM to manage users and user groups."
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
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Go to IAM{' '}
              </Button>
            </div>
          </ModalPreview>
        </CategorySection>

        {/* ============================================================
           CLOUD BUILDER MODALS
           ============================================================ */}
        <CategorySection title="Cloud Builder">
          {/* Enable Compute Service Modal */}
          <ModalPreview
            title="Enable compute service"
            description="Change this service status to Enabled?"
          >
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Enable{' '}
              </Button>
            </div>
          </ModalPreview>

          {/* Disable Compute Service Modal */}
          <ModalPreview
            title="Disable compute service"
            description="Change this service status to Disabled?"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <span className="text-label-lg text-[var(--color-text-default)]">
                  Reason <span className="text-[var(--color-state-danger)]">*</span>
                </span>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] resize-y outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                  placeholder="Enter a reason for disabling"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel{' '}
              </Button>
              <Button variant="primary" className="flex-1">
                Disable{' '}
              </Button>
            </div>
          </ModalPreview>
        </CategorySection>

        {/* ============================================================
           AI AGENT MODALS
           ============================================================ */}
        <CategorySection title="AI Agent">
          <ModalPreview
            title="Delete agent source"
            description="Are you sure you want to delete this agent source? This action cannot be undone."
          >
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Agent name
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                my-research-agent
              </span>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </ModalPreview>
        </CategorySection>
      </VStack>
    </PageShell>
  );
}

export default ModalsPage;
