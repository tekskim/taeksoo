import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      return;
    }

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
    onClose();
  };

  const isNameValid = name.trim().length >= 2 && name.trim().length <= 128;
  const isDescriptionValid = description.length <= 255;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !isNameValid || !isDescriptionValid}
            className="flex-1 h-8"
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
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Edit the user group's basic information.
          </p>
        </VStack>

        {/* User group name field */}
        <VStack gap={2}>
          <div className="flex items-start gap-[3px]">
            <span className="text-label-lg text-[var(--color-text-default)] leading-5">
              User group name
            </span>
            <span className="text-label-lg text-[var(--color-state-danger)] leading-5">
              *
            </span>
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user group name"
            fullWidth
          />
          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </p>
        </VStack>

        {/* Description field */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)] leading-5">
            Description
          </span>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            fullWidth
          />
          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </p>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditUserGroupDrawer;
