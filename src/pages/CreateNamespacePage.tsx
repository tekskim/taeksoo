import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  FormField,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  Checkbox,
  Select,
  SectionCard,
  Disclosure,
  PageShell,
} from '@/design-system';
import type { WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useIsV2 } from '@/hooks/useIsV2';
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
          <Button variant="secondary" size="md" onClick={() => navigate('/container/namespaces')}>
            Cancel
          </Button>
          <Button variant="primary" size="md" className="flex-1">
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
  const isV2 = useIsV2();
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
  const [labels, setLabels] = useState<Label[]>(
    isV2 ? [{ id: Date.now().toString(), key: '', value: '' }] : []
  );
  const [annotations, setAnnotations] = useState<Annotation[]>(
    isV2 ? [{ id: Date.now().toString(), key: '', value: '' }] : []
  );

  // Section states for summary
  const getSectionStates = (): Record<NamespaceSectionStep, WizardSectionState> => {
    return {
      // Namespace IS the resource being named; no namespace field, name has no default → 'pre' when empty
      'basic-info': namespaceName.trim() ? 'done' : 'pre',
      // pod-security, labels-annotations are optional → always done
      'pod-security': 'done',
      'labels-annotations': 'done',
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
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={2}>
          <h1 className="text-heading-h4">Create namespace</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Namespace is a logical partition within a cluster that isolates and organizes resources
            for easier management and access control.
          </p>
        </VStack>

        {/* Main Content with Summary Sidebar */}
        <HStack gap={6} className="w-full items-start">
          {/* Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information Section */}
            <SectionCard className="pb-4">
              <SectionCard.Header title="Basic information" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Namespace Name */}
                  <FormField label="Namespace Name" required>
                    <Input
                      placeholder="Enter a unique name"
                      value={namespaceName}
                      onChange={(e) => setNamespaceName(e.target.value)}
                      fullWidth
                    />
                  </FormField>

                  {/* Description (collapsible) */}
                  <Disclosure defaultOpen={isV2}>
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
            <SectionCard className="pb-4">
              <SectionCard.Header title="Pod security admission" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Enforce */}
                  <VStack gap={2}>
                    <Checkbox
                      checked={enforceEnabled}
                      onChange={(e) => setEnforceEnabled(e.target.checked)}
                      label="Enforce"
                    />
                    <p className="text-body-md text-[var(--color-text-subtle)]">
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
                    <p className="text-body-md text-[var(--color-text-subtle)]">
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
                    <p className="text-body-md text-[var(--color-text-subtle)]">
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
            <SectionCard className="pb-4">
              <SectionCard.Header title="Labels & annotations" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Labels */}
                  <VStack gap={3}>
                    <VStack gap={1}>
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Labels
                      </label>
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        Specify the labels used to identify and categorize the resource.
                      </span>
                    </VStack>

                    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                      <VStack gap={1.5}>
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
                        {labels.map((label) => (
                          <div
                            key={label.id}
                            className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                          >
                            <Input
                              placeholder="label key"
                              value={label.key}
                              onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                              fullWidth
                            />
                            <Input
                              placeholder="label value"
                              value={label.value}
                              onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                              fullWidth
                            />
                            <button
                              onClick={() => removeLabel(label.id)}
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
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Annotations
                      </label>
                      <span className="text-body-md text-[var(--color-text-subtle)]">
                        Specify the annotations used to provide additional metadata for the
                        resource.
                      </span>
                    </VStack>

                    <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
                      <VStack gap={1.5}>
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
                        {annotations.map((annotation) => (
                          <div
                            key={annotation.id}
                            className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center"
                          >
                            <Input
                              placeholder="annotation key"
                              value={annotation.key}
                              onChange={(e) =>
                                updateAnnotation(annotation.id, 'key', e.target.value)
                              }
                              fullWidth
                            />
                            <Input
                              placeholder="annotation value"
                              value={annotation.value}
                              onChange={(e) =>
                                updateAnnotation(annotation.id, 'value', e.target.value)
                              }
                              fullWidth
                            />
                            <button
                              onClick={() => removeAnnotation(annotation.id)}
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
                            onClick={addAnnotation}
                          >
                            Add annotation
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
    </PageShell>
  );
}

export default CreateNamespacePage;
