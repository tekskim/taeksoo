import { VStack, MenuItem, MenuSection } from '@/design-system';
import { IconHistory, IconBookmark, IconActivityHeartbeat } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface LogSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const NAV_ITEMS = [
  {
    section: 'Log',
    items: [
      {
        id: 'log-explorer',
        label: 'Log Explorer',
        icon: <IconHistory size={16} stroke={1.5} />,
        href: '/logs/explorer',
      },
      {
        id: 'saved-queries',
        label: 'Saved Queries',
        icon: <IconBookmark size={16} stroke={1.5} />,
        href: '/logs/saved-queries',
      },
      {
        id: 'live-tail',
        label: 'Live Tail',
        icon: <IconActivityHeartbeat size={16} stroke={1.5} />,
        href: '/logs/live-tail',
      },
    ],
  },
];

export function LogSidebar({ isOpen = true, onToggle }: LogSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="logs" onToggleSidebar={onToggle} />
      <nav className="flex-1 overflow-y-auto px-3 pt-3 pb-6">
        <VStack gap={2} className="w-full min-w-0">
          {NAV_ITEMS.map(({ section, items }) => (
            <MenuSection key={section} title={section}>
              {items.map(({ id, label, icon, href }) => (
                <MenuItem
                  key={id}
                  icon={icon}
                  label={label}
                  isActive={isActive(href)}
                  onClick={() => navigate(href)}
                />
              ))}
            </MenuSection>
          ))}
        </VStack>
      </nav>
    </aside>
  );
}

export default LogSidebar;
