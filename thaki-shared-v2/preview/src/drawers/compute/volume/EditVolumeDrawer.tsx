import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface EditVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeId?: string;
  initialData?: { name: string; description: string };
}

export function EditVolumeDrawer({
  isOpen,
  onClose,
  volumeId = 'vol-00000000',
  initialData,
}: EditVolumeDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setNameError(null);
    }
  }, [isOpen, initialData?.name, initialData?.description]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Please enter a volume name.');
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
      title="Edit volume"
      description="Edit the volume's basic information."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume ID" values={[volumeId]} />
        </div>

        <FormField label="Volume name" required error={nameError || undefined}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter volume name"
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
