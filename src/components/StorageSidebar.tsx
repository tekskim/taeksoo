import { useState } from 'react';
import { VStack, MenuItem, MenuSection } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconDatabase,
  IconTemplate,
  IconCpu,
  IconServer,
  IconDisc,
  IconCube,
  IconBrandSpeedtest,
  IconArrowLeft,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { ProjectSelector } from './ProjectSelector';
import { mockProjects } from '@/contexts/ProjectContext';

/* ----------------------------------------
   Storage Sidebar Component
   ---------------------------------------- */

interface StorageSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function StorageSidebar({ isOpen = true, onToggle }: StorageSidebarProps) {
  const { isDark } = useDarkMode();
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id);
  const location = useLocation();
  
  // Check if current path matches href
  const isActive = (href: string) => {
    // Exact match
    if (location.pathname === href) {
      return true;
    }
    // Match detail pages (e.g., /storage/pools/pool-001 matches /storage/pools)
    if (href !== '/storage' && location.pathname.startsWith(href + '/')) {
      return true;
    }
    return false;
  };
  
  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-10 px-3 flex items-center">
        <img 
          src={isDark ? ThakiLogoDark : ThakiLogoLight} 
          alt="THAKI Cloud" 
          className="h-4"
        />
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
      <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <VStack gap={4} className="w-full min-w-0">
          {/* Back to Entry */}
          <Link
            to="/"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]"
          >
            <IconArrowLeft size={14} stroke={1.5} />
            <span>All Services</span>
          </Link>

          {/* Home */}
          <MenuItem
            icon={<IconHome size={16} stroke={1.5} />}
            label="Home"
            href="/storage"
            active={isActive('/storage')}
          />

          {/* Cluster Section */}
          <MenuSection title="Cluster" defaultOpen={true}>
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Pools"
              href="/storage/pools"
              active={isActive('/storage/pools')}
            />
            <MenuItem
              icon={<IconTemplate size={16} stroke={1.5} />}
              label="Hosts"
              href="/storage/hosts"
              active={isActive('/storage/hosts')}
            />
            <MenuItem
              icon={<IconCpu size={16} stroke={1.5} />}
              label="OSDs"
              href="/storage/osds"
              active={isActive('/storage/osds')}
            />
            <MenuItem
              icon={<IconServer size={16} stroke={1.5} />}
              label="Physical Disks"
              href="/storage/physical-disks"
              active={isActive('/storage/physical-disks')}
            />
          </MenuSection>

          {/* Block Section */}
          <MenuSection title="Block" defaultOpen={true}>
            <MenuItem
              icon={<IconDisc size={16} stroke={1.5} />}
              label="Images"
              href="/storage/images"
              active={isActive('/storage/images')}
            />
          </MenuSection>

          {/* Object Section */}
          <MenuSection title="Object" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Buckets"
              href="/storage/buckets"
              active={isActive('/storage/buckets')}
            />
          </MenuSection>

          {/* Monitoring Section */}
          <MenuSection title="Monitoring" defaultOpen={true}>
            <MenuItem
              icon={<IconBrandSpeedtest size={16} stroke={1.5} />}
              label="Overall Performance"
              href="/storage/performance"
              active={isActive('/storage/performance')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default StorageSidebar;

