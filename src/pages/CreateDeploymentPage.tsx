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
  NumberInput,
  Disclosure,
  SectionCard,
  Radio,
  RadioGroup,
  Checkbox,
  Tabs,
  TabList,
  Tab,
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
  IconX,
  IconCirclePlus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

// Section state management removed - all sections are always visible

// Namespace options
const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'production', label: 'production' },
];

// Unit options
const UNIT_OPTIONS = [
  { value: '%', label: '%' },
  { value: 'pods', label: 'Pods' },
];

interface Label {
  key: string;
  value: string;
}

interface Annotation {
  key: string;
  value: string;
}

interface ContainerTab {
  id: string;
  name: string;
}

/* ----------------------------------------
   Summary Sidebar Component
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

interface SummarySidebarProps {
  name: string;
  containerTabs: ContainerTab[];
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  name,
  containerTabs,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  // Simple completion checks based on required fields
  const basicInfoComplete = name.trim().length > 0;
  const deploymentComplete = basicInfoComplete; // All deployment sections are optional except name
  const podComplete = true; // All pod sections are optional
  const containersComplete = containerTabs.length > 0; // At least one container exists

  return (
    <div className="w-[280px] shrink-0 self-start">
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
                  label="Labels & Annotations"
                  status={deploymentComplete ? 'complete' : 'in-progress'}
                />
                <SummaryItem
                  label="Scaling Policy"
                  status={deploymentComplete ? 'complete' : 'in-progress'}
                />
                <SummaryItem
                  label="Pod Settings"
                  status={podComplete ? 'complete' : 'in-progress'}
                />
                {containerTabs.map((container) => (
                  <SummaryItem
                    key={container.id}
                    label={container.name}
                    status={containersComplete ? 'complete' : 'in-progress'}
                  />
                ))}
              </VStack>
            </VStack>
          </div>
          <HStack gap={2} className="w-full justify-end">
            <Button variant="secondary" size="sm" onClick={onCancel} className="w-[80px]">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onCreate}
              className="flex-1 min-w-[80px]"
              disabled={isCreateDisabled}
            >
              Create
            </Button>
          </HStack>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   BasicInfoSection Component
   ---------------------------------------- */

