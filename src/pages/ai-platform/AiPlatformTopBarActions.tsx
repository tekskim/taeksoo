import { IconSun, IconMoon } from '@tabler/icons-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export function AiPlatformTopBarActions() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer bg-transparent border-none text-[var(--color-text-muted)]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <IconSun size={16} stroke={1.5} /> : <IconMoon size={16} stroke={1.5} />}
    </button>
  );
}
