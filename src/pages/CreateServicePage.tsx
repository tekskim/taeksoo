import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  Select,
  SectionCard,
  Radio,
  RadioGroup,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconPlus,
  IconCirclePlus,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

// Service Type options
const SERVICE_TYPE_OPTIONS = [
  { value: 'ClusterIP', label: 'Cluster IP' },
  { value: 'Headless', label: 'Headless' },
  { value: 'LoadBalancer', label: 'Load Balancer' },
  { value: 'NodePort', label: 'Node Port' },
];

// Service type descriptions
const SERVICE_TYPE_DESCRIPTIONS: Record<string, string> = {
  ClusterIP:
    'Expose a set of Pods to other Pods within the cluster. This type of Service is only reachable from within the cluster. This is the default type.',
  Headless:
    'Headless Service (clusterIP: None) that allows direct access to Pod IPs without load balancing.',
  LoadBalancer:
    "Expose the Service externally using a cloud provider's load balancer. Traffic from the external load balancer is directed to the backend Pods.",
  NodePort:
    "Expose the Service on each Node's IP at a static port. A ClusterIP Service, to which the NodePort Service routes, is automatically created.",
};

// Namespace options
const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'production', label: 'production' },
];

// Protocol options
const PROTOCOL_OPTIONS = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'SCTP', label: 'SCTP' },
];

interface Port {
  id: string;
  name: string;
  listeningPort: string;
  protocol: string;
  targetPort: string;
  nodePort?: string;
}

interface Label {
  key: string;
  value: string;
}

interface Annotation {
  key: string;
  value: string;
}

interface Selector {
  key: string;
  value: string;
}

interface ExternalIP {
  id: string;
  value: string;
}

/* ----------------------------------------
   Summary Item Component
   ---------------------------------------- */

interface SummaryItemProps {
  label: string;
  status: 'complete' | 'in-progress';
}

