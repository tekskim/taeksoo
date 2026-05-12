import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  PageShell,
  TabBar,
  TopBar,
  Breadcrumb,
  PageHeader,
  Button,
  Table,
  type TableColumn,
  Pagination,
  SearchInput,
  StatusIndicator,
  ContextMenu,
  type ContextMenuItem,
  MetricCard,
  EmptyState,
  Badge,
  Chip,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Drawer,
  FormField,
  Input,
  Textarea,
  Select,
  Toggle,
  Slider,
  NumberInput,
  Checkbox,
  Disclosure,
  InlineMessage,
  SectionCard,
  DetailHeader,
  Radio,
  RadioGroup,
  fixedColumns,
  columnMinWidths,
  FloatingCard,
} from '@/design-system';
import type { FloatingCardSection } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTrash,
  IconRefresh,
  IconDotsCircleHorizontal,
  IconFlask,
  IconPlus,
  IconChevronDown,
  IconChevronRight,
  IconX,
} from '@tabler/icons-react';
import { DataTestToolbar, multiplyData, type DataMode } from './shared';

/* ——— types ——— */

type ExperimentStatus = 'completed' | 'failed' | 'running' | 'pending';
type ExperimentRow = {
  id: string;
  status: ExperimentStatus;
  name: string;
  method: string;
  steps: string;
  owner: string;
  duration: string;
  createdAt: string;
  completedAt: string;
  description: string;
};

type ModelItem = {
  id: string;
  title: string;
  description: string;
  badge?: 'available' | 'base';
};

/* ——— mock ——— */

const MOCK_MODELS: ModelItem[] = [
  {
    id: 'm1',
    title: 'Qwen2-0.5B',
    description: 'Compact base checkpoint for text experiments.',
    badge: 'available',
  },
  {
    id: 'm2',
    title: 'Qwen2-1.5B',
    description: 'Balanced quality and speed for fine-tuning.',
    badge: 'base',
  },
  {
    id: 'm3',
    title: 'Qwen2-7B',
    description: 'Higher capacity for complex generation tasks.',
    badge: 'available',
  },
  {
    id: 'm4',
    title: 'Llama-3-8B-Instruct',
    description: 'Instruction-tuned variant for chat-style SFT.',
    badge: 'base',
  },
  {
    id: 'm5',
    title: 'Gemma-2B',
    description: 'Lightweight option for rapid iteration.',
    badge: 'available',
  },
  {
    id: 'm6',
    title: 'Phi-3-mini',
    description: 'Small model suited for CPT pipelines.',
    badge: 'available',
  },
];

const INITIAL_EXPERIMENTS: ExperimentRow[] = [
  {
    id: 'exp-1',
    status: 'completed',
    name: 'sft-news-summary-v1',
    method: 'SFT',
    steps: '1/1',
    owner: '8f3a2c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
    duration: '9m 0s',
    createdAt: '2026-01-16T09:02:00',
    completedAt: '2026-01-16T09:11:00',
    description: 'Fine-tune summarization on internal news corpus.',
  },
  {
    id: 'exp-2',
    status: 'failed',
    name: 'cpt-code-base',
    method: 'CPT',
    steps: '2/3',
    owner: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    duration: '42m 18s',
    createdAt: '2026-01-15T14:20:00',
    completedAt: '—',
    description: 'Continued pretrain on code snapshots.',
  },
  {
    id: 'exp-3',
    status: 'running',
    name: 'multistep-rag-agent',
    method: 'Multi-Step',
    steps: '2/3',
    owner: 'cafebabe-0000-1111-2222-333333333333',
    duration: '3h 12m',
    createdAt: '2026-01-17T08:00:00',
    completedAt: '—',
    description: 'Multi-block pipeline for RAG-style agents.',
  },
  {
    id: 'exp-4',
    status: 'pending',
    name: 'pending-sft-queue',
    method: 'SFT',
    steps: '0/1',
    owner: 'deadbeef-aaaa-bbbb-cccc-dddddddddddd',
    duration: '—',
    createdAt: '2026-01-18T10:45:00',
    completedAt: '—',
    description: 'Queued workload awaiting GPU quota.',
  },
  {
    id: 'exp-5',
    status: 'completed',
    name: 'sft-support-tickets',
    method: 'SFT',
    steps: '1/1',
    owner: '11112222-3333-4444-5555-666666666666',
    duration: '22m 40s',
    createdAt: '2026-01-12T16:30:00',
    completedAt: '2026-01-12T16:52:00',
    description: 'Support ticket reply style fine-tuning.',
  },
];

const MOCK_TEMPLATES: ModelItem[] = MOCK_MODELS.slice(0, 4);

const MOCK_DATASETS: ModelItem[] = [
  { id: 'd1', title: 'Thaki-Docs-SFT', description: 'Curated documentation pairs.' },
  { id: 'd2', title: 'Custom-JSONL-01', description: 'User-uploaded JSONL bundle.' },
  { id: 'd3', title: 'Instruction-Mix-KO', description: 'Mixed Korean instructions.' },
  { id: 'd4', title: 'Tabular-Pretrain', description: 'Structured table-to-text pairs.' },
  { id: 'd5', title: 'Gen-Eval-Holding', description: 'Held-out generation eval set.' },
  { id: 'd6', title: 'Short-Form-QA', description: 'Short QA for retrieval experiments.' },
];

const METHOD_OPTIONS = [
  { value: 'SFT', label: 'SFT' },
  { value: 'CPT', label: 'CPT' },
  { value: 'Multi-Step', label: 'Multi-Step' },
];

const TEXT_PREVIEW_LINES = [
  '[    0.0s] Kernel started: textgen-trainer-7f8c9',
  '[    0.2s] CUDA device 0: NVIDIA A100-SXM4-40GB',
  '[    0.8s] Loading checkpoint shards: 100%',
  '[    1.4s] tokenizer: vocab_size=151936',
  '[    2.1s] gradient_checkpointing=True, dtype=bfloat16',
  '[    3.0s] step=0 loss=2.8341 lr=5e-6',
  '[   12.4s] step=10 loss=2.4012',
  '[   24.9s] step=20 loss=1.9920',
  '[   36.1s] step=30 loss=1.7104',
  '[   48.7s] step=40 loss=1.5023',
];

const LIST_PATH = '/ai-platform/text-generation';

/* ——— helpers ——— */

function statusToIndicator(s: ExperimentStatus): 'active' | 'error' | 'building' | 'pending' {
  if (s === 'completed') return 'active';
  if (s === 'failed') return 'error';
  if (s === 'running') return 'building';
  return 'pending';
}

