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
import { IconBell, IconSearch, IconRefresh, IconBolt, IconPlus } from '@tabler/icons-react';

export function ServerlessPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Serverless');
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
              items={[
                { label: 'AI Platform' },
                { label: 'Infrastructure' },
                { label: 'Serverless' },
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
          title="Serverless"
          actions={
            <HStack gap={2}>
              <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
                Refresh
              </Button>
              <Button variant="primary" size="md" icon={<IconPlus size={12} stroke={1.5} />}>
                Create endpoint
              </Button>
            </HStack>
          }
        />
        <p className="text-body-lg text-[var(--color-text-subtle)]">
          Deploy serverless inference endpoints.
        </p>
        <EmptyState
          variant="card"
          icon={<IconBolt size={48} stroke={1} />}
          title="No serverless endpoints found"
          description="Create your first serverless endpoint to get started."
        />
      </VStack>
    </PageShell>
  );
}

export default ServerlessPage;
