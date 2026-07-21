import { VStack, MenuItem } from '@/design-system';
import { IconHome, IconKey, IconLock, IconCertificate } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface KmsSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <IconHome size={16} stroke={1.5} />,
    href: '/kms/overview',
  },
  {
    id: 'keys',
    label: 'Encryption Keys',
    icon: <IconKey size={16} stroke={1.5} />,
    href: '/kms/keys',
  },
  {
    id: 'secrets',
    label: 'Secrets',
    icon: <IconLock size={16} stroke={1.5} />,
    href: '/kms/secrets',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: <IconCertificate size={16} stroke={1.5} />,
    href: '/kms/certificates',
  },
];

export function KmsSidebar({ isOpen = true, onToggle }: KmsSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="kms" onToggleSidebar={onToggle} />
      <nav className="flex-1 overflow-y-auto px-3 pt-3 pb-6">
        <VStack gap={1} className="w-full min-w-0">
          {NAV_ITEMS.map(({ id, label, icon, href }) => (
            <MenuItem
              key={id}
              icon={icon}
              label={label}
              isActive={isActive(href)}
              onClick={() => navigate(href)}
            />
          ))}
        </VStack>
      </nav>
    </aside>
  );
}

export default KmsSidebar;
