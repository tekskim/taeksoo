import { SupportedLanguage } from '../../i18n';
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
export declare const useLocale: () => {
    /** Translation function - use with keys like 'common.save' */
    t: import('i18next').TFunction<"tds", undefined>;
    /** Current language code */
    language: "ko" | "en" | "ar-sa";
    /** Change the current language */
    setLanguage: (lang: SupportedLanguage) => void;
    /** Whether current language is RTL (Arabic) */
    isRTL: boolean;
    /** List of supported language codes */
    supportedLanguages: readonly ["ko", "en", "ar-sa"];
    /** i18n instance for advanced usage */
    i18n: import('i18next').i18n;
};
export type UseLocaleReturn = ReturnType<typeof useLocale>;
