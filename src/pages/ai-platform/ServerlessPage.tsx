import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  Table,
  Pagination,
  SearchInput,
  StatusIndicator,
  ContextMenu,
  MetricCard,
  fixedColumns,
  columnMinWidths,
  Drawer,
  FormField,
  Input,
  Textarea,
  NumberInput,
  Checkbox,
  InfoBox,
  InlineMessage,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  CopyButton,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash, IconDotsCircleHorizontal } from '@tabler/icons-react';

const PAGE_SIZE = 10;

interface ServerlessEndpoint {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'error' | 'muted' | 'building';
  gpu: number;
  type: 'Public' | 'Private';
  replicas: string;
  port: number;
  createdAt: string;
  endpointType: 'vllm' | 'docker';
}

const STATUS_CARDS: { label: string; value: number }[] = [
  { label: 'Available', value: 5 },
  { label: 'Failed', value: 0 },
  { label: 'Paused', value: 5 },
  { label: 'Pending', value: 5 },
];

const MOCK_LOGS_JSON = `{
  "level": "info",
  "timestamp": "2026-05-08T06:15:42.183Z",
  "pod": "vllm-llama-3-1-70b-vllm-7d9c8f4b9-xk2lq",
  "container": "inference",
  "message": "Uvicorn running on http://0.0.0.0:8000",
  "events": [
    { "type": "Scheduled", "reason": "Successfully assigned to node gpu-pool-01" },
    { "type": "Pulling", "reason": "Pulling image registry.internal/llm/vllm:v0.6" },
    { "type": "Started", "reason": "Started container inference" }
  ]
}`;

const MOCK_CONTAINER_LOGS = `INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000`;

