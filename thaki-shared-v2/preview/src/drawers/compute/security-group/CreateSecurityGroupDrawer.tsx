import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateSecurityGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSecurityGroupDrawer({ isOpen, onClose }: CreateSecurityGroupDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Please enter a name.');
      return;
    }
    setNameError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create security group"
      description="Create a new security group."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField label="Name" required error={nameError || undefined}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter name"
            size="sm"
            error={!!nameError}
          />
        </FormField>

        <FormField label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
            size="sm"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
