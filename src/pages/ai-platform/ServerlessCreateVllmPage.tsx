import { useMemo, useState, useEffect } from 'react';
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
  SearchInput,
  Pagination,
  Toggle,
  Slider,
  NumberInput,
  Badge,
  FormField,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';

interface ModelItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  type: 'base' | 'fine-tuned';
}

const mockModels: ModelItem[] = [
  {
    id: 'm-1',
    title: 'Llama-3.1-70B',
    description: 'Meta Llama 3.1 70B parameter model',
    tag: 'LLM',
    type: 'base',
  },
  {
    id: 'm-2',
    title: 'Mistral-7B',
    description: 'Mistral AI 7B parameter model',
    tag: 'LLM',
    type: 'base',
  },
  {
    id: 'm-3',
    title: 'Qwen2.5-72B',
    description: 'Alibaba Qwen 2.5 72B instruct model',
    tag: 'LLM',
    type: 'base',
  },
  {
    id: 'm-4',
    title: 'Gemma-2-27B',
    description: 'Google Gemma 2 27B IT model',
    tag: 'LLM',
    type: 'base',
  },
  {
    id: 'm-5',
    title: 'Llama-3.1-8B',
    description: 'Meta Llama 3.1 8B parameter model',
    tag: 'vLLM',
    type: 'base',
  },
  {
    id: 'm-6',
    title: 'Phi-3.5-mini',
    description: 'Microsoft Phi-3.5 mini instruct',
    tag: 'NLP',
    type: 'base',
  },
  {
    id: 'm-7',
    title: 'DeepSeek-V2-Lite',
    description: 'DeepSeek-V2 lite MoE checkpoint',
    tag: 'LLM',
    type: 'base',
  },
  {
    id: 'm-8',
    title: 'Falcon-40B',
    description: 'TII Falcon 40B instruct tuned',
    tag: 'LLM',
    type: 'base',
  },
  { id: 'm-9', title: 'Yi-34B', description: '01.AI Yi 34B chat model', tag: 'LLM', type: 'base' },
  {
    id: 'm-10',
    title: 'CodeLlama-34B',
    description: 'Specialized Llama variant for code',
    tag: 'NLP',
    type: 'base',
  },
  {
    id: 'm-11',
    title: 'Custom Product Reviews',
    description: 'Fine-tuned Llama on product corpus',
    tag: 'vLLM',
    type: 'fine-tuned',
  },
  {
    id: 'm-12',
    title: 'Support Ticketing GPT',
    description: 'Domain-tuned assistant for ticketing',
    tag: 'LLM',
    type: 'fine-tuned',
  },
  {
    id: 'm-13',
    title: 'Legal Clause Extractor',
    description: 'LoRA adapter on Mistral legal data',
    tag: 'NLP',
    type: 'fine-tuned',
  },
  {
    id: 'm-14',
    title: 'Medical Q&A Assist',
    description: 'HIPAA-style fine-tune on clinical QA',
    tag: 'LLM',
    type: 'fine-tuned',
  },
  {
    id: 'm-15',
    title: 'Code Review Bot',
    description: 'Repository-specific diff commentary model',
    tag: 'vLLM',
    type: 'fine-tuned',
  },
  {
    id: 'm-16',
    title: 'Marketing Copy v2',
    description: 'Brand voice LoRA from campaign data',
    tag: 'NLP',
    type: 'fine-tuned',
  },
];

const MODELS_PAGE_SIZE = 8;

