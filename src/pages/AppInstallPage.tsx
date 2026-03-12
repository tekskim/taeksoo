import React, { useState, useRef, useCallback } from 'react';
import { diffLines } from 'diff';
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
  Tabs,
  TabList,
  Tab,
  TabPanel,
  InlineMessage,
} from '@/design-system';
import type { WizardSummaryItem, WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconCopy, IconEdit } from '@tabler/icons-react';
import { catalogCharts, namespaceOptions, clusterOptions } from '@/pages/apps/appsMockData';
import type { RequiredOptionType } from '@/pages/apps/appsTypes';

const CURRENT_CLUSTER_ID = 'cluster-1';
const STORAGECLASS_OPTIONS = [
  { value: '', label: 'Select StorageClass' },
  { value: 'standard', label: 'standard' },
  { value: 'fast', label: 'fast' },
  { value: 'longhorn', label: 'longhorn' },
];

type SectionStep = 'target' | 'version' | 'configuration' | 'compare';

const SECTION_LABELS: Record<SectionStep, string> = {
  target: 'Cluster & Namespace',
  version: 'Version',
  configuration: 'Configuration',
  compare: 'Compare Changes',
};

const SECTION_ORDER: SectionStep[] = ['target', 'version', 'configuration', 'compare'];

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
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <Input
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

function YamlEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const lines = value.split('\n');

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(value); } catch { /* ignore */ }
  }, [value]);

  return (
    <div className="flex flex-col gap-2 w-full min-h-0 flex-1">
      <HStack justify="end" gap={2}>
        <Button variant="secondary" size="sm" leftIcon={<IconCopy size={12} stroke={1.5} />} onClick={handleCopy}>
          Copy
        </Button>
      </HStack>
      <div className="flex-1 flex min-h-[360px] border border-[var(--color-border-default)] rounded-[4px] bg-[var(--color-base-white)] overflow-hidden">
        <div
          ref={lineNumbersRef}
          className="w-[44px] flex-shrink-0 overflow-y-scroll py-2 pr-2 select-none text-right bg-[var(--color-surface-default)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="font-mono text-body-md leading-[18px] text-[var(--color-text-subtle)]">
            {lines.map((_, i) => <div key={i + 1}>{i + 1}</div>)}
          </div>
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            className="w-full h-full py-2 px-2.5 font-mono text-body-md leading-[18px] text-[var(--color-text-default)] bg-transparent border-none outline-none resize-none overflow-auto"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Diff Viewer — Unified / Split
   ---------------------------------------- */

type DiffViewMode = 'unified' | 'split';

function getLines(value: string): string[] {
  return (value.endsWith('\n') ? value.slice(0, -1) : value).split('\n');
}

function DiffViewer({ oldYaml, newYaml }: { oldYaml: string; newYaml: string }) {
  const [viewMode, setViewMode] = useState<DiffViewMode>('unified');
  const changes = diffLines(oldYaml || '', newYaml || '');
  const hasChanges = changes.some((c) => c.added || c.removed);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <HStack justify="between" align="center">
        <span className="text-[11px] text-[var(--color-text-subtle)]">
          {hasChanges ? 'Showing differences from default values' : 'No changes from default values'}
        </span>
        <HStack gap={1}>
          <button
            onClick={() => setViewMode('unified')}
            className={`px-3 py-1 text-[11px] rounded-l border border-[var(--color-border-default)] transition-colors ${
              viewMode === 'unified'
                ? 'bg-[var(--color-action-primary)] text-white border-[var(--color-action-primary)]'
                : 'bg-[var(--color-surface-default)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            Unified
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 text-[11px] rounded-r border border-l-0 border-[var(--color-border-default)] transition-colors ${
              viewMode === 'split'
                ? 'bg-[var(--color-action-primary)] text-white border-[var(--color-action-primary)]'
                : 'bg-[var(--color-surface-default)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            Split
          </button>
        </HStack>
      </HStack>

      {/* Diff Content */}
      <div className="border border-[var(--color-border-default)] rounded-[4px] overflow-hidden bg-white">
        {!hasChanges ? (
          <div className="py-10 text-center text-[12px] text-[var(--color-text-subtle)]">
            No changes — values match the default configuration.
          </div>
        ) : viewMode === 'unified' ? (
          <DiffUnified changes={changes} />
        ) : (
          <DiffSplit changes={changes} />
        )}
      </div>
    </div>
  );
}

function DiffUnified({ changes }: { changes: ReturnType<typeof diffLines> }) {
  let leftNum = 0, rightNum = 0;
  const rows: { type: 'added' | 'removed' | 'unchanged'; content: string; left: number | null; right: number | null }[] = [];

  for (const change of changes) {
    for (const line of getLines(change.value)) {
      if (change.removed) {
        rows.push({ type: 'removed', content: line, left: ++leftNum, right: null });
      } else if (change.added) {
        rows.push({ type: 'added', content: line, left: null, right: ++rightNum });
      } else {
        rows.push({ type: 'unchanged', content: line, left: ++leftNum, right: ++rightNum });
      }
    }
  }

  return (
    <div className="overflow-auto max-h-[420px] font-mono text-[11px] leading-[18px]">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex min-w-0 ${
            row.type === 'added' ? 'bg-[#f0fff4]' : row.type === 'removed' ? 'bg-[#fff5f5]' : ''
          }`}
        >
          <span className="w-[36px] shrink-0 text-right pr-2 select-none text-[var(--color-text-subtle)] border-r border-[var(--color-border-subtle)]">
            {row.left ?? ''}
          </span>
          <span className="w-[36px] shrink-0 text-right pr-2 select-none text-[var(--color-text-subtle)] border-r border-[var(--color-border-subtle)]">
            {row.right ?? ''}
          </span>
          <span
            className={`w-[20px] shrink-0 text-center select-none ${
              row.type === 'added' ? 'text-[#48bb78]' : row.type === 'removed' ? 'text-[#fc8181]' : 'text-[var(--color-text-subtle)]'
            }`}
          >
            {row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' '}
          </span>
          <span
            className={`flex-1 px-2 whitespace-pre overflow-hidden ${
              row.type === 'added' ? 'text-[#276749]' : row.type === 'removed' ? 'text-[#c53030]' : 'text-[var(--color-text-default)]'
            }`}
          >
            {row.content}
          </span>
        </div>
      ))}
    </div>
  );
}

