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
  Toggle,
} from '@/design-system';
import type { WizardSectionState, WizardSummaryItem } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconEdit, IconEye, IconEyeOff } from '@tabler/icons-react';

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
  cnpg: {
    name: 'CNPG',
    description:
      'PostgreSQL cluster instance managed by CloudNativePG Operator. Requires CNPG Operator to be installed first. Supports HA, PgBouncer pooling, and automated backups.',
  },
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

const imagePullPolicyOptions = [
  { value: 'IfNotPresent', label: 'IfNotPresent' },
  { value: 'Always', label: 'Always' },
  { value: 'Never', label: 'Never' },
];

const resourceTierOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'X-Large' },
];

const updateStrategyOptions = [
  { value: 'unsupervised', label: 'unsupervised (automatic)' },
  { value: 'supervised', label: 'supervised (manual)' },
];

const updateMethodOptions = [
  { value: 'restart', label: 'restart' },
  { value: 'switchover', label: 'switchover' },
];

const poolerConnectionTypeOptions = [
  { value: 'rw', label: 'rw (read-write)' },
  { value: 'ro', label: 'ro (read-only)' },
];

const poolModeOptions = [
  { value: 'transaction', label: 'transaction' },
  { value: 'session', label: 'session' },
  { value: 'statement', label: 'statement' },
];

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
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-6">
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
  const [releaseName] = useState('Cluster name (current)');
  const [namespace, setNamespace] = useState('');

  // Version section state
  const [selectedVersion, setSelectedVersion] = useState('');

  // Configuration section state
  const [configAppName] = useState('cnpg-instance');
  const [instanceName, setInstanceName] = useState('postgres');
  const [postgresImage, setPostgresImage] = useState(
    'ghcr.io/cloudnative-pg/postgresql:17.6-system-trixie'
  );
  const [imagePullPolicy, setImagePullPolicy] = useState('IfNotPresent');
  const [resourceTier, setResourceTier] = useState('medium');
  const [instanceCount, setInstanceCount] = useState<number | undefined>(3);
  const [cpuRequest, setCpuRequest] = useState('500m');
  const [cpuLimit, setCpuLimit] = useState('1000m');
  const [memoryRequest, setMemoryRequest] = useState('1Gi');
  const [memoryLimit, setMemoryLimit] = useState('2Gi');
  const [updateStrategy, setUpdateStrategy] = useState('unsupervised');
  const [updateMethod, setUpdateMethod] = useState('restart');
  const [dataStorageSize, setDataStorageSize] = useState('20Gi');
  const [storageClass, setStorageClass] = useState('');
  const [appDatabaseName, setAppDatabaseName] = useState('app');
  const [appDbUsername, setAppDbUsername] = useState('app');
  const [appDbPassword, setAppDbPassword] = useState('');
  const [enableSuperuser, setEnableSuperuser] = useState(false);
  const [superuserPassword, setSuperuserPassword] = useState('');
  const [enablePgBouncer, setEnablePgBouncer] = useState(false);
  const [poolerConnectionType, setPoolerConnectionType] = useState('rw');
  const [poolerInstanceCount, setPoolerInstanceCount] = useState<number | undefined>(3);
  const [poolMode, setPoolMode] = useState('transaction');
  const [enableClusterPodMonitor, setEnableClusterPodMonitor] = useState(false);
  const [enablePoolerPodMonitor, setEnablePoolerPodMonitor] = useState(false);
  const [showAppDbPassword, setShowAppDbPassword] = useState(false);
  const [showSuperuserPassword, setShowSuperuserPassword] = useState(false);

  // Validation errors
  const [namespaceError, setNamespaceError] = useState<string | null>(null);
  const [versionError, setVersionError] = useState<string | null>(null);
  const [instanceNameError, setInstanceNameError] = useState<string | null>(null);
  const [storageClassError, setStorageClassError] = useState<string | null>(null);

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
    if (!instanceName.trim()) {
      setInstanceNameError('Please enter an instance name.');
      hasError = true;
    } else {
      setInstanceNameError(null);
    }
    if (!storageClass) {
      setStorageClassError('Please select a storage class.');
      hasError = true;
    } else {
      setStorageClassError(null);
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
    [releaseName, namespace, selectedVersion, instanceName, storageClass]
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
    navigate('/container/catalog');
  };

  const handleInstall = () => {
    console.log('Installing:', {
      appId,
      namespace,
      selectedVersion,
      configAppName,
      instanceName,
      postgresImage,
      imagePullPolicy,
      resourceTier,
      instanceCount,
      cpuRequest,
      cpuLimit,
      memoryRequest,
      memoryLimit,
      updateStrategy,
      updateMethod,
      dataStorageSize,
      storageClass,
      appDatabaseName,
      appDbUsername,
      enableSuperuser,
      enablePgBouncer,
      enableClusterPodMonitor,
      enablePoolerPodMonitor,
    });
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Catalog', href: '/container/catalog' }, { label: 'Install' }]}
            />
          }
          actions={<ContainerTopBarActions />}
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
                              error={!!namespaceError}
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
                          <FormField.Label>Version</FormField.Label>
                          <FormField.Control>
                            <Select
                              value={selectedVersion}
                              onChange={(value) => {
                                setSelectedVersion(value);
                                setVersionError(null);
                              }}
                              placeholder="Select version"
                              options={currentVersions}
                              error={!!versionError}
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
                    <SectionCard.DataRow label="Version" value={selectedVersion || '-'} />
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

                      {/* App name (disabled) */}
                      <div className="py-6">
                        <FormField label="App name">
                          <Input value={configAppName} disabled fullWidth />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Instance Name */}
                      <div className="py-6">
                        <FormField
                          label="Instance Name"
                          helperText="Cluster resource name (must be unique within the namespace)"
                          required
                          error={!!instanceNameError}
                          errorMessage={instanceNameError ?? undefined}
                        >
                          <Input
                            value={instanceName}
                            onChange={(e) => {
                              setInstanceName(e.target.value);
                              setInstanceNameError(null);
                            }}
                            placeholder="postgres"
                            fullWidth
                            error={!!instanceNameError}
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* PostgreSQL Image */}
                      <div className="py-6">
                        <FormField
                          label="PostgreSQL Image"
                          helperText="CNPG-compatible operand image"
                          required
                        >
                          <Input
                            value={postgresImage}
                            onChange={(e) => setPostgresImage(e.target.value)}
                            placeholder="ghcr.io/cloudnative-pg/postgresql:17.6-system-trixie"
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Image Pull Policy */}
                      <div className="py-6">
                        <FormField label="Image Pull Policy" required>
                          <Select
                            options={imagePullPolicyOptions}
                            value={imagePullPolicy}
                            onChange={setImagePullPolicy}
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* RESOURCES sub-header */}
                      <div className="pt-4 pb-2">
                        <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                          Resources
                        </h6>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Resource Tier */}
                      <div className="py-6">
                        <FormField label="Resource Tier">
                          <Select
                            options={resourceTierOptions}
                            value={resourceTier}
                            onChange={setResourceTier}
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Instance Count */}
                      <div className="py-6">
                        <FormField label="Instance Count" required>
                          <NumberInput
                            value={instanceCount}
                            onChange={setInstanceCount}
                            min={1}
                            max={10}
                            width="sm"
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* CPU Request */}
                      <div className="py-6">
                        <FormField label="CPU Request" required>
                          <Input
                            value={cpuRequest}
                            onChange={(e) => setCpuRequest(e.target.value)}
                            placeholder="500m"
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* CPU Limit */}
                      <div className="py-6">
                        <FormField label="CPU Limit" required>
                          <Input
                            value={cpuLimit}
                            onChange={(e) => setCpuLimit(e.target.value)}
                            placeholder="1000m"
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Memory Request */}
                      <div className="py-6">
                        <FormField label="Memory Request" required>
                          <Input
                            value={memoryRequest}
                            onChange={(e) => setMemoryRequest(e.target.value)}
                            placeholder="1Gi"
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Memory Limit */}
                      <div className="py-6">
                        <FormField label="Memory Limit" required>
                          <Input
                            value={memoryLimit}
                            onChange={(e) => setMemoryLimit(e.target.value)}
                            placeholder="2Gi"
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* UPDATE POLICY sub-header */}
                      <div className="pt-4 pb-2">
                        <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                          Update Policy
                        </h6>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Primary Update Strategy */}
                      <div className="py-6">
                        <FormField label="Primary Update Strategy" required>
                          <Select
                            options={updateStrategyOptions}
                            value={updateStrategy}
                            onChange={setUpdateStrategy}
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Primary Update Method */}
                      <div className="py-6">
                        <FormField label="Primary Update Method" required>
                          <Select
                            options={updateMethodOptions}
                            value={updateMethod}
                            onChange={setUpdateMethod}
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* STORAGE sub-header */}
                      <div className="pt-4 pb-2">
                        <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                          Storage
                        </h6>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Data Storage Size */}
                      <div className="py-6">
                        <FormField
                          label="Data Storage Size"
                          helperText="PVC size per instance (e.g. 20Gi)"
                          required
                        >
                          <Input
                            value={dataStorageSize}
                            onChange={(e) => setDataStorageSize(e.target.value)}
                            placeholder="20Gi"
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* StorageClass */}
                      <div className="py-6">
                        <FormField
                          label="StorageClass"
                          required
                          error={!!storageClassError}
                          errorMessage={storageClassError ?? undefined}
                        >
                          <Select
                            options={storageClassOptions}
                            value={storageClass}
                            onChange={(value) => {
                              setStorageClass(value);
                              setStorageClassError(null);
                            }}
                            placeholder="Select..."
                            fullWidth
                            error={!!storageClassError}
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* DATABASE sub-header */}
                      <div className="pt-4 pb-2">
                        <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                          Database
                        </h6>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* App Database Name */}
                      <div className="py-6">
                        <FormField
                          label="App Database Name"
                          helperText="Initial database name created during bootstrap"
                          required
                        >
                          <Input
                            value={appDatabaseName}
                            onChange={(e) => setAppDatabaseName(e.target.value)}
                            placeholder="app"
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* App DB Username */}
                      <div className="py-6">
                        <FormField label="App DB Username" required>
                          <Input
                            value={appDbUsername}
                            onChange={(e) => setAppDbUsername(e.target.value)}
                            placeholder="app"
                            fullWidth
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* App DB Password */}
                      <div className="py-6">
                        <FormField label="App DB Password" required>
                          <div className="relative w-full">
                            <Input
                              type={showAppDbPassword ? 'text' : 'password'}
                              value={appDbPassword}
                              onChange={(e) => setAppDbPassword(e.target.value)}
                              placeholder="Enter password"
                              fullWidth
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
                              onClick={() => setShowAppDbPassword(!showAppDbPassword)}
                              aria-label={showAppDbPassword ? 'Hide password' : 'Show password'}
                            >
                              {showAppDbPassword ? (
                                <IconEyeOff size={14} className="text-[var(--color-text-subtle)]" />
                              ) : (
                                <IconEye size={14} className="text-[var(--color-text-subtle)]" />
                              )}
                            </button>
                          </div>
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Enable Superuser Access */}
                      <div className="py-6">
                        <FormField
                          label="Enable Superuser Access"
                          helperText="Creates a Kubernetes Secret for the postgres superuser account"
                          spacing="loose"
                        >
                          <Toggle checked={enableSuperuser} onChange={setEnableSuperuser} />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Superuser Password (shown when superuser enabled) */}
                      {enableSuperuser && (
                        <>
                          <div className="py-6">
                            <FormField
                              label="Superuser Password"
                              helperText="Required when Superuser Access is enabled"
                              required
                            >
                              <div className="relative w-full">
                                <Input
                                  type={showSuperuserPassword ? 'text' : 'password'}
                                  value={superuserPassword}
                                  onChange={(e) => setSuperuserPassword(e.target.value)}
                                  placeholder="Enter superuser password"
                                  fullWidth
                                />
                                <button
                                  type="button"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
                                  onClick={() => setShowSuperuserPassword(!showSuperuserPassword)}
                                  aria-label={
                                    showSuperuserPassword ? 'Hide password' : 'Show password'
                                  }
                                >
                                  {showSuperuserPassword ? (
                                    <IconEyeOff
                                      size={14}
                                      className="text-[var(--color-text-subtle)]"
                                    />
                                  ) : (
                                    <IconEye
                                      size={14}
                                      className="text-[var(--color-text-subtle)]"
                                    />
                                  )}
                                </button>
                              </div>
                            </FormField>
                          </div>
                          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                        </>
                      )}

                      {/* PGBOUNCER sub-header */}
                      <div className="pt-4 pb-2">
                        <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                          PgBouncer
                        </h6>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Enable PgBouncer Pooler */}
                      <div className="py-6">
                        <FormField
                          label="Enable PgBouncer Pooler"
                          helperText="Activates PgBouncer connection pooler"
                          spacing="loose"
                        >
                          <Toggle checked={enablePgBouncer} onChange={setEnablePgBouncer} />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* PgBouncer fields (shown when enabled) */}
                      {enablePgBouncer && (
                        <>
                          {/* Pooler Connection Type */}
                          <div className="py-6">
                            <FormField label="Pooler Connection Type" required>
                              <Select
                                options={poolerConnectionTypeOptions}
                                value={poolerConnectionType}
                                onChange={setPoolerConnectionType}
                                fullWidth
                              />
                            </FormField>
                          </div>
                          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                          {/* Pooler Instance Count */}
                          <div className="py-6">
                            <FormField
                              label="Pooler Instance Count"
                              helperText="Number of PgBouncer replicas"
                              required
                            >
                              <NumberInput
                                value={poolerInstanceCount}
                                onChange={setPoolerInstanceCount}
                                min={1}
                                max={10}
                                width="sm"
                              />
                            </FormField>
                          </div>
                          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                          {/* Pool Mode */}
                          <div className="py-6">
                            <FormField label="Pool Mode">
                              <Select
                                options={poolModeOptions}
                                value={poolMode}
                                onChange={setPoolMode}
                                fullWidth
                              />
                            </FormField>
                          </div>
                          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                        </>
                      )}

                      {/* MONITORING sub-header */}
                      <div className="pt-4 pb-2">
                        <h6 className="text-heading-h6 text-[var(--color-text-default)]">
                          Monitoring
                        </h6>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Enable Cluster PodMonitor */}
                      <div className="py-6">
                        <FormField
                          label="Enable Cluster PodMonitor"
                          helperText="Requires Prometheus Operator"
                          spacing="loose"
                        >
                          <Toggle
                            checked={enableClusterPodMonitor}
                            onChange={setEnableClusterPodMonitor}
                          />
                        </FormField>
                      </div>
                      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

                      {/* Enable Pooler PodMonitor */}
                      <div className="py-6">
                        <FormField
                          label="Enable Pooler PodMonitor"
                          helperText="Requires Prometheus Operator"
                          spacing="loose"
                        >
                          <Toggle
                            checked={enablePoolerPodMonitor}
                            onChange={setEnablePoolerPodMonitor}
                          />
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
                    <SectionCard.DataRow label="Instance Name" value={instanceName || '-'} />
                    <SectionCard.DataRow label="PostgreSQL Image" value={postgresImage || '-'} />
                    <SectionCard.DataRow label="Image Pull Policy" value={imagePullPolicy || '-'} />
                    <SectionCard.DataRow
                      label="Resource Tier"
                      value={
                        resourceTierOptions.find((o) => o.value === resourceTier)?.label || '-'
                      }
                    />
                    <SectionCard.DataRow
                      label="Instance Count"
                      value={instanceCount?.toString() || '-'}
                    />
                    <SectionCard.DataRow label="CPU Request" value={cpuRequest || '-'} />
                    <SectionCard.DataRow label="CPU Limit" value={cpuLimit || '-'} />
                    <SectionCard.DataRow label="Memory Request" value={memoryRequest || '-'} />
                    <SectionCard.DataRow label="Memory Limit" value={memoryLimit || '-'} />
                    <SectionCard.DataRow
                      label="Primary Update Strategy"
                      value={
                        updateStrategyOptions.find((o) => o.value === updateStrategy)?.label || '-'
                      }
                    />
                    <SectionCard.DataRow
                      label="Primary Update Method"
                      value={
                        updateMethodOptions.find((o) => o.value === updateMethod)?.label || '-'
                      }
                    />
                    <SectionCard.DataRow label="Data Storage Size" value={dataStorageSize || '-'} />
                    <SectionCard.DataRow label="StorageClass" value={storageClass || '-'} />
                    <SectionCard.DataRow label="App Database Name" value={appDatabaseName || '-'} />
                    <SectionCard.DataRow label="App DB Username" value={appDbUsername || '-'} />
                    <SectionCard.DataRow
                      label="App DB Password"
                      value={appDbPassword ? '••••••' : '-'}
                    />
                    <SectionCard.DataRow
                      label="Superuser Access"
                      value={enableSuperuser ? 'Enabled' : 'Disabled'}
                    />
                    <SectionCard.DataRow
                      label="PgBouncer Pooler"
                      value={enablePgBouncer ? 'Enabled' : 'Disabled'}
                    />
                    {enablePgBouncer && (
                      <>
                        <SectionCard.DataRow
                          label="Pooler Connection Type"
                          value={
                            poolerConnectionTypeOptions.find(
                              (o) => o.value === poolerConnectionType
                            )?.label || '-'
                          }
                        />
                        <SectionCard.DataRow
                          label="Pooler Instance Count"
                          value={poolerInstanceCount?.toString() || '-'}
                        />
                        <SectionCard.DataRow label="Pool Mode" value={poolMode || '-'} />
                      </>
                    )}
                    <SectionCard.DataRow
                      label="Cluster PodMonitor"
                      value={enableClusterPodMonitor ? 'Enabled' : 'Disabled'}
                    />
                    <SectionCard.DataRow
                      label="Pooler PodMonitor"
                      value={enablePoolerPodMonitor ? 'Enabled' : 'Disabled'}
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
            onInstall={handleInstall}
            isInstallDisabled={!allDone}
          />
        </HStack>
      </VStack>
    </PageShell>
  );
}
