import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface EditFolderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  folderName?: string;
  onSubmit?: (name: string) => void;
}

export function EditFolderDrawer({
  isOpen,
  onClose,
  folderName = '',
  onSubmit,
}: EditFolderDrawerProps) {
  const [name, setName] = useState(folderName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(folderName);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, folderName]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!name.trim()) {
      setNameError('Please enter a folder name.');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(name);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName(folderName);
    setHasAttemptedSubmit(false);
    setNameError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Folder"
      width={360}
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
      <VStack gap={6}>
        <FormField
          label="Folder name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
          error={hasAttemptedSubmit && !!nameError}
          errorMessage={nameError ?? undefined}
        >
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter folder name"
            fullWidth
            error={hasAttemptedSubmit && !!nameError}
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditFolderDrawer;
