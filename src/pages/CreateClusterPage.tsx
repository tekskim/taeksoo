import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconX, IconCirclePlus } from '@tabler/icons-react';
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
  FormField,
  SelectionIndicator,
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

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function CreateClusterPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  // Basic Information
  const [clusterName, setClusterName] = useState('');
  const [kubernetesVersion, setKubernetesVersion] = useState('v1.34');
  const [containerNetwork, setContainerNetwork] = useState('kube-ovn');
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
  const [cpNodeCount, setCpNodeCount] = useState('3');
  const [etcdDiskType, setEtcdDiskType] = useState<'external' | 'local'>('external');
  const [etcdVolumeSize, setEtcdVolumeSize] = useState(10);
  const [cpFlavorFilter, setCpFlavorFilter] = useState('vcpu');

  // Worker Nodes
  const [nodeImage, setNodeImage] = useState('ubuntu-24.04-tk-base');
  const [nodeFlavor, setNodeFlavor] = useState('th-tiny');
  const [nodeCount, setNodeCount] = useState('1');
  const [nodeFlavorFilter, setNodeFlavorFilter] = useState('vcpu');

  // Labels & Annotations
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

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
        <div className="flex-1 flex flex-col gap-4">
          {/* Basic Information */}
          <SectionCard>
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content>
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
                    />
                  </FormField.Control>
                </FormField>

                {/* Description */}
                <Disclosure defaultOpen={false}>
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
            <SectionCard.Content>
              <VStack gap={6}>
                {/* External Network */}
                <FormField required>
                  <FormField.Label>External Network</FormField.Label>
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
                <FormField required>
                  <FormField.Label>Tenant Network</FormField.Label>
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
                <FormField required>
                  <FormField.Label>Subnet</FormField.Label>
                  <FormField.Description>
                    You can also enter the private IP address for the kubernetes api server.
                  </FormField.Description>
                  <FormField.Control>
                    <Select
                      options={subnetOptions}
                      value={selectedSubnet}
                      onChange={setSelectedSubnet}
                    />
                  </FormField.Control>
                </FormField>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* Node Configuration */}
          <SectionCard>
            <SectionCard.Header title="Node configuration" />
            <SectionCard.Content>
              <VStack gap={6}>
                {/* Node Type */}
                <FormField required>
                  <FormField.Label>Node Type</FormField.Label>
                  <FormField.Description>
                    Select the type of nodes to use for your cluster. Instance is used for VM-based
                    clusters and BareMetal is used for physical server clusters.
                  </FormField.Description>
                  <FormField.Control>
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
                <div className="border-t border-[var(--color-border-subtle)] pt-6">
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
                        <Select options={imageOptions} value={cpImage} onChange={setCpImage} />
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
                            placeholder="Find Flavor with filters"
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

                    {/* Node Count */}
                    <FormField required>
                      <FormField.Label>Node Count</FormField.Label>
                      <FormField.Description>
                        Select the number of nodes to create.
                      </FormField.Description>
                      <FormField.Control>
                        <Select
                          options={[
                            { value: '1', label: '1' },
                            { value: '3', label: '3' },
                            { value: '5', label: '5' },
                            { value: '7', label: '7' },
                          ]}
                          value={cpNodeCount}
                          onChange={setCpNodeCount}
                        />
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
                          <Radio value="external" label="External (recommended)" />
                          <Radio value="local" label="Local" />
                        </RadioGroup>
                      </FormField.Control>
                    </FormField>

                    {/* etcd Volume Size */}
                    <FormField required>
                      <FormField.Label>etcd Volume Size</FormField.Label>
                      <FormField.Description>
                        Specify the volume size for the etcd data disk.
                      </FormField.Description>
                      <FormField.Control>
                        <NumberInput
                          value={etcdVolumeSize}
                          onChange={setEtcdVolumeSize}
                          min={10}
                          max={100}
                          width="sm"
                          suffix="GiB"
                        />
                      </FormField.Control>
                    </FormField>
                  </VStack>
                </div>

                {/* Worker Nodes */}
                <div className="border-t border-[var(--color-border-subtle)] pt-6">
                  <h6 className="text-heading-h6 text-[var(--color-text-default)] mb-4">
                    Worker Nodes
                  </h6>
                  <VStack gap={6}>
                    {/* Image */}
                    <FormField required>
                      <FormField.Label>Image</FormField.Label>
                      <FormField.Description>
                        Select the operating system image to use for the worker nodes.
                      </FormField.Description>
                      <FormField.Control>
                        <Select options={imageOptions} value={nodeImage} onChange={setNodeImage} />
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
                            placeholder="Find Flavor with filters"
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

                    {/* Node Count */}
                    <FormField required>
                      <FormField.Label>Node Count</FormField.Label>
                      <FormField.Description>
                        Select the number of worker nodes to create.
                      </FormField.Description>
                      <FormField.Control>
                        <Select
                          options={[
                            { value: '1', label: '1' },
                            { value: '2', label: '2' },
                            { value: '3', label: '3' },
                            { value: '5', label: '5' },
                            { value: '10', label: '10' },
                          ]}
                          value={nodeCount}
                          onChange={setNodeCount}
                        />
                      </FormField.Control>
                    </FormField>
                  </VStack>
                </div>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* Labels & Annotations */}
          <SectionCard>
            <SectionCard.Header title="Labels & Annotations" />
            <SectionCard.Content>
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
