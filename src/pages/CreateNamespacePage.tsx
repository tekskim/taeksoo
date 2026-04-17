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
  WizardSummary,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { useIsV2 } from '@/hooks/useIsV2';
import { IconX, IconCirclePlus } from '@tabler/icons-react';

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
  const sidebarWidth = sidebarOpen ? 248 : 48;

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

  const hasFilledLabels = labels.some((l) => l.key.trim() || l.value.trim());
  const hasFilledAnnotations = annotations.some((a) => a.key.trim() || a.value.trim());

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
                { label: 'Namespaces', href: '/container/namespaces' },
                { label: 'Create Namespace' },
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
                          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
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
                            className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
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
                          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
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
                            className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
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
          <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
              <WizardSummary
                items={[
                  {
                    key: 'basic-info',
                    label: 'Basic information',
                    status: namespaceName.trim() ? 'done' : 'active',
                  },
                  {
                    key: 'pod-security',
                    label: 'Pod security admission',
                    status: enforceEnabled || auditEnabled || warnEnabled ? 'done' : 'active',
                  },
                  {
                    key: 'labels-annotations',
                    label: 'Labels & annotations',
                    status: hasFilledLabels || hasFilledAnnotations ? 'done' : 'active',
                  },
                ]}
              />
              <HStack gap={2} className="w-full justify-end">
                <Button variant="secondary" onClick={() => navigate('/container/namespaces')}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1">
                  Create
                </Button>
              </HStack>
            </div>
          </div>
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default CreateNamespacePage;
