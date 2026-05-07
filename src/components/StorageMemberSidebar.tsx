import { VStack, MenuItem, MenuSection } from '@/design-system';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { IconLayoutDashboard, IconBucket } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

/* ----------------------------------------
   Storage Member Sidebar Component
   ---------------------------------------- */

interface StorageMemberSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function StorageMemberSidebar({ isOpen = true, onToggle }: StorageMemberSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) {
      return true;
    }
    if (href !== '/storage-member' && location.pathname.startsWith(href + '/')) {
      return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="storage-member" onToggleSidebar={onToggle} />

      <OverlayScrollbarsComponent
        element="nav"
        options={{
          overflow: { x: 'hidden', y: 'scroll' },
          scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
        }}
        defer={false}
        className="flex-1 px-3 py-2"
        aria-label="Storage Member navigation"
      >
        <VStack gap={4} className="w-full min-w-0">
          <MenuItem
            icon={<IconLayoutDashboard size={16} stroke={1.5} />}
            label="Dashboard"
            href="/storage-member"
            active={isActive('/storage-member')}
          />

          <MenuSection title="Object" defaultOpen={true}>
            <MenuItem
              icon={<IconBucket size={16} stroke={1.5} />}
              label="Buckets"
              href="/storage-member/buckets"
              active={isActive('/storage-member/buckets')}
            />
          </MenuSection>
        </VStack>
      </OverlayScrollbarsComponent>
    </aside>
  );
}

export default StorageMemberSidebar;
