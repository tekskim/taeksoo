import { VStack, MenuItem } from '@/design-system';
import {
  IconSettings,
  IconUser,
  IconBell,
  IconInfoCircle,
  IconArrowLeft,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

/* ----------------------------------------
   Settings Sidebar Component
   ---------------------------------------- */

export function SettingsSidebar() {
  const location = useLocation();

  // Check if current path matches href
  const isActive = (href: string) => {
    // Exact match
    if (location.pathname === href) {
      return true;
    }
    // For /settings root, only match exact
    if (href === '/settings/general') {
      return location.pathname === '/settings' || location.pathname === '/settings/general';
    }
    // Match detail pages
    if (location.pathname.startsWith(href + '/')) {
      return true;
    }
    return false;
  };

  return (
    <aside className="w-[200px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <VStack gap={2} className="w-full min-w-0">
          {/* Back to Entry */}
          <Link
            to="/"
            className="w-[175px] px-[var(--menu-item-padding-x)] py-[var(--menu-item-padding-y)] rounded-[var(--menu-item-radius)] flex items-center gap-[var(--menu-item-gap)] text-[length:var(--font-size-11)] transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] mb-2"
          >
            <IconArrowLeft size={16} stroke={1.5} />
            <span>All Services</span>
          </Link>

          {/* Menu Items */}
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
      </nav>
    </aside>
  );
}

export default SettingsSidebar;
