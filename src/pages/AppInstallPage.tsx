import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
  PreSection,
  DoneSection,
  DoneSectionRow,
  InlineMessage,
  ConfirmModal,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Badge,
} from '@/design-system';
import type { WizardSectionState } from '@/design-system';
import { WizardSectionStatusIcon } from '@/design-system/components/Wizard/WizardSection';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { AppCatalogSidebar } from '@/components/AppCatalogSidebar';
import { useAppCatalogMode } from '@/contexts/AppCatalogModeContext';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconAlertTriangle, IconChevronLeft } from '@tabler/icons-react';
import {
  catalogCharts,
  installedAppsMock,
  installedOperatorsMock,
  namespaceOptions,
  clusterOptions,
} from '@/pages/apps/appsMockData';
import { isChartInstalledInTarget } from '@/pages/apps/appsTypes';
import { ModeSelectTable } from '@/pages/apps/ModeSelectTable';

const CURRENT_CLUSTER_ID = 'cluster-1';

type SectionStep = 'version' | 'target' | 'configuration';
type InstallTab = 'basic' | 'values';

const SECTION_LABELS: Record<SectionStep, string> = {
  version: 'Chart Version',
  target: 'Target',
  configuration: 'Configuration',
};

const SECTION_ORDER: SectionStep[] = ['version', 'target', 'configuration'];

function toTitleCase(s: string): string {
  return s
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/* ----------------------------------------
   buildPresetYaml — Config Form 선택값(Mode)을 기반으로 YAML 생성
   Helm chart 기본값을 그대로 사용하고 Mode 선택 시 해당 섹션만 오버라이드
   ---------------------------------------- */
function buildPresetYaml(
  baseYaml: string,
  modeOverride: string | undefined,
  appName?: string
): string {
  // modeOverride is a complete per-mode template from tenant-values.yaml.
  // When provided, it replaces the base entirely (no append).
  let yaml = modeOverride ?? baseYaml;

  if (appName) {
    yaml = yaml.replace(/\$\{FULLNAME_OVERRIDE\}/g, appName);
  }

  return yaml;
}

/* ----------------------------------------
   YamlEditor — 라인 번호 있는 YAML 편집기
   ---------------------------------------- */
function YamlEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const lines = value.split('\n');

  return (
    <div
      className="flex font-mono text-[13px] rounded-md border border-[var(--color-border-default)] overflow-hidden"
      style={{ minHeight: '420px', background: 'var(--color-surface-default)' }}
    >
      {/* Line numbers */}
      <div
        className="select-none text-right pr-3 pl-3 pt-3 pb-3"
        style={{
          minWidth: '44px',
          background: 'var(--color-surface-subtle)',
          borderRight: '1px solid var(--color-border-subtle)',
          color: 'var(--color-text-muted)',
          lineHeight: '20px',
          userSelect: 'none',
        }}
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* Textarea */}
      <textarea
        className="flex-1 resize-none outline-none p-3"
        style={{
          background: 'transparent',
          color: 'var(--color-text-default)',
          lineHeight: '20px',
          tabSize: 2,
          fontFamily: 'inherit',
        }}
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.max(lines.length + 2, 20)}
      />
    </div>
  );
}

/* ----------------------------------------
   WizardSummarySidebar
   ---------------------------------------- */
