import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { VStack, MenuItem, MenuSection } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconAffiliate,
  IconServer,
  IconNetwork,
  IconShieldLock,
  IconPlus,
  IconArrowLeft,
  IconChevronDown,
  IconApps,
  IconBox,
  IconClock,
  IconCalendarTime,
  IconSearch,
  IconCheck,
  IconLayoutSidebar,
  IconFolders,
  IconBell,
  IconRocket,
  IconRefresh,
  IconStack3,
  IconFileSettings,
  IconKey,
  IconRuler,
  IconScale,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { ArrowRightLeft, FolderCog, HardDrive, FileCheck2, LogIn, Scaling } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

// Namespace data type
interface Namespace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status?: 'Active' | 'Terminating';
}

// Sample namespaces data
const namespaces: Namespace[] = [
  { id: 'default', name: 'default', description: 'Default namespace for cluster resources', createdAt: '2025-01-01', status: 'Active' },
  { id: 'kube-system', name: 'kube-system', description: 'Kubernetes system components', createdAt: '2025-01-01', status: 'Active' },
  { id: 'kube-public', name: 'kube-public', description: 'Public cluster information', createdAt: '2025-01-01', status: 'Active' },
  { id: 'monitoring', name: 'monitoring', description: 'Monitoring stack (Prometheus, Grafana)', createdAt: '2025-02-15', status: 'Active' },
  { id: 'logging', name: 'logging', description: 'Logging infrastructure (ELK stack)', createdAt: '2025-02-20', status: 'Active' },
  { id: 'production', name: 'production', description: 'Production workloads', createdAt: '2025-03-01', status: 'Active' },
  { id: 'staging', name: 'staging', description: 'Staging environment for testing', createdAt: '2025-03-05', status: 'Active' },
  { id: 'development', name: 'development', description: 'Development environment', createdAt: '2025-03-10', status: 'Active' },
];

