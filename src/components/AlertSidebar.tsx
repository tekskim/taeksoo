import { VStack, MenuItem, MenuSection } from '@/design-system';
import { IconBell, IconSend } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface AlertSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const NAV_ITEMS = [
  {
    section: 'Alert',
    items: [
      {
        id: 'alert-board',
        label: 'Alert Board',
        icon: <IconBell size={16} stroke={1.5} />,
        href: '/alerts/board',
      },
      {
        id: 'delivery-settings',
        label: 'Delivery Settings',
        icon: <IconSend size={16} stroke={1.5} />,
        href: '/alerts/delivery-settings',
      },
    ],
  },
];

export function AlertSidebar({ isOpen = true, onToggle }: AlertSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="alert" onToggleSidebar={onToggle} />
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

export default AlertSidebar;
