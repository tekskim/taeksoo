import React, { createContext, useContext, useEffect, useState } from 'react';
// lodash 제거: 간단 유틸 대체
const includes = <T,>(arr: T[], value: T) => arr.includes(value);
const join = (arr: unknown[], sep: string) => arr.join(sep);
const indexOf = <T,>(arr: T[], value: T) => arr.indexOf(value);

export type Theme = string;

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  availableThemes?: Theme[];
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  availableThemes = ['default', 'dark', 'system'],
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || defaultTheme;

    const validTheme = includes(availableThemes, initialTheme)
      ? initialTheme
      : defaultTheme;

    setThemeState(validTheme);
    applyTheme(validTheme, mediaQuery.matches);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme('system', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [availableThemes, defaultTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(theme, mediaQuery.matches);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    if (!includes(availableThemes, newTheme)) {
      console.warn(
        `Theme "${newTheme}" is not available. Available themes: ${join(availableThemes, ', ')}`
      );
      return;
    }

    setThemeState(newTheme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(newTheme, mediaQuery.matches);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const currentIndex = indexOf(availableThemes, theme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    const nextTheme = availableThemes[nextIndex];
    setTheme(nextTheme);
  };

  const applyTheme = (theme: Theme, systemIsDark?: boolean) => {
    const root = document.documentElement;

    root.removeAttribute('data-theme');

    let actualTheme = theme;
    if (theme === 'system') {
      actualTheme = systemIsDark ? 'dark' : 'default';
    }

    if (actualTheme !== 'default') {
      root.setAttribute('data-theme', actualTheme);
    }
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