function WizardSummarySidebar({
  sectionStatus,
  yamlReady,
  onCancel,
  onApply,
  submitting,
}: {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  yamlReady: boolean;
  onCancel: () => void;
  onApply: () => void;
  submitting: boolean;
}) {
  const items: { key: string; label: string; status: WizardSectionState }[] = [
    {
      key: 'basic',
      label: 'Basic Information',
      // done only after Next is clicked in Configuration (marks section as done);
      // re-editing via Edit button resets it back to active
      status: sectionStatus.configuration === 'done' ? 'done' : 'active',
    },
    {
      key: 'values',
      label: 'Values',
      // no required fields — always done
      status: 'done',
    },
  ];

  return (
    <div className="w-[280px] shrink-0 sticky top-4 self-start">
      {/* Outer card — bg-surface-default (TDS FloatingCard outer shell) */}
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Inner Summary card — bg-surface-subtle (TDS FloatingCard inner summary area) */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-3">
          <span className="text-heading-h5 text-[var(--color-text-default)]">Summary</span>
          <div className="flex flex-col">
            {items.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1.5">
                <span className="text-body-md text-[var(--color-text-default)]">{item.label}</span>
                <WizardSectionStatusIcon status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons — inside outer card, outside inner summary card (3:7 ratio) */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="flex-[0.3]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onApply}
            disabled={!yamlReady || submitting}
            className="flex-[0.7]"
          >
            {submitting ? 'Installing...' : 'Install'}
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Apps > Install Page
   Flow: [Wizard: Target → Version → Configuration(Mode)] → [YAML Editor]
   FR-011, FR-012, FR-013
   ---------------------------------------- */

export function AppInstallPage() {
  const { chartName } = useParams<{ chartName: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const captureMode = searchParams.get('captureMode') === 'true';
  const captureTab = searchParams.get('captureTab') as InstallTab | null;
  const captureSection = searchParams.get('captureSection') as SectionStep | null;

  // 경로 컨텍스트 감지: /container/catalog → Container 사이드바 + Container 경로로 복귀
  const isContainerCatalog = location.pathname.startsWith('/container/catalog/');
  const catalogBackPath = isContainerCatalog
    ? '/container/catalog'
    : '/container/appcatalog/catalog';
  const installedAppsPath = isContainerCatalog
    ? '/container/apps/installed-apps'
    : '/container/appcatalog/installed-apps';

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const { isStandalone } = useAppCatalogMode();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const chart = catalogCharts.find((c) => c.name === chartName);
  const versions = chart?.availableVersions ?? (chart ? [chart.version] : []);
  const versionOptions = versions.map((v) => ({ value: v, label: v }));

  // captureMode: full-page scroll 허용
  useEffect(() => {
    if (!captureMode) return;
    const h = document.documentElement;
    const b = document.body;
    h.style.overflow = 'auto';
    h.style.height = 'auto';
    b.style.overflow = 'auto';
    b.style.height = 'auto';
    return () => {
      h.style.overflow = '';
      h.style.height = '';
      b.style.overflow = '';
      b.style.height = '';
    };
  }, [captureMode]);

  // Check dependency is installed
  const dependencyInstalled = useMemo(() => {
    if (!chart?.dependsOn) return true;
    return (
      installedAppsMock.some((a) => a.name === chart.dependsOn) ||
      installedOperatorsMock.some((op) => op.name === chart.dependsOn)
    );
  }, [chart]);

  // ── Tab state ──
  const [activeInstallTab, setActiveInstallTab] = useState<InstallTab>(captureTab ?? 'basic');

  const initialSectionStatus = useMemo((): Record<SectionStep, WizardSectionState> => {
    if (captureSection === 'configuration') {
      return { version: 'done', target: 'done', configuration: 'active' };
    }
    if (captureSection === 'target') {
      return { version: 'done', target: 'active', configuration: 'pre' };
    }
    return { version: 'active', target: 'pre', configuration: 'pre' };
  }, [captureSection]);

  const [sectionStatus, setSectionStatus] =
    useState<Record<SectionStep, WizardSectionState>>(initialSectionStatus);

  const defaultAppName =
    chart?.requiredOptions?.find((o) => o.key === 'FULLNAME_OVERRIDE')?.defaultValue ??
    chart?.name ??
    '';
  const [appName, setAppName] = useState(defaultAppName);
  const [namespace, setNamespace] = useState(namespaceOptions[0]?.value ?? '');
  const [version, setVersion] = useState(versions[0] ?? '');

  // FR-014: 중복 설치 차단 — !allowMultiple 앱이 동일 클러스터·네임스페이스에 이미 설치된 경우
  const isDuplicateBlocked = useMemo(() => {
    if (!chart || chart.allowMultiple) return false;
    if (!namespace) return false;
    return isChartInstalledInTarget(installedAppsMock, chart.name, CURRENT_CLUSTER_ID, namespace);
  }, [chart, namespace]);
  const [selectedMode, setSelectedMode] = useState(() => chart?.deployModes?.[0]?.value ?? '');

  // ── YAML Editor state (captureTab=values 시 기본값 pre-fill) ──
  const [yamlContent, setYamlContent] = useState(() => {
    if (captureTab === 'values' && chart) {
      const modeOverride = chart?.deployModes?.[0]?.value
        ? chart.modeYamlOverrides?.[chart.deployModes[0].value]
        : undefined;
      const initialAppName =
        chart.requiredOptions?.find((o) => o.key === 'FULLNAME_OVERRIDE')?.defaultValue ??
        chart.name;
      return buildPresetYaml(chart.defaultValuesYaml ?? '', modeOverride, initialAppName);
    }
    return '';
  });
  const [yamlEdited, setYamlEdited] = useState(false);
  const [showPreviousWarning, setShowPreviousWarning] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setStep = (updates: Partial<Record<SectionStep, WizardSectionState>>) =>
    setSectionStatus((prev) => ({ ...prev, ...updates }));

  // Build YAML from Helm chart defaults + mode override + app name
  const buildYaml = useCallback(() => {
    if (!chart) return '';
    const modeOverride = selectedMode ? chart.modeYamlOverrides?.[selectedMode] : undefined;
    return buildPresetYaml(chart.defaultValuesYaml ?? '', modeOverride, appName || undefined);
  }, [chart, selectedMode, appName]);

  // "Next" from Configuration → Values tab
  const handleGoToYaml = () => {
    setYamlContent(buildYaml());
    setYamlEdited(false);
    setStep({ configuration: 'done' });
    setActiveInstallTab('values');
  };

  // Previous / tab switch from Values
  const handlePreviousFromYaml = () => {
    if (yamlEdited) {
      setShowPreviousWarning(true);
    } else {
      setActiveInstallTab('basic');
    }
  };

  const handleConfirmPrevious = () => {
    setShowPreviousWarning(false);
    setActiveInstallTab('basic');
    setYamlEdited(false);
  };

  const handleConfirmReset = () => {
    setYamlContent(buildYaml());
    setYamlEdited(false);
    setShowResetModal(false);
  };

  // Intercept tab clicks when Values has unsaved edits
  const handleTabChange = (value: string) => {
    if (activeInstallTab === 'values' && value === 'basic' && yamlEdited) {
      setShowPreviousWarning(true);
    } else {
      setActiveInstallTab(value as InstallTab);
    }
  };

  // Apply (Install)
  const handleApply = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    navigate(installedAppsPath);
  };

  const handleYamlChange = (v: string) => {
    setYamlContent(v);
    setYamlEdited(true);
  };

  // 경로 기반으로 사이드바 결정: Container catalog 경로이면 ContainerSidebar 우선
  const sidebarNode =
    isContainerCatalog || !isStandalone ? (
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
    ) : (
      <AppCatalogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
    );

  if (!chart) {
    return (
      <PageShell
        sidebar={sidebarNode}
        sidebarWidth={sidebarWidth}
        contentClassName="pt-4 px-8 pb-6"
      >
        <VStack gap={4}>
          <p className="text-body-md text-[var(--color-text-muted)]">
            Chart not found: {chartName}
          </p>
          <Button variant="secondary" size="sm" onClick={() => navigate(catalogBackPath)}>
            Back to Catalog
          </Button>
        </VStack>
      </PageShell>
    );
  }

  const chartTitle = chart.displayName ?? toTitleCase(chart.name);

  /* ── YAML Editor Phase ── */
  return (
    <PageShell
      sidebar={sidebarNode}
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
          onBack={() => navigate(catalogBackPath)}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'App Catalog', href: catalogBackPath },
                { label: 'Catalog', href: catalogBackPath },
                { label: `Install ${chartTitle}` },
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
            Install {chartTitle}
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">{chart.description}</p>
        </div>

        {/* Two-column layout: Tabs (left) + Summary sidebar (right) */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left: Tabs + tab content */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeInstallTab} onChange={handleTabChange} variant="underline" size="sm">
              <TabList>
                <Tab value="basic">Basic Information</Tab>
                <Tab value="values" disabled={!yamlContent}>
                  Values
                </Tab>
              </TabList>

              {/* ── Tab: Basic Information (Wizard) ── */}
              <TabPanel value="basic">
                <VStack gap={4} className="pt-4">
                  {/* ── Section 1: Version ── */}
                  {sectionStatus.version === 'pre' && <PreSection title={SECTION_LABELS.version} />}
                  {sectionStatus.version === 'active' && (
                    <SectionCard isActive>
                      <SectionCard.Header title={SECTION_LABELS.version} showDivider />
                      <SectionCard.Content gap={6} showDividers={false}>
                        <FormField required>
                          <FormField.Label>Chart Version</FormField.Label>
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
                            onClick={() => setStep({ version: 'done', target: 'active' })}
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
                      onEdit={() =>
                        setStep({ version: 'active', target: 'pre', configuration: 'pre' })
                      }
                    >
                      <DoneSectionRow label="Chart Version" value={version} />
                    </DoneSection>
                  )}

                  {/* ── Section 2: Target ── */}
                  {sectionStatus.target === 'pre' && <PreSection title={SECTION_LABELS.target} />}
                  {sectionStatus.target === 'active' && (
                    <SectionCard isActive>
                      <SectionCard.Header title={SECTION_LABELS.target} showDivider />
                      <SectionCard.Content gap={6} showDividers={false}>
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

                        {chart.appType !== 'Operator' && (
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
                        )}

                        <div className="flex justify-end">
                          <Button
                            variant="primary"
                            onClick={() => setStep({ target: 'done', configuration: 'active' })}
                            disabled={chart.appType !== 'Operator' && !namespace}
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
                      onEdit={() => setStep({ target: 'active', configuration: 'pre' })}
                    >
                      <DoneSectionRow
                        label="Cluster"
                        value={
                          clusterOptions.find((c) => c.value === CURRENT_CLUSTER_ID)?.label ??
                          CURRENT_CLUSTER_ID
                        }
                      />
                      {chart.appType !== 'Operator' && (
                        <DoneSectionRow label="Namespace" value={namespace} />
                      )}
                    </DoneSection>
                  )}

                  {/* ── Section 3: Configuration ── */}
                  {sectionStatus.configuration === 'pre' && (
                    <PreSection title={SECTION_LABELS.configuration} />
                  )}
                  {sectionStatus.configuration === 'active' && (
                    <SectionCard isActive>
                      <SectionCard.Header title={SECTION_LABELS.configuration} showDivider />
                      <SectionCard.Content gap={6} showDividers={false}>
                        {!dependencyInstalled && chart?.dependsOn && (
                          <InlineMessage
                            variant="warning"
                            icon={<IconAlertTriangle size={16} stroke={1.5} />}
                          >
                            <strong>{chart.dependsOn}</strong> must be installed before this app.
                            Please install the Operator first from the App Catalog.
                          </InlineMessage>
                        )}

                        <FormField required>
                          <FormField.Label>App name</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={appName}
                              onChange={(e) => setAppName(e.target.value)}
                              placeholder="e.g. my-postgres"
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>

                        {chart.deployModes && chart.deployModes.length > 0 && (
                          <FormField required>
                            <FormField.Label>Mode Template</FormField.Label>
                            <FormField.Description>
                              Compare available mode templates and select one. The selected row
                              determines the YAML template loaded in the next step.
                            </FormField.Description>
                            <FormField.Control>
                              <ModeSelectTable
                                modes={chart.deployModes}
                                value={selectedMode}
                                onChange={setSelectedMode}
                              />
                            </FormField.Control>
                          </FormField>
                        )}

                        {isDuplicateBlocked && (
                          <InlineMessage
                            variant="warning"
                            icon={<IconAlertTriangle size={16} stroke={1.5} />}
                          >
                            <strong>{chartTitle}</strong> is already installed in namespace{' '}
                            <strong>{namespace}</strong>. This app cannot be installed more than
                            once in the same namespace.
                          </InlineMessage>
                        )}

                        <div className="flex justify-end pt-1">
                          <Button
                            variant="primary"
                            onClick={handleGoToYaml}
                            disabled={!appName || isDuplicateBlocked}
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
                      <DoneSectionRow label="App name" value={appName} />
                      {selectedMode && (
                        <DoneSectionRow
                          label="Mode"
                          value={
                            chart.deployModes?.find((m) => m.value === selectedMode)?.label ??
                            selectedMode
                          }
                        />
                      )}
                    </DoneSection>
                  )}
                </VStack>
              </TabPanel>

              {/* ── Tab: Values (YAML Editor) ── */}
              <TabPanel value="values">
                <VStack gap={6} className="pt-4">
                  {/* Info banner */}
                  <InlineMessage variant="info">
                    The values.yaml below is pre-filled with Helm chart defaults.
                  </InlineMessage>

                  {/* YAML Editor */}
                  <div
                    className="rounded-lg p-4"
                    style={{
                      background: 'var(--color-surface-default)',
                      border: '1px solid var(--color-border-default)',
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      {/* Left: filename */}
                      <span
                        className="font-semibold shrink-0"
                        style={{
                          fontSize: 'var(--font-size-13)',
                          color: 'var(--color-text-subtle)',
                        }}
                      >
                        values.yaml
                      </span>

                      {/* Right: mode info + modified badge + reset button */}
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {selectedMode && (
                          <span
                            className="text-[12px]"
                            style={{ color: 'var(--color-text-subtle)' }}
                          >
                            Mode Template:{' '}
                            <strong style={{ color: 'var(--color-text-default)' }}>
                              {chart.deployModes?.find((m) => m.value === selectedMode)?.template ??
                                selectedMode}
                            </strong>
                          </span>
                        )}
                        {yamlEdited && (
                          <Badge theme="gray" type="subtle">
                            Modified
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setShowResetModal(true)}
                        >
                          Reset to template
                        </Button>
                      </div>
                    </div>
                    <YamlEditor value={yamlContent} onChange={handleYamlChange} />
                  </div>

                  {/* Previous button */}
                  <div className="flex justify-start pt-1">
                    <Button variant="secondary" onClick={handlePreviousFromYaml}>
                      <IconChevronLeft size={16} className="mr-1" />
                      Previous
                    </Button>
                  </div>
                </VStack>
              </TabPanel>
            </Tabs>
          </div>

          {/* Right: Summary Sidebar (always visible across tabs) */}
          <WizardSummarySidebar
            sectionStatus={sectionStatus}
            yamlReady={!!yamlContent}
            onCancel={() => navigate(catalogBackPath)}
            onApply={handleApply}
            submitting={submitting}
          />
        </HStack>
      </VStack>

      {/* Previous Warning Modal */}
      <ConfirmModal
        isOpen={showPreviousWarning}
        onClose={() => setShowPreviousWarning(false)}
        onConfirm={handleConfirmPrevious}
        title="Your YAML changes will be reset"
        description="Going back will discard all changes you've made to the YAML. Continue?"
        confirmText="Reset"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {/* Reset to template Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset to template"
        description="This will discard all your edits and restore the original mode template. Continue?"
        confirmText="Reset"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </PageShell>
  );
}

export default AppInstallPage;
