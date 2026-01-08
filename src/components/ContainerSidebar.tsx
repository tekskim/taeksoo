import { useState } from 'react';
import { VStack, MenuItem, MenuSection } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconAffiliate,
  IconServer,
  IconNetwork,
  IconDatabase,
  IconShieldLock,
  IconSettings,
  IconPlus,
  IconArrowLeft,
  IconChevronDown,
  IconApps,
  IconBox,
  IconClock,
  IconCalendarTime,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import containerIcon from '@/assets/container.png';

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
        ${active 
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

// Namespace selector component
function NamespaceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('default');

  return (
    <div className="px-3 py-4 border-b border-[var(--color-border-default)]">
      <label className="block text-[11px] font-bold text-[var(--color-text-default)] mb-1">
        Namespace
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded text-[11px] font-medium text-[var(--color-text-default)] hover:border-[var(--color-border-default)] transition-colors"
      >
        <span>{selected}</span>
        <IconChevronDown size={12} stroke={1.5} />
      </button>
    </div>
  );
}

export function ContainerSidebar({ isOpen = true, onToggle }: ContainerSidebarProps) {
  const { isDark } = useDarkMode();
  const location = useLocation();
  
  // Check if current path matches href
  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/container' && location.pathname.startsWith(href + '/')) return true;
    return false;
  };

  // Determine active icon section based on current route
  const getActiveIconSection = () => {
    const path = location.pathname;
    
    // Cluster section: Dashboard, Namespaces, Nodes, Events
    if (path === '/container' || 
        path.startsWith('/container/namespaces') || 
        path.startsWith('/container/nodes') || 
        path.startsWith('/container/events')) {
      return 'cluster';
    }
    
    // Workloads section: Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, Pods
    if (path.startsWith('/container/deployments') ||
        path.startsWith('/container/statefulsets') ||
        path.startsWith('/container/daemonsets') ||
        path.startsWith('/container/jobs') ||
        path.startsWith('/container/cronjobs') ||
        path.startsWith('/container/pods')) {
      return 'workloads';
    }
    
    return 'home';
  };

  const activeIconSection = getActiveIconSection();
  
  if (!isOpen) return null;

  return (
    <div className="flex h-screen fixed left-0 top-0">
      {/* Icon Sidebar (40px) */}
      <aside className="w-10 h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-subtle)] flex flex-col">
        {/* App Icon */}
        <div className="h-[33px] flex items-center justify-center border-b border-[var(--color-border-subtle)]">
          <img src={containerIcon} alt="Container" className="w-5 h-5" />
        </div>

        {/* Icon Navigation */}
        <div className="flex-1 flex flex-col items-center py-3 gap-0">
          <IconSidebarItem
            icon={<IconHome size={16} stroke={1.5} />}
            active={activeIconSection === 'home'}
            tooltip="Home"
          />
          <IconSidebarItem
            icon={<IconAffiliate size={16} stroke={1.5} />}
            active={activeIconSection === 'cluster'}
            tooltip="Cluster"
          />
          <IconSidebarItem
            icon={<IconAffiliate size={16} stroke={1.5} />}
            active={activeIconSection === 'workloads'}
            tooltip="Workloads"
          />
          <IconSidebarItem
            icon={<IconPlus size={16} stroke={1.5} />}
            active={false}
            tooltip="Add New"
          />
        </div>

        {/* Settings at bottom */}
        <div className="border-t border-[var(--color-border-subtle)] py-1 flex items-center justify-center">
          <IconSidebarItem
            icon={<IconSettings size={16} stroke={1.5} />}
            active={false}
            onClick={() => {}}
            tooltip="Settings"
          />
        </div>
      </aside>

      {/* Menu Sidebar (200px) */}
      <aside className="w-[200px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
        {/* Logo */}
        <div className="h-[33px] px-3 flex items-center">
          <img 
            src={isDark ? ThakiLogoDark : ThakiLogoLight} 
            alt="THAKI Cloud" 
            className="h-4"
          />
        </div>

        {/* Namespace Selector */}
        <NamespaceSelector />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden sidebar-scroll">
          <VStack gap={4} className="w-full min-w-0">
            {/* Back to All Services */}
            <Link
              to="/"
              className="w-[175px] px-[var(--menu-item-padding-x)] py-[var(--menu-item-padding-y)] rounded-[var(--menu-item-radius)] flex items-center gap-[var(--menu-item-gap)] text-[length:var(--font-size-11)] transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]"
            >
              <IconArrowLeft size={16} stroke={1.5} />
              <span>All Services</span>
            </Link>

            {/* Bookmarks */}
            <div className="py-2">
              <button className="flex items-center gap-2 px-0 py-1.5 text-[14px] font-semibold text-[var(--color-text-default)]">
                <IconChevronDown size={12} stroke={2} className="rotate-[-90deg]" />
                <span>Bookmarks</span>
              </button>
            </div>

            {/* Cluster Section */}
            <MenuSection title="Cluster" defaultOpen={true}>
              <MenuItem
                icon={<IconHome size={16} stroke={1.5} />}
                label="Dashboard"
                href="/container"
                active={isActive('/container')}
              />
              <MenuItem
                icon={<IconServer size={16} stroke={1.5} />}
                label="Namespaces"
                href="/container/namespaces"
                active={isActive('/container/namespaces')}
              />
              <MenuItem
                icon={<IconServer size={16} stroke={1.5} />}
                label="Nodes"
                href="/container/nodes"
                active={isActive('/container/nodes')}
              />
              <MenuItem
                icon={<IconDatabase size={16} stroke={1.5} />}
                label="Events"
                href="/container/events"
                active={isActive('/container/events')}
              />
            </MenuSection>

            {/* Workloads Section */}
            <MenuSection title="Workloads" defaultOpen={true}>
              <MenuItem
                icon={<IconServer size={16} stroke={1.5} />}
                label="Deployments"
                href="/container/deployments"
                active={isActive('/container/deployments')}
              />
              <MenuItem
                icon={<IconApps size={16} stroke={1.5} />}
                label="StatefulSets"
                href="/container/statefulsets"
                active={isActive('/container/statefulsets')}
              />
              <MenuItem
                icon={<IconDatabase size={16} stroke={1.5} />}
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

            {/* Service Discovery Section */}
            <MenuSection title="Service Discovery" defaultOpen={true}>
              <MenuItem
                icon={<IconNetwork size={16} stroke={1.5} />}
                label="Services"
                href="/container/services"
                active={isActive('/container/services')}
              />
              <MenuItem
                icon={<IconNetwork size={16} stroke={1.5} />}
                label="Ingresses"
                href="/container/ingresses"
                active={isActive('/container/ingresses')}
              />
              <MenuItem
                icon={<IconAffiliate size={16} stroke={1.5} />}
                label="Horizontal Pod Autoscalers"
                href="/container/hpa"
                active={isActive('/container/hpa')}
              />
            </MenuSection>

            {/* Storage Section */}
            <MenuSection title="Storage" defaultOpen={true}>
              <MenuItem
                icon={<IconDatabase size={16} stroke={1.5} />}
                label="Persistent Volumes"
                href="/container/persistent-volumes"
                active={isActive('/container/persistent-volumes')}
              />
              <MenuItem
                icon={<IconDatabase size={16} stroke={1.5} />}
                label="Persistent Volume Claims"
                href="/container/pvc"
                active={isActive('/container/pvc')}
              />
              <MenuItem
                icon={<IconDatabase size={16} stroke={1.5} />}
                label="Storage Classes"
                href="/container/storage-classes"
                active={isActive('/container/storage-classes')}
              />
              <MenuItem
                icon={<IconDatabase size={16} stroke={1.5} />}
                label="ConfigMaps"
                href="/container/configmaps"
                active={isActive('/container/configmaps')}
              />
              <MenuItem
                icon={<IconShieldLock size={16} stroke={1.5} />}
                label="Secrets"
                href="/container/secrets"
                active={isActive('/container/secrets')}
              />
            </MenuSection>

            {/* Policy Section */}
            <MenuSection title="Policy" defaultOpen={true}>
              <MenuItem
                icon={<IconShieldLock size={16} stroke={1.5} />}
                label="Limit Ranges"
                href="/container/limit-ranges"
                active={isActive('/container/limit-ranges')}
              />
              <MenuItem
                icon={<IconShieldLock size={16} stroke={1.5} />}
                label="Resource Quotas"
                href="/container/resource-quotas"
                active={isActive('/container/resource-quotas')}
              />
              <MenuItem
                icon={<IconShieldLock size={16} stroke={1.5} />}
                label="Network Policies"
                href="/container/network-policies"
                active={isActive('/container/network-policies')}
              />
              <MenuItem
                icon={<IconShieldLock size={16} stroke={1.5} />}
                label="Pod Disruption Budgets"
                href="/container/pdb"
                active={isActive('/container/pdb')}
              />
            </MenuSection>
          </VStack>
        </nav>

      </aside>
    </div>
  );
}

export default ContainerSidebar;

