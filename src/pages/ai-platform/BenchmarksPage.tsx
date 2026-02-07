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
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconSearch, IconRefresh, IconChartBar, IconPlus } from '@tabler/icons-react';

export function BenchmarksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Benchmarks');
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
              items={[{ label: 'AI Platform' }, { label: 'MLOps' }, { label: 'Benchmarks' }]}
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
          title="Benchmarks"
          actions={
            <HStack gap={2}>
              <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
                Refresh
              </Button>
              <Button variant="primary" size="md" icon={<IconPlus size={12} stroke={1.5} />}>
                Create benchmark
              </Button>
            </HStack>
          }
        />
        <p className="text-body-lg text-[var(--color-text-subtle)]">
          Compare and evaluate model performance.
        </p>
        <EmptyState
          variant="card"
          icon={<IconChartBar size={48} stroke={1} />}
          title="No benchmarks found"
          description="Create your first benchmark to get started."
        />
      </VStack>
    </PageShell>
  );
}

export default BenchmarksPage;
