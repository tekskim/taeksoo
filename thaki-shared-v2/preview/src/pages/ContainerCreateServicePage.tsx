import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input, NumberInput } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Dropdown } from '@shared/components/Dropdown';
import { Disclosure } from '@shared/components/Disclosure';
import { InlineMessage } from '@shared/components/InlineMessage';
import { Title } from '@shared/components/Title';
import { Range } from '@shared/components/Range';
import { RadioGroup, Radio } from '../components/TdsRadioCompat';
import { IconX, IconCheck, IconCirclePlus } from '@tabler/icons-react';

type WizardSectionState = 'pre' | 'active' | 'done' | 'writing';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ServiceSectionStep =
  | 'basic-info'
  | 'external-name'
  | 'service-ports'
  | 'ip-addresses'
  | 'selectors'
  | 'session-affinity'
  | 'labels-annotations';

type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const SERVICE_SECTION_LABELS: Record<ServiceSectionStep, string> = {
  'basic-info': 'Basic information',
  'external-name': 'External name',
  'service-ports': 'Service ports',
  'ip-addresses': 'IP addresses',
  selectors: 'Selectors',
  'session-affinity': 'Session affinity',
  'labels-annotations': 'Labels & annotations',
};

// Section order for navigation
const SERVICE_SECTION_ORDER: ServiceSectionStep[] = [
  'basic-info',
  'external-name',
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
  { value: 'NodePort', label: 'Node port' },
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

interface MatchingPod {
  id: string;
  name: string;
  createdAt: string;
}

// Mock data for matching pods
const MOCK_MATCHING_PODS: MatchingPod[] = [
  {
    id: '1',
    name: 'deploymentName-77f6bb9c69-4ww7f',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
];

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
          <div className="flex flex-col gap-3">
            {/* Title */}
            <span className="text-heading-h5 text-[var(--color-text-default)]">Summary</span>

            <div className="flex flex-col gap-0">
              {SERVICE_SECTION_ORDER.map((key) => {
                const status = mapState(sectionStatus[key]);
                return (
                  <div key={key} className="flex flex-row items-center justify-between py-1">
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCreate}
            disabled={isCreateDisabled}
            className="flex-1"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function ContainerCreateServicePage() {
  const navigate = useNavigate();
  const isV2 = true;

  // Basic information state
  const [serviceType, setServiceType] = useState(isV2 ? 'NodePort' : 'ClusterIP');
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Ports state
  const [ports, setPorts] = useState<Port[]>([
    { id: '1', name: '', listeningPort: '', protocol: 'TCP', targetPort: '', nodePort: '' },
  ]);

  // External traffic policy state
  const [externalTrafficPolicy, setExternalTrafficPolicy] = useState('Cluster');

  // IP Addresses state
  const [clusterIP, setClusterIP] = useState('');
  const [loadBalancerIP, setLoadBalancerIP] = useState('');
  const [externalIPs, setExternalIPs] = useState<ExternalIP[]>(
    isV2 ? [{ id: 'default-1', value: '' }] : []
  );

  // Selectors state
  const [selectors, setSelectors] = useState<Selector[]>(isV2 ? [{ key: '', value: '' }] : []);

  // Session Affinity state
  const [sessionAffinity, setSessionAffinity] = useState<'None' | 'ClientIP'>(
    isV2 ? 'ClientIP' : 'None'
  );
  const [sessionAffinityTimeout, setSessionAffinityTimeout] = useState(10800);

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<ServiceSectionStep, SectionState>>({
    'basic-info': 'active',
    'external-name': 'done',
    'service-ports': 'done',
    'ip-addresses': 'done',
    selectors: 'done',
    'session-affinity': 'done',
    'labels-annotations': 'done',
  });

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);

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

  const [matchingPodPreview, setMatchingPodPreview] = useState<string>(
    MOCK_MATCHING_PODS[0]?.id ?? ''
  );

  return (
    <div className="flex flex-col gap-6 pt-4 px-8 pb-20">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <Title title="Create service" size="large" />
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Services allow you to define a logical set of Pods that can be accessed with a single IP
            address and port.
          </p>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-row gap-6 items-start w-full">
          {/* Form Content */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Basic Information Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                  Basic information
                </h2>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  {/* Service Type */}
                  <FormField
                    label="Service type"
                    required
                    hint={SERVICE_TYPE_DESCRIPTIONS[serviceType]}
                  >
                    <Dropdown.Select
                      className="w-full"
                      value={serviceType}
                      onChange={(value) => setServiceType(String(value))}
                      placeholder=""
                    >
                      {SERVICE_TYPE_OPTIONS.map((opt) => (
                        <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                      ))}
                    </Dropdown.Select>
                  </FormField>

                  {/* Namespace */}
                  <FormField label="Namespace" required>
                    <Dropdown.Select
                      className="w-full"
                      value={namespace}
                      onChange={(value) => setNamespace(String(value))}
                      placeholder=""
                    >
                      {NAMESPACE_OPTIONS.map((opt) => (
                        <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                      ))}
                    </Dropdown.Select>
                  </FormField>

                  {/* Name */}
                  <FormField label="Name" required error={nameError ?? undefined}>
                    <Input
                      placeholder="Enter a unique name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      error={!!nameError}
                      className="w-full"
                    />
                  </FormField>

                  {/* Description (Collapsible) */}
                  <Disclosure label="Description" expanded={isV2}>
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

            {/* External Name Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">External name</h2>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  {/* DNS Name */}
                  <FormField label="DNS name" required error={nameError ?? undefined}>
                    <Input
                      placeholder="e.g. my.database.example.com"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      error={!!nameError}
                      className="w-full"
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Service Ports Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">Service ports</h2>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-label-lg text-[var(--color-text-default)] italic">
                      Cluster IP, Headless
                    </span>
                    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                      <div className="flex flex-col gap-1.5">
                        {/* Header row */}
                        {ports.length > 0 && (
                          <div
                            className={`grid gap-1 w-full ${
                              showNodePort
                                ? 'grid-cols-[1fr_1fr_1fr_1fr_1fr_20px]'
                                : 'grid-cols-[1fr_1fr_1fr_1fr_20px]'
                            }`}
                          >
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Port name <span className="text-[#ea580c]">*</span>
                            </span>
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Listening port <span className="text-[#ea580c]">*</span>
                            </span>
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Protocol
                            </span>
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              Target port <span className="text-[#ea580c]">*</span>
                            </span>
                            {showNodePort && (
                              <span className="block text-label-sm text-[var(--color-text-default)]">
                                Node port
                              </span>
                            )}
                            <div className="w-5" />
                          </div>
                        )}

                        {/* Port rows */}
                        {ports.map((port) => (
                          <div
                            key={port.id}
                            className={`grid gap-1 w-full items-center ${
                              showNodePort
                                ? 'grid-cols-[1fr_1fr_1fr_1fr_1fr_20px]'
                                : 'grid-cols-[1fr_1fr_1fr_1fr_20px]'
                            }`}
                          >
                            <Input
                              placeholder="e.g. myport"
                              value={port.name}
                              onChange={(e) => updatePort(port.id, 'name', e.target.value)}
                              className="w-full"
                            />
                            <Input
                              placeholder="e.g. 8080"
                              value={port.listeningPort}
                              onChange={(e) => updatePort(port.id, 'listeningPort', e.target.value)}
                              className="w-full"
                            />
                            <Dropdown.Select
                              className="w-full"
                              value={port.protocol}
                              onChange={(value) => updatePort(port.id, 'protocol', String(value))}
                              placeholder=""
                            >
                              {PROTOCOL_OPTIONS.map((opt) => (
                                <Dropdown.Option
                                  key={opt.value}
                                  value={opt.value}
                                  label={opt.label}
                                />
                              ))}
                            </Dropdown.Select>
                            <Input
                              placeholder="e.g. 80 or http"
                              value={port.targetPort}
                              onChange={(e) => updatePort(port.id, 'targetPort', e.target.value)}
                              className="w-full"
                            />
                            {showNodePort && (
                              <Input
                                placeholder="e.g. 30000"
                                value={port.nodePort || ''}
                                onChange={(e) => updatePort(port.id, 'nodePort', e.target.value)}
                                className="w-full"
                              />
                            )}
                            <button
                              onClick={() => removePort(port.id)}
                              className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              disabled={ports.length <= 1}
                            >
                              <IconX
                                size={16}
                                className={
                                  ports.length <= 1
                                    ? 'text-[var(--color-text-disabled)]'
                                    : 'text-[var(--color-text-muted)]'
                                }
                                stroke={1.5}
                              />
                            </button>
                          </div>
                        ))}

                        {/* Add port Button */}
                        <div className="w-fit">
                          <Button variant="secondary" size="sm" onClick={addPort}>
                            Add port
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-label-lg text-[var(--color-text-default)] italic">
                      Load Balancer
                    </span>
                    <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                      <div className="flex flex-col gap-6">
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {/* Header row */}
                            {ports.length > 0 && (
                              <div
                                className={`grid gap-1 w-full ${
                                  showNodePort
                                    ? 'grid-cols-[1fr_1fr_1fr_1fr_1fr_20px]'
                                    : 'grid-cols-[1fr_1fr_1fr_1fr_20px]'
                                }`}
                              >
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Port name <span className="text-[#ea580c]">*</span>
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Listening port <span className="text-[#ea580c]">*</span>
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Protocol
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Target port <span className="text-[#ea580c]">*</span>
                                </span>
                                {showNodePort && (
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    Node port
                                  </span>
                                )}
                                <div className="w-5" />
                              </div>
                            )}

                            {/* Port rows */}
                            {ports.map((port) => (
                              <div
                                key={port.id}
                                className={`grid gap-1 w-full items-center ${
                                  showNodePort
                                    ? 'grid-cols-[1fr_1fr_1fr_1fr_1fr_20px]'
                                    : 'grid-cols-[1fr_1fr_1fr_1fr_20px]'
                                }`}
                              >
                                <Input
                                  placeholder="e.g. myport"
                                  value={port.name}
                                  onChange={(e) => updatePort(port.id, 'name', e.target.value)}
                                  className="w-full"
                                />
                                <Input
                                  placeholder="e.g. 8080"
                                  value={port.listeningPort}
                                  onChange={(e) =>
                                    updatePort(port.id, 'listeningPort', e.target.value)
                                  }
                                  className="w-full"
                                />
                                <Dropdown.Select
                                  className="w-full"
                                  value={port.protocol}
                                  onChange={(value) =>
                                    updatePort(port.id, 'protocol', String(value))
                                  }
                                  placeholder=""
                                >
                                  {PROTOCOL_OPTIONS.map((opt) => (
                                    <Dropdown.Option
                                      key={opt.value}
                                      value={opt.value}
                                      label={opt.label}
                                    />
                                  ))}
                                </Dropdown.Select>
                                <Input
                                  placeholder="e.g. 80 or http"
                                  value={port.targetPort}
                                  onChange={(e) =>
                                    updatePort(port.id, 'targetPort', e.target.value)
                                  }
                                  className="w-full"
                                />
                                {showNodePort && (
                                  <Input
                                    placeholder="e.g. 30000"
                                    value={port.nodePort || ''}
                                    onChange={(e) =>
                                      updatePort(port.id, 'nodePort', e.target.value)
                                    }
                                    className="w-full"
                                  />
                                )}
                                <button
                                  onClick={() => removePort(port.id)}
                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  disabled={ports.length <= 1}
                                >
                                  <IconX
                                    size={16}
                                    className={
                                      ports.length <= 1
                                        ? 'text-[var(--color-text-disabled)]'
                                        : 'text-[var(--color-text-muted)]'
                                    }
                                    stroke={1.5}
                                  />
                                </button>
                              </div>
                            ))}

                            {/* Add port Button */}
                            <div className="w-fit">
                              <Button variant="secondary" size="sm" onClick={addPort}>
                                Add port
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* External traffic policy */}
                        <div className="flex flex-col gap-2">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            External traffic policy{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </span>
                          <RadioGroup
                            value={externalTrafficPolicy}
                            onChange={setExternalTrafficPolicy}
                          >
                            <div className="flex flex-col gap-2">
                              <Radio value="Cluster" label="Cluster" />
                              <Radio value="Local" label="Local" />
                            </div>
                          </RadioGroup>
                          <InlineMessage variant="warning">
                            In Cluster mode, health checks may not accurately reflect pod
                            availability on individual nodes.
                          </InlineMessage>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-label-lg text-[var(--color-text-default)] italic">
                      Node port
                    </span>
                    <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                      <div className="flex flex-col gap-6">
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {/* Header row */}
                            {ports.length > 0 && (
                              <div
                                className={`grid gap-1 w-full ${
                                  showNodePort
                                    ? 'grid-cols-[1fr_1fr_1fr_1fr_20px]'
                                    : 'grid-cols-[1fr_1fr_1fr_20px]'
                                }`}
                              >
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Port name <span className="text-[#ea580c]">*</span>
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Listening port <span className="text-[#ea580c]">*</span>
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Target port <span className="text-[#ea580c]">*</span>
                                </span>
                                {showNodePort && (
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    Node port
                                  </span>
                                )}
                                <div className="w-5" />
                              </div>
                            )}

                            {/* Port rows */}
                            {ports.map((port) => (
                              <div
                                key={port.id}
                                className={`grid gap-1 w-full items-center ${
                                  showNodePort
                                    ? 'grid-cols-[1fr_1fr_1fr_1fr_20px]'
                                    : 'grid-cols-[1fr_1fr_1fr_20px]'
                                }`}
                              >
                                <Input
                                  placeholder="e.g. myport"
                                  value={port.name}
                                  onChange={(e) => updatePort(port.id, 'name', e.target.value)}
                                  className="w-full"
                                />
                                <Input
                                  placeholder="e.g. 8080"
                                  value={port.listeningPort}
                                  onChange={(e) =>
                                    updatePort(port.id, 'listeningPort', e.target.value)
                                  }
                                  className="w-full"
                                />
                                <Input
                                  placeholder="e.g. 80 or http"
                                  value={port.targetPort}
                                  onChange={(e) =>
                                    updatePort(port.id, 'targetPort', e.target.value)
                                  }
                                  className="w-full"
                                />
                                {showNodePort && (
                                  <Input
                                    placeholder="e.g. 30000"
                                    value={port.nodePort || ''}
                                    onChange={(e) =>
                                      updatePort(port.id, 'nodePort', e.target.value)
                                    }
                                    className="w-full"
                                  />
                                )}
                                <button
                                  onClick={() => removePort(port.id)}
                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  disabled={ports.length <= 1}
                                >
                                  <IconX
                                    size={16}
                                    className={
                                      ports.length <= 1
                                        ? 'text-[var(--color-text-disabled)]'
                                        : 'text-[var(--color-text-muted)]'
                                    }
                                    stroke={1.5}
                                  />
                                </button>
                              </div>
                            ))}

                            {/* Add port Button */}
                            <div className="w-fit">
                              <Button variant="secondary" size="sm" onClick={addPort}>
                                Add port
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* External traffic policy */}
                        <div className="flex flex-col gap-2">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            External traffic policy{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </span>
                          <RadioGroup
                            value={externalTrafficPolicy}
                            onChange={setExternalTrafficPolicy}
                          >
                            <div className="flex flex-col gap-2">
                              <Radio value="Cluster" label="Cluster" />
                              <Radio value="Local" label="Local" />
                            </div>
                          </RadioGroup>
                          <InlineMessage variant="warning">
                            In Cluster mode, health checks may not accurately reflect pod
                            availability on individual nodes.
                          </InlineMessage>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IP Addresses Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">IP addresses</h2>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  {/* Cluster IP */}
                  <FormField label="Cluster IP">
                    <Input
                      placeholder="e.g. 1.1.1.1"
                      value={clusterIP}
                      onChange={(e) => setClusterIP(e.target.value)}
                      className="w-full"
                    />
                  </FormField>

                  {/* Load Balancer IP */}
                  <FormField label="Load balancer IP">
                    <Input
                      placeholder="e.g. 1.1.1.1"
                      value={loadBalancerIP}
                      onChange={(e) => setLoadBalancerIP(e.target.value)}
                      className="w-full"
                    />
                  </FormField>

                  {/* External IPs */}
                  <div className="flex flex-col gap-2">
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      External IPs
                    </label>
                    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                      <div className="flex flex-col gap-1.5">
                        {externalIPs.length > 0 && (
                          <div className="grid grid-cols-[1fr_20px] gap-1 w-full">
                            <span className="block text-label-sm text-[var(--color-text-default)]">
                              External IP
                            </span>
                            <div className="w-5" />
                          </div>
                        )}
                        {externalIPs.map((ip) => (
                          <div
                            key={ip.id}
                            className="grid grid-cols-[1fr_20px] gap-1 w-full items-center"
                          >
                            <Input
                              placeholder="e.g. 1.1.1.1"
                              value={ip.value}
                              onChange={(e) => updateExternalIP(ip.id, e.target.value)}
                              className="w-full"
                            />
                            <button
                              onClick={() => removeExternalIP(ip.id)}
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
                          <Button variant="secondary" size="sm" onClick={addExternalIP}>
                            Add IP
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selectors Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">Selectors</h2>
              </div>
              <p className="text-body-md text-[var(--color-text-subtle)] px-4 -mt-2 mb-2">
                Selector keys and values are intended to match labels and values on existing pods.
              </p>
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-label-lg text-[var(--color-text-default)]">
                      Keys and values
                    </span>
                    {selectors.length === 0 ? (
                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                        <div className="flex flex-row gap-2">
                          <Button variant="secondary" size="sm" onClick={addSelector}>
                            Add rule
                          </Button>
                          <Button variant="secondary" size="sm">
                            Read from File
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                        <div className="flex flex-col gap-1.5">
                          {selectors.length > 0 && (
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
                          {selectors.map((selector, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                            >
                              <Input
                                placeholder="e.g. key"
                                value={selector.key}
                                onChange={(e) => updateSelector(index, 'key', e.target.value)}
                                className="w-full"
                              />
                              <Input
                                placeholder="e.g. value"
                                value={selector.value}
                                onChange={(e) => updateSelector(index, 'value', e.target.value)}
                                className="w-full"
                              />
                              <button
                                onClick={() => removeSelector(index)}
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

                          <div className="flex flex-row gap-2">
                            <Button variant="secondary" size="sm" onClick={addSelector}>
                              Add rule
                            </Button>
                            <Button variant="secondary" size="sm">
                              Read from File
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <FormField label="Matching pod (preview)">
                    <Dropdown.Select
                      className="w-full"
                      value={matchingPodPreview}
                      onChange={(v) => setMatchingPodPreview(String(v))}
                      placeholder="Select pod"
                    >
                      {MOCK_MATCHING_PODS.map((pod) => (
                        <Dropdown.Option
                          key={pod.id}
                          value={pod.id}
                          label={`${pod.name} — ${pod.createdAt}`}
                        />
                      ))}
                    </Dropdown.Select>
                  </FormField>
                </div>
              </div>
            </div>

            {/* Session Affinity Section */}
            <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
              <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                  Session affinity
                </h2>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <RadioGroup
                      value={sessionAffinity}
                      onChange={(value) => setSessionAffinity(value as 'None' | 'ClientIP')}
                    >
                      <Radio value="None" label="There is no session affinity configured" />
                      <Radio value="ClientIP" label="Client IP" />
                    </RadioGroup>
                  </div>

                  {(isV2 || sessionAffinity === 'ClientIP') && (
                    <div className="flex flex-col gap-3">
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Session sticky time
                      </label>
                      <div className="flex flex-row gap-3 items-center">
                        <Range
                          min={1}
                          max={86400}
                          step={100}
                          value={sessionAffinityTimeout}
                          onChange={setSessionAffinityTimeout}
                        />
                        <NumberInput
                          value={sessionAffinityTimeout}
                          onChange={setSessionAffinityTimeout}
                          min={1}
                          max={86400}
                          step={1}
                          width="sm"
                          suffix="Seconds"
                        />
                      </div>
                      <span className="text-body-sm text-[var(--color-text-subtle)]">1–86400</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Labels & Annotations Section */}
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
                        {labels.map((label, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                          >
                            <Input
                              placeholder="label key"
                              value={label.key}
                              onChange={(e) => updateLabel(index, 'key', e.target.value)}
                              className="w-full"
                            />
                            <Input
                              placeholder="label value"
                              value={label.value}
                              onChange={(e) => updateLabel(index, 'value', e.target.value)}
                              className="w-full"
                            />
                            <button
                              onClick={() => removeLabel(index)}
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
                      <p className="text-body-md text-[var(--color-text-subtle)]">
                        Specify the annotations used to provide additional metadata for the
                        resource.
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
                        {annotations.map((annotation, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                          >
                            <Input
                              placeholder="annotation key"
                              value={annotation.key}
                              onChange={(e) => updateAnnotation(index, 'key', e.target.value)}
                              className="w-full"
                            />
                            <Input
                              placeholder="annotation value"
                              value={annotation.value}
                              onChange={(e) => updateAnnotation(index, 'value', e.target.value)}
                              className="w-full"
                            />
                            <button
                              onClick={() => removeAnnotation(index)}
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

          {/* Summary Sidebar */}
          <SummarySidebar
            sectionStatus={sectionStatus}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </div>
      </div>
    </div>
  );
}
