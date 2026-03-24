import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Button } from '@shared/components/Button';

export function ComputeCreateImagePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageSource, setImageSource] = useState('file');
  const [format, setFormat] = useState('qcow2');
  const [minDisk, setMinDisk] = useState(10);
  const [minRam, setMinRam] = useState(512);
  const [visibility, setVisibility] = useState('private');

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create image" />

      <div className="flex flex-col gap-5 max-w-[560px]">
        <FormField label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter image name"
          />
        </FormField>

        <FormField label="Description">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </FormField>

        <FormField label="Image source" required>
          <Dropdown.Select value={imageSource} onChange={(v) => setImageSource(String(v))}>
            <Dropdown.Option value="file" label="File" />
            <Dropdown.Option value="url" label="URL" />
          </Dropdown.Select>
        </FormField>

        <FormField label="Format" required>
          <Dropdown.Select value={format} onChange={(v) => setFormat(String(v))}>
            <Dropdown.Option value="raw" label="raw" />
            <Dropdown.Option value="qcow2" label="qcow2" />
            <Dropdown.Option value="vhd" label="vhd" />
          </Dropdown.Select>
        </FormField>

        <FormField label="Min disk (GiB)" required>
          <NumberInput min={1} value={minDisk} onChange={setMinDisk} suffix="GiB" />
        </FormField>

        <FormField label="Min RAM (MiB)" required>
          <NumberInput min={128} step={128} value={minRam} onChange={setMinRam} suffix="MiB" />
        </FormField>

        <FormField label="Visibility" required>
          <Dropdown.Select value={visibility} onChange={(v) => setVisibility(String(v))}>
            <Dropdown.Option value="public" label="Public" />
            <Dropdown.Option value="private" label="Private" />
          </Dropdown.Select>
        </FormField>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            onClick={() => navigate('/compute/images')}
          >
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/compute/images')}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
