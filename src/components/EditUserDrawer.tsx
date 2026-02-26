import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface EditUserData {
  email: string;
  displayName: string;
  enabled: boolean;
}

export interface EditUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  initialData?: Partial<EditUserData>;
  onSubmit?: (data: EditUserData) => void;
}

/* ----------------------------------------
   EditUserDrawer Component
   ---------------------------------------- */

export function EditUserDrawer({
  isOpen,
  onClose,
  userName = 'thaki-kim',
  initialData,
  onSubmit,
}: EditUserDrawerProps) {
  const [email, setEmail] = useState(initialData?.email || 'user@example.com');
  const [displayName, setDisplayName] = useState(initialData?.displayName || '');
  const [enabled, setEnabled] = useState(initialData?.enabled ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialData?.email || 'user@example.com');
      setDisplayName(initialData?.displayName || '');
      setEnabled(initialData?.enabled ?? true);
      setHasAttemptedSubmit(false);
      setEmailError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!email.trim()) {
      setEmailError('Please enter an email address.');
      return;
    }
    setEmailError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        email,
        displayName,
        enabled,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setEmailError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      width={360}
      showCloseButton={false}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={3}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">Edit user</h2>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Edit the user's basic information.
          </p>

          {/* Username Info Box */}
          <InfoBox label="Username" value={userName} />
        </VStack>

        {/* Email Address Section */}
        <FormField required error={!!emailError}>
          <FormField.Label>Email</FormField.Label>
          <FormField.Control>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              placeholder="Enter email address"
              fullWidth
              error={!!emailError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{emailError}</FormField.ErrorMessage>
        </FormField>

        {/* Display Name Section */}
        <FormField
          label="Display name"
          description="The user's name displayed in the UI. If not entered, the user name will be displayed."
        >
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
            fullWidth
          />
        </FormField>

        {/* Status Section */}
        <FormField
          label="Status"
          description="Select the user's status. If 'Disabled', the user will be prevented from signing in."
          spacing="loose"
        >
          <HStack gap={2} align="center">
            <Toggle checked={enabled} onChange={(checked) => setEnabled(checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditUserDrawer;
