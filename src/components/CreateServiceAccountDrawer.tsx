import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface CreateServiceAccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { name: string; description: string; active: boolean }) => void;
}

export function CreateServiceAccountDrawer({
  isOpen,
  onClose,
  onSubmit,
}: CreateServiceAccountDrawerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setActive(true);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit?.({ name, description, active });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create service account"
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Create
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
          description="Select the user's status. If 'Disabled', the user will be prevented from signing in."
          spacing="loose"
        >
          <HStack gap={2} align="center">
            <Toggle checked={active} onChange={setActive} />
            <span className="text-body-md text-[var(--color-text-default)]">
              {active ? 'Active' : 'Disabled'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateServiceAccountDrawer;
