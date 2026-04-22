import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface AdminTenantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialName?: string;
  initialDescription?: string;
  initialEnabled?: boolean;
  onSubmit?: (data: { name: string; description: string; enabled: boolean }) => void;
}

export function AdminTenantDrawer({
  isOpen,
  onClose,
  mode,
  initialName = '',
  initialDescription = '',
  initialEnabled = true,
  onSubmit,
}: AdminTenantDrawerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(mode === 'edit' ? initialName : '');
      setDescription(mode === 'edit' ? initialDescription : '');
      setEnabled(mode === 'edit' ? initialEnabled : true);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, mode, initialName, initialDescription, initialEnabled]);

  const nameError = hasAttemptedSubmit && !name.trim() ? 'Tenant name is required.' : null;

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ name: name.trim(), description: description.trim(), enabled });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCreate = mode === 'create';
  const title = isCreate ? 'Create Tenant' : 'Edit Tenant';
  const descriptionText = isCreate
    ? 'Creates a new tenant and configures its basic properties.'
    : "Edit the tenant's name and description. These changes update basic information only.";
  const submitLabel = isCreate ? 'Create' : 'Save';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={descriptionText}
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
            {isSubmitting ? (isCreate ? 'Creating...' : 'Saving...') : submitLabel}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Tenant name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          error={!!nameError}
          errorMessage={nameError ?? undefined}
          required
        >
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (hasAttemptedSubmit) setHasAttemptedSubmit(false);
            }}
            placeholder="Enter name"
            fullWidth
            error={!!nameError}
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
            fullWidth
          />
        </FormField>

        <FormField
          label="Status"
          description="Indicates whether to enable the tenant."
          spacing="loose"
        >
          <Toggle
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            label={enabled ? 'Enabled' : 'Disabled'}
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default AdminTenantDrawer;
