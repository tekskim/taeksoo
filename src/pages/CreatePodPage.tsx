import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  FormField,
  Tabs,
  TabList,
  Tab,
  Table,
  Pagination,
  SearchInput,
  Chip,
  StatusIndicator,
  PageShell,
  WizardSectionStatusIcon,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useIsV2 } from '@/hooks/useIsV2';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconCirclePlus,
  IconX,
  IconPlus,
  IconChevronRight,
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

// Mock namespace data for selection table
interface NamespaceData {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  description: string;
  createdAt: string;
}

const MOCK_NAMESPACES: NamespaceData[] = [
  {
    id: '1',
    name: 'cattle-clusters-system',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '2',
    name: 'cattle-system',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '3',
    name: 'cattle-fleet-local-system',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '4',
    name: 'cattle-fleet-system',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '5',
    name: 'cattle-provisioning-capi-system',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '6',
    name: 'cert-manager',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '7',
    name: 'default',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '8',
    name: 'kube-node-lease',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '9',
    name: 'kube-public',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: '10',
    name: 'kube-system',
    status: 'active',
    description: 'description text',
    createdAt: 'Nov 10, 2025',
  },
];

// Operator options for match expressions
const OPERATOR_OPTIONS = [
  { value: 'In', label: 'in list' },
  { value: 'NotIn', label: 'not in list' },
  { value: 'Exists', label: 'exists' },
  { value: 'DoesNotExist', label: 'does not exist' },
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

// Pod Toleration
interface Toleration {
  key: string;
  operator: string;
  value: string;
  effect: string;
  tolerationSeconds: string;
  tolerationSecondsUnit: string;
}

// Volume types
interface ConfigMapVolume {
  type: 'configmap';
  volumeName: string;
  configMapName: string;
  optional: boolean;
  defaultMode?: string;
}

interface SecretVolume {
  type: 'secret';
  volumeName: string;
  secretName: string;
  optional: boolean;
  defaultMode: string;
}

interface PVCVolume {
  type: 'pvc';
  volumeName: string;
  pvcName: string;
  readOnly: boolean;
}

interface CreatePVCVolume {
  type: 'create-pvc';
  volumeName: string;
  pvcName: string;
  useExistingPV: boolean;
  storageClass: string;
  capacity: string;
  persistentVolume: string;
  accessModes: {
    readWriteOnce: boolean;
    readOnlyMany: boolean;
    readWriteMany: boolean;
  };
  readOnly: boolean;
}

type Volume = ConfigMapVolume | SecretVolume | PVCVolume | CreatePVCVolume;

// Node Affinity Term
interface NodeAffinityTerm {
  priority: string;
  weight: string;
  matchExpressions: { key: string; operator: string; value: string }[];
}

// Pod Affinity Term
interface PodAffinityTerm {
  type: string;
  priority: string;
  namespaces: 'all' | 'selected';
  selectedNamespaces: string[];
  topologyKey: string;
  weight: string;
  matchExpressions: { key: string; operator: string; value: string }[];
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

// Status icon component for summary items — delegates to DS WizardSectionStatusIcon
function StatusIcon({ status }: { status: 'complete' | 'in-progress' }) {
  return <WizardSectionStatusIcon status={status === 'complete' ? 'done' : 'active'} />;
}

// Summary section header with collapse/expand
interface SummarySectionHeaderProps {
  label: string;
  status: 'complete' | 'in-progress';
  expanded: boolean;
  onToggle: () => void;
  hasChildren?: boolean;
}

function SummarySectionHeader({
  label,
  status,
  expanded,
  onToggle,
  hasChildren = false,
}: SummarySectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between pr-2 w-full hover:bg-[var(--color-surface-muted)] rounded transition-colors"
    >
      <div className="flex items-center gap-1.5">
        {hasChildren ? (
          <IconChevronRight
            size={16}
            stroke={1.5}
            className={`text-[var(--color-text-muted)] transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        ) : (
          <div className="w-3" />
        )}
        <span className="text-label-lg text-[var(--color-text-default)]">{label}</span>
      </div>
      <StatusIcon status={status} />
    </button>
  );
}

// Summary sub-item (child of a section)
interface SummarySubItemProps {
  label: string;
  status: 'complete' | 'in-progress';
}

function SummarySubItem({ label, status }: SummarySubItemProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1 w-full">
      <span className="text-body-md text-[var(--color-text-default)]">{label}</span>
      <StatusIcon status={status} />
    </div>
  );
}

interface SummarySidebarProps {
  name: string;
  containerTabs: ContainerTab[];
  activeTab: string;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  name,
  containerTabs,
  activeTab,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  // Simple completion checks based on required fields
  const basicInfoComplete = name.trim().length > 0;
  const labelsComplete = true; // Labels are optional
  const scalingComplete = true; // Scaling are optional
  const deploymentComplete = basicInfoComplete && labelsComplete && scalingComplete;
  const podComplete = true; // All pod sections are optional
  const containersComplete = containerTabs.length > 0; // At least one container exists

  // Determine which section to expand based on active tab
  const isPodTab = activeTab === 'pod';
  const activeContainerId = containerTabs.find((c) => c.id === activeTab)?.id;

  // Pod section items matching actual sections
  const podSections = [
    'Basic Information',
    'Labels & Annotations',
    'Scaling and Upgrade Policy',
    'Networking',
    'Node Scheduling',
    'Pod Scheduling',
    'Resources',
    'Security Context',
    'Storage',
  ];

  // Container section items matching Figma design
  const containerSections = [
    'Basic Information',
    'Image',
    'Command',
    'Environment Variables',
    'Service Account Name',
    'Lifecycle Hooks',
    'Health Check',
    'Resources',
    'Security Context',
    'Storage',
  ];

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Scrollable content area */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <VStack gap={4}>
            <h5 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
              Summary
            </h5>

            {/* Pod Section */}
            <VStack gap={2}>
              <SummarySectionHeader
                label="Pod"
                status={podComplete ? 'complete' : 'in-progress'}
                expanded={isPodTab}
                onToggle={() => {}}
                hasChildren
              />
              {isPodTab && (
                <VStack gap={0} className="ml-3">
                  {podSections.map((section) => (
                    <SummarySubItem key={section} label={section} status="complete" />
                  ))}
                </VStack>
              )}
            </VStack>

            {/* Container Sections */}
            {containerTabs.map((container) => (
              <VStack key={container.id} gap={2}>
                <SummarySectionHeader
                  label={container.name}
                  status={containersComplete ? 'complete' : 'in-progress'}
                  expanded={activeContainerId === container.id}
                  onToggle={() => {}}
                  hasChildren
                />
                {activeContainerId === container.id && (
                  <VStack gap={0} className="ml-3">
                    {containerSections.map((section) => (
                      <SummarySubItem key={section} label={section} status="complete" />
                    ))}
                  </VStack>
                )}
              </VStack>
            ))}
          </VStack>
        </div>

        {/* Button Container */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCreate}
            className="flex-1 min-w-[80px]"
            disabled={isCreateDisabled}
          >
            Create
          </Button>
        </HStack>
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
  description,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  const isV2 = useIsV2();
  return (
    <SectionCard>
      <SectionCard.Header title="Basic information" />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Namespace */}
          <VStack gap={2}>
            <label className="text-label-lg text-[var(--color-text-default)]">
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
            <label className="text-label-lg text-[var(--color-text-default)]">
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
              <span className="text-body-sm text-[var(--color-state-danger)]">{nameError}</span>
            )}
          </VStack>

          {/* Description (Collapsible) */}
          <Disclosure defaultOpen={isV2}>
            <Disclosure.Trigger>Description</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-2">
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  fullWidth
                />
              </div>
            </Disclosure.Panel>
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
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                  >
                    <Input
                      placeholder="label key"
                      value={label.key}
                      onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="label value"
                      value={label.value}
                      onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => onRemoveLabel(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
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
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>

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
                {annotations.map((annotation, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                  >
                    <Input
                      placeholder="annotation key"
                      value={annotation.key}
                      onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="annotation value"
                      value={annotation.value}
                      onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => onRemoveAnnotation(index)}
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
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
      <SectionCard.Header title="Scaling and Upgrade Policy" />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Strategy Selection */}
          <VStack gap={3}>
            <Radio
              checked={strategy === 'rolling-update'}
              onChange={() => onStrategyChange('rolling-update')}
              label="Rolling update"
            />
            <Radio
              checked={strategy === 'on-delete'}
              onChange={() => onStrategyChange('on-delete')}
              label="On delete"
            />
          </VStack>

          {/* Max Surge */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Max Surge</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                The maximum number of additional pods that can be created during an update.
              </p>
            </VStack>
            <HStack gap={2}>
              <NumberInput value={maxSurge} onChange={onMaxSurgeChange} min={0} width="sm" />
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
              <span className="text-label-lg text-[var(--color-text-default)]">
                Max Unavailable
              </span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                The maximum number of pods that can be unavailable during an update.
              </p>
            </VStack>
            <HStack gap={2}>
              <NumberInput
                value={maxUnavailable}
                onChange={onMaxUnavailableChange}
                min={0}
                width="sm"
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
              <span className="text-label-lg text-[var(--color-text-default)]">Minimum Ready</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                The minimum time a pod must remain in a ready state before it is considered
                available.
              </p>
            </VStack>
            <HStack gap={2} align="center">
              <NumberInput value={minReady} onChange={onMinReadyChange} min={0} width="sm" />
              <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                Seconds
              </span>
            </HStack>
          </VStack>

          {/* Revision History Limit */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                Revision History Limit
              </span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                The maximum number of revision histories to retain for the Deployment.
              </p>
            </VStack>
            <HStack gap={2} align="center">
              <NumberInput
                value={revisionHistoryLimit}
                onChange={onRevisionHistoryLimitChange}
                min={0}
                width="sm"
              />
              <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                Revisions
              </span>
            </HStack>
          </VStack>

          {/* Progress Deadline */}
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                Progress Deadline
              </span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                The maximum time allowed for a Deployment to progress before it is considered
                failed.
              </p>
            </VStack>
            <HStack gap={2} align="center">
              <NumberInput
                value={progressDeadline}
                onChange={onProgressDeadlineChange}
                min={0}
                width="sm"
              />
              <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                Seconds
              </span>
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

export function CreatePodPage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Container tabs (for managing multiple containers)
  const [containerTabs, setContainerTabs] = useState<ContainerTab[]>([
    { id: 'container-0', name: 'Container-0' },
  ]);

  // Basic information state
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

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

  // HTTP Header type for probes and lifecycle hooks
  type HttpHeader = { name: string; value: string };

  // Lifecycle hook type
  type LifecycleHookConfig = {
    type: 'none' | 'exec' | 'httpGet';
    command: string;
    httpGet: {
      host: string;
      path: string;
      port: string;
      scheme: string;
      httpHeaders: HttpHeader[];
    };
  };

  // Probe configuration type
  type ProbeConfig = {
    enabled: boolean;
    type: 'none' | 'httpGet' | 'tcpSocket' | 'exec';
    httpGet: {
      path: string;
      port: string;
      scheme: string;
      host: string;
      httpHeaders: HttpHeader[];
    };
    tcpSocket: {
      port: string;
    };
    exec: {
      command: string;
    };
    initialDelaySeconds: string;
    periodSeconds: string;
    timeoutSeconds: string;
    failureThreshold: string;
    successThreshold: string;
  };

  // Container config type
  type ContainerConfig = {
    // Basic Information
    name: string;
    containerType: 'init' | 'standard';
    // Image
    image: string;
    imagePullPolicy: string;
    pullSecrets: string;
    // Commands
    command: string;
    args: string;
    workingDir: string;
    stdin: string;
    // Ports
    ports: { name: string; containerPort: string; protocol: string }[];
    // Environment Variables
    envVars: {
      name: string;
      value: string;
      type: 'value' | 'configmap' | 'secret';
      configMapName?: string;
      configMapKey?: string;
      secretName?: string;
      secretKey?: string;
    }[];
    // Service Account
    serviceAccountName: string;
    // Lifecycle Hooks
    lifecycleHooks: {
      postStart: LifecycleHookConfig;
      preStop: LifecycleHookConfig;
    };
    // Health Checks
    startupProbe: ProbeConfig;
    livenessProbe: ProbeConfig;
    readinessProbe: ProbeConfig;
    // Resources
    cpuRequest: string;
    cpuRequestUnit: string;
    cpuLimit: string;
    cpuLimitUnit: string;
    memoryRequest: string;
    memoryRequestUnit: string;
    memoryLimit: string;
    memoryLimitUnit: string;
    gpuLimit: string;
    // Networking
    stdin: boolean;
    tty: boolean;
    // Security Context
    runAsUser: string;
    runAsGroup: string;
    runAsNonRoot: boolean;
    privileged: boolean;
    readOnlyRootFilesystem: boolean;
    allowPrivilegeEscalation: boolean;
    // Volume Mounts
    volumeMounts: { name: string; mountPath: string; subPath: string; readOnly: boolean }[];
    // Storage
    selectedVolume: string;
  };

  // Default probe config
  const defaultProbeConfig: ProbeConfig = {
    enabled: false,
    type: 'none',
    httpGet: {
      path: '/',
      port: '8080',
      scheme: 'HTTP',
      host: '',
      httpHeaders: isV2 ? [{ name: '', value: '' }] : [],
    },
    tcpSocket: {
      port: '8080',
    },
    exec: {
      command: '',
    },
    initialDelaySeconds: '0',
    periodSeconds: '10',
    timeoutSeconds: '1',
    failureThreshold: '3',
    successThreshold: '1',
  };

  // Default lifecycle hook config
  const defaultLifecycleHookConfig: LifecycleHookConfig = {
    type: 'none',
    command: '',
    httpGet: {
      host: '',
      path: '',
      port: '',
      scheme: 'HTTP',
      httpHeaders: isV2 ? [{ name: '', value: '' }] : [],
    },
  };

  // Container-specific state
  const [containerConfigs, setContainerConfigs] = useState<Record<string, ContainerConfig>>({
    'container-0': {
      // Basic Information
      name: '',
      containerType: 'standard',
      // Image
      image: '',
      imagePullPolicy: 'IfNotPresent',
      pullSecrets: '',
      // Commands
      command: '',
      args: '',
      workingDir: '',
      // Ports
      ports: [],
      // Environment Variables
      envVars: isV2 ? [{ name: '', value: '', type: 'value' as const }] : [],
      // Service Account
      serviceAccountName: '',
      // Lifecycle Hooks
      lifecycleHooks: {
        postStart: { ...defaultLifecycleHookConfig },
        preStop: { ...defaultLifecycleHookConfig },
      },
      // Health Checks
      startupProbe: { ...defaultProbeConfig },
      livenessProbe: { ...defaultProbeConfig },
      readinessProbe: { ...defaultProbeConfig },
      // Resources
      cpuRequest: '',
      cpuRequestUnit: 'm',
      cpuLimit: '',
      cpuLimitUnit: 'm',
      memoryRequest: '',
      memoryRequestUnit: 'Mi',
      memoryLimit: '',
      memoryLimitUnit: 'Mi',
      gpuLimit: '',
      // Networking
      stdin: false,
      tty: false,
      // Security Context
      runAsUser: '',
      runAsGroup: '',
      runAsNonRoot: false,
      privileged: false,
      readOnlyRootFilesystem: false,
      allowPrivilegeEscalation: false,
      // Volume Mounts
      volumeMounts: [],
      // Storage
      selectedVolume: '',
    },
  });

  // Pod Labels & Annotations state
  const [podLabels, setPodLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [podAnnotations, setPodAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Scaling and Upgrade Policy state
  const [terminationGracePeriod, setTerminationGracePeriod] = useState<string>('');

  // Node Scheduling state
  const [nodeScheduling, setNodeScheduling] = useState<string>('any');

  // Networking state
  const [networkMode, setNetworkMode] = useState<string>('normal');
  const [dnsPolicy, setDnsPolicy] = useState<string>('cluster-first');

  // Security Context state
  const [podFilesystemGroup, setPodFilesystemGroup] = useState<string>('1');

  // Service Account state
  const [serviceAccountOption, setServiceAccountOption] = useState<string>('any');
  const [selectedNode, setSelectedNode] = useState<string>('');

  // Tolerations state
  const [tolerations, setTolerations] = useState<Toleration[]>(
    isV2
      ? [
          {
            key: '',
            operator: 'Equal',
            value: '',
            effect: 'NoSchedule',
            tolerationSeconds: '',
            tolerationSecondsUnit: 'sec',
          },
        ]
      : []
  );
  const [priority, setPriority] = useState<string>('');
  const [priorityClassName, setPriorityClassName] = useState<string>('');

  // Volumes state
  const [volumes, setVolumes] = useState<Volume[]>(
    isV2
      ? [
          { type: 'configmap' as const, volumeName: '', configMapName: '', optional: false },
          {
            type: 'secret' as const,
            volumeName: '',
            secretName: '',
            optional: false,
            defaultMode: '',
          },
          { type: 'pvc' as const, volumeName: '', pvcName: '', readOnly: false },
          {
            type: 'create-pvc' as const,
            volumeName: '',
            pvcName: '',
            useExistingPV: false,
            storageClass: '',
            capacity: '',
            persistentVolume: '',
            accessModes: { readWriteOnce: false, readOnlyMany: false, readWriteMany: false },
            readOnly: false,
          },
        ]
      : []
  );
  const [volumeType, setVolumeType] = useState<string>('configmap');

  // Node Affinity state
  const [nodeAffinityTerms, setNodeAffinityTerms] = useState<NodeAffinityTerm[]>(
    isV2
      ? [{ priority: '', weight: '', matchExpressions: [{ key: '', operator: 'In', value: '' }] }]
      : []
  );

  // Pod Affinity state
  const [podAffinityTerms, setPodAffinityTerms] = useState<PodAffinityTerm[]>(
    isV2
      ? [
          {
            type: '',
            priority: '',
            namespaces: 'all' as const,
            selectedNamespaces: [],
            topologyKey: '',
            weight: '',
            matchExpressions: [{ key: '', operator: 'In', value: '' }],
          },
          {
            type: '',
            priority: '',
            namespaces: 'selected' as const,
            selectedNamespaces: [],
            topologyKey: '',
            weight: '',
            matchExpressions: [{ key: '', operator: 'In', value: '' }],
          },
        ]
      : []
  );

  // Hostname and Subdomain state
  const [hostname, setHostname] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');

  // Nameservers and Search Domains state
  const [nameservers, setNameservers] = useState<string[]>(isV2 ? [''] : []);
  const [searchDomains, setSearchDomains] = useState<string[]>(isV2 ? [''] : []);

  // Resolver Options state
  const [resolverOptions, setResolverOptions] = useState<{ name: string; value: string }[]>(
    isV2 ? [{ name: '', value: '' }] : []
  );

  // Host Aliases state
  const [hostAliases, setHostAliases] = useState<{ ip: string; hostname: string }[]>(
    isV2 ? [{ ip: '', hostname: '' }] : []
  );

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
    updateActiveTabLabel('Create Pod');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Active form tab (Pod, Container-X)
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pod';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Build inner tabs for the form
  const formTabs = [
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
        setActiveTab('pod');
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

    console.log('Creating pod:', {
      namespace,
      name,
      description,
      labels,
      annotations,
    });
    navigate('/container/pods');
  }, [namespace, name, description, labels, annotations, navigate]);

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

  // Toleration management
  const addToleration = useCallback(() => {
    setTolerations([
      ...tolerations,
      {
        key: '',
        operator: 'Equal',
        value: '',
        effect: 'NoSchedule',
        tolerationSeconds: '',
        tolerationSecondsUnit: 'sec',
      },
    ]);
  }, [tolerations]);

  const removeToleration = useCallback(
    (index: number) => {
      setTolerations(tolerations.filter((_, i) => i !== index));
    },
    [tolerations]
  );

  const updateToleration = useCallback(
    (index: number, field: keyof Toleration, value: string) => {
      const newTolerations = [...tolerations];
      newTolerations[index] = { ...newTolerations[index], [field]: value };
      setTolerations(newTolerations);
    },
    [tolerations]
  );

  // Volume management
  const addVolume = useCallback(
    (type: string) => {
      if (type === 'configmap') {
        setVolumes([
          ...volumes,
          { type: 'configmap', volumeName: '', configMapName: '', optional: false },
        ]);
      } else if (type === 'secret') {
        setVolumes([
          ...volumes,
          { type: 'secret', volumeName: '', secretName: '', optional: false, defaultMode: '' },
        ]);
      } else if (type === 'pvc') {
        setVolumes([...volumes, { type: 'pvc', volumeName: '', pvcName: '', readOnly: false }]);
      } else if (type === 'create-pvc') {
        setVolumes([
          ...volumes,
          {
            type: 'create-pvc',
            volumeName: '',
            pvcName: '',
            useExistingPV: false,
            storageClass: '',
            capacity: '',
            persistentVolume: '',
            accessModes: { readWriteOnce: false, readOnlyMany: false, readWriteMany: false },
            readOnly: false,
          },
        ]);
      }
    },
    [volumes]
  );

  const removeVolume = useCallback(
    (index: number) => {
      setVolumes(volumes.filter((_, i) => i !== index));
    },
    [volumes]
  );

  const updateVolume = useCallback(
    (index: number, updates: Partial<Volume>) => {
      const newVolumes = [...volumes];
      newVolumes[index] = { ...newVolumes[index], ...updates } as Volume;
      setVolumes(newVolumes);
    },
    [volumes]
  );

  // Nameserver management
  const addNameserver = useCallback(() => {
    setNameservers([...nameservers, '']);
  }, [nameservers]);

  const removeNameserver = useCallback(
    (index: number) => {
      setNameservers(nameservers.filter((_, i) => i !== index));
    },
    [nameservers]
  );

  const updateNameserver = useCallback(
    (index: number, value: string) => {
      const newNameservers = [...nameservers];
      newNameservers[index] = value;
      setNameservers(newNameservers);
    },
    [nameservers]
  );

  // Search Domain management
  const addSearchDomain = useCallback(() => {
    setSearchDomains([...searchDomains, '']);
  }, [searchDomains]);

  const removeSearchDomain = useCallback(
    (index: number) => {
      setSearchDomains(searchDomains.filter((_, i) => i !== index));
    },
    [searchDomains]
  );

  const updateSearchDomain = useCallback(
    (index: number, value: string) => {
      const newSearchDomains = [...searchDomains];
      newSearchDomains[index] = value;
      setSearchDomains(newSearchDomains);
    },
    [searchDomains]
  );

  // Resolver Options management
  const addResolverOption = useCallback(() => {
    setResolverOptions([...resolverOptions, { name: '', value: '' }]);
  }, [resolverOptions]);

  const removeResolverOption = useCallback(
    (index: number) => {
      setResolverOptions(resolverOptions.filter((_, i) => i !== index));
    },
    [resolverOptions]
  );

  const updateResolverOption = useCallback(
    (index: number, field: 'name' | 'value', value: string) => {
      const newOptions = [...resolverOptions];
      newOptions[index] = { ...newOptions[index], [field]: value };
      setResolverOptions(newOptions);
    },
    [resolverOptions]
  );

  // Host Alias management
  const addHostAlias = useCallback(() => {
    setHostAliases([...hostAliases, { ip: '', hostname: '' }]);
  }, [hostAliases]);

  const removeHostAlias = useCallback(
    (index: number) => {
      setHostAliases(hostAliases.filter((_, i) => i !== index));
    },
    [hostAliases]
  );

  const updateHostAlias = useCallback(
    (index: number, field: 'ip' | 'hostname', value: string) => {
      const newAliases = [...hostAliases];
      newAliases[index] = { ...newAliases[index], [field]: value };
      setHostAliases(newAliases);
    },
    [hostAliases]
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
        // Basic Information
        name: '',
        containerType: 'standard',
        // Image
        image: '',
        imagePullPolicy: 'IfNotPresent',
        pullSecrets: '',
        // Commands
        command: '',
        args: '',
        workingDir: '',
        // Ports
        ports: [],
        // Environment Variables
        envVars: [],
        // Service Account
        serviceAccountName: '',
        // Lifecycle Hooks
        lifecycleHooks: {
          postStart: { ...defaultLifecycleHookConfig },
          preStop: { ...defaultLifecycleHookConfig },
        },
        // Health Checks
        startupProbe: { ...defaultProbeConfig },
        livenessProbe: { ...defaultProbeConfig },
        readinessProbe: { ...defaultProbeConfig },
        // Resources
        cpuRequest: '',
        cpuRequestUnit: 'm',
        cpuLimit: '',
        cpuLimitUnit: 'm',
        memoryRequest: '',
        memoryRequestUnit: 'Mi',
        memoryLimit: '',
        memoryLimitUnit: 'Mi',
        gpuLimit: '',
        // Networking
        stdin: false,
        tty: false,
        // Security Context
        runAsUser: '',
        runAsGroup: '',
        runAsNonRoot: false,
        privileged: false,
        readOnlyRootFilesystem: false,
        allowPrivilegeEscalation: false,
        // Volume Mounts
        volumeMounts: [],
        // Storage
        selectedVolume: '',
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
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
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
                { label: 'clusterName', href: '/container' },
                { label: 'Pods', href: '/container/pods' },
                { label: 'Create pod' },
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
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={2}>
          <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
            Create Pod
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Create a Pod to run one or more containers as the smallest deployable unit in
            Kubernetes.
          </p>
        </VStack>

        {/* Form Tabs - Outside the row so sidebar aligns with content */}
        <div className="w-full border-b border-[var(--color-border-default)]">
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            size="sm"
            variant="underline"
            className="max-w-[861px]"
          >
            <div className="flex items-start">
              <TabList className="after:hidden min-w-0 overflow-hidden">
                {formTabs.map((tab) => (
                  <Tab key={tab.id} value={tab.id} className="min-w-0 shrink">
                    <HStack gap={2} align="center" className="min-w-0">
                      <span className="truncate">{tab.label}</span>
                      {tab.closable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeContainerTab(tab.id);
                          }}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                        >
                          <IconX size={16} stroke={1.5} />
                        </button>
                      )}
                    </HStack>
                  </Tab>
                ))}
              </TabList>
              <button
                onClick={addContainerTab}
                className="flex items-center justify-center h-[20px] px-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors text-[var(--color-text-muted)] shrink-0"
              >
                <IconPlus size={16} stroke={1.5} />
              </button>
            </div>
          </Tabs>
        </div>

        {/* Main Content with Sidebar */}
        <HStack gap={6} className="w-full items-start">
          {/* Form Content */}
          <VStack gap={4} className="flex-1">
            {/* Pod Tab */}
            {activeTab === 'pod' && (
              <>
                <BasicInfoSection
                  namespace={namespace}
                  onNamespaceChange={setNamespace}
                  name={name}
                  onNameChange={setName}
                  nameError={nameError}
                  onNameErrorChange={setNameError}
                  description={description}
                  onDescriptionChange={setDescription}
                />

                {/* Labels & Annotations */}
                <SectionCard>
                  <SectionCard.Header title="Labels & Annotations" />
                  <SectionCard.Content>
                    <VStack gap={6}>
                      {/* Labels */}
                      <VStack gap={3}>
                        <VStack gap={1.5}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Labels
                          </span>
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the labels used to identify and categorize the resource.
                          </p>
                        </VStack>

                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {podLabels.length > 0 && (
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
                            {podLabels.map((label, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="label key"
                                  value={label.key}
                                  onChange={(e) => updatePodLabel(index, 'key', e.target.value)}
                                  fullWidth
                                />
                                <Input
                                  placeholder="label value"
                                  value={label.value}
                                  onChange={(e) => updatePodLabel(index, 'value', e.target.value)}
                                  fullWidth
                                />
                                <button
                                  onClick={() => removePodLabel(index)}
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
                                onClick={addPodLabel}
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
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the annotations used to provide additional metadata for the
                            resource.
                          </p>
                        </VStack>

                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {podAnnotations.length > 0 && (
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
                            {podAnnotations.map((annotation, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="annotation key"
                                  value={annotation.key}
                                  onChange={(e) =>
                                    updatePodAnnotation(index, 'key', e.target.value)
                                  }
                                  fullWidth
                                />
                                <Input
                                  placeholder="annotation value"
                                  value={annotation.value}
                                  onChange={(e) =>
                                    updatePodAnnotation(index, 'value', e.target.value)
                                  }
                                  fullWidth
                                />
                                <button
                                  onClick={() => removePodAnnotation(index)}
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
                                onClick={addPodAnnotation}
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

                {/* Scaling and Upgrade Policy */}
                <SectionCard>
                  <SectionCard.Header title="Scaling and Upgrade Policy" />
                  <SectionCard.Content>
                    <VStack gap={6}>
                      <span className="text-label-lg text-[var(--color-text-default)]">
                        Pod Policy
                      </span>
                      <VStack gap={1} className="w-full">
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Termination Grace Period
                        </span>
                        <span className="text-body-md text-[var(--color-text-subtle)]">
                          The period allowed after receiving a termination request before the pod is
                          forcibly terminated.
                        </span>
                        <HStack gap={2} align="center">
                          <NumberInput
                            value={
                              terminationGracePeriod ? parseInt(terminationGracePeriod) : undefined
                            }
                            onChange={(val) => setTerminationGracePeriod(val?.toString() || '')}
                            size="sm"
                            width="sm"
                          />
                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                            Seconds
                          </span>
                        </HStack>
                      </VStack>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Networking */}
                <SectionCard>
                  <SectionCard.Header title="Networking" />
                  <SectionCard.Content>
                    <VStack gap={6}>
                      {/* Network Settings */}
                      <VStack gap={6}>
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Network Settings
                        </span>
                        <VStack gap={6} className="w-full">
                          <FormField>
                            <FormField.Label>Network Mode</FormField.Label>
                            <FormField.Description>
                              Select the networking mode for the pod.
                            </FormField.Description>
                            <FormField.Control>
                              <Select
                                options={[
                                  { value: 'normal', label: 'Normal' },
                                  { value: 'host', label: 'Host' },
                                ]}
                                value={networkMode}
                                onChange={setNetworkMode}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>
                          <FormField>
                            <FormField.Label>DNS Policy</FormField.Label>
                            <FormField.Description>
                              Select the DNS policy to apply to the pod.
                            </FormField.Description>
                            <FormField.Control>
                              <Select
                                options={[
                                  { value: 'cluster-first', label: 'Cluster first' },
                                  { value: 'default', label: 'Default' },
                                  { value: 'none', label: 'None' },
                                ]}
                                value={dnsPolicy}
                                onChange={setDnsPolicy}
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>
                          <FormField>
                            <FormField.Label>Hostname</FormField.Label>
                            <FormField.Description>
                              Specify the hostname assigned to the pod.
                            </FormField.Description>
                            <FormField.Control>
                              <Input
                                placeholder="e.g. web"
                                fullWidth
                                value={hostname}
                                onChange={(e) => setHostname(e.target.value)}
                              />
                            </FormField.Control>
                          </FormField>
                          <FormField>
                            <FormField.Label>Subdomain</FormField.Label>
                            <FormField.Description>
                              Specify the subdomain assigned to the pod.
                            </FormField.Description>
                            <FormField.Control>
                              <Input
                                placeholder="e.g. web"
                                fullWidth
                                value={subdomain}
                                onChange={(e) => setSubdomain(e.target.value)}
                              />
                            </FormField.Control>
                          </FormField>
                        </VStack>
                      </VStack>

                      {/* Nameservers */}
                      <VStack gap={3}>
                        <VStack gap={1.5}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Nameservers
                          </span>
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the DNS nameserver addresses used by the pod.
                          </p>
                        </VStack>

                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {nameservers.length > 0 && (
                              <div className="grid grid-cols-[1fr_20px] gap-2 w-full">
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <div />
                              </div>
                            )}
                            {nameservers.map((ns, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="e.g. 8.8.8.8"
                                  value={ns}
                                  onChange={(e) => updateNameserver(index, e.target.value)}
                                  fullWidth
                                />
                                <button
                                  onClick={() => removeNameserver(index)}
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
                                onClick={addNameserver}
                              >
                                Add Nameserver
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>

                      {/* Search Domains */}
                      <VStack gap={3}>
                        <VStack gap={1.5}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Search Domains
                          </span>
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the search domains used for DNS resolution.
                          </p>
                        </VStack>

                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {searchDomains.length > 0 && (
                              <div className="grid grid-cols-[1fr_20px] gap-2 w-full">
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <div />
                              </div>
                            )}
                            {searchDomains.map((sd, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="e.g. example.com"
                                  value={sd}
                                  onChange={(e) => updateSearchDomain(index, e.target.value)}
                                  fullWidth
                                />
                                <button
                                  onClick={() => removeSearchDomain(index)}
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
                                onClick={addSearchDomain}
                              >
                                Add Search Domain
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>

                      {/* Resolver Options */}
                      <VStack gap={3}>
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Resolver Options
                        </span>

                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {resolverOptions.length > 0 && (
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
                            {resolverOptions.map((opt, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="input name"
                                  value={opt.name}
                                  onChange={(e) =>
                                    updateResolverOption(index, 'name', e.target.value)
                                  }
                                  fullWidth
                                />
                                <Input
                                  placeholder="input value"
                                  value={opt.value}
                                  onChange={(e) =>
                                    updateResolverOption(index, 'value', e.target.value)
                                  }
                                  fullWidth
                                />
                                <button
                                  onClick={() => removeResolverOption(index)}
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
                                onClick={addResolverOption}
                              >
                                Add Option
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>

                      {/* Host Aliases */}
                      <VStack gap={3}>
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Host Aliases
                        </span>

                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {hostAliases.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  IP
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Hostnames
                                </span>
                                <div />
                              </div>
                            )}
                            {hostAliases.map((alias, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="e.g. 127.0.0.1"
                                  value={alias.ip}
                                  onChange={(e) => updateHostAlias(index, 'ip', e.target.value)}
                                  fullWidth
                                />
                                <Input
                                  placeholder="e.g. foo.company.com"
                                  value={alias.hostname}
                                  onChange={(e) =>
                                    updateHostAlias(index, 'hostname', e.target.value)
                                  }
                                  fullWidth
                                />
                                <button
                                  onClick={() => removeHostAlias(index)}
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
                                onClick={addHostAlias}
                              >
                                Add Alias
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Node Scheduling */}
                <SectionCard>
                  <SectionCard.Header title="Node scheduling" />
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
                      {(isV2 || nodeScheduling === 'specific') && (
                        <FormField>
                          <FormField.Label>Node</FormField.Label>
                          <FormField.Control>
                            <Select
                              options={[
                                { value: 'node-1', label: 'node-1' },
                                { value: 'node-2', label: 'node-2' },
                                { value: 'node-3', label: 'node-3' },
                              ]}
                              value={selectedNode}
                              onChange={setSelectedNode}
                              placeholder="Select a node"
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                      )}
                      {isV2 && (
                        <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                          <VStack gap={3}>
                            <VStack gap={1.5}>
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Matching scheduling rules
                              </span>
                              <p className="text-body-md text-[var(--color-text-subtle)]">
                                Define rules for scheduling pods on specific nodes based on node
                                labels.
                              </p>
                            </VStack>

                            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                              <VStack gap={3}>
                                {nodeAffinityTerms.map((term, termIndex) => (
                                  <div
                                    key={termIndex}
                                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                  >
                                    <VStack gap={6}>
                                      <div className="flex items-start justify-between w-full">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Rule {termIndex + 1}
                                        </span>
                                        <button
                                          onClick={() => {
                                            setNodeAffinityTerms(
                                              nodeAffinityTerms.filter((_, i) => i !== termIndex)
                                            );
                                          }}
                                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                        >
                                          <IconX
                                            size={16}
                                            className="text-[var(--color-text-muted)]"
                                            stroke={1.5}
                                          />
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3">
                                        <VStack gap={2}>
                                          <span className="block text-label-lg text-[var(--color-text-default)]">
                                            Priority
                                          </span>
                                          <Select
                                            options={[
                                              { value: 'required', label: 'Required' },
                                              { value: 'preferred', label: 'Preferred' },
                                            ]}
                                            value={term.priority}
                                            onChange={(val) => {
                                              const newTerms = [...nodeAffinityTerms];
                                              newTerms[termIndex] = {
                                                ...newTerms[termIndex],
                                                priority: val,
                                              };
                                              setNodeAffinityTerms(newTerms);
                                            }}
                                            fullWidth
                                          />
                                        </VStack>
                                        {(isV2 || term.priority === 'preferred') && (
                                          <VStack gap={2}>
                                            <span className="block text-label-lg text-[var(--color-text-default)]">
                                              Weight
                                            </span>
                                            <Input
                                              placeholder="1-100"
                                              value={term.weight}
                                              onChange={(e) => {
                                                const newTerms = [...nodeAffinityTerms];
                                                newTerms[termIndex] = {
                                                  ...newTerms[termIndex],
                                                  weight: e.target.value,
                                                };
                                                setNodeAffinityTerms(newTerms);
                                              }}
                                              fullWidth
                                            />
                                          </VStack>
                                        )}
                                      </div>

                                      <VStack gap={2}>
                                        <span className="block text-label-lg text-[var(--color-text-default)]">
                                          Match Expressions
                                        </span>
                                        {term.matchExpressions.length > 0 && (
                                          <div className="grid grid-cols-[1fr_140px_1fr_20px] gap-2 w-full">
                                            <span className="block text-label-lg text-[var(--color-text-default)]">
                                              Key
                                            </span>
                                            <span className="block text-label-lg text-[var(--color-text-default)]">
                                              Operator
                                            </span>
                                            <span className="block text-label-lg text-[var(--color-text-default)]">
                                              Value
                                            </span>
                                            <div />
                                          </div>
                                        )}
                                        {term.matchExpressions.map((expr, exprIndex) => (
                                          <div
                                            key={exprIndex}
                                            className="grid grid-cols-[1fr_140px_1fr_20px] gap-2 w-full items-center"
                                          >
                                            <Input
                                              placeholder="e.g. kubernetes.io/os"
                                              value={expr.key}
                                              onChange={(e) => {
                                                const newTerms = [...nodeAffinityTerms];
                                                newTerms[termIndex].matchExpressions[exprIndex] = {
                                                  ...expr,
                                                  key: e.target.value,
                                                };
                                                setNodeAffinityTerms(newTerms);
                                              }}
                                              fullWidth
                                            />
                                            <Select
                                              options={[
                                                { value: 'In', label: 'In' },
                                                { value: 'NotIn', label: 'NotIn' },
                                                { value: 'Exists', label: 'Exists' },
                                                {
                                                  value: 'DoesNotExist',
                                                  label: 'DoesNotExist',
                                                },
                                                { value: 'Gt', label: 'Gt' },
                                                { value: 'Lt', label: 'Lt' },
                                              ]}
                                              value={expr.operator}
                                              onChange={(val) => {
                                                const newTerms = [...nodeAffinityTerms];
                                                newTerms[termIndex].matchExpressions[exprIndex] = {
                                                  ...expr,
                                                  operator: val,
                                                };
                                                setNodeAffinityTerms(newTerms);
                                              }}
                                              fullWidth
                                            />
                                            <Input
                                              placeholder="e.g. linux"
                                              value={expr.value}
                                              onChange={(e) => {
                                                const newTerms = [...nodeAffinityTerms];
                                                newTerms[termIndex].matchExpressions[exprIndex] = {
                                                  ...expr,
                                                  value: e.target.value,
                                                };
                                                setNodeAffinityTerms(newTerms);
                                              }}
                                              fullWidth
                                            />
                                            <button
                                              onClick={() => {
                                                const newTerms = [...nodeAffinityTerms];
                                                newTerms[termIndex].matchExpressions = newTerms[
                                                  termIndex
                                                ].matchExpressions.filter(
                                                  (_, i) => i !== exprIndex
                                                );
                                                setNodeAffinityTerms(newTerms);
                                              }}
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
                                            onClick={() => {
                                              const newTerms = [...nodeAffinityTerms];
                                              newTerms[termIndex].matchExpressions.push({
                                                key: '',
                                                operator: 'In',
                                                value: '',
                                              });
                                              setNodeAffinityTerms(newTerms);
                                            }}
                                          >
                                            Add Expression
                                          </Button>
                                        </div>
                                      </VStack>
                                    </VStack>
                                  </div>
                                ))}

                                <div className="w-fit">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                    onClick={() => {
                                      setNodeAffinityTerms([
                                        ...nodeAffinityTerms,
                                        {
                                          priority: 'required',
                                          weight: '',
                                          matchExpressions: [
                                            { key: '', operator: 'In', value: '' },
                                          ],
                                        },
                                      ]);
                                    }}
                                  >
                                    Add Rule
                                  </Button>
                                </div>
                              </VStack>
                            </div>

                            <div className="w-fit">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                              >
                                Add Node Selector
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      )}
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Pod Scheduling */}
                <SectionCard>
                  <SectionCard.Header title="Pod scheduling" />
                  <SectionCard.Content>
                    <VStack gap={6}>
                      {podAffinityTerms.map((term, termIndex) => (
                        <div
                          key={termIndex}
                          className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full"
                        >
                          <VStack gap={6}>
                            {/* Type Section */}
                            <VStack gap={3}>
                              <div className="flex items-start justify-between w-full">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Type
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Select the scheduling type to apply to the pod.
                                  </span>
                                </VStack>
                                <button
                                  onClick={() => {
                                    setPodAffinityTerms(
                                      podAffinityTerms.filter((_, i) => i !== termIndex)
                                    );
                                  }}
                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                >
                                  <IconX
                                    size={16}
                                    className="text-[var(--color-text-muted)]"
                                    stroke={1.5}
                                  />
                                </button>
                              </div>
                              <Select
                                options={[
                                  { value: 'affinity', label: 'Affinity' },
                                  { value: 'anti-affinity', label: 'Anti-Affinity' },
                                ]}
                                value={term.type}
                                onChange={(val) => {
                                  const newTerms = [...podAffinityTerms];
                                  newTerms[termIndex] = { ...newTerms[termIndex], type: val };
                                  setPodAffinityTerms(newTerms);
                                }}
                                fullWidth
                              />
                            </VStack>

                            {/* Priority Section */}
                            <VStack gap={3}>
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Priority
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the priority value applied to pod scheduling.
                                </span>
                              </VStack>
                              <Select
                                options={[
                                  { value: 'required', label: 'Required' },
                                  { value: 'preferred', label: 'Preferred' },
                                ]}
                                value={term.priority}
                                onChange={(val) => {
                                  const newTerms = [...podAffinityTerms];
                                  newTerms[termIndex] = {
                                    ...newTerms[termIndex],
                                    priority: val,
                                  };
                                  setPodAffinityTerms(newTerms);
                                }}
                                fullWidth
                              />
                            </VStack>

                            {/* Namespace Selection */}
                            <RadioGroup
                              value={term.namespaces}
                              onChange={(val) => {
                                const newTerms = [...podAffinityTerms];
                                newTerms[termIndex] = {
                                  ...newTerms[termIndex],
                                  namespaces: val as 'all' | 'selected',
                                };
                                setPodAffinityTerms(newTerms);
                              }}
                            >
                              <Radio value="all" label="This pod's namespace" />
                              <Radio value="selected" label="Specific namespaces" />
                            </RadioGroup>

                            {/* Specific Namespaces Section - shown when 'selected' is chosen */}
                            {term.namespaces === 'selected' && (
                              <VStack gap={3}>
                                {/* Search Input */}
                                <SearchInput
                                  placeholder="Search namespaces by attributes"
                                  className="w-[var(--search-input-width)]"
                                />

                                {/* Pagination */}
                                <Pagination
                                  currentPage={1}
                                  totalPages={Math.ceil(MOCK_NAMESPACES.length / 5)}
                                  onPageChange={() => {}}
                                  showSettings
                                  totalItems={
                                    MOCK_NAMESPACES.length > 100 ? 115 : MOCK_NAMESPACES.length
                                  }
                                  selectedCount={term.selectedNamespaces.length}
                                />

                                {/* Namespace Table */}
                                <Table
                                  columns={[
                                    {
                                      key: 'status',
                                      label: 'Status',
                                      width: '64px',
                                      align: 'center',
                                      render: (_, row: NamespaceData) => (
                                        <StatusIndicator status={row.status} />
                                      ),
                                    },
                                    {
                                      key: 'name',
                                      label: 'Name',
                                      sortable: true,
                                      render: (value: string) => (
                                        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
                                          {value}
                                        </span>
                                      ),
                                    },
                                    {
                                      key: 'description',
                                      label: 'Description',
                                      sortable: true,
                                    },
                                    {
                                      key: 'createdAt',
                                      label: 'Created at',
                                      sortable: true,
                                    },
                                  ]}
                                  data={MOCK_NAMESPACES.slice(0, 5)}
                                  rowKey="id"
                                  selectable
                                  selectedKeys={term.selectedNamespaces}
                                  onSelectionChange={(keys) => {
                                    const newTerms = [...podAffinityTerms];
                                    newTerms[termIndex] = {
                                      ...newTerms[termIndex],
                                      selectedNamespaces: keys,
                                    };
                                    setPodAffinityTerms(newTerms);
                                  }}
                                />

                                {/* Selected Namespace Chips */}
                                <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-2 py-2 flex flex-wrap gap-1 min-h-[42px] items-center">
                                  {term.selectedNamespaces.length > 0 ? (
                                    term.selectedNamespaces.map((nsId) => {
                                      const ns = MOCK_NAMESPACES.find((n) => n.id === nsId);
                                      return ns ? (
                                        <Chip
                                          key={nsId}
                                          value={ns.name}
                                          variant="selected"
                                          onRemove={() => {
                                            const newTerms = [...podAffinityTerms];
                                            newTerms[termIndex] = {
                                              ...newTerms[termIndex],
                                              selectedNamespaces: term.selectedNamespaces.filter(
                                                (id) => id !== nsId
                                              ),
                                            };
                                            setPodAffinityTerms(newTerms);
                                          }}
                                        />
                                      ) : null;
                                    })
                                  ) : (
                                    <span className="text-body-md text-[var(--color-text-subtle)]">
                                      No item selected
                                    </span>
                                  )}
                                </div>
                              </VStack>
                            )}

                            {/* Match Expressions / Rules Section */}
                            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                              <VStack gap={2}>
                                {term.matchExpressions.map((expr, exprIndex) => (
                                  <div
                                    key={exprIndex}
                                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                  >
                                    <div className="flex gap-2 items-start w-full">
                                      <VStack gap={2} className="flex-1">
                                        <span className="block text-label-lg text-[var(--color-text-default)]">
                                          Key
                                        </span>
                                        <Input
                                          placeholder="Input key"
                                          value={expr.key}
                                          onChange={(e) => {
                                            const newTerms = [...podAffinityTerms];
                                            const newExpressions = [
                                              ...newTerms[termIndex].matchExpressions,
                                            ];
                                            newExpressions[exprIndex] = {
                                              ...newExpressions[exprIndex],
                                              key: e.target.value,
                                            };
                                            newTerms[termIndex] = {
                                              ...newTerms[termIndex],
                                              matchExpressions: newExpressions,
                                            };
                                            setPodAffinityTerms(newTerms);
                                          }}
                                          fullWidth
                                        />
                                      </VStack>
                                      <VStack gap={2} className="flex-1">
                                        <span className="block text-label-lg text-[var(--color-text-default)]">
                                          Operator
                                        </span>
                                        <Select
                                          options={OPERATOR_OPTIONS}
                                          value={expr.operator}
                                          onChange={(val) => {
                                            const newTerms = [...podAffinityTerms];
                                            const newExpressions = [
                                              ...newTerms[termIndex].matchExpressions,
                                            ];
                                            newExpressions[exprIndex] = {
                                              ...newExpressions[exprIndex],
                                              operator: val,
                                            };
                                            newTerms[termIndex] = {
                                              ...newTerms[termIndex],
                                              matchExpressions: newExpressions,
                                            };
                                            setPodAffinityTerms(newTerms);
                                          }}
                                          fullWidth
                                        />
                                      </VStack>
                                      <VStack gap={2} className="flex-1">
                                        <span className="block text-label-lg text-[var(--color-text-default)]">
                                          Value
                                        </span>
                                        <Input
                                          placeholder="input value"
                                          value={expr.value}
                                          onChange={(e) => {
                                            const newTerms = [...podAffinityTerms];
                                            const newExpressions = [
                                              ...newTerms[termIndex].matchExpressions,
                                            ];
                                            newExpressions[exprIndex] = {
                                              ...newExpressions[exprIndex],
                                              value: e.target.value,
                                            };
                                            newTerms[termIndex] = {
                                              ...newTerms[termIndex],
                                              matchExpressions: newExpressions,
                                            };
                                            setPodAffinityTerms(newTerms);
                                          }}
                                          fullWidth
                                        />
                                      </VStack>
                                      <button
                                        onClick={() => {
                                          const newTerms = [...podAffinityTerms];
                                          newTerms[termIndex] = {
                                            ...newTerms[termIndex],
                                            matchExpressions: newTerms[
                                              termIndex
                                            ].matchExpressions.filter((_, i) => i !== exprIndex),
                                          };
                                          setPodAffinityTerms(newTerms);
                                        }}
                                        className="mt-6 size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                      >
                                        <IconX
                                          size={16}
                                          className="text-[var(--color-text-muted)]"
                                          stroke={1.5}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <div className="w-fit">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                    onClick={() => {
                                      const newTerms = [...podAffinityTerms];
                                      newTerms[termIndex] = {
                                        ...newTerms[termIndex],
                                        matchExpressions: [
                                          ...newTerms[termIndex].matchExpressions,
                                          { key: '', operator: 'In', value: '' },
                                        ],
                                      };
                                      setPodAffinityTerms(newTerms);
                                    }}
                                  >
                                    Add Rule
                                  </Button>
                                </div>
                              </VStack>
                            </div>

                            {/* Topology Key Section */}
                            <VStack gap={3}>
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Topology Key
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Select the scheduling type to apply to the pod.
                                </span>
                              </VStack>
                              <Select
                                options={[
                                  {
                                    value: 'kubernetes.io/hostname',
                                    label: 'kubernetes.io/hostname',
                                  },
                                  {
                                    value: 'topology.kubernetes.io/zone',
                                    label: 'topology.kubernetes.io/zone',
                                  },
                                  {
                                    value: 'topology.kubernetes.io/region',
                                    label: 'topology.kubernetes.io/region',
                                  },
                                  {
                                    value: 'failure-domain.beta.kubernetes.io/zone',
                                    label: 'failure-domain.beta.kubernetes.io/zone',
                                  },
                                ]}
                                value={term.topologyKey}
                                onChange={(val) => {
                                  const newTerms = [...podAffinityTerms];
                                  newTerms[termIndex] = {
                                    ...newTerms[termIndex],
                                    topologyKey: val,
                                  };
                                  setPodAffinityTerms(newTerms);
                                }}
                                placeholder="e.g. failure-domain.beta.kubernetes.io/zone"
                                fullWidth
                              />
                            </VStack>
                          </VStack>
                        </div>
                      ))}

                      <div className="w-fit">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                          onClick={() => {
                            setPodAffinityTerms([
                              ...podAffinityTerms,
                              {
                                type: 'affinity',
                                priority: 'preferred',
                                namespaces: 'all',
                                selectedNamespaces: [],
                                topologyKey: '',
                                weight: '1',
                                matchExpressions: [],
                              },
                            ]);
                          }}
                        >
                          Add Pod Selector
                        </Button>
                      </div>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Resources */}
                <SectionCard>
                  <SectionCard.Header title="Resources" />
                  <SectionCard.Content>
                    <VStack gap={6}>
                      {/* Tolerations */}
                      <VStack gap={3}>
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Tolerations
                        </span>

                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {tolerations.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_20px] gap-2 w-full">
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Key
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Operator
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Effect
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Toleration Seconds
                                </span>
                                <div />
                              </div>
                            )}
                            {tolerations.map((toleration, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="Key"
                                  value={toleration.key}
                                  onChange={(e) => updateToleration(index, 'key', e.target.value)}
                                  fullWidth
                                />
                                <Select
                                  options={[
                                    { value: 'Equal', label: 'Equal' },
                                    { value: 'Exists', label: 'Exists' },
                                  ]}
                                  value={toleration.operator}
                                  onChange={(val) => updateToleration(index, 'operator', val)}
                                  fullWidth
                                />
                                <Input
                                  placeholder="Value"
                                  value={toleration.value}
                                  onChange={(e) => updateToleration(index, 'value', e.target.value)}
                                  fullWidth
                                />
                                <Select
                                  options={[
                                    { value: 'NoSchedule', label: 'NoSchedule' },
                                    {
                                      value: 'PreferNoSchedule',
                                      label: 'PreferNoSchedule',
                                    },
                                    { value: 'NoExecute', label: 'NoExecute' },
                                  ]}
                                  value={toleration.effect}
                                  onChange={(val) => updateToleration(index, 'effect', val)}
                                  fullWidth
                                />
                                <Input
                                  placeholder=""
                                  value={toleration.tolerationSeconds}
                                  onChange={(e) =>
                                    updateToleration(index, 'tolerationSeconds', e.target.value)
                                  }
                                  fullWidth
                                />
                                <button
                                  onClick={() => removeToleration(index)}
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
                                onClick={addToleration}
                              >
                                Add Toleration
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>

                      {/* Priority */}
                      <div className="grid grid-cols-2 gap-6 w-full">
                        <VStack gap={1}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Priority
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the priority value for the pod.
                          </span>
                          <Input
                            placeholder=""
                            fullWidth
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                          />
                        </VStack>
                        <VStack gap={1}>
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Priority Class Name
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the priority class name for the pod.
                          </span>
                          <Input
                            placeholder=""
                            fullWidth
                            value={priorityClassName}
                            onChange={(e) => setPriorityClassName(e.target.value)}
                          />
                        </VStack>
                      </div>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Security Context */}
                <SectionCard>
                  <SectionCard.Header title="Security context" />
                  <SectionCard.Content>
                    <VStack gap={4}>
                      <VStack gap={1}>
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Pod Filesystem Group
                        </span>
                        <span className="text-body-md text-[var(--color-text-subtle)]">
                          Specify the filesystem group used by the pod.
                        </span>
                        <div className="max-w-[160px]">
                          <NumberInput
                            value={Number(podFilesystemGroup) || 0}
                            onChange={(val) => setPodFilesystemGroup(String(val))}
                            min={0}
                            fullWidth
                          />
                        </div>
                      </VStack>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Storage */}
                <SectionCard>
                  <SectionCard.Header title="Storage" />
                  <SectionCard.Content>
                    <VStack gap={2}>
                      {volumes.map((volume, index) => (
                        <div
                          key={index}
                          className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                        >
                          <VStack gap={2}>
                            {/* Header with type title and close button */}
                            <div className="flex items-start justify-between w-full">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                {volume.type === 'configmap' && 'ConfigMap'}
                                {volume.type === 'secret' && 'Secret'}
                                {volume.type === 'pvc' && 'Persistent Volume Claim'}
                                {volume.type === 'create-pvc' && 'Create Persistent Volume Claim'}
                              </span>
                              <button
                                onClick={() => removeVolume(index)}
                                className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                              >
                                <IconX
                                  size={16}
                                  className="text-[var(--color-text-muted)]"
                                  stroke={1.5}
                                />
                              </button>
                            </div>

                            {/* ConfigMap content */}
                            {volume.type === 'configmap' && (
                              <>
                                <VStack gap={6} className="py-3 w-full">
                                  <FormField required>
                                    <FormField.Label>Volume Name</FormField.Label>
                                    <FormField.Control>
                                      <Input
                                        placeholder="Input name"
                                        value={volume.volumeName}
                                        onChange={(e) =>
                                          updateVolume(index, { volumeName: e.target.value })
                                        }
                                        fullWidth
                                      />
                                    </FormField.Control>
                                  </FormField>
                                  <FormField required>
                                    <FormField.Label>ConfigMap</FormField.Label>
                                    <FormField.Control>
                                      <Select
                                        options={[
                                          { value: 'config-1', label: 'config-1' },
                                          { value: 'config-2', label: 'config-2' },
                                        ]}
                                        value={(volume as ConfigMapVolume).configMapName}
                                        onChange={(val) =>
                                          updateVolume(index, { configMapName: val })
                                        }
                                        placeholder="Select configMap"
                                        fullWidth
                                      />
                                    </FormField.Control>
                                  </FormField>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <Checkbox
                                    checked={(volume as ConfigMapVolume).optional}
                                    onChange={(e) =>
                                      updateVolume(index, { optional: e.target.checked })
                                    }
                                  />
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Optional
                                  </span>
                                </HStack>
                                <Disclosure defaultOpen={isV2}>
                                  <Disclosure.Trigger>Advanced</Disclosure.Trigger>
                                  <Disclosure.Panel>
                                    <VStack gap={2} className="pt-2">
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        Default Mode
                                      </span>
                                      <Input
                                        placeholder=""
                                        value={(volume as ConfigMapVolume).defaultMode || ''}
                                        onChange={(e) =>
                                          updateVolume(index, { defaultMode: e.target.value })
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                  </Disclosure.Panel>
                                </Disclosure>
                              </>
                            )}

                            {/* Secret content */}
                            {volume.type === 'secret' && (
                              <>
                                <VStack gap={6} className="py-3 w-full">
                                  <FormField required>
                                    <FormField.Label>Volume Name</FormField.Label>
                                    <FormField.Control>
                                      <Input
                                        placeholder="Input name"
                                        value={volume.volumeName}
                                        onChange={(e) =>
                                          updateVolume(index, { volumeName: e.target.value })
                                        }
                                        fullWidth
                                      />
                                    </FormField.Control>
                                  </FormField>
                                  <FormField required>
                                    <FormField.Label>Secret</FormField.Label>
                                    <FormField.Control>
                                      <Select
                                        options={[
                                          { value: 'secret-1', label: 'secret-1' },
                                          { value: 'secret-2', label: 'secret-2' },
                                        ]}
                                        value={(volume as SecretVolume).secretName}
                                        onChange={(val) => updateVolume(index, { secretName: val })}
                                        placeholder="Select secret"
                                        fullWidth
                                      />
                                    </FormField.Control>
                                  </FormField>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <Checkbox
                                    checked={(volume as SecretVolume).optional}
                                    onChange={(e) =>
                                      updateVolume(index, { optional: e.target.checked })
                                    }
                                  />
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Optional
                                  </span>
                                </HStack>
                                <Disclosure defaultOpen={isV2}>
                                  <Disclosure.Trigger>Advanced</Disclosure.Trigger>
                                  <Disclosure.Panel>
                                    <VStack gap={2} className="pt-2">
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        Default Mode
                                      </span>
                                      <Input
                                        placeholder=""
                                        value={(volume as SecretVolume).defaultMode}
                                        onChange={(e) =>
                                          updateVolume(index, { defaultMode: e.target.value })
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                  </Disclosure.Panel>
                                </Disclosure>
                              </>
                            )}

                            {/* PVC content */}
                            {volume.type === 'pvc' && (
                              <>
                                <VStack gap={6} className="py-3 w-full">
                                  <FormField required>
                                    <FormField.Label>Volume Name</FormField.Label>
                                    <FormField.Control>
                                      <Input
                                        placeholder="Input name"
                                        value={volume.volumeName}
                                        onChange={(e) =>
                                          updateVolume(index, { volumeName: e.target.value })
                                        }
                                        fullWidth
                                      />
                                    </FormField.Control>
                                  </FormField>
                                  <FormField required>
                                    <FormField.Label>Persistent Volume Claim</FormField.Label>
                                    <FormField.Control>
                                      <Select
                                        options={[
                                          { value: 'pvc-1', label: 'pvc-1' },
                                          { value: 'pvc-2', label: 'pvc-2' },
                                        ]}
                                        value={(volume as PVCVolume).pvcName}
                                        onChange={(val) => updateVolume(index, { pvcName: val })}
                                        placeholder="Select PVC"
                                        fullWidth
                                      />
                                    </FormField.Control>
                                  </FormField>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <Checkbox
                                    checked={(volume as PVCVolume).readOnly}
                                    onChange={(e) =>
                                      updateVolume(index, { readOnly: e.target.checked })
                                    }
                                  />
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Read Only
                                  </span>
                                </HStack>
                              </>
                            )}

                            {/* Create PVC content */}
                            {volume.type === 'create-pvc' && (
                              <>
                                <div className="w-full">
                                  <VStack gap={6}>
                                    <VStack gap={3}>
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        Persistent Volume Claim Name{' '}
                                        <span className="text-[var(--color-state-danger)]">*</span>
                                      </span>
                                      <Input
                                        placeholder=""
                                        value={(volume as CreatePVCVolume).pvcName}
                                        onChange={(e) =>
                                          updateVolume(index, { pvcName: e.target.value })
                                        }
                                        fullWidth
                                      />
                                    </VStack>

                                    <RadioGroup
                                      value={
                                        (volume as CreatePVCVolume).useExistingPV
                                          ? 'existing'
                                          : 'new'
                                      }
                                      onChange={(val) =>
                                        updateVolume(index, {
                                          useExistingPV: val === 'existing',
                                        })
                                      }
                                    >
                                      <Radio
                                        value="new"
                                        label="Use a Storage Class to provision a new Persistent Volume"
                                      />
                                      <Radio
                                        value="existing"
                                        label="Use an existing Persistent Volume"
                                      />
                                    </RadioGroup>

                                    {(isV2 || !(volume as CreatePVCVolume).useExistingPV) && (
                                      <VStack gap={6}>
                                        <FormField required>
                                          <FormField.Label>Storage Class</FormField.Label>
                                          <FormField.Control>
                                            <Select
                                              options={[
                                                { value: 'standard', label: 'standard' },
                                                { value: 'fast', label: 'fast' },
                                              ]}
                                              value={(volume as CreatePVCVolume).storageClass}
                                              onChange={(val) =>
                                                updateVolume(index, { storageClass: val })
                                              }
                                              placeholder=""
                                              fullWidth
                                            />
                                          </FormField.Control>
                                        </FormField>
                                        <FormField required>
                                          <FormField.Label>Capacity</FormField.Label>
                                          <FormField.Control>
                                            <NumberInput
                                              placeholder=""
                                              value={
                                                (volume as CreatePVCVolume).capacity
                                                  ? parseInt((volume as CreatePVCVolume).capacity)
                                                  : undefined
                                              }
                                              onChange={(val) =>
                                                updateVolume(index, {
                                                  capacity: val?.toString() || '',
                                                })
                                              }
                                              suffix="GiB"
                                              width="sm"
                                            />
                                          </FormField.Control>
                                        </FormField>
                                      </VStack>
                                    )}

                                    {(isV2 || (volume as CreatePVCVolume).useExistingPV) && (
                                      <VStack gap={3}>
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Persistent Volume{' '}
                                          <span className="text-[var(--color-state-danger)]">
                                            *
                                          </span>
                                        </span>
                                        <Select
                                          options={[
                                            { value: 'pv-1', label: 'pv-1' },
                                            { value: 'pv-2', label: 'pv-2' },
                                          ]}
                                          value={(volume as CreatePVCVolume).persistentVolume}
                                          onChange={(val) =>
                                            updateVolume(index, { persistentVolume: val })
                                          }
                                          placeholder=""
                                          fullWidth
                                        />
                                      </VStack>
                                    )}

                                    <VStack gap={1.5}>
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        Access Modes{' '}
                                        <span className="text-[var(--color-state-danger)]">*</span>
                                      </span>
                                      <VStack gap={1}>
                                        <Checkbox
                                          label="Single node read-write"
                                          checked={
                                            (volume as CreatePVCVolume).accessModes?.readWriteOnce
                                          }
                                          onChange={(e) =>
                                            updateVolume(index, {
                                              accessModes: {
                                                ...(volume as CreatePVCVolume).accessModes,
                                                readWriteOnce: e.target.checked,
                                              },
                                            })
                                          }
                                        />
                                        <Checkbox
                                          label="Many nodes read-only"
                                          checked={
                                            (volume as CreatePVCVolume).accessModes?.readOnlyMany
                                          }
                                          onChange={(e) =>
                                            updateVolume(index, {
                                              accessModes: {
                                                ...(volume as CreatePVCVolume).accessModes,
                                                readOnlyMany: e.target.checked,
                                              },
                                            })
                                          }
                                        />
                                        <Checkbox
                                          label="Many nodes read-write"
                                          checked={
                                            (volume as CreatePVCVolume).accessModes?.readWriteMany
                                          }
                                          onChange={(e) =>
                                            updateVolume(index, {
                                              accessModes: {
                                                ...(volume as CreatePVCVolume).accessModes,
                                                readWriteMany: e.target.checked,
                                              },
                                            })
                                          }
                                        />
                                      </VStack>
                                    </VStack>
                                  </VStack>
                                </div>
                                <div className="flex gap-2 items-start py-3 w-full">
                                  <VStack gap={2}>
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Volume Name{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <Input
                                      placeholder="Input  name"
                                      value={volume.volumeName}
                                      onChange={(e) =>
                                        updateVolume(index, { volumeName: e.target.value })
                                      }
                                      fullWidth
                                    />
                                  </VStack>
                                </div>
                                <HStack gap={2} align="center">
                                  <Checkbox
                                    checked={(volume as CreatePVCVolume).readOnly}
                                    onChange={(e) =>
                                      updateVolume(index, { readOnly: e.target.checked })
                                    }
                                  />
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Read Only
                                  </span>
                                </HStack>
                              </>
                            )}
                          </VStack>
                        </div>
                      ))}

                      <Select
                        options={[
                          { value: 'configmap', label: 'ConfigMap' },
                          { value: 'secret', label: 'Secret' },
                          { value: 'pvc', label: 'Persistent volume claim' },
                          { value: 'create-pvc', label: 'Create persistent volume claim' },
                        ]}
                        value=""
                        onChange={(val) => addVolume(val)}
                        placeholder="Add volume"
                        fullWidth
                      />
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

                // Helper to update lifecycle hook
                const updateLifecycleHook = (
                  hookType: 'postStart' | 'preStop',
                  updates: Partial<LifecycleHookConfig>
                ) => {
                  updateContainerConfig(containerId, {
                    lifecycleHooks: {
                      ...config.lifecycleHooks,
                      [hookType]: {
                        ...config.lifecycleHooks?.[hookType],
                        ...updates,
                      },
                    },
                  });
                };

                // Helper to update probe
                const updateProbe = (
                  probeType: 'startupProbe' | 'livenessProbe' | 'readinessProbe',
                  updates: Partial<ProbeConfig>
                ) => {
                  updateContainerConfig(containerId, {
                    [probeType]: {
                      ...config[probeType],
                      ...updates,
                    },
                  });
                };

                const renderV2ProbeBlock = (
                  probeKey: 'readinessProbe' | 'livenessProbe' | 'startupProbe',
                  type: 'httpGet' | 'tcpSocket' | 'exec',
                  label: string,
                  options?: { showRequestPath?: boolean; showHeaders?: boolean }
                ) => {
                  const probe = config[probeKey];
                  const showRequestPath = options?.showRequestPath ?? false;
                  const showHeaders = options?.showHeaders ?? false;
                  return (
                    <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                      <VStack gap={6}>
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          {label}
                        </span>
                        <div className="flex gap-6 w-full">
                          {type !== 'exec' ? (
                            <VStack gap={3} className="flex-1">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Check Port
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the port used to send health check requests.
                                </span>
                              </VStack>
                              <Input
                                placeholder="e.g. 80"
                                fullWidth
                                value={
                                  type === 'httpGet'
                                    ? probe?.httpGet?.port || ''
                                    : probe?.tcpSocket?.port || ''
                                }
                                onChange={(e) =>
                                  type === 'httpGet'
                                    ? updateProbe(probeKey, {
                                        httpGet: { ...probe?.httpGet, port: e.target.value },
                                      })
                                    : updateProbe(probeKey, {
                                        tcpSocket: { ...probe?.tcpSocket, port: e.target.value },
                                      })
                                }
                              />
                            </VStack>
                          ) : (
                            <VStack gap={3} className="flex-1">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Command to run
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the command to execute when the container starts.
                                </span>
                              </VStack>
                              <Input
                                placeholder="e.g. cat /tmp/health"
                                fullWidth
                                value={probe?.exec?.command || ''}
                                onChange={(e) =>
                                  updateProbe(probeKey, {
                                    exec: { ...probe?.exec, command: e.target.value },
                                  })
                                }
                              />
                            </VStack>
                          )}
                          <VStack gap={3} className="flex-1">
                            <VStack gap={1}>
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Check Interval
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Specify the interval between health check requests.
                              </span>
                            </VStack>
                            <HStack gap={2} align="center">
                              <NumberInput
                                value={parseInt(probe?.periodSeconds || '10') || 10}
                                onChange={(val) =>
                                  updateProbe(probeKey, { periodSeconds: String(val) })
                                }
                                min={1}
                                size="sm"
                                width="sm"
                              />
                              <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                Seconds
                              </span>
                            </HStack>
                          </VStack>
                        </div>
                        {showRequestPath ? (
                          <>
                            <div className="flex gap-6 w-full">
                              <VStack gap={3} className="flex-1">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Request Path
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the request path used for HTTP health checks.
                                  </span>
                                </VStack>
                                <Input
                                  placeholder="e.g./healthz"
                                  fullWidth
                                  value={probe?.httpGet?.path || ''}
                                  onChange={(e) =>
                                    updateProbe(probeKey, {
                                      httpGet: { ...probe?.httpGet, path: e.target.value },
                                    })
                                  }
                                />
                              </VStack>
                              <VStack gap={3} className="flex-1">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Initial Delay
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the delay before initiating the first health check.
                                  </span>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={parseInt(probe?.initialDelaySeconds || '0') || 0}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { initialDelaySeconds: String(val) })
                                    }
                                    min={0}
                                    size="sm"
                                    width="sm"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </HStack>
                              </VStack>
                            </div>
                            <div className="flex gap-6 w-full">
                              <VStack gap={3} className="flex-1">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Timeout
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the maximum time to wait for a health check response.
                                  </span>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={parseInt(probe?.timeoutSeconds || '1') || 1}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { timeoutSeconds: String(val) })
                                    }
                                    min={1}
                                    size="sm"
                                    width="sm"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </HStack>
                              </VStack>
                              <VStack gap={3} className="flex-1">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Success Threshold
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the minimum number of consecutive successful checks to
                                    consider the status healthy.
                                  </span>
                                </VStack>
                                <NumberInput
                                  value={parseInt(probe?.successThreshold || '1') || 1}
                                  onChange={(val) =>
                                    updateProbe(probeKey, { successThreshold: String(val) })
                                  }
                                  min={1}
                                  size="sm"
                                  width="sm"
                                />
                              </VStack>
                            </div>
                            <VStack gap={3}>
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Failure Threshold
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the minimum number of consecutive failed checks to
                                  consider the status unhealthy.
                                </span>
                              </VStack>
                              <NumberInput
                                value={parseInt(probe?.failureThreshold || '3') || 3}
                                onChange={(val) =>
                                  updateProbe(probeKey, { failureThreshold: String(val) })
                                }
                                min={1}
                                size="sm"
                                width="sm"
                              />
                            </VStack>
                          </>
                        ) : (
                          <>
                            <div className="flex gap-6 w-full">
                              <VStack gap={3} className="flex-1">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Initial Delay
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the delay before initiating the first health check.
                                  </span>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={parseInt(probe?.initialDelaySeconds || '0') || 0}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { initialDelaySeconds: String(val) })
                                    }
                                    min={0}
                                    size="sm"
                                    width="sm"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </HStack>
                              </VStack>
                              <VStack gap={3} className="flex-1">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Timeout
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the maximum time to wait for a health check response.
                                  </span>
                                </VStack>
                                <HStack gap={2} align="center">
                                  <NumberInput
                                    value={parseInt(probe?.timeoutSeconds || '1') || 1}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { timeoutSeconds: String(val) })
                                    }
                                    min={1}
                                    size="sm"
                                    width="sm"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </HStack>
                              </VStack>
                            </div>
                            <div className="flex gap-6 w-full">
                              <VStack gap={3} className="flex-1">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Success Threshold
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the minimum number of consecutive successful checks to
                                    consider the status healthy.
                                  </span>
                                </VStack>
                                <NumberInput
                                  value={parseInt(probe?.successThreshold || '1') || 1}
                                  onChange={(val) =>
                                    updateProbe(probeKey, { successThreshold: String(val) })
                                  }
                                  min={1}
                                  size="sm"
                                  width="sm"
                                />
                              </VStack>
                              <VStack gap={3} className="flex-1">
                                <VStack gap={1}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Failure Threshold
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the minimum number of consecutive failed checks to
                                    consider the status unhealthy.
                                  </span>
                                </VStack>
                                <NumberInput
                                  value={parseInt(probe?.failureThreshold || '3') || 3}
                                  onChange={(val) =>
                                    updateProbe(probeKey, { failureThreshold: String(val) })
                                  }
                                  min={1}
                                  size="sm"
                                  width="sm"
                                />
                              </VStack>
                            </div>
                          </>
                        )}
                        {showHeaders && (
                          <VStack gap={3}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Request Headers
                            </span>
                            <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                              <VStack gap={2}>
                                {(probe?.httpGet?.httpHeaders || []).length > 0 && (
                                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full items-center">
                                    <label className="text-label-lg text-[var(--color-text-default)]">
                                      Name
                                    </label>
                                    <label className="text-label-lg text-[var(--color-text-default)]">
                                      Value
                                    </label>
                                    <div />
                                  </div>
                                )}
                                {(probe?.httpGet?.httpHeaders || []).map(
                                  (header: { name: string; value: string }, index: number) => (
                                    <div
                                      key={index}
                                      className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full items-center"
                                    >
                                      <Input
                                        placeholder="e.g. X-Custom-Header"
                                        fullWidth
                                        value={header.name}
                                        onChange={(e) => {
                                          const newHeaders = [
                                            ...(probe?.httpGet?.httpHeaders || []),
                                          ];
                                          newHeaders[index] = {
                                            ...newHeaders[index],
                                            name: e.target.value,
                                          };
                                          updateProbe(probeKey, {
                                            httpGet: { ...probe?.httpGet, httpHeaders: newHeaders },
                                          });
                                        }}
                                      />
                                      <Input
                                        placeholder="e.g. value"
                                        fullWidth
                                        value={header.value}
                                        onChange={(e) => {
                                          const newHeaders = [
                                            ...(probe?.httpGet?.httpHeaders || []),
                                          ];
                                          newHeaders[index] = {
                                            ...newHeaders[index],
                                            value: e.target.value,
                                          };
                                          updateProbe(probeKey, {
                                            httpGet: { ...probe?.httpGet, httpHeaders: newHeaders },
                                          });
                                        }}
                                      />
                                      <button
                                        className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                        onClick={() => {
                                          const newHeaders = (
                                            probe?.httpGet?.httpHeaders || []
                                          ).filter((_: unknown, i: number) => i !== index);
                                          updateProbe(probeKey, {
                                            httpGet: { ...probe?.httpGet, httpHeaders: newHeaders },
                                          });
                                        }}
                                      >
                                        <IconX
                                          size={16}
                                          className="text-[var(--color-text-muted)]"
                                          stroke={1.5}
                                        />
                                      </button>
                                    </div>
                                  )
                                )}
                                <div className="w-fit">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                    onClick={() => {
                                      const newHeaders = [
                                        ...(probe?.httpGet?.httpHeaders || []),
                                        { name: '', value: '' },
                                      ];
                                      updateProbe(probeKey, {
                                        httpGet: { ...probe?.httpGet, httpHeaders: newHeaders },
                                      });
                                    }}
                                  >
                                    Add Header
                                  </Button>
                                </div>
                              </VStack>
                            </div>
                          </VStack>
                        )}
                      </VStack>
                    </div>
                  );
                };

                return (
                  <>
                    {/* 1. Basic Information Section */}
                    <SectionCard>
                      <SectionCard.Header title="Basic information" />
                      <SectionCard.Content>
                        <VStack gap={6}>
                          <VStack gap={2} className="w-full">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Container Name
                            </span>
                            <Input
                              placeholder="Container-0"
                              fullWidth
                              value={config.name || ''}
                              onChange={(e) =>
                                updateContainerConfig(containerId, {
                                  name: e.target.value,
                                })
                              }
                            />
                          </VStack>

                          <VStack gap={3}>
                            <RadioGroup
                              value={config.containerType || 'standard'}
                              onChange={(val) =>
                                updateContainerConfig(containerId, {
                                  containerType: val as 'init' | 'standard',
                                })
                              }
                            >
                              <Radio value="init" label="Init container" />
                              <Radio value="standard" label="Standard container" />
                            </RadioGroup>
                          </VStack>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 2. Image Section */}
                    <SectionCard>
                      <SectionCard.Header title="Image" />
                      <SectionCard.Content>
                        <VStack gap={6}>
                          <FormField required>
                            <FormField.Label>Container Image</FormField.Label>
                            <FormField.Description>
                              The period allowed after receiving a termination request before the
                              pod is forcibly terminated.
                            </FormField.Description>
                            <FormField.Control>
                              <Input
                                placeholder="nginx:latest"
                                fullWidth
                                value={config.image || ''}
                                onChange={(e) =>
                                  updateContainerConfig(containerId, {
                                    image: e.target.value,
                                  })
                                }
                              />
                            </FormField.Control>
                          </FormField>
                          <FormField>
                            <FormField.Label>Pull Policy</FormField.Label>
                            <FormField.Description>
                              The period allowed after receiving a termination request before the
                              pod is forcibly terminated.
                            </FormField.Description>
                            <FormField.Control>
                              <Select
                                options={[
                                  { value: 'Always', label: 'Always' },
                                  { value: 'IfNotPresent', label: 'If not present' },
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
                            </FormField.Control>
                          </FormField>
                          <FormField>
                            <FormField.Label>Pull Secrets</FormField.Label>
                            <FormField.Description>
                              The period allowed after receiving a termination request before the
                              pod is forcibly terminated.
                            </FormField.Description>
                            <FormField.Control>
                              <Select
                                options={[
                                  { value: '', label: 'Select a secret...' },
                                  { value: 'docker-registry', label: 'docker-registry' },
                                  { value: 'gcr-secret', label: 'gcr-secret' },
                                ]}
                                value={config.pullSecrets || ''}
                                onChange={(val) =>
                                  updateContainerConfig(containerId, {
                                    pullSecrets: val,
                                  })
                                }
                                fullWidth
                              />
                            </FormField.Control>
                          </FormField>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 3. Command Section */}
                    <SectionCard>
                      <SectionCard.Header title="Command" />
                      <SectionCard.Content>
                        <VStack gap={4}>
                          {/* Row 1: Command and Arguments */}
                          <div className="grid grid-cols-2 gap-6 w-full">
                            <VStack gap={2}>
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Command
                              </span>
                              <Input
                                placeholder="e.g./bin/sh"
                                value={config.command || ''}
                                onChange={(e) =>
                                  updateContainerConfig(containerId, {
                                    command: e.target.value,
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                            <VStack gap={2}>
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Arguments
                              </span>
                              <Input
                                placeholder="e.g./usr/sbin/httpd -f httpd.conf"
                                value={config.args || ''}
                                onChange={(e) =>
                                  updateContainerConfig(containerId, {
                                    args: e.target.value,
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                          </div>

                          {/* Row 2: WorkingDir and Stdin */}
                          <div className="grid grid-cols-2 gap-6 w-full">
                            <VStack gap={2}>
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                WorkingDir
                              </span>
                              <Input
                                placeholder="e.g./myapp"
                                value={config.workingDir || ''}
                                onChange={(e) =>
                                  updateContainerConfig(containerId, {
                                    workingDir: e.target.value,
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                            <VStack gap={2}>
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Stdin
                              </span>
                              <Select
                                options={[
                                  { value: 'Always', label: 'Always' },
                                  { value: 'Never', label: 'Never' },
                                  { value: 'Once', label: 'Once' },
                                ]}
                                value={config.stdin || 'Always'}
                                onChange={(val) =>
                                  updateContainerConfig(containerId, {
                                    stdin: val,
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                          </div>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 4. Environment Variables Section */}
                    <SectionCard>
                      <SectionCard.Header title="Environment variables" />
                      <SectionCard.Content>
                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {(config.envVars || []).length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full">
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Name
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Value Type
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Value/Source
                                </span>
                                <div />
                              </div>
                            )}
                            {(config.envVars || []).map((envVar, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_1fr_20px] gap-2 w-full items-center"
                              >
                                <Input
                                  placeholder="input variable name"
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
                                <Select
                                  options={[
                                    { value: 'value', label: 'Key/Value Pair' },
                                    { value: 'configmap', label: 'ConfigMap' },
                                    { value: 'secret', label: 'Secret' },
                                  ]}
                                  value={envVar.type || 'value'}
                                  onChange={(val) => {
                                    const newEnvVars = [...(config.envVars || [])];
                                    newEnvVars[index] = {
                                      ...newEnvVars[index],
                                      type: val as 'value' | 'configmap' | 'secret',
                                    };
                                    updateContainerConfig(containerId, {
                                      envVars: newEnvVars,
                                    });
                                  }}
                                  fullWidth
                                />
                                <Input
                                  placeholder="input value"
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
                                <button
                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  onClick={() => {
                                    const newEnvVars = (config.envVars || []).filter(
                                      (_, i) => i !== index
                                    );
                                    updateContainerConfig(containerId, {
                                      envVars: newEnvVars,
                                    });
                                  }}
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
                                onClick={() => {
                                  const newEnvVars = [
                                    ...(config.envVars || []),
                                    { name: '', value: '', type: 'value' as const },
                                  ];
                                  updateContainerConfig(containerId, { envVars: newEnvVars });
                                }}
                              >
                                Add Variable
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 5. Service Account Name Section */}
                    <SectionCard>
                      <SectionCard.Header title="Service account name" />
                      <SectionCard.Content>
                        <VStack gap={3}>
                          <VStack gap={1}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Service Account Name
                            </span>
                            <span className="text-body-md text-[var(--color-text-subtle)]">
                              The period allowed after receiving a termination request before the
                              pod is forcibly terminated.
                            </span>
                          </VStack>
                          <Input
                            placeholder="default"
                            fullWidth
                            value={config.serviceAccountName || ''}
                            onChange={(e) =>
                              updateContainerConfig(containerId, {
                                serviceAccountName: e.target.value,
                              })
                            }
                          />
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 7. Lifecycle Hooks Section */}
                    <SectionCard>
                      <SectionCard.Header title="Lifecycle hooks" />
                      <SectionCard.Content>
                        <div className="grid grid-cols-2 gap-6">
                          {/* Post Start */}
                          <VStack gap={6}>
                            <VStack gap={2}>
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Post Start
                              </span>
                              <RadioGroup
                                value={config.lifecycleHooks?.postStart?.type || 'none'}
                                onChange={(val) =>
                                  updateLifecycleHook('postStart', {
                                    type: val as 'none' | 'exec' | 'httpGet',
                                  })
                                }
                              >
                                <Radio value="none" label="None" />
                                <Radio value="exec" label="Add command to execute" />
                                <Radio value="httpGet" label="Create HTTP request" />
                              </RadioGroup>
                            </VStack>

                            {(isV2 || config.lifecycleHooks?.postStart?.type === 'exec') && (
                              <VStack gap={2}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Execute Command
                                </span>
                                <Input
                                  placeholder='e.g. ["/bin/sh", "-c", "echo Hello"]'
                                  fullWidth
                                  value={config.lifecycleHooks?.postStart?.command || ''}
                                  onChange={(e) =>
                                    updateLifecycleHook('postStart', {
                                      command: e.target.value,
                                    })
                                  }
                                />
                              </VStack>
                            )}

                            {(isV2 || config.lifecycleHooks?.postStart?.type === 'httpGet') && (
                              <VStack gap={3}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  HTTP Get
                                </span>
                                <VStack gap={2}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Host IP
                                  </span>
                                  <Input
                                    placeholder="e.g. 172.17.0.2"
                                    fullWidth
                                    value={config.lifecycleHooks?.postStart?.httpGet?.host || ''}
                                    onChange={(e) =>
                                      updateLifecycleHook('postStart', {
                                        httpGet: {
                                          ...config.lifecycleHooks?.postStart?.httpGet,
                                          host: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </VStack>
                                <VStack gap={2}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Path
                                  </span>
                                  <Input
                                    placeholder="e.g. /health"
                                    fullWidth
                                    value={config.lifecycleHooks?.postStart?.httpGet?.path || ''}
                                    onChange={(e) =>
                                      updateLifecycleHook('postStart', {
                                        httpGet: {
                                          ...config.lifecycleHooks?.postStart?.httpGet,
                                          path: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </VStack>
                                <VStack gap={2}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Port <span className="text-[var(--color-state-danger)]">*</span>
                                  </span>
                                  <Input
                                    placeholder="e.g. 3000"
                                    fullWidth
                                    value={config.lifecycleHooks?.postStart?.httpGet?.port || ''}
                                    onChange={(e) =>
                                      updateLifecycleHook('postStart', {
                                        httpGet: {
                                          ...config.lifecycleHooks?.postStart?.httpGet,
                                          port: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </VStack>
                                <VStack gap={2}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Scheme
                                  </span>
                                  <Select
                                    options={[
                                      { value: 'HTTP', label: 'HTTP' },
                                      { value: 'HTTPS', label: 'HTTPS' },
                                    ]}
                                    value={
                                      config.lifecycleHooks?.postStart?.httpGet?.scheme || 'HTTP'
                                    }
                                    onChange={(val) =>
                                      updateLifecycleHook('postStart', {
                                        httpGet: {
                                          ...config.lifecycleHooks?.postStart?.httpGet,
                                          scheme: val,
                                        },
                                      })
                                    }
                                    fullWidth
                                  />
                                </VStack>
                                <VStack gap={3}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    HTTP Header
                                  </span>
                                  <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                    <VStack gap={2}>
                                      {(
                                        config.lifecycleHooks?.postStart?.httpGet?.httpHeaders || []
                                      ).length > 0 && (
                                        <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                                          <span className="block text-label-lg text-[var(--color-text-default)]">
                                            Name{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <span className="block text-label-lg text-[var(--color-text-default)]">
                                            Value
                                          </span>
                                          <div />
                                        </div>
                                      )}
                                      {(
                                        config.lifecycleHooks?.postStart?.httpGet?.httpHeaders || []
                                      ).map((header, index) => (
                                        <div
                                          key={index}
                                          className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                                        >
                                          <Input
                                            placeholder="e.g. accept-ranges"
                                            fullWidth
                                            value={header.name}
                                            onChange={(e) => {
                                              const newHeaders = [
                                                ...(config.lifecycleHooks?.postStart?.httpGet
                                                  ?.httpHeaders || []),
                                              ];
                                              newHeaders[index] = {
                                                ...newHeaders[index],
                                                name: e.target.value,
                                              };
                                              updateLifecycleHook('postStart', {
                                                httpGet: {
                                                  ...config.lifecycleHooks?.postStart?.httpGet,
                                                  httpHeaders: newHeaders,
                                                },
                                              });
                                            }}
                                          />
                                          <Input
                                            placeholder="e.g. bytes"
                                            fullWidth
                                            value={header.value}
                                            onChange={(e) => {
                                              const newHeaders = [
                                                ...(config.lifecycleHooks?.postStart?.httpGet
                                                  ?.httpHeaders || []),
                                              ];
                                              newHeaders[index] = {
                                                ...newHeaders[index],
                                                value: e.target.value,
                                              };
                                              updateLifecycleHook('postStart', {
                                                httpGet: {
                                                  ...config.lifecycleHooks?.postStart?.httpGet,
                                                  httpHeaders: newHeaders,
                                                },
                                              });
                                            }}
                                          />
                                          <button
                                            className="size-5 flex items-center justify-center text-[var(--color-text-default)] hover:text-[var(--color-state-danger)] transition-colors"
                                            onClick={() => {
                                              const newHeaders = (
                                                config.lifecycleHooks?.postStart?.httpGet
                                                  ?.httpHeaders || []
                                              ).filter((_, i) => i !== index);
                                              updateLifecycleHook('postStart', {
                                                httpGet: {
                                                  ...config.lifecycleHooks?.postStart?.httpGet,
                                                  httpHeaders: newHeaders,
                                                },
                                              });
                                            }}
                                            aria-label="Remove header"
                                          >
                                            <IconX size={16} />
                                          </button>
                                        </div>
                                      ))}
                                      <div className="w-fit">
                                        <Button
                                          variant="secondary"
                                          size="sm"
                                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                          onClick={() => {
                                            const newHeaders = [
                                              ...(config.lifecycleHooks?.postStart?.httpGet
                                                ?.httpHeaders || []),
                                              { name: '', value: '' },
                                            ];
                                            updateLifecycleHook('postStart', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.postStart?.httpGet,
                                                httpHeaders: newHeaders,
                                              },
                                            });
                                          }}
                                        >
                                          Add Header
                                        </Button>
                                      </div>
                                    </VStack>
                                  </div>
                                </VStack>
                              </VStack>
                            )}
                          </VStack>

                          {/* Pre Stop */}
                          <VStack gap={6}>
                            <VStack gap={2}>
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Pre Stop
                              </span>
                              <RadioGroup
                                value={config.lifecycleHooks?.preStop?.type || 'none'}
                                onChange={(val) =>
                                  updateLifecycleHook('preStop', {
                                    type: val as 'none' | 'exec' | 'httpGet',
                                  })
                                }
                              >
                                <Radio value="none" label="None" />
                                <Radio value="exec" label="Add command to execute" />
                                <Radio value="httpGet" label="Create HTTP request" />
                              </RadioGroup>
                            </VStack>

                            {(isV2 || config.lifecycleHooks?.preStop?.type === 'exec') && (
                              <VStack gap={2}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Execute Command
                                </span>
                                <Input
                                  placeholder='e.g. ["/bin/sh", "-c", "nginx -s quit"]'
                                  fullWidth
                                  value={config.lifecycleHooks?.preStop?.command || ''}
                                  onChange={(e) =>
                                    updateLifecycleHook('preStop', {
                                      command: e.target.value,
                                    })
                                  }
                                />
                              </VStack>
                            )}

                            {(isV2 || config.lifecycleHooks?.preStop?.type === 'httpGet') && (
                              <VStack gap={3}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  HTTP Get
                                </span>
                                <VStack gap={2}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Host IP
                                  </span>
                                  <Input
                                    placeholder="e.g. 172.17.0.2"
                                    fullWidth
                                    value={config.lifecycleHooks?.preStop?.httpGet?.host || ''}
                                    onChange={(e) =>
                                      updateLifecycleHook('preStop', {
                                        httpGet: {
                                          ...config.lifecycleHooks?.preStop?.httpGet,
                                          host: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </VStack>
                                <VStack gap={2}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Path
                                  </span>
                                  <Input
                                    placeholder="e.g. /shutdown"
                                    fullWidth
                                    value={config.lifecycleHooks?.preStop?.httpGet?.path || ''}
                                    onChange={(e) =>
                                      updateLifecycleHook('preStop', {
                                        httpGet: {
                                          ...config.lifecycleHooks?.preStop?.httpGet,
                                          path: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </VStack>
                                <VStack gap={2}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Port <span className="text-[var(--color-state-danger)]">*</span>
                                  </span>
                                  <Input
                                    placeholder="e.g. 3000"
                                    fullWidth
                                    value={config.lifecycleHooks?.preStop?.httpGet?.port || ''}
                                    onChange={(e) =>
                                      updateLifecycleHook('preStop', {
                                        httpGet: {
                                          ...config.lifecycleHooks?.preStop?.httpGet,
                                          port: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </VStack>
                                <VStack gap={2}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Scheme
                                  </span>
                                  <Select
                                    options={[
                                      { value: 'HTTP', label: 'HTTP' },
                                      { value: 'HTTPS', label: 'HTTPS' },
                                    ]}
                                    value={
                                      config.lifecycleHooks?.preStop?.httpGet?.scheme || 'HTTP'
                                    }
                                    onChange={(val) =>
                                      updateLifecycleHook('preStop', {
                                        httpGet: {
                                          ...config.lifecycleHooks?.preStop?.httpGet,
                                          scheme: val,
                                        },
                                      })
                                    }
                                    fullWidth
                                  />
                                </VStack>
                                <VStack gap={3}>
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    HTTP Header
                                  </span>
                                  <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                    <VStack gap={2}>
                                      {(config.lifecycleHooks?.preStop?.httpGet?.httpHeaders || [])
                                        .length > 0 && (
                                        <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                                          <span className="block text-label-lg text-[var(--color-text-default)]">
                                            Name{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <span className="block text-label-lg text-[var(--color-text-default)]">
                                            Value
                                          </span>
                                          <div />
                                        </div>
                                      )}
                                      {(
                                        config.lifecycleHooks?.preStop?.httpGet?.httpHeaders || []
                                      ).map((header, index) => (
                                        <div
                                          key={index}
                                          className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                                        >
                                          <Input
                                            placeholder="e.g. accept-ranges"
                                            fullWidth
                                            value={header.name}
                                            onChange={(e) => {
                                              const newHeaders = [
                                                ...(config.lifecycleHooks?.preStop?.httpGet
                                                  ?.httpHeaders || []),
                                              ];
                                              newHeaders[index] = {
                                                ...newHeaders[index],
                                                name: e.target.value,
                                              };
                                              updateLifecycleHook('preStop', {
                                                httpGet: {
                                                  ...config.lifecycleHooks?.preStop?.httpGet,
                                                  httpHeaders: newHeaders,
                                                },
                                              });
                                            }}
                                          />
                                          <Input
                                            placeholder="e.g. bytes"
                                            fullWidth
                                            value={header.value}
                                            onChange={(e) => {
                                              const newHeaders = [
                                                ...(config.lifecycleHooks?.preStop?.httpGet
                                                  ?.httpHeaders || []),
                                              ];
                                              newHeaders[index] = {
                                                ...newHeaders[index],
                                                value: e.target.value,
                                              };
                                              updateLifecycleHook('preStop', {
                                                httpGet: {
                                                  ...config.lifecycleHooks?.preStop?.httpGet,
                                                  httpHeaders: newHeaders,
                                                },
                                              });
                                            }}
                                          />
                                          <button
                                            className="size-5 flex items-center justify-center text-[var(--color-text-default)] hover:text-[var(--color-state-danger)] transition-colors"
                                            onClick={() => {
                                              const newHeaders = (
                                                config.lifecycleHooks?.preStop?.httpGet
                                                  ?.httpHeaders || []
                                              ).filter((_, i) => i !== index);
                                              updateLifecycleHook('preStop', {
                                                httpGet: {
                                                  ...config.lifecycleHooks?.preStop?.httpGet,
                                                  httpHeaders: newHeaders,
                                                },
                                              });
                                            }}
                                            aria-label="Remove header"
                                          >
                                            <IconX size={16} />
                                          </button>
                                        </div>
                                      ))}
                                      <div className="w-fit">
                                        <Button
                                          variant="secondary"
                                          size="sm"
                                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                          onClick={() => {
                                            const newHeaders = [
                                              ...(config.lifecycleHooks?.preStop?.httpGet
                                                ?.httpHeaders || []),
                                              { name: '', value: '' },
                                            ];
                                            updateLifecycleHook('preStop', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.preStop?.httpGet,
                                                httpHeaders: newHeaders,
                                              },
                                            });
                                          }}
                                        >
                                          Add Header
                                        </Button>
                                      </div>
                                    </VStack>
                                  </div>
                                </VStack>
                              </VStack>
                            )}
                          </VStack>
                        </div>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 8. Health Check Section */}
                    <SectionCard>
                      <SectionCard.Header title="Health check" />
                      <SectionCard.Content>
                        <VStack gap={6}>
                          {/* Readiness Check */}
                          <VStack gap={6}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Readiness Check
                            </span>
                            <VStack gap={3} className="w-[calc(50%-12px)]">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Type
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Select the probe type used for the health check.
                                </span>
                              </VStack>
                              <Select
                                options={[
                                  { value: 'none', label: 'None' },
                                  {
                                    value: 'httpGet',
                                    label: 'HTTP request returns a successful status (200-399)',
                                  },
                                  {
                                    value: 'tcpSocket',
                                    label: 'TCP Connection opens successfully',
                                  },
                                  {
                                    value: 'exec',
                                    label: 'Command run inside the container exits with status 0',
                                  },
                                ]}
                                value={config.readinessProbe?.type || 'none'}
                                onChange={(val) =>
                                  updateProbe('readinessProbe', {
                                    type: val as 'none' | 'httpGet' | 'tcpSocket' | 'exec',
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                            {isV2 && (
                              <>
                                {renderV2ProbeBlock(
                                  'readinessProbe',
                                  'httpGet',
                                  'HTTP request returns a successful status (200-399)',
                                  { showRequestPath: true, showHeaders: true }
                                )}
                                {renderV2ProbeBlock(
                                  'readinessProbe',
                                  'tcpSocket',
                                  'TCP Connection opens successfully'
                                )}
                                {renderV2ProbeBlock(
                                  'readinessProbe',
                                  'exec',
                                  'Command run inside the container exits with status 0'
                                )}
                              </>
                            )}
                            {!isV2 && config.readinessProbe?.type !== 'none' && (
                              <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                                <VStack gap={6}>
                                  {/* Row 1: Check Port/Command + Check Interval */}
                                  <div className="flex gap-6 w-full">
                                    {(config.readinessProbe?.type === 'httpGet' ||
                                      config.readinessProbe?.type === 'tcpSocket') && (
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Check Port
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the port used to send health check requests.
                                          </span>
                                        </VStack>
                                        <Input
                                          placeholder="e.g. 80"
                                          fullWidth
                                          value={
                                            config.readinessProbe?.type === 'httpGet'
                                              ? config.readinessProbe?.httpGet?.port || ''
                                              : config.readinessProbe?.tcpSocket?.port || ''
                                          }
                                          onChange={(e) =>
                                            config.readinessProbe?.type === 'httpGet'
                                              ? updateProbe('readinessProbe', {
                                                  httpGet: {
                                                    ...config.readinessProbe?.httpGet,
                                                    port: e.target.value,
                                                  },
                                                })
                                              : updateProbe('readinessProbe', {
                                                  tcpSocket: {
                                                    ...config.readinessProbe?.tcpSocket,
                                                    port: e.target.value,
                                                  },
                                                })
                                          }
                                        />
                                      </VStack>
                                    )}
                                    {config.readinessProbe?.type === 'exec' && (
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Command to run
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the command to execute when the container
                                            starts.
                                          </span>
                                        </VStack>
                                        <Input
                                          placeholder="e.g. cat /tmp/health"
                                          fullWidth
                                          value={config.readinessProbe?.exec?.command || ''}
                                          onChange={(e) =>
                                            updateProbe('readinessProbe', {
                                              exec: {
                                                ...config.readinessProbe?.exec,
                                                command: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </VStack>
                                    )}
                                    <VStack gap={3} className="flex-1">
                                      <VStack gap={1}>
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Check Interval
                                        </span>
                                        <span className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the interval between health check requests.
                                        </span>
                                      </VStack>
                                      <HStack gap={2} align="center">
                                        <NumberInput
                                          value={
                                            parseInt(
                                              config.readinessProbe?.periodSeconds || '10'
                                            ) || 10
                                          }
                                          onChange={(val) =>
                                            updateProbe('readinessProbe', {
                                              periodSeconds: String(val),
                                            })
                                          }
                                          min={1}
                                          size="sm"
                                          width="sm"
                                        />
                                        <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                          Seconds
                                        </span>
                                      </HStack>
                                    </VStack>
                                  </div>
                                  {/* Row 2: Request Path (httpGet only) + Initial Delay */}
                                  <div className="flex gap-6 w-full">
                                    {config.readinessProbe?.type === 'httpGet' && (
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Request Path
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the request path used for HTTP health checks.
                                          </span>
                                        </VStack>
                                        <Input
                                          placeholder="e.g./healthz"
                                          fullWidth
                                          value={config.readinessProbe?.httpGet?.path || ''}
                                          onChange={(e) =>
                                            updateProbe('readinessProbe', {
                                              httpGet: {
                                                ...config.readinessProbe?.httpGet,
                                                path: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </VStack>
                                    )}
                                    <VStack gap={3} className="flex-1">
                                      <VStack gap={1}>
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Initial Delay
                                        </span>
                                        <span className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the delay before initiating the first health
                                          check.
                                        </span>
                                      </VStack>
                                      <HStack gap={2} align="center">
                                        <NumberInput
                                          value={
                                            parseInt(
                                              config.readinessProbe?.initialDelaySeconds || '0'
                                            ) || 0
                                          }
                                          onChange={(val) =>
                                            updateProbe('readinessProbe', {
                                              initialDelaySeconds: String(val),
                                            })
                                          }
                                          min={0}
                                          size="sm"
                                          width="sm"
                                        />
                                        <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                          Seconds
                                        </span>
                                      </HStack>
                                    </VStack>
                                    {config.readinessProbe?.type !== 'httpGet' && (
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Timeout
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the maximum time to wait for a health check
                                            response.
                                          </span>
                                        </VStack>
                                        <HStack gap={2} align="center">
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.readinessProbe?.timeoutSeconds || '1'
                                              ) || 1
                                            }
                                            onChange={(val) =>
                                              updateProbe('readinessProbe', {
                                                timeoutSeconds: String(val),
                                              })
                                            }
                                            min={1}
                                            size="sm"
                                            width="sm"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </HStack>
                                      </VStack>
                                    )}
                                  </div>
                                  {/* Row 3: Timeout + Success Threshold (httpGet) or Success + Failure (others) */}
                                  <div className="flex gap-6 w-full">
                                    {config.readinessProbe?.type === 'httpGet' && (
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Timeout
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the maximum time to wait for a health check
                                            response.
                                          </span>
                                        </VStack>
                                        <HStack gap={2} align="center">
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.readinessProbe?.timeoutSeconds || '1'
                                              ) || 1
                                            }
                                            onChange={(val) =>
                                              updateProbe('readinessProbe', {
                                                timeoutSeconds: String(val),
                                              })
                                            }
                                            min={1}
                                            size="sm"
                                            width="sm"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </HStack>
                                      </VStack>
                                    )}
                                    <VStack gap={3} className="flex-1">
                                      <VStack gap={1}>
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Success Threshold
                                        </span>
                                        <span className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the minimum number of consecutive successful
                                          checks to consider the status healthy.
                                        </span>
                                      </VStack>
                                      <NumberInput
                                        value={
                                          parseInt(
                                            config.readinessProbe?.successThreshold || '1'
                                          ) || 1
                                        }
                                        onChange={(val) =>
                                          updateProbe('readinessProbe', {
                                            successThreshold: String(val),
                                          })
                                        }
                                        min={1}
                                        size="sm"
                                        width="sm"
                                      />
                                    </VStack>
                                    {config.readinessProbe?.type !== 'httpGet' && (
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Failure Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive failed checks
                                            to consider the status unhealthy.
                                          </span>
                                        </VStack>
                                        <NumberInput
                                          value={
                                            parseInt(
                                              config.readinessProbe?.failureThreshold || '3'
                                            ) || 3
                                          }
                                          onChange={(val) =>
                                            updateProbe('readinessProbe', {
                                              failureThreshold: String(val),
                                            })
                                          }
                                          min={1}
                                          size="sm"
                                          width="sm"
                                        />
                                      </VStack>
                                    )}
                                  </div>
                                  {/* Row 4: Failure Threshold (httpGet only) */}
                                  {config.readinessProbe?.type === 'httpGet' && (
                                    <VStack gap={3}>
                                      <VStack gap={1}>
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Failure Threshold
                                        </span>
                                        <span className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the minimum number of consecutive failed checks to
                                          consider the status unhealthy.
                                        </span>
                                      </VStack>
                                      <NumberInput
                                        value={
                                          parseInt(
                                            config.readinessProbe?.failureThreshold || '3'
                                          ) || 3
                                        }
                                        onChange={(val) =>
                                          updateProbe('readinessProbe', {
                                            failureThreshold: String(val),
                                          })
                                        }
                                        min={1}
                                        size="sm"
                                        width="sm"
                                      />
                                    </VStack>
                                  )}
                                  {config.readinessProbe?.type === 'httpGet' && (
                                    <VStack gap={3}>
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        Request Headers
                                      </span>
                                      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                        <VStack gap={2}>
                                          {(config.readinessProbe?.httpGet?.httpHeaders || [])
                                            .length > 0 && (
                                            <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                                              <span className="block text-label-lg text-[var(--color-text-default)]">
                                                Name
                                              </span>
                                              <span className="block text-label-lg text-[var(--color-text-default)]">
                                                Value
                                              </span>
                                              <div />
                                            </div>
                                          )}
                                          {(config.readinessProbe?.httpGet?.httpHeaders || []).map(
                                            (header, index) => (
                                              <div
                                                key={index}
                                                className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                                              >
                                                <Input
                                                  placeholder="Input name"
                                                  fullWidth
                                                  value={header.name}
                                                  onChange={(e) => {
                                                    const newHeaders = [
                                                      ...(config.readinessProbe?.httpGet
                                                        ?.httpHeaders || []),
                                                    ];
                                                    newHeaders[index] = {
                                                      ...newHeaders[index],
                                                      name: e.target.value,
                                                    };
                                                    updateProbe('readinessProbe', {
                                                      httpGet: {
                                                        ...config.readinessProbe?.httpGet,
                                                        httpHeaders: newHeaders,
                                                      },
                                                    });
                                                  }}
                                                />
                                                <Input
                                                  placeholder="Input value"
                                                  fullWidth
                                                  value={header.value}
                                                  onChange={(e) => {
                                                    const newHeaders = [
                                                      ...(config.readinessProbe?.httpGet
                                                        ?.httpHeaders || []),
                                                    ];
                                                    newHeaders[index] = {
                                                      ...newHeaders[index],
                                                      value: e.target.value,
                                                    };
                                                    updateProbe('readinessProbe', {
                                                      httpGet: {
                                                        ...config.readinessProbe?.httpGet,
                                                        httpHeaders: newHeaders,
                                                      },
                                                    });
                                                  }}
                                                />
                                                <button
                                                  className="size-5 flex items-center justify-center text-[var(--color-text-default)] hover:text-[var(--color-state-danger)] transition-colors"
                                                  onClick={() => {
                                                    const newHeaders = (
                                                      config.readinessProbe?.httpGet?.httpHeaders ||
                                                      []
                                                    ).filter((_, i) => i !== index);
                                                    updateProbe('readinessProbe', {
                                                      httpGet: {
                                                        ...config.readinessProbe?.httpGet,
                                                        httpHeaders: newHeaders,
                                                      },
                                                    });
                                                  }}
                                                  aria-label="Remove header"
                                                >
                                                  <IconX size={16} />
                                                </button>
                                              </div>
                                            )
                                          )}
                                          <div className="w-fit">
                                            <Button
                                              variant="secondary"
                                              size="sm"
                                              leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                              onClick={() => {
                                                const newHeaders = [
                                                  ...(config.readinessProbe?.httpGet?.httpHeaders ||
                                                    []),
                                                  { name: '', value: '' },
                                                ];
                                                updateProbe('readinessProbe', {
                                                  httpGet: {
                                                    ...config.readinessProbe?.httpGet,
                                                    httpHeaders: newHeaders,
                                                  },
                                                });
                                              }}
                                            >
                                              Add Header
                                            </Button>
                                          </div>
                                        </VStack>
                                      </div>
                                    </VStack>
                                  )}
                                </VStack>
                              </div>
                            )}
                          </VStack>

                          {/* Liveness Check */}
                          <VStack gap={6}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Liveness Check
                            </span>
                            <VStack gap={3} className="w-[calc(50%-12px)]">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Type
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Select the probe type used for the health check.
                                </span>
                              </VStack>
                              <Select
                                options={[
                                  { value: 'none', label: 'None' },
                                  {
                                    value: 'httpGet',
                                    label: 'HTTP request returns a successful status (200-399)',
                                  },
                                  {
                                    value: 'tcpSocket',
                                    label: 'TCP Connection opens successfully',
                                  },
                                  {
                                    value: 'exec',
                                    label: 'Command run inside the container exits with status 0',
                                  },
                                ]}
                                value={config.livenessProbe?.type || 'none'}
                                onChange={(val) =>
                                  updateProbe('livenessProbe', {
                                    type: val as 'none' | 'httpGet' | 'tcpSocket' | 'exec',
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                            {isV2 && (
                              <>
                                {renderV2ProbeBlock(
                                  'livenessProbe',
                                  'httpGet',
                                  'HTTP request returns a successful status (200-399)',
                                  { showRequestPath: true, showHeaders: true }
                                )}
                                {renderV2ProbeBlock(
                                  'livenessProbe',
                                  'tcpSocket',
                                  'TCP Connection opens successfully'
                                )}
                                {renderV2ProbeBlock(
                                  'livenessProbe',
                                  'exec',
                                  'Command run inside the container exits with status 0'
                                )}
                              </>
                            )}
                            {!isV2 &&
                              config.livenessProbe?.type !== 'none' &&
                              config.livenessProbe?.type && (
                                <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                                  <VStack gap={6}>
                                    {/* Row 1: Check Port/Command + Check Interval */}
                                    <div className="flex gap-6 w-full">
                                      {(config.livenessProbe?.type === 'httpGet' ||
                                        config.livenessProbe?.type === 'tcpSocket') && (
                                        <VStack gap={3} className="flex-1">
                                          <VStack gap={1}>
                                            <span className="text-label-lg text-[var(--color-text-default)]">
                                              Check Port
                                            </span>
                                            <span className="text-body-md text-[var(--color-text-subtle)]">
                                              Specify the port used to send health check requests.
                                            </span>
                                          </VStack>
                                          <Input
                                            placeholder="e.g. 80"
                                            fullWidth
                                            value={
                                              config.livenessProbe?.type === 'httpGet'
                                                ? config.livenessProbe?.httpGet?.port || ''
                                                : config.livenessProbe?.tcpSocket?.port || ''
                                            }
                                            onChange={(e) =>
                                              config.livenessProbe?.type === 'httpGet'
                                                ? updateProbe('livenessProbe', {
                                                    httpGet: {
                                                      ...config.livenessProbe?.httpGet,
                                                      port: e.target.value,
                                                    },
                                                  })
                                                : updateProbe('livenessProbe', {
                                                    tcpSocket: {
                                                      ...config.livenessProbe?.tcpSocket,
                                                      port: e.target.value,
                                                    },
                                                  })
                                            }
                                          />
                                        </VStack>
                                      )}
                                      {config.livenessProbe?.type === 'exec' && (
                                        <VStack gap={3} className="flex-1">
                                          <VStack gap={1}>
                                            <span className="text-label-lg text-[var(--color-text-default)]">
                                              Command to run
                                            </span>
                                            <span className="text-body-md text-[var(--color-text-subtle)]">
                                              Specify the command to execute when the container
                                              starts.
                                            </span>
                                          </VStack>
                                          <Input
                                            placeholder="e.g. cat /tmp/health"
                                            fullWidth
                                            value={config.livenessProbe?.exec?.command || ''}
                                            onChange={(e) =>
                                              updateProbe('livenessProbe', {
                                                exec: {
                                                  ...config.livenessProbe?.exec,
                                                  command: e.target.value,
                                                },
                                              })
                                            }
                                          />
                                        </VStack>
                                      )}
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Check Interval
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the interval between health check requests.
                                          </span>
                                        </VStack>
                                        <HStack gap={2} align="center">
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.livenessProbe?.periodSeconds || '10'
                                              ) || 10
                                            }
                                            onChange={(val) =>
                                              updateProbe('livenessProbe', {
                                                periodSeconds: String(val),
                                              })
                                            }
                                            min={1}
                                            size="sm"
                                            width="sm"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </HStack>
                                      </VStack>
                                    </div>
                                    {/* Row 2: Initial Delay + Timeout */}
                                    <div className="flex gap-6 w-full">
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Initial Delay
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the delay before initiating the first health
                                            check.
                                          </span>
                                        </VStack>
                                        <HStack gap={2} align="center">
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.livenessProbe?.initialDelaySeconds || '0'
                                              ) || 0
                                            }
                                            onChange={(val) =>
                                              updateProbe('livenessProbe', {
                                                initialDelaySeconds: String(val),
                                              })
                                            }
                                            min={0}
                                            size="sm"
                                            width="sm"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </HStack>
                                      </VStack>
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Timeout
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the maximum time to wait for a health check
                                            response.
                                          </span>
                                        </VStack>
                                        <HStack gap={2} align="center">
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.livenessProbe?.timeoutSeconds || '1'
                                              ) || 1
                                            }
                                            onChange={(val) =>
                                              updateProbe('livenessProbe', {
                                                timeoutSeconds: String(val),
                                              })
                                            }
                                            min={1}
                                            size="sm"
                                            width="sm"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </HStack>
                                      </VStack>
                                    </div>
                                    {/* Row 3: Success Threshold + Failure Threshold */}
                                    <div className="flex gap-6 w-full">
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Success Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive successful
                                            checks to consider the status healthy.
                                          </span>
                                        </VStack>
                                        <NumberInput
                                          value={
                                            parseInt(
                                              config.livenessProbe?.successThreshold || '1'
                                            ) || 1
                                          }
                                          onChange={(val) =>
                                            updateProbe('livenessProbe', {
                                              successThreshold: String(val),
                                            })
                                          }
                                          min={1}
                                          size="sm"
                                          width="sm"
                                        />
                                      </VStack>
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Failure Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive failed checks
                                            to consider the status unhealthy.
                                          </span>
                                        </VStack>
                                        <NumberInput
                                          value={
                                            parseInt(
                                              config.livenessProbe?.failureThreshold || '3'
                                            ) || 3
                                          }
                                          onChange={(val) =>
                                            updateProbe('livenessProbe', {
                                              failureThreshold: String(val),
                                            })
                                          }
                                          min={1}
                                          size="sm"
                                          width="sm"
                                        />
                                      </VStack>
                                    </div>
                                  </VStack>
                                </div>
                              )}
                          </VStack>

                          {/* Startup Check */}
                          <VStack gap={6}>
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Startup Check
                            </span>
                            <VStack gap={3} className="w-[calc(50%-12px)]">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Type
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Select the probe type used for the health check.
                                </span>
                              </VStack>
                              <Select
                                options={[
                                  { value: 'none', label: 'None' },
                                  {
                                    value: 'httpGet',
                                    label: 'HTTP request returns a successful status (200-399)',
                                  },
                                  {
                                    value: 'tcpSocket',
                                    label: 'TCP Connection opens successfully',
                                  },
                                  {
                                    value: 'exec',
                                    label: 'Command run inside the container exits with status 0',
                                  },
                                ]}
                                value={config.startupProbe?.type || 'none'}
                                onChange={(val) =>
                                  updateProbe('startupProbe', {
                                    type: val as 'none' | 'httpGet' | 'tcpSocket' | 'exec',
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                            {isV2 && (
                              <>
                                {renderV2ProbeBlock(
                                  'startupProbe',
                                  'httpGet',
                                  'HTTP request returns a successful status (200-399)',
                                  { showRequestPath: true, showHeaders: true }
                                )}
                                {renderV2ProbeBlock(
                                  'startupProbe',
                                  'tcpSocket',
                                  'TCP Connection opens successfully'
                                )}
                                {renderV2ProbeBlock(
                                  'startupProbe',
                                  'exec',
                                  'Command run inside the container exits with status 0'
                                )}
                              </>
                            )}
                            {!isV2 &&
                              config.startupProbe?.type !== 'none' &&
                              config.startupProbe?.type && (
                                <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                                  <VStack gap={6}>
                                    {/* Row 1: Check Port/Command + Check Interval */}
                                    <div className="flex gap-6 w-full">
                                      {(config.startupProbe?.type === 'httpGet' ||
                                        config.startupProbe?.type === 'tcpSocket') && (
                                        <VStack gap={3} className="flex-1">
                                          <VStack gap={1}>
                                            <span className="text-label-lg text-[var(--color-text-default)]">
                                              Check Port
                                            </span>
                                            <span className="text-body-md text-[var(--color-text-subtle)]">
                                              Specify the port used to send health check requests.
                                            </span>
                                          </VStack>
                                          <Input
                                            placeholder="e.g. 80"
                                            fullWidth
                                            value={
                                              config.startupProbe?.type === 'httpGet'
                                                ? config.startupProbe?.httpGet?.port || ''
                                                : config.startupProbe?.tcpSocket?.port || ''
                                            }
                                            onChange={(e) =>
                                              config.startupProbe?.type === 'httpGet'
                                                ? updateProbe('startupProbe', {
                                                    httpGet: {
                                                      ...config.startupProbe?.httpGet,
                                                      port: e.target.value,
                                                    },
                                                  })
                                                : updateProbe('startupProbe', {
                                                    tcpSocket: {
                                                      ...config.startupProbe?.tcpSocket,
                                                      port: e.target.value,
                                                    },
                                                  })
                                            }
                                          />
                                        </VStack>
                                      )}
                                      {config.startupProbe?.type === 'exec' && (
                                        <VStack gap={3} className="flex-1">
                                          <VStack gap={1}>
                                            <span className="text-label-lg text-[var(--color-text-default)]">
                                              Command to run
                                            </span>
                                            <span className="text-body-md text-[var(--color-text-subtle)]">
                                              Specify the command to execute when the container
                                              starts.
                                            </span>
                                          </VStack>
                                          <Input
                                            placeholder="e.g. cat /tmp/health"
                                            fullWidth
                                            value={config.startupProbe?.exec?.command || ''}
                                            onChange={(e) =>
                                              updateProbe('startupProbe', {
                                                exec: {
                                                  ...config.startupProbe?.exec,
                                                  command: e.target.value,
                                                },
                                              })
                                            }
                                          />
                                        </VStack>
                                      )}
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Check Interval
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the interval between health check requests.
                                          </span>
                                        </VStack>
                                        <HStack gap={2} align="center">
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.startupProbe?.periodSeconds || '10'
                                              ) || 10
                                            }
                                            onChange={(val) =>
                                              updateProbe('startupProbe', {
                                                periodSeconds: String(val),
                                              })
                                            }
                                            min={1}
                                            size="sm"
                                            width="sm"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </HStack>
                                      </VStack>
                                    </div>
                                    {/* Row 2: Initial Delay + Timeout */}
                                    <div className="flex gap-6 w-full">
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Initial Delay
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the delay before initiating the first health
                                            check.
                                          </span>
                                        </VStack>
                                        <HStack gap={2} align="center">
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.startupProbe?.initialDelaySeconds || '0'
                                              ) || 0
                                            }
                                            onChange={(val) =>
                                              updateProbe('startupProbe', {
                                                initialDelaySeconds: String(val),
                                              })
                                            }
                                            min={0}
                                            size="sm"
                                            width="sm"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </HStack>
                                      </VStack>
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Timeout
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the maximum time to wait for a health check
                                            response.
                                          </span>
                                        </VStack>
                                        <HStack gap={2} align="center">
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.startupProbe?.timeoutSeconds || '1'
                                              ) || 1
                                            }
                                            onChange={(val) =>
                                              updateProbe('startupProbe', {
                                                timeoutSeconds: String(val),
                                              })
                                            }
                                            min={1}
                                            size="sm"
                                            width="sm"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </HStack>
                                      </VStack>
                                    </div>
                                    {/* Row 3: Success Threshold + Failure Threshold */}
                                    <div className="flex gap-6 w-full">
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Success Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive successful
                                            checks to consider the status healthy.
                                          </span>
                                        </VStack>
                                        <NumberInput
                                          value={
                                            parseInt(
                                              config.startupProbe?.successThreshold || '1'
                                            ) || 1
                                          }
                                          onChange={(val) =>
                                            updateProbe('startupProbe', {
                                              successThreshold: String(val),
                                            })
                                          }
                                          min={1}
                                          size="sm"
                                          width="sm"
                                        />
                                      </VStack>
                                      <VStack gap={3} className="flex-1">
                                        <VStack gap={1}>
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Failure Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive failed checks
                                            to consider the status unhealthy.
                                          </span>
                                        </VStack>
                                        <NumberInput
                                          value={
                                            parseInt(
                                              config.startupProbe?.failureThreshold || '3'
                                            ) || 3
                                          }
                                          onChange={(val) =>
                                            updateProbe('startupProbe', {
                                              failureThreshold: String(val),
                                            })
                                          }
                                          min={1}
                                          size="sm"
                                          width="sm"
                                        />
                                      </VStack>
                                    </div>
                                  </VStack>
                                </div>
                              )}
                          </VStack>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 9. Resources Section */}
                    <SectionCard>
                      <SectionCard.Header title="Resources" />
                      <SectionCard.Content>
                        <VStack gap={6}>
                          {/* Row 1: CPU Reservation + CPU Limit */}
                          <div className="flex gap-6 w-full">
                            <VStack gap={3} className="flex-1">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  CPU Reservation
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the minimum CPU amount reserved for the container.
                                </span>
                              </VStack>
                              <HStack gap={2} align="center">
                                <Input
                                  placeholder="1000"
                                  value={config.cpuRequest || ''}
                                  onChange={(e) =>
                                    updateContainerConfig(containerId, {
                                      cpuRequest: e.target.value,
                                    })
                                  }
                                />
                                <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                  mCPUs
                                </span>
                              </HStack>
                            </VStack>
                            <VStack gap={3} className="flex-1">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  CPU Limit
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the maximum CPU amount allowed for the container.
                                </span>
                              </VStack>
                              <HStack gap={2} align="center">
                                <Input
                                  placeholder="1000"
                                  value={config.cpuLimit || ''}
                                  onChange={(e) =>
                                    updateContainerConfig(containerId, {
                                      cpuLimit: e.target.value,
                                    })
                                  }
                                />
                                <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                  mCPUs
                                </span>
                              </HStack>
                            </VStack>
                          </div>
                          {/* Row 2: Memory Reservation + Memory Limit */}
                          <div className="flex gap-6 w-full">
                            <VStack gap={3} className="flex-1">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Memory Reservation
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the minimum memory amount reserved for the container.
                                </span>
                              </VStack>
                              <HStack gap={2} align="center">
                                <Input
                                  placeholder="128"
                                  value={config.memoryRequest || ''}
                                  onChange={(e) =>
                                    updateContainerConfig(containerId, {
                                      memoryRequest: e.target.value,
                                    })
                                  }
                                />
                                <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                  MiB
                                </span>
                              </HStack>
                            </VStack>
                            <VStack gap={3} className="flex-1">
                              <VStack gap={1}>
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Memory Limit
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the maximum memory amount allowed for the container.
                                </span>
                              </VStack>
                              <HStack gap={2} align="center">
                                <Input
                                  placeholder="128"
                                  value={config.memoryLimit || ''}
                                  onChange={(e) =>
                                    updateContainerConfig(containerId, {
                                      memoryLimit: e.target.value,
                                    })
                                  }
                                />
                                <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                  MiB
                                </span>
                              </HStack>
                            </VStack>
                          </div>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 10. Security Context Section */}
                    <SectionCard>
                      <SectionCard.Header title="Security context" />
                      <SectionCard.Content>
                        <VStack gap={6}>
                          {/* Row 1: Privileged + Privilege Escalation */}
                          <div className="flex gap-6 w-full">
                            <VStack gap={3} className="flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Privileged
                              </span>
                              <VStack gap={2}>
                                <HStack gap={2} align="center">
                                  <Radio
                                    checked={!config.privileged}
                                    onChange={() =>
                                      updateContainerConfig(containerId, {
                                        privileged: false,
                                      })
                                    }
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    No
                                  </span>
                                </HStack>
                                <HStack gap={2} align="center">
                                  <Radio
                                    checked={config.privileged || false}
                                    onChange={() =>
                                      updateContainerConfig(containerId, {
                                        privileged: true,
                                      })
                                    }
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Yes: container has full access to the host
                                  </span>
                                </HStack>
                              </VStack>
                            </VStack>
                            <VStack gap={3} className="flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Privilege Escalation
                              </span>
                              <VStack gap={2}>
                                <HStack gap={2} align="center">
                                  <Radio
                                    checked={!config.allowPrivilegeEscalation}
                                    onChange={() =>
                                      updateContainerConfig(containerId, {
                                        allowPrivilegeEscalation: false,
                                      })
                                    }
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    No
                                  </span>
                                </HStack>
                                <HStack gap={2} align="center">
                                  <Radio
                                    checked={config.allowPrivilegeEscalation || false}
                                    onChange={() =>
                                      updateContainerConfig(containerId, {
                                        allowPrivilegeEscalation: true,
                                      })
                                    }
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Yes: container can gain more privileges than its parent process
                                  </span>
                                </HStack>
                              </VStack>
                            </VStack>
                          </div>
                          {/* Row 2: Run as Non-Root + Read-Only Root Filesystem */}
                          <div className="flex gap-6 w-full">
                            <VStack gap={3} className="flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Run as Non-Root
                              </span>
                              <VStack gap={2}>
                                <HStack gap={2} align="center">
                                  <Radio
                                    checked={!config.runAsNonRoot}
                                    onChange={() =>
                                      updateContainerConfig(containerId, {
                                        runAsNonRoot: false,
                                      })
                                    }
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    No
                                  </span>
                                </HStack>
                                <HStack gap={2} align="center">
                                  <Radio
                                    checked={config.runAsNonRoot || false}
                                    onChange={() =>
                                      updateContainerConfig(containerId, {
                                        runAsNonRoot: true,
                                      })
                                    }
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Yes: container must run as a non-root user
                                  </span>
                                </HStack>
                              </VStack>
                            </VStack>
                            <VStack gap={3} className="flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Read-Only Root Filesystem
                              </span>
                              <VStack gap={2}>
                                <HStack gap={2} align="center">
                                  <Radio
                                    checked={!config.readOnlyRootFilesystem}
                                    onChange={() =>
                                      updateContainerConfig(containerId, {
                                        readOnlyRootFilesystem: false,
                                      })
                                    }
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    No
                                  </span>
                                </HStack>
                                <HStack gap={2} align="center">
                                  <Radio
                                    checked={config.readOnlyRootFilesystem || false}
                                    onChange={() =>
                                      updateContainerConfig(containerId, {
                                        readOnlyRootFilesystem: true,
                                      })
                                    }
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)]">
                                    Yes: container has a read-only root filesystem
                                  </span>
                                </HStack>
                              </VStack>
                            </VStack>
                          </div>
                          {/* Row 3: Run as User ID (half width) */}
                          <VStack gap={2} className="w-[calc(50%-12px)]">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Run as User ID
                            </span>
                            <Input
                              placeholder=""
                              fullWidth
                              value={config.runAsUser || ''}
                              onChange={(e) =>
                                updateContainerConfig(containerId, {
                                  runAsUser: e.target.value,
                                })
                              }
                            />
                          </VStack>
                          {/* Row 4: Add Capabilities + Drop Capabilities */}
                          <div className="flex gap-6 w-full">
                            <VStack gap={2} className="flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Add Capabilities
                              </span>
                              <Select
                                options={[
                                  { value: '', label: '' },
                                  { value: 'NET_ADMIN', label: 'NET_ADMIN' },
                                  { value: 'SYS_ADMIN', label: 'SYS_ADMIN' },
                                  { value: 'SYS_PTRACE', label: 'SYS_PTRACE' },
                                  { value: 'NET_RAW', label: 'NET_RAW' },
                                  { value: 'SYS_TIME', label: 'SYS_TIME' },
                                ]}
                                value={config.addCapabilities || ''}
                                onChange={(val) =>
                                  updateContainerConfig(containerId, {
                                    addCapabilities: val,
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                            <VStack gap={2} className="flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Drop Capabilities
                              </span>
                              <Select
                                options={[
                                  { value: '', label: '' },
                                  { value: 'ALL', label: 'ALL' },
                                  { value: 'NET_ADMIN', label: 'NET_ADMIN' },
                                  { value: 'SYS_ADMIN', label: 'SYS_ADMIN' },
                                  { value: 'SETUID', label: 'SETUID' },
                                  { value: 'SETGID', label: 'SETGID' },
                                ]}
                                value={config.dropCapabilities || ''}
                                onChange={(val) =>
                                  updateContainerConfig(containerId, {
                                    dropCapabilities: val,
                                  })
                                }
                                fullWidth
                              />
                            </VStack>
                          </div>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* 11. Storage Section */}
                    <SectionCard>
                      <SectionCard.Header title="Storage" />
                      <SectionCard.Content>
                        <VStack gap={6}>
                          {/* Selected volumes with their mounts */}
                          {config.selectedVolumes && config.selectedVolumes.length > 0 && (
                            <VStack gap={3}>
                              {config.selectedVolumes.map(
                                (
                                  selectedVol: {
                                    volumeName: string;
                                    volumeType: string;
                                    mounts: Array<{
                                      mountPath: string;
                                      subPath: string;
                                      readOnly: boolean;
                                    }>;
                                  },
                                  volIndex: number
                                ) => (
                                  <div
                                    key={volIndex}
                                    className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                  >
                                    <VStack gap={2}>
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        {selectedVol.volumeName} ({selectedVol.volumeType})
                                      </span>
                                      {/* Mount rows */}
                                      {(selectedVol.mounts || []).map(
                                        (
                                          mount: {
                                            mountPath: string;
                                            subPath: string;
                                            readOnly: boolean;
                                          },
                                          mountIndex: number
                                        ) => (
                                          <div
                                            key={mountIndex}
                                            className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                          >
                                            <div className="flex gap-2 items-start">
                                              <VStack gap={2} className="flex-1">
                                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                                  Mount Point{' '}
                                                  <span className="text-[var(--color-state-danger)]">
                                                    *
                                                  </span>
                                                </span>
                                                <Input
                                                  placeholder=""
                                                  fullWidth
                                                  value={mount.mountPath}
                                                  onChange={(e) => {
                                                    const newVolumes = [
                                                      ...(config.selectedVolumes || []),
                                                    ];
                                                    newVolumes[volIndex].mounts[mountIndex] = {
                                                      ...newVolumes[volIndex].mounts[mountIndex],
                                                      mountPath: e.target.value,
                                                    };
                                                    updateContainerConfig(containerId, {
                                                      selectedVolumes: newVolumes,
                                                    });
                                                  }}
                                                />
                                              </VStack>
                                              <VStack gap={2} className="flex-1">
                                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                                  Sub Path in Volume
                                                </span>
                                                <Input
                                                  placeholder=""
                                                  fullWidth
                                                  value={mount.subPath}
                                                  onChange={(e) => {
                                                    const newVolumes = [
                                                      ...(config.selectedVolumes || []),
                                                    ];
                                                    newVolumes[volIndex].mounts[mountIndex] = {
                                                      ...newVolumes[volIndex].mounts[mountIndex],
                                                      subPath: e.target.value,
                                                    };
                                                    updateContainerConfig(containerId, {
                                                      selectedVolumes: newVolumes,
                                                    });
                                                  }}
                                                />
                                              </VStack>
                                              <VStack gap={2}>
                                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                                  Read Only
                                                </span>
                                                <div className="pt-2">
                                                  <Checkbox
                                                    checked={mount.readOnly || false}
                                                    onChange={(e) => {
                                                      const newVolumes = [
                                                        ...(config.selectedVolumes || []),
                                                      ];
                                                      newVolumes[volIndex].mounts[mountIndex] = {
                                                        ...newVolumes[volIndex].mounts[mountIndex],
                                                        readOnly: e.target.checked,
                                                      };
                                                      updateContainerConfig(containerId, {
                                                        selectedVolumes: newVolumes,
                                                      });
                                                    }}
                                                  />
                                                </div>
                                              </VStack>
                                              <button
                                                className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                                onClick={() => {
                                                  const newVolumes = [
                                                    ...(config.selectedVolumes || []),
                                                  ];
                                                  newVolumes[volIndex].mounts = newVolumes[
                                                    volIndex
                                                  ].mounts.filter(
                                                    (
                                                      _: {
                                                        mountPath: string;
                                                        subPath: string;
                                                        readOnly: boolean;
                                                      },
                                                      i: number
                                                    ) => i !== mountIndex
                                                  );
                                                  if (newVolumes[volIndex].mounts.length === 0) {
                                                    newVolumes.splice(volIndex, 1);
                                                  }
                                                  updateContainerConfig(containerId, {
                                                    selectedVolumes: newVolumes,
                                                  });
                                                }}
                                              >
                                                <IconX
                                                  size={16}
                                                  className="text-[var(--color-text-muted)]"
                                                  stroke={1.5}
                                                />
                                              </button>
                                            </div>
                                          </div>
                                        )
                                      )}
                                      {/* Add Mount button inside volume container */}
                                      <div className="w-fit">
                                        <Button
                                          variant="secondary"
                                          size="sm"
                                          leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                          onClick={() => {
                                            const newVolumes = [...(config.selectedVolumes || [])];
                                            newVolumes[volIndex].mounts = [
                                              ...newVolumes[volIndex].mounts,
                                              { mountPath: '', subPath: '', readOnly: false },
                                            ];
                                            updateContainerConfig(containerId, {
                                              selectedVolumes: newVolumes,
                                            });
                                          }}
                                        >
                                          Add Mount
                                        </Button>
                                      </div>
                                    </VStack>
                                  </div>
                                )
                              )}
                            </VStack>
                          )}
                          {/* Select Volume dropdown */}
                          <div className="w-[calc(50%-12px)]">
                            <Select
                              options={[
                                { value: '', label: 'Select volume' },
                                ...volumes.map((v) => ({
                                  value: v.volumeName,
                                  label: v.volumeName,
                                })),
                              ]}
                              value=""
                              onChange={(val) => {
                                if (val) {
                                  const volume = volumes.find((v) => v.volumeName === val);
                                  if (volume) {
                                    const newVolumes = [
                                      ...(config.selectedVolumes || []),
                                      {
                                        volumeName: volume.volumeName,
                                        volumeType: volume.type,
                                        mounts: [{ mountPath: '', subPath: '', readOnly: false }],
                                      },
                                    ];
                                    updateContainerConfig(containerId, {
                                      selectedVolumes: newVolumes,
                                    });
                                  }
                                }
                              }}
                              fullWidth
                            />
                          </div>
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
            activeTab={activeTab}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreatePodPage;
