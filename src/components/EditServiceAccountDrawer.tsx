import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface EditServiceAccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  initialDescription: string;
  initialActive: boolean;
  onSubmit?: (data: { name: string; description: string; active: boolean }) => void;
}

export function EditServiceAccountDrawer({
  isOpen,
  onClose,
  initialName,
  initialDescription,
  initialActive,
  onSubmit,
}: EditServiceAccountDrawerProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
      setActive(initialActive);
    }
  }, [isOpen, initialName, initialDescription, initialActive]);

  const handleSubmit = () => {
    onSubmit?.({ name, description, active });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit service account"
      description="Edit basic information for this service account"
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
        <FormField
          label="Service account name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter service account name"
            fullWidth
          />
        </FormField>

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
          description="While deactivated, sign-in and API key authentication are denied until you activate this account again."
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

export default EditServiceAccountDrawer;
