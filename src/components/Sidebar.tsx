import { useState } from 'react';
import { VStack, MenuItem, MenuSection } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
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
  IconRouter,
  IconPlug,
  IconWorldWww,
  IconShield,
  IconLoadBalancer,
  IconCertificate,
  IconTopologyRing,
  IconLayoutSidebar,
  IconPalette,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { ProjectSelector, mockProjects } from './ProjectSelector';

/* ----------------------------------------
   Sidebar Component
   ---------------------------------------- */

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const { isDark } = useDarkMode();
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id);
  const location = useLocation();
  
  // Check if current path matches href (also handle root path for instances)
  const isActive = (href: string) => {
    if (href === '/instances' && (location.pathname === '/' || location.pathname === '/instances')) {
      return true;
    }
    return location.pathname === href;
  };
  
  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-10 px-3 flex items-center justify-between">
        <img 
          src={isDark ? ThakiLogoDark : ThakiLogoLight} 
          alt="THAKI Cloud" 
          className="h-4"
        />
        <button 
          onClick={onToggle}
          className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
          aria-label="Toggle sidebar"
        >
          <IconLayoutSidebar size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
        </button>
      </div>

      {/* Project Selector */}
      <div className="px-3 py-2">
        <ProjectSelector
          projects={mockProjects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto sidebar-scroll">
        <VStack gap={4}>
          {/* Design System Link */}
          <Link
            to="/design-system"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-white text-[11px] font-medium transition-colors"
          >
            <IconPalette size={16} stroke={1.5} />
            <span>Design System</span>
          </Link>

          {/* Home */}
          <MenuItem
            icon={<IconHome size={16} stroke={1.5} />}
            label="Home"
            href="/home"
            active={isActive('/home')}
          />

          {/* Compute Section */}
          <MenuSection title="Compute" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Instances"
              href="/instances"
              active={isActive('/instances')}
            />
            <MenuItem
              icon={<IconTemplate size={16} stroke={1.5} />}
              label="Instance Templates"
              href="/instance-templates"
              active={isActive('/instance-templates')}
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Instance Snapshots"
              href="/instance-snapshots"
              active={isActive('/instance-snapshots')}
            />
            <MenuItem
              icon={<IconDisc size={16} stroke={1.5} />}
              label="Images"
              href="/images"
              active={isActive('/images')}
            />
            <MenuItem
              icon={<IconCpu size={16} stroke={1.5} />}
              label="Flavors"
              href="/flavors"
              active={isActive('/flavors')}
            />
            <MenuItem
              icon={<IconKey size={16} stroke={1.5} />}
              label="Key Pairs"
              href="/key-pairs"
              active={isActive('/key-pairs')}
            />
            <MenuItem
              icon={<IconServer size={16} stroke={1.5} />}
              label="Server Groups"
              href="/server-groups"
              active={isActive('/server-groups')}
            />
          </MenuSection>

          {/* Storage Section */}
          <MenuSection title="Storage" defaultOpen={true}>
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Volumes"
              href="/volumes"
              active={isActive('/volumes')}
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Volume Snapshots"
              href="/volume-snapshots"
              active={isActive('/volume-snapshots')}
            />
            <MenuItem
              icon={<IconDatabaseExport size={16} stroke={1.5} />}
              label="Volume Backups"
              href="/volume-backups"
              active={isActive('/volume-backups')}
            />
          </MenuSection>

          {/* Network Section */}
          <MenuSection title="Network" defaultOpen={true}>
            <MenuItem
              icon={<IconNetwork size={16} stroke={1.5} />}
              label="Networks"
              href="/networks"
              active={isActive('/networks')}
            />
            <MenuItem
              icon={<IconRouter size={16} stroke={1.5} />}
              label="Routers"
              href="/routers"
              active={isActive('/routers')}
            />
            <MenuItem
              icon={<IconPlug size={16} stroke={1.5} />}
              label="Ports"
              href="/ports"
              active={isActive('/ports')}
            />
            <MenuItem
              icon={<IconWorldWww size={16} stroke={1.5} />}
              label="Floating IPs"
              href="/floating-ips"
              active={isActive('/floating-ips')}
            />
            <MenuItem
              icon={<IconShield size={16} stroke={1.5} />}
              label="Security Groups"
              href="/security-groups"
              active={isActive('/security-groups')}
            />
            <MenuItem
              icon={<IconLoadBalancer size={16} stroke={1.5} />}
              label="Load Balancers"
              href="/load-balancers"
              active={isActive('/load-balancers')}
            />
            <MenuItem
              icon={<IconCertificate size={16} stroke={1.5} />}
              label="Certificates"
              href="/certificates"
              active={isActive('/certificates')}
            />
            <MenuItem
              icon={<IconTopologyRing size={16} stroke={1.5} />}
              label="Topology"
              href="/topology"
              active={isActive('/topology')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default Sidebar;
