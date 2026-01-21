import { useState, useEffect } from 'react';
import { 
  Drawer, 
  Button, 
  Input,
  Toggle,
} from '@/design-system';
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

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialData?.email || 'user@example.com');
      setDisplayName(initialData?.displayName || '');
      setEnabled(initialData?.enabled ?? true);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
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
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      width={376}
      showCloseButton={false}
      footer={
        <HStack gap={2} className="w-full">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="flex-1 h-8"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting || !email.trim()}
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
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Edit user
          </h2>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Edit the user's basic information.
          </p>

          {/* Username Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
                Username
              </span>
              <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                {userName}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Email Address Section */}
        <VStack gap={2}>
          <VStack gap={2}>
            <div className="flex items-start gap-[3px]">
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Email address
              </span>
              <span className="text-[14px] font-medium text-[var(--color-state-danger)] leading-5">
                *
              </span>
            </div>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              The email address used for password recovery.
            </p>
          </VStack>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            fullWidth
          />
        </VStack>

        {/* Display Name Section */}
        <VStack gap={2}>
          <VStack gap={2}>
            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Display name
            </span>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              The user's name displayed in the UI. If not entered, the user name will be displayed.
            </p>
          </VStack>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
            fullWidth
          />
        </VStack>

        {/* Status Section */}
        <VStack gap={2}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Status
          </span>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Select the user's status. If 'Disabled', the user will be prevented from signing in.
          </p>
          <HStack gap={2} align="center">
            <Toggle
              checked={enabled}
              onChange={(checked) => setEnabled(checked)}
            />
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditUserDrawer;
