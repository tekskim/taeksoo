import { VStack, MenuItem, MenuSection } from '@/design-system';
import { IconApps, IconPackage, IconShieldLock, IconLayoutSidebar } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import appCatalogIcon from '@/assets/appIcon/appcatalog.png';

interface AppCatalogSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AppCatalogSidebar({ isOpen = true, onToggle }: AppCatalogSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (location.pathname.startsWith(href + '/')) return true;
    return false;
  };

  return (
    <div className="flex h-screen fixed left-0 top-0">
      {/* Icon Sidebar (48px) */}
      <aside className="w-[48px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-subtle)] flex flex-col">
        <div className="h-[36px] flex items-center justify-center border-b border-[var(--color-border-subtle)]">
          <img src={appCatalogIcon} alt="App Catalog" className="w-[24px] h-[24px]" />
        </div>
        <div className="flex-1 flex flex-col items-center py-3 gap-1">
          <button
            type="button"
            className="w-[36px] h-[36px] flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--menu-item-active-bg)] text-[var(--menu-item-active-text)]"
            title="App Catalog"
          >
            <IconApps size={16} stroke={1.5} />
          </button>
        </div>
      </aside>

      {/* Menu Sidebar (200px) */}
      {isOpen && (
        <aside className="w-[200px] h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
          <div className="h-[33px] px-3 flex items-center justify-between">
            <span className="text-label-lg text-[var(--color-text-default)]">App Catalog</span>
            <button
              type="button"
              onClick={onToggle}
              className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <IconLayoutSidebar
                size={14}
                className="text-[var(--color-text-muted)] pointer-events-none"
                stroke={1.5}
              />
            </button>
          </div>

          <nav className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden sidebar-scroll [&>div]:!min-w-0">
            <VStack gap={4} className="w-full min-w-0">
              <MenuSection title="App Catalog" defaultOpen={true}>
                <MenuItem
                  icon={<IconApps size={16} stroke={1.5} />}
                  label="Catalog"
                  href="/container/catalog"
                  active={isActive('/container/catalog')}
                />
                <MenuItem
                  icon={<IconPackage size={16} stroke={1.5} />}
                  label="Installed Apps"
                  href="/container/installed-apps"
                  active={isActive('/container/installed-apps')}
                />
                <MenuItem
                  icon={<IconShieldLock size={16} stroke={1.5} />}
                  label="Installed Operators"
                  href="/container/installed-operators"
                  active={isActive('/container/installed-operators')}
                />
              </MenuSection>
            </VStack>
          </nav>
        </aside>
      )}
    </div>
  );
}