function DiffSplit({ changes }: { changes: ReturnType<typeof diffLines> }) {
  const rows: { leftType: 'removed' | 'unchanged' | null; leftContent: string | null; leftNum: number | null; rightType: 'added' | 'unchanged' | null; rightContent: string | null; rightNum: number | null }[] = [];
  let leftNum = 0, rightNum = 0;

  let i = 0;
  while (i < changes.length) {
    const change = changes[i];
    if (change.removed && i + 1 < changes.length && changes[i + 1].added) {
      const removedLines = getLines(change.value);
      const addedLines = getLines(changes[i + 1].value);
      const maxLen = Math.max(removedLines.length, addedLines.length);
      for (let j = 0; j < maxLen; j++) {
        rows.push({
          leftType: j < removedLines.length ? 'removed' : null,
          leftContent: j < removedLines.length ? removedLines[j] : null,
          leftNum: j < removedLines.length ? ++leftNum : null,
          rightType: j < addedLines.length ? 'added' : null,
          rightContent: j < addedLines.length ? addedLines[j] : null,
          rightNum: j < addedLines.length ? ++rightNum : null,
        });
      }
      i += 2;
    } else if (change.removed) {
      for (const line of getLines(change.value)) {
        rows.push({ leftType: 'removed', leftContent: line, leftNum: ++leftNum, rightType: null, rightContent: null, rightNum: null });
      }
      i++;
    } else if (change.added) {
      for (const line of getLines(change.value)) {
        rows.push({ leftType: null, leftContent: null, leftNum: null, rightType: 'added', rightContent: line, rightNum: ++rightNum });
      }
      i++;
    } else {
      for (const line of getLines(change.value)) {
        rows.push({ leftType: 'unchanged', leftContent: line, leftNum: ++leftNum, rightType: 'unchanged', rightContent: line, rightNum: ++rightNum });
      }
      i++;
    }
  }

  return (
    <div className="overflow-auto max-h-[420px] font-mono text-[11px] leading-[18px]">
      {rows.map((row, i) => (
        <div key={i} className="flex min-w-0 divide-x divide-[var(--color-border-subtle)]">
          {/* Left pane */}
          <div className={`flex flex-1 min-w-0 ${row.leftType === 'removed' ? 'bg-[#fff5f5]' : ''}`}>
            <span className="w-[36px] shrink-0 text-right pr-2 select-none text-[var(--color-text-subtle)] border-r border-[var(--color-border-subtle)]">
              {row.leftNum ?? ''}
            </span>
            <span className={`w-[14px] shrink-0 text-center select-none ${row.leftType === 'removed' ? 'text-[#fc8181]' : 'text-[var(--color-text-subtle)]'}`}>
              {row.leftType === 'removed' ? '-' : ' '}
            </span>
            <span className={`flex-1 px-2 whitespace-pre overflow-hidden ${row.leftType === 'removed' ? 'text-[#c53030]' : 'text-[var(--color-text-default)]'}`}>
              {row.leftContent ?? ''}
            </span>
          </div>
          {/* Right pane */}
          <div className={`flex flex-1 min-w-0 ${row.rightType === 'added' ? 'bg-[#f0fff4]' : ''}`}>
            <span className="w-[36px] shrink-0 text-right pr-2 select-none text-[var(--color-text-subtle)] border-r border-[var(--color-border-subtle)]">
              {row.rightNum ?? ''}
            </span>
            <span className={`w-[14px] shrink-0 text-center select-none ${row.rightType === 'added' ? 'text-[#48bb78]' : 'text-[var(--color-text-subtle)]'}`}>
              {row.rightType === 'added' ? '+' : ' '}
            </span>
            <span className={`flex-1 px-2 whitespace-pre overflow-hidden ${row.rightType === 'added' ? 'text-[#276749]' : 'text-[var(--color-text-default)]'}`}>
              {row.rightContent ?? ''}
            </span>
          </div>
        </div>
      ))}
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
          <Input type="password" value={value} onChange={(e) => onChange(opt.key, e.target.value)} fullWidth placeholder="••••••••" />
        ) : opt.type === 'int' ? (
          <Input type="number" value={value} onChange={(e) => onChange(opt.key, e.target.value)} fullWidth placeholder="e.g. 3" />
        ) : opt.type === 'storageclass' ? (
          <Select options={STORAGECLASS_OPTIONS} value={value} onChange={(v) => onChange(opt.key, v ?? '')} fullWidth />
        ) : opt.unit ? (
          <UnitInput
            value={value}
            onChange={(e) => onChange(opt.key, e.target.value)}
            unit={opt.unit}
            placeholder="e.g. 8"
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
          <OptionsFormField key={opt.key} opt={opt} value={values[opt.key] ?? ''} onChange={onChange} />
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
        <Button variant="primary" onClick={onInstall} disabled={isInstallDisabled} className="flex-1">
          {submitting ? 'Installing...' : 'Install'}
        </Button>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Apps > Install Page (FR-003, FR-004, FR-006, FR-007)
   Wizard Flow: Cluster & Namespace → Version → Configuration → Install
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
    compare: 'pre',
  });

  // Form values
  const [namespace, setNamespace] = useState(namespaceOptions[0]?.value ?? '');
  const [version, setVersion] = useState(versions[0] ?? '');
  const [activeTab, setActiveTab] = useState<'options' | 'yaml'>('options');
  const [optionValues, setOptionValues] = useState<Record<string, string>>({});
  const [yamlContent, setYamlContent] = useState(chart?.defaultValuesYaml ?? '');
  const [submitting, setSubmitting] = useState(false);

  const setStep = (updates: Partial<Record<SectionStep, WizardSectionState>>) =>
    setSectionStatus((prev) => ({ ...prev, ...updates }));

  const isConfigDone = opts.length === 0 || opts.every((o) => (optionValues[o.key] ?? '').trim() !== '');
  const isInstallDisabled = sectionStatus.compare !== 'active' || submitting;
  const defaultYaml = chart?.defaultValuesYaml ?? '';

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
        sidebar={<ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
        sidebarWidth={sidebarWidth}
        contentClassName="pt-4 px-8 pb-6"
      >
        <VStack gap={4}>
          <p className="text-body-md text-[var(--color-text-muted)]">Chart not found: {chartName}</p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/container/apps/catalog')}>Back to Catalog</Button>
        </VStack>
      </PageShell>
    );
  }

  return (
    <PageShell
      sidebar={<ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
            style={{ fontSize: 'var(--font-size-18)', lineHeight: 'var(--line-height-28)', fontWeight: 'var(--font-weight-semibold)' }}
          >
            Install {toTitleCase(chart.name)}
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">{chart.description}</p>
        </div>

        {/* Two-column layout: sections + summary sidebar */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left: Form Sections */}
          <VStack gap={4} className="flex-1">

            {/* ── Section 1: Cluster & Namespace ── */}
            {sectionStatus.target === 'pre' && (
              <PreSection title={SECTION_LABELS.target} />
            )}
            {sectionStatus.target === 'active' && (
              <SectionCard isActive>
                <SectionCard.Header title={SECTION_LABELS.target} showDivider />
                <SectionCard.Content gap={6}>
                  <FormField>
                    <FormField.Label>Cluster</FormField.Label>
                    <FormField.Control>
                      <Select options={clusterOptions} value={CURRENT_CLUSTER_ID} onChange={() => {}} fullWidth disabled />
                    </FormField.Control>
                  </FormField>
                  <FormField required>
                    <FormField.Label>Namespace</FormField.Label>
                    <FormField.Control>
                      <Select options={namespaceOptions} value={namespace} onChange={(v) => setNamespace(v ?? '')} fullWidth />
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
              <DoneSection title={SECTION_LABELS.target} onEdit={() => setStep({ target: 'active', version: 'pre', configuration: 'pre' })}>
                <DoneSectionRow label="Cluster" value={clusterOptions.find((c) => c.value === CURRENT_CLUSTER_ID)?.label ?? CURRENT_CLUSTER_ID} />
                <DoneSectionRow label="Namespace" value={namespace} />
              </DoneSection>
            )}

            {/* ── Section 2: Version ── */}
            {sectionStatus.version === 'pre' && (
              <PreSection title={SECTION_LABELS.version} />
            )}
            {sectionStatus.version === 'active' && (
              <SectionCard isActive>
                <SectionCard.Header title={SECTION_LABELS.version} showDivider />
                <SectionCard.Content gap={6}>
                  <FormField required>
                    <FormField.Label>Chart version</FormField.Label>
                    <FormField.Control>
                      <Select options={versionOptions} value={version} onChange={(v) => setVersion(v ?? '')} fullWidth />
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
              <DoneSection title={SECTION_LABELS.version} onEdit={() => setStep({ version: 'active', configuration: 'pre' })}>
                <DoneSectionRow label="Version" value={version} />
              </DoneSection>
            )}

            {/* ── Section 3: Configuration (Edit Options / Edit YAML) ── */}
            {sectionStatus.configuration === 'pre' && (
              <PreSection title={SECTION_LABELS.configuration} />
            )}
            {sectionStatus.configuration === 'active' && (
              <SectionCard isActive>
                <SectionCard.Header title={SECTION_LABELS.configuration} showDivider />
                <SectionCard.Content gap={4}>
                  <Tabs
                    value={activeTab}
                    onChange={(v) => setActiveTab(v as 'options' | 'yaml')}
                    variant="underline"
                    size="sm"
                  >
                    <TabList>
                      <Tab value="options">Edit Options</Tab>
                      <Tab value="yaml">Edit YAML</Tab>
                    </TabList>
                    <TabPanel value="options">
                      <div className="pt-4">
                        <OptionsForm opts={opts} values={optionValues} onChange={(k, v) => setOptionValues((prev) => ({ ...prev, [k]: v }))} />
                      </div>
                    </TabPanel>
                    <TabPanel value="yaml">
                      <div className="pt-4 flex flex-col min-h-0">
                        <YamlEditor value={yamlContent} onChange={setYamlContent} />
                      </div>
                    </TabPanel>
                  </Tabs>
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="primary"
                      onClick={() => setStep({ configuration: 'done', compare: 'active' })}
                      disabled={!isConfigDone}
                    >
                      Next
                    </Button>
                  </div>
                </SectionCard.Content>
              </SectionCard>
            )}
            {sectionStatus.configuration === 'done' && (
              <DoneSection title={SECTION_LABELS.configuration} onEdit={() => setStep({ configuration: 'active', compare: 'pre' })}>
                {opts.length > 0 ? (
                  opts.slice(0, 3).map((opt) => (
                    <DoneSectionRow
                      key={opt.key}
                      label={opt.label}
                      value={opt.type === 'password' ? '••••••••' : (optionValues[opt.key] || '—')}
                    />
                  ))
                ) : (
                  <DoneSectionRow label="YAML" value="Custom configuration" />
                )}
                {opts.length > 3 && (
                  <DoneSectionRow label="" value={`+${opts.length - 3} more fields configured`} />
                )}
              </DoneSection>
            )}

            {/* ── Section 4: Compare Changes ── */}
            {sectionStatus.compare === 'pre' && (
              <PreSection title={SECTION_LABELS.compare} />
            )}
            {sectionStatus.compare === 'active' && (
              <SectionCard isActive>
                <SectionCard.Header title={SECTION_LABELS.compare} showDivider />
                <SectionCard.Content gap={4}>
                  <DiffViewer oldYaml={defaultYaml} newYaml={yamlContent} />
                </SectionCard.Content>
              </SectionCard>
            )}
            {sectionStatus.compare === 'done' && (
              <DoneSection title={SECTION_LABELS.compare} onEdit={() => setStep({ compare: 'active' })}>
                <DoneSectionRow label="Result" value="Changes reviewed" />
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
