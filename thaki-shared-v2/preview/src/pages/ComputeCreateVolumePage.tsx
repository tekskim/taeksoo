import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Button } from '@shared/components/Button';

export function ComputeCreateVolumePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState(100);
  const [volumeType, setVolumeType] = useState('SSD');
  const [source, setSource] = useState('empty');

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create volume" />

      <div className="flex flex-col gap-5 max-w-[560px]">
        <FormField label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter volume name"
          />
        </FormField>

        <FormField label="Description">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </FormField>

        <FormField label="Size" required>
          <NumberInput min={1} value={size} onChange={setSize} suffix="GiB" />
        </FormField>

        <FormField label="Type" required>
          <Dropdown.Select value={volumeType} onChange={(v) => setVolumeType(String(v))}>
            <Dropdown.Option value="SSD" label="SSD" />
            <Dropdown.Option value="NVMe" label="NVMe" />
            <Dropdown.Option value="HDD" label="HDD" />
          </Dropdown.Select>
        </FormField>

        <FormField label="Source" required>
          <Dropdown.Select value={source} onChange={(v) => setSource(String(v))}>
            <Dropdown.Option value="empty" label="Empty" />
            <Dropdown.Option value="image" label="Image" />
            <Dropdown.Option value="snapshot" label="Snapshot" />
          </Dropdown.Select>
        </FormField>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            onClick={() => navigate('/compute/volumes')}
          >
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/compute/volumes')}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
