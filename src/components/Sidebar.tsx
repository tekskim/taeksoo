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
  IconShieldLock,
  IconLoadBalancer,
  IconCertificate,
  IconTopologyStar3,
  IconLayoutSidebar,
  IconListSearch,
  IconServer2,
  IconSwitch3,
  IconActivity,
  IconCpu2,
  IconAffiliate,
} from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { ProjectSelector } from './ProjectSelector';

/* ----------------------------------------
   Sidebar Component
   ---------------------------------------- */

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const { isDark } = useDarkMode();
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();
  const location = useLocation();
  const isCloudBuilder = location.pathname.startsWith('/cloudbuilder') || location.pathname.startsWith('/cloud-builder');
  
  // Check if current path matches href
  const isActive = (href: string) => {
    // Exact match
    if (location.pathname === href) {
      return true;
    }
    // Match detail pages (e.g., /compute/volumes/vol-001 matches /compute/volumes)
    if (href !== '/compute' && location.pathname.startsWith(href + '/')) {
      return true;
    }
    // Match child resources - Subnets are under Networks
    if (href === '/compute/networks' && location.pathname.startsWith('/compute/subnets')) {
      return true;
    }
    // Match child resources - Listeners, Pools, and L7 Policies are under Load Balancers
    if (href === '/compute/load-balancers' && (
      location.pathname.startsWith('/compute/listeners') ||
      location.pathname.startsWith('/compute/pools') ||
      location.pathname.startsWith('/compute/l7-policies')
    )) {
      return true;
    }
    return false;
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
          type="button"
          onClick={onToggle}
          className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <IconLayoutSidebar size={16} className="text-[var(--color-text-muted)] pointer-events-none" stroke={1.5} />
        </button>
      </div>

      {/* Project Selector */}
      <div className="px-3 py-2">
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
          variant="default"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto sidebar-scroll">
        <VStack gap={4}>
          {/* Cloud Builder Sidebar */}
          {isCloudBuilder ? (
            <>
              <MenuItem
                icon={<IconHome size={16} stroke={1.5} />}
                label="Home"
                href="/cloudbuilder/discovery"
                active={isActive('/cloudbuilder/discovery') || isActive('/cloudbuilder')}
              />

              <MenuSection title="Inventory(1.0v)" defaultOpen={true}>
                <MenuItem
                  icon={<IconListSearch size={16} stroke={1.5} />}
                  label="Discovery"
                  href="/cloudbuilder/discovery"
                  active={isActive('/cloudbuilder/discovery')}
                />
                <MenuItem
                  icon={<IconServer2 size={16} stroke={1.5} />}
                  label="Servers"
                  href="/cloudbuilder/servers"
                  active={isActive('/cloudbuilder/servers')}
                />
                <MenuItem
                  icon={<IconSwitch3 size={16} stroke={1.5} />}
                  label="Switch"
                  href="/cloudbuilder/switch"
                  active={isActive('/cloudbuilder/switch')}
                />
              </MenuSection>

              <MenuSection title="Inventory(0.7v)" defaultOpen={true}>
                <MenuItem
                  icon={<IconServer2 size={16} stroke={1.5} />}
                  label="Severs"
                  href="/cloudbuilder/severs0.7"
                  active={isActive('/cloudbuilder/severs0.7')}
                />
              </MenuSection>

              <MenuSection title="System Info" defaultOpen={true}>
                <MenuItem
                  icon={<IconActivity size={16} stroke={1.5} />}
                  label="Compute Services"
                  href="/cloudbuilder/services"
                  active={isActive('/cloudbuilder/services')}
                />
                <MenuItem
                  icon={<IconCpu2 size={16} stroke={1.5} />}
                  label="Compute Nodes"
                  href="/cloudbuilder/compute-services"
                  active={isActive('/cloudbuilder/compute-services')}
                />
                <MenuItem
                  icon={<IconNetwork size={16} stroke={1.5} />}
                  label="Network Agents"
                  href="/cloudbuilder/network-agents"
                  active={isActive('/cloudbuilder/network-agents')}
                />
                <MenuItem
                  icon={<IconDatabase size={16} stroke={1.5} />}
                  label="Block Storage Services"
                  href="/cloudbuilder/block-storage-services"
                  active={isActive('/cloudbuilder/block-storage-services')}
                />
                <MenuItem
                  icon={<IconAffiliate size={16} stroke={1.5} />}
                  label="Orchestration Services"
                  href="/cloudbuilder/orchestration-services"
                  active={isActive('/cloudbuilder/orchestration-services')}
                />
              </MenuSection>
            </>
          ) : (
            <>
            {/* Home */}
            <MenuItem
              icon={<IconHome size={16} stroke={1.5} />}
              label="Home"
              href="/compute"
              active={isActive('/compute')}
            />

          {/* Compute Section */}
          <MenuSection title="Compute" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Instances"
              href="/compute/instances"
              active={isActive('/compute/instances')}
            />
            <MenuItem
              icon={<IconTemplate size={16} stroke={1.5} />}
              label="Instance Templates"
              href="/compute/instance-templates"
              active={isActive('/compute/instance-templates')}
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Instance Snapshots"
              href="/compute/instance-snapshots"
              active={isActive('/compute/instance-snapshots')}
            />
            <MenuItem
              icon={<IconDisc size={16} stroke={1.5} />}
              label="Images"
              href="/compute/images"
              active={isActive('/compute/images')}
            />
            <MenuItem
              icon={<IconCpu size={16} stroke={1.5} />}
              label="Flavors"
              href="/compute/flavors"
              active={isActive('/compute/flavors')}
            />
            <MenuItem
              icon={<IconKey size={16} stroke={1.5} />}
              label="Key Pairs"
              href="/compute/key-pairs"
              active={isActive('/compute/key-pairs')}
            />
            <MenuItem
              icon={<IconServer size={16} stroke={1.5} />}
              label="Server Groups"
              href="/compute/server-groups"
              active={isActive('/compute/server-groups')}
            />
          </MenuSection>

          {/* Storage Section */}
          <MenuSection title="Storage" defaultOpen={true}>
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Volumes"
              href="/compute/volumes"
              active={isActive('/compute/volumes')}
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Volume Snapshots"
              href="/compute/volume-snapshots"
              active={isActive('/compute/volume-snapshots')}
            />
            <MenuItem
              icon={<IconDatabaseExport size={16} stroke={1.5} />}
              label="Volume Backups"
              href="/compute/volume-backups"
              active={isActive('/compute/volume-backups')}
            />
          </MenuSection>

          {/* Network Section */}
          <MenuSection title="Network" defaultOpen={true}>
            <MenuItem
              icon={<IconNetwork size={16} stroke={1.5} />}
              label="Networks"
              href="/compute/networks"
              active={isActive('/compute/networks')}
            />
            <MenuItem
              icon={<IconRouter size={16} stroke={1.5} />}
              label="Routers"
              href="/compute/routers"
              active={isActive('/compute/routers')}
            />
            <MenuItem
              icon={<IconPlug size={16} stroke={1.5} />}
              label="Ports"
              href="/compute/ports"
              active={isActive('/compute/ports')}
            />
            <MenuItem
              icon={<IconWorldWww size={16} stroke={1.5} />}
              label="Floating IPs"
              href="/compute/floating-ips"
              active={isActive('/compute/floating-ips')}
            />
            <MenuItem
              icon={<IconShieldLock size={16} stroke={1.5} />}
              label="Security Groups"
              href="/compute/security-groups"
              active={isActive('/compute/security-groups')}
            />
            <MenuItem
              icon={<IconLoadBalancer size={16} stroke={1.5} />}
              label="Load Balancers"
              href="/compute/load-balancers"
              active={isActive('/compute/load-balancers')}
            />
            <MenuItem
              icon={<IconCertificate size={16} stroke={1.5} />}
              label="Certificates"
              href="/compute/certificates"
              active={isActive('/compute/certificates')}
            />
            <MenuItem
              icon={<IconTopologyStar3 size={16} stroke={1.5} />}
              label="Topology"
              href="/compute/topology"
              active={isActive('/compute/topology')}
            />
          </MenuSection>
            </>
          )}
        </VStack>
      </nav>
    </aside>
  );
}

export default Sidebar;
