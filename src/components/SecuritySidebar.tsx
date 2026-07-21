import { VStack, MenuItem, MenuSection } from '@/design-system';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { IconShieldLock, IconBuildingFortress, IconNetwork } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface SecuritySidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  forceVisible?: boolean;
}

export function SecuritySidebar({ isOpen = true, onToggle, forceVisible }: SecuritySidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (location.pathname === href) return true;
    if (href !== '/security' && location.pathname.startsWith(href + '/')) return true;
    if (
      href === '/security/firewalls' &&
      (location.pathname.startsWith('/security/firewall-policies') ||
        location.pathname.startsWith('/security/firewall-rules'))
    ) {
      return true;
    }
    return false;
  };

  if (!isOpen && !forceVisible) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="security" onToggleSidebar={onToggle} />

      <OverlayScrollbarsComponent
        element="nav"
        options={{
          overflow: { x: 'hidden', y: 'scroll' },
          scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
        }}
        defer={false}
        className="flex-1 px-3 py-2"
        aria-label="Security navigation"
      >
        <VStack gap={4} className="w-full min-w-0">
          <MenuSection title="Network" defaultOpen={true}>
            <MenuItem
              icon={<IconShieldLock size={16} stroke={1.5} />}
              label="Firewalls"
              href="/security/firewalls"
              active={isActive('/security/firewalls')}
            />
          </MenuSection>

          <MenuSection title="Compute" defaultOpen={true}>
            <MenuItem
              icon={<IconBuildingFortress size={16} stroke={1.5} />}
              label="Security groups"
              href="/security/security-groups"
              active={isActive('/security/security-groups')}
            />
          </MenuSection>

          <MenuSection title="Container" defaultOpen={true}>
            <MenuItem
              icon={<IconNetwork size={16} stroke={1.5} />}
              label="Network policies"
              href="/security/network-policies"
              active={isActive('/security/network-policies')}
            />
          </MenuSection>
        </VStack>
      </OverlayScrollbarsComponent>
    </aside>
  );
}

export default SecuritySidebar;
