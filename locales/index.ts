import arSa from './ar-sa.json';
import en from './en.json';
import ko from './ko.json';

const locales = {
  ko: { tds: ko.tds },
  en: { tds: en.tds },
  'ar-sa': { tds: arSa.tds },
};

export default locales;
