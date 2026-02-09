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
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconSearch, IconRefresh, IconSettings } from '@tabler/icons-react';

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
          breadcrumb={<Breadcrumb items={[{ label: 'AI Platform' }, { label: 'Settings' }]} />}
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
      contentClassName="pt-3 px-8 pb-20"
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
