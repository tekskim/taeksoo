import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  FormField,
  HStack,
  VStack,
  TabBar,
  TopBar,
  PageShell,
  Input,
  NumberInput,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  SectionCard,
  Disclosure,
  InlineMessage,
  WizardSummary,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { useIsV2 } from '@/hooks/useIsV2';
import { IconCirclePlus, IconX } from '@tabler/icons-react';
import {
  findSnapshotByName,
  restorableSnapshots,
  restoreSizeInGi,
} from './containerVolumeSnapshotsData';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'volume-claim' | 'storage-config' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic information',
  'volume-claim': 'Volume claim',
  'storage-config': 'Customize',
  'labels-annotations': 'Labels & annotations',
};

// Section order for sidebar
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'volume-claim',
  'storage-config',
  'labels-annotations',
];

// Namespace options
const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'production', label: 'production' },
  // 스냅샷이 있는 네임스페이스 — 복원은 원본과 같은 네임스페이스에서만 된다.
  { value: 'database', label: 'database' },
  { value: 'devtools', label: 'devtools' },
  { value: 'metis-training', label: 'metis-training' },
  { value: 'maxis', label: 'maxis' },
];

// Storage class options for Volume Claim
const STORAGE_CLASS_OPTIONS = [
  { value: 'default', label: 'Default storage class' },
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'slow', label: 'slow' },
];

// Persistent Volume options
const PERSISTENT_VOLUME_OPTIONS = [
  { value: 'pv-001', label: 'pv-001' },
  { value: 'pv-002', label: 'pv-002' },
  { value: 'pv-003', label: 'pv-003' },
];

// Access Mode options
const ACCESS_MODE_OPTIONS = [
  { value: 'ReadWriteOnce', label: 'ReadWriteOnce' },
  { value: 'ReadOnlyMany', label: 'ReadOnlyMany' },
  { value: 'ReadWriteMany', label: 'ReadWriteMany' },
  { value: 'ReadWriteOncePod', label: 'ReadWriteOncePod' },
];

// Reclaim Policy options
const RECLAIM_POLICY_OPTIONS = [
  { value: 'Retain', label: 'Retain' },
  { value: 'Recycle', label: 'Recycle' },
  { value: 'Delete', label: 'Delete' },
];

// Volume Mode options
const VOLUME_MODE_OPTIONS = [
  { value: 'Filesystem', label: 'Filesystem' },
  { value: 'Block', label: 'Block' },
];

// Capacity Unit options
const CAPACITY_UNIT_OPTIONS = [
  { value: 'Gi', label: 'Gi' },
  { value: 'Mi', label: 'Mi' },
  { value: 'Ti', label: 'Ti' },
];

interface Label {
  key: string;
  value: string;
}

interface Annotation {
  key: string;
  value: string;
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatuses: Record<SectionStep, 'done' | 'active' | 'pending'>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({
  sectionStatuses,
  onCancel,
  onCreate,
  isCreateDisabled,
}: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => {
    const s = sectionStatuses[key];
    return {
      key,
      label: SECTION_LABELS[key],
      status: (s === 'pending' ? 'pre' : s) as WizardSectionState,
    };
  });

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-6">
        <WizardSummary items={summaryItems} />

        {/* Button row */}
        <HStack gap={2}>
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
  pvcName: string;
  onNamespaceNameChange: (value: string) => void;
  pvcNameError: string | null;
  onNamespaceNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  isV2: boolean;
}

