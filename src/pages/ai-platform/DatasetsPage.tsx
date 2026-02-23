import { useState, useEffect } from 'react';
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
  Badge,
  PageShell,
  PageHeader,
  EmptyState,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconSearch,
  IconRefresh,
  IconFilter,
  IconExternalLink,
  IconDownload,
  IconDatabase,
  IconTag,
  IconWorld,
  IconFile,
  IconHash,
} from '@tabler/icons-react';

/* ----------------------------------------
   Dataset Card Component
   ---------------------------------------- */

interface DatasetCardProps {
  name: string;
  status: 'available' | 'pending' | 'unavailable';
  source: string;
  size: string;
  rows: string;
  description: string;
  license?: string;
  language?: string;
  tags: string[];
  downloads: string;
  columns: string[];
  onViewDetails?: () => void;
  onDownload?: () => void;
}

function DatasetCard({
  name,
  status,
  source,
  size,
  rows,
  description,
  license,
  language,
  tags,
  downloads,
  columns,
  onViewDetails,
  onDownload,
}: DatasetCardProps) {
  const statusColors = {
    available: 'success',
    pending: 'warning',
    unavailable: 'danger',
  } as const;

  const statusLabels = {
    available: 'Available',
    pending: 'Pending',
    unavailable: 'Unavailable',
  };

  return (
    <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] p-5">
      <VStack gap={4} align="stretch">
        {/* Header */}
        <HStack justify="between" align="start">
          <VStack gap={2} align="start" className="flex-1 min-w-0">
            <HStack gap={3} align="center" className="flex-wrap">
              <h3 className="text-heading-h5 text-[var(--color-action-primary)] truncate">
                {name}
              </h3>
              <Badge variant={statusColors[status]} size="sm">
                {statusLabels[status]}
              </Badge>
              <span className="text-body-md text-[var(--color-text-muted)]">{source}</span>
              <HStack gap={1} align="center">
                <IconFile size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                <span className="text-body-md text-[var(--color-text-muted)]">{size}</span>
              </HStack>
              <HStack gap={1} align="center">
                <IconHash size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                <span className="text-body-md text-[var(--color-text-muted)]">{rows}</span>
              </HStack>
            </HStack>
          </VStack>
          <HStack gap={2}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconExternalLink size={14} stroke={1.5} />}
              onClick={onViewDetails}
            >
              View details
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<IconDownload size={14} stroke={1.5} />}
              onClick={onDownload}
            >
              Download
            </Button>
          </HStack>
        </HStack>

        {/* Description */}
        <p className="text-body-md text-[var(--color-text-muted)] leading-relaxed">{description}</p>

        {/* Meta Info */}
        <HStack gap={4} align="center" className="flex-wrap">
          {license && (
            <HStack gap={1} align="center">
              <IconTag size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
              <span className="text-body-md text-[var(--color-text-muted)]">{license}</span>
            </HStack>
          )}
          {language && (
            <HStack gap={1} align="center">
              <IconWorld size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
              <span className="text-body-md text-[var(--color-text-muted)]">{language}</span>
            </HStack>
          )}
          <HStack gap={1} className="flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] text-body-sm rounded"
              >
                {tag}
              </span>
            ))}
          </HStack>
          <HStack gap={1} align="center">
            <IconDownload size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
            <span className="text-body-md text-[var(--color-text-muted)]">{downloads}</span>
          </HStack>
        </HStack>

        {/* Columns */}
        <HStack gap={2} className="flex-wrap">
          {columns.map((column) => (
            <Badge key={column} theme="white" size="sm">
              {column}
            </Badge>
          ))}
        </HStack>
      </VStack>
    </div>
  );
}

/* ----------------------------------------
   Datasets Page
   ---------------------------------------- */

