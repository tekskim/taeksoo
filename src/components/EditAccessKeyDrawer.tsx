import { useState, useEffect } from 'react';
import { Drawer, Button, Textarea, Toggle, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface EditAccessKeyData {
  description: string;
  isActive: boolean;
}

export interface EditAccessKeyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keyId?: string;
  initialDescription?: string;
  initialActive?: boolean;
  onSubmit?: (data: EditAccessKeyData) => void;
}

/* ----------------------------------------
   EditAccessKeyDrawer Component
   ---------------------------------------- */

export function EditAccessKeyDrawer({
  isOpen,
  onClose,
  keyId = 'AKIA112AK3IALQI2',
  initialDescription = '',
  initialActive = true,
  onSubmit,
}: EditAccessKeyDrawerProps) {
  const [description, setDescription] = useState(initialDescription);
  const [isActive, setIsActive] = useState(initialActive);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription);
      setIsActive(initialActive);
    }
  }, [isOpen, initialDescription, initialActive]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.({ description, isActive });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit access key"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
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
      <VStack gap={6}>
        <InfoBox label="Key ID" value={keyId} />

        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            fullWidth
            rows={3}
          />
        </FormField>

        <FormField
          label="Status"
          description="Sets the activation state of the access key. Active enables the key, and Deactivated disables it."
          spacing="loose"
        >
          <Toggle
            checked={isActive}
            onChange={(val) => setIsActive(val)}
            label={isActive ? 'Active' : 'Deactivated'}
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditAccessKeyDrawer;
