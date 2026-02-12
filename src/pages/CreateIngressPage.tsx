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
  Select,
  Disclosure,
  SectionCard,
  InlineMessage,
  PageShell,
} from '@/design-system';
import type { WizardSectionState } from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconSearch,
  IconX,
  IconCheck,
  IconCirclePlus,
  IconFile,
  IconCopy,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type IngressSectionStep =
  | 'basic-info'
  | 'rules'
  | 'default-backend'
  | 'certificates'
  | 'ingress-class'
  | 'labels-annotations';

// Section labels for display
const INGRESS_SECTION_LABELS: Record<IngressSectionStep, string> = {
  'basic-info': 'Basic Information',
  rules: 'Rules',
  'default-backend': 'Default Backend',
  certificates: 'Certificates',
  'ingress-class': 'Ingress Class',
  'labels-annotations': 'Labels & Annotations',
};

// Section order for navigation
const INGRESS_SECTION_ORDER: IngressSectionStep[] = [
  'basic-info',
  'rules',
  'default-backend',
  'certificates',
  'ingress-class',
  'labels-annotations',
];

// Namespace options
const NAMESPACE_OPTIONS = [
  { value: 'default', label: 'default' },
  { value: 'kube-system', label: 'kube-system' },
  { value: 'kube-public', label: 'kube-public' },
  { value: 'monitoring', label: 'monitoring' },
  { value: 'production', label: 'production' },
];

// Path Type options
const PATH_TYPE_OPTIONS = [
  { value: 'Prefix', label: 'Prefix' },
  { value: 'Exact', label: 'Exact' },
  { value: 'ImplementationSpecific', label: 'ImplementationSpecific' },
];

// Target Service options
const TARGET_SERVICE_OPTIONS = [
  { value: '', label: '' },
  { value: 'nginx-service', label: 'nginx-service' },
  { value: 'frontend-service', label: 'frontend-service' },
  { value: 'backend-service', label: 'backend-service' },
  { value: 'api-service', label: 'api-service' },
];

// Ingress Class options
const INGRESS_CLASS_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'nginx', label: 'nginx' },
  { value: 'traefik', label: 'traefik' },
  { value: 'haproxy', label: 'haproxy' },
];

// Certificate options
const CERTIFICATE_OPTIONS = [
  { value: '', label: 'Select a certificate' },
  { value: 'tls-secret-1', label: 'tls-secret-1' },
  { value: 'tls-secret-2', label: 'tls-secret-2' },
  { value: 'wildcard-cert', label: 'wildcard-cert' },
];

interface Label {
  id: string;
  key: string;
  value: string;
}

interface Annotation {
  id: string;
  key: string;
  value: string;
}

interface IngressPath {
  id: string;
  pathType: string;
  path: string;
  targetService: string;
  port: string;
}

interface IngressRule {
  id: string;
  host: string;
  paths: IngressPath[];
}

interface Certificate {
  id: string;
  secretName: string;
  hosts: string[];
}

/* ----------------------------------------
   Summary Status Icon Component
   ---------------------------------------- */
function SummaryStatusIcon({ status }: { status: WizardSectionState }) {
  // done → success (green check)
  if (status === 'done') {
    return (
      <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center">
        <IconCheck size={10} stroke={2} className="text-white" />
      </div>
    );
  }
  // active → dashed circle with spinning animation
  if (status === 'active') {
    return (
      <div
        className="size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 animate-spin"
        style={{ borderStyle: 'dashed', animationDuration: '2s' }}
      />
    );
  }
  // pre/default → empty dashed circle
  return (
    <div
      className="size-4 rounded-full border border-[var(--color-border-default)] shrink-0"
      style={{ borderStyle: 'dashed' }}
    />
  );
}

/* ----------------------------------------
   Summary Sidebar Component
   ---------------------------------------- */
