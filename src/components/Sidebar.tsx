import { useState, useCallback } from 'react';
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
  IconPalette,
  IconLayoutSidebarRight,
} from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { ProjectSelector, mockProjects } from './ProjectSelector';
import { useTabs } from '@/contexts/TabContext';

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
  const navigate = useNavigate();
  const { addTab, selectTab, tabs } = useTabs();
  
  // Check if current path matches href (handle root path for home)
  const isActive = (href: string) => {
    // Home is active for both '/' and '/home'
    if ((href === '/' || href === '/home') && (location.pathname === '/' || location.pathname === '/home')) {
      return true;
    }
    return location.pathname === href;
  };

  // Handle menu click - add/select tab and navigate
  const handleMenuClick = useCallback((href: string, label: string) => {
    // Check if tab already exists
    const existingTab = tabs.find(t => t.path === href);
    if (existingTab) {
      selectTab(existingTab.id);
    } else {
      // Add new tab
      const tabId = `tab-${href.replace(/\//g, '-')}`;
      addTab({
        id: tabId,
        label,
        path: href,
        closable: true,
      });
    }
    navigate(href);
  }, [tabs, selectTab, addTab, navigate]);
  
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
          <button
            onClick={() => handleMenuClick('/design-system', 'Design System')}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-white text-[11px] font-medium transition-colors w-full"
          >
            <IconPalette size={16} stroke={1.5} />
            <span>Design System</span>
          </button>

          {/* Drawers Link */}
          <button
            onClick={() => handleMenuClick('/drawers', 'Drawers')}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[var(--color-action-secondary)] hover:bg-[var(--color-action-secondary-hover)] text-[var(--color-text-default)] text-[11px] font-medium transition-colors border border-[var(--color-border-default)] w-full"
          >
            <IconLayoutSidebarRight size={16} stroke={1.5} />
            <span>Drawers</span>
          </button>

          {/* Home */}
          <MenuItem
            icon={<IconHome size={16} stroke={1.5} />}
            label="Home"
            href="/"
            active={isActive('/')}
            onClick={() => handleMenuClick('/', 'Home')}
          />

          {/* Compute Section */}
          <MenuSection title="Compute" defaultOpen={true}>
            <MenuItem
              icon={<IconCube size={16} stroke={1.5} />}
              label="Instances"
              href="/instances"
              active={isActive('/instances')}
              onClick={() => handleMenuClick('/instances', 'Instances')}
            />
            <MenuItem
              icon={<IconTemplate size={16} stroke={1.5} />}
              label="Instance Templates"
              href="/instance-templates"
              active={isActive('/instance-templates')}
              onClick={() => handleMenuClick('/instance-templates', 'Instance Templates')}
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Instance Snapshots"
              href="/instance-snapshots"
              active={isActive('/instance-snapshots')}
              onClick={() => handleMenuClick('/instance-snapshots', 'Instance Snapshots')}
            />
            <MenuItem
              icon={<IconDisc size={16} stroke={1.5} />}
              label="Images"
              href="/images"
              active={isActive('/images')}
              onClick={() => handleMenuClick('/images', 'Images')}
            />
            <MenuItem
              icon={<IconCpu size={16} stroke={1.5} />}
              label="Flavors"
              href="/flavors"
              active={isActive('/flavors')}
              onClick={() => handleMenuClick('/flavors', 'Flavors')}
            />
            <MenuItem
              icon={<IconKey size={16} stroke={1.5} />}
              label="Key Pairs"
              href="/key-pairs"
              active={isActive('/key-pairs')}
              onClick={() => handleMenuClick('/key-pairs', 'Key Pairs')}
            />
            <MenuItem
              icon={<IconServer size={16} stroke={1.5} />}
              label="Server Groups"
              href="/server-groups"
              active={isActive('/server-groups')}
              onClick={() => handleMenuClick('/server-groups', 'Server Groups')}
            />
          </MenuSection>

          {/* Storage Section */}
          <MenuSection title="Storage" defaultOpen={true}>
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Volumes"
              href="/volumes"
              active={isActive('/volumes')}
              onClick={() => handleMenuClick('/volumes', 'Volumes')}
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Volume Snapshots"
              href="/volume-snapshots"
              active={isActive('/volume-snapshots')}
              onClick={() => handleMenuClick('/volume-snapshots', 'Volume Snapshots')}
            />
            <MenuItem
              icon={<IconDatabaseExport size={16} stroke={1.5} />}
              label="Volume Backups"
              href="/volume-backups"
              active={isActive('/volume-backups')}
              onClick={() => handleMenuClick('/volume-backups', 'Volume Backups')}
            />
          </MenuSection>

          {/* Network Section */}
          <MenuSection title="Network" defaultOpen={true}>
            <MenuItem
              icon={<IconNetwork size={16} stroke={1.5} />}
              label="Networks"
              href="/networks"
              active={isActive('/networks')}
              onClick={() => handleMenuClick('/networks', 'Networks')}
            />
            <MenuItem
              icon={<IconRouter size={16} stroke={1.5} />}
              label="Routers"
              href="/routers"
              active={isActive('/routers')}
              onClick={() => handleMenuClick('/routers', 'Routers')}
            />
            <MenuItem
              icon={<IconPlug size={16} stroke={1.5} />}
              label="Ports"
              href="/ports"
              active={isActive('/ports')}
              onClick={() => handleMenuClick('/ports', 'Ports')}
            />
            <MenuItem
              icon={<IconWorldWww size={16} stroke={1.5} />}
              label="Floating IPs"
              href="/floating-ips"
              active={isActive('/floating-ips')}
              onClick={() => handleMenuClick('/floating-ips', 'Floating IPs')}
            />
            <MenuItem
              icon={<IconShieldLock size={16} stroke={1.5} />}
              label="Security Groups"
              href="/security-groups"
              active={isActive('/security-groups')}
              onClick={() => handleMenuClick('/security-groups', 'Security Groups')}
            />
            <MenuItem
              icon={<IconLoadBalancer size={16} stroke={1.5} />}
              label="Load Balancers"
              href="/load-balancers"
              active={isActive('/load-balancers')}
              onClick={() => handleMenuClick('/load-balancers', 'Load Balancers')}
            />
            <MenuItem
              icon={<IconCertificate size={16} stroke={1.5} />}
              label="Certificates"
              href="/certificates"
              active={isActive('/certificates')}
              onClick={() => handleMenuClick('/certificates', 'Certificates')}
            />
            <MenuItem
              icon={<IconTopologyStar3 size={16} stroke={1.5} />}
              label="Topology"
              href="/topology"
              active={isActive('/topology')}
              onClick={() => handleMenuClick('/topology', 'Topology')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default Sidebar;