function statusBadgeLabel(s: ExperimentStatus): string {
  if (s === 'completed') return 'Completed';
  if (s === 'failed') return 'Failed';
  if (s === 'running') return 'Running';
  return 'Pending';
}

function formatListDate(iso: string) {
  if (iso === '—') return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDetailStamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function CapsuleTab({
  items,
  activeValue,
  onChange,
}: {
  items: { value: string; label: string }[];
  activeValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-1">
      {items.map((item) => {
        const isActive = item.value === activeValue;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`min-w-[60px] rounded-[var(--radius-md)] px-2.5 py-1 text-center text-label-md transition-colors ${
              isActive
                ? 'border border-[var(--color-border-default)] bg-[var(--color-surface-default)] text-[var(--color-action-primary)]'
                : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function ModelPickerCard({
  model,
  selected,
  onSelect,
}: {
  model: ModelItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col gap-2 rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
        selected
          ? 'border-2 border-[var(--color-action-primary)]'
          : 'border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)]'
      }`}
    >
      <div className="flex flex-wrap items-center gap-1">
        {model.badge === 'available' && (
          <Badge variant="success" size="sm">
            Available
          </Badge>
        )}
        {model.badge === 'base' && (
          <Badge theme="gray" size="sm">
            Base model
          </Badge>
        )}
      </div>
      <span className="text-label-md text-[var(--color-text-default)]">{model.title}</span>
      <p className="line-clamp-2 text-body-sm text-[var(--color-text-subtle)]">
        {model.description}
      </p>
    </button>
  );
}

function DatasetPickerCard({
  item,
  selected,
  onSelect,
}: {
  item: ModelItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col gap-2 rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
        selected
          ? 'border-2 border-[var(--color-action-primary)]'
          : 'border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)]'
      }`}
    >
      <span className="text-label-md text-[var(--color-text-default)]">{item.title}</span>
      <p className="line-clamp-2 text-body-sm text-[var(--color-text-subtle)]">
        {item.description}
      </p>
    </button>
  );
}

function HyperDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="h-px w-full bg-[var(--color-border-subtle)]" />
      <div className="flex flex-col gap-1.5">
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{value}</span>
      </div>
    </div>
  );
}

function NestedDisclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full rounded-[6px] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 py-3">
      <Disclosure defaultOpen>
        <Disclosure.Trigger>{title}</Disclosure.Trigger>
        <Disclosure.Panel>
          <div className="mt-3">{children}</div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
}

/* ——— page ——— */

export function TextGenerationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  const patchParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') next.delete(k);
        else next.set(k, v);
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const view = searchParams.get('view') || 'list';
  const detailId = searchParams.get('id') || '';
  const panel = (searchParams.get('panel') || 'details') as 'details' | 'logs' | 'monitoring';
  const wstep = (searchParams.get('wstep') || 'configuration') as 'configuration' | 'publish';

  const [dataMode, setDataMode] = useState<DataMode>('few');
  const [experiments, setExperiments] = useState<ExperimentRow[]>(INITIAL_EXPERIMENTS);
  const [listQuery, setListQuery] = useState('');
  const [listPage, setListPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [detailCapsuleStep, setDetailCapsuleStep] = useState<'1' | '2'>('1');
  const [logQuery, setLogQuery] = useState('');
  const [monitoringAuto, setMonitoringAuto] = useState(false);
  const [monitoringBlocks, setMonitoringBlocks] = useState({
    b1: true,
    b1s1: true,
    b1s2: false,
    b2: false,
    b2s1: false,
  });
  const [monitoringExpanded, setMonitoringExpanded] = useState({ b1: true, b2: true, b3: false });

  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [templateTab, setTemplateTab] = useState('all');
  const [templateSearch, setTemplateSearch] = useState('');
  const [templatePage, setTemplatePage] = useState(1);
  const [draftTemplateId, setDraftTemplateId] = useState<string | null>(null);
  const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null);

  const [experimentName, setExperimentName] = useState('');
  const [experimentDesc, setExperimentDesc] = useState('');
  const [totalGpus, setTotalGpus] = useState(2);
  const [modelListTab, setModelListTab] = useState('all');
  const [modelSearch, setModelSearch] = useState('');
  const [modelPage, setModelPage] = useState(1);
  const [baseModelId, setBaseModelId] = useState<string | null>(null);

  const [publishMethod, setPublishMethod] = useState('SFT');
  const [datasetTab, setDatasetTab] = useState('all');
  const [datasetSearch, setDatasetSearch] = useState('');
  const [datasetPage, setDatasetPage] = useState(1);
  const [datasetIds, setDatasetIds] = useState<string[]>([]);
  const [trainingModel, setTrainingModel] = useState('full-ft');
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherModelTab, setTeacherModelTab] = useState('all');

  const [durationMode, setDurationMode] = useState<'steps' | 'epochs'>('steps');
  const [maxTrainSteps, setMaxTrainSteps] = useState(3);
  const [learningRate, setLearningRate] = useState(0.000005);
  const [perDeviceBatch, setPerDeviceBatch] = useState(2);
  const [gradAccum, setGradAccum] = useState(4);
  const [maxSeqLen, setMaxSeqLen] = useState(124);
  const [resCpu, setResCpu] = useState(8);
  const [resMem, setResMem] = useState(32);
  const [distStrategy, setDistStrategy] = useState('ddp');
  const [warmupSteps, setWarmupSteps] = useState(100);
  const [lrScheduler, setLrScheduler] = useState('linear');
  const [mlflowName, setMlflowName] = useState('Default');
  const [earlyStop, setEarlyStop] = useState(true);
  const [patience, setPatience] = useState('linear');
  const [threshold, setThreshold] = useState('Default');
  const [evalMetric, setEvalMetric] = useState('loss');
  const [evalPath, setEvalPath] = useState('/datasets/eval/default');
  const [logSteps, setLogSteps] = useState(10);
  const [numNodes, setNumNodes] = useState(1);
  const [precision, setPrecision] = useState('bf16');
  const [gradCkpt, setGradCkpt] = useState(true);

  const sourceExperiments = useMemo(() => {
    if (dataMode === 'empty') return [];
    if (dataMode === 'few') return experiments;
    return multiplyData(experiments, 60);
  }, [dataMode, experiments]);

  const filteredExperiments = useMemo(() => {
    const q = listQuery.trim().toLowerCase();
    if (!q) return sourceExperiments;
    return sourceExperiments.filter(
      (e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
    );
  }, [experiments, listQuery]);

  const pageSize = 10;
  const listTotalPages = Math.max(1, Math.ceil(filteredExperiments.length / pageSize));
  const pagedExperiments = useMemo(() => {
    const start = (listPage - 1) * pageSize;
    return filteredExperiments.slice(start, start + pageSize);
  }, [filteredExperiments, listPage]);

  useEffect(() => {
    updateActiveTabLabel('Text generation');
  }, [updateActiveTabLabel]);

  useEffect(() => {
    setListPage(1);
  }, [listQuery, experiments.length]);

  const experimentDetail = useMemo(
    () => experiments.find((e) => e.id === detailId),
    [experiments, detailId]
  );

  const filteredModels = useMemo(() => {
    let m = MOCK_MODELS;
    if (modelListTab === 'base') m = m.filter((x) => x.badge === 'base');
    if (modelListTab === 'ft') m = m.filter((x) => x.badge === 'available');
    const q = modelSearch.trim().toLowerCase();
    if (q) m = m.filter((x) => x.title.toLowerCase().includes(q));
    return m;
  }, [modelListTab, modelSearch]);

  const pagedModels = useMemo(() => {
    const start = (modelPage - 1) * 6;
    return filteredModels.slice(start, start + 6);
  }, [filteredModels, modelPage]);

  const filteredTemplates = useMemo(() => {
    let t = MOCK_TEMPLATES;
    if (templateTab === 'multi') t = t.filter((_, i) => i % 3 === 0);
    if (templateTab === 'cpt') t = t.filter((_, i) => i % 2 === 0);
    if (templateTab === 'sft') t = t.filter((_, i) => i % 2 === 1);
    const q = templateSearch.trim().toLowerCase();
    if (q) t = t.filter((x) => x.title.toLowerCase().includes(q));
    return t;
  }, [templateTab, templateSearch]);

  const pagedTemplates = useMemo(() => {
    const start = (templatePage - 1) * 4;
    return filteredTemplates.slice(start, start + 4);
  }, [filteredTemplates, templatePage]);

  const filteredDatasets = useMemo(() => {
    let d = MOCK_DATASETS;
    const q = datasetSearch.trim().toLowerCase();
    if (datasetTab === 'thaki') d = d.filter((x) => x.title.startsWith('Thaki'));
    if (datasetTab === 'custom') d = d.filter((x) => x.title.startsWith('Custom'));
    if (datasetTab === 'textgen') d = d.filter((x) => x.title.toLowerCase().includes('gen'));
    if (datasetTab === 'tabular') d = d.filter((x) => x.title.toLowerCase().includes('tabular'));
    if (q) d = d.filter((x) => x.title.toLowerCase().includes(q));
    return d;
  }, [datasetTab, datasetSearch]);

  const pagedDatasets = useMemo(() => {
    const start = (datasetPage - 1) * 6;
    return filteredDatasets.slice(start, start + 6);
  }, [filteredDatasets, datasetPage]);

  const teacherModels = useMemo(() => {
    let m = MOCK_MODELS;
    if (teacherModelTab === 'base') m = m.filter((x) => x.badge === 'base');
    if (teacherModelTab === 'ft') m = m.filter((x) => x.badge === 'available');
    const q = teacherSearch.trim().toLowerCase();
    if (q) m = m.filter((x) => x.title.toLowerCase().includes(q));
    return m;
  }, [teacherModelTab, teacherSearch]);

  const pagedTeacherModels = useMemo(() => {
    const start = (teacherPage - 1) * 6;
    return teacherModels.slice(start, start + 6);
  }, [teacherModels, teacherPage]);

  const trainingModelOptions = [{ value: 'full-ft', label: 'Full fine-tuning' }];

  const configComplete =
    !!appliedTemplateId &&
    experimentName.trim().length > 0 &&
    experimentDesc.trim().length > 0 &&
    !!baseModelId;

  const publishComplete =
    !!publishMethod && datasetIds.length > 0 && !!trainingModel && !!teacherId && maxTrainSteps > 0;

  const canCreate = configComplete && publishComplete && wstep === 'publish';

  const goList = useCallback(
    () => patchParams({ view: null, id: null, panel: null, wstep: null }),
    [patchParams]
  );
  const goCreate = useCallback(
    () => patchParams({ view: 'create', wstep: 'configuration', id: null, panel: null }),
    [patchParams]
  );
  const goDetail = useCallback(
    (id: string) => patchParams({ view: 'detail', id, panel: 'details', wstep: null }),
    [patchParams]
  );

  const openRowMenu = useCallback(
    (row: ExperimentRow): ContextMenuItem[] => [
      {
        id: 'mlflow',
        label: 'Go to MLflow',
        onClick: () => {},
      },
      {
        id: 'cancel',
        label: 'Cancel',
        onClick: () => {},
      },
      {
        id: 'del',
        label: 'Delete',
        status: 'danger',
        divider: true,
        onClick: () => setExperiments((prev) => prev.filter((e) => e.id !== row.id)),
      },
    ],
    [goDetail]
  );

  const tableColumns: TableColumn<ExperimentRow>[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        width: fixedColumns.status,
        align: 'center',
        render: (_, row) => (
          <StatusIndicator status={statusToIndicator(row.status)} layout="icon-only" size="sm" />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        minWidth: columnMinWidths.name,
        render: (_, row) => (
          <button
            type="button"
            className="cursor-pointer truncate text-left text-body-md text-[var(--color-action-primary)] hover:underline"
            onClick={() => goDetail(row.id)}
          >
            {row.name}
          </button>
        ),
      },
      { key: 'method', label: 'Methods', minWidth: '100px' },
      { key: 'steps', label: 'Steps', minWidth: '72px' },
      {
        key: 'owner',
        label: 'Owner',
        minWidth: columnMinWidths.name,
        render: (v) => (
          <span
            className="block max-w-[140px] truncate text-body-md text-[var(--color-text-default)]"
            title={String(v)}
          >
            {String(v)}
          </span>
        ),
      },
      { key: 'duration', label: 'Duration', minWidth: '80px', align: 'right' },
      {
        key: 'createdAt',
        label: 'Created at',
        minWidth: columnMinWidths.createdAt,
        align: 'right',
        sortable: true,
        render: (v) => (
          <span className="text-body-md text-[var(--color-text-default)]">
            {formatListDate(String(v))}
          </span>
        ),
      },
      {
        key: 'completedAt',
        label: 'Completed at',
        minWidth: columnMinWidths.createdAt,
        align: 'right',
        render: (v) => (
          <span className="text-body-md text-[var(--color-text-default)]">
            {v === '—' ? '—' : formatListDate(String(v))}
          </span>
        ),
      },
      {
        key: 'actions',
        label: 'Action',
        width: fixedColumns.actions,
        align: 'center',
        render: (_, row) => (
          <ContextMenu items={openRowMenu(row)} trigger="click" align="right">
            <Button
              variant="ghost"
              size="sm"
              icon={<IconDotsCircleHorizontal size={14} />}
              aria-label="Row actions"
            />
          </ContextMenu>
        ),
      },
    ],
    [goDetail, openRowMenu]
  );

  const selectedTemplate = MOCK_TEMPLATES.find((t) => t.id === draftTemplateId);
  const templateApply = () => {
    if (draftTemplateId) setAppliedTemplateId(draftTemplateId);
    setTemplateDrawerOpen(false);
  };

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const listView = (
    <VStack gap={3}>
      <PageHeader
        title="Text generation"
        actions={
          <Button variant="primary" size="md" onClick={goCreate}>
            New experiments
          </Button>
        }
      />

      <MetricCard.Group>
        <MetricCard title="Completed" value="5" />
        <MetricCard title="Failed" value="0" />
        <MetricCard title="Running" value="5" />
        <MetricCard title="Pending" value="5" />
      </MetricCard.Group>

      <HStack gap={2} align="center">
        <SearchInput
          placeholder="Find experiments with filters"
          value={listQuery}
          onChange={(e) => setListQuery(e.target.value)}
          size="sm"
          className="w-[280px]"
        />
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconTrash size={12} />}
          disabled={selectedKeys.length === 0}
          onClick={() => setExperiments((prev) => prev.filter((e) => !selectedKeys.includes(e.id)))}
        >
          Delete
        </Button>
      </HStack>

      <Pagination
        currentPage={listPage}
        totalPages={listTotalPages}
        onPageChange={setListPage}
        totalItems={filteredExperiments.length}
        selectedCount={selectedKeys.length}
      />

      <Table
        columns={tableColumns}
        data={pagedExperiments}
        rowKey="id"
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyMessage={
          <div className="flex flex-col items-center gap-2 py-[88px]">
            <span className="text-label-lg text-[var(--color-text-default)]">
              No experiments registered
            </span>
            <span className="text-body-md text-[var(--color-text-muted)]">
              Create a new experiment to start training Text Generation models
            </span>
          </div>
        }
      />
    </VStack>
  );

  const detailView =
    experimentDetail == null ? (
      <EmptyState
        icon={<IconFlask size={48} stroke={1} />}
        title="Experiment not found"
        description="The experiment may have been removed or the link is invalid."
        action={
          <Button variant="primary" size="md" onClick={goList}>
            Back to list
          </Button>
        }
      />
    ) : (
      <VStack gap={4}>
        <DetailHeader>
          <DetailHeader.Title>{experimentDetail.name}</DetailHeader.Title>
          <p className="mb-3 text-body-md text-[var(--color-text-subtle)]">
            {experimentDetail.description}
          </p>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <StatusIndicator
                  status={statusToIndicator(experimentDetail.status)}
                  layout="badge"
                  label={statusBadgeLabel(experimentDetail.status)}
                />
              }
            />
            <DetailHeader.InfoCard label="Steps" value={experimentDetail.steps} />
            <DetailHeader.InfoCard
              label="Owner"
              value={
                <span className="truncate" title={experimentDetail.owner}>
                  {experimentDetail.owner.slice(0, 8)}…
                </span>
              }
            />
            <DetailHeader.InfoCard label="Duration" value={experimentDetail.duration} />
            <DetailHeader.InfoCard
              label="Created at"
              value={formatDetailStamp(experimentDetail.createdAt)}
            />
            <DetailHeader.InfoCard
              label="Completed at"
              value={
                experimentDetail.completedAt === '—'
                  ? '—'
                  : formatDetailStamp(experimentDetail.completedAt)
              }
            />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs
          value={panel}
          onChange={(v) => patchParams({ panel: v })}
          variant="underline"
          size="sm"
        >
          <TabList>
            <Tab value="details">Details</Tab>
            <Tab value="logs">Logs</Tab>
            <Tab value="monitoring">Monitoring</Tab>
          </TabList>

          <TabPanel value="details" className="pt-4">
            <VStack gap={4}>
              <SectionCard>
                <SectionCard.Header title="Model information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Total GPUs" value="STDIO" />
                  <SectionCard.DataRow label="Base Model" value="{Label}" />
                </SectionCard.Content>
              </SectionCard>

              <CapsuleTab
                items={[
                  { value: '1', label: 'Step 1' },
                  { value: '2', label: 'Step 2' },
                  { value: '3', label: 'Step 3' },
                ]}
                activeValue={detailCapsuleStep}
                onChange={(v) => setDetailCapsuleStep(v as '1' | '2' | '3')}
              />

              <SectionCard>
                <SectionCard.Header title="Training Blocks" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Method" value="SFT" />
                  <SectionCard.DataRow label="Dataset" value="{Label}" />
                  <SectionCard.DataRow label="Training Mode" value="Full finetuning" />
                  <SectionCard.DataRow label="Teacher" value="{Label}" />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Hyperparameters Settings" />
                <SectionCard.Content showDividers={false}>
                  <VStack gap={4}>
                    <NestedDisclosure title="Basic settings">
                      <VStack gap={0}>
                        <HyperDetailRow label="Training Duration" value="Max Steps" />
                        <HyperDetailRow label="Max Steps" value="3" />
                        <HyperDetailRow label="Learning Rate" value="0.000005" />
                        <HyperDetailRow label="Per Device Batch Size" value="2" />
                        <HyperDetailRow label="Gradient Accumulation Steps" value="4" />
                        <HyperDetailRow label="Max Sequence Length" value="124" />
                      </VStack>
                    </NestedDisclosure>
                    <NestedDisclosure title="Resource settings">
                      <VStack gap={0}>
                        <HyperDetailRow label="CPU" value="8" />
                        <HyperDetailRow label="Memory" value="32Gi" />
                        <HyperDetailRow label="Distributed Strategy" value="DDP" />
                      </VStack>
                    </NestedDisclosure>
                    <NestedDisclosure title="Advanced settings">
                      <VStack gap={0}>
                        <HyperDetailRow label="Warmup Steps" value="100" />
                        <HyperDetailRow label="LR Scheduler Type" value="Linear" />
                        <HyperDetailRow label="MLflow Experiment Name" value="Default" />
                      </VStack>
                    </NestedDisclosure>
                    <NestedDisclosure title="Early stopping settings">
                      <VStack gap={0}>
                        <HyperDetailRow label="Enable Early Stopping" value="on" />
                        <HyperDetailRow label="Patience" value="Linear" />
                        <HyperDetailRow label="Threshold" value="Default" />
                        <HyperDetailRow label="Evaluation Steps" value="Default" />
                        <HyperDetailRow label="Evaluation Dataset Path" value="Default" />
                      </VStack>
                    </NestedDisclosure>
                    <NestedDisclosure title="Expert settings">
                      <VStack gap={0}>
                        <HyperDetailRow label="Logging Steps" value="{label}" />
                        <HyperDetailRow label="Number of Nodes" value="{label}" />
                        <HyperDetailRow
                          label="Precision"
                          value="DDP (Data Parallel)FSDP (Fully Sharded)"
                        />
                        <HyperDetailRow label="Gradient Checkpointing" value="On" />
                      </VStack>
                    </NestedDisclosure>
                  </VStack>
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          <TabPanel value="logs" className="pt-4">
            <VStack gap={3}>
              <div>
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">Logs</h3>
                <p className="mt-1 text-body-md text-[var(--color-text-subtle)]">
                  Step {detailCapsuleStep} · Pod textgen-trainer-7f8c9
                </p>
              </div>
              <HStack gap={2} align="center">
                <SearchInput
                  placeholder="Search logs"
                  value={logQuery}
                  onChange={(e) => setLogQuery(e.target.value)}
                  size="sm"
                  className="max-w-[280px]"
                />
                <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
                  Refresh
                </Button>
              </HStack>
              <div
                className="h-[564px] overflow-auto rounded-[var(--radius-md)] bg-[var(--color-surface-inverse)] p-4"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <pre className="m-0 whitespace-pre-wrap text-body-sm text-[var(--color-text-inverse)]">
                  {TEXT_PREVIEW_LINES.filter((l) =>
                    logQuery.trim() ? l.toLowerCase().includes(logQuery.trim().toLowerCase()) : true
                  ).join('\n')}
                </pre>
              </div>
              <p className="text-body-sm text-[var(--color-text-subtle)]">
                Automatically refreshes every 3 seconds.
              </p>
            </VStack>
          </TabPanel>

          <TabPanel value="monitoring" className="pt-4">
            <VStack gap={3}>
              <HStack justify="between" align="center">
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                  Training metrics monitoring
                </h3>
                <HStack gap={1} align="center">
                  <Checkbox
                    label="Auto Refresh (10s)"
                    checked={monitoringAuto}
                    onChange={(c) => setMonitoringAuto(c)}
                  />
                  <Button variant="outline" size="sm">
                    Refresh
                  </Button>
                </HStack>
              </HStack>

              <div className="flex gap-6 min-h-[600px]">
                <div className="w-[312px] shrink-0 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 pt-3 pb-4 self-stretch">
                  <VStack gap={2}>
                    <span className="text-heading-h5 text-[var(--color-text-default)]">
                      Select blocks
                    </span>
                    <span className="text-body-md text-[var(--color-text-subtle)]">
                      Select up to 10 blocks
                    </span>
                  </VStack>
                  <VStack gap={3} className="mt-6">
                    {/* Block 1 */}
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex items-center gap-1 ${monitoringExpanded.b1 ? 'rounded-t-[var(--radius-md)]' : 'rounded-[var(--radius-md)]'} border border-[var(--color-border-default)] px-3 py-2 min-h-[40px]`}
                      >
                        <VStack gap={0.5}>
                          <HStack gap={1} align="center">
                            <button
                              type="button"
                              className="flex items-center justify-center"
                              onClick={() => setMonitoringExpanded((s) => ({ ...s, b1: !s.b1 }))}
                            >
                              {monitoringExpanded.b1 ? (
                                <IconChevronDown
                                  size={12}
                                  className="text-[var(--color-text-default)]"
                                />
                              ) : (
                                <IconChevronRight
                                  size={12}
                                  className="text-[var(--color-text-default)]"
                                />
                              )}
                            </button>
                            <Checkbox
                              checked={monitoringBlocks.b1}
                              onChange={(c) =>
                                setMonitoringBlocks((s) => ({
                                  ...s,
                                  b1: c,
                                  b1s1: c ? s.b1s1 : false,
                                  b1s2: c ? s.b1s2 : false,
                                }))
                              }
                            />
                            <span className="text-body-md text-[var(--color-text-default)]">
                              Lable
                            </span>
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          </HStack>
                          <span className="text-body-sm text-[var(--color-text-subtle)] ml-[36px]">
                            Lable
                          </span>
                        </VStack>
                      </div>
                      {monitoringExpanded.b1 && (
                        <div className="rounded-b-[var(--radius-md)] border-b border-l border-r border-[var(--color-border-default)] px-8 py-2">
                          <HStack gap={1} align="center">
                            <Checkbox
                              checked={monitoringBlocks.b1s1}
                              onChange={(c) =>
                                setMonitoringBlocks((s) => ({ ...s, b1s1: c, b1: c || s.b1s2 }))
                              }
                            />
                            <span className="text-body-md text-[var(--color-text-default)]">
                              Lable
                            </span>
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          </HStack>
                        </div>
                      )}
                    </div>
                    {/* Block 2 */}
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex items-center gap-1 ${monitoringExpanded.b2 ? 'rounded-t-[var(--radius-md)]' : 'rounded-[var(--radius-md)]'} border border-[var(--color-border-default)] px-3 py-2 min-h-[40px]`}
                      >
                        <VStack gap={0.5}>
                          <HStack gap={1} align="center">
                            <button
                              type="button"
                              className="flex items-center justify-center"
                              onClick={() => setMonitoringExpanded((s) => ({ ...s, b2: !s.b2 }))}
                            >
                              {monitoringExpanded.b2 ? (
                                <IconChevronDown
                                  size={12}
                                  className="text-[var(--color-text-default)]"
                                />
                              ) : (
                                <IconChevronRight
                                  size={12}
                                  className="text-[var(--color-text-default)]"
                                />
                              )}
                            </button>
                            <Checkbox
                              checked={monitoringBlocks.b2}
                              onChange={(c) =>
                                setMonitoringBlocks((s) => ({
                                  ...s,
                                  b2: c,
                                  b2s1: c ? s.b2s1 : false,
                                }))
                              }
                            />
                            <span className="text-body-md text-[var(--color-text-default)]">
                              Lable
                            </span>
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          </HStack>
                          <span className="text-body-sm text-[var(--color-text-subtle)] ml-[36px]">
                            Lable
                          </span>
                        </VStack>
                      </div>
                      {monitoringExpanded.b2 && (
                        <div className="rounded-b-[var(--radius-md)] border-b border-l border-r border-[var(--color-border-default)] px-8 py-2">
                          <HStack gap={1} align="center">
                            <Checkbox
                              checked={monitoringBlocks.b2s1}
                              onChange={(c) =>
                                setMonitoringBlocks((s) => ({ ...s, b2s1: c, b2: c }))
                              }
                            />
                            <span className="text-body-md text-[var(--color-text-default)]">
                              Lable
                            </span>
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          </HStack>
                        </div>
                      )}
                    </div>
                    {/* Block 3 */}
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex items-center gap-1 ${monitoringExpanded.b3 ? 'rounded-t-[var(--radius-md)]' : 'rounded-[var(--radius-md)]'} border border-[var(--color-border-default)] px-3 py-2 min-h-[40px]`}
                      >
                        <VStack gap={0.5}>
                          <HStack gap={1} align="center">
                            <button
                              type="button"
                              className="flex items-center justify-center"
                              onClick={() => setMonitoringExpanded((s) => ({ ...s, b3: !s.b3 }))}
                            >
                              {monitoringExpanded.b3 ? (
                                <IconChevronDown
                                  size={12}
                                  className="text-[var(--color-text-default)]"
                                />
                              ) : (
                                <IconChevronRight
                                  size={12}
                                  className="text-[var(--color-text-default)]"
                                />
                              )}
                            </button>
                            <Checkbox checked={false} onChange={() => {}} />
                            <span className="text-body-md text-[var(--color-text-default)]">
                              Lable
                            </span>
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          </HStack>
                          <span className="text-body-sm text-[var(--color-text-subtle)] ml-[36px]">
                            Lable
                          </span>
                        </VStack>
                      </div>
                    </div>
                  </VStack>
                </div>

                <div className="flex-1 flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] self-stretch">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="text-[14px] font-medium leading-[20px] text-[var(--color-text-default)]">
                      Select blocks to view training metrics
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)] whitespace-pre-line">
                      {`Expand experiments and select training blocks to visualize metrics\nsuch as loss and learning rate.\nYou can compare up to 10 blocks at once.`}
                    </span>
                  </div>
                </div>
              </div>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    );

  const configurationSection = (
    <VStack gap={4}>
      <SectionCard>
        <SectionCard.Header
          title="Basic information"
          actions={
            <Button variant="primary" size="sm" onClick={() => setTemplateDrawerOpen(true)}>
              Select template
            </Button>
          }
        />
        <SectionCard.Content>
          <VStack gap={4}>
            <FormField label="Experiment name" required>
              <Input
                placeholder="Enter a name for this experiment"
                value={experimentName}
                onChange={(e) => setExperimentName(e.target.value)}
                fullWidth
              />
            </FormField>
            <FormField label="Description" required>
              <Textarea
                placeholder="Add a description"
                value={experimentDesc}
                onChange={(e) => setExperimentDesc(e.target.value)}
                fullWidth
                className="min-h-[70px]"
              />
            </FormField>
          </VStack>
        </SectionCard.Content>
      </SectionCard>

      <SectionCard>
        <SectionCard.Header title="Model information" />
        <SectionCard.Content>
          <VStack gap={4}>
            <FormField
              label="Total GPUs"
              required
              description="Select the number of GPUs for training"
            >
              <HStack gap={3} align="center">
                <Slider min={0} max={5} step={1} value={totalGpus} onChange={setTotalGpus} />
                <span className="text-body-md text-[var(--color-text-default)]">{totalGpus}/5</span>
              </HStack>
            </FormField>
            <FormField label="Base model" required description="Click to select a base model">
              <VStack gap={3}>
                <SearchInput
                  placeholder="Find models"
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  size="sm"
                  className="w-[312px]"
                />
                <Pagination
                  currentPage={modelPage}
                  totalPages={Math.max(1, Math.ceil(filteredModels.length / 6))}
                  onPageChange={setModelPage}
                  totalItems={filteredModels.length}
                />
                <Tabs value={modelListTab} onChange={setModelListTab} variant="underline" size="sm">
                  <TabList>
                    <Tab value="all">All</Tab>
                    <Tab value="base">Base Models</Tab>
                    <Tab value="ft">Fine-tuning Models</Tab>
                  </TabList>
                </Tabs>
                <div className="grid grid-cols-3 gap-3">
                  {pagedModels.map((m) => (
                    <ModelPickerCard
                      key={m.id}
                      model={m}
                      selected={baseModelId === m.id}
                      onSelect={() => setBaseModelId(m.id)}
                    />
                  ))}
                </div>
              </VStack>
            </FormField>
          </VStack>
        </SectionCard.Content>
      </SectionCard>

      <HStack justify="end">
        <Button
          variant="primary"
          size="md"
          onClick={() => patchParams({ wstep: 'publish' })}
          disabled={!configComplete}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );

  const publishHyperparameters = (
    <Disclosure>
      <Disclosure.Trigger>Hyperparameters settings</Disclosure.Trigger>
      <Disclosure.Panel>
        <VStack gap={4} className="mt-2">
          <NestedDisclosure title="Basic">
            <VStack gap={3}>
              <FormField label="Training duration" spacing="loose">
                <RadioGroup
                  name="dur"
                  value={durationMode}
                  onChange={(v) => setDurationMode(v as 'steps' | 'epochs')}
                  direction="horizontal"
                >
                  <Radio value="steps" label="Max Steps" />
                  <Radio value="epochs" label="Epochs" />
                </RadioGroup>
              </FormField>
              <FormField label="Max Steps" required>
                <NumberInput
                  min={1}
                  max={100000}
                  value={maxTrainSteps}
                  onChange={setMaxTrainSteps}
                  width="xs"
                />
              </FormField>
              <FormField label="Learning rate" required>
                <NumberInput
                  min={0}
                  max={0.01}
                  step={0.000001}
                  value={learningRate}
                  onChange={setLearningRate}
                  width="sm"
                />
              </FormField>
              <FormField label="Per Device Batch Size" required>
                <NumberInput
                  min={1}
                  max={128}
                  value={perDeviceBatch}
                  onChange={setPerDeviceBatch}
                  width="xs"
                />
              </FormField>
              <FormField label="Gradient Accumulation Steps" required>
                <NumberInput
                  min={1}
                  max={64}
                  value={gradAccum}
                  onChange={setGradAccum}
                  width="xs"
                />
              </FormField>
              <FormField label="Max Sequence Length" required>
                <NumberInput
                  min={32}
                  max={8192}
                  value={maxSeqLen}
                  onChange={setMaxSeqLen}
                  width="sm"
                />
              </FormField>
            </VStack>
          </NestedDisclosure>
          <NestedDisclosure title="Resource">
            <VStack gap={3}>
              <FormField label="CPU" required>
                <NumberInput min={1} max={128} value={resCpu} onChange={setResCpu} width="xs" />
              </FormField>
              <FormField label="Memory (GiB)" required>
                <NumberInput min={1} max={512} value={resMem} onChange={setResMem} width="xs" />
              </FormField>
              <FormField label="Distributed Strategy" required>
                <Select
                  options={[
                    { value: 'ddp', label: 'DDP' },
                    { value: 'fsdp', label: 'FSDP' },
                  ]}
                  value={distStrategy}
                  onChange={setDistStrategy}
                  className="w-[328px]"
                />
              </FormField>
            </VStack>
          </NestedDisclosure>
          <NestedDisclosure title="Advanced">
            <VStack gap={3}>
              <FormField label="Warmup Steps" required>
                <NumberInput
                  min={0}
                  max={10000}
                  value={warmupSteps}
                  onChange={setWarmupSteps}
                  width="xs"
                />
              </FormField>
              <FormField label="LR Scheduler Type" required>
                <Select
                  options={[
                    { value: 'linear', label: 'Linear' },
                    { value: 'cosine', label: 'Cosine' },
                  ]}
                  value={lrScheduler}
                  onChange={setLrScheduler}
                  className="w-[328px]"
                />
              </FormField>
              <FormField label="MLFlow Experiment Name" required>
                <Input
                  value={mlflowName}
                  onChange={(e) => setMlflowName(e.target.value)}
                  fullWidth
                />
              </FormField>
            </VStack>
          </NestedDisclosure>
          <NestedDisclosure title="Early stopping">
            <VStack gap={3}>
              <FormField label="Enable" spacing="loose">
                <Toggle checked={earlyStop} onChange={setEarlyStop} />
              </FormField>
              <FormField label="Patience" required>
                <Select
                  options={[
                    { value: 'linear', label: 'Linear' },
                    { value: 'constant', label: 'Constant' },
                  ]}
                  value={patience}
                  onChange={setPatience}
                  className="w-[328px]"
                />
              </FormField>
              <FormField label="Threshold" required>
                <Input value={threshold} onChange={(e) => setThreshold(e.target.value)} fullWidth />
              </FormField>
              <FormField label="Evaluation Metric" required>
                <Select
                  options={[
                    { value: 'loss', label: 'Loss' },
                    { value: 'accuracy', label: 'Accuracy' },
                  ]}
                  value={evalMetric}
                  onChange={setEvalMetric}
                  className="w-[328px]"
                />
              </FormField>
              <FormField label="Evaluation Dataset Path" required>
                <Input value={evalPath} onChange={(e) => setEvalPath(e.target.value)} fullWidth />
                <InlineMessage variant="info" className="mt-2">
                  Use a path readable by the training cluster. Default eval bundles are mounted
                  under /datasets/eval.
                </InlineMessage>
              </FormField>
            </VStack>
          </NestedDisclosure>
          <NestedDisclosure title="Expert">
            <VStack gap={3}>
              <FormField label="Logging Steps" required>
                <NumberInput
                  min={1}
                  max={1000}
                  value={logSteps}
                  onChange={setLogSteps}
                  width="xs"
                />
              </FormField>
              <FormField label="Number of Nodes" required>
                <NumberInput min={1} max={32} value={numNodes} onChange={setNumNodes} width="xs" />
              </FormField>
              <FormField label="Precision" required>
                <Select
                  options={[
                    { value: 'bf16', label: 'bfloat16' },
                    { value: 'fp16', label: 'float16' },
                  ]}
                  value={precision}
                  onChange={setPrecision}
                  className="w-[328px]"
                />
              </FormField>
              <FormField label="Gradient Checkpointing" spacing="loose">
                <Toggle checked={gradCkpt} onChange={setGradCkpt} />
              </FormField>
            </VStack>
          </NestedDisclosure>
        </VStack>
      </Disclosure.Panel>
    </Disclosure>
  );

  const [activeStep, setActiveStep] = useState(0);
  const [pipelineSteps, setPipelineSteps] = useState(['Step 1', 'Step 2']);

  const publishSection = (
    <VStack gap={6}>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 pt-3 pb-3">
        <VStack gap={2}>
          <h3 className="text-heading-h5 text-[var(--color-text-default)]">Training settings</h3>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Configure the training blocks for your fine-tuning pipeline. Each block will be executed
            sequentially.
          </p>
        </VStack>

        <div className="flex mt-6">
          <div className="w-[80px] shrink-0 flex flex-col">
            {pipelineSteps.map((step, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`flex items-center justify-between min-w-[80px] p-2 text-label-md border-l border-[var(--color-border-default)] ${
                  i === activeStep
                    ? 'bg-[var(--color-surface-subtle)] border-t border-b rounded-tl-[var(--radius-sm)] text-[var(--color-action-primary)]'
                    : 'border-b text-[var(--color-text-subtle)]'
                } ${i === 0 && i !== activeStep ? 'rounded-tl-[var(--radius-sm)]' : ''} ${i === pipelineSteps.length - 1 && i !== activeStep ? 'rounded-bl-[var(--radius-sm)]' : ''}`}
              >
                <span>{step}</span>
                <IconX size={12} className="shrink-0" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPipelineSteps((s) => [...s, `Step ${s.length + 1}`])}
              className="flex items-center gap-1 pl-1 mt-2 text-label-md text-[var(--color-text-subtle)]"
            >
              <IconPlus size={12} />
              <span>Add</span>
            </button>
          </div>

          <div className="min-w-0 flex-1 rounded-r-[var(--radius-lg)] border border-[var(--color-border-default)] p-3">
            <VStack gap={6}>
              <FormField label="Method" required>
                <Select
                  options={METHOD_OPTIONS}
                  value={publishMethod}
                  onChange={setPublishMethod}
                  className="w-[328px]"
                />
              </FormField>

              <FormField label="Dataset" required>
                <VStack gap={3}>
                  <Tabs value={datasetTab} onChange={setDatasetTab} variant="underline" size="sm">
                    <TabList>
                      <Tab value="all">All</Tab>
                      <Tab value="thaki">Thaki Datasets</Tab>
                      <Tab value="custom">Custom Datasets</Tab>
                      <Tab value="textgen">Text generation</Tab>
                      <Tab value="tabular">Tabular</Tab>
                    </TabList>
                  </Tabs>
                  <SearchInput
                    placeholder="Find datasets"
                    value={datasetSearch}
                    onChange={(e) => setDatasetSearch(e.target.value)}
                    size="sm"
                    className="w-[312px]"
                  />
                  <Pagination
                    currentPage={datasetPage}
                    totalPages={Math.max(1, Math.ceil(filteredDatasets.length / 6))}
                    onPageChange={setDatasetPage}
                    totalItems={filteredDatasets.length}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    {pagedDatasets.map((d) => (
                      <DatasetPickerCard
                        key={d.id}
                        item={d}
                        selected={datasetIds.includes(d.id)}
                        onSelect={() =>
                          setDatasetIds((prev) =>
                            prev.includes(d.id) ? prev.filter((id) => id !== d.id) : [...prev, d.id]
                          )
                        }
                      />
                    ))}
                  </div>
                </VStack>
              </FormField>

              <FormField label="Training model" required>
                <Select
                  options={trainingModelOptions}
                  value={trainingModel}
                  onChange={setTrainingModel}
                  className="w-[328px]"
                />
              </FormField>

              <FormField label="Teacher" required>
                <VStack gap={3}>
                  <SearchInput
                    placeholder="Find models"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    size="sm"
                    className="w-[312px]"
                  />
                  <Pagination
                    currentPage={teacherPage}
                    totalPages={Math.max(1, Math.ceil(teacherModels.length / 6))}
                    onPageChange={setTeacherPage}
                    totalItems={teacherModels.length}
                  />
                  <Tabs
                    value={teacherModelTab}
                    onChange={setTeacherModelTab}
                    variant="underline"
                    size="sm"
                  >
                    <TabList>
                      <Tab value="all">All</Tab>
                      <Tab value="base">Base Models</Tab>
                      <Tab value="ft">Fine-tuning Models</Tab>
                    </TabList>
                  </Tabs>
                  <div className="grid grid-cols-3 gap-3">
                    {pagedTeacherModels.map((m) => (
                      <ModelPickerCard
                        key={m.id}
                        model={m}
                        selected={teacherId === m.id}
                        onSelect={() => setTeacherId(m.id)}
                      />
                    ))}
                  </div>
                </VStack>
              </FormField>

              {publishHyperparameters}
            </VStack>
          </div>
        </div>
      </div>

      <HStack justify="end">
        <Button variant="primary" size="md" disabled={!publishComplete}>
          Next
        </Button>
      </HStack>
    </VStack>
  );

  const summarySections: FloatingCardSection[] = useMemo(
    () => [
      {
        tabTitle: 'Configuration',
        collapsible: true,
        defaultExpanded: true,
        items: [
          {
            id: 'basic',
            title: 'Basic information',
            status: experimentName && experimentDesc ? 'success' : 'processing',
          },
          {
            id: 'model',
            title: 'Model information',
            status: baseModelId ? 'success' : 'processing',
          },
        ],
      },
      {
        tabTitle: 'Publish',
        collapsible: true,
        defaultExpanded: false,
        items: [
          {
            id: 'training',
            title: 'Training settings',
            status: publishComplete ? 'success' : 'processing',
          },
        ],
      },
    ],
    [experimentName, experimentDesc, baseModelId, publishComplete]
  );

  const summaryAside = (
    <FloatingCard
      title="Summary"
      sections={summarySections}
      cancelLabel="Cancel"
      actionLabel="Create"
      actionEnabled={canCreate}
      onCancel={goList}
      onAction={() => {
        const id = `exp-${crypto.randomUUID().slice(0, 8)}`;
        setExperiments((prev) => [
          {
            id,
            status: 'pending',
            name: experimentName || 'new-experiment',
            method: publishMethod,
            steps: '0/1',
            owner: '00000000-0000-0000-0000-000000000001',
            duration: '—',
            createdAt: new Date().toISOString(),
            completedAt: '—',
            description: experimentDesc,
          },
          ...prev,
        ]);
        goList();
      }}
      portal={false}
      width="312px"
    />
  );

  const createView = (
    <VStack gap={4}>
      <PageHeader title="New experiments" />
      <div className="flex w-full items-start gap-6">
        <div className="min-w-0 flex-1">
          <Tabs
            value={wstep}
            onChange={(v) => patchParams({ wstep: v })}
            variant="underline"
            size="sm"
          >
            <TabList>
              <Tab value="configuration">Configuration</Tab>
              <Tab value="publish">Publish</Tab>
            </TabList>
            <TabPanel value="configuration" className="pt-4">
              {configurationSection}
            </TabPanel>
            <TabPanel value="publish" className="pt-4">
              {publishSection}
            </TabPanel>
          </Tabs>
        </div>
        {summaryAside}
      </div>
    </VStack>
  );

  const templateTotalPages = Math.max(1, Math.ceil(filteredTemplates.length / 4));

  return (
    <>
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
                items={
                  view === 'detail' && experimentDetail
                    ? [
                        { label: 'ML Studio' },
                        { label: 'Text generation', href: LIST_PATH },
                        { label: experimentDetail.name },
                      ]
                    : view === 'create'
                      ? [
                          { label: 'ML Studio' },
                          { label: 'Text generation', href: LIST_PATH },
                          { label: 'New experiments' },
                        ]
                      : [{ label: 'ML Studio' }, { label: 'Text generation' }]
                }
              />
            }
            actions={<AiPlatformTopBarActions />}
          />
        }
        contentClassName="pt-4 px-8 pb-20"
      >
        {view === 'list' && listView}
        {view === 'detail' && detailView}
        {view === 'create' && createView}
        <DataTestToolbar mode={dataMode} onChange={setDataMode} />
      </PageShell>

      <Drawer
        isOpen={templateDrawerOpen}
        onClose={() => setTemplateDrawerOpen(false)}
        title="Select template"
        description="Select an agent to connect with the selected data."
        width={480}
        footer={
          <HStack gap={2} className="w-full">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => setTemplateDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              disabled={!draftTemplateId}
              onClick={templateApply}
            >
              Apply
            </Button>
          </HStack>
        }
      >
        <VStack gap={4}>
          <Tabs value={templateTab} onChange={setTemplateTab} variant="underline" size="sm">
            <TabList>
              <Tab value="all">All</Tab>
              <Tab value="multi">Multi-Step</Tab>
              <Tab value="cpt">CPT</Tab>
              <Tab value="sft">SFT</Tab>
            </TabList>
          </Tabs>
          <SearchInput
            placeholder="Find template"
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
            size="sm"
            fullWidth
          />
          <Pagination
            currentPage={templatePage}
            totalPages={templateTotalPages}
            onPageChange={setTemplatePage}
            totalItems={filteredTemplates.length}
          />
          <div className="grid grid-cols-2 gap-3">
            {pagedTemplates.map((t) => (
              <ModelPickerCard
                key={t.id}
                model={t}
                selected={draftTemplateId === t.id}
                onSelect={() => setDraftTemplateId(t.id)}
              />
            ))}
          </div>
          {selectedTemplate && (
            <div className="flex flex-wrap gap-2 border-t border-[var(--color-border-subtle)] pt-3">
              <Chip value={selectedTemplate.title} onRemove={() => setDraftTemplateId(null)} />
            </div>
          )}
        </VStack>
      </Drawer>
    </>
  );
}

export default TextGenerationPage;