const MOCK_ENDPOINTS: ServerlessEndpoint[] = [
  {
    id: 'ep-001',
    name: 'llama-3.1-70b-vllm',
    description: 'High-throughput Llama 3.1 70B via vLLM on A100',
    status: 'active',
    gpu: 4,
    type: 'Public',
    replicas: '0 - 1',
    port: 8000,
    createdAt: '2026-05-01 09:12:44',
    endpointType: 'vllm',
  },
  {
    id: 'ep-002',
    name: 'stable-diffusion-xl',
    description: 'SDXL image generation with refiner pipeline',
    status: 'active',
    gpu: 2,
    type: 'Private',
    replicas: '1 - 3',
    port: 8080,
    createdAt: '2026-05-02 11:05:18',
    endpointType: 'docker',
  },
  {
    id: 'ep-003',
    name: 'mistral-7b-instruct',
    description: 'Mistral 7B instruct for internal chat APIs',
    status: 'muted',
    gpu: 1,
    type: 'Private',
    replicas: '0 - 1',
    port: 8000,
    createdAt: '2026-04-28 16:40:02',
    endpointType: 'vllm',
  },
  {
    id: 'ep-004',
    name: 'embedding-bge-m3',
    description: 'BGE-M3 dense embeddings for retrieval',
    status: 'active',
    gpu: 1,
    type: 'Public',
    replicas: '2 - 4',
    port: 8088,
    createdAt: '2026-05-03 08:22:31',
    endpointType: 'docker',
  },
  {
    id: 'ep-005',
    name: 'whisper-large-v3-asr',
    description: 'Speech-to-text endpoint (batch + streaming)',
    status: 'building',
    gpu: 2,
    type: 'Private',
    replicas: '0 - 1',
    port: 9000,
    createdAt: '2026-05-07 13:15:09',
    endpointType: 'docker',
  },
  {
    id: 'ep-006',
    name: 'codellama-34b-fim',
    description: 'Fill-in-the-middle code completion service',
    status: 'active',
    gpu: 4,
    type: 'Private',
    replicas: '1 - 2',
    port: 8000,
    createdAt: '2026-04-29 19:03:56',
    endpointType: 'vllm',
  },
  {
    id: 'ep-007',
    name: 'falcon-180b-chat',
    description: 'Falcon 180B chat (quantizedWeights=auto)',
    status: 'error',
    gpu: 8,
    type: 'Private',
    replicas: '0 - 1',
    port: 8001,
    createdAt: '2026-04-27 10:48:12',
    endpointType: 'vllm',
  },
  {
    id: 'ep-008',
    name: 'flux-dev-img2img',
    description: 'FLUX Dev img2img for creative studio workflows',
    status: 'active',
    gpu: 2,
    type: 'Public',
    replicas: '0 - 1',
    port: 7860,
    createdAt: '2026-05-04 14:27:00',
    endpointType: 'docker',
  },
  {
    id: 'ep-009',
    name: 'qwen2.5-72b-awq',
    description: 'Qwen2.5 72B AWQ for low-latency reasoning',
    status: 'muted',
    gpu: 4,
    type: 'Private',
    replicas: '1 - 3',
    port: 8000,
    createdAt: '2026-04-26 07:55:41',
    endpointType: 'vllm',
  },
  {
    id: 'ep-010',
    name: 'phi-4-mini-router',
    description: 'Lightweight router model for intent classification',
    status: 'active',
    gpu: 1,
    type: 'Public',
    replicas: '2 - 6',
    port: 8080,
    createdAt: '2026-05-06 12:09:33',
    endpointType: 'vllm',
  },
  {
    id: 'ep-011',
    name: 'clip-vit-h-14',
    description: 'OpenCLIP ViT-H/14 visual encoder',
    status: 'building',
    gpu: 1,
    type: 'Private',
    replicas: '0 - 1',
    port: 8090,
    createdAt: '2026-05-07 15:42:18',
    endpointType: 'docker',
  },
  {
    id: 'ep-012',
    name: 'mixtral-8x7b-vllm',
    description: 'Mixtral 8x7B MoE with tensor parallel',
    status: 'active',
    gpu: 4,
    type: 'Private',
    replicas: '0 - 1',
    port: 8000,
    createdAt: '2026-04-30 21:18:27',
    endpointType: 'vllm',
  },
  {
    id: 'ep-013',
    name: 'reranker-bge-v2',
    description: 'Cross-encoder reranker for search quality',
    status: 'error',
    gpu: 1,
    type: 'Private',
    replicas: '0 - 1',
    port: 8085,
    createdAt: '2026-04-25 09:33:50',
    endpointType: 'docker',
  },
  {
    id: 'ep-014',
    name: 'nvidia-nemotron-4-340b',
    description: 'Nemotron 340B enterprise assistant (preview)',
    status: 'muted',
    gpu: 8,
    type: 'Private',
    replicas: '0 - 1',
    port: 8000,
    createdAt: '2026-05-05 06:01:14',
    endpointType: 'vllm',
  },
  {
    id: 'ep-015',
    name: 'llama-guard-3-8b',
    description: 'Safety classifier for prompt/response moderation',
    status: 'active',
    gpu: 1,
    type: 'Public',
    replicas: '1 - 4',
    port: 8070,
    createdAt: '2026-05-03 17:28:09',
    endpointType: 'vllm',
  },
  {
    id: 'ep-016',
    name: 'musicgen-medium',
    description: 'AudioCraft MusicGen medium stereo output',
    status: 'building',
    gpu: 2,
    type: 'Private',
    replicas: '0 - 1',
    port: 8899,
    createdAt: '2026-05-08 08:00:00',
    endpointType: 'docker',
  },
  {
    id: 'ep-017',
    name: 'deepseek-r1-distill-8b',
    description: 'Distilled reasoning model for edge clusters',
    status: 'active',
    gpu: 2,
    type: 'Public',
    replicas: '0 - 2',
    port: 8000,
    createdAt: '2026-05-07 22:14:55',
    endpointType: 'vllm',
  },
  {
    id: 'ep-018',
    name: 'segformer-b5-semseg',
    description: 'Semantic segmentation for defect inspection',
    status: 'muted',
    gpu: 1,
    type: 'Private',
    replicas: '1 - 1',
    port: 8082,
    createdAt: '2026-04-24 13:07:38',
    endpointType: 'docker',
  },
];

