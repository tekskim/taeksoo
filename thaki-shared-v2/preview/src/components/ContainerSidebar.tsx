import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarMenu } from '@shared/components/Sidebar';
import type { SidebarSection, SidebarIconComponent } from '@shared/components/Sidebar';
import ContainerIcon from '../assets/appIcon/container.png';
import {
  IconHome,
  IconApps,
  IconPackage,
  IconAffiliate,
  IconPlus,
  IconChevronDown,
  IconSearch,
  IconCheck,
  IconLayoutSidebar,
  IconFolders,
  IconRocket,
  IconRefresh,
  IconStack3,
  IconFileSettings,
  IconKey,
  IconTopologyStar,
  IconTimelineEvent,
  IconArrowsShuffle,
  IconDatabase,
  IconReorder,
  IconChartPie3,
  IconRulerMeasure,
  IconBox,
  IconClock,
  IconCalendarTime,
  IconShieldLock,
} from '@tabler/icons-react';
import { ArrowRightLeft, FolderCog, HardDrive, Scaling, Group, Network } from 'lucide-react';

/* ----------------------------------------
   Icon sidebar item (left 40px strip)
   ---------------------------------------- */
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
        w-8 h-8 flex items-center justify-center rounded-md
        transition-colors duration-150 border-none cursor-pointer
        ${active ? 'bg-info-weak-bg text-primary' : 'bg-transparent text-text hover:bg-surface-hover'}
      `}
      title={tooltip}
    >
      {icon}
    </button>
  );
}

/* ----------------------------------------
   Namespace selector (portal dropdown)
   ---------------------------------------- */
interface Namespace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status?: 'Active' | 'Terminating';
}

const namespaces: Namespace[] = [
  {
    id: 'default',
    name: 'default',
    description: 'Default namespace for cluster resources',
    createdAt: 'Jan 1, 2025 10:20:28',
    status: 'Active',
  },
  {
    id: 'kube-system',
    name: 'kube-system',
    description: 'Kubernetes system components',
    createdAt: 'Jan 1, 2025 10:20:28',
    status: 'Active',
  },
  {
    id: 'kube-public',
    name: 'kube-public',
    description: 'Public cluster information',
    createdAt: 'Jan 1, 2025 10:20:28',
    status: 'Active',
  },
  {
    id: 'monitoring',
    name: 'monitoring',
    description: 'Monitoring stack (Prometheus, Grafana)',
    createdAt: 'Feb 15, 2025 12:22:26',
    status: 'Active',
  },
  {
    id: 'logging',
    name: 'logging',
    description: 'Logging infrastructure (ELK stack)',
    createdAt: 'Feb 20, 2025 23:27:51',
    status: 'Active',
  },
  {
    id: 'production',
    name: 'production',
    description: 'Production workloads',
    createdAt: 'Mar 1, 2025 10:20:28',
    status: 'Active',
  },
  {
    id: 'staging',
    name: 'staging',
    description: 'Staging environment for testing',
    createdAt: 'Mar 5, 2025 14:12:36',
    status: 'Active',
  },
  {
    id: 'development',
    name: 'development',
    description: 'Development environment',
    createdAt: 'Mar 10, 2025 01:17:01',
    status: 'Active',
  },
];

function NamespaceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(['default']);
  const [allSelected, setAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredNamespaces = namespaces.filter(
    (ns) =>
      ns.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ns.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleNamespaceClick = (ns: Namespace) => {
    if (allSelected) {
      setAllSelected(false);
      setSelectedIds([ns.id]);
    } else {
      setSelectedIds((prev) => {
        if (prev.includes(ns.id)) {
          const next = prev.filter((id) => id !== ns.id);
          return next.length > 0 ? next : prev;
        }
        return [...prev, ns.id];
      });
    }
  };

  const handleAllNamespacesClick = () => {
    if (!allSelected) {
      setAllSelected(true);
      setSelectedIds(namespaces.map((ns) => ns.id));
    } else {
      setAllSelected(false);
      setSelectedIds(['default']);
    }
  };

  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0, width: 280 };
    const rect = buttonRef.current.getBoundingClientRect();
    return { top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 280) };
  };

  const getButtonText = () => {
    if (allSelected) return 'All namespaces';
    if (selectedIds.length === 1) {
      const ns = namespaces.find((n) => n.id === selectedIds[0]);
      return ns?.name || 'Select namespace';
    }
    return `${selectedIds.length} items selected`;
  };

  return (
    <div className="px-3 py-4 border-b border-border">
      <label className="block text-[11px] font-medium leading-4 text-text mb-1">Namespace</label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2.5 py-1.5 rounded-md bg-surface-subtle hover:bg-surface-hover transition-colors flex items-center justify-between border-none cursor-pointer"
      >
        <span className="text-[11px] font-medium text-text">{getButtonText()}</span>
        <ArrowRightLeft size={12} className="text-text shrink-0" strokeWidth={1.5} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] bg-surface border border-border rounded-lg shadow-lg p-3 flex flex-col gap-2"
            style={{
              top: getDropdownPosition().top,
              left: getDropdownPosition().left,
              width: getDropdownPosition().width,
              maxHeight: '400px',
            }}
          >
            <div className="flex items-center justify-between px-2.5 py-1.5 border border-border-strong rounded-md bg-surface">
              <input
                type="text"
                placeholder="Search namespaces"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[11px] text-text placeholder:text-text-muted outline-none border-none"
                autoFocus
              />
              <IconSearch size={12} className="text-text-muted" />
            </div>

            <div className="h-px bg-border" />

            <button
              type="button"
              onClick={handleAllNamespacesClick}
              className="flex items-center gap-1.5 py-1 bg-transparent border-none cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-colors ${
                  allSelected ? 'bg-primary border-primary' : 'bg-white border-border'
                }`}
              >
                {allSelected && <IconCheck size={12} className="text-white" stroke={2} />}
              </div>
              <span className="text-[12px] text-text">All namespaces</span>
            </button>

            <div className="h-px bg-border" />

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px]">
              {filteredNamespaces.map((ns) => {
                const isSelected = selectedIds.includes(ns.id);
                return (
                  <button
                    key={ns.id}
                    onClick={() => handleNamespaceClick(ns)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-2 border-primary bg-surface'
                        : 'border border-border bg-surface hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-medium text-text">{ns.name}</span>
                      <span className="text-[10px] text-text-subtle">{ns.createdAt}</span>
                    </div>
                  </button>
                );
              })}
              {filteredNamespaces.length === 0 && (
                <div className="text-center py-4 text-[11px] text-text-muted">
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

/* ----------------------------------------
   SidebarMenu icon adapters
   ---------------------------------------- */
function makeTablerIcon(
  TablerIcon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>
): SidebarIconComponent {
  const Wrapped: SidebarIconComponent = ({
    variant,
    size,
  }: {
    variant?: string;
    size?: number;
  }) => {
    const colorClass = variant === 'primary' ? 'text-primary' : 'text-text-muted';
    return <TablerIcon size={size ?? 16} stroke={1.5} className={colorClass} />;
  };
  return Wrapped;
}

function makeLucideIcon(
  LucideIcon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
): SidebarIconComponent {
  const Wrapped: SidebarIconComponent = ({
    variant,
    size,
  }: {
    variant?: string;
    size?: number;
  }) => {
    const colorClass = variant === 'primary' ? 'text-primary' : 'text-text-muted';
    return <LucideIcon size={size ?? 16} strokeWidth={1.5} className={colorClass} />;
  };
  return Wrapped;
}

const DashboardIconW = makeTablerIcon(IconHome);
const NamespacesIconW = makeTablerIcon(IconFolders);
const NodesIconW = makeTablerIcon(IconTopologyStar);
const EventsIconW = makeTablerIcon(IconTimelineEvent);
const DeploymentsIconW = makeTablerIcon(IconRocket);
const StatefulSetsIconW = makeLucideIcon(Group);
const DaemonSetsIconW = makeTablerIcon(IconRefresh);
const JobsIconW = makeTablerIcon(IconClock);
const CronJobsIconW = makeTablerIcon(IconCalendarTime);
const PodsIconW = makeTablerIcon(IconBox);
const ServicesIconW = makeLucideIcon(Network);
const IngressesIconW = makeTablerIcon(IconArrowsShuffle);
const HPAIconW = makeLucideIcon(Scaling);
const PVIconW = makeLucideIcon(HardDrive);
const PVCIconW = makeTablerIcon(IconDatabase);
const StorageClassIconW = makeTablerIcon(IconStack3);
const ConfigMapIconW = makeTablerIcon(IconFileSettings);
const SecretIconW = makeTablerIcon(IconKey);
const LimitRangeIconW = makeTablerIcon(IconRulerMeasure);
const ResourceQuotaIconW = makeTablerIcon(IconChartPie3);
const NetworkPolicyIconW = makeTablerIcon(IconShieldLock);
const PDBIconW = makeTablerIcon(IconReorder);
const CatalogIconW = makeTablerIcon(IconApps);
const InstalledAppsIconW = makeTablerIcon(IconPackage);

const sections: SidebarSection[] = [
  {
    id: 'cluster',
    label: 'Cluster',
    children: [
      { id: 'dashboard', label: 'Dashboard', path: '/container/dashboard', icon: DashboardIconW },
      {
        id: 'namespaces',
        label: 'Namespaces',
        path: '/container/namespaces',
        icon: NamespacesIconW,
      },
      { id: 'nodes', label: 'Nodes', path: '/container/nodes', icon: NodesIconW },
      { id: 'events', label: 'Events', path: '/container/events', icon: EventsIconW },
    ],
  },
  {
    id: 'workloads',
    label: 'Workloads',
    children: [
      {
        id: 'deployments',
        label: 'Deployments',
        path: '/container/deployments',
        icon: DeploymentsIconW,
      },
      {
        id: 'statefulsets',
        label: 'StatefulSets',
        path: '/container/statefulsets',
        icon: StatefulSetsIconW,
      },
      {
        id: 'daemonsets',
        label: 'DaemonSets',
        path: '/container/daemonsets',
        icon: DaemonSetsIconW,
      },
      { id: 'jobs', label: 'Jobs', path: '/container/jobs', icon: JobsIconW },
      { id: 'cronjobs', label: 'CronJobs', path: '/container/cronjobs', icon: CronJobsIconW },
      { id: 'pods', label: 'Pods', path: '/container/pods', icon: PodsIconW },
    ],
  },
  {
    id: 'app-catalog',
    label: 'App Catalog',
    children: [
      { id: 'catalog', label: 'Catalog', path: '/container/catalog', icon: CatalogIconW },
      {
        id: 'installed-apps',
        label: 'Installed Apps',
        path: '/container/installed-apps',
        icon: InstalledAppsIconW,
      },
    ],
  },
  {
    id: 'service-discovery',
    label: 'Service discovery',
    children: [
      { id: 'services', label: 'Services', path: '/container/services', icon: ServicesIconW },
      { id: 'ingresses', label: 'Ingresses', path: '/container/ingresses', icon: IngressesIconW },
      { id: 'hpa', label: 'Horizontal pod autoscalers', path: '/container/hpa', icon: HPAIconW },
    ],
  },
  {
    id: 'storage',
    label: 'Storage',
    children: [
      {
        id: 'persistent-volumes',
        label: 'Persistent volumes',
        path: '/container/persistent-volumes',
        icon: PVIconW,
      },
      { id: 'pvc', label: 'Persistent volume claims', path: '/container/pvc', icon: PVCIconW },
      {
        id: 'storage-classes',
        label: 'Storage classes',
        path: '/container/storage-classes',
        icon: StorageClassIconW,
      },
      {
        id: 'configmaps',
        label: 'ConfigMaps',
        path: '/container/configmaps',
        icon: ConfigMapIconW,
      },
      { id: 'secrets', label: 'Secrets', path: '/container/secrets', icon: SecretIconW },
    ],
  },
  {
    id: 'policy',
    label: 'Policy',
    children: [
      {
        id: 'limit-ranges',
        label: 'Limit ranges',
        path: '/container/limit-ranges',
        icon: LimitRangeIconW,
      },
      {
        id: 'resource-quotas',
        label: 'Resource quotas',
        path: '/container/resource-quotas',
        icon: ResourceQuotaIconW,
      },
      {
        id: 'network-policies',
        label: 'Network policies',
        path: '/container/network-policies',
        icon: NetworkPolicyIconW,
      },
      { id: 'pdb', label: 'Pod disruption budgets', path: '/container/pdb', icon: PDBIconW },
    ],
  },
];

const defaultOpenSections = ['cluster', 'workloads', 'service-discovery', 'storage', 'policy'];

/* ----------------------------------------
   Cluster management menu sections
   ---------------------------------------- */
const ClusterMgmtIconW = makeLucideIcon(FolderCog);
const ClusterIconW = makeTablerIcon(IconAffiliate);

const clusters = [
  { id: 'cluster-001', name: 'Cluster1' },
  { id: 'cluster-002', name: 'ClusterName' },
  { id: 'cluster-003', name: 'production-cluster' },
];

const clusterMgmtSections: SidebarSection[] = [
  {
    id: 'cluster-management',
    label: 'Cluster management',
    children: [
      {
        id: 'clusters',
        label: 'Clusters',
        path: '/container/cluster-management',
        icon: ClusterMgmtIconW,
      },
    ],
  },
  {
    id: 'cluster-list',
    label: 'Cluster',
    children: clusters.map((c) => ({
      id: c.id,
      label: c.name,
      path: `/container/cluster-management/${c.id}`,
      icon: ClusterIconW,
    })),
  },
];

const clusterMgmtDefaultOpen = ['cluster-management', 'cluster-list'];

/* ----------------------------------------
   Main ContainerSidebar
   ---------------------------------------- */
export interface ContainerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

let savedScrollPosition = 0;

export function ContainerSidebar({ isOpen, onToggle }: ContainerSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (nav && savedScrollPosition > 0) nav.scrollTop = savedScrollPosition;
  });

  useEffect(() => {
    const nav = navRef.current;
    if (nav && savedScrollPosition > 0) {
      nav.scrollTop = savedScrollPosition;
      const t = setTimeout(() => {
        if (nav) nav.scrollTop = savedScrollPosition;
      }, 50);
      return () => clearTimeout(t);
    }
  }, []);

  const handleNavScroll = (e: React.UIEvent<HTMLElement>) => {
    savedScrollPosition = e.currentTarget.scrollTop;
  };

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

  const getActiveIconSection = () => {
    const path = location.pathname;
    if (path === '/container') return 'home';
    if (path.startsWith('/container/cluster-management')) return 'cluster-mgmt';
    return 'cluster';
  };

  const activeIconSection = getActiveIconSection();
  const showMenuPanel = isOpen && activeIconSection !== 'home';

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isItemActive = (path: string) => isActive(path);

  return (
    <div className="flex h-full">
      {/* Icon sidebar — 40px, always visible */}
      <aside className="w-[40px] min-w-[40px] h-full bg-surface border-r border-border-subtle flex flex-col">
        <div className="h-[36px] flex items-center justify-center border-b border-border-subtle">
          <img src={ContainerIcon} alt="Container" className="w-[24px] h-[24px]" />
        </div>

        <div className="flex-1 flex flex-col items-center py-3 gap-0">
          <IconSidebarItem
            icon={<IconHome size={16} stroke={1.5} />}
            active={activeIconSection === 'home'}
            onClick={() => navigate('/container')}
            tooltip="Home"
          />
          <IconSidebarItem
            icon={<FolderCog size={16} strokeWidth={1.5} />}
            active={activeIconSection === 'cluster-mgmt'}
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
            tooltip="Add new cluster"
          />
        </div>
      </aside>

      {/* Menu panel — 200px, hidden on Home */}
      {showMenuPanel && (
        <aside className="w-[200px] min-w-[200px] h-full bg-surface border-r border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-[33px] px-3 flex items-center justify-between flex-shrink-0">
            <span className="text-[13px] font-medium leading-5 text-text">
              {activeIconSection === 'cluster-mgmt' ? 'Thaki Cloud' : 'Container'}
            </span>
            <button
              type="button"
              onClick={onToggle}
              className="p-1 hover:bg-surface-hover rounded transition-colors cursor-pointer flex-shrink-0 border-none bg-transparent"
              aria-label="Toggle sidebar"
            >
              <IconLayoutSidebar
                size={14}
                className="text-text-muted pointer-events-none"
                stroke={1.5}
              />
            </button>
          </div>

          {/* Namespace Selector — only for cluster view */}
          {activeIconSection === 'cluster' && <NamespaceSelector />}

          {/* Navigation */}
          <nav
            ref={navRef}
            onScroll={handleNavScroll}
            className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden"
          >
            {/* Bookmarks */}
            <div className="py-2 mb-2">
              <button className="flex items-center gap-2 px-0 py-1.5 text-[12px] font-medium leading-4 text-text bg-transparent border-none cursor-pointer">
                <IconChevronDown size={12} stroke={2} className="rotate-[-90deg]" />
                <span>Bookmarks</span>
              </button>
            </div>

            {/* Menu sections — switch based on active icon */}
            {activeIconSection === 'cluster-mgmt' ? (
              <SidebarMenu
                sections={clusterMgmtSections}
                defaultOpenSections={clusterMgmtDefaultOpen}
                onNavigate={handleNavigate}
                isItemActive={isItemActive}
              />
            ) : (
              <SidebarMenu
                sections={sections}
                defaultOpenSections={defaultOpenSections}
                onNavigate={handleNavigate}
                isItemActive={isItemActive}
              />
            )}
          </nav>
        </aside>
      )}
    </div>
  );
}

export default ContainerSidebar;
