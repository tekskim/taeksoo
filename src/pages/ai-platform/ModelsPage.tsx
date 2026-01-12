import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  Input,
  Tabs,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconSearch,
  IconRefresh,
  IconCube,
  IconInfoCircle,
  IconPlayerPlay,
  IconLink,
} from '@tabler/icons-react';

/* ----------------------------------------
   Model Card Component
   ---------------------------------------- */

interface ModelCardProps {
  name: string;
  description: string;
  type: 'base' | 'fine-tuned';
  status: 'available' | 'training' | 'unavailable';
  onDetails?: () => void;
  onTrain?: () => void;
  onDeploy?: () => void;
}

function ModelCard({
  name,
  description,
  type,
  status,
  onDetails,
  onTrain,
  onDeploy,
}: ModelCardProps) {
  const statusColors = {
    available: 'bg-[var(--color-state-success-bg)] text-[var(--color-state-success)]',
    training: 'bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)]',
    unavailable: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]',
  };

  const statusLabels = {
    available: 'Available',
    training: 'Training',
    unavailable: 'Unavailable',
  };

  return (
    <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-5 flex flex-col gap-4">
      {/* Header */}
      <HStack justify="between" align="center">
        <HStack gap={2} align="center">
          <IconCube size={18} className="text-[var(--color-text-muted)]" stroke={1.5} />
          <span className="text-[12px] text-[var(--color-text-muted)]">
            {type === 'base' ? 'Base Model' : 'Fine-tuned Model'}
          </span>
        </HStack>
        <span className={`px-2 py-0.5 text-[11px] font-medium rounded ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </HStack>

      {/* Model Info */}
      <VStack gap={1}>
        <span className="text-[16px] font-semibold text-[var(--color-text-default)]">
          {name}
        </span>
        <span className="text-[13px] text-[var(--color-text-subtle)] line-clamp-2">
          {description}
        </span>
      </VStack>

      {/* Actions */}
      <HStack gap={2} className="mt-auto pt-2">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<IconInfoCircle size={14} stroke={1.5} />}
          onClick={onDetails}
        >
          Details
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconPlayerPlay size={14} stroke={1.5} />}
          onClick={onTrain}
        >
          Train Model
        </Button>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<IconLink size={14} stroke={1.5} />}
          onClick={onDeploy}
        >
          Deploy Model
        </Button>
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Models Page
   ---------------------------------------- */

// Sample models data
const sampleModels: ModelCardProps[] = [
  {
    name: 'Qwen3-0.6B',
    description: 'Qwen3 0.6B parameter model',
    type: 'base',
    status: 'available',
  },
  {
    name: 'Qwen3-1.7B',
    description: 'Qwen3 1.7B parameter model for general language tasks',
    type: 'base',
    status: 'available',
  },
  {
    name: 'Qwen3-4B',
    description: 'Qwen3 4B parameter model',
    type: 'base',
    status: 'available',
  },
  {
    name: 'Qwen3-8B',
    description: 'Qwen3 8B parameter model with enhanced capabilities',
    type: 'base',
    status: 'available',
  },
  {
    name: 'Qwen3-14B',
    description: 'Qwen3 14B parameter model for complex reasoning tasks',
    type: 'base',
    status: 'available',
  },
  {
    name: 'Qwen3-32B',
    description: 'Qwen3 32B parameter model for advanced applications',
    type: 'base',
    status: 'available',
  },
  {
    name: 'Llama3-8B',
    description: 'Meta Llama 3 8B parameter model',
    type: 'base',
    status: 'available',
  },
  {
    name: 'Llama3-70B',
    description: 'Meta Llama 3 70B parameter model for production use',
    type: 'base',
    status: 'available',
  },
];

export function ModelsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  useEffect(() => {
    updateActiveTabLabel('Models');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const tabItems = [
    { id: 'all', label: 'All' },
    { id: 'base', label: 'Base Models' },
    { id: 'fine-tuned', label: 'Fine-tuned Models' },
  ];

  // Filter models
  const filteredModels = sampleModels.filter((model) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!model.name.toLowerCase().includes(query) && !model.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    // Tab filter
    if (activeTab === 'base' && model.type !== 'base') return false;
    if (activeTab === 'fine-tuned' && model.type !== 'fine-tuned') return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        <TabBar
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'AI Platform' },
                { label: 'Hub' },
                { label: 'Models' },
              ]}
            />
          }
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

        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)] min-h-full">
            <VStack gap={6}>
              {/* Header */}
              <HStack justify="between" align="start">
                <VStack gap={1}>
                  <h1 className="text-[24px] font-semibold text-[var(--color-text-default)]">
                    Models
                  </h1>
                  <p className="text-[14px] text-[var(--color-text-subtle)]">
                    Manage and deploy base and fine-tuned models.
                  </p>
                </VStack>
                <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
                  Refresh
                </Button>
              </HStack>

              {/* Search */}
              <div className="relative">
                <IconSearch 
                  size={16} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" 
                  stroke={1.5} 
                />
                <input
                  type="text"
                  placeholder="Search by model name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg text-[14px] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action-primary)] focus:border-transparent"
                />
              </div>

              {/* Tabs */}
              <Tabs
                items={tabItems}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="underline"
              />

              {/* Models Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredModels.map((model) => (
                  <ModelCard
                    key={model.name}
                    {...model}
                    onDetails={() => console.log('Details', model.name)}
                    onTrain={() => console.log('Train', model.name)}
                    onDeploy={() => console.log('Deploy', model.name)}
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredModels.length === 0 && (
                <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-16 text-center">
                  <VStack gap={2} align="center">
                    <IconCube size={48} className="text-[var(--color-text-disabled)]" stroke={1} />
                    <span className="text-[16px] font-semibold text-[var(--color-text-default)]">
                      No models found
                    </span>
                    <span className="text-[14px] text-[var(--color-text-subtle)]">
                      {activeTab === 'fine-tuned' 
                        ? 'No fine-tuned models available. Train a model to get started.'
                        : 'No models match your search criteria.'}
                    </span>
                  </VStack>
                </div>
              )}
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModelsPage;