function BasicInfoSection({
  namespace,
  onNamespaceChange,
  pvcName,
  onNamespaceNameChange,
  pvcNameError,
  onNamespaceNameErrorChange,
  description,
  onDescriptionChange,
  isV2,
}: BasicInfoSectionProps) {
  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Basic information" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Namespace */}
          <FormField label="Namespace" required>
            <Select
              options={NAMESPACE_OPTIONS}
              value={namespace}
              onChange={onNamespaceChange}
              fullWidth
            />
          </FormField>

          {/* Name */}
          <FormField
            label="Name"
            required
            error={!!pvcNameError}
            errorMessage={pvcNameError || undefined}
          >
            <Input
              placeholder="Enter a unique name"
              value={pvcName}
              onChange={(e) => {
                onNamespaceNameChange(e.target.value);
                if (pvcNameError) onNamespaceNameErrorChange(null);
              }}
              error={!!pvcNameError}
              fullWidth
            />
          </FormField>

          {/* Description */}
          <Disclosure defaultOpen>
            <Disclosure.Trigger>Description</Disclosure.Trigger>
            <Disclosure.Panel>
              <div className="pt-2">
                <Input
                  placeholder="Enter a description (optional)"
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
   VolumeClaimSection Component
   ---------------------------------------- */

type VolumeSourceType = 'storage-class' | 'existing-pv' | 'snapshot';

interface VolumeClaimSectionProps {
  sourceType: VolumeSourceType;
  onSourceTypeChange: (value: VolumeSourceType) => void;
  storageClass: string;
  onStorageClassChange: (value: string) => void;
  requestStorage: string;
  onRequestStorageChange: (value: string) => void;
  /** 복원할 스냅샷 이름. sourceType이 'snapshot'일 때만 쓴다. */
  sourceSnapshot: string;
  onSourceSnapshotChange: (value: string) => void;
}

function VolumeClaimSection({
  sourceType,
  onSourceTypeChange,
  storageClass,
  onStorageClassChange,
  requestStorage,
  onRequestStorageChange,
  sourceSnapshot,
  onSourceSnapshotChange,
}: VolumeClaimSectionProps) {
  const snapshot = findSnapshotByName(sourceSnapshot);
  // 새 볼륨은 스냅샷보다 작을 수 없다. 그래서 최솟값을 스냅샷 크기로 올린다.
  const minStorage = sourceType === 'snapshot' && snapshot ? restoreSizeInGi(snapshot) : 1;
  const maxStorage = Math.max(1000, minStorage * 4);
  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Volume claim" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Source */}
          <FormField>
            <FormField.Label>Source</FormField.Label>
            <FormField.Control>
              <RadioGroup
                value={sourceType}
                onChange={(value) => onSourceTypeChange(value as VolumeSourceType)}
              >
                <VStack gap={2}>
                  <Radio
                    value="storage-class"
                    label="Use a Storage Class to provision a new Persistent Volume"
                  />
                  <Radio value="existing-pv" label="Use an existing Persistent Volume" />
                  {/* 복원은 원본을 덮어쓰는 것이 아니라 새 볼륨을 만드는 것이라
                      여기, 즉 "무엇으로부터 만들 것인가" 자리에 온다. */}
                  <Radio value="snapshot" label="Restore from a volume snapshot" />
                </VStack>
              </RadioGroup>
            </FormField.Control>
          </FormField>

          {/* Storage Class / Persistent Volume / Snapshot */}
          {sourceType === 'snapshot' ? (
            <FormField required>
              <FormField.Label>Volume snapshot</FormField.Label>
              <FormField.Control>
                <Select
                  options={restorableSnapshots().map((s) => ({
                    value: s.name,
                    label: `${s.name} — ${s.namespace} · ${s.restoreSize}`,
                  }))}
                  value={sourceSnapshot}
                  onChange={(value) => onSourceSnapshotChange(value)}
                  placeholder="Select a snapshot"
                  fullWidth
                />
              </FormField.Control>
            </FormField>
          ) : (
            <FormField>
              <FormField.Label>
                {sourceType === 'existing-pv' ? 'Persistent volume' : 'Storage Class'}
              </FormField.Label>
              <FormField.Control>
                <Select
                  options={
                    sourceType === 'existing-pv' ? PERSISTENT_VOLUME_OPTIONS : STORAGE_CLASS_OPTIONS
                  }
                  value={storageClass}
                  onChange={(value) => onStorageClassChange(value)}
                  fullWidth
                />
              </FormField.Control>
            </FormField>
          )}

          {snapshot && sourceType === 'snapshot' && (
            <InlineMessage variant="info">
              This creates a <strong>new</strong> volume from{' '}
              <span className="font-mono">{snapshot.name}</span>. The source volume{' '}
              <span className="font-mono">{snapshot.sourcePvc}</span> is not touched. The new volume
              must be at least <strong>{snapshot.restoreSize}</strong>, and it has to live in the{' '}
              <span className="font-mono">{snapshot.namespace}</span> namespace.
            </InlineMessage>
          )}

          {/* Request Storage */}
          <FormField required>
            <FormField.Label>Request Storage</FormField.Label>
            <FormField.Control>
              <NumberInput
                value={requestStorage}
                onChange={(value) => onRequestStorageChange(value)}
                min={minStorage}
                max={maxStorage}
                step={1}
                width="sm"
                suffix="GiB"
              />
            </FormField.Control>
          </FormField>
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Types for Storage Config
   ---------------------------------------- */

interface MountOption {
  key: string;
}

interface NodeSelectorRule {
  key: string;
  operator: string;
  value: string;
}

interface NodeSelector {
  rules: NodeSelectorRule[];
}

// Operator options for node selectors
const OPERATOR_OPTIONS = [
  { value: 'In', label: 'in list' },
  { value: 'NotIn', label: 'not in list' },
  { value: 'Exists', label: 'exists' },
  { value: 'DoesNotExist', label: 'does not exist' },
  { value: 'Gt', label: 'greater than' },
  { value: 'Lt', label: 'less than' },
];

/* ----------------------------------------
   StorageConfigSection Component
   ---------------------------------------- */

interface StorageConfigSectionProps {
  accessModes: {
    singleNodeReadWrite: boolean;
    manyNodesReadOnly: boolean;
    manyNodesReadWrite: boolean;
  };
  onAccessModesChange: (modes: {
    singleNodeReadWrite: boolean;
    manyNodesReadOnly: boolean;
    manyNodesReadWrite: boolean;
  }) => void;
}

function StorageConfigSection({ accessModes, onAccessModesChange }: StorageConfigSectionProps) {
  return (
    <SectionCard className="pb-4">
      <SectionCard.Header title="Customize" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Access Modes */}
          <FormField>
            <FormField.Label>Access Modes</FormField.Label>
            <FormField.Control>
              <VStack gap={2}>
                <Checkbox
                  checked={accessModes.singleNodeReadWrite}
                  onChange={(e) =>
                    onAccessModesChange({ ...accessModes, singleNodeReadWrite: e.target.checked })
                  }
                  label="Single node read-write"
                />
                <Checkbox
                  checked={accessModes.manyNodesReadOnly}
                  onChange={(e) =>
                    onAccessModesChange({ ...accessModes, manyNodesReadOnly: e.target.checked })
                  }
                  label="Many nodes read-only"
                />
                <Checkbox
                  checked={accessModes.manyNodesReadWrite}
                  onChange={(e) =>
                    onAccessModesChange({ ...accessModes, manyNodesReadWrite: e.target.checked })
                  }
                  label="Many nodes read-write"
                />
              </VStack>
            </FormField.Control>
          </FormField>
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
    <SectionCard className="pb-4">
      <SectionCard.Header title="Labels & Annotations" showDivider />
      <SectionCard.Content>
        <VStack gap={6}>
          {/* Labels */}
          <VStack gap={2}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the labels used to identify and categorize the resource.
              </p>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={2}>
                {labels.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
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
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
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
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                    >
                      <IconX size={14} className="text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} />}
                    onClick={onAddLabel}
                  >
                    Add Label
                  </Button>
                </div>
              </VStack>
            </div>
          </VStack>

          {/* Annotations */}
          <VStack gap={2}>
            <VStack gap={1}>
              <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                Specify the annotations used to provide additional metadata for the resource.
              </p>
            </VStack>

            <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
              <VStack gap={2}>
                {annotations.length > 0 && (
                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center">
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
                    className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
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
                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors shrink-0"
                    >
                      <IconX size={14} className="text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                ))}
                <div className="w-fit">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} />}
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
   Main Page Component
   ---------------------------------------- */

export function CreatePersistentVolumeClaimPage() {
  const navigate = useNavigate();
  const isV2 = useIsV2();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [namespace, setNamespace] = useState('default');
  const [pvcName, setNamespaceName] = useState('');
  const [description, setDescription] = useState('');

  // Volume Claim state
  const [sourceType, setSourceType] = useState<VolumeSourceType>('storage-class');
  const [storageClass, setStorageClass] = useState('default');
  const [requestStorage, setRequestStorage] = useState('10');
  const [sourceSnapshot, setSourceSnapshot] = useState('');

  /* 스냅샷을 고르면 네임스페이스와 크기가 따라온다.
     복원한 볼륨은 원본 스냅샷과 같은 네임스페이스에만 만들 수 있고,
     스냅샷보다 작게는 만들 수 없다. 사용자가 따로 맞추게 두지 않는다. */
  const applySnapshotSelection = useCallback((snapshotName: string) => {
    setSourceSnapshot(snapshotName);
    const snapshot = findSnapshotByName(snapshotName);
    if (!snapshot) return;
    setNamespace(snapshot.namespace);
    setRequestStorage(String(restoreSizeInGi(snapshot)));
  }, []);

  /* 스냅샷 상세·목록의 "Restore as new PVC"로 넘어온 경우.
     최초 1회만 적용한다. */
  const [searchParams] = useSearchParams();
  const fromSnapshot = searchParams.get('fromSnapshot');
  const restorePrefillDone = useRef(false);
  useEffect(() => {
    if (!fromSnapshot || restorePrefillDone.current) return;
    const snapshot = findSnapshotByName(fromSnapshot);
    if (!snapshot) return;
    restorePrefillDone.current = true;
    setSourceType('snapshot');
    applySnapshotSelection(snapshot.name);
    setNamespaceName(`${snapshot.name}-restored`);
  }, [fromSnapshot, applySnapshotSelection]);

  // Storage Configuration state
  const [accessModes, setAccessModes] = useState({
    singleNodeReadWrite: true,
    manyNodesReadOnly: false,
    manyNodesReadWrite: false,
  });

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>(isV2 ? [{ key: '', value: '' }] : []);
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ key: '', value: '' }] : []
  );

  // Validation errors
  const [pvcNameError, setNamespaceNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create persistent volume claim');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // Calculate section statuses for summary sidebar
  const getSectionStatuses = useCallback((): Record<SectionStep, 'done' | 'active' | 'pending'> => {
    return {
      'basic-info': pvcName.trim() ? 'done' : 'active',
      'volume-claim': requestStorage.trim() ? 'done' : 'pending',
      'storage-config': 'done', // Access modes have defaults
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pending',
    };
  }, [pvcName, requestStorage, labels.length, annotations.length]);

  const handleCancel = useCallback(() => {
    navigate('/container/pvc');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!pvcName.trim()) {
      setNamespaceNameError('Namespace name is required.');
      return;
    }

    console.log('Creating persistent volume claim:', {
      pvcName,
      description,
      namespace,
      volumeClaim: {
        sourceType,
        storageClass,
        requestStorage: `${requestStorage}GiB`,
        // 스냅샷 복원은 spec.dataSource로 내려간다.
        ...(sourceType === 'snapshot' && sourceSnapshot
          ? {
              dataSource: {
                apiGroup: 'snapshot.storage.k8s.io',
                kind: 'VolumeSnapshot',
                name: sourceSnapshot,
              },
            }
          : {}),
      },
      storageConfig: {
        accessModes,
      },
      labels,
      annotations,
    });
    navigate('/container/pvc');
  }, [
    pvcName,
    description,
    namespace,
    sourceType,
    storageClass,
    requestStorage,
    sourceSnapshot,
    accessModes,
    labels,
    annotations,
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

  // Check if create button should be disabled
  const isCreateDisabled = !pvcName.trim();

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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Persistent Volume Claims', href: '/container/pvc' },
                { label: 'Create PVC' },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={1}>
          <div className="flex items-center justify-between h-8">
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">
              Create persistent volume claim
            </h1>
          </div>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Persistent Volume Claim is a user request for persistent storage that defines the
            required capacity and access properties, allowing Kubernetes to bind or dynamically
            provision a suitable PersistentVolume.
          </p>
        </VStack>

        {/* Main Content with Sidebar */}
        <HStack gap={6} align="start" className="w-full">
          {/* Form Content */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information Section */}
            <BasicInfoSection
              namespace={namespace}
              onNamespaceChange={setNamespace}
              pvcName={pvcName}
              onNamespaceNameChange={setNamespaceName}
              pvcNameError={pvcNameError}
              onNamespaceNameErrorChange={setNamespaceNameError}
              description={description}
              onDescriptionChange={setDescription}
              isV2={isV2}
            />

            {/* Volume Claim Section */}
            <VolumeClaimSection
              sourceType={sourceType}
              onSourceTypeChange={setSourceType}
              storageClass={storageClass}
              onStorageClassChange={setStorageClass}
              requestStorage={requestStorage}
              onRequestStorageChange={setRequestStorage}
              sourceSnapshot={sourceSnapshot}
              onSourceSnapshotChange={applySnapshotSelection}
            />

            {/* Storage Configuration Section */}
            <StorageConfigSection accessModes={accessModes} onAccessModesChange={setAccessModes} />

            {/* Labels & Annotations Section */}
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
          </VStack>

          {/* Summary Sidebar */}
          <SummarySidebar
            sectionStatuses={getSectionStatuses()}
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreateDisabled={isCreateDisabled}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreatePersistentVolumeClaimPage;
