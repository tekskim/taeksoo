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
  Tooltip,
  Tabs,
  TabList,
  Tab,
  PreSection,
  WritingSection,
  SkippedSection,
  DoneSection,
  WizardSectionStatusIcon,
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
  IconHelp,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type CronJobSectionStep = 'basic-info' | 'labels-annotations' | 'scaling-policy';
type PodSectionStep =
  | 'pod-labels'
  | 'pod-scaling'
  | 'pod-networking'
  | 'pod-node-scheduling'
  | 'pod-scheduling'
  | 'pod-resources'
  | 'pod-security'
  | 'pod-storage';
type ContainerSectionStep =
  | 'container-general'
  | 'container-ports'
  | 'container-env'
  | 'container-resources'
  | 'container-health'
  | 'container-volume-mounts'
  | 'container-security';
type SectionState = 'pre' | 'active' | 'done' | 'writing' | 'skipped';

// Section labels for display
const CRONJOB_SECTION_LABELS: Record<CronJobSectionStep, string> = {
  'basic-info': 'Basic Information',
  'labels-annotations': 'Labels & Annotations',
  'scaling-policy': 'Scaling and Upgrade Policy',
};

// Section order for navigation
const CRONJOB_SECTION_ORDER: CronJobSectionStep[] = [
  'basic-info',
  'labels-annotations',
  'scaling-policy',
];

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

// Pod section labels for summary display
const POD_SECTION_LABELS: Record<PodSectionStep, string> = {
  'pod-labels': 'Labels & Annotations',
  'pod-scaling': 'Scaling and Upgrade Policy',
  'pod-networking': 'Networking',
  'pod-node-scheduling': 'Node Scheduling',
  'pod-scheduling': 'Pod Scheduling',
  'pod-resources': 'Resources',
  'pod-security': 'Security Context',
  'pod-storage': 'Storage',
};

// Pod section order for summary display
const POD_SECTION_ORDER: PodSectionStep[] = [
  'pod-labels',
  'pod-scaling',
  'pod-networking',
  'pod-node-scheduling',
  'pod-scheduling',
  'pod-resources',
  'pod-security',
  'pod-storage',
];

// Container section labels for summary display
const CONTAINER_SECTION_LABELS: Record<ContainerSectionStep, string> = {
  'container-general': 'General',
  'container-ports': 'Ports',
  'container-env': 'Environment Variables',
  'container-resources': 'Resources',
  'container-health': 'Health Checks',
  'container-volume-mounts': 'Volume Mounts',
  'container-security': 'Security Context',
};

// Container section order for summary display
const CONTAINER_SECTION_ORDER: ContainerSectionStep[] = [
  'container-general',
  'container-ports',
  'container-env',
  'container-resources',
  'container-health',
  'container-volume-mounts',
  'container-security',
];

interface SummarySidebarProps {
  cronjobSectionStatus: Record<CronJobSectionStep, SectionState>;
  podSectionStatus: Record<PodSectionStep, SectionState>;
  containerStatuses: { id: string; name: string; status: SectionState }[];
  containerSectionStatus: Record<string, Record<ContainerSectionStep, SectionState>>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  cronjobSectionStatus,
  podSectionStatus,
  containerStatuses,
  containerSectionStatus,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  const [cronjobExpanded, setCronjobExpanded] = useState(true);
  const [podExpanded, setPodExpanded] = useState(true);

  // Map SectionState to WizardSectionState
  const mapState = (state: SectionState): WizardSectionState => {
    if (state === 'pre') return 'pre';
    if (state === 'active') return 'active';
    if (state === 'writing') return 'writing';
    if (state === 'skipped') return 'skipped';
    return 'done';
  };

  // Check if all cronjob sections are done
  const allCronJobDone = CRONJOB_SECTION_ORDER.every((key) => cronjobSectionStatus[key] === 'done');

