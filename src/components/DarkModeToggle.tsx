import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { useDarkMode } from '@/hooks/useDarkMode';

type Theme = 'light' | 'dark' | 'system';

interface DarkModeToggleProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DarkModeToggle({ showLabel = false, size = 'md' }: DarkModeToggleProps) {
  const { theme, setTheme, isDark } = useDarkMode();

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const buttonSize = size === 'sm' ? 'p-1.5' : size === 'md' ? 'p-2' : 'p-2.5';

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <IconSun size={iconSize} />, label: 'Light' },
    { value: 'dark', icon: <IconMoon size={iconSize} />, label: 'Dark' },
    { value: 'system', icon: <IconDeviceDesktop size={iconSize} />, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-subtle">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`
            ${buttonSize} rounded-md flex items-center gap-2 transition-all
            ${theme === t.value
              ? 'bg-surface-default text-text-default shadow-sm'
              : 'text-text-muted hover:text-text-default hover:bg-surface-muted'
            }
          `}
          title={t.label}
        >
          {t.icon}
          {showLabel && <span className="text-sm font-medium">{t.label}</span>}
        </button>
      ))}
    </div>
  );
}

// Simple toggle button version
export function DarkModeToggleButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { isDark, toggleDarkMode } = useDarkMode();

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const buttonSize = size === 'sm' ? 'p-1.5' : size === 'md' ? 'p-2' : 'p-2.5';

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        ${buttonSize} rounded-lg transition-all
        bg-surface-subtle hover:bg-surface-muted
        text-text-muted hover:text-text-default
        border border-border-default
      `}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <IconSun size={iconSize} /> : <IconMoon size={iconSize} />}
    </button>
  );
}


