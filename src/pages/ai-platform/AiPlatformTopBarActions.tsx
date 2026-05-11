import { IconBell, IconSearch } from '@tabler/icons-react';
import { TopBarAction } from '@/design-system';

/**
 * Keeps the TopBar notification icon aligned when switching AI Platform routes:
 * two slots (search optional + bell) with a reserved spacer when search is hidden.
 */
export function AiPlatformTopBarActions({ showSearch = false }: { showSearch?: boolean }) {
  return (
    <>
      {showSearch ? (
        <TopBarAction icon={<IconSearch size={16} stroke={1.5} />} aria-label="Search" />
      ) : (
        <span className="inline-flex shrink-0 size-[var(--topbar-button-size)]" aria-hidden />
      )}
      <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
    </>
  );
}