function SummarySidebar({
  sectionStates,
}: {
  sectionStates: Record<IngressSectionStep, WizardSectionState>;
}) {
  const navigate = useNavigate();

  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
        {/* Inner subtle-bg container */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={4}>
            <span className="text-heading-h5">Summary</span>
            <VStack gap={0}>
              {INGRESS_SECTION_ORDER.map((step) => (
                <HStack key={step} justify="between" className="py-1">
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {INGRESS_SECTION_LABELS[step]}
                  </span>
                  <SummaryStatusIcon status={sectionStates[step]} />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </div>

        {/* Button row */}
        <HStack gap={2}>
          <Button variant="secondary" size="md" onClick={() => navigate('/container/ingresses')}>
            Cancel
          </Button>
          <Button variant="primary" size="md" className="flex-1">
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page Component
   ---------------------------------------- */
export default function CreateIngressPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab, addNewTab } =
    useTabs();

  // Update tab label
  useEffect(() => {
    updateActiveTabLabel('Create Ingress');
  }, [updateActiveTabLabel]);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Basic Information state
  const [namespace, setNamespace] = useState('default');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Rules state
  const [rules, setRules] = useState<IngressRule[]>([]);

  // Default Backend state
  const [defaultBackendService, setDefaultBackendService] = useState('');
  const [defaultBackendPort, setDefaultBackendPort] = useState('');

  // Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Ingress Class state
  const [ingressClass, setIngressClass] = useState('');

  // Labels & Annotations state
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Section states for summary
  const getSectionStates = (): Record<IngressSectionStep, WizardSectionState> => {
    return {
      'basic-info': namespace && name ? 'done' : 'active',
      rules: rules.length > 0 ? 'done' : 'pending',
      'default-backend': defaultBackendService ? 'done' : 'pending',
      certificates: certificates.length > 0 ? 'done' : 'pending',
      'ingress-class': ingressClass ? 'done' : 'pending',
      'labels-annotations': labels.length > 0 || annotations.length > 0 ? 'done' : 'pending',
    };
  };

  // Rule handlers
  const addRule = useCallback(() => {
    setRules((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        host: '',
        paths: [
          {
            id: Date.now().toString() + '-path',
            pathType: 'Prefix',
            path: '',
            targetService: '',
            port: '',
          },
        ],
      },
    ]);
  }, []);

  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRule = useCallback((id: string, field: keyof IngressRule, value: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  const addPath = useCallback((ruleId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              paths: [
                ...r.paths,
                {
                  id: Date.now().toString(),
                  pathType: 'Prefix',
                  path: '',
                  targetService: '',
                  port: '',
                },
              ],
            }
          : r
      )
    );
  }, []);

  const removePath = useCallback((ruleId: string, pathId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              paths: r.paths.filter((p) => p.id !== pathId),
            }
          : r
      )
    );
  }, []);

  const updatePath = useCallback(
    (ruleId: string, pathId: string, field: keyof IngressPath, value: string) => {
      setRules((prev) =>
        prev.map((r) =>
          r.id === ruleId
            ? {
                ...r,
                paths: r.paths.map((p) => (p.id === pathId ? { ...p, [field]: value } : p)),
              }
            : r
        )
      );
    },
    []
  );

  // Certificate handlers
  const addCertificate = useCallback(() => {
    setCertificates((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        secretName: '',
        hosts: [],
      },
    ]);
  }, []);

  const removeCertificate = useCallback((id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCertificate = useCallback(
    (id: string, field: keyof Certificate, value: string | string[]) => {
      setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    },
    []
  );

  // Label handlers
  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  // Annotation handlers
  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnotation = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }, []);

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
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
                { label: 'Service Discovery', href: '/container/services' },
                { label: 'Ingresses', href: '/container/ingresses' },
                { label: 'Create Ingress' },
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
      }
      contentClassName="pt-3 px-8 pb-20"
    >
      <VStack gap={6}>
        {/* Page Header */}
        <VStack gap={2}>
          <h1 className="text-heading-h4">Create ingress</h1>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            Ingresses route incoming traffic from the internet to Services within the cluster based
            on the hostname and path specified in the request. You can expose multiple Services on
            the same external IP address and port.
          </p>
        </VStack>

        {/* Main Content with Summary Sidebar */}
        <HStack gap={6} className="w-full items-start">
          {/* Form Sections */}
          <VStack gap={4} className="flex-1">
            {/* Basic Information Section */}
            <SectionCard>
              <SectionCard.Header title="Basic information" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Namespace */}
                  <VStack gap={2}>
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Namespace <span className="text-[var(--color-state-danger)]">*</span>
                    </label>
                    <Select
                      options={NAMESPACE_OPTIONS}
                      value={namespace}
                      onChange={setNamespace}
                      fullWidth
                    />
                  </VStack>

                  {/* Name */}
                  <VStack gap={2}>
                    <label className="text-label-lg text-[var(--color-text-default)]">
                      Name <span className="text-[var(--color-state-danger)]">*</span>
                    </label>
                    <Input
                      placeholder="Enter a unique name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                    />
                  </VStack>

                  {/* Description (collapsible) */}
                  <Disclosure>
                    <Disclosure.Trigger>Description</Disclosure.Trigger>
                    <Disclosure.Panel>
                      <div className="pt-2">
                        <Input
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          fullWidth
                        />
                      </div>
                    </Disclosure.Panel>
                  </Disclosure>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Rules Section */}
            <SectionCard>
              <SectionCard.Header title="Rules" />
              <SectionCard.Content>
                <VStack gap={2}>
                  {/* Rule rows */}
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="border border-[var(--color-border-default)] rounded-[6px] p-3 w-full"
                    >
                      <VStack gap={6}>
                        {/* Request Host with close button */}
                        <HStack gap={6} className="w-full" align="start">
                          <VStack gap={2} className="flex-1">
                            <label className="text-label-lg text-[var(--color-text-default)]">
                              Request Host
                            </label>
                            <Input
                              placeholder="e.g. example.com"
                              value={rule.host}
                              onChange={(e) => updateRule(rule.id, 'host', e.target.value)}
                              fullWidth
                            />
                          </VStack>
                          <button
                            onClick={() => removeRule(rule.id)}
                            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                          >
                            <IconX
                              size={16}
                              className="text-[var(--color-text-muted)]"
                              stroke={1.5}
                            />
                          </button>
                        </HStack>

                        {/* Paths container */}
                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                          <VStack gap={2}>
                            {rule.paths.length > 0 && (
                              <div className="grid grid-cols-[2fr_1fr_1fr_16px] gap-2 w-full">
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Path
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Target Service
                                </span>
                                <span className="block text-label-lg text-[var(--color-text-default)]">
                                  Port
                                </span>
                                <div />
                              </div>
                            )}
                            {rule.paths.map((path) => (
                              <div
                                key={path.id}
                                className="grid grid-cols-[2fr_1fr_1fr_16px] gap-2 w-full items-center"
                              >
                                {/* Path */}
                                <HStack gap={2}>
                                  <Select
                                    options={PATH_TYPE_OPTIONS}
                                    value={path.pathType}
                                    onChange={(value) =>
                                      updatePath(rule.id, path.id, 'pathType', value)
                                    }
                                    fullWidth
                                  />
                                  <Input
                                    placeholder="e.g. /foo"
                                    value={path.path}
                                    onChange={(e) =>
                                      updatePath(rule.id, path.id, 'path', e.target.value)
                                    }
                                    fullWidth
                                  />
                                </HStack>

                                {/* Target Service */}
                                <Select
                                  options={TARGET_SERVICE_OPTIONS}
                                  value={path.targetService}
                                  onChange={(value) =>
                                    updatePath(rule.id, path.id, 'targetService', value)
                                  }
                                  fullWidth
                                />

                                {/* Port */}
                                <Input
                                  placeholder="e.g. 80 or http"
                                  value={path.port}
                                  onChange={(e) =>
                                    updatePath(rule.id, path.id, 'port', e.target.value)
                                  }
                                  fullWidth
                                />

                                {/* Remove path button */}
                                <button
                                  onClick={() => removePath(rule.id, path.id)}
                                  className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                                >
                                  <IconX
                                    size={16}
                                    className="text-[var(--color-text-muted)]"
                                    stroke={1.5}
                                  />
                                </button>
                              </div>
                            ))}

                            {/* Add Path button */}
                            <div className="w-fit">
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                                onClick={() => addPath(rule.id)}
                              >
                                Add Path
                              </Button>
                            </div>
                          </VStack>
                        </div>
                      </VStack>
                    </div>
                  ))}

                  {/* Add Rule button */}
                  <div className="w-fit">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                      onClick={addRule}
                    >
                      Add Rule
                    </Button>
                  </div>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Default Backend Section */}
            <SectionCard>
              <SectionCard.Header title="Default backend" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Warning message */}
                  <InlineMessage variant="error">
                    Warning: Default backend is used globally for the entire cluster.
                  </InlineMessage>

                  {/* Target Service and Port */}
                  <HStack gap={3} className="w-full">
                    <VStack gap={2} className="flex-1">
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Target Service
                      </label>
                      <Select
                        options={[{ value: '', label: 'None' }, ...TARGET_SERVICE_OPTIONS.slice(1)]}
                        value={defaultBackendService}
                        onChange={setDefaultBackendService}
                        fullWidth
                      />
                    </VStack>
                    <VStack gap={2} className="flex-1">
                      <label className="text-label-lg text-[var(--color-text-default)]">Port</label>
                      <Input
                        placeholder="e.g. 80 or http"
                        value={defaultBackendPort}
                        onChange={(e) => setDefaultBackendPort(e.target.value)}
                        fullWidth
                      />
                    </VStack>
                  </HStack>
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Certificates Section */}
            <SectionCard>
              <SectionCard.Header title="Certificates" />
              <SectionCard.Content>
                <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                  <VStack gap={2}>
                    {/* Header row */}
                    {certificates.length > 0 && (
                      <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                        <span className="block text-label-lg text-[var(--color-text-default)]">
                          Secret Name
                        </span>
                        <span className="block text-label-lg text-[var(--color-text-default)]">
                          Hosts (comma separated)
                        </span>
                        <div />
                      </div>
                    )}

                    {/* Certificate rows */}
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                      >
                        <Select
                          options={CERTIFICATE_OPTIONS}
                          value={cert.secretName}
                          onChange={(value) => updateCertificate(cert.id, 'secretName', value)}
                          fullWidth
                        />
                        <Input
                          placeholder="e.g. example.com, api.example.com"
                          value={cert.hosts.join(', ')}
                          onChange={(e) =>
                            updateCertificate(
                              cert.id,
                              'hosts',
                              e.target.value.split(',').map((h) => h.trim())
                            )
                          }
                          fullWidth
                        />
                        <button
                          onClick={() => removeCertificate(cert.id)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        >
                          <IconX
                            size={16}
                            className="text-[var(--color-text-muted)]"
                            stroke={1.5}
                          />
                        </button>
                      </div>
                    ))}

                    {/* Add Certificate button */}
                    <div className="w-fit">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                        onClick={addCertificate}
                      >
                        Add Certificate
                      </Button>
                    </div>
                  </VStack>
                </div>
              </SectionCard.Content>
            </SectionCard>

            {/* Ingress Class Section */}
            <SectionCard>
              <SectionCard.Header title="Ingress class" />
              <SectionCard.Content>
                <VStack gap={2}>
                  <label className="text-label-lg text-[var(--color-text-default)]">
                    Ingress Class
                  </label>
                  <Select
                    options={INGRESS_CLASS_OPTIONS}
                    value={ingressClass}
                    onChange={setIngressClass}
                    width="half"
                  />
                </VStack>
              </SectionCard.Content>
            </SectionCard>

            {/* Labels & Annotations Section */}
            <SectionCard>
              <SectionCard.Header title="Labels & Annotations" />
              <SectionCard.Content>
                <VStack gap={6}>
                  {/* Labels */}
                  <VStack gap={3}>
                    <VStack gap={1}>
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Labels
                      </label>
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Specify the labels used to identify and categorize the resource.
                      </span>
                    </VStack>

                    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                      <VStack gap={2}>
                        {labels.length > 0 && (
                          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                            <span className="block text-label-lg text-[var(--color-text-default)]">
                              Key
                            </span>
                            <span className="block text-label-lg text-[var(--color-text-default)]">
                              Value
                            </span>
                            <div />
                          </div>
                        )}
                        {labels.map((label) => (
                          <div
                            key={label.id}
                            className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                          >
                            <Input
                              placeholder="Input key"
                              value={label.key}
                              onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                              fullWidth
                            />
                            <Input
                              placeholder="Input value"
                              value={label.value}
                              onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                              fullWidth
                            />
                            <button
                              onClick={() => removeLabel(label.id)}
                              className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                            >
                              <IconX
                                size={16}
                                className="text-[var(--color-text-muted)]"
                                stroke={1.5}
                              />
                            </button>
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
                    <VStack gap={1}>
                      <label className="text-label-lg text-[var(--color-text-default)]">
                        Annotations
                      </label>
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Specify the annotations used to provide additional metadata for the
                        resource.
                      </span>
                    </VStack>

                    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] p-3 w-full">
                      <VStack gap={2}>
                        {annotations.length > 0 && (
                          <div className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full">
                            <span className="block text-label-lg text-[var(--color-text-default)]">
                              Key
                            </span>
                            <span className="block text-label-lg text-[var(--color-text-default)]">
                              Value
                            </span>
                            <div />
                          </div>
                        )}
                        {annotations.map((annotation) => (
                          <div
                            key={annotation.id}
                            className="grid grid-cols-[1fr_1fr_20px] gap-2 w-full items-center"
                          >
                            <Input
                              placeholder="Input key"
                              value={annotation.key}
                              onChange={(e) =>
                                updateAnnotation(annotation.id, 'key', e.target.value)
                              }
                              fullWidth
                            />
                            <Input
                              placeholder="Input value"
                              value={annotation.value}
                              onChange={(e) =>
                                updateAnnotation(annotation.id, 'value', e.target.value)
                              }
                              fullWidth
                            />
                            <button
                              onClick={() => removeAnnotation(annotation.id)}
                              className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                            >
                              <IconX
                                size={16}
                                className="text-[var(--color-text-muted)]"
                                stroke={1.5}
                              />
                            </button>
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
          <SummarySidebar sectionStates={getSectionStates()} />
        </HStack>
      </VStack>
    </PageShell>
  );
}
