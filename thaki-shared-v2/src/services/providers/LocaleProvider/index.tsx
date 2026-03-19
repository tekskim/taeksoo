import { useEffect, useRef } from 'react';

const LOCALE_STORAGE_KEY = 'thaki_suite_language';

const LocaleProvider = ({
  children,
  changeLocale,
}: {
  children: React.ReactNode;
  changeLocale: (locale: string) => void;
}) => {
  // Ensures localStorage is read only once, even if changeLocale changes
  const hasInitialized = useRef(false);

  // Read initial language from localStorage on mount (guaranteed once via ref)
  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

    if (storedLocale) {
      changeLocale(storedLocale);
    }

    hasInitialized.current = true;
  }, [changeLocale]);

  // Listen for locale change events
  useEffect(() => {
    const handleLocaleChange = ((event: CustomEvent<string>) =>
      changeLocale(event.detail)) as EventListener;

    window.addEventListener('locale-change', handleLocaleChange);

    return () => {
      window.removeEventListener('locale-change', handleLocaleChange);
    };
  }, [changeLocale]);

  return <>{children}</>;
};

export { LocaleProvider };
