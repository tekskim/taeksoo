import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  FormField,
  Input,
  Select,
  Toggle,
  SectionCard,
  WizardSummary,
  PreSection,
  DoneSection,
  DoneSectionRow,
  InlineMessage,
  Password,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconAlertTriangle } from '@tabler/icons-react';
import {
  catalogCharts,
  installedAppsMock,
  namespaceOptions,
  clusterOptions,
} from '@/pages/apps/appsMockData';
import type { RequiredOption } from '@/pages/apps/appsTypes';

const CURRENT_CLUSTER_ID = 'cluster-1';
const STORAGECLASS_OPTIONS = [
  { value: '', label: 'Select StorageClass' },
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'longhorn', label: 'longhorn' },
];
const RESOURCE_TIER_OPTIONS = [
  { value: 'Small', label: 'Small' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Large', label: 'Large' },
  { value: 'Custom', label: 'Custom (manual entry)' },
];

type SectionStep = 'target' | 'version' | 'configuration';

const SECTION_LABELS: Record<SectionStep, string> = {
  target: 'Target',
  version: 'Version',
  configuration: 'Configuration',
};

const SECTION_ORDER: SectionStep[] = ['target', 'version', 'configuration'];

function toTitleCase(s: string): string {
  return s
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/* ----------------------------------------
   UnitInput — Input with unit label to the right
   ---------------------------------------- */

function UnitInput({
  value,
  onChange,
  unit,
  placeholder,
  disabled,
  type = 'text',
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'number';
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] shrink-0">
        {unit}
      </span>
    </div>
  );
}

/* ----------------------------------------
   YAML Editor with line numbers
   ---------------------------------------- */

/* ----------------------------------------
   Required Options Form Field
   ---------------------------------------- */

function OptionsFormField({
  opt,
  value,
  onChange,
}: {
  opt: RequiredOption;
  value: string;
  onChange: (key: string, val: string) => void;
}) {
  const isRequired = opt.required && opt.type !== 'boolean' && opt.type !== 'resource-tier';

  const control = (() => {
    switch (opt.type) {
      case 'password':
        return (
          <Password
            value={value}
            onChange={(e) => onChange(opt.key, e.target.value)}
            fullWidth
            placeholder="••••••••"
          />
        );

      case 'int':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(opt.key, e.target.value)}
            fullWidth
            placeholder="e.g. 3"
          />
        );

      case 'storageclass':
        return (
          <Select
            options={STORAGECLASS_OPTIONS}
            value={value || ''}
            onChange={(v) => onChange(opt.key, v ?? '')}
            fullWidth
          />
        );

      case 'select':
        return (
          <Select
            options={[{ value: '', label: 'Select…' }, ...(opt.options ?? [])]}
            value={value || ''}
            onChange={(v) => onChange(opt.key, v ?? '')}
            fullWidth
          />
        );

      case 'resource-tier':
        return (
          <Select
            options={RESOURCE_TIER_OPTIONS}
            value={value || 'Medium'}
            onChange={(v) => onChange(opt.key, v ?? 'Medium')}
            fullWidth
          />
        );

      case 'boolean':
        return (
          <div className="pt-1">
            <Toggle
              checked={value === 'true'}
              onChange={(e) => onChange(opt.key, e.target.checked ? 'true' : 'false')}
            />
          </div>
        );

      default:
        if (opt.unit) {
          return (
            <UnitInput
              value={value}
              onChange={(e) => onChange(opt.key, e.target.value)}
              unit={opt.unit}
              placeholder="e.g. 8"
              type="number"
            />
          );
        }
        return (
          <Input
            value={value}
            onChange={(e) => onChange(opt.key, e.target.value)}
            fullWidth
            placeholder={`e.g. ${opt.defaultValue ?? opt.label}`}
          />
        );
    }
  })();

  return (
    <FormField required={isRequired}>
      <FormField.Label>{opt.label}</FormField.Label>
      <FormField.Control>{control}</FormField.Control>
      {opt.description && <FormField.Description>{opt.description}</FormField.Description>}
    </FormField>
  );
}