export function DatasetsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [searchQuery, setSearchQuery] = useState('');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Datasets');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Sample datasets data
  const datasets = [
    {
      name: 'nvidia/OpenCodeReasoning',
      status: 'available' as const,
      source: 'Thaki',
      size: '7MB',
      rows: '0',
      description:
        'A large-scale code reasoning dataset designed for supervised fine-tuning (SFT) that includes instruction-style prompts and solutions across various coding tasks. This dataset focuses on enhancing code understanding and problem-solving capabilities in programming contexts.',
      license: 'legal',
      language: 'en',
      tags: ['sft', 'gkd', 'grpo'],
      downloads: '3.3K',
      columns: ['source', 'task', 'input', 'output', 'category'],
    },
    {
      name: 'nvidia/AceReason-Math',
      status: 'available' as const,
      source: 'Thaki',
      size: '14MB',
      rows: '49.6K',
      description:
        "A mathematical reasoning dataset from NVIDIA's AceReason series, containing 49,585 training examples with message-based prompts and solutions for advanced math problem solving.",
      license: 'accounting',
      language: 'en',
      tags: ['sft', 'gkd', 'grpo'],
      downloads: '972',
      columns: ['messages'],
    },
    {
      name: 'argilla/distilabel-intel-orca-dpo-pairs',
      status: 'available' as const,
      source: 'Thaki',
      size: '162MB',
      rows: '12.9K',
      description:
        'A dataset containing DPO (Direct Preference Optimization) pairs for training language models on instruction following. Includes chosen and rejected response pairs for preference learning.',
      license: 'apache-2.0',
      language: 'en',
      tags: ['dpo', 'preference'],
      downloads: '5.2K',
      columns: ['prompt', 'chosen', 'rejected', 'score'],
    },
    {
      name: 'HuggingFaceH4/ultrafeedback_binarized',
      status: 'available' as const,
      source: 'Thaki',
      size: '458MB',
      rows: '61.1K',
      description:
        'UltraFeedback binarized dataset for training language models using preference learning. Contains high-quality feedback pairs with binary preference labels.',
      license: 'mit',
      language: 'en',
      tags: ['rlhf', 'feedback', 'preference'],
      downloads: '12.8K',
      columns: ['prompt', 'chosen', 'rejected'],
    },
    {
      name: 'Open-Orca/OpenOrca',
      status: 'available' as const,
      source: 'Thaki',
      size: '2.3GB',
      rows: '4.2M',
      description:
        'A large-scale instruction tuning dataset based on FLAN collection with GPT-4 and GPT-3.5 generated responses. Designed for training general-purpose instruction-following models.',
      language: 'en',
      tags: ['sft', 'instruction'],
      downloads: '28.5K',
      columns: ['system_prompt', 'question', 'response', 'id'],
    },
  ];

  // Filter datasets based on active tab
  const filteredDatasets = datasets
    .filter((dataset) => {
      if (activeTab === 'thaki') {
        return dataset.source === 'Thaki';
      }
      if (activeTab === 'custom') {
        return dataset.source === 'Custom';
      }
      return true;
    })
    .filter((dataset) => {
      if (!searchQuery) return true;
      return (
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

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
              items={[{ label: 'AI Platform' }, { label: 'Hub' }, { label: 'Datasets' }]}
            />
          }
          actions={
            <HStack gap={2}>
              <button className="p-2 hover:bg-[var(--color-surface-subtle)] rounded-md transition-colors">
                <IconSearch size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
              </button>
              <button className="p-2 hover:bg-[var(--color-surface-subtle)] rounded-md transition-colors">
                <IconBell size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
              </button>
            </HStack>
          }
        />
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <PageHeader
          title="Datasets"
          actions={
            <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={14} stroke={1.5} />}>
              Refresh
            </Button>
          }
        />

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline">
          <TabList>
            <Tab value="all">All datasets</Tab>
            <Tab value="thaki">Thaki datasets</Tab>
            <Tab value="custom">Custom datasets</Tab>
          </TabList>
        </Tabs>

        {/* Search & Filters */}
        <HStack gap={4} className="w-full">
          <div className="flex-1 relative">
            <IconSearch
              size={16}
              stroke={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
            />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md text-body-md text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            />
          </div>
          <Button variant="secondary" size="md" leftIcon={<IconFilter size={14} stroke={1.5} />}>
            Filters
          </Button>
        </HStack>

        {/* Datasets List */}
        {filteredDatasets.length > 0 ? (
          <VStack gap={4}>
            {filteredDatasets.map((dataset, index) => (
              <DatasetCard
                key={index}
                {...dataset}
                onViewDetails={() => console.log('View details:', dataset.name)}
                onDownload={() => console.log('Download:', dataset.name)}
              />
            ))}
          </VStack>
        ) : (
          <EmptyState
            icon={<IconDatabase size={48} stroke={1} />}
            title="No datasets found"
            description={
              activeTab === 'custom'
                ? "You haven't uploaded any custom datasets yet. Upload your first dataset to get started."
                : 'No datasets match your search criteria. Try adjusting your filters.'
            }
          />
        )}
      </VStack>
    </PageShell>
  );
}

export default DatasetsPage;
