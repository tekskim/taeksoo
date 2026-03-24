import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Fieldset } from '@shared/components/Fieldset';

const IMAGE_OPTIONS = [
  { value: 'img-ubuntu-2404', label: 'Ubuntu 24.04 LTS' },
  { value: 'img-rocky-9', label: 'Rocky Linux 9' },
  { value: 'img-debian-12', label: 'Debian 12' },
];

const FLAVOR_OPTIONS = [
  { value: 'flv-001', label: 'm1.small (1 vCPU, 2 GiB)' },
  { value: 'flv-002', label: 'm1.medium (2 vCPU, 4 GiB)' },
  { value: 'flv-003', label: 'c1.xlarge (8 vCPU, 16 GiB)' },
];

const NETWORK_OPTIONS = [
  { value: 'net-private', label: 'private-net (10.0.0.0/24)' },
  { value: 'net-public', label: 'public-net' },
  { value: 'net-db', label: 'db-backend-net' },
];

const KEY_PAIR_OPTIONS = [
  { value: 'kp-001', label: 'prod-deploy' },
  { value: 'kp-002', label: 'dev-laptop' },
  { value: 'kp-003', label: 'ci-runner-key' },
];

const SECURITY_GROUP_OPTIONS = [
  { value: 'sg-default', label: 'default' },
  { value: 'sg-web', label: 'sg-web-tier' },
  { value: 'sg-db', label: 'sg-database' },
];

export function ComputeCreateInstancePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [flavor, setFlavor] = useState('');
  const [network, setNetwork] = useState('');
  const [keyPair, setKeyPair] = useState('');
  const [securityGroup, setSecurityGroup] = useState('');
  const [count, setCount] = useState(1);

  const handleCreate = () => {
    navigate('/compute/instances');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between h-8">
        <Title title="Create instance" />
        <Button appearance="ghost" variant="secondary" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Fieldset
        legend="Instance configuration"
        description="Choose image, flavor, and network settings for the new instance."
        variant="bordered"
      >
        <div className="flex flex-col gap-5 max-w-[560px]">
          <FormField label="Name" required hint="2–64 characters">
            <Input
              placeholder="e.g. app-server-01"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField label="Image" required>
            <Dropdown.Select
              placeholder="Select image"
              value={image}
              onChange={(v) => setImage(String(v))}
            >
              {IMAGE_OPTIONS.map((o) => (
                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField label="Flavor" required>
            <Dropdown.Select
              placeholder="Select flavor"
              value={flavor}
              onChange={(v) => setFlavor(String(v))}
            >
              {FLAVOR_OPTIONS.map((o) => (
                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField label="Network" required>
            <Dropdown.Select
              placeholder="Select network"
              value={network}
              onChange={(v) => setNetwork(String(v))}
            >
              {NETWORK_OPTIONS.map((o) => (
                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField label="Key pair" required>
            <Dropdown.Select
              placeholder="Select key pair"
              value={keyPair}
              onChange={(v) => setKeyPair(String(v))}
            >
              {KEY_PAIR_OPTIONS.map((o) => (
                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField label="Security group" required>
            <Dropdown.Select
              placeholder="Select security group"
              value={securityGroup}
              onChange={(v) => setSecurityGroup(String(v))}
            >
              {SECURITY_GROUP_OPTIONS.map((o) => (
                <Dropdown.Option key={o.value} value={o.value} label={o.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          <FormField label="Count" hint="Number of instances to create (1–10)">
            <NumberInput min={1} max={10} step={1} value={count} onChange={setCount} size="md" />
          </FormField>
        </div>
      </Fieldset>

      <div className="flex items-center justify-end gap-2">
        <Button appearance="outline" variant="secondary" size="md" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={handleCreate}>
          Create
        </Button>
      </div>
    </div>
  );
}
