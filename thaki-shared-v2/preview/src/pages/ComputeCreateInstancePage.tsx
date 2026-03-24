import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCirclePlus, IconX } from '@tabler/icons-react';
import { Button } from '@shared/components/Button';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Fieldset } from '@shared/components/Fieldset';
import { Toggle } from '@shared/components/Toggle';
import { Checkbox } from '@shared/components/Checkbox';
import { Tabs, Tab } from '@shared/components/Tabs';
import { RadioGroup } from '@shared/components/RadioGroup';
import { Textarea } from '@shared/components/Textarea';

const AZ_OPTIONS = [
  { value: 'nova', label: 'nova' },
  { value: 'nova-2', label: 'nova-2' },
  { value: 'nova-3', label: 'nova-3' },
];

const STORAGE_TYPE_OPTIONS = [
  { value: '_DEFAULT_', label: '_DEFAULT_' },
  { value: 'ssd', label: 'SSD' },
  { value: 'hdd', label: 'HDD' },
];

const IMAGE_OPTIONS = [
  { value: 'e920j30d', label: 'ubuntu-24.04-tk-base (24.04)' },
  { value: 'e920j35d', label: 'ubuntu-22.04-tk-base (22.04)' },
  { value: 'e920j37d', label: 'windows-server-2022 (2022)' },
  { value: 'e920j39d', label: 'rocky-9.3-tk-base (9.3)' },
];

const SNAPSHOT_OPTIONS = [
  { value: 's1', label: 'newsnapshot' },
  { value: 's2', label: 'web-backup' },
  { value: 's3', label: 'db-snapshot' },
];

const VOLUME_OPTIONS = [
  { value: 'v1', label: 'boot-volume-01 (50 GiB)' },
  { value: 'v2', label: 'boot-volume-02 (100 GiB)' },
];

const FLAVOR_OPTIONS_CPU = [
  { value: '45hgf456', label: 't2.micro — 2 vCPU, 2GiB' },
  { value: '17kfj123', label: 'm5.large — 2 vCPU, 2GiB' },
  { value: '23hgf234', label: 'r5.2xlarge — 2 vCPU, 2GiB' },
];

const NETWORK_OPTIONS = [
  { value: 'd32059d1', label: 'd32059d1(internal-01) — 192.168.1.0/24' },
  { value: 'd32059d3', label: 'd32059d3(internal-03) — 10.0.0.0/16' },
  { value: 'd32059d4', label: 'd32059d4(external-net) — 10.7.60.0/24' },
];

const VLAN_NETWORK_OPTIONS = [
  { value: 'network-1', label: 'network' },
  { value: 'network-2', label: 'internal-01' },
  { value: 'network-3', label: 'external-net' },
];

const VLAN_SUBNET_OPTIONS = [
  { value: 'subnet-1', label: 'subnet' },
  { value: 'subnet-2', label: '10.0.0.0/24' },
  { value: 'subnet-3', label: '192.168.1.0/24' },
];

const VLAN_ASSIGN_OPTIONS = [
  { value: 'Auto-assign', label: 'Auto-assign' },
  { value: 'Manual', label: 'Manual' },
];

const SG_OPTIONS = [
  { id: 'sg1', label: 'default' },
  { id: 'sg2', label: 'suite-default' },
  { id: 'sg3', label: 'web-sg' },
  { id: 'sg4', label: 'db-sg' },
];

const PORT_OPTIONS = [
  { value: 'port1', label: 'internal-02' },
  { value: 'port2', label: 'internal-03' },
  { value: 'port3', label: 'web-port' },
];

const FIP_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'auto', label: 'Auto-assign from pool' },
  { value: 'existing', label: 'Use existing floating IP' },
];

const POOL_OPTIONS = [
  { value: 'pool1', label: 'provider2041' },
  { value: 'pool2', label: 'provider2042' },
];

