import { useState } from 'react';
import { Modal, Drawer, ConfirmModal, Button, VStack, Input } from '@/design-system';
import { IconAlertCircle } from '@tabler/icons-react';
import { Label } from './HelperComponents';
import { AttachVolumeDrawer } from '@/components/AttachVolumeDrawer';

/* ----------------------------------------
   Modal Demo Components ---------------------------------------- */

// Basic Modal Demo
export function ModalDemo({
  variant,
}: {
  variant: 'basic' | 'delete' | 'size-sm' | 'size-md' | 'size-lg';
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonLabel = () => {
    switch (variant) {
      case 'basic':
        return 'Open Basic Modal';
      case 'delete':
        return 'Open Delete Modal';
      case 'size-sm':
        return 'Small (320px)';
      case 'size-md':
        return 'Medium (400px)';
      case 'size-lg':
        return 'Large (560px)';
      default:
        return 'Open Modal';
    }
  };

  const getSize = (): 'sm' | 'md' | 'lg' => {
    if (variant === 'size-sm') return 'sm';
    if (variant === 'size-lg') return 'lg';
    return variant === 'delete' ? 'sm' : 'md';
  };

  if (variant === 'delete') {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          {getButtonLabel()}
        </Button>
        <ConfirmModal isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log('Deleted!');
            setIsOpen(false);
          }}
          title="Delete Template"
          description="Removing the selected instances is permanent and cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          infoLabel="Template name"
          infoValue="My-web-template"
        />
      </>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {getButtonLabel()}
      </Button>
      <Modal isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="This is a modal description that provides additional context."
        size={getSize()}
      >
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-body-md text-[var(--color-text-default)]">
            Modal content goes here. You can put any content inside a modal.
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel </Button>
          <Button variant="primary" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Confirm </Button>
        </div>
      </Modal>
    </>
  );
}

// Modal Use Case Demos
export function ModalUseCaseDemo({
  useCase,
}: {
  useCase: 'delete-single' | 'delete-multiple' | 'disassociate' | 'restore-warning';
}) {
  const [isOpen, setIsOpen] = useState(false);

  const config = {
    'delete-single': {
      button: 'Delete (Single)',
      title: 'Delete Security group',
      description: 'Removing the selected instances is permanent and cannot be undone.',
      size: 'sm' as const,
      infoLabel: 'Security group',
      infoValue: 'sg-01',
      hasWarning: true,
      warningText:
        'This action will permanently delete the security group and all its rules. If this group is attached to any instances, their network traffic may be affected.',
      actionText: 'Delete',
      actionVariant: 'danger' as const,
    },
    'delete-multiple': {
      button: 'Delete (Multiple)',
      title: 'Delete Security groups',
      description: 'Removing the selected instances is permanent and cannot be undone.',
      size: 'md' as const,
      infoLabel: 'Security groups (5)',
      infoList: ['sg-01', 'sg-02', 'sg-03', 'sg-04', 'sg-05'],
      hasWarning: true,
      warningText: 'This action will permanently delete the security groups and all their rules.',
      actionText: 'Delete',
      actionVariant: 'danger' as const,
    },
    disassociate: {
      button: 'Disassociate',
      title: 'Disassociate floating IP',
      description:
        'Disassociating will detach the floating IP from the selected resource. External access via this IP will stop immediately.',
      size: 'sm' as const,
      infoLabel: 'Floating IP',
      infoValue: '123.45.67.8',
      secondInfoLabel: 'Associated to',
      secondInfoList: ['Type : Instance', 'Name : server-01', 'Fixed IP : 10.0.0.10'],
      hasWarning: false,
      actionText: 'Disassociate',
      actionVariant: 'primary' as const,
    },
    'restore-warning': {
      button: 'Restore (Disabled)',
      title: 'Restore backup',
      description: 'Large volume backups may impact performance and network throughput.',
      size: 'md' as const,
      infoLabel: 'Volume name',
      infoValue: 'vol-01 (Available)',
      secondInfoLabel: 'Instance name',
      secondInfoList: ['web-server-1 (Running)', 'dev-team (Running)'],
      hasWarning: true,
      warningText:
        'Restore cannot proceed. Change the backup status to Available or shut down the attached instance.',
      actionText: 'Restore',
      actionVariant: 'primary' as const,
      disabled: true,
    },
  };

  const c = config[useCase];

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {c.button}
      </Button>
      <Modal isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={c.title}
        description={c.description}
        size={c.size}
      >
        <div className="flex flex-col gap-2">
          {/* Info Box */}
          <div className={`bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 ${'infoList' in c ? 'max-h-[96px] overflow-y-auto sidebar-scroll' : ''}`}
          >
            <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
              {c.infoLabel}
            </span>
            {'infoValue' in c && (
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {c.infoValue}
              </span>
            )}
            {'infoList' in c && (
              <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
                {c.infoList?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Second Info Box (if exists) */}
          {'secondInfoLabel' in c && (
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-label-sm text-[var(--color-text-subtle)]  leading-4">
                {c.secondInfoLabel}
              </span>
              <ul className="text-body-md text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
                {c.secondInfoList?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning Alert */}
          {c.hasWarning && (
            <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
              <IconAlertCircle size={16}
                className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
                stroke={1.5}
              />
              <p className="text-body-sm text-[var(--color-text-default)] leading-4">
                {c.warningText}
              </p>
            </div>
          )}
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel </Button>
          <Button variant={c.actionVariant}
            size="md"
            onClick={() => setIsOpen(false)}
            className="flex-1"
            disabled={'disabled' in c && c.disabled}
          >
            {c.actionText}
          </Button>
        </div>
      </Modal>
    </>
  );
}

/* ----------------------------------------
   Drawer Demo (with state)
   ---------------------------------------- */

export function DrawerDemo() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAttachVolumeOpen, setIsAttachVolumeOpen] = useState(false);
  const [formValue, setFormValue] = useState('');

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Basic Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsBasicOpen(true)}>
        Basic Drawer </Button>
      <Drawer isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        title="Drawer Title"
        width={376}
      >
        <VStack gap={4}>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
            <p className="text-body-md text-[var(--color-text-default)]">
              This is a basic drawer with content. Drawers are useful for secondary content, forms,
              or detail views.
            </p>
          </div>
          <VStack gap={2}>
            <Label>Example content</Label>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              You can put any content inside a drawer, including forms, lists, or details.
            </p>
          </VStack>
        </VStack>
      </Drawer>

      {/* Drawer with Footer */}
      <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
        With button </Button>
      <Drawer isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Edit Settings"
        width={376}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>
              Cancel </Button>
            <Button variant="primary" className="flex-1" onClick={() => setIsFormOpen(false)}>
              Save </Button>
          </div>
        }
      >
        <VStack gap={4}>
          <VStack gap={2}>
            <label className="text-label-md text-[var(--color-text-default)]">
              Setting Name </label>
            <Input value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Enter value..."
              fullWidth />
          </VStack>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-3">
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Drawers with footers are useful for forms with action buttons.
            </p>
          </div>
        </VStack>
      </Drawer>

      {/* Attach volume Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsAttachVolumeOpen(true)}>
        Attach volume </Button>
      <AttachVolumeDrawer isOpen={isAttachVolumeOpen}
        onClose={() => setIsAttachVolumeOpen(false)}
        instanceName="web-server-10"
        onAttach={(volumeId) => {
          console.log('Attach volume:', volumeId);
          setIsAttachVolumeOpen(false);
        }}
        onCreateNewVolume={() => {
          console.log('Create new volume');
        }}
      />
    </div>
  );
}
