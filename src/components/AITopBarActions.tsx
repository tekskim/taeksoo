import { IconBell, IconSun, IconMoon } from '@tabler/icons-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export function AITopBarActions() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <>
      <button
        type="button"
        className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
        aria-label="Notifications"
      >
        <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
      </button>
      <button
        type="button"
        className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
        onClick={toggleDarkMode}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <IconSun size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
        ) : (
          <IconMoon size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
        )}
      </button>
    </>
  );
}
