import { VStack, MenuItem, MenuSection } from '@/design-system';
import {
  IconHome,
  IconDatabase,
  IconDisc,
  IconBucket,
  IconBrandSpeedtest,
} from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

/* ----------------------------------------
   Storage Domain Admin Sidebar Component
   ---------------------------------------- */

interface StorageDomainAdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function StorageDomainAdminSidebar({
  isOpen = true,
  onToggle,
}: StorageDomainAdminSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) {
      return true;
    }
    if (href !== '/storage-domain-admin' && location.pathname.startsWith(href + '/')) {
      return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="storage-domain-admin" onToggleSidebar={onToggle} />

      <nav
        className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden sidebar-scroll"
        aria-label="Storage Domain Admin navigation"
      >
        <VStack gap={4} className="w-full min-w-0">
          <MenuItem
            icon={<IconHome size={16} stroke={1.5} />}
            label="Dashboard"
            href="/storage-domain-admin"
            active={isActive('/storage-domain-admin')}
          />

          <MenuSection title="Cluster" defaultOpen={true}>
            <MenuItem
              icon={<IconDatabase size={16} stroke={1.5} />}
              label="Pools"
              href="/storage-domain-admin/pools"
              active={isActive('/storage-domain-admin/pools')}
            />
          </MenuSection>

          <MenuSection title="Block" defaultOpen={true}>
            <MenuItem
              icon={<IconDisc size={16} stroke={1.5} />}
              label="Images"
              href="/storage-domain-admin/images"
              active={isActive('/storage-domain-admin/images')}
            />
          </MenuSection>

          <MenuSection title="Object" defaultOpen={true}>
            <MenuItem
              icon={<IconBucket size={16} stroke={1.5} />}
              label="Buckets"
              href="/storage-domain-admin/buckets"
              active={isActive('/storage-domain-admin/buckets')}
            />
          </MenuSection>

          <MenuSection title="Monitoring" defaultOpen={true}>
            <MenuItem
              icon={<IconBrandSpeedtest size={16} stroke={1.5} />}
              label="Overall performance"
              href="/storage-domain-admin/performance"
              active={isActive('/storage-domain-admin/performance')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default StorageDomainAdminSidebar;