export function ServerlessCreateVllmPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const [name, setName] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [modelTab, setModelTab] = useState('all');
  const [modelPage, setModelPage] = useState(1);
  const [selectedModelId, setSelectedModelId] = useState<string>('m-1');
  const [downloadHf, setDownloadHf] = useState(true);
  const [gpuCount, setGpuCount] = useState(2);
  const [gpuMemoryGib, setGpuMemoryGib] = useState(40);
  const [port, setPort] = useState(8000);

  useEffect(() => {
    updateActiveTabLabel('Create endpoint');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setModelPage(1);
  }, [modelTab, modelSearch]);

  const filteredModels = useMemo(() => {
    const q = modelSearch.trim().toLowerCase();
    return mockModels.filter((m) => {
      const typeOk =
        modelTab === 'all' ||
        (modelTab === 'base' && m.type === 'base') ||
        (modelTab === 'fine-tuned' && m.type === 'fine-tuned');
      if (!typeOk) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tag.toLowerCase().includes(q)
      );
    });
  }, [modelTab, modelSearch]);

  const totalModelPages = Math.max(1, Math.ceil(filteredModels.length / MODELS_PAGE_SIZE));

  useEffect(() => {
    setModelPage((p) => Math.min(p, totalModelPages));
  }, [totalModelPages]);

  const paginatedModels = useMemo(() => {
    const start = (modelPage - 1) * MODELS_PAGE_SIZE;
    return filteredModels.slice(start, start + MODELS_PAGE_SIZE);
  }, [filteredModels, modelPage]);

  const selectedModel = mockModels.find((m) => m.id === selectedModelId);
  const summaryModelTitle = selectedModel?.title ?? '—';

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const modelCardGrid = (
    <div className="grid grid-cols-4 gap-4 w-full">
      {paginatedModels.map((model) => {
        const sel = selectedModelId === model.id;
        return (
          <button
            key={model.id}
            type="button"
            onClick={() => setSelectedModelId(model.id)}
            className={[
              'text-left rounded-[var(--radius-lg)] p-4 cursor-pointer transition-colors',
              'border bg-[var(--color-surface-default)]',
              sel
                ? 'border-[var(--color-border-focus)]'
                : 'border-[var(--color-border-default)] hover:bg-[var(--color-surface-hover)]',
            ].join(' ')}
          >
            <VStack gap={2}>
              <span className="text-heading-h6 text-[var(--color-text-default)]">
                {model.title}
              </span>
              <p className="text-body-md text-[var(--color-text-subtle)]">{model.description}</p>
              <Badge variant="info" size="sm">
                {model.tag}
              </Badge>
            </VStack>
          </button>
        );
      })}
    </div>
  );

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
                { label: 'vLLM' },
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
          <h1 className="text-heading-h4 text-[var(--color-text-default)]">Create endpoint</h1>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Configure a vLLM serverless endpoint with model selection, Hugging Face download
            options, and GPU resources.
          </p>
        </VStack>

        <div className="flex gap-6 w-full">
          <div className="flex-1 min-w-0 max-w-[1320px]">
            <VStack gap={6}>
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <VStack gap={6}>
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                    Basic Information
                  </h2>

                  <FormField label="Name" required>
                    <Input
                      placeholder="e.g., vllm-serverless-39120983"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-[328px]"
                    />
                  </FormField>

                  <FormField label="Model" required>
                    <VStack gap={4} className="w-full">
                      <SearchInput
                        placeholder="Find models with filter"
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        className="w-full max-w-[480px]"
                      />
                      <Pagination
                        currentPage={modelPage}
                        totalPages={totalModelPages}
                        onPageChange={setModelPage}
                        siblingCount={2}
                        totalItems={filteredModels.length}
                        className="w-full flex-wrap gap-y-2"
                      />
                      <Tabs value={modelTab} onChange={setModelTab} variant="underline" size="sm">
                        <TabList>
                          <Tab value="all">All</Tab>
                          <Tab value="base">Base model</Tab>
                          <Tab value="fine-tuned">Fine-tuned model</Tab>
                        </TabList>

                        <TabPanel value="all" className="pt-4">
                          {modelTab === 'all' ? modelCardGrid : null}
                        </TabPanel>
                        <TabPanel value="base" className="pt-4">
                          {modelTab === 'base' ? modelCardGrid : null}
                        </TabPanel>
                        <TabPanel value="fine-tuned" className="pt-4">
                          {modelTab === 'fine-tuned' ? modelCardGrid : null}
                        </TabPanel>
                      </Tabs>
                    </VStack>
                  </FormField>

                  <FormField
                    label="Download HuggingFace"
                    description="When off, use local model path from Finetune response to deploy without downloading."
                    spacing="loose"
                  >
                    <Toggle
                      label="Download"
                      checked={downloadHf}
                      onChange={(e) => setDownloadHf(e.target.checked)}
                    />
                  </FormField>
                </VStack>
              </div>

              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <VStack gap={6}>
                  <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                    Resource Configuration
                  </h2>

                  <FormField required>
                    <HStack justify="between" align="start" className="w-full">
                      <FormField.Label>GPU count</FormField.Label>
                      <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                        {gpuCount}
                      </span>
                    </HStack>
                    <FormField.Description>
                      Choose how many GPUs to attach for inference. Increasing count improves
                      throughput and allows larger batch sizes across replicas.
                    </FormField.Description>
                    <FormField.Control>
                      <HStack gap={3} align="center">
                        <Slider
                          min={0}
                          max={8}
                          step={1}
                          value={gpuCount}
                          onChange={setGpuCount}
                          className="flex-1 min-w-[220px] max-w-[240px]"
                        />
                        <NumberInput
                          min={0}
                          max={8}
                          step={1}
                          value={gpuCount}
                          onChange={setGpuCount}
                          width="xs"
                        />
                      </HStack>
                    </FormField.Control>
                  </FormField>

                  <FormField required>
                    <HStack justify="between" align="start" className="w-full">
                      <FormField.Label>GPU memory</FormField.Label>
                      <span className="text-body-md text-[var(--color-text-default)] shrink-0">
                        {gpuMemoryGib} GiB
                      </span>
                    </HStack>
                    <FormField.Description>
                      Reserve GPU VRAM aligned with weight size and KV cache. Higher values
                      stabilize long-context runs and concurrent requests without OOM spikes.
                    </FormField.Description>
                    <FormField.Control>
                      <HStack gap={3} align="center">
                        <Slider
                          min={8}
                          max={128}
                          step={4}
                          value={gpuMemoryGib}
                          onChange={setGpuMemoryGib}
                          className="flex-1 min-w-[220px] max-w-[240px]"
                        />
                        <NumberInput
                          min={8}
                          max={128}
                          step={1}
                          value={gpuMemoryGib}
                          onChange={setGpuMemoryGib}
                          width="xs"
                          suffix="GiB"
                        />
                      </HStack>
                    </FormField.Control>
                  </FormField>

                  <FormField label="Port" description="Enter a port number" required>
                    <NumberInput
                      min={1}
                      max={65535}
                      step={1}
                      value={port}
                      onChange={setPort}
                      width={328}
                    />
                  </FormField>
                </VStack>
              </div>
            </VStack>
          </div>

          <div className="w-[312px] shrink-0">
            <div className="sticky top-[80px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-3">
              <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
                <h3 className="text-heading-h6 text-[var(--color-text-default)] mb-4">Summary</h3>
                <VStack gap={0}>
                  <HStack justify="between" align="center" className="min-h-7">
                    <span className="text-label-sm text-[var(--color-text-subtle)]">Name</span>
                    <span
                      className="text-body-md text-[var(--color-text-default)] truncate ml-4 max-w-[160px]"
                      title={name || '—'}
                    >
                      {name.trim() ? name : '—'}
                    </span>
                  </HStack>
                  <HStack justify="between" align="center" className="min-h-7 mt-3">
                    <span className="text-label-sm text-[var(--color-text-subtle)]">Model</span>
                    <span
                      className="text-body-md text-[var(--color-text-default)] truncate ml-4 max-w-[160px]"
                      title={summaryModelTitle}
                    >
                      {summaryModelTitle}
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
                  Create endpoint
                </Button>
              </HStack>
            </div>
          </div>
        </div>
      </VStack>
    </PageShell>
  );
}

export default ServerlessCreateVllmPage;
