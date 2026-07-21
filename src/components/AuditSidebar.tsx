import { VStack, MenuItem, MenuSection } from '@/design-system';
import { IconLayoutDashboard, IconListSearch, IconReportAnalytics } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface AuditSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// 정책서 §0-1: Audit 앱 = 감사 대시보드 / 감사 로그 / 리포트 (3개 화면)
const NAV_ITEMS = [
  {
    section: 'Audit',
    items: [
      {
        id: 'audit-dashboard',
        label: 'Dashboard',
        icon: <IconLayoutDashboard size={16} stroke={1.5} />,
        href: '/audit/dashboard',
      },
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        icon: <IconListSearch size={16} stroke={1.5} />,
        href: '/audit/logs',
      },
      {
        id: 'audit-reports',
        label: 'Reports',
        icon: <IconReportAnalytics size={16} stroke={1.5} />,
        href: '/audit/reports',
      },
    ],
  },
];

export function AuditSidebar({ isOpen = true, onToggle }: AuditSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="audit" onToggleSidebar={onToggle} />
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

export default AuditSidebar;
