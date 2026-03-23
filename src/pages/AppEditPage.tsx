import React, { useState, useCallback } from 'react';
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
import { catalogCharts, installedAppsMock, clusterOptions } from '@/pages/apps/appsMockData';
import type { RequiredOptionType } from '@/pages/apps/appsTypes';

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
  onSubmit,
  submitting,
}: {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const items: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  const isDisabled = sectionStatus.configuration !== 'done' || submitting;

  return (
    <div className="w-[280px] shrink-0 sticky top-4 self-start flex flex-col gap-4">
      <WizardSummary items={items} />
      <HStack gap={2}>
        <Button variant="secondary" onClick={onCancel} className="w-[80px]">
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isDisabled} className="flex-1">
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Apps > Edit Page (FR-014, FR-016, FR-017)
   Wizard Flow: Target → Configuration → Save
   Namespace, Version 변경 불가 (표시만)
   ---------------------------------------- */

export function AppEditPage() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const app = installedAppsMock.find((a) => a.id === appId);
  const chart = app ? catalogCharts.find((c) => c.name === app.name) : undefined;
  const opts = chart?.requiredOptions ?? [];

  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    target: 'active',
    version: 'pre',
    configuration: 'pre',
  });

  const [optionValues, setOptionValues] = useState<Record<string, string>>(() => {
    const vals: Record<string, string> = {};
    for (const opt of opts) {
      vals[opt.key] = app?.configValues?.[opt.key] ?? '';
    }
    return vals;
  });
  const [submitting, setSubmitting] = useState(false);

  const setStep = (updates: Partial<Record<SectionStep, WizardSectionState>>) =>
    setSectionStatus((prev) => ({ ...prev, ...updates }));

  const isConfigDone =
    opts.length === 0 || opts.every((o) => (optionValues[o.key] ?? '').trim() !== '');

  const handleOptionChange = useCallback((key: string, val: string) => {
    setOptionValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    navigate(`/container/apps/installed-apps/${appId}`);
  };

  if (!app) {
    return (
      <PageShell
        sidebar={
          <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        }
        sidebarWidth={sidebarWidth}
        contentClassName="pt-4 px-8 pb-6"
      >
        <VStack gap={4}>
          <p className="text-body-md text-[var(--color-text-muted)]">App not found: {appId}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/container/apps/installed-apps')}
          >
            Back to Installed Apps
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
          onBack={() => navigate(`/container/apps/installed-apps/${appId}`)}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/apps/catalog' },
                { label: 'Installed Apps', href: '/container/apps/installed-apps' },
                {
                  label: toTitleCase(app.releaseName),
                  href: `/container/apps/installed-apps/${appId}`,
                },
                { label: 'Edit' },
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
            Edit {toTitleCase(app.releaseName)}
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">{chart?.description}</p>
        </div>

        {/* Two-column layout */}
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
                        value="cluster-1"
                        onChange={() => {}}
                        fullWidth
                        disabled
                      />
                    </FormField.Control>
                  </FormField>
                  {/* Namespace: 변경 불가 */}
                  <FormField>
                    <FormField.Label>Namespace</FormField.Label>
                    <FormField.Control>
                      <Input value={app.namespace} disabled fullWidth />
                    </FormField.Control>
                  </FormField>
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => setStep({ target: 'done', version: 'active' })}
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
                  value={clusterOptions.find((c) => c.value === 'cluster-1')?.label ?? 'cluster-1'}
                />
                <DoneSectionRow label="Namespace" value={app.namespace} />
              </DoneSection>
            )}

            {/* ── Section 2: Version ── */}
            {sectionStatus.version === 'pre' && <PreSection title={SECTION_LABELS.version} />}
            {sectionStatus.version === 'active' && (
              <SectionCard isActive>
                <SectionCard.Header title={SECTION_LABELS.version} showDivider />
                <SectionCard.Content gap={6}>
                  <FormField>
                    <FormField.Label>Chart version</FormField.Label>
                    <FormField.Control>
                      <Input value={app.version} disabled fullWidth />
                    </FormField.Control>
                    <FormField.HelperText>Version cannot be changed.</FormField.HelperText>
                  </FormField>
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => setStep({ version: 'done', configuration: 'active' })}
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
                <DoneSectionRow label="Version" value={app.version} />
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
                  {/* App Name (Release Name) — 변경 불가 */}
                  <FormField>
                    <FormField.Label>App name</FormField.Label>
                    <FormField.Control>
                      <Input value={app.releaseName} disabled fullWidth />
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
                <DoneSectionRow label="App name" value={app.releaseName} />
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
            onCancel={() => navigate(`/container/apps/installed-apps/${appId}`)}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default AppEditPage;
