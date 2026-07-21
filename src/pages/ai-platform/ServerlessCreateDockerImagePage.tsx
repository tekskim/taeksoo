import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  Input,
  Select,
  NumberInput,
  Slider,
  Radio,
  RadioGroup,
  FormField,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Disclosure,
  InlineMessage,
  Textarea,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconExternalLink, IconCirclePlus, IconX } from '@tabler/icons-react';

const REGISTRY_CREDENTIAL_OPTIONS = [
  { value: 'docker-hub', label: 'Docker Hub — org registry' },
  { value: 'acr-prod', label: 'Azure ACR — prod' },
];

function newEnvRow() {
  return { id: crypto.randomUUID(), key: '', value: '' };
}

export function ServerlessCreateDockerImagePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [imageUri, setImageUri] = useState('');
  const [registryCredentials, setRegistryCredentials] = useState('');
  const [visibility, setVisibility] = useState('private');

  const [endpointName, setEndpointName] = useState('');
  const [computeType, setComputeType] = useState('gpu');

  const [containerPorts, setContainerPorts] = useState('8080,8448');
  const [envEditorTab, setEnvEditorTab] = useState<'list' | 'raw'>('list');
  const [envRows, setEnvRows] = useState(() => [newEnvRow(), newEnvRow(), newEnvRow()]);
  const [rawEnv, setRawEnv] = useState('');

  const [minReplicas, setMinReplicas] = useState(0);
  const [maxReplicas, setMaxReplicas] = useState(1);
  const [cooldown, setCooldown] = useState(300);
  const [reactionWindow, setReactionWindow] = useState(1);
  const [observationWindow, setObservationWindow] = useState(1800);

  useEffect(() => {
    updateActiveTabLabel('Import docker image');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const summaryDocker =
    imageUri.trim() || registryCredentials
      ? `${imageUri.trim() || '—'}${registryCredentials ? ` · ${registryCredentials}` : ''}`
      : '—';
  const summaryEndpoint = endpointName.trim() || '—';
  const summaryHardware = computeType === 'gpu' ? 'GPU' : 'CPU';
  const summaryAutoscaling = `${minReplicas}–${maxReplicas} replicas · ${cooldown}s cooldown`;

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Infrastructure' },
                { label: 'Serverless', href: '/ai-platform/serverless' },
                { label: 'Create endpoint', href: '/ai-platform/serverless/create' },
                { label: 'Import docker image' },
              ]}
            />
          }
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4} className="w-full">
        <VStack gap={2}>
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">Import docker image</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Import a Docker image from a registry to make it available for deployment within the
            platform.
          </p>
        </VStack>

        <div className="flex gap-6 w-full">
          <div className="flex-1 min-w-0 max-w-[1320px]">
            <VStack gap={6}>
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <VStack gap={6}>
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                    Docker image configuration
                  </h2>

                  <FormField
                    label="Image URI"
                    helperText="Specify the Docker image to deploy."
                    required
                  >
                    <Input
                      placeholder="Enter a name for this pod"
                      value={imageUri}
                      onChange={(e) => setImageUri(e.target.value)}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="Registry credentials"
                    helperText="Select the authentication credentials required to access a private container registry."
                  >
                    <VStack gap={2}>
                      <Select
                        options={REGISTRY_CREDENTIAL_OPTIONS}
                        placeholder="Select credentials"
                        value={registryCredentials}
                        onChange={setRegistryCredentials}
                        className="w-[328px]"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        rightIcon={<IconExternalLink size={12} />}
                      >
                        Create new credentials
                      </Button>
                    </VStack>
                  </FormField>

                  <FormField
                    label="Visibility"
                    description="Controls whether this endpoint is accessible publicly or only within the internal network."
                    spacing="loose"
                    required
                  >
                    <RadioGroup value={visibility} onChange={setVisibility} direction="horizontal">
                      <Radio value="private" label="Private" />
                      <Radio value="public" label="Public" />
                    </RadioGroup>
                  </FormField>
                </VStack>
              </div>

              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <VStack gap={6}>
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                    Endpoint configuration
                  </h2>

                  <FormField
                    label="Endpoint name"
                    helperText="Invalid name. Please follow DNS-1123 naming rules. Use lowercase letters, numbers, and hyphens only."
                    required
                  >
                    <Input
                      placeholder="Enter a name for this pod"
                      value={endpointName}
                      onChange={(e) => setEndpointName(e.target.value)}
                      fullWidth
                    />
                  </FormField>

                  <FormField
                    label="Compute"
                    description="Select the compute type required to run this container."
                    spacing="loose"
                  >
                    <RadioGroup
                      value={computeType}
                      onChange={setComputeType}
                      direction="horizontal"
                    >
                      <Radio value="cpu" label="CPU" />
                      <Radio value="gpu" label="GPU" />
                    </RadioGroup>
                  </FormField>

                  <VStack gap={4} className="w-full pt-2">
                    <Disclosure defaultOpen className="w-full">
                      <Disclosure.Trigger className="text-heading-h6 text-[var(--color-text-default)] w-full text-left">
                        Container configuration
                      </Disclosure.Trigger>
                      <Disclosure.Panel className="pt-4">
                        <FormField
                          label="Ports (comma-separated)"
                          helperText="Specify the ports exposed by the container."
                        >
                          <Input
                            placeholder="8080,8448"
                            value={containerPorts}
                            onChange={(e) => setContainerPorts(e.target.value)}
                            fullWidth
                          />
                        </FormField>
                      </Disclosure.Panel>
                    </Disclosure>

                    <Disclosure defaultOpen className="w-full">
                      <Disclosure.Trigger className="text-heading-h6 text-[var(--color-text-default)] w-full text-left">
                        Environment variables
                      </Disclosure.Trigger>
                      <Disclosure.Panel className="pt-4">
                        <VStack gap={4} className="w-full">
                          <p className="text-body-md text-[var(--color-text-subtle)]">
                            Define environment variables as key-value pairs.
                          </p>

                          <Tabs
                            value={envEditorTab}
                            onChange={(v) => setEnvEditorTab(v as 'list' | 'raw')}
                            variant="boxed"
                            size="sm"
                          >
                            <TabList>
                              <Tab value="list">List editor</Tab>
                              <Tab value="raw">Raw editor</Tab>
                            </TabList>

                            <TabPanel value="list" className="pt-4">
                              {envEditorTab === 'list' ? (
                                <VStack gap={3} className="w-full">
                                  <div className="grid grid-cols-[1fr_1fr_20px] gap-2 items-center w-full">
                                    <span className="text-label-sm text-[var(--color-text-subtle)]">
                                      Key
                                    </span>
                                    <span className="text-label-sm text-[var(--color-text-subtle)]">
                                      Value
                                    </span>
                                    <span className="sr-only">Remove</span>
                                    {envRows.map((row) => (
                                      <Fragment key={row.id}>
                                        <Input
                                          placeholder="e.g. team"
                                          value={row.key}
                                          onChange={(e) =>
                                            setEnvRows((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, key: e.target.value } : r
                                              )
                                            )
                                          }
                                          fullWidth
                                        />
                                        <Input
                                          placeholder="e.g. team"
                                          value={row.value}
                                          onChange={(e) =>
                                            setEnvRows((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? { ...r, value: e.target.value }
                                                  : r
                                              )
                                            )
                                          }
                                          fullWidth
                                        />
                                        <button
                                          type="button"
                                          aria-label="Remove variable row"
                                          className="flex h-8 w-5 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-default)]"
                                          onClick={() =>
                                            setEnvRows((prev) =>
                                              prev.filter((r) => r.id !== row.id)
                                            )
                                          }
                                        >
                                          <IconX size={14} />
                                        </button>
                                      </Fragment>
                                    ))}
                                  </div>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    type="button"
                                    leftIcon={<IconCirclePlus size={12} />}
                                    onClick={() => setEnvRows((prev) => [...prev, newEnvRow()])}
                                  >
                                    Add variable
                                  </Button>
                                  <InlineMessage variant="info">
                                    Environment variables will be injected into the container
                                  </InlineMessage>
                                </VStack>
                              ) : null}
                            </TabPanel>

                            <TabPanel value="raw" className="pt-4">
                              {envEditorTab === 'raw' ? (
                                <FormField
                                  label="Enter KEY=VALUE pairs, one per line"
                                  description="Enter environment variables in KEY=VALUE format, one per line."
                                >
                                  <Textarea
                                    variant="code"
                                    value={rawEnv}
                                    onChange={(e) => setRawEnv(e.target.value)}
                                    className="w-[328px]"
                                    placeholder={'DB_HOST=localhost\nDB_PORT=5432'}
                                    rows={4}
                                    resize="vertical"
                                  />
                                </FormField>
                              ) : null}
                            </TabPanel>
                          </Tabs>
                        </VStack>
                      </Disclosure.Panel>
                    </Disclosure>
                  </VStack>
                </VStack>
              </div>

              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <VStack gap={6}>
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                    Autoscaling configuration
                  </h2>

                  <Disclosure defaultOpen className="w-full">
                    <Disclosure.Trigger className="text-heading-h6 text-[var(--color-text-default)] w-full text-left">
                      Autoscaling settings
                    </Disclosure.Trigger>
                    <Disclosure.Panel className="pt-4">
                      <VStack gap={6}>
                        <p className="text-body-md text-[var(--color-text-subtle)]">
                          Configure automatic scaling for the Docker image deployment based on
                          resource usage or request load.
                        </p>

                        <FormField label="Min Replicas">
                          <NumberInput
                            min={0}
                            max={100}
                            step={1}
                            value={minReplicas}
                            onChange={setMinReplicas}
                            width="xs"
                          />
                        </FormField>

                        <FormField label="Max Replicas">
                          <NumberInput
                            min={1}
                            max={100}
                            step={1}
                            value={maxReplicas}
                            onChange={setMaxReplicas}
                            width="xs"
                          />
                        </FormField>

                        <FormField>
                          <HStack justify="between" align="start" className="w-full">
                            <FormField.Label>Cooldown (s)</FormField.Label>
                            <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                              0 - 7200s
                            </span>
                          </HStack>
                          <FormField.Control>
                            <HStack gap={3} align="center">
                              <Slider
                                min={0}
                                max={7200}
                                step={10}
                                value={cooldown}
                                onChange={setCooldown}
                                className="flex-1 min-w-[220px] max-w-[240px]"
                              />
                              <NumberInput
                                min={0}
                                max={7200}
                                step={1}
                                value={cooldown}
                                onChange={setCooldown}
                                width="xs"
                              />
                            </HStack>
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </Disclosure.Panel>
                  </Disclosure>

                  <Disclosure defaultOpen className="w-full">
                    <Disclosure.Trigger className="text-heading-h6 text-[var(--color-text-default)] w-full text-left">
                      Advanced autoscaling
                    </Disclosure.Trigger>
                    <Disclosure.Panel className="pt-4">
                      <VStack gap={6}>
                        <p className="text-body-md text-[var(--color-text-subtle)]">
                          Set detailed scaling conditions and thresholds to fine-tune how the Docker
                          image deployment scales.
                        </p>

                        <FormField>
                          <HStack justify="between" align="start" className="w-full">
                            <FormField.Label>Reaction Window (s)</FormField.Label>
                            <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                              1 - 60s
                            </span>
                          </HStack>
                          <FormField.Control>
                            <HStack gap={3} align="center">
                              <Slider
                                min={1}
                                max={60}
                                step={1}
                                value={reactionWindow}
                                onChange={setReactionWindow}
                                className="flex-1 min-w-[220px] max-w-[240px]"
                              />
                              <NumberInput
                                min={1}
                                max={60}
                                step={1}
                                value={reactionWindow}
                                onChange={setReactionWindow}
                                width="xs"
                              />
                            </HStack>
                          </FormField.Control>
                        </FormField>

                        <FormField>
                          <HStack justify="between" align="start" className="w-full">
                            <FormField.Label>Observation Window (s)</FormField.Label>
                            <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                              10 - 3600s
                            </span>
                          </HStack>
                          <FormField.Control>
                            <HStack gap={3} align="center">
                              <Slider
                                min={10}
                                max={3600}
                                step={10}
                                value={observationWindow}
                                onChange={setObservationWindow}
                                className="flex-1 min-w-[220px] max-w-[240px]"
                              />
                              <NumberInput
                                min={10}
                                max={3600}
                                step={1}
                                value={observationWindow}
                                onChange={setObservationWindow}
                                width="xs"
                              />
                            </HStack>
                          </FormField.Control>
                        </FormField>
                      </VStack>
                    </Disclosure.Panel>
                  </Disclosure>
                </VStack>
              </div>
            </VStack>
          </div>

          <div className="w-[312px] shrink-0">
            <div className="sticky top-[80px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-3">
              <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <h3 className="text-heading-h6 text-[var(--color-text-default)] mb-4">Summary</h3>
                <VStack gap={0}>
                  <HStack justify="between" align="start" className="min-h-7 gap-4">
                    <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0">
                      Docker image configuration
                    </span>
                    <span
                      className="text-body-md text-[var(--color-text-default)] text-right truncate max-w-[160px]"
                      title={summaryDocker}
                    >
                      {summaryDocker}
                    </span>
                  </HStack>
                  <HStack justify="between" align="start" className="min-h-7 mt-3 gap-4">
                    <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0">
                      Endpoint configuration
                    </span>
                    <span
                      className="text-body-md text-[var(--color-text-default)] text-right truncate max-w-[160px]"
                      title={summaryEndpoint}
                    >
                      {summaryEndpoint}
                    </span>
                  </HStack>
                  <HStack justify="between" align="start" className="min-h-7 mt-3 gap-4">
                    <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0">
                      Hardware requirements
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)] truncate max-w-[160px]">
                      {summaryHardware}
                    </span>
                  </HStack>
                  <HStack justify="between" align="start" className="min-h-7 mt-3 gap-4">
                    <span className="text-label-sm text-[var(--color-text-subtle)] shrink-0">
                      Autoscaling configuration
                    </span>
                    <span
                      className="text-body-md text-[var(--color-text-default)] text-right truncate max-w-[160px]"
                      title={summaryAutoscaling}
                    >
                      {summaryAutoscaling}
                    </span>
                  </HStack>
                </VStack>
              </div>
              <HStack gap={2} className="w-full mt-4">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  type="button"
                  onClick={() => navigate('/ai-platform/serverless/create')}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="md" className="flex-1" type="button">
                  Create
                </Button>
              </HStack>
            </div>
          </div>
        </div>
      </VStack>
    </PageShell>
  );
}

export default ServerlessCreateDockerImagePage;
