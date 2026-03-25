import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { InlineMessage } from '@shared/components/InlineMessage';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateInstanceSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName?: string;
}

export function CreateInstanceSnapshotDrawer({
  isOpen,
  onClose,
  instanceName = 'my-instance',
}: CreateInstanceSnapshotDrawerProps) {
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
      title="Create instance snapshot"
      description="Create a snapshot of this instance to capture its current system state as an image."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Instance" values={[instanceName]} />
          <InlineMessage
            type="error"
            message="For data consistency, stop all write operations on the instance before creating a snapshot."
          />
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
