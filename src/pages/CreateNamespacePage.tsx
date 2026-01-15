import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  Checkbox,
  Select,
  WizardSummary,
  Disclosure,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
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
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'pod-security' | 'labels-annotations';

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'pod-security': 'Pod Security Admission',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = [
  'basic-info',
  'pod-security',
  'labels-annotations',
];

// Pod Security profile options
const PSA_PROFILE_OPTIONS = [
  { value: 'privileged', label: 'privileged' },
  { value: 'baseline', label: 'baseline' },
  { value: 'restricted', label: 'restricted' },
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
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onCreate: () => void;
  isCreateDisabled: boolean;
}

function SummarySidebar({ sectionStatus, onCancel, onCreate, isCreateDisabled }: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  return (
    <div className="w-[312px] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        <WizardSummary items={summaryItems} />
        
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
            Create Namespace
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */

export function CreateNamespacePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Basic information state
  const [namespaceName, setNamespaceName] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionOpen, setDescriptionOpen] = useState(true);

  // Pod Security Admission state
  const [psaOpen, setPsaOpen] = useState(true);
  const [enforceEnabled, setEnforceEnabled] = useState(false);
  const [enforceProfile, setEnforceProfile] = useState('privileged');
  const [enforceVersion, setEnforceVersion] = useState('');
  const [auditEnabled, setAuditEnabled] = useState(false);
  const [auditProfile, setAuditProfile] = useState('privileged');
  const [auditVersion, setAuditVersion] = useState('');
  const [warnEnabled, setWarnEnabled] = useState(false);
  const [warnProfile, setWarnProfile] = useState('privileged');
  const [warnVersion, setWarnVersion] = useState('');

  // Labels & Annotations state
  const [labelsOpen, setLabelsOpen] = useState(true);
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    'basic-info': 'active',
    'pod-security': 'done',
    'labels-annotations': 'done',
  });

  // Validation errors
  const [namespaceNameError, setNamespaceNameError] = useState<string | null>(null);

  // Tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel } = useTabs();

  // Update tab label
  useState(() => {
    updateActiveTabLabel('Create Namespace');
  });

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Navigation functions
  const goToNextSection = useCallback((currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];

    if (nextSection) {
      setSectionStatus((prev) => ({
        ...prev,
        [currentSection]: 'done',
        [nextSection]: 'active',
      }));
    } else {
      // Last section, mark as done
      setSectionStatus((prev) => ({
        ...prev,
        [currentSection]: 'done',
      }));
    }
  }, []);

  // Validation handler for basic-info section
  const handleBasicInfoNext = useCallback(() => {
    let hasError = false;
    
    if (!namespaceName.trim()) {
      setNamespaceNameError('Namespace name is required.');
      hasError = true;
    } else {
      setNamespaceNameError(null);
    }
    
    if (!hasError) {
      goToNextSection('basic-info');
    }
  }, [namespaceName, goToNextSection]);

  const handleCancel = useCallback(() => {
    navigate('/container/namespaces');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!namespaceName.trim()) {
      setNamespaceNameError('Namespace name is required.');
      setSectionStatus((prev) => ({
        ...prev,
        'basic-info': 'active',
      }));
      return;
    }

    console.log('Creating namespace:', {
      namespaceName,
      description,
      podSecurityAdmission: {
        enforce: enforceEnabled ? { profile: enforceProfile, version: enforceVersion } : null,
        audit: auditEnabled ? { profile: auditProfile, version: auditVersion } : null,
        warn: warnEnabled ? { profile: warnProfile, version: warnVersion } : null,
      },
      labels,
      annotations,
    });
    navigate('/container/namespaces');
  }, [
    namespaceName,
    description,
    enforceEnabled,
    enforceProfile,
    enforceVersion,
    auditEnabled,
    auditProfile,
    auditVersion,
    warnEnabled,
    warnProfile,
    warnVersion,
    labels,
    annotations,
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

  // Check if create button should be disabled
  const isCreateDisabled = !namespaceName.trim();

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
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Namespaces', href: '/container/namespaces' },
                { label: 'Create Namespace' },
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
          <div className="pt-3 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Page Header */}
              <VStack gap={2}>
                <h1 className="text-[18px] font-semibold text-[var(--color-text-default)] leading-[28px]">
                  Create Namespace
                </h1>
                <p className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                  Namespace is a logical partition within a cluster that isolates and organizes resources for easier management and access control.
                </p>
              </VStack>

              {/* Main Content with Sidebar */}
              <div className="flex gap-6">
                {/* Form Content */}
                <VStack gap={3} className="flex-1">
                  {/* Basic Information Section */}
                  <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
                    <VStack gap={6}>
                      <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-[24px]">
                        Basic Information
                      </h2>

                      {/* Namespace Name */}
                      <VStack gap={2}>
                        <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                          Namespace Name<span className="text-[var(--color-state-danger)]"> *</span>
                        </label>
                        <Input
                          placeholder="Enter a unique name"
                          value={namespaceName}
                          onChange={(e) => {
                            setNamespaceName(e.target.value);
                            if (namespaceNameError) setNamespaceNameError(null);
                          }}
                          error={!!namespaceNameError}
                          fullWidth
                        />
                        {namespaceNameError && (
                          <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                            {namespaceNameError}
                          </span>
                        )}
                      </VStack>

                      {/* Description (Disclosure) */}
                      <Disclosure open={descriptionOpen} onOpenChange={setDescriptionOpen}>
                        <Disclosure.Trigger className="flex items-center gap-1.5">
                          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Description
                          </span>
                        </Disclosure.Trigger>
                        <Disclosure.Panel>
                          <div className="pt-3">
                            <Input
                              placeholder="Description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              fullWidth
                            />
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                    </VStack>
                  </div>

                  {/* Pod Security Admission Section */}
                  <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
                    <Disclosure open={psaOpen} onOpenChange={setPsaOpen}>
                      <Disclosure.Trigger className="flex items-center gap-1.5 w-full">
                        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                          Pod Security Admission
                        </span>
                      </Disclosure.Trigger>
                      <Disclosure.Panel>
                        <VStack gap={3} className="pt-3">
                          {/* Enforce */}
                          <VStack gap={2}>
                            <HStack gap={1} align="center">
                              <Checkbox
                                checked={enforceEnabled}
                                onChange={(e) => setEnforceEnabled(e.target.checked)}
                                label="Enforce"
                              />
                            </HStack>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                              Block the creation of pods that violate the policy.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                options={PSA_PROFILE_OPTIONS}
                                value={enforceProfile}
                                onChange={(value) => setEnforceProfile(value)}
                                disabled={!enforceEnabled}
                                fullWidth
                              />
                              <Input
                                placeholder="Version (default: latest)"
                                value={enforceVersion}
                                onChange={(e) => setEnforceVersion(e.target.value)}
                                disabled={!enforceEnabled}
                                fullWidth
                              />
                            </div>
                          </VStack>

                          {/* Audit */}
                          <VStack gap={2}>
                            <HStack gap={1} align="center">
                              <Checkbox
                                checked={auditEnabled}
                                onChange={(e) => setAuditEnabled(e.target.checked)}
                                label="Audit"
                              />
                            </HStack>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                              Allow policy violations and records them in audit logs.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                options={PSA_PROFILE_OPTIONS}
                                value={auditProfile}
                                onChange={(value) => setAuditProfile(value)}
                                disabled={!auditEnabled}
                                fullWidth
                              />
                              <Input
                                placeholder="Version (default: latest)"
                                value={auditVersion}
                                onChange={(e) => setAuditVersion(e.target.value)}
                                disabled={!auditEnabled}
                                fullWidth
                              />
                            </div>
                          </VStack>

                          {/* Warn */}
                          <VStack gap={2}>
                            <HStack gap={1} align="center">
                              <Checkbox
                                checked={warnEnabled}
                                onChange={(e) => setWarnEnabled(e.target.checked)}
                                label="Warn"
                              />
                            </HStack>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                              Allow the creation of violating pods but displays a warning message.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                options={PSA_PROFILE_OPTIONS}
                                value={warnProfile}
                                onChange={(value) => setWarnProfile(value)}
                                disabled={!warnEnabled}
                                fullWidth
                              />
                              <Input
                                placeholder="Version (default: latest)"
                                value={warnVersion}
                                onChange={(e) => setWarnVersion(e.target.value)}
                                disabled={!warnEnabled}
                                fullWidth
                              />
                            </div>
                          </VStack>
                        </VStack>
                      </Disclosure.Panel>
                    </Disclosure>
                  </div>

                  {/* Labels & Annotations Section */}
                  <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
                    <Disclosure open={labelsOpen} onOpenChange={setLabelsOpen}>
                      <Disclosure.Trigger className="flex items-center gap-1.5 w-full">
                        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                          Labels & Annotations
                        </span>
                      </Disclosure.Trigger>
                      <Disclosure.Panel>
                        <VStack gap={4} className="pt-3">
                          {/* Labels */}
                          <VStack gap={4}>
                            <VStack gap={1}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                                Labels
                              </span>
                              <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                Specify the labels used to identify and categorize the resource.
                              </p>
                            </VStack>
                            
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
                                  <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
                                </button>
                              </HStack>
                            ))}

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
                          <VStack gap={4}>
                            <VStack gap={1}>
                              <span className="text-[11px] font-medium text-[var(--color-text-default)] leading-[16px]">
                                Annotations
                              </span>
                              <p className="text-[12px] text-[var(--color-text-subtle)] leading-[16px]">
                                Specify the annotations used to provide additional metadata for the resource.
                              </p>
                            </VStack>
                            
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
                                  onChange={(e) => updateAnnotation(index, 'value', e.target.value)}
                                  className="flex-1"
                                />
                                <button
                                  onClick={() => removeAnnotation(index)}
                                  className="p-2 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                >
                                  <IconX size={14} className="text-[var(--color-text-muted)]" stroke={1.5} />
                                </button>
                              </HStack>
                            ))}

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
                      </Disclosure.Panel>
                    </Disclosure>
                  </div>
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar
                  sectionStatus={sectionStatus}
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  isCreateDisabled={isCreateDisabled}
                />
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateNamespacePage;