interface BasicInfoSectionProps {
  namespace: string;
  onNamespaceChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  nameError: string | null;
  onNameErrorChange: (error: string | null) => void;
  replicas: number;
  onReplicasChange: (value: number) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

function BasicInfoSection({
  namespace,
  onNamespaceChange,
  name,
  onNameChange,
  nameError,
  onNameErrorChange,
  replicas,
  onReplicasChange,
  description,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Basic Information" />
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Namespace */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Namespace<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <Select
              options={NAMESPACE_OPTIONS}
              value={namespace}
              onChange={(value) => onNamespaceChange(value)}
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
                onNameChange(e.target.value);
                if (nameError) onNameErrorChange(null);
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

          {/* Replicas */}
          <VStack gap={2}>
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
              Replicas<span className="text-[var(--color-state-danger)]"> *</span>
            </label>
            <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
              Select the number of pod replicas to create.
            </p>
            <NumberInput
              value={replicas}
              onChange={onReplicasChange}
              min={1}
              max={100}
              className="w-[320px]"
            />
          </VStack>

          {/* Description (Collapsible) */}
          <Disclosure title="Description" defaultOpen={false}>
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              fullWidth
            />
          </Disclosure>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   LabelsAnnotationsSection Component
   ---------------------------------------- */

interface LabelsAnnotationsSectionProps {
  labels: Label[];
  onAddLabel: () => void;
  onRemoveLabel: (index: number) => void;
  onUpdateLabel: (index: number, field: 'key' | 'value', value: string) => void;
  annotations: Annotation[];
  onAddAnnotation: () => void;
  onRemoveAnnotation: (index: number) => void;
  onUpdateAnnotation: (index: number, field: 'key' | 'value', value: string) => void;
}

function LabelsAnnotationsSection({
  labels,
  onAddLabel,
  onRemoveLabel,
  onUpdateLabel,
  annotations,
  onAddAnnotation,
  onRemoveAnnotation,
  onUpdateAnnotation,
}: LabelsAnnotationsSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Labels & Annotations" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Labels */}
          <VStack gap={3}>
            <VStack gap={1.5}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Labels
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>

            {/* Bordered container for labels */}
            <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={2}>
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                  >
                    <div className="flex gap-2 items-start w-full">
                      <VStack gap={2} className="flex-1">
                        <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                          Key
                        </span>
                        <Input
                          placeholder="label key"
                          value={label.key}
                          onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                          fullWidth
                        />
                      </VStack>
                      <VStack gap={2} className="flex-1">
                        <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                          Value
                        </span>
                        <Input
                          placeholder="label value"
                          value={label.value}
                          onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                          fullWidth
                        />
                      </VStack>
                      <button
                        onClick={() => onRemoveLabel(index)}
                        className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                      >
                        <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddLabel}
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
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Annotations
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>

            {/* Bordered container for annotations */}
            <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
              <VStack gap={2}>
                {annotations.map((annotation, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                  >
                    <div className="flex gap-2 items-start w-full">
                      <VStack gap={2} className="flex-1">
                        <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                          Key
                        </span>
                        <Input
                          placeholder="annotation key"
                          value={annotation.key}
                          onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                          fullWidth
                        />
                      </VStack>
                      <VStack gap={2} className="flex-1">
                        <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                          Value
                        </span>
                        <Input
                          placeholder="annotation value"
                          value={annotation.value}
                          onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                          fullWidth
                        />
                      </VStack>
                      <button
                        onClick={() => onRemoveAnnotation(index)}
                        className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                      >
                        <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                    onClick={onAddAnnotation}
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
  );
}

/* ----------------------------------------
   ScalingPolicySection Component
   ---------------------------------------- */

interface ScalingPolicySectionProps {
  strategy: 'rolling-update' | 'on-delete';
  onStrategyChange: (value: 'rolling-update' | 'on-delete') => void;
  maxSurge: number;
  onMaxSurgeChange: (value: number) => void;
  maxSurgeUnit: string;
  onMaxSurgeUnitChange: (value: string) => void;
  maxUnavailable: number;
  onMaxUnavailableChange: (value: number) => void;
  maxUnavailableUnit: string;
  onMaxUnavailableUnitChange: (value: string) => void;
  minReady: number;
  onMinReadyChange: (value: number) => void;
  revisionHistoryLimit: number;
  onRevisionHistoryLimitChange: (value: number) => void;
  progressDeadline: number;
  onProgressDeadlineChange: (value: number) => void;
}

function ScalingPolicySection({
  strategy,
  onStrategyChange,
  maxSurge,
  onMaxSurgeChange,
  maxSurgeUnit,
  onMaxSurgeUnitChange,
  maxUnavailable,
  onMaxUnavailableChange,
  maxUnavailableUnit,
  onMaxUnavailableUnitChange,
  minReady,
  onMinReadyChange,
  revisionHistoryLimit,
  onRevisionHistoryLimitChange,
  progressDeadline,
  onProgressDeadlineChange,
}: ScalingPolicySectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header title="Scaling and Upgrade Policy" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Strategy Selection */}
          <VStack gap={3}>
            <Radio
              checked={strategy === 'rolling-update'}
              onChange={() => onStrategyChange('rolling-update')}
              label="Rolling Update"
            />
            <Radio
              checked={strategy === 'on-delete'}
              onChange={() => onStrategyChange('on-delete')}
              label="On Delete"
            />
          </VStack>

          {/* Max Surge */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Max Surge
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                The maximum number of additional pods that can be created during an update.
              </p>
            </VStack>
            <HStack gap={2}>
              <NumberInput
                value={maxSurge}
                onChange={onMaxSurgeChange}
                min={0}
                className="w-[320px]"
              />
              <Select
                options={UNIT_OPTIONS}
                value={maxSurgeUnit}
                onChange={(value) => onMaxSurgeUnitChange(value)}
                className="w-[80px]"
              />
            </HStack>
          </VStack>

          {/* Max Unavailable */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Max Unavailable
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                The maximum number of pods that can be unavailable during an update.
              </p>
            </VStack>
            <HStack gap={2}>
              <NumberInput
                value={maxUnavailable}
                onChange={onMaxUnavailableChange}
                min={0}
                className="w-[320px]"
              />
              <Select
                options={UNIT_OPTIONS}
                value={maxUnavailableUnit}
                onChange={(value) => onMaxUnavailableUnitChange(value)}
                className="w-[80px]"
              />
            </HStack>
          </VStack>

          {/* Minimum Ready */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Minimum Ready
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                The minimum time a pod must remain in a ready state before it is considered
                available.
              </p>
            </VStack>
            <HStack gap={2}>
              <NumberInput
                value={minReady}
                onChange={onMinReadyChange}
                min={0}
                className="w-[320px]"
              />
              <div className="flex items-center justify-center w-[80px] h-[32px] px-[10px] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[6px]">
                <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                  Seconds
                </span>
              </div>
            </HStack>
          </VStack>

          {/* Revision History Limit */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Revision History Limit
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                The maximum number of revision histories to retain for the Deployment.
              </p>
            </VStack>
            <HStack gap={2}>
              <NumberInput
                value={revisionHistoryLimit}
                onChange={onRevisionHistoryLimitChange}
                min={0}
                className="w-[320px]"
              />
              <div className="flex items-center justify-center w-[80px] h-[32px] px-[10px] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[6px]">
                <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                  Revisions
                </span>
              </div>
            </HStack>
          </VStack>

          {/* Progress Deadline */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                Progress Deadline
              </span>
              <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                The maximum time allowed for a Deployment to progress before it is considered
                failed.
              </p>
            </VStack>
            <HStack gap={2}>
              <NumberInput
                value={progressDeadline}
                onChange={onProgressDeadlineChange}
                min={0}
                className="w-[320px]"
              />
              <div className="flex items-center justify-center w-[80px] h-[32px] px-[10px] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[6px]">
                <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                  Seconds
                </span>
              </div>
            </HStack>
          </VStack>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateDeploymentPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Container tabs (for managing multiple containers)
  const [containerTabs, setContainerTabs] = useState<ContainerTab[]>([
    { id: 'container-0', name: 'Container-0' },
  ]);

  // Basic information state
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [replicas, setReplicas] = useState(1);
  const [description, setDescription] = useState('');

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Scaling & Upgrade Policy state
  const [strategy, setStrategy] = useState<'rolling-update' | 'on-delete'>('rolling-update');
  const [maxSurge, setMaxSurge] = useState(25);
  const [maxSurgeUnit, setMaxSurgeUnit] = useState('%');
  const [maxUnavailable, setMaxUnavailable] = useState(25);
  const [maxUnavailableUnit, setMaxUnavailableUnit] = useState('%');
  const [minReady, setMinReady] = useState(0);
  const [revisionHistoryLimit, setRevisionHistoryLimit] = useState(10);
  const [progressDeadline, setProgressDeadline] = useState(600);

  // No section status state needed - all sections are always visible

  // Container-specific state
  const [containerConfigs, setContainerConfigs] = useState<
    Record<
      string,
      {
        name: string;
        image: string;
        imagePullPolicy: string;
        workingDir: string;
        command: string;
        args: string;
        ports: { name: string; containerPort: string; protocol: string }[];
        envVars: { name: string; value: string; type: 'value' | 'configmap' | 'secret' }[];
        cpuRequest: string;
        cpuLimit: string;
        memoryRequest: string;
        memoryLimit: string;
        livenessProbe: {
          enabled: boolean;
          type: string;
          path: string;
          port: string;
          initialDelay: string;
          period: string;
        };
        readinessProbe: {
          enabled: boolean;
          type: string;
          path: string;
          port: string;
          initialDelay: string;
          period: string;
        };
        volumeMounts: { name: string; mountPath: string; subPath: string; readOnly: boolean }[];
        runAsUser: string;
        runAsGroup: string;
        privileged: boolean;
        readOnlyRootFilesystem: boolean;
      }
    >
  >({
    'container-0': {
      name: '',
      image: '',
      imagePullPolicy: 'IfNotPresent',
      workingDir: '',
      command: '',
      args: '',
      ports: [],
      envVars: [],
      cpuRequest: '',
      cpuLimit: '',
      memoryRequest: '',
      memoryLimit: '',
      livenessProbe: {
        enabled: false,
        type: 'http',
        path: '/',
        port: '8080',
        initialDelay: '0',
        period: '10',
      },
      readinessProbe: {
        enabled: false,
        type: 'http',
        path: '/',
        port: '8080',
        initialDelay: '0',
        period: '10',
      },
      volumeMounts: [],
      runAsUser: '',
      runAsGroup: '',
      privileged: false,
      readOnlyRootFilesystem: false,
    },
  });

  // Pod Labels & Annotations state
  const [podLabels, setPodLabels] = useState<Label[]>([]);
  const [podAnnotations, setPodAnnotations] = useState<Annotation[]>([]);

  // Scaling and Upgrade Policy state
  const [terminationGracePeriod, setTerminationGracePeriod] = useState<string>('');

  // Node Scheduling state
  const [nodeScheduling, setNodeScheduling] = useState<string>('any');

  // Networking state
  const [networkMode, setNetworkMode] = useState<string>('normal');
  const [dnsPolicy, setDnsPolicy] = useState<string>('cluster-first');

  // Security Context state
  const [podFilesystemGroup, setPodFilesystemGroup] = useState<string>('1');

  // Update container config helper
  const updateContainerConfig = useCallback(
    (containerId: string, updates: Partial<(typeof containerConfigs)[string]>) => {
      setContainerConfigs((prev) => ({
        ...prev,
        [containerId]: { ...prev[containerId], ...updates },
      }));
    },
    []
  );

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);

  // Tab management (browser-like tabs)
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Deployment');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Active form tab (Deployment, Pod, Container-X)
  const [activeTab, setActiveTab] = useState('deployment');

  // Build inner tabs for the form
  const formTabs = [
    { id: 'deployment', label: 'Deployment' },
    { id: 'pod', label: 'Pod' },
    ...containerTabs.map((c) => ({ id: c.id, label: c.name, closable: containerTabs.length > 1 })),
  ];

  // Handle removing a container tab
  const removeContainerTab = useCallback(
    (id: string) => {
      if (containerTabs.length <= 1) return;
      setContainerTabs(containerTabs.filter((c) => c.id !== id));
      setContainerConfigs((prev) => {
        const newConfigs = { ...prev };
        delete newConfigs[id];
        return newConfigs;
      });
      if (activeTab === id) {
        setActiveTab('deployment');
      }
    },
    [containerTabs, activeTab]
  );

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/deployments');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      setNameError('Name is required.');
      return;
    }

    console.log('Creating deployment:', {
      namespace,
      name,
      replicas,
      description,
      labels,
      annotations,
      strategy,
      maxSurge,
      maxSurgeUnit,
      maxUnavailable,
      maxUnavailableUnit,
      minReady,
      revisionHistoryLimit,
      progressDeadline,
    });
    navigate('/container/deployments');
  }, [
    namespace,
    name,
    replicas,
    description,
    labels,
    annotations,
    strategy,
    maxSurge,
    maxSurgeUnit,
    maxUnavailable,
    maxUnavailableUnit,
    minReady,
    revisionHistoryLimit,
    progressDeadline,
    navigate,
  ]);

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

  // Pod Label management
  const addPodLabel = useCallback(() => {
    setPodLabels([...podLabels, { key: '', value: '' }]);
  }, [podLabels]);

  const removePodLabel = useCallback(
    (index: number) => {
      setPodLabels(podLabels.filter((_, i) => i !== index));
    },
    [podLabels]
  );

  const updatePodLabel = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newLabels = [...podLabels];
      newLabels[index][field] = value;
      setPodLabels(newLabels);
    },
    [podLabels]
  );

  // Pod Annotation management
  const addPodAnnotation = useCallback(() => {
    setPodAnnotations([...podAnnotations, { key: '', value: '' }]);
  }, [podAnnotations]);

  const removePodAnnotation = useCallback(
    (index: number) => {
      setPodAnnotations(podAnnotations.filter((_, i) => i !== index));
    },
    [podAnnotations]
  );

  const updatePodAnnotation = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newAnnotations = [...podAnnotations];
      newAnnotations[index][field] = value;
      setPodAnnotations(newAnnotations);
    },
    [podAnnotations]
  );