function endpointStatusForIndicator(
  status: ServerlessEndpoint['status']
): 'active' | 'error' | 'paused' | 'building' {
  if (status === 'muted') return 'paused';
  return status;
}

function internalBaseUrl(row: ServerlessEndpoint): string {
  return `http://${row.name}.inference.svc.cluster.local:${row.port}`;
}

function internalHostHeader(row: ServerlessEndpoint): string {
  return `${row.name}.inference.svc.cluster.local`;
}

function buildCurlExample(row: ServerlessEndpoint): string {
  const base = internalBaseUrl(row);
  const host = internalHostHeader(row);
  return `curl -X POST "${base}/v1/chat/completions" \\
  -H "Host: ${host}" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${row.name}","messages":[{"role":"user","content":"Hello"}]}'`;
}

function buildPythonExample(row: ServerlessEndpoint): string {
  const base = internalBaseUrl(row);
  const host = internalHostHeader(row);
  return `import requests

url = "${base}/v1/chat/completions"
headers = {
    "Host": "${host}",
    "Content-Type": "application/json",
}
payload = {
    "model": "${row.name}",
    "messages": [{"role": "user", "content": "Hello"}],
}
response = requests.post(url, headers=headers, json=payload, timeout=60)
print(response.json())`;
}

const codeBlockClassName =
  'bg-[var(--color-surface-contrast)] text-[var(--color-text-on-primary)] font-mono text-body-md rounded-[var(--radius-md)] p-4 overflow-x-auto whitespace-pre-wrap break-words';

