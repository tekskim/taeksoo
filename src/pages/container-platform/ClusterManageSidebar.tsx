import { VStack, Badge, MenuItem, MenuSection } from '@/design-system';
import {
  IconArrowLeft,
  IconLayoutDashboard,
  IconRocket,
  IconDatabase,
  IconActivity,
  IconNetwork,
  IconSettings,
  IconShieldLock,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsDesktopWindow, useDesktopWindowControls } from '@/contexts/DesktopWindowContext';
import { getClusterById } from './containerPlatformMockData';
import type { Cluster } from './containerPlatformTypes';

/* ----------------------------------------
   Cluster manage sidebar (cluster scope)

   Shown when the operator enters a single cluster from the estate view. The
   sidebar swaps from the estate menu to this cluster-scoped manage menu, with
   an explicit way back to the estate ("All clusters"). Same 200px frame as
   ContainerPlatformSidebar so the swap feels like a mode change, not a new app.
   ---------------------------------------- */

export const CLUSTER_MANAGE_SIDEBAR_WIDTH = 200;

export function manageBasePath(clusterId: string) {
  return `/container-platform/clusters/${clusterId}/manage`;
}

export function ClusterManageSidebar({ clusterId }: { clusterId: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktopWindow = useIsDesktopWindow();
  const desktopControls = useDesktopWindowControls();

  const cluster: Cluster | undefined = getClusterById(clusterId);
  const base = manageBasePath(clusterId);

  const isActive = (href: string, exact = false) =>
    exact
      ? location.pathname === href
      : location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <aside className="w-[200px] h-screen fixed left-0 top-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
      {/* Title */}
      <div
        className="h-[33px] px-3 flex items-center select-none"
        onMouseDown={isDesktopWindow ? desktopControls?.onDragStart : undefined}
        onDoubleClick={isDesktopWindow ? desktopControls?.onDoubleClick : undefined}
      >
        <span className="text-label-lg text-[var(--color-text-default)]">Container Platform</span>
      </div>

      {/* Back to estate */}
      <div className="px-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/container-platform/clusters')}
          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-body-sm text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors"
        >
          <IconArrowLeft size={14} stroke={1.5} />
          All clusters
        </button>
      </div>

      {/* Cluster identity */}
      <div className="px-5 pt-2 pb-1 flex items-center gap-2 min-w-0">
        <span
          className="text-label-md text-[var(--color-text-default)] truncate"
          title={cluster?.name ?? clusterId}
        >
          {cluster?.name ?? clusterId}
        </span>
        {cluster && (
          <Badge theme={cluster.source === 'Aegis' ? 'blue' : 'gray'} type="subtle" size="sm">
            {cluster.source}
          </Badge>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <VStack gap={4} className="w-full min-w-0">
          <MenuSection title="Manage" defaultOpen={true}>
            <MenuItem
              icon={<IconLayoutDashboard size={16} stroke={1.5} />}
              label="Overview"
              href={base}
              active={isActive(base, true)}
            />
            <MenuItem
              icon={<IconRocket size={16} stroke={1.5} />}
              label="Workloads"
              href={`${base}/workloads`}
              active={isActive(`${base}/workloads`)}
            />
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Volumes"
              href={`${base}/volumes`}
              active={isActive(`${base}/volumes`)}
            />
            <MenuItem
              icon={<IconActivity size={16} stroke={1.5} />}
              label="Events"
              href={`${base}/events`}
              active={isActive(`${base}/events`)}
            />
          </MenuSection>

          <MenuSection title="Cluster resources" defaultOpen={true}>
            <MenuItem
              icon={<IconNetwork size={16} stroke={1.5} />}
              label="Services & Ingress"
              href={`${base}/services`}
              active={isActive(`${base}/services`)}
            />
            <MenuItem
              icon={<IconSettings size={16} stroke={1.5} />}
              label="Config"
              href={`${base}/config`}
              active={isActive(`${base}/config`)}
            />
            <MenuItem
              icon={<IconShieldLock size={16} stroke={1.5} />}
              label="Policy"
              href={`${base}/policy`}
              active={isActive(`${base}/policy`)}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default ClusterManageSidebar;
