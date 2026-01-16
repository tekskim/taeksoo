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
  IconEdit,
  IconHelp,
  IconCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type DeploymentSectionStep = 'basic-info' | 'labels-annotations' | 'scaling-policy';
type SectionState = 'pre' | 'active' | 'done' | 'writing';

// Section labels for display
const DEPLOYMENT_SECTION_LABELS: Record<DeploymentSectionStep, string> = {
  'basic-info': 'Basic Information',
  'labels-annotations': 'Labels & Annotations',
  'scaling-policy': 'Scaling and Upgrade Policy',
};

// Section order for navigation
const DEPLOYMENT_SECTION_ORDER: DeploymentSectionStep[] = [
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
   PreSection Component
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
          {title}
        </h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component
   ---------------------------------------- */

interface WritingSectionProps {
  title: string;
}

function WritingSection({ title }: WritingSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center justify-between">
        <h5 className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
          {title}
        </h5>
        <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   DoneSection Component
   ---------------------------------------- */

interface DoneSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function DoneSection({ title, onEdit, children }: DoneSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header
        title={title}
        showDivider
        actions={
          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
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
    <div className="size-4 rounded-full border border-[var(--color-border-default)] shrink-0" style={{ borderStyle: 'dashed' }} />
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  deploymentSectionStatus: Record<DeploymentSectionStep, SectionState>;
  podStatus: SectionState;
  containerStatuses: { id: string; name: string; status: SectionState }[];
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({ 
  deploymentSectionStatus, 
  podStatus,
  containerStatuses,
  onCancel, 
  onCreate, 
  isCreateDisabled 
}: SummarySidebarProps) {
  const [deploymentExpanded, setDeploymentExpanded] = useState(true);

  // Map SectionState to WizardSectionState
  const mapState = (state: SectionState): WizardSectionState => {
    if (state === 'pre') return 'pre';
    if (state === 'active') return 'active';
    if (state === 'writing') return 'writing';
    return 'done';
  };

  // Check if all deployment sections are done
  const allDeploymentDone = DEPLOYMENT_SECTION_ORDER.every(
    (key) => deploymentSectionStatus[key] === 'done'
  );

  return (
    <div className="w-[312px] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Summary Content */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Title */}
            <span className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
              Summary
            </span>

            <VStack gap={0}>
              {/* Deployment Section (Collapsible Parent) */}
              <HStack 
                justify="between" 
                align="center" 
                className="py-1 cursor-pointer"
                onClick={() => setDeploymentExpanded(!deploymentExpanded)}
              >
                <HStack gap={1} align="center">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {deploymentExpanded ? '▼' : '▶'}
                  </span>
                  <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)]">
                    Deployment
                  </span>
                </HStack>
                {allDeploymentDone && <SummaryStatusIcon status="done" />}
              </HStack>

              {/* Deployment Sub-items (Indented) */}
              {deploymentExpanded && (
                <VStack gap={0} className="pl-4">
                  {DEPLOYMENT_SECTION_ORDER.map((key) => {
                    const status = mapState(deploymentSectionStatus[key]);
                    return (
                      <HStack 
                        key={key}
                        justify="between" 
                        align="center" 
                        className="py-1"
                      >
                        <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
                          {DEPLOYMENT_SECTION_LABELS[key]}
                        </span>
                        {status === 'writing' ? (
                          <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
                        ) : (
                          <SummaryStatusIcon status={status} />
                        )}
                      </HStack>
                    );
                  })}
                </VStack>
              )}

              {/* Pod Section (Top-level) */}
              <HStack 
                justify="between" 
                align="center" 
                className="py-1"
              >
                <HStack gap={1} align="center">
                  <span className="text-[10px] text-[var(--color-text-muted)]">▶</span>
                  <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)]">
                    Pod
                  </span>
                </HStack>
                {mapState(podStatus) === 'writing' ? (
                  <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
                ) : (
                  <SummaryStatusIcon status={mapState(podStatus)} />
                )}
              </HStack>

              {/* Container Sections (Top-level) */}
              {containerStatuses.map((container) => {
                const status = mapState(container.status);
                return (
                  <HStack 
                    key={container.id}
                    justify="between" 
                    align="center" 
                    className="py-1"
                  >
                    <HStack gap={1} align="center">
                      <span className="text-[10px] text-[var(--color-text-muted)]">▶</span>
                      <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)]">
                        {container.name}
                      </span>
                    </HStack>
                    {status === 'writing' ? (
                      <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
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
            Create Deployment
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
            <NumberInput
              value={replicas}
              onChange={onReplicasChange}
              min={1}
              max={100}
              fullWidth
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
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Key</span>
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Value</span>
                  <div />
                </div>
                
                {labels.map((label, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center">
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
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Key</span>
                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Value</span>
                  <div />
                </div>
                
                {annotations.map((annotation, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center">
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
              <Tooltip content="Create new pods, until max surge is reached, before deleting old pods. Don't stop more pods than max unavailable." position="right">
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
                    The minimum time a pod must remain in a ready state before it is considered available.
                  </p>
                  <HStack gap={2}>
                    <NumberInput
                      value={minReady}
                      onChange={onMinReadyChange}
                      min={0}
                      className="w-[120px]"
                      hideSteppers
                    />
                    <span className="flex items-center text-[12px] text-[var(--color-text-default)]">Seconds</span>
                  </HStack>
                </VStack>

                <VStack gap={2}>
                  <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                    Revision History Limit
                  </label>
                  <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                    The maximum number of revision histories to retain for the Deployment.
                  </p>
                  <HStack gap={2}>
                    <NumberInput
                      value={revisionHistoryLimit}
                      onChange={onRevisionHistoryLimitChange}
                      min={0}
                      className="w-[120px]"
                      hideSteppers
                    />
                    <span className="flex items-center text-[12px] text-[var(--color-text-default)]">Revisions</span>
                  </HStack>
                </VStack>
              </div>

              {/* Progress Deadline */}
              <VStack gap={2} className="max-w-[calc(50%-8px)]">
                <label className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                  Progress Deadline
                </label>
                <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                  The maximum time allowed for a Deployment to progress before it is considered failed.
                </p>
                <HStack gap={2}>
                  <NumberInput
                    value={progressDeadline}
                    onChange={onProgressDeadlineChange}
                    min={0}
                    className="w-[120px]"
                    hideSteppers
                  />
                  <span className="flex items-center text-[12px] text-[var(--color-text-default)]">Seconds</span>
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

export function CreateDeploymentPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active tab (Deployment, Pod, Container-X)
  const [activeTab, setActiveTab] = useState('deployment');
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

  // Section states for Deployment tab
  const [deploymentSectionStatus, setDeploymentSectionStatus] = useState<Record<DeploymentSectionStep, SectionState>>({
    'basic-info': 'active',
    'labels-annotations': 'pre',
    'scaling-policy': 'pre',
  });

  // Pod and Container states
  const [podStatus, setPodStatus] = useState<SectionState>('pre');
  const [containerStatuses, setContainerStatuses] = useState<{ id: string; name: string; status: SectionState }[]>([
    { id: 'container-0', name: 'Container-0', status: 'pre' },
  ]);

  // Pod Labels & Annotations state
  const [podLabels, setPodLabels] = useState<Label[]>([]);
  const [podAnnotations, setPodAnnotations] = useState<Annotation[]>([]);

  // Editing state
  const [editingSection, setEditingSection] = useState<DeploymentSectionStep | null>(null);

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Deployment');
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
  const handleNext = useCallback((currentSection: DeploymentSectionStep) => {
    const currentIndex = DEPLOYMENT_SECTION_ORDER.indexOf(currentSection);
    const nextSection = DEPLOYMENT_SECTION_ORDER[currentIndex + 1];

    setDeploymentSectionStatus((prev) => ({
      ...prev,
      [currentSection]: 'done',
      ...(nextSection && { [nextSection]: 'active' }),
    }));

    // If this was the last deployment section, mark Pod as active
    if (!nextSection) {
      setPodStatus('done');
      setContainerStatuses((prev) => 
        prev.map((c, i) => i === 0 ? { ...c, status: 'done' } : c)
      );
    }
  }, []);

  // Handle edit
  const handleEdit = useCallback((section: DeploymentSectionStep) => {
    setEditingSection(section);
    const sectionIndex = DEPLOYMENT_SECTION_ORDER.indexOf(section);

    setDeploymentSectionStatus((prev) => {
      const newStatus = { ...prev };
      DEPLOYMENT_SECTION_ORDER.forEach((key, index) => {
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

    setDeploymentSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      const editIndex = DEPLOYMENT_SECTION_ORDER.indexOf(editingSection);
      for (let i = editIndex + 1; i < DEPLOYMENT_SECTION_ORDER.length; i++) {
        if (newStatus[DEPLOYMENT_SECTION_ORDER[i]] === 'writing') {
          newStatus[DEPLOYMENT_SECTION_ORDER[i]] = 'done';
        }
      }
      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  // Handle edit done
  const handleEditDone = useCallback(() => {
    if (!editingSection) return;

    setDeploymentSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      const editIndex = DEPLOYMENT_SECTION_ORDER.indexOf(editingSection);
      for (let i = editIndex + 1; i < DEPLOYMENT_SECTION_ORDER.length; i++) {
        if (newStatus[DEPLOYMENT_SECTION_ORDER[i]] === 'writing') {
          newStatus[DEPLOYMENT_SECTION_ORDER[i]] = 'done';
        }
      }
      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  const handleCancel = useCallback(() => {
    navigate('/container/deployments');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      setNameError('Name is required.');
      setDeploymentSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
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

  const removeLabel = useCallback((index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
  }, [labels]);

  const updateLabel = useCallback((index: number, field: 'key' | 'value', value: string) => {
    const newLabels = [...labels];
    newLabels[index][field] = value;
    setLabels(newLabels);
  }, [labels]);

  // Annotation management
  const addAnnotation = useCallback(() => {
    setAnnotations([...annotations, { key: '', value: '' }]);
  }, [annotations]);

  const removeAnnotation = useCallback((index: number) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
  }, [annotations]);

  const updateAnnotation = useCallback((index: number, field: 'key' | 'value', value: string) => {
    const newAnnotations = [...annotations];
    newAnnotations[index][field] = value;
    setAnnotations(newAnnotations);
  }, [annotations]);

  // Pod Label management
  const addPodLabel = useCallback(() => {
    setPodLabels([...podLabels, { key: '', value: '' }]);
  }, [podLabels]);

  const removePodLabel = useCallback((index: number) => {
    setPodLabels(podLabels.filter((_, i) => i !== index));
  }, [podLabels]);

  const updatePodLabel = useCallback((index: number, field: 'key' | 'value', value: string) => {
    const newLabels = [...podLabels];
    newLabels[index][field] = value;
    setPodLabels(newLabels);
  }, [podLabels]);

  // Pod Annotation management
  const addPodAnnotation = useCallback(() => {
    setPodAnnotations([...podAnnotations, { key: '', value: '' }]);
  }, [podAnnotations]);

  const removePodAnnotation = useCallback((index: number) => {
    setPodAnnotations(podAnnotations.filter((_, i) => i !== index));
  }, [podAnnotations]);

  const updatePodAnnotation = useCallback((index: number, field: 'key' | 'value', value: string) => {
    const newAnnotations = [...podAnnotations];
    newAnnotations[index][field] = value;
    setPodAnnotations(newAnnotations);
  }, [podAnnotations]);

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

  const removeContainerTab = useCallback((id: string) => {
    if (containerTabs.length <= 1) return;
    setContainerTabs(containerTabs.filter((c) => c.id !== id));
    setContainerStatuses(containerStatuses.filter((c) => c.id !== id));
    if (activeTab === id) {
      setActiveTab('deployment');
    }
  }, [containerTabs, containerStatuses, activeTab]);

  // Check if create button should be disabled (all sections must be complete)
  const allDeploymentSectionsDone = DEPLOYMENT_SECTION_ORDER.every(
    (key) => deploymentSectionStatus[key] === 'done'
  );
  const podDone = podStatus === 'done';
  const allContainersDone = containerStatuses.every((c) => c.status === 'done');
  const isCreateDisabled = !allDeploymentSectionsDone || !podDone || !allContainersDone;

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
    { id: 'deployment', label: 'Deployment' },
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
                  Deployment manage the lifecycle of your application Pods, enabling rolling updates and automated recovery.
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
                  {activeTab === 'deployment' && (
                    <>
                      {/* Basic Information Section */}
                      {deploymentSectionStatus['basic-info'] === 'pre' && (
                        <PreSection title={DEPLOYMENT_SECTION_LABELS['basic-info']} />
                      )}
                      {deploymentSectionStatus['basic-info'] === 'writing' && (
                        <WritingSection title={DEPLOYMENT_SECTION_LABELS['basic-info']} />
                      )}
                      {deploymentSectionStatus['basic-info'] === 'active' && (
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
                      {deploymentSectionStatus['basic-info'] === 'done' && (
                        <DoneSection
                          title={DEPLOYMENT_SECTION_LABELS['basic-info']}
                          onEdit={() => handleEdit('basic-info')}
                        >
                          <SectionCard.DataRow label="Namespace" value={namespace} showDivider={false} />
                          <SectionCard.DataRow label="Name" value={name} />
                          <SectionCard.DataRow label="Replicas" value={replicas.toString()} />
                          <SectionCard.DataRow label="Description" value={description || '-'} />
                        </DoneSection>
                      )}

                      {/* Labels & Annotations Section */}
                      {deploymentSectionStatus['labels-annotations'] === 'pre' && (
                        <PreSection title={DEPLOYMENT_SECTION_LABELS['labels-annotations']} />
                      )}
                      {deploymentSectionStatus['labels-annotations'] === 'writing' && (
                        <WritingSection title={DEPLOYMENT_SECTION_LABELS['labels-annotations']} />
                      )}
                      {deploymentSectionStatus['labels-annotations'] === 'active' && (
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
                      {deploymentSectionStatus['labels-annotations'] === 'done' && (
                        <DoneSection
                          title={DEPLOYMENT_SECTION_LABELS['labels-annotations']}
                          onEdit={() => handleEdit('labels-annotations')}
                        >
                          <SectionCard.DataRow label="Labels" value={getLabelsDisplay()} showDivider={false} />
                          <SectionCard.DataRow label="Annotations" value={getAnnotationsDisplay()} />
                        </DoneSection>
                      )}

                      {/* Scaling and Upgrade Policy Section */}
                      {deploymentSectionStatus['scaling-policy'] === 'pre' && (
                        <PreSection title={DEPLOYMENT_SECTION_LABELS['scaling-policy']} />
                      )}
                      {deploymentSectionStatus['scaling-policy'] === 'writing' && (
                        <WritingSection title={DEPLOYMENT_SECTION_LABELS['scaling-policy']} />
                      )}
                      {deploymentSectionStatus['scaling-policy'] === 'active' && (
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
                      {deploymentSectionStatus['scaling-policy'] === 'done' && (
                        <DoneSection
                          title={DEPLOYMENT_SECTION_LABELS['scaling-policy']}
                          onEdit={() => handleEdit('scaling-policy')}
                        >
                          <SectionCard.DataRow label="Strategy" value={strategy === 'rolling-update' ? 'Rolling Update' : 'Recreate'} showDivider={false} />
                          {strategy === 'rolling-update' && (
                            <>
                              <SectionCard.DataRow label="Max Surge" value={`${maxSurge}${maxSurgeUnit}`} />
                              <SectionCard.DataRow label="Max Unavailable" value={`${maxUnavailable}${maxUnavailableUnit}`} />
                              <SectionCard.DataRow label="Minimum Ready" value={`${minReady} seconds`} />
                              <SectionCard.DataRow label="Revision History Limit" value={`${revisionHistoryLimit} revisions`} />
                              <SectionCard.DataRow label="Progress Deadline" value={`${progressDeadline} seconds`} />
                            </>
                          )}
                        </DoneSection>
                      )}
                    </>
                  )}

                  {activeTab === 'pod' && (
                    <>
                      {/* Labels & Annotations */}
                      <SectionCard isActive={podStatus === 'active' || podStatus === 'pre'}>
                        <SectionCard.Header
                          title="Labels & Annotations"
                          showDivider
                        />
                        <SectionCard.Content>
                          <VStack gap={6}>
                            {/* Labels */}
                            <VStack gap={3}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">Labels</span>
                              {podLabels.length > 0 && (
                                <>
                                  <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Key</span>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Value</span>
                                    <div />
                                  </div>
                                  {podLabels.map((label, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center">
                                      <Input
                                        placeholder="Key"
                                        value={label.key}
                                        onChange={(e) => updatePodLabel(index, 'key', e.target.value)}
                                        fullWidth
                                      />
                                      <Input
                                        placeholder="Value"
                                        value={label.value}
                                        onChange={(e) => updatePodLabel(index, 'value', e.target.value)}
                                        fullWidth
                                      />
                                      <button
                                        onClick={() => removePodLabel(index)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                      >
                                        <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
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
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">Annotations</span>
                              {podAnnotations.length > 0 && (
                                <>
                                  <div className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full">
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Key</span>
                                    <span className="text-[11px] font-medium text-[var(--color-text-default)]">Value</span>
                                    <div />
                                  </div>
                                  {podAnnotations.map((annotation, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-4 w-full items-center">
                                      <Input
                                        placeholder="Key"
                                        value={annotation.key}
                                        onChange={(e) => updatePodAnnotation(index, 'key', e.target.value)}
                                        fullWidth
                                      />
                                      <Input
                                        placeholder="Value"
                                        value={annotation.value}
                                        onChange={(e) => updatePodAnnotation(index, 'value', e.target.value)}
                                        fullWidth
                                      />
                                      <button
                                        onClick={() => removePodAnnotation(index)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                      >
                                        <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
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
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Scaling and Upgrade Policy</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <VStack gap={3} className="py-5">
                            <span className="text-[14px] font-medium text-[var(--color-text-default)]">Pod Policy</span>
                            <div className="pl-3 w-full max-w-[578px]">
                              <VStack gap={1}>
                                <span className="text-[11px] font-medium text-[var(--color-text-default)]">Termination Grace Period</span>
                                <span className="text-[12px] text-[var(--color-text-subtle)]">
                                  The period allowed after receiving a termination request before the pod is forcibly terminated.
                                </span>
                                <HStack gap={2} className="w-full">
                                  <Input placeholder="30" fullWidth />
                                  <span className="text-[12px] text-[var(--color-text-default)] whitespace-nowrap">Seconds</span>
                                </HStack>
                              </VStack>
                            </div>
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>

                      {/* Networking */}
                      <SectionCard>
                        <SectionCard.Header title="Networking" showDivider />
                        <SectionCard.Content>
                          <VStack gap={4} className="pl-3">
                            {/* Network Settings */}
                            <VStack gap={3}>
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">Network Settings</span>
                              <div className="grid grid-cols-2 gap-3 w-full pl-3">
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Network Mode</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Select the networking mode for the pod.</span>
                                  <Select
                                    options={[
                                      { value: 'normal', label: 'Normal' },
                                      { value: 'host', label: 'Host' },
                                    ]}
                                    placeholder="Normal"
                                    fullWidth
                                  />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">DNS Policy</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Select the DNS policy to apply to the pod.</span>
                                  <Select
                                    options={[
                                      { value: 'cluster-first', label: 'Cluster First' },
                                      { value: 'default', label: 'Default' },
                                      { value: 'none', label: 'None' },
                                    ]}
                                    placeholder="Cluster First"
                                    fullWidth
                                  />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Hostname</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the hostname assigned to the pod</span>
                                  <Input placeholder="e.g. web" fullWidth />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Subdomain</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the subdomain assigned to the pod.</span>
                                  <Input placeholder="e.g. web" fullWidth />
                                </VStack>
                              </div>
                            </VStack>

                            {/* Nameservers & Search Domains */}
                            <div className="grid grid-cols-2 gap-3 w-full">
                              <VStack gap={2}>
                                <VStack gap={1}>
                                  <span className="text-[14px] font-medium text-[var(--color-text-default)]">Nameservers</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the DNS nameserver addresses used by the pod.</span>
                                </VStack>
                                <Button variant="secondary" size="sm">
                                  <IconPlus size={12} stroke={1.5} />
                                  Add Nameserver
                                </Button>
                              </VStack>
                              <VStack gap={2}>
                                <VStack gap={1}>
                                  <span className="text-[14px] font-medium text-[var(--color-text-default)]">Search Domains</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the search domains used for DNS resolution.</span>
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
                                <span className="text-[14px] font-medium text-[var(--color-text-default)]">Resolver Options</span>
                              </VStack>
                              <div className="grid grid-cols-2 gap-3 w-full pl-3">
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Name</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the name of the DNS resolver option.</span>
                                  <Input placeholder="input name" fullWidth />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Value</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">The value of the DNS resolver option.</span>
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
                                <span className="text-[14px] font-medium text-[var(--color-text-default)]">Host Aliases</span>
                              </VStack>
                              <div className="grid grid-cols-2 gap-3 w-full pl-3">
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">IP Address</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the IP address used for the host alias.</span>
                                  <Input placeholder="e.g. 127.0.0.1" fullWidth />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Hostnames</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the hostnames mapped to the IP address.</span>
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
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Node Scheduling</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <VStack gap={2} className="py-4">
                            <RadioGroup defaultValue="any">
                              <Radio value="any" label="Run pods on any available node" />
                              <Radio value="specific" label="Run pods on specific node(s)" />
                              <Radio value="matching" label="Run pods on node(s) matching scheduling rules" />
                            </RadioGroup>
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>

                      {/* Pod Scheduling */}
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Pod Scheduling</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <VStack gap={2} className="py-4">
                            <Button variant="secondary" size="sm">
                              <IconPlus size={12} stroke={1.5} />
                              Add Pod Selector
                            </Button>
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>

                      {/* Resources */}
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Resources</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <VStack gap={4} className="py-4">
                            {/* Tolerations */}
                            <VStack gap={2}>
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">Tolerations</span>
                              <Button variant="secondary" size="sm">
                                <IconPlus size={12} stroke={1.5} />
                                Add Toleration
                              </Button>
                            </VStack>

                            {/* Priority */}
                            <VStack gap={2}>
                              <span className="text-[14px] font-medium text-[var(--color-text-default)]">Priority</span>
                              <div className="grid grid-cols-2 gap-3 w-full pl-3">
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Priority</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the DNS nameserver addresses used by the pod.</span>
                                  <Input placeholder="" fullWidth />
                                </VStack>
                                <VStack gap={1}>
                                  <span className="text-[11px] font-medium text-[var(--color-text-default)]">Priority Class Name</span>
                                  <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the DNS nameserver addresses used by the pod.</span>
                                  <Input placeholder="" fullWidth />
                                </VStack>
                              </div>
                            </VStack>
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>

                      {/* Security Context */}
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Security Context</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <VStack gap={2} className="py-4">
                            <VStack gap={1} className="max-w-[578px]">
                              <span className="text-[11px] font-medium text-[var(--color-text-default)]">Pod Filesystem Group</span>
                              <span className="text-[12px] text-[var(--color-text-subtle)]">Specify the filesystem group used by the pod.</span>
                              <Select
                                options={[
                                  { value: '1', label: '1' },
                                  { value: '1000', label: '1000' },
                                ]}
                                placeholder="1"
                                fullWidth
                              />
                            </VStack>
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>

                      {/* Storage */}
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Storage</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <VStack gap={2} className="py-4">
                            <Button variant="secondary" size="sm">
                              <IconPlus size={12} stroke={1.5} />
                              Add Volume
                            </Button>
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>

                      {/* Done Button */}
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setPodStatus('done');
                            // Activate first container
                            setContainerStatuses((prev) =>
                              prev.map((c, i) => (i === 0 ? { ...c, status: 'active' } : c))
                            );
                            // Switch to first container tab
                            if (containerTabs.length > 0) {
                              setActiveTab(containerTabs[0].id);
                            }
                          }}
                        >
                          Done
                        </Button>
                      </div>
                    </>
                  )}

                  {activeTab.startsWith('container-') && (
                    <SectionCard>
                      <SectionCard.Header title={`${containerTabs.find((c) => c.id === activeTab)?.name || 'Container'} Configuration`} showDivider />
                      <SectionCard.Content>
                        <p className="text-[12px] text-[var(--color-text-muted)]">
                          Container configuration options will be available here.
                        </p>
                      </SectionCard.Content>
                    </SectionCard>
                  )}
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar
                  deploymentSectionStatus={deploymentSectionStatus}
                  podStatus={podStatus}
                  containerStatuses={containerStatuses}
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
