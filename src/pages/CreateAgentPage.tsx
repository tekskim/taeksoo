import { useState, useMemo } from 'react';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Button,
  Input,
  Textarea,
  Select,
  RadioGroup,
  Radio,
  Slider,
  NumberInput,
  Tabs,
  TabList,
  Tab,
  Tooltip,
  FloatingCard,
  Disclosure,
  Chip,
  SearchInput,
  Pagination,
  Table,
  SectionCard,
  VStack,
  HStack,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconPalette,
  IconX,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { AgentSidebar } from '@/pages/AgentPage';

/* ----------------------------------------
   Create Agent Page Component
   ---------------------------------------- */

export function CreateAgentPage() {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<'configuration' | 'data-mcp'>('configuration');
  
  // Form state
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'inactive' | 'active'>('inactive');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [modelProvider, setModelProvider] = useState('anthropic');
  const [model, setModel] = useState('claude-sonnet-4.5');
  const [temperature, setTemperature] = useState(0.6);
  const [maxTokens, setMaxTokens] = useState(50000);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tone, setTone] = useState('default');
  const [maxIteration, setMaxIteration] = useState(5);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [selectedMCPTools, setSelectedMCPTools] = useState<string[]>([]);
  const [dataSourcePage, setDataSourcePage] = useState(1);
  const [mcpToolPage, setMcpToolPage] = useState(1);
  const [dataSourceSearch, setDataSourceSearch] = useState('');
  const [mcpToolSearch, setMcpToolSearch] = useState('');
  const [rowsPerPage] = useState(2);

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Data source types
  interface DataSourceRow {
    id: string;
    status: 'completed' | 'error';
    name: string;
    type: string;
    size: string;
    createdAt: string;
  }

  interface MCPToolRow {
    id: string;
    status: 'active' | 'error';
    title: string;
    mcpServer: {
      thumbnail: string;
      label: string;
    };
    category: string;
    tags: string[];
    createdAt: string;
  }

  // Mock data
  const dataSources: DataSourceRow[] = Array.from({ length: 5 }, (_, i) => ({
    id: `data-${i + 1}`,
    status: i === 0 ? 'completed' : (i === 1 ? 'error' : 'completed'),
    name: i === 0 ? 'LableLableLableLableLableLableLa' : 'lable',
    type: 'File',
    size: '60 MB',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  }));

  const mcpTools: MCPToolRow[] = [
    {
      id: 'mcp-1',
    status: 'active',
      title: 'LableLableLableLableLa...',
      mcpServer: {
        thumbnail: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
        label: 'LableLableLableLa...',
      },
    category: 'Communication',
      tags: ['Tag', 'Tag', 'Tag', '+2'],
    createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: 'mcp-2',
      status: 'active',
      title: 'Lable',
      mcpServer: {
        thumbnail: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
        label: 'lable',
      },
      category: 'Communication',
      tags: ['Tag', 'Tag', 'Tag'],
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: 'mcp-3',
      status: 'error',
      title: 'Lable',
      mcpServer: {
        thumbnail: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
        label: 'lable',
      },
      category: 'Communication',
      tags: ['Tag', 'Tag', 'Tag'],
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: 'mcp-4',
      status: 'active',
      title: 'Lable',
      mcpServer: {
        thumbnail: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
        label: 'lable',
      },
      category: 'Communication',
      tags: ['Tag', 'Tag', 'Tag'],
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
    {
      id: 'mcp-5',
      status: 'active',
      title: 'Lable',
      mcpServer: {
        thumbnail: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
        label: 'lable',
      },
      category: 'Communication',
      tags: ['Tag', 'Tag', 'Tag'],
      createdAt: 'Nov 11, 2025, 2:51 PM',
    },
  ];

  // Filter data sources
  const filteredDataSources = useMemo(() => {
    if (!dataSourceSearch) return dataSources;
    return dataSources.filter(
      (ds) =>
        ds.name.toLowerCase().includes(dataSourceSearch.toLowerCase()) ||
        ds.type.toLowerCase().includes(dataSourceSearch.toLowerCase())
    );
  }, [dataSources, dataSourceSearch]);

  const dataSourceTotalPages = Math.ceil(filteredDataSources.length / rowsPerPage);
  const paginatedDataSources = useMemo(() => {
    return filteredDataSources.slice((dataSourcePage - 1) * rowsPerPage, dataSourcePage * rowsPerPage);
  }, [filteredDataSources, dataSourcePage, rowsPerPage]);

  // Filter MCP tools
  const filteredMCPTools = useMemo(() => {
    if (!mcpToolSearch) return mcpTools;
    return mcpTools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(mcpToolSearch.toLowerCase()) ||
        tool.mcpServer.label.toLowerCase().includes(mcpToolSearch.toLowerCase()) ||
        tool.category.toLowerCase().includes(mcpToolSearch.toLowerCase())
    );
  }, [mcpTools, mcpToolSearch]);

  const mcpToolTotalPages = Math.ceil(filteredMCPTools.length / rowsPerPage);
  const paginatedMCPTools = useMemo(() => {
    return filteredMCPTools.slice((mcpToolPage - 1) * rowsPerPage, mcpToolPage * rowsPerPage);
  }, [filteredMCPTools, mcpToolPage, rowsPerPage]);

  // Status mapping for StatusIndicator
  const dataSourceStatusMap: Record<DataSourceRow['status'], 'active' | 'shutoff'> = {
    'completed': 'active',
    'error': 'shutoff',
  };

  const mcpToolStatusMap: Record<MCPToolRow['status'], 'active' | 'shutoff'> = {
    'active': 'active',
    'error': 'shutoff',
  };

  // Data source table columns
  const dataSourceColumns: TableColumn<DataSourceRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator status={dataSourceStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
    },
  ];

  // MCP tool table columns
  const mcpToolColumns: TableColumn<MCPToolRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <StatusIndicator status={mcpToolStatusMap[row.status]} layout="icon-only" />
      ),
    },
    {
      key: 'title',
      label: 'Title',
      flex: 1,
      sortable: true,
    },
    {
      key: 'mcpServer',
      label: 'MCP server',
      flex: 1,
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          {row.mcpServer.thumbnail && (
            <img 
              src={row.mcpServer.thumbnail} 
              alt={row.mcpServer.label}
              className="size-4 shrink-0 rounded"
            />
          )}
          <span>{row.mcpServer.label}</span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      flex: 1,
      sortable: true,
    },
    {
      key: 'tags',
      label: 'Tags',
      flex: 1,
      sortable: false,
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] px-2 py-0.5 rounded-md text-[11px] leading-4 text-[var(--color-text-default)] whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
          {row.tags.length > 3 && (
            <span className="text-[11px] text-[var(--color-text-default)] whitespace-nowrap">
              +{row.tags.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      sortable: true,
    },
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setActiveStep('data-mcp');
  };

  const handlePrevious = () => {
    setActiveStep('configuration');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <AgentSidebar />

      <main className="absolute top-0 bottom-0 right-0 left-[62px] flex flex-col bg-[var(--color-surface-default)]">
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
            onWindowClose={() => navigate('/')}
          />

          <TopBar
            showSidebarToggle={false}
            showNavigation={true}
            canGoBack={false}
            canGoForward={false}
            onBack={() => {}}
            onForward={() => {}}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Agent', href: '/agent/list' },
                  { label: 'Create agent' },
                ]}
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-h-0">
          <div className="bg-[var(--color-surface-default)] flex flex-col gap-6 items-center pb-[120px] pt-6 px-8 w-full min-h-full">
            <div className="flex flex-col gap-6 items-start min-w-[1176px] relative shrink-0 w-full">
              <div className="flex flex-row flex-1 items-start min-h-0 relative w-full gap-6">
                {/* Left Content */}
                <div className="flex flex-1 flex-col min-h-0">
                  <div className="flex flex-col gap-6 w-full">
                <h4 className="font-['Mona_Sans:SemiBold',sans-serif] leading-7 not-italic relative shrink-0 text-[var(--color-text-default)] text-[18px]">
                  Create agent
                </h4>

                {/* Tabs */}
                <Tabs value={activeStep} onChange={(value) => setActiveStep(value as 'configuration' | 'data-mcp')} variant="underline" size="sm">
                  <TabList className="w-full">
                    <Tab value="configuration">Configuration</Tab>
                    <Tab value="data-mcp">Data & MCP Connection</Tab>
                  </TabList>
                </Tabs>

                {/* Configuration Tab */}
                {activeStep === 'configuration' && (
                  <VStack gap={8}>
                    {/* Basic information */}
                    <SectionCard id="basic-information">
                      <SectionCard.Header title="Basic information" />
                      <SectionCard.Content>
                        {/* Agent name */}
                        <VStack gap={2} className="w-full">
                          <Input
                            label="Agent name"
                            placeholder="Enter a name for this agent."
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            fullWidth
                            required
                          />
                        </VStack>

                        {/* Description */}
                        <VStack gap={2} className="w-full">
                          <Textarea
                            label="Description"
                            placeholder="Add an description."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                          />
                        </VStack>

                        {/* Status */}
                        <VStack gap={2} className="w-full">
                          <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                            Status
                            <span className="text-[var(--color-state-danger)] ml-0.5">*</span>
                          </label>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            Choose whether the agent will be active immediately or remain inactive.
                          </p>
                          <RadioGroup
                            value={status}
                            onChange={(value) => setStatus(value as 'inactive' | 'active')}
                          >
                            <Radio value="inactive">Inactive</Radio>
                            <Radio value="active">Active</Radio>
                          </RadioGroup>
                        </VStack>

                        {/* Tag */}
                        <VStack gap={2} className="w-full">
                          <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                            Tag
                          </label>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
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
                            helperText="Up to 10 tags allowed."
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
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Model settings */}
                    <SectionCard id="model-settings">
                      <SectionCard.Header title="Model settings" />
                      <SectionCard.Content>
                        {/* Model provider */}
                        <VStack gap={2} className="w-full">
                          <div className="w-[289px]">
                            <Select
                              label="Model provider"
                              value={modelProvider}
                              onChange={setModelProvider}
                              options={[
                                { value: 'anthropic', label: 'Anthropic (Claude)' },
                                { value: 'openai', label: 'OpenAI' },
                                { value: 'google', label: 'Google' },
                              ]}
                              fullWidth
                              required
                              helperText="Select the LLM provider for this agent."
                            />
                          </div>
                        </VStack>

                        {/* Model */}
                        <VStack gap={2} className="w-full">
                          <div className="w-[289px]">
                            <Select
                              label="Model"
                              value={model}
                              onChange={setModel}
                              options={[
                                { value: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5 (Latest) - Recommended' },
                                { value: 'claude-opus', label: 'Claude Opus' },
                                { value: 'claude-haiku', label: 'Claude Haiku' },
                              ]}
                              fullWidth
                              required
                              helperText="Choose the model version offered by the selected provider."
                            />
                          </div>
                        </VStack>

                        {/* Temperature */}
                        <VStack gap={2} className="w-full">
                          <label className="text-[14px] font-medium text-[var(--color-text-default)]">
                            Temperature
                            <span className="text-[var(--color-state-danger)] ml-0.5">*</span>
                          </label>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            Adjust how creative or deterministic the model's responses should be.
                          </p>
                          <div className="flex items-center gap-3 w-[289px]">
                            <div className="flex-1">
                              <Slider
                                value={temperature}
                                onChange={setTemperature}
                                min={0}
                                max={1}
                                step={0.1}
                              />
                            </div>
                            <span className="text-[12px] text-[var(--color-text-default)] shrink-0">{temperature}</span>
                          </div>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            Lower values make answers more consistent, while higher values increase variability.
                          </p>
                        </VStack>

                        {/* Max tokens */}
                        <VStack gap={2} className="w-full">
                          <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                            Max tokens
                            <span className="text-[var(--color-state-danger)] ml-0.5">*</span>
                          </label>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            Adjust how creative or deterministic the model's responses should be.
                          </p>
                          <div className="flex items-center gap-3 w-fit">
                            <div className="w-[289px]">
                              <Slider
                                value={maxTokens}
                                onChange={setMaxTokens}
                                min={0}
                                max={64000}
                                step={1000}
                                className="w-full"
                              />
                            </div>
                            <span className="text-[12px] text-[var(--color-text-default)] shrink-0">{maxTokens.toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            Max: 64,000
                          </p>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Prompt settings */}
                    <SectionCard id="prompt-settings">
                      <SectionCard.Header title="Prompt settings" />
                      <SectionCard.Content>
                        {/* System prompt */}
                        <VStack gap={2} className="w-full">
                          <Textarea
                            label="System prompt"
                            placeholder="Enter a prompt or task for your agent."
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            helperText="Defines the agent's core behavior and response rules."
                            fullWidth
                          />
                        </VStack>

                        {/* Tone */}
                        <VStack gap={2} className="w-full">
                          <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                            Tone
                            <span className="text-[var(--color-state-danger)] ml-0.5">*</span>
                          </label>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            Select the response style the agent should use.
                          </p>
                          <RadioGroup
                            value={tone}
                            onChange={setTone}
                          >
                            <Radio value="default">Default</Radio>
                            <Radio value="professional">Professional</Radio>
                            <Radio value="casual">Casual</Radio>
                            <Radio value="technical">Technical</Radio>
                            <Radio value="creative">Creative</Radio>
                          </RadioGroup>
                        </VStack>

                        {/* Max iteration */}
                        <VStack gap={2} className="w-full">
                          <label className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                            Max iteration
                            <span className="text-[var(--color-state-danger)] ml-0.5">*</span>
                          </label>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            Limits how many reasoning cycles the agent can run.
                          </p>
                          <div className="w-[80px]">
                            <NumberInput
                              value={maxIteration}
                              onChange={setMaxIteration}
                              min={1}
                              max={10}
                              fullWidth
                            />
                          </div>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            Max: 10
                          </p>
                        </VStack>
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Next Button */}
                    <HStack justify="end" className="w-full">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </HStack>
                  </VStack>
                )}

                {/* Data & MCP Connection Tab */}
                {activeStep === 'data-mcp' && (
                  <VStack gap={8}>
                    {/* Connect data sources */}
                    <SectionCard id="connect-data-sources">
                      <SectionCard.Header title="Connect data sources" />
                      <SectionCard.Content>
                        <p className="text-[11px] text-[var(--color-text-subtle)]">
                          Select the data sources the agent can reference when generating answers. (Multiple selection available).
                        </p>
                      
                      <SearchInput
                        placeholder="Find data with filters"
                        size="sm"
                        className="w-[280px]"
                          value={dataSourceSearch}
                          onChange={(e) => {
                            setDataSourceSearch(e.target.value);
                            setDataSourcePage(1);
                          }}
                      />
                      
                      {/* Pagination */}
                        <Pagination
                          currentPage={dataSourcePage}
                          totalPages={dataSourceTotalPages}
                          totalItems={filteredDataSources.length}
                          selectedCount={selectedDataSources.length}
                          onPageChange={setDataSourcePage}
                        />
                      
                      {/* Data Sources Table */}
                        <Table
                          columns={dataSourceColumns}
                          data={paginatedDataSources}
                          rowKey="id"
                          selectable
                          selectedKeys={selectedDataSources}
                          onSelectionChange={setSelectedDataSources}
                        />
                      
                      {/* Selected Tags */}
                      {selectedDataSources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedDataSources.map((id) => {
                              const data = filteredDataSources.find(d => d.id === id);
                            return data ? (
                              <div
                                key={id}
                                className="flex items-center gap-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] px-2 py-0.5 rounded-md"
                              >
                                <span className="text-[11px] text-[var(--color-text-default)]">{data.name}</span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDataSources(selectedDataSources.filter(selectedId => selectedId !== id))}
                                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                                >
                                  <IconX size={12} stroke={1} />
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Connect MCP tools */}
                    <SectionCard id="connect-mcp-tools">
                      <SectionCard.Header title="Connect MCP tools" />
                      <SectionCard.Content>
                        <p className="text-[11px] text-[var(--color-text-subtle)]">
                          Choose the MCP tools the agent can use to perform actions or retrieve external information. (Multiple selection available).
                        </p>
                      
                      <SearchInput
                        placeholder="Find MCP tools with filters"
                        size="sm"
                        className="w-[280px]"
                          value={mcpToolSearch}
                          onChange={(e) => {
                            setMcpToolSearch(e.target.value);
                            setMcpToolPage(1);
                          }}
                      />
                      
                      {/* Pagination */}
                        <Pagination
                          currentPage={mcpToolPage}
                          totalPages={mcpToolTotalPages}
                          totalItems={filteredMCPTools.length}
                          selectedCount={selectedMCPTools.length}
                          onPageChange={setMcpToolPage}
                        />
                      
                      {/* MCP Tools Table */}
                        <Table
                          columns={mcpToolColumns}
                          data={paginatedMCPTools}
                          rowKey="id"
                          selectable
                          selectedKeys={selectedMCPTools}
                          onSelectionChange={setSelectedMCPTools}
                        />
                      
                      {/* Selected Tags */}
                      {selectedMCPTools.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedMCPTools.map((id) => {
                              const tool = filteredMCPTools.find(t => t.id === id);
                            return tool ? (
                              <div
                                key={id}
                                className="flex items-center gap-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] px-2 py-0.5 rounded-md"
                              >
                                  <span className="text-[11px] text-[var(--color-text-default)]">{tool.mcpServer.label}</span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedMCPTools(selectedMCPTools.filter(selectedId => selectedId !== id))}
                                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                                >
                                  <IconX size={12} stroke={1} />
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Previous Button */}
                    <HStack justify="start" className="w-full">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handlePrevious}
                      >
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
                            id: 'model-settings', 
                            title: 'Model settings', 
                            status: 'default',
                            onClick: () => {
                              setActiveStep('configuration');
                              setTimeout(() => {
                                const element = document.getElementById('model-settings');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 0);
                            },
                          },
                          { 
                            id: 'prompt-settings', 
                            title: 'Prompt settings', 
                            status: 'default',
                            onClick: () => {
                              setActiveStep('configuration');
                              setTimeout(() => {
                                const element = document.getElementById('prompt-settings');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 0);
                            },
                          },
                        ],
                        collapsible: true,
                        defaultExpanded: activeStep === 'configuration',
                        showSuccessIcon: activeStep === 'data-mcp',
                      },
                      {
                        tabTitle: 'Data & MCP Connection',
                        items: [
                          { 
                            id: 'data-sources', 
                            title: 'Connect data sources', 
                            status: 'default',
                            onClick: () => {
                              setActiveStep('data-mcp');
                              setTimeout(() => {
                                const element = document.getElementById('connect-data-sources');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 0);
                            },
                          },
                          { 
                            id: 'mcp-tools', 
                            title: 'Connect MCP tools', 
                            status: 'default',
                            onClick: () => {
                              setActiveStep('data-mcp');
                              setTimeout(() => {
                                const element = document.getElementById('connect-mcp-tools');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 0);
                            },
                          },
                        ],
                        collapsible: true,
                        defaultExpanded: activeStep === 'data-mcp',
                      },
                    ]}
                    onCancel={() => navigate('/agent/list')}
                    onAction={() => {
                      // Handle create
                      navigate('/agent/list');
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
      </main>
    </div>
  );
}

export default CreateAgentPage;

