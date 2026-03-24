import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateImageFromVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
}

const FORMAT_OPTIONS = [
  { value: 'raw', label: 'Raw' },
  { value: 'qcow2', label: 'QCOW2' },
  { value: 'vhd', label: 'VHD' },
  { value: 'vmdk', label: 'VMDK' },
];

export function CreateImageFromVolumeDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
}: CreateImageFromVolumeDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [imageName, setImageName] = useState('');
  const [format, setFormat] = useState('qcow2');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setImageName('');
      setFormat('qcow2');
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!imageName.trim()) {
      setNameError('Please enter an image name.');
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
      title="Create image from volume"
      description="Create a new image from this volume."
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

        <FormField label="Image name" required error={nameError || undefined}>
          <Input
            value={imageName}
            onChange={(e) => {
              setImageName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter image name"
            error={!!nameError}
          />
        </FormField>

        <FormField label="Format" required>
          <Dropdown.Select
            value={format}
            onChange={(v) => setFormat(String(v))}
            placeholder="Select format"
            size="sm"
          >
            {FORMAT_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>
      </div>
    </Overlay.Template>
  );
}
