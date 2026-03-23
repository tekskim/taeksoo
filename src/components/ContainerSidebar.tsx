import { useRef, useEffect, useLayoutEffect } from 'react';
import { VStack, MenuItem, MenuSection } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconAffiliate,
  IconShieldLock,
  IconPlus,
  IconBox,
  IconClock,
  IconCalendarTime,
  IconLayoutSidebar,
  IconRocket,
  IconRefresh,
  IconStack3,
  IconFileSettings,
  IconKey,
  IconArrowsShuffle,
  IconDatabase,
  IconReorder,
  IconChartPie3,
  IconRulerMeasure,
  IconLayoutDashboard,
  IconCopy,
  IconActivity,
  IconApps,
} from '@tabler/icons-react';
import { FolderCog, HardDrive, Scaling, Group, Network } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import containerIcon from '@/assets/appIcon/container.png';

/* ----------------------------------------
   Container Sidebar Component
   Features dual-sidebar layout:
   - Icon sidebar (40px) on the left
   - Menu sidebar (200px) on the right
   ---------------------------------------- */

interface ContainerSidebarProps {
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

// Store scroll position outside component to persist across re-renders
let savedScrollPosition = 0;

export function ContainerSidebar({ isOpen = true, onToggle }: ContainerSidebarProps) {
  const { isDark } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  // Restore scroll position after route change - use useLayoutEffect for synchronous update
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (nav && savedScrollPosition > 0) {
      nav.scrollTop = savedScrollPosition;
    }
  });

  // Also restore on mount with a slight delay as backup
  useEffect(() => {
    const nav = navRef.current;
    if (nav && savedScrollPosition > 0) {
      // Immediate restore
      nav.scrollTop = savedScrollPosition;
      // Backup restore after a short delay
      const timeoutId = setTimeout(() => {
        if (nav) nav.scrollTop = savedScrollPosition;
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Save scroll position on scroll
  const handleNavScroll = (e: React.UIEvent<HTMLElement>) => {
    savedScrollPosition = e.currentTarget.scrollTop;
  };

  // Check if current path matches href
  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (
      href !== '/container' &&
      href !== '/container/dashboard' &&
      location.pathname.startsWith(href + '/')
    )
      return true;
    return false;
  };

  // Determine active icon section based on current route
  const getActiveIconSection = () => {
    const path = location.pathname;

    // Home - exact match for /container
    if (path === '/container') {
      return 'home';
    }

    // Cluster section: Dashboard, Namespaces, Nodes, Events, AND Workloads (Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, Pods)
    if (
      path === '/container/dashboard' ||
      path.startsWith('/container/namespaces') ||
      path.startsWith('/container/nodes') ||
      path.startsWith('/container/events') ||
      path.startsWith('/container/deployments') ||
      path.startsWith('/container/statefulsets') ||
      path.startsWith('/container/daemonsets') ||
      path.startsWith('/container/jobs') ||
      path.startsWith('/container/cronjobs') ||
      path.startsWith('/container/pods')
    ) {
      return 'cluster';
    }

    return 'cluster';
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
            active={location.pathname.startsWith('/container/cluster-management')}
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
            icon={<IconAffiliate size={16} stroke={1.5} />}
            active={false}
            onClick={() => {}}
            tooltip="Cluster"
          />
          <IconSidebarItem
            icon={<IconPlus size={16} stroke={1.5} />}
            active={false}
            tooltip="Add new"
          />
        </div>
      </aside>

      {/* Menu Sidebar (200px) - Toggleable, hidden on Home page */}
      {isOpen && activeIconSection !== 'home' && (
        <aside className="w-[200px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
          {/* Logo */}
          <div className="h-[33px] px-3 flex items-center justify-between">
            <span className="text-label-lg text-[var(--color-text-default)]">Container</span>
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
          <nav
            ref={navRef}
            onScroll={handleNavScroll}
            className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden sidebar-scroll"
          >
            <VStack gap={4} className="w-full min-w-0">
              {/* Cluster Section */}
              <MenuSection title="Cluster" defaultOpen={true}>
                <MenuItem
                  icon={<IconLayoutDashboard size={16} stroke={1.5} />}
                  label="Dashboard"
                  href="/container/dashboard"
                  active={isActive('/container/dashboard')}
                />
                <MenuItem
                  icon={<IconCopy size={16} stroke={1.5} />}
                  label="Namespaces"
                  href="/container/namespaces"
                  active={isActive('/container/namespaces')}
                />
                <MenuItem
                  icon={<IconAffiliate size={16} stroke={1.5} />}
                  label="Nodes"
                  href="/container/nodes"
                  active={isActive('/container/nodes')}
                />
                <MenuItem
                  icon={<IconActivity size={16} stroke={1.5} />}
                  label="Events"
                  href="/container/events"
                  active={isActive('/container/events')}
                />
              </MenuSection>

              {/* Workloads Section */}
              <MenuSection title="Workloads" defaultOpen={true}>
                <MenuItem
                  icon={<IconRocket size={16} stroke={1.5} />}
                  label="Deployments"
                  href="/container/deployments"
                  active={isActive('/container/deployments')}
                />
                <MenuItem
                  icon={<Group size={16} strokeWidth={1.5} />}
                  label="StatefulSets"
                  href="/container/statefulsets"
                  active={isActive('/container/statefulsets')}
                />
                <MenuItem
                  icon={<IconRefresh size={16} stroke={1.5} />}
                  label="DaemonSets"
                  href="/container/daemonsets"
                  active={isActive('/container/daemonsets')}
                />
                <MenuItem
                  icon={<IconClock size={16} stroke={1.5} />}
                  label="Jobs"
                  href="/container/jobs"
                  active={isActive('/container/jobs')}
                />
                <MenuItem
                  icon={<IconCalendarTime size={16} stroke={1.5} />}
                  label="CronJobs"
                  href="/container/cronjobs"
                  active={isActive('/container/cronjobs')}
                />
                <MenuItem
                  icon={<IconBox size={16} stroke={1.5} />}
                  label="Pods"
                  href="/container/pods"
                  active={isActive('/container/pods')}
                />
              </MenuSection>

              {/* App Catalog Section */}
              <MenuSection title="App Catalog" defaultOpen={true}>
                <MenuItem
                  icon={<IconApps size={16} stroke={1.5} />}
                  label="Catalog"
                  href="/container/apps/catalog"
                  active={isActive('/container/apps/catalog')}
                />
                <MenuItem
                  icon={<IconApps size={16} stroke={1.5} />}
                  label="Installed Apps"
                  href="/container/apps/installed-apps"
                  active={isActive('/container/apps/installed-apps')}
                />
              </MenuSection>

              {/* Service Discovery Section */}
              <MenuSection title="Service discovery" defaultOpen={true}>
                <MenuItem
                  icon={<Network size={16} strokeWidth={1.5} />}
                  label="Services"
                  href="/container/services"
                  active={isActive('/container/services')}
                />
                <MenuItem
                  icon={<IconArrowsShuffle size={16} stroke={1.5} />}
                  label="Ingresses"
                  href="/container/ingresses"
                  active={isActive('/container/ingresses')}
                />
                <MenuItem
                  icon={<Scaling size={16} strokeWidth={1.5} />}
                  label="Horizontal pod autoscalers"
                  href="/container/hpa"
                  active={isActive('/container/hpa')}
                />
              </MenuSection>

              {/* Storage Section */}
              <MenuSection title="Storage" defaultOpen={true}>
                <MenuItem
                  icon={<HardDrive size={16} strokeWidth={1.5} />}
                  label="Persistent volumes"
                  href="/container/persistent-volumes"
                  active={isActive('/container/persistent-volumes')}
                />
                <MenuItem
                  icon={<IconDatabase size={16} stroke={1.5} />}
                  label="Persistent volume claims"
                  href="/container/pvc"
                  active={isActive('/container/pvc')}
                />
                <MenuItem
                  icon={<IconStack3 size={16} stroke={1.5} />}
                  label="Storage classes"
                  href="/container/storage-classes"
                  active={isActive('/container/storage-classes')}
                />
                <MenuItem
                  icon={<IconFileSettings size={16} stroke={1.5} />}
                  label="ConfigMaps"
                  href="/container/configmaps"
                  active={isActive('/container/configmaps')}
                />
                <MenuItem
                  icon={<IconKey size={16} stroke={1.5} />}
                  label="Secrets"
                  href="/container/secrets"
                  active={isActive('/container/secrets')}
                />
              </MenuSection>

              {/* Policy Section */}
              <MenuSection title="Policy" defaultOpen={true}>
                <MenuItem
                  icon={<IconRulerMeasure size={16} stroke={1.5} />}
                  label="Limit ranges"
                  href="/container/limit-ranges"
                  active={isActive('/container/limit-ranges')}
                />
                <MenuItem
                  icon={<IconChartPie3 size={16} stroke={1.5} />}
                  label="Resource quotas"
                  href="/container/resource-quotas"
                  active={isActive('/container/resource-quotas')}
                />
                <MenuItem
                  icon={<IconShieldLock size={16} stroke={1.5} />}
                  label="Network policies"
                  href="/container/network-policies"
                  active={isActive('/container/network-policies')}
                />
                <MenuItem
                  icon={<IconReorder size={16} stroke={1.5} />}
                  label="Pod disruption budgets"
                  href="/container/pdb"
                  active={isActive('/container/pdb')}
                />
              </MenuSection>
            </VStack>
          </nav>
        </aside>
      )}
    </div>
  );
}

export default ContainerSidebar;
