import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, FormField } from '@/design-system';
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
            disabled={isSubmitting}
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
          <p className="text-body-md text-[var(--color-text-subtle)]">
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
        <FormField required error={hasAttemptedSubmit && !isEmailValid}>
          <FormField.Label>Email address</FormField.Label>
          <FormField.Description>
            The email address used for password recovery.
          </FormField.Description>
          <FormField.Control>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              fullWidth
              size="md"
              error={hasAttemptedSubmit && !isEmailValid}
            />
          </FormField.Control>
        </FormField>

        {/* Display Name */}
        <FormField>
          <FormField.Label>Display name</FormField.Label>
          <FormField.Description>
            The account&apos;s name displayed in the UI. If not entered, the username will be
            displayed.
          </FormField.Description>
          <FormField.Control>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
              fullWidth
              size="md"
            />
          </FormField.Control>
        </FormField>

        {/* Status */}
        <FormField>
          <FormField.Label>Status</FormField.Label>
          <FormField.Description>
            Select the account&apos;s status. If &apos;disabled&apos;, the system administrator will
            be prevented from signing in.
          </FormField.Description>
          <FormField.Control>
            <HStack gap={2} align="center">
              <Toggle checked={enabled} onChange={setEnabled} />
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            </HStack>
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditSystemAdminDrawer;
