import { useState } from 'react';
import {
  TopBar,
  TopBarAction,
  Breadcrumb,
  Button,
  Input,
  Textarea,
  Select,
  RadioGroup,
  Radio,
  NumberInput,
  Tabs,
  TabList,
  Tab,
  FloatingCard,
  Chip,
  SectionCard,
  VStack,
  HStack,
  Disclosure,
  Toggle,
  Badge,
} from '@/design-system';
import { IconBell, IconPalette, IconCirclePlus, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

/* ----------------------------------------
   Create MCP Template Page Component
   ---------------------------------------- */

// Types
interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  description: string;
  required: boolean;
  secret: boolean;
}

interface AvailableTool {
  id: string;
  agentName: string;
  description: string;
  tags: string[];
  parameters: ToolParameter[];
}

interface ToolParameter {
  key: string;
  type: string;
  description: string;
  required: boolean;
}

export function CreateMCPTemplatePage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [activeStep, setActiveStep] = useState<'configuration' | 'publish'>('configuration');

  // Configuration Tab State
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [homepageUrl, setHomepageUrl] = useState('');
  const [tags, setTags] = useState<string[]>(['Tag 1', 'Tag 2', 'Tag 3']);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('');
  const [authType, setAuthType] = useState('config-required');

  // Template Type Settings
  const [templateType, setTemplateType] = useState<'stdio' | 'http'>('stdio');

  // Container Settings
  const [dockerImage, setDockerImage] = useState('');
  const [port, setPort] = useState(8000);
  const [cpuRequest, setCpuRequest] = useState('');
  const [cpuLimit, setCpuLimit] = useState('');
  const [memoryRequest, setMemoryRequest] = useState('');
  const [memoryLimit, setMemoryLimit] = useState('');
  const [containerTransportType, setContainerTransportType] = useState('streamable-http');
  const [destinationNamespace, setDestinationNamespace] = useState('');

  // HTTP Settings
  const [httpUrl, setHttpUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [httpTransportType, setHttpTransportType] = useState('streamable-http');

  // Publish Tab State
  const [envVariables, setEnvVariables] = useState<EnvironmentVariable[]>([
    {
      id: 'env-1',
      key: '',
      value: '',
      description: '',
      required: false,
      secret: false,
    },
  ]);

  const [availableTools, setAvailableTools] = useState<AvailableTool[]>([
    {
      id: 'tool-1',
      agentName: '',
      description: '',
      tags: ['Tag 1', 'Tag 2', 'Tag 3'],
      parameters: [
        {
          key: '',
          type: 'Other',
          description: '',
          required: true,
        },
      ],
    },
  ]);

  // Publishing settings
  const [visibility, setVisibility] = useState<'visible' | 'hidden'>('visible');
  const [addOfficialBadge, setAddOfficialBadge] = useState(false);

  // Handlers
  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddEnvVariable = () => {
    setEnvVariables([
      ...envVariables,
      {
        id: `env-${Date.now()}`,
        key: '',
        value: '',
        description: '',
        required: false,
        secret: false,
      },
    ]);
  };

  const handleRemoveEnvVariable = (id: string) => {
    setEnvVariables(envVariables.filter((env) => env.id !== id));
  };

  const handleUpdateEnvVariable = (
    id: string,
    field: keyof EnvironmentVariable,
    value: string | boolean
  ) => {
    setEnvVariables(envVariables.map((env) => (env.id === id ? { ...env, [field]: value } : env)));
  };

  const handleAddTool = () => {
    setAvailableTools([
      ...availableTools,
      {
        id: `tool-${Date.now()}`,
        agentName: '',
        description: '',
        tags: [],
        parameters: [
          {
            key: '',
            type: 'Other',
            description: '',
            required: false,
          },
        ],
      },
    ]);
  };

  const handleRemoveTool = (id: string) => {
    setAvailableTools(availableTools.filter((tool) => tool.id !== id));
  };

  const handleAddParameter = (toolId: string) => {
    setAvailableTools(
      availableTools.map((tool) =>
        tool.id === toolId
          ? {
              ...tool,
              parameters: [
                ...tool.parameters,
                { key: '', type: 'Other', description: '', required: false },
              ],
            }
          : tool
      )
    );
  };

  const handleNext = () => {
    setActiveStep('publish');
  };

  const handlePrevious = () => {
    setActiveStep('configuration');
  };

  return (
    <PageShell
      sidebar={<AgentSidebar />}
      sidebarWidth={60}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={false}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'MCP Tools', href: '/mcp-tools' }, { label: 'Create MCP Template' }]}
            />
          }
          actions={
            <>
              <TopBarAction
                icon={<IconPalette size={16} stroke={1} />}
                onClick={() => navigate('/design-system')}
                aria-label="Design System"
              />
              <TopBarAction
                icon={<IconBell size={16} stroke={1} />}
                aria-label="Notifications"
                badge={true}
              />
            </>
          }
        />
      }
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto min-h-0 overscroll-contain sidebar-scroll">
        <div className="bg-[var(--color-surface-default)] flex flex-col gap-3 items-center pb-6 pt-4 px-8 w-full min-h-full">
          <div className="flex flex-col gap-3 items-start min-w-[1176px] relative shrink-0 w-full">
            <div className="flex items-center justify-between h-8 w-full">
              <h1 className="text-heading-h5 text-[var(--color-text-default)]">Create template</h1>
            </div>
            <div className="flex flex-row flex-1 items-start min-h-0 relative w-full gap-6">
              {/* Left Content */}
              <div className="flex flex-1 flex-col min-h-0">
                <div className="flex flex-col gap-6 w-full">
                  {/* Tabs */}
                  <Tabs
                    value={activeStep}
                    onChange={(value) => setActiveStep(value as 'configuration' | 'publish')}
                    variant="underline"
                    size="sm"
                  >
                    <TabList className="w-full">
                      <Tab value="configuration">Configuration</Tab>
                      <Tab value="publish">Publish</Tab>
                    </TabList>
                  </Tabs>

                  {/* Configuration Tab */}
                  {activeStep === 'configuration' && (
                    <VStack gap={8}>
                      {/* Basic information */}
                      <SectionCard id="basic-information">
                        <SectionCard.Header title="Basic information" />
                        <SectionCard.Content>
                          {/* Template name */}
                          <Input
                            label="Template name"
                            placeholder="Enter a name for this agent"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            fullWidth
                            required
                          />

                          {/* Description */}
                          <Textarea
                            label="Description"
                            placeholder="Add a description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                          />

                          {/* Version */}
                          <Input
                            label="Version"
                            placeholder="Enter a name for this agent"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            helperText="The version of the template. Useful for tracking changes and updates."
                            fullWidth
                          />

                          {/* Homepage URL */}
                          <Input
                            label="Homepage URL"
                            placeholder="https://docs.example.com/"
                            value={homepageUrl}
                            onChange={(e) => setHomepageUrl(e.target.value)}
                            helperText="A URL to documentation or the homepage for this template."
                            fullWidth
                            required
                          />

                          {/* Tags */}
                          <VStack gap={2} className="w-full">
                            <label className="text-label-lg text-[var(--color-text-default)]">
                              Tag
                            </label>
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              Tags help categorize and identify your resources.
                            </p>
                            <Input
                              placeholder="Enter tags"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              helperText="Comma-separated tags for filtering, up to 10 tags allowed."
                              fullWidth
                            />
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                  <Chip
                                    key={index}
                                    value={tag}
                                    onRemove={() => handleRemoveTag(index)}
                                  />
                                ))}
                              </div>
                            )}
                          </VStack>

                          {/* Category */}
                          <div>
                            <Select
                              label="Category"
                              value={category}
                              onChange={setCategory}
                              options={[
                                { value: 'communication', label: 'Communication' },
                                { value: 'development', label: 'Development' },
                                { value: 'productivity', label: 'Productivity' },
                                { value: 'other', label: 'Other' },
                              ]}
                              placeholder="Select"
                              fullWidth
                              helperText="The category this template belongs to."
                            />
                          </div>

                          {/* Auth type */}
                          <div>
                            <Select
                              label="Auth type"
                              value={authType}
                              onChange={setAuthType}
                              options={[
                                { value: 'config-required', label: 'Config required' },
                                { value: 'oauth', label: 'OAuth' },
                                { value: 'api-key', label: 'API Key' },
                                { value: 'none', label: 'None' },
                              ]}
                              fullWidth
                              helperText="Defines whether authentication or additional config action is required to use this template."
                            />
                          </div>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Template type settings */}
                      <SectionCard id="template-type-settings">
                        <SectionCard.Header title="Template type settings" />
                        <SectionCard.Content>
                          <VStack gap={2} className="w-full">
                            {/* STDIO Option */}
                            <div
                              className={`w-full p-4 border rounded-lg cursor-pointer transition-colors ${
                                templateType === 'stdio'
                                  ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]'
                                  : 'border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]'
                              }`}
                              onClick={() => setTemplateType('stdio')}
                            >
                              <HStack gap={3}>
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    templateType === 'stdio'
                                      ? 'border-[var(--color-action-primary)]'
                                      : 'border-[var(--color-border-default)]'
                                  }`}
                                >
                                  {templateType === 'stdio' && (
                                    <div className="w-2 h-2 rounded-full bg-[var(--color-action-primary)]" />
                                  )}
                                </div>
                                <VStack gap={0.5}>
                                  <span className="text-label-md text-[var(--color-text-default)]">
                                    STDIO (Container)
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    A containerized MCP server deployed on Kubernetes
                                  </span>
                                </VStack>
                              </HStack>
                            </div>

                            {/* HTTP Option */}
                            <div
                              className={`w-full p-4 border rounded-lg cursor-pointer transition-colors ${
                                templateType === 'http'
                                  ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]'
                                  : 'border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]'
                              }`}
                              onClick={() => setTemplateType('http')}
                            >
                              <HStack gap={3}>
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    templateType === 'http'
                                      ? 'border-[var(--color-action-primary)]'
                                      : 'border-[var(--color-border-default)]'
                                  }`}
                                >
                                  {templateType === 'http' && (
                                    <div className="w-2 h-2 rounded-full bg-[var(--color-action-primary)]" />
                                  )}
                                </div>
                                <VStack gap={0.5}>
                                  <span className="text-label-md text-[var(--color-text-default)]">
                                    HTTP (Remote)
                                  </span>
                                  <span className="text-body-md text-[var(--color-text-subtle)]">
                                    External HTTP MCP server endpoint
                                  </span>
                                </VStack>
                              </HStack>
                            </div>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Container settings - only show when STDIO selected */}
                      {templateType === 'stdio' && (
                        <SectionCard id="container-settings">
                          <SectionCard.Header title="Container settings" />
                          <SectionCard.Content>
                            {/* Docker image */}
                            <Input
                              label="Docker image"
                              placeholder="https://dockerhub.com/..."
                              value={dockerImage}
                              onChange={(e) => setDockerImage(e.target.value)}
                              helperText="Specify the Docker image that will be used to run the MCP server."
                              fullWidth
                              required
                            />

                            {/* Port */}
                            <VStack gap={2} className="w-full">
                              <label className="text-label-lg text-[var(--color-text-default)]">
                                Port
                              </label>
                              <NumberInput
                                value={port}
                                onChange={setPort}
                                min={1}
                                max={65535}
                                width="sm"
                              />
                              <p className="text-body-md text-[var(--color-text-subtle)]">
                                The port on which the container listens for incoming requests.
                              </p>
                            </VStack>

                            {/* CPU request & limit */}
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="CPU request"
                                placeholder="Enter a name for this agent"
                                value={cpuRequest}
                                onChange={(e) => setCpuRequest(e.target.value)}
                                helperText="The minimum amount of CPU resources guaranteed for this container."
                                fullWidth
                              />
                              <Input
                                label="CPU limit"
                                placeholder="Enter a name for this agent"
                                value={cpuLimit}
                                onChange={(e) => setCpuLimit(e.target.value)}
                                helperText="The maximum amount of CPU resources the container is allowed to use."
                                fullWidth
                              />
                            </div>

                            {/* Memory request & limit */}
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Memory request"
                                placeholder="Enter a name for this agent"
                                value={memoryRequest}
                                onChange={(e) => setMemoryRequest(e.target.value)}
                                helperText="The minimum amount of memory guaranteed for this container."
                                fullWidth
                              />
                              <Input
                                label="Memory limit"
                                placeholder="Enter a name for this agent"
                                value={memoryLimit}
                                onChange={(e) => setMemoryLimit(e.target.value)}
                                helperText="The maximum amount of memory the container is allowed to consume."
                                fullWidth
                              />
                            </div>

                            {/* Transport type */}
                            <div>
                              <Select
                                label="Transport type"
                                value={containerTransportType}
                                onChange={setContainerTransportType}
                                options={[
                                  {
                                    value: 'streamable-http',
                                    label: 'Streamable HTTP (SSE-05-1B) - incp',
                                  },
                                  { value: 'http', label: 'HTTP' },
                                  { value: 'websocket', label: 'WebSocket' },
                                ]}
                                fullWidth
                                required
                                helperText="Select the transport protocol used to expose the MCP server to clients."
                              />
                            </div>

                            {/* Destination Namespace */}
                            <div>
                              <Select
                                label="Destination namespace"
                                value={destinationNamespace}
                                onChange={setDestinationNamespace}
                                options={[
                                  { value: 'ns-agents-default', label: 'ns-agents-default' },
                                  { value: 'default', label: 'default' },
                                  { value: 'production', label: 'production' },
                                ]}
                                placeholder="Select"
                                fullWidth
                                helperText="Select the destination Kubernetes namespace for deployment."
                              />
                            </div>
                          </SectionCard.Content>
                        </SectionCard>
                      )}

                      {/* HTTP settings - only show when HTTP selected */}
                      {templateType === 'http' && (
                        <SectionCard id="http-settings">
                          <SectionCard.Header title="HTTP settings" />
                          <SectionCard.Content>
                            {/* URL */}
                            <Input
                              label="URL"
                              placeholder="https://externalservice.com"
                              value={httpUrl}
                              onChange={(e) => setHttpUrl(e.target.value)}
                              helperText="The base URL of the MCP server exposed over HTTP."
                              fullWidth
                              required
                            />

                            {/* Headers */}
                            <Input
                              label="Headers"
                              placeholder='{"Authorization": "Bearer ..."}'
                              value={headers}
                              onChange={(e) => setHeaders(e.target.value)}
                              helperText="Optional HTTP headers to include in requests to the MCP server."
                              fullWidth
                            />

                            {/* Transport type */}
                            <div>
                              <Select
                                label="Transport type"
                                value={httpTransportType}
                                onChange={setHttpTransportType}
                                options={[
                                  {
                                    value: 'streamable-http',
                                    label: 'Streamable HTTP (SSE-05-1B)',
                                  },
                                  { value: 'http', label: 'HTTP' },
                                  { value: 'websocket', label: 'WebSocket' },
                                ]}
                                fullWidth
                                required
                                helperText="Select the transport protocol used to expose the MCP server to clients."
                              />
                            </div>
                          </SectionCard.Content>
                        </SectionCard>
                      )}

                      {/* Next Button */}
                      <HStack justify="end" className="w-full">
                        <Button variant="primary" size="sm" onClick={handleNext}>
                          Next
                        </Button>
                      </HStack>
                    </VStack>
                  )}

                  {/* Publish Tab */}
                  {activeStep === 'publish' && (
                    <VStack gap={8}>
                      {/* Environment variables */}
                      <Disclosure id="environment-variables" defaultExpanded>
                        <Disclosure.Button>
                          <span className="text-heading-h6 text-[var(--color-text-default)]">
                            Environment variables
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <VStack gap={4} className="pl-6 mt-4">
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              Configure environment variables for the server runtime.
                            </p>

                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<IconCirclePlus size={12} />}
                              onClick={handleAddEnvVariable}
                            >
                              Add variable
                            </Button>

                            {envVariables.map((env, index) => (
                              <div
                                key={env.id}
                                className="w-full border border-[var(--color-border-default)] rounded-lg p-4"
                              >
                                <VStack gap={4}>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Input
                                      label="Key"
                                      placeholder="e.g. token"
                                      value={env.key}
                                      onChange={(e) =>
                                        handleUpdateEnvVariable(env.id, 'key', e.target.value)
                                      }
                                      fullWidth
                                    />
                                    <Input
                                      label="Value"
                                      placeholder="e.g. token"
                                      value={env.value}
                                      onChange={(e) =>
                                        handleUpdateEnvVariable(env.id, 'value', e.target.value)
                                      }
                                      fullWidth
                                    />
                                  </div>

                                  <div className="flex items-start gap-4 w-full">
                                    <div className="flex-1">
                                      <Input
                                        label="Description"
                                        placeholder="Add an description"
                                        value={env.description}
                                        onChange={(e) =>
                                          handleUpdateEnvVariable(
                                            env.id,
                                            'description',
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                      />
                                    </div>
                                    {envVariables.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<IconTrash size={14} />}
                                        onClick={() => handleRemoveEnvVariable(env.id)}
                                        aria-label="Remove variable"
                                        className="mt-6"
                                      />
                                    )}
                                  </div>

                                  <HStack gap={4}>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={env.required}
                                        onChange={(e) =>
                                          handleUpdateEnvVariable(
                                            env.id,
                                            'required',
                                            e.target.checked
                                          )
                                        }
                                        className="w-4 h-4 rounded border-[var(--color-border-default)]"
                                      />
                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                        Req
                                      </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={env.secret}
                                        onChange={(e) =>
                                          handleUpdateEnvVariable(
                                            env.id,
                                            'secret',
                                            e.target.checked
                                          )
                                        }
                                        className="w-4 h-4 rounded border-[var(--color-border-default)]"
                                      />
                                      <span className="text-label-sm text-[var(--color-text-default)]">
                                        Secret
                                      </span>
                                    </label>
                                  </HStack>
                                </VStack>
                              </div>
                            ))}
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>

                      {/* Available tools */}
                      <Disclosure id="available-tools" defaultExpanded>
                        <Disclosure.Button>
                          <span className="text-heading-h6 text-[var(--color-text-default)]">
                            Available tools
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <VStack gap={4} className="pl-6 mt-4">
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              Configure the tools provided by this MCP server, along with their
                              metadata and input schemas.
                            </p>

                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<IconCirclePlus size={12} />}
                              onClick={handleAddTool}
                            >
                              Add tool
                            </Button>

                            {availableTools.map((tool) => (
                              <div
                                key={tool.id}
                                className="w-full border border-[var(--color-border-default)] rounded-lg p-4"
                              >
                                <VStack gap={4}>
                                  {/* Tool Tags */}
                                  <div className="flex gap-1.5 flex-wrap">
                                    {tool.tags.map((tag, idx) => (
                                      <Badge key={idx} theme="blue" type="subtle" size="sm">
                                        {tag} ×
                                      </Badge>
                                    ))}
                                    <Button variant="ghost" size="sm" className="text-xs">
                                      + Add
                                    </Button>
                                  </div>

                                  {/* Agent name */}
                                  <Input
                                    label="Agent name"
                                    placeholder="Enter a name for this agent"
                                    value={tool.agentName}
                                    onChange={(e) => {
                                      setAvailableTools(
                                        availableTools.map((t) =>
                                          t.id === tool.id ? { ...t, agentName: e.target.value } : t
                                        )
                                      );
                                    }}
                                    fullWidth
                                    required
                                  />

                                  {/* Description */}
                                  <Textarea
                                    label="Description"
                                    placeholder="Add an description"
                                    value={tool.description}
                                    onChange={(e) => {
                                      setAvailableTools(
                                        availableTools.map((t) =>
                                          t.id === tool.id
                                            ? { ...t, description: e.target.value }
                                            : t
                                        )
                                      );
                                    }}
                                    fullWidth
                                    required
                                  />

                                  {/* Tag */}
                                  <VStack gap={2} className="w-full">
                                    <label className="text-label-lg text-[var(--color-text-default)]">
                                      Tag
                                    </label>
                                    <p className="text-body-md text-[var(--color-text-subtle)]">
                                      Tags help categorize and identify your resources.
                                    </p>
                                    <Input
                                      placeholder="Enter tags"
                                      helperText="Comma-separated tags for filtering. Up to 10 tags allowed."
                                      fullWidth
                                    />
                                    <div className="flex flex-wrap gap-2">
                                      {tool.tags.map((tag, index) => (
                                        <Chip key={index} value={tag} onRemove={() => {}} />
                                      ))}
                                    </div>
                                  </VStack>

                                  {/* Parameters */}
                                  <VStack gap={2} className="w-full">
                                    <label className="text-label-lg text-[var(--color-text-default)]">
                                      Parameters (input schema)
                                    </label>
                                    <p className="text-body-md text-[var(--color-text-subtle)]">
                                      Define the input parameters for this tool.
                                    </p>

                                    {tool.parameters.map((param, paramIndex) => (
                                      <div
                                        key={paramIndex}
                                        className="w-full bg-[var(--color-surface-subtle)] rounded-lg p-4"
                                      >
                                        <VStack gap={3}>
                                          <div className="grid grid-cols-2 gap-4">
                                            <Input
                                              label="Key"
                                              placeholder="e.g. token"
                                              value={param.key}
                                              onChange={() => {}}
                                              fullWidth
                                            />
                                            <Select
                                              label="Type"
                                              value={param.type}
                                              onChange={() => {}}
                                              options={[
                                                { value: 'string', label: 'String' },
                                                { value: 'number', label: 'Number' },
                                                { value: 'boolean', label: 'Boolean' },
                                                { value: 'object', label: 'Object' },
                                                { value: 'Other', label: 'Other' },
                                              ]}
                                              fullWidth
                                            />
                                          </div>
                                          <Input
                                            label="Description"
                                            placeholder="e.g. token"
                                            value={param.description}
                                            onChange={() => {}}
                                            fullWidth
                                          />
                                          <label className="flex items-center gap-2 cursor-pointer">
                                            <Toggle checked={param.required} onChange={() => {}} />
                                            <span className="text-label-sm text-[var(--color-text-default)]">
                                              Req
                                            </span>
                                          </label>
                                        </VStack>
                                      </div>
                                    ))}

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      leftIcon={<IconCirclePlus size={12} />}
                                      onClick={() => handleAddParameter(tool.id)}
                                    >
                                      Add variable
                                    </Button>
                                  </VStack>

                                  {/* Preview JSON Schema */}
                                  <VStack gap={2} className="w-full">
                                    <label className="text-label-lg text-[var(--color-text-default)]">
                                      Preview (JSON Schema)
                                    </label>
                                    <div className="w-full bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-3 font-mono text-body-md text-[var(--color-text-subtle)]">
                                      <pre className="whitespace-pre-wrap">
                                        {`{
  "tool": 10,
  "query": "현재는 분기 GDP 성장률 전년 동기대 및 전분기대
  "top_k": 20,"threshold":0.0577,02537,M_i94c&bPdW",
  "datasource_id": null,
  "score_threshold": 0.5
}`}
                                      </pre>
                                    </div>
                                  </VStack>
                                </VStack>
                              </div>
                            ))}
                          </VStack>
                        </Disclosure.Panel>
                      </Disclosure>

                      {/* Publishing settings */}
                      <SectionCard id="publishing-settings">
                        <SectionCard.Header title="Publishing settings" />
                        <SectionCard.Content>
                          {/* Visibility */}
                          <VStack gap={2} className="w-full">
                            <label className="text-label-lg text-[var(--color-text-default)]">
                              Visibility
                              <span className="text-[var(--color-state-danger)] ml-0.5">*</span>
                            </label>
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              Control whether this template appears in the templates catalog and is
                              available to all users.
                            </p>
                            <RadioGroup
                              value={visibility}
                              onChange={(value) => setVisibility(value as 'visible' | 'hidden')}
                            >
                              <Radio value="visible">Visible</Radio>
                              <Radio value="hidden">Hidden</Radio>
                            </RadioGroup>
                          </VStack>

                          {/* Add official badge */}
                          <VStack gap={2} className="w-full">
                            <label className="text-label-lg text-[var(--color-text-default)]">
                              Add official badge
                              <span className="text-[var(--color-state-danger)] ml-0.5">*</span>
                            </label>
                            <p className="text-body-md text-[var(--color-text-subtle)]">
                              Add a official badge to indicate that this MCP server is an official
                              template provided by your organization.
                            </p>
                            <HStack gap={2}>
                              <Toggle checked={addOfficialBadge} onChange={setAddOfficialBadge} />
                              <span className="text-label-sm text-[var(--color-text-default)]">
                                {addOfficialBadge ? 'On' : 'Off'}
                              </span>
                            </HStack>
                          </VStack>
                        </SectionCard.Content>
                      </SectionCard>

                      {/* Previous Button */}
                      <HStack justify="start" className="w-full">
                        <Button variant="secondary" size="sm" onClick={handlePrevious}>
                          Previous
                        </Button>
                      </HStack>
                    </VStack>
                  )}
                </div>
              </div>

              {/* Right Summary Sidebar */}
              <div className="w-[320px] flex flex-col h-full relative">
                <FloatingCard
                  title="Summary"
                  sections={[
                    {
                      tabTitle: 'Configuration',
                      items: [
                        {
                          id: 'basic-info',
                          title: 'Basic information',
                          status: 'default',
                          onClick: () => {
                            setActiveStep('configuration');
                            setTimeout(() => {
                              const element = document.getElementById('basic-information');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 0);
                          },
                        },
                        {
                          id: 'template-type',
                          title: 'Template type settings',
                          status: 'default',
                          onClick: () => {
                            setActiveStep('configuration');
                            setTimeout(() => {
                              const element = document.getElementById('template-type-settings');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 0);
                          },
                        },
                      ],
                      collapsible: true,
                      defaultExpanded: activeStep === 'configuration',
                      showSuccessIcon: activeStep === 'publish',
                    },
                    {
                      tabTitle: 'Publish',
                      items: [
                        {
                          id: 'env-vars',
                          title: 'Environment variables',
                          status: 'default',
                          onClick: () => {
                            setActiveStep('publish');
                            setTimeout(() => {
                              const element = document.getElementById('environment-variables');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 0);
                          },
                        },
                        {
                          id: 'available-tools',
                          title: 'Available Tools',
                          status: 'default',
                          onClick: () => {
                            setActiveStep('publish');
                            setTimeout(() => {
                              const element = document.getElementById('available-tools');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 0);
                          },
                        },
                        {
                          id: 'publishing-settings',
                          title: 'Publishing settings',
                          status: 'default',
                          onClick: () => {
                            setActiveStep('publish');
                            setTimeout(() => {
                              const element = document.getElementById('publishing-settings');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 0);
                          },
                        },
                      ],
                      collapsible: true,
                      defaultExpanded: activeStep === 'publish',
                    },
                  ]}
                  onCancel={() => navigate('/mcp-tools')}
                  onAction={() => {
                    // Handle create
                    navigate('/mcp-tools');
                  }}
                  actionLabel="Create"
                  cancelLabel="Cancel"
                  actionEnabled={true}
                  portal={false}
                  position="top-left"
                  width="100%"
                  style={{
                    height: '100%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default CreateMCPTemplatePage;
