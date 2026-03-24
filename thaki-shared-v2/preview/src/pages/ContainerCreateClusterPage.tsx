import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconX, IconCirclePlus, IconHelpCircle } from '@tabler/icons-react';
import { Button } from '@shared/components/Button';
import { Input, NumberInput } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Disclosure } from '@shared/components/Disclosure';
import { Range } from '@shared/components/Range';
import { Title } from '@shared/components/Title';
import { Tooltip } from '@shared/components/Tooltip';
import { Select } from '../components/TdsSelectCompat';
import { RadioGroup, Radio } from '../components/TdsRadioCompat';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface NetworkRow {
  id: string;
  name: string;
  subnetCidr: string;
}

interface FlavorRow {
  id: string;
  name: string;
  vcpu: number;
  ram: string;
  disk: string;
}

interface KeyPairRow {
  id: string;
  name: string;
  fingerprint: string;
}

interface Label {
  id: string;
  key: string;
  value: string;
}

interface Annotation {
  id: string;
  key: string;
  value: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const kubernetesVersionOptions = [
  { value: 'v1.34', label: 'v1.34' },
  { value: 'v1.33', label: 'v1.33' },
  { value: 'v1.32', label: 'v1.32' },
];

const containerNetworkOptions = [
  { value: 'kube-ovn', label: 'Kube OVN' },
  { value: 'calico', label: 'Calico' },
  { value: 'flannel', label: 'Flannel' },
];

const tenantOptions = [
  { value: 'tenant-a', label: 'Tenant_A' },
  { value: 'tenant-b', label: 'Tenant_B' },
  { value: 'tenant-c', label: 'Tenant_C' },
];

const mockExternalNetworks: NetworkRow[] = [
  { id: 'ext-01', name: 'ext-01', subnetCidr: '10.70.62.120/91 +9' },
  { id: 'ext-02', name: 'ext-02', subnetCidr: '102.68.8.0.0/4 0 +5' },
  { id: 'ext-03', name: 'ext-03', subnetCidr: '40.068.43.0/4 1 +5' },
  { id: 'ext-04', name: 'ext-04', subnetCidr: '102.68.19.0/2 3' },
  { id: 'ext-05', name: 'ext-05', subnetCidr: '102.70.8.0.0/4 8' },
  { id: 'ext-06', name: 'ext-06', subnetCidr: '10.17.84.01.1/4 8' },
];

const mockTenantNetworks: NetworkRow[] = [
  { id: 'net-01', name: 'net-01', subnetCidr: '10.70.62.120/91 +9' },
  { id: 'net-02', name: 'net-02', subnetCidr: '102.68.8.0.0/4 0 +5' },
  { id: 'net-03', name: 'net-03', subnetCidr: '40.068.43.0/4 1 +5' },
  { id: 'net-04', name: 'net-04', subnetCidr: '102.68.19.0/2 3' },
  { id: 'net-05', name: 'net-05', subnetCidr: '102.70.8.0.0/4 8' },
];

const subnetOptions = [
  { value: 'subnet-01', label: 'Subnet - subnet' },
  { value: 'subnet-02', label: 'Subnet - subnet-2' },
];

const mockFlavors: FlavorRow[] = [
  { id: 'th-tiny', name: 'th.tiny', vcpu: 1, ram: '2.0 GiB', disk: '10.0 GiB' },
  { id: 'th-small', name: 'th.small', vcpu: 2, ram: '4.0 GiB', disk: '20.0 GiB' },
  { id: 'th-medium', name: 'th.medium', vcpu: 4, ram: '8.0 GiB', disk: '40.0 GiB' },
  { id: 'th-large', name: 'th.large', vcpu: 8, ram: '16.0 GiB', disk: '80.0 GiB' },
  { id: 'th-xlarge', name: 'th.xlarge', vcpu: 16, ram: '32.0 GiB', disk: '160.0 GiB' },
];

const imageOptions = [
  { value: 'ubuntu-24.04-tk-base', label: 'ubuntu_24.04_tk_base' },
  { value: 'ubuntu-22.04-tk-base', label: 'ubuntu_22.04_tk_base' },
  { value: 'rocky-9-tk-base', label: 'rocky_9_tk_base' },
];

const mockKeyPairs: KeyPairRow[] = [
  {
    id: 'kp-1',
    name: 'dev-keypair',
    fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf',
  },
  {
    id: 'kp-2',
    name: 'dev-keypair',
    fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf',
  },
  {
    id: 'kp-3',
    name: 'dev-keypair',
    fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf',
  },
  {
    id: 'kp-4',
    name: 'dev-keypair',
    fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf',
  },
  {
    id: 'kp-5',
    name: 'dev-keypair',
    fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf',
  },
  {
    id: 'kp-6',
    name: 'dev-keypair',
    fingerprint: 'c7:a0:ab:68:73:4d:eb:e2:13:35:d0:fd:c7:a6:88:cf',
  },
];

const EXTERNAL_NETWORK_OPTIONS = mockExternalNetworks.map((n) => ({
  value: n.id,
  label: `${n.name} — ${n.subnetCidr}`,
}));

const TENANT_NETWORK_OPTIONS = mockTenantNetworks.map((n) => ({
  value: n.id,
  label: `${n.name} — ${n.subnetCidr}`,
}));

const FLAVOR_OPTIONS = mockFlavors.map((f) => ({
  value: f.id,
  label: `${f.name} (${f.vcpu} vCPU, ${f.ram})`,
}));

const KEY_PAIR_OPTIONS = mockKeyPairs.map((kp) => ({
  value: kp.id,
  label: `${kp.name} (${kp.id})`,
}));

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ContainerCreateClusterPage() {
  const navigate = useNavigate();
  const isV2 = true;

  // Basic Information
  const [clusterName, setClusterName] = useState('');
  const [kubernetesVersion, setKubernetesVersion] = useState('v1.34');
  const [containerNetwork, setContainerNetwork] = useState('kube-ovn');
  const [tenant, setTenant] = useState('tenant-a');
  const [description, setDescription] = useState('');

  // Networking
  const [selectedExternalNetwork, setSelectedExternalNetwork] = useState<string>('ext-01');
  const [selectedTenantNetwork, setSelectedTenantNetwork] = useState<string>('net-01');
  const [selectedSubnet, setSelectedSubnet] = useState('subnet-01');

  // Node Configuration
  const [nodeType, setNodeType] = useState<'instance' | 'baremetal'>('instance');

  // Control planes
  const [cpImage, setCpImage] = useState('ubuntu-24.04-tk-base');
  const [cpFlavor, setCpFlavor] = useState('th-tiny');
  const [cpNodeCount, setCpNodeCount] = useState(3);
  const [etcdDiskType, setEtcdDiskType] = useState<'external' | 'local'>('external');
  const [etcdVolumeType, setEtcdVolumeType] = useState('ceph');
  const [etcdVolumeSize, setEtcdVolumeSize] = useState(10);

  // Authentication
  const [selectedKeyPair, setSelectedKeyPair] = useState<string>('');
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Worker Nodes
  const [nodeImage, setNodeImage] = useState('ubuntu-24.04-tk-base');
  const [nodeFlavor, setNodeFlavor] = useState('th-tiny');
  const [nodeCount, setNodeCount] = useState(1);

  // Worker Nodes Authentication
  const [workerSelectedKeyPair, setWorkerSelectedKeyPair] = useState<string>('');
  const [workerLoginName, setWorkerLoginName] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');
  const [workerConfirmPassword, setWorkerConfirmPassword] = useState('');

  const [descriptionOpen, setDescriptionOpen] = useState(isV2);

  // Labels & Annotations
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ id: '0', key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ id: '0', key: '', value: '' }] : []
  );

  // Label management
  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  // Annotation management
  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnotation = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }, []);

  const handleCreate = () => {
    console.log('Creating cluster:', {
      clusterName,
      kubernetesVersion,
      containerNetwork,
      tenant,
      description,
      selectedExternalNetwork,
      selectedTenantNetwork,
      selectedSubnet,
      nodeType,
      cpImage,
      cpFlavor,
      cpNodeCount,
      etcdDiskType,
      etcdVolumeType,
      etcdVolumeSize,
      selectedKeyPair,
      loginName,
      password,
      confirmPassword,
      nodeImage,
      nodeFlavor,
      nodeCount,
      workerSelectedKeyPair,
      workerLoginName,
      workerPassword,
      workerConfirmPassword,
      labels,
      annotations,
    });
    navigate('/container/cluster-management');
  };

  const handleCancel = () => {
    navigate('/container/cluster-management');
  };

  return (
    <div className="flex flex-col pt-4 px-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <Title title="Create cluster" size="large" />
        <p className="text-body-md text-[var(--color-text-subtle)]">
          Cluster is a group of machines that work together to run containerized applications with
          automated scaling, scheduling, and management.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="flex gap-6">
        {/* Left Column - Form */}
        <div className="flex-1 flex flex-col gap-[16px]">
          {/* Basic Information */}
          <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
            <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
              <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                Basic information
              </h2>
            </div>
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-6">
                {/* Name */}
                <FormField label="Name" required>
                  <Input
                    placeholder="Enter a unique name"
                    value={clusterName}
                    onChange={(e) => setClusterName(e.target.value)}
                    className="w-full"
                  />
                </FormField>

                {/* Kubernetes Version */}
                <FormField
                  label="Kubernetes version"
                  required
                  description="Select the Kubernetes version to apply to the cluster. Choosing the latest supported version is recommended for improved stability and security unless your application requires a specific older version."
                >
                  <Select
                    options={kubernetesVersionOptions}
                    value={kubernetesVersion}
                    onChange={setKubernetesVersion}
                    fullWidth
                  />
                </FormField>

                {/* Container Network */}
                <FormField
                  label="Container network"
                  required
                  description="Select the container network (CNI) plugin that manages internal cluster traffic."
                >
                  <Select
                    options={containerNetworkOptions}
                    value={containerNetwork}
                    onChange={setContainerNetwork}
                    fullWidth
                  />
                </FormField>

                {/* Tenant */}
                <FormField
                  label="Tenant"
                  required
                  description="Select a tenant to use for your cluster resources."
                >
                  <Select options={tenantOptions} value={tenant} onChange={setTenant} fullWidth />
                </FormField>

                {/* Description */}
                <Disclosure
                  label="Description"
                  expanded={descriptionOpen}
                  onExpandChange={setDescriptionOpen}
                >
                  <div className="pt-2">
                    <Input
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </Disclosure>
              </div>
            </div>
          </div>

          {/* Networking */}
          <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
            <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
              <h2 className="text-heading-h5 text-[var(--color-text-default)]">Networking</h2>
            </div>
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-6">
                {/* External network */}
                <FormField
                  label="External network"
                  required
                  description="Select the external network for outbound access. External networks are created in the user domain for enabling external access for the cluster."
                >
                  <Select
                    options={EXTERNAL_NETWORK_OPTIONS}
                    value={selectedExternalNetwork}
                    onChange={setSelectedExternalNetwork}
                    fullWidth
                  />
                </FormField>

                {/* Tenant network */}
                <FormField
                  label="Tenant network"
                  required
                  description="Select a tenant network for your cluster resources. Only networks with a router open to the external gateway for the selected external network are shown."
                >
                  <Select
                    options={TENANT_NETWORK_OPTIONS}
                    value={selectedTenantNetwork}
                    onChange={setSelectedTenantNetwork}
                    fullWidth
                  />
                </FormField>

                {/* Subnet */}
                <FormField
                  label="Subnet"
                  required
                  description="You can also enter the private IP address for the kubernetes API server. Only subnets connected to a router open to the external gateway for the selected external network are shown."
                >
                  <Select
                    options={subnetOptions}
                    value={selectedSubnet}
                    onChange={setSelectedSubnet}
                    fullWidth
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Node Configuration */}
          <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
            <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
              <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                Node configuration
              </h2>
            </div>
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-6">
                {/* Node Type */}
                <FormField
                  label="Node type"
                  required
                  description="Select the type of nodes to use for your cluster. Instance is used for VM-based clusters and BareMetal is used for physical server clusters."
                >
                  <RadioGroup
                    value={nodeType}
                    onChange={(value) => setNodeType(value as 'instance' | 'baremetal')}
                  >
                    <Radio value="instance" label="Instance" />
                    <Radio value="baremetal" label="BareMetal" />
                  </RadioGroup>
                </FormField>

                {/* Control planes */}
                <div>
                  <h6 className="text-heading-h6 text-[var(--color-text-default)] mb-4">
                    Control planes
                  </h6>
                  <div className="flex flex-col gap-6">
                    {/* Image */}
                    <FormField
                      label="Image"
                      required
                      description="Select the operating system image to use for the control plane nodes."
                    >
                      <Select
                        options={imageOptions}
                        value={cpImage}
                        onChange={setCpImage}
                        fullWidth
                      />
                    </FormField>

                    {/* Flavor */}
                    <FormField
                      label="Flavor"
                      required
                      description="Select the flavor that defines the vCPU, memory, and disk capacity for the control plane nodes."
                    >
                      <Select
                        options={FLAVOR_OPTIONS}
                        value={cpFlavor}
                        onChange={setCpFlavor}
                        fullWidth
                      />
                    </FormField>

                    {/* etcd Disk */}
                    <FormField
                      label="etcd disk"
                      required
                      description="Select the disk type for storing etcd data."
                    >
                      <RadioGroup
                        value={etcdDiskType}
                        onChange={(value) => setEtcdDiskType(value as 'external' | 'local')}
                      >
                        <Radio
                          value="external"
                          label={
                            <div className="flex flex-row gap-1 items-center">
                              External (recommended)
                              <Tooltip
                                content="External disks use independent storage resources."
                                direction="right"
                              >
                                <IconHelpCircle
                                  size={14}
                                  className="text-[var(--color-text-subtle)]"
                                />
                              </Tooltip>
                            </div>
                          }
                        />
                        <Radio
                          value="local"
                          label={
                            <div className="flex flex-row gap-1 items-center">
                              Local
                              <Tooltip
                                content="Local disks use the node's internal storage."
                                direction="right"
                              >
                                <IconHelpCircle
                                  size={14}
                                  className="text-[var(--color-text-subtle)]"
                                />
                              </Tooltip>
                            </div>
                          }
                        />
                      </RadioGroup>
                    </FormField>

                    {/* etcd Volume type */}
                    <FormField
                      label="etcd volume type"
                      required
                      description="Specify the volume type for the etcd data disk."
                    >
                      <Select
                        options={[
                          { value: 'ceph', label: 'ceph' },
                          { value: 'local', label: 'local' },
                          { value: 'nfs', label: 'nfs' },
                        ]}
                        value={etcdVolumeType}
                        onChange={setEtcdVolumeType}
                        fullWidth
                      />
                    </FormField>

                    {/* etcd Volume Size */}
                    <FormField
                      label="etcd volume size"
                      required
                      description="Specify the volume size for the etcd data disk."
                      hint="10-100 GiB"
                    >
                      <div className="flex flex-row gap-3 items-center w-full max-w-[var(--slider-row-max-width,312px)]">
                        <Range
                          className="min-w-0 flex-1"
                          min={10}
                          max={100}
                          step={5}
                          value={etcdVolumeSize}
                          onChange={setEtcdVolumeSize}
                        />
                        <NumberInput
                          value={etcdVolumeSize}
                          onChange={setEtcdVolumeSize}
                          min={10}
                          max={100}
                          step={1}
                          suffix="GiB"
                        />
                      </div>
                    </FormField>

                    {/* Authentication (control plane) */}
                    <div className="flex flex-col gap-6">
                      <p className="text-body-md text-[var(--color-text-subtle)]">
                        Authentication — select the key pair or password credentials for accessing
                        control plane instances.
                      </p>
                      <FormField label="Key pair" required>
                        <Select
                          options={KEY_PAIR_OPTIONS}
                          value={selectedKeyPair}
                          onChange={setSelectedKeyPair}
                          fullWidth
                          placeholder="Select key pair"
                        />
                      </FormField>
                      <FormField label="Login name">
                        <Input
                          placeholder="Enter login name"
                          value={loginName}
                          onChange={(e) => setLoginName(e.target.value)}
                          className="w-full"
                        />
                      </FormField>
                      <FormField label="Password">
                        <Input
                          type="password"
                          showPasswordToggle
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full"
                        />
                      </FormField>
                      <FormField label="Confirm password">
                        <Input
                          type="password"
                          showPasswordToggle
                          placeholder="Enter password again"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full"
                        />
                      </FormField>
                    </div>

                    {/* Node Count */}
                    <FormField
                      label="Node count"
                      required
                      description="Select the number of nodes to create."
                      hint="1-7 nodes (odd numbers)"
                    >
                      <div className="flex flex-row gap-3 items-center w-full max-w-[var(--slider-row-max-width,312px)]">
                        <Range
                          className="min-w-0 flex-1"
                          min={1}
                          max={7}
                          step={2}
                          value={cpNodeCount}
                          onChange={setCpNodeCount}
                        />
                        <NumberInput
                          value={cpNodeCount}
                          onChange={setCpNodeCount}
                          min={1}
                          max={7}
                          step={2}
                        />
                      </div>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Worker Nodes */}
          <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
            <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
              <h2 className="text-heading-h5 text-[var(--color-text-default)]">Worker nodes</h2>
            </div>
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-6">
                {/* Image */}
                <FormField
                  label="Image"
                  required
                  description="Select the operating system image to use for the worker nodes."
                >
                  <Select
                    options={imageOptions}
                    value={nodeImage}
                    onChange={setNodeImage}
                    fullWidth
                  />
                </FormField>

                {/* Flavor */}
                <FormField
                  label="Flavor"
                  required
                  description="Select the flavor that defines the vCPU, memory, and disk capacity for the worker nodes."
                >
                  <Select
                    options={FLAVOR_OPTIONS}
                    value={nodeFlavor}
                    onChange={setNodeFlavor}
                    fullWidth
                  />
                </FormField>

                {/* Authentication (worker) */}
                <div className="flex flex-col gap-6">
                  <p className="text-body-md text-[var(--color-text-subtle)]">
                    Authentication — select the key pair or password credentials for accessing
                    worker instances.
                  </p>
                  <FormField label="Key pair" required>
                    <Select
                      options={KEY_PAIR_OPTIONS}
                      value={workerSelectedKeyPair}
                      onChange={setWorkerSelectedKeyPair}
                      fullWidth
                      placeholder="Select key pair"
                    />
                  </FormField>
                  <FormField label="Login name">
                    <Input
                      placeholder="Enter login name"
                      value={workerLoginName}
                      onChange={(e) => setWorkerLoginName(e.target.value)}
                      className="w-full"
                    />
                  </FormField>
                  <FormField label="Password">
                    <Input
                      type="password"
                      showPasswordToggle
                      placeholder="Enter password"
                      value={workerPassword}
                      onChange={(e) => setWorkerPassword(e.target.value)}
                      className="w-full"
                    />
                  </FormField>
                  <FormField label="Confirm password">
                    <Input
                      type="password"
                      showPasswordToggle
                      placeholder="Enter password again"
                      value={workerConfirmPassword}
                      onChange={(e) => setWorkerConfirmPassword(e.target.value)}
                      className="w-full"
                    />
                  </FormField>
                </div>

                {/* Node Count */}
                <FormField
                  label="Node count"
                  required
                  description="Select the number of worker nodes to create."
                  hint="1-10 nodes"
                >
                  <div className="flex flex-row gap-3 items-center w-full max-w-[var(--slider-row-max-width,312px)]">
                    <Range
                      className="min-w-0 flex-1"
                      min={1}
                      max={10}
                      step={1}
                      value={nodeCount}
                      onChange={setNodeCount}
                    />
                    <NumberInput
                      value={nodeCount}
                      onChange={setNodeCount}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                </FormField>
              </div>
            </div>
          </div>

          {/* Labels & Annotations */}
          <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
            <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
              <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                Labels & annotations
              </h2>
            </div>
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-6">
                {/* Labels */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
                    <p className="text-body-md text-[var(--color-text-subtle)]">
                      Specify the labels used to identify and categorize the resource.
                    </p>
                  </div>

                  {/* Bordered container for labels */}
                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <div className="flex flex-col gap-1.5">
                      {labels.length > 0 && (
                        <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Key
                          </span>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Value
                          </span>
                          <div className="w-5" />
                        </div>
                      )}
                      {labels.map((label) => (
                        <div
                          key={label.id}
                          className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                        >
                          <Input
                            placeholder="label key"
                            value={label.key}
                            onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                            className="w-full"
                          />
                          <Input
                            placeholder="label value"
                            value={label.value}
                            onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                            className="w-full"
                          />
                          <button
                            onClick={() => removeLabel(label.id)}
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        </div>
                      ))}

                      <div className="w-fit">
                        <Button variant="secondary" size="sm" onClick={addLabel}>
                          <IconCirclePlus size={12} stroke={1.5} className="inline mr-1" />
                          Add label
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annotations */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-label-lg text-[var(--color-text-default)]">
                      Annotations
                    </span>
                    <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
                      Specify the annotations used to provide additional metadata for the resource.
                    </p>
                  </div>

                  {/* Bordered container for annotations */}
                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                    <div className="flex flex-col gap-1.5">
                      {annotations.length > 0 && (
                        <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Key
                          </span>
                          <span className="block text-label-sm text-[var(--color-text-default)]">
                            Value
                          </span>
                          <div className="w-5" />
                        </div>
                      )}
                      {annotations.map((annotation) => (
                        <div
                          key={annotation.id}
                          className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                        >
                          <Input
                            placeholder="annotation key"
                            value={annotation.key}
                            onChange={(e) => updateAnnotation(annotation.id, 'key', e.target.value)}
                            className="w-full"
                          />
                          <Input
                            placeholder="annotation value"
                            value={annotation.value}
                            onChange={(e) =>
                              updateAnnotation(annotation.id, 'value', e.target.value)
                            }
                            className="w-full"
                          />
                          <button
                            onClick={() => removeAnnotation(annotation.id)}
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        </div>
                      ))}

                      <div className="w-fit">
                        <Button variant="secondary" size="sm" onClick={addAnnotation}>
                          <IconCirclePlus size={12} stroke={1.5} className="inline mr-1" />
                          Add annotation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary (Floating Card Style) */}
        <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
          <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
            <ul className="flex flex-col gap-2 text-body-md text-[var(--color-text-muted)] list-none p-0 m-0">
              <li>Basic information</li>
              <li>Networking</li>
              <li>Node configuration</li>
              <li>Worker nodes</li>
              <li>Labels & annotations</li>
            </ul>

            <div className="flex flex-row gap-2 w-full justify-end">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreate}
                className="flex-1 min-w-[80px]"
                disabled
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContainerCreateClusterPage;
