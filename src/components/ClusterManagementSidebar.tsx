import { useState } from 'react';
import { VStack, MenuItem, MenuSection } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconAffiliate,
  IconPlus,
  IconArrowLeft,
  IconChevronDown,
  IconLayoutSidebar,
} from '@tabler/icons-react';
import { FolderCog } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import containerIcon from '@/assets/appIcon/container.png';

/* ----------------------------------------
   Cluster Management Sidebar Component
   Features dual-sidebar layout:
   - Icon sidebar (40px) on the left
   - Menu sidebar (200px) on the right
   ---------------------------------------- */

interface ClusterManagementSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// Icon sidebar item component
interface IconSidebarItemProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

function IconSidebarItem({ icon, active, onClick, tooltip }: IconSidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)]
        transition-colors duration-[var(--duration-fast)]
        ${
          active
            ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)]'
            : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]'
        }
      `}
      title={tooltip}
    >
      {icon}
    </button>
  );
}

// Sample clusters data for the sidebar
const clusters = [
  { id: 'cluster-001', name: 'Cluster1' },
  { id: 'cluster-002', name: 'ClusterName' },
  { id: 'cluster-003', name: 'production-cluster' },
];

export function ClusterManagementSidebar({
  isOpen = true,
  onToggle,
}: ClusterManagementSidebarProps) {
  const { isDark } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookmarksExpanded, setBookmarksExpanded] = useState(false);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Determine which icon section is active
  const getActiveIconSection = () => {
    const path = location.pathname;
    if (path.startsWith('/container/cluster-management')) {
      return 'cluster-management';
    }
    if (path.startsWith('/container/dashboard') || path.startsWith('/container/namespaces')) {
      return 'cluster';
    }
    if (path === '/container') {
      return 'home';
    }
    return 'cluster-management';
  };

  const activeIconSection = getActiveIconSection();

  return (
    <div className="flex h-screen fixed left-0 top-0">
      {/* Icon Sidebar (40px) - Always visible */}
      <aside className="w-[40px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-subtle)] flex flex-col">
        {/* App Icon */}
        <div className="h-[36px] flex items-center justify-center border-b border-[var(--color-border-subtle)]">
          <img src={containerIcon} alt="Container" className="w-[24px] h-[24px]" />
        </div>

        {/* Icon Navigation */}
        <div className="flex-1 flex flex-col items-center py-3 gap-0">
          <IconSidebarItem
            icon={<IconHome size={16} stroke={1.5} />}
            active={activeIconSection === 'home'}
            onClick={() => navigate('/container')}
            tooltip="Home"
          />
          <IconSidebarItem
            icon={<FolderCog size={16} strokeWidth={1.5} />}
            active={activeIconSection === 'cluster-management'}
            onClick={() => navigate('/container/cluster-management')}
            tooltip="Cluster management"
          />
          <IconSidebarItem
            icon={<IconAffiliate size={16} stroke={1.5} />}
            active={activeIconSection === 'cluster'}
            onClick={() => navigate('/container/dashboard')}
            tooltip="Cluster"
          />
          <IconSidebarItem
            icon={<IconPlus size={16} stroke={1.5} />}
            active={false}
            tooltip="Add new"
          />
        </div>
      </aside>

      {/* Menu Sidebar (200px) - Toggleable */}
      {isOpen && (
        <aside className="w-[200px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
          {/* Logo */}
          <div className="h-[33px] px-3 flex items-center justify-between">
            <img src={isDark ? ThakiLogoDark : ThakiLogoLight} alt="THAKI Cloud" className="h-4" />
            <button
              type="button"
              onClick={onToggle}
              className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <IconLayoutSidebar
                size={14}
                className="text-[var(--color-text-muted)] pointer-events-none"
                stroke={1.5}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden sidebar-scroll">
            <VStack gap={4} className="w-full min-w-0">
              {/* Back to All Services */}
              <Link
                to="/"
                className="w-[175px] px-[var(--menu-item-padding-x)] py-[var(--menu-item-padding-y)] rounded-[var(--menu-item-radius)] flex items-center gap-[var(--menu-item-gap)] text-[length:var(--font-size-11)] transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]"
              >
                <IconArrowLeft size={16} stroke={1.5} />
                <span>All services</span>
              </Link>

              {/* Bookmarks */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setBookmarksExpanded(!bookmarksExpanded)}
                  className="flex items-center gap-2 px-0 py-1.5 text-label-md text-[var(--color-text-default)]"
                >
                  <IconChevronDown
                    size={12}
                    stroke={2}
                    className={`transition-transform ${bookmarksExpanded ? '' : 'rotate-[-90deg]'}`}
                  />
                  <span>Bookmarks</span>
                </button>
                {bookmarksExpanded && (
                  <div className="mt-2 pl-4">
                    <p className="text-body-sm text-[var(--color-text-muted)]">No bookmarks yet</p>
                  </div>
                )}
              </div>

              {/* Cluster Management Section */}
              <MenuSection title="Cluster management" defaultOpen={true}>
                <MenuItem
                  icon={<FolderCog size={16} strokeWidth={1.5} />}
                  label="Clusters"
                  href="/container/cluster-management"
                  active={isActive('/container/cluster-management')}
                />
              </MenuSection>

              {/* Cluster Section */}
              <MenuSection title="Cluster" defaultOpen={true}>
                {clusters.map((cluster) => (
                  <MenuItem
                    key={cluster.id}
                    icon={<IconAffiliate size={16} stroke={1.5} />}
                    label={cluster.name}
                    href={`/container/cluster-management/${cluster.id}`}
                    active={isActive(`/container/cluster-management/${cluster.id}`)}
                  />
                ))}
              </MenuSection>
            </VStack>
          </nav>
        </aside>
      )}
    </div>
  );
}

export default ClusterManagementSidebar;