  // Container tab management
  const addContainerTab = useCallback(() => {
    const newIndex = containerTabs.length;
    const newContainer: ContainerTab = {
      id: `container-${newIndex}`,
      name: `Container-${newIndex}`,
    };
    setContainerTabs([...containerTabs, newContainer]);
    // Initialize container config for new container
    setContainerConfigs((prev) => ({
      ...prev,
      [newContainer.id]: {
        name: '',
        image: '',
        imagePullPolicy: 'IfNotPresent',
        workingDir: '',
        command: '',
        args: '',
        ports: [],
        envVars: [],
        cpuRequest: '',
        cpuLimit: '',
        memoryRequest: '',
        memoryLimit: '',
        livenessProbe: {
          enabled: false,
          type: 'http',
          path: '/',
          port: '8080',
          initialDelay: '0',
          period: '10',
        },
        readinessProbe: {
          enabled: false,
          type: 'http',
          path: '/',
          port: '8080',
          initialDelay: '0',
          period: '10',
        },
        volumeMounts: [],
        runAsUser: '',
        runAsGroup: '',
        privileged: false,
        readOnlyRootFilesystem: false,
      },
    }));
  }, [containerTabs]);

  // Check if create button should be disabled
  const isCreateDisabled = !name.trim();

  // Get display values for done sections
  const getLabelsDisplay = () => {
    const validLabels = labels.filter((l) => l.key.trim());
    if (validLabels.length === 0) return 'None';
    return validLabels.map((l) => `${l.key}: ${l.value}`).join(', ');
  };

