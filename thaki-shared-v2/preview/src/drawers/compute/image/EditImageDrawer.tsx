import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { Toggle } from '@shared/components/Toggle';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export type EditImageVisibility = 'Public' | 'Private' | 'Shared' | 'Community';

export interface EditImageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  imageId?: string;
  initialData?: {
    name: string;
    description: string;
    minDiskGiB: number;
    minRamMiB: number;
    visibility: EditImageVisibility;
    protected: boolean;
  };
}

const VISIBILITY_OPTIONS: { value: EditImageVisibility; label: string }[] = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Shared', label: 'Shared' },
  { value: 'Community', label: 'Community' },
];

export function EditImageDrawer({
  isOpen,
  onClose,
  imageId = 'img-00000000',
  initialData,
}: EditImageDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [minDiskGiB, setMinDiskGiB] = useState(initialData?.minDiskGiB ?? 20);
  const [minRamMiB, setMinRamMiB] = useState(initialData?.minRamMiB ?? 2048);
  const [visibility, setVisibility] = useState<EditImageVisibility>(
    initialData?.visibility ?? 'Public'
  );
  const [protectedImage, setProtectedImage] = useState(initialData?.protected ?? false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setMinDiskGiB(initialData?.minDiskGiB ?? 20);
      setMinRamMiB(initialData?.minRamMiB ?? 2048);
      setVisibility(initialData?.visibility ?? 'Public');
      setProtectedImage(initialData?.protected ?? false);
      setNameError(null);
    }
  }, [
    isOpen,
    initialData?.name,
    initialData?.description,
    initialData?.minDiskGiB,
    initialData?.minRamMiB,
    initialData?.visibility,
    initialData?.protected,
  ]);

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
      title="Edit image"
      description="Edit the image's properties."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Image ID" values={[imageId]} />
        </div>

        <FormField label="Name" required error={nameError || undefined}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter name"
            error={!!nameError}
            size="sm"
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

        <FormField label="Min disk" required>
          <NumberInput value={minDiskGiB} onChange={setMinDiskGiB} min={0} size="sm" suffix="GiB" />
        </FormField>

        <FormField label="Min RAM" required>
          <NumberInput value={minRamMiB} onChange={setMinRamMiB} min={0} size="sm" suffix="MiB" />
        </FormField>

        <FormField label="Visibility" required>
          <Dropdown.Select
            value={visibility}
            onChange={(v) => setVisibility(v as EditImageVisibility)}
            placeholder="Select visibility"
            size="sm"
          >
            {VISIBILITY_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Protected</span>
            <span className="text-12 text-text-muted">
              Protected images cannot be deleted until protection is removed.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle
              checked={protectedImage}
              onChange={(e) => setProtectedImage(e.target.checked)}
            />
            <span className="text-12 text-text">{protectedImage ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
