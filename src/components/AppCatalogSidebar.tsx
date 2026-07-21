import { VStack, MenuItem, MenuSection } from '@/design-system';
import { IconApps, IconPackage, IconStack2 } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface AppCatalogSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const NAV_ITEMS = [
  {
    section: 'App Catalog',
    items: [
      {
        id: 'catalog',
        label: 'Catalog',
        icon: <IconApps size={16} stroke={1.5} />,
        href: '/app-catalog',
      },
      {
        id: 'installed-apps',
        label: 'Installed Apps',
        icon: <IconPackage size={16} stroke={1.5} />,
        href: '/app-catalog/installed-apps',
      },
      {
        id: 'installed-operators',
        label: 'Installed Operators',
        icon: <IconStack2 size={16} stroke={1.5} />,
        href: '/app-catalog/installed-operators',
      },
    ],
  },
];

export function AppCatalogSidebar({ isOpen = true, onToggle }: AppCatalogSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="app-catalog" onToggleSidebar={onToggle} />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6">
        <VStack gap={2} className="w-full min-w-0">
          {NAV_ITEMS.map(({ section, items }) => (
            <MenuSection key={section || 'main'} title={section || undefined}>
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

export default AppCatalogSidebar;
