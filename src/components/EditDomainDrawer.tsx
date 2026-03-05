import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DomainData {
  name: string;
  description: string;
  enabled: boolean;
}

export interface EditDomainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DomainData;
  onSubmit?: (data: DomainData) => void;
}

/* ----------------------------------------
   EditDomainDrawer Component
   ---------------------------------------- */

export function EditDomainDrawer({
  isOpen,
  onClose,
  initialData = {
    name: 'domain',
    description: '',
    enabled: true,
  },
  onSubmit,
}: EditDomainDrawerProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [enabled, setEnabled] = useState(initialData.enabled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setDescription(initialData.description);
      setEnabled(initialData.enabled);
      setHasAttemptedSubmit(false);
      setNameError(null);
      setDescriptionError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    let hasError = false;

    if (!name.trim()) {
      setNameError('Please enter a domain name.');
      hasError = true;
    } else if (name.trim().length < 2 || name.trim().length > 128) {
      setNameError('Name must be between 2-128 characters.');
      hasError = true;
    } else {
      setNameError(null);
    }

    if (description.length > 255) {
      setDescriptionError('Description must be 255 characters or less.');
      hasError = true;
    } else {
      setDescriptionError(null);
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: name.trim(),
        description: description.trim(),
        enabled,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName(initialData.name);
    setDescription(initialData.description);
    setEnabled(initialData.enabled);
    setHasAttemptedSubmit(false);
    setNameError(null);
    setDescriptionError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit domain"
      description="Edit the domain's basic information."
      width={360}
      footer={
        <HStack gap={2} justify="center" className="w-full">
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
        {/* Domain name field */}
        <FormField required error={!!nameError}>
          <FormField.Label>Domain name</FormField.Label>
          <FormField.Control>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter domain name"
              fullWidth
              error={!!nameError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>

        {/* Description field */}
        <FormField error={!!descriptionError}>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (descriptionError) setDescriptionError(null);
              }}
              placeholder="Enter description"
              fullWidth
              error={!!descriptionError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{descriptionError}</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </FormField.HelperText>
        </FormField>

        {/* Status field */}
        <FormField
          label="Status"
          description="Select the domain's status. If 'disabled', users in this domain will not be able to sign in."
          spacing="loose"
        >
          <HStack gap={2} align="center">
            <Toggle checked={enabled} onChange={setEnabled} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditDomainDrawer;
