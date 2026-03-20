import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarMenu } from '@shared/components/Sidebar';
import type { SidebarSection, SidebarIconComponent } from '@shared/components/Sidebar';
// @ts-expect-error png asset import
import StorageIcon from '@shared/assets/app-icons/storage.png';
import {
  IconLayoutSidebar,
  IconHome,
  IconDatabase,
  IconServer2,
  IconCpu,
  IconDisc,
  IconFolders,
  IconShare,
  IconBucket,
  IconBrandSpeedtest,
} from '@tabler/icons-react';

function makeTablerIcon(
  TablerIcon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>
): SidebarIconComponent {
  const Wrapped = ({ variant, size }: { variant?: string; size?: number | string }) => {
    const colorClass = variant === 'primary' ? 'text-primary' : 'text-text-muted';
    const numericSize = typeof size === 'number' ? size : 16;
    return <TablerIcon size={numericSize} stroke={1.5} className={colorClass} />;
  };
  return Wrapped as unknown as SidebarIconComponent;
}

function HardDriveIcon({
  size = 16,
  stroke = 1.5,
  className = '',
}: {
  size?: number;
  stroke?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="22" x2="2" y1="12" y2="12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" x2="6.01" y1="16" y2="16" />
      <line x1="10" x2="10.01" y1="16" y2="16" />
    </svg>
  );
}

const HomeIcon = makeTablerIcon(IconHome);
const PoolsIcon = makeTablerIcon(IconDatabase);
const HostsIcon = makeTablerIcon(IconServer2);
const OSDsIcon = makeTablerIcon(IconCpu);
const PhysicalDisksIcon = makeTablerIcon(HardDriveIcon as never);
const ImagesIcon = makeTablerIcon(IconDisc);
const FileSystemsIcon = makeTablerIcon(IconFolders);
const NFSIcon = makeTablerIcon(IconShare);
const BucketsIcon = makeTablerIcon(IconBucket);
const PerformanceIcon = makeTablerIcon(IconBrandSpeedtest);

const sections: SidebarSection[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/storage',
    icon: HomeIcon,
  },
  {
    id: 'cluster',
    label: 'Cluster',
    children: [
      { id: 'pools', label: 'Pools', path: '/storage/pools', icon: PoolsIcon },
      { id: 'hosts', label: 'Hosts', path: '/storage/hosts', icon: HostsIcon },
      { id: 'osds', label: 'OSDs', path: '/storage/osds', icon: OSDsIcon },
      {
        id: 'physical-disks',
        label: 'Physical disks',
        path: '/storage/physical-disks',
        icon: PhysicalDisksIcon,
      },
    ],
  },
  {
    id: 'block',
    label: 'Block',
    children: [{ id: 'images', label: 'Images', path: '/storage/images', icon: ImagesIcon }],
  },
  {
    id: 'file',
    label: 'File',
    children: [
      {
        id: 'file-systems',
        label: 'File Systems',
        path: '/storage/file-systems',
        icon: FileSystemsIcon,
      },
      { id: 'nfs', label: 'NFS', path: '/storage/nfs', icon: NFSIcon },
    ],
  },
  {
    id: 'object',
    label: 'Object',
    children: [{ id: 'buckets', label: 'Buckets', path: '/storage/buckets', icon: BucketsIcon }],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    children: [
      {
        id: 'performance',
        label: 'Overall performance',
        path: '/storage/performance',
        icon: PerformanceIcon,
      },
    ],
  },
];

const defaultOpenSections = ['home', 'cluster', 'block', 'file', 'object', 'monitoring'];

interface StorageSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function StorageSidebar({ isCollapsed, onToggle }: StorageSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/storage' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar isCollapsed={isCollapsed}>
      <div className="h-10 -mt-2 mb-2 flex items-center gap-2 flex-shrink-0">
        <img src={StorageIcon} alt="Storage" className="w-[24px] h-[24px] flex-shrink-0" />
        <span className="flex-1 text-[13px] font-medium leading-5 text-text truncate">Storage</span>
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

export default StorageSidebar;
