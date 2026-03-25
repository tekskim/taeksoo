import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarMenu } from '@shared/components/Sidebar';
import type { SidebarSection } from '@shared/components/Sidebar';
import type { SidebarIconComponent } from '@shared/components/Sidebar';
import ContainerIcon from '../assets/appIcon/container.png';
import {
  IconLayoutSidebar,
  IconHome,
  IconChartPie3,
  IconFolders,
  IconTimelineEvent,
  IconAffiliate,
  IconRocket,
  IconStack3,
  IconBox,
  IconClock,
  IconCalendarTime,
  IconArrowsShuffle,
  IconTopologyStar,
  IconDatabase,
  IconFileSettings,
  IconKey,
  IconRulerMeasure,
  IconReorder,
  IconShieldLock,
} from '@tabler/icons-react';

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

const HomeIconW = makeTablerIcon(IconHome);
const DashboardIconW = makeTablerIcon(IconChartPie3);
const NamespacesIconW = makeTablerIcon(IconFolders);
const NodesIconW = makeTablerIcon(IconAffiliate);
const EventsIconW = makeTablerIcon(IconTimelineEvent);
const DeploymentsIconW = makeTablerIcon(IconRocket);
const StatefulSetsIconW = makeTablerIcon(IconStack3);
const DaemonSetsIconW = makeTablerIcon(IconArrowsShuffle);
const JobsIconW = makeTablerIcon(IconBox);
const CronJobsIconW = makeTablerIcon(IconClock);
const PodsIconW = makeTablerIcon(IconCalendarTime);
const ServicesIconW = makeTablerIcon(IconTopologyStar);
const IngressesIconW = makeTablerIcon(IconArrowsShuffle);
const HPAIconW = makeTablerIcon(IconArrowsShuffle);
const PVIconW = makeTablerIcon(IconDatabase);
const PVCIconW = makeTablerIcon(IconDatabase);
const StorageClassIconW = makeTablerIcon(IconFileSettings);
const ConfigMapIconW = makeTablerIcon(IconFileSettings);
const SecretIconW = makeTablerIcon(IconKey);
const LimitRangeIconW = makeTablerIcon(IconRulerMeasure);
const ResourceQuotaIconW = makeTablerIcon(IconReorder);
const NetworkPolicyIconW = makeTablerIcon(IconShieldLock);
const PDBIconW = makeTablerIcon(IconShieldLock);
const ClusterMgmtIconW = makeTablerIcon(IconAffiliate);

const sections: SidebarSection[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/container',
    icon: HomeIconW,
  },
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
      {
        id: 'cluster-management',
        label: 'Cluster management',
        path: '/container/cluster-management',
        icon: ClusterMgmtIconW,
      },
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

interface ContainerSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ContainerSidebar({ isCollapsed, onToggle }: ContainerSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/container' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  const handleNavigate = (path: string, _options: { newTab: boolean }) => {
    navigate(path);
  };

  return (
    <Sidebar isCollapsed={isCollapsed}>
      <div className="h-10 -mt-2 mb-2 flex items-center gap-2 flex-shrink-0">
        <img src={ContainerIcon} alt="Container" className="w-[24px] h-[24px] flex-shrink-0" />
        <span className="flex-1 text-[13px] font-medium leading-5 text-text truncate">
          Container
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

      <SidebarMenu
        sections={sections}
        defaultOpenSections={defaultOpenSections}
        onNavigate={handleNavigate}
        isItemActive={isItemActive}
      />
    </Sidebar>
  );
}

export default ContainerSidebar;
