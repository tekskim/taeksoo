import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarMenu } from '@shared/components/Sidebar';
import type { SidebarSection } from '@shared/components/Sidebar';
import type { SidebarIconComponent } from '@shared/components/Sidebar';
import ComputeIcon from '../assets/appIcon/compute.png';
import {
  IconLayoutSidebar,
  IconHome,
  IconCube,
  IconTemplate,
  IconCamera,
  IconDisc,
  IconCpu,
  IconKey,
  IconServer,
  IconDatabase,
  IconDatabaseExport,
  IconNetwork,
  IconWorldWww,
  IconShieldLock,
  IconLoadBalancer,
  IconCertificate,
  IconWorld,
  IconCalendarEvent,
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
const KeyIconW = makeTablerIcon(IconKey);
const ServerIconW = makeTablerIcon(IconServer);
const DatabaseIconW = makeTablerIcon(IconDatabase);
const DatabaseExportIconW = makeTablerIcon(IconDatabaseExport);
const NetworkIconW = makeTablerIcon(IconNetwork);
const WorldWwwIconW = makeTablerIcon(IconWorldWww);
const ShieldLockIconW = makeTablerIcon(IconShieldLock);
const LoadBalancerIconW = makeTablerIcon(IconLoadBalancer);
const CertificateIconW = makeTablerIcon(IconCertificate);
const WorldIconW = makeTablerIcon(IconWorld);
const CalendarIconW = makeTablerIcon(IconCalendarEvent);
const ShieldCheckIconW = makeTablerIcon(IconShieldCheck);

const sections: SidebarSection[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/compute',
    icon: HomeIconW,
  },
  {
    id: 'compute',
    label: 'Compute',
    children: [
      { id: 'instances', label: 'Instances', path: '/compute/instances', icon: CubeIconW },
      {
        id: 'instance-templates',
        label: 'Instance templates',
        path: '/compute/instance-templates',
        icon: TemplateIconW,
      },
      {
        id: 'instance-snapshots',
        label: 'Instance snapshots',
        path: '/compute/instance-snapshots',
        icon: CameraIconW,
      },
      { id: 'images', label: 'Images', path: '/compute/images', icon: DiscIconW },
      { id: 'flavors', label: 'Flavors', path: '/compute/flavors', icon: CpuIconW },
      { id: 'key-pairs', label: 'Key pairs', path: '/compute/key-pairs', icon: KeyIconW },
      {
        id: 'server-groups',
        label: 'Server groups',
        path: '/compute/server-groups',
        icon: ServerIconW,
      },
    ],
  },
  {
    id: 'storage',
    label: 'Storage',
    children: [
      { id: 'volumes', label: 'Volumes', path: '/compute/volumes', icon: DatabaseIconW },
      {
        id: 'volume-snapshots',
        label: 'Volume snapshots',
        path: '/compute/volume-snapshots',
        icon: CameraIconW,
      },
      {
        id: 'volume-backups',
        label: 'Volume backups',
        path: '/compute/volume-backups',
        icon: DatabaseExportIconW,
      },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    children: [
      { id: 'networks', label: 'Networks', path: '/compute/networks', icon: NetworkIconW },
      { id: 'routers', label: 'Routers', path: '/compute/routers', icon: NetworkIconW },
      { id: 'ports', label: 'Ports', path: '/compute/ports', icon: NetworkIconW },
      {
        id: 'floating-ips',
        label: 'Floating IPs',
        path: '/compute/floating-ips',
        icon: WorldWwwIconW,
      },
      {
        id: 'security-groups',
        label: 'Security groups',
        path: '/compute/security-groups',
        icon: ShieldLockIconW,
      },
      {
        id: 'load-balancers',
        label: 'Load balancers',
        path: '/compute/load-balancers',
        icon: LoadBalancerIconW,
      },
      { id: 'firewall', label: 'NACL', path: '/compute/firewalls', icon: ShieldCheckIconW },
      {
        id: 'certificates',
        label: 'Certificates',
        path: '/compute/certificates',
        icon: CertificateIconW,
      },
    ],
  },
];

const defaultOpenSections = ['compute', 'storage', 'network'];

interface ComputeSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ComputeSidebar({ isCollapsed, onToggle }: ComputeSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/compute' && location.pathname.startsWith(path + '/')) return true;
    if (
      path === '/compute/load-balancers' &&
      (location.pathname.startsWith('/compute/listeners') ||
        location.pathname.startsWith('/compute/pools') ||
        location.pathname.startsWith('/compute/l7-policies'))
    )
      return true;
    if (
      path === '/compute/firewalls' &&
      (location.pathname.startsWith('/compute/firewalls') ||
        location.pathname.startsWith('/compute/firewall-policies') ||
        location.pathname.startsWith('/compute/firewall-rules'))
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
        <img src={ComputeIcon} alt="Compute" className="w-[24px] h-[24px] flex-shrink-0" />
        <span className="flex-1 text-[13px] font-medium leading-5 text-text truncate">Compute</span>
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

export default ComputeSidebar;
