import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarMenu } from '@shared/components/Sidebar';
import type { SidebarSection } from '@shared/components/Sidebar';
import type { SidebarIconComponent } from '@shared/components/Sidebar';
import ComputeAdminIcon from '../assets/appIcon/compute-admin.png';
import {
  IconLayoutSidebar,
  IconHome,
  IconCube,
  IconTemplate,
  IconCamera,
  IconDisc,
  IconCpu,
  IconServer,
  IconDatabase,
  IconDatabaseExport,
  IconDatabaseCog,
  IconNetwork,
  IconWorldWww,
  IconShieldLock,
  IconLoadBalancer,
  IconArrowsJoin2,
  IconLayoutGrid,
  IconUsersGroup,
  IconFileCode,
  IconActivity,
  IconServer2,
  IconShieldCheck,
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
const CubeIconW = makeTablerIcon(IconCube);
const TemplateIconW = makeTablerIcon(IconTemplate);
const CameraIconW = makeTablerIcon(IconCamera);
const DiscIconW = makeTablerIcon(IconDisc);
const CpuIconW = makeTablerIcon(IconCpu);
const ServerIconW = makeTablerIcon(IconServer);
const DatabaseIconW = makeTablerIcon(IconDatabase);
const DatabaseExportIconW = makeTablerIcon(IconDatabaseExport);
const DatabaseCogIconW = makeTablerIcon(IconDatabaseCog);
const NetworkIconW = makeTablerIcon(IconNetwork);
const WorldWwwIconW = makeTablerIcon(IconWorldWww);
const ShieldLockIconW = makeTablerIcon(IconShieldLock);
const LoadBalancerIconW = makeTablerIcon(IconLoadBalancer);
const ShieldCheckIconW = makeTablerIcon(IconShieldCheck);
const ArrowsJoin2IconW = makeTablerIcon(IconArrowsJoin2);
const LayoutGridIconW = makeTablerIcon(IconLayoutGrid);
const UsersGroupIconW = makeTablerIcon(IconUsersGroup);
const FileCodeIconW = makeTablerIcon(IconFileCode);
const ActivityIconW = makeTablerIcon(IconActivity);
const Server2IconW = makeTablerIcon(IconServer2);

const sections: SidebarSection[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/compute-admin',
    icon: HomeIconW,
  },
  {
    id: 'compute',
    label: 'Compute',
    children: [
      { id: 'instances', label: 'Instances', path: '/compute-admin/instances', icon: CubeIconW },
      {
        id: 'instance-templates',
        label: 'Instance templates',
        path: '/compute-admin/instance-templates',
        icon: TemplateIconW,
      },
      {
        id: 'instance-snapshots',
        label: 'Instance snapshots',
        path: '/compute-admin/instance-snapshots',
        icon: CameraIconW,
      },
      { id: 'images', label: 'Images', path: '/compute-admin/images', icon: DiscIconW },
      { id: 'flavors', label: 'Flavors', path: '/compute-admin/flavors', icon: CpuIconW },
      {
        id: 'server-groups',
        label: 'Server groups',
        path: '/compute-admin/server-groups',
        icon: LayoutGridIconW,
      },
      {
        id: 'host-aggregates',
        label: 'Host aggregates',
        path: '/compute-admin/host-aggregates',
        icon: ArrowsJoin2IconW,
      },
      {
        id: 'bare-metal-nodes',
        label: 'Bare metal nodes',
        path: '/compute-admin/bare-metal-nodes',
        icon: ServerIconW,
      },
    ],
  },
  {
    id: 'storage',
    label: 'Storage',
    children: [
      { id: 'volumes', label: 'Volumes', path: '/compute-admin/volumes', icon: DatabaseIconW },
      {
        id: 'volume-snapshots',
        label: 'Volume snapshots',
        path: '/compute-admin/volume-snapshots',
        icon: CameraIconW,
      },
      {
        id: 'volume-backups',
        label: 'Volume backups',
        path: '/compute-admin/volume-backups',
        icon: DatabaseExportIconW,
      },
      {
        id: 'volume-types',
        label: 'Volume types',
        path: '/compute-admin/volume-types',
        icon: DatabaseCogIconW,
      },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    children: [
      { id: 'networks', label: 'Networks', path: '/compute-admin/networks', icon: NetworkIconW },
      { id: 'routers', label: 'Routers', path: '/compute-admin/routers', icon: NetworkIconW },
      { id: 'ports', label: 'Ports', path: '/compute-admin/ports', icon: NetworkIconW },
      {
        id: 'floating-ips',
        label: 'Floating IPs',
        path: '/compute-admin/floating-ips',
        icon: WorldWwwIconW,
      },
      {
        id: 'security-groups',
        label: 'Security groups',
        path: '/compute-admin/security-groups',
        icon: ShieldLockIconW,
      },
      {
        id: 'load-balancers',
        label: 'Load balancers',
        path: '/compute-admin/load-balancers',
        icon: LoadBalancerIconW,
      },
      {
        id: 'firewall',
        label: 'Firewall',
        path: '/compute-admin/firewall',
        icon: ShieldCheckIconW,
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    children: [
      {
        id: 'tenants',
        label: 'Tenants',
        path: '/compute-admin/tenants',
        icon: UsersGroupIconW,
      },
      {
        id: 'metadata-definition',
        label: 'Metadata definition',
        path: '/compute-admin/metadata-definition',
        icon: FileCodeIconW,
      },
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    children: [
      {
        id: 'monitor-overview',
        label: 'Monitor overview',
        path: '/compute-admin/monitor-overview',
        icon: ActivityIconW,
      },
      {
        id: 'physical-nodes',
        label: 'Physical nodes',
        path: '/compute-admin/physical-nodes',
        icon: Server2IconW,
      },
    ],
  },
];

const defaultOpenSections = ['compute', 'storage', 'network', 'system', 'monitoring'];

interface ComputeAdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ComputeAdminSidebar({ isCollapsed, onToggle }: ComputeAdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/compute-admin' && location.pathname.startsWith(path + '/')) return true;
    if (
      path === '/compute-admin/networks' &&
      location.pathname.startsWith('/compute-admin/subnets')
    )
      return true;
    if (
      path === '/compute-admin/load-balancers' &&
      (location.pathname.startsWith('/compute-admin/listeners') ||
        location.pathname.startsWith('/compute-admin/pools') ||
        location.pathname.startsWith('/compute-admin/l7-policies'))
    )
      return true;
    if (
      path === '/compute-admin/volume-types' &&
      location.pathname.startsWith('/compute-admin/qos-specs')
    )
      return true;
    if (
      path === '/compute-admin/firewall' &&
      (location.pathname.startsWith('/compute-admin/firewall') ||
        location.pathname.startsWith('/compute-admin/firewall-policies') ||
        location.pathname.startsWith('/compute-admin/firewall-rules'))
    )
      return true;
    return false;
  };

  const handleNavigate = (path: string, _options: { newTab: boolean }) => {
    navigate(path);
  };

  return (
    <Sidebar isCollapsed={isCollapsed}>
      <div className="h-10 -mt-2 mb-2 flex items-center gap-2 flex-shrink-0">
        <img
          src={ComputeAdminIcon}
          alt="Compute Admin"
          className="w-[24px] h-[24px] flex-shrink-0"
        />
        <span className="flex-1 text-[13px] font-medium leading-5 text-text truncate">
          Compute Admin
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

export default ComputeAdminSidebar;
