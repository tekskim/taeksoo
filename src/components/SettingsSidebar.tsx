import { VStack, MenuItem } from '@/design-system';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { IconSettings, IconUser, IconBell, IconInfoCircle } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

/* ----------------------------------------
   Settings Sidebar Component
   ---------------------------------------- */

interface SettingsSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function SettingsSidebar({ isOpen = true, onToggle }: SettingsSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) {
      return true;
    }
    if (href === '/settings/general') {
      return location.pathname === '/settings' || location.pathname === '/settings/general';
    }
    if (location.pathname.startsWith(href + '/')) {
      return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="settings" onToggleSidebar={onToggle} />

      <OverlayScrollbarsComponent
        element="nav"
        options={{
          overflow: { x: 'hidden', y: 'scroll' },
          scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
        }}
        defer={false}
        className="flex-1 px-3 py-2 pb-6"
        aria-label="Settings navigation"
      >
        <VStack gap={0} className="w-full min-w-0">
          <MenuItem
            icon={<IconSettings size={16} stroke={1.5} />}
            label="General"
            href="/settings/general"
            active={isActive('/settings/general')}
          />
          <MenuItem
            icon={<IconUser size={16} stroke={1.5} />}
            label="Account"
            href="/settings/account"
            active={isActive('/settings/account')}
          />
          <MenuItem
            icon={<IconBell size={16} stroke={1.5} />}
            label="Notifications"
            href="/settings/notifications"
            active={isActive('/settings/notifications')}
          />
          <MenuItem
            icon={<IconInfoCircle size={16} stroke={1.5} />}
            label="Information"
            href="/settings/information"
            active={isActive('/settings/information')}
          />
        </VStack>
      </OverlayScrollbarsComponent>
    </aside>
  );
}

export default SettingsSidebar;
