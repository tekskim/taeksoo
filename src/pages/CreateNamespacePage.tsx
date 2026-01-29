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
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconCirclePlus,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

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
   Summary Item Component
   ---------------------------------------- */

interface SummaryItemProps {
  label: string;
  status: 'complete' | 'in-progress';
}

function SummaryItem({ label, status }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1 w-full">
      <span className="text-[12px] leading-5 text-[var(--color-text-default)]">{label}</span>
      <div className="w-4 h-4 flex items-center justify-center">
        {status === 'complete' ? (
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
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="var(--color-border-default)"
              strokeDasharray="3 3"
            />
          </svg>
        )}
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

  // Validation errors
  const [namespaceNameError, setNamespaceNameError] = useState<string | null>(null);

  // Tab management
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

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const handleCancel = useCallback(() => {
    navigate('/container/namespaces');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    // Validate basic info first
    if (!namespaceName.trim()) {
      setNamespaceNameError('Namespace name is required.');
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
  const isCreateDisabled = !namespaceName.trim();

  // Compute section statuses for summary
  const basicInfoComplete = namespaceName.trim().length > 0;
  const podSecurityComplete = true; // Optional section, always considered complete
  const labelsAnnotationsComplete = true; // Optional section, always considered complete

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
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create Namespace
                </h1>
              </div>

              {/* Main Content with Sidebar */}
              <HStack gap={6} align="start" className="w-full">
                {/* Form Content */}
                <VStack gap={4} className="flex-1">
                  {/* Basic Information Section */}
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" showDivider={false} />
                    <SectionCard.Content>
                      <VStack gap={4}>
                        {/* Namespace Name */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Namespace Name
                            <span className="text-[var(--color-state-danger)]"> *</span>
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

                        {/* Description */}
                        <VStack gap={2}>
                          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-[20px]">
                            Description
                          </label>
                          <Input
                            placeholder="Enter a description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                          />
                        </VStack>
                      </VStack>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Pod Security Admission Section */}
                  <SectionCard>
                    <SectionCard.Header title="Pod Security Admission" showDivider={false} />
                    <SectionCard.Content>
                      <VStack gap={4}>
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
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Labels & Annotations Section */}
                  <SectionCard>
                    <SectionCard.Header title="Labels & Annotations" showDivider={false} />
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
                            <VStack gap={2}>
                              {labels.map((label, index) => (
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
                                        onChange={(e) => updateLabel(index, 'key', e.target.value)}
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
                                          updateLabel(index, 'value', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <button
                                      onClick={() => removeLabel(index)}
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
                          <VStack gap={1.5}>
                            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                              Annotations
                            </span>
                            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                              Specify the annotations used to provide additional metadata for the
                              resource.
                            </p>
                          </VStack>

                          {/* Bordered container for annotations */}
                          <div className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                            <VStack gap={2}>
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
                                        onChange={(e) =>
                                          updateAnnotation(index, 'key', e.target.value)
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
                                          updateAnnotation(index, 'value', e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </VStack>
                                    <button
                                      onClick={() => removeAnnotation(index)}
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
                <div className="w-[280px] shrink-0">
                  <div className="sticky top-4">
                    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[8px] shadow-[var(--shadow-md)] overflow-hidden flex flex-col gap-6 pt-3 pb-4 px-3">
                      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[8px] px-4 py-4">
                        <VStack gap={4}>
                          <h5 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
                            Summary
                          </h5>
                          <VStack gap={0}>
                            <SummaryItem
                              label="Basic Information"
                              status={basicInfoComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Pod Security Admission"
                              status={podSecurityComplete ? 'complete' : 'in-progress'}
                            />
                            <SummaryItem
                              label="Labels & Annotations"
                              status={labelsAnnotationsComplete ? 'complete' : 'in-progress'}
                            />
                          </VStack>
                        </VStack>
                      </div>
                      <HStack gap={2} className="w-full justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancel}
                          className="w-[80px]"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleCreate}
                          className="flex-1 min-w-[80px]"
                          disabled={isCreateDisabled}
                        >
                          Create
                        </Button>
                      </HStack>
                    </div>
                  </div>
                </div>
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateNamespacePage;
