import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CloneVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
  volumeType?: string;
  volumeSize?: string;
}

export function CloneVolumeDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
  volumeType = 'SSD',
  volumeSize = '100 GiB',
}: CloneVolumeDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [cloneName, setCloneName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCloneName('');
      setDescription('');
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!cloneName.trim()) {
      setNameError('Please enter a clone name.');
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
      title="Clone volume"
      description="Create an exact copy of this volume."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Clone"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume name" values={[volumeName]} />
        </div>

        <div className="flex flex-col gap-2 rounded-md border border-border bg-surface-muted p-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-11 font-medium text-text-muted">Type</span>
            <span className="text-12 text-text">{volumeType}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-11 font-medium text-text-muted">Size</span>
            <span className="text-12 text-text">{volumeSize}</span>
          </div>
        </div>

        <FormField label="Clone name" required error={nameError || undefined}>
          <Input
            value={cloneName}
            onChange={(e) => {
              setCloneName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter clone name"
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
