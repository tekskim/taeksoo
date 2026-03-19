import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { useDrawerAnimation } from '../hooks/useDrawerAnimation';

export interface EditUserGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { name: string; description: string };
}

export function EditUserGroupDrawer({
  isOpen,
  onClose,
  initialData = { name: 'MemberGroup', description: '' },
}: EditUserGroupDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setDescription(initialData.description);
      setNameError(null);
      setDescriptionError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
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
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Edit user group"
      description="Edit the user group's basic information."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField
          label="User group name"
          required
          error={nameError || undefined}
          hint="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
        >
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter user group name"
            error={!!nameError}
          />
        </FormField>

        <FormField
          label="Description"
          error={descriptionError || undefined}
          hint="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (descriptionError) setDescriptionError(null);
            }}
            placeholder="Enter description"
            rows={3}
            error={!!descriptionError}
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
