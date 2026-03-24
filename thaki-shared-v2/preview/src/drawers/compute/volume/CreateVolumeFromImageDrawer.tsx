import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateVolumeFromImageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  imageName: string;
  minDiskGiB?: number;
}

const TYPE_OPTIONS = [
  { value: 'SSD', label: 'SSD' },
  { value: 'HDD', label: 'HDD' },
  { value: 'NVMe', label: 'NVMe' },
];

export function CreateVolumeFromImageDrawer({
  isOpen,
  onClose,
  imageName,
  minDiskGiB = 1,
}: CreateVolumeFromImageDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [volumeName, setVolumeName] = useState('');
  const [description, setDescription] = useState('');
  const [volumeType, setVolumeType] = useState<'SSD' | 'HDD' | 'NVMe'>('SSD');
  const [sizeGiB, setSizeGiB] = useState(String(Math.max(1, minDiskGiB)));
  const [nameError, setNameError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVolumeName('');
      setDescription('');
      setVolumeType('SSD');
      setSizeGiB(String(Math.max(1, minDiskGiB)));
      setNameError(null);
      setSizeError(null);
    }
  }, [isOpen, minDiskGiB]);

  const handleSubmit = () => {
    let invalid = false;
    if (!volumeName.trim()) {
      setNameError('Please enter a volume name.');
      invalid = true;
    } else {
      setNameError(null);
    }
    const n = Number(sizeGiB);
    if (!Number.isFinite(n) || n < minDiskGiB) {
      setSizeError(`Size must be at least ${minDiskGiB} GiB.`);
      invalid = true;
    } else {
      setSizeError(null);
    }
    if (invalid) return;
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create volume from image"
      description="Create a new volume from this image."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Image name" values={[imageName]} />
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

        <FormField label="Type" required>
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

        <FormField label="Size" required error={sizeError || undefined}>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={minDiskGiB}
              value={sizeGiB}
              onChange={(e) => {
                setSizeGiB(e.target.value);
                if (sizeError) setSizeError(null);
              }}
              placeholder={`Min ${minDiskGiB}`}
              error={!!sizeError}
              className="flex-1 min-w-0"
            />
            <span className="text-12 text-text-muted shrink-0">GiB</span>
          </div>
        </FormField>
      </div>
    </Overlay.Template>
  );
}
