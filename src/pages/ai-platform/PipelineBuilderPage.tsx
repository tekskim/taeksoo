import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  EmptyState,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AITopBarActions } from '@/components/AITopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconRoute, IconPlus } from '@tabler/icons-react';

export function PipelineBuilderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Pipeline builder');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

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
              items={[{ label: 'AI Platform' }, { label: 'MLOps' }, { label: 'Pipeline builder' }]}
            />
          }
          actions={<AITopBarActions />}
        />
      }
      contentClassName="pt-3 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <PageHeader
          title="Pipeline builder"
          actions={
            <HStack gap={2}>
              <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
                Refresh
              </Button>
              <Button variant="primary" size="md" icon={<IconPlus size={12} stroke={1.5} />}>
                Create pipeline
              </Button>
            </HStack>
          }
        />
        <p className="text-body-lg text-[var(--color-text-subtle)]">
          Build and manage ML training pipelines.
        </p>
        <EmptyState
          variant="card"
          icon={<IconRoute size={48} stroke={1} />}
          title="No pipelines found"
          description="Create your first pipeline to get started."
        />
      </VStack>
    </PageShell>
  );
}

export default PipelineBuilderPage;
