import { VStack, MenuItem, MenuSection } from '@/design-system';
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
  IconWorldWww,
  IconShieldLock,
  IconLoadBalancer,
  IconCertificate,
  IconTopologyStar3,
  IconArrowLeft,
} from '@tabler/icons-react';
import { ChevronsLeftRightEllipsis } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import RouterIcon from '@/assets/Router.svg';
import { ProjectSelector } from './ProjectSelector';
import { AppSwitcher } from './AppSwitcher';

/* ----------------------------------------
   ComputeAdminSidebar Component
   ---------------------------------------- */

interface ComputeAdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ComputeAdminSidebar({ isOpen = true, onToggle }: ComputeAdminSidebarProps) {
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();
  const location = useLocation();
  
  // Check if current path matches href
  const isActive = (href: string) => {
    // Exact match
    if (location.pathname === href) {
      return true;
    }
    // Match detail pages (e.g., /compute-admin/volumes/vol-001 matches /compute-admin/volumes)
    if (href !== '/compute-admin' && location.pathname.startsWith(href + '/')) {
      return true;
    }
    // Match child resources - Subnets are under Networks
    if (href === '/compute-admin/networks' && location.pathname.startsWith('/compute-admin/subnets')) {
      return true;
    }
    // Match child resources - Listeners, Pools, and L7 Policies are under Load Balancers
    if (href === '/compute-admin/load-balancers' && (
      location.pathname.startsWith('/compute-admin/listeners') ||
      location.pathname.startsWith('/compute-admin/pools') ||
      location.pathname.startsWith('/compute-admin/l7-policies')
    )) {
      return true;
    }
    return false;
  };
  
  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      {/* App Switcher with Toggle */}
      <AppSwitcher onToggleSidebar={onToggle} />

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
      <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <VStack gap={4} className="w-full min-w-0">
          {/* Back to Entry */}
          <Link
            to="/"
            className="w-[175px] px-[var(--menu-item-padding-x)] py-[var(--menu-item-padding-y)] rounded-[var(--menu-item-radius)] flex items-center gap-[var(--menu-item-gap)] text-[length:var(--font-size-11)] transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]"
          >
            <IconArrowLeft size={16} stroke={1.5} />
            <span>All Services</span>
          </Link>

          {/* Home */}
          <MenuItem
            icon={<IconHome size={16} stroke={1.5} />}
            label="Home"
            href="/compute-admin"
            active={isActive('/compute-admin')}
          />

          {/* Compute Section */}
          <MenuSection title="Compute" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Instances"
              href="/compute-admin/instances"
              active={isActive('/compute-admin/instances')}
            />
            <MenuItem
              icon={<IconTemplate size={16} stroke={1.5} />}
              label="Instance templates"
              href="/compute-admin/instance-templates"
              active={isActive('/compute-admin/instance-templates')}
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Instance snapshots"
              href="/compute-admin/instance-snapshots"
              active={isActive('/compute-admin/instance-snapshots')}
            />
            <MenuItem
              icon={<IconDisc size={16} stroke={1.5} />}
              label="Images"
              href="/compute-admin/images"
              active={isActive('/compute-admin/images')}
            />
            <MenuItem
              icon={<IconCpu size={16} stroke={1.5} />}
              label="Flavors"
              href="/compute-admin/flavors"
              active={isActive('/compute-admin/flavors')}
            />
            <MenuItem
              icon={<IconKey size={16} stroke={1.5} />}
              label="Key pairs"
              href="/compute-admin/key-pairs"
              active={isActive('/compute-admin/key-pairs')}
            />
            <MenuItem
              icon={<IconServer size={16} stroke={1.5} />}
              label="Server groups"
              href="/compute-admin/server-groups"
              active={isActive('/compute-admin/server-groups')}
            />
          </MenuSection>

          {/* Storage Section */}
          <MenuSection title="Storage" defaultOpen={true}>
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Volumes"
              href="/compute-admin/volumes"
              active={isActive('/compute-admin/volumes')}
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Volume snapshots"
              href="/compute-admin/volume-snapshots"
              active={isActive('/compute-admin/volume-snapshots')}
            />
            <MenuItem
              icon={<IconDatabaseExport size={16} stroke={1.5} />}
              label="Volume backups"
              href="/compute-admin/volume-backups"
              active={isActive('/compute-admin/volume-backups')}
            />
          </MenuSection>

          {/* Network Section */}
          <MenuSection title="Network" defaultOpen={true}>
            <MenuItem
              icon={<IconNetwork size={16} stroke={1.5} />}
              label="Networks"
              href="/compute-admin/networks"
              active={isActive('/compute-admin/networks')}
            />
            <MenuItem
              icon={<img src={RouterIcon} width={16} height={16} alt="" className="opacity-80" />}
              label="Routers"
              href="/compute-admin/routers"
              active={isActive('/compute-admin/routers')}
            />
            <MenuItem
              icon={<ChevronsLeftRightEllipsis size={16} strokeWidth={1.5} />}
              label="Ports"
              href="/compute-admin/ports"
              active={isActive('/compute-admin/ports')}
            />
            <MenuItem
              icon={<IconWorldWww size={16} stroke={1.5} />}
              label="Floating IPs"
              href="/compute-admin/floating-ips"
              active={isActive('/compute-admin/floating-ips')}
            />
            <MenuItem
              icon={<IconShieldLock size={16} stroke={1.5} />}
              label="Security groups"
              href="/compute-admin/security-groups"
              active={isActive('/compute-admin/security-groups')}
            />
            <MenuItem
              icon={<IconLoadBalancer size={16} stroke={1.5} />}
              label="Load balancers"
              href="/compute-admin/load-balancers"
              active={isActive('/compute-admin/load-balancers')}
            />
            <MenuItem
              icon={<IconCertificate size={16} stroke={1.5} />}
              label="Certificates"
              href="/compute-admin/certificates"
              active={isActive('/compute-admin/certificates')}
            />
            <MenuItem
              icon={<IconTopologyStar3 size={16} stroke={1.5} />}
              label="Topology"
              href="/compute-admin/topology"
              active={isActive('/compute-admin/topology')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default ComputeAdminSidebar;
