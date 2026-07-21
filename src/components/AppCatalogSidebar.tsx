import { useState } from 'react';
import { VStack, MenuItem, MenuSection, Select } from '@/design-system';
import { IconApps, IconPackage, IconStack2 } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppSwitcher } from './AppSwitcher';

interface AppCatalogSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// 사이드바 상단 Cluster Selector (와이어프레임 AC-001 기준).
// 기본값 = 가장 최근 생성된 클러스터. 다른 클러스터 선택 시 해당 클러스터 Catalog로 context switching.
// Empty this array to exercise the "no cluster" empty state (AC-EMPTY).
export const APP_CATALOG_CLUSTERS = [
  { label: 'prod-cluster-01', value: 'prod-cluster-01' },
  { label: 'staging-cluster', value: 'staging-cluster' },
  { label: 'dev-cluster', value: 'dev-cluster' },
];

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
  const hasCluster = APP_CATALOG_CLUSTERS.length > 0;
  const [cluster, setCluster] = useState(APP_CATALOG_CLUSTERS[0]?.value ?? '');

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  if (!isOpen) return null;

  return (
    <aside className="w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0">
      <AppSwitcher currentAppId="app-catalog" onToggleSidebar={onToggle} />

      {/* Cluster Selector — 와이어프레임: 사이드 메뉴 상단에 클러스터 선택 Select */}
      <div className="px-3 py-3 border-b border-[var(--color-border-subtle)]">
        <span className="text-body-xs text-[var(--color-text-subtle)]">Cluster</span>
        <div className="mt-1.5">
          <Select
            options={APP_CATALOG_CLUSTERS}
            value={hasCluster ? cluster : ''}
            onChange={setCluster}
            placeholder={hasCluster ? 'Select cluster' : 'No clusters available'}
            disabled={!hasCluster}
            fullWidth
            size="sm"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-6">
        <VStack gap={2} className="w-full min-w-0">
          {hasCluster &&
            NAV_ITEMS.map(({ section, items }) => (
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
