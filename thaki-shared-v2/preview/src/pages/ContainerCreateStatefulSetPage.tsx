import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input, NumberInput } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Toggle } from '@shared/components/Toggle';
import { Checkbox } from '@shared/components/Checkbox';
import { FormField } from '@shared/components/FormField';
import { Dropdown } from '@shared/components/Dropdown';
import { Select } from '../components/TdsSelectCompat';
import { RadioButton } from '@shared/components/RadioButton';
import { Title } from '@shared/components/Title';
import { Disclosure } from '@shared/components/Disclosure';
import { InlineMessage } from '@shared/components/InlineMessage';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { Pagination } from '@shared/components/Pagination';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey } from '@shared/components/FilterSearch';
import { Tooltip } from '@shared/components/Tooltip';
import { Badge } from '@shared/components/Badge';
import { Tag } from '@shared/components/Tag';
import { RadioGroup, Radio, StandaloneRadioScope } from '../components/TdsRadioCompat';
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
  IconHelpCircle,
  IconInfoCircle,
  IconCheck,
  IconDots,
} from '@tabler/icons-react';
type WizardSectionState = 'pre' | 'active' | 'done' | 'writing' | 'skipped';

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
interface NamespaceData extends Record<string, unknown> {
  id: string;
  name: string;
  status: string;
  description: string;
  createdAt: string;
}

const POD_AFFINITY_NS_FILTER_KEYS: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'terminating', label: 'Terminating' },
    ],
  },
];

const POD_AFFINITY_NS_COLUMNS: TableColumn[] = [
  { key: 'status', header: 'Status', width: 120 },
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'createdAt', header: 'Created at' },
];