const EXISTING_FIP_OPTIONS = [
  { value: 'fip1', label: '10.7.60.134 (internal-02)' },
  { value: 'fip2', label: '10.7.60.135 (internal-03)' },
];

const KEY_PAIR_OPTIONS = [
  { value: 'kp1', label: 'dev-keypair' },
  { value: 'kp2', label: 'prod-keypair' },
  { value: 'kp3', label: 'staging-keypair' },
];

const SERVER_GROUP_OPTIONS = [
  { value: 'sg-anti-1', label: 'anti-affinity-group' },
  { value: 'sg-soft-1', label: 'soft-anti-affinity' },
];

const MAX_TAGS = 10;

type DataDiskRow = { id: string; type: string; size: number; deleteWithInstance: boolean };

export function ComputeCreateInstancePage() {
  const navigate = useNavigate();

  const [resourceType, setResourceType] = useState<'vm' | 'baremetal'>('vm');
  const [instanceName, setInstanceName] = useState('');
  const [description, setDescription] = useState('');
  const [availabilityZone, setAvailabilityZone] = useState('');
  const [numberOfInstances, setNumberOfInstances] = useState(1);

  const [sourceTab, setSourceTab] = useState<'image' | 'snapshot' | 'volume'>('image');
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [createSystemDisk, setCreateSystemDisk] = useState(true);
  const [storageType, setStorageType] = useState('_DEFAULT_');
  const [storageSize, setStorageSize] = useState(30);
  const [deleteWithInstance, setDeleteWithInstance] = useState(true);
  const [dataDisks, setDataDisks] = useState<DataDiskRow[]>([
    { id: crypto.randomUUID(), type: '_DEFAULT_', size: 10, deleteWithInstance: true },
  ]);

  const [flavorCategory, setFlavorCategory] = useState<'cpu' | 'gpu' | 'npu'>('cpu');
  const [flavorId, setFlavorId] = useState('');

  const [networkScopeTab, setNetworkScopeTab] = useState<'current-tenant' | 'shared' | 'external'>(
    'current-tenant'
  );
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [vlanNetwork, setVlanNetwork] = useState('');
  const [vlanSubnet, setVlanSubnet] = useState('');
  const [vlanAssign, setVlanAssign] = useState('Auto-assign');
  const [selectedSgs, setSelectedSgs] = useState<string[]>([]);
  const [portId, setPortId] = useState('__none__');
  const [floatingIpOption, setFloatingIpOption] = useState('none');
  const [floatingPool, setFloatingPool] = useState('');
  const [existingFip, setExistingFip] = useState('');

  const [loginTab, setLoginTab] = useState<'keypair' | 'password'>('keypair');
  const [keyPairId, setKeyPairId] = useState('');
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [tags, setTags] = useState<{ id: string; key: string; value: string }[]>([]);
  const [serverGroupId, setServerGroupId] = useState('__none__');
  const [userData, setUserData] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sourceOptions = useMemo(() => {
    if (sourceTab === 'image') return IMAGE_OPTIONS;
    if (sourceTab === 'snapshot') return SNAPSHOT_OPTIONS;
    return VOLUME_OPTIONS;
  }, [sourceTab]);

  const toggleNetwork = (id: string) => {
    setSelectedNetworks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSg = (id: string) => {
    setSelectedSgs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!instanceName.trim()) e.instanceName = 'Please enter an instance name.';
    if (!availabilityZone) e.az = 'Please select an availability zone.';
    if (!selectedSourceId) e.source = 'Please select a start source.';
    if (!flavorId) e.flavor = 'Please select a flavor.';
    if (selectedNetworks.length === 0) e.network = 'Please select a network.';
    if (selectedSgs.length === 0) e.sg = 'Please select a security group.';
    if (loginTab === 'keypair' && !keyPairId) e.keypair = 'Please select a key pair.';
    if (loginTab === 'password' && password && password !== confirmPassword) {
      e.password = 'Passwords do not match.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    navigate('/compute/instances');
  };

  const addDataDisk = () => {
    setDataDisks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: '_DEFAULT_', size: 10, deleteWithInstance: true },
    ]);
  };

  const updateDataDisk = (id: string, patch: Partial<DataDiskRow>) => {
    setDataDisks((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const removeDataDisk = (id: string) => {
    setDataDisks((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create instance" />

      <div className="flex flex-col gap-6 max-w-[720px]">
        <Fieldset
          legend="Basic information"
          description="Instance name, availability zone, and launch resource type."
          variant="bordered"
        >
          <div className="flex flex-col gap-5">
            <FormField
              label="Resource type"
              required
              description="Choose the resource category to apply to the flavor."
            >
              <RadioGroup
                name="resource-type"
                direction="vertical"
                options={[
                  { value: 'vm', label: 'Virtual machine' },
                  { value: 'baremetal', label: 'Bare metal' },
                ]}
                selectedValue={resourceType}
                onChange={(v) => setResourceType(v as 'vm' | 'baremetal')}
              />
            </FormField>

            <FormField
              label="Instance name"
              required
              error={errors.instanceName}
              hint="The name should start with upper letter, lower letter or chinese, and be a string with 1~128 characters."
            >
              <Input
                placeholder="Instance name"
                value={instanceName}
                onChange={(e) => {
                  setInstanceName(e.target.value);
                  setErrors((o) => ({ ...o, instanceName: '' }));
                }}
              />
            </FormField>

            <FormField
              label="Description"
              hint="You can use letters, numbers, and special characters (+=.@-_,()[]), and maximum 255 characters."
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
              error={errors.az}
              hint="Select the availability zone for the instance."
            >
              <Dropdown.Select
                placeholder="Select AZ"
                value={availabilityZone}
                onChange={(v) => {
                  setAvailabilityZone(String(v));
                  setErrors((o) => ({ ...o, az: '' }));
                }}
              >
                {AZ_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>

            <FormField label="Number of Instances" hint="1–10 instances.">
              <NumberInput
                min={1}
                max={10}
                step={1}
                value={numberOfInstances}
                onChange={(v) => setNumberOfInstances(v)}
                size="md"
              />
            </FormField>
          </div>
        </Fieldset>

        <Fieldset
          legend="Source"
          description="OS image, snapshot, or bootable volume and system disk."
          variant="bordered"
        >
          <div className="flex flex-col gap-5">
            <FormField
              label="Start source"
              required
              error={errors.source}
              description="Select a template to launch the instance. You can start from an OS image, a snapshot, or an existing volume."
            >
              <div>
                <Tabs
                  activeTabId={sourceTab}
                  onChange={(id) => {
                    setSourceTab(id as typeof sourceTab);
                    setSelectedSourceId('');
                    setErrors((o) => ({ ...o, source: '' }));
                  }}
                  variant="line"
                  size="sm"
                >
                  <Tab id="image" label="Image">
                    <div className="pt-3" />
                  </Tab>
                  <Tab id="snapshot" label="Instance snapshot">
                    <div className="pt-3" />
                  </Tab>
                  <Tab id="volume" label="Bootable volume">
                    <div className="pt-3" />
                  </Tab>
                </Tabs>
                <div className="mt-3">
                  <Dropdown.Select
                    placeholder={
                      sourceTab === 'image'
                        ? 'Select image'
                        : sourceTab === 'snapshot'
                          ? 'Select snapshot'
                          : 'Select bootable volume'
                    }
                    value={selectedSourceId}
                    onChange={(v) => {
                      setSelectedSourceId(String(v));
                      setErrors((o) => ({ ...o, source: '' }));
                    }}
                  >
                    {sourceOptions.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </div>
              </div>
            </FormField>

            <p className="text-12 leading-18 text-text-muted italic m-0">
              Image, Instance snapshot
            </p>

            <FormField
              label="System disk"
              required
              description="Configure whether to create a system disk for booting."
            >
              <Toggle
                checked={createSystemDisk}
                onChange={(e) => setCreateSystemDisk(e.target.checked)}
                checkedLabel="Create a new system disk"
                uncheckedLabel="Do not create a new system disk"
              />
            </FormField>

            {createSystemDisk && (
              <div className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-surface px-4 py-3">
                <FormField label="Type">
                  <Dropdown.Select value={storageType} onChange={(v) => setStorageType(String(v))}>
                    {STORAGE_TYPE_OPTIONS.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>
                <FormField label="Size">
                  <NumberInput
                    min={1}
                    max={1000}
                    value={storageSize}
                    onChange={(v) => setStorageSize(v)}
                    suffix="GiB"
                    size="md"
                  />
                </FormField>
              </div>
            )}

            <FormField
              label="Delete volume on instance delete"
              description="Selecting this option will remove the source volume when the instance is deleted."
            >
              <Checkbox checked={deleteWithInstance} onChange={setDeleteWithInstance}>
                Delete with instance
              </Checkbox>
            </FormField>

            <div className="flex flex-col gap-2">
              <span className="text-13 font-medium leading-18 text-text">Data disk</span>
              <p className="text-12 leading-18 text-text-muted m-0">
                Attach additional volumes for data storage.
              </p>
              <div className="flex flex-col gap-2">
                {dataDisks.map((disk) => (
                  <div
                    key={disk.id}
                    className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-surface px-4 py-2"
                  >
                    <FormField label="Type">
                      <Dropdown.Select
                        value={disk.type}
                        onChange={(v) => updateDataDisk(disk.id, { type: String(v) })}
                      >
                        {STORAGE_TYPE_OPTIONS.map((o) => (
                          <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                        ))}
                      </Dropdown.Select>
                    </FormField>
                    <FormField label="Size">
                      <NumberInput
                        min={1}
                        max={1000}
                        value={disk.size}
                        onChange={(v) => updateDataDisk(disk.id, { size: v })}
                        suffix="GiB"
                        size="md"
                      />
                    </FormField>
                    <Checkbox
                      checked={disk.deleteWithInstance}
                      onChange={(c) => updateDataDisk(disk.id, { deleteWithInstance: c })}
                    >
                      Deleted with the instance
                    </Checkbox>
                    <button
                      type="button"
                      aria-label="Remove data disk"
                      className="ml-auto flex size-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-hover"
                      onClick={() => removeDataDisk(disk.id)}
                    >
                      <IconX size={16} stroke={1.5} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  appearance="outline"
                  size="sm"
                  type="button"
                  onClick={addDataDisk}
                >
                  <span className="inline-flex items-center gap-1">
                    <IconCirclePlus size={12} />
                    Add Data disk
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Configuration" description="Flavor family and size." variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Flavors"
              required
              error={errors.flavor}
              description="Select a flavor from the list to use for the instance."
            >
              <div>
                <Tabs
                  activeTabId={flavorCategory}
                  onChange={(id) => setFlavorCategory(id as typeof flavorCategory)}
                  variant="line"
                  size="sm"
                >
                  <Tab id="cpu" label="CPU">
                    <div className="pt-3" />
                  </Tab>
                  <Tab id="gpu" label="GPU">
                    <div className="pt-3" />
                  </Tab>
                  <Tab id="npu" label="NPU">
                    <div className="pt-3" />
                  </Tab>
                </Tabs>
                <div className="mt-3">
                  <Dropdown.Select
                    placeholder="Search flavors by attributes"
                    value={flavorId}
                    onChange={(v) => {
                      setFlavorId(String(v));
                      setErrors((o) => ({ ...o, flavor: '' }));
                    }}
                  >
                    {FLAVOR_OPTIONS_CPU.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </div>
              </div>
            </FormField>
          </div>
        </Fieldset>

        <Fieldset
          legend="Network"
          description="Networks, VLAN, security groups, port, floating IP."
          variant="bordered"
        >
          <div className="flex flex-col gap-5">
            <FormField
              label="Network"
              required
              error={errors.network}
              description="Select the networks to attach to the instance."
            >
              <div>
                <Tabs
                  activeTabId={networkScopeTab}
                  onChange={(id) => setNetworkScopeTab(id as typeof networkScopeTab)}
                  variant="line"
                  size="sm"
                >
                  <Tab id="current-tenant" label="Current tenant">
                    <div className="pt-3" />
                  </Tab>
                  <Tab id="shared" label="Shared">
                    <div className="pt-3" />
                  </Tab>
                  <Tab id="external" label="External">
                    <div className="pt-3" />
                  </Tab>
                </Tabs>
                <div className="mt-3 flex flex-col gap-2">
                  {NETWORK_OPTIONS.map((n) => (
                    <Checkbox
                      key={n.value}
                      checked={selectedNetworks.includes(n.value)}
                      onChange={() => toggleNetwork(n.value)}
                    >
                      {n.label}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </FormField>

            <FormField
              label="Virtual LAN"
              description="Each selected network requires at least one Virtual LAN configuration. Each VLAN represents a virtual network card (NIC) attached to the selected network."
            >
              <div className="flex flex-wrap items-center gap-3 rounded-md border border-border px-4 py-2">
                <FormField label="Network">
                  <Dropdown.Select value={vlanNetwork} onChange={(v) => setVlanNetwork(String(v))}>
                    {VLAN_NETWORK_OPTIONS.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>
                <FormField label="Subnet">
                  <Dropdown.Select value={vlanSubnet} onChange={(v) => setVlanSubnet(String(v))}>
                    {VLAN_SUBNET_OPTIONS.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>
                <Dropdown.Select value={vlanAssign} onChange={(v) => setVlanAssign(String(v))}>
                  {VLAN_ASSIGN_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </div>
            </FormField>

            <FormField
              label="Security groups"
              required
              error={errors.sg}
              description="Security groups apply to all networks except ports with security disabled."
            >
              <div className="flex flex-col gap-2">
                {SG_OPTIONS.map((sg) => (
                  <Checkbox
                    key={sg.id}
                    checked={selectedSgs.includes(sg.id)}
                    onChange={() => toggleSg(sg.id)}
                  >
                    {sg.label}
                  </Checkbox>
                ))}
              </div>
            </FormField>

            <FormField label="Port">
              <Dropdown.Select
                placeholder="Search floating IP by attributes"
                value={portId}
                onChange={(v) => setPortId(String(v))}
              >
                {[
                  <Dropdown.Option key="__none__" value="__none__" label="—" />,
                  ...PORT_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  )),
                ]}
              </Dropdown.Select>
            </FormField>

            <FormField label="Floating IP">
              <Dropdown.Select
                value={floatingIpOption}
                onChange={(v) => setFloatingIpOption(String(v))}
              >
                {FIP_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>
            {floatingIpOption === 'auto' && (
              <FormField label="Floating IP pool">
                <Dropdown.Select value={floatingPool} onChange={(v) => setFloatingPool(String(v))}>
                  {POOL_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </FormField>
            )}
            {floatingIpOption === 'existing' && (
              <FormField label="Existing floating IP">
                <Dropdown.Select value={existingFip} onChange={(v) => setExistingFip(String(v))}>
                  {EXISTING_FIP_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </FormField>
            )}
          </div>
        </Fieldset>

        <Fieldset
          legend="Security"
          description="Authentication (matches TDS Authentication section)."
          variant="bordered"
        >
          <div className="flex flex-col gap-5">
            <FormField
              label="Login type"
              description="Select the authentication method for accessing your instance. You can choose either the Key Pair method or the Password method."
            >
              <div>
                <Tabs
                  activeTabId={loginTab}
                  onChange={(id) => setLoginTab(id as typeof loginTab)}
                  variant="line"
                  size="sm"
                >
                  <Tab id="keypair" label="Key pair">
                    <div className="pt-3 flex flex-col gap-4">
                      <FormField label="Key pair" required error={errors.keypair}>
                        <Dropdown.Select
                          placeholder="Search key pair by attributes"
                          value={keyPairId}
                          onChange={(v) => {
                            setKeyPairId(String(v));
                            setErrors((o) => ({ ...o, keypair: '' }));
                          }}
                        >
                          {KEY_PAIR_OPTIONS.map((o) => (
                            <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                          ))}
                        </Dropdown.Select>
                      </FormField>
                    </div>
                  </Tab>
                  <Tab id="password" label="Password">
                    <div className="pt-3 flex flex-col gap-4">
                      <FormField
                        label="Login Name"
                        hint="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
                      >
                        <Input
                          placeholder="Enter login name"
                          value={loginName}
                          onChange={(e) => setLoginName(e.target.value)}
                        />
                      </FormField>
                      <FormField
                        label="Password"
                        error={errors.password}
                        hint={
                          'You must use a mix of at least 3 types (uppercase/lowercase letters, numbers, special characters), and the length must be between 8-32 characters. Note that your Login Name, spaces, and specific symbols (" \' < > & \\ |) are not allowed.'
                        }
                      >
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((o) => ({ ...o, password: '' }));
                          }}
                        />
                      </FormField>
                      <FormField label="Confirm password">
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors((o) => ({ ...o, password: '' }));
                          }}
                        />
                      </FormField>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </FormField>
          </div>
        </Fieldset>

        <Fieldset
          legend="Advanced"
          description="Tags, server group, and user data."
          variant="bordered"
        >
          <div className="flex flex-col gap-5">
            <FormField
              label="Tags"
              description={`A tag consists of a Key that defines the resource category and a Value that describes it. Each resource can have up to ${MAX_TAGS} tags.`}
            >
              <div className="flex flex-col gap-2">
                {tags.map((t) => (
                  <div key={t.id} className="flex gap-2 items-center text-12 text-text-muted">
                    <span className="font-medium text-text">{t.key}</span>=<span>{t.value}</span>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                  <Input
                    placeholder="Enter key"
                    value={tagKey}
                    onChange={(e) => setTagKey(e.target.value)}
                  />
                  <Input
                    placeholder="Enter value"
                    value={tagValue}
                    onChange={(e) => setTagValue(e.target.value)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={tags.length >= MAX_TAGS}
                    onClick={() => {
                      if (!tagKey.trim()) return;
                      setTags((prev) => [
                        ...prev,
                        { id: crypto.randomUUID(), key: tagKey.trim(), value: tagValue.trim() },
                      ]);
                      setTagKey('');
                      setTagValue('');
                    }}
                  >
                    Add tag
                  </Button>
                </div>
                <span className="text-11 text-text-muted">
                  {tags.length} / {MAX_TAGS} tags
                </span>
              </div>
            </FormField>

            <FormField
              label="Server group"
              description="A server group controls the physical placement of instances. You can place instances together on the same host or spread them across different hosts."
            >
              <Dropdown.Select
                placeholder="Search server group by attributes"
                value={serverGroupId}
                onChange={(v) => setServerGroupId(String(v))}
              >
                {[
                  <Dropdown.Option key="__none__" value="__none__" label="—" />,
                  ...SERVER_GROUP_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  )),
                ]}
              </Dropdown.Select>
            </FormField>

            <FormField label="User data">
              <div>
                <Button variant="secondary" size="sm" type="button">
                  Choose file
                </Button>
                <Textarea
                  className="mt-2"
                  placeholder="input user data"
                  rows={6}
                  value={userData}
                  onChange={(e) => setUserData(e.target.value)}
                />
              </div>
            </FormField>
          </div>
        </Fieldset>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          appearance="outline"
          variant="secondary"
          size="md"
          onClick={() => navigate('/compute/instances')}
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
