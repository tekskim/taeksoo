import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  PageShell,
  PageHeader,
  SearchInput,
  Pagination,
  Tooltip,
  EmptyState,
  Drawer,
  FormField,
  Input,
  Textarea,
  Checkbox,
  SectionCard,
  Table,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconInfoCircle,
  IconDownload,
  IconDatabase,
  IconUpload,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DatasetItem {
  id: string;
  name: string;
  description: string;
  source: 'thaki' | 'custom';
  category: 'text-generation' | 'tabular';
  visibility: 'public' | 'private';
  tags: string[];
  downloads: number;
  language: string;
  size: string;
  rows: string;
  license: string;
  files: number;
  supportedMethods: string[];
  features: string[];
  sourceUrl: string;
  dataSplits: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface DatasetRow {
  id: string;
  recordId: string;
  customerSegment: string;
  networkType: string;
  signalStrength: string;
  region: string;
  score: string;
  label: string;
  notes: string;
}

type DataSubView = 'table' | 'text' | 'chat';

const UPLOAD_BODY =
  'Upload a dataset file to create a dataset resource that can be used for training, evaluation, or inference workloads';

const ITEMS_PER_PAGE = 12;

const CAPSULE_ITEMS = [
  { value: 'all', label: 'All' },
  { value: 'text-generation', label: 'Text generation' },
  { value: 'tabular', label: 'Tabular' },
] as const;

const CATEGORY_KEYS = ['llm', 'tabular', 'other'] as const;
const METHOD_KEYS = ['sft', 'grpo', 'cpt', 'dpo', 'gkd', 'rhf', 'pretrain', 'rag'] as const;

/* ----------------------------------------
   Mock data — 6 datasets (2 custom + Thaki)
   ---------------------------------------- */

const MOCK_DATASETS: DatasetItem[] = [
  {
    id: 'ds-1',
    name: 'lively-sunset-6041',
    description:
      'Customer support transcripts normalized for multilingual SFT. Includes escalation labels and masked PII placeholders for safe experimentation.',
    source: 'custom',
    category: 'text-generation',
    visibility: 'private',
    tags: ['support'],
    downloads: 0,
    language: 'ENG',
    size: '234.2 MB',
    rows: '12,400',
    license: 'custom',
    files: 1,
    supportedMethods: ['sft', 'grpo', 'gkd'],
    features: ['record_id', 'customer_segment', 'network_type', 'signal_strength'],
    sourceUrl: 'https://github.com/ThakiCloud/llm-dataset-forge',
    dataSplits: 'train 620 examples',
    type: 'CSV',
    createdAt: 'Nov 11, 2025, 2:51 PM',
    updatedAt: 'Nov 11, 2025, 2:51 PM',
  },
  {
    id: 'ds-2',
    name: 'customer-churn-v2',
    description:
      'Tabular churn dataset with enriched billing features and staged labels for benchmarking gradient-boosted and deep tabular models.',
    source: 'custom',
    category: 'tabular',
    visibility: 'public',
    tags: ['churn'],
    downloads: 48,
    language: 'ENG',
    size: '86.4 MB',
    rows: '502,881',
    license: 'cc-by-4.0',
    files: 3,
    supportedMethods: ['sft'],
    features: ['account_id', 'tenure_months', 'charges', 'segment'],
    sourceUrl: 'https://example.com/churn-v2',
    dataSplits: 'train 400k · val 50k · test 53k',
    type: 'Parquet',
    createdAt: 'Oct 02, 2025, 9:14 AM',
    updatedAt: 'Oct 29, 2025, 11:03 AM',
  },
  {
    id: 'ds-3',
    name: 'opencode-reasoning-sft',
    description:
      'Large-scale code reasoning corpus with chain-of-thought rationales spanning algorithmic puzzles, refactoring, and vulnerability triage prompts.',
    source: 'thaki',
    category: 'text-generation',
    visibility: 'public',
    tags: [],
    downloads: 3304,
    language: 'ENG',
    size: '7.1 MB',
    rows: '~49k',
    license: 'mit',
    files: 1,
    supportedMethods: ['sft', 'grpo', 'gkd'],
    features: ['source', 'task', 'input', 'output', 'difficulty'],
    sourceUrl: 'https://hf.co/datasets/OpenCodeReasoning',
    dataSplits: 'train 42k · eval 7k',
    type: 'JSONL',
    createdAt: 'Sep 01, 2025, 10:22 AM',
    updatedAt: 'Sep 01, 2025, 10:22 AM',
  },
  {
    id: 'ds-4',
    name: 'ace-math-distilled',
    description:
      'Mathematical reasoning traces distilled from AceReason pipelines with verifier-aligned step annotations for tighter policy optimization.',
    source: 'thaki',
    category: 'text-generation',
    visibility: 'public',
    tags: [],
    downloads: 972,
    language: 'ENG',
    size: '14 MB',
    rows: '49,585',
    license: 'apache-2.0',
    files: 1,
    supportedMethods: ['sft'],
    features: ['messages', 'metadata'],
    sourceUrl: 'https://nvidia.example/ace-reason/math',
    dataSplits: 'train full',
    type: 'JSONL',
    createdAt: 'Aug 21, 2025, 3:41 PM',
    updatedAt: 'Aug 21, 2025, 3:41 PM',
  },
  {
    id: 'ds-5',
    name: 'ultrafeedback-mini',
    description:
      'Curated UltraFeedback shard for pairwise preference pilots and smaller GPU budgets. Mirrors schema of the binarized corpus at reduced scale.',
    source: 'thaki',
    category: 'text-generation',
    visibility: 'public',
    tags: [],
    downloads: 12840,
    language: 'ENG',
    size: '458 MB',
    rows: '61.1k',
    license: 'mit',
    files: 1,
    supportedMethods: ['dpo', 'grpo'],
    features: ['prompt', 'chosen', 'rejected', 'score'],
    sourceUrl: 'https://hf.co/datasets/HuggingFaceH4/ultrafeedback_binarized',
    dataSplits: 'train 61.1k',
    type: 'Parquet',
    createdAt: 'Jul 15, 2025, 8:00 AM',
    updatedAt: 'Jul 15, 2025, 8:00 AM',
  },
  {
    id: 'ds-6',
    name: 'tabular-rf-signals',
    description:
      'RF drive-test measurements with tower IDs, RSRP, and throughput for tabular foundation experiments (TMB-style row schema).',
    source: 'thaki',
    category: 'tabular',
    visibility: 'public',
    tags: [],
    downloads: 214,
    language: 'KOR',
    size: '1.2 GB',
    rows: '2.1M',
    license: 'odc-by',
    files: 5,
    supportedMethods: ['sft', 'gkd'],
    features: ['site_id', 'band', 'rsrp', 'throughput_mbps'],
    sourceUrl: 'https://example.com/rf-signals',
    dataSplits: 'train 1.8M · test 300k',
    type: 'CSV',
    createdAt: 'Jun 03, 2025, 1:05 PM',
    updatedAt: 'Jun 03, 2025, 1:05 PM',
  },
];

const MOCK_TABLE_ROWS: DatasetRow[] = [
  {
    id: 'r1',
    recordId: 'rec-9821-a',
    customerSegment: 'enterprise',
    networkType: '5G NSA',
    signalStrength: '-78 dBm',
    region: 'ap-northeast-2',
    score: '0.94',
    label: 'retain',
    notes: 'evening spike',
  },
  {
    id: 'r2',
    recordId: 'rec-1120-b',
    customerSegment: 'smb',
    networkType: 'LTE',
    signalStrength: '-92 dBm',
    region: 'us-east-1',
    score: '0.41',
    label: 'churn',
    notes: 'support ticket churn',
  },
  {
    id: 'r3',
    recordId: 'rec-4401-c',
    customerSegment: 'consumer',
    networkType: '5G SA',
    signalStrength: '-71 dBm',
    region: 'eu-central-1',
    score: '0.88',
    label: 'retain',
    notes: 'stable',
  },
];

const SAMPLE_TEXT_PREVIEW = `# Row 9821
instruction: Summarize escalation policy for outage SEV2
response: Owners must acknowledge pager within 5 minutes and open a Zoom bridge...
metadata: {\"locale\":\"en-US\",\"confidence\":0.97}`;

/* ----------------------------------------
   Capsule tabs (Models page pattern)
   ---------------------------------------- */

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
    <div className="inline-flex items-center gap-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-1 w-fit">
      {items.map((item) => {
        const isActive = item.value === activeValue;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`px-2.5 py-1 rounded-[var(--radius-md)] text-label-md min-w-[60px] text-center transition-colors ${
              isActive
                ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
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

/* ----------------------------------------
   Tag badge — visibility + category + optional TMB
   ---------------------------------------- */

function DatasetTagBadges({ item }: { item: DatasetItem }) {
  const catLabel = item.category === 'tabular' ? 'Tabular' : 'Text generation';
  return (
    <div className="flex flex-wrap gap-1">
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] bg-[var(--color-state-success-bg)] text-[var(--color-state-success)] text-label-sm">
        {item.visibility === 'public' ? 'Public' : 'Private'}
      </span>
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] text-label-sm">
        {catLabel}
      </span>
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] text-label-sm">
        {item.size}
      </span>
    </div>
  );
}

/* ----------------------------------------
   Dataset card
   ---------------------------------------- */

function DatasetCard({
  item,
  onOpenDetail,
  onEdit,
}: {
  item: DatasetItem;
  onOpenDetail: (d: DatasetItem) => void;
  onEdit: (d: DatasetItem) => void;
}) {
  const isCustom = item.source === 'custom';

  return (
    <div className="bg-[var(--color-surface-default)] rounded-[6px] border border-[var(--color-border-default)] px-4 py-3 flex flex-col gap-3">
      {/* Title + Description + Tags */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className="text-left"
            onClick={() => onOpenDetail(item)}
            aria-label={`Open dataset ${item.name}`}
          >
            <span className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-default)] hover:text-[var(--color-action-primary)]">
              {item.name}
            </span>
          </button>
          <p className="text-body-md text-[var(--color-text-subtle)] line-clamp-2">
            {item.description}
          </p>
        </div>
        <DatasetTagBadges item={item} />
      </div>

      {/* Metadata — Download · Language */}
      <div className="flex items-center gap-2">
        <span className="text-label-sm text-[var(--color-text-subtle)]">Download</span>
        <span className="text-label-sm text-[var(--color-text-subtle)]">
          {String(item.downloads).padStart(2, '0')}
        </span>
        <span className="w-px h-[10px] bg-[var(--color-border-default)]" aria-hidden />
        <span className="text-label-sm text-[var(--color-text-subtle)]">Language</span>
        <span className="text-label-sm text-[var(--color-text-subtle)]">{item.language}</span>
      </div>

      {/* Actions — right-aligned */}
      <div className="flex items-center gap-1 justify-end">
        <Tooltip content="Dataset details">
          <Button
            variant="secondary"
            size="sm"
            icon={<IconInfoCircle size={12} />}
            aria-label="Dataset details"
            onClick={() => onOpenDetail(item)}
          />
        </Tooltip>
        {isCustom && (
          <>
            <Button variant="secondary" size="sm" onClick={() => onEdit(item)}>
              Edit
            </Button>
            <Button variant="secondary" size="sm">
              Delete
            </Button>
          </>
        )}
        <Button variant="primary" size="sm">
          Download
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Upload / Edit drawers
   ---------------------------------------- */

type FileEntry = { id: string; name: string };

function DatasetFormDrawers({
  uploadOpen,
  editOpen,
  editTarget,
  onCloseUpload,
  onCloseEdit,
}: {
  uploadOpen: boolean;
  editOpen: boolean;
  editTarget: DatasetItem | null;
  onCloseUpload: () => void;
  onCloseEdit: () => void;
}) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Record<(typeof CATEGORY_KEYS)[number], boolean>>({
    llm: false,
    tabular: false,
    other: false,
  });
  const [methods, setMethods] = useState<Record<(typeof METHOD_KEYS)[number], boolean>>({
    sft: false,
    grpo: false,
    cpt: false,
    dpo: false,
    gkd: false,
    rhf: false,
    pretrain: false,
    rag: false,
  });

  useEffect(() => {
    if (uploadOpen) {
      setFiles([{ id: 'f1', name: 'train_subset.jsonl' }]);
      setName('');
      setDescription('');
      setCategory({ llm: true, tabular: false, other: false });
      setMethods({
        sft: true,
        grpo: false,
        cpt: false,
        dpo: false,
        gkd: true,
        rhf: false,
        pretrain: false,
        rag: false,
      });
    }
  }, [uploadOpen]);

  useEffect(() => {
    if (editOpen && editTarget) {
      setName(editTarget.name);
      setDescription(editTarget.description);
      const cat =
        editTarget.category === 'tabular'
          ? { llm: false, tabular: true, other: false }
          : { llm: true, tabular: false, other: false };
      setCategory(cat);
      const m: Record<(typeof METHOD_KEYS)[number], boolean> = {
        sft: false,
        grpo: false,
        cpt: false,
        dpo: false,
        gkd: false,
        rhf: false,
        pretrain: false,
        rag: false,
      };
      editTarget.supportedMethods.forEach((x) => {
        const k = x.toLowerCase() as (typeof METHOD_KEYS)[number];
        if (k in m) m[k] = true;
      });
      setMethods(m);
    }
  }, [editOpen, editTarget]);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const toggleCategory = (key: (typeof CATEGORY_KEYS)[number]) =>
    setCategory((c) => ({ ...c, [key]: !c[key] }));

  const toggleMethod = (key: (typeof METHOD_KEYS)[number]) =>
    setMethods((m) => ({ ...m, [key]: !m[key] }));

  const categoryField = (
    <FormField
      label="Category"
      description="Select the ML task category that best matches how this dataset will be used"
      spacing="loose"
      required
    >
      <VStack gap={2}>
        <Checkbox label="LLM" checked={category.llm} onChange={() => toggleCategory('llm')} />
        <Checkbox
          label="Tabular"
          checked={category.tabular}
          onChange={() => toggleCategory('tabular')}
        />
        <Checkbox label="Other" checked={category.other} onChange={() => toggleCategory('other')} />
      </VStack>
    </FormField>
  );

  const methodField = (
    <FormField
      label="Method"
      description="Select the ML method or approach that is most suitable for this dataset"
      spacing="loose"
      required
    >
      <VStack gap={2}>
        {METHOD_KEYS.map((key) => (
          <Checkbox
            key={key}
            label={key.toUpperCase()}
            checked={methods[key]}
            onChange={() => toggleMethod(key)}
          />
        ))}
      </VStack>
    </FormField>
  );

  const sharedFields = (
    <>
      <FormField label="Name" description="Provide a unique name to identify the dataset" required>
        <Input
          placeholder="e.g., customer-support-sft-data"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </FormField>
      <FormField
        label="Description"
        description="Enter an optional description to provide additional information about the dataset"
        required
      >
        <Textarea
          placeholder="Add an description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          className="min-h-[70px]"
        />
      </FormField>
      {categoryField}
      {methodField}
    </>
  );

  return (
    <>
      <Drawer
        isOpen={uploadOpen}
        onClose={onCloseUpload}
        title="Upload dataset"
        description={UPLOAD_BODY}
        width={696}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={onCloseUpload} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={onCloseUpload} className="flex-1">
              Upload
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>
          <FormField label="Upload dataset file" required>
            <VStack gap={2}>
              <Button variant="secondary" size="md" leftIcon={<IconUpload size={12} />}>
                Upload a File
              </Button>
              {files.map((f) => (
                <HStack
                  key={f.id}
                  justify="between"
                  align="center"
                  className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]"
                >
                  <span className="text-body-md text-[var(--color-text-default)] truncate">
                    {f.name}
                  </span>
                  <button
                    type="button"
                    className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => removeFile(f.id)}
                  >
                    <IconX size={14} />
                  </button>
                </HStack>
              ))}
            </VStack>
          </FormField>
          {sharedFields}
        </VStack>
      </Drawer>

      <Drawer
        isOpen={editOpen}
        onClose={onCloseEdit}
        title="Edit dataset"
        description={UPLOAD_BODY}
        width={696}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={onCloseEdit} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={onCloseEdit} className="flex-1">
              Save
            </Button>
          </HStack>
        }
      >
        <VStack gap={6}>{sharedFields}</VStack>
      </Drawer>
    </>
  );
}

/* ----------------------------------------
   Detail: category label for header
   ---------------------------------------- */

function categoryLabel(c: DatasetItem['category']) {
  return c === 'tabular' ? 'Tabular' : 'Text generation';
}

/* ----------------------------------------
   Page
   ---------------------------------------- */

export function DatasetsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const listTab = searchParams.get('tab') || 'all';
  const setListTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const datasetIdParam = searchParams.get('datasetId');
  const view = datasetIdParam ? 'detail' : 'list';
  const selectedDataset = useMemo(
    () => (datasetIdParam ? (MOCK_DATASETS.find((d) => d.id === datasetIdParam) ?? null) : null),
    [datasetIdParam]
  );

  const [detailSection, setDetailSection] = useState<'details' | 'data'>('details');
  const [dataSubView, setDataSubView] = useState<DataSubView>('table');
  const [capsule, setCapsule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPage, setDataPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DatasetItem | null>(null);

  const [tableSelected, setTableSelected] = useState<string[]>([]);

  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Datasets');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filtered = useMemo(() => {
    return MOCK_DATASETS.filter((d) => {
      if (listTab === 'thaki' && d.source !== 'thaki') return false;
      if (listTab === 'custom' && d.source !== 'custom') return false;
      if (capsule === 'text-generation' && d.category !== 'text-generation') return false;
      if (capsule === 'tabular' && d.category !== 'tabular') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [listTab, capsule, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageSlice = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openDetail = (d: DatasetItem) => {
    setSearchParams({ datasetId: d.id }, { replace: false });
    setDetailSection('details');
    setDataSubView('table');
  };

  const backToList = () => {
    setSearchParams({}, { replace: false });
  };

  const tableColumns: TableColumn<DatasetRow>[] = useMemo(
    () => [
      { key: 'recordId', label: 'record_id', minWidth: '120px' },
      { key: 'customerSegment', label: 'customer_segment', minWidth: '120px' },
      { key: 'networkType', label: 'network_type', minWidth: '100px' },
      { key: 'signalStrength', label: 'signal_strength', minWidth: '100px' },
      { key: 'region', label: 'region', minWidth: '120px' },
      { key: 'score', label: 'score', align: 'right', minWidth: '72px' },
      { key: 'label', label: 'label', minWidth: '80px' },
      { key: 'notes', label: 'notes', minWidth: '140px' },
    ],
    []
  );

  const chatInfoCards = selectedDataset
    ? [
        { label: 'Rows loaded', value: selectedDataset.rows },
        { label: 'Schema', value: `${selectedDataset.features.length} features` },
        { label: 'Encoding', value: 'UTF-8' },
      ]
    : [];

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
              items={
                view === 'detail' && selectedDataset
                  ? [
                      {
                        label: 'Datasets',
                        onClick: () => {
                          backToList();
                        },
                      },
                      { label: selectedDataset.name },
                    ]
                  : [{ label: 'Datasets' }]
              }
            />
          }
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
      {view === 'list' && (
        <VStack gap={3}>
          <PageHeader
            title="Datasets"
            actions={
              <Button variant="primary" size="md" onClick={() => setUploadOpen(true)}>
                Upload dataset
              </Button>
            }
          />

          <Tabs
            value={listTab}
            onChange={(v) => {
              setListTab(v);
              setCurrentPage(1);
            }}
            variant="underline"
            size="sm"
          >
            <TabList>
              <Tab value="all">All</Tab>
              <Tab value="thaki">Thaki Datasets</Tab>
              <Tab value="custom">Custom Datasets</Tab>
            </TabList>
          </Tabs>

          <CapsuleTab
            items={[...CAPSULE_ITEMS]}
            activeValue={capsule}
            onChange={(v) => {
              setCapsule(v);
              setCurrentPage(1);
            }}
          />

          <SearchInput
            placeholder="Find datasets with filter"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            size="sm"
            className="w-[312px]"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {pageSlice.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageSlice.map((item) => (
                <DatasetCard
                  key={item.id}
                  item={item}
                  onOpenDetail={openDetail}
                  onEdit={(d) => {
                    setEditTarget(d);
                    setEditOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<IconDatabase size={48} stroke={1} />}
              title="No datasets found"
              description="Try adjusting your search, filters, or upload a new dataset."
            />
          )}
        </VStack>
      )}

      {view === 'detail' && selectedDataset && (
        <VStack gap={6}>
          {/* Instance Container — matches Figma node 14039:38027 */}
          <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] pt-3 pb-4 px-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-default)]">
                {selectedDataset.name}
              </h2>
              <p className="text-body-md text-[var(--color-text-subtle)]">
                {selectedDataset.description}
              </p>
            </div>

            <div>
              <Button variant="secondary" size="sm" leftIcon={<IconDownload size={12} />}>
                Download
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'Status', value: 'Active', isStatus: true },
                { label: 'Category', value: categoryLabel(selectedDataset.category) },
                { label: 'Size', value: selectedDataset.size },
                { label: 'Downloads', value: String(selectedDataset.downloads) },
                { label: 'Language', value: selectedDataset.language },
                { label: 'Type', value: selectedDataset.type },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] px-4 py-3 flex items-center justify-between min-w-0"
                >
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-label-sm text-[var(--color-text-subtle)]">
                      {card.label}
                    </span>
                    <span className="text-body-md text-[var(--color-text-default)] truncate">
                      {card.value}
                    </span>
                  </div>
                  {card.isStatus && (
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6L5 8.5L9.5 4"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Tabs
            value={detailSection}
            onChange={(v) => setDetailSection(v as 'details' | 'data')}
            variant="underline"
            size="sm"
          >
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="data">Data</Tab>
            </TabList>

            <TabPanel value="details" className="pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Files" value={String(selectedDataset.files)} />
                  <SectionCard.DataRow label="Supported methods">
                    <div className="flex flex-wrap gap-1">
                      {selectedDataset.supportedMethods.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] text-label-sm"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow label="License" value={selectedDataset.license} />
                  <SectionCard.DataRow label="Data splits" value={selectedDataset.dataSplits} />
                  <SectionCard.DataRow label="Features">
                    <div className="flex flex-wrap gap-1">
                      {selectedDataset.features.map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] text-label-sm"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow
                    label="Source URL"
                    value={selectedDataset.sourceUrl}
                    isLink
                    linkHref={selectedDataset.sourceUrl}
                  />
                  <SectionCard.DataRow label="Created at" value={selectedDataset.createdAt} />
                  <SectionCard.DataRow label="Updated at" value={selectedDataset.updatedAt} />
                </SectionCard.Content>
              </SectionCard>
            </TabPanel>

            <TabPanel value="data" className="pt-4">
              <VStack gap={4}>
                <Tabs
                  value={dataSubView}
                  onChange={(v) => setDataSubView(v as DataSubView)}
                  variant="underline"
                  size="sm"
                >
                  <TabList>
                    <Tab value="table">Table</Tab>
                    <Tab value="text">Text</Tab>
                    <Tab value="chat">Chat</Tab>
                  </TabList>
                </Tabs>

                {dataSubView === 'table' && (
                  <VStack gap={3}>
                    <span className="text-body-md text-[var(--color-text-muted)]">
                      Showing {MOCK_TABLE_ROWS.length} preview rows · {selectedDataset.dataSplits}
                    </span>
                    <Pagination currentPage={dataPage} totalPages={3} onPageChange={setDataPage} />
                    <Table<DatasetRow>
                      columns={tableColumns}
                      data={MOCK_TABLE_ROWS}
                      rowKey="id"
                      selectable
                      selectedKeys={tableSelected}
                      onSelectionChange={setTableSelected}
                      emptyMessage="No rows"
                    />
                  </VStack>
                )}

                {dataSubView === 'text' && (
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
                    <pre className="text-body-md text-[var(--color-text-default)] whitespace-pre-wrap font-mono">
                      {SAMPLE_TEXT_PREVIEW}
                    </pre>
                  </div>
                )}

                {dataSubView === 'chat' && (
                  <VStack gap={4}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {chatInfoCards.map((c) => (
                        <InfoBox key={c.label} label={c.label} value={c.value} />
                      ))}
                    </div>
                    <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col min-h-[200px]">
                      <div className="flex-1 p-4 overflow-y-auto">
                        <p className="text-body-md text-[var(--color-text-muted)]">
                          Preview messages and annotations for conversational rows. Dataset version
                          v1 — streaming decode disabled for this prototype.
                        </p>
                      </div>
                      <div className="border-t border-[var(--color-border-default)] p-3">
                        <SearchInput placeholder="Search in preview" size="sm" fullWidth />
                      </div>
                    </div>
                  </VStack>
                )}
              </VStack>
            </TabPanel>
          </Tabs>
        </VStack>
      )}

      <DatasetFormDrawers
        uploadOpen={uploadOpen}
        editOpen={editOpen}
        editTarget={editTarget}
        onCloseUpload={() => setUploadOpen(false)}
        onCloseEdit={() => {
          setEditOpen(false);
          setEditTarget(null);
        }}
      />
    </PageShell>
  );
}

export default DatasetsPage;
