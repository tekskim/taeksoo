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
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTrash, IconDotsCircleHorizontal } from '@tabler/icons-react';

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
}

const STATUS_CARDS: { label: string; value: number }[] = [
  { label: 'Available', value: 5 },
  { label: 'Failed', value: 0 },
  { label: 'Paused', value: 5 },
  { label: 'Pending', value: 5 },
];

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
  },
];

function endpointStatusForIndicator(
  status: ServerlessEndpoint['status']
): 'active' | 'error' | 'paused' | 'building' {
  if (status === 'muted') return 'paused';
  return status;
}

export function ServerlessPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    updateActiveTabLabel('Serverless');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const getRowActions = useCallback((row: ServerlessEndpoint): ContextMenuItem[] => {
    return [
      { id: 'edit', label: 'Edit', onClick: () => {} },
      { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
      { id: 'logs', label: 'View logs', onClick: () => {} },
      {
        id: 'delete',
        label: 'Delete',
        status: 'danger',
        divider: true,
        onClick: () => {},
      },
    ];
  }, []);

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
          actions={
            <button
              type="button"
              className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          }
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
          <Button variant="secondary" size="sm" disabled leftIcon={<IconTrash size={12} />}>
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
    </PageShell>
  );
}

export default ServerlessPage;
