import { useState, useEffect, useRef } from 'react';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Button } from '@/design-system';

type Theme = 'light' | 'dark' | 'system';

interface DarkModeToggleProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export function DarkModeToggle({
  showLabel = false,
  size = 'md',
  scrollContainerRef,
}: DarkModeToggleProps) {
  const { theme, setTheme } = useDarkMode();
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;
  const buttonSize = size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg';

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <IconSun size={iconSize} stroke={1.5} />, label: 'Light' },
    { value: 'dark', icon: <IconMoon size={iconSize} stroke={1.5} />, label: 'Dark' },
    { value: 'system', icon: <IconDeviceDesktop size={iconSize} stroke={1.5} />, label: 'System' },
  ];

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef?.current || window;
      const scrollTop = scrollContainerRef?.current?.scrollTop || window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    const container = scrollContainerRef?.current || window;
    container.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 확인

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef]);

  return (
    <>
      {/* 기본 위치의 토글 */}
      <div
        ref={containerRef}
        className="flex items-center gap-1 p-1 rounded-lg bg-[var(--color-surface-subtle)]"
      >
        {themes.map((t) => (
          <Button
            key={t.value}
            variant={theme === t.value ? 'secondary' : 'ghost'}
            size={buttonSize}
            icon={t.icon}
            onClick={() => setTheme(t.value)}
            aria-label={t.label}
            title={t.label}
            className={theme === t.value ? 'bg-[var(--color-surface-default)]' : ''}
          >
            {showLabel && <span className="text-sm font-medium">{t.label}</span>}
          </Button>
        ))}
      </div>

      {/* Floating 버튼 (스크롤 시 우측에 표시, TDS Design System 링크와 align, hover 시 강조) */}
      {isScrolled && (
        <div className="fixed right-6 top-4 z-50 group">
          <div className="flex flex-row items-center gap-1 p-1 rounded-lg bg-[var(--color-surface-default)] border border-[var(--color-border-default)] shadow-lg opacity-60 group-hover:opacity-100 group-hover:shadow-xl transition-all duration-300">
            {themes.map((t) => (
              <Button
                key={t.value}
                variant={theme === t.value ? 'secondary' : 'ghost'}
                size={buttonSize}
                icon={t.icon}
                onClick={() => setTheme(t.value)}
                aria-label={t.label}
                title={t.label}
                className={theme === t.value ? 'bg-[var(--color-surface-default)]' : ''}
              >
                {showLabel && <span className="text-sm font-medium">{t.label}</span>}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
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
