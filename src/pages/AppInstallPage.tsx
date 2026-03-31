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
  SectionCard,
  WizardSummary,
  PreSection,
  DoneSection,
  DoneSectionRow,
  InlineMessage,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell } from '@tabler/icons-react';
import {
  catalogCharts,
  installedAppsMock,
  namespaceOptions,
  clusterOptions,
} from '@/pages/apps/appsMockData';
import type { RequiredOptionType } from '@/pages/apps/appsTypes';

const CURRENT_CLUSTER_ID = 'cluster-1';
const STORAGECLASS_OPTIONS = [
  { value: '', label: 'Select StorageClass' },
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'longhorn', label: 'longhorn' },
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
   Required Options Form
   ---------------------------------------- */

function OptionsFormField({
  opt,
  value,
  onChange,
}: {
  opt: { key: string; label: string; type?: RequiredOptionType; unit?: string };
  value: string;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <FormField required>
      <FormField.Label>{opt.label}</FormField.Label>
      <FormField.Control>
        {opt.type === 'password' ? (
          <Input
            type="password"
            value={value}
            onChange={(e) => onChange(opt.key, e.target.value)}
            fullWidth
            placeholder="••••••••"
          />
        ) : opt.type === 'int' ? (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(opt.key, e.target.value)}
            fullWidth
            placeholder="e.g. 3"
          />
        ) : opt.type === 'storageclass' ? (
          <Select
            options={STORAGECLASS_OPTIONS}
            value={value}
            onChange={(v) => onChange(opt.key, v ?? '')}
            fullWidth
          />
        ) : opt.unit ? (
          <UnitInput
            value={value}
            onChange={(e) => onChange(opt.key, e.target.value)}
            unit={opt.unit}
            placeholder="e.g. 8"
            type="number"
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(opt.key, e.target.value)}
            fullWidth
            placeholder={`Enter ${opt.label}`}
          />
        )}
      </FormField.Control>
    </FormField>
  );
}

function OptionsForm({
  opts,
  values,
  onChange,
}: {
  opts: { key: string; label: string; type?: RequiredOptionType; group?: string; unit?: string }[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  if (opts.length === 0) {
    return (
      <InlineMessage variant="info">
        This chart has no configurable options. You can edit values directly in the YAML tab.
      </InlineMessage>
    );
  }

  const hasGroups = opts.some((o) => o.group);

  if (!hasGroups) {
    return (
      <VStack gap={4}>
        {opts.map((opt) => (
          <OptionsFormField
            key={opt.key}
            opt={opt}
            value={values[opt.key] ?? ''}
            onChange={onChange}
          />
        ))}
      </VStack>
    );
  }

  // Group-aware rendering: show group header when group changes
  const elements: React.ReactNode[] = [];
  let lastGroup: string | undefined = undefined;

  opts.forEach((opt) => {
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

  // Section states
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    target: 'active',
    version: 'pre',
    configuration: 'pre',
  });

  // Form values
  const [namespace, setNamespace] = useState(namespaceOptions[0]?.value ?? '');
  const [version, setVersion] = useState(versions[0] ?? '');
  const [optionValues, setOptionValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const setStep = (updates: Partial<Record<SectionStep, WizardSectionState>>) =>
    setSectionStatus((prev) => ({ ...prev, ...updates }));

  // Release name: allowMultiple이면 네임스페이스 내 기존 릴리스 수 기반으로 자동 suffix 생성
  const autoReleaseName = useMemo(() => {
    if (!chart) return '';
    if (!chart.allowMultiple) return chart.name;
    const existingCount = installedAppsMock.filter(
      (app) => app.name === chart.name && app.namespace === namespace
    ).length;
    return `${chart.name}-${existingCount + 1}`;
  }, [chart, namespace]);

  const isConfigDone =
    opts.length === 0 || opts.every((o) => (optionValues[o.key] ?? '').trim() !== '');
  const isInstallDisabled = sectionStatus.configuration !== 'done' || submitting;

  const handleOptionChange = useCallback((key: string, val: string) => {
    setOptionValues((prev) => ({ ...prev, [key]: val }));
  }, []);

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
          <Button variant="secondary" size="sm" onClick={() => navigate('/container/apps/catalog')}>
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
          onBack={() => navigate('/container/apps/catalog')}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/apps/catalog' },
                { label: 'Catalog', href: '/container/apps/catalog' },
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
                  {/* App Name (Release Name) — 자동 생성, 수정 불가 */}
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
                {opts.map((opt) => (
                  <DoneSectionRow
                    key={opt.key}
                    label={opt.label}
                    value={opt.type === 'password' ? '••••••••' : optionValues[opt.key] || '—'}
                  />
                ))}
              </DoneSection>
            )}
          </VStack>

          {/* Right: Summary Sidebar */}
          <SummarySidebar
            sectionStatus={sectionStatus}
            onCancel={() => navigate('/container/apps/catalog')}
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
