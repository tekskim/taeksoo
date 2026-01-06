import { ReactNode, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconPalette } from '@tabler/icons-react';
import { AgentSidebar } from '@/pages/AgentPage';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AgentPageLayoutProps {
  /** Page title displayed in the header */
  title: string;
  /** Breadcrumb navigation items */
  breadcrumbItems: BreadcrumbItem[];
  /** Show navigation buttons (< >) in TopBar. Default: true */
  showNavigation?: boolean;
  /** Custom header actions (e.g., Create button) displayed on the right side of the title */
  headerActions?: ReactNode;
  /** Main page content */
  children: ReactNode;
  /** Custom TopBar actions (defaults to Bell and Design System icons) */
  topBarActions?: ReactNode;
  /** Custom sidebar component (defaults to AgentSidebar) */
  sidebar?: ReactNode;
  /** Custom content wrapper function for special layouts (e.g., ChatPage with sidebar) */
  contentWrapper?: (children: ReactNode) => ReactNode;
}

/* ----------------------------------------
   AgentPageLayout Component
   ---------------------------------------- */

/**
 * AgentPageLayout
 * 
 * Reusable layout component for Agent service pages.
 * Provides consistent structure with TabBar, TopBar, Sidebar, and content area.
 * 
 * @example
 * ```tsx
 * <AgentPageLayout
 *   title="Agent"
 *   breadcrumbItems={[{ label: 'Agent' }]}
 *   headerActions={<Button>Create agent</Button>}
 * >
 *   <div>Page content here</div>
 * </AgentPageLayout>
 * ```
 */
export function AgentPageLayout({
  title,
  breadcrumbItems,
  showNavigation = true,
  headerActions,
  children,
  topBarActions,
  sidebar,
  contentWrapper,
}: AgentPageLayoutProps) {
  const { tabs, activeTabId, selectTab, closeTab, addNewTab } = useTabs();
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

  // Default TopBar actions (Design System and Notifications - Bell should be rightmost)
  const defaultTopBarActions = useMemo(
    () => (
      <>
        <TopBarAction
          icon={<IconPalette size={16} stroke={1} />}
          onClick={() => navigate('/design-system')}
          aria-label="Design System"
        />
        <TopBarAction
          icon={<IconBell size={16} stroke={1} />}
          aria-label="Notifications"
          badge={true}
        />
      </>
    ),
    [navigate]
  );

  // Default sidebar component
  const defaultSidebar = useMemo(() => <AgentSidebar />, []);

  // Main content structure with header and children
  const mainContent = useMemo(
    () => (
      <div className="bg-[var(--color-surface-default)] flex flex-1 flex-col gap-6 pb-[120px] pt-6 px-8 w-full overflow-y-auto min-h-0">
        <div className="flex flex-col gap-6 items-start w-full">
          {/* Page Header */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center">
                <h4 className="font-['Mona_Sans:SemiBold',sans-serif] leading-7 not-italic text-[var(--color-text-default)] text-[18px]">
                  {title}
                </h4>
              </div>
            </div>
            {headerActions && (
              <div className="flex items-center gap-2">{headerActions}</div>
            )}
          </div>

          {/* Page Content */}
          <div className="flex flex-col gap-6 w-full">
            {children}
          </div>
        </div>
      </div>
    ),
    [title, headerActions, children]
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex w-full">
      {sidebar || defaultSidebar}

      <main className="flex flex-1 flex-col min-h-screen bg-[var(--color-surface-default)] ml-[62px]">
        <div className="w-full flex flex-col min-h-screen">
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
            onWindowClose={handleWindowClose}
          />

          <TopBar
            showSidebarToggle={false}
            showNavigation={showNavigation}
            canGoBack={false}
            canGoForward={false}
            onBack={() => {}}
            onForward={() => {}}
            breadcrumb={
              <Breadcrumb items={breadcrumbItems} />
            }
            actions={topBarActions || defaultTopBarActions}
          />

          {/* Main Content */}
          {contentWrapper ? contentWrapper(mainContent) : mainContent}
        </div>
      </main>
    </div>
  );
}

