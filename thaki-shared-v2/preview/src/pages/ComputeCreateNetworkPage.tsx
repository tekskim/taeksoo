import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Button } from '@shared/components/Button';

export function ComputeCreateNetworkPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [shared, setShared] = useState(false);
  const [external, setExternal] = useState(false);
  const [adminUp, setAdminUp] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create network" />

      <div className="flex flex-col gap-5 max-w-[560px]">
        <FormField label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter network name"
          />
        </FormField>

        <FormField label="Description">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </FormField>

        <FormField
          label="Shared"
          description="Allow other projects to attach ports to this network."
        >
          <Toggle
            checked={shared}
            onChange={(e) => setShared(e.target.checked)}
            checkedLabel="On"
            uncheckedLabel="Off"
          />
        </FormField>

        <FormField label="External" description="Provider external network.">
          <Toggle
            checked={external}
            onChange={(e) => setExternal(e.target.checked)}
            checkedLabel="On"
            uncheckedLabel="Off"
          />
        </FormField>

        <FormField label="Admin state" description="Administrative state of the network.">
          <Toggle
            checked={adminUp}
            onChange={(e) => setAdminUp(e.target.checked)}
            checkedLabel="UP"
            uncheckedLabel="DOWN"
          />
        </FormField>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            onClick={() => navigate('/compute/networks')}
          >
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/compute/networks')}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
