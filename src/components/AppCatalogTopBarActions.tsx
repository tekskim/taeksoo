import { Tooltip } from '@/design-system';
import { IconPencilCog, IconSearch } from '@tabler/icons-react';

/**
 * App Catalog TopBar Utility Controls.
 * Aegis Container의 Utility Controls 중 Cluster appearance + Resource search 만 노출한다.
 * (Kubectl shell / KubeConfig 다운로드·복사 등 클러스터 운영 컨트롤과 Bell 등은 App Catalog에 두지 않는다.)
 */
const btnClass = 'p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors';
const iconClass = 'text-[var(--color-text-muted)]';

export function AppCatalogTopBarActions() {
  return (
    <>
      <Tooltip content="Cluster appearance" position="bottom">
        <button
          className={btnClass}
          onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
          aria-label="Cluster appearance"
        >
          <IconPencilCog size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Resource search" position="bottom">
        <button className={btnClass} aria-label="Resource search">
          <IconSearch size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
    </>
  );
}

export default AppCatalogTopBarActions;
