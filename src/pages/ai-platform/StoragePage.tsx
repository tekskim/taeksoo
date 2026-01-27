import { useState, useEffect } from 'react';
import { VStack, HStack, TabBar, TopBar, Breadcrumb, Button } from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconSearch, IconRefresh, IconBox, IconPlus } from '@tabler/icons-react';

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-subtle)] p-16">
      <VStack gap={4} align="center">
        <div className="text-[var(--color-text-disabled)]">{icon}</div>
        <VStack gap={2} align="center">
          <span className="text-[16px] font-semibold text-[var(--color-text-default)]">
            {title}
          </span>
          <span className="text-[14px] text-[var(--color-text-subtle)]">{description}</span>
        </VStack>
      </VStack>
    </div>
  );
}

export function StoragePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  useEffect(() => {
    updateActiveTabLabel('Storage');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
              items={[{ label: 'AI Platform' }, { label: 'Infrastructure' }, { label: 'Storage' }]}
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
              <HStack justify="between" align="center">
                <VStack gap={1}>
                  <h1 className="text-[24px] font-semibold text-[var(--color-text-default)]">
                    Storage
                  </h1>
                  <p className="text-[14px] text-[var(--color-text-subtle)]">
                    Manage persistent storage volumes.
                  </p>
                </VStack>
                <HStack gap={2}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconRefresh size={14} stroke={1.5} />}
                  >
                    Refresh
                  </Button>
                  <Button variant="primary" size="sm" icon={<IconPlus size={14} stroke={1.5} />}>
                    Create storage
                  </Button>
                </HStack>
              </HStack>
              <EmptyState
                icon={<IconBox size={48} stroke={1} />}
                title="No storage volumes found"
                description="Create your first storage volume to get started."
              />
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StoragePage;
