import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import { useTabs } from '@/contexts/TabContext';
import { useAppCatalogMode } from '@/contexts/AppCatalogModeContext';
import { AppCatalogSidebar } from '@/components/AppCatalogSidebar';
import { IconBell, IconChevronLeft } from '@tabler/icons-react';
import { catalogCharts, installedAppsMock, clusterOptions } from '@/pages/apps/appsMockData';
import { ModeSelectTable } from '@/pages/apps/ModeSelectTable';

type EditTab = 'basic' | 'values';

function toTitleCase(s: string): string {
  return s
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
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
   EditSummarySidebar
   ---------------------------------------- */
function EditSummarySidebar({
  basicDone,
  yamlReady,
  onCancel,
  onApply,
  submitting,
}: {
  basicDone: boolean;
  yamlReady: boolean;
  onCancel: () => void;
  onApply: () => void;
  submitting: boolean;
}) {
  const items: { key: string; label: string; status: WizardSectionState }[] = [
    { key: 'basic', label: 'Basic Information', status: basicDone ? 'done' : 'active' },
    { key: 'values', label: 'Values', status: 'done' },
  ];

  return (
    <div className="w-[280px] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
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
            {submitting ? 'Applying...' : 'Apply'}
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Apps > Edit Page (FR-024)
   Flow: Basic Information tab → Values (YAML Editor) tab → Apply
   - App Name, Namespace, Version: read-only
   - Mode 변경 시 YAML 전체 교체 (append 아님)
   - Failed 상태에서도 사용 가능
   ---------------------------------------- */

export function AppEditPage() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const captureMode = searchParams.get('captureMode') === 'true';
  const captureTab = searchParams.get('captureTab') as EditTab | null;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const { isStandalone } = useAppCatalogMode();
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const app = installedAppsMock.find((a) => a.id === appId);
  const chart = app ? catalogCharts.find((c) => c.name === app.name) : undefined;

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

  const [activeTab, setActiveTab] = useState<EditTab>(captureTab ?? 'basic');
  const [basicDone, setBasicDone] = useState(captureTab === 'values');

  // Mode selection — pre-select current app mode if available
  const [selectedMode, setSelectedMode] = useState(() => chart?.deployModes?.[0]?.value ?? '');

  // Build YAML from current app values + mode override
  // Edit: pre-fill from installed app's current values.yaml, not chart defaults
  const buildYaml = useCallback(
    (mode: string) => {
      if (!chart) return '';
      const base = app?.valuesYaml ?? chart.defaultValuesYaml ?? '';
      const modeOverride = mode ? chart.modeYamlOverrides?.[mode] : undefined;
      // Mode change replaces entire YAML with mode template (FR-011b policy)
      return modeOverride ?? base;
    },
    [chart, app]
  );

  const [yamlContent, setYamlContent] = useState(() => {
    if (captureTab === 'values' && chart && app) {
      return buildYaml(app.mode ?? chart.deployModes?.[0]?.value ?? '');
    }
    return '';
  });
  const [yamlEdited, setYamlEdited] = useState(false);
  const [showPreviousWarning, setShowPreviousWarning] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGoToYaml = () => {
    const yaml = buildYaml(selectedMode);
    setYamlContent(yaml);
    setYamlEdited(false);
    setBasicDone(true);
    setActiveTab('values');
  };

  const handleTabChange = (value: string) => {
    if (activeTab === 'values' && value === 'basic' && yamlEdited) {
      setShowPreviousWarning(true);
    } else {
      setActiveTab(value as EditTab);
    }
  };

  const handlePreviousFromYaml = () => {
    if (yamlEdited) {
      setShowPreviousWarning(true);
    } else {
      setActiveTab('basic');
    }
  };

  const handleConfirmPrevious = () => {
    setShowPreviousWarning(false);
    setActiveTab('basic');
    setBasicDone(false);
    setYamlEdited(false);
  };

  const handleConfirmReset = () => {
    setYamlContent(buildYaml(selectedMode));
    setYamlEdited(false);
    setShowResetModal(false);
  };

  const handleYamlChange = (v: string) => {
    setYamlContent(v);
    setYamlEdited(true);
  };

  const handleApply = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    navigate(`/container/apps/installed-apps/${appId}`);
  };

  const sidebarNode = isStandalone ? (
    <AppCatalogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
  ) : (
    <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
  );

  if (!app || !chart) {
    return (
      <PageShell
        sidebar={sidebarNode}
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

  const appTitle = toTitleCase(app.releaseName);

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
          onBack={() => navigate(`/container/apps/installed-apps/${appId}`)}
          onForward={() => {}}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/apps/catalog' },
                { label: 'Installed Apps', href: '/container/apps/installed-apps' },
                {
                  label: appTitle,
                  href: `/container/apps/installed-apps/${appId}`,
                },
                { label: 'Edit and Apply' },
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
            Edit and Apply — {appTitle}
          </h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">{chart.description}</p>
        </div>

        {/* Two-column layout: Tabs (left) + Summary sidebar (right) */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left: Tabs + tab content */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onChange={handleTabChange} variant="underline" size="sm">
              <TabList>
                <Tab value="basic">Basic Information</Tab>
                <Tab value="values" disabled={!basicDone}>
                  Values
                </Tab>
              </TabList>

              {/* ── Tab 1: Basic Information ── */}
              <TabPanel value="basic">
                <VStack gap={4} className="pt-4">
                  <SectionCard isActive>
                    <SectionCard.Header title="Basic Information" showDivider />
                    <SectionCard.Content gap={6} showDividers={false}>
                      {/* Cluster — read-only */}
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

                      {/* Namespace — read-only */}
                      {chart.appType !== 'Operator' && (
                        <FormField>
                          <FormField.Label>Namespace</FormField.Label>
                          <FormField.Control>
                            <Input value={app.namespace} disabled fullWidth />
                          </FormField.Control>
                          <FormField.HelperText>Namespace cannot be changed.</FormField.HelperText>
                        </FormField>
                      )}

                      {/* App Name — read-only */}
                      <FormField>
                        <FormField.Label>App name</FormField.Label>
                        <FormField.Control>
                          <Input value={app.releaseName} disabled fullWidth />
                        </FormField.Control>
                        <FormField.HelperText>App name cannot be changed.</FormField.HelperText>
                      </FormField>

                      {/* Chart Version — read-only */}
                      <FormField>
                        <FormField.Label>Chart version</FormField.Label>
                        <FormField.Control>
                          <Input value={app.version} disabled fullWidth />
                        </FormField.Control>
                        <FormField.HelperText>
                          Version upgrade is not supported in v1.0.
                        </FormField.HelperText>
                      </FormField>

                      {/* Mode Template — editable if app has deploy modes */}
                      {chart.deployModes && chart.deployModes.length > 0 && (
                        <FormField>
                          <FormField.Label>Mode Template</FormField.Label>
                          <FormField.Description>
                            Changing the mode template will replace the entire YAML with the new
                            mode template in the next step.
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

                      <div className="flex justify-end pt-1">
                        <Button variant="primary" onClick={handleGoToYaml}>
                          Next
                        </Button>
                      </div>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Done state — shown after Next is clicked and user returns */}
                  {basicDone && (
                    <DoneSection
                      title="Basic Information"
                      onEdit={() => {
                        setBasicDone(false);
                        setActiveTab('basic');
                      }}
                    >
                      <DoneSectionRow
                        label="Cluster"
                        value={
                          clusterOptions.find((c) => c.value === 'cluster-1')?.label ?? 'cluster-1'
                        }
                      />
                      {chart.appType !== 'Operator' && (
                        <DoneSectionRow label="Namespace" value={app.namespace} />
                      )}
                      <DoneSectionRow label="App name" value={app.releaseName} />
                      <DoneSectionRow label="Chart version" value={app.version} />
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

              {/* ── Tab 2: Values (YAML Editor) ── */}
              <TabPanel value="values">
                <VStack gap={6} className="pt-4">
                  {/* Info banner */}
                  <InlineMessage variant="info">
                    The values.yaml below is pre-filled with the currently applied configuration.
                    Edit directly and click Apply to deploy changes to the cluster.
                  </InlineMessage>

                  {/* YAML Editor card */}
                  <div
                    className="rounded-lg p-4"
                    style={{
                      background: 'var(--color-surface-default)',
                      border: '1px solid var(--color-border-default)',
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span
                        className="font-semibold shrink-0"
                        style={{
                          fontSize: 'var(--font-size-13)',
                          color: 'var(--color-text-subtle)',
                        }}
                      >
                        values.yaml
                      </span>

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
                          Reset to current
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

          {/* Right: Summary Sidebar */}
          <EditSummarySidebar
            basicDone={basicDone}
            yamlReady={!!yamlContent}
            onCancel={() => navigate(`/container/apps/installed-apps/${appId}`)}
            onApply={handleApply}
            submitting={submitting}
          />
        </HStack>
      </VStack>

      {/* Previous Warning Modal (FR-011b) */}
      <ConfirmModal
        isOpen={showPreviousWarning}
        onClose={() => setShowPreviousWarning(false)}
        onConfirm={handleConfirmPrevious}
        title="YAML 수정사항이 초기화됩니다."
        description="Going back will discard all changes you've made to the YAML. Continue?"
        confirmText="Reset"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {/* Reset to current Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset to current values"
        description="This will discard all your edits and restore the currently applied configuration. Continue?"
        confirmText="Reset"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </PageShell>
  );
}

export default AppEditPage;