const MOCK_NAMESPACES: NamespaceData[] = [
  {
    id: '1',
    name: 'cattle-clusters-system',
    status: 'OK',
    description: 'description text',
    createdAt: 'Nov 10, 2025 08:15:22',
  },
  {
    id: '2',
    name: 'cattle-system',
    status: 'OK',
    description: 'description text',
    createdAt: 'Nov 10, 2025 09:28:45',
  },
  {
    id: '3',
    name: 'cattle-fleet-local-system',
    status: 'OK',
    description: 'description text',
    createdAt: 'Nov 10, 2025 10:42:11',
  },
  {
    id: '4',
    name: 'cattle-fleet-system',
    status: 'True',
    description: 'description text',
    createdAt: 'Nov 10, 2025 11:55:33',
  },
  {
    id: '5',
    name: 'cattle-provisioning-capi-system',
    status: 'True',
    description: 'description text',
    createdAt: 'Nov 10, 2025 13:08:57',
  },
  {
    id: '6',
    name: 'cert-manager',
    status: 'Raw',
    description: 'description text',
    createdAt: 'Nov 10, 2025 14:21:20',
  },
  {
    id: '7',
    name: 'default',
    status: 'Raw',
    description: 'description text',
    createdAt: 'Nov 10, 2025 15:34:44',
  },
  {
    id: '8',
    name: 'kube-node-lease',
    status: 'None',
    description: 'description text',
    createdAt: 'Nov 10, 2025 16:47:08',
  },
  {
    id: '9',
    name: 'kube-public',
    status: 'None',
    description: 'description text',
    createdAt: 'Nov 10, 2025 17:59:32',
  },
  {
    id: '10',
    name: 'kube-system',
    status: 'CreateContainerConfigError',
    description: 'description text',
    createdAt: 'Nov 10, 2025 19:12:55',
  },
  {
    id: '11',
    name: 'monitoring',
    status: 'ImagePullBackOff',
    description: 'description text',
    createdAt: 'Nov 10, 2025 20:25:18',
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

// Status icon component for summary items — delegates to DS WizardSectionStatusIcon
function StatusIcon({ status }: { status: 'complete' | 'in-progress' }) {
  return status === 'complete' ? (
    <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center">
      <IconCheck size={10} stroke={2} className="text-white" />
    </div>
  ) : (
    <div
      className="size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 animate-spin"
      style={{ borderStyle: 'dashed', animationDuration: '2s' }}
    />
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
  const isStatefulSetTab = activeTab === 'statefulset';
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
          <div className="flex flex-col gap-4">
            <h5 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
              Summary
            </h5>

            {/* Deployment Section */}
            <div className="flex flex-col gap-2">
              <SummarySectionHeader
                label="Deployment"
                status={deploymentComplete ? 'complete' : 'in-progress'}
                expanded={isStatefulSetTab}
                onToggle={() => {}}
                hasChildren
              />
              {isStatefulSetTab && (
                <div className="flex flex-col gap-0 ml-3">
                  <SummarySubItem
                    label="Basic information"
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
                </div>
              )}
            </div>

            {/* Pod Section */}
            <div className="flex flex-col gap-2">
              <SummarySectionHeader
                label="Pod"
                status={podComplete ? 'complete' : 'in-progress'}
                expanded={isPodTab}
                onToggle={() => {}}
                hasChildren
              />
              {isPodTab && (
                <div className="flex flex-col gap-0 ml-3">
                  {podSections.map((section) => (
                    <SummarySubItem key={section} label={section} status="complete" />
                  ))}
                </div>
              )}
            </div>

            {/* Container Sections */}
            {containerTabs.map((container) => (
              <div key={container.id} className="flex flex-col gap-2">
                <SummarySectionHeader
                  label={container.name}
                  status={containersComplete ? 'complete' : 'in-progress'}
                  expanded={activeContainerId === container.id}
                  onToggle={() => {}}
                  hasChildren
                />
                {activeContainerId === container.id && (
                  <div className="flex flex-col gap-0 ml-3">
                    {containerSections.map((section) => (
                      <SummarySubItem key={section} label={section} status="complete" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Button Container */}
        <div className="flex flex-row gap-2">
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
  serviceName: string;
  onServiceNameChange: (value: string) => void;
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
  serviceName,
  onServiceNameChange,
  description,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  const isV2 = true;
  return (
    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Basic information</h2>
      </div>
      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          {/* Namespace */}
          <FormField label="Namespace" required>
            <Dropdown.Select
              className="w-full"
              value={namespace}
              onChange={(value) => onNamespaceChange(value)}
              placeholder=""
            >
              {NAMESPACE_OPTIONS.map((opt) => (
                <Dropdown.Option key={String(opt.value)} value={opt.value} label={opt.label} />
              ))}
            </Dropdown.Select>
          </FormField>

          {/* Name */}
          <FormField label="Name" required error={nameError ?? undefined}>
            <Input
              placeholder="Enter a unique name"
              value={name}
              onChange={(e) => {
                onNameChange(e.target.value);
                if (nameError) onNameErrorChange(null);
              }}
              error={!!nameError}
              className="w-full"
            />
          </FormField>

          {/* Replicas */}
          <FormField
            label="Replicas"
            required
            description="Select the number of pod replicas to create."
            hint="1-100 replicas"
          >
            <div className="flex flex-row gap-3 items-center">
              <NumberInput
                value={replicas}
                onChange={onReplicasChange}
                min={1}
                max={100}
                width="xs"
              />
            </div>
          </FormField>

          {/* Service Name */}
          <FormField label="Service Name" required>
            <Select
              options={[{ value: 'headlessServicename', label: 'headlessServicename' }]}
              value={serviceName}
              onChange={(value) => onServiceNameChange(value)}
              placeholder="Select service name"
              className="w-full"
            />
          </FormField>

          {/* Description (Collapsible) */}
          <Disclosure label="Description" expanded={true}>
            <div className="pt-2">
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full"
              />
            </div>
          </Disclosure>
        </div>
      </div>
    </div>
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
    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Labels & Annotations</h2>
      </div>
      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          {/* Labels */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
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
                      onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="label value"
                      value={label.value}
                      onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                      className="w-full"
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
                  <Button variant="secondary" size="sm" onClick={onAddLabel}>
                    Add Label
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Annotations */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
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
                {annotations.map((annotation, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                  >
                    <Input
                      placeholder="annotation key"
                      value={annotation.key}
                      onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="annotation value"
                      value={annotation.value}
                      onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                      className="w-full"
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
                  <Button variant="secondary" size="sm" onClick={onAddAnnotation}>
                    Add Annotation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   ScalingPolicySection Component
   ---------------------------------------- */

interface ScalingPolicySectionProps {
  strategy: 'rolling-update' | 'on-delete';
  onStrategyChange: (value: 'rolling-update' | 'on-delete') => void;
  podManagementPolicy: 'ordered-ready' | 'parallel';
  onPodManagementPolicyChange: (value: 'ordered-ready' | 'parallel') => void;
  revisionHistoryLimit: number;
  onRevisionHistoryLimitChange: (value: number) => void;
}

function ScalingPolicySection({
  strategy,
  onStrategyChange,
  podManagementPolicy,
  onPodManagementPolicyChange,
  revisionHistoryLimit,
  onRevisionHistoryLimitChange,
}: ScalingPolicySectionProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
          Scaling and Upgrade Policy
        </h2>
      </div>
      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          {/* Strategy Selection */}
          <FormField label="Update Policy" className="mt-[var(--primitive-spacing-3)]">
            <StandaloneRadioScope>
              <Radio
                value="rolling-update"
                checked={strategy === 'rolling-update'}
                onChange={() => onStrategyChange('rolling-update')}
                label={
                  <div className="flex flex-row gap-1 items-center">
                    <span>Rolling update</span>
                    <Tooltip
                      content="Gradually replaces old pods with new ones, ensuring availability during the update."
                      direction="right"
                    >
                      <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
                    </Tooltip>
                  </div>
                }
              />
              <Radio
                value="on-delete"
                checked={strategy === 'on-delete'}
                onChange={() => onStrategyChange('on-delete')}
                label={
                  <div className="flex flex-row gap-1 items-center">
                    <span>On delete</span>
                    <Tooltip
                      content="New pods are only created when existing pods are manually deleted."
                      direction="right"
                    >
                      <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
                    </Tooltip>
                  </div>
                }
              />
            </StandaloneRadioScope>
          </FormField>

          <FormField label="Pod Management Policy" className="mt-[var(--primitive-spacing-3)]">
            <StandaloneRadioScope>
              <Radio
                value="ordered-ready"
                checked={podManagementPolicy === 'ordered-ready'}
                onChange={() => onPodManagementPolicyChange('ordered-ready')}
                label="OrderedReady"
              />
              <Radio
                value="parallel"
                checked={podManagementPolicy === 'parallel'}
                onChange={() => onPodManagementPolicyChange('parallel')}
                label="Parallel"
              />
            </StandaloneRadioScope>
          </FormField>

          <FormField
            label="Revision History Limit"
            description="The maximum number of revision histories to retain for the StatefulSet."
            hint="1-100 revisions"
          >
            <div className="flex flex-row gap-2 items-center">
              <NumberInput
                value={revisionHistoryLimit}
                onChange={onRevisionHistoryLimitChange}
                min={0}
                width="xs"
              />
              <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                Revisions
              </span>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function ContainerCreateStatefulSetPage() {
  const navigate = useNavigate();
  const isV2 = true;

  // Container tabs (for managing multiple containers)
  const [containerTabs, setContainerTabs] = useState<ContainerTab[]>([
    { id: 'container-0', name: 'Container-0' },
  ]);

  // Basic information state
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [replicas, setReplicas] = useState(1);
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Scaling & Upgrade Policy state
  const [strategy, setStrategy] = useState<'rolling-update' | 'on-delete'>('rolling-update');
  const [podManagementPolicy, setPodManagementPolicy] = useState<'ordered-ready' | 'parallel'>(
    'ordered-ready'
  );
  const [revisionHistoryLimit, setRevisionHistoryLimit] = useState(10);

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
      envVars: [
        { name: '', value: '', type: 'value' as const },
        { name: '', value: '', type: 'resource' as const },
        { name: '', value: '', type: 'configmap-key' as const },
        { name: '', value: '', type: 'secret-key' as const },
        { name: '', value: '', type: 'pod-field' as const },
        { name: '', value: '', type: 'secret' as const },
        { name: '', value: '', type: 'configmap' as const },
      ],
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
      selectedVolumes: [
        {
          volumeName: 'vol-00001',
          volumeType: 'csi',
          mounts: [{ mountPath: '', subPath: '', readOnly: false }],
        },
      ],
    },
  });

  // Pod Labels & Annotations state
  const [podLabels, setPodLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [podAnnotations, setPodAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Scaling and Upgrade Policy state
  const [terminationGracePeriod, setTerminationGracePeriod] = useState<string>('30');

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
  const [volumes, setVolumes] = useState<Volume[]>([
    {
      type: 'pvc' as const,
      volumeName: 'vol-00002',
      pvcName: 'pvc-web-data',
      readOnly: false,
    },
    { type: 'pvc' as const, volumeName: 'vol-00003', pvcName: 'pvc-logs', readOnly: false },
    {
      type: 'configmap' as const,
      volumeName: 'vol-00004',
      configMapName: 'app-config',
      optional: false,
    },
    {
      type: 'secret' as const,
      volumeName: 'vol-00005',
      secretName: 'app-secret',
      optional: false,
      defaultMode: '',
    },
  ]);
  const [volumeType, setVolumeType] = useState<string>('configmap');

  // Volume Claim Templates state
  const [volumeClaimTemplates, setVolumeClaimTemplates] = useState<VolumeClaimTemplate[]>(
    isV2
      ? [
          {
            name: '',
            useExistingPV: false,
            storageClass: '',
            capacity: '',
            persistentVolume: '',
            accessModes: { readWriteOnce: false, readOnlyMany: false, readWriteMany: false },
          },
        ]
      : []
  );

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
  // Active form tab (StatefulSet, Pod, Container-X)
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'statefulset';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const tabListRef = useRef<HTMLDivElement>(null);

  // Build inner tabs for the form
  const formTabs = [
    { id: 'statefulset', label: 'StatefulSet' },
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
        setActiveTab('statefulset');
      }
    },
    [containerTabs, activeTab]
  );

  // Sidebar width calculation
  const handleCancel = useCallback(() => {
    navigate('/container/deployments');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      setNameError('Name is required.');
      return;
    }

    console.log('Creating statefulset:', {
      namespace,
      name,
      replicas,
      serviceName,
      description,
      labels,
      annotations,
      strategy,
      podManagementPolicy,
      revisionHistoryLimit,
    });
    navigate('/container/statefulsets');
  }, [
    namespace,
    name,
    replicas,
    serviceName,
    description,
    labels,
    annotations,
    strategy,
    podManagementPolicy,
    revisionHistoryLimit,
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
        envVars: [
          { name: '', value: '', type: 'value' as const },
          { name: '', value: '', type: 'resource' as const },
          { name: '', value: '', type: 'configmap-key' as const },
          { name: '', value: '', type: 'secret-key' as const },
          { name: '', value: '', type: 'pod-field' as const },
          { name: '', value: '', type: 'secret' as const },
          { name: '', value: '', type: 'configmap' as const },
        ],
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
        selectedVolumes: [
          {
            volumeName: 'vol-00001',
            volumeType: 'csi',
            mounts: [{ mountPath: '', subPath: '', readOnly: false }],
          },
        ],
      },
    }));
    setActiveTab(newContainer.id);
    requestAnimationFrame(() => {
      const el = tabListRef.current?.querySelector('[role="tablist"]');
      el?.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    });
  }, [containerTabs, setActiveTab]);

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
    <div className="flex flex-col gap-6 pt-4 px-8 pb-60">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <Title title="Create StatefulSet" size="large" />
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Create a StatefulSet to deploy and manage stateful applications with stable network
            identities and persistent storage.
          </p>
        </div>

        {/* Form Tabs - Outside the row so sidebar aligns with content */}
        <div className="w-full border-b border-[var(--color-border-default)]">
          <div ref={tabListRef} className="flex items-start pt-3">
            <div
              role="tablist"
              className="flex min-w-0 flex-1 items-end gap-0 overflow-x-auto scrollbar-none"
            >
              {formTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`shrink-0 border-b-2 px-3 py-2 text-body-md transition-colors ${activeTab === tab.id ? 'border-[var(--color-action-primary)] text-[var(--color-text-default)]' : 'border-transparent text-[var(--color-text-muted)]'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex flex-row gap-2 items-center min-w-0">
                    <span className="truncate">{tab.label}</span>
                    {tab.closable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeContainerTab(tab.id);
                        }}
                        className="size-[var(--tabbar-close-size)] flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-muted)] shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors duration-[var(--duration-fast)]"
                      >
                        <IconX size={12} stroke={1} />
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="h-[var(--tabs-line-height-sm)] flex items-center shrink-0">
              <button
                onClick={addContainerTab}
                className="shrink-0 flex items-center justify-center size-[var(--tabbar-add-size)] mx-[var(--tabbar-add-margin)] rounded-[var(--radius-sm)] text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--tabbar-hover-bg)] hover:text-[var(--color-text-default)]"
              >
                <IconPlus size={14} stroke={1} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-row gap-6 w-full items-start">
          {/* Form Content */}
          <div className="flex flex-col gap-4 flex-1">
            {/* StatefulSet Tab */}
            {activeTab === 'statefulset' && (
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
                  serviceName={serviceName}
                  onServiceNameChange={setServiceName}
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
                  podManagementPolicy={podManagementPolicy}
                  onPodManagementPolicyChange={setPodManagementPolicy}
                  revisionHistoryLimit={revisionHistoryLimit}
                  onRevisionHistoryLimitChange={setRevisionHistoryLimit}
                />
              </>
            )}

            {/* Pod Tab */}
            {activeTab === 'pod' && (
              <>
                {/* Labels & Annotations */}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                  <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                      Labels & Annotations
                    </h2>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-6">
                      {/* Labels */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Labels
                          </span>
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the labels used to identify and categorize the resource.
                          </p>
                        </div>

                        {/* Labels container */}
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {podLabels.length > 0 && (
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
                            {podLabels.map((label, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                              >
                                <Input
                                  placeholder="label key"
                                  value={label.key}
                                  onChange={(e) => updatePodLabel(index, 'key', e.target.value)}
                                  className="w-full"
                                />
                                <Input
                                  placeholder="label value"
                                  value={label.value}
                                  onChange={(e) => updatePodLabel(index, 'value', e.target.value)}
                                  className="w-full"
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
                              <Button variant="secondary" size="sm" onClick={addPodLabel}>
                                Add Label
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Annotations */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Annotations
                          </span>
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the annotations used to provide additional metadata for the
                            resource.
                          </p>
                        </div>

                        {/* Annotations container */}
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {podAnnotations.length > 0 && (
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
                            {podAnnotations.map((annotation, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                              >
                                <Input
                                  placeholder="annotation key"
                                  value={annotation.key}
                                  onChange={(e) =>
                                    updatePodAnnotation(index, 'key', e.target.value)
                                  }
                                  className="w-full"
                                />
                                <Input
                                  placeholder="annotation value"
                                  value={annotation.value}
                                  onChange={(e) =>
                                    updatePodAnnotation(index, 'value', e.target.value)
                                  }
                                  className="w-full"
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
                              <Button variant="secondary" size="sm" onClick={addPodAnnotation}>
                                Add Annotation
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scaling and Upgrade Policy */}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                  <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                      Scaling and Upgrade Policy
                    </h2>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-6">
                      <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                        Pod Policy
                      </h6>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-col gap-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Termination Grace Period
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            The period allowed after receiving a termination request before the pod
                            is forcibly terminated.
                          </span>
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                          <NumberInput
                            width="xs"
                            value={
                              terminationGracePeriod ? parseInt(terminationGracePeriod) : undefined
                            }
                            onChange={(val) => setTerminationGracePeriod(val?.toString() || '')}
                            min={0}
                            max={600}
                            suffix="Seconds"
                          />
                        </div>
                        <span className="text-body-sm text-[var(--color-text-subtle)]">
                          0-600 seconds
                        </span>
                      </div>
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
                      {/* Network Settings */}
                      <div className="flex flex-col gap-6">
                        <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                          Network Settings
                        </h6>
                        <div className="flex flex-col gap-6 w-full">
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Network Mode
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Select the networking mode for the pod.
                              </span>
                            </div>
                            <Select
                              options={[
                                { value: 'normal', label: 'Normal' },
                                { value: 'host', label: 'Host' },
                              ]}
                              value={networkMode}
                              onChange={setNetworkMode}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                DNS Policy
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Select the DNS policy to apply to the pod.
                              </span>
                            </div>
                            <Select
                              options={[
                                { value: 'cluster-first', label: 'Cluster first' },
                                { value: 'default', label: 'Default' },
                                { value: 'none', label: 'None' },
                              ]}
                              value={dnsPolicy}
                              onChange={setDnsPolicy}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Hostname
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Specify the hostname assigned to the pod.
                              </span>
                            </div>
                            <Input
                              placeholder="e.g. web"
                              className="w-full"
                              value={hostname}
                              onChange={(e) => setHostname(e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Subdomain
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                Specify the subdomain assigned to the pod.
                              </span>
                            </div>
                            <Input
                              placeholder="e.g. web"
                              className="w-full"
                              value={subdomain}
                              onChange={(e) => setSubdomain(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Nameservers */}
                      <div className="flex flex-col gap-2">
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Nameservers
                        </span>

                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {nameservers.length > 0 && (
                              <div className="grid grid-cols-[1fr_auto] gap-1 w-full">
                                <div className="flex flex-col gap-0.5">
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    Nameserver
                                  </span>
                                  <p className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the DNS nameserver addresses used by the pod.
                                  </p>
                                </div>
                                <div className="w-5" />
                              </div>
                            )}
                            {nameservers.map((ns, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_auto] gap-1 w-full items-center"
                              >
                                <Input
                                  placeholder="e.g. 8.8.8.8"
                                  value={ns}
                                  onChange={(e) => updateNameserver(index, e.target.value)}
                                  className="w-full"
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
                              <Button variant="secondary" size="sm" onClick={addNameserver}>
                                Add Nameserver
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Search Domains */}
                      <div className="flex flex-col gap-2">
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Search Domains
                        </span>

                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {searchDomains.length > 0 && (
                              <div className="grid grid-cols-[1fr_auto] gap-1 w-full">
                                <div className="flex flex-col gap-0.5">
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    Search Domain
                                  </span>
                                  <p className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the search domains used for DNS resolution.
                                  </p>
                                </div>
                                <div className="w-5" />
                              </div>
                            )}
                            {searchDomains.map((sd, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_auto] gap-1 w-full items-center"
                              >
                                <Input
                                  placeholder="e.g. example.com"
                                  value={sd}
                                  onChange={(e) => updateSearchDomain(index, e.target.value)}
                                  className="w-full"
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
                              <Button variant="secondary" size="sm" onClick={addSearchDomain}>
                                Add Search Domain
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resolver Options */}
                      <div className="flex flex-col gap-2">
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Resolver Options
                        </span>

                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {resolverOptions.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full">
                                <div className="flex flex-col gap-0.5">
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    Name
                                  </span>
                                  <p className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the name of the DNS resolver option.
                                  </p>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    Value
                                  </span>
                                  <p className="text-body-md text-[var(--color-text-subtle)]">
                                    The value of the DNS resolver option.
                                  </p>
                                </div>
                                <div className="w-5" />
                              </div>
                            )}
                            {resolverOptions.map((opt, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center"
                              >
                                <Input
                                  placeholder="input name"
                                  value={opt.name}
                                  onChange={(e) =>
                                    updateResolverOption(index, 'name', e.target.value)
                                  }
                                  className="w-full"
                                />
                                <Input
                                  placeholder="input value"
                                  value={opt.value}
                                  onChange={(e) =>
                                    updateResolverOption(index, 'value', e.target.value)
                                  }
                                  className="w-full"
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
                              <Button variant="secondary" size="sm" onClick={addResolverOption}>
                                Add Option
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Host Aliases */}
                      <div className="flex flex-col gap-2">
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Host Aliases
                        </span>

                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {hostAliases.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full">
                                <div className="flex flex-col gap-0.5">
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    IP Address
                                  </span>
                                  <p className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the IP address used for the host alias.
                                  </p>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="block text-label-sm text-[var(--color-text-default)]">
                                    Hostname
                                  </span>
                                  <p className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the hostname mapped to the IP address.
                                  </p>
                                </div>
                                <div className="w-5" />
                              </div>
                            )}
                            {hostAliases.map((alias, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center"
                              >
                                <Input
                                  placeholder="e.g. 127.0.0.1"
                                  value={alias.ip}
                                  onChange={(e) => updateHostAlias(index, 'ip', e.target.value)}
                                  className="w-full"
                                />
                                <Input
                                  placeholder="e.g. foo.company.com"
                                  value={alias.hostname}
                                  onChange={(e) =>
                                    updateHostAlias(index, 'hostname', e.target.value)
                                  }
                                  className="w-full"
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
                              <Button variant="secondary" size="sm" onClick={addHostAlias}>
                                Add Alias
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node Scheduling */}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                  <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                      Node scheduling
                    </h2>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                      <RadioGroup value={nodeScheduling} onChange={setNodeScheduling}>
                        <Radio value="any" label="Run pods on any available node" />
                        <Radio value="specific" label="Run pods on specific node(s)" />
                        <Radio
                          value="matching"
                          label="Run pods on node(s) matching scheduling rules"
                        />
                      </RadioGroup>
                      {isV2 && (
                        <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                          <div className="flex flex-col gap-6">
                            <span className="text-label-lg text-[var(--color-text-default)] italic">
                              Specific node(s)
                            </span>
                            <div className="flex flex-col gap-1 w-full">
                              <span className="text-label-lg text-[var(--color-text-default)]">
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
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {!isV2 && nodeScheduling === 'specific' && (
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-label-lg text-[var(--color-text-default)]">
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
                            className="w-full"
                          />
                        </div>
                      )}
                      {isV2 && (
                        <div className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)] italic">
                                Matching scheduling rules
                              </span>
                              <p className="text-body-md text-[var(--color-text-subtle)] italic">
                                Define rules for scheduling pods on specific nodes based on node
                                labels.
                              </p>
                            </div>

                            <div className="flex flex-col gap-3">
                              {nodeAffinityTerms.map((term, termIndex) => (
                                <div
                                  key={termIndex}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                                >
                                  <div className="flex flex-col gap-6 w-full">
                                    <div className="flex flex-col gap-2 w-full">
                                      <div className="flex flex-col gap-1">
                                        <span className="block text-label-lg text-[var(--color-text-default)]">
                                          Priority
                                        </span>
                                        <p className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the priority value applied to node scheduling.
                                        </p>
                                      </div>
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
                                        className="w-full"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                      <span className="block text-label-lg text-[var(--color-text-default)]">
                                        Weight
                                      </span>
                                      <NumberInput
                                        min={1}
                                        max={100}
                                        step={1}
                                        value={Number(term.weight) || 1}
                                        onChange={(val) => {
                                          const newTerms = [...nodeAffinityTerms];
                                          newTerms[termIndex] = {
                                            ...newTerms[termIndex],
                                            weight: String(val),
                                          };
                                          setNodeAffinityTerms(newTerms);
                                        }}
                                        width="sm"
                                      />
                                    </div>
                                    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                      <div className="flex flex-col gap-1.5">
                                        {term.matchExpressions.length > 0 && (
                                          <div className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full">
                                            <span className="block text-label-sm text-[var(--color-text-default)]">
                                              Key
                                            </span>
                                            <span className="block text-label-sm text-[var(--color-text-default)]">
                                              Operator
                                            </span>
                                            <span className="block text-label-sm text-[var(--color-text-default)]">
                                              Value
                                            </span>
                                            <div className="w-5" />
                                          </div>
                                        )}
                                        {term.matchExpressions.map((expr, exprIndex) => (
                                          <div
                                            key={exprIndex}
                                            className="grid grid-cols-[1fr_1fr_1fr_20px] gap-1 w-full items-center"
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
                                              className="w-full"
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
                                              className="w-full"
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
                                              className="w-full"
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
                                            Add Rule
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="w-fit">
                              <Button variant="secondary" size="sm">
                                Add Node Selector
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      {!isV2 && nodeScheduling === 'matching' && (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Node Affinity Rules
                            </span>
                            <p className="text-body-md text-[var(--color-text-subtle)] italic">
                              Define rules for scheduling pods on specific nodes based on node
                              labels.
                            </p>
                          </div>

                          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                            <div className="flex flex-col gap-3">
                              {nodeAffinityTerms.map((term, termIndex) => (
                                <div
                                  key={termIndex}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                                >
                                  <div className="flex flex-col gap-6">
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
                                        className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                      >
                                        <IconX
                                          size={16}
                                          className="text-[var(--color-text-muted)]"
                                          stroke={1.5}
                                        />
                                      </button>
                                    </div>

                                    <div className="flex flex-col gap-6 w-full">
                                      <div className="flex flex-col gap-2 w-full">
                                        <div className="flex flex-col gap-1">
                                          <span className="block text-label-lg text-[var(--color-text-default)]">
                                            Priority
                                          </span>
                                          <p className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the priority value applied to node scheduling.
                                          </p>
                                        </div>
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
                                          className="w-full"
                                        />
                                      </div>
                                      {term.priority === 'preferred' && (
                                        <div className="flex flex-col gap-2 w-full">
                                          <span className="block text-label-lg text-[var(--color-text-default)]">
                                            Weight
                                          </span>
                                          <NumberInput
                                            min={1}
                                            max={100}
                                            step={1}
                                            value={Number(term.weight) || 1}
                                            onChange={(val) => {
                                              const newTerms = [...nodeAffinityTerms];
                                              newTerms[termIndex] = {
                                                ...newTerms[termIndex],
                                                weight: String(val),
                                              };
                                              setNodeAffinityTerms(newTerms);
                                            }}
                                            width="sm"
                                          />
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        Match Expressions
                                      </span>
                                      {term.matchExpressions.length > 0 && (
                                        <div className="grid grid-cols-[1fr_140px_1fr_20px] gap-1 w-full">
                                          <span className="block text-label-sm text-[var(--color-text-default)]">
                                            Key
                                          </span>
                                          <span className="block text-label-sm text-[var(--color-text-default)]">
                                            Operator
                                          </span>
                                          <span className="block text-label-sm text-[var(--color-text-default)]">
                                            Value
                                          </span>
                                          <div className="w-5" />
                                        </div>
                                      )}
                                      {term.matchExpressions.map((expr, exprIndex) => (
                                        <div
                                          key={exprIndex}
                                          className="grid grid-cols-[1fr_140px_1fr_20px] gap-1 w-full items-center"
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
                                            className="w-full"
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
                                            className="w-full"
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
                                            className="w-full"
                                          />
                                          <button
                                            onClick={() => {
                                              const newTerms = [...nodeAffinityTerms];
                                              newTerms[termIndex].matchExpressions = newTerms[
                                                termIndex
                                              ].matchExpressions.filter((_, i) => i !== exprIndex);
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
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className="w-fit">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setNodeAffinityTerms([
                                      ...nodeAffinityTerms,
                                      {
                                        priority: 'required',
                                        weight: '',
                                        matchExpressions: [{ key: '', operator: 'In', value: '' }],
                                      },
                                    ]);
                                  }}
                                >
                                  Add Rule
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="w-fit">
                            <Button variant="secondary" size="sm">
                              Add Node Selector
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pod Scheduling */}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                  <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                      Pod scheduling
                    </h2>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      {podAffinityTerms.map((term, termIndex) => (
                        <div
                          key={termIndex}
                          className="border border-[var(--color-border-default)] rounded-[6px] p-4 w-full"
                        >
                          <div className="flex flex-col gap-6">
                            {/* Type Section */}
                            <div className="flex flex-col gap-2">
                              <div className="flex items-start justify-between w-full">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Type
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Select the scheduling type to apply to the pod.
                                  </span>
                                </div>
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
                                className="w-full"
                              />
                            </div>

                            {/* Priority Section */}
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Priority
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the priority value applied to pod scheduling.
                                </span>
                              </div>
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
                                className="w-full"
                              />
                            </div>

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
                              <div className="flex flex-col gap-2">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Select namespaces
                                </span>
                                {/* Search Input */}
                                <FilterSearchInput
                                  filterKeys={POD_AFFINITY_NS_FILTER_KEYS}
                                  onFilterAdd={() => {}}
                                  selectedFilters={[]}
                                  placeholder="Search namespaces by attributes"
                                  defaultFilterKey="name"
                                  className="w-[var(--search-input-width)]"
                                />

                                <Pagination
                                  totalCount={
                                    MOCK_NAMESPACES.length > 100 ? 115 : MOCK_NAMESPACES.length
                                  }
                                  size={5}
                                  currentAt={1}
                                  onPageChange={() => {}}
                                  onSettingClick={() => {}}
                                  totalCountLabel="items"
                                  selectedCount={term.selectedNamespaces.length}
                                />

                                <SelectableTable<NamespaceData>
                                  columns={POD_AFFINITY_NS_COLUMNS}
                                  rows={MOCK_NAMESPACES.slice(0, 5)}
                                  selectionType="checkbox"
                                  selectedRows={term.selectedNamespaces}
                                  onRowSelectionChange={(ids) => {
                                    const newTerms = [...podAffinityTerms];
                                    newTerms[termIndex] = {
                                      ...newTerms[termIndex],
                                      selectedNamespaces: ids.map(String),
                                    };
                                    setPodAffinityTerms(newTerms);
                                  }}
                                  getRowId={(row) => row.id}
                                >
                                  {MOCK_NAMESPACES.slice(0, 5).map((row) => {
                                    const displayCreated =
                                      row.createdAt?.replace(/\s+\d{2}:\d{2}:\d{2}$/, '') ?? '';
                                    return (
                                      <Table.Tr key={row.id} rowData={row}>
                                        <Table.Td rowData={row} column={POD_AFFINITY_NS_COLUMNS[0]}>
                                          <Tooltip content={row.status} direction="right">
                                            <Badge theme="white" size="sm" className="max-w-[80px]">
                                              <span className="truncate">{row.status}</span>
                                            </Badge>
                                          </Tooltip>
                                        </Table.Td>
                                        <Table.Td rowData={row} column={POD_AFFINITY_NS_COLUMNS[1]}>
                                          <span
                                            className="truncate block min-w-0 font-medium text-[var(--color-action-primary)]"
                                            title={row.name}
                                          >
                                            {row.name}
                                          </span>
                                        </Table.Td>
                                        <Table.Td rowData={row} column={POD_AFFINITY_NS_COLUMNS[2]}>
                                          <span
                                            className="truncate block min-w-0"
                                            title={row.description ?? ''}
                                          >
                                            {row.description ?? ''}
                                          </span>
                                        </Table.Td>
                                        <Table.Td rowData={row} column={POD_AFFINITY_NS_COLUMNS[3]}>
                                          <span
                                            className="truncate block min-w-0 whitespace-nowrap"
                                            title={displayCreated}
                                          >
                                            {displayCreated}
                                          </span>
                                        </Table.Td>
                                      </Table.Tr>
                                    );
                                  })}
                                </SelectableTable>

                                <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-2 py-2 flex flex-wrap gap-1 min-h-[42px] items-center -mt-1">
                                  {term.selectedNamespaces.length > 0 ? (
                                    term.selectedNamespaces.map((nsId) => {
                                      const ns = MOCK_NAMESPACES.find((n) => n.id === nsId);
                                      return ns ? (
                                        <Tag
                                          key={nsId}
                                          label={ns.name}
                                          variant="multiSelect"
                                          onClose={() => {
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
                              </div>
                            )}

                            {/* Match Expressions / Rules Section */}
                            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                              <div className="flex flex-col gap-1.5">
                                {term.matchExpressions.length > 0 && (
                                  <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1 w-full">
                                    <span className="block text-label-sm text-[var(--color-text-default)]">
                                      Key
                                    </span>
                                    <span className="block text-label-sm text-[var(--color-text-default)]">
                                      Operator
                                    </span>
                                    <span className="block text-label-sm text-[var(--color-text-default)]">
                                      Value
                                    </span>
                                    <div className="w-5" />
                                  </div>
                                )}
                                {term.matchExpressions.map((expr, exprIndex) => (
                                  <div
                                    key={exprIndex}
                                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1 w-full items-center"
                                  >
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
                                      className="w-full"
                                    />
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
                                      className="w-full"
                                    />
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
                                      className="w-full"
                                    />
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
                              </div>
                            </div>

                            {/* Topology Key Section */}
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Topology Key
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Select the scheduling type to apply to the pod.
                                </span>
                              </div>
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
                                className="w-full"
                              />
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                              <span className="block text-label-lg text-[var(--color-text-default)]">
                                Weight
                              </span>
                              <NumberInput
                                min={1}
                                max={100}
                                step={1}
                                value={Number(term.weight) || 1}
                                onChange={(val) => {
                                  const newTerms = [...podAffinityTerms];
                                  newTerms[termIndex] = {
                                    ...newTerms[termIndex],
                                    weight: String(val),
                                  };
                                  setPodAffinityTerms(newTerms);
                                }}
                                width="sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="w-fit">
                        <Button
                          variant="secondary"
                          size="sm"
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
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                  <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">Resources</h2>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-6">
                      {/* Tolerations */}
                      <div className="flex flex-col gap-2">
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Tolerations
                        </span>

                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5">
                            {tolerations.length > 0 && (
                              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_20px] gap-1 w-full">
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Key
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Operator
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Value
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Effect
                                </span>
                                <span className="block text-label-sm text-[var(--color-text-default)]">
                                  Toleration Seconds
                                </span>
                                <div className="w-5" />
                              </div>
                            )}
                            {tolerations.map((toleration, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_20px] gap-1 w-full items-center"
                              >
                                <Input
                                  placeholder="Key"
                                  value={toleration.key}
                                  onChange={(e) => updateToleration(index, 'key', e.target.value)}
                                  className="w-full"
                                />
                                <Select
                                  options={[
                                    { value: 'Equal', label: 'Equal' },
                                    { value: 'Exists', label: 'Exists' },
                                  ]}
                                  value={toleration.operator}
                                  onChange={(val) => updateToleration(index, 'operator', val)}
                                  className="w-full"
                                />
                                <Input
                                  placeholder="Value"
                                  value={toleration.value}
                                  onChange={(e) => updateToleration(index, 'value', e.target.value)}
                                  className="w-full"
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
                                  className="w-full"
                                />
                                <Input
                                  placeholder=""
                                  value={toleration.tolerationSeconds}
                                  onChange={(e) =>
                                    updateToleration(index, 'tolerationSeconds', e.target.value)
                                  }
                                  className="w-full"
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
                              <Button variant="secondary" size="sm" onClick={addToleration}>
                                Add Toleration
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col gap-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Priority
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the priority value for the pod.
                          </span>
                          <Input
                            placeholder=""
                            className="w-full"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-label-lg text-[var(--color-text-default)]">
                            Priority Class Name
                          </span>
                          <span className="text-body-md text-[var(--color-text-subtle)]">
                            Specify the priority class name for the pod.
                          </span>
                          <Input
                            placeholder=""
                            className="w-full"
                            value={priorityClassName}
                            onChange={(e) => setPriorityClassName(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Context */}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                  <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                      Security context
                    </h2>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-label-lg text-[var(--color-text-default)]">
                          Pod Filesystem Group
                        </span>
                        <span className="text-body-md text-[var(--color-text-subtle)]">
                          Specify the filesystem group used by the pod.
                        </span>
                        <NumberInput
                          value={Number(podFilesystemGroup) || 0}
                          onChange={(val) => setPodFilesystemGroup(String(val))}
                          min={0}
                          width="sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                  <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">Storage</h2>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      {volumes.map((volume, index) => (
                        <div
                          key={index}
                          className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                        >
                          <div className="flex flex-col gap-6">
                            {/* Header with type title and close button */}
                            <div className="flex items-start justify-between w-full">
                              <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                                {volume.type === 'configmap' && 'ConfigMap'}
                                {volume.type === 'secret' && 'Secret'}
                                {volume.type === 'pvc' && 'Persistent Volume Claim'}
                                {volume.type === 'create-pvc' && 'Create Persistent Volume Claim'}
                              </h6>
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
                                <div className="flex flex-col gap-6 w-full">
                                  <div className="flex flex-col gap-2 w-full">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Volume Name{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <Input
                                      placeholder="Input name"
                                      value={volume.volumeName}
                                      onChange={(e) =>
                                        updateVolume(index, { volumeName: e.target.value })
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2 w-full">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      ConfigMap{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
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
                                      placeholder="Select configMap"
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <Checkbox
                                    checked={(volume as ConfigMapVolume).optional}
                                    onChange={(checked) =>
                                      updateVolume(index, { optional: checked })
                                    }
                                  />
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Optional
                                  </span>
                                </div>
                                <Disclosure label="Advanced" expanded={true}>
                                  <div className="flex flex-col gap-2 pt-6">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Default Mode
                                    </span>
                                    <Input
                                      placeholder=""
                                      value={(volume as ConfigMapVolume).defaultMode || ''}
                                      onChange={(e) =>
                                        updateVolume(index, { defaultMode: e.target.value })
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                </Disclosure>
                              </>
                            )}

                            {/* Secret content */}
                            {volume.type === 'secret' && (
                              <>
                                <div className="flex flex-col gap-6 w-full">
                                  <div className="flex flex-col gap-2 w-full">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Volume Name{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <Input
                                      placeholder="Input name"
                                      value={volume.volumeName}
                                      onChange={(e) =>
                                        updateVolume(index, { volumeName: e.target.value })
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2 w-full">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Secret{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <Select
                                      options={[
                                        { value: 'secret-1', label: 'secret-1' },
                                        { value: 'secret-2', label: 'secret-2' },
                                      ]}
                                      value={(volume as SecretVolume).secretName}
                                      onChange={(val) => updateVolume(index, { secretName: val })}
                                      placeholder="Select secret"
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <Checkbox
                                    checked={(volume as SecretVolume).optional}
                                    onChange={(checked) =>
                                      updateVolume(index, { optional: checked })
                                    }
                                  />
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Optional
                                  </span>
                                </div>
                                <Disclosure label="Advanced" expanded={true}>
                                  <div className="flex flex-col gap-2 pt-6">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Default Mode
                                    </span>
                                    <Input
                                      placeholder=""
                                      value={(volume as SecretVolume).defaultMode}
                                      onChange={(e) =>
                                        updateVolume(index, { defaultMode: e.target.value })
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                </Disclosure>
                              </>
                            )}

                            {/* PVC content */}
                            {volume.type === 'pvc' && (
                              <>
                                <div className="flex flex-col gap-6 w-full">
                                  <div className="flex flex-col gap-2 w-full">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Volume Name{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <Input
                                      placeholder="Input name"
                                      value={volume.volumeName}
                                      onChange={(e) =>
                                        updateVolume(index, { volumeName: e.target.value })
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2 w-full">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Persistent Volume Claim{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <Select
                                      options={[
                                        { value: 'pvc-1', label: 'pvc-1' },
                                        { value: 'pvc-2', label: 'pvc-2' },
                                      ]}
                                      value={(volume as PVCVolume).pvcName}
                                      onChange={(val) => updateVolume(index, { pvcName: val })}
                                      placeholder="Select PVC"
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <Checkbox
                                    checked={(volume as PVCVolume).readOnly}
                                    onChange={(checked) =>
                                      updateVolume(index, { readOnly: checked })
                                    }
                                  />
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Read Only
                                  </span>
                                </div>
                              </>
                            )}

                            {/* Create PVC content */}
                            {volume.type === 'create-pvc' && (
                              <>
                                <div className="w-full">
                                  <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-3">
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
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
                                          className="w-full"
                                        />
                                      </div>

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
                                    </div>

                                    {!(volume as CreatePVCVolume).useExistingPV && (
                                      <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-2 w-full">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
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
                                            className="w-full"
                                          />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Capacity{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </span>
                                          <NumberInput
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
                                        </div>
                                      </div>
                                    )}

                                    {(volume as CreatePVCVolume).useExistingPV && (
                                      <div className="flex flex-col gap-2">
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
                                          className="w-full"
                                        />
                                      </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        Access Modes{' '}
                                        <span className="text-[var(--color-state-danger)]">*</span>
                                      </span>
                                      <div className="flex flex-col gap-2">
                                        <Checkbox
                                          label="Single node read-write"
                                          checked={
                                            (volume as CreatePVCVolume).accessModes?.readWriteOnce
                                          }
                                          onChange={(checked) =>
                                            updateVolume(index, {
                                              accessModes: {
                                                ...(volume as CreatePVCVolume).accessModes,
                                                readWriteOnce: checked,
                                              },
                                            })
                                          }
                                        />
                                        <Checkbox
                                          label="Many nodes read-only"
                                          checked={
                                            (volume as CreatePVCVolume).accessModes?.readOnlyMany
                                          }
                                          onChange={(checked) =>
                                            updateVolume(index, {
                                              accessModes: {
                                                ...(volume as CreatePVCVolume).accessModes,
                                                readOnlyMany: checked,
                                              },
                                            })
                                          }
                                        />
                                        <Checkbox
                                          label="Many nodes read-write"
                                          checked={
                                            (volume as CreatePVCVolume).accessModes?.readWriteMany
                                          }
                                          onChange={(checked) =>
                                            updateVolume(index, {
                                              accessModes: {
                                                ...(volume as CreatePVCVolume).accessModes,
                                                readWriteMany: checked,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Volume Name{' '}
                                    <span className="text-[var(--color-state-danger)]">*</span>
                                  </span>
                                  <Input
                                    placeholder="Input name"
                                    value={volume.volumeName}
                                    onChange={(e) =>
                                      updateVolume(index, { volumeName: e.target.value })
                                    }
                                    className="w-full"
                                  />
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <Checkbox
                                    checked={(volume as CreatePVCVolume).readOnly}
                                    onChange={(checked) =>
                                      updateVolume(index, { readOnly: checked })
                                    }
                                  />
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Read Only
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
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
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Volume Claim Templates */}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                  <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                      Volume claim templates
                    </h2>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="w-full">
                      <div className="flex flex-col gap-3">
                        {volumeClaimTemplates.map((template, index) => (
                          <div
                            key={index}
                            className="relative bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                          >
                            <button
                              onClick={() => removeVolumeClaimTemplate(index)}
                              className="absolute top-3 right-3 size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                            >
                              <IconX
                                size={16}
                                className="text-[var(--color-text-muted)]"
                                stroke={1.5}
                              />
                            </button>
                            <div className="flex flex-col gap-6">
                              <div className="flex flex-col gap-2">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Persistent Volume Claim Name{' '}
                                  <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <Input
                                  placeholder="pvc-name"
                                  value={template.name}
                                  onChange={(e) =>
                                    updateVolumeClaimTemplate(index, { name: e.target.value })
                                  }
                                  className="w-full"
                                />
                              </div>

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
                                  label="Use storage class and create a new persistent volume"
                                />
                                <Radio value="existing" label="Use existing Persistent Volume" />
                              </RadioGroup>

                              {(isV2 || !template.useExistingPV) && (
                                <div className="flex flex-col gap-6">
                                  <div className="flex flex-col gap-2 w-full">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Storage Class{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
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
                                      placeholder="Select storage class"
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2 w-full">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Capacity{' '}
                                      <span className="text-[var(--color-state-danger)]">*</span>
                                    </span>
                                    <NumberInput
                                      value={
                                        template.capacity ? parseInt(template.capacity) : undefined
                                      }
                                      onChange={(val) =>
                                        updateVolumeClaimTemplate(index, {
                                          capacity: val?.toString() || '',
                                        })
                                      }
                                      suffix="GiB"
                                      width="sm"
                                    />
                                  </div>
                                </div>
                              )}

                              {(isV2 || template.useExistingPV) && (
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Persistent Volume{' '}
                                    <span className="text-[var(--color-state-danger)]">*</span>
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
                                    placeholder="Select persistent volume"
                                    className="w-full"
                                  />
                                </div>
                              )}

                              <div className="flex flex-col gap-2">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Access Modes{' '}
                                  <span className="text-[var(--color-state-danger)]">*</span>
                                </span>
                                <div className="flex flex-col gap-2">
                                  <Checkbox
                                    label="Single node read-write"
                                    checked={template.accessModes?.readWriteOnce}
                                    onChange={(checked) =>
                                      updateVolumeClaimTemplate(index, {
                                        accessModes: {
                                          ...template.accessModes,
                                          readWriteOnce: checked,
                                        },
                                      })
                                    }
                                  />
                                  <Checkbox
                                    label="Many nodes read-only"
                                    checked={template.accessModes?.readOnlyMany}
                                    onChange={(checked) =>
                                      updateVolumeClaimTemplate(index, {
                                        accessModes: {
                                          ...template.accessModes,
                                          readOnlyMany: checked,
                                        },
                                      })
                                    }
                                  />
                                  <Checkbox
                                    label="Many nodes read-write"
                                    checked={template.accessModes?.readWriteMany}
                                    onChange={(checked) =>
                                      updateVolumeClaimTemplate(index, {
                                        accessModes: {
                                          ...template.accessModes,
                                          readWriteMany: checked,
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="w-fit">
                          <Button variant="secondary" size="sm" onClick={addVolumeClaimTemplate}>
                            Add Volume Claim Template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      <div className="flex flex-col gap-6">
                        <span className="text-label-lg text-[var(--color-text-default)] italic">
                          {label}
                        </span>
                        {showRequestPath ? (
                          <>
                            <div className="flex gap-6 w-full">
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Check Port
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the port used to send health check requests.
                                  </span>
                                </div>
                                <NumberInput
                                  value={parseInt(probe?.httpGet?.port || '') || undefined}
                                  onChange={(val) =>
                                    updateProbe(probeKey, {
                                      httpGet: { ...probe?.httpGet, port: String(val) },
                                    })
                                  }
                                  min={1}
                                  max={65535}
                                  size="sm"
                                  width="xs"
                                />
                                <span className="text-body-sm text-[var(--color-text-subtle)]">
                                  1-65535
                                </span>
                              </div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Request Path
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the request path used for HTTP health checks.
                                  </span>
                                </div>
                                <Input
                                  placeholder="e.g./healthz"
                                  className="w-full"
                                  value={probe?.httpGet?.path || ''}
                                  onChange={(e) =>
                                    updateProbe(probeKey, {
                                      httpGet: { ...probe?.httpGet, path: e.target.value },
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                            <div className="flex gap-6 w-full">
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Check Interval
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the interval between health check requests.
                                  </span>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <NumberInput
                                    value={parseInt(probe?.periodSeconds || '10') || 10}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { periodSeconds: String(val) })
                                    }
                                    min={1}
                                    size="sm"
                                    width="xs"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Initial Delay
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the delay before initiating the first health check.
                                  </span>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <NumberInput
                                    value={parseInt(probe?.initialDelaySeconds || '0') || 0}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { initialDelaySeconds: String(val) })
                                    }
                                    min={0}
                                    size="sm"
                                    width="xs"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-6 w-full">
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Timeout
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the maximum time to wait for a health check response.
                                  </span>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <NumberInput
                                    value={parseInt(probe?.timeoutSeconds || '1') || 1}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { timeoutSeconds: String(val) })
                                    }
                                    min={1}
                                    size="sm"
                                    width="xs"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Success Threshold
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the minimum number of consecutive successful checks to
                                    consider the status healthy.
                                  </span>
                                </div>
                                <NumberInput
                                  value={parseInt(probe?.successThreshold || '1') || 1}
                                  onChange={(val) =>
                                    updateProbe(probeKey, { successThreshold: String(val) })
                                  }
                                  min={1}
                                  size="sm"
                                  width="xs"
                                />
                              </div>
                            </div>
                            <div className="flex gap-6 w-full">
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Failure Threshold
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the minimum number of consecutive failed checks to
                                    consider the status unhealthy.
                                  </span>
                                </div>
                                <NumberInput
                                  value={parseInt(probe?.failureThreshold || '3') || 3}
                                  onChange={(val) =>
                                    updateProbe(probeKey, { failureThreshold: String(val) })
                                  }
                                  min={1}
                                  size="sm"
                                  width="xs"
                                />
                              </div>
                              <div className="flex-1" />
                            </div>
                            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                          </>
                        ) : (
                          <>
                            {type !== 'exec' ? (
                              <div className="flex gap-6 w-full">
                                <div className="flex flex-col gap-2 flex-1">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-label-lg text-[var(--color-text-default)]">
                                      Check Port
                                    </span>
                                    <span className="text-body-md text-[var(--color-text-subtle)]">
                                      Specify the port used to send health check requests.
                                    </span>
                                  </div>
                                  <NumberInput
                                    value={parseInt(probe?.tcpSocket?.port || '') || undefined}
                                    onChange={(val) =>
                                      updateProbe(probeKey, {
                                        tcpSocket: { ...probe?.tcpSocket, port: String(val) },
                                      })
                                    }
                                    min={1}
                                    max={65535}
                                    size="sm"
                                    width="xs"
                                  />
                                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                                    1-65535
                                  </span>
                                </div>
                                <div className="flex-1" />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Command to run
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the command to execute when the container starts.
                                  </span>
                                </div>
                                <Input
                                  placeholder="e.g. cat /tmp/health"
                                  className="w-full"
                                  value={probe?.exec?.command || ''}
                                  onChange={(e) =>
                                    updateProbe(probeKey, {
                                      exec: { ...probe?.exec, command: e.target.value },
                                    })
                                  }
                                />
                              </div>
                            )}
                            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                            <div className="flex gap-6 w-full">
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Check Interval
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the interval between health check requests.
                                  </span>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <NumberInput
                                    value={parseInt(probe?.periodSeconds || '10') || 10}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { periodSeconds: String(val) })
                                    }
                                    min={1}
                                    size="sm"
                                    width="xs"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Initial Delay
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the delay before initiating the first health check.
                                  </span>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <NumberInput
                                    value={parseInt(probe?.initialDelaySeconds || '0') || 0}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { initialDelaySeconds: String(val) })
                                    }
                                    min={0}
                                    size="sm"
                                    width="xs"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-6 w-full">
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Timeout
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the maximum time to wait for a health check response.
                                  </span>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <NumberInput
                                    value={parseInt(probe?.timeoutSeconds || '1') || 1}
                                    onChange={(val) =>
                                      updateProbe(probeKey, { timeoutSeconds: String(val) })
                                    }
                                    min={1}
                                    size="sm"
                                    width="xs"
                                  />
                                  <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                    Seconds
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Success Threshold
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the minimum number of consecutive successful checks to
                                    consider the status healthy.
                                  </span>
                                </div>
                                <NumberInput
                                  value={parseInt(probe?.successThreshold || '1') || 1}
                                  onChange={(val) =>
                                    updateProbe(probeKey, { successThreshold: String(val) })
                                  }
                                  min={1}
                                  size="sm"
                                  width="xs"
                                />
                              </div>
                            </div>
                            <div className="flex gap-6 w-full">
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex flex-col gap-1">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    Failure Threshold
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    Specify the minimum number of consecutive failed checks to
                                    consider the status unhealthy.
                                  </span>
                                </div>
                                <NumberInput
                                  value={parseInt(probe?.failureThreshold || '3') || 3}
                                  onChange={(val) =>
                                    updateProbe(probeKey, { failureThreshold: String(val) })
                                  }
                                  min={1}
                                  size="sm"
                                  width="xs"
                                />
                              </div>
                              <div className="flex-1" />
                            </div>
                          </>
                        )}
                        {showHeaders && (
                          <div className="flex flex-col gap-2">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Request Headers
                            </span>
                            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                              <div className="flex flex-col gap-1.5">
                                {(probe?.httpGet?.httpHeaders || []).length > 0 && (
                                  <div className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center">
                                    <label className="text-label-sm text-[var(--color-text-default)]">
                                      Name
                                    </label>
                                    <label className="text-label-sm text-[var(--color-text-default)]">
                                      Value
                                    </label>
                                    <div className="w-5" />
                                  </div>
                                )}
                                {(probe?.httpGet?.httpHeaders || []).map(
                                  (header: { name: string; value: string }, index: number) => (
                                    <div
                                      key={index}
                                      className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center"
                                    >
                                      <Input
                                        placeholder="e.g. X-Custom-Header"
                                        className="w-full"
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
                                        className="w-full"
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
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                };

                return (
                  <>
                    {/* 1. Basic Information Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Basic information
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-2 w-full">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Container Name
                            </span>
                            <Input
                              placeholder="Container-0"
                              className="w-full"
                              value={config.name || ''}
                              onChange={(e) =>
                                updateContainerConfig(containerId, {
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <RadioGroup
                              value={config.containerType || 'standard'}
                              onChange={(val) =>
                                updateContainerConfig(containerId, {
                                  containerType: val as 'init' | 'standard',
                                })
                              }
                            >
                              <Radio
                                value="init"
                                label={
                                  <div className="flex flex-row gap-1 items-center">
                                    <span>Init container</span>
                                    <Tooltip
                                      content="Runs before app containers start. Used for setup tasks like fetching configs or waiting for dependencies."
                                      direction="right"
                                    >
                                      <IconInfoCircle
                                        size={14}
                                        className="text-[var(--color-text-subtle)]"
                                      />
                                    </Tooltip>
                                  </div>
                                }
                              />
                              <Radio
                                value="standard"
                                label={
                                  <div className="flex flex-row gap-1 items-center">
                                    <span>Standard container</span>
                                    <Tooltip
                                      content="The main application container that runs for the lifetime of the pod."
                                      direction="right"
                                    >
                                      <IconInfoCircle
                                        size={14}
                                        className="text-[var(--color-text-subtle)]"
                                      />
                                    </Tooltip>
                                  </div>
                                }
                              />
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Image Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Image</h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Container Image{' '}
                                <span className="text-[var(--color-state-danger)]">*</span>
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                            </div>
                            <Input
                              placeholder="nginx:latest"
                              className="w-full"
                              value={config.image || ''}
                              onChange={(e) =>
                                updateContainerConfig(containerId, {
                                  image: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Pull Policy
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                            </div>
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
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Pull Secrets
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                            </div>
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
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2b. Command Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Command
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Command
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                            </div>
                            <Input
                              placeholder="e.g. /bin/sh"
                              className="w-full"
                              value={config.command || ''}
                              onChange={(e) =>
                                updateContainerConfig(containerId, {
                                  command: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Arguments
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                            </div>
                            <Input
                              placeholder="e.g. /usr/sbin/httpd -f httpd.conf"
                              className="w-full"
                              value={config.args || ''}
                              onChange={(e) =>
                                updateContainerConfig(containerId, {
                                  args: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                WorkingDir
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                            </div>
                            <Input
                              placeholder="e.g. /myapp"
                              className="w-full"
                              value={config.workingDir || ''}
                              onChange={(e) =>
                                updateContainerConfig(containerId, {
                                  workingDir: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Stdin
                              </span>
                              <span className="text-body-md text-[var(--color-text-subtle)]">
                                The period allowed after receiving a termination request before the
                                pod is forcibly terminated.
                              </span>
                            </div>
                            <Select
                              options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                              ]}
                              value="no"
                              onChange={() => {}}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Environment Variables Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Environment variables
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                          <div className="flex flex-col gap-1.5 w-full">
                            {(config.envVars || []).map((envVar, index) => {
                              const hasFourCols =
                                envVar.type === 'resource' ||
                                envVar.type === 'configmap-key' ||
                                envVar.type === 'secret-key';
                              const gridCols = hasFourCols
                                ? 'grid-cols-[1fr_1fr_1fr_1fr_20px]'
                                : 'grid-cols-[1fr_1fr_1fr_20px]';
                              const valueColumnLabel: Record<string, string> = {
                                value: 'Value',
                                resource: 'Container Name',
                                'configmap-key': 'ConfigMap',
                                'secret-key': 'Secret',
                                'pod-field': 'Key',
                                secret: 'Secret',
                                configmap: 'ConfigMap',
                              };
                              const fourthColumnLabel: Record<string, string> = {
                                resource: 'Key',
                                'configmap-key': 'Key',
                                'secret-key': 'Key',
                              };
                              return (
                                <div
                                  key={index}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 w-full"
                                >
                                  <div className="flex flex-col gap-1">
                                    <div className={`grid ${gridCols} gap-2 w-full items-center`}>
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        Type
                                      </span>
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        {envVar.type === 'secret' || envVar.type === 'configmap'
                                          ? 'Prefix'
                                          : 'Variable Name'}
                                      </span>
                                      <span className="block text-label-sm text-[var(--color-text-default)]">
                                        {valueColumnLabel[envVar.type || 'value'] || 'Value'}
                                      </span>
                                      {hasFourCols && (
                                        <span className="block text-label-sm text-[var(--color-text-default)]">
                                          {fourthColumnLabel[envVar.type] || ''}
                                        </span>
                                      )}
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
                                    <div className={`grid ${gridCols} gap-2 w-full items-center`}>
                                      <Select
                                        options={[
                                          { value: 'value', label: 'Key/Value Pair' },
                                          { value: 'resource', label: 'Resource' },
                                          { value: 'configmap-key', label: 'ConfigMap Key' },
                                          { value: 'secret-key', label: 'Secret Key' },
                                          { value: 'pod-field', label: 'Pod Field' },
                                          { value: 'secret', label: 'Secret' },
                                          { value: 'configmap', label: 'ConfigMap' },
                                        ]}
                                        value={envVar.type || 'value'}
                                        onChange={(val) => {
                                          const newEnvVars = [...(config.envVars || [])];
                                          newEnvVars[index] = {
                                            ...newEnvVars[index],
                                            type: val as
                                              | 'value'
                                              | 'resource'
                                              | 'configmap-key'
                                              | 'secret-key'
                                              | 'pod-field'
                                              | 'secret'
                                              | 'configmap',
                                          };
                                          updateContainerConfig(containerId, {
                                            envVars: newEnvVars,
                                          });
                                        }}
                                        className="w-full"
                                      />
                                      <Input
                                        placeholder="input variable name"
                                        className="w-full"
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
                                      <Input
                                        placeholder={
                                          envVar.type === 'resource'
                                            ? 'input container name'
                                            : envVar.type === 'configmap-key'
                                              ? 'select configmap'
                                              : envVar.type === 'secret-key'
                                                ? 'select secret'
                                                : 'input value'
                                        }
                                        className="w-full"
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
                                      {envVar.type === 'resource' && (
                                        <Select
                                          options={[
                                            { value: 'limits.cpu', label: 'limits.cpu' },
                                            { value: 'limits.memory', label: 'limits.memory' },
                                            { value: 'requests.cpu', label: 'requests.cpu' },
                                            { value: 'requests.memory', label: 'requests.memory' },
                                          ]}
                                          value={envVar.configMapName || ''}
                                          onChange={(val) => {
                                            const newEnvVars = [...(config.envVars || [])];
                                            newEnvVars[index] = {
                                              ...newEnvVars[index],
                                              configMapName: val,
                                            };
                                            updateContainerConfig(containerId, {
                                              envVars: newEnvVars,
                                            });
                                          }}
                                          placeholder="Select resource"
                                          className="w-full"
                                        />
                                      )}
                                      {envVar.type === 'configmap-key' && (
                                        <Input
                                          placeholder="input key"
                                          className="w-full"
                                          value={envVar.configMapKey || ''}
                                          onChange={(e) => {
                                            const newEnvVars = [...(config.envVars || [])];
                                            newEnvVars[index] = {
                                              ...newEnvVars[index],
                                              configMapKey: e.target.value,
                                            };
                                            updateContainerConfig(containerId, {
                                              envVars: newEnvVars,
                                            });
                                          }}
                                        />
                                      )}
                                      {envVar.type === 'secret-key' && (
                                        <Input
                                          placeholder="input key"
                                          className="w-full"
                                          value={envVar.secretKey || ''}
                                          onChange={(e) => {
                                            const newEnvVars = [...(config.envVars || [])];
                                            newEnvVars[index] = {
                                              ...newEnvVars[index],
                                              secretKey: e.target.value,
                                            };
                                            updateContainerConfig(containerId, {
                                              envVars: newEnvVars,
                                            });
                                          }}
                                        />
                                      )}
                                      <div className="w-5" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div className="w-fit">
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
                                Add Variable
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Service Account Name Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Service account name
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Service Account Name
                            </span>
                            <span className="text-body-md text-[var(--color-text-subtle)]">
                              The period allowed after receiving a termination request before the
                              pod is forcibly terminated.
                            </span>
                          </div>
                          <Input
                            placeholder="default"
                            className="w-full"
                            value={config.serviceAccountName || ''}
                            onChange={(e) =>
                              updateContainerConfig(containerId, {
                                serviceAccountName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* 7. Lifecycle Hooks Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Lifecycle hooks
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Post Start */}
                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
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
                            </div>

                            {(isV2 || config.lifecycleHooks?.postStart?.type === 'exec') && (
                              <div className="flex flex-col gap-2">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Execute Command
                                </span>
                                <Input
                                  placeholder='e.g. ["/bin/sh", "-c", "echo Hello"]'
                                  className="w-full"
                                  value={config.lifecycleHooks?.postStart?.command || ''}
                                  onChange={(e) =>
                                    updateLifecycleHook('postStart', {
                                      command: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            )}

                            {(isV2 || config.lifecycleHooks?.postStart?.type === 'httpGet') && (
                              <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    HTTP Get
                                  </span>
                                  <div className="border border-[var(--color-border-default)] rounded-[6px] px-4 pt-3 pb-4 w-full">
                                    <div className="flex flex-col gap-3">
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Host IP
                                        </span>
                                        <Input
                                          placeholder="e.g. 172.17.0.2"
                                          className="w-full"
                                          value={
                                            config.lifecycleHooks?.postStart?.httpGet?.host || ''
                                          }
                                          onChange={(e) =>
                                            updateLifecycleHook('postStart', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.postStart?.httpGet,
                                                host: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Path
                                        </span>
                                        <Input
                                          placeholder="e.g. /health"
                                          className="w-full"
                                          value={
                                            config.lifecycleHooks?.postStart?.httpGet?.path || ''
                                          }
                                          onChange={(e) =>
                                            updateLifecycleHook('postStart', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.postStart?.httpGet,
                                                path: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Port{' '}
                                          <span className="text-[var(--color-state-danger)]">
                                            *
                                          </span>
                                        </span>
                                        <Input
                                          placeholder="e.g. 3000"
                                          className="w-full"
                                          value={
                                            config.lifecycleHooks?.postStart?.httpGet?.port || ''
                                          }
                                          onChange={(e) =>
                                            updateLifecycleHook('postStart', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.postStart?.httpGet,
                                                port: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Scheme
                                        </span>
                                        <Select
                                          options={[
                                            { value: 'HTTP', label: 'HTTP' },
                                            { value: 'HTTPS', label: 'HTTPS' },
                                          ]}
                                          value={
                                            config.lifecycleHooks?.postStart?.httpGet?.scheme ||
                                            'HTTP'
                                          }
                                          onChange={(val) =>
                                            updateLifecycleHook('postStart', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.postStart?.httpGet,
                                                scheme: val,
                                              },
                                            })
                                          }
                                          className="w-full"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    HTTP Header
                                  </span>
                                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                    <div className="flex flex-col gap-1.5">
                                      {(
                                        config.lifecycleHooks?.postStart?.httpGet?.httpHeaders || []
                                      ).length > 0 && (
                                        <div className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center">
                                          <label className="text-label-sm text-[var(--color-text-default)]">
                                            Name{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </label>
                                          <label className="text-label-sm text-[var(--color-text-default)]">
                                            Value
                                          </label>
                                          <div className="w-5" />
                                        </div>
                                      )}
                                      {(
                                        config.lifecycleHooks?.postStart?.httpGet?.httpHeaders || []
                                      ).map((header, index) => (
                                        <div
                                          key={index}
                                          className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center"
                                        >
                                          <Input
                                            placeholder="e.g. accept-ranges"
                                            className="w-full"
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
                                            className="w-full"
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
                                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Pre Stop */}
                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
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
                            </div>

                            {(isV2 || config.lifecycleHooks?.preStop?.type === 'exec') && (
                              <div className="flex flex-col gap-2">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Execute Command
                                </span>
                                <Input
                                  placeholder='e.g. ["/bin/sh", "-c", "nginx -s quit"]'
                                  className="w-full"
                                  value={config.lifecycleHooks?.preStop?.command || ''}
                                  onChange={(e) =>
                                    updateLifecycleHook('preStop', {
                                      command: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            )}

                            {(isV2 || config.lifecycleHooks?.preStop?.type === 'httpGet') && (
                              <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    HTTP Get
                                  </span>
                                  <div className="border border-[var(--color-border-default)] rounded-[6px] px-4 pt-3 pb-4 w-full">
                                    <div className="flex flex-col gap-3">
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Host IP
                                        </span>
                                        <Input
                                          placeholder="e.g. 172.17.0.2"
                                          className="w-full"
                                          value={
                                            config.lifecycleHooks?.preStop?.httpGet?.host || ''
                                          }
                                          onChange={(e) =>
                                            updateLifecycleHook('preStop', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.preStop?.httpGet,
                                                host: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Path
                                        </span>
                                        <Input
                                          placeholder="e.g. /shutdown"
                                          className="w-full"
                                          value={
                                            config.lifecycleHooks?.preStop?.httpGet?.path || ''
                                          }
                                          onChange={(e) =>
                                            updateLifecycleHook('preStop', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.preStop?.httpGet,
                                                path: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Port{' '}
                                          <span className="text-[var(--color-state-danger)]">
                                            *
                                          </span>
                                        </span>
                                        <Input
                                          placeholder="e.g. 3000"
                                          className="w-full"
                                          value={
                                            config.lifecycleHooks?.preStop?.httpGet?.port || ''
                                          }
                                          onChange={(e) =>
                                            updateLifecycleHook('preStop', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.preStop?.httpGet,
                                                port: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Scheme
                                        </span>
                                        <Select
                                          options={[
                                            { value: 'HTTP', label: 'HTTP' },
                                            { value: 'HTTPS', label: 'HTTPS' },
                                          ]}
                                          value={
                                            config.lifecycleHooks?.preStop?.httpGet?.scheme ||
                                            'HTTP'
                                          }
                                          onChange={(val) =>
                                            updateLifecycleHook('preStop', {
                                              httpGet: {
                                                ...config.lifecycleHooks?.preStop?.httpGet,
                                                scheme: val,
                                              },
                                            })
                                          }
                                          className="w-full"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <span className="text-label-lg text-[var(--color-text-default)]">
                                    HTTP Header
                                  </span>
                                  <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                    <div className="flex flex-col gap-1.5">
                                      {(config.lifecycleHooks?.preStop?.httpGet?.httpHeaders || [])
                                        .length > 0 && (
                                        <div className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center">
                                          <label className="text-label-sm text-[var(--color-text-default)]">
                                            Name{' '}
                                            <span className="text-[var(--color-state-danger)]">
                                              *
                                            </span>
                                          </label>
                                          <label className="text-label-sm text-[var(--color-text-default)]">
                                            Value
                                          </label>
                                          <div className="w-5" />
                                        </div>
                                      )}
                                      {(
                                        config.lifecycleHooks?.preStop?.httpGet?.httpHeaders || []
                                      ).map((header, index) => (
                                        <div
                                          key={index}
                                          className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center"
                                        >
                                          <Input
                                            placeholder="e.g. accept-ranges"
                                            className="w-full"
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
                                            className="w-full"
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
                                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 8. Health Check Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Health check
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                          {/* Readiness Check */}
                          <div className="flex flex-col gap-3">
                            <span className="text-heading-h6 text-[var(--color-text-default)]">
                              Readiness Check
                            </span>
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Type
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Select the probe type used for the health check.
                                </span>
                              </div>
                              <Select
                                options={[
                                  { value: 'none', label: 'None' },
                                  {
                                    value: 'httpGet',
                                    label: 'HTTP request returns a successful status (200-399)',
                                  },
                                  {
                                    value: 'httpsGet',
                                    label: 'HTTPS request returns a successful status',
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
                                className="w-full"
                              />
                            </div>
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
                                <div className="flex flex-col gap-6">
                                  {/* Row 1: Check Port/Command + Check Interval */}
                                  <div className="flex gap-6 w-full">
                                    {(config.readinessProbe?.type === 'httpGet' ||
                                      config.readinessProbe?.type === 'tcpSocket') && (
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Check Port
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the port used to send health check requests.
                                          </span>
                                        </div>
                                        <NumberInput
                                          value={
                                            parseInt(
                                              config.readinessProbe?.type === 'httpGet'
                                                ? config.readinessProbe?.httpGet?.port || ''
                                                : config.readinessProbe?.tcpSocket?.port || ''
                                            ) || undefined
                                          }
                                          onChange={(val) =>
                                            config.readinessProbe?.type === 'httpGet'
                                              ? updateProbe('readinessProbe', {
                                                  httpGet: {
                                                    ...config.readinessProbe?.httpGet,
                                                    port: String(val),
                                                  },
                                                })
                                              : updateProbe('readinessProbe', {
                                                  tcpSocket: {
                                                    ...config.readinessProbe?.tcpSocket,
                                                    port: String(val),
                                                  },
                                                })
                                          }
                                          min={1}
                                          max={65535}
                                          size="sm"
                                          width="xs"
                                        />
                                        <span className="text-body-sm text-[var(--color-text-subtle)]">
                                          1-65535
                                        </span>
                                      </div>
                                    )}
                                    {config.readinessProbe?.type === 'exec' && (
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Command to run
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the command to execute when the container
                                            starts.
                                          </span>
                                        </div>
                                        <Input
                                          placeholder="e.g. cat /tmp/health"
                                          className="w-full"
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
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-2 flex-1">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Check Interval
                                        </span>
                                        <span className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the interval between health check requests.
                                        </span>
                                      </div>
                                      <div className="flex flex-row gap-2 items-center">
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
                                          width="xs"
                                        />
                                        <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                          Seconds
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Row 2: Request Path (httpGet only) + Initial Delay */}
                                  <div className="flex gap-6 w-full">
                                    {config.readinessProbe?.type === 'httpGet' && (
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Request Path
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the request path used for HTTP health checks.
                                          </span>
                                        </div>
                                        <Input
                                          placeholder="e.g./healthz"
                                          className="w-full"
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
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-2 flex-1">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Initial Delay
                                        </span>
                                        <span className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the delay before initiating the first health
                                          check.
                                        </span>
                                      </div>
                                      <div className="flex flex-row gap-2 items-center">
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
                                          width="xs"
                                        />
                                        <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                          Seconds
                                        </span>
                                      </div>
                                    </div>
                                    {config.readinessProbe?.type !== 'httpGet' && (
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Timeout
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the maximum time to wait for a health check
                                            response.
                                          </span>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
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
                                            width="xs"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {/* Row 3: Timeout + Success Threshold (httpGet) or Success + Failure (others) */}
                                  <div className="flex gap-6 w-full">
                                    {config.readinessProbe?.type === 'httpGet' && (
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Timeout
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the maximum time to wait for a health check
                                            response.
                                          </span>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
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
                                            width="xs"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-2 flex-1">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Success Threshold
                                        </span>
                                        <span className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the minimum number of consecutive successful
                                          checks to consider the status healthy.
                                        </span>
                                      </div>
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
                                        width="xs"
                                      />
                                    </div>
                                    {config.readinessProbe?.type !== 'httpGet' && (
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Failure Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive failed checks
                                            to consider the status unhealthy.
                                          </span>
                                        </div>
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
                                          width="xs"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  {/* Row 4: Failure Threshold (httpGet only) */}
                                  {config.readinessProbe?.type === 'httpGet' && (
                                    <div className="flex flex-col gap-2">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-label-lg text-[var(--color-text-default)]">
                                          Failure Threshold
                                        </span>
                                        <span className="text-body-md text-[var(--color-text-subtle)]">
                                          Specify the minimum number of consecutive failed checks to
                                          consider the status unhealthy.
                                        </span>
                                      </div>
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
                                        width="xs"
                                      />
                                    </div>
                                  )}
                                  {config.readinessProbe?.type === 'httpGet' && (
                                    <div className="flex flex-col gap-2">
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        Request Headers
                                      </span>
                                      <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                                        <div className="flex flex-col gap-1.5">
                                          {(config.readinessProbe?.httpGet?.httpHeaders || [])
                                            .length > 0 && (
                                            <div className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center">
                                              <label className="text-label-sm text-[var(--color-text-default)]">
                                                Name
                                              </label>
                                              <label className="text-label-sm text-[var(--color-text-default)]">
                                                Value
                                              </label>
                                              <div className="w-5" />
                                            </div>
                                          )}
                                          {(config.readinessProbe?.httpGet?.httpHeaders || []).map(
                                            (header, index) => (
                                              <div
                                                key={index}
                                                className="grid grid-cols-[1fr_1fr_auto] gap-1 w-full items-center"
                                              >
                                                <Input
                                                  placeholder="Input name"
                                                  className="w-full"
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
                                                  className="w-full"
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
                                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
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
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Liveness Check */}
                          <div className="flex flex-col gap-3">
                            <span className="text-heading-h6 text-[var(--color-text-default)]">
                              Liveness Check
                            </span>
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Type
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Select the probe type used for the health check.
                                </span>
                              </div>
                              <Select
                                options={[
                                  { value: 'none', label: 'None' },
                                  {
                                    value: 'httpGet',
                                    label: 'HTTP request returns a successful status (200-399)',
                                  },
                                  {
                                    value: 'httpsGet',
                                    label: 'HTTPS request returns a successful status',
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
                                className="w-full"
                              />
                            </div>
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
                                  'httpGet',
                                  'HTTPS request returns a successful status',
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
                                  <div className="flex flex-col gap-6">
                                    {/* Row 1: Check Port/Command + Check Interval */}
                                    <div className="flex gap-6 w-full">
                                      {(config.livenessProbe?.type === 'httpGet' ||
                                        config.livenessProbe?.type === 'tcpSocket') && (
                                        <div className="flex flex-col gap-2 flex-1">
                                          <div className="flex flex-col gap-1">
                                            <span className="text-label-lg text-[var(--color-text-default)]">
                                              Check Port
                                            </span>
                                            <span className="text-body-md text-[var(--color-text-subtle)]">
                                              Specify the port used to send health check requests.
                                            </span>
                                          </div>
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.livenessProbe?.type === 'httpGet'
                                                  ? config.livenessProbe?.httpGet?.port || ''
                                                  : config.livenessProbe?.tcpSocket?.port || ''
                                              ) || undefined
                                            }
                                            onChange={(val) =>
                                              config.livenessProbe?.type === 'httpGet'
                                                ? updateProbe('livenessProbe', {
                                                    httpGet: {
                                                      ...config.livenessProbe?.httpGet,
                                                      port: String(val),
                                                    },
                                                  })
                                                : updateProbe('livenessProbe', {
                                                    tcpSocket: {
                                                      ...config.livenessProbe?.tcpSocket,
                                                      port: String(val),
                                                    },
                                                  })
                                            }
                                            min={1}
                                            max={65535}
                                            size="sm"
                                            width="xs"
                                          />
                                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                                            1-65535
                                          </span>
                                        </div>
                                      )}
                                      {config.livenessProbe?.type === 'exec' && (
                                        <div className="flex flex-col gap-2 flex-1">
                                          <div className="flex flex-col gap-1">
                                            <span className="text-label-lg text-[var(--color-text-default)]">
                                              Command to run
                                            </span>
                                            <span className="text-body-md text-[var(--color-text-subtle)]">
                                              Specify the command to execute when the container
                                              starts.
                                            </span>
                                          </div>
                                          <Input
                                            placeholder="e.g. cat /tmp/health"
                                            className="w-full"
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
                                        </div>
                                      )}
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Check Interval
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the interval between health check requests.
                                          </span>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
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
                                            width="xs"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Row 2: Initial Delay + Timeout */}
                                    <div className="flex gap-6 w-full">
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Initial Delay
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the delay before initiating the first health
                                            check.
                                          </span>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
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
                                            width="xs"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Timeout
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the maximum time to wait for a health check
                                            response.
                                          </span>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
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
                                            width="xs"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Row 3: Success Threshold + Failure Threshold */}
                                    <div className="flex gap-6 w-full">
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Success Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive successful
                                            checks to consider the status healthy.
                                          </span>
                                        </div>
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
                                          width="xs"
                                        />
                                      </div>
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Failure Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive failed checks
                                            to consider the status unhealthy.
                                          </span>
                                        </div>
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
                                          width="xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* Startup Check */}
                          <div className="flex flex-col gap-3">
                            <span className="text-heading-h6 text-[var(--color-text-default)]">
                              Startup Check
                            </span>
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Type
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Select the probe type used for the health check.
                                </span>
                              </div>
                              <Select
                                options={[
                                  { value: 'none', label: 'None' },
                                  {
                                    value: 'httpGet',
                                    label: 'HTTP request returns a successful status (200-399)',
                                  },
                                  {
                                    value: 'httpsGet',
                                    label: 'HTTPS request returns a successful status',
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
                                className="w-full"
                              />
                            </div>
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
                                  'httpGet',
                                  'HTTPS request returns a successful status',
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
                                  <div className="flex flex-col gap-6">
                                    {/* Row 1: Check Port/Command + Check Interval */}
                                    <div className="flex gap-6 w-full">
                                      {(config.startupProbe?.type === 'httpGet' ||
                                        config.startupProbe?.type === 'tcpSocket') && (
                                        <div className="flex flex-col gap-2 flex-1">
                                          <div className="flex flex-col gap-1">
                                            <span className="text-label-lg text-[var(--color-text-default)]">
                                              Check Port
                                            </span>
                                            <span className="text-body-md text-[var(--color-text-subtle)]">
                                              Specify the port used to send health check requests.
                                            </span>
                                          </div>
                                          <NumberInput
                                            value={
                                              parseInt(
                                                config.startupProbe?.type === 'httpGet'
                                                  ? config.startupProbe?.httpGet?.port || ''
                                                  : config.startupProbe?.tcpSocket?.port || ''
                                              ) || undefined
                                            }
                                            onChange={(val) =>
                                              config.startupProbe?.type === 'httpGet'
                                                ? updateProbe('startupProbe', {
                                                    httpGet: {
                                                      ...config.startupProbe?.httpGet,
                                                      port: String(val),
                                                    },
                                                  })
                                                : updateProbe('startupProbe', {
                                                    tcpSocket: {
                                                      ...config.startupProbe?.tcpSocket,
                                                      port: String(val),
                                                    },
                                                  })
                                            }
                                            min={1}
                                            max={65535}
                                            size="sm"
                                            width="xs"
                                          />
                                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                                            1-65535
                                          </span>
                                        </div>
                                      )}
                                      {config.startupProbe?.type === 'exec' && (
                                        <div className="flex flex-col gap-2 flex-1">
                                          <div className="flex flex-col gap-1">
                                            <span className="text-label-lg text-[var(--color-text-default)]">
                                              Command to run
                                            </span>
                                            <span className="text-body-md text-[var(--color-text-subtle)]">
                                              Specify the command to execute when the container
                                              starts.
                                            </span>
                                          </div>
                                          <Input
                                            placeholder="e.g. cat /tmp/health"
                                            className="w-full"
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
                                        </div>
                                      )}
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Check Interval
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the interval between health check requests.
                                          </span>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
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
                                            width="xs"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Row 2: Initial Delay + Timeout */}
                                    <div className="flex gap-6 w-full">
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Initial Delay
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the delay before initiating the first health
                                            check.
                                          </span>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
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
                                            width="xs"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Timeout
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the maximum time to wait for a health check
                                            response.
                                          </span>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
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
                                            width="xs"
                                          />
                                          <span className="text-body-md text-[var(--color-text-default)] whitespace-nowrap">
                                            Seconds
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Row 3: Success Threshold + Failure Threshold */}
                                    <div className="flex gap-6 w-full">
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Success Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive successful
                                            checks to consider the status healthy.
                                          </span>
                                        </div>
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
                                          width="xs"
                                        />
                                      </div>
                                      <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-label-lg text-[var(--color-text-default)]">
                                            Failure Threshold
                                          </span>
                                          <span className="text-body-md text-[var(--color-text-subtle)]">
                                            Specify the minimum number of consecutive failed checks
                                            to consider the status unhealthy.
                                          </span>
                                        </div>
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
                                          width="xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 9. Resources Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Resources
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                          {/* Row 1: CPU Reservation + CPU Limit */}
                          <div className="flex gap-6 w-full">
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  CPU Reservation
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the minimum CPU amount reserved for the container.
                                </span>
                              </div>
                              <NumberInput
                                value={config.cpuRequest ? parseInt(config.cpuRequest) : undefined}
                                onChange={(val) =>
                                  updateContainerConfig(containerId, {
                                    cpuRequest: val?.toString() || '',
                                  })
                                }
                                min={0}
                                max={4000}
                                width="sm"
                                suffix="mCPUs"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  CPU Limit
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the maximum CPU amount allowed for the container.
                                </span>
                              </div>
                              <NumberInput
                                value={config.cpuLimit ? parseInt(config.cpuLimit) : undefined}
                                onChange={(val) =>
                                  updateContainerConfig(containerId, {
                                    cpuLimit: val?.toString() || '',
                                  })
                                }
                                min={0}
                                max={4000}
                                width="sm"
                                suffix="mCPUs"
                              />
                            </div>
                          </div>
                          {/* Row 2: Memory Reservation + Memory Limit */}
                          <div className="flex gap-6 w-full">
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Memory Reservation
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the minimum memory amount reserved for the container.
                                </span>
                              </div>
                              <NumberInput
                                value={
                                  config.memoryRequest ? parseInt(config.memoryRequest) : undefined
                                }
                                onChange={(val) =>
                                  updateContainerConfig(containerId, {
                                    memoryRequest: val?.toString() || '',
                                  })
                                }
                                min={0}
                                max={8192}
                                width="sm"
                                suffix="MiB"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex flex-col gap-1">
                                <span className="text-label-lg text-[var(--color-text-default)]">
                                  Memory Limit
                                </span>
                                <span className="text-body-md text-[var(--color-text-subtle)]">
                                  Specify the maximum memory amount allowed for the container.
                                </span>
                              </div>
                              <NumberInput
                                value={
                                  config.memoryLimit ? parseInt(config.memoryLimit) : undefined
                                }
                                onChange={(val) =>
                                  updateContainerConfig(containerId, {
                                    memoryLimit: val?.toString() || '',
                                  })
                                }
                                min={0}
                                max={8192}
                                width="sm"
                                suffix="MiB"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 10. Security Context Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Security context
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                          {/* Row 1: Privileged + Privilege Escalation */}
                          <div className="flex gap-6 w-full">
                            <div className="flex flex-col gap-2 flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Privileged
                              </span>
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-2 items-center">
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
                                </div>
                                <div className="flex flex-row gap-2 items-center">
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
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Privilege Escalation
                              </span>
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-2 items-center">
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
                                </div>
                                <div className="flex flex-row gap-2 items-center">
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
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Row 2: Run as Non-Root + Read-Only Root Filesystem */}
                          <div className="flex gap-6 w-full">
                            <div className="flex flex-col gap-2 flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Run as Non-Root
                              </span>
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-2 items-center">
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
                                </div>
                                <div className="flex flex-row gap-2 items-center">
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
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <span className="text-label-lg text-[var(--color-text-default)]">
                                Read-Only Root Filesystem
                              </span>
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-2 items-center">
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
                                </div>
                                <div className="flex flex-row gap-2 items-center">
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
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Row 3: Run as User ID */}
                          <div className="flex flex-col gap-2 w-full">
                            <span className="text-label-lg text-[var(--color-text-default)]">
                              Run as User ID
                            </span>
                            <Input
                              placeholder=""
                              className="w-full"
                              value={config.runAsUser || ''}
                              onChange={(e) =>
                                updateContainerConfig(containerId, {
                                  runAsUser: e.target.value,
                                })
                              }
                            />
                          </div>
                          {/* Row 4: Add Capabilities + Drop Capabilities */}
                          <div className="flex gap-4 w-full">
                            <div className="flex flex-col gap-2 flex-1">
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
                                className="w-full"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
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
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 11. Storage Section */}
                    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">
                      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
                        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                          Storage
                        </h2>
                      </div>
                      <div className="px-4 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                          {/* Selected volumes with their mounts */}
                          {config.selectedVolumes && config.selectedVolumes.length > 0 && (
                            <div className="flex flex-col gap-3">
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
                                    className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full"
                                  >
                                    <div className="flex flex-col gap-2">
                                      <span className="text-label-lg text-[var(--color-text-default)]">
                                        {selectedVol.volumeName} (
                                        {{
                                          csi: 'CSI',
                                          pvc: 'Persistent Volume Claim',
                                          'create-pvc': 'Create persistent volume claim',
                                          configmap: 'ConfigMap',
                                          secret: 'Secret',
                                          emptyDir: 'Empty Dir',
                                          hostPath: 'Host Path',
                                        }[selectedVol.volumeType] || selectedVol.volumeType}
                                        )
                                      </span>
                                      {/* Mount rows */}
                                      {(selectedVol.mounts || []).length > 0 && (
                                        <div className="grid grid-cols-[1fr_1fr_84px_20px] gap-1 w-full">
                                          <div className="flex flex-col gap-0.5">
                                            <span className="block text-label-sm text-[var(--color-text-default)]">
                                              Mount Point{' '}
                                              <span className="text-[var(--color-state-danger)]">
                                                *
                                              </span>
                                            </span>
                                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                                              Specify the path inside the container where the volume
                                              will be mounted.
                                            </span>
                                          </div>
                                          <div className="flex flex-col gap-0.5">
                                            <span className="block text-label-sm text-[var(--color-text-default)]">
                                              Sub Path in Volume
                                            </span>
                                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                                              Specify the sub-path within the volume to use.
                                            </span>
                                          </div>
                                          <div />
                                          <div className="w-5" />
                                        </div>
                                      )}
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
                                            className="grid grid-cols-[1fr_1fr_84px_20px] gap-1 w-full items-center"
                                          >
                                            <Input
                                              placeholder=""
                                              className="w-full"
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
                                            <Input
                                              placeholder=""
                                              className="w-full"
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
                                            <div className="flex items-center whitespace-nowrap">
                                              <Checkbox
                                                label="Read Only"
                                                className="[&>label]:flex-row-reverse"
                                                checked={mount.readOnly || false}
                                                onChange={(checked) => {
                                                  const newVolumes = [
                                                    ...(config.selectedVolumes || []),
                                                  ];
                                                  newVolumes[volIndex].mounts[mountIndex] = {
                                                    ...newVolumes[volIndex].mounts[mountIndex],
                                                    readOnly: checked,
                                                  };
                                                  updateContainerConfig(containerId, {
                                                    selectedVolumes: newVolumes,
                                                  });
                                                }}
                                              />
                                            </div>
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
                                        )
                                      )}
                                      {/* Add Mount button inside volume container */}
                                      <div className="w-fit">
                                        <Button
                                          variant="secondary"
                                          size="sm"
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
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                          {/* Select Volume dropdown */}
                          <div className="w-full">
                            <Select
                              options={volumes.map((v) => ({
                                value: v.volumeName,
                                label: v.volumeName,
                              }))}
                              placeholder="Select volume"
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
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
          </div>

          {/* Summary Sidebar */}
          <SummarySidebar
            name={name}
            containerTabs={containerTabs}
            activeTab={activeTab}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </div>
      </div>
    </div>
  );
}
