import { ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { IconBell, IconPalette } from '@tabler/icons-react';

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
  /** Custom sidebar component - no longer used, kept for backward compatibility */
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
 * Provides consistent structure with TopBar and content area.
 * 
 * Note: TabBar and Sidebar are now provided by AgentAppLayout wrapper.
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
  contentWrapper,
}: AgentPageLayoutProps) {
  const navigate = useNavigate();

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

  // Main content structure with header and children
  const mainContent = useMemo(
    () => (
      <div className="bg-[var(--color-surface-default)] flex flex-1 flex-col gap-6 pb-[120px] pt-6 px-8 w-full overflow-y-auto min-h-0 min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
        <div className="flex flex-col gap-6 items-start w-full">
          {/* Page Header */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center">
                <h4 className="font-semibold text-[length:var(--font-size-18)] leading-[var(--line-height-28)] text-[var(--color-text-default)]">
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
    <>
          <TopBar
            showSidebarToggle={false}
            showNavigation={showNavigation}
            canGoBack={false}
            canGoForward={false}
            onBack={() => {}}
            onForward={() => {}}
            breadcrumb={
              <Breadcrumb 
                items={[
                  { label: 'Home', href: '/agent' },
                  ...breadcrumbItems
                ]} 
              />
            }
            actions={topBarActions || defaultTopBarActions}
          />

          {/* Main Content */}
          {contentWrapper ? contentWrapper(mainContent) : mainContent}
    </>
  );
}

