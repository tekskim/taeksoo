import { VStack, MenuItem, MenuSection } from '@/design-system';
import {
  IconLayoutDashboard,
  IconTopologyStar,
  IconRocket,
  IconBrain,
  IconStack2,
  IconActivity,
} from '@tabler/icons-react';
import { FolderCog } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useIsDesktopWindow, useDesktopWindowControls } from '@/contexts/DesktopWindowContext';

/* ----------------------------------------
   Container Platform Sidebar

   A single persistent 200px left sidebar. Overview / Clusters / Nodes /
   Workloads / AI Workloads. No ContainerMode / cluster / drawer /
   icon-sidebar complexity — this is the Walking Skeleton shell (Phase 1).
   ---------------------------------------- */

export const CONTAINER_PLATFORM_SIDEBAR_WIDTH = 200;

export function ContainerPlatformSidebar() {
  const location = useLocation();
  const isDesktopWindow = useIsDesktopWindow();
  const desktopControls = useDesktopWindowControls();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <VStack gap={4} className="w-full min-w-0">
          <MenuSection title="Container Platform" defaultOpen={true}>
            <MenuItem
              icon={<IconLayoutDashboard size={16} stroke={1.5} />}
              label="Overview"
              href="/container-platform/overview"
              active={isActive('/container-platform/overview')}
            />
            <MenuItem
              icon={<FolderCog size={16} strokeWidth={1.5} />}
              label="Clusters"
              href="/container-platform/clusters"
              active={isActive('/container-platform/clusters')}
            />
            <MenuItem
              icon={<IconTopologyStar size={16} stroke={1.5} />}
              label="Nodes"
              href="/container-platform/nodes"
              active={isActive('/container-platform/nodes')}
            />
            <MenuItem
              icon={<IconStack2 size={16} stroke={1.5} />}
              label="Namespaces"
              href="/container-platform/namespaces"
              active={isActive('/container-platform/namespaces')}
            />
            <MenuItem
              icon={<IconRocket size={16} stroke={1.5} />}
              label="Workloads"
              href="/container-platform/workloads"
              active={isActive('/container-platform/workloads')}
            />
            <MenuItem
              icon={<IconBrain size={16} stroke={1.5} />}
              label="AI Workloads"
              href="/container-platform/ai-workloads"
              active={isActive('/container-platform/ai-workloads')}
            />
            <MenuItem
              icon={<IconActivity size={16} stroke={1.5} />}
              label="Events"
              href="/container-platform/events"
              active={isActive('/container-platform/events')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default ContainerPlatformSidebar;
