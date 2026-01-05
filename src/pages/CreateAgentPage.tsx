import { useState } from 'react';
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
} from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconPalette,
  IconSearch,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconDotsVertical,
  IconTarget,
  IconAlertTriangle,
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

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Mock data
  const dataSources = Array.from({ length: 5 }, (_, i) => ({
    id: `data-${i + 1}`,
    status: i === 0 ? 'completed' : (i === 1 ? 'error' : 'completed'),
    name: i === 0 ? 'LableLableLableLableLableLableLa' : 'lable',
    type: 'File',
    size: '60 MB',
    createdAt: 'Nov 11, 2025, 2:51 PM',
  }));

  const mcpTools = Array.from({ length: 5 }, (_, i) => ({
    id: `mcp-${i + 1}`,
    status: 'active',
    title: i === 0 ? 'LableLobleLableLobleLo...' : 'Lable',
    mcpServer: i === 0 ? 'LableLobleLobleLa' : 'lable',
    category: 'Communication',
    tags: ['Tag', 'Tag', 'Tag', ...(i === 0 ? ['+2'] : [])],
    createdAt: 'Nov 11, 2025, 2:51 PM',
  }));

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
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex items-start" style={{ minWidth: '1440px', width: '1440px', height: '1020px' }}>
      <AgentSidebar />

      <main className="flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative shrink-0 bg-[var(--color-surface-default)] ml-[62px]">
        <div className="min-w-[var(--layout-content-min-width)] w-full h-full flex flex-col">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
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
                  { label: 'Agent', href: '/agent' },
                  { label: 'Create agent' },
                ]}
              />
            }
            actions={
              <>
                <TopBarAction
                  icon={<IconBell size={16} stroke={1} />}
                  aria-label="Notifications"
                  badge={true}
                />
                <TopBarAction
                  icon={<IconPalette size={16} stroke={1} />}
                  onClick={() => navigate('/design-system')}
                  aria-label="Design System"
                />
              </>
            }
          />

          {/* Main Content */}
          <div className="flex flex-1 items-start min-h-0 relative w-full">
            {/* Left Content */}
            <div className="flex flex-1 flex-col min-h-0 overflow-y-auto px-8 py-6">
              <div className="flex flex-col gap-6 max-w-[800px]">
                <h1 className="font-['Mona_Sans:SemiBold',sans-serif] text-[18px] leading-7 text-[var(--color-text-default)]">
                  Create agent
                </h1>

                {/* Tabs */}
                <Tabs value={activeStep} onChange={(value) => setActiveStep(value as 'configuration' | 'data-mcp')} variant="underline" size="sm">
                  <TabList>
                    <Tab value="configuration">Configuration</Tab>
                    <Tab value="data-mcp">Data & MCP Connection</Tab>
                  </TabList>
                  <div className="mt-6">
                    {/* Tab content will be rendered here based on activeStep */}
                  </div>
                </Tabs>

                {/* Configuration Tab */}
                {activeStep === 'configuration' && (
                  <div className="flex flex-col gap-8">
                    {/* Basic information */}
                    <div id="basic-information" className="flex flex-col gap-4">
                      <h2 className="font-['Mona_Sans:Medium',sans-serif] text-[14px] leading-5 text-[var(--color-text-default)]">
                        Basic information
                      </h2>
                      
                      <Input
                        label="Agent name"
                        placeholder="Enter a name for this agent."
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        fullWidth
                      />
                      
                      <Textarea
                        label="Description"
                        placeholder="Add an description."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                      />
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[var(--color-text-default)] text-[12px]">
                          Status
                        </label>
                        <RadioGroup
                          value={status}
                          onChange={(value) => setStatus(value as 'inactive' | 'active')}
                        >
                          <Radio value="inactive">Inactive</Radio>
                          <Radio value="active">Active</Radio>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Input
                          label="Tag"
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
                              <div
                                key={index}
                                className="flex items-center gap-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] px-2 py-0.5 rounded-md"
                              >
                                <span className="text-[11px] text-[var(--color-text-default)]">{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(index)}
                                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                                >
                                  <IconX size={12} stroke={1} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Model settings */}
                    <div id="model-settings" className="flex flex-col gap-4">
                      <h2 className="font-['Mona_Sans:Medium',sans-serif] text-[14px] leading-5 text-[var(--color-text-default)]">
                        Model settings
                      </h2>
                      
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
                      />
                      
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
                      />
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="font-medium text-[var(--color-text-default)] text-[12px]">
                            Temperature
                          </label>
                          <span className="text-[12px] text-[var(--color-text-default)]">{temperature}</span>
                        </div>
                        <Slider
                          value={temperature}
                          onChange={setTemperature}
                          min={0}
                          max={1}
                          step={0.1}
                        />
                        <p className="text-[11px] text-[var(--color-text-subtle)]">
                          Adjust how creative or deterministic the model's responses should be. Lower values make answers more consistent, while higher values increase variability.
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="font-medium text-[var(--color-text-default)] text-[12px]">
                            Max tokens
                          </label>
                          <span className="text-[12px] text-[var(--color-text-default)]">{maxTokens.toLocaleString()}</span>
                        </div>
                        <Slider
                          value={maxTokens}
                          onChange={setMaxTokens}
                          min={0}
                          max={64000}
                          step={1000}
                        />
                      </div>
                    </div>

                    {/* Prompt settings */}
                    <div id="prompt-settings" className="flex flex-col gap-4">
                      <h2 className="font-['Mona_Sans:Medium',sans-serif] text-[14px] leading-5 text-[var(--color-text-default)]">
                        Prompt settings
                      </h2>
                      
                      <Textarea
                        label="System prompt"
                        placeholder="Enter a prompt or task for your agent."
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        helperText="Defines the agent's core behavior and response rules."
                        fullWidth
                      />
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[var(--color-text-default)] text-[12px]">
                          Tone
                        </label>
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
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[var(--color-text-default)] text-[12px]">
                          Max iteration
                        </label>
                        <NumberInput
                          value={maxIteration}
                          onChange={setMaxIteration}
                          min={1}
                          max={10}
                          fullWidth
                        />
                        <p className="text-[11px] text-[var(--color-text-subtle)]">
                          Limits how many reasoning cycles the agent can run.
                        </p>
                      </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Data & MCP Connection Tab */}
                {activeStep === 'data-mcp' && (
                  <div className="flex flex-col gap-8">
                    {/* Connect data sources */}
                    <div id="connect-data-sources" className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="font-['Mona_Sans:Medium',sans-serif] text-[14px] leading-5 text-[var(--color-text-default)]">
                          Data sources
                        </h2>
                        <p className="text-[11px] text-[var(--color-text-subtle)]">
                          Select the data sources the agent can reference when generating answers. (Multiple selection available).
                        </p>
                      </div>
                      
                      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-between min-w-[200px] pl-2.5 pr-2 py-1.5 relative rounded-md shrink-0 w-[280px]">
                        <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[11px]">
                          Find data with filters
                        </p>
                        <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)] shrink-0" />
                      </div>
                      
                      {/* Pagination */}
                      <div className="flex gap-2 h-6 items-center relative shrink-0 w-full">
                        <div className="flex gap-2 items-center relative shrink-0">
                          <button className="flex gap-0 items-center justify-center relative shrink-0 size-6" disabled>
                            <IconChevronLeft size={16} stroke={1} className="text-[var(--color-border-default,#e2e8f0)]" />
                          </button>
                          <button className="bg-[var(--color-primary,#2563eb)] flex flex-col gap-0 items-center justify-center relative rounded-md shrink-0 size-6">
                            <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-inverted,white)] text-[11px]">
                              1
                            </p>
                          </button>
                          {[2, 3, 4, 5].map((page) => (
                            <button
                              key={page}
                              className="flex flex-col gap-0 items-center justify-center relative rounded-md shrink-0 size-6"
                            >
                              <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
                                {page}
                              </p>
                            </button>
                          ))}
                          <button className="flex gap-0 items-center justify-center relative shrink-0 size-6">
                            <IconChevronRight size={16} stroke={1} className="text-[var(--color-text-default)]" />
                          </button>
                          <div className="bg-[var(--color-border-default)] h-4 shrink-0 w-px" />
                          <div className="flex font-['Mona_Sans:Medium',sans-serif] gap-0.5 h-6 items-center justify-center leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
                            <p className="relative shrink-0">2</p>
                            <p className="relative shrink-0">/</p>
                            <p className="relative shrink-0">99</p>
                            <p className="relative shrink-0">items</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Data Sources Table */}
                      <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                        {/* Table Header */}
                        <div className="bg-[var(--color-border-subtle,#f1f5f9)] border border-[var(--color-border-default)] flex items-start overflow-clip relative rounded-t-md shrink-0 w-full">
                          <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                            <input
                              type="checkbox"
                              className="size-4 rounded border-[var(--color-border-default)]"
                              checked={selectedDataSources.length === dataSources.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDataSources(dataSources.map(d => d.id));
                                } else {
                                  setSelectedDataSources([]);
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Status</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Name</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Type</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Size</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Created at</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Table Rows */}
                        {dataSources.map((data) => (
                          <div
                            key={data.id}
                            className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex items-center relative rounded-md shrink-0 w-full"
                          >
                            <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                              <input
                                type="checkbox"
                                className="size-4 rounded border-[var(--color-border-default)]"
                                checked={selectedDataSources.includes(data.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDataSources([...selectedDataSources, data.id]);
                                  } else {
                                    setSelectedDataSources(selectedDataSources.filter(id => id !== data.id));
                                  }
                                }}
                              />
                            </div>
                            <div className="flex gap-0 items-center justify-center p-2 relative shrink-0 w-[59px]">
                              {data.status === 'completed' ? (
                                <IconTarget size={12} stroke={1} className="text-[var(--color-success)]" />
                              ) : (
                                <IconAlertTriangle size={12} stroke={1} className="text-[var(--color-danger)]" />
                              )}
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1.5 items-center relative shrink-0">
                                <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                                  <p className="leading-4">{data.name}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1.5 items-start relative shrink-0">
                                <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                                  <p className="leading-4">{data.type}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1.5 items-start relative shrink-0">
                                <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                                  <p className="leading-4">{data.size}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1.5 items-start relative shrink-0">
                                <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                                  <p className="leading-4">{data.createdAt}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Selected Tags */}
                      {selectedDataSources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedDataSources.map((id) => {
                            const data = dataSources.find(d => d.id === id);
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
                    </div>

                    {/* Connect MCP tools */}
                    <div id="connect-mcp-tools" className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="font-['Mona_Sans:Medium',sans-serif] text-[14px] leading-5 text-[var(--color-text-default)]">
                          MCP tools
                        </h2>
                        <p className="text-[11px] text-[var(--color-text-subtle)]">
                          Choose the MCP tools the agent can use to perform actions or retrieve external information. (Multiple selection available).
                        </p>
                      </div>
                      
                      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-between min-w-[200px] pl-2.5 pr-2 py-1.5 relative rounded-md shrink-0 w-[280px]">
                        <p className="font-['Mona_Sans:Regular',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle)] text-[11px]">
                          Find MCP tools with filters
                        </p>
                        <IconSearch size={12} stroke={1} className="text-[var(--color-text-muted)] shrink-0" />
                      </div>
                      
                      {/* Pagination */}
                      <div className="flex gap-2 h-6 items-center relative shrink-0 w-full">
                        <div className="flex gap-2 items-center relative shrink-0">
                          <button className="flex gap-0 items-center justify-center relative shrink-0 size-6" disabled>
                            <IconChevronLeft size={16} stroke={1} className="text-[var(--color-border-default,#e2e8f0)]" />
                          </button>
                          <button className="bg-[var(--color-primary,#2563eb)] flex flex-col gap-0 items-center justify-center relative rounded-md shrink-0 size-6">
                            <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-inverted,white)] text-[11px]">
                              1
                            </p>
                          </button>
                          {[2, 3].map((page) => (
                            <button
                              key={page}
                              className="flex flex-col gap-0 items-center justify-center relative rounded-md shrink-0 size-6"
                            >
                              <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
                                {page}
                              </p>
                            </button>
                          ))}
                          <button className="flex gap-0 items-center justify-center relative shrink-0 size-6">
                            <IconDots size={16} stroke={1} className="text-[var(--color-text-muted)] rotate-90" />
                          </button>
                          <button className="flex flex-col gap-0 items-center justify-center relative rounded-md shrink-0 size-6">
                            <p className="font-['Mona_Sans:Medium',sans-serif] leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
                              99
                            </p>
                          </button>
                          <button className="flex gap-0 items-center justify-center relative shrink-0 size-6">
                            <IconChevronRight size={16} stroke={1} className="text-[var(--color-text-default)]" />
                          </button>
                          <div className="bg-[var(--color-border-default)] h-4 shrink-0 w-px" />
                          <div className="flex font-['Mona_Sans:Medium',sans-serif] gap-0.5 h-6 items-center justify-center leading-4 not-italic relative shrink-0 text-[var(--color-text-subtle,#64748b)] text-[11px]">
                            <p className="relative shrink-0">2</p>
                            <p className="relative shrink-0">/</p>
                            <p className="relative shrink-0">99</p>
                            <p className="relative shrink-0">items</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* MCP Tools Table */}
                      <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                        {/* Table Header */}
                        <div className="bg-[var(--color-border-subtle,#f1f5f9)] border border-[var(--color-border-default)] flex items-start overflow-clip relative rounded-t-md shrink-0 w-full">
                          <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                            <input
                              type="checkbox"
                              className="size-4 rounded border-[var(--color-border-default)]"
                              checked={selectedMCPTools.length === mcpTools.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMCPTools(mcpTools.map(t => t.id));
                                } else {
                                  setSelectedMCPTools([]);
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Status</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Title</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">MCP server</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Category</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Tags</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-[1_0_0] h-10 items-center min-h-px min-w-px px-3 py-0 relative shrink-0">
                            <div className="flex gap-1.5 items-center relative shrink-0">
                              <div className="flex flex-col font-['Mona_Sans:Medium',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[11px] whitespace-nowrap">
                                <p className="leading-4">Created at</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Table Rows */}
                        {mcpTools.map((tool) => (
                          <div
                            key={tool.id}
                            className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex items-center relative rounded-md shrink-0 w-full"
                          >
                            <div className="flex gap-0 items-center justify-center p-3 relative shrink-0">
                              <input
                                type="checkbox"
                                className="size-4 rounded border-[var(--color-border-default)]"
                                checked={selectedMCPTools.includes(tool.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedMCPTools([...selectedMCPTools, tool.id]);
                                  } else {
                                    setSelectedMCPTools(selectedMCPTools.filter(id => id !== tool.id));
                                  }
                                }}
                              />
                            </div>
                            <div className="flex gap-0 items-center justify-center p-2 relative shrink-0 w-[59px]">
                              <IconTarget size={12} stroke={1} className="text-[var(--color-success)]" />
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1.5 items-center relative shrink-0">
                                <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                                  <p className="leading-4">{tool.title}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1.5 items-start relative shrink-0">
                                <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                                  <p className="leading-4">{tool.mcpServer}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1.5 items-start relative shrink-0">
                                <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                                  <p className="leading-4">{tool.category}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1 items-center relative w-full min-w-0 max-w-full overflow-hidden">
                                {tool.tags.slice(0, 3).map((tag, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-[var(--color-surface-subtle,#f8fafc)] border border-[var(--color-border-default,#e2e8f0)] px-2 py-0.5 rounded-md text-[11px] leading-4 text-[var(--color-text-default)] whitespace-nowrap flex-shrink-0"
                                  >
                                    {tag}
                                  </div>
                                ))}
                                {tool.tags.length > 3 && (
                                  <span className="text-[11px] text-[var(--color-text-default)] whitespace-nowrap flex-shrink-0 ml-1">
                                    +{tool.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start justify-center min-h-[40px] min-w-px px-3 py-2 relative shrink-0">
                              <div className="flex gap-1.5 items-start relative shrink-0">
                                <div className="flex flex-col font-['Mona_Sans:Regular',sans-serif] justify-center leading-0 not-italic relative shrink-0 text-[var(--color-text-default)] text-[12px] whitespace-nowrap">
                                  <p className="leading-4">{tool.createdAt}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Selected Tags */}
                      {selectedMCPTools.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedMCPTools.map((id) => {
                            const tool = mcpTools.find(t => t.id === id);
                            return tool ? (
                              <div
                                key={id}
                                className="flex items-center gap-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] px-2 py-0.5 rounded-md"
                              >
                                <span className="text-[11px] text-[var(--color-text-default)]">{tool.mcpServer}</span>
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
                    </div>

                    {/* Previous Button */}
                    <div className="flex justify-start">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handlePrevious}
                      >
                        Previous
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Summary Sidebar */}
            <div className="w-[320px] border-l border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col h-full relative">
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
                    items: activeStep === 'data-mcp' ? [
                      { 
                        id: 'data-sources', 
                        title: 'Connect data sources', 
                        status: 'default',
                        onClick: () => {
                          const element = document.getElementById('connect-data-sources');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        },
                      },
                      { 
                        id: 'mcp-tools', 
                        title: 'Connect MCP tools', 
                        status: 'default',
                        onClick: () => {
                          const element = document.getElementById('connect-mcp-tools');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        },
                      },
                    ] : [],
                    collapsible: true,
                    defaultExpanded: activeStep === 'data-mcp',
                  },
                ]}
                onCancel={() => navigate('/agent')}
                onAction={() => {
                  // Handle create
                  navigate('/agent');
                }}
                actionLabel="Create"
                cancelLabel="Cancel"
                actionEnabled={true}
                portal={false}
                position="top-left"
                width="100%"
                style={{ 
                  height: '100%', 
                  border: 'none', 
                  borderRadius: 0, 
                  boxShadow: 'none',
                  position: 'relative',
                  top: 0,
                  left: 0,
                  maxHeight: '100%',
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateAgentPage;

