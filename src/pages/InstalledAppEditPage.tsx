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
  NumberInput,
  SectionCard,
  FormField,
  PageShell,
  WizardSummary,
  WritingSection,
  PreSection,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconEdit, IconEye, IconEyeOff } from '@tabler/icons-react';

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

const storageClassOptions = [
  { value: 'ceph-block', label: 'ceph-block' },
  { value: 'ceph-filesystem', label: 'ceph-filesystem' },
  { value: 'local-path', label: 'local-path' },
];

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onSave: () => void;
  isSaveDisabled: boolean;
}

function SummarySidebar({ sectionStatus, onCancel, onSave, isSaveDisabled }: SummarySidebarProps) {
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
            <Button variant="primary" onClick={onSave} disabled={isSaveDisabled} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Mock installed app data (for edit pre-fill)
   ---------------------------------------- */

const installedAppData: Record<
  string,
  {
    name: string;
    chartName: string;
    namespace: string;
    version: string;
    adminPassword: string;
    databaseName: string;
    storageClass: string;
    storageSize: number;
  }
> = {
  '1': {
    name: 'postgresql-1',
    chartName: 'postgresql',
    namespace: 'default',
    version: '16.2.0',
    adminPassword: 'change-me',
    databaseName: 'appdb',
    storageClass: 'ceph-block',
    storageSize: 20,
  },
  '2': {
    name: 'kafka',
    chartName: 'kafka',
    namespace: 'data',
    version: '3.6.1',
    adminPassword: 'kafka-secret',
    databaseName: 'kafka-db',
    storageClass: 'ceph-filesystem',
    storageSize: 50,
  },
  '3': {
    name: 'valkey',
    chartName: 'valkey',
    namespace: 'cache',
    version: '7.2.6',
    adminPassword: 'valkey-secret',
    databaseName: 'valkey-db',
    storageClass: 'local-path',
    storageSize: 10,
  },
  '4': {
    name: 'nginx-1',
    chartName: 'nginx',
    namespace: 'ingress-nginx',
    version: '4.10.1',
    adminPassword: 'nginx-secret',
    databaseName: 'nginx-db',
    storageClass: 'ceph-block',
    storageSize: 8,
  },
  '5': {
    name: 'milvus',
    chartName: 'milvus',
    namespace: 'ai',
    version: '4.1.0',
    adminPassword: 'milvus-secret',
    databaseName: 'milvus-db',
    storageClass: 'ceph-filesystem',
    storageSize: 100,
  },
  '6': {
    name: 'postgresql-1',
    chartName: 'postgresql',
    namespace: 'ai',
    version: '16.3.0',
    adminPassword: 'pg-secret',
    databaseName: 'pgdb',
    storageClass: 'local-path',
    storageSize: 15,
  },
};

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export default function InstalledAppEditPage() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  const installedApp = installedAppData[appId || ''];
  const chartName = installedApp?.chartName || '';
  const app = appCatalog[chartName];
  const appName = app?.name || installedApp?.chartName || appId || 'App';
  const appDescription = app?.description || '';

  useEffect(() => {
    updateActiveTabLabel(`Edit ${appName}`);
  }, [updateActiveTabLabel, appName]);

  // Target section state
  const [releaseName] = useState('Cluster name (current)');
  const [namespace, setNamespace] = useState(installedApp?.namespace || '');

  // Version section state
  const [selectedVersion, setSelectedVersion] = useState(installedApp?.version || '');

  // Configuration section state
  const [configAppName, setConfigAppName] = useState(installedApp?.name || 'postgresql-2');
  const [adminPassword, setAdminPassword] = useState(installedApp?.adminPassword || '');
  const [databaseName, setDatabaseName] = useState(installedApp?.databaseName || '');
  const [storageClass, setStorageClass] = useState(installedApp?.storageClass || '');
  const [storageSize, setStorageSize] = useState<number | undefined>(installedApp?.storageSize);
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors
  const [namespaceError, setNamespaceError] = useState<string | null>(null);
  const [versionError, setVersionError] = useState<string | null>(null);
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(null);
  const [databaseNameError, setDatabaseNameError] = useState<string | null>(null);
  const [storageClassError, setStorageClassError] = useState<string | null>(null);
  const [storageSizeError, setStorageSizeError] = useState<string | null>(null);

  // Wizard state
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>({
    target: 'active',
    version: 'pre',
    configuration: 'pre',
  });

  const validateTarget = () => {
    let hasError = false;
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

  const validateConfiguration = () => {
    let hasError = false;
    if (!adminPassword.trim()) {
      setAdminPasswordError('Please enter an admin password.');
      hasError = true;
    } else {
      setAdminPasswordError(null);
    }
    if (!databaseName.trim()) {
      setDatabaseNameError('Please enter a database name.');
      hasError = true;
    } else {
      setDatabaseNameError(null);
    }
    if (!storageClass) {
      setStorageClassError('Please select a storage class.');
      hasError = true;
    } else {
      setStorageClassError(null);
    }
    if (storageSize === undefined || storageSize < 1) {
      setStorageSizeError('Please enter a valid storage size.');
      hasError = true;
    } else {
      setStorageSizeError(null);
    }
    return !hasError;
  };

  const goToNextSection = useCallback(
    (currentSection: SectionStep) => {
      let isValid = true;
      if (currentSection === 'target') isValid = validateTarget();
      else if (currentSection === 'version') isValid = validateVersion();
      else if (currentSection === 'configuration') isValid = validateConfiguration();
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
    [
      releaseName,
      namespace,
      selectedVersion,
      adminPassword,
      databaseName,
      storageClass,
      storageSize,
    ]
  );

  const isEditing = SECTION_ORDER.some((s) => sectionStatus[s] === 'writing');

  const editSection = useCallback((section: SectionStep) => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      SECTION_ORDER.forEach((s) => {
        if (s === section) {
          newStatus[s] = 'active';
        } else if (newStatus[s] === 'active') {
          newStatus[s] = 'writing';
        }
      });
      return newStatus;
    });
  }, []);

  const doneEditing = useCallback(() => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      SECTION_ORDER.forEach((s) => {
        if (newStatus[s] === 'active') {
          newStatus[s] = 'done';
        }
      });
      const firstWriting = SECTION_ORDER.find((s) => newStatus[s] === 'writing');
      if (firstWriting) {
        newStatus[firstWriting] = 'active';
      }
      return newStatus;
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      SECTION_ORDER.forEach((s) => {
        if (newStatus[s] === 'active') {
          newStatus[s] = 'done';
        }
      });
      const firstWriting = SECTION_ORDER.find((s) => newStatus[s] === 'writing');
      if (firstWriting) {
        newStatus[firstWriting] = 'active';
      }
      return newStatus;
    });
  }, []);

  const allDone = SECTION_ORDER.every((s) => sectionStatus[s] === 'done');

  const handleCancel = () => {
    navigate(`/container/installed-apps/${appId}`);
  };

  const handleSave = () => {
    console.log('Saving:', {
      appId,
      namespace,
      selectedVersion,
      configAppName,
      adminPassword,
      databaseName,
      storageClass,
      storageSize,
    });
    navigate(`/container/installed-apps/${appId}`);
  };

  const currentVersions = versionOptions[chartName] || [
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
                { label: 'Apps', href: '/container/installed-apps' },
                { label: 'Installed Apps', href: '/container/installed-apps' },
                { label: `Edit ${appName}` },
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
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Edit {appName}</h1>
          {appDescription && (
            <p className="text-body-md text-[var(--color-text-subtle)]">{appDescription}</p>
          )}
        </VStack>

        {/* Content Area */}
        <HStack gap={6} align="start" className="w-full">
          {/* Left Column - Wizard Sections */}
          <VStack gap={4} className="flex-1">
            {/* Target Section */}
            {sectionStatus['target'] === 'writing' ? (
              <WritingSection
                title={SECTION_LABELS['target']}
                onEdit={() => editSection('target')}
              />
            ) : (
              <SectionCard isActive={sectionStatus['target'] === 'active'}>
                <SectionCard.Header
                  title={SECTION_LABELS['target']}
                  showDivider={sectionStatus['target'] === 'done'}
                  actions={
                    sectionStatus['target'] === 'active' && isEditing ? (
                      <HStack gap={2}>
                        <Button variant="secondary" size="sm" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={doneEditing}>
                          Done
                        </Button>
                      </HStack>
                    ) : sectionStatus['target'] === 'done' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconEdit size={12} />}
                        onClick={() => editSection('target')}
                      >
                        Edit
                      </Button>
                    ) : undefined
                  }
                />
                {sectionStatus['target'] === 'active' && (
                  <SectionCard.Content showDividers={false}>
                    <VStack gap={0}>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="py-6">
                        <FormField>
                          <FormField.Label>Cluster</FormField.Label>
                          <FormField.Control>
                            <Select
                              options={[{ value: 'current', label: 'Cluster name (current)' }]}
                              value="current"
                              disabled
                              fullWidth
                            />
                          </FormField.Control>
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="py-6">
                        <FormField required error={!!namespaceError}>
                          <FormField.Label>Namespace</FormField.Label>
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
                      {!isEditing && (
                        <HStack justify="end" className="pt-3">
                          <Button variant="primary" onClick={() => goToNextSection('target')}>
                            Next
                          </Button>
                        </HStack>
                      )}
                    </VStack>
                  </SectionCard.Content>
                )}
                {sectionStatus['target'] === 'done' && (
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Cluster" value={releaseName || '-'} />
                    <SectionCard.DataRow label="Namespace" value={namespace || '-'} />
                  </SectionCard.Content>
                )}
              </SectionCard>
            )}

            {/* Version Section */}
            {sectionStatus['version'] === 'writing' ? (
              <WritingSection
                title={SECTION_LABELS['version']}
                onEdit={() => editSection('version')}
              />
            ) : sectionStatus['version'] === 'pre' ? (
              <PreSection title={SECTION_LABELS['version']} />
            ) : (
              <SectionCard isActive={sectionStatus['version'] === 'active'}>
                <SectionCard.Header
                  title={SECTION_LABELS['version']}
                  showDivider={sectionStatus['version'] === 'done'}
                  actions={
                    sectionStatus['version'] === 'active' && isEditing ? (
                      <HStack gap={2}>
                        <Button variant="secondary" size="sm" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={doneEditing}>
                          Done
                        </Button>
                      </HStack>
                    ) : sectionStatus['version'] === 'done' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconEdit size={12} />}
                        onClick={() => editSection('version')}
                      >
                        Edit
                      </Button>
                    ) : undefined
                  }
                />
                {sectionStatus['version'] === 'active' && (
                  <SectionCard.Content showDividers={false}>
                    <VStack gap={0}>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="py-6">
                        <FormField required error={!!versionError}>
                          <FormField.Label>Chart version</FormField.Label>
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
                      {!isEditing && (
                        <HStack justify="end" className="pt-3">
                          <Button variant="primary" onClick={() => goToNextSection('version')}>
                            Next
                          </Button>
                        </HStack>
                      )}
                    </VStack>
                  </SectionCard.Content>
                )}
                {sectionStatus['version'] === 'done' && (
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Chart version" value={selectedVersion || '-'} />
                  </SectionCard.Content>
                )}
              </SectionCard>
            )}

            {/* Configuration Section */}
            {sectionStatus['configuration'] === 'writing' ? (
              <WritingSection
                title={SECTION_LABELS['configuration']}
                onEdit={() => editSection('configuration')}
              />
            ) : sectionStatus['configuration'] === 'pre' ? (
              <PreSection title={SECTION_LABELS['configuration']} />
            ) : (
              <SectionCard isActive={sectionStatus['configuration'] === 'active'}>
                <SectionCard.Header
                  title={SECTION_LABELS['configuration']}
                  showDivider={sectionStatus['configuration'] === 'done'}
                  actions={
                    sectionStatus['configuration'] === 'active' && isEditing ? (
                      <HStack gap={2}>
                        <Button variant="secondary" size="sm" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={doneEditing}>
                          Done
                        </Button>
                      </HStack>
                    ) : sectionStatus['configuration'] === 'done' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconEdit size={12} />}
                        onClick={() => editSection('configuration')}
                      >
                        Edit
                      </Button>
                    ) : undefined
                  }
                />
                {sectionStatus['configuration'] === 'active' && (
                  <SectionCard.Content showDividers={false}>
                    <VStack gap={0}>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="py-6">
                        <FormField>
                          <FormField.Label>App name</FormField.Label>
                          <FormField.Control>
                            <Input value={configAppName} disabled fullWidth />
                          </FormField.Control>
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="py-6">
                        <FormField required error={!!adminPasswordError}>
                          <FormField.Label>Admin Password</FormField.Label>
                          <FormField.Control>
                            <div className="relative w-full">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                value={adminPassword}
                                onChange={(e) => {
                                  setAdminPassword(e.target.value);
                                  setAdminPasswordError(null);
                                }}
                                placeholder="Enter admin password"
                                fullWidth
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? (
                                  <IconEyeOff
                                    size={14}
                                    className="text-[var(--color-text-subtle)]"
                                  />
                                ) : (
                                  <IconEye size={14} className="text-[var(--color-text-subtle)]" />
                                )}
                              </button>
                            </div>
                          </FormField.Control>
                          <FormField.ErrorMessage>{adminPasswordError}</FormField.ErrorMessage>
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="py-6">
                        <FormField required error={!!databaseNameError}>
                          <FormField.Label>Database Name</FormField.Label>
                          <FormField.Control>
                            <Input
                              value={databaseName}
                              onChange={(e) => {
                                setDatabaseName(e.target.value);
                                setDatabaseNameError(null);
                              }}
                              placeholder="Enter Database Name"
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.ErrorMessage>{databaseNameError}</FormField.ErrorMessage>
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="py-6">
                        <FormField required error={!!storageClassError}>
                          <FormField.Label>Storage Class</FormField.Label>
                          <FormField.Control>
                            <Select
                              options={storageClassOptions}
                              value={storageClass}
                              onChange={(value) => {
                                setStorageClass(value);
                                setStorageClassError(null);
                              }}
                              placeholder="Select StorageClass"
                              fullWidth
                            />
                          </FormField.Control>
                          <FormField.ErrorMessage>{storageClassError}</FormField.ErrorMessage>
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      <div className="py-6">
                        <FormField required error={!!storageSizeError}>
                          <FormField.Label>Storage Size</FormField.Label>
                          <FormField.Control>
                            <NumberInput
                              value={storageSize}
                              onChange={(v) => {
                                setStorageSize(v);
                                setStorageSizeError(null);
                              }}
                              min={1}
                              placeholder="eg. 8"
                              width="sm"
                              suffix="GiB"
                            />
                          </FormField.Control>
                          <FormField.ErrorMessage>{storageSizeError}</FormField.ErrorMessage>
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                      {!isEditing && (
                        <HStack justify="end" className="pt-3">
                          <Button
                            variant="primary"
                            onClick={() => goToNextSection('configuration')}
                          >
                            Done
                          </Button>
                        </HStack>
                      )}
                    </VStack>
                  </SectionCard.Content>
                )}
                {sectionStatus['configuration'] === 'done' && (
                  <SectionCard.Content>
                    <SectionCard.DataRow label="App name" value={configAppName || '-'} />
                    <SectionCard.DataRow
                      label="Admin Password"
                      value={adminPassword ? '••••••' : '-'}
                    />
                    <SectionCard.DataRow label="Database Name" value={databaseName || '-'} />
                    <SectionCard.DataRow label="Storage Class" value={storageClass || '-'} />
                    <SectionCard.DataRow
                      label="Storage Size"
                      value={storageSize ? `${storageSize} GiB` : '-'}
                    />
                  </SectionCard.Content>
                )}
              </SectionCard>
            )}
          </VStack>

          {/* Right Column - Summary Sidebar */}
          <SummarySidebar
            sectionStatus={sectionStatus}
            onCancel={handleCancel}
            onSave={handleSave}
            isSaveDisabled={!allDone}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}
