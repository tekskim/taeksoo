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
  IconListSearch,
  IconServer2,
  IconActivity,
  IconCpu2,
  IconAffiliate,
  IconArrowLeft,
  IconServerBolt,
  IconLayoutGrid,
  IconUsersGroup,
  IconFileCode,
  IconCloudComputing,
  IconCalendarEvent,
  IconRoute,
} from '@tabler/icons-react';
import { EthernetPort, ChevronsLeftRightEllipsis } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import RouterIcon from '@/assets/Router.svg';
import { ProjectSelector } from './ProjectSelector';
import { AppSwitcher } from './AppSwitcher';

/* ----------------------------------------
   Sidebar Component
   ---------------------------------------- */

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();
  const location = useLocation();
  const isCloudBuilder =
    location.pathname.startsWith('/cloudbuilder') || location.pathname.startsWith('/cloud-builder');
  const isComputeAdmin = location.pathname.startsWith('/compute-admin');

  // Base path for compute routes (either /compute or /compute-admin)
  const basePath = isComputeAdmin ? '/compute-admin' : '/compute';

  // Check if current path matches href
  const isActive = (href: string) => {
    // Exact match
    if (location.pathname === href) {
      return true;
    }
    // Match detail pages (e.g., /compute/volumes/vol-001 matches /compute/volumes)
    if (href !== basePath && location.pathname.startsWith(href + '/')) {
      return true;
    }
    // Match child resources - Subnets are under Networks
    if (href === `${basePath}/networks` && location.pathname.startsWith(`${basePath}/subnets`)) {
      return true;
    }
    // Match child resources - Bare metal detail pages are under Bare metal nodes
    if (
      href === '/compute-admin/bare-metal-nodes' &&
      location.pathname.startsWith('/compute-admin/bare-metal/')
    ) {
      return true;
    }
    // Match child resources - Listeners, Pools, and L7 Policies are under Load Balancers
    if (
      href === `${basePath}/load-balancers` &&
      (location.pathname.startsWith(`${basePath}/listeners`) ||
        location.pathname.startsWith(`${basePath}/pools`) ||
        location.pathname.startsWith(`${basePath}/l7-policies`))
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

      {/* Project Selector - Hide for compute-admin routes */}
      {!isComputeAdmin && (
        <div className="px-3 py-2">
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={setSelectedProjectId}
            variant="default"
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 pb-6 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <VStack gap={4} className="w-full min-w-0">
          {/* Back to Entry */}
          <Link
            to="/"
            className="w-[175px] px-[var(--menu-item-padding-x)] py-[var(--menu-item-padding-y)] rounded-[var(--menu-item-radius)] flex items-center gap-[var(--menu-item-gap)] text-body-sm transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]"
          >
            <IconArrowLeft size={16} stroke={1.5} />
            <span>All Services</span>
          </Link>

          {isCloudBuilder ? (
            <>
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
                  icon={<EthernetPort size={16} strokeWidth={1.5} />}
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

              <MenuSection title="System info" defaultOpen={true}>
                <MenuItem
                  icon={<IconCpu size={16} stroke={1.5} />}
                  label="Compute services"
                  href="/cloudbuilder/services"
                  active={isActive('/cloudbuilder/services')}
                />
                <MenuItem
                  icon={<IconCpu2 size={16} stroke={1.5} />}
                  label="Compute nodes"
                  href="/cloudbuilder/compute-services"
                  active={isActive('/cloudbuilder/compute-services')}
                />
                <MenuItem
                  icon={<IconNetwork size={16} stroke={1.5} />}
                  label="Network agents"
                  href="/cloudbuilder/network-agents"
                  active={isActive('/cloudbuilder/network-agents')}
                />
                <MenuItem
                  icon={<IconDatabase size={16} stroke={1.5} />}
                  label="Block storage services"
                  href="/cloudbuilder/block-storage-services"
                  active={isActive('/cloudbuilder/block-storage-services')}
                />
                <MenuItem
                  icon={<IconAffiliate size={16} stroke={1.5} />}
                  label="Orchestration services"
                  href="/cloudbuilder/orchestration-services"
                  active={isActive('/cloudbuilder/orchestration-services')}
                />
              </MenuSection>
            </>
          ) : isComputeAdmin ? (
            <>
              {/* Compute Admin Sidebar Menu */}
              <MenuItem
                icon={<IconHome size={16} stroke={1.5} />}
                label="Home"
                href="/compute-admin"
                active={isActive('/compute-admin')}
              />

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
                  label="Server groups"
                  href="/compute-admin/server-groups"
                  active={isActive('/compute-admin/server-groups')}
                />
                <MenuItem
                  icon={<IconServer size={16} stroke={1.5} />}
                  label="Host aggregates"
                  href="/compute-admin/host-aggregates"
                  active={isActive('/compute-admin/host-aggregates')}
                />
                <MenuItem
                  icon={<IconServerBolt size={16} stroke={1.5} />}
                  label="Bare metal nodes"
                  href="/compute-admin/bare-metal-nodes"
                  active={isActive('/compute-admin/bare-metal-nodes')}
                />
              </MenuSection>

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
                <MenuItem
                  icon={<IconLayoutGrid size={16} stroke={1.5} />}
                  label="Volume types"
                  href="/compute-admin/volume-types"
                  active={isActive('/compute-admin/volume-types')}
                />
              </MenuSection>

              <MenuSection title="Network" defaultOpen={true}>
                <MenuItem
                  icon={<IconNetwork size={16} stroke={1.5} />}
                  label="Networks"
                  href="/compute-admin/networks"
                  active={isActive('/compute-admin/networks')}
                />
                <MenuItem
                  icon={
                    <img src={RouterIcon} width={16} height={16} alt="" className="opacity-80" />
                  }
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
              </MenuSection>

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
            </>
          ) : (
            <>
              {/* Home */}
              <MenuItem
                icon={<IconHome size={16} stroke={1.5} />}
                label="Home"
                href={basePath}
                active={isActive(basePath)}
              />

              {/* Compute Section */}
              <MenuSection title="Compute" defaultOpen={true}>
                <MenuItem
                  icon={<IconCube size={16} stroke={1.5} />}
                  label="Instances"
                  href={`${basePath}/instances`}
                  active={isActive(`${basePath}/instances`)}
                />
                <MenuItem
                  icon={<IconTemplate size={16} stroke={1.5} />}
                  label="Instance templates"
                  href={`${basePath}/instance-templates`}
                  active={isActive(`${basePath}/instance-templates`)}
                />
                <MenuItem
                  icon={<IconCamera size={16} stroke={1.5} />}
                  label="Instance snapshots"
                  href={`${basePath}/instance-snapshots`}
                  active={isActive(`${basePath}/instance-snapshots`)}
                />
                <MenuItem
                  icon={<IconDisc size={16} stroke={1.5} />}
                  label="Images"
                  href={`${basePath}/images`}
                  active={isActive(`${basePath}/images`)}
                />
                <MenuItem
                  icon={<IconCpu size={16} stroke={1.5} />}
                  label="Flavors"
                  href={`${basePath}/flavors`}
                  active={isActive(`${basePath}/flavors`)}
                />
                <MenuItem
                  icon={<IconKey size={16} stroke={1.5} />}
                  label="Key pairs"
                  href={`${basePath}/key-pairs`}
                  active={isActive(`${basePath}/key-pairs`)}
                />
                <MenuItem
                  icon={<IconServer size={16} stroke={1.5} />}
                  label="Server groups"
                  href={`${basePath}/server-groups`}
                  active={isActive(`${basePath}/server-groups`)}
                />
              </MenuSection>

              {/* Storage Section */}
              <MenuSection title="Storage" defaultOpen={true}>
                <MenuItem
                  icon={<IconDatabase size={16} stroke={1.5} />}
                  label="Volumes"
                  href={`${basePath}/volumes`}
                  active={isActive(`${basePath}/volumes`)}
                />
                <MenuItem
                  icon={<IconCamera size={16} stroke={1.5} />}
                  label="Volume snapshots"
                  href={`${basePath}/volume-snapshots`}
                  active={isActive(`${basePath}/volume-snapshots`)}
                />
                <MenuItem
                  icon={<IconDatabaseExport size={16} stroke={1.5} />}
                  label="Volume backups"
                  href={`${basePath}/volume-backups`}
                  active={isActive(`${basePath}/volume-backups`)}
                />
              </MenuSection>

              {/* Network Section */}
              <MenuSection title="Network" defaultOpen={true}>
                <MenuItem
                  icon={<IconNetwork size={16} stroke={1.5} />}
                  label="Networks"
                  href={`${basePath}/networks`}
                  active={isActive(`${basePath}/networks`)}
                />
                <MenuItem
                  icon={
                    <img src={RouterIcon} width={16} height={16} alt="" className="opacity-80" />
                  }
                  label="Routers"
                  href={`${basePath}/routers`}
                  active={isActive(`${basePath}/routers`)}
                />
                <MenuItem
                  icon={<ChevronsLeftRightEllipsis size={16} strokeWidth={1.5} />}
                  label="Ports"
                  href={`${basePath}/ports`}
                  active={isActive(`${basePath}/ports`)}
                />
                <MenuItem
                  icon={<IconWorldWww size={16} stroke={1.5} />}
                  label="Floating IPs"
                  href={`${basePath}/floating-ips`}
                  active={isActive(`${basePath}/floating-ips`)}
                />
                <MenuItem
                  icon={<IconShieldLock size={16} stroke={1.5} />}
                  label="Security groups"
                  href={`${basePath}/security-groups`}
                  active={isActive(`${basePath}/security-groups`)}
                />
                <MenuItem
                  icon={<IconLoadBalancer size={16} stroke={1.5} />}
                  label="Load balancers"
                  href={`${basePath}/load-balancers`}
                  active={isActive(`${basePath}/load-balancers`)}
                />
                <MenuItem
                  icon={<IconCertificate size={16} stroke={1.5} />}
                  label="Certificates"
                  href={`${basePath}/certificates`}
                  active={isActive(`${basePath}/certificates`)}
                />
                <MenuItem
                  icon={<IconTopologyStar3 size={16} stroke={1.5} />}
                  label="Topology"
                  href={`${basePath}/topology`}
                  active={isActive(`${basePath}/topology`)}
                />
                <MenuItem
                  icon={<IconRoute size={16} stroke={1.5} />}
                  label="DNS Zones"
                  href={`${basePath}/dns-zones`}
                  active={isActive(`${basePath}/dns-zones`)}
                />
                <MenuItem
                  icon={<IconCloudComputing size={16} stroke={1.5} />}
                  label="Backup Policies"
                  href={`${basePath}/backup-policies`}
                  active={isActive(`${basePath}/backup-policies`)}
                />
                <MenuItem
                  icon={<IconCalendarEvent size={16} stroke={1.5} />}
                  label="Scheduled Tasks"
                  href={`${basePath}/scheduled-tasks`}
                  active={isActive(`${basePath}/scheduled-tasks`)}
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
