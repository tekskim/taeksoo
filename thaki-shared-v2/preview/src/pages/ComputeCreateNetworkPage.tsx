import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Fieldset } from '@shared/components/Fieldset';
import { Button } from '@shared/components/Button';
import { Textarea } from '@shared/components/Textarea';

export function ComputeCreateNetworkPage() {
  const navigate = useNavigate();

  const [networkName, setNetworkName] = useState('');
  const [description, setDescription] = useState('');
  const [adminState, setAdminState] = useState(true);
  const [portSecurity, setPortSecurity] = useState(true);
  const [mtu, setMtu] = useState(1500);

  const [createSubnet, setCreateSubnet] = useState(true);
  const [subnetName, setSubnetName] = useState('');
  const [cidr, setCidr] = useState('');
  const [gateway, setGateway] = useState(true);
  const [gatewayIp, setGatewayIp] = useState('');
  const [dhcp, setDhcp] = useState(true);
  const [allocationPools, setAllocationPools] = useState('');
  const [dns, setDns] = useState('');
  const [hostRoutes, setHostRoutes] = useState('');

  const [networkNameError, setNetworkNameError] = useState('');
  const [cidrError, setCidrError] = useState('');

  const handleCreate = () => {
    let ok = true;
    if (!networkName.trim()) {
      setNetworkNameError('Please enter a network name.');
      ok = false;
    } else setNetworkNameError('');
    if (createSubnet && !cidr.trim()) {
      setCidrError('Please enter a CIDR.');
      ok = false;
    } else setCidrError('');
    if (!ok) return;
    navigate('/compute/networks');
  };

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create network" />

      <div className="flex flex-col gap-6 max-w-[720px]">
        <Fieldset legend="Basic information" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Network name"
              required
              error={networkNameError}
              hint='Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"'
            >
              <Input
                placeholder="Enter network name"
                value={networkName}
                onChange={(e) => {
                  setNetworkName(e.target.value);
                  setNetworkNameError('');
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

            <div className="rounded-md border border-border bg-surface-muted px-4 py-3">
              <span className="text-13 font-medium text-text block mb-3">Advanced</span>
              <div className="flex flex-col gap-5">
                <FormField
                  label="Admin state"
                  description="Indicates whether the load balancer's administrative state is Up or Down."
                >
                  <Toggle
                    checked={adminState}
                    onChange={(e) => setAdminState(e.target.checked)}
                    checkedLabel="Up"
                    uncheckedLabel="Down"
                  />
                </FormField>

                <FormField
                  label="Port security"
                  description="Enhances security by allowing only permitted devices to access this network. It is recommended to keep this enabled in most cases."
                >
                  <Toggle
                    checked={portSecurity}
                    onChange={(e) => setPortSecurity(e.target.checked)}
                    checkedLabel="On"
                    uncheckedLabel="Off"
                  />
                </FormField>

                <FormField
                  label="MTU"
                  description="Specifies the MTU value used by the network."
                  hint="68 - 65535 bytes"
                >
                  <div className="flex items-center gap-2">
                    <NumberInput
                      min={68}
                      max={65535}
                      value={mtu}
                      onChange={(v) => setMtu(v)}
                      size="md"
                    />
                    <span className="text-12 text-text">bytes</span>
                  </div>
                </FormField>
              </div>
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Subnet" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField label="Create subnet">
              <Toggle
                checked={createSubnet}
                onChange={(e) => setCreateSubnet(e.target.checked)}
                checkedLabel="Yes"
                uncheckedLabel="No"
              />
            </FormField>

            {createSubnet && (
              <>
                <FormField
                  label="Subnet name"
                  required
                  hint="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
                >
                  <Input
                    placeholder="e.g. private-net-subnet-001"
                    value={subnetName}
                    onChange={(e) => setSubnetName(e.target.value)}
                  />
                </FormField>

                <FormField
                  label="CIDR"
                  required
                  error={cidrError}
                  description="Defines the network address (CIDR) for the subnet."
                >
                  <Input
                    placeholder="e.g. 192.168.0.0/24"
                    value={cidr}
                    onChange={(e) => {
                      setCidr(e.target.value);
                      setCidrError('');
                    }}
                  />
                </FormField>

                <FormField
                  label="Gateway"
                  required
                  description="Specifies the gateway IP address for the subnet. Gateway must be an IP address within the subnet range, excluding the network and broadcast addresses."
                >
                  <div className="flex flex-col gap-3">
                    <Toggle
                      checked={gateway}
                      onChange={(e) => setGateway(e.target.checked)}
                      checkedLabel="On"
                      uncheckedLabel="Off"
                    />
                    {gateway && (
                      <Input
                        placeholder="e.g. 192.168.0.1"
                        value={gatewayIp}
                        onChange={(e) => setGatewayIp(e.target.value)}
                      />
                    )}
                  </div>
                </FormField>

                <div className="rounded-md border border-border bg-surface-muted px-4 py-3">
                  <span className="text-13 font-medium text-text block mb-3">Advanced</span>
                  <div className="flex flex-col gap-5">
                    <FormField label="DHCP">
                      <Toggle
                        checked={dhcp}
                        onChange={(e) => setDhcp(e.target.checked)}
                        checkedLabel="Enabled"
                        uncheckedLabel="Disabled"
                      />
                    </FormField>

                    <FormField
                      label="Allocation pools"
                      description="Manually define the range of IP addresses to be automatically allocated by DHCP. IPs outside this range will not be allocated, which is useful for reserving static IPs."
                      hint="Enter one IP address allocation range per line."
                    >
                      <Textarea
                        placeholder="e.g. 192.168.0.100,192.168.0.200"
                        rows={3}
                        value={allocationPools}
                        onChange={(e) => setAllocationPools(e.target.value)}
                      />
                    </FormField>

                    <FormField
                      label="DNS"
                      description="The address of the server that acts like a phonebook for the internet, translating domain names into IP addresses for your instances."
                      hint="Enter one DNS server address per line."
                    >
                      <Textarea
                        placeholder="e.g. 10.10.0.0/24,192.168.0.254"
                        rows={3}
                        value={dns}
                        onChange={(e) => setDns(e.target.value)}
                      />
                    </FormField>

                    <FormField
                      label="Host routes"
                      description="An advanced feature for manually specifying a route to a specific network destination."
                      hint="Enter the destination CIDR and the next hop IP address."
                    >
                      <Textarea
                        placeholder="e.g. 10.10.0.0/24,192.168.0.254"
                        rows={3}
                        value={hostRoutes}
                        onChange={(e) => setHostRoutes(e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>
              </>
            )}
          </div>
        </Fieldset>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          appearance="outline"
          variant="secondary"
          size="md"
          onClick={() => navigate('/compute/networks')}
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
