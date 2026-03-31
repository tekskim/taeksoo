import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarMenu } from '@shared/components/Sidebar';
import type { SidebarSection, SidebarIconComponent } from '@shared/components/Sidebar';
// @ts-expect-error png asset import
import CloudBuilderIcon from '@shared/assets/app-icons/cloud-builder.png';
import {
  IconLayoutSidebar,
  IconServer2,
  IconCpu,
  IconCpu2,
  IconNetwork,
  IconDatabase,
  IconAffiliate,
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

const ServersIcon = makeTablerIcon(IconServer2);
const CpuIcon = makeTablerIcon(IconCpu);
const Cpu2Icon = makeTablerIcon(IconCpu2);
const NetworkIcon = makeTablerIcon(IconNetwork);
const DatabaseIcon = makeTablerIcon(IconDatabase);
const AffiliateIcon = makeTablerIcon(IconAffiliate);

const sections: SidebarSection[] = [
  {
    id: 'inventory-0.7',
    label: 'Inventory(0.7v)',
    children: [
      { id: 'severs0.7', label: 'Severs', path: '/cloudbuilder/severs0.7', icon: ServersIcon },
    ],
  },
  {
    id: 'system-info',
    label: 'System info',
    children: [
      { id: 'services', label: 'Compute services', path: '/cloudbuilder/services', icon: CpuIcon },
      {
        id: 'compute-services',
        label: 'Compute nodes',
        path: '/cloudbuilder/compute-services',
        icon: Cpu2Icon,
      },
      {
        id: 'network-agents',
        label: 'Network agents',
        path: '/cloudbuilder/network-agents',
        icon: NetworkIcon,
      },
      {
        id: 'block-storage-services',
        label: 'Block storage services',
        path: '/cloudbuilder/block-storage-services',
        icon: DatabaseIcon,
      },
      {
        id: 'orchestration-services',
        label: 'Orchestration services',
        path: '/cloudbuilder/orchestration-services',
        icon: AffiliateIcon,
      },
    ],
  },
];

const defaultOpenSections = ['inventory-1.0', 'inventory-0.7', 'system-info'];

interface CloudBuilderSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function CloudBuilderSidebar({ isCollapsed, onToggle }: CloudBuilderSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/cloudbuilder' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar isCollapsed={isCollapsed}>
      <div className="h-10 -mt-2 mb-2 flex items-center gap-2 flex-shrink-0">
        <img
          src={CloudBuilderIcon}
          alt="Cloud Builder"
          className="w-[24px] h-[24px] flex-shrink-0"
        />
        <span className="flex-1 text-[13px] font-medium leading-5 text-text truncate">
          Cloud Builder
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

export default CloudBuilderSidebar;
