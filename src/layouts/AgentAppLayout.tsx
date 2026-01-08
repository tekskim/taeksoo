import { ReactNode, useMemo, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { TabBar } from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
import { AgentSidebar } from '@/pages/AgentPage';

/* ----------------------------------------
   AgentAppLayout - Shared Layout for Agent Service
   ---------------------------------------- */

export interface AgentAppLayoutProps {
  children?: ReactNode;
}

/**
 * AgentAppLayout
 * 
 * Shared layout component for all Agent service pages.
 * Provides consistent TabBar, Sidebar structure across all pages.
 * 
 * The TabBar state is shared across all pages using TabContext.
 */
export function AgentAppLayout({ children }: AgentAppLayoutProps) {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const navigate = useNavigate();

  // Memoize tab bar tabs to prevent unnecessary re-renders
  const tabBarTabs = useMemo(
    () =>
      tabs.map((tab) => ({
        id: tab.id,
        label: tab.label,
        closable: tab.closable,
      })),
    [tabs]
  );

  // Handle window close - navigate to home
  const handleWindowClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--color-surface-subtle)] flex">
      <AgentSidebar />

      <main className="flex flex-1 flex-col h-full bg-[var(--color-surface-default)] ml-[62px] overflow-hidden">
        <div className="w-full flex flex-col h-full min-h-0">
          {/* Shared TabBar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
            onWindowClose={handleWindowClose}
          />

          {/* Page Content */}
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default AgentAppLayout;
