import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  Tabs,
  PageShell,
  PageHeader,
  EmptyState,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconSearch, IconRefresh, IconFileDescription } from '@tabler/icons-react';

/* ----------------------------------------
   Text generation Page
   ---------------------------------------- */

export function TextGenerationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'experiments';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
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
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <PageHeader
          title="Text generation experiments"
          actions={
            <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
              Refresh
            </Button>
          }
        />
        <p className="text-body-lg text-[var(--color-text-subtle)]">
          Customize text generation models through LLM fine-tuning.
        </p>

        {/* Tabs */}
        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="underline"
        />

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
    </PageShell>
  );
}

export default TextGenerationPage;
