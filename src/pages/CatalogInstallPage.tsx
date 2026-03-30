import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  Select,
  SectionCard,
  FormField,
  Textarea,
  PageShell,
  WizardSummary,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconEdit } from '@tabler/icons-react';

function TopBarActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
      aria-label={label}
    >
      <span className="text-[var(--color-text-muted)]">{icon}</span>
    </button>
  );
}

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'target' | 'version' | 'configuration';

const SECTION_LABELS: Record<SectionStep, string> = {
  target: 'Target',
  version: 'Version',
  configuration: 'Configuration',
};

const SECTION_ORDER: SectionStep[] = ['target', 'version', 'configuration'];

const appCatalog: Record<string, { name: string; description: string }> = {
  postgresql: {
    name: 'PostgreSQL',
    description:
      'PostgreSQL is a powerful, open source object-relational database system with a strong reputation for reliability, feature robustness and performance.',
  },
  valkey: {
    name: 'Valkey',
    description:
      'Valkey is an open source, high-performance key/value datastore that supports a variety of workloads such as caching and message queues.',
  },
  kafka: {
    name: 'Kafka',
    description:
      'Apache Kafka is a distributed event streaming platform used for high-performance data pipelines, streaming analytics, and mission-critical applications.',
  },
  nginx: {
    name: 'Nginx',
    description:
      'NGINX Ingress Controller is a production-grade ingress controller for Kubernetes that provides load balancing, SSL termination, and URI rewriting.',
  },
  milvus: {
    name: 'Milvus',
    description:
      'Milvus is an open-source vector database built to power embedding similarity search and AI applications.',
  },
};

const namespaceOptions = [
  { value: 'default', label: 'default' },
  { value: 'data', label: 'data' },
  { value: 'cache', label: 'cache' },
  { value: 'ai', label: 'ai' },
  { value: 'ingress-nginx', label: 'ingress-nginx' },
];

