import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Fieldset } from '@shared/components/Fieldset';
import { Button } from '@shared/components/Button';
import { RadioGroup } from '@shared/components/RadioGroup';

const AZ_OPTIONS = [
  { value: 'nova', label: 'nova' },
  { value: 'nova-2', label: 'nova-2' },
  { value: 'nova-3', label: 'nova-3' },
];

const IMAGE_OPTIONS = [
  { value: 'img-001', label: 'Ubuntu-24.04-64-base' },
  { value: 'img-002', label: 'Windows-Server-2019' },
  { value: 'img-003', label: 'Rocky-Linux-9' },
];

const SNAPSHOT_OPTIONS = [
  { value: 'snap-001', label: 'snapshot-01' },
  { value: 'snap-002', label: 'snapshot-02' },
  { value: 'snap-003', label: 'snapshot-03' },
];

const VOLUME_TYPE_OPTIONS = [
  { value: 'vt-001', label: '_DEFAULT_' },
  { value: 'vt-002', label: '_DEFAULT_ (alt)' },
];

export function ComputeCreateVolumePage() {
  const navigate = useNavigate();
  const [volumeName, setVolumeName] = useState('');
  const [description, setDescription] = useState('');
  const [availabilityZone, setAvailabilityZone] = useState('');
  const [sourceType, setSourceType] = useState<'blank' | 'image' | 'snapshot'>('blank');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] = useState('');
  const [volumeTypeId, setVolumeTypeId] = useState('');
  const [volumeCapacity, setVolumeCapacity] = useState(10);

  const [volumeNameError, setVolumeNameError] = useState('');
  const [azError, setAzError] = useState('');
  const [sourceError, setSourceError] = useState('');
  const [volumeTypeError, setVolumeTypeError] = useState('');

  const capacityMax = sourceType === 'snapshot' ? 1460 : 1000;
  const capacityHint = sourceType === 'snapshot' ? '1-1460 GiB' : '1-1000 GiB';

  const showVolumeTypeTable = sourceType !== 'snapshot';

  const resolvedVolumeTypeLabel = useMemo(() => {
    if (sourceType === 'snapshot' && selectedSnapshot) {
      return '_DEFAULT_';
    }
    const vt = VOLUME_TYPE_OPTIONS.find((o) => o.value === volumeTypeId);
    return vt?.label ?? '';
  }, [sourceType, selectedSnapshot, volumeTypeId]);

  const handleCreate = () => {
    let ok = true;
    if (!volumeName.trim()) {
      setVolumeNameError('Please enter a volume name.');
      ok = false;
    } else setVolumeNameError('');
    if (!availabilityZone) {
      setAzError('Please select an availability zone.');
      ok = false;
    } else setAzError('');
    if (sourceType === 'image' && !selectedImage) {
      setSourceError('Please select an image.');
      ok = false;
    } else if (sourceType === 'snapshot' && !selectedSnapshot) {
      setSourceError('Please select a snapshot.');
      ok = false;
    } else setSourceError('');
    if (showVolumeTypeTable && !volumeTypeId) {
      setVolumeTypeError('Please select a volume type.');
      ok = false;
    } else setVolumeTypeError('');
    if (!ok) return;
    navigate('/compute/volumes');
  };

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create volume" />

      <div className="flex flex-col gap-6 max-w-[720px]">
        <Fieldset legend="Basic information" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Volume name"
              required
              error={volumeNameError}
              hint="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-64 characters."
            >
              <Input
                placeholder="Enter volume name"
                value={volumeName}
                onChange={(e) => {
                  setVolumeName(e.target.value);
                  setVolumeNameError('');
                }}
              />
            </FormField>

            <FormField
              label="Description"
              hint="You can use letters, numbers, and special characters (+=,.@-_()), and maximum 255 characters."
            >
              <Input
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <FormField
              label="AZ (Availability zone)"
              required
              error={azError}
              description="Select the availability zone for the volume."
            >
              <Dropdown.Select
                placeholder="Select AZ"
                value={availabilityZone}
                onChange={(v) => {
                  setAvailabilityZone(String(v));
                  setAzError('');
                }}
              >
                {AZ_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>
          </div>
        </Fieldset>

        <Fieldset legend="Source" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Volume source type"
              required
              description="Select the source for the new volume. You can create a blank volume or generate a volume from an image or an existing volume."
            >
              <RadioGroup
                name="volume-source"
                direction="vertical"
                options={[
                  { value: 'blank', label: 'Blank volume' },
                  { value: 'image', label: 'Image' },
                  { value: 'snapshot', label: 'Volume snapshot' },
                ]}
                selectedValue={sourceType}
                onChange={(v) => {
                  setSourceType(v as typeof sourceType);
                  setSelectedImage('');
                  setSelectedSnapshot('');
                  setSourceError('');
                }}
              />
            </FormField>

            {sourceType === 'image' && (
              <FormField label="Image" required error={sourceError}>
                <Dropdown.Select
                  placeholder="Search images by attributes"
                  value={selectedImage}
                  onChange={(v) => {
                    setSelectedImage(String(v));
                    setSourceError('');
                  }}
                >
                  {IMAGE_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </FormField>
            )}

            {sourceType === 'snapshot' && (
              <FormField label="Volume snapshot" required error={sourceError}>
                <Dropdown.Select
                  placeholder="Search snapshots by attributes"
                  value={selectedSnapshot}
                  onChange={(v) => {
                    setSelectedSnapshot(String(v));
                    setSourceError('');
                  }}
                >
                  {SNAPSHOT_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </FormField>
            )}
          </div>
        </Fieldset>

        <Fieldset legend="Configuration" variant="bordered">
          <div className="flex flex-col gap-5">
            {sourceType === 'snapshot' && (
              <>
                <p className="text-12 leading-18 text-text-muted italic m-0">Volume snapshot</p>
                <FormField
                  label="Volume type"
                  required
                  description="Automatically set to the volume type of the source volume used to create the snapshot."
                >
                  <div className="rounded-md bg-surface-muted px-4 py-2 text-12 leading-18 text-text">
                    {selectedSnapshot ? resolvedVolumeTypeLabel : '_DEFAULT_'}
                  </div>
                </FormField>
              </>
            )}

            {showVolumeTypeTable && (
              <>
                <p className="text-12 leading-18 text-text-muted italic m-0">
                  Blank source or image
                </p>
                <FormField
                  label="Volume type"
                  required
                  error={volumeTypeError}
                  description="Select the volume type that determines performance characteristics for the volume."
                >
                  <Dropdown.Select
                    placeholder="Search volume types by attributes"
                    value={volumeTypeId}
                    onChange={(v) => {
                      setVolumeTypeId(String(v));
                      setVolumeTypeError('');
                    }}
                  >
                    {VOLUME_TYPE_OPTIONS.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>
              </>
            )}

            <FormField
              label="Volume type capacity"
              required
              description={
                sourceType === 'snapshot'
                  ? 'Defines the size of the volume. Depending on the selected source, a minimum required size may apply.'
                  : 'Defines the size of the volume. Depending on the selected source, and minimum required size may apply.'
              }
              hint={capacityHint}
            >
              <NumberInput
                min={1}
                max={capacityMax}
                value={volumeCapacity}
                onChange={(v) => setVolumeCapacity(v)}
                suffix="GiB"
                size="md"
              />
            </FormField>
          </div>
        </Fieldset>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          appearance="outline"
          variant="secondary"
          size="md"
          onClick={() => navigate('/compute/volumes')}
        >
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={handleCreate}>
          Create
        </Button>
      </div>
    </div>
  );
}
