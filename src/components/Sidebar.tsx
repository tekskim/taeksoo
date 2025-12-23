import { VStack, MenuItem, MenuSection } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  IconHome,
  IconServer,
  IconTemplate,
  IconCamera,
  IconPhoto,
  IconCpu,
  IconKey,
  IconUsers,
  IconBox,
  IconStack2,
  IconDatabase,
  IconDatabaseExport,
  IconDeviceFloppy,
  IconServer2,
  IconNetwork,
  IconRouter,
  IconPlug,
  IconWorldWww,
  IconShield,
  IconScale,
  IconCertificate,
  IconTopologyRing,
  IconLayoutSidebar,
  IconPalette,
} from '@tabler/icons-react';
import { ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';

/* ----------------------------------------
   Sidebar Component
   ---------------------------------------- */

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const { isDark } = useDarkMode();
  
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
        <button className="w-full px-2.5 py-1.5 rounded-md bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors flex items-center justify-between">
          <span className="text-[11px] font-medium text-[var(--color-text-default)]">Proj-1</span>
          <ArrowRightLeft size={12} className="text-[var(--color-text-default)]" strokeWidth={1.5} />
        </button>
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
          />

          {/* Compute Section */}
          <MenuSection title="Compute" defaultOpen={true}>
            <MenuItem
              icon={<IconServer size={16} stroke={1.5} />}
              label="Instances"
              href="/instances"
              active={true}
            />
            <MenuItem
              icon={<IconTemplate size={16} stroke={1.5} />}
              label="Instance Templates"
              href="/instance-templates"
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Instance Snapshots"
              href="/instance-snapshots"
            />
            <MenuItem
              icon={<IconPhoto size={16} stroke={1.5} />}
              label="Images"
              href="/images"
            />
            <MenuItem
              icon={<IconCpu size={16} stroke={1.5} />}
              label="Flavors"
              href="/flavors"
            />
            <MenuItem
              icon={<IconKey size={16} stroke={1.5} />}
              label="Key Pairs"
              href="/key-pairs"
            />
            <MenuItem
              icon={<IconUsers size={16} stroke={1.5} />}
              label="Server Groups"
              href="/server-groups"
            />
            <MenuItem
              icon={<IconBox size={16} stroke={1.5} />}
              label="Hypervisors"
              href="/hypervisors"
            />
            <MenuItem
              icon={<IconStack2 size={16} stroke={1.5} />}
              label="Host Aggregates"
              href="/host-aggregates"
            />
          </MenuSection>

          {/* Storage Section */}
          <MenuSection title="Storage" defaultOpen={true}>
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Volumes"
              href="/volumes"
            />
            <MenuItem
              icon={<IconCamera size={16} stroke={1.5} />}
              label="Volume Snapshots"
              href="/volume-snapshots"
            />
            <MenuItem
              icon={<IconDatabaseExport size={16} stroke={1.5} />}
              label="Volume Backups"
              href="/volume-backups"
            />
            <MenuItem
              icon={<IconDeviceFloppy size={16} stroke={1.5} />}
              label="Volume Type"
              href="/volume-type"
            />
            <MenuItem
              icon={<IconServer2 size={16} stroke={1.5} />}
              label="Storage Backends"
              href="/storage-backends"
            />
          </MenuSection>

          {/* Network Section */}
          <MenuSection title="Network" defaultOpen={true}>
            <MenuItem
              icon={<IconNetwork size={16} stroke={1.5} />}
              label="Networks"
              href="/networks"
            />
            <MenuItem
              icon={<IconRouter size={16} stroke={1.5} />}
              label="Routers"
              href="/routers"
            />
            <MenuItem
              icon={<IconPlug size={16} stroke={1.5} />}
              label="Ports"
              href="/ports"
            />
            <MenuItem
              icon={<IconWorldWww size={16} stroke={1.5} />}
              label="Floating IPs"
              href="/floating-ips"
            />
            <MenuItem
              icon={<IconShield size={16} stroke={1.5} />}
              label="Security Groups"
              href="/security-groups"
            />
            <MenuItem
              icon={<IconScale size={16} stroke={1.5} />}
              label="Load Balancers"
              href="/load-balancers"
            />
            <MenuItem
              icon={<IconCertificate size={16} stroke={1.5} />}
              label="Certificates"
              href="/certificates"
            />
            <MenuItem
              icon={<IconTopologyRing size={16} stroke={1.5} />}
              label="Topology"
              href="/topology"
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default Sidebar;