// Namespace selector component
function NamespaceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(['default']);
  const [allSelected, setAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter namespaces by search query
  const filteredNamespaces = namespaces.filter(
    (ns) =>
      ns.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ns.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleNamespaceClick = (ns: Namespace) => {
    if (allSelected) {
      // If all namespaces are selected, clicking one deselects all others and selects only this one
      setAllSelected(false);
      setSelectedIds([ns.id]);
    } else {
      setSelectedIds((prev) => {
        if (prev.includes(ns.id)) {
          // Deselect - but keep at least one selected
          const newSelected = prev.filter((id) => id !== ns.id);
          return newSelected.length > 0 ? newSelected : prev;
        } else {
          // Select
          return [...prev, ns.id];
        }
      });
    }
  };

  const handleAllNamespacesClick = () => {
    setAllSelected(!allSelected);
    if (!allSelected) {
      setSelectedIds(namespaces.map((ns) => ns.id));
    } else {
      setSelectedIds(['default']);
    }
  };

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0, width: 280 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 280),
    };
  };

  // Get display text for button
  const getButtonText = () => {
    if (allSelected) {
      return 'All Namespaces';
    }
    if (selectedIds.length === 1) {
      const ns = namespaces.find((n) => n.id === selectedIds[0]);
      return ns?.name || 'Select Namespace';
    }
    return `${selectedIds.length} items selected`;
  };

  return (
    <div className="px-3 py-4 border-b border-[var(--color-border-default)]">
      <label className="block text-[11px] font-bold text-[var(--color-text-default)] mb-1">
        Namespace
      </label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2.5 py-1.5 rounded-md bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-between"
      >
        <span className="text-[11px] font-medium text-[var(--color-text-default)]">{getButtonText()}</span>
        <ArrowRightLeft size={12} className="text-[var(--color-text-default)] shrink-0" strokeWidth={1.5} />
      </button>

      {/* Dropdown Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg p-3 flex flex-col gap-2"
            style={{
              top: getDropdownPosition().top,
              left: getDropdownPosition().left,
              width: getDropdownPosition().width,
              maxHeight: '400px',
            }}
          >
            {/* Search Input */}
            <div className="flex items-center justify-between px-2.5 py-1.5 border border-[var(--color-border-strong)] rounded-md bg-[var(--color-surface-default)]">
              <input
                type="text"
                placeholder="Search namespaces"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[11px] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] outline-none"
                autoFocus
              />
              <IconSearch size={12} className="text-[var(--color-text-muted)]" />
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-border-default)]" />

            {/* All Namespaces Checkbox */}
            <button
              type="button"
              onClick={handleAllNamespacesClick}
              className="flex items-center gap-1.5 py-1"
            >
              <div className={`
                w-4 h-4 rounded flex items-center justify-center border-2 transition-colors
                ${allSelected
                  ? 'bg-[var(--color-action-primary)] border-[var(--color-action-primary)]'
                  : 'bg-white border-[var(--color-border-default)]'
                }
              `}>
                {allSelected && (
                  <IconCheck size={12} className="text-white" stroke={2} />
                )}
              </div>
              <span className="text-[12px] text-[var(--color-text-default)]">All Namespaces</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-[var(--color-border-default)]" />

            {/* Namespace List */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] sidebar-scroll">
              {filteredNamespaces.map((ns) => {
                const isSelected = selectedIds.includes(ns.id);

                return (
                  <button
                    key={ns.id}
                    onClick={() => handleNamespaceClick(ns)}
                    className={`
                      w-full text-left px-3 py-2 rounded-md border transition-colors
                      ${
                        isSelected
                          ? 'border-2 border-[var(--color-action-primary)] bg-[var(--color-surface-default)]'
                          : 'border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)]'
                      }
                      cursor-pointer
                    `}
                  >
                    <div className="flex flex-col gap-1.5">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                          {ns.name}
                        </span>
                      </div>

                      {/* Footer - only date */}
                      <div className="text-[10px] text-[var(--color-text-subtle)]">
                        {ns.createdAt}
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredNamespaces.length === 0 && (
                <div className="text-center py-4 text-[11px] text-[var(--color-text-muted)]">
                  No namespaces found
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export function ContainerSidebar({ isOpen = true, onToggle }: ContainerSidebarProps) {
  const { isDark } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if current path matches href
  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/container' && href !== '/container/dashboard' && location.pathname.startsWith(href + '/')) return true;
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
    if (path === '/container/dashboard' || 
        path.startsWith('/container/namespaces') || 
        path.startsWith('/container/nodes') || 
        path.startsWith('/container/events') ||
        path.startsWith('/container/deployments') ||
        path.startsWith('/container/statefulsets') ||
        path.startsWith('/container/daemonsets') ||
        path.startsWith('/container/jobs') ||
        path.startsWith('/container/cronjobs') ||
        path.startsWith('/container/pods')) {
      return 'cluster';
    }
    
    return 'cluster';
  };

  const activeIconSection = getActiveIconSection();

  return (
    <div className="flex h-screen fixed left-0 top-0">
      {/* Icon Sidebar (40px) - Always visible */}
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
            onClick={() => navigate('/container')}
            tooltip="Home"
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
            tooltip="Add New"
          />
        </div>

        {/* Toggle button at bottom when menu sidebar is closed */}
        {!isOpen && (
          <div className="border-t border-[var(--color-border-subtle)] py-1 flex items-center justify-center">
            <button 
              type="button"
              onClick={onToggle}
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]"
              aria-label="Toggle sidebar"
            >
              <IconLayoutSidebar size={16} stroke={1.5} />
            </button>
          </div>
        )}

        {/* Settings at bottom */}
        <div className="border-t border-[var(--color-border-subtle)] py-1 flex items-center justify-center">
          <IconSidebarItem
            icon={<FolderCog size={16} strokeWidth={1.5} />}
            active={false}
            onClick={() => {}}
            tooltip="Settings"
          />
        </div>
      </aside>

      {/* Menu Sidebar (200px) - Toggleable */}
      {isOpen && (
        <aside className="w-[200px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
          {/* Logo */}
          <div className="h-[33px] px-3 flex items-center justify-between">
            <img 
              src={isDark ? ThakiLogoDark : ThakiLogoLight} 
              alt="THAKI Cloud" 
              className="h-4"
            />
            <button 
              type="button"
              onClick={onToggle}
              className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <IconLayoutSidebar size={16} className="text-[var(--color-text-muted)] pointer-events-none" stroke={1.5} />
            </button>
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
                href="/container/dashboard"
                active={isActive('/container/dashboard')}
              />
              <MenuItem
                icon={<IconFolders size={16} stroke={1.5} />}
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
                icon={<IconBell size={16} stroke={1.5} />}
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
                icon={<IconApps size={16} stroke={1.5} />}
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

            {/* Service Discovery Section */}
            <MenuSection title="Service discovery" defaultOpen={true}>
              <MenuItem
                icon={<IconNetwork size={16} stroke={1.5} />}
                label="Services"
                href="/container/services"
                active={isActive('/container/services')}
              />
              <MenuItem
                icon={<LogIn size={16} strokeWidth={1.5} />}
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
                icon={<FileCheck2 size={16} strokeWidth={1.5} />}
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
                icon={<IconRuler size={16} stroke={1.5} />}
                label="Limit ranges"
                href="/container/limit-ranges"
                active={isActive('/container/limit-ranges')}
              />
              <MenuItem
                icon={<IconScale size={16} stroke={1.5} />}
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
                icon={<IconAlertTriangle size={16} stroke={1.5} />}
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