export function ServerlessPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<ServerlessEndpoint | null>(null);
  const [internalUrlOpen, setInternalUrlOpen] = useState(false);
  const [sendPromptOpen, setSendPromptOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const [internalExampleTab, setInternalExampleTab] = useState<'curl' | 'python'>('curl');

  const [promptText, setPromptText] = useState('');
  const [maxTokens, setMaxTokens] = useState(1);
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(1);
  const [frequencyPenalty, setFrequencyPenalty] = useState(1);
  const [presencePenalty, setPresencePenalty] = useState(1);
  const [stopSequence, setStopSequence] = useState('');
  const [streamResponse, setStreamResponse] = useState(true);
  const [promptResponseBody, setPromptResponseBody] = useState(
    '// Response will appear here after you choose Generate.'
  );
  const [promptMeta, setPromptMeta] = useState<{
    tokens: number | null;
    finishReason: string | null;
  }>({ tokens: null, finishReason: null });

  useEffect(() => {
    updateActiveTabLabel('Serverless');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!sendPromptOpen) return;
    setPromptResponseBody('// Response will appear here after you choose Generate.');
    setPromptMeta({ tokens: null, finishReason: null });
  }, [sendPromptOpen, selectedEndpoint?.id]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_ENDPOINTS;
    return MOCK_ENDPOINTS.filter(
      (row) => row.name.toLowerCase().includes(q) || row.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const getRowActions = useCallback(
    (row: ServerlessEndpoint): ContextMenuItem[] => {
      return [
        {
          id: 'internal-url',
          label: 'Internal URL',
          onClick: () => {
            setSelectedEndpoint(row);
            setInternalUrlOpen(true);
          },
        },
        {
          id: 'send-prompt',
          label: 'Send prompt',
          onClick: () => {
            setSelectedEndpoint(row);
            setSendPromptOpen(true);
          },
        },
        {
          id: 'logs',
          label: 'View logs',
          onClick: () => {
            setSelectedEndpoint(row);
            setLogsOpen(true);
          },
        },
        {
          id: 'edit',
          label: 'Edit',
          divider: true,
          onClick: () =>
            navigate(
              row.endpointType === 'docker'
                ? '/ai-platform/serverless/edit/docker'
                : '/ai-platform/serverless/edit/vllm'
            ),
        },
        {
          id: 'delete',
          label: 'Delete',
          status: 'danger',
          onClick: () => alert(`Delete: ${row.name}`),
        },
      ];
    },
    [navigate]
  );

  const columns: TableColumn<ServerlessEndpoint>[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center',
        render: (_: unknown, row: ServerlessEndpoint) => (
          <StatusIndicator status={endpointStatusForIndicator(row.status)} layout="icon-only" />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        minWidth: columnMinWidths.name,
        flex: 1,
        render: (_: unknown, row: ServerlessEndpoint) => (
          <VStack gap={0.5} align="start">
            <span className="text-body-md text-[var(--color-text-default)]">{row.name}</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">{row.description}</span>
          </VStack>
        ),
      },
      {
        key: 'gpu',
        label: 'GPU',
        minWidth: '72px',
        render: (val: number) => (
          <span className="text-body-md text-[var(--color-text-default)]">{val}</span>
        ),
      },
      {
        key: 'type',
        label: 'Type',
        minWidth: '88px',
        render: (val: string) => (
          <span className="text-body-md text-[var(--color-text-default)]">{val}</span>
        ),
      },
      {
        key: 'replicas',
        label: 'Replicas',
        minWidth: '96px',
        render: (val: string) => (
          <span className="text-body-md text-[var(--color-text-default)]">{val}</span>
        ),
      },
      {
        key: 'port',
        label: 'Port',
        minWidth: '72px',
        render: (val: number) => (
          <span className="text-body-md text-[var(--color-text-default)]">{val}</span>
        ),
      },
      {
        key: 'createdAt',
        label: 'Created at',
        minWidth: columnMinWidths.createdAt,
        align: 'right',
        render: (val: string) => (
          <span className="text-body-md text-[var(--color-text-default)]">{val}</span>
        ),
      },
      {
        key: 'action',
        label: 'Action',
        width: fixedColumns.actions,
        align: 'center',
        render: (_: unknown, row: ServerlessEndpoint) => (
          <ContextMenu items={getRowActions(row)} trigger="click">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors size-7"
              aria-label="Actions"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-muted)]"
              />
            </button>
          </ContextMenu>
        ),
      },
    ],
    [getRowActions]
  );

  useEffect(() => {
    setCurrentPage((p) => (p > totalPages ? totalPages : p));
  }, [totalPages]);

  const drawerEndpoint = selectedEndpoint;

  const handleGeneratePrompt = () => {
    const epName = drawerEndpoint?.name ?? 'endpoint';
    setPromptResponseBody(
      JSON.stringify(
        {
          id: `chatcmpl-mock-${Date.now()}`,
          object: 'chat.completion',
          model: epName,
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'Mock assistant reply for demonstration.' },
              finish_reason: 'stop',
            },
          ],
          usage: { prompt_tokens: 12, completion_tokens: 128, total_tokens: 140 },
        },
        null,
        2
      )
    );
    setPromptMeta({ tokens: 140, finishReason: 'stop' });
  };

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
          breadcrumb={<Breadcrumb items={[{ label: 'Infrastructure' }, { label: 'Serverless' }]} />}
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader
          title="Serverless"
          actions={
            <HStack gap={1}>
              <Button variant="secondary" size="md">
                Refresh
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/ai-platform/serverless/create')}
              >
                Create endpoint
              </Button>
            </HStack>
          }
        />

        <MetricCard.Group>
          {STATUS_CARDS.map((card) => (
            <MetricCard key={card.label} title={card.label} value={card.value} />
          ))}
        </MetricCard.Group>

        <HStack gap={2} align="center" className="w-full flex-wrap">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find serverless with filters"
            size="sm"
            className="w-[var(--search-input-width)]"
          />
          <div className="h-6 w-px shrink-0 bg-[var(--color-border-default)]" aria-hidden />
          <Button
            variant="secondary"
            size="sm"
            disabled={selectedKeys.length === 0}
            leftIcon={<IconTrash size={12} />}
            onClick={() => alert(`Delete ${selectedKeys.length} endpoint(s)`)}
          >
            Delete
          </Button>
        </HStack>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
          selectedCount={selectedKeys.length}
        />

        <Table<ServerlessEndpoint>
          columns={columns}
          data={paginated}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          emptyMessage="No serverless endpoints found"
        />
      </VStack>

      {drawerEndpoint && (
        <>
          <Drawer
            isOpen={internalUrlOpen}
            onClose={() => setInternalUrlOpen(false)}
            title="Internal URL"
            description="Description"
            width={696}
            footer={
              <HStack gap={2} className="w-full">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => setInternalUrlOpen(false)}
                >
                  Close
                </Button>
              </HStack>
            }
          >
            <VStack gap={6}>
              <InfoBox.Group>
                <InfoBox label="Base URL" value={internalBaseUrl(drawerEndpoint)} copyable />
                <InfoBox
                  label="Host header (Required)"
                  value={internalHostHeader(drawerEndpoint)}
                  copyable
                />
              </InfoBox.Group>
              <InlineMessage variant="warning">
                The host header is required for KEDA to register traffic and prevent scale-down.
              </InlineMessage>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage examples</h4>
              <Tabs
                value={internalExampleTab}
                onChange={(v) => setInternalExampleTab(v as 'curl' | 'python')}
                variant="boxed"
                size="sm"
              >
                <TabList>
                  <Tab value="curl">curl</Tab>
                  <Tab value="python">Python</Tab>
                </TabList>
                <TabPanel value="curl" className="pt-3">
                  <pre className={codeBlockClassName}>
                    <code>{buildCurlExample(drawerEndpoint)}</code>
                  </pre>
                </TabPanel>
                <TabPanel value="python" className="pt-3">
                  <pre className={codeBlockClassName}>
                    <code>{buildPythonExample(drawerEndpoint)}</code>
                  </pre>
                </TabPanel>
              </Tabs>
            </VStack>
          </Drawer>

          <Drawer
            isOpen={sendPromptOpen}
            onClose={() => setSendPromptOpen(false)}
            title="Send prompt"
            description="Send a test prompt to the running endpoint to verify it is currently processing requests correctly."
            width={696}
            footer={
              <HStack gap={2} className="w-full">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => setSendPromptOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={handleGeneratePrompt}
                >
                  Generate
                </Button>
              </HStack>
            }
          >
            <VStack gap={6}>
              <FormField
                label="Prompt"
                description="The input text sent to the LLM to generate a response."
                required
              >
                <Textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  fullWidth
                  className="min-h-[70px]"
                />
              </FormField>
              <FormField
                label="Max tokens"
                description="The maximum number of tokens the model can generate in the response."
                required
              >
                <NumberInput value={maxTokens} onChange={setMaxTokens} width="xs" />
              </FormField>
              <FormField
                label="Temperature"
                description="Controls the randomness of the output; higher values produce more diverse responses."
                required
              >
                <NumberInput value={temperature} onChange={setTemperature} width="xs" />
              </FormField>
              <FormField
                label="Top P"
                description="Controls nucleus sampling by limiting token selection to a cumulative probability threshold."
              >
                <NumberInput value={topP} onChange={setTopP} width="xs" />
              </FormField>
              <FormField
                label="Frequency Penalty"
                description="Adjusts the likelihood of repeated tokens based on how frequently they appear in the generated text."
              >
                <NumberInput value={frequencyPenalty} onChange={setFrequencyPenalty} width="xs" />
              </FormField>
              <FormField
                label="Presence Penalty"
                description="Adjusts the likelihood of repeated tokens based on whether they have already appeared in the text."
              >
                <NumberInput value={presencePenalty} onChange={setPresencePenalty} width="xs" />
              </FormField>
              <FormField
                label="Stop sequence"
                description="Specifies one or more sequences that will stop generation when encountered."
              >
                <Input
                  value={stopSequence}
                  onChange={(e) => setStopSequence(e.target.value)}
                  fullWidth
                />
              </FormField>
              <Checkbox
                checked={streamResponse}
                onChange={(e) => setStreamResponse(e.target.checked)}
                label="Stream response"
              />
              <VStack gap={2} className="w-full">
                <HStack justify="between" align="center" className="w-full">
                  <span className="text-label-sm text-[var(--color-text-default)]">Response</span>
                  <CopyButton
                    value={promptResponseBody}
                    iconOnly
                    variant="ghost"
                    size="sm"
                    tooltip="Copy response"
                    aria-label="Copy response"
                  />
                </HStack>
                <pre className={`${codeBlockClassName} h-[400px] overflow-y-auto`}>
                  <code>{promptResponseBody}</code>
                </pre>
                <HStack gap={4} className="text-body-sm text-[var(--color-text-muted)] flex-wrap">
                  <span>
                    Tokens: {promptMeta.tokens !== null ? String(promptMeta.tokens) : '—'}
                  </span>
                  <span>
                    Finish reason:{' '}
                    {promptMeta.finishReason !== null ? promptMeta.finishReason : '—'}
                  </span>
                </HStack>
              </VStack>
            </VStack>
          </Drawer>

          <Drawer
            isOpen={logsOpen}
            onClose={() => setLogsOpen(false)}
            title="Logs"
            description="Displays detailed logs and event information for the selected pod."
            width={696}
            footer={
              <HStack gap={2} className="w-full">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => setLogsOpen(false)}
                >
                  Close
                </Button>
              </HStack>
            }
          >
            <VStack gap={6} className="min-h-0 flex-1">
              <HStack gap={2} align="stretch" className="w-full">
                <div className="flex-1 min-w-0">
                  <InfoBox label="Name" value={drawerEndpoint.name} />
                </div>
                <div className="flex-1 min-w-0 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3">
                  <VStack gap={1.5} align="start">
                    <span className="text-label-sm text-[var(--color-text-subtle)]">Status</span>
                    <HStack gap={2} align="center">
                      <span className="text-body-md text-[var(--color-text-default)]">Running</span>
                      <StatusIndicator status="active" layout="badge" label="Running" />
                    </HStack>
                  </VStack>
                </div>
              </HStack>
              <p className="text-label-sm text-[var(--color-text-subtle)]">
                Displays up to the 1,000 most recent logs/events.
              </p>
              <Tabs
                defaultValue="events"
                variant="boxed"
                size="sm"
                className="flex flex-col flex-1 min-h-[280px]"
              >
                <TabList>
                  <Tab value="events">Pod events & Diagnostics</Tab>
                  <Tab value="container">Container logs</Tab>
                </TabList>
                <TabPanel value="events" className="pt-3 flex flex-col flex-1 min-h-0">
                  <pre className={`${codeBlockClassName} flex-1 min-h-[200px] overflow-auto`}>
                    <code>{MOCK_LOGS_JSON}</code>
                  </pre>
                </TabPanel>
                <TabPanel value="container" className="pt-3 flex flex-col flex-1 min-h-0">
                  <pre className={`${codeBlockClassName} flex-1 min-h-[200px] overflow-auto`}>
                    <code>{MOCK_CONTAINER_LOGS}</code>
                  </pre>
                </TabPanel>
              </Tabs>
            </VStack>
          </Drawer>
        </>
      )}
    </PageShell>
  );
}

export default ServerlessPage;
