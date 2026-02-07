import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  Input,
  Select,
  Checkbox,
  PageShell,
  PageHeader,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconSearch,
  IconStar,
  IconDownload,
  IconClock,
  IconCpu,
  IconServer,
  IconDatabase,
} from '@tabler/icons-react';

/* ----------------------------------------
   Template Card Component
   ---------------------------------------- */

interface TemplateCardProps {
  name: string;
  imageUrl: string;
  tags: string[];
  cpu: string;
  memory: string;
  gpu?: string;
  disk?: string;
  downloads: number;
  date: string;
  onView?: () => void;
  onDeploy?: () => void;
}

function TemplateCard({
  name,
  imageUrl,
  tags,
  cpu,
  memory,
  gpu,
  disk,
  downloads,
  date,
  onView,
  onDeploy,
}: TemplateCardProps) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-4 flex flex-col gap-3">
      {/* Header */}
      <HStack justify="between" align="start">
        <VStack gap={1} className="flex-1 min-w-0">
          <span className="text-body-lg font-semibold text-[var(--color-text-default)] truncate">
            {name}
          </span>
          <span className="text-body-md text-[var(--color-text-subtle)] truncate">{imageUrl}</span>
        </VStack>
        <button className="p-1 hover:bg-[var(--color-surface-subtle)] rounded transition-colors">
          <IconStar size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
        </button>
      </HStack>

      {/* Tags */}
      <HStack gap={2} className="flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-body-sm bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] rounded"
          >
            {tag}
          </span>
        ))}
      </HStack>

      {/* Resources */}
      <div className="grid grid-cols-2 gap-2 text-body-sm text-[var(--color-text-muted)]">
        <HStack gap={1} align="center">
          <IconCpu size={16} stroke={1.5} />
          <span>{cpu}</span>
        </HStack>
        <HStack gap={1} align="center">
          <IconServer size={16} stroke={1.5} />
          <span>{memory}</span>
        </HStack>
        {gpu && (
          <HStack gap={1} align="center">
            <IconServer size={16} stroke={1.5} />
            <span>{gpu}</span>
          </HStack>
        )}
        {disk && (
          <HStack gap={1} align="center">
            <IconDatabase size={16} stroke={1.5} />
            <span>{disk}</span>
          </HStack>
        )}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[var(--color-border-subtle)]" />

      {/* Footer */}
      <HStack justify="between" align="center">
        <HStack gap={3} className="text-body-sm text-[var(--color-text-subtle)]">
          <HStack gap={1} align="center">
            <IconDownload size={16} stroke={1.5} />
            <span>{downloads}</span>
          </HStack>
          <HStack gap={1} align="center">
            <IconClock size={16} stroke={1.5} />
            <span>{date}</span>
          </HStack>
        </HStack>
        <HStack gap={2}>
          <Button variant="secondary" size="sm" onClick={onView}>
            View
          </Button>
          <Button variant="primary" size="sm" onClick={onDeploy}>
            Deploy
          </Button>
        </HStack>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Explore Page
   ---------------------------------------- */

// Sample template data
const sampleTemplates: TemplateCardProps[] = [
  {
    name: 'presidio-pii-deid',
    imageUrl: 'ghcr.io/thakicloud/presidio-pii-deid:1.2.0',
    tags: ['Web services', 'GPU'],
    cpu: '2 CPU',
    memory: '40 GB',
    gpu: '40 GB GPU',
    disk: '50 GB Disk',
    downloads: 2,
    date: '2025. 12. 29.',
  },
  {
    name: 'prompt-optimizer',
    imageUrl: 'ghcr.io/thakicloud/prompt-optimizer:latest',
    tags: ['Web services'],
    cpu: '1 CPU',
    memory: '1 GB',
    downloads: 3,
    date: '2025. 12. 24.',
  },
  {
    name: 'llm-interview-eval-agent',
    imageUrl: 'ghcr.io/thakicloud/llm-interview-eval-agent:latest',
    tags: ['Web services'],
    cpu: '1 CPU',
    memory: '2 GB',
    disk: '10 GB Disk',
    downloads: 3,
    date: '2025. 12. 24.',
  },
  {
    name: 'vibevoice-app',
    imageUrl: 'ghcr.io/thakicloud/vibevoice-app:gpu',
    tags: ['Web services', 'GPU'],
    cpu: '2 CPU',
    memory: '40 GB',
    gpu: '40 GB GPU',
    disk: '50 GB Disk',
    downloads: 0,
    date: '2025. 12. 15.',
  },
  {
    name: 'audiocraft',
    imageUrl: 'ghcr.io/thakicloud/audiocraft:gpu',
    tags: ['Web services', 'GPU'],
    cpu: '4 CPU',
    memory: '40 GB',
    gpu: '40 GB GPU',
    disk: '100 GB Disk',
    downloads: 0,
    date: '2025. 12. 15.',
  },
  {
    name: 'eager-delta-2161',
    imageUrl: '—',
    tags: ['Web services'],
    cpu: '1 CPU',
    memory: '1 GB',
    downloads: 0,
    date: '2025. 12. 15.',
  },
];

export function ExplorePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Explore');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const categoryOptions = [
    { value: 'all', label: 'All categories' },
    { value: 'web-services', label: 'Web services' },
    { value: 'gpu', label: 'GPU' },
    { value: 'ml-models', label: 'ML Models' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Most popular' },
    { value: 'name', label: 'Name' },
  ];

  // Filter templates
  const filteredTemplates = sampleTemplates.filter((template) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(query) ||
        template.imageUrl.toLowerCase().includes(query) ||
        template.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
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
          breadcrumb={<Breadcrumb items={[{ label: 'AI Platform' }, { label: 'Explore' }]} />}
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
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <PageHeader
          title="Explore"
          actions={
            <Button variant="secondary" size="md">
              Submit Template
            </Button>
          }
        />

        {/* Search & Filters */}
        <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-4">
          <HStack gap={4} align="center">
            <div className="flex-1">
              <Input
                placeholder="Search templates, models, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
            <Select
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              placeholder="All categories"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Newest"
            />
            <Checkbox checked={featuredOnly} onChange={setFeaturedOnly} label="Featured only" />
          </HStack>
        </div>

        {/* Templates Grid */}
        <VStack gap={4}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">
            All Templates ({filteredTemplates.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.name}
                {...template}
                onView={() => console.log('View', template.name)}
                onDeploy={() => console.log('Deploy', template.name)}
              />
            ))}
          </div>
        </VStack>
      </VStack>
    </PageShell>
  );
}

export default ExplorePage;
