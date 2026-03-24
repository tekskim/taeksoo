import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Toggle } from '@shared/components/Toggle';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateVolumeBackupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
}

export function CreateVolumeBackupDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
}: CreateVolumeBackupDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [incremental, setIncremental] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBackupName('');
      setDescription('');
      setIncremental(false);
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!backupName.trim()) {
      setNameError('Please enter a backup name.');
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
      title="Create volume backup"
      description="Create a backup of this volume for disaster recovery."
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

        <FormField label="Backup name" required error={nameError || undefined}>
          <Input
            value={backupName}
            onChange={(e) => {
              setBackupName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter backup name"
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

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Incremental backup</span>
            <span className="text-12 text-text-muted">
              Only store changes since the last backup when possible.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={incremental} onChange={(e) => setIncremental(e.target.checked)} />
            <span className="text-12 text-text">{incremental ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
