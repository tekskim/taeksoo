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
  Checkbox,
  Select,
  SectionCard,
  Disclosure,
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
  IconX,
  IconCheck,
  IconCirclePlus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type NamespaceSectionStep = 'basic-info' | 'pod-security' | 'labels-annotations';

// Section labels for display
const NAMESPACE_SECTION_LABELS: Record<NamespaceSectionStep, string> = {
  'basic-info': 'Basic Information',
  'pod-security': 'Pod Security Admission',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const NAMESPACE_SECTION_ORDER: NamespaceSectionStep[] = [
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
  id: string;
  key: string;
  value: string;
}

interface Annotation {
  id: string;
  key: string;
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
function SummarySidebar({
  sectionStates,
}: {
  sectionStates: Record<NamespaceSectionStep, WizardSectionState>;
}) {
  const navigate = useNavigate();

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Inner subtle-bg container */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={4}>
            <span className="text-heading-h5">Summary</span>
            <VStack gap={0}>
              {NAMESPACE_SECTION_ORDER.map((step) => (
                <HStack key={step} justify="between" className="py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {NAMESPACE_SECTION_LABELS[step]}
                  </span>
                  <SummaryStatusIcon status={sectionStates[step]} />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </div>

        {/* Button row */}
        <HStack gap={2}>
          <Button
            variant="secondary"
            size="sm"
            className="w-[80px]"
            onClick={() => navigate('/container/namespaces')}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" className="flex-1">
            Create
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
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Namespace');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Basic Information state
  const [namespaceName, setNamespaceName] = useState('');
  const [description, setDescription] = useState('');

  // Pod Security Admission state
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
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Section states for summary
  const getSectionStates = (): Record<NamespaceSectionStep, WizardSectionState> => {
    return {
      'basic-info': namespaceName ? 'done' : 'active',
      'pod-security': enforceEnabled || auditEnabled || warnEnabled ? 'done' : 'pending',
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pending',
    };
  };

  // Label handlers
  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  // Annotation handlers
  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnotation = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }, []);

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
                { label: 'Namespaces', href: '/container/namespaces' },
                { label: 'Create Namespace' },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={12} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Page Header */}
              <VStack gap={2}>
                <h1 className="text-heading-h4">Create Namespace</h1>
                <p className="text-body-sm text-[var(--color-text-subtle)]">
                  Namespace is a logical partition within a cluster that isolates and organizes
                  resources for easier management and access control.
                </p>
              </VStack>

              {/* Main Content with Summary Sidebar */}
              <HStack gap={6} className="w-full items-start">
                {/* Form Sections */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Namespace Name */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                            Namespace Name{' '}
                            <span className="text-[var(--color-state-danger)]">*</span>
                          </label>
                          <Input
                            placeholder="Enter a unique name"
                            value={namespaceName}
                            onChange={(e) => setNamespaceName(e.target.value)}
                            fullWidth
                          />
                        </VStack>

                        {/* Description (collapsible) */}
                        <Disclosure>
                          <Disclosure.Trigger>Description</Disclosure.Trigger>
                          <Disclosure.Panel>
                            <div className="pt-2">
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
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Pod Security Admission Section */}
                  <SectionCard>
                    <SectionCard.Header title="Pod Security Admission" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Enforce */}
                        <VStack gap={2}>
                          <Checkbox
                            checked={enforceEnabled}
                            onChange={(e) => setEnforceEnabled(e.target.checked)}
                            label="Enforce"
                          />
                          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                            Block the creation of pods that violate the policy.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <Select
                              options={PSA_PROFILE_OPTIONS}
                              value={enforceProfile}
                              onChange={setEnforceProfile}
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
                          <Checkbox
                            checked={auditEnabled}
                            onChange={(e) => setAuditEnabled(e.target.checked)}
                            label="Audit"
                          />
                          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                            Allow policy violations and records them in audit logs.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <Select
                              options={PSA_PROFILE_OPTIONS}
                              value={auditProfile}
                              onChange={setAuditProfile}
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
                          <Checkbox
                            checked={warnEnabled}
                            onChange={(e) => setWarnEnabled(e.target.checked)}
                            label="Warn"
                          />
                          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                            Allow the creation of violating pods but displays a warning message.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <Select
                              options={PSA_PROFILE_OPTIONS}
                              value={warnProfile}
                              onChange={setWarnProfile}
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
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Labels & Annotations Section */}
                  <SectionCard>
                    <SectionCard.Header title="Labels & Annotations" />
                    <SectionCard.Content>
                      <VStack gap={6}>
                        {/* Labels */}
                        <VStack gap={3}>
                          <VStack gap={1}>
                            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Labels
                            </label>
                            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the labels used to identify and categorize the resource.
                            </span>
                          </VStack>

                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={2}>
                              {labels.map((label) => (
                                <div
                                  key={label.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                >
                                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-start">
                                    <VStack gap={2}>
                                      <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                        Key
                                      </label>
                                      <Input
                                        placeholder="label key"
                                        value={label.key}
                                        onChange={(e) =>
                                          updateLabel(label.id, 'key', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <VStack gap={2}>
                                      <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                        Value
                                      </label>
                                      <Input
                                        placeholder="label value"
                                        value={label.value}
                                        onChange={(e) =>
                                          updateLabel(label.id, 'value', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <button
                                      onClick={() => removeLabel(label.id)}
                                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors self-start"
                                    >
                                      <IconX
                                        size={12}
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
                                  onClick={addLabel}
                                >
                                  Add Label
                                </Button>
                              </div>
                            </VStack>
                          </div>
                        </VStack>

                        {/* Annotations */}
                        <VStack gap={3}>
                          <VStack gap={1}>
                            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Annotations
                            </label>
                            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the annotations used to provide additional metadata for the
                              resource.
                            </span>
                          </VStack>

                          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={2}>
                              {annotations.map((annotation) => (
                                <div
                                  key={annotation.id}
                                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                                >
                                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-start">
                                    <VStack gap={2}>
                                      <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                        Key
                                      </label>
                                      <Input
                                        placeholder="annotation key"
                                        value={annotation.key}
                                        onChange={(e) =>
                                          updateAnnotation(annotation.id, 'key', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <VStack gap={2}>
                                      <label className="text-[12px] font-medium text-[var(--color-text-default)] leading-4">
                                        Value
                                      </label>
                                      <Input
                                        placeholder="annotation value"
                                        value={annotation.value}
                                        onChange={(e) =>
                                          updateAnnotation(annotation.id, 'value', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <button
                                      onClick={() => removeAnnotation(annotation.id)}
                                      className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors self-start"
                                    >
                                      <IconX
                                        size={12}
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
                                  onClick={addAnnotation}
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
                </VStack>

                {/* Summary Sidebar */}
                <SummarySidebar sectionStates={getSectionStates()} />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateNamespacePage;
