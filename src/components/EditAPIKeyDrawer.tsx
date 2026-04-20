import { useState, useEffect } from 'react';
import { Drawer, Button, Textarea, Toggle, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface EditAPIKeyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keyId: string;
  initialDescription: string;
  initialActive: boolean;
  onSubmit?: (data: { description: string; active: boolean }) => void;
}

export function EditAPIKeyDrawer({
  isOpen,
  onClose,
  keyId,
  initialDescription,
  initialActive,
  onSubmit,
}: EditAPIKeyDrawerProps) {
  const [description, setDescription] = useState(initialDescription);
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription);
      setActive(initialActive);
    }
  }, [isOpen, initialDescription, initialActive]);

  const handleSubmit = () => {
    onSubmit?.({ description, active });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit API key"
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Save
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
            maxLength={255}
            fullWidth
          />
        </FormField>

        <FormField
          label="Status"
          description="Sets the activation state of the access key. Active enables the key, and Deactivated disables it."
          spacing="loose"
        >
          <HStack gap={2} align="center">
            <Toggle checked={active} onChange={setActive} />
            <span className="text-body-md text-[var(--color-text-default)]">
              {active ? 'Active' : 'Deactivated'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditAPIKeyDrawer;
