import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsV2 } from '@/hooks/useIsV2';
import {
  IconX,
  IconCirclePlus,
  IconInfoCircle,
  IconHelpCircle,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';
import {
  Button,
  Breadcrumb,
  VStack,
  HStack,
  TabBar,
  TopBar,
  Input,
  Select,
  Disclosure,
  SectionCard,
  Table,
  Radio,
  RadioGroup,
  Pagination,
  SearchInput,
  NumberInput,
  Slider,
  FormField,
  SelectionIndicator,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  PageShell,
  WizardSummary,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { ClusterManagementSidebar } from '@/components/ClusterManagementSidebar';
import { useTabs } from '@/contexts/TabContext';

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

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function CreateClusterPage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

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
  const [externalNetworkSearch, setExternalNetworkSearch] = useState('');
  const [tenantNetworkSearch, setTenantNetworkSearch] = useState('');

  // Node Configuration
  const [nodeType, setNodeType] = useState<'instance' | 'baremetal'>('instance');

  // Control Planes
  const [cpImage, setCpImage] = useState('ubuntu-24.04-tk-base');
  const [cpFlavor, setCpFlavor] = useState('th-tiny');
  const [cpNodeCount, setCpNodeCount] = useState(3);
  const [etcdDiskType, setEtcdDiskType] = useState<'external' | 'local'>('external');
  const [etcdVolumeType, setEtcdVolumeType] = useState('ceph');
  const [etcdVolumeSize, setEtcdVolumeSize] = useState(10);
  const [cpFlavorFilter, setCpFlavorFilter] = useState('vcpu');

  // Authentication
  const [selectedKeyPair, setSelectedKeyPair] = useState<string>('');
  const [keyPairSearch, setKeyPairSearch] = useState('');
  const [keyPairPage, setKeyPairPage] = useState(1);
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Worker Nodes
  const [nodeImage, setNodeImage] = useState('ubuntu-24.04-tk-base');
  const [nodeFlavor, setNodeFlavor] = useState('th-tiny');
  const [nodeCount, setNodeCount] = useState(1);
  const [nodeFlavorFilter, setNodeFlavorFilter] = useState('vcpu');

  // Worker Nodes Authentication
  const [workerSelectedKeyPair, setWorkerSelectedKeyPair] = useState<string>('');
  const [workerKeyPairSearch, setWorkerKeyPairSearch] = useState('');
  const [workerKeyPairPage, setWorkerKeyPairPage] = useState(1);
  const [workerLoginName, setWorkerLoginName] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');
  const [workerConfirmPassword, setWorkerConfirmPassword] = useState('');
  const [workerShowPassword, setWorkerShowPassword] = useState(false);
  const [workerShowConfirmPassword, setWorkerShowConfirmPassword] = useState(false);

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

  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Filtered network data
  const filteredExternalNetworks = mockExternalNetworks.filter(
    (network) =>
      network.name.toLowerCase().includes(externalNetworkSearch.toLowerCase()) ||
      network.subnetCidr.toLowerCase().includes(externalNetworkSearch.toLowerCase())
  );

  const filteredTenantNetworks = mockTenantNetworks.filter(
    (network) =>
      network.name.toLowerCase().includes(tenantNetworkSearch.toLowerCase()) ||
      network.subnetCidr.toLowerCase().includes(tenantNetworkSearch.toLowerCase())
  );

  // External Network columns
  const externalNetworkColumns: TableColumn<NetworkRow>[] = [
    {
      key: 'select',
      label: '',
      width: 48,
      render: (_value, row) => (
        <Radio
          checked={selectedExternalNetwork === row.id}
          onChange={() => setSelectedExternalNetwork(row.id)}
        />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'subnetCidr', label: 'SubnetCIDR', sortable: true },
  ];

  // Tenant Network columns
  const tenantNetworkColumns: TableColumn<NetworkRow>[] = [
    {
      key: 'select',
      label: '',
      width: 48,
      render: (_value, row) => (
        <Radio
          checked={selectedTenantNetwork === row.id}
          onChange={() => setSelectedTenantNetwork(row.id)}
        />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'subnetCidr', label: 'SubnetCIDR', sortable: true },
  ];

  // Key Pair columns
  const keyPairColumns: TableColumn<KeyPairRow>[] = [
    {
      key: 'select',
      label: '',
      width: 48,
      render: (_value, row) => (
        <Radio checked={selectedKeyPair === row.id} onChange={() => setSelectedKeyPair(row.id)} />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'fingerprint', label: 'Fingerprint', sortable: true },
  ];

  const filteredKeyPairs = mockKeyPairs.filter((kp) =>
    kp.name.toLowerCase().includes(keyPairSearch.toLowerCase())
  );

  // Control Plane Flavor columns
  const cpFlavorColumns: TableColumn<FlavorRow>[] = [
    {
      key: 'select',
      label: '',
      width: 48,
      render: (_value, row) => (
        <Radio checked={cpFlavor === row.id} onChange={() => setCpFlavor(row.id)} />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'vcpu', label: 'vCPU', sortable: true },
    { key: 'ram', label: 'RAM', sortable: true },
    { key: 'disk', label: 'Disk', sortable: true },
  ];

  // Worker Node Flavor columns
  const nodeFlavorColumns: TableColumn<FlavorRow>[] = [
    {
      key: 'select',
      label: '',
      width: 48,
      render: (_value, row) => (
        <Radio checked={nodeFlavor === row.id} onChange={() => setNodeFlavor(row.id)} />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'vcpu', label: 'vCPU', sortable: true },
    { key: 'ram', label: 'RAM', sortable: true },
    { key: 'disk', label: 'Disk', sortable: true },
  ];

  const handleCreate = () => {
    console.log('Creating cluster:', {
      clusterName,
      kubernetesVersion,
      containerNetwork,
      description,
      selectedExternalNetwork,
      selectedTenantNetwork,
      selectedSubnet,
      nodeType,
      cpImage,
      cpFlavor,
      cpNodeCount,
      etcdDiskSize,
      nodeImage,
      nodeFlavor,
      nodeCount,
      labels,
      annotations,
    });
    navigate('/container/cluster-management');
  };

  const handleCancel = () => {
    navigate('/container/cluster-management');
  };

  // Get summary data
  const getFlavorSummary = (flavorId: string) => {
    const flavor = mockFlavors.find((f) => f.id === flavorId);
    return flavor ? `${flavor.vcpu}vCPU, ${flavor.ram}` : '';
  };

  return (
    <PageShell
      sidebar={
        <ClusterManagementSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Cluster Management', href: '/container/cluster-management' },
                { label: 'Clusters', href: '/container/cluster-management' },
                { label: 'Create Cluster' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      {/* Header */}
      <VStack gap={2} className="mb-6">
        <h1 className="text-heading-h4 leading-7 font-semibold text-[var(--color-text-default)]">
          Create Cluster
        </h1>
        <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
          Cluster is a group of machines that work together to run containerized applications with
          automated scaling, scheduling, and management.
        </p>
      </VStack>

      {/* Main Content Grid */}
      <div className="flex gap-6">
        {/* Left Column - Form */}
        <div className="flex-1 flex flex-col gap-[24px]">
          {/* Basic Information */}
          <SectionCard>
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content className="pt-3">
              <VStack gap={6}>
                {/* Name */}
                <FormField required>
                  <FormField.Label>Name</FormField.Label>
                  <FormField.Control>
                    <Input
                      placeholder="Enter a unique name"
                      value={clusterName}
                      onChange={(e) => setClusterName(e.target.value)}
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>

                {/* Kubernetes Version */}
                <FormField required>
                  <FormField.Label>Kubernetes Version</FormField.Label>
                  <FormField.Description>
                    Select the Kubernetes version to apply to the cluster. Choosing the latest
                    supported version is recommended for improved stability and security unless your
                    application requires a specific older version.
                  </FormField.Description>
                  <FormField.Control>
                    <Select
                      options={kubernetesVersionOptions}
                      value={kubernetesVersion}
                      onChange={setKubernetesVersion}
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>

                {/* Container Network */}
                <FormField required>
                  <FormField.Label>Container Network</FormField.Label>
                  <FormField.Description>
                    Select the container network (CNI) plugin that manages internal cluster traffic.
                  </FormField.Description>
                  <FormField.Control>
                    <Select
                      options={containerNetworkOptions}
                      value={containerNetwork}
                      onChange={setContainerNetwork}
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>

                {/* Tenant */}
                <FormField required>
                  <FormField.Label>Tenant</FormField.Label>
                  <FormField.Description>
                    Select a tenant to use for your cluster resources.
                  </FormField.Description>
                  <FormField.Control>
                    <Select options={tenantOptions} value={tenant} onChange={setTenant} fullWidth />
                  </FormField.Control>
                </FormField>

                {/* Description */}
                <Disclosure defaultOpen={isV2} className={isV2 ? 'gap-3' : ''}>
                  <Disclosure.Trigger>Description</Disclosure.Trigger>
                  <Disclosure.Panel>
                    <Input
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      className="mt-2"
                    />
                  </Disclosure.Panel>
                </Disclosure>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* Networking */}
          <SectionCard>
            <SectionCard.Header title="Networking" />
            <SectionCard.Content className="pt-3">
              <VStack gap={6}>
                {/* External Network */}
                <FormField>
                  <FormField.Label>
                    <HStack gap={1} align="center">
                      External Network
                      <span className="text-[var(--color-state-danger)]">*</span>
                      <Tooltip
                        content="Displays the list of External Networks created in the user domain for enabling external access for the cluster."
                        position="right"
                      >
                        <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
                      </Tooltip>
                    </HStack>
                  </FormField.Label>
                  <FormField.Description>
                    Select the external network for outbound access.
                  </FormField.Description>
                  <FormField.Control>
                    <VStack gap={3}>
                      <SearchInput
                        placeholder="Search network by attributes"
                        value={externalNetworkSearch}
                        onChange={(e) => setExternalNetworkSearch(e.target.value)}
                        className="w-[var(--search-input-width)]"
                      />
                      <Pagination
                        currentPage={1}
                        totalPages={Math.ceil(filteredExternalNetworks.length / 6) || 1}
                        onPageChange={() => {}}
                        totalItems={filteredExternalNetworks.length}
                        selectedCount={selectedExternalNetwork ? 1 : 0}
                      />
                      <VStack gap={2}>
                        <Table
                          columns={externalNetworkColumns}
                          data={filteredExternalNetworks}
                          rowKey="id"
                        />
                        <SelectionIndicator
                          selectedItems={
                            selectedExternalNetwork
                              ? [
                                  {
                                    id: selectedExternalNetwork,
                                    label: selectedExternalNetwork,
                                  },
                                ]
                              : []
                          }
                          emptyText="No network selected"
                          onRemove={() => setSelectedExternalNetwork('')}
                        />
                      </VStack>
                    </VStack>
                  </FormField.Control>
                </FormField>

                {/* Tenant Network */}
                <FormField>
                  <FormField.Label>
                    <HStack gap={1} align="center">
                      Tenant Network
                      <span className="text-[var(--color-state-danger)]">*</span>
                      <Tooltip
                        content="Displays the internal networks available to the project. Only networks with a router open to External gateway for the selected External Network."
                        position="right"
                      >
                        <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
                      </Tooltip>
                    </HStack>
                  </FormField.Label>
                  <FormField.Description>
                    Select a tenant network for your cluster resources.
                  </FormField.Description>
                  <FormField.Control>
                    <VStack gap={3}>
                      <SearchInput
                        placeholder="Search network by attributes"
                        value={tenantNetworkSearch}
                        onChange={(e) => setTenantNetworkSearch(e.target.value)}
                        className="w-[var(--search-input-width)]"
                      />
                      <Pagination
                        currentPage={1}
                        totalPages={Math.ceil(filteredTenantNetworks.length / 5) || 1}
                        onPageChange={() => {}}
                        totalItems={filteredTenantNetworks.length}
                        selectedCount={selectedTenantNetwork ? 1 : 0}
                      />
                      <VStack gap={2}>
                        <Table
                          columns={tenantNetworkColumns}
                          data={filteredTenantNetworks}
                          rowKey="id"
                        />
                        <SelectionIndicator
                          selectedItems={
                            selectedTenantNetwork
                              ? [{ id: selectedTenantNetwork, label: selectedTenantNetwork }]
                              : []
                          }
                          emptyText="No network selected"
                          onRemove={() => setSelectedTenantNetwork('')}
                        />
                      </VStack>
                    </VStack>
                  </FormField.Control>
                </FormField>

                {/* Subnet */}
                <FormField>
                  <FormField.Label>
                    <HStack gap={1} align="center">
                      Subnet
                      <span className="text-[var(--color-state-danger)]">*</span>
                      <Tooltip
                        content="Displays the subnets within the selected Tenant Network. Only subnets connected to a router open to External Gateway for the selected External Network are shown."
                        position="right"
                      >
                        <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
                      </Tooltip>
                    </HStack>
                  </FormField.Label>
                  <FormField.Description>
                    You can also enter the private IP address for the kubernetes api server.
                  </FormField.Description>
                  <FormField.Control>
                    <Select
                      options={subnetOptions}
                      value={selectedSubnet}
                      onChange={setSelectedSubnet}
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* Node Configuration */}
          <SectionCard>
            <SectionCard.Header title="Node configuration" />
            <SectionCard.Content className="pt-3">
              <VStack gap={6}>
                {/* Node Type */}
                <FormField required>
                  <FormField.Label>Node Type</FormField.Label>
                  <FormField.Description>
                    Select the type of nodes to use for your cluster. Instance is used for VM-based
                    clusters and BareMetal is used for physical server clusters.
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <RadioGroup
                      value={nodeType}
                      onChange={(value) => setNodeType(value as 'instance' | 'baremetal')}
                    >
                      <Radio value="instance" label="Instance" />
                      <Radio value="baremetal" label="BareMetal" />
                    </RadioGroup>
                  </FormField.Control>
                </FormField>

                {/* Control Planes */}
                <div>
                  <h6 className="text-heading-h6 text-[var(--color-text-default)] mb-4">
                    Control Planes
                  </h6>
                  <VStack gap={6}>
                    {/* Image */}
                    <FormField required>
                      <FormField.Label>Image</FormField.Label>
                      <FormField.Description>
                        Select the operating system image to use for the control plane nodes.
                      </FormField.Description>
                      <FormField.Control>
                        <Select
                          options={imageOptions}
                          value={cpImage}
                          onChange={setCpImage}
                          fullWidth
                        />
                      </FormField.Control>
                    </FormField>

                    {/* Flavor */}
                    <FormField required>
                      <FormField.Label>Flavor</FormField.Label>
                      <FormField.Description>
                        Select the Flavor that defines the vCPU, memory, and disk capacity for the
                        control plane nodes.
                      </FormField.Description>
                      <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                        <VStack gap={3}>
                          <Tabs
                            value={cpFlavorFilter}
                            onChange={setCpFlavorFilter}
                            variant="underline"
                            size="sm"
                          >
                            <TabList>
                              <Tab value="vcpu">vCPU</Tab>
                              <Tab value="gpu">GPU</Tab>
                              <Tab value="npu">NPU</Tab>
                              <Tab value="custom">Custom</Tab>
                            </TabList>
                          </Tabs>
                          <SearchInput
                            placeholder="Search flavors by attributes"
                            className="w-[var(--search-input-width)]"
                          />
                          <Pagination
                            currentPage={1}
                            totalPages={5}
                            onPageChange={() => {}}
                            totalItems={115}
                            selectedCount={cpFlavor ? 1 : 0}
                          />
                          <VStack gap={2}>
                            <Table columns={cpFlavorColumns} data={mockFlavors} rowKey="id" />
                            <SelectionIndicator
                              selectedItems={
                                cpFlavor
                                  ? [
                                      {
                                        id: cpFlavor,
                                        label:
                                          mockFlavors.find((f) => f.id === cpFlavor)?.name ||
                                          cpFlavor,
                                      },
                                    ]
                                  : []
                              }
                              emptyText="No flavor selected"
                              onRemove={() => setCpFlavor('')}
                            />
                          </VStack>
                        </VStack>
                      </FormField.Control>
                    </FormField>

                    {/* etcd Disk */}
                    <FormField required>
                      <FormField.Label>etcd Disk</FormField.Label>
                      <FormField.Description>
                        Select the disk type for storing etcd data.
                      </FormField.Description>
                      <FormField.Control>
                        <RadioGroup
                          value={etcdDiskType}
                          onChange={(value) => setEtcdDiskType(value as 'external' | 'local')}
                        >
                          <Radio
                            value="external"
                            label={
                              <HStack gap={1} align="center">
                                External (recommended)
                                <Tooltip
                                  content="External disks use independent storage resources."
                                  position="right"
                                >
                                  <IconHelpCircle
                                    size={14}
                                    className="text-[var(--color-text-subtle)]"
                                  />
                                </Tooltip>
                              </HStack>
                            }
                          />
                          <Radio
                            value="local"
                            label={
                              <HStack gap={1} align="center">
                                Local
                                <Tooltip
                                  content="Local disks use the node's internal storage."
                                  position="right"
                                >
                                  <IconHelpCircle
                                    size={14}
                                    className="text-[var(--color-text-subtle)]"
                                  />
                                </Tooltip>
                              </HStack>
                            }
                          />
                        </RadioGroup>
                      </FormField.Control>
                    </FormField>

                    {/* etcd Volume type */}
                    <FormField required>
                      <FormField.Label>etcd Volume type</FormField.Label>
                      <FormField.Description>
                        Specify the volume type for the etcd data disk
                      </FormField.Description>
                      <FormField.Control>
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
                      </FormField.Control>
                    </FormField>

                    {/* etcd Volume Size */}
                    <FormField required>
                      <FormField.Label>etcd Volume Size</FormField.Label>
                      <FormField.Description>
                        Specify the volume size for the etcd data disk.
                      </FormField.Description>
                      <FormField.Control>
                        <HStack gap={3} align="center">
                          <Slider
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
                            width="xs"
                            suffix="GiB"
                          />
                        </HStack>
                      </FormField.Control>
                      <FormField.HelperText>10-100 GiB</FormField.HelperText>
                    </FormField>

                    {/* Authentication */}
                    <FormField required>
                      <FormField.Label>Authentication</FormField.Label>
                      <FormField.Description>
                        Select the authentication method for accessing your instance. You can choose
                        either the Key Pair method or the Password method.
                      </FormField.Description>
                      <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                        <Tabs value="keypair" onChange={() => {}} variant="underline" size="sm">
                          <TabList>
                            <Tab value="keypair">Key Pair</Tab>
                            <Tab value="password">Password</Tab>
                          </TabList>
                        </Tabs>

                        {/* Key Pair section */}
                        <VStack gap={3} className="pt-4">
                          <SearchInput
                            placeholder="Search key pairs by attributes"
                            value={keyPairSearch}
                            onChange={(e) => setKeyPairSearch(e.target.value)}
                            className="w-[var(--search-input-width)]"
                          />
                          <Pagination
                            currentPage={keyPairPage}
                            totalPages={5}
                            onPageChange={setKeyPairPage}
                            totalItems={115}
                            selectedCount={selectedKeyPair ? 1 : 0}
                          />
                          <VStack gap={2}>
                            <Table columns={keyPairColumns} data={filteredKeyPairs} rowKey="id" />
                            <SelectionIndicator
                              selectedItems={
                                selectedKeyPair
                                  ? [
                                      {
                                        id: selectedKeyPair,
                                        label:
                                          mockKeyPairs.find((kp) => kp.id === selectedKeyPair)
                                            ?.name || selectedKeyPair,
                                      },
                                    ]
                                  : []
                              }
                              emptyText="No item Selected"
                              onRemove={() => setSelectedKeyPair('')}
                            />
                          </VStack>
                        </VStack>

                        {/* Password section */}
                        <VStack gap={6} className="pt-6">
                          <FormField>
                            <FormField.Label>Login Name</FormField.Label>
                            <FormField.Control>
                              <Input
                                placeholder="Enter login name"
                                value={loginName}
                                onChange={(e) => setLoginName(e.target.value)}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>
                          <FormField>
                            <FormField.Label>Password</FormField.Label>
                            <FormField.Control>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                rightElement={
                                  <button
                                    type="button"
                                    className="flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                  >
                                    {showPassword ? (
                                      <IconEyeOff size={14} />
                                    ) : (
                                      <IconEye size={14} />
                                    )}
                                  </button>
                                }
                              />
                            </FormField.Control>
                          </FormField>
                          <FormField>
                            <FormField.Label>Confirm Password</FormField.Label>
                            <FormField.Control>
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Enter password again"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                rightElement={
                                  <button
                                    type="button"
                                    className="flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                  >
                                    {showConfirmPassword ? (
                                      <IconEyeOff size={14} />
                                    ) : (
                                      <IconEye size={14} />
                                    )}
                                  </button>
                                }
                              />
                            </FormField.Control>
                          </FormField>
                        </VStack>
                      </FormField.Control>
                    </FormField>

                    {/* Node Count */}
                    <FormField required>
                      <FormField.Label>Node Count</FormField.Label>
                      <FormField.Description>
                        Select the number of nodes to create.
                      </FormField.Description>
                      <FormField.Control>
                        <HStack gap={4} align="center">
                          <Slider
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
                            width="xs"
                          />
                        </HStack>
                      </FormField.Control>
                      <FormField.HelperText>1-7 nodes (odd numbers)</FormField.HelperText>
                    </FormField>
                  </VStack>
                </div>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* Worker Nodes */}
          <SectionCard>
            <SectionCard.Header title="Worker Nodes" />
            <SectionCard.Content className="pt-3">
              <VStack gap={6}>
                {/* Image */}
                <FormField required>
                  <FormField.Label>Image</FormField.Label>
                  <FormField.Description>
                    Select the operating system image to use for the worker nodes.
                  </FormField.Description>
                  <FormField.Control>
                    <Select
                      options={imageOptions}
                      value={nodeImage}
                      onChange={setNodeImage}
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>

                {/* Flavor */}
                <FormField required>
                  <FormField.Label>Flavor</FormField.Label>
                  <FormField.Description>
                    Select the Flavor that defines the vCPU, memory, and disk capacity for the
                    worker nodes.
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <VStack gap={3}>
                      <Tabs
                        value={nodeFlavorFilter}
                        onChange={setNodeFlavorFilter}
                        variant="underline"
                        size="sm"
                      >
                        <TabList>
                          <Tab value="vcpu">vCPU</Tab>
                          <Tab value="gpu">GPU</Tab>
                          <Tab value="npu">NPU</Tab>
                          <Tab value="custom">Custom</Tab>
                        </TabList>
                      </Tabs>
                      <SearchInput
                        placeholder="Search flavors by attributes"
                        className="w-[var(--search-input-width)]"
                      />
                      <Pagination
                        currentPage={1}
                        totalPages={5}
                        onPageChange={() => {}}
                        totalItems={115}
                        selectedCount={nodeFlavor ? 1 : 0}
                      />
                      <VStack gap={2}>
                        <Table columns={nodeFlavorColumns} data={mockFlavors} rowKey="id" />
                        <SelectionIndicator
                          selectedItems={
                            nodeFlavor
                              ? [
                                  {
                                    id: nodeFlavor,
                                    label:
                                      mockFlavors.find((f) => f.id === nodeFlavor)?.name ||
                                      nodeFlavor,
                                  },
                                ]
                              : []
                          }
                          emptyText="No flavor selected"
                          onRemove={() => setNodeFlavor('')}
                        />
                      </VStack>
                    </VStack>
                  </FormField.Control>
                </FormField>

                {/* Authentication */}
                <FormField required>
                  <FormField.Label>Authentication</FormField.Label>
                  <FormField.Description>
                    Select the authentication method for accessing your instance. You can choose
                    either the Key Pair method or the Password method.
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <Tabs value="keypair" onChange={() => {}} variant="underline" size="sm">
                      <TabList>
                        <Tab value="keypair">Key Pair</Tab>
                        <Tab value="password">Password</Tab>
                      </TabList>
                    </Tabs>

                    {/* Key Pair section */}
                    <VStack gap={3} className="pt-4">
                      <SearchInput
                        placeholder="Search key pairs by attributes"
                        value={workerKeyPairSearch}
                        onChange={(e) => setWorkerKeyPairSearch(e.target.value)}
                        className="w-[var(--search-input-width)]"
                      />
                      <Pagination
                        currentPage={workerKeyPairPage}
                        totalPages={5}
                        onPageChange={setWorkerKeyPairPage}
                        totalItems={115}
                        selectedCount={workerSelectedKeyPair ? 1 : 0}
                      />
                      <VStack gap={2}>
                        <Table columns={keyPairColumns} data={filteredKeyPairs} rowKey="id" />
                        <SelectionIndicator
                          selectedItems={
                            workerSelectedKeyPair
                              ? [
                                  {
                                    id: workerSelectedKeyPair,
                                    label:
                                      mockKeyPairs.find((kp) => kp.id === workerSelectedKeyPair)
                                        ?.name || workerSelectedKeyPair,
                                  },
                                ]
                              : []
                          }
                          emptyText="No item Selected"
                          onRemove={() => setWorkerSelectedKeyPair('')}
                        />
                      </VStack>
                    </VStack>

                    {/* Password section */}
                    <VStack gap={6} className="pt-6">
                      <FormField>
                        <FormField.Label>Login Name</FormField.Label>
                        <FormField.Control>
                          <Input
                            placeholder="Enter login name"
                            value={workerLoginName}
                            onChange={(e) => setWorkerLoginName(e.target.value)}
                            fullWidth
                          />
                        </FormField.Control>
                      </FormField>
                      <FormField>
                        <FormField.Label>Password</FormField.Label>
                        <FormField.Control>
                          <Input
                            type={workerShowPassword ? 'text' : 'password'}
                            placeholder="Enter password"
                            value={workerPassword}
                            onChange={(e) => setWorkerPassword(e.target.value)}
                            fullWidth
                            rightElement={
                              <button
                                type="button"
                                className="flex items-center"
                                onClick={() => setWorkerShowPassword(!workerShowPassword)}
                                tabIndex={-1}
                              >
                                {workerShowPassword ? (
                                  <IconEyeOff size={14} />
                                ) : (
                                  <IconEye size={14} />
                                )}
                              </button>
                            }
                          />
                        </FormField.Control>
                      </FormField>
                      <FormField>
                        <FormField.Label>Confirm Password</FormField.Label>
                        <FormField.Control>
                          <Input
                            type={workerShowConfirmPassword ? 'text' : 'password'}
                            placeholder="Enter password again"
                            value={workerConfirmPassword}
                            onChange={(e) => setWorkerConfirmPassword(e.target.value)}
                            fullWidth
                            rightElement={
                              <button
                                type="button"
                                className="flex items-center"
                                onClick={() =>
                                  setWorkerShowConfirmPassword(!workerShowConfirmPassword)
                                }
                                tabIndex={-1}
                              >
                                {workerShowConfirmPassword ? (
                                  <IconEyeOff size={14} />
                                ) : (
                                  <IconEye size={14} />
                                )}
                              </button>
                            }
                          />
                        </FormField.Control>
                      </FormField>
                    </VStack>
                  </FormField.Control>
                </FormField>

                {/* Node Count */}
                <FormField required>
                  <FormField.Label>Node Count</FormField.Label>
                  <FormField.Description>
                    Select the number of worker nodes to create.
                  </FormField.Description>
                  <FormField.Control>
                    <HStack gap={4} align="center">
                      <Slider min={1} max={10} step={1} value={nodeCount} onChange={setNodeCount} />
                      <NumberInput
                        value={nodeCount}
                        onChange={setNodeCount}
                        min={1}
                        max={10}
                        step={1}
                        width="xs"
                      />
                    </HStack>
                  </FormField.Control>
                  <FormField.HelperText>1-10 nodes</FormField.HelperText>
                </FormField>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* Labels & Annotations */}
          <SectionCard>
            <SectionCard.Header title="Labels & Annotations" />
            <SectionCard.Content className="pt-3">
              <VStack gap={6}>
                {/* Labels */}
                <VStack gap={3}>
                  <VStack gap={1.5}>
                    <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
                    <p className="text-body-md text-[var(--color-text-subtle)]">
                      Specify the labels used to identify and categorize the resource.
                    </p>
                  </VStack>

                  {/* Bordered container for labels */}
                  <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                    <VStack gap={2}>
                      {labels.length > 0 && (
                        <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                          <span className="block text-label-lg text-[var(--color-text-default)]">
                            Key
                          </span>
                          <span className="block text-label-lg text-[var(--color-text-default)]">
                            Value
                          </span>
                          <div />
                        </div>
                      )}
                      {labels.map((label) => (
                        <div
                          key={label.id}
                          className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                        >
                          <Input
                            placeholder="label key"
                            value={label.key}
                            onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                            fullWidth
                          />
                          <Input
                            placeholder="label value"
                            value={label.value}
                            onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                            fullWidth
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
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                          onClick={addLabel}
                        >
                          Add Label
                        </Button>
                      </div>
                    </VStack>
                  </div>
                </VStack>

                {/* Annotations */}
                <VStack gap={3}>
                  <VStack gap={1.5}>
                    <span className="text-label-lg text-[var(--color-text-default)]">
                      Annotations
                    </span>
                    <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
                      Specify the annotations used to provide additional metadata for the resource.
                    </p>
                  </VStack>

                  {/* Bordered container for annotations */}
                  <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                    <VStack gap={2}>
                      {annotations.length > 0 && (
                        <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                          <span className="block text-label-lg text-[var(--color-text-default)]">
                            Key
                          </span>
                          <span className="block text-label-lg text-[var(--color-text-default)]">
                            Value
                          </span>
                          <div />
                        </div>
                      )}
                      {annotations.map((annotation) => (
                        <div
                          key={annotation.id}
                          className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                        >
                          <Input
                            placeholder="annotation key"
                            value={annotation.key}
                            onChange={(e) => updateAnnotation(annotation.id, 'key', e.target.value)}
                            fullWidth
                          />
                          <Input
                            placeholder="annotation value"
                            value={annotation.value}
                            onChange={(e) =>
                              updateAnnotation(annotation.id, 'value', e.target.value)
                            }
                            fullWidth
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
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                          onClick={addAnnotation}
                        >
                          Add Annotation
                        </Button>
                      </div>
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </SectionCard.Content>
          </SectionCard>
        </div>

        {/* Right Column - Summary (Floating Card Style) */}
        <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
          <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
            {/* Summary Content Area */}
            <WizardSummary
              items={[
                { key: 'basic-info', label: 'Basic information', status: 'active' },
                { key: 'networking', label: 'Networking', status: 'active' },
                { key: 'node-config', label: 'Node configuration', status: 'done' },
                { key: 'labels', label: 'Labels & Annotations', status: 'done' },
              ]}
            />

            {/* Button Container */}
            <HStack gap={2} className="w-full justify-end">
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
            </HStack>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default CreateClusterPage;
