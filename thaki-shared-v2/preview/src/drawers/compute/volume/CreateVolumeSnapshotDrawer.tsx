import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateVolumeSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
}

export function CreateVolumeSnapshotDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
}: CreateVolumeSnapshotDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [snapshotName, setSnapshotName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSnapshotName('');
      setDescription('');
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!snapshotName.trim()) {
      setNameError('Please enter a snapshot name.');
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
      title="Create volume snapshot"
      description="Create a point-in-time snapshot of this volume."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume name" values={[volumeName]} />
        </div>

        <FormField label="Snapshot name" required error={nameError || undefined}>
          <Input
            value={snapshotName}
            onChange={(e) => {
              setSnapshotName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter snapshot name"
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