function SummaryItem({ label, status }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1 w-full">
      <span className="text-[12px] leading-5 text-[var(--color-text-default)]">{label}</span>
      <div className="w-4 h-4 flex items-center justify-center">
        {status === 'complete' ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="var(--color-state-success)" />
            <path
              d="M5 8L7 10L11 6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="var(--color-border-default)"
              strokeDasharray="3 3"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateServicePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [serviceType, setServiceType] = useState('ClusterIP');
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Ports state
  const [ports, setPorts] = useState<Port[]>([
    { id: '1', name: '', listeningPort: '', protocol: 'TCP', targetPort: '', nodePort: '' },
  ]);

  // IP Addresses state
  const [clusterIP, setClusterIP] = useState('');
  const [loadBalancerIP, setLoadBalancerIP] = useState('');
  const [externalIPs, setExternalIPs] = useState<ExternalIP[]>([]);

  // Selectors state
  const [selectors, setSelectors] = useState<Selector[]>([]);

  // Session Affinity state
  const [sessionAffinity, setSessionAffinity] = useState<'None' | 'ClientIP'>('None');
  const [sessionAffinityTimeout, setSessionAffinityTimeout] = useState('10800');

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Service');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/services');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      setNameError('Name is required.');
      return;
    }

    console.log('Creating service:', {
      serviceType,
      namespace,
      name,
      description,
      ports,
      clusterIP,
      loadBalancerIP,
      externalIPs,
      selectors,
      sessionAffinity,
      sessionAffinityTimeout,
      labels,
      annotations,
    });
    navigate('/container/services');
  }, [
    serviceType,
    namespace,
    name,
    description,
    ports,
    clusterIP,
    loadBalancerIP,
    externalIPs,
    selectors,
    sessionAffinity,
    sessionAffinityTimeout,
    labels,
    annotations,
    navigate,
  ]);

  // Port management
  const addPort = useCallback(() => {
    const newId = String(ports.length + 1);
    setPorts([
      ...ports,
      { id: newId, name: '', listeningPort: '', protocol: 'TCP', targetPort: '', nodePort: '' },
    ]);
  }, [ports]);

  const removePort = useCallback(
    (id: string) => {
      if (ports.length <= 1) return;
      setPorts(ports.filter((p) => p.id !== id));
    },
    [ports]
  );

  const updatePort = useCallback(
    (id: string, field: keyof Port, value: string) => {
      setPorts(ports.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    },
    [ports]
  );

  // External IP management
  const addExternalIP = useCallback(() => {
    const newId = String(externalIPs.length + 1);
    setExternalIPs([...externalIPs, { id: newId, value: '' }]);
  }, [externalIPs]);

  const removeExternalIP = useCallback(
    (id: string) => {
      setExternalIPs(externalIPs.filter((ip) => ip.id !== id));
    },
    [externalIPs]
  );

  const updateExternalIP = useCallback(
    (id: string, value: string) => {
      setExternalIPs(externalIPs.map((ip) => (ip.id === id ? { ...ip, value } : ip)));
    },
    [externalIPs]
  );

  // Selector management
  const addSelector = useCallback(() => {
    setSelectors([...selectors, { key: '', value: '' }]);
  }, [selectors]);

  const removeSelector = useCallback(
    (index: number) => {
      setSelectors(selectors.filter((_, i) => i !== index));
    },
    [selectors]
  );

  const updateSelector = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newSelectors = [...selectors];
      newSelectors[index][field] = value;
      setSelectors(newSelectors);
    },
    [selectors]
  );

  // Label management
  const addLabel = useCallback(() => {
    setLabels([...labels, { key: '', value: '' }]);
  }, [labels]);

  const removeLabel = useCallback(
    (index: number) => {
      setLabels(labels.filter((_, i) => i !== index));
    },
    [labels]
  );

  const updateLabel = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newLabels = [...labels];
      newLabels[index][field] = value;
      setLabels(newLabels);
    },
    [labels]
  );

  // Annotation management
  const addAnnotation = useCallback(() => {
    setAnnotations([...annotations, { key: '', value: '' }]);
  }, [annotations]);

  const removeAnnotation = useCallback(
    (index: number) => {
      setAnnotations(annotations.filter((_, i) => i !== index));
    },
    [annotations]
  );

  const updateAnnotation = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newAnnotations = [...annotations];
      newAnnotations[index][field] = value;
      setAnnotations(newAnnotations);
    },
    [annotations]
  );

  // Check if create button should be disabled
  const isCreateDisabled = !name.trim();

  // Determine which port columns to show based on service type
  const showNodePort = serviceType === 'NodePort' || serviceType === 'LoadBalancer';

  // Compute section statuses for summary
  const basicInfoComplete = name.trim().length > 0;
  const servicePortsComplete = ports.some((p) => p.name && p.listeningPort && p.targetPort);
  const ipAddressesComplete = true; // Optional section, always considered complete
  const selectorsComplete = true; // Optional section, always considered complete
  const sessionAffinityComplete = true; // Optional section, always considered complete
  const labelsAnnotationsComplete = true; // Optional section, always considered complete

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Container', href: '/container' },
                { label: 'Services', href: '/container/services' },
                { label: 'Create Service' },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Page Header */}
              <VStack gap={2}>
                <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create Service
                </h1>
                <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                  Services allow you to define a logical set of Pods that can be accessed with a
                  single IP address and port.
                </p>
              </VStack>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" showDivider />
                    <SectionCard.Content>
                      <VStack gap={4}>
                        {/* Service Type */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Service Type
                            <span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Select
                            options={SERVICE_TYPE_OPTIONS}
                            value={serviceType}
                            onChange={(value) => setServiceType(value)}
                            fullWidth
                          />
                          <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                            {SERVICE_TYPE_DESCRIPTIONS[serviceType]}
                          </span>
                        </VStack>

                        {/* Namespace */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Namespace
                            <span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Select
                            options={NAMESPACE_OPTIONS}
                            value={namespace}
                            onChange={(value) => setNamespace(value)}
                            fullWidth
                          />
                        </VStack>

                        {/* Name */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Name<span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Input
                            placeholder="Enter a unique name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (nameError) setNameError(null);
                            }}
                            error={!!nameError}
                            fullWidth
                          />
                          {nameError && (
                            <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                              {nameError}
                            </span>
                          )}
                        </VStack>

                        {/* Description */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Description
                          </label>
                          <Input
                            placeholder="Enter a description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                          />
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Service Ports Section */}
                  <SectionCard>
                    <SectionCard.Header title="Service Ports" showDivider />
                    <SectionCard.Content>
                      <VStack gap={4}>
                        {/* Port Fields */}
                        {ports.map((port, index) => (
                          <div
                            key={port.id}
                            className={`grid gap-2 w-full items-end ${
                              showNodePort
                                ? 'grid-cols-[1fr_1fr_1fr_1fr_1fr_32px]'
                                : 'grid-cols-[1fr_1fr_1fr_1fr_32px]'
                            }`}
                          >
                            <VStack gap={1}>
                              {index === 0 && (
                                <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Port Name{' '}
                                  <span className="text-[var(--color-state-danger)]">*</span>
                                </label>
                              )}
                              <Input
                                placeholder="e.g. myport"
                                value={port.name}
                                onChange={(e) => updatePort(port.id, 'name', e.target.value)}
                                fullWidth
                              />
                            </VStack>
                            <VStack gap={1}>
                              {index === 0 && (
                                <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Listening Port{' '}
                                  <span className="text-[var(--color-state-danger)]">*</span>
                                </label>
                              )}
                              <Input
                                placeholder="e.g. 8080"
                                value={port.listeningPort}
                                onChange={(e) =>
                                  updatePort(port.id, 'listeningPort', e.target.value)
                                }
                                fullWidth
                              />
                            </VStack>
                            <VStack gap={1}>
                              {index === 0 && (
                                <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Protocol
                                </label>
                              )}
                              <Select
                                options={PROTOCOL_OPTIONS}
                                value={port.protocol}
                                onChange={(value) => updatePort(port.id, 'protocol', value)}
                                fullWidth
                              />
                            </VStack>
                            <VStack gap={1}>
                              {index === 0 && (
                                <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Target Port{' '}
                                  <span className="text-[var(--color-state-danger)]">*</span>
                                </label>
                              )}
                              <Input
                                placeholder="e.g. 80 or http"
                                value={port.targetPort}
                                onChange={(e) => updatePort(port.id, 'targetPort', e.target.value)}
                                fullWidth
                              />
                            </VStack>
                            {showNodePort && (
                              <VStack gap={1}>
                                {index === 0 && (
                                  <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Node Port
                                  </label>
                                )}
                                <Input
                                  placeholder="e.g. 30000"
                                  value={port.nodePort || ''}
                                  onChange={(e) => updatePort(port.id, 'nodePort', e.target.value)}
                                  fullWidth
                                />
                              </VStack>
                            )}
                            <div className={index === 0 ? 'mt-auto' : ''}>
                              <button
                                onClick={() => removePort(port.id)}
                                className="w-8 h-9 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                disabled={ports.length <= 1}
                              >
                                <IconX
                                  size={14}
                                  className={
                                    ports.length <= 1
                                      ? 'text-[var(--color-text-disabled)]'
                                      : 'text-[var(--color-text-muted)]'
                                  }
                                  stroke={1.5}
                                />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add Port Button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconPlus size={12} stroke={1.5} />}
                          onClick={addPort}
                        >
                          Add Port
                        </Button>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* IP Addresses Section */}
                  <SectionCard>
                    <SectionCard.Header title="IP Addresses" showDivider />
                    <SectionCard.Content>
                      <VStack gap={4}>
                        {/* Cluster IP */}
                        <VStack gap={2} className="max-w-[50%]">
                          <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                            Cluster IP
                          </label>
                          <Input
                            placeholder="e.g. 10.0.0.1"
                            value={clusterIP}
                            onChange={(e) => setClusterIP(e.target.value)}
                            fullWidth
                          />
                        </VStack>

                        {/* Load Balancer IP (only for LoadBalancer type) */}
                        {serviceType === 'LoadBalancer' && (
                          <VStack gap={2} className="max-w-[50%]">
                            <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                              Load Balancer IP
                            </label>
                            <Input
                              placeholder="e.g. 203.0.113.1"
                              value={loadBalancerIP}
                              onChange={(e) => setLoadBalancerIP(e.target.value)}
                              fullWidth
                            />
                          </VStack>
                        )}

                        {/* External IPs */}
                        <VStack gap={2}>
                          <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                            External IPs
                          </label>
                          {externalIPs.map((ip) => (
                            <div key={ip.id} className="flex gap-2 items-center">
                              <Input
                                placeholder="e.g. 203.0.113.1"
                                value={ip.value}
                                onChange={(e) => updateExternalIP(ip.id, e.target.value)}
                                className="flex-1 max-w-[50%]"
                              />
                              <button
                                onClick={() => removeExternalIP(ip.id)}
                                className="w-8 h-9 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconX
                                  size={14}
                                  className="text-[var(--color-text-muted)]"
                                  stroke={1.5}
                                />
                              </button>
                            </div>
                          ))}
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconPlus size={12} stroke={1.5} />}
                            onClick={addExternalIP}
                          >
                            Add IP
                          </Button>
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Selectors Section */}
                  <SectionCard>
                    <SectionCard.Header title="Selectors" showDivider />
                    <SectionCard.Content>
                      <VStack gap={4}>
                        {selectors.length > 0 && (
                          <>
                            {/* Selector Header */}
                            <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                              <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                Key
                              </span>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                Value
                              </span>
                              <div />
                            </div>

                            {selectors.map((selector, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center"
                              >
                                <Input
                                  placeholder="Key"
                                  value={selector.key}
                                  onChange={(e) => updateSelector(index, 'key', e.target.value)}
                                  fullWidth
                                />
                                <Input
                                  placeholder="Value"
                                  value={selector.value}
                                  onChange={(e) => updateSelector(index, 'value', e.target.value)}
                                  fullWidth
                                />
                                <button
                                  onClick={() => removeSelector(index)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                >
                                  <IconX
                                    size={14}
                                    className="text-[var(--color-text-muted)]"
                                    stroke={1.5}
                                  />
                                </button>
                              </div>
                            ))}
                          </>
                        )}

                        <HStack gap={2}>
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<IconPlus size={12} stroke={1.5} />}
                            onClick={addSelector}
                          >
                            Add Rule
                          </Button>
                          <Button variant="secondary" size="sm">
                            Read from File
                          </Button>
                        </HStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Session Affinity Section */}
                  <SectionCard>
                    <SectionCard.Header title="Session Affinity" showDivider />
                    <SectionCard.Content>
                      <VStack gap={3}>
                        <RadioGroup
                          value={sessionAffinity}
                          onChange={(value) => setSessionAffinity(value as 'None' | 'ClientIP')}
                        >
                          <Radio value="None" label="There is no session affinity configured" />
                          <Radio value="ClientIP" label="Client IP" />
                        </RadioGroup>

                        {sessionAffinity === 'ClientIP' && (
                          <VStack gap={2} className="pl-6 max-w-[374px]">
                            <label className="text-[11px] font-medium text-[var(--color-text-default)]">
                              Timeout Seconds
                            </label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={sessionAffinityTimeout}
                                onChange={(e) => setSessionAffinityTimeout(e.target.value)}
                                className="flex-1"
                              />
                              <span className="text-[12px] text-[var(--color-text-default)]">
                                Seconds
                              </span>
                            </div>
                          </VStack>
                        )}
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Labels & Annotations Section */}
                  <SectionCard>
                    <SectionCard.Header title="Labels & Annotations" showDivider />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Labels */}
                        <VStack gap={3}>
                          <VStack gap={1}>
                            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Labels
                            </span>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the labels used to identify and categorize the resource.
                            </p>
                          </VStack>

                          {labels.length > 0 && (
                            <>
                              {/* Label Header */}
                              <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Key
                                </span>
                                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <div />
                              </div>

                              {labels.map((label, index) => (
                                <HStack gap={2} key={index} className="w-full">
                                  <Input
                                    placeholder="Key"
                                    value={label.key}
                                    onChange={(e) => updateLabel(index, 'key', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    placeholder="Value"
                                    value={label.value}
                                    onChange={(e) => updateLabel(index, 'value', e.target.value)}
                                    className="flex-1"
                                  />
                                  <button
                                    onClick={() => removeLabel(index)}
                                    className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  >
                                    <IconX
                                      size={14}
                                      className="text-[var(--color-text-muted)]"
                                      stroke={1.5}
                                    />
                                  </button>
                                </HStack>
                              ))}
                            </>
                          )}

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

                        {/* Annotations */}
                        <VStack gap={3}>
                          <VStack gap={1}>
                            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Annotations
                            </span>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the annotations used to provide additional metadata for the
                              resource.
                            </p>
                          </VStack>

                          {annotations.length > 0 && (
                            <>
                              {/* Annotation Header */}
                              <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Key
                                </span>
                                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <div />
                              </div>

                              {annotations.map((annotation, index) => (
                                <HStack gap={2} key={index} className="w-full">
                                  <Input
                                    placeholder="Key"
                                    value={annotation.key}
                                    onChange={(e) => updateAnnotation(index, 'key', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    placeholder="Value"
                                    value={annotation.value}
                                    onChange={(e) =>
                                      updateAnnotation(index, 'value', e.target.value)
                                    }
                                    className="flex-1"
                                  />
                                  <button
                                    onClick={() => removeAnnotation(index)}
                                    className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  >
                                    <IconX
                                      size={14}
                                      className="text-[var(--color-text-muted)]"
                                      stroke={1.5}
                                    />
                                  </button>
                                </HStack>
                              ))}
                            </>
                          )}

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
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* Summary Sidebar */}
                <div className="w-[280px] shrink-0">
                  <div className="sticky top-4">
                    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[8px] shadow-[var(--shadow-md)] overflow-hidden flex flex-col gap-6 pt-3 pb-4 px-3">
                      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[8px] px-4 py-4">
                        <VStack gap={4}>
                          <h5 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                            Summary
                          </h5>
                          <VStack gap={0}>
                            <SummaryItem
                              label="Basic Information"
                              status={basicInfoComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Service Ports"
                              status={servicePortsComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="IP Addresses"
                              status={ipAddressesComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Selectors"
                              status={selectorsComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Session Affinity"
                              status={sessionAffinityComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Labels & Annotations"
                              status={labelsAnnotationsComplete ? 'complete' : 'in-progress'}
                            />
                          </VStack>
                        </VStack>
                      </div>
                      <HStack gap={2} className="w-full justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancel}
                          className="w-[80px]"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleCreate}
                          className="flex-1 min-w-[80px]"
                          disabled={isCreateDisabled}
                        >
                          Create Service
                        </Button>
                      </HStack>
                    </div>
                  </div>
                </div>
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateServicePage;
