import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  PageShell,
  PageHeader,
  SearchInput,
  Pagination,
  Tooltip,
  EmptyState,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconSearch, IconCube, IconEye } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ModelType = 'base' | 'fine-tuning';
type ModelCategory = 'llm' | 'tabular';

interface ModelItem {
  id: string;
  title: string;
  description: string;
  type: ModelType;
  category: ModelCategory;
  hasDelete?: boolean;
  hasDeploy?: boolean;
}

/* ----------------------------------------
   Mock Data — matches Figma 8 card pattern
   Row 1: Base+LLM(Deploy), Base+LLM(Deploy), FT+LLM(Delete+Train+Deploy), FT+LLM(Delete+Train+Deploy)
   Row 2: Base+Tab(Train), Base+Tab(Train), FT+Tab(Delete+Train), FT+Tab(Delete+Train)
   ---------------------------------------- */

const MOCK_MODELS: ModelItem[] = [
  {
    id: 'm1',
    title: 'Qwen3-0.6B',
    description: 'Qwen3 0.6B parameter model for general language tasks',
    type: 'base',
    category: 'llm',
    hasDeploy: true,
  },
  {
    id: 'm2',
    title: 'Qwen3-1.7B',
    description: 'Qwen3 1.7B parameter model for general language tasks',
    type: 'base',
    category: 'llm',
    hasDeploy: true,
  },
  {
    id: 'm3',
    title: 'Llama3-8B-FT',
    description: 'Fine-tuned Llama3 8B for classification',
    type: 'fine-tuning',
    category: 'llm',
    hasDelete: true,
    hasDeploy: true,
  },
  {
    id: 'm4',
    title: 'Llama3-70B-FT',
    description: 'Fine-tuned Llama3 70B for production',
    type: 'fine-tuning',
    category: 'llm',
    hasDelete: true,
    hasDeploy: true,
  },
  {
    id: 'm5',
    title: 'XGBoost-v1',
    description: 'Tabular classification model',
    type: 'base',
    category: 'tabular',
  },
  {
    id: 'm6',
    title: 'LightGBM-v2',
    description: 'Tabular regression model',
    type: 'base',
    category: 'tabular',
  },
  {
    id: 'm7',
    title: 'TabNet-FT',
    description: 'Fine-tuned TabNet for tabular prediction',
    type: 'fine-tuning',
    category: 'tabular',
    hasDelete: true,
  },
  {
    id: 'm8',
    title: 'CatBoost-FT',
    description: 'Fine-tuned CatBoost model',
    type: 'fine-tuning',
    category: 'tabular',
    hasDelete: true,
  },
  {
    id: 'm9',
    title: 'Qwen3-4B',
    description: 'Qwen3 4B parameter model',
    type: 'base',
    category: 'llm',
    hasDeploy: true,
  },
  {
    id: 'm10',
    title: 'Mistral-7B',
    description: 'Mistral 7B parameter model',
    type: 'base',
    category: 'llm',
    hasDeploy: true,
  },
];

/* ----------------------------------------
   Badge — Figma-accurate colors
   "Base" / "Fine-tuning": gray bg (#f3f4f6) + muted text (#475569)
   "LLM": blue bg (#eff6ff) + blue text (#3b82f6)
   "Tabular": green bg (#dcfce7) + green text (#22c55e)
   ---------------------------------------- */

function ModelBadge({ label, variant }: { label: string; variant: 'gray' | 'blue' | 'green' }) {
  const styles = {
    gray: 'bg-[#f3f4f6] text-[#475569]',
    blue: 'bg-[#eff6ff] text-[#3b82f6]',
    green: 'bg-[#dcfce7] text-[#22c55e]',
  };
  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-[var(--radius-md)] text-label-sm ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

/* ----------------------------------------
   Model Card — Figma specs:
   p-4, gap-3 (12px), rounded-[6px], border
   Title: h5 (16px semibold), Description: body-md
   Actions row: justify-end, icon btn + text btns
   ---------------------------------------- */

function ModelCard({ model }: { model: ModelItem }) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-4 flex flex-col gap-3">
      {/* Title + Description */}
      <VStack gap={1}>
        <span className="text-heading-h5 text-[var(--color-text-default)]">{model.title}</span>
        <span className="text-body-md text-[var(--color-text-subtle)]">{model.description}</span>
      </VStack>

      {/* Badges */}
      <HStack gap={1}>
        <ModelBadge label={model.type === 'base' ? 'Base' : 'Fine-tuning'} variant="gray" />
        <ModelBadge
          label={model.category === 'llm' ? 'LLM' : 'Tabular'}
          variant={model.category === 'llm' ? 'blue' : 'green'}
        />
      </HStack>

      {/* Actions — right aligned */}
      <HStack justify="end" gap={1} align="center">
        <Tooltip content="Details">
          <Button variant="secondary" size="sm" icon={<IconEye size={12} />} aria-label="Details" />
        </Tooltip>
        {model.hasDelete && (
          <Button variant="secondary" size="sm">
            Delete
          </Button>
        )}
        <Button variant="secondary" size="sm">
          Train model
        </Button>
        {model.hasDeploy && (
          <Button variant="primary" size="sm">
            Deploy
          </Button>
        )}
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Capsule Tab — Figma "CapsuleTab" component
   Outer: bg-surface-subtle, border, rounded-[6px], p-1
   Active: bg-white, border, rounded-[6px], blue text
   Inactive: bg-transparent, no border, default text
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
   Models Page
   ---------------------------------------- */

const ITEMS_PER_PAGE = 20;

export function ModelsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Models');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
    setCurrentPage(1);
  };

  const filteredModels = useMemo(() => {
    return MOCK_MODELS.filter((model) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !model.title.toLowerCase().includes(q) &&
          !model.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (activeTab === 'base' && model.type !== 'base') return false;
      if (activeTab === 'fine-tuning' && model.type !== 'fine-tuning') return false;
      if (categoryFilter !== 'all' && model.category !== categoryFilter) return false;
      return true;
    });
  }, [searchQuery, activeTab, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredModels.length / ITEMS_PER_PAGE));
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
          breadcrumb={<Breadcrumb items={[{ label: 'Models' }]} />}
          actions={
            <>
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
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        {/* Page Header — title + Registry button */}
        <PageHeader
          title="Models"
          actions={
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/ai-platform/models/registry')}
            >
              Registry
            </Button>
          }
        />

        {/* Main tabs: All / Base models / Fine-tuning models */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="all">All</Tab>
            <Tab value="base">Base models</Tab>
            <Tab value="fine-tuning">Fine-tuning models</Tab>
          </TabList>
        </Tabs>

        {/* Category filter capsule tabs */}
        <CapsuleTab
          items={[
            { value: 'all', label: 'All' },
            { value: 'llm', label: 'LLM' },
            { value: 'tabular', label: 'Tabular' },
          ]}
          activeValue={categoryFilter}
          onChange={(v) => {
            setCategoryFilter(v);
            setCurrentPage(1);
          }}
        />

        {/* Search — Figma: w-[312px] */}
        <SearchInput
          placeholder="Find models"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          size="sm"
          className="w-[312px]"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Model cards grid — 4 columns, gap-4 (16px) */}
        {paginatedModels.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {paginatedModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<IconCube size={48} stroke={1} />}
            title="No models found"
            description="Try adjusting your search or filter criteria."
          />
        )}
      </VStack>
    </PageShell>
  );
}

export default ModelsPage;