function OptionsForm({
  opts,
  values,
  onChange,
}: {
  opts: RequiredOption[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  if (opts.length === 0) {
    return <InlineMessage variant="info">This chart has no configurable options.</InlineMessage>;
  }

  // Filter conditional fields: only show when showWhen condition is met
  const isVisible = (opt: RequiredOption): boolean => {
    if (!opt.showWhen) return true;
    return values[opt.showWhen.key] === opt.showWhen.value;
  };

  // Group-aware rendering: show group header when group changes
  const elements: React.ReactNode[] = [];
  let lastGroup: string | undefined = undefined;

  opts.forEach((opt) => {
    if (!isVisible(opt)) return;

    if (opt.group && opt.group !== lastGroup) {
      elements.push(
        <div key={`group-${opt.group}`} className="pt-2 first:pt-0">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
            {opt.group}
          </span>
          <div className="w-full h-px bg-[var(--color-border-subtle)] mt-1 mb-3" />
        </div>
      );
      lastGroup = opt.group;
    }

    elements.push(
      <OptionsFormField key={opt.key} opt={opt} value={values[opt.key] ?? ''} onChange={onChange} />
    );
  });

  return <VStack gap={4}>{elements}</VStack>;
}

/* ----------------------------------------
   Summary Sidebar
   ---------------------------------------- */

function SummarySidebar({
  sectionStatus,
  onCancel,
  onInstall,
  isInstallDisabled,
  submitting,
}: {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onInstall: () => void;
  isInstallDisabled: boolean;
  submitting: boolean;
}) {
  const items: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  return (
    <div className="w-[280px] shrink-0 sticky top-4 self-start flex flex-col gap-4">
      <WizardSummary items={items} />
      <HStack gap={2}>
        <Button variant="secondary" onClick={onCancel} className="w-[80px]">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onInstall}
          disabled={isInstallDisabled}
          className="flex-1"
        >
          {submitting ? 'Installing...' : 'Install'}
        </Button>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Apps > Install Page (FR-003, FR-004, FR-006, FR-007)
   Wizard Flow: Target → Version → Configuration → Install
   ---------------------------------------- */

export function AppInstallPage() {
  const { chartName } = useParams<{ chartName: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const chart = catalogCharts.find((c) => c.name === chartName);
  const versions = chart?.availableVersions ?? (chart ? [chart.version] : []);
  const versionOptions = versions.map((v) => ({ value: v, label: v }));
  const opts = chart?.requiredOptions ?? [];

  // Check dependency is installed
  const dependencyInstalled = useMemo(() => {
    if (!chart?.dependsOn) return true;
    return installedAppsMock.some((a) => a.name === chart.dependsOn);
  }, [chart]);

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    target: 'active',
    version: 'pre',
    configuration: 'pre',
  });

  // Form values: initialize with defaultValues from opts
  const [namespace, setNamespace] = useState(namespaceOptions[0]?.value ?? '');
  const [version, setVersion] = useState(versions[0] ?? '');
  const [optionValues, setOptionValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    opts.forEach((o) => {
      if (o.defaultValue !== undefined) defaults[o.key] = o.defaultValue;
    });
    // Apply Medium tier presets by default if chart has tierPresets
    if (chart?.tierPresets?.Medium) {
      Object.assign(defaults, chart.tierPresets.Medium.values);
    }
    return defaults;
  });
  const [submitting, setSubmitting] = useState(false);

  const setStep = (updates: Partial<Record<SectionStep, WizardSectionState>>) =>
    setSectionStatus((prev) => ({ ...prev, ...updates }));

  // Release name: if allowMultiple, auto-append a suffix based on existing release count in namespace
  const autoReleaseName = useMemo(() => {
    if (!chart) return '';
    if (!chart.allowMultiple) return chart.name;
    const existingCount = installedAppsMock.filter(
      (app) => app.name === chart.name && app.namespace === namespace
    ).length;
    return `${chart.name}-${existingCount + 1}`;
  }, [chart, namespace]);

  // Required fields validation — skip _tier (UI-only), boolean, resource-tier
  const isConfigDone = useMemo(() => {
    if (opts.length === 0) return true;
    return opts.every((o) => {
      if (o.type === 'resource-tier' || o.type === 'boolean') return true;
      if (!o.required) return true;
      // Skip conditional fields that are not visible
      if (o.showWhen && optionValues[o.showWhen.key] !== o.showWhen.value) return true;
      return (optionValues[o.key] ?? '').trim() !== '';
    });
  }, [opts, optionValues]);

  const isInstallDisabled = sectionStatus.configuration !== 'done' || submitting;

  const handleOptionChange = useCallback(
    (key: string, val: string) => {
      setOptionValues((prev) => {
        const next = { ...prev, [key]: val };
        // When tier changes (and not Custom), apply tier presets
        if (key === '_tier' && val !== 'Custom' && chart?.tierPresets?.[val]) {
          Object.assign(next, chart.tierPresets[val].values);
        }
        return next;
      });
    },
    [chart]
  );

  const handleInstall = async () => {
    if (isInstallDisabled) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    navigate('/container/apps/installed-apps');
  };

  if (!chart) {
    return (
      <PageShell
        sidebar={
          <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        }
        sidebarWidth={sidebarWidth}
        contentClassName="pt-4 px-8 pb-6"
      >
        <VStack gap={4}>
          <p className="text-body-md text-[var(--color-text-muted)]">
            Chart not found: {chartName}
          </p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/container/catalog')}>
            Back to Catalog
          </Button>
        </VStack>
      </PageShell>
    );
  }

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation
          onBack={() => navigate('/container/catalog')}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/catalog' },
                { label: 'Catalog', href: '/container/catalog' },
                { label: `Install ${toTitleCase(chart.name)}` },
              ]}
            />
          }
          actions={
            <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        {/* Page title */}
        <div>
          <h1
            className="text-[var(--color-text-default)] mb-1"
            style={{
              fontSize: 'var(--font-size-18)',
              lineHeight: 'var(--line-height-28)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Install {toTitleCase(chart.name)}
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">{chart.description}</p>
        </div>

        {/* Two-column layout: sections + summary sidebar */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left: Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* ── Section 1: Target ── */}
            {sectionStatus.target === 'pre' && <PreSection title={SECTION_LABELS.target} />}
            {sectionStatus.target === 'active' && (
              <SectionCard isActive>
                <SectionCard.Header title={SECTION_LABELS.target} showDivider />
                <SectionCard.Content gap={6}>
                  <FormField>
                    <FormField.Label>Cluster</FormField.Label>
                    <FormField.Control>
                      <Select
                        options={clusterOptions}
                        value={CURRENT_CLUSTER_ID}
                        onChange={() => {}}
                        fullWidth
                        disabled
                      />
                    </FormField.Control>
                  </FormField>
                  <FormField required>
                    <FormField.Label>Namespace</FormField.Label>
                    <FormField.Control>
                      <Select
                        options={namespaceOptions}
                        value={namespace}
                        onChange={(v) => setNamespace(v ?? '')}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => setStep({ target: 'done', version: 'active' })}
                      disabled={!namespace}
                    >
                      Next
                    </Button>
                  </div>
                </SectionCard.Content>
              </SectionCard>
            )}
            {sectionStatus.target === 'done' && (
              <DoneSection
                title={SECTION_LABELS.target}
                onEdit={() => setStep({ target: 'active', version: 'pre', configuration: 'pre' })}
              >
                <DoneSectionRow
                  label="Cluster"
                  value={
                    clusterOptions.find((c) => c.value === CURRENT_CLUSTER_ID)?.label ??
                    CURRENT_CLUSTER_ID
                  }
                />
                <DoneSectionRow label="Namespace" value={namespace} />
              </DoneSection>
            )}

            {/* ── Section 2: Version ── */}
            {sectionStatus.version === 'pre' && <PreSection title={SECTION_LABELS.version} />}
            {sectionStatus.version === 'active' && (
              <SectionCard isActive>
                <SectionCard.Header title={SECTION_LABELS.version} showDivider />
                <SectionCard.Content gap={6}>
                  <FormField required>
                    <FormField.Label>Chart version</FormField.Label>
                    <FormField.Control>
                      <Select
                        options={versionOptions}
                        value={version}
                        onChange={(v) => setVersion(v ?? '')}
                        fullWidth
                      />
                    </FormField.Control>
                  </FormField>
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => setStep({ version: 'done', configuration: 'active' })}
                      disabled={!version}
                    >
                      Next
                    </Button>
                  </div>
                </SectionCard.Content>
              </SectionCard>
            )}
            {sectionStatus.version === 'done' && (
              <DoneSection
                title={SECTION_LABELS.version}
                onEdit={() => setStep({ version: 'active', configuration: 'pre' })}
              >
                <DoneSectionRow label="Version" value={version} />
              </DoneSection>
            )}

            {/* ── Section 3: Configuration ── */}
            {sectionStatus.configuration === 'pre' && (
              <PreSection title={SECTION_LABELS.configuration} />
            )}
            {sectionStatus.configuration === 'active' && (
              <SectionCard isActive>
                <SectionCard.Header title={SECTION_LABELS.configuration} showDivider />
                <SectionCard.Content gap={4}>
                  {/* Dependency warning */}
                  {!dependencyInstalled && chart?.dependsOn && (
                    <InlineMessage
                      variant="warning"
                      icon={<IconAlertTriangle size={16} stroke={1.5} />}
                    >
                      <strong>{chart.dependsOn}</strong> must be installed before this app. Please
                      install the Operator first from the App Catalog.
                    </InlineMessage>
                  )}
                  {/* Install type badge */}
                  {chart?.installType && (
                    <p className="text-body-sm text-[var(--color-text-subtle)]">
                      Install type:{' '}
                      <span className="font-medium text-[var(--color-text-default)]">
                        {chart.installType}
                      </span>
                    </p>
                  )}
                  {/* App Name (Release Name) — auto-generated, read-only */}
                  <FormField>
                    <FormField.Label>App name</FormField.Label>
                    <FormField.Control>
                      <Input value={autoReleaseName} disabled fullWidth />
                    </FormField.Control>
                  </FormField>
                  <OptionsForm opts={opts} values={optionValues} onChange={handleOptionChange} />
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="primary"
                      onClick={() => setStep({ configuration: 'done' })}
                      disabled={!isConfigDone}
                    >
                      Next
                    </Button>
                  </div>
                </SectionCard.Content>
              </SectionCard>
            )}
            {sectionStatus.configuration === 'done' && (
              <DoneSection
                title={SECTION_LABELS.configuration}
                onEdit={() => setStep({ configuration: 'active' })}
              >
                <DoneSectionRow label="App name" value={autoReleaseName} />
                {opts
                  .filter((opt) => opt.type !== 'resource-tier')
                  .filter(
                    (opt) => !opt.showWhen || optionValues[opt.showWhen.key] === opt.showWhen.value
                  )
                  .map((opt) => (
                    <DoneSectionRow
                      key={opt.key}
                      label={opt.label}
                      value={
                        opt.type === 'password'
                          ? '••••••••'
                          : opt.type === 'boolean'
                            ? optionValues[opt.key] === 'true'
                              ? 'Enabled'
                              : 'Disabled'
                            : optionValues[opt.key] || '—'
                      }
                    />
                  ))}
              </DoneSection>
            )}
          </VStack>

          {/* Right: Summary Sidebar */}
          <SummarySidebar
            sectionStatus={sectionStatus}
            onCancel={() => navigate('/container/catalog')}
            onInstall={handleInstall}
            isInstallDisabled={isInstallDisabled}
            submitting={submitting}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default AppInstallPage;
