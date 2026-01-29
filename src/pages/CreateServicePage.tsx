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
  Disclosure,
  SectionCard,
  Radio,
  RadioGroup,
} from '@/design-system';
import type { WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconPlus,
  IconX,
  IconCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ServiceSectionStep =
  | 'basic-info'
  | 'service-ports'
  | 'ip-addresses'
  | 'selectors'
  | 'session-affinity'
  | 'labels-annotations';

type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const SERVICE_SECTION_LABELS: Record<ServiceSectionStep, string> = {
  'basic-info': 'Basic Information',
  'service-ports': 'Service Ports',
  'ip-addresses': 'IP Addresses',
  selectors: 'Selectors',
  'session-affinity': 'Session Affinity',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const SERVICE_SECTION_ORDER: ServiceSectionStep[] = [
  'basic-info',
  'service-ports',
  'ip-addresses',
  'selectors',
  'session-affinity',
  'labels-annotations',
];

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
   Summary Status Icon Component
   ---------------------------------------- */

function SummaryStatusIcon({ status }: { status: WizardSectionState }) {
  // done → success (green check)
  if (status === 'done') {
    return (
      <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center">
        <IconCheck size={10} stroke={2} className="text-white" />
      </div>
    );
  }
  // active → dashed circle with spinning animation
  if (status === 'active') {
    return (
      <div
        className="size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }
  // pre/default → empty dashed circle
  return (
    <div
      className="size-4 rounded-full border border-[var(--color-border-default)] shrink-0"
      style={{ borderStyle: 'dashed' }}
    />
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<ServiceSectionStep, SectionState>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  // Map SectionState to WizardSectionState
  const mapState = (state: SectionState): WizardSectionState => {
    if (state === 'pre') return 'pre';
    if (state === 'active') return 'active';
    if (state === 'writing') return 'writing';
    return 'done';
  };

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Summary Content */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Title */}
            <span className="text-heading-h5 text-[var(--color-text-default)]">
              Summary
            </span>

            <VStack gap={0}>
              {SERVICE_SECTION_ORDER.map((key) => {
                const status = mapState(sectionStatus[key]);
                return (
                  <HStack key={key} justify="between" align="center" className="py-1">
                    <span className="text-body-md text-[var(--color-text-default)]">
                      {SERVICE_SECTION_LABELS[key]}
                    </span>
                    {status === 'writing' ? (
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Writing...
                      </span>
                    ) : (
                      <SummaryStatusIcon status={status} />
                    )}
                  </HStack>
                );
              })}
            </VStack>
          </VStack>
        </div>

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCreate}
            disabled={isCreateDisabled}
            className="flex-1"
          >
            Create Service
          </Button>
        </HStack>
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

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<ServiceSectionStep, SectionState>>({
    'basic-info': 'active',
    'service-ports': 'done',
    'ip-addresses': 'done',
    selectors: 'done',
    'session-affinity': 'done',
    'labels-annotations': 'done',
  });

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
                <h1 className="text-heading-h5 text-[var(--color-text-default)]">
                  Create Service
                </h1>
                <p className="text-body-sm text-[var(--color-text-subtle)]">
                  Services allow you to define a logical set of Pods that can be accessed with a
                  single IP address and port.
                </p>
              </VStack>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={3} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard isActive={sectionStatus['basic-info'] === 'active'}>
                    <SectionCard.Header title="Basic Information" showDivider />
                    <SectionCard.Content>
                      <VStack gap={4}>
                        {/* Service Type */}
                        <VStack gap={2}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
                            Service Type
                            <span className="text-[var(--color-state-danger)]"> *</span>
                          </label>
                          <Select
                            options={SERVICE_TYPE_OPTIONS}
                            value={serviceType}
                            onChange={(value) => setServiceType(value)}
                            fullWidth
                          />
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            {SERVICE_TYPE_DESCRIPTIONS[serviceType]}
                          </span>
                        </VStack>

                        {/* Namespace */}
                        <VStack gap={2}>
                          <label className="text-label-lg text-[var(--color-text-default)]">
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
                          <label className="text-label-lg text-[var(--color-text-default)]">
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
                            <span className="text-body-sm text-[var(--color-state-danger)]">
                              {nameError}
                            </span>
                          )}
                        </VStack>

                        {/* Description (Collapsible) */}
                        <Disclosure title="Description" defaultOpen={false}>
                          <Input
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                          />
                        </Disclosure>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Service Ports Section */}
                  <SectionCard>
                    <Disclosure title="Service Ports" defaultOpen={true}>
                      <VStack gap={4} className="py-3">
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
                                <label className="text-label-sm text-[var(--color-text-default)]">
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
                                <label className="text-label-sm text-[var(--color-text-default)]">
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
                                <label className="text-label-sm text-[var(--color-text-default)]">
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
                                <label className="text-label-sm text-[var(--color-text-default)]">
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
                                  <label className="text-label-sm text-[var(--color-text-default)]">
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
                          variant="outline"
                          size="sm"
                          leftIcon={<IconPlus size={12} stroke={1.5} />}
                          onClick={addPort}
                        >
                          Add Port
                        </Button>
                      </VStack>
                    </Disclosure>
                  </SectionCard>

                  {/* IP Addresses Section */}
                  <SectionCard>
                    <Disclosure title="IP Addresses" defaultOpen={true}>
                      <VStack gap={4} className="py-3">
                        {/* Cluster IP */}
                        <VStack gap={2} className="max-w-[50%]">
                          <label className="text-label-sm text-[var(--color-text-default)]">
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
                            <label className="text-label-sm text-[var(--color-text-default)]">
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
                          <label className="text-label-sm text-[var(--color-text-default)]">
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
                            variant="outline"
                            size="sm"
                            leftIcon={<IconPlus size={12} stroke={1.5} />}
                            onClick={addExternalIP}
                          >
                            Add IP
                          </Button>
                        </VStack>
                      </VStack>
                    </Disclosure>
                  </SectionCard>

                  {/* Selectors Section */}
                  <SectionCard>
                    <Disclosure title="Selectors" defaultOpen={true}>
                      <VStack gap={4} className="py-3">
                        {selectors.length > 0 && (
                          <>
                            {/* Selector Header */}
                            <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                              <span className="text-label-sm text-[var(--color-text-default)]">
                                Key
                              </span>
                              <span className="text-label-sm text-[var(--color-text-default)]">
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
                            variant="outline"
                            size="sm"
                            leftIcon={<IconPlus size={12} stroke={1.5} />}
                            onClick={addSelector}
                          >
                            Add Rule
                          </Button>
                          <Button variant="outline" size="sm">
                            Read from File
                          </Button>
                        </HStack>
                      </VStack>
                    </Disclosure>
                  </SectionCard>

                  {/* Session Affinity Section */}
                  <SectionCard>
                    <Disclosure title="Session Affinity" defaultOpen={true}>
                      <VStack gap={3} className="py-3">
                        <RadioGroup
                          value={sessionAffinity}
                          onChange={(value) => setSessionAffinity(value as 'None' | 'ClientIP')}
                        >
                          <Radio value="None" label="There is no session affinity configured" />
                          <Radio value="ClientIP" label="Client IP" />
                        </RadioGroup>

                        {sessionAffinity === 'ClientIP' && (
                          <VStack gap={2} className="pl-6 max-w-[374px]">
                            <label className="text-label-sm text-[var(--color-text-default)]">
                              Timeout Seconds
                            </label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={sessionAffinityTimeout}
                                onChange={(e) => setSessionAffinityTimeout(e.target.value)}
                                className="flex-1"
                              />
                              <span className="text-body-md text-[var(--color-text-default)]">
                                Seconds
                              </span>
                            </div>
                          </VStack>
                        )}
                      </VStack>
                    </Disclosure>
                  </SectionCard>

                  {/* Labels & Annotations Section */}
                  <SectionCard>
                    <Disclosure title="Labels & Annotations" defaultOpen={true}>
                      <VStack gap={6} className="py-3">
                        {/* Labels */}
                        <VStack gap={3}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Labels
                          </span>

                          {labels.length > 0 && (
                            <>
                              {/* Label Header */}
                              <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                                <span className="text-label-sm text-[var(--color-text-default)]">
                                  Key
                                </span>
                                <span className="text-label-sm text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <div />
                              </div>

                              {labels.map((label, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center"
                                >
                                  <Input
                                    placeholder="Key"
                                    value={label.key}
                                    onChange={(e) => updateLabel(index, 'key', e.target.value)}
                                    fullWidth
                                  />
                                  <Input
                                    placeholder="Value"
                                    value={label.value}
                                    onChange={(e) => updateLabel(index, 'value', e.target.value)}
                                    fullWidth
                                  />
                                  <button
                                    onClick={() => removeLabel(index)}
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

                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<IconPlus size={12} stroke={1.5} />}
                            onClick={addLabel}
                          >
                            Add Label
                          </Button>
                        </VStack>

                        {/* Annotations */}
                        <VStack gap={3}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Annotations
                          </span>

                          {annotations.length > 0 && (
                            <>
                              {/* Annotation Header */}
                              <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                                <span className="text-label-sm text-[var(--color-text-default)]">
                                  Key
                                </span>
                                <span className="text-label-sm text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <div />
                              </div>

                              {annotations.map((annotation, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center"
                                >
                                  <Input
                                    placeholder="Key"
                                    value={annotation.key}
                                    onChange={(e) => updateAnnotation(index, 'key', e.target.value)}
                                    fullWidth
                                  />
                                  <Input
                                    placeholder="Value"
                                    value={annotation.value}
                                    onChange={(e) =>
                                      updateAnnotation(index, 'value', e.target.value)
                                    }
                                    fullWidth
                                  />
                                  <button
                                    onClick={() => removeAnnotation(index)}
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

                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<IconPlus size={12} stroke={1.5} />}
                            onClick={addAnnotation}
                          >
                            Add Annotation
                          </Button>
                        </VStack>
                      </VStack>
                    </Disclosure>
                  </SectionCard>
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar
                  sectionStatus={sectionStatus}
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  isCreateDisabled={isCreateDisabled}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateServicePage;
