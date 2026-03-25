import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateVolumeFromVolumeSnapshotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshotName?: string;
}

const TYPE_OPTIONS = [
  { value: 'SSD', label: 'SSD' },
  { value: 'HDD', label: 'HDD' },
  { value: 'NVMe', label: 'NVMe' },
];

export function CreateVolumeFromVolumeSnapshotDrawer({
  isOpen,
  onClose,
  snapshotName = 'my-snapshot',
}: CreateVolumeFromVolumeSnapshotDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [volumeName, setVolumeName] = useState('');
  const [description, setDescription] = useState('');
  const [volumeType, setVolumeType] = useState<'SSD' | 'HDD' | 'NVMe'>('SSD');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVolumeName('');
      setDescription('');
      setVolumeType('SSD');
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!volumeName.trim()) {
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
      title="Create volume from snapshot"
      description="Creates a new volume based on the selected snapshot."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Snapshot name" values={[snapshotName]} />
        </div>

        <FormField label="Volume name" required error={nameError || undefined}>
          <Input
            value={volumeName}
            onChange={(e) => {
              setVolumeName(e.target.value);
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

        <FormField label="Volume type" required>
          <Dropdown.Select
            value={volumeType}
            onChange={(v) => setVolumeType(v as 'SSD' | 'HDD' | 'NVMe')}
            placeholder="Select type"
            size="sm"
          >
            {TYPE_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>
      </div>
    </Overlay.Template>
  );
}
