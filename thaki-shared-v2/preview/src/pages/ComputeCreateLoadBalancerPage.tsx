import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Button } from '@shared/components/Button';

export function ComputeCreateLoadBalancerPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState('amphora');
  const [vipNetwork, setVipNetwork] = useState('net-001');
  const [vipSubnet, setVipSubnet] = useState('subnet-a');

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create load balancer" />

      <div className="flex flex-col gap-5 max-w-[560px]">
        <FormField label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter load balancer name"
          />
        </FormField>

        <FormField label="Description">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </FormField>

        <FormField label="Provider" required>
          <Dropdown.Select value={provider} onChange={(v) => setProvider(String(v))}>
            <Dropdown.Option value="amphora" label="Amphora" />
            <Dropdown.Option value="ovn" label="OVN" />
          </Dropdown.Select>
        </FormField>

        <FormField label="VIP network" required>
          <Dropdown.Select value={vipNetwork} onChange={(v) => setVipNetwork(String(v))}>
            <Dropdown.Option value="net-001" label="prod-vpc-main" />
            <Dropdown.Option value="net-002" label="shared-services" />
            <Dropdown.Option value="net-003" label="edge-uplink" />
          </Dropdown.Select>
        </FormField>

        <FormField label="VIP subnet" required>
          <Dropdown.Select value={vipSubnet} onChange={(v) => setVipSubnet(String(v))}>
            <Dropdown.Option value="subnet-a" label="subnet-a (10.0.1.0/24)" />
            <Dropdown.Option value="subnet-b" label="subnet-b (10.0.2.0/24)" />
            <Dropdown.Option value="svc-subnet" label="svc-subnet (172.16.0.0/20)" />
          </Dropdown.Select>
        </FormField>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            onClick={() => navigate('/compute/load-balancers')}
          >
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/compute/load-balancers')}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
