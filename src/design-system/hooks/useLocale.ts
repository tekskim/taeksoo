import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  changeLanguage,
  getCurrentLanguage,
  isRTL,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '../../i18n';

/**
 * Custom hook for i18n functionality in TDS components
 *
 * @example
 * ```tsx
 * const { t, language, setLanguage, isRTL } = useLocale();
 *
 * return (
 *   <div dir={isRTL ? 'rtl' : 'ltr'}>
 *     <Button onClick={() => setLanguage('en')}>
 *       {t('common.save')}
 *     </Button>
 *   </div>
 * );
 * ```
 */
export const useLocale = () => {
  const { t, i18n } = useTranslation('tds');

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    changeLanguage(lang);
  }, []);

  return {
    /** Translation function - use with keys like 'common.save' */
    t,
    /** Current language code */
    language: getCurrentLanguage(),
    /** Change the current language */
    setLanguage,
    /** Whether current language is RTL (Arabic) */
    isRTL: isRTL(),
    /** List of supported language codes */
    supportedLanguages: SUPPORTED_LANGUAGES,
    /** i18n instance for advanced usage */
    i18n,
  };
};

export type UseLocaleReturn = ReturnType<typeof useLocale>;
