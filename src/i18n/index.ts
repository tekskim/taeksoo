import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import locales from '../../locales';

// Storage key for language preference
const STORAGE_KEY = 'tds_language';

// Supported languages
export const SUPPORTED_LANGUAGES = ['ko', 'en', 'ar-sa'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Get initial language from localStorage or default to 'ko'
const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
      return stored as SupportedLanguage;
    }
  }
  return 'ko';
};

// Build resources from locales
const resources = {
  ko: locales.ko,
  en: locales.en,
  'ar-sa': locales['ar-sa'],
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  ns: ['tds'],
  defaultNS: 'tds',
  nsSeparator: ':',
  keySeparator: '.',
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false,
  },
});

// Helper to change language and persist to localStorage
export const changeLanguage = (lang: SupportedLanguage) => {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
    // Dispatch custom event for cross-component communication
    window.dispatchEvent(new CustomEvent('locale-change', { detail: lang }));
  }
};

// Helper to get current language
export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.language as SupportedLanguage;
};

// Check if current language is RTL
export const isRTL = (): boolean => {
  return i18n.language === 'ar-sa';
};

export default i18n;
