import { useState, useEffect } from 'react';
import { VStack, HStack, TabBar, TopBar, Breadcrumb, Button, Tabs } from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconSearch, IconRefresh, IconFileDescription } from '@tabler/icons-react';

/* ----------------------------------------
   Empty State Component
   ---------------------------------------- */

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-16">
      <VStack gap={4} align="center">
        <div className="text-[var(--color-text-disabled)]">{icon}</div>
        <VStack gap={2} align="center">
          <span className="text-heading-h5 text-[var(--color-text-default)]">{title}</span>
          <span className="text-body-lg text-[var(--color-text-subtle)]">{description}</span>
        </VStack>
      </VStack>
    </div>
  );
}

/* ----------------------------------------
   Text generation Page
   ---------------------------------------- */

export function TextGenerationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('experiments');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Text generation');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const tabItems = [
    { id: 'experiments', label: 'Experiments' },
    { id: 'new-experiment', label: 'New experiment', disabled: true },
    { id: 'monitoring', label: 'Monitoring', disabled: true },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'AI Platform' },
                { label: 'ML Studio' },
                { label: 'Text generation' },
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

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)] min-h-full">
            <VStack gap={6}>
              {/* Header */}
              <VStack gap={1}>
                <h1 className="text-heading-h3 text-[var(--color-text-default)]">
                  Text generation experiments
                </h1>
                <p className="text-body-lg text-[var(--color-text-subtle)]">
                  Customize text generation models through LLM fine-tuning.
                </p>
              </VStack>

              {/* Tabs + Refresh */}
              <HStack justify="between" align="end">
                <Tabs
                  items={tabItems}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  variant="underline"
                />
                <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
                  Refresh
                </Button>
              </HStack>

              {/* Tab Content */}
              {activeTab === 'experiments' && (
                <EmptyState
                  icon={<IconFileDescription size={48} stroke={1} />}
                  title="No experiments found"
                  description="Create a new experiment to start training Text generation models."
                />
              )}

              {activeTab === 'new-experiment' && (
                <EmptyState
                  icon={<IconFileDescription size={48} stroke={1} />}
                  title="New experiment"
                  description="Configure and start a new text generation experiment."
                />
              )}

              {activeTab === 'monitoring' && (
                <EmptyState
                  icon={<IconFileDescription size={48} stroke={1} />}
                  title="Monitoring"
                  description="Monitor your running experiments and view metrics."
                />
              )}
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TextGenerationPage;