  // Check if all pod sections are done or skipped
  const allPodDone = POD_SECTION_ORDER.every(
    (key) => podSectionStatus[key] === 'done' || podSectionStatus[key] === 'skipped'
  );

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Summary Content */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Title */}
            <span className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
              Summary
            </span>

            <VStack gap={0}>
              {/* CronJob Section (Collapsible Parent) */}
              <HStack
                justify="between"
                align="center"
                className="py-1 cursor-pointer"
                onClick={() => setCronjobExpanded(!cronjobExpanded)}
              >
                <HStack gap={1} align="center">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {cronjobExpanded ? '▼' : '▶'}
                  </span>
                  <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)]">
                    Deployment
                  </span>
                </HStack>
                {allCronJobDone && <WizardSectionStatusIcon status="done" />}
              </HStack>

              {/* CronJob Sub-items (Indented) */}
              {cronjobExpanded && (
                <VStack gap={0} className="pl-4">
                  {CRONJOB_SECTION_ORDER.map((key) => {
                    const status = mapState(cronjobSectionStatus[key]);
                    return (
                      <HStack key={key} justify="between" align="center" className="py-1">
                        <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
                          {CRONJOB_SECTION_LABELS[key]}
                        </span>
                        {status === 'writing' ? (
                          <span className="text-[11px] text-[var(--color-text-subtle)]">
                            Writing...
                          </span>
                        ) : (
                          <WizardSectionStatusIcon status={status} />
                        )}
                      </HStack>
                    );
                  })}
                </VStack>
              )}

              {/* Pod Section (Collapsible Parent) */}
              <HStack
                justify="between"
                align="center"
                className="py-1 cursor-pointer"
                onClick={() => setPodExpanded(!podExpanded)}
              >
                <HStack gap={1} align="center">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {podExpanded ? '▼' : '▶'}
                  </span>
                  <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)]">
                    Pod
                  </span>
                </HStack>
                {allPodDone && <WizardSectionStatusIcon status="done" />}
              </HStack>

              {/* Pod Sub-items (Indented) */}
              {podExpanded && (
                <VStack gap={0} className="pl-4">
                  {POD_SECTION_ORDER.map((key) => {
                    const status = mapState(podSectionStatus[key]);
                    return (
                      <HStack key={key} justify="between" align="center" className="py-1">
                        <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
                          {POD_SECTION_LABELS[key]}
                        </span>
                        {status === 'writing' ? (
                          <span className="text-[11px] text-[var(--color-text-subtle)]">
                            Writing...
                          </span>
                        ) : (
                          <WizardSectionStatusIcon status={status} />
                        )}
                      </HStack>
                    );
                  })}
                </VStack>
              )}

              {/* Container Sections (Collapsible) */}
              {containerStatuses.map((container) => {
                const sectionStatus = containerSectionStatus[container.id] || {};
                const allContainerDone = CONTAINER_SECTION_ORDER.every(
                  (key) => sectionStatus[key] === 'done' || sectionStatus[key] === 'skipped'
                );

                return (
                  <div key={container.id}>
                    <HStack justify="between" align="center" className="py-1 cursor-pointer">
                      <HStack gap={1} align="center">
                        <span className="text-[10px] text-[var(--color-text-muted)]">▼</span>
                        <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)]">
                          {container.name}
                        </span>
                      </HStack>
                      {allContainerDone && <WizardSectionStatusIcon status="done" />}
                    </HStack>

                    {/* Container Sub-items (Indented) */}
                    <VStack gap={0} className="pl-4">
                      {CONTAINER_SECTION_ORDER.map((key) => {
                        const status = mapState(sectionStatus[key] || 'pre');
                        return (
                          <HStack key={key} justify="between" align="center" className="py-1">
                            <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
                              {CONTAINER_SECTION_LABELS[key]}
                            </span>
                            {status === 'writing' ? (
                              <span className="text-[11px] text-[var(--color-text-subtle)]">
                                Writing...
                              </span>
                            ) : (
                              <WizardSectionStatusIcon status={status} />
                            )}
                          </HStack>
                        );
                      })}
                    </VStack>
                  </div>
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
            Create CronJob
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
  replicas: number;
  onReplicasChange: (value: number) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
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
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInfoSectionProps) {
  const handleNext = () => {
    if (!name.trim()) {
      onNameErrorChange('Name is required.');
      return;
    }
    onNameErrorChange(null);
    onNext();
  };

  const handleDone = () => {
    if (!name.trim()) {
      onNameErrorChange('Name is required.');
      return;
    }
    onNameErrorChange(null);
    onEditDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Basic Information"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
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
            <NumberInput value={replicas} onChange={onReplicasChange} min={1} max={100} fullWidth />
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

          {/* Next Button */}
          {!isEditing && (
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={handleNext}>
                Next
              </Button>
            </div>
          )}
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
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
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
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: LabelsAnnotationsSectionProps) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Labels & Annotations"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={onEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Labels */}
          <VStack gap={3}>
            <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
              Labels
            </span>

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
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={label.key}
                      onChange={(e) => onUpdateLabel(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Value"
                      value={label.value}
                      onChange={(e) => onUpdateLabel(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => onRemoveLabel(index)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={onAddLabel}
            >
              Add Label
            </Button>
          </VStack>

          {/* Annotations */}
          <VStack gap={3}>
            <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
              Annotations
            </span>

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
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={annotation.key}
                      onChange={(e) => onUpdateAnnotation(index, 'key', e.target.value)}
                      fullWidth
                    />
                    <Input
                      placeholder="Value"
                      value={annotation.value}
                      onChange={(e) => onUpdateAnnotation(index, 'value', e.target.value)}
                      fullWidth
                    />
                    <button
                      onClick={() => onRemoveAnnotation(index)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
                    </button>
                  </div>
                ))}
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={12} stroke={1.5} />}
              onClick={onAddAnnotation}
            >
              Add Annotation
            </Button>
          </VStack>

          {/* Next Button */}
          {!isEditing && (
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={onNext}>
                Next
              </Button>
            </div>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   ScalingPolicySection Component
   ---------------------------------------- */

interface ScalingPolicySectionProps {
  strategy: 'rolling-update' | 'recreate';
  onStrategyChange: (value: 'rolling-update' | 'recreate') => void;
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
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
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
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: ScalingPolicySectionProps) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Scaling and Upgrade Policy"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={onEditDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content>
        <VStack gap={4}>
          {/* Strategy Selection */}
          <VStack gap={3}>
            <HStack gap={2} align="center">
              <Radio
                checked={strategy === 'rolling-update'}
                onChange={() => onStrategyChange('rolling-update')}
                label="Rolling Update"
              />
              <Tooltip
                content="Create new pods, until max surge is reached, before deleting old pods. Don't stop more pods than max unavailable."
                position="right"
              >
                <IconHelp size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </Tooltip>
            </HStack>

            <HStack gap={2} align="center">
              <Radio
                checked={strategy === 'recreate'}
                onChange={() => onStrategyChange('recreate')}
                label="Recreate"
              />
              <Tooltip content="Kill All Pods, then start new pods." position="right">
                <IconHelp size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </Tooltip>
            </HStack>
          </VStack>

          {/* Rolling Update Options */}
          {strategy === 'rolling-update' && (
            <VStack gap={4}>
              {/* Max Surge & Max Unavailable */}
              <div className="grid grid-cols-2 gap-4">
                <VStack gap={2}>
                  <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                    Max Surge
                  </label>
                  <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                    The maximum number of additional pods that can be created during an update.
                  </p>
                  <HStack gap={2}>
                    <NumberInput
                      value={maxSurge}
                      onChange={onMaxSurgeChange}
                      min={0}
                      className="w-[120px]"
                    />
                    <Select
                      options={UNIT_OPTIONS}
                      value={maxSurgeUnit}
                      onChange={(value) => onMaxSurgeUnitChange(value)}
                      className="w-20"
                    />
                  </HStack>
                </VStack>

                <VStack gap={2}>
                  <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                    Max Unavailable
                  </label>
                  <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                    The maximum number of pods that can be unavailable during an update.
                  </p>
                  <HStack gap={2}>
                    <NumberInput
                      value={maxUnavailable}
                      onChange={onMaxUnavailableChange}
                      min={0}
                      className="w-[120px]"
                    />
                    <Select
                      options={UNIT_OPTIONS}
                      value={maxUnavailableUnit}
                      onChange={(value) => onMaxUnavailableUnitChange(value)}
                      className="w-20"
                    />
                  </HStack>
                </VStack>
              </div>

              {/* Minimum Ready & Revision History Limit */}
              <div className="grid grid-cols-2 gap-4">
                <VStack gap={2}>
                  <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                    Minimum Ready
                  </label>
                  <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                    The minimum time a pod must remain in a ready state before it is considered
                    available.
                  </p>
                  <HStack gap={2}>
                    <NumberInput
                      value={minReady}
                      onChange={onMinReadyChange}
                      min={0}
                      className="w-[120px]"
                      hideSteppers
                    />
                    <span className="flex items-center text-[12px] text-[var(--color-text-default)]">
                      Seconds
                    </span>
                  </HStack>
                </VStack>

                <VStack gap={2}>
                  <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                    Revision History Limit
                  </label>
                  <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                    The maximum number of revision histories to retain for the CronJob.
                  </p>
                  <HStack gap={2}>
                    <NumberInput
                      value={revisionHistoryLimit}
                      onChange={onRevisionHistoryLimitChange}
                      min={0}
                      className="w-[120px]"
                      hideSteppers
                    />
                    <span className="flex items-center text-[12px] text-[var(--color-text-default)]">
                      Revisions
                    </span>
                  </HStack>
                </VStack>
              </div>

              {/* Progress Deadline */}
              <VStack gap={2} className="max-w-[calc(50%-8px)]">
                <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                  Progress Deadline
                </label>
                <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                  The maximum time allowed for a CronJob to progress before it is considered failed.
                </p>
                <HStack gap={2}>
                  <NumberInput
                    value={progressDeadline}
                    onChange={onProgressDeadlineChange}
                    min={0}
                    className="w-[120px]"
                    hideSteppers
                  />
                  <span className="flex items-center text-[12px] text-[var(--color-text-default)]">
                    Seconds
                  </span>
                </HStack>
              </VStack>
            </VStack>
          )}

          {/* Done Button (last section) */}
          {!isEditing && (
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={onNext}>
                Done
              </Button>
            </div>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateCronJobPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active tab (CronJob, Pod, Container-X)
  const [activeTab, setActiveTab] = useState('cronjob');
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
  const [strategy, setStrategy] = useState<'rolling-update' | 'recreate'>('rolling-update');
  const [maxSurge, setMaxSurge] = useState(25);
  const [maxSurgeUnit, setMaxSurgeUnit] = useState('%');
  const [maxUnavailable, setMaxUnavailable] = useState(25);
  const [maxUnavailableUnit, setMaxUnavailableUnit] = useState('%');
  const [minReady, setMinReady] = useState(0);
  const [revisionHistoryLimit, setRevisionHistoryLimit] = useState(10);
  const [progressDeadline, setProgressDeadline] = useState(600);

  // Section states for CronJob tab
  const [cronjobSectionStatus, setCronjobSectionStatus] = useState<
    Record<CronJobSectionStep, SectionState>
  >({
    'basic-info': 'active',
    'labels-annotations': 'pre',
    'scaling-policy': 'pre',
  });

  // Pod and Container states
  const [podStatus, setPodStatus] = useState<SectionState>('pre');
  const [containerStatuses, setContainerStatuses] = useState<
    { id: string; name: string; status: SectionState }[]
  >([{ id: 'container-0', name: 'Container-0', status: 'pre' }]);

  // Pod section states - track each section's state
  const [podSectionStatus, setPodSectionStatus] = useState<Record<PodSectionStep, SectionState>>({
    'pod-labels': 'active',
    'pod-scaling': 'pre',
    'pod-networking': 'pre',
    'pod-node-scheduling': 'pre',
    'pod-scheduling': 'pre',
    'pod-resources': 'pre',
    'pod-security': 'pre',
    'pod-storage': 'pre',
  });

  // Pod section order for navigation
  const POD_SECTION_ORDER: PodSectionStep[] = [
    'pod-labels',
    'pod-scaling',
    'pod-networking',
    'pod-node-scheduling',
    'pod-scheduling',
    'pod-resources',
    'pod-security',
    'pod-storage',
  ];

  // Pod section labels
  const POD_SECTION_LABELS: Record<PodSectionStep, string> = {
    'pod-labels': 'Labels & Annotations',
    'pod-scaling': 'Scaling and Upgrade Policy',
    'pod-networking': 'Networking',
    'pod-node-scheduling': 'Node Scheduling',
    'pod-scheduling': 'Pod Scheduling',
    'pod-resources': 'Resources',
    'pod-security': 'Security Context',
    'pod-storage': 'Storage',
  };

  // Get current active pod section
  const activePodSection =
    POD_SECTION_ORDER.find((section) => podSectionStatus[section] === 'active') || null;

  // Container section states - track each section's state per container
  const [containerSectionStatus, setContainerSectionStatus] = useState<
    Record<string, Record<ContainerSectionStep, SectionState>>
  >({
    'container-0': {
      'container-general': 'active',
      'container-ports': 'pre',
      'container-env': 'pre',
      'container-resources': 'pre',
      'container-health': 'pre',
      'container-volume-mounts': 'pre',
      'container-security': 'pre',
    },
  });

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

  // Editing state for container sections
  const [editingContainerSection, setEditingContainerSection] =
    useState<ContainerSectionStep | null>(null);

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

  // Handle Pod section next - determines if skipped or done based on data
  const handlePodSectionNext = useCallback(
    (currentSection: PodSectionStep) => {
      const currentIndex = POD_SECTION_ORDER.indexOf(currentSection);
      const nextSection = POD_SECTION_ORDER[currentIndex + 1];

      // Determine if current section has data (skipped vs done)
      let hasData = false;
      switch (currentSection) {
        case 'pod-labels':
          hasData = podLabels.length > 0 || podAnnotations.length > 0;
          break;
        case 'pod-scaling':
          hasData = terminationGracePeriod.trim() !== '';
          break;
        case 'pod-networking':
          // Always has values since they have defaults
          hasData = networkMode !== '' || dnsPolicy !== '';
          break;
        case 'pod-node-scheduling':
          // Always has a value since it has a default selection
          hasData = nodeScheduling !== '';
          break;
        case 'pod-security':
          // Always has a value since it has a default selection
          hasData = podFilesystemGroup !== '';
          break;
        // For other sections, check if any data was entered
        // For now, mark as skipped if no explicit data tracking
        default:
          hasData = false;
      }

      setPodSectionStatus((prev) => ({
        ...prev,
        [currentSection]: hasData ? 'done' : 'skipped',
        ...(nextSection && { [nextSection]: 'active' }),
      }));

      // If this was the last pod section
      if (!nextSection) {
        setPodStatus('done');
        setContainerStatuses((prev) =>
          prev.map((c, i) => (i === 0 ? { ...c, status: 'active' } : c))
        );
        if (containerTabs.length > 0) {
          setActiveTab(containerTabs[0].id);
        }
      }
    },
    [
      podLabels,
      podAnnotations,
      terminationGracePeriod,
      networkMode,
      dnsPolicy,
      nodeScheduling,
      podFilesystemGroup,
      containerTabs,
    ]
  );

  // Editing mode for Pod sections - tracks which section is being edited
  const [editingPodSection, setEditingPodSection] = useState<PodSectionStep | null>(null);

  // Handle Pod section edit (click on done/skipped section)
  const handlePodSectionEdit = useCallback((section: PodSectionStep) => {
    setPodSectionStatus((prev) => {
      const newStatus = { ...prev };
      // Set previously active section to 'writing' state
      POD_SECTION_ORDER.forEach((key) => {
        if (newStatus[key] === 'active') {
          newStatus[key] = 'writing';
        }
      });
      // Set the target section to active
      newStatus[section] = 'active';
      return newStatus;
    });
    // Mark this section as being edited
    setEditingPodSection(section);
  }, []);

  // Handle Pod section edit cancel (restore section to done/skipped state)
  const handlePodEditCancel = useCallback(() => {
    if (editingPodSection) {
      // Find the topmost 'writing' section
      const topmostWriting = POD_SECTION_ORDER.find((key) => podSectionStatus[key] === 'writing');

      setPodSectionStatus((prev) => {
        const newStatus = { ...prev };
        // Mark current editing section as done (or skipped based on data)
        newStatus[editingPodSection] = 'done';

        // Make topmost writing section active
        if (topmostWriting) {
          newStatus[topmostWriting] = 'active';
        }
        return newStatus;
      });

      // Clear editing mode, or set to topmost writing if it exists
      setEditingPodSection(topmostWriting || null);
    }
  }, [editingPodSection, podSectionStatus]);

  // Handle Pod section edit done (complete editing, mark section as done)
  const handlePodEditDone = useCallback(() => {
    if (editingPodSection) {
      // Find the topmost 'writing' section
      const topmostWriting = POD_SECTION_ORDER.find((key) => podSectionStatus[key] === 'writing');

      setPodSectionStatus((prev) => {
        const newStatus = { ...prev };
        // Mark current editing section as done
        newStatus[editingPodSection] = 'done';

        // Make topmost writing section active
        if (topmostWriting) {
          newStatus[topmostWriting] = 'active';
        }
        return newStatus;
      });

      // Clear editing mode, or set to topmost writing if it exists
      setEditingPodSection(topmostWriting || null);
    }
  }, [editingPodSection, podSectionStatus]);

  // Handle Container section next - determines if skipped or done based on data
  const handleContainerSectionNext = useCallback(
    (containerId: string, currentSection: ContainerSectionStep) => {
      const currentIndex = CONTAINER_SECTION_ORDER.indexOf(currentSection);
      const nextSection = CONTAINER_SECTION_ORDER[currentIndex + 1];
      const config = containerConfigs[containerId];

      // Determine if current section has data (skipped vs done)
      let hasData = false;
      switch (currentSection) {
        case 'container-general':
          hasData = config?.name?.trim() !== '' || config?.image?.trim() !== '';
          break;
        case 'container-ports':
          hasData = (config?.ports?.length || 0) > 0;
          break;
        case 'container-env':
          hasData = (config?.envVars?.length || 0) > 0;
          break;
        case 'container-resources':
          hasData = config?.cpuRequest?.trim() !== '' || config?.memoryRequest?.trim() !== '';
          break;
        case 'container-health':
          hasData = config?.livenessProbe?.enabled || config?.readinessProbe?.enabled;
          break;
        case 'container-volume-mounts':
          hasData = (config?.volumeMounts?.length || 0) > 0;
          break;
        case 'container-security':
          hasData =
            config?.runAsUser?.trim() !== '' ||
            config?.privileged ||
            config?.readOnlyRootFilesystem;
          break;
        default:
          hasData = false;
      }

      setContainerSectionStatus((prev) => {
        const containerStatus = prev[containerId] || {};
        const newContainerStatus = { ...containerStatus };
        newContainerStatus[currentSection] = hasData ? 'done' : 'skipped';
        if (nextSection) {
          newContainerStatus[nextSection] = 'active';
        }
        return { ...prev, [containerId]: newContainerStatus };
      });

      // Update container status in sidebar
      if (!nextSection) {
        setContainerStatuses((prev) =>
          prev.map((c) => (c.id === containerId ? { ...c, status: 'done' } : c))
        );
      }
    },
    [containerConfigs]
  );

  // Handle Container section edit
  const handleContainerSectionEdit = useCallback(
    (containerId: string, section: ContainerSectionStep) => {
      setContainerSectionStatus((prev) => {
        const containerStatus = prev[containerId] || {};
        const newContainerStatus = { ...containerStatus };
        // Set previously active section to 'writing' state
        CONTAINER_SECTION_ORDER.forEach((key) => {
          if (newContainerStatus[key] === 'active') {
            newContainerStatus[key] = 'writing';
          }
        });
        // Set the target section to active
        newContainerStatus[section] = 'active';
        return { ...prev, [containerId]: newContainerStatus };
      });
      setEditingContainerSection(section);
    },
    []
  );

  // Handle Container section edit cancel
  const handleContainerEditCancel = useCallback(
    (containerId: string) => {
      if (editingContainerSection) {
        const containerStatus = containerSectionStatus[containerId] || {};
        const topmostWriting = CONTAINER_SECTION_ORDER.find(
          (key) => containerStatus[key] === 'writing'
        );

        setContainerSectionStatus((prev) => {
          const currentStatus = prev[containerId] || {};
          const newContainerStatus = { ...currentStatus };
          newContainerStatus[editingContainerSection] = 'done';
          if (topmostWriting) {
            newContainerStatus[topmostWriting] = 'active';
          }
          return { ...prev, [containerId]: newContainerStatus };
        });

        setEditingContainerSection(topmostWriting || null);
      }
    },
    [editingContainerSection, containerSectionStatus]
  );

  // Handle Container section edit done
  const handleContainerEditDone = useCallback(
    (containerId: string) => {
      if (editingContainerSection) {
        const containerStatus = containerSectionStatus[containerId] || {};
        const topmostWriting = CONTAINER_SECTION_ORDER.find(
          (key) => containerStatus[key] === 'writing'
        );

        setContainerSectionStatus((prev) => {
          const currentStatus = prev[containerId] || {};
          const newContainerStatus = { ...currentStatus };
          newContainerStatus[editingContainerSection] = 'done';
          if (topmostWriting) {
            newContainerStatus[topmostWriting] = 'active';
          }
          return { ...prev, [containerId]: newContainerStatus };
        });

        setEditingContainerSection(topmostWriting || null);
      }
    },
    [editingContainerSection, containerSectionStatus]
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

  // Editing state
  const [editingSection, setEditingSection] = useState<CronJobSectionStep | null>(null);

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create CronJob');
  }, [updateActiveTabLabel]);

  // Activate Pod when switching to pod tab
  useEffect(() => {
    if (activeTab === 'pod' && podStatus === 'pre') {
      setPodStatus('active');
    }
  }, [activeTab, podStatus]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Handle section navigation
  const handleNext = useCallback((currentSection: CronJobSectionStep) => {
    const currentIndex = CRONJOB_SECTION_ORDER.indexOf(currentSection);
    const nextSection = CRONJOB_SECTION_ORDER[currentIndex + 1];

    setCronjobSectionStatus((prev) => ({
      ...prev,
      [currentSection]: 'done',
      ...(nextSection && { [nextSection]: 'active' }),
    }));

    // If this was the last cronjob section, mark Pod as active
    if (!nextSection) {
      setPodStatus('done');
      setContainerStatuses((prev) => prev.map((c, i) => (i === 0 ? { ...c, status: 'done' } : c)));
    }
  }, []);

  // Handle edit
  const handleEdit = useCallback((section: CronJobSectionStep) => {
    setEditingSection(section);
    const sectionIndex = CRONJOB_SECTION_ORDER.indexOf(section);

    setCronjobSectionStatus((prev) => {
      const newStatus = { ...prev };
      CRONJOB_SECTION_ORDER.forEach((key, index) => {
        if (index < sectionIndex) {
          newStatus[key] = 'done';
        } else if (index === sectionIndex) {
          newStatus[key] = 'active';
        } else if (prev[key] === 'done' || prev[key] === 'active') {
          newStatus[key] = 'writing';
        }
      });
      return newStatus;
    });
  }, []);

  // Handle edit cancel
  const handleEditCancel = useCallback(() => {
    if (!editingSection) return;

    setCronjobSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      const editIndex = CRONJOB_SECTION_ORDER.indexOf(editingSection);
      for (let i = editIndex + 1; i < CRONJOB_SECTION_ORDER.length; i++) {
        if (newStatus[CRONJOB_SECTION_ORDER[i]] === 'writing') {
          newStatus[CRONJOB_SECTION_ORDER[i]] = 'done';
        }
      }
      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  // Handle edit done
  const handleEditDone = useCallback(() => {
    if (!editingSection) return;

    setCronjobSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      const editIndex = CRONJOB_SECTION_ORDER.indexOf(editingSection);
      for (let i = editIndex + 1; i < CRONJOB_SECTION_ORDER.length; i++) {
        if (newStatus[CRONJOB_SECTION_ORDER[i]] === 'writing') {
          newStatus[CRONJOB_SECTION_ORDER[i]] = 'done';
        }
      }
      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  const handleCancel = useCallback(() => {
    navigate('/container/cronjobs');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      setNameError('Name is required.');
      setCronjobSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
      return;
    }

    console.log('Creating cronjob:', {
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
    navigate('/container/cronjobs');
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
    setContainerStatuses([...containerStatuses, { ...newContainer, status: 'pre' }]);
  }, [containerTabs, containerStatuses]);

  const removeContainerTab = useCallback(
    (id: string) => {
      if (containerTabs.length <= 1) return;
      setContainerTabs(containerTabs.filter((c) => c.id !== id));
      setContainerStatuses(containerStatuses.filter((c) => c.id !== id));
      if (activeTab === id) {
        setActiveTab('cronjob');
      }
    },
    [containerTabs, containerStatuses, activeTab]
  );

  // Check if create button should be disabled (all sections must be complete)
  const allCronJobSectionsDone = CRONJOB_SECTION_ORDER.every(
    (key) => cronjobSectionStatus[key] === 'done'
  );
  const podDone = podStatus === 'done';
  const allContainersDone = containerStatuses.every((c) => c.status === 'done');
  const isCreateDisabled = !allCronJobSectionsDone || !podDone || !allContainersDone;

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

  // Build inner tabs for the form
  const formTabs = [
    { id: 'cronjob', label: 'CronJob' },
    { id: 'pod', label: 'Pod' },
    ...containerTabs.map((c) => ({ id: c.id, label: c.name, closable: containerTabs.length > 1 })),
  ];

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
                { label: 'CronJobs', href: '/container/cronjobs' },
                { label: 'Create CronJob' },
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
                  Create CronJob
                </h1>
                <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                  CronJobs create Jobs on a repeating schedule, useful for periodic tasks like
                  backups or report generation.
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
                  {activeTab === 'cronjob' && (
                    <>
                      {/* Basic Information Section */}
                      {cronjobSectionStatus['basic-info'] === 'pre' && (
                        <PreSection title={CRONJOB_SECTION_LABELS['basic-info']} />
                      )}
                      {cronjobSectionStatus['basic-info'] === 'writing' && (
                        <WritingSection title={CRONJOB_SECTION_LABELS['basic-info']} />
                      )}
                      {cronjobSectionStatus['basic-info'] === 'active' && (
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
                          onNext={() => handleNext('basic-info')}
                          isEditing={editingSection === 'basic-info'}
                          onEditCancel={handleEditCancel}
                          onEditDone={handleEditDone}
                        />
                      )}
                      {cronjobSectionStatus['basic-info'] === 'done' && (
                        <DoneSection
                          title={CRONJOB_SECTION_LABELS['basic-info']}
                          onEdit={() => handleEdit('basic-info')}
                        >
                          <SectionCard.DataRow
                            label="Namespace"
                            value={namespace}
                            showDivider={false}
                          />
                          <SectionCard.DataRow label="Name" value={name} />
                          <SectionCard.DataRow label="Replicas" value={replicas.toString()} />
                          <SectionCard.DataRow label="Description" value={description || '-'} />
                        </DoneSection>
                      )}

                      {/* Labels & Annotations Section */}
                      {cronjobSectionStatus['labels-annotations'] === 'pre' && (
                        <PreSection title={CRONJOB_SECTION_LABELS['labels-annotations']} />
                      )}
                      {cronjobSectionStatus['labels-annotations'] === 'writing' && (
                        <WritingSection title={CRONJOB_SECTION_LABELS['labels-annotations']} />
                      )}
                      {cronjobSectionStatus['labels-annotations'] === 'active' && (
                        <LabelsAnnotationsSection
                          labels={labels}
                          onAddLabel={addLabel}
                          onRemoveLabel={removeLabel}
                          onUpdateLabel={updateLabel}
                          annotations={annotations}
                          onAddAnnotation={addAnnotation}
                          onRemoveAnnotation={removeAnnotation}
                          onUpdateAnnotation={updateAnnotation}
                          onNext={() => handleNext('labels-annotations')}
                          isEditing={editingSection === 'labels-annotations'}
                          onEditCancel={handleEditCancel}
                          onEditDone={handleEditDone}
                        />
                      )}
                      {cronjobSectionStatus['labels-annotations'] === 'done' && (
                        <DoneSection
                          title={CRONJOB_SECTION_LABELS['labels-annotations']}
                          onEdit={() => handleEdit('labels-annotations')}
                        >
                          <SectionCard.DataRow
                            label="Labels"
                            value={getLabelsDisplay()}
                            showDivider={false}
                          />
                          <SectionCard.DataRow
                            label="Annotations"
                            value={getAnnotationsDisplay()}
                          />
                        </DoneSection>
                      )}

                      {/* Scaling and Upgrade Policy Section */}
                      {cronjobSectionStatus['scaling-policy'] === 'pre' && (
                        <PreSection title={CRONJOB_SECTION_LABELS['scaling-policy']} />
                      )}
                      {cronjobSectionStatus['scaling-policy'] === 'writing' && (
                        <WritingSection title={CRONJOB_SECTION_LABELS['scaling-policy']} />
                      )}
                      {cronjobSectionStatus['scaling-policy'] === 'active' && (
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
                          onNext={() => handleNext('scaling-policy')}
                          isEditing={editingSection === 'scaling-policy'}
                          onEditCancel={handleEditCancel}
                          onEditDone={handleEditDone}
                        />
                      )}
                      {cronjobSectionStatus['scaling-policy'] === 'done' && (
                        <DoneSection
                          title={CRONJOB_SECTION_LABELS['scaling-policy']}
                          onEdit={() => handleEdit('scaling-policy')}
                        >
                          <SectionCard.DataRow
                            label="Strategy"
                            value={strategy === 'rolling-update' ? 'Rolling Update' : 'Recreate'}
                            showDivider={false}
                          />
                          {strategy === 'rolling-update' && (
                            <>
                              <SectionCard.DataRow
                                label="Max Surge"
                                value={`${maxSurge}${maxSurgeUnit}`}
                              />
                              <SectionCard.DataRow
                                label="Max Unavailable"
                                value={`${maxUnavailable}${maxUnavailableUnit}`}
                              />
                              <SectionCard.DataRow
                                label="Minimum Ready"
                                value={`${minReady} seconds`}
                              />
                              <SectionCard.DataRow
                                label="Revision History Limit"
                                value={`${revisionHistoryLimit} revisions`}
                              />
                              <SectionCard.DataRow
                                label="Progress Deadline"
                                value={`${progressDeadline} seconds`}
                              />
                            </>
                          )}
                        </DoneSection>
                      )}
                    </>
                  )}

                  {activeTab === 'pod' && (
                    <>
                      {/* Labels & Annotations */}
                      {podSectionStatus['pod-labels'] === 'active' && (
                        <SectionCard isActive>
                          <SectionCard.Header
                            title="Labels & Annotations"
                            showDivider
                            actions={
                              editingPodSection === 'pod-labels' ? (
                                <HStack gap={2}>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handlePodEditCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button variant="primary" size="sm" onClick={handlePodEditDone}>
                                    Done
                                  </Button>
                                </HStack>
                              ) : undefined
                            }
                          />
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

                              {/* Next Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePodSectionNext('pod-labels')}
                                >
                                  Next
                                </Button>
                              </div>
                            </VStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
                      {podSectionStatus['pod-labels'] === 'pre' && (
                        <PreSection title="Labels & Annotations" />
                      )}
                      {podSectionStatus['pod-labels'] === 'skipped' && (
                        <SkippedSection
                          title="Labels & Annotations"
                          onEdit={() => handlePodSectionEdit('pod-labels')}
                        />
                      )}
                      {podSectionStatus['pod-labels'] === 'done' && (
                        <DoneSection
                          title="Labels & Annotations"
                          onEdit={() => handlePodSectionEdit('pod-labels')}
                        >
                          <SectionCard.DataRow
                            label="Labels"
                            value={
                              podLabels.length > 0
                                ? podLabels.map((l) => `${l.key}: ${l.value}`).join(', ')
                                : 'None'
                            }
                            showDivider={false}
                          />
                          <SectionCard.DataRow
                            label="Annotations"
                            value={
                              podAnnotations.length > 0
                                ? podAnnotations.map((a) => `${a.key}: ${a.value}`).join(', ')
                                : 'None'
                            }
                          />
                        </DoneSection>
                      )}
                      {podSectionStatus['pod-labels'] === 'writing' && (
                        <WritingSection
                          title="Labels & Annotations"
                          onEdit={() => handlePodSectionEdit('pod-labels')}
                        />
                      )}

                      {/* Scaling and Upgrade Policy */}
                      {podSectionStatus['pod-scaling'] === 'active' && (
                        <SectionCard isActive>
                          <SectionCard.Header
                            title="Scaling and Upgrade Policy"
                            showDivider
                            actions={
                              editingPodSection === 'pod-scaling' ? (
                                <HStack gap={2}>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handlePodEditCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button variant="primary" size="sm" onClick={handlePodEditDone}>
                                    Done
                                  </Button>
                                </HStack>
                              ) : undefined
                            }
                          />
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
                                  The period allowed after receiving a termination request before
                                  the pod is forcibly terminated.
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

                              {/* Next Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePodSectionNext('pod-scaling')}
                                >
                                  Next
                                </Button>
                              </div>
                            </VStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
                      {podSectionStatus['pod-scaling'] === 'pre' && (
                        <PreSection title="Scaling and Upgrade Policy" />
                      )}
                      {podSectionStatus['pod-scaling'] === 'skipped' && (
                        <SkippedSection
                          title="Scaling and Upgrade Policy"
                          onEdit={() => handlePodSectionEdit('pod-scaling')}
                        />
                      )}
                      {podSectionStatus['pod-scaling'] === 'done' && (
                        <DoneSection
                          title="Scaling and Upgrade Policy"
                          onEdit={() => handlePodSectionEdit('pod-scaling')}
                        >
                          <SectionCard.DataRow
                            label="Termination Grace Period"
                            value={`${terminationGracePeriod} seconds`}
                            showDivider={false}
                          />
                        </DoneSection>
                      )}
                      {podSectionStatus['pod-scaling'] === 'writing' && (
                        <WritingSection
                          title="Scaling and Upgrade Policy"
                          onEdit={() => handlePodSectionEdit('pod-scaling')}
                        />
                      )}

                      {/* Networking */}
                      {podSectionStatus['pod-networking'] === 'active' && (
                        <SectionCard isActive>
                          <SectionCard.Header
                            title="Networking"
                            showDivider
                            actions={
                              editingPodSection === 'pod-networking' ? (
                                <HStack gap={2}>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handlePodEditCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button variant="primary" size="sm" onClick={handlePodEditDone}>
                                    Done
                                  </Button>
                                </HStack>
                              ) : undefined
                            }
                          />
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

                              {/* Next Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePodSectionNext('pod-networking')}
                                >
                                  Next
                                </Button>
                              </div>
                            </VStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
                      {podSectionStatus['pod-networking'] === 'pre' && (
                        <PreSection title="Networking" />
                      )}
                      {podSectionStatus['pod-networking'] === 'skipped' && (
                        <SkippedSection
                          title="Networking"
                          onEdit={() => handlePodSectionEdit('pod-networking')}
                        />
                      )}
                      {podSectionStatus['pod-networking'] === 'done' && (
                        <DoneSection
                          title="Networking"
                          onEdit={() => handlePodSectionEdit('pod-networking')}
                        >
                          <SectionCard.DataRow
                            label="Network Mode"
                            value={networkMode === 'normal' ? 'Normal' : 'Host'}
                            showDivider={false}
                          />
                          <SectionCard.DataRow
                            label="DNS Policy"
                            value={
                              dnsPolicy === 'cluster-first'
                                ? 'Cluster First'
                                : dnsPolicy === 'default'
                                  ? 'Default'
                                  : 'None'
                            }
                          />
                        </DoneSection>
                      )}
                      {podSectionStatus['pod-networking'] === 'writing' && (
                        <WritingSection
                          title="Networking"
                          onEdit={() => handlePodSectionEdit('pod-networking')}
                        />
                      )}

                      {/* Node Scheduling */}
                      {podSectionStatus['pod-node-scheduling'] === 'active' && (
                        <SectionCard isActive>
                          <SectionCard.Header
                            title="Node Scheduling"
                            showDivider
                            actions={
                              editingPodSection === 'pod-node-scheduling' ? (
                                <HStack gap={2}>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handlePodEditCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button variant="primary" size="sm" onClick={handlePodEditDone}>
                                    Done
                                  </Button>
                                </HStack>
                              ) : undefined
                            }
                          />
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

                              {/* Next Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePodSectionNext('pod-node-scheduling')}
                                >
                                  Next
                                </Button>
                              </div>
                            </VStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
                      {podSectionStatus['pod-node-scheduling'] === 'pre' && (
                        <PreSection title="Node Scheduling" />
                      )}
                      {podSectionStatus['pod-node-scheduling'] === 'skipped' && (
                        <SkippedSection
                          title="Node Scheduling"
                          onEdit={() => handlePodSectionEdit('pod-node-scheduling')}
                        />
                      )}
                      {podSectionStatus['pod-node-scheduling'] === 'done' && (
                        <DoneSection
                          title="Node Scheduling"
                          onEdit={() => handlePodSectionEdit('pod-node-scheduling')}
                        >
                          <SectionCard.DataRow
                            label="Scheduling"
                            value={
                              nodeScheduling === 'any'
                                ? 'Run pods on any available node'
                                : nodeScheduling === 'specific'
                                  ? 'Run pods on specific node(s)'
                                  : 'Run pods on node(s) matching scheduling rules'
                            }
                            showDivider={false}
                          />
                        </DoneSection>
                      )}
                      {podSectionStatus['pod-node-scheduling'] === 'writing' && (
                        <WritingSection
                          title="Node Scheduling"
                          onEdit={() => handlePodSectionEdit('pod-node-scheduling')}
                        />
                      )}

                      {/* Pod Scheduling */}
                      {podSectionStatus['pod-scheduling'] === 'active' && (
                        <SectionCard isActive>
                          <SectionCard.Header
                            title="Pod Scheduling"
                            showDivider
                            actions={
                              editingPodSection === 'pod-scheduling' ? (
                                <HStack gap={2}>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handlePodEditCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button variant="primary" size="sm" onClick={handlePodEditDone}>
                                    Done
                                  </Button>
                                </HStack>
                              ) : undefined
                            }
                          />
                          <SectionCard.Content>
                            <VStack gap={4}>
                              <Button variant="secondary" size="sm">
                                <IconPlus size={12} stroke={1.5} />
                                Add Pod Selector
                              </Button>

                              {/* Next Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePodSectionNext('pod-scheduling')}
                                >
                                  Next
                                </Button>
                              </div>
                            </VStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
                      {podSectionStatus['pod-scheduling'] === 'pre' && (
                        <PreSection title="Pod Scheduling" />
                      )}
                      {podSectionStatus['pod-scheduling'] === 'skipped' && (
                        <SkippedSection
                          title="Pod Scheduling"
                          onEdit={() => handlePodSectionEdit('pod-scheduling')}
                        />
                      )}
                      {podSectionStatus['pod-scheduling'] === 'done' && (
                        <DoneSection
                          title="Pod Scheduling"
                          onEdit={() => handlePodSectionEdit('pod-scheduling')}
                        >
                          <SectionCard.DataRow label="Selectors" value="None" showDivider={false} />
                        </DoneSection>
                      )}
                      {podSectionStatus['pod-scheduling'] === 'writing' && (
                        <WritingSection
                          title="Pod Scheduling"
                          onEdit={() => handlePodSectionEdit('pod-scheduling')}
                        />
                      )}

                      {/* Resources */}
                      {podSectionStatus['pod-resources'] === 'active' && (
                        <SectionCard isActive>
                          <SectionCard.Header
                            title="Resources"
                            showDivider
                            actions={
                              editingPodSection === 'pod-resources' ? (
                                <HStack gap={2}>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handlePodEditCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button variant="primary" size="sm" onClick={handlePodEditDone}>
                                    Done
                                  </Button>
                                </HStack>
                              ) : undefined
                            }
                          />
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

                              {/* Next Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePodSectionNext('pod-resources')}
                                >
                                  Next
                                </Button>
                              </div>
                            </VStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
                      {podSectionStatus['pod-resources'] === 'pre' && (
                        <PreSection title="Resources" />
                      )}
                      {podSectionStatus['pod-resources'] === 'skipped' && (
                        <SkippedSection
                          title="Resources"
                          onEdit={() => handlePodSectionEdit('pod-resources')}
                        />
                      )}
                      {podSectionStatus['pod-resources'] === 'done' && (
                        <DoneSection
                          title="Resources"
                          onEdit={() => handlePodSectionEdit('pod-resources')}
                        >
                          <SectionCard.DataRow
                            label="Tolerations"
                            value="None"
                            showDivider={false}
                          />
                          <SectionCard.DataRow label="Priority" value="-" />
                        </DoneSection>
                      )}
                      {podSectionStatus['pod-resources'] === 'writing' && (
                        <WritingSection
                          title="Resources"
                          onEdit={() => handlePodSectionEdit('pod-resources')}
                        />
                      )}

                      {/* Security Context */}
                      {podSectionStatus['pod-security'] === 'active' && (
                        <SectionCard isActive>
                          <SectionCard.Header
                            title="Security Context"
                            showDivider
                            actions={
                              editingPodSection === 'pod-security' ? (
                                <HStack gap={2}>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handlePodEditCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button variant="primary" size="sm" onClick={handlePodEditDone}>
                                    Done
                                  </Button>
                                </HStack>
                              ) : undefined
                            }
                          />
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

                              {/* Next Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePodSectionNext('pod-security')}
                                >
                                  Next
                                </Button>
                              </div>
                            </VStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
                      {podSectionStatus['pod-security'] === 'pre' && (
                        <PreSection title="Security Context" />
                      )}
                      {podSectionStatus['pod-security'] === 'skipped' && (
                        <SkippedSection
                          title="Security Context"
                          onEdit={() => handlePodSectionEdit('pod-security')}
                        />
                      )}
                      {podSectionStatus['pod-security'] === 'done' && (
                        <DoneSection
                          title="Security Context"
                          onEdit={() => handlePodSectionEdit('pod-security')}
                        >
                          <SectionCard.DataRow
                            label="Pod Filesystem Group"
                            value={podFilesystemGroup}
                            showDivider={false}
                          />
                        </DoneSection>
                      )}
                      {podSectionStatus['pod-security'] === 'writing' && (
                        <WritingSection
                          title="Security Context"
                          onEdit={() => handlePodSectionEdit('pod-security')}
                        />
                      )}

                      {/* Storage */}
                      {podSectionStatus['pod-storage'] === 'active' && (
                        <SectionCard isActive>
                          <SectionCard.Header
                            title="Storage"
                            showDivider
                            actions={
                              editingPodSection === 'pod-storage' ? (
                                <HStack gap={2}>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handlePodEditCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button variant="primary" size="sm" onClick={handlePodEditDone}>
                                    Done
                                  </Button>
                                </HStack>
                              ) : undefined
                            }
                          />
                          <SectionCard.Content>
                            <VStack gap={4}>
                              <Button variant="secondary" size="sm">
                                <IconPlus size={12} stroke={1.5} />
                                Add Volume
                              </Button>

                              {/* Done Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePodSectionNext('pod-storage')}
                                >
                                  Done
                                </Button>
                              </div>
                            </VStack>
                          </SectionCard.Content>
                        </SectionCard>
                      )}
                      {podSectionStatus['pod-storage'] === 'pre' && <PreSection title="Storage" />}
                      {podSectionStatus['pod-storage'] === 'skipped' && (
                        <SkippedSection
                          title="Storage"
                          onEdit={() => handlePodSectionEdit('pod-storage')}
                        />
                      )}
                      {podSectionStatus['pod-storage'] === 'done' && (
                        <DoneSection
                          title="Storage"
                          onEdit={() => handlePodSectionEdit('pod-storage')}
                        >
                          <SectionCard.DataRow label="Volumes" value="None" showDivider={false} />
                        </DoneSection>
                      )}
                      {podSectionStatus['pod-storage'] === 'writing' && (
                        <WritingSection
                          title="Storage"
                          onEdit={() => handlePodSectionEdit('pod-storage')}
                        />
                      )}
                    </>
                  )}

                  {activeTab.startsWith('container-') &&
                    (() => {
                      const containerId = activeTab;
                      const containerStatus = containerSectionStatus[containerId] || {};
                      const config = containerConfigs[containerId] || {};

                      return (
                        <>
                          {/* General Section */}
                          {containerStatus['container-general'] === 'active' && (
                            <SectionCard isActive>
                              <SectionCard.Header
                                title="General"
                                showDivider
                                actions={
                                  editingContainerSection === 'container-general' ? (
                                    <HStack gap={2}>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleContainerEditCancel(containerId)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleContainerEditDone(containerId)}
                                      >
                                        Done
                                      </Button>
                                    </HStack>
                                  ) : undefined
                                }
                              />
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

                                  <div className="flex justify-end pt-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleContainerSectionNext(containerId, 'container-general')
                                      }
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </VStack>
                              </SectionCard.Content>
                            </SectionCard>
                          )}
                          {containerStatus['container-general'] === 'pre' && (
                            <PreSection title="General" />
                          )}
                          {containerStatus['container-general'] === 'skipped' && (
                            <SkippedSection
                              title="General"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-general')
                              }
                            />
                          )}
                          {containerStatus['container-general'] === 'done' && (
                            <DoneSection
                              title="General"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-general')
                              }
                            >
                              <SectionCard.DataRow
                                label="Container Name"
                                value={config.name || '-'}
                                showDivider={false}
                              />
                              <SectionCard.DataRow label="Image" value={config.image || '-'} />
                              <SectionCard.DataRow
                                label="Image Pull Policy"
                                value={config.imagePullPolicy || 'IfNotPresent'}
                              />
                            </DoneSection>
                          )}
                          {containerStatus['container-general'] === 'writing' && (
                            <WritingSection
                              title="General"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-general')
                              }
                            />
                          )}

                          {/* Ports Section */}
                          {containerStatus['container-ports'] === 'active' && (
                            <SectionCard isActive>
                              <SectionCard.Header
                                title="Ports"
                                showDivider
                                actions={
                                  editingContainerSection === 'container-ports' ? (
                                    <HStack gap={2}>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleContainerEditCancel(containerId)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleContainerEditDone(containerId)}
                                      >
                                        Done
                                      </Button>
                                    </HStack>
                                  ) : undefined
                                }
                              />
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

                                  <div className="flex justify-end pt-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleContainerSectionNext(containerId, 'container-ports')
                                      }
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </VStack>
                              </SectionCard.Content>
                            </SectionCard>
                          )}
                          {containerStatus['container-ports'] === 'pre' && (
                            <PreSection title="Ports" />
                          )}
                          {containerStatus['container-ports'] === 'skipped' && (
                            <SkippedSection
                              title="Ports"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-ports')
                              }
                            />
                          )}
                          {containerStatus['container-ports'] === 'done' && (
                            <DoneSection
                              title="Ports"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-ports')
                              }
                            >
                              <SectionCard.DataRow
                                label="Exposed Ports"
                                value={`${(config.ports || []).length} port(s) configured`}
                                showDivider={false}
                              />
                            </DoneSection>
                          )}
                          {containerStatus['container-ports'] === 'writing' && (
                            <WritingSection
                              title="Ports"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-ports')
                              }
                            />
                          )}

                          {/* Environment Variables Section */}
                          {containerStatus['container-env'] === 'active' && (
                            <SectionCard isActive>
                              <SectionCard.Header
                                title="Environment Variables"
                                showDivider
                                actions={
                                  editingContainerSection === 'container-env' ? (
                                    <HStack gap={2}>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleContainerEditCancel(containerId)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleContainerEditDone(containerId)}
                                      >
                                        Done
                                      </Button>
                                    </HStack>
                                  ) : undefined
                                }
                              />
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

                                  <div className="flex justify-end pt-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleContainerSectionNext(containerId, 'container-env')
                                      }
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </VStack>
                              </SectionCard.Content>
                            </SectionCard>
                          )}
                          {containerStatus['container-env'] === 'pre' && (
                            <PreSection title="Environment Variables" />
                          )}
                          {containerStatus['container-env'] === 'skipped' && (
                            <SkippedSection
                              title="Environment Variables"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-env')
                              }
                            />
                          )}
                          {containerStatus['container-env'] === 'done' && (
                            <DoneSection
                              title="Environment Variables"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-env')
                              }
                            >
                              <SectionCard.DataRow
                                label="Environment Variables"
                                value={`${(config.envVars || []).length} variable(s) configured`}
                                showDivider={false}
                              />
                            </DoneSection>
                          )}
                          {containerStatus['container-env'] === 'writing' && (
                            <WritingSection
                              title="Environment Variables"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-env')
                              }
                            />
                          )}

                          {/* Resources Section */}
                          {containerStatus['container-resources'] === 'active' && (
                            <SectionCard isActive>
                              <SectionCard.Header
                                title="Resources"
                                showDivider
                                actions={
                                  editingContainerSection === 'container-resources' ? (
                                    <HStack gap={2}>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleContainerEditCancel(containerId)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleContainerEditDone(containerId)}
                                      >
                                        Done
                                      </Button>
                                    </HStack>
                                  ) : undefined
                                }
                              />
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

                                  <div className="flex justify-end pt-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleContainerSectionNext(
                                          containerId,
                                          'container-resources'
                                        )
                                      }
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </VStack>
                              </SectionCard.Content>
                            </SectionCard>
                          )}
                          {containerStatus['container-resources'] === 'pre' && (
                            <PreSection title="Resources" />
                          )}
                          {containerStatus['container-resources'] === 'skipped' && (
                            <SkippedSection
                              title="Resources"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-resources')
                              }
                            />
                          )}
                          {containerStatus['container-resources'] === 'done' && (
                            <DoneSection
                              title="Resources"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-resources')
                              }
                            >
                              <SectionCard.DataRow
                                label="CPU Request"
                                value={config.cpuRequest || '-'}
                                showDivider={false}
                              />
                              <SectionCard.DataRow
                                label="Memory Request"
                                value={config.memoryRequest || '-'}
                              />
                              <SectionCard.DataRow
                                label="CPU Limit"
                                value={config.cpuLimit || '-'}
                              />
                              <SectionCard.DataRow
                                label="Memory Limit"
                                value={config.memoryLimit || '-'}
                              />
                            </DoneSection>
                          )}
                          {containerStatus['container-resources'] === 'writing' && (
                            <WritingSection
                              title="Resources"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-resources')
                              }
                            />
                          )}

                          {/* Health Checks Section */}
                          {containerStatus['container-health'] === 'active' && (
                            <SectionCard isActive>
                              <SectionCard.Header
                                title="Health Checks"
                                showDivider
                                actions={
                                  editingContainerSection === 'container-health' ? (
                                    <HStack gap={2}>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleContainerEditCancel(containerId)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleContainerEditDone(containerId)}
                                      >
                                        Done
                                      </Button>
                                    </HStack>
                                  ) : undefined
                                }
                              />
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

                                  <div className="flex justify-end pt-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleContainerSectionNext(containerId, 'container-health')
                                      }
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </VStack>
                              </SectionCard.Content>
                            </SectionCard>
                          )}
                          {containerStatus['container-health'] === 'pre' && (
                            <PreSection title="Health Checks" />
                          )}
                          {containerStatus['container-health'] === 'skipped' && (
                            <SkippedSection
                              title="Health Checks"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-health')
                              }
                            />
                          )}
                          {containerStatus['container-health'] === 'done' && (
                            <DoneSection
                              title="Health Checks"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-health')
                              }
                            >
                              <SectionCard.DataRow
                                label="Liveness Probe"
                                value={config.livenessProbe?.enabled ? 'Enabled' : 'Disabled'}
                                showDivider={false}
                              />
                              <SectionCard.DataRow
                                label="Readiness Probe"
                                value={config.readinessProbe?.enabled ? 'Enabled' : 'Disabled'}
                              />
                            </DoneSection>
                          )}
                          {containerStatus['container-health'] === 'writing' && (
                            <WritingSection
                              title="Health Checks"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-health')
                              }
                            />
                          )}

                          {/* Volume Mounts Section */}
                          {containerStatus['container-volume-mounts'] === 'active' && (
                            <SectionCard isActive>
                              <SectionCard.Header
                                title="Volume Mounts"
                                showDivider
                                actions={
                                  editingContainerSection === 'container-volume-mounts' ? (
                                    <HStack gap={2}>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleContainerEditCancel(containerId)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleContainerEditDone(containerId)}
                                      >
                                        Done
                                      </Button>
                                    </HStack>
                                  ) : undefined
                                }
                              />
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

                                  <div className="flex justify-end pt-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleContainerSectionNext(
                                          containerId,
                                          'container-volume-mounts'
                                        )
                                      }
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </VStack>
                              </SectionCard.Content>
                            </SectionCard>
                          )}
                          {containerStatus['container-volume-mounts'] === 'pre' && (
                            <PreSection title="Volume Mounts" />
                          )}
                          {containerStatus['container-volume-mounts'] === 'skipped' && (
                            <SkippedSection
                              title="Volume Mounts"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-volume-mounts')
                              }
                            />
                          )}
                          {containerStatus['container-volume-mounts'] === 'done' && (
                            <DoneSection
                              title="Volume Mounts"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-volume-mounts')
                              }
                            >
                              <SectionCard.DataRow
                                label="Volume Mounts"
                                value={`${(config.volumeMounts || []).length} mount(s) configured`}
                                showDivider={false}
                              />
                            </DoneSection>
                          )}
                          {containerStatus['container-volume-mounts'] === 'writing' && (
                            <WritingSection
                              title="Volume Mounts"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-volume-mounts')
                              }
                            />
                          )}

                          {/* Security Context Section */}
                          {containerStatus['container-security'] === 'active' && (
                            <SectionCard isActive>
                              <SectionCard.Header
                                title="Security Context"
                                showDivider
                                actions={
                                  editingContainerSection === 'container-security' ? (
                                    <HStack gap={2}>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleContainerEditCancel(containerId)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleContainerEditDone(containerId)}
                                      >
                                        Done
                                      </Button>
                                    </HStack>
                                  ) : undefined
                                }
                              />
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

                                  <div className="flex justify-end pt-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleContainerSectionNext(
                                          containerId,
                                          'container-security'
                                        )
                                      }
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </VStack>
                              </SectionCard.Content>
                            </SectionCard>
                          )}
                          {containerStatus['container-security'] === 'pre' && (
                            <PreSection title="Security Context" />
                          )}
                          {containerStatus['container-security'] === 'skipped' && (
                            <SkippedSection
                              title="Security Context"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-security')
                              }
                            />
                          )}
                          {containerStatus['container-security'] === 'done' && (
                            <DoneSection
                              title="Security Context"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-security')
                              }
                            >
                              <SectionCard.DataRow
                                label="Run As User"
                                value={config.runAsUser || '-'}
                                showDivider={false}
                              />
                              <SectionCard.DataRow
                                label="Run As Group"
                                value={config.runAsGroup || '-'}
                              />
                              <SectionCard.DataRow
                                label="Privileged"
                                value={config.privileged ? 'Yes' : 'No'}
                              />
                              <SectionCard.DataRow
                                label="Read-only Root"
                                value={config.readOnlyRootFilesystem ? 'Yes' : 'No'}
                              />
                            </DoneSection>
                          )}
                          {containerStatus['container-security'] === 'writing' && (
                            <WritingSection
                              title="Security Context"
                              onEdit={() =>
                                handleContainerSectionEdit(containerId, 'container-security')
                              }
                            />
                          )}
                        </>
                      );
                    })()}
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar
                  cronjobSectionStatus={cronjobSectionStatus}
                  podSectionStatus={podSectionStatus}
                  containerStatuses={containerStatuses}
                  containerSectionStatus={containerSectionStatus}
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

export default CreateCronJobPage;
