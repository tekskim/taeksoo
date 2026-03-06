import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ServerGroupInfo {
  id: string;
  name: string;
}

export interface EditServerGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serverGroup: ServerGroupInfo | null;
  onSubmit?: (name: string) => void;
}

/* ----------------------------------------
   EditServerGroupDrawer Component
   ---------------------------------------- */

export function EditServerGroupDrawer({
  isOpen,
  onClose,
  serverGroup,
  onSubmit,
}: EditServerGroupDrawerProps) {
  const [groupName, setGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && serverGroup) {
      setGroupName(serverGroup.name);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, serverGroup]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!groupName.trim()) {
      setNameError('Server group name is required');
      return;
    }
    if (groupName.trim().length > 128) {
      setNameError('Server group name must be 128 characters or fewer');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(groupName);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setNameError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit server group"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
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
      <VStack gap={6}>
        {/* Header */}
        {/* Server group name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Server group name</FormField.Label>
          <FormField.Control>
            <Input
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter server group name"
              fullWidth
              error={hasAttemptedSubmit && !!nameError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditServerGroupDrawer;
