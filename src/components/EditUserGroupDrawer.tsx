import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface UserGroupData {
  name: string;
  description: string;
}

export interface EditUserGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserGroupData;
  onSubmit?: (data: UserGroupData) => void;
}

/* ----------------------------------------
   EditUserGroupDrawer Component
   ---------------------------------------- */

export function EditUserGroupDrawer({
  isOpen,
  onClose,
  initialData = {
    name: 'MemberGroup',
    description: '',
  },
  onSubmit,
}: EditUserGroupDrawerProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setDescription(initialData.description);
      setHasAttemptedSubmit(false);
      setNameError(null);
      setDescriptionError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    let hasError = false;

    if (!name.trim()) {
      setNameError('Please enter a user group name.');
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
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName(initialData.name);
    setDescription(initialData.description);
    setHasAttemptedSubmit(false);
    setNameError(null);
    setDescriptionError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
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
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Edit user group
          </h2>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Edit the user group's basic information.
          </p>
        </VStack>

        {/* User group name field */}
        <FormField required error={!!nameError}>
          <FormField.Label>User group name</FormField.Label>
          <FormField.Control>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Enter user group name"
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
      </VStack>
    </Drawer>
  );
}

export default EditUserGroupDrawer;
