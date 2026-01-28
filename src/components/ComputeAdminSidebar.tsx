import { VStack, MenuItem, MenuSection } from '@/design-system';
import {
  IconHome,
  IconCube,
  IconTemplate,
  IconCamera,
  IconDisc,
  IconCpu,
  IconDatabase,
  IconDatabaseExport,
  IconDatabaseCog,
  IconNetwork,
  IconWorldWww,
  IconShieldLock,
  IconLoadBalancer,
  IconArrowLeft,
  IconServer,
  IconArrowsJoin2,
  IconLayoutGrid,
  IconUsersGroup,
  IconFileCode,
  IconActivity,
  IconServer2,
} from '@tabler/icons-react';
import { ChevronsLeftRightEllipsis, BrickWallFire } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import RouterIcon from '@/assets/Router.svg';
import { AppSwitcher } from './AppSwitcher';

/* ----------------------------------------
   ComputeAdminSidebar Component
   ---------------------------------------- */

interface ComputeAdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ComputeAdminSidebar({ isOpen = true, onToggle }: ComputeAdminSidebarProps) {
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
    if (
      href === '/compute-admin/networks' &&
      location.pathname.startsWith('/compute-admin/subnets')
    ) {
      return true;
    }
    // Match child resources - Listeners, Pools, and L7 Policies are under Load Balancers
    if (
      href === '/compute-admin/load-balancers' &&
      (location.pathname.startsWith('/compute-admin/listeners') ||
        location.pathname.startsWith('/compute-admin/pools') ||
        location.pathname.startsWith('/compute-admin/l7-policies'))
    ) {
      return true;
    }
    // Match child resources - QoS Specs are under Volume Types
    if (
      href === '/compute-admin/volume-types' &&
      location.pathname.startsWith('/compute-admin/qos-specs')
    ) {
      return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      {/* App Switcher with Toggle */}
      <AppSwitcher onToggleSidebar={onToggle} />

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
              icon={<IconLayoutGrid size={16} stroke={1.5} />}
              label="Server Groups"
              href="/compute-admin/server-groups"
              active={isActive('/compute-admin/server-groups')}
            />
            <MenuItem
              icon={<IconArrowsJoin2 size={16} stroke={1.5} />}
              label="Host aggregates"
              href="/compute-admin/host-aggregates"
              active={isActive('/compute-admin/host-aggregates')}
            />
            <MenuItem
              icon={<IconServer size={16} stroke={1.5} />}
              label="Bare metal nodes"
              href="/compute-admin/bare-metal-nodes"
              active={isActive('/compute-admin/bare-metal-nodes')}
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
              label="Volume Snapshots"
              href="/compute-admin/volume-snapshots"
              active={isActive('/compute-admin/volume-snapshots')}
            />
            <MenuItem
              icon={<IconDatabaseExport size={16} stroke={1.5} />}
              label="Volume backups"
              href="/compute-admin/volume-backups"
              active={isActive('/compute-admin/volume-backups')}
            />
            <MenuItem
              icon={<IconDatabaseCog size={16} stroke={1.5} />}
              label="Volume types"
              href="/compute-admin/volume-types"
              active={isActive('/compute-admin/volume-types')}
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
              icon={<BrickWallFire size={16} strokeWidth={1.5} />}
              label="Firewall"
              href="/compute-admin/firewall"
              active={isActive('/compute-admin/firewall')}
            />
          </MenuSection>

          {/* System Section */}
          <MenuSection title="System" defaultOpen={true}>
            <MenuItem
              icon={<IconUsersGroup size={16} stroke={1.5} />}
              label="Tenants"
              href="/compute-admin/tenants"
              active={isActive('/compute-admin/tenants')}
            />
            <MenuItem
              icon={<IconFileCode size={16} stroke={1.5} />}
              label="Metadata definition"
              href="/compute-admin/metadata-definition"
              active={isActive('/compute-admin/metadata-definition')}
            />
          </MenuSection>

          {/* Monitoring Section */}
          <MenuSection title="Monitoring" defaultOpen={true}>
            <MenuItem
              icon={<IconActivity size={16} stroke={1.5} />}
              label="Monitor overview"
              href="/compute-admin/monitor-overview"
              active={isActive('/compute-admin/monitor-overview')}
            />
            <MenuItem
              icon={<IconServer2 size={16} stroke={1.5} />}
              label="Physical nodes"
              href="/compute-admin/physical-nodes"
              active={isActive('/compute-admin/physical-nodes')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default ComputeAdminSidebar;
