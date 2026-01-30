import { VStack, MenuItem, MenuSection } from '@/design-system';
import {
  IconHome,
  IconUsers,
  IconUsersGroup,
  IconShieldLock,
  IconFileDescription,
  IconKey,
  IconDeviceDesktop,
  IconWorld,
  IconUserCog,
  IconLock,
  IconClock,
  IconHistory,
  IconArrowLeft,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

/* ----------------------------------------
   IAM Sidebar Component
   ---------------------------------------- */

interface IAMSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function IAMSidebar({ isOpen = true, onToggle }: IAMSidebarProps) {
  const location = useLocation();

  // Check if current path matches href
  const isActive = (href: string) => {
    // Exact match
    if (location.pathname === href) {
      return true;
    }
    // Match detail pages (e.g., /iam/users/user-001 matches /iam/users)
    if (href !== '/iam' && location.pathname.startsWith(href + '/')) {
      return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      {/* App Switcher with Toggle */}
      <AppSwitcher onToggleSidebar={onToggle} />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <VStack gap={4} className="w-full min-w-0">
          {/* Back to Entry */}
          <Link
            to="/"
            className="w-[175px] px-[var(--menu-item-padding-x)] py-[var(--menu-item-padding-y)] rounded-[var(--menu-item-radius)] flex items-center gap-[var(--menu-item-gap)] text-body-sm transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]"
          >
            <IconArrowLeft size={16} stroke={1.5} />
            <span>All Services</span>
          </Link>

          {/* Home */}
          <MenuItem
            icon={<IconHome size={16} stroke={1.5} />}
            label="Home"
            href="/iam"
            active={isActive('/iam')}
          />

          {/* Access Management Section */}
          <MenuSection title="Access management" defaultOpen={true}>
            <MenuItem
              icon={<IconUsers size={16} stroke={1.5} />}
              label="Users"
              href="/iam/users"
              active={isActive('/iam/users')}
            />
            <MenuItem
              icon={<IconUsersGroup size={16} stroke={1.5} />}
              label="User groups"
              href="/iam/user-groups"
              active={isActive('/iam/user-groups')}
            />
            <MenuItem
              icon={<IconShieldLock size={16} stroke={1.5} />}
              label="Roles"
              href="/iam/roles"
              active={isActive('/iam/roles')}
            />
            <MenuItem
              icon={<IconFileDescription size={16} stroke={1.5} />}
              label="Policies"
              href="/iam/policies"
              active={isActive('/iam/policies')}
            />
          </MenuSection>

          {/* Authentication Section */}
          <MenuSection title="Authentication" defaultOpen={true}>
            <MenuItem
              icon={<IconKey size={16} stroke={1.5} />}
              label="MFA policies"
              href="/iam/mfa-policies"
              active={isActive('/iam/mfa-policies')}
            />
          </MenuSection>

          {/* Session Management Section */}
          <MenuSection title="Session management" defaultOpen={true}>
            <MenuItem
              icon={<IconClock size={16} stroke={1.5} />}
              label="Session policies"
              href="/iam/session-policies"
              active={isActive('/iam/session-policies')}
            />
            <MenuItem
              icon={<IconDeviceDesktop size={16} stroke={1.5} />}
              label="Active sessions"
              href="/iam/active-sessions"
              active={isActive('/iam/active-sessions')}
            />
          </MenuSection>

          {/* Global Administration Section */}
          <MenuSection title="Global administration" defaultOpen={true}>
            <MenuItem
              icon={<IconWorld size={16} stroke={1.5} />}
              label="Domains"
              href="/iam/domains"
              active={isActive('/iam/domains')}
            />
            <MenuItem
              icon={<IconUserCog size={16} stroke={1.5} />}
              label="System administrators"
              href="/iam/system-administrators"
              active={isActive('/iam/system-administrators')}
            />
            <MenuItem
              icon={<IconLock size={16} stroke={1.5} />}
              label="Login policies"
              href="/iam/login-policies"
              active={isActive('/iam/login-policies')}
            />
            <MenuItem
              icon={<IconKey size={16} stroke={1.5} />}
              label="Token policies"
              href="/iam/token-policies"
              active={isActive('/iam/token-policies')}
            />
          </MenuSection>

          {/* Monitoring Section */}
          <MenuSection title="Monitoring" defaultOpen={true}>
            <MenuItem
              icon={<IconHistory size={16} stroke={1.5} />}
              label="Event logs"
              href="/iam/event-logs"
              active={isActive('/iam/event-logs')}
            />
          </MenuSection>
        </VStack>
      </nav>
    </aside>
  );
}

export default IAMSidebar;
