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
  Table,
  Pagination,
  SearchInput,
  Chip,
  StatusIndicator,
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
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '2',
    name: 'cattle-system',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '3',
    name: 'cattle-fleet-local-system',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '4',
    name: 'cattle-fleet-system',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '5',
    name: 'cattle-provisioning-capi-system',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '6',
    name: 'cert-manager',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '7',
    name: 'default',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '8',
    name: 'kube-node-lease',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '9',
    name: 'kube-public',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
  },
  {
    id: '10',
    name: 'kube-system',
    status: 'active',
    description: 'description text',
    createdAt: '2025-11-10 12:57',
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

// Volume Claim Template
interface VolumeClaimTemplate {
  name: string;
  useExistingPV: boolean;
  storageClass: string;
  capacity: string;
  persistentVolume: string;
  accessModes: {
    readWriteOnce: boolean;
    readOnlyMany: boolean;
    readWriteMany: boolean;
  };
}

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

// Status icon component for summary items
function StatusIcon({ status }: { status: 'complete' | 'in-progress' }) {
  if (status === 'complete') {
    return (
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
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="var(--color-border-default)" strokeDasharray="3 3" />
    </svg>
  );
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
            size={12}
            stroke={1.5}
            className={`text-[var(--color-text-muted)] transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        ) : (
          <div className="w-3" />
        )}
        <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
          {label}
        </span>
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
      <span className="text-[12px] leading-5 text-[var(--color-text-default)]">{label}</span>
      <StatusIcon status={status} />
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
  // Expanded state for collapsible sections
  const [deploymentExpanded, setDeploymentExpanded] = useState(true);

  // Simple completion checks based on required fields
  const basicInfoComplete = name.trim().length > 0;
  const labelsComplete = true; // Labels are optional
  const scalingComplete = true; // Scaling is optional
  const deploymentComplete = basicInfoComplete && labelsComplete && scalingComplete;
  const podComplete = true; // All pod sections are optional
  const containersComplete = containerTabs.length > 0; // At least one container exists

  return (
    <div className="w-[280px] shrink-0 mt-[45px]">
      <div className="sticky top-4">
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[8px] overflow-hidden flex flex-col gap-3 pt-3 pb-4 px-3">
          {/* Scrollable content area */}
          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[8px] pl-4 pr-1 py-4 max-h-[340px] min-h-[160px] overflow-y-auto">
            <VStack gap={4} className="pr-2">
              <h5 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                Summary
              </h5>

              {/* Deployment Section */}
              <VStack gap={2}>
                <SummarySectionHeader
                  label="Deployment"
                  status={deploymentComplete ? 'complete' : 'in-progress'}
                  expanded={deploymentExpanded}
                  onToggle={() => setDeploymentExpanded(!deploymentExpanded)}
                  hasChildren
                />
                {deploymentExpanded && (
                  <VStack gap={0} className="ml-3">
                    <SummarySubItem
                      label="Basic Information"
                      status={basicInfoComplete ? 'complete' : 'in-progress'}
                    />
                    <SummarySubItem
                      label="Labels & Annotations"
                      status={labelsComplete ? 'complete' : 'in-progress'}
                    />
                    <SummarySubItem
                      label="Scaling and Upgrade Policy"
                      status={scalingComplete ? 'complete' : 'in-progress'}
                    />
                  </VStack>
                )}
              </VStack>

              {/* Pod Section */}
              <SummarySectionHeader
                label="Pod"
                status={podComplete ? 'complete' : 'in-progress'}
                expanded={false}
                onToggle={() => {}}
                hasChildren
              />

              {/* Container Sections */}
              {containerTabs.map((container) => (
                <SummarySectionHeader
                  key={container.id}
                  label={container.name}
                  status={containersComplete ? 'complete' : 'in-progress'}
                  expanded={false}
                  onToggle={() => {}}
                  hasChildren
                />
              ))}
            </VStack>
          </div>

          {/* Button Container */}
          <HStack gap={2} className="w-full pt-3">
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
      <SectionCard.Header title="Labels & Annotations" />
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
              <VStack gap={3}>
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                  >
                    <div className="flex gap-2 items-start w-full">
                      <VStack gap={3} className="flex-1">
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
              <VStack gap={3}>
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
      <SectionCard.Header title="Scaling and Upgrade Policy" />
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

  // Service Account state
  const [serviceAccountOption, setServiceAccountOption] = useState<string>('any');
  const [selectedNode, setSelectedNode] = useState<string>('');

  // Tolerations state
  const [tolerations, setTolerations] = useState<Toleration[]>([]);
  const [priority, setPriority] = useState<string>('');
  const [priorityClassName, setPriorityClassName] = useState<string>('');

  // Volumes state
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [volumeType, setVolumeType] = useState<string>('configmap');

  // Volume Claim Templates state
  const [volumeClaimTemplates, setVolumeClaimTemplates] = useState<VolumeClaimTemplate[]>([]);

  // Node Affinity state
  const [nodeAffinityTerms, setNodeAffinityTerms] = useState<NodeAffinityTerm[]>([]);

  // Pod Affinity state
  const [podAffinityTerms, setPodAffinityTerms] = useState<PodAffinityTerm[]>([]);

  // Hostname and Subdomain state
  const [hostname, setHostname] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');

  // Nameservers and Search Domains state
  const [nameservers, setNameservers] = useState<string[]>([]);
  const [searchDomains, setSearchDomains] = useState<string[]>([]);

  // Resolver Options state
  const [resolverOptions, setResolverOptions] = useState<{ name: string; value: string }[]>([]);

  // Host Aliases state
  const [hostAliases, setHostAliases] = useState<{ ip: string; hostname: string }[]>([]);

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

  // Volume Claim Template management
  const addVolumeClaimTemplate = useCallback(() => {
    setVolumeClaimTemplates([
      ...volumeClaimTemplates,
      {
        name: '',
        useExistingPV: false,
        storageClass: '',
        capacity: '',
        persistentVolume: '',
        accessModes: { readWriteOnce: false, readOnlyMany: false, readWriteMany: false },
      },
    ]);
  }, [volumeClaimTemplates]);

  const removeVolumeClaimTemplate = useCallback(
    (index: number) => {
      setVolumeClaimTemplates(volumeClaimTemplates.filter((_, i) => i !== index));
    },
    [volumeClaimTemplates]
  );

  const updateVolumeClaimTemplate = useCallback(
    (index: number, updates: Partial<VolumeClaimTemplate>) => {
      const newTemplates = [...volumeClaimTemplates];
      newTemplates[index] = { ...newTemplates[index], ...updates };
      setVolumeClaimTemplates(newTemplates);
    },
    [volumeClaimTemplates]
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

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Form Tabs */}
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
                                    className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded shrink-0"
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
                          className="flex items-center justify-center h-[20px] px-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors text-[var(--color-text-muted)] shrink-0"
                        >
                          <IconPlus size={16} stroke={1.5} />
                        </button>
                      </div>
                    </Tabs>
                  </div>
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
                        <SectionCard.Header title="Labels & Annotations" />
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
                                <VStack gap={3}>
                                  {podLabels.map((label, index) => (
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
                                            onChange={(e) =>
                                              updatePodLabel(index, 'key', e.target.value)
                                            }
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
                                            onChange={(e) =>
                                              updatePodLabel(index, 'value', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <button
                                          onClick={() => removePodLabel(index)}
                                          className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                  Annotations
                                </span>
                                <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                                  Specify the annotations used to provide additional metadata for
                                  the resource.
                                </p>
                              </VStack>

                              {/* Bordered container for annotations */}
                              <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                <VStack gap={3}>
                                  {podAnnotations.map((annotation, index) => (
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
                                            onChange={(e) =>
                                              updatePodAnnotation(index, 'key', e.target.value)
                                            }
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
                                            onChange={(e) =>
                                              updatePodAnnotation(index, 'value', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <button
                                          onClick={() => removePodAnnotation(index)}
                                          className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                          <VStack gap={3}>
                            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                              Pod Policy
                            </span>
                            <VStack gap={1} className="w-full">
                              <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                Termination Grace Period
                              </span>
                              <span className="text-[12px] text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                              <HStack gap={2} align="center">
                                <NumberInput
                                  placeholder={30}
                                  className="w-[320px]"
                                  value={
                                    terminationGracePeriod
                                      ? parseInt(terminationGracePeriod)
                                      : undefined
                                  }
                                  onChange={(val) =>
                                    setTerminationGracePeriod(val?.toString() || '')
                                  }
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
                        <SectionCard.Header title="Networking" />
                        <SectionCard.Content>
                          <VStack gap={4}>
                            {/* Network Settings */}
                            <VStack gap={3}>
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                                Network Settings
                              </span>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full items-end">
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
                                  <Input
                                    placeholder="e.g. web"
                                    fullWidth
                                    value={hostname}
                                    onChange={(e) => setHostname(e.target.value)}
                                  />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                    Subdomain
                                  </span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">
                                    Specify the subdomain assigned to the pod.
                                  </span>
                                  <Input
                                    placeholder="e.g. web"
                                    fullWidth
                                    value={subdomain}
                                    onChange={(e) => setSubdomain(e.target.value)}
                                  />
                                </VStack>
                              </div>
                            </VStack>

                            {/* Nameservers */}
                            <VStack gap={3}>
                              <VStack gap={1.5}>
                                <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                  Nameservers
                                </span>
                                <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                                  Specify the DNS nameserver addresses used by the pod.
                                </p>
                              </VStack>

                              <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                <VStack gap={3}>
                                  {nameservers.map((ns, index) => (
                                    <div
                                      key={index}
                                      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                    >
                                      <div className="flex gap-2 items-start w-full">
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Nameservers
                                          </span>
                                          <Input
                                            placeholder="e.g. 8.8.8.8"
                                            value={ns}
                                            onChange={(e) =>
                                              updateNameserver(index, e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <button
                                          onClick={() => removeNameserver(index)}
                                          className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                  Search Domains
                                </span>
                                <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                                  Specify the search domains used for DNS resolution.
                                </p>
                              </VStack>

                              <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                <VStack gap={3}>
                                  {searchDomains.map((sd, index) => (
                                    <div
                                      key={index}
                                      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                    >
                                      <div className="flex gap-2 items-start w-full">
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Search Domains
                                          </span>
                                          <Input
                                            placeholder="e.g. example.com"
                                            value={sd}
                                            onChange={(e) =>
                                              updateSearchDomain(index, e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <button
                                          onClick={() => removeSearchDomain(index)}
                                          className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                Resolver Options
                              </span>

                              <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                <VStack gap={3}>
                                  {resolverOptions.map((opt, index) => (
                                    <div
                                      key={index}
                                      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                    >
                                      <div className="flex gap-2 items-start w-full">
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Name
                                          </span>
                                          <Input
                                            placeholder="input name"
                                            value={opt.name}
                                            onChange={(e) =>
                                              updateResolverOption(index, 'name', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Value
                                          </span>
                                          <Input
                                            placeholder="input value"
                                            value={opt.value}
                                            onChange={(e) =>
                                              updateResolverOption(index, 'value', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <button
                                          onClick={() => removeResolverOption(index)}
                                          className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                Host Aliases
                              </span>

                              <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                <VStack gap={3}>
                                  {hostAliases.map((alias, index) => (
                                    <div
                                      key={index}
                                      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                    >
                                      <div className="flex gap-2 items-start w-full">
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            IP Address
                                          </span>
                                          <Input
                                            placeholder="e.g. 127.0.0.1"
                                            value={alias.ip}
                                            onChange={(e) =>
                                              updateHostAlias(index, 'ip', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Hostname
                                          </span>
                                          <Input
                                            placeholder="e.g. foo.company.com"
                                            value={alias.hostname}
                                            onChange={(e) =>
                                              updateHostAlias(index, 'hostname', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <button
                                          onClick={() => removeHostAlias(index)}
                                          className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                        <SectionCard.Header title="Node Scheduling" />
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
                            {nodeScheduling === 'specific' && (
                              <VStack gap={1} className="w-full max-w-[606px]">
                                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Node
                                </span>
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
                              </VStack>
                            )}
                            {nodeScheduling === 'matching' && (
                              <VStack gap={3}>
                                <VStack gap={1.5}>
                                  <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                    Node Affinity Rules
                                  </span>
                                  <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                                    Define rules for scheduling pods on specific nodes based on node
                                    labels.
                                  </p>
                                </VStack>

                                <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                  <VStack gap={3}>
                                    {nodeAffinityTerms.map((term, termIndex) => (
                                      <div
                                        key={termIndex}
                                        className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                      >
                                        <VStack gap={6}>
                                          <div className="flex items-start justify-between w-full">
                                            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                              Rule {termIndex + 1}
                                            </span>
                                            <button
                                              onClick={() => {
                                                setNodeAffinityTerms(
                                                  nodeAffinityTerms.filter(
                                                    (_, i) => i !== termIndex
                                                  )
                                                );
                                              }}
                                              className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                              <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
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
                                            {term.priority === 'preferred' && (
                                              <VStack gap={2}>
                                                <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
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
                                            <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                              Match Expressions
                                            </span>
                                            {term.matchExpressions.map((expr, exprIndex) => (
                                              <div
                                                key={exprIndex}
                                                className="flex gap-2 items-start w-full"
                                              >
                                                <VStack gap={1} className="flex-1">
                                                  <span className="text-[11px] text-[var(--color-text-subtle)]">
                                                    Key
                                                  </span>
                                                  <Input
                                                    placeholder="e.g. kubernetes.io/os"
                                                    value={expr.key}
                                                    onChange={(e) => {
                                                      const newTerms = [...nodeAffinityTerms];
                                                      newTerms[termIndex].matchExpressions[
                                                        exprIndex
                                                      ] = {
                                                        ...expr,
                                                        key: e.target.value,
                                                      };
                                                      setNodeAffinityTerms(newTerms);
                                                    }}
                                                    fullWidth
                                                  />
                                                </VStack>
                                                <VStack gap={1} className="w-[140px]">
                                                  <span className="text-[11px] text-[var(--color-text-subtle)]">
                                                    Operator
                                                  </span>
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
                                                      newTerms[termIndex].matchExpressions[
                                                        exprIndex
                                                      ] = {
                                                        ...expr,
                                                        operator: val,
                                                      };
                                                      setNodeAffinityTerms(newTerms);
                                                    }}
                                                    fullWidth
                                                  />
                                                </VStack>
                                                <VStack gap={1} className="flex-1">
                                                  <span className="text-[11px] text-[var(--color-text-subtle)]">
                                                    Value
                                                  </span>
                                                  <Input
                                                    placeholder="e.g. linux"
                                                    value={expr.value}
                                                    onChange={(e) => {
                                                      const newTerms = [...nodeAffinityTerms];
                                                      newTerms[termIndex].matchExpressions[
                                                        exprIndex
                                                      ] = {
                                                        ...expr,
                                                        value: e.target.value,
                                                      };
                                                      setNodeAffinityTerms(newTerms);
                                                    }}
                                                    fullWidth
                                                  />
                                                </VStack>
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
                                                  className="mt-5 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                            )}
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Pod Scheduling */}
                      <SectionCard>
                        <SectionCard.Header title="Pod Scheduling" />
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
                                        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                          Type
                                        </span>
                                        <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                                          Select the scheduling type to apply to the pod.
                                        </span>
                                      </VStack>
                                      <button
                                        onClick={() => {
                                          setPodAffinityTerms(
                                            podAffinityTerms.filter((_, i) => i !== termIndex)
                                          );
                                        }}
                                        className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                      <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                        Priority
                                      </span>
                                      <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
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
                                        placeholder="Find Namespaces with filters"
                                        className="w-[312px]"
                                      />

                                      {/* Pagination */}
                                      <Pagination
                                        currentPage={1}
                                        totalPages={Math.ceil(MOCK_NAMESPACES.length / 5)}
                                        onPageChange={() => {}}
                                        showSettings
                                        totalItems={
                                          MOCK_NAMESPACES.length > 100
                                            ? 115
                                            : MOCK_NAMESPACES.length
                                        }
                                        selectedCount={term.selectedNamespaces.length}
                                      />

                                      {/* Namespace Table */}
                                      <Table
                                        columns={[
                                          {
                                            key: 'status',
                                            label: 'Status',
                                            width: '80px',
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
                                            label: 'Created At',
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
                                      {term.selectedNamespaces.length > 0 && (
                                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-2 py-2 flex flex-wrap gap-1">
                                          {term.selectedNamespaces.map((nsId) => {
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
                                                    selectedNamespaces:
                                                      term.selectedNamespaces.filter(
                                                        (id) => id !== nsId
                                                      ),
                                                  };
                                                  setPodAffinityTerms(newTerms);
                                                }}
                                              />
                                            ) : null;
                                          })}
                                        </div>
                                      )}
                                    </VStack>
                                  )}

                                  {/* Match Expressions / Rules Section */}
                                  <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                    <VStack gap={2}>
                                      {term.matchExpressions.map((expr, exprIndex) => (
                                        <div
                                          key={exprIndex}
                                          className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                        >
                                          <div className="flex gap-2 items-start w-full">
                                            <VStack gap={2} className="flex-1">
                                              <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                                Key
                                              </span>
                                              <Input
                                                placeholder="Input Key"
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
                                              <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
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
                                              <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
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
                                                  ].matchExpressions.filter(
                                                    (_, i) => i !== exprIndex
                                                  ),
                                                };
                                                setPodAffinityTerms(newTerms);
                                              }}
                                              className="mt-6 p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                      <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                        Topology Key
                                      </span>
                                      <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
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
                          <VStack gap={4}>
                            {/* Tolerations */}
                            <VStack gap={3}>
                              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                Tolerations
                              </span>

                              <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                                <VStack gap={3}>
                                  {tolerations.map((toleration, index) => (
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
                                            placeholder="Key"
                                            value={toleration.key}
                                            onChange={(e) =>
                                              updateToleration(index, 'key', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Operator
                                          </span>
                                          <Select
                                            options={[
                                              { value: 'Equal', label: 'Equal' },
                                              { value: 'Exists', label: 'Exists' },
                                            ]}
                                            value={toleration.operator}
                                            onChange={(val) =>
                                              updateToleration(index, 'operator', val)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Value
                                          </span>
                                          <Input
                                            placeholder="Value"
                                            value={toleration.value}
                                            onChange={(e) =>
                                              updateToleration(index, 'value', e.target.value)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Effect
                                          </span>
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
                                            onChange={(val) =>
                                              updateToleration(index, 'effect', val)
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Toleration Seconds
                                          </span>
                                          <HStack gap={2} align="center">
                                            <Input
                                              placeholder=""
                                              value={toleration.tolerationSeconds}
                                              onChange={(e) =>
                                                updateToleration(
                                                  index,
                                                  'tolerationSeconds',
                                                  e.target.value
                                                )
                                              }
                                              fullWidth
                                            />
                                            <Select
                                              options={[
                                                { value: 'sec', label: 'sec' },
                                                { value: 'min', label: 'min' },
                                              ]}
                                              value={toleration.tolerationSecondsUnit}
                                              onChange={(val) =>
                                                updateToleration(
                                                  index,
                                                  'tolerationSecondsUnit',
                                                  val
                                                )
                                              }
                                              className="w-[80px] shrink-0"
                                            />
                                          </HStack>
                                        </VStack>
                                        <button
                                          onClick={() => removeToleration(index)}
                                          className="mt-6 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                      onClick={addToleration}
                                    >
                                      Add Toleration
                                    </Button>
                                  </div>
                                </VStack>
                              </div>
                            </VStack>

                            {/* Priority */}
                            <div className="grid grid-cols-2 gap-4 w-full">
                              <VStack gap={1}>
                                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Priority
                                </span>
                                <span className="text-[12px] text-[var(--color-text-subtle)]">
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
                                <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                  Priority Class Name
                                </span>
                                <span className="text-[12px] text-[var(--color-text-subtle)]">
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
                        <SectionCard.Header title="Security Context" />
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
                                    <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                      {volume.type === 'configmap' && 'ConfigMap'}
                                      {volume.type === 'secret' && 'Secret'}
                                      {volume.type === 'pvc' && 'Persistent Volume Claim'}
                                      {volume.type === 'create-pvc' &&
                                        'Create Persistent Volume Claim'}
                                    </span>
                                    <button
                                      onClick={() => removeVolume(index)}
                                      className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                      <div className="flex gap-2 items-start py-3 w-full">
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                            Volume Name{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <Input
                                            placeholder="Input name"
                                            value={volume.volumeName}
                                            onChange={(e) =>
                                              updateVolume(index, { volumeName: e.target.value })
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                            ConfigMap{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <Select
                                            options={[
                                              { value: 'config-1', label: 'config-1' },
                                              { value: 'config-2', label: 'config-2' },
                                            ]}
                                            value={(volume as ConfigMapVolume).configMapName}
                                            onChange={(val) =>
                                              updateVolume(index, { configMapName: val })
                                            }
                                            placeholder="Select ConfigMap"
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2}>
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Optional
                                          </span>
                                          <Checkbox
                                            checked={(volume as ConfigMapVolume).optional}
                                            onChange={(e) =>
                                              updateVolume(index, { optional: e.target.checked })
                                            }
                                          />
                                        </VStack>
                                      </div>
                                      <Disclosure title="Advanced" defaultOpen={false}>
                                        <VStack gap={2} className="pt-2">
                                          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
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
                                      </Disclosure>
                                    </>
                                  )}

                                  {/* Secret content */}
                                  {volume.type === 'secret' && (
                                    <>
                                      <div className="flex gap-2 items-start py-3 w-full">
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                            Volume Name{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <Input
                                            placeholder="Input name"
                                            value={volume.volumeName}
                                            onChange={(e) =>
                                              updateVolume(index, { volumeName: e.target.value })
                                            }
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2} className="flex-1">
                                          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                            Secret{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <Select
                                            options={[
                                              { value: 'secret-1', label: 'secret-1' },
                                              { value: 'secret-2', label: 'secret-2' },
                                            ]}
                                            value={(volume as SecretVolume).secretName}
                                            onChange={(val) =>
                                              updateVolume(index, { secretName: val })
                                            }
                                            placeholder="Select Secret"
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={2}>
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Optional
                                          </span>
                                          <Checkbox
                                            checked={(volume as SecretVolume).optional}
                                            onChange={(e) =>
                                              updateVolume(index, { optional: e.target.checked })
                                            }
                                          />
                                        </VStack>
                                      </div>
                                      <Disclosure title="Advanced" defaultOpen={false}>
                                        <VStack gap={2} className="pt-2">
                                          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
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
                                      </Disclosure>
                                    </>
                                  )}

                                  {/* PVC content */}
                                  {volume.type === 'pvc' && (
                                    <div className="flex gap-2 items-start py-3 w-full">
                                      <VStack gap={2} className="flex-1">
                                        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                          Volume Name{' '}
                                          <span className="text-[var(--color-state-danger)]">
                                            *
                                          </span>
                                        </span>
                                        <Input
                                          placeholder="Input name"
                                          value={volume.volumeName}
                                          onChange={(e) =>
                                            updateVolume(index, { volumeName: e.target.value })
                                          }
                                          fullWidth
                                        />
                                      </VStack>
                                      <VStack gap={2} className="flex-1">
                                        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                          Persistent Volume Claim{' '}
                                          <span className="text-[var(--color-state-danger)]">
                                            *
                                          </span>
                                        </span>
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
                                      </VStack>
                                      <VStack gap={2}>
                                        <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                          Read Only
                                        </span>
                                        <Checkbox
                                          checked={(volume as PVCVolume).readOnly}
                                          onChange={(e) =>
                                            updateVolume(index, { readOnly: e.target.checked })
                                          }
                                        />
                                      </VStack>
                                    </div>
                                  )}

                                  {/* Create PVC content */}
                                  {volume.type === 'create-pvc' && (
                                    <>
                                      <div className="p-3 w-full">
                                        <VStack gap={6}>
                                          <VStack gap={3}>
                                            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                              Persistent Volume Claim Name{' '}
                                              <span className="text-[var(--color-state-danger)]">
                                                *
                                              </span>
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

                                          {!(volume as CreatePVCVolume).useExistingPV && (
                                            <div className="grid grid-cols-2 gap-4">
                                              <VStack gap={3}>
                                                <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                                  Storage Class{' '}
                                                  <span className="text-[var(--color-state-danger)]">
                                                    *
                                                  </span>
                                                </span>
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
                                              </VStack>
                                              <VStack gap={3}>
                                                <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                                  Capacity{' '}
                                                  <span className="text-[var(--color-state-danger)]">
                                                    *
                                                  </span>
                                                </span>
                                                <NumberInput
                                                  placeholder=""
                                                  value={
                                                    (volume as CreatePVCVolume).capacity
                                                      ? parseInt(
                                                          (volume as CreatePVCVolume).capacity
                                                        )
                                                      : undefined
                                                  }
                                                  onChange={(val) =>
                                                    updateVolume(index, {
                                                      capacity: val?.toString() || '',
                                                    })
                                                  }
                                                  suffix="GiB"
                                                  fullWidth
                                                />
                                              </VStack>
                                            </div>
                                          )}

                                          {(volume as CreatePVCVolume).useExistingPV && (
                                            <VStack gap={3}>
                                              <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
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
                                            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                              Access Modes{' '}
                                              <span className="text-[var(--color-state-danger)]">
                                                *
                                              </span>
                                            </span>
                                            <VStack gap={1}>
                                              <Checkbox
                                                label="Single Node Read-Write"
                                                checked={
                                                  (volume as CreatePVCVolume).accessModes
                                                    .readWriteOnce
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
                                                label="Many Nodes Read-Only"
                                                checked={
                                                  (volume as CreatePVCVolume).accessModes
                                                    .readOnlyMany
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
                                                label="Many Nodes Read-Write"
                                                checked={
                                                  (volume as CreatePVCVolume).accessModes
                                                    .readWriteMany
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
                                        <VStack gap={2} className="w-[560px]">
                                          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                                            Volume Name{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
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
                                        <VStack gap={2}>
                                          <span className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                            Read Only
                                          </span>
                                          <Checkbox
                                            checked={(volume as CreatePVCVolume).readOnly}
                                            onChange={(e) =>
                                              updateVolume(index, { readOnly: e.target.checked })
                                            }
                                          />
                                        </VStack>
                                      </div>
                                    </>
                                  )}
                                </VStack>
                              </div>
                            ))}

                            <Select
                              options={[
                                { value: 'configmap', label: 'ConfigMap' },
                                { value: 'secret', label: 'Secret' },
                                { value: 'pvc', label: 'Persistent Volume Claim' },
                                { value: 'create-pvc', label: 'Create Persistent Volume Claim' },
                              ]}
                              value=""
                              onChange={(val) => addVolume(val)}
                              placeholder="Add Volume"
                              className="w-fit"
                            />
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Volume Claim Templates */}
                      <SectionCard>
                        <SectionCard.Header title="Volume Claim Templates" />
                        <SectionCard.Content>
                          <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={3}>
                              {volumeClaimTemplates.map((template, index) => (
                                <div
                                  key={index}
                                  className="relative bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                >
                                  <button
                                    onClick={() => removeVolumeClaimTemplate(index)}
                                    className="absolute top-3 right-3 p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                  >
                                    <IconX
                                      size={16}
                                      className="text-[var(--color-text-muted)]"
                                      stroke={1.5}
                                    />
                                  </button>
                                  <VStack gap={3}>
                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Persistent Volume Claim Name{' '}
                                        <span className="text-[var(--color-state-danger)]">*</span>
                                      </span>
                                      <Input
                                        placeholder="pvc-name"
                                        value={template.name}
                                        onChange={(e) =>
                                          updateVolumeClaimTemplate(index, { name: e.target.value })
                                        }
                                        fullWidth
                                      />
                                    </VStack>

                                    <RadioGroup
                                      value={template.useExistingPV ? 'existing' : 'new'}
                                      onChange={(val) =>
                                        updateVolumeClaimTemplate(index, {
                                          useExistingPV: val === 'existing',
                                        })
                                      }
                                    >
                                      <Radio
                                        value="new"
                                        label="Use Storage Class and create a new Persistent Volume"
                                      />
                                      <Radio
                                        value="existing"
                                        label="Use existing Persistent Volume"
                                      />
                                    </RadioGroup>

                                    {!template.useExistingPV && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <VStack gap={1}>
                                          <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                            Storage Class{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <Select
                                            options={[
                                              { value: 'standard', label: 'standard' },
                                              { value: 'fast', label: 'fast' },
                                            ]}
                                            value={template.storageClass}
                                            onChange={(val) =>
                                              updateVolumeClaimTemplate(index, {
                                                storageClass: val,
                                              })
                                            }
                                            placeholder="Select Storage Class"
                                            fullWidth
                                          />
                                        </VStack>
                                        <VStack gap={1}>
                                          <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                            Capacity{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <NumberInput
                                            placeholder="10"
                                            value={
                                              template.capacity
                                                ? parseInt(template.capacity)
                                                : undefined
                                            }
                                            onChange={(val) =>
                                              updateVolumeClaimTemplate(index, {
                                                capacity: val?.toString() || '',
                                              })
                                            }
                                            suffix="Gi"
                                            fullWidth
                                          />
                                        </VStack>
                                      </div>
                                    )}

                                    {template.useExistingPV && (
                                      <VStack gap={1}>
                                        <span className="text-[11px] font-medium text-[var(--color-text-default)]">
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
                                          value={template.persistentVolume}
                                          onChange={(val) =>
                                            updateVolumeClaimTemplate(index, {
                                              persistentVolume: val,
                                            })
                                          }
                                          placeholder="Select Persistent Volume"
                                          fullWidth
                                        />
                                      </VStack>
                                    )}

                                    <VStack gap={1}>
                                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                                        Access Modes{' '}
                                        <span className="text-[var(--color-state-danger)]">*</span>
                                      </span>
                                      <VStack gap={1}>
                                        <Checkbox
                                          label="ReadWriteOnce"
                                          checked={template.accessModes.readWriteOnce}
                                          onChange={(e) =>
                                            updateVolumeClaimTemplate(index, {
                                              accessModes: {
                                                ...template.accessModes,
                                                readWriteOnce: e.target.checked,
                                              },
                                            })
                                          }
                                        />
                                        <Checkbox
                                          label="ReadOnlyMany"
                                          checked={template.accessModes.readOnlyMany}
                                          onChange={(e) =>
                                            updateVolumeClaimTemplate(index, {
                                              accessModes: {
                                                ...template.accessModes,
                                                readOnlyMany: e.target.checked,
                                              },
                                            })
                                          }
                                        />
                                        <Checkbox
                                          label="ReadWriteMany"
                                          checked={template.accessModes.readWriteMany}
                                          onChange={(e) =>
                                            updateVolumeClaimTemplate(index, {
                                              accessModes: {
                                                ...template.accessModes,
                                                readWriteMany: e.target.checked,
                                              },
                                            })
                                          }
                                        />
                                      </VStack>
                                    </VStack>
                                  </VStack>
                                </div>
                              ))}

                              <div className="w-fit">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                  onClick={addVolumeClaimTemplate}
                                >
                                  Add Volume Claim Template
                                </Button>
                              </div>
                            </VStack>
                          </div>
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
                            <SectionCard.Header title="General" />
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
                            <SectionCard.Header title="Ports" />
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
                            <SectionCard.Header title="Environment Variables" />
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
                            <SectionCard.Header title="Resources" />
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
                            <SectionCard.Header title="Health Checks" />
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
                            <SectionCard.Header title="Volume Mounts" />
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
                            <SectionCard.Header title="Security Context" />
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
