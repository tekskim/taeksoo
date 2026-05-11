import { useState, useEffect } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  EmptyState,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconGitBranch } from '@tabler/icons-react';

export function DependenciesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Dependencies');
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
          breadcrumb={<Breadcrumb items={[{ label: 'Operations' }, { label: 'Dependencies' }]} />}
          actions={<AiPlatformTopBarActions showSearch />}
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-subtle)]"
    >
      <VStack gap={6}>
        <PageHeader
          title="Dependencies"
          actions={
            <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
              Refresh
            </Button>
          }
        />
        <EmptyState
          icon={<IconGitBranch size={48} stroke={1} />}
          title="Dependencies"
          description="System dependencies and integrations will appear here."
        />
      </VStack>
    </PageShell>
  );
}

export default DependenciesPage;