  const getAnnotationsDisplay = () => {
    const validAnnotations = annotations.filter((a) => a.key.trim());
    if (validAnnotations.length === 0) return 'None';
    return validAnnotations.map((a) => `${a.key}: ${a.value}`).join(', ');
  };

  // No tabs needed - all sections are always visible

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
                { label: 'clusterName', href: '/container' },
                { label: 'Deployments', href: '/container/deployments' },
                { label: 'Create Deployment' },
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
                  Create Deployment
                </h1>
                <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                  Deployment manage the lifecycle of your application Pods, enabling rolling updates
                  and automated recovery.
                </p>
              </VStack>

              {/* Form Tabs */}
              <Tabs value={activeTab} onChange={setActiveTab} size="sm" variant="underline">
                <HStack align="start" className="w-full">
                  <TabList>
                    {formTabs.map((tab) => (
                      <Tab key={tab.id} value={tab.id}>
                        <HStack gap={2} align="center">
                          {tab.label}
                          {tab.closable && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeContainerTab(tab.id);
                              }}
                              className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded"
                            >
                              <IconX size={12} stroke={1.5} />
                            </button>
                          )}
                        </HStack>
                      </Tab>
                    ))}
                  </TabList>
                  <button
                    onClick={addContainerTab}
                    className="flex items-center justify-center h-[20px] px-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors text-[var(--color-text-muted)]"
                  >
                    <IconPlus size={16} stroke={1.5} />
                  </button>
                </HStack>
              </Tabs>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Deployment Tab */}
                  {activeTab === 'deployment' && (
                    <>
                      <BasicInfoSection
                        namespace={namespace}
                        onNamespaceChange={setNamespace}
                        name={name}
                        onNameChange={setName}
                        nameError={nameError}
                        onNameErrorChange={setNameError}
                        replicas={replicas}
                        onReplicasChange={setReplicas}
                        description={description}
                        onDescriptionChange={setDescription}
                      />
                      <LabelsAnnotationsSection
                        labels={labels}
                        onAddLabel={addLabel}
                        onRemoveLabel={removeLabel}
                        onUpdateLabel={updateLabel}
                        annotations={annotations}
                        onAddAnnotation={addAnnotation}
                        onRemoveAnnotation={removeAnnotation}
                        onUpdateAnnotation={updateAnnotation}
                      />
                      <ScalingPolicySection
                        strategy={strategy}
                        onStrategyChange={setStrategy}
                        maxSurge={maxSurge}
                        onMaxSurgeChange={setMaxSurge}
                        maxSurgeUnit={maxSurgeUnit}
                        onMaxSurgeUnitChange={setMaxSurgeUnit}
                        maxUnavailable={maxUnavailable}
                        onMaxUnavailableChange={setMaxUnavailable}
                        maxUnavailableUnit={maxUnavailableUnit}
                        onMaxUnavailableUnitChange={setMaxUnavailableUnit}
                        minReady={minReady}
                        onMinReadyChange={setMinReady}
                        revisionHistoryLimit={revisionHistoryLimit}
                        onRevisionHistoryLimitChange={setRevisionHistoryLimit}
                        progressDeadline={progressDeadline}
                        onProgressDeadlineChange={setProgressDeadline}
                      />
                    </>
                  )}

                  {/* Pod Tab */}
                  {activeTab === 'pod' && (
                    <>
                      {/* Labels & Annotations */}
                      <SectionCard>
                        <SectionCard.Header title="Labels & Annotations" showDivider />
                        <SectionCard.Content>
                          <VStack gap={6}>
                            {/* Labels */}
                            <VStack gap={3}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                                Labels
                              </span>
                              {podLabels.length > 0 && (
                                <>
                                  <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Key
                                    </span>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Value
                                    </span>
                                    <div />
                                  </div>
                                  {podLabels.map((label, index) => (
                                    <div
                                      key={index}
                                      className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center"
                                    >
                                      <Input
                                        placeholder="Key"
                                        value={label.key}
                                        onChange={(e) =>
                                          updatePodLabel(index, 'key', e.target.value)
                                        }
                                        fullWidth
                                      />
                                      <Input
                                        placeholder="Value"
                                        value={label.value}
                                        onChange={(e) =>
                                          updatePodLabel(index, 'value', e.target.value)
                                        }
                                        fullWidth
                                      />
                                      <button
                                        onClick={() => removePodLabel(index)}
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
                                variant="secondary"
                                size="sm"
                                onClick={addPodLabel}
                                className="w-full"
                              >
                                <IconPlus size={12} stroke={1.5} />
                                Add Label
                              </Button>
                            </VStack>

                            {/* Annotations */}
                            <VStack gap={3}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                                Annotations
                              </span>
                              {podAnnotations.length > 0 && (
                                <>
                                  <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Key
                                    </span>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Value
                                    </span>
                                    <div />
                                  </div>
                                  {podAnnotations.map((annotation, index) => (
                                    <div
                                      key={index}
                                      className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center"
                                    >
                                      <Input
                                        placeholder="Key"
                                        value={annotation.key}
                                        onChange={(e) =>
                                          updatePodAnnotation(index, 'key', e.target.value)
                                        }
                                        fullWidth
                                      />
                                      <Input
                                        placeholder="Value"
                                        value={annotation.value}
                                        onChange={(e) =>
                                          updatePodAnnotation(index, 'value', e.target.value)
                                        }
                                        fullWidth
                                      />
                                      <button
                                        onClick={() => removePodAnnotation(index)}
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
                                variant="secondary"
                                size="sm"
                                onClick={addPodAnnotation}
                                className="w-full"
                              >
                                <IconPlus size={12} stroke={1.5} />
                                Add Annotation
                              </Button>
                            </VStack>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Scaling and Upgrade Policy */}
                      <SectionCard>
                        <SectionCard.Header title="Scaling and Upgrade Policy" showDivider />
                        <SectionCard.Content>
                          <VStack gap={3}>
                            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                              Pod Policy
                            </span>
                            <VStack gap={1} className="w-full max-w-[578px]">
                              <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                Termination Grace Period
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                              <HStack gap={2} align="center" className="w-full">
                                <Input
                                  placeholder="30"
                                  fullWidth
                                  value={terminationGracePeriod}
                                  onChange={(e) => setTerminationGracePeriod(e.target.value)}
                                />
                                <span className="text-[12px] text-[var(--color-text-default)] whitespace-nowrap">
                                  Seconds
                                </span>
                              </HStack>
                            </VStack>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Networking */}
                      <SectionCard>
                        <SectionCard.Header title="Networking" showDivider />
                        <SectionCard.Content>
                          <VStack gap={4}>
                            {/* Network Settings */}
                            <VStack gap={3}>
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                Network Settings
                              </span>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-full items-end">
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Network Mode
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Select the networking mode for the pod.
                                  </span>
                                  <Select
                                    options={[
                                      { value: 'normal', label: 'Normal' },
                                      { value: 'host', label: 'Host' },
                                    ]}
                                    value={networkMode}
                                    onChange={setNetworkMode}
                                    fullWidth
                                  />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    DNS Policy
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Select the DNS policy to apply to the pod.
                                  </span>
                                  <Select
                                    options={[
                                      { value: 'cluster-first', label: 'Cluster First' },
                                      { value: 'default', label: 'Default' },
                                      { value: 'none', label: 'None' },
                                    ]}
                                    value={dnsPolicy}
                                    onChange={setDnsPolicy}
                                    fullWidth
                                  />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Hostname
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the hostname assigned to the pod.
                                  </span>
                                  <Input placeholder="e.g. web" fullWidth />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Subdomain
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the subdomain assigned to the pod.
                                  </span>
                                  <Input placeholder="e.g. web" fullWidth />
                                </VStack>
                              </div>
                            </VStack>

                            {/* Nameservers & Search Domains */}
                            <div className="grid grid-cols-2 gap-3 w-full">
                              <VStack gap={2}>
                                <VStack gap={1}>
                                  <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                    Nameservers
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the DNS nameserver addresses used by the pod.
                                  </span>
                                </VStack>
                                <Button variant="secondary" size="sm">
                                  <IconPlus size={12} stroke={1.5} />
                                  Add Nameserver
                                </Button>
                              </VStack>
                              <VStack gap={2}>
                                <VStack gap={1}>
                                  <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                    Search Domains
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the search domains used for DNS resolution.
                                  </span>
                                </VStack>
                                <Button variant="secondary" size="sm">
                                  <IconPlus size={12} stroke={1.5} />
                                  Add Search Domain
                                </Button>
                              </VStack>
                            </div>

                            {/* Resolver Options */}
                            <VStack gap={2}>
                              <VStack gap={1}>
                                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                  Resolver Options
                                </span>
                              </VStack>
                              <div className="grid grid-cols-2 gap-3 w-full pl-3">
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Name
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the name of the DNS resolver option.
                                  </span>
                                  <Input placeholder="input name" fullWidth />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Value
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    The value of the DNS resolver option.
                                  </span>
                                  <Input placeholder="input value" fullWidth />
                                </VStack>
                              </div>
                              <Button variant="secondary" size="sm">
                                <IconPlus size={12} stroke={1.5} />
                                Add Option
                              </Button>
                            </VStack>

                            {/* Host Aliases */}
                            <VStack gap={2}>
                              <VStack gap={1}>
                                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                  Host Aliases
                                </span>
                              </VStack>
                              <div className="grid grid-cols-2 gap-3 w-full pl-3">
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    IP Address
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the IP address used for the host alias.
                                  </span>
                                  <Input placeholder="e.g. 127.0.0.1" fullWidth />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Hostnames
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the hostnames mapped to the IP address.
                                  </span>
                                  <Input placeholder="e.g. foo.company.com" fullWidth />
                                </VStack>
                              </div>
                              <Button variant="secondary" size="sm">
                                <IconPlus size={12} stroke={1.5} />
                                Add Alias
                              </Button>
                            </VStack>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Node Scheduling */}
                      <SectionCard>
                        <SectionCard.Header title="Node Scheduling" showDivider />
                        <SectionCard.Content>
                          <VStack gap={4}>
                            <RadioGroup value={nodeScheduling} onChange={setNodeScheduling}>
                              <Radio value="any" label="Run pods on any available node" />
                              <Radio value="specific" label="Run pods on specific node(s)" />
                              <Radio
                                value="matching"
                                label="Run pods on node(s) matching scheduling rules"
                              />
                            </RadioGroup>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Pod Scheduling */}
                      <SectionCard>
                        <SectionCard.Header title="Pod Scheduling" showDivider />
                        <SectionCard.Content>
                          <VStack gap={4}>
                            <Button variant="secondary" size="sm">
                              <IconPlus size={12} stroke={1.5} />
                              Add Pod Selector
                            </Button>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Resources */}
                      <SectionCard>
                        <SectionCard.Header title="Resources" showDivider />
                        <SectionCard.Content>
                          <VStack gap={4}>
                            {/* Tolerations */}
                            <VStack gap={2}>
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                Tolerations
                              </span>
                              <Button variant="secondary" size="sm">
                                <IconPlus size={12} stroke={1.5} />
                                Add Toleration
                              </Button>
                            </VStack>

                            {/* Priority */}
                            <VStack gap={2}>
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                Priority
                              </span>
                              <div className="grid grid-cols-2 gap-3 w-full pl-3">
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Priority
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the DNS nameserver addresses used by the pod.
                                  </span>
                                  <Input placeholder="" fullWidth />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Priority Class Name
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the DNS nameserver addresses used by the pod.
                                  </span>
                                  <Input placeholder="" fullWidth />
                                </VStack>
                              </div>
                            </VStack>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Security Context */}
                      <SectionCard>
                        <SectionCard.Header title="Security Context" showDivider />
                        <SectionCard.Content>
                          <VStack gap={4}>
                            <VStack gap={1} className="max-w-[578px]">
                              <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                Pod Filesystem Group
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)]">
                                Specify the filesystem group used by the pod.
                              </span>
                              <Select
                                options={[
                                  { value: '1', label: '1' },
                                  { value: '1000', label: '1000' },
                                ]}
                                value={podFilesystemGroup}
                                onChange={setPodFilesystemGroup}
                                fullWidth
                              />
                            </VStack>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Storage */}
                      <SectionCard>
                        <SectionCard.Header title="Storage" showDivider />
                        <SectionCard.Content>
                          <VStack gap={4}>
                            <Button variant="secondary" size="sm">
                              <IconPlus size={12} stroke={1.5} />
                              Add Volume
                            </Button>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>
                    </>
                  )}

                  {/* Container Tabs */}
                  {activeTab.startsWith('container-') &&
                    (() => {
                      const containerId = activeTab;
                      const container = containerTabs.find((c) => c.id === containerId);
                      const config = containerConfigs[containerId] || {};

                      if (!container) return null;

                      return (
                        <>
                          {/* General Section */}
                          <SectionCard>
                            <SectionCard.Header title="General" showDivider />
                            <SectionCard.Content>
                              <VStack gap={4}>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Container Name{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      Enter a name for this container.
                                    </span>
                                    <Input
                                      placeholder="e.g. nginx"
                                      fullWidth
                                      value={config.name || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Image{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      Container image to use.
                                    </span>
                                    <Input
                                      placeholder="e.g. nginx:latest"
                                      fullWidth
                                      value={config.image || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          image: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Image Pull Policy
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      When to pull the container image.
                                    </span>
                                    <Select
                                      options={[
                                        { value: 'Always', label: 'Always' },
                                        { value: 'IfNotPresent', label: 'If Not Present' },
                                        { value: 'Never', label: 'Never' },
                                      ]}
                                      value={config.imagePullPolicy || 'IfNotPresent'}
                                      onChange={(val) =>
                                        updateContainerConfig(containerId, {
                                          imagePullPolicy: val,
                                        })
                                      }
                                      fullWidth
                                    />
                                  </VStack>
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Working Directory
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      Working directory for the container.
                                    </span>
                                    <Input
                                      placeholder="e.g. /app"
                                      fullWidth
                                      value={config.workingDir || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          workingDir: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                </div>

                                <VStack gap={1} className="w-full">
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Command
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Override the container entrypoint command.
                                  </span>
                                  <Input
                                    placeholder='e.g. ["sh", "-c"]'
                                    fullWidth
                                    value={config.command || ''}
                                    onChange={(e) =>
                                      updateContainerConfig(containerId, {
                                        command: e.target.value,
                                      })
                                    }
                                  />
                                </VStack>

                                <VStack gap={1} className="w-full">
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Arguments
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Arguments to pass to the container command.
                                  </span>
                                  <Input
                                    placeholder='e.g. ["echo", "hello"]'
                                    fullWidth
                                    value={config.args || ''}
                                    onChange={(e) =>
                                      updateContainerConfig(containerId, { args: e.target.value })
                                    }
                                  />
                                </VStack>
                              </VStack>
                            </SectionCard.Content>
                          </SectionCard>

                          {/* Ports Section */}
                          <SectionCard>
                            <SectionCard.Header title="Ports" showDivider />
                            <SectionCard.Content>
                              <VStack gap={4}>
                                <span className="text-[12px] text-[var(--color-text-subtle)]">
                                  Define the ports that the container exposes.
                                </span>

                                {(config.ports || []).map((port, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 w-full items-end"
                                  >
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Name
                                      </span>
                                      <Input
                                        placeholder="http"
                                        fullWidth
                                        value={port.name}
                                        onChange={(e) => {
                                          const newPorts = [...(config.ports || [])];
                                          newPorts[index] = {
                                            ...newPorts[index],
                                            name: e.target.value,
                                          };
                                          updateContainerConfig(containerId, { ports: newPorts });
                                        }}
                                      />
                                    </VStack>
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Container Port
                                      </span>
                                      <Input
                                        placeholder="8080"
                                        fullWidth
                                        value={port.containerPort}
                                        onChange={(e) => {
                                          const newPorts = [...(config.ports || [])];
                                          newPorts[index] = {
                                            ...newPorts[index],
                                            containerPort: e.target.value,
                                          };
                                          updateContainerConfig(containerId, { ports: newPorts });
                                        }}
                                      />
                                    </VStack>
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Protocol
                                      </span>
                                      <Select
                                        options={[
                                          { value: 'TCP', label: 'TCP' },
                                          { value: 'UDP', label: 'UDP' },
                                        ]}
                                        value={port.protocol}
                                        onChange={(val) => {
                                          const newPorts = [...(config.ports || [])];
                                          newPorts[index] = { ...newPorts[index], protocol: val };
                                          updateContainerConfig(containerId, { ports: newPorts });
                                        }}
                                        fullWidth
                                      />
                                    </VStack>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newPorts = (config.ports || []).filter(
                                          (_, i) => i !== index
                                        );
                                        updateContainerConfig(containerId, { ports: newPorts });
                                      }}
                                    >
                                      <IconX size={14} />
                                    </Button>
                                  </div>
                                ))}

                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    const newPorts = [
                                      ...(config.ports || []),
                                      { name: '', containerPort: '', protocol: 'TCP' },
                                    ];
                                    updateContainerConfig(containerId, { ports: newPorts });
                                  }}
                                >
                                  <IconPlus size={12} stroke={1.5} />
                                  Add Port
                                </Button>
                              </VStack>
                            </SectionCard.Content>
                          </SectionCard>

                          {/* Environment Variables Section */}
                          <SectionCard>
                            <SectionCard.Header title="Environment Variables" showDivider />
                            <SectionCard.Content>
                              <VStack gap={4}>
                                <span className="text-[12px] text-[var(--color-text-subtle)]">
                                  Set environment variables for the container.
                                </span>

                                {(config.envVars || []).map((envVar, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-[1fr_1fr_auto] gap-3 w-full items-end"
                                  >
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Name
                                      </span>
                                      <Input
                                        placeholder="MY_VAR"
                                        fullWidth
                                        value={envVar.name}
                                        onChange={(e) => {
                                          const newEnvVars = [...(config.envVars || [])];
                                          newEnvVars[index] = {
                                            ...newEnvVars[index],
                                            name: e.target.value,
                                          };
                                          updateContainerConfig(containerId, {
                                            envVars: newEnvVars,
                                          });
                                        }}
                                      />
                                    </VStack>
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Value
                                      </span>
                                      <Input
                                        placeholder="value"
                                        fullWidth
                                        value={envVar.value}
                                        onChange={(e) => {
                                          const newEnvVars = [...(config.envVars || [])];
                                          newEnvVars[index] = {
                                            ...newEnvVars[index],
                                            value: e.target.value,
                                          };
                                          updateContainerConfig(containerId, {
                                            envVars: newEnvVars,
                                          });
                                        }}
                                      />
                                    </VStack>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newEnvVars = (config.envVars || []).filter(
                                          (_, i) => i !== index
                                        );
                                        updateContainerConfig(containerId, {
                                          envVars: newEnvVars,
                                        });
                                      }}
                                    >
                                      <IconX size={14} />
                                    </Button>
                                  </div>
                                ))}

                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    const newEnvVars = [
                                      ...(config.envVars || []),
                                      { name: '', value: '', type: 'value' as const },
                                    ];
                                    updateContainerConfig(containerId, { envVars: newEnvVars });
                                  }}
                                >
                                  <IconPlus size={12} stroke={1.5} />
                                  Add Environment Variable
                                </Button>
                              </VStack>
                            </SectionCard.Content>
                          </SectionCard>

                          {/* Resources Section */}
                          <SectionCard>
                            <SectionCard.Header title="Resources" showDivider />
                            <SectionCard.Content>
                              <VStack gap={4}>
                                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                  Requests
                                </span>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      CPU Request
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      Minimum CPU required.
                                    </span>
                                    <Input
                                      placeholder="e.g. 100m"
                                      fullWidth
                                      value={config.cpuRequest || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          cpuRequest: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Memory Request
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      Minimum memory required.
                                    </span>
                                    <Input
                                      placeholder="e.g. 128Mi"
                                      fullWidth
                                      value={config.memoryRequest || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          memoryRequest: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                </div>

                                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                  Limits
                                </span>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      CPU Limit
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      Maximum CPU allowed.
                                    </span>
                                    <Input
                                      placeholder="e.g. 500m"
                                      fullWidth
                                      value={config.cpuLimit || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          cpuLimit: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Memory Limit
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      Maximum memory allowed.
                                    </span>
                                    <Input
                                      placeholder="e.g. 512Mi"
                                      fullWidth
                                      value={config.memoryLimit || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          memoryLimit: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                </div>
                              </VStack>
                            </SectionCard.Content>
                          </SectionCard>

                          {/* Health Checks Section */}
                          <SectionCard>
                            <SectionCard.Header title="Health Checks" showDivider />
                            <SectionCard.Content>
                              <VStack gap={4}>
                                <VStack gap={3}>
                                  <HStack gap={2} align="center">
                                    <Checkbox
                                      checked={config.livenessProbe?.enabled || false}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          livenessProbe: {
                                            ...config.livenessProbe,
                                            enabled: e.target.checked,
                                          },
                                        })
                                      }
                                    />
                                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                      Liveness Probe
                                    </span>
                                  </HStack>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Indicates whether the container is running. If failed, the
                                    container will be restarted.
                                  </span>
                                </VStack>

                                <VStack gap={3}>
                                  <HStack gap={2} align="center">
                                    <Checkbox
                                      checked={config.readinessProbe?.enabled || false}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          readinessProbe: {
                                            ...config.readinessProbe,
                                            enabled: e.target.checked,
                                          },
                                        })
                                      }
                                    />
                                    <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                      Readiness Probe
                                    </span>
                                  </HStack>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Indicates whether the container is ready to receive traffic.
                                  </span>
                                </VStack>
                              </VStack>
                            </SectionCard.Content>
                          </SectionCard>

                          {/* Volume Mounts Section */}
                          <SectionCard>
                            <SectionCard.Header title="Volume Mounts" showDivider />
                            <SectionCard.Content>
                              <VStack gap={4}>
                                <span className="text-[12px] text-[var(--color-text-subtle)]">
                                  Mount volumes into the container filesystem.
                                </span>

                                {(config.volumeMounts || []).map((mount, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 w-full items-end"
                                  >
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Volume Name
                                      </span>
                                      <Input
                                        placeholder="volume-name"
                                        fullWidth
                                        value={mount.name}
                                        onChange={(e) => {
                                          const newMounts = [...(config.volumeMounts || [])];
                                          newMounts[index] = {
                                            ...newMounts[index],
                                            name: e.target.value,
                                          };
                                          updateContainerConfig(containerId, {
                                            volumeMounts: newMounts,
                                          });
                                        }}
                                      />
                                    </VStack>
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Mount Path
                                      </span>
                                      <Input
                                        placeholder="/data"
                                        fullWidth
                                        value={mount.mountPath}
                                        onChange={(e) => {
                                          const newMounts = [...(config.volumeMounts || [])];
                                          newMounts[index] = {
                                            ...newMounts[index],
                                            mountPath: e.target.value,
                                          };
                                          updateContainerConfig(containerId, {
                                            volumeMounts: newMounts,
                                          });
                                        }}
                                      />
                                    </VStack>
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Sub Path
                                      </span>
                                      <Input
                                        placeholder="optional"
                                        fullWidth
                                        value={mount.subPath}
                                        onChange={(e) => {
                                          const newMounts = [...(config.volumeMounts || [])];
                                          newMounts[index] = {
                                            ...newMounts[index],
                                            subPath: e.target.value,
                                          };
                                          updateContainerConfig(containerId, {
                                            volumeMounts: newMounts,
                                          });
                                        }}
                                      />
                                    </VStack>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newMounts = (config.volumeMounts || []).filter(
                                          (_, i) => i !== index
                                        );
                                        updateContainerConfig(containerId, {
                                          volumeMounts: newMounts,
                                        });
                                      }}
                                    >
                                      <IconX size={14} />
                                    </Button>
                                  </div>
                                ))}

                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    const newMounts = [
                                      ...(config.volumeMounts || []),
                                      { name: '', mountPath: '', subPath: '', readOnly: false },
                                    ];
                                    updateContainerConfig(containerId, {
                                      volumeMounts: newMounts,
                                    });
                                  }}
                                >
                                  <IconPlus size={12} stroke={1.5} />
                                  Add Volume Mount
                                </Button>
                              </VStack>
                            </SectionCard.Content>
                          </SectionCard>

                          {/* Security Context Section */}
                          <SectionCard>
                            <SectionCard.Header title="Security Context" showDivider />
                            <SectionCard.Content>
                              <VStack gap={4}>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Run As User
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      User ID to run the container.
                                    </span>
                                    <Input
                                      placeholder="e.g. 1000"
                                      fullWidth
                                      value={config.runAsUser || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          runAsUser: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                  <VStack gap={1}>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                      Run As Group
                                    </span>
                                    <span className="text-[12px] text-[var(--color-text-subtle)]">
                                      Group ID to run the container.
                                    </span>
                                    <Input
                                      placeholder="e.g. 1000"
                                      fullWidth
                                      value={config.runAsGroup || ''}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          runAsGroup: e.target.value,
                                        })
                                      }
                                    />
                                  </VStack>
                                </div>

                                <VStack gap={3}>
                                  <HStack gap={2} align="center">
                                    <Checkbox
                                      checked={config.privileged || false}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          privileged: e.target.checked,
                                        })
                                      }
                                    />
                                    <span className="text-[12px] text-[var(--color-text-default)]">
                                      Run as privileged container
                                    </span>
                                  </HStack>
                                  <HStack gap={2} align="center">
                                    <Checkbox
                                      checked={config.readOnlyRootFilesystem || false}
                                      onChange={(e) =>
                                        updateContainerConfig(containerId, {
                                          readOnlyRootFilesystem: e.target.checked,
                                        })
                                      }
                                    />
                                    <span className="text-[12px] text-[var(--color-text-default)]">
                                      Read-only root filesystem
                                    </span>
                                  </HStack>
                                </VStack>
                              </VStack>
                            </SectionCard.Content>
                          </SectionCard>
                        </>
                      );
                    })()}
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar
                  name={name}
                  containerTabs={containerTabs}
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

export default CreateDeploymentPage;
