import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  EmptyState,
  PageShell,
} from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from './AiPlatformTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconSettings } from '@tabler/icons-react';

export function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Settings');
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
          breadcrumb={<Breadcrumb items={[{ label: 'Settings' }]} />}
          actions={<AiPlatformTopBarActions showSearch />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={6}>
        <HStack justify="between" align="center">
          <VStack gap={1}>
            <h1 className="text-heading-h3 text-[var(--color-text-default)]">Settings</h1>
            <p className="text-body-lg text-[var(--color-text-subtle)]">
              Configure AI Platform settings and preferences.
            </p>
          </VStack>
          <Button variant="secondary" size="sm" icon={<IconRefresh size={14} stroke={1.5} />}>
            Refresh
          </Button>
        </HStack>
        <EmptyState
          icon={<IconSettings size={48} stroke={1} />}
          title="Settings"
          description="Platform settings and configurations will appear here."
        />
      </VStack>
    </PageShell>
  );
}

export default SettingsPage;