const versionOptions: Record<string, { value: string; label: string }[]> = {
  postgresql: [
    { value: '16.3.0', label: '16.3.0 (latest)' },
    { value: '16.2.0', label: '16.2.0' },
    { value: '15.7.0', label: '15.7.0' },
  ],
  valkey: [
    { value: '8.1.0', label: '8.1.0 (latest)' },
    { value: '7.2.6', label: '7.2.6' },
  ],
  kafka: [
    { value: '3.7.0', label: '3.7.0 (latest)' },
    { value: '3.6.1', label: '3.6.1' },
  ],
  nginx: [
    { value: '4.11.0', label: '4.11.0 (latest)' },
    { value: '4.10.1', label: '4.10.1' },
  ],
  milvus: [
    { value: '4.2.7', label: '4.2.7 (latest)' },
    { value: '4.1.0', label: '4.1.0' },
  ],
};

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onInstall: () => void;
  isInstallDisabled: boolean;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onInstall,
  isInstallDisabled,
}: SummarySidebarProps) {
  const summaryItems: WizardSummaryItem[] = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    status: sectionStatus[key],
  }));

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        <WizardSummary items={summaryItems} />

        <div className="flex flex-col w-full">
          <div className="flex gap-2 items-center justify-end w-full">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onInstall}
              disabled={isInstallDisabled}
              className="flex-1"
            >
              Install
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function CatalogInstallPage() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  const app = appCatalog[appId || ''];
  const appName = app?.name || appId || 'App';
  const appDescription = app?.description || '';

  useEffect(() => {
    updateActiveTabLabel(`Install ${appName}`);
  }, [updateActiveTabLabel, appName]);

  // Target section state
  const [releaseName, setReleaseName] = useState('');
  const [namespace, setNamespace] = useState('');

  // Version section state
  const [selectedVersion, setSelectedVersion] = useState('');

  // Configuration section state
  const [customValues, setCustomValues] = useState('');

  // Validation errors
  const [releaseNameError, setReleaseNameError] = useState<string | null>(null);
  const [namespaceError, setNamespaceError] = useState<string | null>(null);
  const [versionError, setVersionError] = useState<string | null>(null);

  // Wizard state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    target: 'active',
    version: 'pre',
    configuration: 'pre',
  });

  const validateTarget = () => {
    let hasError = false;
    if (!releaseName.trim()) {
      setReleaseNameError('Please enter a release name.');
      hasError = true;
    } else {
      setReleaseNameError(null);
    }
    if (!namespace) {
      setNamespaceError('Please select a namespace.');
      hasError = true;
    } else {
      setNamespaceError(null);
    }
    return !hasError;
  };

  const validateVersion = () => {
    if (!selectedVersion) {
      setVersionError('Please select a version.');
      return false;
    }
    setVersionError(null);
    return true;
  };

  const goToNextSection = useCallback(
    (currentSection: SectionStep) => {
      let isValid = true;
      if (currentSection === 'target') isValid = validateTarget();
      else if (currentSection === 'version') isValid = validateVersion();
      if (!isValid) return;

      const currentIndex = SECTION_ORDER.indexOf(currentSection);
      const nextSection = SECTION_ORDER[currentIndex + 1];

      if (nextSection) {
        setSectionStatus((prev) => ({
          ...prev,
          [currentSection]: 'done',
          [nextSection]: 'active',
        }));
      } else {
        setSectionStatus((prev) => ({
          ...prev,
          [currentSection]: 'done',
        }));
      }
    },
    [releaseName, namespace, selectedVersion]
  );

  const editSection = useCallback((section: SectionStep) => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      SECTION_ORDER.forEach((s) => {
        if (s === section) {
          newStatus[s] = 'active';
        } else if (newStatus[s] === 'active') {
          newStatus[s] = 'done';
        }
      });
      return newStatus;
    });
  }, []);

  const allDone = SECTION_ORDER.every((s) => sectionStatus[s] === 'done');

  const handleCancel = () => {
    navigate('/container/catalog');
  };

  const handleInstall = () => {
    console.log('Installing:', { appId, releaseName, namespace, selectedVersion, customValues });
    navigate('/container/installed-apps');
  };

  const currentVersions = versionOptions[appId || ''] || [
    { value: '1.0.0', label: '1.0.0 (latest)' },
  ];

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
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/catalog' },
                { label: 'Catalog', href: '/container/catalog' },
                { label: `Install ${appName}` },
              ]}
            />
          }
          actions={
            <>
              <TopBarActionButton icon={<IconTerminal2 size={16} stroke={1.5} />} label="Console" />
              <TopBarActionButton
                icon={<IconBell size={16} stroke={1.5} />}
                label="Notifications"
              />
            </>
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Title */}
        <VStack gap={1}>
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Install {appName}</h1>
          {appDescription && (
            <p className="text-body-md text-[var(--color-text-subtle)]">{appDescription}</p>
          )}
        </VStack>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Wizard Sections */}
          <VStack gap={4} className="flex-1">
            {/* Target Section */}
            <SectionCard isActive={sectionStatus['target'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['target']}
                showDivider={sectionStatus['target'] === 'done'}
                actions={
                  sectionStatus['target'] === 'done' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} />}
                      onClick={() => editSection('target')}
                    >
                      Edit
                    </Button>
                  )
                }
              />
              {sectionStatus['target'] === 'active' && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="py-6">
                      <FormField required error={!!releaseNameError}>
                        <FormField.Label>Release name</FormField.Label>
                        <FormField.Description>
                          A unique name to identify this installation.
                        </FormField.Description>
                        <FormField.Control>
                          <Input
                            value={releaseName}
                            onChange={(e) => {
                              setReleaseName(e.target.value);
                              setReleaseNameError(null);
                            }}
                            placeholder="Enter release name"
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.ErrorMessage>{releaseNameError}</FormField.ErrorMessage>
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="py-6">
                      <FormField required error={!!namespaceError}>
                        <FormField.Label>Namespace</FormField.Label>
                        <FormField.Description>
                          The Kubernetes namespace where the app will be deployed.
                        </FormField.Description>
                        <FormField.Control>
                          <Select
                            value={namespace}
                            onChange={(value) => {
                              setNamespace(value);
                              setNamespaceError(null);
                            }}
                            placeholder="Select namespace"
                            options={namespaceOptions}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.ErrorMessage>{namespaceError}</FormField.ErrorMessage>
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('target')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {sectionStatus['target'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Release name" value={releaseName || '-'} />
                  <SectionCard.DataRow label="Namespace" value={namespace || '-'} />
                </SectionCard.Content>
              )}
            </SectionCard>

            {/* Version Section */}
            <SectionCard isActive={sectionStatus['version'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['version']}
                showDivider={sectionStatus['version'] === 'done'}
                actions={
                  sectionStatus['version'] === 'done' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} />}
                      onClick={() => editSection('version')}
                    >
                      Edit
                    </Button>
                  )
                }
              />
              {sectionStatus['version'] === 'active' && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="py-6">
                      <FormField required error={!!versionError}>
                        <FormField.Label>Chart version</FormField.Label>
                        <FormField.Description>
                          Select the Helm chart version to install.
                        </FormField.Description>
                        <FormField.Control>
                          <Select
                            value={selectedVersion}
                            onChange={(value) => {
                              setSelectedVersion(value);
                              setVersionError(null);
                            }}
                            placeholder="Select version"
                            options={currentVersions}
                            fullWidth
                          />
                        </FormField.Control>
                        <FormField.ErrorMessage>{versionError}</FormField.ErrorMessage>
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('version')}>
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {sectionStatus['version'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow label="Chart version" value={selectedVersion || '-'} />
                </SectionCard.Content>
              )}
            </SectionCard>

            {/* Configuration Section */}
            <SectionCard isActive={sectionStatus['configuration'] === 'active'}>
              <SectionCard.Header
                title={SECTION_LABELS['configuration']}
                showDivider={sectionStatus['configuration'] === 'done'}
                actions={
                  sectionStatus['configuration'] === 'done' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconEdit size={12} />}
                      onClick={() => editSection('configuration')}
                    >
                      Edit
                    </Button>
                  )
                }
              />
              {sectionStatus['configuration'] === 'active' && (
                <SectionCard.Content showDividers={false}>
                  <VStack gap={0}>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="py-6">
                      <FormField>
                        <FormField.Label>Custom values (YAML)</FormField.Label>
                        <FormField.Description>
                          Override the default chart values. Leave empty to use defaults.
                        </FormField.Description>
                        <FormField.Control>
                          <Textarea
                            value={customValues}
                            onChange={(e) => setCustomValues(e.target.value)}
                            placeholder={`# Example:\nauth:\n  postgresPassword: "my-password"\n  database: "mydb"\nprimary:\n  persistence:\n    size: 20Gi`}
                            fullWidth
                            rows={12}
                            className="font-mono"
                          />
                        </FormField.Control>
                        <FormField.HelperText>
                          YAML format. These values will override the chart defaults.
                        </FormField.HelperText>
                      </FormField>
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <HStack justify="end" className="pt-3">
                      <Button variant="primary" onClick={() => goToNextSection('configuration')}>
                        Done
                      </Button>
                    </HStack>
                  </VStack>
                </SectionCard.Content>
              )}
              {sectionStatus['configuration'] === 'done' && (
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Custom values"
                    value={customValues ? 'Provided' : 'Using defaults'}
                  />
                </SectionCard.Content>
              )}
            </SectionCard>
          </VStack>

          {/* Right Column - Summary Sidebar */}
          <SummarySidebar
            sectionStatus={sectionStatus}
            onCancel={handleCancel}
            onInstall={handleInstall}
            isInstallDisabled={!allDone}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}
