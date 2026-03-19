import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarMenu } from '@shared/components/Sidebar';
import type { SidebarSection } from '@shared/components/Sidebar';
import type { SidebarIconComponent } from '@shared/components/Sidebar';
import IAMIcon from '../assets/appIcon/iam.png';
import {
  IconLayoutSidebar,
  IconShieldLock,
  IconHome,
  IconUsers,
  IconUsersGroup,
  IconKey,
  IconFileDescription,
  IconLock,
  IconDeviceDesktop,
  IconWorld,
  IconUserCog,
  IconClock,
  IconHistory,
} from '@tabler/icons-react';

function makeTablerIcon(TablerIcon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>): SidebarIconComponent {
  const Wrapped: SidebarIconComponent = ({ variant, size }: { variant?: string; size?: number }) => {
    const colorClass = variant === 'primary' ? 'text-primary' : 'text-text-muted';
    return <TablerIcon size={size ?? 16} stroke={1.5} className={colorClass} />;
  };
  return Wrapped;
}

const HomeIconW = makeTablerIcon(IconHome);
const UsersIconW = makeTablerIcon(IconUsers);
const UsersGroupIconW = makeTablerIcon(IconUsersGroup);
const ShieldLockIconW = makeTablerIcon(IconShieldLock);
const KeyIconW = makeTablerIcon(IconKey);
const FileIconW = makeTablerIcon(IconFileDescription);
const LockIconW = makeTablerIcon(IconLock);
const DeviceDesktopIconW = makeTablerIcon(IconDeviceDesktop);
const WorldIconW = makeTablerIcon(IconWorld);
const UserCogIconW = makeTablerIcon(IconUserCog);
const ClockIconW = makeTablerIcon(IconClock);
const HistoryIconW = makeTablerIcon(IconHistory);

const sections: SidebarSection[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/iam',
    icon: HomeIconW,
  },
  {
    id: 'access-management',
    label: 'Access management',
    children: [
      { id: 'users', label: 'Users', path: '/iam/users', icon: UsersIconW },
      { id: 'user-groups', label: 'User groups', path: '/iam/user-groups', icon: UsersGroupIconW },
      { id: 'roles', label: 'Roles', path: '/iam/roles', icon: ShieldLockIconW },
      { id: 'policies', label: 'Policies', path: '/iam/policies', icon: FileIconW },
    ],
  },
  {
    id: 'authentication',
    label: 'Authentication',
    children: [
      { id: 'mfa-policies', label: 'MFA policies', path: '/iam/mfa-policies', icon: KeyIconW },
    ],
  },
  {
    id: 'session-management',
    label: 'Session management',
    children: [
      { id: 'session-policies', label: 'Session policies', path: '/iam/session-policies', icon: ClockIconW },
      { id: 'active-sessions', label: 'Active sessions', path: '/iam/active-sessions', icon: DeviceDesktopIconW },
    ],
  },
  {
    id: 'global-administration',
    label: 'Global administration',
    children: [
      { id: 'domains', label: 'Domains', path: '/iam/domains', icon: WorldIconW },
      { id: 'system-administrators', label: 'System administrators', path: '/iam/system-administrators', icon: UserCogIconW },
      { id: 'login-policies', label: 'Login policies', path: '/iam/login-policies', icon: LockIconW },
      { id: 'token-policies', label: 'Token policies', path: '/iam/token-policies', icon: KeyIconW },
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    children: [
      { id: 'event-logs', label: 'Event logs', path: '/iam/event-logs', icon: HistoryIconW },
    ],
  },
];

const defaultOpenSections = [
  'access-management',
  'authentication',
  'session-management',
  'global-administration',
  'monitoring',
];

interface IAMSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function IAMSidebar({ isCollapsed, onToggle }: IAMSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/iam' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  const handleNavigate = (path: string, _options: { newTab: boolean }) => {
    navigate(path);
  };

  return (
    <Sidebar isCollapsed={isCollapsed}>
      {/* AppSwitcher header — counteract parent py-2 to sit flush at top */}
      <div className="h-10 -mt-2 mb-2 flex items-center gap-2 flex-shrink-0">
        <img
          src={IAMIcon}
          alt="IAM"
          className="w-[24px] h-[24px] flex-shrink-0"
        />
        <span className="flex-1 text-[13px] font-medium leading-5 text-text truncate">
          IAM
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="p-1 hover:bg-surface-hover rounded transition-colors cursor-pointer flex-shrink-0 border-none bg-transparent"
          aria-label="Toggle sidebar"
        >
          <IconLayoutSidebar size={14} className="text-text-muted pointer-events-none" stroke={1.5} />
        </button>
      </div>

      <SidebarMenu
        sections={sections}
        defaultOpenSections={defaultOpenSections}
        onNavigate={handleNavigate}
        isItemActive={isItemActive}
      />
    </Sidebar>
  );
}

export default IAMSidebar;
