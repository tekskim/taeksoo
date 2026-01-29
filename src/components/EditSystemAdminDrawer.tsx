import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SystemAdminData {
  username: string;
  email: string;
  displayName: string;
  enabled: boolean;
}

export interface EditSystemAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SystemAdminData;
  onSubmit?: (data: Omit<SystemAdminData, 'username'>) => void;
}

/* ----------------------------------------
   EditSystemAdminDrawer Component
   ---------------------------------------- */

export function EditSystemAdminDrawer({
  isOpen,
  onClose,
  initialData = {
    username: 'thaki-kim',
    email: 'user@example.com',
    displayName: '',
    enabled: true,
  },
  onSubmit,
}: EditSystemAdminDrawerProps) {
  const [email, setEmail] = useState(initialData.email);
  const [displayName, setDisplayName] = useState(initialData.displayName);
  const [enabled, setEnabled] = useState(initialData.enabled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Email validation
  const isEmailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialData.email);
      setDisplayName(initialData.displayName);
      setEnabled(initialData.enabled);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!isEmailValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({ email, displayName, enabled });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail(initialData.email);
    setDisplayName(initialData.displayName);
    setEnabled(initialData.enabled);
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || (hasAttemptedSubmit && !isEmailValid)}
            className="flex-1 h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={3}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Edit system administrator
          </h2>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Edit the system administrator's basic information.
          </p>

          {/* Username Info Card */}
          <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Username
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {initialData.username}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Email Address */}
        <VStack gap={2}>
          <div className="flex items-start gap-[3px]">
            <span className="text-label-lg text-[var(--color-text-default)] leading-5">
              Email address
            </span>
            <span className="text-label-lg text-[var(--color-state-danger)] leading-5">
              *
            </span>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            The email address used for password recovery.
          </p>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            fullWidth
            size="md"
            error={hasAttemptedSubmit && !isEmailValid}
          />
        </VStack>

        {/* Display Name */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)] leading-5">
            Display name
          </span>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            The account's name displayed in the UI. If not entered, the username will be displayed.
          </p>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
            fullWidth
            size="md"
          />
        </VStack>

        {/* Status */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)] leading-5">
            Status
          </span>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Select the account's status. If 'disabled', the system administrator will be prevented
            from signing in.
          </p>
          <HStack gap={2} align="center">
            <Toggle checked={enabled} onChange={setEnabled} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditSystemAdminDrawer;
